// ============================================================
// Drilling Calculator — Pump Engine
// Pure functions · Flow rate & hydraulic HP
// ============================================================

import type { PumpData, PumpResult } from "../store/drilling-types";

/**
 * Calculate pump output, flow rate, and hydraulic horsepower.
 *
 * Triplex factor: 0.000243
 * Duplex factor:  0.000162
 *
 * Reference: IADC Drilling Manual
 */
export function calculatePump(pump: PumpData): PumpResult {
  // ─── Output per stroke (bbl/stroke) ──────────────────────

  const outputPerStroke =
    pump.pumpType === "Triplex"
      ? 0.000243 * Math.pow(pump.linerDiameter, 2) * pump.strokeLength
      : // Duplex (doble-acción): factor 0.000162 = 0.000243 × (2/3)
        // Los dos cilindros actúan en ambas direcciones; el rod reduce el área neta de retorno.
        // IADC Drilling Manual: factor compacto para cilindros de doble efecto.
        0.000162 *
        (2 * Math.pow(pump.linerDiameter, 2) - Math.pow(pump.rodDiameter, 2)) *
        pump.strokeLength;

  const finalOutput = outputPerStroke * (pump.efficiency / 100);

  // ─── Flow rate ───────────────────────────────────────────
  const flowRateBBLmin =
    finalOutput * pump.strokesPerMinute * pump.numberOfPumps;
  const flowRateGPM = flowRateBBLmin * 42;

  // ─── Hydraulic HP ────────────────────────────────────────
  const hydraulicHP = (pump.standpipePressure * flowRateGPM) / 1714;

  return {
    outputPerStroke: finalOutput,
    flowRateGPM,
    flowRateBBLmin,
    hydraulicHP,
  };
}

/**
 * Inverse of calculatePump.flowRateGPM: converts a target GPM to SPM.
 * Exact inverse of flowRateGPM = finalOutput * spm * pumps * 42.
 * Fallbacks to the pump's configured SPM on invalid input (no NaN/Infinity).
 */
export function gpmToSpm(gpm: number, pump: PumpData): number {
  if (
    !Number.isFinite(gpm) ||
    gpm <= 0 ||
    !pump.numberOfPumps ||
    pump.numberOfPumps <= 0
  ) {
    return pump.strokesPerMinute; // fallback: no NaN/Infinity
  }
  const { outputPerStroke } = calculatePump(pump); // finalOutput (efficiency applied)
  const denom = outputPerStroke * pump.numberOfPumps * 42;
  if (denom <= 0 || !Number.isFinite(denom)) return pump.strokesPerMinute;
  return gpm / denom;
}
