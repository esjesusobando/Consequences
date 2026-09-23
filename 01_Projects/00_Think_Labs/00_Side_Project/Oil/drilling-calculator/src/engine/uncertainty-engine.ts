// ============================================================
// UncertaintyEngine — Pure TypeScript ISCWSA uncertainty calculations
// Computes continuous uncertainty ellipsoids along wellbore trajectory
// Pure functions, no React/Three dependencies, fully testable
// ============================================================

import type {
  TrajectoryPoint,
  Vec3,
  SurveyTool,
} from "../store/drilling-types";
import {
  stationCovariance,
  eigenSym3,
  DEFAULT_ELLIPSE_K,
  DEFAULT_SF_K,
  toRad,
} from "./anti-collision";

export interface UncertaintyStation {
  md: number;
  index: number;
  center: Vec3;                    // in common NE-TVD frame
  axes: [number, number, number];  // semi-axes [major, medium, minor] in ft
  rotation: number[];              // 3x3 row-major eigenvectors
  riskLevel?: "SAFE" | "MONITOR" | "CAUTION" | "CRITICAL";
  dls?: number;
  inc?: number;
  azi?: number;
}

export interface UncertaintyProfileOptions {
  trajectory?: TrajectoryPoint[];  // Optional - primary trajectory is passed as first argument
  tool: SurveyTool;
  ellipseK?: number;               // default: DEFAULT_ELLIPSE_K (2.795 for 95% 3D)
  sfK?: number;                    // default: DEFAULT_SF_K (2.0)
  toolPrimary?: SurveyTool;
  adjacentTrajectory?: TrajectoryPoint[];
  adjacentTool?: SurveyTool;
}

/**
 * Computes uncertainty ellipsoids for ALL stations along a trajectory.
 * If adjacentTrajectory provided: combined covariance (C_A + C_B) at closest approach per station.
 * If not: self-uncertainty only (C_A).
 * 
 * Returns array ordered by MD ascending.
 */
export function computeUncertaintyProfile(
  primary: TrajectoryPoint[],
  opts: UncertaintyProfileOptions
): UncertaintyStation[] {
  const {
    tool,
    ellipseK = DEFAULT_ELLIPSE_K,
    adjacentTrajectory,
    adjacentTool = "MWD",
  } = opts;

  // Pre-compute adjacent covariance cache if adjacent trajectory provided
  const adjCovCache = adjacentTrajectory
    ? new Map(
        adjacentTrajectory.map((p, i) => [
          i,
          stationCovariance(p.md, p.inc, p.azi, adjacentTool),
        ])
      )
    : null;

  return primary.map((p, i) => {
    const cA = stationCovariance(p.md, p.inc, p.azi, tool);
    let cTotal = cA;

    if (adjacentTrajectory && adjCovCache && adjacentTrajectory.length > 0) {
      // Find closest adjacent station by MD
      let bestIdx = 0;
      let bestDiff = Infinity;
      for (let j = 0; j < adjacentTrajectory.length; j++) {
        const diff = Math.abs(adjacentTrajectory[j].md - p.md);
        if (diff < bestDiff) {
          bestDiff = diff;
          bestIdx = j;
        }
      }
      // Guard: ensure bestIdx is within adjCovCache bounds
      const cachedIdx = Math.min(bestIdx, adjacentTrajectory.length - 1);
      const cB = adjCovCache.get(cachedIdx);
      if (!cB) {
        cTotal = cA;
      } else {
        cTotal = cA.map((v, k) => v + cB[k]);
      }
    } else {
      cTotal = cA;
    }

    // Eigen decomposition
    const { values, vectors } = eigenSym3(cTotal);
    const axes: [number, number, number] = [
      ellipseK * Math.sqrt(Math.max(0, values[0])),
      ellipseK * Math.sqrt(Math.max(0, values[1])),
      ellipseK * Math.sqrt(Math.max(0, values[2])),
    ];

    // Center in common frame (relative to primary wellhead)
    const center: Vec3 = { north: p.north, east: p.east, tvd: -p.tvd };

    // DLS for coloring
    let dls = 0;
    if (i > 0 && i < primary.length - 1) {
      const p1 = primary[i - 1];
      const p2 = primary[i + 1];
      const dMd = primary[i + 1].md - primary[i - 1].md;
      if (dMd > 0) {
        dls = Math.sqrt(
          Math.pow(p2.inc - p1.inc, 2) +
            Math.pow(Math.sin(toRad(p1.inc)) * (p2.azi - p1.azi), 2)
        ) / dMd * 100;
      }
    }

    // Risk level from SF if adjacent provided
    let riskLevel: UncertaintyStation["riskLevel"] | undefined;
    if (adjacentTrajectory && adjacentTrajectory.length > 0 && primary.length > 0) {
      // Find closest adjacent station
      let bestIdx = 0;
      let bestDiff = Infinity;
      for (let j = 0; j < adjacentTrajectory.length; j++) {
        const diff = Math.abs(adjacentTrajectory[j].md - p.md);
        if (diff < bestDiff) {
          bestDiff = diff;
          bestIdx = j;
        }
      }
      // bestIdx indexes into adjacentTrajectory by construction
      const adj = adjacentTrajectory[bestIdx];
      const cB = stationCovariance(adj.md, adj.inc, adj.azi, adjacentTool);
      const cTotal2 = cA.map((v, k) => v + cB[k]);
      const d0 = Math.sqrt(
        Math.pow(p.north - adj.north, 2) +
          Math.pow(p.east - adj.east, 2) +
          Math.pow(p.tvd - adj.tvd, 2)
      );
      let sf = Infinity;
      if (d0 > 0) {
        const s = [p.north - adj.north, p.east - adj.east, p.tvd - adj.tvd];
        const u = [s[0] / d0, s[1] / d0, s[2] / d0];
        const sigmaS = Math.sqrt(Math.max(0, dot3(u, matVec3(cTotal2, u))));
        sf = d0 / (DEFAULT_SF_K * sigmaS);
      }
      if (sf >= 4.0) riskLevel = "SAFE";
      else if (sf >= 1.5) riskLevel = "MONITOR";
      else if (sf >= 1.0) riskLevel = "CAUTION";
      else riskLevel = "CRITICAL";
    }

    return {
      md: p.md,
      index: i,
      center,
      axes,
      rotation: vectors,
      riskLevel,
      dls,
      inc: p.inc,
      azi: p.azi,
    };
  });
}

// Helper: dot product
function dot3(a: number[], b: number[]): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

// Helper: matrix-vector multiplication
function matVec3(m: number[], x: number[]): number[] {
  return [
    m[0] * x[0] + m[1] * x[1] + m[2] * x[2],
    m[3] * x[0] + m[4] * x[1] + m[5] * x[2],
    m[6] * x[0] + m[7] * x[1] + m[8] * x[2],
  ];
}

// Risk color mapping
export function riskLevelColor(level: UncertaintyStation["riskLevel"]): string {
  switch (level) {
    case "CRITICAL": return "#ef4444";
    case "CAUTION": return "#f43f5e";
    case "MONITOR": return "#f59e0b";
    case "SAFE": return "#22c55e";
    default: return "#00b4d8";
  }
}

// LOD level per well station count
// Detail: 0=minimal (1-8 stations), 1=medium (9-26 stations), 2=max (27+ stations)
export function getLodLevel(stationCount: number): number {
  if (stationCount <= 8) return 0; // minimal detail
  if (stationCount <= 26) return 1; // medium detail
  return 2; // max detail
}

// Compute per-station LOD: distant stations get fewer segments
export function computeStationLod(stationIdx: number, totalStations: number): number {
  // Earlier stations (near bit) get full detail, later get reduced
  const progress = stationIdx / Math.max(1, totalStations - 1);
  // LOD decreases from 2 to 0 as we go along the wellbore
  return Math.max(0, Math.round(2 - progress * 2));
}

// Forward cone growth model: linear major-axis growth along last segment direction
// Returns radial distances per slice for visual halo representation
export function computeForwardCone(
  primary: TrajectoryPoint[],
  opts: {k: number; maxRadius: number; slices: number}
): number[] {
  if (primary.length < 2) return new Array(opts.slices).fill(0);

  const last = primary[primary.length - 1];
  const prev = primary[primary.length - 2];
  const majorAxis = Math.sqrt(
    Math.pow(last.md - prev.md, 2) +
      Math.pow(last.inc - prev.inc, 2) +
      Math.pow(last.azi - prev.azi, 2)
  );

  const radii: number[] = [];
  for (let i = 0; i < opts.slices; i++) {
    const t = i / Math.max(1, opts.slices - 1);
    // Linear growth along major axis, capped at maxRadius
    radii.push(Math.min(opts.maxRadius, t * majorAxis * opts.k));
  }
  return radii;
}

// Re-export constants
export { DEFAULT_ELLIPSE_K, DEFAULT_SF_K, toRad } from "./anti-collision";