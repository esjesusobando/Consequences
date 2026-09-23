import type { TrajectoryPoint, TorqueDragResult } from "../store/drilling-types";

export interface TrajectoryChartPoint {
  md: number;
  dls: number;
  tvd: number;
  pickup: number;
}

export interface TrajectoryChartData {
  chartData: TrajectoryChartPoint[];
  maxDLS: number;
  neutralMD: number | null;
}

/**
 * Derives the Master Technical Dashboard chart data.
 *
 * Extracted from the TechnicalInsights component's `useMemo` (T-08) so the
 * derivation is regression-testable. The original behavior is preserved
 * exactly:
 * - DLS per 100 ft between consecutive survey points (0 when md does not advance)
 * - chart `dls` values rounded to 2 decimals, `maxDLS` from the UNROUNDED values
 * - axial pickup merged from the torque/drag profile when within 50 ft (klbs)
 * - neutralMD passes the engine neutral point through, else null
 */
export function buildTrajectoryChart(
  trajectory: TrajectoryPoint[],
  profile: TorqueDragResult["profile"] | undefined,
  neutralPointRaw: number | null | undefined,
): TrajectoryChartData {
  const rawDls = trajectory.map((p, i) => {
    if (i === 0) return 0;
    const p1 = trajectory[i - 1];
    if (p.md - p1.md <= 0) return 0;
    return (
      (Math.sqrt(
        Math.pow(p.inc - p1.inc, 2) +
          Math.pow(Math.sin((p1.inc * Math.PI) / 180) * (p.azi - p1.azi), 2),
      ) /
        (p.md - p1.md)) *
      100
    );
  });

  const chartData = trajectory.map((p, i) => {
    // Combinar también carga axial si existe
    const profilePoint = profile?.find((tp) => Math.abs(tp.md - p.md) < 50);

    return {
      md: p.md,
      dls: Number(rawDls[i].toFixed(2)),
      tvd: p.tvd,
      pickup: profilePoint ? profilePoint.pickup / 1000 : 0, // klbs
    };
  });

  // Obtener MD del Punto Neutro directamente del motor
  const neutralMD =
    neutralPointRaw !== undefined && neutralPointRaw !== null
      ? neutralPointRaw
      : null;

  return {
    chartData,
    maxDLS: rawDls.reduce((max, d) => Math.max(max, d), 0),
    neutralMD,
  };
}
