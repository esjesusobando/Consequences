// ============================================================
// Drilling Calculator — Input Guards (V1)
// Validate inputs BEFORE calculations
// ============================================================

import type {
  WellData,
  FormationData,
  MudData,
  PumpData,
  ValidationResult,
} from "../store/drilling-types";

// ─── Helpers ───────────────────────────────────────────────

function inRange(val: number, min: number, max: number): boolean {
  return val >= min && val <= max;
}

function positive(val: number): boolean {
  return val > 0;
}

function fail(msg: string): ValidationResult {
  return { status: "error", message: msg };
}

function warn(msg: string): ValidationResult {
  return { status: "warning", message: msg };
}

function ok(): ValidationResult {
  return { status: "valid" };
}

// ─── Well Geometry Guards ──────────────────────────────────

export function validateWellData(w: WellData): ValidationResult {
  if (!positive(w.totalDepth)) return fail("Total Depth debe ser > 0");
  if (!positive(w.tvd)) return fail("TVD debe ser > 0");
  if (w.tvd > w.totalDepth) return fail("TVD no puede exceder MD");
  if (!positive(w.holeSize)) return fail("Hole Size debe ser > 0");

  // Coherencia geométrica: Hole > DP OD > DP ID
  if (w.drillPipeOD >= w.holeSize) return fail("DP OD debe ser < Hole Size");
  if (w.drillPipeID >= w.drillPipeOD) return fail("DP ID debe ser < DP OD");
  if (!positive(w.drillPipeID)) return fail("DP ID debe ser > 0");

  // Drill Collars
  if (w.dcOD >= w.holeSize) return fail("DC OD debe ser < Hole Size");
  if (w.dcID >= w.dcOD) return fail("DC ID debe ser < DC OD");

  // HWDP
  if (w.hwdpOD >= w.holeSize) return fail("HWDP OD debe ser < Hole Size");
  if (w.hwdpID >= w.hwdpOD) return fail("HWDP ID debe ser < HWDP OD");

  // String length vs total depth
  const stringLength = w.drillPipeLength + w.hwdpLength + w.dcLength;
  if (stringLength > w.totalDepth) {
    return warn(
      `Longitud de sarta (${stringLength} ft) excede TD (${w.totalDepth} ft)`,
    );
  }

  // Bit nozzles
  if (w.bitNozzles.length === 0) return fail("Se requiere al menos 1 boquilla");
  for (const n of w.bitNozzles) {
    if (!inRange(n, 6, 32))
      return fail(`Boquilla ${n}/32 fuera de rango [6-32]`);
  }

  return ok();
}

// ─── Formation Guards ──────────────────────────────────────

export function validateFormation(f: FormationData): ValidationResult {
  if (!inRange(f.porePressureGradient, 0.3, 1.0)) {
    return fail("Gradiente de poro fuera de rango [0.3-1.0] psi/ft");
  }
  if (!inRange(f.fractureGradient, 0.4, 1.2)) {
    return fail("Gradiente de fractura fuera de rango [0.4-1.2] psi/ft");
  }
  if (f.fractureGradient <= f.porePressureGradient) {
    return fail("Gradiente de fractura debe ser > gradiente de poro");
  }
  return ok();
}

// ─── Mud Guards ────────────────────────────────────────────

export function validateMud(m: MudData): ValidationResult {
  if (!inRange(m.mudWeight, 6.0, 22.0)) {
    return fail(`Mud Weight ${m.mudWeight} ppg fuera de rango [6-22]`);
  }

  // Fann readings must be monotonically decreasing
  if (m.theta600 <= 0) return fail("θ600 debe ser > 0");
  if (m.theta300 <= 0) return fail("θ300 debe ser > 0");
  if (m.theta600 < m.theta300) {
    return fail("θ600 debe ser ≥ θ300 (lecturas monotónicas)");
  }

  // PV check
  const pv = m.theta600 - m.theta300;
  if (pv < 0) return fail("PV negativa: verificar lecturas Fann");

  // YP check
  const yp = m.theta300 - pv;
  if (yp < 0) return warn("YP negativo: verificar θ300 vs θ600");

  // Gel strengths
  if (m.gel10sec < 0 || m.gel10min < 0)
    return fail("Geles no pueden ser negativos");
  if (m.gel10min < m.gel10sec) {
    return warn("Gel 10min < Gel 10sec (progresión invertida)");
  }

  return ok();
}

// ─── Pump Guards ───────────────────────────────────────────

export function validatePump(p: PumpData): ValidationResult {
  if (!inRange(p.linerDiameter, 3, 8)) {
    return fail("Liner Diameter fuera de rango [3-8] in");
  }
  if (!inRange(p.strokesPerMinute, 20, 140)) {
    return fail("SPM fuera de rango [20-140]");
  }
  if (!inRange(p.efficiency, 70, 100)) {
    return fail("Eficiencia fuera de rango [70-100]%");
  }
  if (p.numberOfPumps < 1) return fail("Se requiere al menos 1 bomba");
  if (!positive(p.standpipePressure)) return fail("SPP debe ser > 0");

  // Duplex-specific
  if (p.pumpType === "Duplex" && !positive(p.rodDiameter)) {
    return fail("Rod Diameter requerido para bomba Duplex");
  }

  return ok();
}
