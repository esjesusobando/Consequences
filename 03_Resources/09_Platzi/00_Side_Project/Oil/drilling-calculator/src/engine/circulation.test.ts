// ============================================================
// T-19 (Q-3): Circulation engine regression suite
// Locks time = volume / flow + lag strokes monotonicity
// ============================================================

import { describe, expect, it } from "vitest";
import { calculateCirculation } from "./circulation";
import type {
  PumpResult,
  VolumetricsResult,
} from "../store/drilling-types";

function makeVol(
  overrides: Partial<VolumetricsResult> = {},
): VolumetricsResult {
  return {
    holeCapacity: 0,
    drillPipeCapacity: 0,
    hwdpCapacity: 0,
    dcCapacity: 0,
    annularDP: 0,
    annularHWDP: 0,
    annularDC: 0,
    displacementDP: 0,
    displacementHWDP: 0,
    displacementDC: 0,
    volumeInsideDP: 0,
    volumeInsideHWDP: 0,
    volumeInsideDC: 0,
    totalInsideVolume: 200,
    volumeAnnularDP: 0,
    volumeAnnularHWDP: 0,
    volumeAnnularDC: 0,
    totalAnnularVolume: 800,
    totalSystemVolume: 1000,
    openHoleVolume: 0,
    surfaceToBitTime: 0,
    bottomsUpTime: 0,
    totalCirculationTime: 0,
    ...overrides,
  };
}

const PUMP: PumpResult = {
  outputPerStroke: 0.1,
  flowRateGPM: 420,
  flowRateBBLmin: 10,
  hydraulicHP: 0,
};

describe("circulation engine", () => {
  it("Times equal volume / flow: surfaceToBit, bitToSurface, full = sum", () => {
    const res = calculateCirculation(makeVol(), PUMP);
    expect(res.surfaceToBit).toBeCloseTo(200 / 10, 6);
    expect(res.bitToSurface).toBeCloseTo(800 / 10, 6);
    expect(res.fullCirculation).toBeCloseTo(20 + 80, 6);
    expect(res.bottomsUp).toBeCloseTo(res.bitToSurface, 6);
  });

  it("Lag strokes = annular volume / output per stroke", () => {
    const res = calculateCirculation(makeVol(), PUMP);
    expect(res.lagStrokes).toBeCloseTo(800 / 0.1, 6);
  });

  it("Lag strokes grow monotonically with annular volume", () => {
    const small = calculateCirculation(
      makeVol({ totalAnnularVolume: 400 }),
      PUMP,
    );
    const large = calculateCirculation(
      makeVol({ totalAnnularVolume: 1200 }),
      PUMP,
    );
    expect(large.lagStrokes).toBeGreaterThan(small.lagStrokes);
    expect(small.lagStrokes).toBeCloseTo(400 / 0.1, 6);
  });

  it("Triangulation: doubling flow halves every time", () => {
    const slow = calculateCirculation(
      makeVol(),
      { ...PUMP, flowRateBBLmin: 10 },
    );
    const fast = calculateCirculation(
      makeVol(),
      { ...PUMP, flowRateBBLmin: 20 },
    );
    expect(fast.surfaceToBit).toBeCloseTo(slow.surfaceToBit / 2, 6);
    expect(fast.bitToSurface).toBeCloseTo(slow.bitToSurface / 2, 6);
  });

  it("Zero-flow guard: no circulation, no NaN", () => {
    const res = calculateCirculation(makeVol(), { ...PUMP, flowRateBBLmin: 0 });
    expect(res.surfaceToBit).toBe(0);
    expect(res.bitToSurface).toBe(0);
    expect(res.fullCirculation).toBe(0);
    expect(res.bottomsUp).toBe(0);
    expect(res.lagStrokes).toBe(0);
    expect(Number.isFinite(res.lagTime)).toBe(true);
  });
});
