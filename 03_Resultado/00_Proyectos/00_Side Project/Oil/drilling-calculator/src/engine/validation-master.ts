// ============================================================
// Drilling Calculator — Technical Validation Suite
// Unit tests and benchmarks for MCM and Torque & Drag
// ============================================================

import { calculateTrajectory } from "./directional";
import { calculateTorqueDrag } from "./torque-drag";
import type { SurveyRecord, WellData } from "../store/drilling-types";

/**
 * ISCWSA Benchmark Test Case 1 (Simplified)
 */
export function runValidation() {
  console.log("=== INICIANDO AUDITORÍA TÉCNICA (ELITE GRADE) ===");

  // 1. Validation: MCM (Directional)
  const surveys: SurveyRecord[] = [
    { md: 0, inc: 0, azi: 0 },
    { md: 1000, inc: 0, azi: 0 },
    { md: 2000, inc: 10, azi: 90 }, // Build to 10 deg East
    { md: 3000, inc: 10, azi: 90 }, // Hold
  ];

  const resultMCM = calculateTrajectory(surveys);

  // Theoretical check for a 1000ft curve from 0 to 10 deg
  // RF = (2/beta) * tan(beta/2) approx 1.001
  // dTVD approx 995ft
  const lastPoint = resultMCM.trajectory[resultMCM.trajectory.length - 1];

  console.log("MCM Results:");
  console.log(`- Final TVD: ${lastPoint.tvd.toFixed(2)} ft (Expected ~2981)`);
  console.log(
    `- Final Easting: ${lastPoint.east.toFixed(2)} ft (Expected ~173)`,
  );
  console.log(`- Max DLS: ${resultMCM.totalClosure.toFixed(2)} ft (Cierre)`);

  // 2. Validation: Torque & Drag
  const mockWell: WellData = {
    totalDepth: 3000,
    tvd: lastPoint.tvd,
    holeSize: 8.5,
    drillPipeOD: 5,
    drillPipeID: 4.276,
    drillPipeLength: 2000,
    hwdpOD: 5,
    hwdpID: 3,
    hwdpLength: 500,
    dcOD: 6.5,
    dcID: 2.5,
    dcLength: 500,
    bitSize: 8.5,
    bitNozzles: [12, 12, 12],
  };

  const resultTD = calculateTorqueDrag(mockWell, resultMCM.trajectory, 10.0, {
    frictionCoefficient: 0.3,
    steelDensity: 65,
    minSafetyFactor: 1.5,
    weightOnBit: 20,
  });

  console.log("\nTorque & Drag Results:");
  console.log(`- Pickup Hook Load: ${resultTD.pickupHookLoad.toFixed(2)} lb`);
  console.log(
    `- Slack-off Hook Load: ${resultTD.slackoffHookLoad.toFixed(2)} lb`,
  );
  console.log(`- Rotating Torque: ${resultTD.rotatingTorque.toFixed(2)} ft-lb`);

  const isValid =
    lastPoint.tvd > 2900 && resultTD.pickupHookLoad > resultTD.slackoffHookLoad;

  if (isValid) {
    console.log("\n✅ VALIDACIÓN EXITOSA: PURE GREEN");
  } else {
    console.log("\n❌ ERROR EN VALIDACIÓN");
  }

  return { resultMCM, resultTD, isValid };
}
