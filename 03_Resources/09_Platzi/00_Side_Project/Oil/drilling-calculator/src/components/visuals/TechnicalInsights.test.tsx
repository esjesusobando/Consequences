/**
 * Regression lock for the TechnicalInsights hooks refactor (T-08).
 *
 * The chart derivation previously lived inline inside a `useMemo` (with a
 * mutable `let mDLS` accumulator flagged by react-hooks/immutability and an
 * unstable `|| []` dependency flagged by exhaustive-deps). The logic was
 * extracted into `buildTrajectoryChart` — this suite proves the extracted
 * behavior is byte-identical to the original:
 *   - DLS per 100 ft between survey points
 *   - maxDLS computed from UNROUNDED DLS (chart values stay rounded to 2dp)
 *   - axial pickup merged from the torque/drag profile within 50 ft
 *   - neutralMD passthrough / null fallback
 *   - empty trajectory and zero course-length guards
 */

import { describe, it, expect } from "vitest";
import type { TrajectoryPoint } from "../../store/drilling-types";
import { buildTrajectoryChart } from "../../utils/buildTrajectoryChart";

const point = (
  md: number,
  inc: number,
  azi: number = 0,
  tvd?: number,
): TrajectoryPoint => ({
  md,
  inc,
  azi,
  tvd: tvd ?? md,
  north: 0,
  east: 0,
  dls: 0,
  cl: 100,
});

describe("buildTrajectoryChart (TechnicalInsights data derivation)", () => {
  it("computes DLS per 100 ft between survey points", () => {
    const trajectory = [point(0, 0), point(100, 1), point(200, 3)];
    const { chartData } = buildTrajectoryChart(trajectory, undefined, undefined);

    expect(chartData[0].dls).toBe(0);
    expect(chartData[1].dls).toBe(1); // sqrt(1^2) / 100 * 100
    expect(chartData[2].dls).toBe(2); // sqrt(2^2) / 100 * 100
  });

  it("maxDLS uses the unrounded DLS; chart dls values are rounded to 2 decimals", () => {
    const trajectory = [point(0, 0), point(100, 1.004), point(200, 2.01)];
    const { chartData, maxDLS } = buildTrajectoryChart(
      trajectory,
      undefined,
      undefined,
    );

    // raw dls: [0, 1.004, 1.006]
    expect(chartData.map((d) => d.dls)).toEqual([0, 1, 1.01]);
    // NOT 1.01 — a refactor that maxes the rounded values would regress this
    expect(maxDLS).toBeCloseTo(1.006, 5);
  });

  it("merges axial pickup from the torque/drag profile within 50 ft", () => {
    const trajectory = [point(0, 0), point(100, 1), point(300, 3)];
    const profile = [
      { md: 95, pickup: 250000, slackoff: 100000, torque: 12000 },
    ];
    const { chartData } = buildTrajectoryChart(trajectory, profile, undefined);

    expect(chartData[1].pickup).toBe(250); // klbs (250000 / 1000)
    expect(chartData[0].pickup).toBe(0); // |95 - 0| >= 50
    expect(chartData[2].pickup).toBe(0); // |95 - 300| >= 50
  });

  it("exposes neutralMD when provided and null otherwise", () => {
    expect(buildTrajectoryChart([], undefined, undefined).neutralMD).toBeNull();
    expect(buildTrajectoryChart([], undefined, null).neutralMD).toBeNull();
    expect(buildTrajectoryChart([], undefined, 4321).neutralMD).toBe(4321);
  });

  it("handles empty trajectory and zero course length without errors", () => {
    const empty = buildTrajectoryChart([], undefined, undefined);
    expect(empty.chartData).toEqual([]);
    expect(empty.maxDLS).toBe(0);
    expect(empty.neutralMD).toBeNull();

    const zeroCl = buildTrajectoryChart(
      [point(0, 0), point(0, 5)], // same md => no course length
      undefined,
      undefined,
    );
    expect(zeroCl.chartData[1].dls).toBe(0);
    expect(zeroCl.maxDLS).toBe(0);
  });
});
