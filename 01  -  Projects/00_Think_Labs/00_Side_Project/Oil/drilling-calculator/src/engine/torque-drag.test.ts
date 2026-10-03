// ============================================================
// T-23 (Q-3): Torque & Drag engine regression suite
// Locks F11 (soft-string hook loads) + neutral point + guards
// ============================================================

import { describe, expect, it } from "vitest";
import { calculateTorqueDrag } from "./torque-drag";
import type { WellData, TrajectoryPoint } from "../store/drilling-types";

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

function verticalTrajectory(stations: number[]): TrajectoryPoint[] {
  return stations.map((md) => ({
    md,
    inc: 0,
    azi: 0,
    tvd: md,
    north: 0,
    east: 0,
    dls: 0,
    cl: md === 0 ? 0 : 1000,
  }));
}

describe("torque & drag engine", () => {
  it("Guard: empty trajectory returns zeroed result (no crash, no NaN)", () => {
    const res = calculateTorqueDrag(makeWell(), [], 10.5, {});
    expect(res.pickupHookLoad).toBe(0);
    expect(res.slackoffHookLoad).toBe(0);
    expect(res.rotatingTorque).toBe(0);
    expect(res.profile).toEqual([]);
    expect(res.neutralPoint).toBe(0);
    expect(Number.isFinite(res.pickupHookLoad)).toBe(true);
  });

  it("F11: vertical well - pickup = string weight in mud, slackoff = weight - WOB, no drag", () => {
    const trajectory = verticalTrajectory([0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000]);
    const res = calculateTorqueDrag(makeWell(), trajectory, 10.5, { weightOnBit: 20 });
    // Soft-string segments are keyed by the DEEPER station md:
    // 10000->dc, 9000->hwdp, 8000..1000->dp (11 stations = 10 x 1000 ft segments)
    const bf = 1 - 10.5 / 65.5;
    const dpW = (5 ** 2 - 4 ** 2) * 2.67 * bf;
    const hwdpW = (5 ** 2 - 3 ** 2) * 2.67 * bf;
    const dcW = (8 ** 2 - 3 ** 2) * 2.67 * bf;
    const stringWeight = 1000 * dcW + 1000 * hwdpW + 8000 * dpW;
    // pickup starts at zero tension; slackoff carries the WOB penalty
    expect(res.pickupHookLoad).toBeCloseTo(stringWeight, 0);
    expect(res.slackoffHookLoad).toBeCloseTo(stringWeight - 20 * 1000, 0);
    // zero inclination -> normal force = 0 -> no drag, no torque
    expect(res.rotatingTorque).toBe(0);
    expect(res.pickupHookLoad).toBeGreaterThan(0);
  });

  it("F11: hook loads respect the tensile limit", () => {
    const trajectory = verticalTrajectory([0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000]);
    const res = calculateTorqueDrag(makeWell(), trajectory, 10.5, {
      weightOnBit: 20,
      tensileLimit: 600, // klbs
      torqueLimit: 40,
      minSafetyFactor: 2,
    });
    expect(res.pickupHookLoad).toBeLessThanOrEqual(600 * 1000);
    expect(res.tensileLimit).toBe(600);
    expect(res.torqueLimit).toBe(40);
    expect(res.minSafetyFactor).toBe(2);
  });

  it("F11: neutral point sits where slackoff tension crosses zero in the DC section", () => {
    const trajectory = verticalTrajectory([0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000]);
    const res = calculateTorqueDrag(makeWell(), trajectory, 10.5, { weightOnBit: 20 });
    // crossing in bottom DC segment: 10000 - ratio*1000 = 9837.8 ft
    expect(res.neutralPoint).toBeCloseTo(9837.8, 1);
    expect(res.neutralPoint).toBeGreaterThan(9000);
    expect(res.neutralPoint).toBeLessThanOrEqual(10000);
  });

  it("F11: profile is surface-first and spans the string", () => {
    const trajectory = verticalTrajectory([0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000]);
    const res = calculateTorqueDrag(makeWell(), trajectory, 10.5, {});
    expect(res.profile.length).toBe(3); // md 9000, 4000, 0 -> reversed
    expect(res.profile[0].md).toBe(0);
    expect(res.profile[1].md).toBe(4000);
    expect(res.profile[2].md).toBe(9000);
    for (let i = 1; i < res.profile.length; i++) {
      expect(res.profile[i].md).toBeGreaterThan(res.profile[i - 1].md);
    }
  });

  it("F11: deviated well - drag adds to pickup, subtracts from slackoff, torque > 0", () => {
    const trajectory: TrajectoryPoint[] = [
      { md: 0, inc: 0, azi: 0, tvd: 0, north: 0, east: 0, dls: 0, cl: 0 },
      { md: 1000, inc: 90, azi: 0, tvd: 636.62, north: 636.62, east: 0, dls: 9, cl: 1000 },
      { md: 2000, inc: 90, azi: 0, tvd: 1273.24, north: 1273.24, east: 0, dls: 0, cl: 1000 },
    ];
    const res = calculateTorqueDrag(makeWell(), trajectory, 10.5, {});
    // both segments are inside the DP range (md <= 8000) -> dp weight applies
    const bf = 1 - 10.5 / 65.5;
    const dpW = (5 ** 2 - 4 ** 2) * 2.67 * bf;
    let pickup = 0;
    let slackoff = 0;
    for (const incDeg of [90, 45]) {
      const inc = (incDeg * Math.PI) / 180;
      const axial = dpW * 1000 * Math.cos(inc);
      const drag = dpW * 1000 * Math.sin(inc) * 0.25;
      pickup += axial + drag;
      slackoff += axial - drag;
    }
    expect(res.pickupHookLoad).toBeCloseTo(pickup, 0);
    expect(res.slackoffHookLoad).toBeCloseTo(slackoff, 0);
    expect(res.pickupHookLoad).toBeGreaterThan(res.slackoffHookLoad);
    expect(res.rotatingTorque).toBeGreaterThan(0);
    // horizontal section compresses the string below the build; tension crosses
    // zero inside the build segment -> neutral point = interpolated crossing depth
    const slackoffAfterHorizontal = dpW * 1000 * (Math.cos(Math.PI / 2) - 0.25 * Math.sin(Math.PI / 2));
    const slackoffGainInBuild = dpW * 1000 * (Math.cos(Math.PI / 4) - 0.25 * Math.sin(Math.PI / 4));
    const crossingFraction = -slackoffAfterHorizontal / slackoffGainInBuild;
    expect(res.neutralPoint).toBeCloseTo(1000 - crossingFraction * 1000, 0);
  });
});
