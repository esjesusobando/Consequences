// ============================================================
// T-SC1: scene.ts pure helpers
// Locks common-frame mapping (AC3D-1), stable wellId colors (AC3D-5),
// and visible-well bounds (AC3D-6). No React / three imports.
// ============================================================

import { describe, expect, it } from "vitest";
import type { TrajectoryPoint } from "../store/drilling-types";
import {
  PRIMARY_WELL_ID,
  SCENE_COLORS,
  commonFramePoint,
  visibleBounds,
  wellColor,
} from "./scene";

function pt(east: number, north: number, tvd: number): TrajectoryPoint {
  return { md: tvd, inc: 0, azi: 0, north, east, tvd, dls: 0, cl: tvd };
}

describe("commonFramePoint (AC3D-1)", () => {
  it("maps a point into the common NE-TVD frame anchored at the primary wellhead", () => {
    const f = commonFramePoint(pt(500, 300, 2000), 100, 50);
    expect(f.east).toBeCloseTo(400, 6);
    expect(f.north).toBeCloseTo(250, 6);
    expect(f.tvd).toBeCloseTo(-2000, 6);
  });

  it("places the primary wellhead at the origin", () => {
    const f = commonFramePoint(pt(100, 50, 0), 100, 50);
    expect(f.east).toBeCloseTo(0, 6);
    expect(f.north).toBeCloseTo(0, 6);
    expect(f.tvd).toBeCloseTo(0, 6);
  });

  it("inverts tvd and keeps negative relative offsets exact", () => {
    const f = commonFramePoint(pt(500, 500, 350), 1000, 1000);
    expect(f.east).toBeCloseTo(-500, 6);
    expect(f.north).toBeCloseTo(-500, 6);
    expect(f.tvd).toBeCloseTo(-350, 6);
  });

  it("does not mutate its input point", () => {
    const p = pt(500, 300, 2000);
    commonFramePoint(p, 100, 50);
    expect(p.east).toBe(500);
    expect(p.north).toBe(300);
    expect(p.tvd).toBe(2000);
  });
});

describe("wellColor (AC3D-5)", () => {
  it("keeps the same color for a wellId across list re-sorts", () => {
    const before = wellColor("w2", ["w1", "w2", "w3"]);
    const after = wellColor("w2", ["w3", "w2", "w1"]);
    expect(after).toBe(before);
  });

  it("assigns distinct colors to distinct wells present in the list", () => {
    const ids = ["w1", "w2", "w3"];
    const colors = ids.map((id) => wellColor(id, ids));
    expect(new Set(colors).size).toBe(3);
  });

  it("returns a palette color for an unknown wellId, deterministically", () => {
    const color = wellColor("never-seen", ["w1"]);
    expect(SCENE_COLORS).toContain(color);
    expect(wellColor("never-seen", ["w1"])).toBe(color);
  });

  it("deduplicates repeated wellIds in the list", () => {
    const a = wellColor("dup", ["dup", "dup", "dup"]);
    const b = wellColor("dup", ["dup"]);
    expect(a).toBe(b);
    expect(SCENE_COLORS).toContain(a);
  });

  it("reserves SCENE_COLORS[0] for PRIMARY_WELL_ID when it is in the list", () => {
    const ids = [PRIMARY_WELL_ID, "w1", "w2", "w3"];
    expect(wellColor(PRIMARY_WELL_ID, ids)).toBe(SCENE_COLORS[0]);
  });

  it("keeps every entry distinct from the primary and from each other", () => {
    const ids = [PRIMARY_WELL_ID, "offset-crossing", "offset-north-300", "deep-vertical"];
    const colors = ids.map((id) => wellColor(id, ids));
    expect(new Set(colors).size).toBe(4);
  });
});

describe("visibleBounds (AC3D-6)", () => {
  const primarySurface = { east: 100, north: 50 };
  // Primary: absolute points at the primary wellhead, vertical to 1000 ft TVD.
  const primary = [pt(100, 50, 0), pt(100, 50, 1000)];
  // Entry A: own wellhead offset (300 N / 300 E) baked into absolute points.
  const entryA = {
    trajectory: [pt(400, 350, 0), pt(400, 350, 800)],
    visible: true,
    wellId: "a",
    source: { wellheadEast: 300, wellheadNorth: 300 },
  };
  // Entry B: hidden by its own visible flag.
  const entryB = {
    trajectory: [pt(900, 950, 0), pt(900, 950, 600)],
    visible: false,
    wellId: "b",
    source: { wellheadEast: 800, wellheadNorth: 900 },
  };
  // Entry C: hidden via hiddenWells.
  const entryC = {
    trajectory: [pt(1100, 1150, 0), pt(1100, 1150, 500)],
    visible: true,
    wellId: "c",
    source: { wellheadEast: 1000, wellheadNorth: 1100 },
  };

  it("frames the primary plus every visible entry in the common frame", () => {
    const b = visibleBounds([entryA, entryB, entryC], primary, primarySurface, new Set());
    // common-frame north: primary 0..0, entryA 300, entryC 1100 -> bounds 0..1100
    expect(b.center.north).toBeCloseTo(550, 6);
    expect(b.extent.north).toBeCloseTo(1100, 6);
    // east: primary 0, entryA 300, entryC 1000 -> bounds 0..1000
    expect(b.center.east).toBeCloseTo(500, 6);
    expect(b.extent.east).toBeCloseTo(1000, 6);
    // tvd: scene tvd from 0 (surface) to -1000 (primary bottom) -> extent 1000, center -500
    expect(b.extent.tvd).toBeCloseTo(1000, 6);
    expect(b.center.tvd).toBeCloseTo(-500, 6);
  });

  it("excludes entries flagged not visible", () => {
    const b = visibleBounds([entryA, entryB], primary, primarySurface, new Set());
    expect(b.extent.north).toBeCloseTo(300, 6);
    expect(b.extent.east).toBeCloseTo(300, 6);
  });

  it("excludes wells present in hiddenWells", () => {
    const b = visibleBounds([entryA, entryC], primary, primarySurface, new Set(["c"]));
    expect(b.extent.north).toBeCloseTo(300, 6);
    expect(b.extent.east).toBeCloseTo(300, 6);
  });

  it("anchors all trajectories through the primary wellhead frame (D1)", () => {
    // entryA absolute north 350 -> common-frame north 350 - 50 = 300
    const b = visibleBounds([entryA], primary, primarySurface, new Set());
    expect(b.center.north).toBeCloseTo(150, 6);
    expect(b.extent.north).toBeCloseTo(300, 6);
    // primary wellhead maps to 0: east mid of 0..300
    expect(b.center.east).toBeCloseTo(150, 6);
  });

  it("returns zero bounds when no trajectory contributes a point", () => {
    const b = visibleBounds([], [], primarySurface, new Set(["x"]));
    expect(b.center).toEqual({ north: 0, east: 0, tvd: 0 });
    expect(b.extent).toEqual({ north: 0, east: 0, tvd: 0 });
  });
});
