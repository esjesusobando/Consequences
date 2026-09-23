// ============================================================
// T-18 (Q-3): Pressures engine regression suite
// Locks F1 hydrostatic gradient + mud window + overbalance
// ============================================================

import { describe, expect, it } from "vitest";
import { calculatePressures } from "./pressures";
import { API_HYDROSTATIC_GRADIENT } from "./physics";
import type {
  FormationData,
  MudData,
  WellData,
} from "../store/drilling-types";

const WELL: WellData = {
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
};

const FORMATION: FormationData = {
  porePressureGradient: 0.465,
  fractureGradient: 0.8,
  normalGradient: 0.465,
};

function makeMud(mudWeight: number): MudData {
  return {
    mudWeight,
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
  };
}

describe("pressures engine", () => {
  it("F1: hydrostatic gradient constant is 0.052 psi/ft per ppg", () => {
    expect(API_HYDROSTATIC_GRADIENT).toBe(0.052);
  });

  it("F1: hydrostatic pressure = 0.052 * MW * TVD", () => {
    const res = calculatePressures(WELL, FORMATION, makeMud(12));
    expect(res.hydrostaticPressure).toBeCloseTo(0.052 * 12 * 10000, 4);
    expect(res.hydrostaticPressure).toBeCloseTo(6240, 2);
    expect(res.mudGradient).toBeCloseTo(0.052 * 12, 4);
  });

  it("Triangulation: hydrostatic scales linearly with TVD", () => {
    const shallow = calculatePressures(
      { ...WELL, tvd: 5000 },
      FORMATION,
      makeMud(12),
    );
    expect(shallow.hydrostaticPressure).toBeCloseTo(0.052 * 12 * 5000, 4);
  });

  it("Mud-window bounds: min = pore/0.052, max = frac/0.052, window = max-min", () => {
    const res = calculatePressures(WELL, FORMATION, makeMud(12));
    expect(res.minMudWeight).toBeCloseTo(0.465 / 0.052, 4);
    expect(res.maxMudWeight).toBeCloseTo(0.8 / 0.052, 4);
    expect(res.mudWindow).toBeCloseTo(res.maxMudWeight - res.minMudWeight, 6);
    expect(res.mudWindow).toBeGreaterThan(0);
  });

  it("Overbalance is positive when MW exceeds pore gradient", () => {
    const res = calculatePressures(WELL, FORMATION, makeMud(12));
    const porePressure = 0.465 * 10000;
    expect(res.porePressure).toBeCloseTo(porePressure, 4);
    expect(res.overbalance).toBeCloseTo(6240 - porePressure, 4);
    expect(res.overbalance).toBeGreaterThan(0);
    expect(res.overbalancePPG).toBeCloseTo(
      res.overbalance / (0.052 * 10000),
      4,
    );
  });

  it("Overbalance sign flips negative when MW drops below pore gradient", () => {
    const res = calculatePressures(WELL, FORMATION, makeMud(8));
    expect(res.overbalance).toBeLessThan(0);
  });
});
