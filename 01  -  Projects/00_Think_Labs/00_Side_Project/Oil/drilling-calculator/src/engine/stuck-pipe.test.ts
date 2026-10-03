// ============================================================
// T-24 (Q-3): Stuck pipe engine regression suite
// Locks F12 (differential sticking force) + risk thresholds + FPC
// ============================================================

import { describe, expect, it } from "vitest";
import { calculateStuckPipe } from "./stuck-pipe";
import type {
  WellData,
  PressureResult,
  DirectionalResult,
  CuttingsTransportResult,
  TrajectoryPoint,
} from "../store/drilling-types";

function makeWell(overrides: Partial<WellData> = {}): WellData {
  return {
    totalDepth: 10000,
    tvd: 9500,
    holeSize: 12.25,
    drillPipeOD: 5,
    drillPipeID: 4,
    drillPipeLength: 8000,
    hwdpOD: 5,
    hwdpID: 3,
    hwdpLength: 1500,
    dcOD: 8,
    dcID: 3,
    dcLength: 500,
    bitSize: 12.25,
    bitNozzles: [13, 13, 13],
    ...overrides,
  };
}

function makePressures(overbalance: number): PressureResult {
  return {
    porePressure: 5000,
    fracturePressure: 7000,
    hydrostaticPressure: 5000 + overbalance,
    mudGradient: 0.68,
    minMudWeight: 10,
    maxMudWeight: 14,
    mudWindow: 4,
    overbalance,
    overbalancePPG: overbalance / (0.052 * 9500),
  };
}

function makeDirectional(maxDls: number): DirectionalResult {
  const point: TrajectoryPoint = {
    md: 1000,
    inc: 60,
    azi: 0,
    tvd: 636.6,
    north: 636.6,
    east: 0,
    dls: maxDls,
    cl: 1000,
  };
  return {
    surveys: [{ md: 0, inc: 0, azi: 0 }],
    trajectory: [point],
    totalClosure: 636.6,
    closureAzimuth: 0,
  };
}

function makeCuttings(cci: number): CuttingsTransportResult {
  return {
    slipVelocity: 5,
    transportVelocity: 55,
    transportRatio: 91.7,
    cuttingCarryingIndex: cci,
    holeCleaningEfficiency: 0.1,
    cuttingsConcentration: 8.2,
  };
}

describe("stuck pipe engine", () => {
  it("F12: differential sticking force = overbalance * contact area (150) * cof (0.25)", () => {
    expect(calculateStuckPipe(makeWell(), makePressures(600)).differentialStickingForce).toBe(600 * 150 * 0.25);
    expect(calculateStuckPipe(makeWell(), makePressures(300)).differentialStickingForce).toBe(300 * 150 * 0.25);
  });

  it("F12: force scales linearly with overbalance", () => {
    const low = calculateStuckPipe(makeWell(), makePressures(300)).differentialStickingForce;
    const high = calculateStuckPipe(makeWell(), makePressures(600)).differentialStickingForce;
    expect(high).toBeCloseTo(low * 2, 5);
  });

  it("F12: differential risk thresholds - >500 High, >250 Medium, else Low", () => {
    expect(calculateStuckPipe(makeWell(), makePressures(600)).differentialRiskLevel).toBe("High");
    expect(calculateStuckPipe(makeWell(), makePressures(300)).differentialRiskLevel).toBe("Medium");
    expect(calculateStuckPipe(makeWell(), makePressures(100)).differentialRiskLevel).toBe("Low");
  });

  it("F12: key seating risk from max DLS - >4.5 High, >3.0 Medium, else Low", () => {
    expect(calculateStuckPipe(makeWell(), makePressures(100), makeDirectional(5)).keySeatingRisk).toBe("High");
    expect(calculateStuckPipe(makeWell(), makePressures(100), makeDirectional(3.5)).keySeatingRisk).toBe("Medium");
    expect(calculateStuckPipe(makeWell(), makePressures(100), makeDirectional(2)).keySeatingRisk).toBe("Low");
  });

  it("F12: no trajectory data -> key seating risk stays Low", () => {
    expect(calculateStuckPipe(makeWell(), makePressures(100)).keySeatingRisk).toBe("Low");
  });

  it("F12: hole cleaning risk from CCI - <0.5 High, <1.0 Medium, else Low", () => {
    expect(calculateStuckPipe(makeWell(), makePressures(100), undefined, makeCuttings(0.3)).holeCleaningRisk).toBe("High");
    expect(calculateStuckPipe(makeWell(), makePressures(100), undefined, makeCuttings(0.7)).holeCleaningRisk).toBe("Medium");
    expect(calculateStuckPipe(makeWell(), makePressures(100), undefined, makeCuttings(1.5)).holeCleaningRisk).toBe("Low");
  });

  it("F12: no cuttings data -> hole cleaning risk stays Low", () => {
    expect(calculateStuckPipe(makeWell(), makePressures(100)).holeCleaningRisk).toBe("Low");
  });

  it("FPC: free pipe constant = (OD^2 - ID^2) * 0.7854 * 2500", () => {
    const res = calculateStuckPipe(makeWell(), makePressures(300));
    expect(res.freePointConstant).toBeCloseTo((5 ** 2 - 4 ** 2) * 0.7854 * 2500, 1);
    expect(res.freePointConstant).toBeGreaterThan(0);
  });
});
