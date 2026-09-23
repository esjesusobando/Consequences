// ============================================================
// Drilling Calculator — Physics Constants Registry
// Elite Grade API Standardization (SLB / Halliburton conventions)
// ============================================================

/**
 * API_VOL_CAPACITY: Converts ID^2 (inches) and length (feet) to barrels (bbl).
 * Formula derivation: 1 bbl = 42 US gallons = 9702 cubic inches.
 * Cylindrical volume = (PI / 4) * D^2 * L * 12 (in^3).
 * Conversion: (PI/4 * 12) / 9702 ≈ 1 / 1029.4
 */
export const API_VOL_CAPACITY = 1029.4;

/**
 * API_VELOCITY_CONSTANT: Converts flow rate (GPM) and area (in^2) to ft/min.
 * Derivation: (1 GPM) * (231 in^3/gal) / (12 in/ft) = 19.25 ft^2/min.
 * Annular Velocity = Q / Area. D^2 terms: Area = (PI/4)*(D1^2 - D2^2).
 * Constant = 19.25 / (PI/4) ≈ 24.51
 */
export const API_VELOCITY_CONSTANT = 24.51;

/**
 * API_BIT_PRESSURE_CONSTANT: Used for pressure drop across bit nozzles.
 * P_bit = (MW * Q^2) / (10858 * TFA^2).
 * 10858 = 12031 × 0.95² ALREADY incorporates the nozzle discharge coefficient
 * (Cd ≈ 0.95). Never multiply by Cd² again — doing so double-counts Cd and
 * overestimates ΔP_bit by ~10.8%.
 */
export const API_BIT_PRESSURE_CONSTANT = 10858;

/**
 * API_HHP_CONSTANT: Mechanical conversion for Hydraulic Horsepower.
 * HHP = (Pressure [psi] * Flow Rate [GPM]) / 1714
 */
export const API_HHP_CONSTANT = 1714;

/**
 * API_IMPACT_FORCE_CONSTANT: Impact force at the bit (lbf).
 * IF = (MW * Q * V_nozzle) / 1930
 */
export const API_IMPACT_FORCE_CONSTANT = 1930;

/**
 * API_HYDROSTATIC_GRADIENT: Converts density (ppg) to pressure gradient (psi/ft).
 * Derivation: 1 gal = 231 in^3. 1 ft = 12 in. Volume of 1 ft column of 1 in^2 area = 12 in^3.
 * Density of 1 ppg in lb/in^3 = 1 / 231.
 * Pressure of 1 ft column = (1 / 231) * 12 ≈ 0.051948 ≈ 0.052 psi/ft per ppg.
 */
export const API_HYDROSTATIC_GRADIENT = 0.052;

/**
 * API_SHEAR_RATE_FRICTION: Converts lbf/100ft^2-sec to centipoise (cP) for effective viscosity.
 */
export const API_SHEAR_RATE_FRICTION = 478.8;

/**
 * API_REYNOLDS_CONSTANT: Calculates Reynolds number for non-Newtonian fluids in pipes/annuli.
 * Re = (928 * MW * V * D) / effective_viscosity
 */
export const API_REYNOLDS_CONSTANT = 928;

// ---------------------------------------------------------------------------
// API RP 13D §4–§6 compliant physical constants & shared helpers.
// References: API Recommended Practice 13D (Rheology and Hydraulics),
// Bourgoyne et al. "Applied Drilling Engineering" SPE Textbook Vol. 2.
// ---------------------------------------------------------------------------

/** Fann-dial shear-rate equivalent of 300 RPM ≈ 511 sec⁻¹ (API RP 13D §4). */
export const SHEAR_RATE_300_RPM = 511;

/** Reynolds — API RP 13D F7 flow-regime boundaries (laminar / transition / turbulent). */
export const RE_LAMINAR_MAX = 2100;
export const RE_TURBULENT_MIN = 4000;

/**
 * Bingham Plastic apparent viscosity at the 300 RPM reference reading.
 * μ_app = θ300 = PV + YP  [API RP 13B-1: μ = 300·θ/N → at N=300, μ = θ300 = PV+YP].
 * The 300/511 form confused rpm with s⁻¹ and understated YP by 41%; PV+YP is correct.
 * Single source of truth for the identical computation previously duplicated
 * in rheology.ts and surge-swab.ts.
 */
export const calcApparentViscosityBingham = (pv: number, yp: number): number =>
  pv + yp;

/**
 * Classify Reynolds number into a drilling flow regime (API RP 13D F7).
 * Single source of truth for the 2100/4000 thresholds duplicated across
 * surge-swab.ts and hydraulics.ts.
 */
export const classifyFlowRegime = (
  re: number,
): "Laminar" | "Turbulent" | "Transition" =>
  re < RE_LAMINAR_MAX ? "Laminar" : re > RE_TURBULENT_MIN ? "Turbulent" : "Transition";
