// ============================================================
// Drilling Calculator — Pressures Engine
// Pure functions · Pore, fracture, hydrostatic, mud window
// ============================================================

import { API_HYDROSTATIC_GRADIENT } from "./physics";
import type {
  FormationData,
  MudData,
  WellData,
  PressureResult,
} from "../store/drilling-types";

/**
 * Calculate formation pressures, hydrostatic pressure,
 * mud window, and overbalance.
 *
 * Key formula: P_hydrostatic = MW × 0.052 × TVD
 * Reference: Well Control Institute · IADC
 */
export function calculatePressures(
  well: WellData,
  formation: FormationData,
  mud: MudData,
): PressureResult {
  const TVD = Math.max(well.tvd || well.totalDepth || 0, 1);
  const MW = mud.mudWeight;

  // 1. Static Pressures (psi)
  const hydrostaticPressure = MW * API_HYDROSTATIC_GRADIENT * TVD;
  const mudGradient = MW * API_HYDROSTATIC_GRADIENT;

  // 2. Formation Pressures (psi)
  const porePressure = formation.porePressureGradient * TVD;
  const fracturePressure = formation.fractureGradient * TVD;

  // 3. Dynamic Pressures (psi) - BHP calculated in hydraulics engine

  // 4. Mud Window (ppg)
  const minMudWeight =
    formation.porePressureGradient / API_HYDROSTATIC_GRADIENT;
  const maxMudWeight = formation.fractureGradient / API_HYDROSTATIC_GRADIENT;
  const mudWindow = maxMudWeight - minMudWeight;

  // 5. ECD Overbalance
  const overbalance = hydrostaticPressure - porePressure;
  const overbalancePPG = overbalance / (API_HYDROSTATIC_GRADIENT * TVD);

  return {
    porePressure,
    fracturePressure,
    hydrostaticPressure,
    mudGradient,
    minMudWeight,
    maxMudWeight,
    mudWindow,
    overbalance,
    overbalancePPG,
  };
}
