// ============================================================
// T-20 (Q-3): Hydraulics engine regression suite
// Locks F6 (velocities), F7 (regimes + ECD), F9 (bit HHP/IF)
// ============================================================

import { describe, expect, it } from "vitest";
import { calculateHydraulics } from "./hydraulics";
import type { WellData, MudData, PumpResult, RheologyResult } from "../store/drilling-types";

function makeWell(overrides: Partial<WellData> = {}): WellData {
  return {
    totalDepth: 10000,
    tvd: 10000,
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
    rheologyModel: "BINGHAM",
    ...overrides,
  };
}

function makePump(overrides: Partial<PumpResult> = {}): PumpResult {
  return {
    outputPerStroke: 0.0945,
    flowRateGPM: 400,
    flowRateBBLmin: 9.52,
    hydraulicHP: 0,
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

describe("hydraulics engine", () => {
  it("F6: annular velocity = 24.51*Q/(holeSize^2 - drillPipeOD^2)", () => {
    const res = calculateHydraulics(makeWell(), makeMud(), makePump(), makeRheo());
    // 24.51 * 400 / (12.25^2 - 5^2) = 9804 / 125.0625 = 78.39 ft/min
    expect(res.annularVelocity).toBeCloseTo(78.39, 1);
  });

  it("F6: pipe velocity = 24.51*Q/drillPipeID^2", () => {
    const res = calculateHydraulics(makeWell(), makeMud(), makePump(), makeRheo());
    // 24.51 * 400 / 4^2 = 612.75 ft/min
    expect(res.pipeVelocity).toBeCloseTo(612.75, 1);
  });

  it("F6: velocities scale linearly with flow rate (Q=800 -> 2x)", () => {
    const res = calculateHydraulics(makeWell(), makeMud(), makePump({ flowRateGPM: 800 }), makeRheo());
    expect(res.annularVelocity).toBeCloseTo(78.39 * 2, 1);
    expect(res.pipeVelocity).toBeCloseTo(612.75 * 2, 1);
  });

  it("F9: bit nozzle hydraulics - total flow area, nozzle velocity, bit HHP, impact force", () => {
    const res = calculateHydraulics(makeWell(), makeMud(), makePump(), makeRheo());
    // TFA = 3 * (pi/4) * (13/32)^2 = 0.38886 in^2
    expect(res.totalFlowArea).toBeCloseTo(0.3889, 3);
    // nozzle velocity = Q * 0.3208 / TFA = 128.32 / 0.38886 = 329.99 ft/s
    expect(res.nozzleVelocity).toBeCloseTo(330.0, 0);
    // dP_bit = MW*Q^2 / (10858 * TFA^2) = 1680000 / 1641.9 = 1023.3 psi
    // (10858 already includes Cd = 0.95)
    expect(res.pressureLossBit).toBeCloseTo(1023, 0);
    // HHP = dP_bit * Q / 1714 = 409,320 / 1714 = 238.8
    expect(res.bitHHP).toBeCloseTo(238.8, 0);
    // IF = MW * Q * Vn / 1930 = 10.5 * 400 * 330 / 1930 = 718.1 lbf
    expect(res.impactForce).toBeCloseTo(718.1, 0);
  });

  it("F7: total pressure loss is the sum of all components", () => {
    const res = calculateHydraulics(makeWell(), makeMud(), makePump(), makeRheo());
    const sum =
      res.pressureLossDP +
      res.pressureLossHWDP +
      res.pressureLossDC +
      res.pressureLossBit +
      res.pressureLossAnnular;
    expect(res.totalPressureLoss).toBeCloseTo(sum, 2);
    expect(res.totalPressureLoss).toBeGreaterThan(0);
  });

  it("F7: ECD >= MW (annular loss always adds hydrostatic)", () => {
    const res = calculateHydraulics(makeWell(), makeMud(), makePump(), makeRheo());
    expect(res.ecd).toBeGreaterThanOrEqual(10.5);
    expect(res.ecd).toBeGreaterThan(10.5); // positive annular loss -> strict
  });

  it("F7: low flow + high PV/YP gives laminar regimes (Re < 2100)", () => {
    const res = calculateHydraulics(
      makeWell(),
      makeMud({ mudWeight: 10.5 }),
      makePump({ flowRateGPM: 100 }),
      makeRheo({ pv: 50, yp: 50 }),
    );
    expect(res.flowRegimeDP).toBe("Laminar");
    expect(res.flowRegimeAnnular).toBe("Laminar");
  });

  it("F7: high flow + low PV/YP gives turbulent regimes (Re > 4000)", () => {
    const res = calculateHydraulics(
      makeWell(),
      makeMud({ mudWeight: 15 }),
      makePump({ flowRateGPM: 800 }),
      makeRheo({ pv: 5, yp: 5 }),
    );
    expect(res.flowRegimeDP).toBe("Turbulent");
    expect(res.flowRegimeAnnular).toBe("Turbulent");
  });

  it("F7: Bingham mu_eff uses 511 s^-1 conversion, not 300 rpm (YP term regression)", () => {
    // Q=400, drillPipeID=4 -> v_pipe = 612.75 ft/min -> γ = 1.6*612.75/4 = 245.1 s⁻¹
    // μ_eff = PV + (511 * YP) / γ = 15 + 5110/245.1 = 35.85 cP
    // Re = 928 * 10.5 * (612.75/60) * 4 / μ_eff = 398,042.4 / 35.85 = 11,103
    // The old buggy form (300 * YP / γ) gave μ_eff = 27.24 -> Re = 14,613,
    // inflating Re by ~32% and risking a false turbulent classification.
    const res = calculateHydraulics(makeWell(), makeMud(), makePump(), makeRheo());
    expect(res.reynoldsDP).toBeCloseTo(11103, 0);
  });

  it("F7: Bingham annular mu_eff also uses the 511 conversion", () => {
    // Annular section A: de = 12.25 - 5 = 7.25 in, v = 24.51*400/125.0625 = 78.39 ft/min
    // γ = 1.44*78.39/7.25 = 15.57 s⁻¹ -> μ_eff = 15 + 5110/15.57 = 343.2 cP
    // Re = 928 * 10.5 * (78.39/60) * 7.25 / 343.2 = 92,296 / 343.2 = 268.9
    const res = calculateHydraulics(makeWell(), makeMud(), makePump(), makeRheo());
    expect(res.reynoldsAnnular).toBeCloseTo(269, 0);
  });

  it("Guard: Q=0 returns zeroed result with ecd = MW (no NaN)", () => {
    const res = calculateHydraulics(makeWell(), makeMud(), makePump({ flowRateGPM: 0 }), makeRheo());
    expect(res.annularVelocity).toBe(0);
    expect(res.pipeVelocity).toBe(0);
    expect(res.pressureLossBit).toBe(0);
    expect(res.totalPressureLoss).toBe(0);
    expect(res.ecd).toBe(10.5);
    expect(res.flowRegimeDP).toBe("Laminar");
    expect(res.flowRegimeAnnular).toBe("Laminar");
    expect(Number.isFinite(res.annularVelocity)).toBe(true);
    expect(Number.isFinite(res.ecd)).toBe(true);
  });
});
