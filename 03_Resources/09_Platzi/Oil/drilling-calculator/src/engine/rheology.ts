// ============================================================
// Drilling Calculator — Rheology Engine (Elite Grade 🔱)
// Precision Reology Analysis based on API RP 13B-1
// ============================================================

import type { MudData, RheologyResult } from "../store/drilling-types";

/**
 * calculateRheology: The core engine for mud properties.
 *
 * This module implements the Triple Model Architecture (Bingham, Power Law, HB)
 * following the "Elite Certification" standards for PersonalOS.
 *
 * 📈 TECHNICAL THEORY:
 * 1. Bingham Plastic: Assumes a linear relationship between shear stress
 *    and shear rate once the Yield Point is exceeded.
 *    - PV (Plastic Viscosity): Internal resistance to flow (θ600 - θ300).
 *    - YP (Yield Point): Electrostatic forces (θ300 - PV).
 *
 * 2. Power Law (Pseudo-plastic): Describes thinning fluids (n < 1).
 *    - n: Shear thinning index.
 *    - K: Consistency index (lb/100ft²-sec^n).
 *
 * 3. Herschel-Bulkley (Yield-Power Law): The gold standard for O&G.
 *    Combines the Yield Point of Bingham with the shear-thinning of Power Law.
 *    - τ₀: True Yield Stress (2*θ3 - θ6 approximation).
 */
export function calculateRheology(mud: MudData): RheologyResult {
  // ─── 1. Bingham Plastic Model (Pure Engineering) ─────────────────────
  // PV = θ600 − θ300 [cP]
  const pv = Math.max(mud.theta600 - mud.theta300, 1);

  // YP = θ300 − PV [lb/100ft²]
  const yp = Math.max(mud.theta300 - pv, 0);

  // ─── 2. Power Law Model (PL) ──────────────────────────────────
  // Estimating behavior across the spectrum
  // n = 3.322 * log10(θ600 / θ300)
  const n_pl = Math.max(3.322 * Math.log10(mud.theta600 / mud.theta300), 0.01);

  // K = θ300 / (511^n) [lb/100ft²-sec^n]
  const k_pl = Math.max(mud.theta300 / Math.pow(511, n_pl), 0.001);

  // ─── 3. Herschel-Bulkley Model (HB) ───────────────────────────
  // τ₀ (Estimated) = 2*θ3 - θ6 (Standard approximation if θ3/θ6 are available)
  const tau0_hb = Math.max(2 * mud.theta3 - mud.theta6, 0);

  const num_hb = Math.max(mud.theta600 - tau0_hb, 0.1);
  const den_hb = Math.max(mud.theta300 - tau0_hb, 0.05);

  // n_hb = 3.32 * log10((θ600 - τ₀) / (θ300 - τ₀))
  const n_hb = Math.max(3.32 * Math.log10(num_hb / den_hb), 0.01);

  // K_hb = (θ300 - τ₀) / (511^n) [lb/100ft²-sec^n]
  const k_hb = Math.max((mud.theta300 - tau0_hb) / Math.pow(511, n_hb), 0.001);

  // ─── 4. Gels & Progressive Analysis (Schlumberger/Halliburton Standard) ────
  const gel10s = mud.gel10sec || 0;
  const gel10m = mud.gel10min || 0; // Standard for long-term suspension analysis

  /**
   * GEL PROGRESSION ANALYSIS:
   * - Flat Gel: G10s and G10m are similar. Good for operations.
   * - Progressive Gel: G10m >> G10s. Risk of high breaking pressures.
   * - S-Shaped Gel: Progressive initially, then stabilizes.
   */
  // mu_eff @ 511 sec⁻¹ (Bingham apparent viscosity at 511 s⁻¹ = 300 RPM)
  // Formula: μ_app = PV + YP × (300/shear_rate_RPM) — Bourgoyne et al. / API RP 13D §4
  const mu_eff = pv + (yp * 300) / 511;

  // av: Apparent Viscosity = θ600/2 (cP equiv.) — API RP 13B-1 standard definition
  const av = mud.theta600 / 2;
  const pvYpRatio = yp > 0 ? pv / yp : 0;
  const gelProgression = gel10s > 0 ? gel10m / gel10s : 0;

  return {
    pv,
    yp,
    av,
    pvYpRatio,
    n_pl,
    k_pl,
    n_hb,
    k_hb,
    tau0_hb,
    mu_eff,
    gel10s,
    gel10m,
    gelProgression,
  };
}
