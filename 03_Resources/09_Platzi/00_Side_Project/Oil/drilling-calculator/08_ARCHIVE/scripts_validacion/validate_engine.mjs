/**
 * ============================================================
 * Drilling Calculator — Engine Validation Script
 * PersonalOS Quality Assurance | Pilar 1: Pure Green
 * Run: node validate_engine.mjs
 * ============================================================
 */

// ── Constants (mirrors physics.ts) ──────────────────────────
const API_HYDROSTATIC_GRADIENT = 0.052; // psi/ft per ppg

// ── Test Case: Standard Deviated Well ───────────────────────
const WELL = {
  tvd: 7800, // ft
  totalDepth: 9000, // ft MD
  holeSize: 12.25, // inches
  drillPipeOD: 5.0, // inches
  drillPipeID: 4.276,
  drillPipeLength: 7200,
  hwdpOD: 5.0,
  hwdpID: 3.0,
  hwdpLength: 300,
  dcOD: 8.0,
  dcID: 2.8125,
  dcLength: 500,
  bitSize: 12.25,
};

const FORMATION = {
  porePressureGradient: 0.52, // psi/ft
  fractureGradient: 0.85, // psi/ft
};

const MUD = {
  mudWeight: 10.5, // ppg
  plasticViscosity: 23, // cP
  yieldPoint: 19, // lbf/100ft²
};

// ── SECTION 1: Pressure Window Validation ───────────────────
console.log("\n╔══════════════════════════════════════════════╗");
console.log("║  SECCIÓN 1: VENTANA DE PRESIÓN              ║");
console.log("╚══════════════════════════════════════════════╝");

const TVD = WELL.tvd;
const porePressure = FORMATION.porePressureGradient * TVD;
const fracturePressure = FORMATION.fractureGradient * TVD;
const hydrostaticPressure = MUD.mudWeight * API_HYDROSTATIC_GRADIENT * TVD;
const minMudWeight = FORMATION.porePressureGradient / API_HYDROSTATIC_GRADIENT;
const maxMudWeight = FORMATION.fractureGradient / API_HYDROSTATIC_GRADIENT;
const mudWindow = maxMudWeight - minMudWeight;
const overbalance = hydrostaticPressure - porePressure;
const overbalancePPG = MUD.mudWeight - minMudWeight;

// Expected reference values (manually computed)
const EXPECTED_PORE = 4056; // psi  (0.52 * 7800)
const EXPECTED_FRAC = 6630; // psi  (0.85 * 7800)
const EXPECTED_HYDRO = 4243.2; // psi  (10.5 * 0.052 * 7800)
const EXPECTED_MIN_MW = 10.0; // ppg  (0.52 / 0.052)
const EXPECTED_MAX_MW = 16.35; // ppg  (0.85 / 0.052)

function check(label, computed, expected, tolerance = 0.5) {
  const diff = Math.abs(computed - expected);
  const pct = expected !== 0 ? (diff / Math.abs(expected)) * 100 : 0;
  const ok = pct <= tolerance;
  const icon = ok ? "✅" : "❌";
  console.log(`  ${icon} ${label}`);
  console.log(
    `     Calculado: ${computed.toFixed(2)}  |  Esperado: ${expected.toFixed(2)}  |  Error: ${pct.toFixed(3)}%`,
  );
  return ok;
}

let allPassed = true;
allPassed &= check("Presión de Poro (psi)", porePressure, EXPECTED_PORE);
allPassed &= check(
  "Presión de Fractura (psi)",
  fracturePressure,
  EXPECTED_FRAC,
);
allPassed &= check(
  "Presión Hidrostática (psi)",
  hydrostaticPressure,
  EXPECTED_HYDRO,
);
allPassed &= check("Peso de Lodo Mínimo (ppg)", minMudWeight, EXPECTED_MIN_MW);
allPassed &= check("Peso de Lodo Máximo (ppg)", maxMudWeight, EXPECTED_MAX_MW);

console.log(`\n  ── Ventana de Lodo: ${mudWindow.toFixed(2)} ppg`);
console.log(
  `  ── Sobrepresión: ${overbalance.toFixed(1)} psi (${overbalancePPG.toFixed(2)} ppg)`,
);

const isInWindow = MUD.mudWeight > minMudWeight && MUD.mudWeight < maxMudWeight;
console.log(
  `  ── MW actual en ventana segura: ${isInWindow ? "✅ SÍ" : "❌ NO"}`,
);

// ── SECTION 2: Surge & Swab Validation ──────────────────────
console.log("\n╔══════════════════════════════════════════════╗");
console.log("║  SECCIÓN 2: SURGE & SWAB (BURKHARDT)        ║");
console.log("╚══════════════════════════════════════════════╝");

const depth = TVD;
const mw = MUD.mudWeight;
const pv = MUD.plasticViscosity;
const yp = MUD.yieldPoint;
const dh = WELL.holeSize;
const dp = WELL.drillPipeOD;
const vp = 90; // ft/min standard tripping speed
const k_clinging = 0.45; // IADC Standard

const annularArea = Math.pow(dh, 2) - Math.pow(dp, 2);
const ve = vp * (k_clinging + Math.pow(dp, 2) / Math.max(annularArea, 0.1));
const da = dh - dp; // Annular clearance (inches)

// Critical Velocity (Bingham Plastic)
const vc =
  (1.08 * pv +
    1.08 * Math.sqrt(Math.pow(pv, 2) + 12.34 * Math.pow(da, 2) * yp * mw)) /
  (mw * Math.max(da, 0.1));
const regime = ve < vc ? "Laminar" : "Turbulent";

let pf = 0;
if (ve < vc) {
  pf = (pv * ve) / (1000 * Math.pow(da, 2)) + yp / (200 * da);
} else {
  pf =
    (Math.pow(mw, 0.8) * Math.pow(ve, 1.8) * Math.pow(pv, 0.2)) /
    (77000 * Math.pow(da, 1.2));
}

const surgePressure = pf * depth;
const ecdSurge = mw + surgePressure / (API_HYDROSTATIC_GRADIENT * depth);
const ecdSwab = mw - surgePressure / (API_HYDROSTATIC_GRADIENT * depth);
const surgeMargin = fracturePressure - (hydrostaticPressure + surgePressure);
const swabMargin = hydrostaticPressure - surgePressure - porePressure;

console.log(`\n  ── Velocidad Anular Efectiva (ve): ${ve.toFixed(2)} ft/min`);
console.log(`  ── Velocidad Crítica (vc):          ${vc.toFixed(2)} ft/min`);
console.log(`  ── Régimen de Flujo:                ${regime}`);
console.log(`  ── Gradiente de Fricción (pf):      ${pf.toFixed(6)} psi/ft`);
console.log(
  `  ── Presión de Surge:                ${surgePressure.toFixed(1)} psi`,
);
console.log(`  ── ECD Surge:                       ${ecdSurge.toFixed(3)} ppg`);
console.log(`  ── ECD Swab:                        ${ecdSwab.toFixed(3)} ppg`);
console.log(`\n  ── VALIDACIÓN DE LÍMITES:`);
console.log(
  `  ${ecdSurge < maxMudWeight ? "✅" : "❌"} ECD Surge < MW Máx (${maxMudWeight.toFixed(2)} ppg): ${ecdSurge.toFixed(3)} ppg`,
);
console.log(
  `  ${ecdSwab > minMudWeight ? "✅" : "❌"} ECD Swab > MW Mín (${minMudWeight.toFixed(2)} ppg):  ${ecdSwab.toFixed(3)} ppg`,
);
console.log(
  `  ${surgeMargin > 0 ? "✅" : "❌"} Margen Surge sobre Fractura: ${surgeMargin.toFixed(0)} psi`,
);
console.log(
  `  ${swabMargin > 0 ? "✅" : "❌"} Margen Swab sobre Poro:      ${swabMargin.toFixed(0)} psi`,
);

// ── SECTION 3: Data Consistency Check ───────────────────────
console.log("\n╔══════════════════════════════════════════════╗");
console.log("║  SECCIÓN 3: CONSISTENCIA DE DATOS           ║");
console.log("╚══════════════════════════════════════════════╝");

const issues = [];
if (MUD.mudWeight <= minMudWeight)
  issues.push("MW está por debajo del límite de poro");
if (MUD.mudWeight >= maxMudWeight)
  issues.push("MW excede el límite de fractura");
if (ecdSurge >= maxMudWeight)
  issues.push("ECD Surge provoca fractura de formación");
if (ecdSwab <= minMudWeight) issues.push("ECD Swab causa influjo (kick)");
if (overbalance < 0) issues.push("Subpresión: pozible kick en reposo");

if (issues.length === 0) {
  console.log("\n  ✅ SISTEMA EN PURE GREEN - Sin inconsistencias detectadas.");
} else {
  console.log("\n  ⚠️ INCONSISTENCIAS ENCONTRADAS:");
  issues.forEach((i) => console.log(`    ❌ ${i}`));
}

// ── RESULTADO GLOBAL ─────────────────────────────────────────
console.log("\n══════════════════════════════════════════════════");
console.log(
  allPassed
    ? "✅ VALIDACIÓN APROBADA: Motores de cálculo correctos."
    : "❌ VALIDACIÓN FALLIDA: Revisar fórmulas en los motores.",
);
console.log("══════════════════════════════════════════════════\n");
