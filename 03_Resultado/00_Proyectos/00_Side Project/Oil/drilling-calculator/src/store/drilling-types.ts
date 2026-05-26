// ============================================================
// Drilling Calculator — Type Definitions (Pure Export)
// ============================================================

export interface DrillingResults {
  volumetrics: VolumetricsResult;
  rheology: RheologyResult;
  pump: PumpResult;
  circulation: CirculationResult;
  pressures: PressureResult;
  hydraulics: HydraulicsResult;
  cuttings: CuttingsTransportResult;
  directional: DirectionalResult;
  torqueDrag: TorqueDragResult;
  wellControl: WellControlResult;
  surgeSwab: SurgeSwabResult;
  stuckPipe: StuckPipeResult;
  riskScore: number; // 0-100 (Holistic Risk)
  tacticalAdvice: string[]; // AI-driven recommendations
}

// ─── Well Geometry ────────────────────────────────────────────
export interface WellData {
  totalDepth: number; // ft (MD)
  tvd: number; // ft (TVD)
  holeSize: number; // in
  drillPipeOD: number;
  drillPipeID: number;
  drillPipeLength: number;
  hwdpOD: number;
  hwdpID: number;
  hwdpLength: number;
  dcOD: number;
  dcID: number;
  dcLength: number;
  bitSize: number;
  bitNozzles: number[];
  trajectoryId?: string; // Link to directional module if connected

  // UTM Surface Coordinates
  surfaceNorth?: number;
  surfaceEast?: number;
  gridConvergence?: number;
}

// ─── Directional Drilling (Independiente) ──────────────────────
export interface SurveyRecord {
  md: number; // Measured Depth (ft)
  inc: number; // Inclination (deg)
  azi: number; // Azimuth (deg)
}

export interface TrajectoryPoint extends SurveyRecord {
  tvd: number; // True Vertical Depth (ft)
  north: number; // Northing (ft)
  east: number; // Easting (ft)
  dls: number; // Dog Leg Severity (deg/100ft)
  cl: number; // Course Length (ft)
}

export interface DirectionalResult {
  surveys: SurveyRecord[];
  trajectory: TrajectoryPoint[];
  totalClosure: number;
  closureAzimuth: number;
}

// ─── Torque & Drag (Interconectado) ──────────────────────────
export interface TorqueDragData {
  frictionCoefficient: number;
  steelDensity: number; // ppg (points per gallon equivalent)
  minSafetyFactor: number;
  weightOnBit: number; // klbs
  tensileLimit: number; // klbs (Yield Strength)
  torqueLimit: number; // ft-lbs
}

export interface TorqueDragResult {
  pickupHookLoad: number;
  slackoffHookLoad: number;
  rotatingTorque: number;
  neutralPoint: number;
  minSafetyFactor: number;
  tensileLimit: number;
  torqueLimit: number;
  profile: { md: number; pickup: number; slackoff: number; torque: number }[];
}

export interface DrillingSnapshot {
  id: string;
  timestamp: string;
  label: string;
  data: {
    wellData: WellData;
    formationData: FormationData;
    mudData: MudData;
    pumpData: PumpData;
  };
}

// ─── Formation ────────────────────────────────────────────────
export interface FormationData {
  porePressureGradient: number;
  fractureGradient: number;
  normalGradient: number;
}

// ─── Mud Properties ───────────────────────────────────────────
export type RheologyModel = "BINGHAM" | "POWER_LAW" | "HERSCHEL_BULKLEY";

export interface MudData {
  mudWeight: number;
  theta600: number;
  theta300: number;
  theta200: number;
  theta100: number;
  theta6: number;
  theta3: number;
  plasticViscosity: number;
  yieldPoint: number;
  gel10sec: number;
  gel10min: number;
  rheologyModel: RheologyModel;
  apparentViscosity?: number;
  pvYpRatio?: number;
  gelProgression?: number;
}

// ─── Pump Configuration ───────────────────────────────────────
export interface PumpData {
  pumpType: "Triplex" | "Duplex";
  linerDiameter: number;
  strokeLength: number;
  rodDiameter: number;
  strokesPerMinute: number;
  efficiency: number;
  numberOfPumps: number;
  standpipePressure: number;
}

// ─── Results Child Interfaces ─────────────────────────────────
export interface VolumetricsResult {
  holeCapacity: number;
  drillPipeCapacity: number;
  hwdpCapacity: number;
  dcCapacity: number;
  annularDP: number;
  annularHWDP: number;
  annularDC: number;
  displacementDP: number;
  displacementHWDP: number;
  displacementDC: number;
  volumeInsideDP: number;
  volumeInsideHWDP: number;
  volumeInsideDC: number;
  totalInsideVolume: number;
  volumeAnnularDP: number;
  volumeAnnularHWDP: number;
  volumeAnnularDC: number;
  totalAnnularVolume: number;
  totalSystemVolume: number;
  openHoleVolume: number;
  surfaceToBitTime: number;
  bottomsUpTime: number;
  totalCirculationTime: number;
}

export interface RheologyResult {
  pv: number;
  yp: number;
  av: number;
  pvYpRatio: number;
  n_pl: number;
  k_pl: number;
  n_hb: number;
  k_hb: number;
  tau0_hb: number;
  mu_eff: number;
  gel10s: number;
  gel10m: number;
  gelProgression: number;
}

export interface PumpResult {
  outputPerStroke: number;
  flowRateGPM: number;
  flowRateBBLmin: number;
  hydraulicHP: number;
}

export interface CirculationResult {
  surfaceToBit: number;
  bitToSurface: number;
  fullCirculation: number;
  bottomsUp: number;
  lagStrokes: number;
  lagTime: number;
}

export interface PressureResult {
  porePressure: number;
  fracturePressure: number;
  hydrostaticPressure: number;
  mudGradient: number;
  minMudWeight: number;
  maxMudWeight: number;
  mudWindow: number;
  overbalance: number;
  overbalancePPG: number;
}

export interface HydraulicsResult {
  annularVelocity: number;
  pipeVelocity: number;
  totalFlowArea: number;
  nozzleVelocity: number;
  pressureLossDP: number;
  pressureLossHWDP: number;
  pressureLossDC: number;
  pressureLossBit: number;
  pressureLossAnnular: number;
  totalPressureLoss: number;
  ecd: number;
  bottomHolePressure: number;
  bitHHP: number;
  hhpPerSqIn: number;
  impactForce: number;
  impactPerSqIn: number;
  flowRegimeDP: "Laminar" | "Turbulent" | "Transition";
  flowRegimeAnnular: "Laminar" | "Turbulent" | "Transition";
  velocityRatio: number;
  rheologyModelSelected: RheologyModel;
  reynoldsDP: number;
  reynoldsAnnular: number;
}

export interface CuttingsTransportResult {
  slipVelocity: number;
  transportVelocity: number;
  transportRatio: number;
  cuttingCarryingIndex: number;
  holeCleaningEfficiency: number;
  cuttingsConcentration: number;
}

// ─── Well Control (The Kick Shield) ──────────────────────────
export interface WellControlData {
  sidpp: number; // psi
  sicp: number; // psi
  pitGain: number; // bbl
  killRateGPM: number;
  killRatePressure: number; // psi (SCR)
  safetyMargin: number; // ppg
  pipeSpeed: number; // ft/min (Tripping)
}

export interface WellControlResult {
  kmw: number; // ppg
  icp: number; // psi
  fcp: number; // psi
  maasp: number; // psi
  strokesToBit: number;
  strokesToSurface: number;
  totalStrokes: number;
  stepDownSchedule: { strokes: number; pressure: number }[];
}

// ─── Drilling Mechanics: Surge & Swab ────────────────────────
export interface SurgeSwabResult {
  surgePressure: number; // psi
  swabPressure: number; // psi
  ecdSurge: number; // ppg
  ecdSwab: number; // ppg
  effectiveAnnularVelocity: number; // ft/min
  flowRegimeSurge: "Laminar" | "Turbulent" | "Transition";
  modelUsed: string;
  pipeSpeed: number;
}

// ─── Drilling Mechanics: Stuck Pipe ──────────────────────────
export interface StuckPipeResult {
  differentialStickingForce: number; // lbs
  differentialRiskLevel: "Low" | "Medium" | "High";
  keySeatingRisk: "Low" | "Medium" | "High";
  holeCleaningRisk: "Low" | "Medium" | "High";
  freePointDepth: number; // ft
  feetOfFreePipe: number; // ft
  freePointConstant: number;
}

// ─── UI & Alerts ──────────────────────────────────────────────
export type AlertLevel = "critical" | "warning" | "info" | "success";

export interface DrillingAlert {
  level: AlertLevel;
  message: string;
  detail: string;
  module: string;
}

export type ValidationStatus =
  | "valid"
  | "warning"
  | "error"
  | "pending"
  | "neutral";

export interface ValidationResult {
  status: ValidationStatus;
  message?: string;
}

export interface SectionValidation {
  inputGuard: ValidationResult;
  outputGuard: ValidationResult;
  overall: ValidationStatus;
}

export interface ValidationResults {
  wellGeometry: SectionValidation;
  formation: SectionValidation;
  mud: SectionValidation;
  pump: SectionValidation;
}
