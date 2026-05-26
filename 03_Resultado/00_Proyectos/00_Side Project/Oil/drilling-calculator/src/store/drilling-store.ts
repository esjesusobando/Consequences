// ============================================================
// Drilling Calculator — Zustand Store
// Central state management with default well values
// ============================================================

import { create } from "zustand";
import type {
  WellData,
  FormationData,
  MudData,
  PumpData,
  DrillingResults,
  ValidationResults,
  DrillingAlert,
  DrillingSnapshot,
  WellControlData,
  TorqueDragData,
} from "./drilling-types";
import { generateAlerts } from "../guards/alert-engine";
import { orchestrateCalculations } from "../engine/orchestrator";

// Default Results Constants
const DEFAULT_RESULTS: DrillingResults = {
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
  },
  rheology: {
    av: 0,
    pv: 0,
    yp: 0,
    n_pl: 0,
    k_pl: 0,
    n_hb: 0,
    k_hb: 0,
    tau0_hb: 0,
    pvYpRatio: 0,
    gelProgression: 0,
    mu_eff: 0,
    gel10s: 0,
    gel10m: 0,
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
  },
  surgeSwab: {
    surgePressure: 0,
    swabPressure: 0,
    ecdSurge: 0,
    ecdSwab: 0,
    effectiveAnnularVelocity: 0,
    flowRegimeSurge: "Laminar",
    modelUsed: "Burkhardt",
    pipeSpeed: 100,
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

const DEFAULT_VALIDATION_SECTION = {
  inputGuard: { status: "valid" as const },
  outputGuard: { status: "valid" as const },
  overall: "valid" as const,
};

const DEFAULT_VALIDATION: ValidationResults = {
  wellGeometry: DEFAULT_VALIDATION_SECTION,
  formation: DEFAULT_VALIDATION_SECTION,
  mud: DEFAULT_VALIDATION_SECTION,
  pump: DEFAULT_VALIDATION_SECTION,
};

interface DrillingState {
  wellData: WellData;
  formationData: FormationData;
  mudData: MudData;
  pumpData: PumpData;
  activeFocus: string | null;
  notes: Array<{ id: string; content: string; completed: boolean }>;

  // Directional & T&D Input
  surveys: Array<{ md: number; inc: number; azi: number }>;
  torqueDragData: TorqueDragData;
  wellControlData: WellControlData;

  // Computed State
  results: DrillingResults;
  validationResults: ValidationResults;
  alerts: DrillingAlert[];

  // Expanded sections
  expandedSections: Record<string, boolean>;
  activeNozzleIndex: number | null;
  snapshots: DrillingSnapshot[];

  // UI State
  zenMode: boolean;
  showGraphs: boolean;

  // Actions
  setWellData: (data: Partial<WellData>) => void;
  setFormationData: (data: Partial<FormationData>) => void;
  setMudData: (data: Partial<MudData>) => void;
  setPumpData: (data: Partial<PumpData>) => void;
  setSurveys: (
    surveys: Array<{ md: number; inc: number; azi: number }>,
  ) => void;
  setTorqueDragData: (data: Partial<TorqueDragData>) => void;
  setWellControlData: (data: Partial<WellControlData>) => void;

  setResults: (results: DrillingResults) => void;
  setValidationResults: (validation: ValidationResults) => void;
  setAlerts: (alerts: DrillingAlert[]) => void;

  toggleSection: (id: string) => void;
  setActiveFocus: (id: string | null) => void;
  addNote: (content: string) => void;
  toggleNote: (id: string) => void;
  removeNote: (id: string) => void;
  setActiveNozzleIndex: (index: number | null) => void;
  saveSnapshot: (label: string) => void;
  removeSnapshot: (id: string) => void;
  // Dashboard Navigation State
  activeView: string;
  setActiveView: (view: string) => void;

  // Panel Control State
  showPanels: boolean;
  setShowPanels: (show: boolean) => void;
  togglePanels: () => void;
  showLeftPanel: boolean;
  showRightPanel: boolean;
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  setZenMode: (zen: boolean) => void;
  setShowGraphs: (show: boolean) => void;
  setPipeSpeed: (speed: number) => void;
  calculateAll: () => void;
}

// ─── Default Values (from original sketch) ─────────────────

const DEFAULT_WELL: WellData = {
  totalDepth: 9000,
  tvd: 7800,
  holeSize: 12.25,
  drillPipeOD: 5.0,
  drillPipeID: 4.276,
  drillPipeLength: 7200,
  hwdpOD: 5.0,
  hwdpID: 3.0,
  hwdpLength: 300,
  dcOD: 8.0,
  dcID: 2.8125,
  dcLength: 500,
  bitSize: 12.25,
  bitNozzles: [14, 14, 14],
  surfaceNorth: 10000000,
  surfaceEast: 500000,
  gridConvergence: 0,
};

const DEFAULT_FORMATION: FormationData = {
  porePressureGradient: 0.52,
  fractureGradient: 0.85,
  normalGradient: 0.465,
};

const DEFAULT_MUD: MudData = {
  mudWeight: 10.5,
  theta600: 65,
  theta300: 42,
  theta200: 35,
  theta100: 25,
  theta6: 8,
  theta3: 7,
  plasticViscosity: 23,
  yieldPoint: 19,
  gel10sec: 7,
  gel10min: 12,
  rheologyModel: "BINGHAM",
};

const DEFAULT_PUMP: PumpData = {
  pumpType: "Triplex",
  linerDiameter: 6.5,
  strokeLength: 12,
  rodDiameter: 2.5,
  strokesPerMinute: 85,
  efficiency: 90,
  numberOfPumps: 2,
  standpipePressure: 2850,
};

const DEFAULT_WELL_CONTROL: WellControlData = {
  sidpp: 0,
  sicp: 0,
  pitGain: 0,
  killRateGPM: 0,
  killRatePressure: 0,
  safetyMargin: 0,
  pipeSpeed: 90,
};

// ─── Store ─────────────────────────────────────────────────

export const useDrillingStore = create<DrillingState>((set, get) => ({
  wellData: DEFAULT_WELL,
  formationData: DEFAULT_FORMATION,
  mudData: DEFAULT_MUD,
  pumpData: DEFAULT_PUMP,

  results: DEFAULT_RESULTS,
  validationResults: DEFAULT_VALIDATION,
  alerts: [],
  activeFocus: null,
  notes: [],
  snapshots: [],

  surveys: [
    { md: 0, inc: 0, azi: 0 },
    { md: 1000, inc: 0, azi: 0 },
    { md: 2000, inc: 10.5, azi: 90 },
  ],
  torqueDragData: {
    frictionCoefficient: 0.25,
    steelDensity: 65.5,
    minSafetyFactor: 1.5,
    weightOnBit: 20.0,
    tensileLimit: 550, // klbs (G-105 Standard)
    torqueLimit: 62000, // ft-lbs (G-105 Standard)
  },
  wellControlData: DEFAULT_WELL_CONTROL,
  // Initial State
  activeView: "drilling",
  showPanels: true,
  showLeftPanel: true,
  showRightPanel: true,
  zenMode: false,
  showGraphs: true,

  expandedSections: {
    wellGeometry: true,
    formation: true,
    mud: true,
    pump: true,
    volumetrics: true,
    circulation: true,
    pressures: true,
    hydraulics: true,
    rheology: true,
    wellControl: true,
    surgeSwab: true,
    stuckPipe: true,
  },
  activeNozzleIndex: null,

  setWellData: (data) => {
    set((state) => ({ wellData: { ...state.wellData, ...data } }));
    get().calculateAll();
  },

  setFormationData: (data) => {
    set((state) => ({ formationData: { ...state.formationData, ...data } }));
    get().calculateAll();
  },

  setMudData: (data) => {
    set((state) => ({ mudData: { ...state.mudData, ...data } }));
    get().calculateAll();
  },

  setPumpData: (data) => {
    set((state) => ({ pumpData: { ...state.pumpData, ...data } }));
    get().calculateAll();
  },

  setSurveys: (surveys) => {
    set({ surveys });
    get().calculateAll();
  },

  setTorqueDragData: (data) => {
    set((state) => ({ torqueDragData: { ...state.torqueDragData, ...data } }));
    get().calculateAll();
  },

  setWellControlData: (data) => {
    set((state) => ({
      wellControlData: { ...state.wellControlData, ...data },
    }));
    get().calculateAll();
  },

  setResults: (results) => set({ results }),
  setValidationResults: (validationResults) => set({ validationResults }),
  setAlerts: (alerts) => set({ alerts }),

  /**
   * Orchestrate all calculations and update the state atomically.
   * This is the heart of the engine's stability (Pilar 0).
   */
  calculateAll: () => {
    const {
      wellData,
      mudData,
      pumpData,
      formationData,
      surveys,
      torqueDragData,
    } = get();
    try {
      const results = orchestrateCalculations(
        wellData,
        formationData,
        mudData,
        pumpData,
        surveys,
        torqueDragData,
        get().wellControlData,
      );

      const newAlerts = generateAlerts(results);

      set({ results, alerts: newAlerts });
    } catch (error) {
      console.error("Critical Engine Failure:", error);
    }
  },

  toggleSection: (id) =>
    set((state) => ({
      expandedSections: {
        ...state.expandedSections,
        [id]: !state.expandedSections[id],
      },
    })),

  setActiveFocus: (id) => set({ activeFocus: id }),

  addNote: (content) =>
    set((state) => ({
      notes: [
        ...state.notes,
        { id: crypto.randomUUID(), content, completed: false },
      ],
    })),

  toggleNote: (id) =>
    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id ? { ...n, completed: !n.completed } : n,
      ),
    })),

  removeNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
    })),

  setActiveNozzleIndex: (index) => set({ activeNozzleIndex: index }),

  saveSnapshot: (label) =>
    set((state) => ({
      snapshots: [
        ...state.snapshots,
        {
          id: crypto.randomUUID(),
          timestamp: new Date().toLocaleString(),
          label,
          data: {
            wellData: state.wellData,
            formationData: state.formationData,
            mudData: state.mudData,
            pumpData: state.pumpData,
          },
        },
      ],
    })),

  removeSnapshot: (id) =>
    set((state) => ({
      snapshots: state.snapshots.filter((s) => s.id !== id),
    })),

  // Navigation Actions
  setActiveView: (view) => set({ activeView: view }),

  // Panel Actions
  setShowPanels: (show) => set({ showPanels: show }),
  togglePanels: () =>
    set((state) => ({
      showPanels: !state.showPanels,
      showLeftPanel: !state.showPanels,
      showRightPanel: !state.showPanels,
    })),
  toggleLeftPanel: () =>
    set((state) => ({ showLeftPanel: !state.showLeftPanel })),
  toggleRightPanel: () =>
    set((state) => ({ showRightPanel: !state.showRightPanel })),

  setZenMode: (zen) => set({ zenMode: zen }),
  setShowGraphs: (show) => set({ showGraphs: show }),

  setPipeSpeed: (speed: number) => {
    set((state) => ({
      wellControlData: { ...state.wellControlData, pipeSpeed: speed },
    }));
    get().calculateAll();
  },
}));

// Initial Trigger: Core system stability (Pilar 0)
useDrillingStore.getState().calculateAll();
