/**
 * T-14 (RED, D-3): twin-engine purity contract.
 *
 * `simulateScenario` must be side-effect free: it NEVER mutates store state,
 * and it must apply the typed `modifications` ({ mudWeight?, gpm?, rpm?, rop? })
 * into the returned `DrillingResults`.
 *
 * The hydrostatic assertions lock the engine math: P_hydrostatic = 0.052 × MW × TVD
 * (pressures.ts, API RP 13D). These tests are RED against the current code:
 * `calculateTorqueDrag` crashes on an empty trajectory (`points[0]` is undefined),
 * the orchestrator catches it and returns the zeroed fallback, so
 * `hydrostaticPressure` is 0 instead of the simulated value. GREEN requires the
 * empty-trajectory guard in torque-drag.ts (also exercised by T-23).
 */

import { describe, expect, it } from "vitest";
import { useDrillingStore } from "../store/drilling-store";
import { simulateScenario } from "./twin-engine";
import { calculatePump } from "./pump";

const TVD = 7800;
const HYDROSTATIC_GRADIENT = 0.052; // psi/ft per ppg (physics.ts)

function setupStore(mudWeight: number) {
  const init = useDrillingStore.getInitialState();
  useDrillingStore.setState({
    ...init,
    wellData: { ...init.wellData, tvd: TVD, totalDepth: 9000 },
    mudData: { ...init.mudData, mudWeight },
  });
}

describe("simulateScenario (D-3: purity + typed modifications)", () => {
  it("applies the mudWeight modification and leaves the store untouched", () => {
    setupStore(10.5);

    const stateBefore = useDrillingStore.getState();
    const wellBefore = stateBefore.wellData;
    const mudBefore = stateBefore.mudData;
    const pumpBefore = stateBefore.pumpData;

    const simMW = 12;
    const result = simulateScenario(
      stateBefore.wellData,
      stateBefore.mudData,
      stateBefore.pumpData,
      stateBefore.formationData,
      { mudWeight: simMW },
    );

    // Reference equality is the strongest proof of "no mutation"
    const stateAfter = useDrillingStore.getState();
    expect(stateAfter.wellData).toBe(wellBefore);
    expect(stateAfter.mudData).toBe(mudBefore);
    expect(stateAfter.pumpData).toBe(pumpBefore);

    // The returned results reflect the SIMULATED mud weight, not the store's
    expect(result.pressures.hydrostaticPressure).toBeCloseTo(
      HYDROSTATIC_GRADIENT * simMW * TVD,
      5,
    );
  });

  it("triangulates: a different mudWeight yields the proportional hydrostatic pressure, still without store mutation", () => {
    setupStore(10.5);
    const state = useDrillingStore.getState();

    const result = simulateScenario(
      state.wellData,
      state.mudData,
      state.pumpData,
      state.formationData,
      { mudWeight: 9.5 },
    );

    expect(result.pressures.hydrostaticPressure).toBeCloseTo(
      HYDROSTATIC_GRADIENT * 9.5 * TVD,
      5,
    );

    const stateAfter = useDrillingStore.getState();
    expect(stateAfter.mudData.mudWeight).toBe(10.5); // store baseline preserved
  });

  it("consumes the strokesPerMinute modification into pump output without side effects", () => {
    setupStore(10.5);
    const state = useDrillingStore.getState();
    const spmBefore = state.pumpData.strokesPerMinute;

    const low = simulateScenario(
      state.wellData,
      state.mudData,
      state.pumpData,
      state.formationData,
      { strokesPerMinute: 40 },
    );
    const high = simulateScenario(
      state.wellData,
      state.mudData,
      state.pumpData,
      state.formationData,
      { strokesPerMinute: 120 },
    );

    expect(low.pump.flowRateGPM).toBeGreaterThan(0);
    expect(high.pump.flowRateGPM).toBeGreaterThan(low.pump.flowRateGPM);

    // MAGNITUDE contract: SPM drives the flow rate through calculatePump
    // (simulateScenario must not round-trip through a different path that
    // would halve/double the flow). The direct SPM modification must equal
    // calculatePump at the same strokesPerMinute.
    expect(low.pump.flowRateGPM).toBeCloseTo(
      calculatePump({ ...state.pumpData, strokesPerMinute: 40 }).flowRateGPM,
      5,
    );
    expect(high.pump.flowRateGPM).toBeCloseTo(
      calculatePump({ ...state.pumpData, strokesPerMinute: 120 }).flowRateGPM,
      5,
    );

    const stateAfter = useDrillingStore.getState();
    expect(stateAfter.pumpData.strokesPerMinute).toBe(spmBefore);
  });

  it("is baseline-neutral: simMW equal to current mudWeight yields the same ECD as an unmodified simulation", () => {
    setupStore(10.5);
    const state = useDrillingStore.getState();

    const baseline = simulateScenario(
      state.wellData,
      state.mudData,
      state.pumpData,
      state.formationData,
      {},
    );
    const sameMW = simulateScenario(
      state.wellData,
      state.mudData,
      state.pumpData,
      state.formationData,
      { mudWeight: state.mudData.mudWeight },
    );

    expect(sameMW.hydraulics.ecd).toBeCloseTo(baseline.hydraulics.ecd, 5);
  });
});
