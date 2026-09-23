// ============================================================
// Drilling Calculator — Scene helpers (pure)
// Common NE-TVD frame mapping, stable well colors, visible-well
// bounds for the 3D anti-collision view. No React / three imports.
// ============================================================

import type { TrajectoryPoint, Vec3 } from "../store/drilling-types";

/** Fixed per-wellId palette (kept in sync with the previous WELL_COLORS look). */
export const SCENE_COLORS: readonly string[] = [
  "#00b4d8",
  "#ff006e",
  "#ffcc00",
  "#00ff88",
  "#8a2be2",
  "#ff6b6b",
  "#4ecdc4",
  "#ffe66d",
  "#ff9f1c",
  "#2ec4b6",
  "#e71d36",
];

/**
 * Sentinel wellId for the primary well. It sorts before any preset id
 * (underscore < lowercase), so `wellColor(PRIMARY_WELL_ID, ids)` always
 * resolves to SCENE_COLORS[0] while entries get the following palette slots.
 */
export const PRIMARY_WELL_ID = "__primary__";

/**
 * Deterministic string hash (position-independent) so an unknown wellId still
 * resolves to a stable palette color regardless of caller-side re-sorts.
 */
const stableHash = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
};

/**
 * Map a trajectory point into the common NE-TVD frame anchored at the primary
 * wellhead: (east - wellheadE, north - wellheadN, -tvd). The primary wellhead
 * itself maps to the origin.
 */
export function commonFramePoint(
  p: TrajectoryPoint,
  wellheadE: number,
  wellheadN: number,
): Vec3 {
  return { east: p.east - wellheadE, north: p.north - wellheadN, tvd: -p.tvd };
}

/**
 * Stable color keyed by wellId from SCENE_COLORS (AC3D-5). Color depends only
 * on wellId (list position never matters), so risk re-sorts cannot change it:
 * wells present in the list get palette colors in sorted order; unknown wells
 * fall back to a deterministic hash of the wellId.
 */
export function wellColor(wellId: string, wellIds: string[]): string {
  const ordered = [...new Set(wellIds)].sort();
  const idx = ordered.indexOf(wellId);
  const paletteIdx = idx >= 0 ? idx : stableHash(wellId) % SCENE_COLORS.length;
  return SCENE_COLORS[paletteIdx % SCENE_COLORS.length];
}

/** One well candidate for bounds computation. */
export interface SceneEntry {
  trajectory: TrajectoryPoint[];
  /** Pre-computed visibility flag (false = excluded). */
  visible: boolean;
  /** Well identifier — excluded when present in `hiddenWells`. */
  wellId?: string;
  /** Source input carrying the wellhead offsets (for callers that need them). */
  source: { wellheadEast?: number; wellheadNorth?: number };
}

/** Bounding box over visible wells, expressed in the common frame. */
export interface SceneBounds {
  /** Midpoint of the box (ft), in the common frame. */
  center: Vec3;
  /** Full size of the box per axis, max - min (ft), in the common frame. */
  extent: Vec3;
}

/**
 * Bounding box over visible wells only (AC3D-6): the primary trajectory plus
 * every entry that is flagged visible AND (when a wellId is known) not listed
 * in `hiddenWells`. All points are mapped through the primary wellhead frame,
 * so the returned center/extent live in the same space as the tubes.
 */
export function visibleBounds(
  entries: SceneEntry[],
  primary: TrajectoryPoint[],
  primarySurface: { east: number; north: number },
  hiddenWells: Set<string>,
): SceneBounds {
  const visibleEntries = entries.filter(
    (e) => e.visible && (!e.wellId || !hiddenWells.has(e.wellId)),
  );

  let minE = Infinity;
  let maxE = -Infinity;
  let minN = Infinity;
  let maxN = -Infinity;
  let minTvd = Infinity;
  let maxTvd = -Infinity;

  const fold = (p: TrajectoryPoint) => {
    const f = commonFramePoint(p, primarySurface.east, primarySurface.north);
    if (f.east < minE) minE = f.east;
    if (f.east > maxE) maxE = f.east;
    if (f.north < minN) minN = f.north;
    if (f.north > maxN) maxN = f.north;
    if (f.tvd < minTvd) minTvd = f.tvd;
    if (f.tvd > maxTvd) maxTvd = f.tvd;
  };

  primary.forEach(fold);
  visibleEntries.forEach((e) => e.trajectory.forEach(fold));

  if (!Number.isFinite(minE)) {
    return {
      center: { north: 0, east: 0, tvd: 0 },
      extent: { north: 0, east: 0, tvd: 0 },
    };
  }

  return {
    center: {
      north: (minN + maxN) / 2,
      east: (minE + maxE) / 2,
      tvd: (minTvd + maxTvd) / 2,
    },
    extent: {
      north: maxN - minN,
      east: maxE - minE,
      tvd: maxTvd - minTvd,
    },
  };
}
