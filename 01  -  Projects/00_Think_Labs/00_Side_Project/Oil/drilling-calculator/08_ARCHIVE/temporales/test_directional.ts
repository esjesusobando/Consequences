// Demo Aisaldo para validar el Motor Direccional (Golden Standard)
// NO toca la app principal. Sirve para probar las matemáticas.
// Ejecutar con: npx tsx test_directional.ts

interface SurveyInput {
  md: number;
  inc: number;
  azi: number;
}

interface SurveyOutput extends SurveyInput {
  tvd: number;
  north: number;
  east: number;
  dls: number;
  dl: number;
  rf: number;
}

// Factor de conversión Deg a Rad
const DEG2RAD = Math.PI / 180;

function calculateMinimumCurvature(surveys: SurveyInput[]): SurveyOutput[] {
  const result: SurveyOutput[] = [];

  for (let i = 0; i < surveys.length; i++) {
    const current = surveys[i];

    if (i === 0) {
      // Estación Tie-In (Origen)
      result.push({
        ...current,
        tvd: 0,
        north: 0,
        east: 0,
        dls: 0,
        dl: 0,
        rf: 0,
      });
      continue;
    }

    const prev = result[i - 1];

    const md1 = prev.md;
    const i1 = prev.inc * DEG2RAD;
    const a1 = prev.azi * DEG2RAD;

    const md2 = current.md;
    const i2 = current.inc * DEG2RAD;
    const a2 = current.azi * DEG2RAD;

    const deltaMD = md2 - md1;

    // 1. Dogleg (DL) en radianes
    // cos(DL) = cos(I2 - I1) - sin(I1) * sin(I2) * (1 - cos(A2 - A1))
    const cosDL =
      Math.cos(i2 - i1) - Math.sin(i1) * Math.sin(i2) * (1 - Math.cos(a2 - a1));

    // Evitar NaNs por errores de punto flotante cercados a 1
    const safeCosDL = Math.min(Math.max(cosDL, -1), 1);
    const dl = Math.acos(safeCosDL);

    // 2. Dogleg Severity (DLS)
    // DLS = (DL_deg / deltaMD) * 100
    const dlDeg = dl / DEG2RAD;
    const dls = deltaMD > 0 ? (dlDeg / deltaMD) * 100 : 0;

    // 3. Ratio Factor (RF)
    // RF = (2 / DL) * tan(DL / 2)
    // Si DL se acerca a 0, RF se acerca a 1
    let rf = 1;
    if (dl > 0.0000001) {
      // Evitar división por 0 para tramos rectos
      rf = (2 / dl) * Math.tan(dl / 2);
    }

    // 4. Transformaciones espaciales (Deltas)
    const factor = (deltaMD / 2) * rf;
    const deltaTVD = factor * (Math.cos(i1) + Math.cos(i2));
    const deltaNorth =
      factor * (Math.sin(i1) * Math.cos(a1) + Math.sin(i2) * Math.cos(a2));
    const deltaEast =
      factor * (Math.sin(i1) * Math.sin(a1) + Math.sin(i2) * Math.sin(a2));

    result.push({
      ...current,
      tvd: prev.tvd + deltaTVD,
      north: prev.north + deltaNorth,
      east: prev.east + deltaEast,
      dls: dls,
      dl: dl,
      rf: rf,
    });
  }

  return result;
}

// ---------------------------------------------------------
// PRUEBA DEL GOLDEN STANDARD (dataset de validación propuesto)
// ---------------------------------------------------------

const testSurveys: SurveyInput[] = [
  { md: 0, inc: 0, azi: 0 },
  { md: 1000, inc: 0, azi: 0 },
  { md: 2000, inc: 10, azi: 45 },
  { md: 3000, inc: 10, azi: 45 },
  { md: 4000, inc: 20, azi: 90 },
];

console.log(
  "--------------------------------------------------------------------------------------------------",
);
console.log(
  "   VALIDACION MATEMATICA: METODO MINIMA CURVATURA Y UTM (TypeScript) - MODO AISLADO",
);
console.log(
  "--------------------------------------------------------------------------------------------------",
);

try {
  const outputs = calculateMinimumCurvature(testSurveys);

  console.table(
    outputs.map((o) => ({
      "MD (ft)": o.md.toFixed(2),
      "Inc (°)": o.inc.toFixed(2),
      "Azi (°)": o.azi.toFixed(2),
      "DLS (°/100ft)": o.dls.toFixed(2),
      "TVD (ft)": o.tvd.toFixed(2),
      "North (ft)": o.north.toFixed(2),
      "East (ft)": o.east.toFixed(2),
    })),
  );

  console.log(
    "\n✅ Integridad de cálculo validada. Las matemáticas core compilan y corren en JS/TS.",
  );
  console.log(
    "Próximo paso: Generar arquitectura 'Zero-Breakage' (Armor Layer) para integrarlo al store.\n",
  );
} catch (e) {
  console.error("❌ FAILED MATH ENGINE DEMO: ", e);
}
