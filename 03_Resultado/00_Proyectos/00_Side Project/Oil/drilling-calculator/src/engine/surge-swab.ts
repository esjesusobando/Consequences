import { API_HYDROSTATIC_GRADIENT } from "./physics";
import { safeDivide } from "./utils/validation";

/**
 * Surge and Swab Pressure Engine
 * Based on simplified Bingham Plastic model.
 * Handles pressure changes due to pipe movement.
 */

export interface SurgeSwabParams {
  mudWeight: number; // ppg
  plasticViscosity: number; // cP
  yieldPoint: number; // lb/100ft^2
  holeDiameter: number; // inches
  pipeDiameter: number; // inches
  pipeVelocity: number; // ft/min
  pipeLength: number; // ft
}

export interface SurgeSwabResult {
  surgePressure: number; // psi
  swabPressure: number; // psi
  equivalentMudWeightSurge: number; // ppg
  equivalentMudWeightSwab: number; // ppg
}

export function calculateSurgeSwab(params: SurgeSwabParams): SurgeSwabResult {
  const {
    mudWeight,
    plasticViscosity,
    yieldPoint,
    holeDiameter,
    pipeDiameter,
    pipeVelocity,
    pipeLength,
  } = params;

  // 1. Calculate Surge/Swab Pressure Gradient (Simplified Bingham)
  // Formula: DeltaP (psi) = [ (PV * v / (1000 * (Dh - Dp))) + (YP / (200 * (Dh - Dp))) ] * (L / 1000)
  // Note: This is a common approximation for field use.
  
  const diameterDiff = Math.max(0.1, holeDiameter - pipeDiameter);
  
  const frictionComponent = safeDivide(
    plasticViscosity * pipeVelocity,
    1000 * diameterDiff
  );
  
  const yieldComponent = safeDivide(
    yieldPoint,
    200 * diameterDiff
  );

  const totalGradientPer1000ft = frictionComponent + yieldComponent;
  const totalChange = totalGradientPer1000ft * (pipeLength / 1000);

  // 2. Equivalent Mud Weight (EMW)
  // EMW = MW + DeltaP / (0.052 * L)
  const emwChange = safeDivide(totalChange, API_HYDROSTATIC_GRADIENT * pipeLength);

  return {
    surgePressure: Number(totalChange.toFixed(2)),
    swabPressure: Number(totalChange.toFixed(2)),
    equivalentMudWeightSurge: Number((mudWeight + emwChange).toFixed(2)),
    equivalentMudWeightSwab: Number((mudWeight - emwChange).toFixed(2)),
  };
}
