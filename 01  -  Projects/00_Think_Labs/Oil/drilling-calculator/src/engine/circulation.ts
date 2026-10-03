// ============================================================
// Drilling Calculator — Circulation Engine
// Pure functions · Lag time, bottoms up, full circulation
// ============================================================

import type {
  VolumetricsResult,
  PumpResult,
  CirculationResult,
} from "../store/drilling-types";

/**
 * Calculate circulation times: surface-to-bit, bit-to-surface,
 * full circulation, bottoms up, and lag strokes.
 *
 * All times in minutes.
 * Reference: IADC Drilling Manual
 */
export function calculateCirculation(
  vol: VolumetricsResult,
  pump: PumpResult,
): CirculationResult {
  if (pump.flowRateBBLmin <= 0) {
    return {
      surfaceToBit: 0,
      bitToSurface: 0,
      fullCirculation: 0,
      bottomsUp: 0,
      lagStrokes: 0,
      lagTime: 0,
    };
  }

  // ─── Tiempos de Circulación (min) ────────────────────────
  // pump.flowRateBBLmin ya viene calculado en pump.ts como:
  // outputPerStroke * SPM * numPumps (en bbl/min)
  // NO re-convertir desde GPM, eso causaría doble conversión.
  const surfaceToBit = vol.totalInsideVolume / pump.flowRateBBLmin;
  const bitToSurface = vol.totalAnnularVolume / pump.flowRateBBLmin;
  const fullCirculation = surfaceToBit + bitToSurface;
  const bottomsUp = bitToSurface;

  // ─── Emboladas de Retraso (Lag Strokes) ──────────────────
  const lagStrokes =
    pump.outputPerStroke > 0
      ? vol.totalAnnularVolume / pump.outputPerStroke
      : 0;

  const lagTime = bitToSurface;

  return {
    surfaceToBit,
    bitToSurface,
    fullCirculation,
    bottomsUp,
    lagStrokes,
    lagTime,
  };
}
