import { describe, expect, it } from "vitest";
import { generateAlerts } from "./alert-engine";
import type {
  CirculationResult,
  DrillingResults,
  PressureResult,
  PumpResult,
  RheologyResult,
  SurgeSwabResult,
  VolumetricsResult,
  WellControlResult,
} from "../store/drilling-types";

// Minimal well-behaved results baseline: zeroes/neutral values,
// must produce ZERO alerts (isolates the OPERACIONAL family tests).
type Overrides = {
  wellControl?: Partial<WellControlResult>;
  rheology?: Partial<RheologyResult>;
  pump?: Partial<PumpResult>;
  circulation?: Partial<CirculationResult>;
  volumetrics?: Partial<VolumetricsResult>;
  pressures?: Partial<PressureResult>;
  surgeSwab?: Partial<SurgeSwabResult>;
};

function makeResults(overrides: Overrides = {}): DrillingResults {
  return {
    volumetrics: {
      holeCapacity: 0,
      drillPipeCapacity: 0,
      hwdpCapacity: 0,
      dcCapacity: 0,
      annularDP: 0,
      annularHWDP: 0,
      annularDC: 0,
      displacementDP: 0,
      displacementHWDP: 0,
      displacementDC: 0,
      volumeInsideDP: 0,
      volumeInsideHWDP: 0,
      volumeInsideDC: 0,
      totalInsideVolume: 0,
      volumeAnnularDP: 0,
      volumeAnnularHWDP: 0,
      volumeAnnularDC: 0,
      totalAnnularVolume: 0,
      totalSystemVolume: 0,
      openHoleVolume: 0,
      surfaceToBitTime: 0,
      bottomsUpTime: 0,
      totalCirculationTime: 0,
      ...overrides.volumetrics,
    },
    rheology: {
      pv: 0,
      yp: 0,
      av: 0,
      pvYpRatio: 0,
      n_pl: 1,
      k_pl: 0,
      n_hb: 1,
      k_hb: 0,
      tau0_hb: 0,
      mu_eff: 0,
      gel10s: 0,
      gel10m: 0,
      gelProgression: 0,
      ...overrides.rheology,
    },
    pump: {
      outputPerStroke: 0,
      flowRateGPM: 0,
      flowRateBBLmin: 0,
      hydraulicHP: 0,
      ...overrides.pump,
    },
    circulation: {
      surfaceToBit: 0,
      bitToSurface: 0,
      fullCirculation: 0,
      bottomsUp: 0,
      lagStrokes: 0,
      lagTime: 0,
      ...overrides.circulation,
    },
    pressures: {
      porePressure: 0,
      fracturePressure: 0,
      hydrostaticPressure: 0,
      mudGradient: 0,
      minMudWeight: 0,
      maxMudWeight: 0,
      mudWindow: 0,
      overbalance: 0,
      overbalancePPG: 0,
      ...overrides.pressures,
    },
    hydraulics: {
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
      ecd: 0,
      bottomHolePressure: 0,
      bitHHP: 0,
      hhpPerSqIn: 0,
      impactForce: 0,
      impactPerSqIn: 0,
      flowRegimeDP: "Laminar",
      flowRegimeAnnular: "Laminar",
      velocityRatio: 0,
      rheologyModelSelected: "BINGHAM",
      reynoldsDP: 0,
      reynoldsAnnular: 0,
    },
    cuttings: {
      slipVelocity: 0,
      transportVelocity: 0,
      transportRatio: 0,
      cuttingCarryingIndex: 0,
      holeCleaningEfficiency: 0,
      cuttingsConcentration: 0,
    },
    directional: {
      surveys: [],
      trajectory: [],
      totalClosure: 0,
      closureAzimuth: 0,
    },
    torqueDrag: {
      pickupHookLoad: 0,
      slackoffHookLoad: 0,
      rotatingTorque: 0,
      neutralPoint: 0,
      minSafetyFactor: 0,
      tensileLimit: 0,
      torqueLimit: 0,
      profile: [],
    },
    wellControl: {
      kmw: 0,
      icp: 0,
      fcp: 0,
      maasp: 0,
      strokesToBit: 0,
      strokesToSurface: 0,
      totalStrokes: 0,
      stepDownSchedule: [],
      ...overrides.wellControl,
    },
    surgeSwab: {
      surgePressure: 0,
      swabPressure: 0,
      ecdSurge: 0,
      ecdSwab: 0,
      effectiveAnnularVelocity: 0,
      flowRegimeSurge: "Laminar",
      modelUsed: "Bingham Plastic",
      pipeSpeed: 0,
      ...overrides.surgeSwab,
    },
    stuckPipe: {
      differentialStickingForce: 0,
      differentialRiskLevel: "Low",
      keySeatingRisk: "Low",
      holeCleaningRisk: "Low",
      freePointDepth: 0,
      feetOfFreePipe: 0,
      freePointConstant: 0,
    },
    riskScore: 0,
    tacticalAdvice: [],
  };
}

function hasOperacional(
  results: DrillingResults,
  message: string,
): boolean {
  return generateAlerts(results).some(
    (a) => a.module === "OPERACIONAL" && a.message === message,
  );
}

describe("generateAlerts — OPERACIONAL families", () => {
  it("baseline results produce no alerts (isolation)", () => {
    expect(generateAlerts(makeResults())).toEqual([]);
  });

  it("well-control: ICP above MAASP raises critical OPERACIONAL alert", () => {
    const results = makeResults({
      wellControl: { icp: 2500, maasp: 2000 },
    });
    expect(
      hasOperacional(results, "PRESIÓN EN CABEZA EXCEDE MAASP"),
    ).toBe(true);
  });

  it("rheology: high PV/YP ratio raises OPERACIONAL alert", () => {
    const results = makeResults({
      rheology: { pv: 100, yp: 10, pvYpRatio: 10 },
    });
    expect(hasOperacional(results, "RELACIÓN PV/YP ALTA")).toBe(true);
  });

  it("pump: kill mud weight set but zero flow rate raises OPERACIONAL alert", () => {
    const results = makeResults({
      wellControl: { kmw: 10.5 },
      pump: { flowRateGPM: 0 },
    });
    expect(hasOperacional(results, "PESO DE MATAR SIN CAUDAL DE BOMBA")).toBe(
      true,
    );
  });

  it("circulation: very long bottoms-up time raises OPERACIONAL alert", () => {
    const results = makeResults({
      circulation: { bottomsUp: 120 },
    });
    expect(hasOperacional(results, "RETORNO DE RECORTES LENTO")).toBe(true);
  });

  it("volumetrics: very long surface-to-bit time raises OPERACIONAL alert", () => {
    const results = makeResults({
      volumetrics: { surfaceToBitTime: 150 },
    });
    expect(
      hasOperacional(results, "TIEMPO SUPERFICIE-BARRENA ALTO"),
    ).toBe(true);
  });
});