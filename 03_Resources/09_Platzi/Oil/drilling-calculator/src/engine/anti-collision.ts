// ============================================================
// Drilling Calculator — Anti-Collision Engine (Phase I: Core Math)
// ISCWSA-style station covariance + 3x3 eigen + Separation Factor + min distance
// ============================================================

import type {
  SurveyRecord,
  TrajectoryPoint,
  CollisionResult,
  Vec3,
  Ellipsoid3D,
  SurveyTool,
} from "../store/drilling-types";
import { calculateTrajectory } from "./directional";

export const toRad = (deg: number) => (deg * Math.PI) / 180;

// ─── Model provenance / SOTA ─────────────────────────────────────
// This Phase I engine implements the ISCWSA closed-form station covariance
// (Burgoyne / Williamson) and the ISCWSA R-type Separation Factor
// (SF = D0 / (k * sigma_s), "Current Common Practice in Collision Avoidance",
// ISCWSA Collision Avoidance Work Group, Oct 2017). Key SOTA facts honored:
//   - SF definition: ratio of center-to-center distance to combined relative
//     uncertainty at the chosen confidence (k). k default 2.0 (95% 1D) matches
//     the common "2-sigma ellipse + limit 1.5" pairing; SPE-WPTS recommends
//     k = 3.5 for HSE-risk wells (SPE-187037-PA). Both are supported via opts.
//   - Risk bands follow the ISCWSA Separation Rules: report SF < 4.0,
//     adjust plans < 1.5, never plan < 1.0.
//   - 95% 3D uncertainty ellipsoid axes = sqrt(chi2(3, 0.95)) * sigma
//     = 2.795 * sigma (NOT the 1D 2.0). Ellipse scaling is independent of the
//     SF multiplier.
// NOT yet modeled (documented Phase III upgrade): the full ISCWSA error model
// with 80+ error sources (weighting functions + propagation modes) that
// ACCUMULATES along the wellpath, plus the cross-well correlation of global
// errors (e.g. DEC declination) when combining covariance matrices
// (r12 = 0 assumed here — the standard independent assumption).
// ─────────────────────────────────────────────────────────────────

// ISCWSA error-model coefficients (tunable). Units: depth → ft/ft, inc/azi → degrees.
// azi = azi0 + azi1 / sin(inc) models the azimuth blow-up near vertical.
const ISCWSA_ERRORS: Record<
  SurveyTool,
  { depth: number; inc: number; azi0: number; azi1: number }
> = {
  MWD: { depth: 0.001, inc: 0.0145, azi0: 0.3, azi1: 0.0075 },
  GYRO: { depth: 0.0005, inc: 0.01, azi0: 0.1, azi1: 0.002 },
  SENSOR: { depth: 0.001, inc: 0.0145, azi0: 0.3, azi1: 0.0075 },
};

// Separation Factor confidence multiplier (k). 2.0 = "2-sigma + limit 1.5"
// common pairing. SPE-WPTS HSE-risk recommendation: 3.5 (SPE-187037-PA).
export const DEFAULT_SF_K = 2.0;
// 95% 3D confidence: sqrt(chi2(3, 0.95)) = sqrt(7.815) = 2.795.
export const DEFAULT_ELLIPSE_K = Math.sqrt(7.815);

/**
 * Per-station position covariance matrix (N,E,T) via ISCWSA closed-form
 * propagation (Burgoyne / Williamson). Returns a symmetric 3x3 in row-major
 * order: [NN, NE, NT, EN, EE, ET, TN, TE, TT].
 */
export function stationCovariance(
  md: number,
  incDeg: number,
  aziDeg: number,
  tool: SurveyTool = "MWD",
): number[] {
  const e = ISCWSA_ERRORS[tool];
  const I = toRad(incDeg);
  const A = toRad(aziDeg);
  const sD = e.depth * md; // ft
  const sI = toRad(e.inc); // rad
  const sA = toRad(e.azi0 + e.azi1 / Math.max(Math.sin(I), 0.01)); // rad

  const sD2 = sD * sD;
  const sI2 = sI * sI;
  const sA2 = sA * sA;
  const sinI = Math.sin(I);
  const cosI = Math.cos(I);
  const sinA = Math.sin(A);
  const cosA = Math.cos(A);
  const L = md;
  const L2 = L * L;

  const NN =
    sD2 * sinI * sinI * cosA * cosA +
    sI2 * L2 * cosI * cosI * cosA * cosA +
    sA2 * L2 * sinI * sinI * sinA * sinA;
  const EE =
    sD2 * sinI * sinI * sinA * sinA +
    sI2 * L2 * cosI * cosI * sinA * sinA +
    sA2 * L2 * sinI * sinI * cosA * cosA;
  const TT = sD2 * cosI * cosI + sI2 * L2 * sinI * sinI;
  // C = J * diag(sD^2, sI^2, sA^2) * J^T with position partials:
  //   N = L sinI cosA, E = L sinI sinA, T = L cosI
  //   dN/dL = sinI cosA, dN/dI = L cosI cosA, dN/dA = -L sinI sinA
  //   dE/dL = sinI sinA, dE/dI = L cosI sinA, dE/dA =  L sinI cosA
  //   dT/dL = cosI,      dT/dI = -L sinI,      dT/dA = 0
  const NE =
    sinA * cosA *
    (sD2 * sinI * sinI + sI2 * L2 * cosI * cosI - sA2 * L2 * sinI * sinI);
  const NT = (sD2 - sI2 * L2) * sinI * cosI * cosA;
  const ET = (sD2 - sI2 * L2) * sinI * cosI * sinA;

  return [NN, NE, NT, NE, EE, ET, NT, ET, TT];
}

/**
 * Eigen-decomposition of a symmetric 3x3 matrix (Jacobi rotations, cyclic).
 * Returns eigenvalues sorted descending and the matching eigenvectors as
 * column-major 3x3 in `vectors` (row-major storage).
 */
export function eigenSym3(m: number[]): { values: number[]; vectors: number[] } {
  const a = m.slice();
  const v = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  const pairs: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 2],
  ];

  for (let iter = 0; iter < 100; iter++) {
    const off = Math.abs(a[1]) + Math.abs(a[2]) + Math.abs(a[5]);
    if (off < 1e-12) break;

    for (const [p, q] of pairs) {
      const apq = a[p * 3 + q];
      if (Math.abs(apq) < 1e-15) continue;
      const app = a[p * 3 + p];
      const aqq = a[q * 3 + q];
      const phi = 0.5 * Math.atan2(2 * apq, aqq - app);
      const c = Math.cos(phi);
      const s = Math.sin(phi);

      a[p * 3 + p] = c * c * app + s * s * aqq - 2 * s * c * apq;
      a[q * 3 + q] = s * s * app + c * c * aqq + 2 * s * c * apq;
      a[p * 3 + q] = 0;
      a[q * 3 + p] = 0;

      const r = 3 - p - q; // the third index
      const arp = a[p * 3 + r];
      const arq = a[q * 3 + r];
      a[p * 3 + r] = c * arp - s * arq;
      a[r * 3 + p] = a[p * 3 + r];
      a[q * 3 + r] = s * arp + c * arq;
      a[r * 3 + q] = a[q * 3 + r];

      for (let k = 0; k < 3; k++) {
        const vkp = v[k * 3 + p];
        const vkq = v[k * 3 + q];
        v[k * 3 + p] = c * vkp - s * vkq;
        v[k * 3 + q] = s * vkp + c * vkq;
      }
    }
  }

  const values = [a[0], a[4], a[8]];
  const idx = [0, 1, 2].sort((i, j) => values[j] - values[i]);
  const vs = idx.map((i) => values[i]);
  const vecs = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  idx.forEach((i, col) => {
    vecs[0 * 3 + col] = v[0 * 3 + i];
    vecs[1 * 3 + col] = v[1 * 3 + i];
    vecs[2 * 3 + col] = v[2 * 3 + i];
  });
  return { values: vs, vectors: vecs };
}

function toVec(p: TrajectoryPoint): Vec3 {
  // Guard: ensure valid coordinates; default to origin if any value is invalid
  const validN = Number.isFinite(p.north) ? p.north : 0;
  const validE = Number.isFinite(p.east) ? p.east : 0;
  const validT = Number.isFinite(p.tvd) ? p.tvd : 0;
  return { north: validN, east: validE, tvd: validT };
}

/**
 * Closest-approach (center-to-center) between two sampled trajectories.
 * Station-sampled Euclidean minimum — sufficient for Phase I; segment-level
 * refinement is a Phase II/III improvement.
 */
export function closestTrajectoryPoints(
  a: TrajectoryPoint[],
  b: TrajectoryPoint[],
): { dist: number; i: number; j: number; pa: Vec3; pb: Vec3 } {
  if (a.length === 0 || b.length === 0) {
    throw new Error("closestTrajectoryPoints: empty trajectory");
  }
  let best = Infinity;
  let bi = 0;
  let bj = 0;
  for (let i = 0; i < a.length; i++) {
    const pa = toVec(a[i]);
    for (let j = 0; j < b.length; j++) {
      const pb = toVec(b[j]);
      const d = Math.hypot(
        pa.north - pb.north,
        pa.east - pb.east,
        pa.tvd - pb.tvd,
      );
      if (d < best) {
        best = d;
        bi = i;
        bj = j;
      }
    }
  }
  return { dist: best, i: bi, j: bj, pa: toVec(a[bi]), pb: toVec(b[bj]) };
}

function matVec3(m: number[], x: number[]): number[] {
  return [
    m[0] * x[0] + m[1] * x[1] + m[2] * x[2],
    m[3] * x[0] + m[4] * x[1] + m[5] * x[2],
    m[6] * x[0] + m[7] * x[1] + m[8] * x[2],
  ];
}

function dot3(a: number[], b: number[]): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function covAt(
  traj: TrajectoryPoint[],
  idx: number,
  tool: SurveyTool,
): number[] {
  const p = traj[idx];
  return stationCovariance(p.md, p.inc, p.azi, tool);
}

function ellipsoidAt(
  center: Vec3,
  cov: number[],
  k: number,
): Ellipsoid3D {
  const eig = eigenSym3(cov);
  return {
    center,
    axes: [
      k * Math.sqrt(Math.max(0, eig.values[0])),
      k * Math.sqrt(Math.max(0, eig.values[1])),
      k * Math.sqrt(Math.max(0, eig.values[2])),
    ],
    rotation: eig.vectors,
  };
}

export interface AnalyzeOptions {
  toolPrimary?: SurveyTool;
  toolAdjacent?: SurveyTool;
  /** Separation Factor confidence multiplier (k). Default 2.0 = 95% 1D
   * ("2-sigma" pairing, limit 1.5). SPE-WPTS HSE-risk: 3.5. */
  sfK?: number;
  /** 95% 3D uncertainty-ellipsoid scaling. Default sqrt(chi2(3,0.95)) = 2.795. */
  ellipseK?: number;
}

/**
 * Full collision analysis between two trajectories in a common NE-TVD frame.
 *
 * SF = D0 / (k * sigma_s) follows the ISCWSA R-type rule, where sigma_s =
 * sqrt(u^T (C_A + C_B) u) is the combined relative uncertainty projected onto
 * the center-to-center direction u = s / D0.
 */
export function analyzeCollision(
  primary: TrajectoryPoint[],
  adjacent: TrajectoryPoint[],
  opts: AnalyzeOptions = {},
): CollisionResult {
  const k = opts.sfK ?? DEFAULT_SF_K;
  const ek = opts.ellipseK ?? DEFAULT_ELLIPSE_K;
  const { dist, i, j, pa, pb } = closestTrajectoryPoints(primary, adjacent);

  const cA = covAt(primary, i, opts.toolPrimary ?? "MWD");
  const cB = covAt(adjacent, j, opts.toolAdjacent ?? "MWD");
  const cTot = [
    cA[0] + cB[0],
    cA[1] + cB[1],
    cA[2] + cB[2],
    cA[3] + cB[3],
    cA[4] + cB[4],
    cA[5] + cB[5],
    cA[6] + cB[6],
    cA[7] + cB[7],
    cA[8] + cB[8],
  ];

  const s = [pa.north - pb.north, pa.east - pb.east, pa.tvd - pb.tvd];
  const d0 = Math.hypot(s[0], s[1], s[2]);
  // ISCWSA R-type Separation Factor: SF = D0 / (k * sigma_s), where sigma_s is
  // the combined relative uncertainty projected onto the center-to-center
  // direction u = s / D0: sigma_s = sqrt(u^T (C_A + C_B) u).
  let sigmaS = 0;
  if (d0 > 0) {
    const u = [s[0] / d0, s[1] / d0, s[2] / d0];
    sigmaS = Math.sqrt(Math.max(0, dot3(u, matVec3(cTot, u))));
  }
  const sepSigma = sigmaS;
  const sf = d0 === 0 ? 0 : d0 / (k * sigmaS);

  // ISCWSA R-type rule bands (separation rules): report SF < 4.0,
  // adjust plans < 1.5, never plan < 1.0. SAFE >= 4.0, MONITOR 1.5-4.0,
  // CAUTION 1.0-1.5, CRITICAL < 1.0.
  const riskLevel: CollisionResult["riskLevel"] =
    sf >= 4.0 ? "SAFE" : sf >= 1.5 ? "MONITOR" : sf >= 1.0 ? "CAUTION" : "CRITICAL";

  return {
    minDistance: dist,
    sf,
    sepSigma,
    riskLevel,
    stationA: i,
    stationB: j,
    closestA: pa,
    closestB: pb,
    ellipseA: ellipsoidAt(pa, cA, ek),
    ellipseB: ellipsoidAt(pb, cB, ek),
  };
}

export interface AdjacentWellInput {
  id: string;
  name: string;
  surveys: SurveyRecord[];
  wellheadNorth?: number;
  wellheadEast?: number;
  tool?: SurveyTool;
}

/**
 * Convenience wrapper: build the adjacent trajectory from raw surveys (with its
 * own wellhead offset) and run the analysis against the primary's trajectory.
 */
export function analyzeAdjacentWell(
  primary: TrajectoryPoint[],
  adjacent: AdjacentWellInput,
  opts: AnalyzeOptions = {},
): CollisionResult {
  const adjTraj = calculateTrajectory(
    adjacent.surveys,
    adjacent.wellheadNorth ?? 0,
    adjacent.wellheadEast ?? 0,
  );
  return analyzeCollision(primary, adjTraj.trajectory, {
    ...opts,
    toolAdjacent: adjacent.tool ?? opts.toolAdjacent,
  });
}

function riskMeta(risk: CollisionResult["riskLevel"]) {
  switch (risk) {
    case "SAFE":
      return { label: "SEGURO", className: "is-safe" };
    case "MONITOR":
      return { label: "VIGILAR", className: "is-monitor" };
    case "CAUTION":
      return { label: "PRECAUCIÓN", className: "is-caution" };
    default:
      return { label: "CRÍTICO", className: "is-critical" };
  }
}

/** A single row in a multi-well collision matrix. */
export interface CollisionEntry {
  wellId: string;
  wellName: string;
  trajectory: TrajectoryPoint[];
  result: CollisionResult;
  /** Source input (surveys, tool, wellhead offset) — for the editor. */
  source: AdjacentWellInput;
  /** Distance (ft) between the primary and adjacent wellheads, for reference. */
  wellheadDistance: number;
}

/** RISK ORDER: CRITICAL < CAUTION < MONITOR < SAFE (lowest first = highest risk). */
const RISK_RANK: Record<CollisionResult["riskLevel"], number> = {
  CRITICAL: 0,
  CAUTION: 1,
  MONITOR: 2,
  SAFE: 3,
};

/**
 * Phase II: collision matrix — primary well vs N adjacent wells.
 * Returns entries sorted by risk (most critical first), so the highest-risk
 * well is always at the top of the table.
 */
export function analyzeCollisionMatrix(
  primary: TrajectoryPoint[],
  adjacents: AdjacentWellInput[],
  opts: AnalyzeOptions = {},
): CollisionEntry[] {
  const entries: CollisionEntry[] = adjacents.map((adj) => {
    const trajectory = calculateTrajectory(
      adj.surveys,
      adj.wellheadNorth ?? 0,
      adj.wellheadEast ?? 0,
    ).trajectory;
    const result = analyzeAdjacentWell(primary, adj, opts);
    const primaryWellhead = primary[0];
    const adjWellhead = trajectory[0];
    const wellheadDistance = Math.hypot(
      adjWellhead.north - primaryWellhead.north,
      adjWellhead.east - primaryWellhead.east,
      adjWellhead.tvd - primaryWellhead.tvd,
    );
    return {
      wellId: adj.id,
      wellName: adj.name,
      trajectory,
      result,
      source: adj,
      wellheadDistance,
    };
  });

  return entries.sort(
    (a, b) =>
      RISK_RANK[a.result.riskLevel] - RISK_RANK[b.result.riskLevel] ||
      b.result.sf - a.result.sf,
  );
}

/**
 * AI/narrative risk summary — plain-language explanation of why THIS well pair
 * is flagged at THIS risk level. Used for the executive summary / report.
 */
export function riskNarrative(
  entry: CollisionEntry,
  options: { sfK?: number; toolPrimary?: SurveyTool; toolAdjacent?: SurveyTool } = {},
): string {
  const r = entry.result;
  const k = options.sfK ?? 2.0;
  const sfStr = Number.isFinite(r.sf) ? r.sf.toFixed(2) : "∞";
  const band = riskMeta(r.riskLevel).label;

  let advice = "";
  switch (r.riskLevel) {
    case "CRITICAL":
      advice =
        "Riesgo crítico: las trayectorias están demasiado cerca. Se recomienda re-aim, " +
        "aumentar el offset del pozo adyacente o detener la perforación hasta rediseñar.";
      break;
    case "CAUTION":
      advice =
        "Precaución: la separación está en la banda de ajuste. Considere corregir el plan " +
        "antes de perforar más profundo.";
      break;
    case "MONITOR":
      advice =
        "Vigilar: la separación es aceptable pero por debajo del umbral de reporte (SF < 4.0). " +
        "Controle al avanzar.";
      break;
    case "SAFE":
      advice =
        "Seguro: separación suficiente conforme al criterio ISCWSA. Continúe monitoreando.";
      break;
  }

  return (
    `${entry.wellName}: SF = ${sfStr} (k = ${k}), distancia mínima ${r.minDistance.toFixed(1)} ft ` +
    `(estación #${r.stationA} vs #${r.stationB}). Banda ${band}. ${advice}`
  );
}
