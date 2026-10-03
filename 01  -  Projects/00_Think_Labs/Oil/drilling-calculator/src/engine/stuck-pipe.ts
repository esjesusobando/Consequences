// ============================================================
// Drilling Calculator — Stuck Pipe Engine (Elite)
// Physical & Geometrical Risk Analysis
// ============================================================

import type {
  WellData,
  PressureResult,
  StuckPipeResult,
  DirectionalResult,
  CuttingsTransportResult,
} from "../store/drilling-types";

/**
 * Stuck Pipe Engine:
 * Analyzes mechanical and differential risks that could lead to a stuck drill string.
 */
export function calculateStuckPipe(
  well: WellData,
  pressures: PressureResult,
  directional?: DirectionalResult,
  cuttings?: CuttingsTransportResult,
): StuckPipeResult {
  const dp = well.drillPipeOD;
  const overbalance = pressures.overbalance;

  // 1. Differential Sticking Force (Fs)
  // Fs = dP * A * Cof
  const contactArea = 150; // Estimated sq in (Heuristic for BHA contact)
  const cof = 0.25; // Friction coefficient for mud cake
  const diffStickingForce = overbalance * contactArea * cof;

  let differentialRisk: "Low" | "Medium" | "High" = "Low";
  if (overbalance > 500) differentialRisk = "High";
  else if (overbalance > 250) differentialRisk = "Medium";

  // 2. Mechanical Risks (Key Seating)
  // Based on Dogleg Severity (DLS) and Tension (simplified)
  let keySeatingRisk: "Low" | "Medium" | "High" = "Low";
  if (directional && directional.trajectory.length > 0) {
    const maxDLS = Math.max(...directional.trajectory.map((p) => p.dls));
    if (maxDLS > 4.5) keySeatingRisk = "High";
    else if (maxDLS > 3.0) keySeatingRisk = "Medium";
  }

  // 3. Hole Cleaning / Packing Off Risk
  let holeCleaningRisk: "Low" | "Medium" | "High" = "Low";
  if (cuttings) {
    if (cuttings.cuttingCarryingIndex < 0.5) holeCleaningRisk = "High";
    else if (cuttings.cuttingCarryingIndex < 1.0) holeCleaningRisk = "Medium";
  }

  // 4. Free Point Constants (FPC) for Steel
  // Formula: FPC = As * 2500
  const pipeWallArea =
    (Math.pow(dp, 2) - Math.pow(well.drillPipeID, 2)) * 0.7854;
  const fpc = pipeWallArea * 2500;

  return {
    differentialStickingForce: diffStickingForce,
    differentialRiskLevel: differentialRisk,
    keySeatingRisk,
    holeCleaningRisk,
    freePointConstant: fpc,
    freePointDepth: 0, // Placeholder for dynamic on-demand check
    feetOfFreePipe: 0,
  };
}
