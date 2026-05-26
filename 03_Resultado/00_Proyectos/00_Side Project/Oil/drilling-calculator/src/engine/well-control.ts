import { API_HYDROSTATIC_GRADIENT } from "./physics";
import { validateWellInput, type WellParams } from "./utils/validation";
import type {
  WellData,
  WellControlData,
  WellControlResult,
  VolumetricsResult,
  PumpResult,
} from "../store/drilling-types";

/**
 * Well Control Engine (The Kick Shield)
 * Based on IADC / IWCF Standards.
 * Handles Kill Mud Weight, ICP, FCP, MAASP and Step-Down Schedule.
 * @param well - Well data.
 * @param wcData - Well control specific data (sidpp, etc.).
 * @param mudWeight - Current mud weight in ppg.
 * @param volumetrics - Well volume data.
 * @param pump - Pump specifications.
 * @param fractureGradientAtShoe - Fracture gradient at casing shoe in ppg.
 * @param shoeTVD - Casing shoe TVD in ft (Required).
 */
export function calculateWellControl(
  well: WellData,
  wcData: WellControlData,
  mudWeight: number,
  volumetrics: VolumetricsResult,
  pump: PumpResult,
  fractureGradientAtShoe: number,
  shoeTVD: number, // Required now
): WellControlResult {
  const params: WellParams = {
    mudWeight,
    sidpp: wcData.sidpp || 0,
    shoeTVD,
    fractureGradientAtShoe,
    safetyMargin: wcData.safetyMargin || 0,
  };

  const validation = validateWellInput(params);
  if (!validation.isValid) {
    throw new Error(`Invalid Well Input: ${validation.errors.join(", ")}`);
  }

  const { sidpp = 0, killRatePressure = 0, safetyMargin = 0 } = wcData || {};
  const tvd = Math.max(well.tvd || well.totalDepth || 1, 1);

  // 1. Kill Mud Weight (KMW)
  // IADC Rule: ROUND UP to one decimal place (Field Units)
  const exactKmw =
    mudWeight +
    (sidpp > 0 ? sidpp / (API_HYDROSTATIC_GRADIENT * tvd) : 0) +
    safetyMargin / (API_HYDROSTATIC_GRADIENT * tvd);
  const kmw = Math.ceil(exactKmw * 10) / 10;

  // 2. Circulating Pressures
  // ICP = SIDPP + SCR
  const icp = sidpp + killRatePressure;

  // FCP = SCR * (KMW / MW)
  const fcp = mudWeight > 0 ? killRatePressure * (kmw / mudWeight) : 0;

  // 3. MAASP = (Limit Gradient [ppg] - Current MW [ppg]) * 0.052 * Shoe TVD [ft]
  // Safety margin is added after the hydrostatic calculation if needed, 
  // but standard MAASP is based on pressure at shoe.
  const maasp =
    (fractureGradientAtShoe - mudWeight) * API_HYDROSTATIC_GRADIENT * shoeTVD +
    safetyMargin;

  // 4. Strokes and Schedule
  const output = pump.outputPerStroke || 0.1;
  const strokesToBit = volumetrics.totalInsideVolume / output;
  const strokesToSurface = volumetrics.totalAnnularVolume / output;
  const totalStrokes = strokesToBit + strokesToSurface;

  // 5. Step-Down Schedule
  // IADC Rule: ROUND DOWN to a whole number (Field Units)
  const schedule: { strokes: number; pressure: number }[] = [];
  const steps = 10;
  for (let i = 0; i <= steps; i++) {
    const s = (strokesToBit / steps) * i;
    const p = icp - ((icp - fcp) / strokesToBit) * s;
    schedule.push({ strokes: Math.round(s), pressure: Math.floor(p) });
  }

  return {
    kmw: kmw,
    icp: Math.round(icp),
    fcp: Math.round(fcp),
    maasp: Math.round(maasp),
    strokesToBit: Math.round(strokesToBit),
    strokesToSurface: Math.round(strokesToSurface),
    totalStrokes: Math.round(totalStrokes),
    stepDownSchedule: schedule,
  };
}
