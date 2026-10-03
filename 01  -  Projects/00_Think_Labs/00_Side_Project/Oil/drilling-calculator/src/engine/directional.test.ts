// ============================================================
// T-22 (Q-3): Directional engine regression suite (MCM)
// Locks F10 (vertical/kick-off MCM closure) + DLS + azimuth
// ============================================================

import { describe, expect, it } from "vitest";
import { calculateTrajectory } from "./directional";
import type { SurveyRecord } from "../store/drilling-types";

describe("directional engine (MCM)", () => {
  it("Empty survey list returns empty result without crashing", () => {
    const res = calculateTrajectory([]);
    expect(res.surveys).toEqual([]);
    expect(res.trajectory).toEqual([]);
    expect(res.totalClosure).toBe(0);
    expect(res.closureAzimuth).toBe(0);
  });

  it("F10: vertical well - tvd follows md, no lateral displacement", () => {
    const records: SurveyRecord[] = [
      { md: 0, inc: 0, azi: 0 },
      { md: 1000, inc: 0, azi: 0 },
      { md: 2000, inc: 0, azi: 0 },
    ];
    const res = calculateTrajectory(records);
    expect(res.trajectory[0].tvd).toBe(0);
    expect(res.trajectory[0].dls).toBe(0);
    expect(res.trajectory[0].cl).toBe(0);
    expect(res.trajectory[2].tvd).toBeCloseTo(2000, 3);
    expect(res.trajectory[2].north).toBeCloseTo(0, 3);
    expect(res.trajectory[2].east).toBeCloseTo(0, 3);
    expect(res.totalClosure).toBeCloseTo(0, 3);
    expect(res.closureAzimuth).toBe(0);
  });

  it("F10: 90 deg kick-off over 1000 ft gives 636.62 ft closure per MCM", () => {
    const records: SurveyRecord[] = [
      { md: 0, inc: 0, azi: 0 },
      { md: 1000, inc: 90, azi: 0 },
    ];
    const res = calculateTrajectory(records);
    const last = res.trajectory[1];
    // MCM: beta = 90deg, rf = 2*tan(beta/2)/beta = 1.27324, factor = 500*1.27324
    expect(last.tvd).toBeCloseTo(636.62, 2);
    expect(last.north).toBeCloseTo(636.62, 2);
    expect(last.east).toBeCloseTo(0, 3);
    expect(last.dls).toBeCloseTo(9.0, 3); // (90/1000)*100 = 9 deg/100ft
    expect(last.cl).toBe(1000);
    expect(res.totalClosure).toBeCloseTo(636.62, 2);
    expect(res.closureAzimuth).toBe(0);
  });

  it("F10: kick-off to East (azi 90) - closure azimuth = 90", () => {
    const records: SurveyRecord[] = [
      { md: 0, inc: 0, azi: 0 },
      { md: 1000, inc: 90, azi: 90 },
    ];
    const res = calculateTrajectory(records);
    expect(res.trajectory[1].north).toBeCloseTo(0, 2);
    expect(res.trajectory[1].east).toBeCloseTo(636.62, 2);
    expect(res.closureAzimuth).toBe(90);
  });

  it("F10: kick-off to West (azi 270) - closure azimuth normalized to 270", () => {
    const records: SurveyRecord[] = [
      { md: 0, inc: 0, azi: 0 },
      { md: 1000, inc: 90, azi: 270 },
    ];
    const res = calculateTrajectory(records);
    expect(res.trajectory[1].east).toBeCloseTo(-636.62, 2);
    expect(res.closureAzimuth).toBe(270);
  });

  it("MCM closure position: surface offsets anchor the trajectory origin", () => {
    const records: SurveyRecord[] = [
      { md: 0, inc: 0, azi: 0 },
      { md: 1000, inc: 0, azi: 0 },
    ];
    const res = calculateTrajectory(records, 100, 50);
    expect(res.trajectory[0].north).toBe(100);
    expect(res.trajectory[0].east).toBe(50);
    expect(res.trajectory[1].north).toBeCloseTo(100, 3);
    expect(res.trajectory[1].east).toBeCloseTo(50, 3);
    // closure is measured from surface -> zero for vertical
    expect(res.totalClosure).toBeCloseTo(0, 3);
  });

  it("Closure = sqrt(dNorth^2 + dEast^2) of the last station", () => {
    const records: SurveyRecord[] = [
      { md: 0, inc: 0, azi: 0 },
      { md: 1000, inc: 90, azi: 90 },
      { md: 2000, inc: 90, azi: 90 },
    ];
    const res = calculateTrajectory(records);
    const last = res.trajectory[2];
    const expected = Math.sqrt(last.north ** 2 + last.east ** 2);
    expect(res.totalClosure).toBeCloseTo(expected, 3);
  });
});
