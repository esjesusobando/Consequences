// ============================================================
// Drilling Calculator - Cuttings Transport Engine
// Pure functions ... Slip Velocity, CCI, Hole Cleaning Efficiency
// ============================================================

import { API_SHEAR_RATE_FRICTION } from "./physics";
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
  dp: number = 0.25, // cuttings particle diameter (in) — Moore 1974
  gs: number = 21, // cuttings specific gravity (ppg)
): CuttingsTransportResult {
  const AV = hydraulics.annularVelocity; // ft/min
  const MW = mud.mudWeight; // ppg
  const model = mud.rheologyModel;
  const K = model === "HERSCHEL_BULKLEY" ? rheology.k_hb : rheology.k_pl; // Use correct K per model
  const PV = rheology.pv;

  // 1. Slip Velocity — Moore 1974 laminar branch (dp = particle diameter in
  // inches, gs = cuttings grain density in ppg; defaults 0.25" / 21 ppg).
  // TODO(formulas): add Moore 1974 / Bourgoyne §4.15 intermediate & turbulent
  // slip-regime branches once the published coefficients are verified (requires
  // web access); laminar-only currently overestimates transport in the
  // intermediate regime (real slip 20-60 ft/min).
  let slipVelocity = 0;
  if (AV > 0 && PV > 0) {
    slipVelocity =
      (PV / (MW * dp)) *
      (Math.sqrt(1 + 0.048 * dp * ((MW * (gs - MW)) / (PV * PV))) - 1) *
      100;

    // Safety clamp: minimum estimated slip applies ONLY while circulating
    // with a valid plastic viscosity. Without flow (AV=0) or with PV=0 the
    // slip is physically zero and must not be bumped to 5 ft/min.
    slipVelocity = Math.max(slipVelocity, 5);
  }

  // 2. Transport Velocity and Ratio
  // Nota: AV y slipVelocity son variables locales calculadas arriba.
  // HydraulicsResult NO tiene slipVelocity; se calcula aquí.
  const transportVelocity = Math.max(AV - slipVelocity, 0);
  const transportRatio = AV > 0 ? (transportVelocity / AV) * 100 : 0;

  // 3. Cutting Carrying Index (CCI) - Moore Standard
  // Formula: (K_cP * AV * MW) / 400,000 — K is converted to cP-equivalent
  // (×478.8, the lb/100ft²·sⁿ → cP factor) so the 0.5/1.0 thresholds make sense.
  // Standard: CCI > 1.0 (Good), 0.5 - 1.0 (Fair), < 0.5 (Poor)
  const cci =
    AV > 0 ? (K * API_SHEAR_RATE_FRICTION * AV * MW) / 400000 : 0;

  // 4. Hole Cleaning Efficiency (HCE)
  // Theoretical simplified efficiency percentage
  const hce = Math.min(transportRatio * (cci > 1 ? 1 : cci), 100);

  // 5. Cuttings Concentration (ROP in ft/hr; /60 converts to ft/min)
  // Ca = (ROP/60)·Ah / (AV·Aann) = (ROP·Dh²) / (60·AV·(Dh²−Dp²))
  const ropAssumed = 60; // ft/hr
  const cuttingsConcentration =
    AV > 0
      ? (ropAssumed * Math.pow(well.holeSize, 2)) /
        (60 *
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
