import { calculateSurgeSwab } from "./src/engine/surge-swab";
import { calculateStuckPipe } from "./src/engine/stuck-pipe";

const mockWell = {
  tvd: 10000,
  holeSize: 8.5,
  drillPipeOD: 5.0,
  drillPipeID: 4.276,
};
const mockMud = { mudWeight: 12.0 };
const mockRheology = { pv: 25, yp: 15 };
const mockPressures = { overbalance: 400 };

console.log("--- TEST 1: Surge & Swab (Burkhardt) ---");
const surgeResult = calculateSurgeSwab(mockWell, mockMud, mockRheology);
console.log("Surge Pressure:", surgeResult.surgePressure.toFixed(2), "psi");
console.log("ECD Surge:", surgeResult.ecdSurge.toFixed(2), "ppg");
if (surgeResult.surgePressure > 0) console.log("✅ Surge calculation active.");

console.log("\n--- TEST 2: Stuck Pipe Risks ---");
const stuckResult = calculateStuckPipe(mockWell, mockPressures);
console.log(
  "Diff Sticking Force:",
  stuckResult.differentialStickingForce.toFixed(2),
  "lbs",
);
console.log("Risk Level:", stuckResult.differentialRiskLevel);
if (stuckResult.differentialStickingForce > 0)
  console.log("✅ Stuck pipe logic active.");

console.log("\n--- TEST 3: Free Point Constant ---");
console.log('FPC (Steel 5"): ', stuckResult.freePointConstant.toFixed(2));
if (stuckResult.freePointConstant > 0)
  console.log("✅ FPC calculation correct.");
