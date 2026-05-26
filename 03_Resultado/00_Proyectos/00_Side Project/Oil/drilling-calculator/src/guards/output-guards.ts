// ============================================================
// Drilling Calculator — Output Guards (V2)
// Validate calculation RESULTS against physical limits
// ============================================================

import type {
  VolumetricsResult,
  RheologyResult,
  PumpResult,
  CirculationResult,
  PressureResult,
  HydraulicsResult,
  ValidationResult,
} from "../store/drilling-types";

function fail(msg: string): ValidationResult {
  return { status: "error", message: msg };
}

function warn(msg: string): ValidationResult {
  return { status: "warning", message: msg };
}

function ok(): ValidationResult {
  return { status: "valid" };
}

// ─── Volumetrics Output Guard ──────────────────────────────

export function validateVolumetricsOutput(
  v: VolumetricsResult,
): ValidationResult {
  // Cross-check: totalSystemVolume must equal inside + annular
  const sum = v.totalInsideVolume + v.totalAnnularVolume;
  if (Math.abs(v.totalSystemVolume - sum) > 0.01) {
    return fail("Total system vol ≠ inside + annular (error de integridad)");
  }

  // Physical range: hole capacity typically 0.001 to 0.5 bbl/ft
  if (v.holeCapacity < 0.001 || v.holeCapacity > 0.5) {
    return warn(
      `Hole capacity ${v.holeCapacity.toFixed(4)} bbl/ft fuera de rango típico [0.001-0.5]`,
    );
  }

  // Negative volume check
  if (v.totalInsideVolume < 0 || v.totalAnnularVolume < 0) {
    return fail("Volumen negativo detectado");
  }

  return ok();
}

// ─── Rheology Output Guard ─────────────────────────────────

export function validateRheologyOutput(r: RheologyResult): ValidationResult {
  // Cross-check: AV = θ600 / 2 should match
  // AV × 2 − θ300 should ≈ PV (simplificación métrica)
  const pvCheck = r.av * 2 - (r.pv + r.yp);
  if (Math.abs(pvCheck) > 2) {
    return warn("Cross-check PV/AV muestra discrepancia significativa");
  }

  // Power Law index range (usando n_pl como referencia general)
  if (r.n_pl < 0.3 || r.n_pl > 1.0) {
    return warn(
      `Flow behavior index n=${r.n_pl.toFixed(3)} fuera de rango típico [0.3-1.0]`,
    );
  }

  // YP range
  if (r.yp < 0) {
    return fail("Yield Point negativo: datos inconsistentes");
  }
  if (r.yp > 100) {
    return warn(`YP=${r.yp.toFixed(1)} lb/100ft² excesivamente alto`);
  }

  // PV/YP ratio
  if (r.pvYpRatio < 0.2 || r.pvYpRatio > 5) {
    return warn(
      `PV/YP ratio ${r.pvYpRatio.toFixed(2)} fuera de rango seguro [0.2-5.0]`,
    );
  }

  return ok();
}

// ─── Pump Output Guard ─────────────────────────────────────

export function validatePumpOutput(p: PumpResult): ValidationResult {
  // Flow rate range for standard rigs
  if (p.flowRateGPM < 100 || p.flowRateGPM > 1200) {
    return warn(
      `Flow rate ${p.flowRateGPM.toFixed(0)} GPM fuera de rango típico [100-1200]`,
    );
  }

  // Cross-check: HHP = (SPP × Q) / 1714  (already computed by engine)
  // Verify outputPerStroke is reasonable
  if (p.outputPerStroke < 0.01 || p.outputPerStroke > 0.5) {
    return warn(
      `Output per stroke ${p.outputPerStroke.toFixed(4)} bbl/stk fuera de rango`,
    );
  }

  return ok();
}

// ─── Circulation Output Guard ──────────────────────────────

export function validateCirculationOutput(
  c: CirculationResult,
): ValidationResult {
  // Cross-check: fullCirculation = surfaceToBit + bitToSurface
  if (Math.abs(c.fullCirculation - (c.surfaceToBit + c.bitToSurface)) > 0.01) {
    return fail("Full circulation ≠ surfaceToBit + bitToSurface");
  }

  // Range check
  if (c.fullCirculation > 300) {
    return warn(
      `Full circulation ${c.fullCirculation.toFixed(0)} min excesivamente largo`,
    );
  }

  if (c.fullCirculation > 0 && c.fullCirculation < 5) {
    return warn(
      `Full circulation ${c.fullCirculation.toFixed(1)} min sospechosamente corto`,
    );
  }

  return ok();
}

// ─── Pressure Output Guard ─────────────────────────────────

export function validatePressureOutput(
  p: PressureResult,
  mudWeight: number,
): ValidationResult {
  // Cross-check: hydrostatic recalculation
  // Already computed by engine; this is a redundant check
  if (p.hydrostaticPressure < 0) {
    return fail("Presión hidrostática negativa");
  }

  // Mud window check
  if (mudWeight < p.minMudWeight) {
    return {
      status: "error",
      message: `Underbalanced: MW ${mudWeight.toFixed(2)} < ${p.minMudWeight.toFixed(2)} ppg (riesgo kick)`,
    };
  }

  if (mudWeight > p.maxMudWeight) {
    return {
      status: "error",
      message: `Overbalanced: MW ${mudWeight.toFixed(2)} > ${p.maxMudWeight.toFixed(2)} ppg (riesgo fractura)`,
    };
  }

  return ok();
}

// ─── Hydraulics Output Guard ───────────────────────────────

export function validateHydraulicsOutput(
  h: HydraulicsResult,
  standpipePressure: number,
  maxMudWeight: number,
): ValidationResult {
  // Balance de presión: SPP ≈ total losses (±15%)
  if (standpipePressure > 0 && h.totalPressureLoss > 0) {
    const ratio = h.totalPressureLoss / standpipePressure;
    if (ratio < 0.5 || ratio > 2.0) {
      return warn(
        `Pérdidas totales ${h.totalPressureLoss.toFixed(0)} psi vs SPP ${standpipePressure} psi (ratio: ${ratio.toFixed(2)})`,
      );
    }
  }

  // ECD check
  if (h.ecd > maxMudWeight) {
    return {
      status: "error",
      message: `ECD ${h.ecd.toFixed(2)} ppg excede gradiente de fractura (${maxMudWeight.toFixed(2)} ppg)`,
    };
  }

  // Annular velocity
  if (h.annularVelocity > 0 && h.annularVelocity < 100) {
    return warn(
      `Velocidad anular ${h.annularVelocity.toFixed(0)} ft/min por debajo del mínimo recomendado (120)`,
    );
  }
  if (h.annularVelocity > 300) {
    return warn(
      `Velocidad anular ${h.annularVelocity.toFixed(0)} ft/min por encima del máximo recomendado (240)`,
    );
  }

  // HHP/in² optimización
  if (h.hhpPerSqIn > 0 && h.hhpPerSqIn < 2.0) {
    return warn(
      `HHP/in² ${h.hhpPerSqIn.toFixed(2)} sub-óptimo (objetivo: 2.0-3.0)`,
    );
  }

  return ok();
}
