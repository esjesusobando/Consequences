import type {
  WellData,
  MudData,
  PumpData,
  FormationData,
  DrillingResults,
} from "../store/drilling-types";
import { orchestrateCalculations } from "./orchestrator";

/**
 * DDS-Twin Engine
 * Fast-path calculation for real-time simulations without affecting global store.
 */
export interface TwinScenario {
  label: string;
  deltaMW: number;
  deltaGPM: number;
  results: DrillingResults;
}

export function simulateScenario(
  well: WellData,
  mud: MudData,
  pump: PumpData,
  formation: FormationData,
  modifications: {
    mudWeight?: number;
    strokesPerMinute?: number;
    rpm?: number;
    rop?: number;
  },
): DrillingResults {
  const simMud = {
    ...mud,
    mudWeight: modifications.mudWeight ?? mud.mudWeight,
  };

  // Drive simulation by strokesPerMinute directly -- no GPM round-trip
  // that would silently divide by numberOfPumps and halve flow.
  const simPump = {
    ...pump,
    strokesPerMinute: modifications.strokesPerMinute ?? pump.strokesPerMinute,
  };

  return orchestrateCalculations(well, formation, simMud, simPump, [], {
    frictionCoefficient: 0.3,
  });
}
