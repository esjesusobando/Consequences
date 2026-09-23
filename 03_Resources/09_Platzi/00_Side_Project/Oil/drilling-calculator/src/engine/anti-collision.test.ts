// ============================================================
// T-AC1: Anti-Collision engine (Phase I core math)
// Locks ISCWSA covariance + eigen + SF + min distance
// ============================================================

import { describe, expect, it } from "vitest";
import type { TrajectoryPoint } from "../store/drilling-types";
import {
  analyzeCollision,
  closestTrajectoryPoints,
  eigenSym3,
  stationCovariance,
} from "./anti-collision";

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

describe("stationCovariance (ISCWSA MWD)", () => {
  it("Vertical well at depth: TVD uncertainty dominates, horizontal spread from inc error", () => {
    const cov = stationCovariance(5000, 0, 0, "MWD");
    const [NN, , , , EE, , , , TT] = cov;
    // depth error 0.001 * 5000 = 5 ft -> TT = 25 ft^2
    expect(TT).toBeCloseTo(25, 4);
    // at inc=0 the single-station model degenerates (azimuth undefined):
    // NN carries the inclination error (sI^2*L^2), EE = 0 via sin^2(I)
    expect(NN).toBeCloseTo((0.0145 * Math.PI / 180) ** 2 * 5000 ** 2, 1);
    expect(EE).toBeCloseTo(0, 6);
  });

  it("Matrix is symmetric", () => {
    const cov = stationCovariance(8000, 45, 90, "MWD");
    expect(cov[1]).toBeCloseTo(cov[3], 10); // NE == EN
    expect(cov[2]).toBeCloseTo(cov[6], 10); // NT == TN
    expect(cov[5]).toBeCloseTo(cov[7], 10); // ET == TE
  });

  it("Inclined non-axis-aligned well: cross-terms match explicit J diag(s) J^T", () => {
    // Independent derivation: build the 3x3 Jacobian of
    // p = (L sinI cosA, L sinI sinA, L cosI) and compute C = J diag J^T by
    // explicit matrix multiplication (NOT the implementation's closed form),
    // so a self-consistent wrong derivation can't pass.
    const cov = stationCovariance(5000, 45, 45, "MWD");
    const I = Math.PI / 4;
    const A = Math.PI / 4;
    const L = 5000;
    const sD2 = (0.001 * L) ** 2;
    const sI2 = (0.0145 * Math.PI / 180) ** 2;
    const sA2 = ((0.3 + 0.0075 / Math.sin(I)) * Math.PI / 180) ** 2;
    const diag = [sD2, sI2, sA2];

    // J rows = partials of (N, E, T) w.r.t. (L, I, A)
    const J = [
      [Math.sin(I) * Math.cos(A), L * Math.cos(I) * Math.cos(A), -L * Math.sin(I) * Math.sin(A)],
      [Math.sin(I) * Math.sin(A), L * Math.cos(I) * Math.sin(A), L * Math.sin(I) * Math.cos(A)],
      [Math.cos(I), -L * Math.sin(I), 0],
    ];

    // C = J * diag * J^T, then flatten row-major [NN, NE, NT, EN, EE, ET, TN, TE, TT]
    const C: number[][] = J.map((row) => J.map((col) =>
      row.reduce((sum, v, k) => sum + v * diag[k] * col[k], 0),
    ));
    const expected = [C[0][0], C[0][1], C[0][2], C[1][0], C[1][1], C[1][2], C[2][0], C[2][1], C[2][2]];

    expected.forEach((v, idx) => expect(cov[idx]).toBeCloseTo(v, 4));

    // Cross-term MUST be nonzero: the old (buggy) implementation that
    // cancelled them would fail this — it was the regression vector.
    expect(cov[1]).not.toBeCloseTo(0, 2);
    expect(cov[2]).not.toBeCloseTo(0, 2);
    expect(cov[5]).not.toBeCloseTo(0, 2);
  });
});

describe("eigenSym3", () => {
  it("Diagonal matrix keeps its eigenvalues", () => {
    const { values } = eigenSym3([4, 0, 0, 0, 2, 0, 0, 0, 1]);
    expect(values[0]).toBeCloseTo(4, 6);
    expect(values[1]).toBeCloseTo(2, 6);
    expect(values[2]).toBeCloseTo(1, 6);
  });

  it("Off-diagonal 2x2 block yields correct eigenvalues", () => {
    // [[4,1,0],[1,2,0],[0,0,1]] -> eigenvalues 3±sqrt(2) and 1
    const { values } = eigenSym3([4, 1, 0, 1, 2, 0, 0, 0, 1]);
    const sorted = [...values].sort((a, b) => b - a);
    expect(sorted[0]).toBeCloseTo(4.414213, 4);
    expect(sorted[1]).toBeCloseTo(1.585786, 4);
    expect(sorted[2]).toBeCloseTo(1, 4);
  });
});

describe("closestTrajectoryPoints", () => {
  it("Two vertical wells 50 ft apart report 50 ft min distance", () => {
    const a = [pt(0, 0, 0, 0, 0, 0), pt(1000, 0, 0, 0, 0, 1000)];
    const b = [pt(0, 0, 0, 50, 0, 0), pt(1000, 0, 0, 50, 0, 1000)];
    const r = closestTrajectoryPoints(a, b);
    expect(r.dist).toBeCloseTo(50, 6);
  });

  it("Empty trajectory throws instead of crashing", () => {
    expect(() => closestTrajectoryPoints([], [pt(0, 0, 0, 0, 0, 0)])).toThrow();
    expect(() => closestTrajectoryPoints([pt(0, 0, 0, 0, 0, 0)], [])).toThrow();
  });
});

describe("analyzeCollision", () => {
  it("Crossing wells => distance 0, SF 0, CRITICAL", () => {
    const a = [pt(0, 0, 0, 0, 0, 0), pt(2500, 0, 0, 0, 0, 2500)];
    const b = [pt(0, 0, 0, 0, 0, 0), pt(2500, 0, 0, 0, 0, 2500)];
    const r = analyzeCollision(a, b);
    expect(r.minDistance).toBeCloseTo(0, 6);
    expect(r.sf).toBeCloseTo(0, 6);
    expect(r.riskLevel).toBe("CRITICAL");
  });

  it("Wells 2000 ft apart at depth => SAFE (SF >= 4.0)", () => {
    // Stations start at md=1000 so the closest pair carries real covariance
    // (md=0 would give an all-zero matrix and a vacuous Infinity SF).
    const a = [pt(1000, 0, 0, 0, 0, 1000), pt(3000, 0, 0, 0, 0, 3000)];
    const b = [pt(1000, 0, 0, 2000, 0, 1000), pt(3000, 0, 0, 2000, 0, 3000)];
    const r = analyzeCollision(a, b);
    expect(r.minDistance).toBeCloseTo(2000, 0);
    expect(r.sf).toBeGreaterThanOrEqual(4.0);
    expect(Number.isFinite(r.sf)).toBe(true);
    expect(r.riskLevel).toBe("SAFE");
  });

  it("sfK and ellipseK are independent knobs (SPE-WPTS k=3.5 lowers SF)", () => {
    const a = [pt(1000, 0, 0, 0, 0, 1000), pt(3000, 0, 0, 0, 0, 3000)];
    const b = [pt(1000, 0, 0, 200, 0, 1000), pt(3000, 0, 0, 200, 0, 3000)];
    const base = analyzeCollision(a, b);
    const hse = analyzeCollision(a, b, { sfK: 3.5 });
    // HSE policy lowers SF for the same geometry
    expect(hse.sf).toBeLessThan(base.sf);
  });

  it("SF uses ISCWSA R-type projected sigma (not Mahalanobis)", () => {
    // Inclined wells (inc=45, azi=45 -> full cross-coupled covariance),
    // offset diagonally so the center-to-center direction is NOT an
    // eigen-axis. For such u, sqrt(u^T C u) < sqrt(s^T C^-1 s), so the
    // R-type projected result differs from the Mahalanobis one — this
    // assertion locks the definition.
    const a = [
      pt(0, 45, 45, 0, 0, 0),
      pt(1000, 45, 45, 500, 500, 707),
    ];
    const b = [
      pt(0, 45, 45, 200, 300, 0),
      pt(1000, 45, 45, 600, 450, 707),
    ];
    const r = analyzeCollision(a, b, { sfK: 2 });
    const cA = stationCovariance(
      a[r.stationA].md, a[r.stationA].inc, a[r.stationA].azi, "MWD",
    );
    const cB = stationCovariance(
      b[r.stationB].md, b[r.stationB].inc, b[r.stationB].azi, "MWD",
    );
    const cTot = cA.map((v, i) => v + cB[i]);
    const s = [
      r.closestA.north - r.closestB.north,
      r.closestA.east - r.closestB.east,
      r.closestA.tvd - r.closestB.tvd,
    ];
    const d0 = Math.hypot(s[0], s[1], s[2]);
    const u = [s[0] / d0, s[1] / d0, s[2] / d0];
    // sigma_s^2 = u^T (C_A + C_B) u
    const cu = [
      cTot[0] * u[0] + cTot[1] * u[1] + cTot[2] * u[2],
      cTot[3] * u[0] + cTot[4] * u[1] + cTot[5] * u[2],
      cTot[6] * u[0] + cTot[7] * u[1] + cTot[8] * u[2],
    ];
    const sigmaS = Math.sqrt(
      Math.max(0, u[0] * cu[0] + u[1] * cu[1] + u[2] * cu[2]),
    );
    expect(r.sepSigma).toBeCloseTo(sigmaS, 6);
    expect(r.sf).toBeCloseTo(d0 / (2 * sigmaS), 6);
  });

  it("95% 3D ellipsoid scales with sqrt(chi2(3,0.95)) = 2.795, not the SF k", () => {
    // primary vertical; adjacent converges and crosses it at total depth
    const a = [pt(0, 0, 0, 0, 0, 0), pt(3000, 0, 0, 0, 0, 3000)];
    const b = [
      pt(0, 0, 0, 500, 0, 0),
      pt(1500, 5, 180, 250, 0, 1500),
      pt(3009, 4.8, 180, 0, 0, 3000),
    ];
    const r = analyzeCollision(a, b);
    expect(r.stationA).toBe(1);
    expect(r.stationB).toBe(2);
    // primary closest station is vertical at MD=3000: eig_max = TT = (0.001*3000)^2 = 9
    const defaultAxes = analyzeCollision(a, b, { sfK: 1 }).ellipseA.axes;
    const tightAxes = analyzeCollision(a, b, { sfK: 1, ellipseK: 1 }).ellipseA.axes;
    expect(r.minDistance).toBeCloseTo(0, 4);
    expect(tightAxes[0]).toBeCloseTo(3, 2); // 1 * sqrt(9)
    expect(defaultAxes[0]).toBeCloseTo(3 * Math.sqrt(7.815), 2);
  });

  it("Produces finite 95% ellipsoids at the closest stations", () => {
    const a = [pt(0, 0, 0, 0, 0, 0), pt(3000, 0, 0, 0, 0, 3000)];
    const b = [pt(0, 0, 0, 200, 0, 0), pt(3000, 0, 0, 200, 0, 3000)];
    const r = analyzeCollision(a, b);
    expect(r.ellipseA.axes.every((x) => Number.isFinite(x) && x >= 0)).toBe(
      true,
    );
    expect(r.ellipseB.axes.every((x) => Number.isFinite(x) && x >= 0)).toBe(
      true,
    );
    // axes sorted largest -> smallest
    expect(r.ellipseA.axes[0]).toBeGreaterThanOrEqual(r.ellipseA.axes[1]);
    expect(r.ellipseA.axes[1]).toBeGreaterThanOrEqual(r.ellipseA.axes[2]);
  });
});
