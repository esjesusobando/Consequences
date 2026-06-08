// ============================================================
// Drilling Calculator — Cuttings Transport Engine
// Pure functions · Slip Velocity, CCI, Hole Cleaning Efficiency
// ============================================================

import type {
  WellData,
  MudData,
  RheologyResult,
  HydraulicsResult,
  CuttingsTransportResult,
} from "../store/drilling-types";

/**
 * Calculate cuttings transport parameters based on annular hydraulics
 * and mud rheology (Standard: Moore / API).
 */
export function calculateCuttingsTransport(
  well: WellData,
  mud: MudData,
  rheology: RheologyResult,
  hydraulics: HydraulicsResult,
): CuttingsTransportResult {
  const AV = hydraulics.annularVelocity; // ft/min
  const MW = mud.mudWeight; // ppg
  const model = mud.rheologyModel;
  const K = model === "HERSCHEL_BULKLEY" ? rheology.k_hb : rheology.k_pl; // Use correct K per model
  const PV = rheology.pv;

  // 1. Slip Velocity (Simplified for typical cuttings 0.25", 21 ppg grain density)
  // Standard approximation for mid-size cuttings in drilling fluids
  let slipVelocity = 0;
  if (AV > 0 && PV > 0) {
    // Empirical slip velocity formula (Moore)
    slipVelocity =
      (PV / (MW * 0.25)) *
      (Math.sqrt(1 + 0.048 * 0.25 * ((MW * (21 - MW)) / (PV * PV))) - 1) *
      100;
  }

  // Safety clamp
  slipVelocity = Math.max(slipVelocity, 5); // Minimum estimated slip

  // 2. Transport Velocity and Ratio
  // Nota: AV y slipVelocity son variables locales calculadas arriba.
  // HydraulicsResult NO tiene slipVelocity; se calcula aquí.
  const transportVelocity = Math.max(AV - slipVelocity, 0);
  const transportRatio = AV > 0 ? (transportVelocity / AV) * 100 : 0;

  // 3. Cutting Carrying Index (CCI) - Moore Standard
  // Formula: (K * AV * MW) / 400,000
  // Standard: CCI > 1.0 (Good), 0.5 - 1.0 (Fair), < 0.5 (Poor)
  const cci = AV > 0 ? (K * AV * MW) / 400000 : 0;

  // 4. Hole Cleaning Efficiency (HCE)
  // Theoretical simplified efficiency percentage
  const hce = Math.min(transportRatio * (cci > 1 ? 1 : cci), 100);

  // 5. Cuttings Concentration (Estimated based on ROP - assumed 60 ft/hr or 1 ft/min)
  // Ca = (ROP * HoleSize^2) / (AV * (HoleSize^2 - PipeOD^2))
  const ropAssumed = 60; // ft/hr
  const cuttingsConcentration =
    AV > 0
      ? (ropAssumed * Math.pow(well.holeSize, 2)) /
        (14.7 *
          AV *
          (Math.pow(well.holeSize, 2) - Math.pow(well.drillPipeOD, 2)))
      : 0;

  return {
    slipVelocity,
    transportVelocity,
    transportRatio,
    cuttingCarryingIndex: cci,
    holeCleaningEfficiency: hce,
    cuttingsConcentration: cuttingsConcentration * 100, // Convert to %
  };
}
