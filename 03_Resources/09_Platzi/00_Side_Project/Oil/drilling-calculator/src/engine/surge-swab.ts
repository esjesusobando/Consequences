import {
  API_HYDROSTATIC_GRADIENT,
  API_REYNOLDS_CONSTANT,
  calcApparentViscosityBingham,
  classifyFlowRegime,
} from "./physics";
import { safeDivide } from "./utils/validation";

/**
 * Surge and Swab Pressure Engine
 * Simplified Bingham Plastic model (Bourgoyne §4 / API RP 13D).
 * NOTE: this is the field-use approximation. Full API RP 13D §4.6.2 iterative
 * method (slot-flow with exact Reynolds + pressure convergence) is more accurate
 * but computationally heavier; keep this for real-time UI responsiveness.
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
  ecdSurge: number; // ppg
  ecdSwab: number; // ppg
  effectiveAnnularVelocity: number; // ft/min (Burkhardt F12)
  flowRegimeSurge: "Laminar" | "Turbulent" | "Transition";
  modelUsed: string;
  pipeSpeed: number; // ft/min (pass-through of pipeVelocity)
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

  // 0. Zero-velocity equilibrium: no pipe movement => no dynamic pressure.
  // ECDs collapse to the static mud weight; no yield contribution without motion.
  if (pipeVelocity <= 0) {
    return {
      surgePressure: 0,
      swabPressure: 0,
      ecdSurge: mudWeight,
      ecdSwab: mudWeight,
      effectiveAnnularVelocity: 0,
      flowRegimeSurge: "Laminar",
      modelUsed: "Burkhardt",
      pipeSpeed: pipeVelocity,
    };
  }

  // 1. Calculate Surge/Swab Pressure Gradient (Simplified Bingham)
  // Formula: DeltaP (psi) = [ (PV * v / (1000 * (Dh - Dp))) + (YP / (200 * (Dh - Dp))) ] * (L / 1000)
  // Note: This is a common approximation for field use.

  const diameterDiff = Math.max(0.1, holeDiameter - pipeDiameter);

  const frictionComponent = safeDivide(
    plasticViscosity * pipeVelocity,
    1000 * diameterDiff,
  );

  const yieldComponent = safeDivide(yieldPoint, 200 * diameterDiff);

  const totalGradientPer1000ft = frictionComponent + yieldComponent;
  const totalChange = totalGradientPer1000ft * (pipeLength / 1000);

  // 2. Equivalent Mud Weight (EMW)
  // EMW = MW + DeltaP / (0.052 * L)
  const emwChange = safeDivide(
    totalChange,
    API_HYDROSTATIC_GRADIENT * pipeLength,
  );

  // 3. Annular displacement velocity (Burkhardt F12)
  // v_ann = v_pipe * Dp^2 / (Dh^2 - Dp^2). Invalid annulus (Dh <= Dp) => no displacement.
  const annulusArea = holeDiameter ** 2 - pipeDiameter ** 2;
  const effectiveAnnularVelocity =
    annulusArea > 0 ? (pipeVelocity * pipeDiameter ** 2) / annulusArea : 0;

  // 4. Flow regime via Reynolds number (API RP 13D F7)
  const muEff = calcApparentViscosityBingham(plasticViscosity, yieldPoint);
  const reynolds =
    muEff > 0
      ? (API_REYNOLDS_CONSTANT *
          mudWeight *
          effectiveAnnularVelocity *
          diameterDiff) /
        muEff
      : 0;
  const flowRegimeSurge: SurgeSwabResult["flowRegimeSurge"] = classifyFlowRegime(reynolds);

  return {
    surgePressure: Number(totalChange.toFixed(2)),
    swabPressure: -Number(totalChange.toFixed(2)),
    ecdSurge: Number((mudWeight + emwChange).toFixed(2)),
    ecdSwab: Number((mudWeight - emwChange).toFixed(2)),
    effectiveAnnularVelocity: Number(effectiveAnnularVelocity.toFixed(2)),
    flowRegimeSurge,
    modelUsed: "Burkhardt",
    pipeSpeed: pipeVelocity,
  };
}
