// ============================================================
// Drilling Calculator — Torque & Drag Engine
// Soft-String Model for axial tension and torque prediction
// Reference: Coulomb Friction / Aadnoy & Johancsik Models
// ============================================================

import type {
  WellData,
  TrajectoryPoint,
  TorqueDragResult,
} from "../store/drilling-types";

/**
 * Calculate Torque & Drag forces along the drill string
 */
export function calculateTorqueDrag(
  well: WellData,
  trajectory: TrajectoryPoint[],
  mudWeight: number,
  tdData: {
    frictionCoefficient: number;
    steelDensity: number;
    minSafetyFactor: number;
    weightOnBit: number;
    tensileLimit?: number;
    torqueLimit?: number;
  },
): TorqueDragResult {
  const { frictionCoefficient: mu, steelDensity, minSafetyFactor } = tdData;

  // 1. Buoyancy Factor (BF)
  const buoyancyFactor = 1 - mudWeight / steelDensity;

  // 2. Weights in Mud (lb/ft)
  const getWeightInMud = (od: number, id: number) =>
    (od ** 2 - id ** 2) * 2.67 * buoyancyFactor;

  const dpWeight = getWeightInMud(well.drillPipeOD, well.drillPipeID);
  const hwdpWeight = getWeightInMud(well.hwdpOD, well.hwdpID);
  const dcWeight = getWeightInMud(well.dcOD, well.dcID);

  // Initialize forces and profiles
  // Tension at bit starts at -WOB (Compression) for slackoff/drilling state
  let pickupTension = 0;
  let slackoffTension = -(tdData.weightOnBit || 0) * 1000; // klbs to lbs
  let rotatingTorque = 0;

  const profile: {
    md: number;
    pickup: number;
    slackoff: number;
    torque: number;
  }[] = [];

  // Iterate from bit to surface
  const points = [...trajectory].reverse();
  let neutralPointValue = 0;

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i]; // Lower point
    const p2 = points[i + 1]; // Upper point
    const dMd = p1.md - p2.md;

    const inc = (p1.inc + p2.inc) / 2;
    const radInc = (inc * Math.PI) / 180;

    let weight = dpWeight;
    let radius = well.drillPipeOD / 2 / 12;

    if (p1.md > well.drillPipeLength + well.hwdpLength) {
      weight = dcWeight;
      radius = well.dcOD / 2 / 12;
    } else if (p1.md > well.drillPipeLength) {
      weight = hwdpWeight;
      radius = well.hwdpOD / 2 / 12;
    }

    const axialComponent = weight * dMd * Math.cos(radInc);
    const normalForce = weight * dMd * Math.sin(radInc);
    const dragForce = normalForce * mu;

    const prevSlackoff = slackoffTension;
    pickupTension += axialComponent + dragForce;
    slackoffTension += axialComponent - dragForce;
    rotatingTorque += dragForce * radius;

    // --- Dynamic Neutral Point Detection ---
    // The Neutral Point is where tension = 0 during drilling (usually approximated by slackoff or weight on bit)
    // Here we use the slackoff tension transition as a proxy for the transition point.
    if (prevSlackoff < 0 && slackoffTension >= 0 && neutralPointValue === 0) {
      // Linear interpolation to find exactly where it's 0
      const ratio =
        Math.abs(prevSlackoff) / (Math.abs(prevSlackoff) + slackoffTension);
      neutralPointValue = p1.md - ratio * dMd;
    }

    if (i % 5 === 0 || i === points.length - 2) {
      profile.push({
        md: p2.md,
        pickup: pickupTension,
        slackoff: slackoffTension,
        torque: rotatingTorque,
      });
    }
  }

  // If neutral point wasn't found (no transition), default to bit (deepest point)
  // because tension starts at 0 at the bit (w/o WOB)
  if (neutralPointValue === 0) {
    neutralPointValue = points[0].md;
  }

  return {
    pickupHookLoad: pickupTension,
    slackoffHookLoad: slackoffTension,
    rotatingTorque,
    profile: profile.reverse(),
    neutralPoint: neutralPointValue,
    minSafetyFactor: minSafetyFactor,
    tensileLimit: tdData.tensileLimit || 0,
    torqueLimit: tdData.torqueLimit || 0,
  };
}
