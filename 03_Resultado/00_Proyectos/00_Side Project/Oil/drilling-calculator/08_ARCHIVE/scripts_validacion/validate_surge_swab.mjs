/**
 * AGENTE DE VALIDACIÓN BENCHMARK: SURGE & SWAB
 * Valida los cálculos del modelo de Burkhardt para un escenario estándar.
 */

const params = {
  depth: 10000, // ft
  mw: 12.0, // ppg
  pv: 25, // cp
  yp: 15, // lb/100ft2
  dh: 8.5, // in
  dp: 5.0, // in
  vp: 90, // ft/min (Velocidad de tubería)
  k: 0.45, // Clinging constant (IADC Std)
};

function validateSurgeSwab() {
  console.log("--- BENCHMARK SURGE & SWAB ---");
  const { depth, mw, pv, yp, dh, dp, vp, k } = params;

  // 1. Velocidad Efectiva de Anular (Ve)
  const clearanceArea = Math.pow(dh, 2) - Math.pow(dp, 2);
  const ve = vp * (k + Math.pow(dp, 2) / clearanceArea);
  console.log(`1. Velocidad Efectiva (Ve): ${ve.toFixed(2)} ft/min`);

  // 2. Parámetros de geometría
  const da = dh - dp; // Annular clearance (in)

  // 3. Velocidad Crítica (Vc) - Bingham Plastic
  const vc =
    (1.08 * pv +
      1.08 * Math.sqrt(Math.pow(pv, 2) + 12.34 * Math.pow(da, 2) * yp * mw)) /
    (mw * da);
  console.log(`2. Velocidad Crítica (Vc): ${vc.toFixed(2)} ft/min`);

  const flowType = ve < vc ? "LAMINARIO" : "TURBULENTO";
  console.log(`3. Régimen de Flujo: ${flowType}`);

  // 4. Gradiente de Fricción (Pf) en psi/ft
  let pf = 0;
  if (ve < vc) {
    // Laminar Pf
    pf = (pv * ve) / (1000 * Math.pow(da, 2)) + yp / (200 * da);
  } else {
    // Turbulent Pf
    pf =
      (Math.pow(mw, 0.8) * Math.pow(ve, 1.8) * Math.pow(pv, 0.2)) /
      (77000 * Math.pow(da, 1.2));
  }
  console.log(`4. Gradiente de Fricción (Pf): ${pf.toFixed(6)} psi/ft`);

  // 5. Presiones Totales
  const p_surge_swab = pf * depth;
  const ecd_surge = mw + p_surge_swab / (0.052 * depth);
  const ecd_swab = mw - p_surge_swab / (0.052 * depth);

  console.log(`5. Presión Surge/Swab (dP): ${p_surge_swab.toFixed(2)} psi`);
  console.log(`6. ECD Surge (Down): ${ecd_surge.toFixed(2)} ppg`);
  console.log(`7. ECD Swab (Up): ${ecd_swab.toFixed(2)} ppg`);

  return { ve, pf, p_surge_swab, ecd_surge, ecd_swab };
}

validateSurgeSwab();
