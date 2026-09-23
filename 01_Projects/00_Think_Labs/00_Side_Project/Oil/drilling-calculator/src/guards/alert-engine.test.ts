import { describe, it, expect } from "vitest";
import { generateAlerts } from "./alert-engine";
import { useDrillingStore } from "../store/drilling-store";
import type {
  DrillingResults,
  DrillingAlert,
  SurgeSwabResult,
} from "../store/drilling-types";

// T-06 (S-4): regression lock — surge/swab alerts must render defined
// 8-field ECDs (no "undefined" from the old 4-field engine).
function buildResults(
  pressuresOverride: Partial<DrillingResults["pressures"]>,
  surgeSwab: SurgeSwabResult,
): DrillingResults {
  const base = useDrillingStore.getState().results;
  return {
    ...base,
    pressures: {
      ...base.pressures,
      porePressure: 2500,
      fracturePressure: 4000,
      hydrostaticPressure: 3000,
      mudGradient: 0.7,
      minMudWeight: 9.5,
      maxMudWeight: 10.5,
      mudWindow: 1,
      overbalance: 200,
      overbalancePPG: 0.5,
      ...pressuresOverride,
    },
    // neutral engines: keep every other alert branch silent
    hydraulics: { ...base.hydraulics, ecd: 10.5 },
    stuckPipe: {
      ...base.stuckPipe,
      differentialRiskLevel: "Low",
      keySeatingRisk: "Low",
      holeCleaningRisk: "Low",
    },
    cuttings: { ...base.cuttings, cuttingCarryingIndex: 1, slipVelocity: 1 },
    torqueDrag: {
      ...base.torqueDrag,
      pickupHookLoad: 0,
      slackoffHookLoad: 0,
      rotatingTorque: 0,
      tensileLimit: 1,
    },
    directional: { ...base.directional, trajectory: [] },
    surgeSwab,
  };
}

function maneuversAlerts(alerts: DrillingAlert[]): DrillingAlert[] {
  return alerts.filter((a) => a.module === "MANIOBRAS");
}

const ECD_REGEX = /\d+\.\d{2}/;

describe("alert-engine surge/swab (S-4)", () => {
  it("ecdSurge > maxMudWeight → SURGE CRÍTICO with defined toFixed(2)", () => {
    const results = buildResults(
      {},
      {
        surgePressure: 180,
        swabPressure: -120,
        ecdSurge: 11.2,
        ecdSwab: 10.2,
        effectiveAnnularVelocity: 190,
        flowRegimeSurge: "Turbulent",
        modelUsed: "Burkhardt",
        pipeSpeed: 90,
      },
    );

    const alerts = maneuversAlerts(generateAlerts(results));
    const surge = alerts.find((a) => a.level === "critical");

    expect(surge).toBeDefined();
    expect(surge?.message).toBe("SURGE CRÍTICO: ECD 11.20 ppg");
    expect(surge?.message).not.toContain("undefined");
    // detail renders the fracture limit + flow regime, never a raw undefined
    expect(surge?.detail).toContain("10.50");
    expect(surge?.detail).toContain("Turbulent");
    expect(surge?.detail).not.toContain("undefined");
    expect(ECD_REGEX.test(surge?.message ?? "")).toBe(true);
  });

  it("ecdSwab < minMudWeight → SWAB CRÍTICO with defined toFixed(2)", () => {
    const results = buildResults(
      {},
      {
        surgePressure: 40,
        swabPressure: -200,
        ecdSurge: 10.1,
        ecdSwab: 9.2,
        effectiveAnnularVelocity: 190,
        flowRegimeSurge: "Laminar",
        modelUsed: "Burkhardt",
        pipeSpeed: 90,
      },
    );

    const alerts = maneuversAlerts(generateAlerts(results));
    const swab = alerts.find((a) => a.level === "critical");

    expect(swab).toBeDefined();
    expect(swab?.message).toBe("SWAB CRÍTICO: Subbalancea al levantar");
    expect(swab?.detail).toContain("9.20");
    expect(swab?.detail).toContain("9.50");
    expect(swab?.message).not.toContain("undefined");
    expect(swab?.detail).not.toContain("undefined");
    expect(ECD_REGEX.test(swab?.detail ?? "")).toBe(true);
  });

  it("healthy window (no surge/swab breach) → no MANIOBRAS alerts", () => {
    const results = buildResults(
      {},
      {
        surgePressure: 40,
        swabPressure: -60,
        ecdSurge: 10.1, // < 97% of maxMudWeight → no SURGE ALTO warning
        ecdSwab: 9.6, // >= minMudWeight → no SWAB alert
        effectiveAnnularVelocity: 190,
        flowRegimeSurge: "Laminar",
        modelUsed: "Burkhardt",
        pipeSpeed: 90,
      },
    );

    const alerts = maneuversAlerts(generateAlerts(results));
    expect(alerts).toHaveLength(0);
  });
});
