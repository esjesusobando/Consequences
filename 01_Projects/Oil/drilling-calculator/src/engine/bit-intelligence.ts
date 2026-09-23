// ============================================================
// Drilling Calculator — Bit Intelligence Engine
// Nozzle recommendation & hydraulic optimization
// ============================================================

export interface NozzleRecommendation {
  nozzles: number[];
  tfa: number;
  hsi: number;
  impactForce: number;
  pressureDrop: number;
  score: number; // 0-100 based on HSI target (2-7)
}

/**
 * Recommends optimal nozzle sizes to achieve target hydraulics.
 * Priority: HSI between 2.0 and 7.0, then maximizing impact force.
 */
export function recommendNozzles(
  wellSize: number,
  mudWeight: number,
  flowRate: number,
): NozzleRecommendation[] {
  if (flowRate <= 0 || wellSize <= 0) return [];

  const standardSizes = [8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20];
  const results: NozzleRecommendation[] = [];
  const bitArea = (Math.PI * Math.pow(wellSize, 2)) / 4;
  const Cd = 0.95;

  // Simulate combinations of 3 nozzles for simplification
  for (let i = 0; i < standardSizes.length; i++) {
    for (let j = i; j < standardSizes.length; j++) {
      for (let k = j; k < standardSizes.length; k++) {
        const combo = [standardSizes[i], standardSizes[j], standardSizes[k]];
        const tfa = combo.reduce(
          (s, n) => s + (Math.PI * Math.pow(n / 32, 2)) / 4,
          0,
        );

        if (tfa <= 0) continue;

        const pressureDrop =
          (mudWeight * Math.pow(flowRate, 2)) /
          (10858 * Math.pow(Cd, 2) * Math.pow(tfa, 2));
        const velocity = (flowRate * 0.3208) / tfa;
        const hhp = (pressureDrop * flowRate) / 1714;
        const hsi = hhp / bitArea;
        const impactForce = 0.01823 * mudWeight * flowRate * velocity;

        // Score based on ideal HSI range (2-7)
        let score = 0;
        if (hsi >= 2 && hsi <= 7) {
          score = 100 - Math.abs(hsi - 4.5) * 10; // Peak at 4.5
        } else if (hsi < 2) {
          score = hsi * 25;
        } else {
          score = Math.max(0, 100 - (hsi - 7) * 20);
        }

        results.push({
          nozzles: combo,
          tfa,
          hsi,
          impactForce,
          pressureDrop,
          score,
        });
      }
    }
  }

  // Sort by score and take top 5
  return results.sort((a, b) => b.score - a.score).slice(0, 5);
}

/**
 * Checks for crossflow potential and other risks.
 */
export function analyzeBitRisks(hsi: number) {
  const risks: string[] = [];
  if (hsi < 2.0)
    risks.push(
      "Bajo HSI: Riesgo de embotamiento (Bit Balling) en formaciones arcillosas.",
    );
  if (hsi > 7.0)
    risks.push(
      "Alto HSI: Riesgo de erosión excesiva en la estructura de corte o fondo del pozo.",
    );
  return risks;
}
