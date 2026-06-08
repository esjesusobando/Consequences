// ============================================================
// Drilling Calculator — Hydraulics Engine
// Pure functions · Velocities, pressure losses, ECD, HHP
// ============================================================

import type {
  WellData,
  MudData,
  RheologyResult,
  PumpResult,
  HydraulicsResult,
} from "../store/drilling-types";
import {
  API_VELOCITY_CONSTANT,
  API_REYNOLDS_CONSTANT,
  API_SHEAR_RATE_FRICTION,
  API_BIT_PRESSURE_CONSTANT,
  API_HYDROSTATIC_GRADIENT,
  API_HHP_CONSTANT,
  API_IMPACT_FORCE_CONSTANT,
} from "./physics";

/**
 * Calculate drilling hydraulics: velocities, pressure losses
 * through each component, ECD, bit optimization, and impact force.
 */
export function calculateHydraulics(
  well: WellData,
  mud: MudData,
  pump: PumpResult,
  rheology: RheologyResult,
): HydraulicsResult {
  const MW = mud.mudWeight;
  const Q = pump.flowRateGPM;
  const pv = rheology.pv;
  const yp = rheology.yp;
  const n =
    mud.rheologyModel === "BINGHAM"
      ? 1
      : mud.rheologyModel === "POWER_LAW"
        ? rheology.n_pl
        : rheology.n_hb;
  const K =
    mud.rheologyModel === "BINGHAM"
      ? 0
      : mud.rheologyModel === "POWER_LAW"
        ? rheology.k_pl
        : rheology.k_hb;
  const tau0 = mud.rheologyModel === "HERSCHEL_BULKLEY" ? rheology.tau0_hb : 0;
  const model = mud.rheologyModel;

  if (Q <= 0) {
    return {
      annularVelocity: 0,
      pipeVelocity: 0,
      totalFlowArea: 0,
      nozzleVelocity: 0,
      pressureLossDP: 0,
      pressureLossHWDP: 0,
      pressureLossDC: 0,
      pressureLossBit: 0,
      pressureLossAnnular: 0,
      totalPressureLoss: 0,
      ecd: MW,
      bottomHolePressure: MW * API_HYDROSTATIC_GRADIENT * well.tvd,
      bitHHP: 0,
      hhpPerSqIn: 0,
      impactForce: 0,
      impactPerSqIn: 0,
      flowRegimeAnnular: "Laminar",
      flowRegimeDP: "Laminar",
      velocityRatio: 0,
      rheologyModelSelected: model,
      reynoldsDP: 0,
      reynoldsAnnular: 0,
    };
  }

  // ─── Velocities ──────────────────────────────────────────
  // Report DP-section annular velocity (most critical for hole cleaning)
  const annularVelocity =
    well.holeSize ** 2 - well.drillPipeOD ** 2 > 0
      ? (API_VELOCITY_CONSTANT * Q) /
        (well.holeSize ** 2 - well.drillPipeOD ** 2)
      : 0;

  const pipeVelocity =
    well.drillPipeID > 0
      ? (API_VELOCITY_CONSTANT * Q) / well.drillPipeID ** 2
      : 0;

  // ─── Reynolds Variables ──────────────────────────────────
  let reynoldsDP = 0;
  let reynoldsAnnular = 0;

  // ─── Helper: Pressure Loss Calculation (API RP 13D Standard) ──────
  const calcLoss = (
    vel: number,
    ID: number,
    len: number,
    isAnnulus: boolean = false,
  ) => {
    if (vel <= 0 || ID <= 0 || len <= 0)
      return { loss: 0, regime: "Laminar" as const, re: 0 };

    let mu_eff = 0;
    // NOTE: shearRate uses oilfield "Fann-dial-equivalent" units (not SI s⁻¹).
    // Formula: 1.6×v(ft/min)/D(in) for pipe | 1.44×v(ft/min)/D(in) for annulus.
    // The 478.8 conversion factor in Power Law μ_eff accounts for this convention.
    // Reference: Bourgoyne et al., "Applied Drilling Engineering", SPE Vol.2, §4.
    const shearRate = isAnnulus ? (1.44 * vel) / ID : (1.6 * vel) / ID;

    if (model === "BINGHAM") {
      // Bingham Plastic: μ_app = PV + YP × (300/γ_rpm) — Bourgoyne/API RP 13D §4
      mu_eff = pv + (300 * yp) / (shearRate || 1);
    } else if (model === "POWER_LAW") {
      // Power Law: μ_eff(cP) = K × γ^(n-1) × 478.8
      // 478.8 = unit conversion factor (lbf/100ft²·s^(n-1)) → cP — API RP 13D §5
      mu_eff = K * Math.pow(shearRate || 1, n - 1) * API_SHEAR_RATE_FRICTION;
    } else {
      // Herschel-Bulkley: μ_eff = τ0/γ × 478.8 + K × γ^(n-1) × 478.8 — API RP 13D §6
      mu_eff =
        (tau0 * API_SHEAR_RATE_FRICTION) / (shearRate || 1) +
        K * Math.pow(shearRate || 1, n - 1) * API_SHEAR_RATE_FRICTION;
    }

    const vel_fts = vel / 60;
    const Re = (API_REYNOLDS_CONSTANT * MW * vel_fts * ID) / (mu_eff || 1);
    let f = 0;
    let regime: "Laminar" | "Turbulent" | "Transition" = "Laminar";

    if (Re < 2100) {
      f = 16 / Re;
      regime = "Laminar";
    } else if (Re > 4000) {
      f = 0.046 / Math.pow(Re, 0.2);
      regime = "Turbulent";
    } else {
      f = 0.046 / Math.pow(Re, 0.2);
      regime = "Transition";
    }

    const pLoss = (f * MW * Math.pow(vel / 60, 2) * len) / (25.8 * ID);
    return { loss: pLoss, regime, re: Re };
  };

  // ─── Pressure Loss Sections (Pipe Interior) ────────────────────────
  const resDP = calcLoss(pipeVelocity, well.drillPipeID, well.drillPipeLength);
  reynoldsDP = resDP.re;

  const hwdpPipeVel =
    well.hwdpID > 0 ? (API_VELOCITY_CONSTANT * Q) / well.hwdpID ** 2 : 0;
  const resHWDP = calcLoss(hwdpPipeVel, well.hwdpID, well.hwdpLength);

  const dcPipeVel =
    well.dcID > 0 ? (API_VELOCITY_CONSTANT * Q) / well.dcID ** 2 : 0;
  const resDC = calcLoss(dcPipeVel, well.dcID, well.dcLength);

  // ─── Bit Nozzle Calculations ───────────────────────────────────────
  const tfa = well.bitNozzles.reduce(
    (sum, n) => sum + (Math.PI * Math.pow(n / 32, 2)) / 4,
    0,
  );

  const nozzleVelocity = tfa > 0 ? (Q * 0.3208) / tfa : 0;

  // Cd = 0.95: discharge coefficient for standard roller cone/PDC nozzles (IADC)
  const CD_BIT_NOZZLE = 0.95;
  const pressureLossBit =
    tfa > 0
      ? (MW * Math.pow(Q, 2)) /
        (API_BIT_PRESSURE_CONSTANT *
          Math.pow(CD_BIT_NOZZLE, 2) *
          Math.pow(tfa, 2))
      : 0;

  // ─── Annular Pressure Loss: 3-Section Method ─────────────────────
  // Improvement over single-section: each section uses correct OD →
  // more accurate annular velocity and friction per IADC/Bourgoyne §4.
  //
  // Section A: DP annulus (most of the well)
  const deAnnDP = well.holeSize - well.drillPipeOD;
  const annVelDP =
    well.holeSize ** 2 - well.drillPipeOD ** 2 > 0
      ? (API_VELOCITY_CONSTANT * Q) /
        (well.holeSize ** 2 - well.drillPipeOD ** 2)
      : 0;
  const resAnnDP = calcLoss(annVelDP, deAnnDP, well.drillPipeLength, true);

  // Section B: HWDP annulus (tighter clearance)
  const deAnnHWDP = well.holeSize - well.hwdpOD;
  const annVelHWDP =
    well.holeSize ** 2 - well.hwdpOD ** 2 > 0
      ? (API_VELOCITY_CONSTANT * Q) / (well.holeSize ** 2 - well.hwdpOD ** 2)
      : 0;
  const resAnnHWDP = calcLoss(
    annVelHWDP,
    Math.max(deAnnHWDP, 0.1),
    well.hwdpLength,
    true,
  );

  // Section C: Drill Collar annulus (tightest clearance → highest ΔP)
  const deAnnDC = well.holeSize - well.dcOD;
  const annVelDC =
    well.holeSize ** 2 - well.dcOD ** 2 > 0
      ? (API_VELOCITY_CONSTANT * Q) / (well.holeSize ** 2 - well.dcOD ** 2)
      : 0;
  const resAnnDC = calcLoss(
    annVelDC,
    Math.max(deAnnDC, 0.1),
    well.dcLength,
    true,
  );

  // Total annular loss = sum of 3 sections
  const pressureLossAnnular = resAnnDP.loss + resAnnHWDP.loss + resAnnDC.loss;

  // Critical section = DC (highest velocity). Use for ECD & BHP regime reporting.
  reynoldsAnnular = resAnnDP.re;
  const worstAnnularRegime =
    resAnnDC.regime === "Turbulent" || resAnnHWDP.regime === "Turbulent"
      ? "Turbulent"
      : resAnnDP.regime;

  // ─── Totals & ECD ──────────────────────────────────────────
  const totalPressureLoss =
    resDP.loss +
    resHWDP.loss +
    resDC.loss +
    pressureLossBit +
    pressureLossAnnular;

  const ecd =
    well.tvd > 0
      ? MW + pressureLossAnnular / (API_HYDROSTATIC_GRADIENT * well.tvd)
      : MW;

  const bitHHP = (pressureLossBit * Q) / API_HHP_CONSTANT;
  const bitArea = (Math.PI * Math.pow(well.bitSize, 2)) / 4;
  const hhpPerSqIn = bitArea > 0 ? bitHHP / bitArea : 0;
  const impactForce = (MW * Q * nozzleVelocity) / API_IMPACT_FORCE_CONSTANT;

  return {
    annularVelocity,
    pipeVelocity,
    totalFlowArea: tfa,
    nozzleVelocity,
    pressureLossDP: resDP.loss,
    pressureLossHWDP: resHWDP.loss,
    pressureLossDC: resDC.loss,
    pressureLossBit,
    pressureLossAnnular,
    totalPressureLoss,
    ecd,
    bottomHolePressure:
      MW * API_HYDROSTATIC_GRADIENT * well.tvd + pressureLossAnnular,
    bitHHP,
    hhpPerSqIn,
    impactForce,
    impactPerSqIn: bitArea > 0 ? impactForce / bitArea : 0,
    flowRegimeDP: resDP.regime,
    flowRegimeAnnular: worstAnnularRegime,
    reynoldsDP,
    reynoldsAnnular,
    // velocityRatio: AV / PipeV — ratio of annular to pipe velocity (< 1 is normal)
    velocityRatio: pipeVelocity > 0 ? annularVelocity / pipeVelocity : 0,
    rheologyModelSelected: model,
  };
}
