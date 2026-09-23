// ============================================================
// T-UE1: Uncertainty engine — pure math tests
// Locks ellipsoid computation, LOD, forward cone, risk levels
// ============================================================

import { describe, expect, it } from "vitest";
import type { TrajectoryPoint } from "../store/drilling-types";
import {
  computeUncertaintyProfile,
  computeStationLod,
  getLodLevel,
  computeForwardCone,
  riskLevelColor,
} from "./uncertainty-engine";

function pt(
  md: number,
  inc: number,
  azi: number,
  north: number,
  east: number,
  tvd: number,
): TrajectoryPoint {
  return { md, inc, azi, north, east, tvd, dls: 0, cl: md };
}

// --- getLodLevel boundaries ---

describe("getLodLevel", () => {
  it("Returns 0 for 1-8 stations", () => {
    expect(getLodLevel(1)).toBe(0);
    expect(getLodLevel(8)).toBe(0);
  });

  it("Returns 1 for 9-26 stations", () => {
    expect(getLodLevel(9)).toBe(1);
    expect(getLodLevel(26)).toBe(1);
  });

  it("Returns 2 for 27+ stations", () => {
    expect(getLodLevel(27)).toBe(2);
    expect(getLodLevel(100)).toBe(2);
  });
});

// --- computeStationLod boundaries ---

describe("computeStationLod", () => {
  it("First station gets max LOD (2)", () => {
    expect(computeStationLod(0, 10)).toBe(2);
  });

  it("Last station gets min LOD (0)", () => {
    expect(computeStationLod(9, 10)).toBe(0);
  });

  it("Midpoint station gets LOD 1", () => {
    expect(computeStationLod(5, 10)).toBe(1);
  });

  it("Single station returns LOD 2", () => {
    expect(computeStationLod(0, 1)).toBe(2);
  });
});

// --- computeForwardCone ---

describe("computeForwardCone", () => {
  it("Returns all zeros for <2 stations", () => {
    const result = computeForwardCone([pt(1000, 10, 45, 0, 0, 1000)], {
      k: 1.0,
      maxRadius: 50,
      slices: 5,
    });
    expect(result).toEqual([0, 0, 0, 0, 0]);
  });

  it("Returns monotonically increasing radii for 2+ stations", () => {
    const trajectory = [
      pt(1000, 10, 45, 0, 0, 1000),
      pt(2000, 15, 50, 100, 50, 1950),
      pt(3000, 20, 55, 250, 120, 2800),
    ];
    const result = computeForwardCone(trajectory, {
      k: 1.0,
      maxRadius: 100,
      slices: 5,
    });
    expect(result.length).toBe(5);
    // First slice is 0, rest should be >= 0
    expect(result[0]).toBe(0);
    for (let i = 1; i < result.length; i++) {
      expect(result[i]).toBeGreaterThanOrEqual(result[i - 1]);
    }
  });

  it("Radii capped at maxRadius", () => {
    const trajectory = [
      pt(1000, 10, 45, 0, 0, 1000),
      pt(5000, 30, 90, 500, 300, 4000),
    ];
    const result = computeForwardCone(trajectory, {
      k: 10.0,
      maxRadius: 25,
      slices: 10,
    });
    for (const r of result) {
      expect(r).toBeLessThanOrEqual(25);
    }
  });
});

// --- riskLevelColor ---

describe("riskLevelColor", () => {
  it("Returns correct colors for each level", () => {
    expect(riskLevelColor("CRITICAL")).toBe("#ef4444");
    expect(riskLevelColor("CAUTION")).toBe("#f43f5e");
    expect(riskLevelColor("MONITOR")).toBe("#f59e0b");
    expect(riskLevelColor("SAFE")).toBe("#22c55e");
  });

  it("Returns default color for undefined", () => {
    expect(riskLevelColor(undefined)).toBe("#00b4d8");
  });
});

// --- computeUncertaintyProfile ---

describe("computeUncertaintyProfile", () => {
  const tool = "MWD";

  it("Returns one station per trajectory point", () => {
    const trajectory = [
      pt(1000, 10, 45, 0, 0, 1000),
      pt(2000, 15, 50, 100, 50, 1950),
      pt(3000, 20, 55, 250, 120, 2800),
    ];
    const result = computeUncertaintyProfile(trajectory, { tool });
    expect(result.length).toBe(3);
  });

  it("Axes are non-negative", () => {
    const trajectory = [
      pt(1000, 10, 45, 0, 0, 1000),
      pt(2000, 15, 50, 100, 50, 1950),
    ];
    const result = computeUncertaintyProfile(trajectory, { tool });
    for (const station of result) {
      expect(station.axes[0]).toBeGreaterThanOrEqual(0);
      expect(station.axes[1]).toBeGreaterThanOrEqual(0);
      expect(station.axes[2]).toBeGreaterThanOrEqual(0);
    }
  });

  it("No riskLevel when no adjacent trajectory", () => {
    const trajectory = [
      pt(1000, 10, 45, 0, 0, 1000),
      pt(2000, 15, 50, 100, 50, 1950),
    ];
    const result = computeUncertaintyProfile(trajectory, { tool });
    for (const station of result) {
      expect(station.riskLevel).toBeUndefined();
    }
  });

  it("Empty adjacent trajectory does not crash", () => {
    const trajectory = [
      pt(1000, 10, 45, 0, 0, 1000),
      pt(2000, 15, 50, 100, 50, 1950),
    ];
    const result = computeUncertaintyProfile(trajectory, {
      tool,
      adjacentTrajectory: [],
    });
    expect(result.length).toBe(2);
    // riskLevel should be undefined for empty adjacent
    for (const station of result) {
      expect(station.riskLevel).toBeUndefined();
    }
  });

  it("Risk level assigned when adjacent trajectory provided", () => {
    const primary = [
      pt(1000, 10, 45, 0, 0, 1000),
      pt(2000, 15, 50, 100, 50, 1950),
    ];
    const adjacent = [
      pt(1000, 12, 48, 50, 25, 980),
      pt(2000, 18, 52, 140, 70, 1920),
    ];
    const result = computeUncertaintyProfile(primary, {
      tool,
      adjacentTrajectory: adjacent,
    });
    for (const station of result) {
      expect(station.riskLevel).toBeDefined();
      expect(["SAFE", "MONITOR", "CAUTION", "CRITICAL"]).toContain(
        station.riskLevel,
      );
    }
  });

  it("DLS is 0 for first and last station", () => {
    const trajectory = [
      pt(1000, 10, 45, 0, 0, 1000),
      pt(2000, 15, 50, 100, 50, 1950),
      pt(3000, 20, 55, 250, 120, 2800),
    ];
    const result = computeUncertaintyProfile(trajectory, { tool });
    expect(result[0].dls).toBe(0);
    expect(result[2].dls).toBe(0);
  });
});
