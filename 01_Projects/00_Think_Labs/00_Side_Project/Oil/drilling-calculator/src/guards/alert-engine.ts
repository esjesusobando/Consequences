// ============================================================
// Drilling Calculator — Alert Engine
// Aggregates V1/V2 validations into prioritized alerts
// ============================================================

import type { DrillingAlert, DrillingResults } from "../store/drilling-types";

/**
 * Generate prioritized, deduplicated alerts from all calculation outputs.
 * Integration of holistic risks (Pilar 0 & 1).
 */
export function generateAlerts(results: DrillingResults): DrillingAlert[] {
  const alerts: DrillingAlert[] = [];
  const {
    pressures,
    hydraulics,
    stuckPipe,
    torqueDrag,
    directional,
    cuttings,
    surgeSwab,
  } = results;

  // ─── Ventana de Lodo y Márgenes de Seguridad (Crítico) ────
  // const kickMargin = pressures.overbalancePPG;
  // const lossMargin = pressures.mudWindow - pressures.overbalancePPG;

  // ALERT: BAJO BALANCE (KICK)
  if (pressures.overbalance < 0) {
    alerts.push({
      level: "critical",
      message: `BAJO BALANCE (KICK): Pobreza de carga hidrostática`,
      detail: `Presión de Poro excede la presión osmótica de fondo. ¡ACCION INMEDIATA!: Monitorear pozo y cerrar preventoras si hay flujo.`,
      module: "OPERACIONAL",
    });
  }

  // ALERT: SOBREBALANCE CRÍTICO (PÉRDIDA)
  if (
    pressures.overbalancePPG > pressures.mudWindow &&
    pressures.mudWindow > 0
  ) {
    alerts.push({
      level: "critical",
      message: `SOBREBALANCE CRÍTICO: Peligro de Fractura`,
      detail: `Densidad actual excede límite de fractura del zapato/formación. Riesgo de pérdida masiva.`,
      module: "OPERACIONAL",
    });
  }

  // ─── Stuck Pipe & Mechanical Risks (Interconexión) ────────
  if (stuckPipe.differentialRiskLevel === "High") {
    alerts.push({
      level: "warning",
      message: "RIESGO ALTO DE PEGA DIFERENCIAL",
      detail: `Sobrebalance de ${pressures.overbalance.toFixed(0)} psi detectado. Mantener tubería en movimiento y optimizar reología.`,
      module: "MECÁNICA",
    });
  }

  if (stuckPipe.keySeatingRisk === "High") {
    alerts.push({
      level: "warning",
      message: "RIESGO DE OJO DE LLAVE (KEY SEATING)",
      detail: `DLS elevado detectado en zona de alta tensión. Posible formación de surco en la pared del pozo.`,
      module: "DIRECCIONAL",
    });
  }

  // ─── Torque & Drag Integration ───────────────────────────
  const tensileRatio =
    torqueDrag.pickupHookLoad / (torqueDrag.tensileLimit || 1);
  if (tensileRatio > 0.85) {
    alerts.push({
      level: "critical",
      message: "LÍMITE DE TENSIÓN PRÓXIMO",
      detail: `Carga en el gancho al 85% del límite elástico (${torqueDrag.tensileLimit} klbs). Reducir velocidad de viaje o rotar.`,
      module: "MECÁNICA",
    });
  }

  // ─── ECD & Hydraulics ────────────────────────────────────
  if (hydraulics.ecd > pressures.maxMudWeight && pressures.maxMudWeight > 0) {
    alerts.push({
      level: "critical",
      message: `ECD EXCESIVO: ${hydraulics.ecd.toFixed(2)} ppg`,
      detail:
        "La fricción anular está fracturando la formación dinámicamente. Reducir SPM inmediatamente.",
      module: "HIDRÁULICA",
    });
  }

  // ─── Hole Cleaning (CCI) ───────────────────────────────
  if (
    cuttings.cuttingCarryingIndex < 0.5 &&
    cuttings.cuttingCarryingIndex > 0
  ) {
    alerts.push({
      level: "warning",
      message: "LIMPIEZA DE POZO DEFICIENTE (Poor CCI)",
      detail: `CCI de ${cuttings.cuttingCarryingIndex.toFixed(2)}. Riesgo de cama de recortes y empaquetamiento.`,
      module: "LIMPIEZA",
    });
  }

  // ─── Surge & Swab Alerts (Maniobras de Viaje) ──────────────────────
  if (surgeSwab && pressures.maxMudWeight > 0) {
    // Surge crítico: ECD de surge supera límite de fractura
    if (surgeSwab.ecdSurge > pressures.maxMudWeight) {
      alerts.push({
        level: "critical",
        message: `SURGE CRÍTICO: ECD ${surgeSwab.ecdSurge.toFixed(2)} ppg`,
        detail: `La presión de surge durante el viaje excede el límite de fractura (${pressures.maxMudWeight.toFixed(2)} ppg). Bajar la sarta más despacio o acondicionar el lodo. Régimen: ${surgeSwab.flowRegimeSurge}.`,
        module: "MANIOBRAS",
      });
    } else if (surgeSwab.ecdSurge > pressures.maxMudWeight * 0.97) {
      // Surge advertencia: margen < 3%
      alerts.push({
        level: "warning",
        message: `SURGE ALTO: Margen crtico <3%`,
        detail: `ECD de Surge en ${surgeSwab.ecdSurge.toFixed(2)} ppg vs límite ${pressures.maxMudWeight.toFixed(2)} ppg. Reducir velocidad de viaje.`,
        module: "MANIOBRAS",
      });
    }

    // Swab crítico: ECD de swab cae bajo presión de poro (riesgo de kick)
    if (
      surgeSwab.ecdSwab < pressures.minMudWeight &&
      pressures.minMudWeight > 0
    ) {
      alerts.push({
        level: "critical",
        message: `SWAB CRÍTICO: Subbalancea al levantar`,
        detail: `ECD de Swab en ${surgeSwab.ecdSwab.toFixed(2)} ppg cae por debajo de la presión de poro (${pressures.minMudWeight.toFixed(2)} ppg). Riesgo de kick al sacar la sarta.`,
        module: "MANIOBRAS",
      });
    }
  }

  // ─── Alerta Holística: Trayectoria + Limpieza ──────────
  const maxInc =
    directional.trajectory?.length > 0
      ? Math.max(...directional.trajectory.map((p) => p.inc))
      : 0;

  if (maxInc > 45 && cuttings.cuttingCarryingIndex < 1.0) {
    alerts.push({
      level: "warning",
      message: "LIMPIEZA CRÍTICA EN SECCIÓN DESVIADA",
      detail: `Pozo con inclinación de ${maxInc.toFixed(0)}°. La sedimentación de recortes es crítica con CCI < 1.0.`,
      module: "DIRECCIONAL",
    });
  }

  // ─── Ordenamiento y Deduplicación Final ──────────────────
  const priority = { critical: 0, warning: 1, info: 2, success: 3 } as const;
  const seen = new Set<string>();

  return alerts
    .sort((a, b) => priority[a.level] - priority[b.level])
    .filter((alert) => {
      if (seen.has(alert.message)) return false;
      seen.add(alert.message);
      return true;
    });
}
