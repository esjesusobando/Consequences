// ============================================================
// T-25 (Q-3): Cuttings transport engine regression suite
// Locks F13 (Moore slip + clamp) + F14 (CCI) + F15 (concentration)
// ============================================================

import { describe, expect, it } from "vitest";
import { calculateCuttingsTransport } from "./cuttings-transport";
import { calculateHydraulics } from "./hydraulics";
import type {
  WellData,
  MudData,
  RheologyResult,
  PumpResult,
  HydraulicsResult,
} from "../store/drilling-types";

function makeWell(overrides: Partial<WellData> = {}): WellData {
  return {
    totalDepth: 10000,
    tvd: 9500,
    holeSize: 12.25,
    drillPipeOD: 5,
    drillPipeID: 4,
    drillPipeLength: 8000,
    hwdpOD: 5,
    hwdpID: 3,
    hwdpLength: 1500,
    dcOD: 8,
    dcID: 3,
    dcLength: 500,
    bitSize: 12.25,
    bitNozzles: [13, 13, 13],
    ...overrides,
  };
}

function makeMud(overrides: Partial<MudData> = {}): MudData {
  return {
    mudWeight: 10.5,
    theta600: 40,
    theta300: 25,
    theta200: 20,
    theta100: 15,
    theta6: 6,
    theta3: 4,
    plasticViscosity: 15,
    yieldPoint: 10,
    gel10sec: 8,
    gel10min: 12,
    rheologyModel: "POWER_LAW",
    ...overrides,
  };
}

function makeRheo(overrides: Partial<RheologyResult> = {}): RheologyResult {
  return {
    pv: 15,
    yp: 10,
    av: 20,
    pvYpRatio: 1.5,
    n_pl: 0.678,
    k_pl: 0.7,
    n_hb: 0.999,
    k_hb: 0.5,
    tau0_hb: 2,
    mu_eff: 20.87,
    gel10s: 8,
    gel10m: 12,
    gelProgression: 1.5,
    ...overrides,
  };
}

function makePump(overrides: Partial<PumpResult> = {}): PumpResult {
  return {
    outputPerStroke: 0.137,
    flowRateGPM: 400,
    flowRateBBLmin: 9.52,
    hydraulicHP: 1200,
    ...overrides,
  };
}

function makeHydraulics(annularVelocity: number): HydraulicsResult {
  // derive a full, type-complete result from the real engine; only AV is consumed
  return {
    ...calculateHydraulics(makeWell(), makeMud(), makePump(), makeRheo()),
    annularVelocity,
  };
}

describe("cuttings transport engine", () => {
  it("F13: Moore slip formula - PV=1, MW=10.5 gives ~19.97 ft/min (above clamp)", () => {
    const res = calculateCuttingsTransport(
      makeWell(),
      makeMud(),
      makeRheo({ pv: 1 }),
      makeHydraulics(60),
    );
    // (1/(10.5*0.25)) * (sqrt(1 + 0.012*10.5*10.5) - 1) * 100
    expect(res.slipVelocity).toBeCloseTo(19.97, 1);
  });

  it("F13: slip is clamped to a minimum of 5 ft/min when the formula drops below", () => {
    const res = calculateCuttingsTransport(
      makeWell(),
      makeMud(),
      makeRheo({ pv: 15 }),
      makeHydraulics(60),
    );
    expect(res.slipVelocity).toBe(5);
  });

  it("F13: slip >= 5 always when circulating with valid PV", () => {
    for (const pv of [5, 15, 40]) {
      const res = calculateCuttingsTransport(
        makeWell(),
        makeMud(),
        makeRheo({ pv }),
        makeHydraulics(60),
      );
      expect(res.slipVelocity).toBeGreaterThanOrEqual(5);
    }
  });

  it("F13: NO clamp when annular velocity is zero - slip stays 0", () => {
    const res = calculateCuttingsTransport(
      makeWell(),
      makeMud(),
      makeRheo({ pv: 15 }),
      makeHydraulics(0),
    );
    expect(res.slipVelocity).toBe(0);
  });

  it("F13: NO clamp when plastic viscosity is zero - slip stays 0", () => {
    const res = calculateCuttingsTransport(
      makeWell(),
      makeMud(),
      makeRheo({ pv: 0 }),
      makeHydraulics(60),
    );
    expect(res.slipVelocity).toBe(0);
  });

  it("F14: CCI = K * 478.8 * AV * MW / 400000 scales linearly with AV", () => {
    const res1 = calculateCuttingsTransport(
      makeWell(),
      makeMud(),
      makeRheo({ k_pl: 0.7 }),
      makeHydraulics(60),
    );
    const res2 = calculateCuttingsTransport(
      makeWell(),
      makeMud(),
      makeRheo({ k_pl: 0.7 }),
      makeHydraulics(120),
    );
    expect(res1.cuttingCarryingIndex).toBeCloseTo(
      (0.7 * 478.8 * 60 * 10.5) / 400000,
      6,
    );
    expect(res2.cuttingCarryingIndex).toBeCloseTo(2 * res1.cuttingCarryingIndex, 6);
  });

  it("F14: CCI = 0 when annular velocity = 0 (no false carry signal)", () => {
    const res = calculateCuttingsTransport(
      makeWell(),
      makeMud(),
      makeRheo({ k_pl: 0.7 }),
      makeHydraulics(0),
    );
    expect(res.cuttingCarryingIndex).toBeCloseTo(0, 6);
  });

  it("F15: cuttings concentration is positive and bounded (< 100%) for valid flow", () => {
    const res = calculateCuttingsTransport(
      makeWell(),
      makeMud(),
      makeRheo({ pv: 15 }),
      makeHydraulics(60),
    );
    // (60*holeSize^2) / (60*AV*(holeSize^2 - dpOD^2)) * 100
    expect(res.cuttingsConcentration).toBeCloseTo(
      (60 * 12.25 ** 2) / (60 * 60 * (12.25 ** 2 - 5 ** 2)) * 100,
      2,
    );
    expect(res.cuttingsConcentration).toBeGreaterThan(0);
    expect(res.cuttingsConcentration).toBeLessThan(100);
  });

  it("F15: hole cleaning efficiency never exceeds 100%", () => {
    // K=10000 -> CCI = (10000·478.8·60·10.5)/400000 = 7539 > 1 -> HCE = transportRatio (91.67), capped at 100
    const res = calculateCuttingsTransport(
      makeWell(),
      makeMud(),
      makeRheo({ k_pl: 10000 }),
      makeHydraulics(60),
    );
    expect(res.holeCleaningEfficiency).toBeLessThanOrEqual(100);
    expect(res.holeCleaningEfficiency).toBeCloseTo(91.67, 1);
    expect(res.transportRatio).toBeCloseTo(91.67, 1);
  });
});
