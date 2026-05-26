// ============================================================
// Drilling Calculator — Directional Engine (MCM)
// Pure functions for 3D trajectory calculation
// Reference: ISCWSA Standard / API MCM formulas
// ============================================================

import type {
  SurveyRecord,
  TrajectoryPoint,
  DirectionalResult,
} from "../store/drilling-types";

/**
 * Converts degrees to radians
 */
const toRad = (deg: number) => (deg * Math.PI) / 180;

/**
 * Converts radians to degrees
 */
const toDeg = (rad: number) => (rad * 180) / Math.PI;

/**
 * Minimum Curvature Method (MCM) Implementation
 * Calculates the path between two survey stations.
 */
export function calculateTrajectory(
  records: SurveyRecord[],
  surfaceNorth: number = 0,
  surfaceEast: number = 0,
  gridConvergence: number = 0,
): DirectionalResult {
  if (records.length === 0) {
    return {
      surveys: [],
      trajectory: [],
      totalClosure: 0,
      closureAzimuth: 0,
    };
  }

  const points: TrajectoryPoint[] = [];

  for (let i = 0; i < records.length; i++) {
    const current = records[i];

    // Grid adjustment for azimuth
    const gridAzi = current.azi - gridConvergence;
    const normalizedAzi = ((gridAzi % 360) + 360) % 360;

    if (i === 0) {
      points.push({
        ...current,
        azi: normalizedAzi,
        tvd: current.md,
        north: surfaceNorth,
        east: surfaceEast,
        dls: 0,
        cl: 0,
      });
      continue;
    }

    const prev = points[i - 1];

    const md1 = prev.md;
    const i1 = toRad(prev.inc);
    const a1 = toRad(prev.azi);

    const md2 = current.md;
    const i2 = toRad(current.inc);
    const a2 = toRad(normalizedAzi);

    const dMd = md2 - md1;

    // Dog leg angle (beta) in radians
    const cosBeta =
      Math.cos(i2 - i1) - Math.sin(i1) * Math.sin(i2) * (1 - Math.cos(a2 - a1));
    const safeCosBeta = Math.max(-1, Math.min(1, cosBeta));
    const beta = Math.acos(safeCosBeta);

    // Ratio Factor (RF)
    let rf = 1;
    if (beta > 0.0000001) {
      rf = (2 / beta) * Math.tan(beta / 2);
    }

    // Incremental coordinates (Minimum Curvature)
    const factor = (dMd / 2) * rf;
    const dTVD = factor * (Math.cos(i1) + Math.cos(i2));
    const dNorth =
      factor * (Math.sin(i1) * Math.cos(a1) + Math.sin(i2) * Math.cos(a2));
    const dEast =
      factor * (Math.sin(i1) * Math.sin(a1) + Math.sin(i2) * Math.sin(a2));

    // Dog Leg Severity (deg/100ft)
    const dlDeg = toDeg(beta);
    const dls = dMd > 0 ? (dlDeg / dMd) * 100 : 0;

    points.push({
      ...current,
      azi: normalizedAzi,
      tvd: prev.tvd + dTVD,
      north: prev.north + dNorth,
      east: prev.east + dEast,
      dls,
      cl: dMd,
    });
  }

  const lastPoint = points[points.length - 1];

  // Total Closure Distance (from surface coordinates)
  const closureNorth = lastPoint.north - surfaceNorth;
  const closureEast = lastPoint.east - surfaceEast;
  const totalClosure = Math.sqrt(
    closureNorth * closureNorth + closureEast * closureEast,
  );

  // Closure Azimuth
  let closureAzimuth = toDeg(Math.atan2(closureEast, closureNorth));
  closureAzimuth = ((closureAzimuth % 360) + 360) % 360;

  return {
    surveys: records,
    trajectory: points,
    totalClosure,
    closureAzimuth,
  };
}
