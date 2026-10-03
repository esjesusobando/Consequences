// ============================================================
// Fallback Data — Garantiza visualización inmediata out-of-the-box
// Usa los MISMOS valores por defecto del drilling-store (DEFAULT_WELL)
// y MOCK_PRIMARY/MOCK_WELLS para trayectorias y matriz de colisión
// ============================================================

import { calculateTrajectory } from "../engine/directional";
import { MOCK_PRIMARY, MOCK_WELLS, getPresetAsAdjacent } from "../engine/mock-wells";
import { analyzeCollisionMatrix } from "../engine/anti-collision";
import { PRIMARY_WELL_ID, wellColor } from "../engine/scene";
import type { TrajectoryPoint, WellData } from "../store/drilling-types";
import type { CollisionEntry } from "../engine/anti-collision";

/** Valores por defecto idénticos a DEFAULT_WELL en drilling-store.ts */
export const FALLBACK_WELL_DATA: WellData = {
  totalDepth: 9000,
  tvd: 7800,
  holeSize: 12.25,
  drillPipeOD: 5.0,
  drillPipeID: 4.276,
  drillPipeLength: 7200,
  hwdpOD: 5.0,
  hwdpID: 3.0,
  hwdpLength: 300,
  dcOD: 8.0,
  dcID: 2.8125,
  dcLength: 500,
  bitSize: 12.25,
  bitNozzles: [14, 14, 14],
  surfaceNorth: 10000000,
  surfaceEast: 500000,
  gridConvergence: 0,
};

/** Trayectoria primaria calculada desde MOCK_PRIMARY (10,000 ft, 15° build)
 *  NOTA: MOCK_PRIMARY usa surfaceNorth=0, surfaceEast=0
 *  Para consistencia con wellData, usamos los offsets del store
 */
export const FALLBACK_PRIMARY_TRAJECTORY: TrajectoryPoint[] = calculateTrajectory(
  MOCK_PRIMARY.surveys,
  FALLBACK_WELL_DATA.surfaceNorth ?? 0,
  FALLBACK_WELL_DATA.surfaceEast ?? 0
).trajectory;

/** 11 pozos adyacentes calculados desde MOCK_WELLS con offsets del store */
export const FALLBACK_ADJACENT_WELLS = MOCK_WELLS.map(getPresetAsAdjacent);

/** Matriz de colisión completa: 1 primary + 11 adyacentes = 11 entries
 *  Usa toolPrimary=MWD, sfK=2.0 (estándar ISCWSA R-Type)
 */
export const FALLBACK_MATRIX: CollisionEntry[] = analyzeCollisionMatrix(
  FALLBACK_PRIMARY_TRAJECTORY,
  FALLBACK_ADJACENT_WELLS,
  { toolPrimary: "MWD", sfK: 2.0 }
);

/** Colores estables por wellId (usando wellColor del scene.ts) */
const wellIds = [PRIMARY_WELL_ID, ...FALLBACK_MATRIX.map((e) => e.wellId)];
export const FALLBACK_WELL_COLORS: Record<string, string> = Object.fromEntries(
  wellIds.map((id) => [id, wellColor(id, wellIds)])
);

/** Helper: obtiene trajectory calculada de un adjacent well */
export function getAdjacentTrajectory(wellId: string): TrajectoryPoint[] {
  const entry = FALLBACK_MATRIX.find((e) => e.wellId === wellId);
  return entry?.trajectory ?? [];
}

/** Helper: obtiene resultado de colisión para un well */
export function getCollisionResult(wellId: string) {
  const entry = FALLBACK_MATRIX.find((e) => e.wellId === wellId);
  return entry?.result ?? null;
}

/** Helper: obtiene todos los wellIds disponibles */
export function getAllWellIds(): string[] {
  return wellIds;
}

/** Helper: obtiene color de un well */
export function getWellColor(wellId: string): string {
  return FALLBACK_WELL_COLORS[wellId] ?? "#00b4d8";
}

/** Helper: obtiene nombre de un well */
export function getWellName(wellId: string): string {
  if (wellId === PRIMARY_WELL_ID) return "Pozo Principal";
  const entry = FALLBACK_MATRIX.find((e) => e.wellId === wellId);
  return entry?.wellName ?? wellId;
}

/** Helper: obtiene risk level de un well */
export function getWellRiskLevel(wellId: string): CollisionEntry["result"]["riskLevel"] | null {
  if (wellId === PRIMARY_WELL_ID) return "SAFE"; // Primary well is reference
  const entry = FALLBACK_MATRIX.find((e) => e.wellId === wellId);
  return entry?.result.riskLevel ?? null;
}