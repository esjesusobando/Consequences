import { describe, it, expect } from "vitest";
import { orchestrateCalculations } from "./orchestrator";
import { useDrillingStore } from "../store/drilling-store";

// T-06 (S-1..S-3): regression lock — the store pipeline must surface the
// 8-field SurgeSwabResult with correct ECD direction and pipeSpeed passthrough.
describe("orchestrator surge/swab integration (S-1..S-3)", () => {
  it("store path: calculateAll() → ecdSurge > MW, ecdSwab < MW, pipeSpeed honored", () => {
    useDrillingStore.getState().calculateAll();
    const { results, wellControlData } = useDrillingStore.getState();
    const ss = results.surgeSwab;
    const mw = useDrillingStore.getState().mudData.mudWeight;

    // S-2: all 8 fields present and finite
    expect(ss.surgePressure).toBeGreaterThan(0);
    expect(ss.swabPressure).toBeLessThan(0); // spec: swab is opposite sign of surge
    expect(Number.isFinite(ss.ecdSurge)).toBe(true);
    expect(Number.isFinite(ss.ecdSwab)).toBe(true);
    expect(Number.isFinite(ss.effectiveAnnularVelocity)).toBe(true);
    expect(["Laminar", "Turbulent", "Transition"]).toContain(
      ss.flowRegimeSurge,
    );
    expect(ss.modelUsed).toBe("Burkhardt");

    // S-3: surge raises ECD at/above mud weight, swab lowers it at/below
    // (spec: ecdSurge >= MW >= ecdSwab — 2dp rounding may collapse equality)
    expect(ss.ecdSurge).toBeGreaterThanOrEqual(mw);
    expect(ss.ecdSwab).toBeLessThanOrEqual(mw);

    // pipeSpeed flows from wellControlData (?? 90 fallback)
    expect(ss.pipeSpeed).toBe(wellControlData.pipeSpeed ?? 90);
  });

  it("direct call: explicit pipeSpeed overrides the 90 fallback", () => {
    const s = useDrillingStore.getState();
    const results = orchestrateCalculations(
      s.wellData,
      s.formationData,
      s.mudData,
      s.pumpData,
      s.surveys,
      s.torqueDragData,
      { ...s.wellControlData, pipeSpeed: 45 },
    );
    const ss = results.surgeSwab;

    expect(ss.pipeSpeed).toBe(45);
    expect(ss.ecdSurge).toBeGreaterThanOrEqual(s.mudData.mudWeight);
    expect(ss.ecdSwab).toBeLessThanOrEqual(s.mudData.mudWeight);
  });

  it("direct call: default wellControlData → pipeSpeed 90", () => {
    const s = useDrillingStore.getState();
    const results = orchestrateCalculations(
      s.wellData,
      s.formationData,
      s.mudData,
      s.pumpData,
      s.surveys,
      s.torqueDragData,
    );

    expect(results.surgeSwab.pipeSpeed).toBe(90);
  });

  // T-07 (S-1): regression lock — MAASP must receive the fracture gradient in
  // ppg (FG/0.052), not psi/ft. The old caller passed formationData.fractureGradient
  // (psi/ft) straight through, which produced a negative MAASP and was silently
  // accepted by every isolated well-control test.
  it("MAASP regression: FG is converted psi/ft → ppg at the orchestrator boundary", () => {
    const s = useDrillingStore.getState();
    const results = orchestrateCalculations(
      s.wellData,
      s.formationData,
      s.mudData,
      s.pumpData,
      s.surveys,
      s.torqueDragData,
      s.wellControlData,
    );

    const fgPpg = s.formationData.fractureGradient / 0.052;
    const mw = s.mudData.mudWeight;
    const shoeTvd = s.wellData.tvd;
    const safetyMargin = s.wellControlData.safetyMargin ?? 0;

    // Buggy psi/ft passthrough would produce (0.85 - 10.5) * 0.052 * 7800 ≈ -3914
    expect(results.wellControl.maasp).toBeGreaterThan(0);
    // Correct ppg conversion: (16.35 - 10.5) * 0.052 * 7800 ≈ 2371
    expect(results.wellControl.maasp).toBe(
      Math.round((fgPpg - mw) * 0.052 * shoeTvd + safetyMargin),
    );
  });
});
