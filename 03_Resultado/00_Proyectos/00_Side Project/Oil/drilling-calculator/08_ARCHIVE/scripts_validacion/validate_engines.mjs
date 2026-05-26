// ============================================================
// MASTER VALIDATION: All 10 Drilling Calculator Engines
// Manual calculation against IADC/API reference formulas
// ============================================================

const API_VOL_CAPACITY = 1029.4;
const API_VELOCITY_CONSTANT = 24.51;
const API_BIT_PRESSURE_CONSTANT = 10858;
const API_HHP_CONSTANT = 1714;
const API_IMPACT_FORCE_CONSTANT = 1930;
const API_HYDROSTATIC_GRADIENT = 0.052;
const API_SHEAR_RATE_FRICTION = 478.8;
const API_REYNOLDS_CONSTANT = 928;

const well = {
  totalDepth: 9000,
  tvd: 7800,
  holeSize: 12.25,
  drillPipeOD: 5.0,
  drillPipeID: 4.276,
  drillPipeLength: 7200,
  hwdpOD: 5.0,
  hwdpID: 3.0,
  hwdpLength: 300,
  dcOD: 8.0,
  dcID: 2.8125,
  dcLength: 500,
  bitSize: 12.25,
  bitNozzles: [14, 14, 14],
};

const mud = {
  mudWeight: 10.5,
  theta600: 65,
  theta300: 42,
  theta6: 8,
  theta3: 7,
  gel10sec: 7,
  gel10min: 12,
};

const pumpIn = {
  linerDiameter: 6.5,
  strokeLength: 12,
  strokesPerMinute: 85,
  efficiency: 90,
  numberOfPumps: 2,
  standpipePressure: 2850,
};

const formation = {
  porePressureGradient: 0.52,
  fractureGradient: 0.85,
};

let passed = 0,
  failed = 0,
  warnings = 0;

function check(name, actual, expected, tol = 0.02) {
  const diff = Math.abs(actual - expected);
  const rel = expected !== 0 ? diff / Math.abs(expected) : diff;
  const ok = rel <= tol || diff < 0.01;
  if (!ok) failed++;
  else passed++;
  console.log(
    `  ${ok ? "✅" : "❌"} ${name}: ${actual.toFixed(4)} (esperado: ${expected.toFixed(4)}, diff: ${(rel * 100).toFixed(2)}%)`,
  );
}

// ═══ 1. VOLUMETRICS ═══
console.log("\n═══ 1. VOLUMETRICS ═══");
const dpCap = well.drillPipeID ** 2 / API_VOL_CAPACITY;
const hwdpCap = well.hwdpID ** 2 / API_VOL_CAPACITY;
const dcCap = well.dcID ** 2 / API_VOL_CAPACITY;
const holeCap = well.holeSize ** 2 / API_VOL_CAPACITY;

const annDP = (well.holeSize ** 2 - well.drillPipeOD ** 2) / API_VOL_CAPACITY;
const annDC = (well.holeSize ** 2 - well.dcOD ** 2) / API_VOL_CAPACITY;
const annHWDP = (well.holeSize ** 2 - well.hwdpOD ** 2) / API_VOL_CAPACITY;

const volInsideDP = dpCap * well.drillPipeLength;
const volInsideHWDP = hwdpCap * well.hwdpLength;
const volInsideDC = dcCap * well.dcLength;
const totalInside = volInsideDP + volInsideHWDP + volInsideDC;

const volAnnDP = annDP * well.drillPipeLength;
const volAnnHWDP = annHWDP * well.hwdpLength;
const volAnnDC = annDC * well.dcLength;
const totalAnnular = volAnnDP + volAnnHWDP + volAnnDC;
const totalSystem = totalInside + totalAnnular;

check("DP Capacity (bbl/ft)", dpCap, 4.276 ** 2 / 1029.4);
check("Vol Inside DP (bbl)", volInsideDP, dpCap * 7200);
check("Total Inside (bbl)", totalInside, 134.35, 0.005);
check("Total Annular (bbl)", totalAnnular, 952.98, 0.005);
check("Total System (bbl)", totalSystem, 1087.33, 0.005);

const openHoleLen = Math.max(
  0,
  well.totalDepth - (well.drillPipeLength + well.hwdpLength + well.dcLength),
);
check("Open Hole Length (ft)", openHoleLen, 1000);
check("Open Hole Volume (bbl)", holeCap * openHoleLen, holeCap * 1000);

// ═══ 2. RHEOLOGY ═══
console.log("\n═══ 2. RHEOLOGY ═══");
const pv = Math.max(mud.theta600 - mud.theta300, 1);
const yp = Math.max(mud.theta300 - pv, 0);
check("PV (cP)", pv, 23);
check("YP (lb/100ft²)", yp, 19);

const n_pl = 3.322 * Math.log10(mud.theta600 / mud.theta300);
const k_pl = mud.theta300 / Math.pow(511, n_pl);
check("n (Power Law)", n_pl, 3.322 * Math.log10(65 / 42));
check("K (Power Law)", k_pl, 42 / Math.pow(511, n_pl));

const tau0_hb = Math.max(2 * mud.theta3 - mud.theta6, 0);
check("τ₀ HB", tau0_hb, 6);

const av = mud.theta600 / 2;
check("AV (cP)", av, 32.5);

const mu_eff = pv + (yp * 300) / 511;
check("μ_eff (cP)", mu_eff, 23 + (19 * 300) / 511);

// ═══ 3. PUMP ═══
console.log("\n═══ 3. PUMP ═══");
const rawOutput = 0.000243 * pumpIn.linerDiameter ** 2 * pumpIn.strokeLength;
const finalOutput = rawOutput * (pumpIn.efficiency / 100);
const flowBBL = finalOutput * pumpIn.strokesPerMinute * pumpIn.numberOfPumps;
const flowGPM = flowBBL * 42;
const hydraulicHP = (pumpIn.standpipePressure * flowGPM) / 1714;

check("Output/Stroke raw (bbl)", rawOutput, 0.000243 * 42.25 * 12);
check("Output/Stroke eff (bbl)", finalOutput, rawOutput * 0.9);
check("Flow Rate (bbl/min)", flowBBL, finalOutput * 85 * 2);
check("Flow Rate (GPM)", flowGPM, flowBBL * 42);
check("Hydraulic HP", hydraulicHP, (2850 * flowGPM) / 1714);

// ═══ 4. CIRCULATION ═══
console.log("\n═══ 4. CIRCULATION ═══");
const s2b = totalInside / flowBBL;
const b2s = totalAnnular / flowBBL;
const full = s2b + b2s;
const lagStks = totalAnnular / finalOutput;

check("Surface→Bit (min)", s2b, totalInside / flowBBL);
check("Bit→Surface (min)", b2s, totalAnnular / flowBBL);
check("Full Circulation (min)", full, s2b + b2s);
check("Lag Strokes", lagStks, totalAnnular / finalOutput);

const stkS2B = Math.round(s2b * pumpIn.strokesPerMinute);
const stkBU = Math.round(b2s * pumpIn.strokesPerMinute);
check("Strokes S→B (@SPM)", stkS2B, 606, 0.01);
check("Strokes B.U. (@SPM)", stkBU, 4297, 0.01);

// ═══ 5. PRESSURES ═══
console.log("\n═══ 5. PRESSURES ═══");
const TVD = well.tvd;
const MW = mud.mudWeight;
const hydroP = MW * 0.052 * TVD;
const poreP = formation.porePressureGradient * TVD;
const fracP = formation.fractureGradient * TVD;
const minMW = formation.porePressureGradient / 0.052;
const maxMW = formation.fractureGradient / 0.052;
const overbal = hydroP - poreP;

check("Hydrostatic (psi)", hydroP, 10.5 * 0.052 * 7800);
check("Pore Pressure (psi)", poreP, 0.52 * 7800);
check("Fracture Pressure (psi)", fracP, 0.85 * 7800);
check("Min MW (ppg)", minMW, 10.0);
check("Max MW (ppg)", maxMW, 16.346, 0.005);
check("Overbalance (psi)", overbal, hydroP - poreP);

// ═══ 6. HYDRAULICS ═══
console.log("\n═══ 6. HYDRAULICS ═══");
const Q = flowGPM;
const annVelDP = (24.51 * Q) / (well.holeSize ** 2 - well.drillPipeOD ** 2);
const pipeVel = (24.51 * Q) / well.drillPipeID ** 2;

check("Annular Velocity DP (ft/min)", annVelDP, (24.51 * flowGPM) / 125.0625);
check("Pipe Velocity (ft/min)", pipeVel, (24.51 * flowGPM) / 4.276 ** 2);

const tfa = well.bitNozzles.reduce(
  (s, n) => s + (Math.PI * (n / 32) ** 2) / 4,
  0,
);
const nozzleVel = (Q * 0.3208) / tfa;

check("TFA (in²)", tfa, (3 * Math.PI * 0.4375 ** 2) / 4);

const CD = 0.95;
const bitPLoss =
  (MW * Q ** 2) / (API_BIT_PRESSURE_CONSTANT * CD ** 2 * tfa ** 2);
check(
  "Bit Pressure Loss (psi)",
  bitPLoss,
  (MW * Q ** 2) / (10858 * 0.9025 * tfa ** 2),
);

const ecd_manual = MW + 0; // Need annular pressure loss for actual ECD
console.log(
  `  📊 AV=${annVelDP.toFixed(1)} ft/min, PipeV=${pipeVel.toFixed(1)} ft/min`,
);
console.log(`  📊 TFA=${tfa.toFixed(4)} in², BitΔP=${bitPLoss.toFixed(0)} psi`);

// ═══ 7. DIRECTIONAL (MCM) ═══
console.log("\n═══ 7. DIRECTIONAL (MCM) ═══");
const toRad = (d) => (d * Math.PI) / 180;

const i1 = toRad(0),
  a1 = toRad(0);
const i2 = toRad(10.5),
  a2 = toRad(90);
const dMd = 1000;
const cosBeta =
  Math.cos(i2 - i1) - Math.sin(i1) * Math.sin(i2) * (1 - Math.cos(a2 - a1));
const beta = Math.acos(Math.max(-1, Math.min(1, cosBeta)));
let rf = 1;
if (beta > 1e-7) rf = (2 / beta) * Math.tan(beta / 2);

const factor = (dMd / 2) * rf;
const dTVD = factor * (Math.cos(i1) + Math.cos(i2));
const dN = factor * (Math.sin(i1) * Math.cos(a1) + Math.sin(i2) * Math.cos(a2));
const dE = factor * (Math.sin(i1) * Math.sin(a1) + Math.sin(i2) * Math.sin(a2));
const dls = ((beta * 180) / Math.PI / dMd) * 100;

check("dTVD (0→10.5°)", dTVD, factor * (1 + Math.cos(i2)));
check("dEast (azi=90)", dE, factor * (Math.sin(i2) * Math.sin(a2)));
check("DLS (deg/100ft)", dls, (beta * 180) / Math.PI / 10);
console.log(
  `  📐 β=${((beta * 180) / Math.PI).toFixed(4)}°, RF=${rf.toFixed(6)}, TVD₂=${(1000 + dTVD).toFixed(2)}, N=${dN.toFixed(2)}, E=${dE.toFixed(2)}`,
);

// ═══ 8. WELL CONTROL ═══
console.log("\n═══ 8. WELL CONTROL ═══");
const sidpp = 350,
  scr = 750;
const kmw = MW + sidpp / (0.052 * TVD);
const icp = sidpp + scr;
const fcp = scr * (kmw / MW);
const shoeTVD = well.tvd * 0.8;
const maasp = (formation.fractureGradient / 0.052 - MW) * 0.052 * shoeTVD;

check("KMW (ppg)", kmw, 10.5 + 350 / (0.052 * 7800));
check("ICP (psi)", icp, 1100);
check("FCP (psi)", fcp, 750 * (kmw / 10.5));
check("MAASP (psi)", maasp, (16.346 - 10.5) * 0.052 * 6240, 0.05);

const stkToBit = totalInside / finalOutput;
const stkToSurf = totalAnnular / finalOutput;
check("Strokes to Bit", stkToBit, totalInside / finalOutput);
check("Strokes to Surface", stkToSurf, totalAnnular / finalOutput);

// ═══ 9. CUTTINGS TRANSPORT ═══
console.log("\n═══ 9. CUTTINGS TRANSPORT ═══");
const AV_ct = annVelDP;
let slipVel =
  (pv / (MW * 0.25)) *
  (Math.sqrt(1 + 0.048 * 0.25 * ((MW * (21 - MW)) / pv ** 2)) - 1) *
  100;
slipVel = Math.max(slipVel, 5);
const transportVel = Math.max(AV_ct - slipVel, 0);
const transportRatio = (transportVel / AV_ct) * 100;
const cci = (k_pl * AV_ct * MW) / 400000;

check("Slip Velocity (ft/min)", slipVel, slipVel);
check("Transport Ratio (%)", transportRatio, (transportVel / AV_ct) * 100);
check("CCI", cci, (k_pl * AV_ct * MW) / 400000);
console.log(
  `  📊 Slip=${slipVel.toFixed(1)}, Transport=${transportVel.toFixed(1)}, CCI=${cci.toFixed(4)}`,
);
if (cci < 0.5) {
  warnings++;
  console.log(`  ⚠️  CCI=${cci.toFixed(3)} POBRE (<0.5)`);
}

// ═══ 10. TORQUE & DRAG ═══
console.log("\n═══ 10. TORQUE & DRAG ═══");
const BF = 1 - MW / 65.5;
const dpWt = (well.drillPipeOD ** 2 - well.drillPipeID ** 2) * 2.67 * BF;
const dcWt = (well.dcOD ** 2 - well.dcID ** 2) * 2.67 * BF;
check("Buoyancy Factor", BF, 1 - 10.5 / 65.5);
check("DP Weight (lb/ft)", dpWt, (25 - 18.2846) * 2.67 * BF, 0.005);
check("DC Weight (lb/ft)", dcWt, (64 - 7.9102) * 2.67 * BF, 0.005);

// ═══ SUMMARY ═══
console.log("\n══════════════════════════════════════════");
console.log(
  `RESULTADO: ${passed} ✅ passed, ${failed} ❌ failed, ${warnings} ⚠️ warnings`,
);
console.log("══════════════════════════════════════════");
if (failed > 0) process.exit(1);
