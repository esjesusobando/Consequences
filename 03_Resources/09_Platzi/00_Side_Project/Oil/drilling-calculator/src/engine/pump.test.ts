// ============================================================
// T-17 (Q-3): Pump engine regression suite
// Locks F9 output/stroke geometry + GPM + HHP (IADC)
// ============================================================

import { describe, expect, it } from "vitest";
import { calculatePump, gpmToSpm } from "./pump";
import type { PumpData } from "../store/drilling-types";

function makePump(overrides: Partial<PumpData> = {}): PumpData {
  return {
    pumpType: "Triplex",
    linerDiameter: 6,
    strokeLength: 12,
    rodDiameter: 2,
    strokesPerMinute: 100,
    efficiency: 90,
    numberOfPumps: 2,
    standpipePressure: 3000,
    ...overrides,
  };
}

describe("pump engine", () => {
  it("F9: triplex output per stroke = 0.000243 * liner^2 * stroke * efficiency", () => {
    const res = calculatePump(makePump());
    const expected = 0.000243 * 36 * 12 * 0.9;
    expect(res.outputPerStroke).toBeCloseTo(expected, 6);
  });

  it("F9: duplex output accounts for rod geometry = 0.000162 * (2*liner^2 - rod^2) * stroke", () => {
    const res = calculatePump(makePump({ pumpType: "Duplex" }));
    const expected = 0.000162 * (2 * 36 - 4) * 12 * 0.9;
    expect(res.outputPerStroke).toBeCloseTo(expected, 6);
  });

  it("F9: GPM = strokes * outputPerStroke * pumps * 42 (bbl -> gal)", () => {
    const res = calculatePump(makePump());
    const expected = 100 * 0.000243 * 36 * 12 * 0.9 * 2 * 42;
    expect(res.flowRateGPM).toBeCloseTo(expected, 4);
    expect(res.flowRateBBLmin).toBeCloseTo(res.flowRateGPM / 42, 6);
  });

  it("F9: HHP = P * Q / 1714", () => {
    const res = calculatePump(makePump());
    const expected = (3000 * res.flowRateGPM) / 1714;
    expect(res.hydraulicHP).toBeCloseTo(expected, 4);
  });

  it("Triangulation: single pump halves flow rate", () => {
    const two = calculatePump(makePump());
    const one = calculatePump(makePump({ numberOfPumps: 1 }));
    expect(one.flowRateGPM).toBeCloseTo(two.flowRateGPM / 2, 4);
  });

  it("Triangulation: 100% efficiency removes the loss factor", () => {
    const res = calculatePump(makePump({ efficiency: 100 }));
    expect(res.outputPerStroke).toBeCloseTo(0.000243 * 36 * 12, 6);
  });

  it("Round-trip: gpmToSpm(85 SPM default ≈ 791.7 GPM) recovers 85 SPM", () => {
    const pump = makePump({ linerDiameter: 6.5, strokesPerMinute: 85 });
    const { flowRateGPM } = calculatePump(pump);
    expect(flowRateGPM).toBeCloseTo(791.7, 1);
    expect(gpmToSpm(flowRateGPM, pump)).toBeCloseTo(85, 4);
  });

  it("gpmToSpm: zero/negative/non-finite gpm falls back to pump SPM (no NaN)", () => {
    const pump = makePump({ numberOfPumps: 2, strokesPerMinute: 85 });
    expect(gpmToSpm(0, pump)).toBe(85);
    expect(gpmToSpm(-100, pump)).toBe(85);
    expect(gpmToSpm(NaN, pump)).toBe(85);
    expect(gpmToSpm(Infinity, pump)).toBe(85);
  });

  it("gpmToSpm: numberOfPumps = 0 falls back to pump SPM (no NaN)", () => {
    const pump = makePump({ numberOfPumps: 0, strokesPerMinute: 85 });
    const spm = gpmToSpm(500, pump);
    expect(spm).toBe(85);
    expect(Number.isFinite(spm)).toBe(true);
  });
});
