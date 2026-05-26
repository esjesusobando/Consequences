import { calculateMechanics } from "../../../../src/engine/mechanics";
// Mock data mimicking the store state
const wellData = {
  tvd: 10000,
  holeSize: 8.5,
  drillPipeOD: 5.0,
  drillPipeID: 4.276,
};
const mudData = { mudWeight: 12.0 };
const rheology = { pv: 25, yp: 15 };
const pressures = { overbalance: 500 };
const directional = { trajectory: [{ dls: 5.0 }, { dls: 2.0 }] };
const cuttings = { cuttingCarryingIndex: 0.4 };

async function runMasterValidation() {
  console.log("🚀 INICIANDO VALIDACIÓN QUÍNTUPLE: MOTOR MECHANICS\n");

  const results = calculateMechanics(
    wellData,
    mudData,
    rheology,
    pressures,
    directional,
    cuttings,
  );

  // 1. Agente Surge/Swab
  console.log("1. Agente Surge (Burkhardt):");
  const surgeOk = Math.abs(results.surgePressure - 1272) < 10;
  console.log(
    surgeOk
      ? "   ✅ PASSED: 1272 psi ok"
      : `   ❌ FAILED: ${results.surgePressure} psi`,
  );

  // 2. Agente Sticking Force
  console.log("2. Agente Sticking Force:");
  const forceOk = results.differentialStickingForce === 18750;
  console.log(
    forceOk
      ? "   ✅ PASSED: 18,750 lbs ok"
      : `   ❌ FAILED: ${results.differentialStickingForce} lbs`,
  );

  // 3. Agente Key Seating
  console.log("3. Agente Key Seating:");
  const keyOk = results.keySeatingRisk === "High";
  console.log(
    keyOk
      ? "   ✅ PASSED: High Risk detected"
      : "   ❌ FAILED: Risk not detected",
  );

  // 4. Agente Hole Cleaning
  console.log("4. Agente Hole Cleaning:");
  const cleaningOk = results.holeCleaningRisk === "High";
  console.log(
    cleaningOk
      ? "   ✅ PASSED: High Risk detected (CCI < 0.5)"
      : "   ❌ FAILED",
  );

  // 5. Agente Free Point
  console.log("5. Agente Free Point (FPC):");
  const fpcOk = results.freePointConstant > 0;
  console.log(
    fpcOk
      ? `   ✅ PASSED: FPC = ${results.freePointConstant.toFixed(0)}`
      : "   ❌ FAILED",
  );

  console.log(
    "\n🏁 RESULTADO FINAL: " +
      (surgeOk && forceOk && keyOk && cleaningOk && fpcOk
        ? "PURE GREEN"
        : "REVISIÓN REQUERIDA"),
  );
}

runMasterValidation();
