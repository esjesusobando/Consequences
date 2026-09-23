import type {
  WellData,
  MudData,
  PumpData,
  FormationData,
  DrillingResults,
} from "../store/drilling-types";
import { orchestrateCalculations } from "./orchestrator";

/**
 * DDS-Twin Engine 🔱
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
    gpm?: number;
    rpm?: number;
    rop?: number;
  },
): DrillingResults {
  const simMud = {
    ...mud,
    mudWeight: modifications.mudWeight ?? mud.mudWeight,
  };

  // En una implementación real, RPM y ROP afectarían el ECD a través de modelos de acarreo y fricción.
  // Aquí los preparamos para el orquestador.
  const simPump = {
    ...pump,
    strokesPerMinute: modifications.gpm
      ? modifications.gpm / (pump.numberOfPumps * 0.1) /* simplificación */
      : pump.strokesPerMinute,
  };

  return orchestrateCalculations(well, formation, simMud, simPump, [], {
    frictionCoefficient: 0.3,
  });
}
