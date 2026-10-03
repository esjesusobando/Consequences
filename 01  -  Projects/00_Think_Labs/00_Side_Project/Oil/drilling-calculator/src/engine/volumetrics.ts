// ============================================================
// Drilling Calculator — Volumetrics Engine
// Pure functions · No side effects
// ============================================================

import type { WellData, VolumetricsResult } from "../store/drilling-types";
import { API_VOL_CAPACITY } from "./physics";

/**
 * Calculate well volumetrics: capacities, annular volumes,
 * displacements, and total system volume.
 *
 * Reference: API RP 13B · Oilfield barrel = 42 US gallons
 * Capacity formula: ID² / 1029.4 (bbl/ft)
 */
export function calculateVolumes(well: WellData): VolumetricsResult {
  // ─── Capacities (bbl/ft) ─────────────────────────────────
  const holeCapacity = well.holeSize ** 2 / API_VOL_CAPACITY;
  const drillPipeCapacity = well.drillPipeID ** 2 / API_VOL_CAPACITY;
  const hwdpCapacity = well.hwdpID ** 2 / API_VOL_CAPACITY;
  const dcCapacity = well.dcID ** 2 / API_VOL_CAPACITY;

  // ─── Annular Capacities (bbl/ft) ─────────────────────────
  const annularDP =
    (well.holeSize ** 2 - well.drillPipeOD ** 2) / API_VOL_CAPACITY;
  const annularHWDP =
    (well.holeSize ** 2 - well.hwdpOD ** 2) / API_VOL_CAPACITY;
  const annularDC = (well.holeSize ** 2 - well.dcOD ** 2) / API_VOL_CAPACITY;

  // ─── Displacements (bbl/ft) ──────────────────────────────
  const displacementDP =
    (well.drillPipeOD ** 2 - well.drillPipeID ** 2) / API_VOL_CAPACITY;
  const displacementHWDP =
    (well.hwdpOD ** 2 - well.hwdpID ** 2) / API_VOL_CAPACITY;
  const displacementDC = (well.dcOD ** 2 - well.dcID ** 2) / API_VOL_CAPACITY;

  // ─── Inside Volumes (bbl) ────────────────────────────────
  const volumeInsideDP = drillPipeCapacity * well.drillPipeLength;
  const volumeInsideHWDP = hwdpCapacity * well.hwdpLength;
  const volumeInsideDC = dcCapacity * well.dcLength;
  const totalInsideVolume = volumeInsideDP + volumeInsideHWDP + volumeInsideDC;

  // ─── Annular Volumes (bbl) ───────────────────────────────
  const volumeAnnularDP = annularDP * well.drillPipeLength;
  const volumeAnnularHWDP = annularHWDP * well.hwdpLength;
  const volumeAnnularDC = annularDC * well.dcLength;
  const totalAnnularVolume =
    volumeAnnularDP + volumeAnnularHWDP + volumeAnnularDC;

  // ─── Total System ────────────────────────────────────────
  const totalSystemVolume = totalInsideVolume + totalAnnularVolume;

  // ─── Open Hole Volume ────────────────────────────────────
  const stringLength = well.drillPipeLength + well.hwdpLength + well.dcLength;
  const openHoleLength = Math.max(0, well.totalDepth - stringLength);
  const openHoleVolume = holeCapacity * openHoleLength;

  // ─── Circulation Times (min) ──────────────────────────────
  // Note: Values initialized to 0; actual calculation performed in circulation engine
  const surfaceToBitTime = 0;
  const bottomsUpTime = 0;
  const totalCirculationTime = 0;

  return {
    holeCapacity,
    drillPipeCapacity,
    hwdpCapacity,
    dcCapacity,
    annularDP,
    annularHWDP,
    annularDC,
    displacementDP,
    displacementHWDP,
    displacementDC,
    volumeInsideDP,
    volumeInsideHWDP,
    volumeInsideDC,
    totalInsideVolume,
    volumeAnnularDP,
    volumeAnnularHWDP,
    volumeAnnularDC,
    totalAnnularVolume,
    totalSystemVolume,
    openHoleVolume,
    surfaceToBitTime,
    bottomsUpTime,
    totalCirculationTime,
  };
}
