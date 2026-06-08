import { calculateRheology } from "./rheology";
import { calculatePump } from "./pump";
import { calculateVolumes } from "./volumetrics";
import { calculateHydraulics } from "./hydraulics";
import { calculatePressures } from "./pressures";
import { calculateCirculation } from "./circulation";
import { calculateCuttingsTransport } from "./cuttings-transport";
import { calculateTrajectory } from "./directional";
import { calculateTorqueDrag } from "./torque-drag";
import { calculateWellControl } from "./well-control";
import { calculateSurgeSwab } from "./surge-swab";
import { calculateStuckPipe } from "./stuck-pipe";
import type {
  WellData,
  MudData,
  PumpData,
  FormationData,
  DrillingResults,
} from "../store/drilling-types";

/**
 * Orchestrator for all drilling calculations (Elite Standard).
 * Ensures data flows correctly between Rheology (Bingham/PL/HB) -> Hydraulics -> Cleaning.
 */
export function orchestrateCalculations(
  wellData: WellData,
  formationData: FormationData,
  mudData: MudData,
  pumpData: PumpData,
  surveys: any[], // To be typed properly or extracted from wellData
  tdData: any, // Torque & Drag settings
  wellControlData: any = {}, // Well Control settings
): DrillingResults {
  try {
    // 1. Volumetría (Base para todo)
    const volumetrics = calculateVolumes(wellData);

    // 2. Reología (Modelos Triple-Point HB/PL/Bingham)
    const rheology = calculateRheology(mudData);

    // 3. Configuración de Bomba
    const pump = calculatePump(pumpData);

    // 4. Hidráulica Avanzada (Bit & Annulus)
    const hydraulics = calculateHydraulics(wellData, mudData, pump, rheology);

    // 5. Presiones Críticas y Ventana Operativa
    const pressures = calculatePressures(wellData, formationData, mudData);

    // 6. Circulación y Tiempos
    const circulation = calculateCirculation(volumetrics, pump);

    // 7. Transporte de Recortes (CCI / Slip Velocity)
    const cuttings = calculateCuttingsTransport(
      wellData,
      mudData,
      rheology,
      hydraulics,
    );

    // 8. Perforación Direccional (MCM)
    const directional = calculateTrajectory(
      surveys,
      wellData.surfaceNorth,
      wellData.surfaceEast,
      wellData.gridConvergence,
    );

    // 9. Torque & Drag (Soft-String)
    const torqueDrag = calculateTorqueDrag(
      wellData,
      directional.trajectory,
      mudData.mudWeight,
      tdData,
    );

    const wellControl = calculateWellControl(
      wellData,
      wellControlData,
      mudData.mudWeight,
      volumetrics,
      pump,
      formationData.fractureGradient,
      wellData.tvd,
    );

    // 11. Surge & Swab (Dynamic Pressures)
    const surgeSwab = calculateSurgeSwab(
      wellData,
      mudData,
      rheology,
      wellControlData.pipeSpeed ?? 90,
    );

    // 12. Stuck Pipe (Mechanical Risks)
    const stuckPipe = calculateStuckPipe(
      wellData,
      pressures,
      directional,
      cuttings,
    );

    // Final Assembly (Elite)
    const baseResults = {
      volumetrics,
      rheology,
      pump,
      circulation,
      pressures,
      hydraulics,
      cuttings,
      directional,
      torqueDrag,
      wellControl,
      surgeSwab,
      stuckPipe,
      riskScore: 0,
      tacticalAdvice: [] as string[],
    };

    const { score, advice } = calculateRiskAndAdvice(baseResults);
    return { ...baseResults, riskScore: score, tacticalAdvice: advice };
  } catch (error) {
    console.error("🔱 ENGINE ERROR: Fallo en orquestación hexagonal:", error);
    // Retornamos un estado seguro (fallback) para evitar que la UI se rompa
    const emptyVol: any = {
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
    };
    return {
      volumetrics: emptyVol,
      rheology: {
        pv: 0,
        yp: 0,
        n_pl: 1,
        k_pl: 0,
        n_hb: 1,
        k_hb: 0,
        tau0_hb: 0,
        mu_eff: 0,
        gel10s: 0,
        gel10m: 0,
        av: 0,
        pvYpRatio: 0,
        gelProgression: 0,
      },
      pump: {
        outputPerStroke: 0,
        flowRateGPM: 0,
        flowRateBBLmin: 0,
        hydraulicHP: 0,
      },
      circulation: {
        surfaceToBit: 0,
        bitToSurface: 0,
        fullCirculation: 0,
        bottomsUp: 0,
        lagStrokes: 0,
        lagTime: 0,
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
        ecd: mudData.mudWeight,
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
      },
      surgeSwab: {
        surgePressure: 0,
        swabPressure: 0,
        ecdSurge: 0,
        ecdSwab: 0,
        effectiveAnnularVelocity: 0,
        flowRegimeSurge: "Laminar",
        modelUsed: "None",
        pipeSpeed: 0,
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
}

/**
 * SLB-Grade Risk Engine (Elite Algorithm)
 * Evaluates holistic drilling risk (0-100)
 */
function calculateRiskAndAdvice(results: any): {
  score: number;
  advice: string[];
} {
  let score = 0;
  const advice: string[] = [];

  // 1. DLS Risk Analysis
  const trajectory = results.directional?.trajectory || [];
  const maxDLS =
    trajectory.length > 0
      ? Math.max(...trajectory.map((p: any) => p.dls || 0))
      : 0;

  if (maxDLS > 6) {
    score += 50;
    advice.push("🚨 DLS CRÍTICO: Riesgo extremo de pega y fatiga de tubería.");
  } else if (maxDLS > 4) {
    score += 20;
    advice.push("⚠️ DLS ALTO: Monitorear torque por posible ojo de llave.");
  }

  // 2. Mechanical Tension Risk
  const hookLoad = (results.torqueDrag?.pickupHookLoad || 0) / 1000; // to klbs
  const tensileLimit = results.torqueDrag?.tensileLimit || 0;
  if (tensileLimit > 0) {
    const ratio = hookLoad / tensileLimit;
    if (ratio > 0.95) {
      score += 100;
      advice.push("☢️ LÍMITE ELÁSTICO: Detener operaciones. Riesgo de rotura.");
    } else if (ratio > 0.8) {
      score += 30;
      advice.push("⚠️ CARGA ALTA: Operando al 80% de capacidad mecánica.");
    }
  }

  // 3. Positional Neutral Point Risk
  const neutralPoint = results.torqueDrag?.neutralPoint || 0;
  // Si el punto neutro está muy alto (DP en compresión)
  if (neutralPoint > 0 && neutralPoint < 7200) {
    score += 15;
    advice.push(
      "💡 CONSEJO: Punto Neutro en DP. Aumentar WOB para evitar pandeo.",
    );
  }

  // 4. Hydraulics Risk (ECD, Régimen Anular, Limpieza de Hoyo)
  const ecd = results.hydraulics?.ecd || 0;
  const fracGradient = results.pressures?.fracturePressure || 0;
  // tvd is calculated but not used here
  if (results.pressures) {
    fracGradient / 0.052;
  }
  const maxMW = results.pressures?.maxMudWeight || 0;

  if (ecd > 0 && maxMW > 0) {
    const ecdMarginPct = (maxMW - ecd) / maxMW;
    if (ecdMarginPct < 0.03) {
      // <3% margin → critical
      score += 50;
      advice.push(
        "☢️ ECD CRÍTICO: Margen de fractura <3%. Reducir SPM o caudal inmediatamente.",
      );
    } else if (ecdMarginPct < 0.07) {
      // <7% → warning
      score += 20;
      advice.push(
        "⚠️ ECD ALTO: Margen de fractura <7%. Monitorear presión de tobero.",
      );
    }
  }

  // 5. Stuck Pipe & Mechanical Integrity
  const stuckRisk = results.stuckPipe?.totalRiskScore || 0;
  if (stuckRisk > 70) {
    score += 40;
    advice.push(
      "🚨 RIESGO DE PEGA ALTO: Múltiples factores mecánicos detectados. Vigilar sobretensión.",
    );
  } else if (results.stuckPipe?.differentialRiskLevel === "High") {
    score += 25;
    advice.push(
      "⚠️ PEGA DIFERENCIAL: Reducir sobrebalance o mejorar reología.",
    );
  }

  // 6. Surge & Swab Safety Margin
  const surgeEcd = results.surgeSwab?.ecdSurge || 0;
  if (surgeEcd > maxMW && maxMW > 0) {
    score += 35;
    advice.push(
      "🚨 SURGE CRÍTICO: Las presiones de maniobra fracturarán la formación. Bajar tubería más lento.",
    );
  }

  return { score: Math.min(score, 100), advice };
}
