import React, { useState, useMemo } from 'react';
import { Calculator, Droplet, Gauge, Clock, Info, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function DrillingCalculator() {
  // Estado para expandir/colapsar secciones
  const [expandedSections, setExpandedSections] = useState({
    wellGeometry: true,
    formation: true,
    mud: true,
    pump: true,
    results: true
  });

  // Estados de datos
  const [wellData, setWellData] = useState({
    // Geometría del pozo
    totalDepth: 8000, // ft (MD)
    tvd: 7800, // ft (TVD)
    holeSize: 12.25, // in
    
    // Tubería de perforación
    drillPipeOD: 5.0, // in
    drillPipeID: 4.276, // in
    drillPipeLength: 7200, // ft
    
    // Heavy Weight Drill Pipe
    hwdpOD: 5.0, // in
    hwdpID: 3.0, // in
    hwdpLength: 300, // ft
    
    // Drill Collars
    dcOD: 8.0, // in
    dcID: 2.8125, // in
    dcLength: 500, // ft
    
    // Bit
    bitSize: 12.25, // in
    bitNozzles: [14, 14, 14], // 32nds
  });

  const [formationData, setFormationData] = useState({
    porePressureGradient: 0.52, // psi/ft
    fractureGradient: 0.85, // psi/ft
    normalGradient: 0.465, // psi/ft (seawater)
  });

  const [mudData, setMudData] = useState({
    mudWeight: 10.5, // ppg
    
    // Fann viscometer readings
    theta600: 65,
    theta300: 42,
    theta200: 35,
    theta100: 25,
    theta6: 8,
    theta3: 7,
    
    // Gel strengths
    gel10sec: 7,
    gel10min: 12,
  });

  const [pumpData, setPumpData] = useState({
    pumpType: 'Triplex',
    linerDiameter: 6.5, // in
    strokeLength: 12, // in
    rodDiameter: 2.5, // in (for duplex)
    strokesPerMinute: 85, // SPM
    efficiency: 90, // %
    numberOfPumps: 2,
    standpipePressure: 2850, // psi
  });

  // ==================== CÁLCULOS ====================

  // 1. VOLUMETRÍA
  const volumetrics = useMemo(() => {
    const v = {};
    
    // Capacidades (bbl/ft)
    v.holeCapacity = Math.pow(wellData.holeSize, 2) / 1029.4;
    v.drillPipeCapacity = Math.pow(wellData.drillPipeID, 2) / 1029.4;
    v.hwdpCapacity = Math.pow(wellData.hwdpID, 2) / 1029.4;
    v.dcCapacity = Math.pow(wellData.dcID, 2) / 1029.4;
    
    // Capacidades anulares
    v.annularDP = (Math.pow(wellData.holeSize, 2) - Math.pow(wellData.drillPipeOD, 2)) / 1029.4;
    v.annularHWDP = (Math.pow(wellData.holeSize, 2) - Math.pow(wellData.hwdpOD, 2)) / 1029.4;
    v.annularDC = (Math.pow(wellData.holeSize, 2) - Math.pow(wellData.dcOD, 2)) / 1029.4;
    
    // Desplazamientos
    v.displacementDP = (Math.pow(wellData.drillPipeOD, 2) - Math.pow(wellData.drillPipeID, 2)) / 1029.4;
    v.displacementHWDP = (Math.pow(wellData.hwdpOD, 2) - Math.pow(wellData.hwdpID, 2)) / 1029.4;
    v.displacementDC = (Math.pow(wellData.dcOD, 2) - Math.pow(wellData.dcID, 2)) / 1029.4;
    
    // Volúmenes totales
    v.volumeInsideDP = v.drillPipeCapacity * wellData.drillPipeLength;
    v.volumeInsideHWDP = v.hwdpCapacity * wellData.hwdpLength;
    v.volumeInsideDC = v.dcCapacity * wellData.dcLength;
    v.totalInsideVolume = v.volumeInsideDP + v.volumeInsideHWDP + v.volumeInsideDC;
    
    v.volumeAnnularDP = v.annularDP * wellData.drillPipeLength;
    v.volumeAnnularHWDP = v.annularHWDP * wellData.hwdpLength;
    v.volumeAnnularDC = v.annularDC * wellData.dcLength;
    v.totalAnnularVolume = v.volumeAnnularDP + v.volumeAnnularHWDP + v.volumeAnnularDC;
    
    // Volumen total del sistema
    v.totalSystemVolume = v.totalInsideVolume + v.totalAnnularVolume;
    
    // Volumen del hoyo abierto (open hole)
    const openHoleLength = wellData.totalDepth - (wellData.drillPipeLength + wellData.hwdpLength + wellData.dcLength);
    v.openHoleVolume = v.holeCapacity * Math.max(0, openHoleLength);
    
    return v;
  }, [wellData]);

  // 2. REOLOGÍA
  const rheology = useMemo(() => {
    const r = {};
    
    // Modelo Bingham Plastic
    r.plasticViscosity = mudData.theta600 - mudData.theta300; // cP
    r.yieldPoint = mudData.theta300 - r.plasticViscosity; // lb/100ft²
    r.apparentViscosity = mudData.theta600 / 2; // cP
    
    // Geles
    r.gel10sec = mudData.gel10sec;
    r.gel10min = mudData.gel10min;
    r.gelProgression = mudData.gel10min / mudData.gel10sec;
    
    // Modelo Power Law
    r.n = 3.32 * Math.log10(mudData.theta600 / mudData.theta300); // flow behavior index
    r.K = (5.11 * mudData.theta300) / Math.pow(511, r.n); // consistency index
    
    // Ratios
    r.pvYpRatio = r.plasticViscosity / r.yieldPoint;
    
    return r;
  }, [mudData]);

  // 3. BOMBA Y CAUDAL
  const pumpCalcs = useMemo(() => {
    const p = {};
    
    // Output por stroke
    const factor = pumpData.pumpType === 'Triplex' ? 0.000243 : 0.000162;
    const rodArea = pumpData.pumpType === 'Duplex' ? Math.pow(pumpData.rodDiameter, 2) : 0;
    
    p.outputPerStroke = factor * 
      (Math.pow(pumpData.linerDiameter, 2) - rodArea) * 
      pumpData.strokeLength * 
      (pumpData.efficiency / 100);
    
    // Caudal total
    p.flowRateGPM = p.outputPerStroke * pumpData.strokesPerMinute * pumpData.numberOfPumps;
    p.flowRateBBLmin = p.flowRateGPM / 42;
    
    // Hydraulic horsepower
    p.hydraulicHP = (pumpData.standpipePressure * p.flowRateGPM) / 1714;
    
    return p;
  }, [pumpData]);

  // 4. TIEMPOS DE CIRCULACIÓN
  const circulationTimes = useMemo(() => {
    const ct = {};
    
    if (pumpCalcs.flowRateBBLmin === 0) {
      return {
        surfaceToBit: 0,
        bitToSurface: 0,
        fullCirculation: 0,
        bottomsUp: 0,
        lagStrokes: 0,
        lagTime: 0
      };
    }
    
    // Tiempo superficie a bit (pump strokes o minutos)
    ct.surfaceToBit = volumetrics.totalInsideVolume / pumpCalcs.flowRateBBLmin; // min
    
    // Tiempo bit a superficie (anular)
    ct.bitToSurface = volumetrics.totalAnnularVolume / pumpCalcs.flowRateBBLmin; // min
    
    // Circulación completa
    ct.fullCirculation = ct.surfaceToBit + ct.bitToSurface; // min
    
    // Bottoms up time (tiempo para que lodo del fondo llegue a superficie)
    ct.bottomsUp = ct.bitToSurface; // min
    
    // Lag strokes (strokes necesarios para que lodo llegue al bit)
    ct.lagStrokes = (volumetrics.totalInsideVolume / pumpCalcs.outputPerStroke) * pumpData.numberOfPumps;
    
    // Lag time
    ct.lagTime = ct.surfaceToBit; // min
    
    return ct;
  }, [volumetrics, pumpCalcs, pumpData.numberOfPumps]);

  // 5. PRESIONES
  const pressures = useMemo(() => {
    const pr = {};
    
    // Presiones de formación
    pr.porePressure = formationData.porePressureGradient * wellData.tvd;
    pr.fracturePressure = formationData.fractureGradient * wellData.tvd;
    
    // Presión hidrostática
    pr.hydrostaticPressure = mudData.mudWeight * 0.052 * wellData.tvd;
    pr.mudGradient = mudData.mudWeight * 0.052;
    
    // Ventana de lodo
    pr.minMudWeight = formationData.porePressureGradient / 0.052;
    pr.maxMudWeight = formationData.fractureGradient / 0.052;
    pr.mudWindow = pr.maxMudWeight - pr.minMudWeight;
    
    // Overbalance
    pr.overbalance = pr.hydrostaticPressure - pr.porePressure;
    pr.overbalancePPG = pr.overbalance / (0.052 * wellData.tvd);
    
    return pr;
  }, [formationData, mudData.mudWeight, wellData.tvd]);

  // 6. HIDRÁULICA
  const hydraulics = useMemo(() => {
    const h = {};
    
    if (pumpCalcs.flowRateGPM === 0) return {};
    
    // Velocidades
    const dpArea = Math.pow(wellData.holeSize, 2) - Math.pow(wellData.drillPipeOD, 2);
    h.annularVelocity = (24.5 * pumpCalcs.flowRateGPM) / dpArea; // ft/min
    
    h.pipeVelocity = (24.5 * pumpCalcs.flowRateGPM) / Math.pow(wellData.drillPipeID, 2); // ft/min
    
    // Total Flow Area (TFA)
    const tfa = wellData.bitNozzles.reduce((sum, n) => sum + Math.PI * Math.pow(n/32, 2) / 4, 0);
    h.totalFlowArea = tfa;
    h.nozzleVelocity = (pumpCalcs.flowRateGPM * 0.3208) / tfa; // ft/sec
    
    // Pérdidas de presión
    const pv = rheology.plasticViscosity;
    const yp = rheology.yieldPoint;
    
    // Pérdidas en drill pipe (Bingham Plastic)
    h.pressureLossDP = (pv * h.pipeVelocity * wellData.drillPipeLength) / (1500 * wellData.drillPipeID);
    
    // Pérdidas en HWDP
    const hwdpVelocity = (24.5 * pumpCalcs.flowRateGPM) / Math.pow(wellData.hwdpID, 2);
    h.pressureLossHWDP = (pv * hwdpVelocity * wellData.hwdpLength) / (1500 * wellData.hwdpID);
    
    // Pérdidas en drill collars
    const dcVelocity = (24.5 * pumpCalcs.flowRateGPM) / Math.pow(wellData.dcID, 2);
    h.pressureLossDC = (pv * dcVelocity * wellData.dcLength) / (1500 * wellData.dcID);
    
    // Pérdidas en bit
    const Cd = 0.95;
    h.pressureLossBit = (mudData.mudWeight * Math.pow(pumpCalcs.flowRateGPM, 2)) / 
      (10858 * Math.pow(Cd, 2) * Math.pow(tfa, 2));
    
    // Pérdidas en anular
    const annularGap = wellData.holeSize - wellData.drillPipeOD;
    h.pressureLossAnnular = (pv * h.annularVelocity * wellData.totalDepth) / (1500 * annularGap);
    
    // Total
    h.totalPressureLoss = h.pressureLossDP + h.pressureLossHWDP + h.pressureLossDC + 
      h.pressureLossBit + h.pressureLossAnnular;
    
    // ECD
    h.ecd = mudData.mudWeight + (h.pressureLossAnnular / (0.052 * wellData.tvd));
    
    // Presión de fondo
    h.bottomHolePressure = pressures.hydrostaticPressure + h.pressureLossAnnular;
    
    // Optimización de bit
    h.bitHHP = (h.pressureLossBit * pumpCalcs.flowRateGPM) / 1714;
    const bitArea = Math.PI * Math.pow(wellData.bitSize, 2) / 4;
    h.hhpPerSqIn = h.bitHHP / bitArea;
    
    // Impact force
    h.impactForce = 0.01823 * mudData.mudWeight * pumpCalcs.flowRateGPM * h.nozzleVelocity;
    h.impactPerSqIn = h.impactForce / bitArea;
    
    return h;
  }, [pumpCalcs, wellData, rheology, mudData.mudWeight, pressures]);

  // 7. ALERTAS Y VALIDACIONES
  const alerts = useMemo(() => {
    const a = [];
    
    // Validar ventana de lodo
    if (mudData.mudWeight < pressures.minMudWeight) {
      a.push({
        level: 'critical',
        message: `Underbalanced: MW ${mudData.mudWeight.toFixed(2)} < ${pressures.minMudWeight.toFixed(2)} ppg`,
        detail: 'Riesgo de kick'
      });
    }
    
    if (mudData.mudWeight > pressures.maxMudWeight) {
      a.push({
        level: 'critical',
        message: `Overbalanced: MW ${mudData.mudWeight.toFixed(2)} > ${pressures.maxMudWeight.toFixed(2)} ppg`,
        detail: 'Riesgo de fractura'
      });
    }
    
    if (hydraulics.ecd && hydraulics.ecd > pressures.maxMudWeight) {
      a.push({
        level: 'critical',
        message: `ECD ${hydraulics.ecd.toFixed(2)} ppg excede fractura`,
        detail: 'Reducir caudal o optimizar reología'
      });
    }
    
    // Validar reología
    if (rheology.pvYpRatio < 0.5 || rheology.pvYpRatio > 3) {
      a.push({
        level: 'warning',
        message: `PV/YP ratio: ${rheology.pvYpRatio.toFixed(2)} fuera de rango`,
        detail: 'Rango óptimo: 0.5 - 3.0'
      });
    }
    
    if (rheology.gelProgression > 3) {
      a.push({
        level: 'warning',
        message: 'Alta progresión de geles',
        detail: 'Riesgo de atascamiento en conexiones'
      });
    }
    
    // Validar velocidad anular
    if (hydraulics.annularVelocity && hydraulics.annularVelocity < 100) {
      a.push({
        level: 'warning',
        message: `Velocidad anular baja: ${hydraulics.annularVelocity.toFixed(0)} ft/min`,
        detail: 'Mínimo recomendado: 120 ft/min'
      });
    }
    
    if (hydraulics.annularVelocity && hydraulics.annularVelocity > 300) {
      a.push({
        level: 'warning',
        message: `Velocidad anular alta: ${hydraulics.annularVelocity.toFixed(0)} ft/min`,
        detail: 'Máximo recomendado: 240 ft/min'
      });
    }
    
    // Validar HHP/in²
    if (hydraulics.hhpPerSqIn && hydraulics.hhpPerSqIn < 2.0) {
      a.push({
        level: 'info',
        message: `HHP/in² sub-óptimo: ${hydraulics.hhpPerSqIn.toFixed(2)}`,
        detail: 'Objetivo: 2.0 - 3.0 HHP/in²'
      });
    }
    
    return a;
  }, [mudData.mudWeight, pressures, hydraulics, rheology]);

  // ==================== UI COMPONENTS ====================

  const Section = ({ title, id, children, icon: Icon }) => (
    <div className="border border-neutral-200 bg-white">
      <button
        onClick={() => setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }))}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-neutral-900" strokeWidth={1.5} />}
          <h2 className="text-sm font-medium tracking-wide uppercase text-neutral-900">{title}</h2>
        </div>
        {expandedSections[id] ? 
          <ChevronUp className="w-4 h-4 text-neutral-600" strokeWidth={1.5} /> : 
          <ChevronDown className="w-4 h-4 text-neutral-600" strokeWidth={1.5} />
        }
      </button>
      {expandedSections[id] && (
        <div className="px-6 py-6 border-t border-neutral-200">
          {children}
        </div>
      )}
    </div>
  );

  const InputField = ({ label, value, onChange, unit, step = "1", type = "number" }) => (
    <div>
      <label className="block text-xs font-medium text-neutral-600 mb-2 tracking-wide uppercase">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type={type}
          value={value}
          onChange={onChange}
          step={step}
          className="flex-1 px-3 py-2 border border-neutral-300 focus:outline-none focus:border-neutral-900 transition-colors text-sm"
        />
        {unit && <span className="text-xs text-neutral-500 min-w-[40px]">{unit}</span>}
      </div>
    </div>
  );

  const DataCard = ({ label, value, unit, status }) => {
    const statusColors = {
      safe: 'border-l-4 border-l-green-600',
      warning: 'border-l-4 border-l-yellow-600',
      critical: 'border-l-4 border-l-red-600',
      neutral: 'border-l-4 border-l-neutral-300'
    };
    
    return (
      <div className={`bg-neutral-50 p-4 ${statusColors[status] || statusColors.neutral}`}>
        <div className="text-xs text-neutral-600 mb-1 uppercase tracking-wide">{label}</div>
        <div className="text-2xl font-light text-neutral-900 tabular-nums">{value}</div>
        {unit && <div className="text-xs text-neutral-500 mt-1">{unit}</div>}
      </div>
    );
  };

  const Alert = ({ level, message, detail }) => {
    const styles = {
      critical: 'border-l-red-600 bg-red-50',
      warning: 'border-l-yellow-600 bg-yellow-50',
      info: 'border-l-blue-600 bg-blue-50'
    };
    
    return (
      <div className={`border-l-4 p-4 ${styles[level]}`}>
        <div className="flex items-start gap-3">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
          <div>
            <div className="text-sm font-medium text-neutral-900">{message}</div>
            <div className="text-xs text-neutral-600 mt-1">{detail}</div>
          </div>
        </div>
      </div>
    );
  };

  // ==================== RENDER ====================

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-2">
            <Calculator className="w-8 h-8 text-neutral-900" strokeWidth={1.5} />
            <h1 className="text-2xl font-light text-neutral-900 tracking-wide">
              Drilling Engineering Calculator
            </h1>
          </div>
          <p className="text-sm text-neutral-600">
            Volumetrics · Hydraulics · Circulation · Pressures
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="mb-8 space-y-3">
            {alerts.map((alert, idx) => (
              <Alert key={idx} {...alert} />
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Well Geometry */}
            <Section title="Well Geometry" id="wellGeometry" icon={Gauge}>
              <div className="space-y-4">
                <InputField
                  label="Total Depth (MD)"
                  value={wellData.totalDepth}
                  onChange={(e) => setWellData({...wellData, totalDepth: parseFloat(e.target.value) || 0})}
                  unit="ft"
                />
                <InputField
                  label="True Vertical Depth"
                  value={wellData.tvd}
                  onChange={(e) => setWellData({...wellData, tvd: parseFloat(e.target.value) || 0})}
                  unit="ft"
                />
                <InputField
                  label="Hole Size"
                  value={wellData.holeSize}
                  onChange={(e) => setWellData({...wellData, holeSize: parseFloat(e.target.value) || 0})}
                  unit="in"
                  step="0.125"
                />
                
                <div className="pt-4 border-t border-neutral-200">
                  <div className="text-xs font-medium text-neutral-600 mb-3 uppercase tracking-wide">Drill Pipe</div>
                  <div className="space-y-3">
                    <InputField
                      label="OD"
                      value={wellData.drillPipeOD}
                      onChange={(e) => setWellData({...wellData, drillPipeOD: parseFloat(e.target.value) || 0})}
                      unit="in"
                      step="0.125"
                    />
                    <InputField
                      label="ID"
                      value={wellData.drillPipeID}
                      onChange={(e) => setWellData({...wellData, drillPipeID: parseFloat(e.target.value) || 0})}
                      unit="in"
                      step="0.001"
                    />
                    <InputField
                      label="Length"
                      value={wellData.drillPipeLength}
                      onChange={(e) => setWellData({...wellData, drillPipeLength: parseFloat(e.target.value) || 0})}
                      unit="ft"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-200">
                  <div className="text-xs font-medium text-neutral-600 mb-3 uppercase tracking-wide">Drill Collars</div>
                  <div className="space-y-3">
                    <InputField
                      label="OD"
                      value={wellData.dcOD}
                      onChange={(e) => setWellData({...wellData, dcOD: parseFloat(e.target.value) || 0})}
                      unit="in"
                      step="0.125"
                    />
                    <InputField
                      label="ID"
                      value={wellData.dcID}
                      onChange={(e) => setWellData({...wellData, dcID: parseFloat(e.target.value) || 0})}
                      unit="in"
                      step="0.001"
                    />
                    <InputField
                      label="Length"
                      value={wellData.dcLength}
                      onChange={(e) => setWellData({...wellData, dcLength: parseFloat(e.target.value) || 0})}
                      unit="ft"
                    />
                  </div>
                </div>
              </div>
            </Section>

            {/* Formation */}
            <Section title="Formation Pressures" id="formation" icon={TrendingUp}>
              <div className="space-y-4">
                <InputField
                  label="Pore Pressure Gradient"
                  value={formationData.porePressureGradient}
                  onChange={(e) => setFormationData({...formationData, porePressureGradient: parseFloat(e.target.value) || 0})}
                  unit="psi/ft"
                  step="0.01"
                />
                <InputField
                  label="Fracture Gradient"
                  value={formationData.fractureGradient}
                  onChange={(e) => setFormationData({...formationData, fractureGradient: parseFloat(e.target.value) || 0})}
                  unit="psi/ft"
                  step="0.01"
                />
              </div>
            </Section>

            {/* Mud */}
            <Section title="Mud Properties" id="mud" icon={Droplet}>
              <div className="space-y-4">
                <InputField
                  label="Mud Weight"
                  value={mudData.mudWeight}
                  onChange={(e) => setMudData({...mudData, mudWeight: parseFloat(e.target.value) || 0})}
                  unit="ppg"
                  step="0.1"
                />
                
                <div className="pt-4 border-t border-neutral-200">
                  <div className="text-xs font-medium text-neutral-600 mb-3 uppercase tracking-wide">Fann Readings</div>
                  <div className="grid grid-cols-2 gap-3">
                    <InputField
                      label="600 RPM"
                      value={mudData.theta600}
                      onChange={(e) => setMudData({...mudData, theta600: parseFloat(e.target.value) || 0})}
                    />
                    <InputField
                      label="300 RPM"
                      value={mudData.theta300}
                      onChange={(e) => setMudData({...mudData, theta300: parseFloat(e.target.value) || 0})}
                    />
                    <InputField
                      label="Gel 10s"
                      value={mudData.gel10sec}
                      onChange={(e) => setMudData({...mudData, gel10sec: parseFloat(e.target.value) || 0})}
                      unit="lb/100ft²"
                    />
                    <InputField
                      label="Gel 10m"
                      value={mudData.gel10min}
                      onChange={(e) => setMudData({...mudData, gel10min: parseFloat(e.target.value) || 0})}
                      unit="lb/100ft²"
                    />
                  </div>
                </div>
              </div>
            </Section>

            {/* Pump */}
            <Section title="Pump Configuration" id="pump" icon={Zap}>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-2 uppercase tracking-wide">
                    Type
                  </label>
                  <select
                    value={pumpData.pumpType}
                    onChange={(e) => setPumpData({...pumpData, pumpType: e.target.value})}
                    className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-neutral-900 text-sm"
                  >
                    <option value="Triplex">Triplex</option>
                    <option value="Duplex">Duplex</option>
                  </select>
                </div>
                
                <InputField
                  label="Liner Diameter"
                  value={pumpData.linerDiameter}
                  onChange={(e) => setPumpData({...pumpData, linerDiameter: parseFloat(e.target.value) || 0})}
                  unit="in"
                  step="0.1"
                />
                <InputField
                  label="Stroke Length"
                  value={pumpData.strokeLength}
                  onChange={(e) => setPumpData({...pumpData, strokeLength: parseFloat(e.target.value) || 0})}
                  unit="in"
                />
                <InputField
                  label="SPM"
                  value={pumpData.strokesPerMinute}
                  onChange={(e) => setPumpData({...pumpData, strokesPerMinute: parseFloat(e.target.value) || 0})}
                  unit="strokes/min"
                />
                <InputField
                  label="Efficiency"
                  value={pumpData.efficiency}
                  onChange={(e) => setPumpData({...pumpData, efficiency: parseFloat(e.target.value) || 0})}
                  unit="%"
                />
                <InputField
                  label="Number of Pumps"
                  value={pumpData.numberOfPumps}
                  onChange={(e) => setPumpData({...pumpData, numberOfPumps: parseFloat(e.target.value) || 0})}
                />
                <InputField
                  label="Standpipe Pressure"
                  value={pumpData.standpipePressure}
                  onChange={(e) => setPumpData({...pumpData, standpipePressure: parseFloat(e.target.value) || 0})}
                  unit="psi"
                />
              </div>
            </Section>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Volumetrics */}
            <Section title="Volumetrics" id="volumetrics" icon={Calculator}>
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <DataCard
                    label="Hole Capacity"
                    value={volumetrics.holeCapacity.toFixed(4)}
                    unit="bbl/ft"
                    status="neutral"
                  />
                  <DataCard
                    label="Annular Capacity"
                    value={volumetrics.annularDP.toFixed(4)}
                    unit="bbl/ft"
                    status="neutral"
                  />
                  <DataCard
                    label="Pipe Capacity"
                    value={volumetrics.drillPipeCapacity.toFixed(4)}
                    unit="bbl/ft"
                    status="neutral"
                  />
                </div>

                <div className="border-t border-neutral-200 pt-6">
                  <h3 className="text-xs font-medium text-neutral-600 mb-4 uppercase tracking-wide">Total Volumes</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <DataCard
                      label="Inside String"
                      value={volumetrics.totalInsideVolume.toFixed(1)}
                      unit="bbl"
                      status="neutral"
                    />
                    <DataCard
                      label="Annular"
                      value={volumetrics.totalAnnularVolume.toFixed(1)}
                      unit="bbl"
                      status="neutral"
                    />
                    <DataCard
                      label="Total System"
                      value={volumetrics.totalSystemVolume.toFixed(1)}
                      unit="bbl"
                      status="neutral"
                    />
                  </div>
                </div>

                <div className="bg-neutral-50 p-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={[
                      { name: 'Inside', value: volumetrics.totalInsideVolume, fill: '#404040' },
                      { name: 'Annular', value: volumetrics.totalAnnularVolume, fill: '#737373' }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                      <XAxis dataKey="name" stroke="#737373" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#737373" tick={{ fontSize: 11 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #e5e5e5',
                          fontSize: '12px'
                        }}
                        formatter={(value) => `${value.toFixed(1)} bbl`}
                      />
                      <Bar dataKey="value" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Section>

            {/* Circulation Times */}
            <Section title="Circulation Times" id="circulation" icon={Clock}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <DataCard
                  label="Surface to Bit"
                  value={circulationTimes.surfaceToBit.toFixed(1)}
                  unit="min"
                  status="neutral"
                />
                <DataCard
                  label="Bit to Surface"
                  value={circulationTimes.bitToSurface.toFixed(1)}
                  unit="min"
                  status="neutral"
                />
                <DataCard
                  label="Full Circulation"
                  value={circulationTimes.fullCirculation.toFixed(1)}
                  unit="min"
                  status="neutral"
                />
                <DataCard
                  label="Bottoms Up"
                  value={circulationTimes.bottomsUp.toFixed(1)}
                  unit="min"
                  status="neutral"
                />
                <DataCard
                  label="Lag Strokes"
                  value={circulationTimes.lagStrokes.toFixed(0)}
                  unit="strokes"
                  status="neutral"
                />
                <DataCard
                  label="Flow Rate"
                  value={pumpCalcs.flowRateGPM.toFixed(0)}
                  unit="gpm"
                  status="neutral"
                />
              </div>
            </Section>

            {/* Pressures */}
            <Section title="Pressure Analysis" id="pressures" icon={Gauge}>
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <DataCard
                    label="Pore Pressure"
                    value={pressures.porePressure.toFixed(0)}
                    unit="psi"
                    status="neutral"
                  />
                  <DataCard
                    label="Hydrostatic"
                    value={pressures.hydrostaticPressure.toFixed(0)}
                    unit="psi"
                    status={pressures.overbalance > 0 ? "safe" : "critical"}
                  />
                  <DataCard
                    label="Fracture Pressure"
                    value={pressures.fracturePressure.toFixed(0)}
                    unit="psi"
                    status="neutral"
                  />
                  <DataCard
                    label="ECD"
                    value={hydraulics.ecd ? hydraulics.ecd.toFixed(2) : '0.00'}
                    unit="ppg"
                    status={hydraulics.ecd && hydraulics.ecd > pressures.maxMudWeight ? "critical" : "safe"}
                  />
                </div>

                <div className="bg-neutral-50 p-4">
                  <div className="text-xs font-medium text-neutral-600 mb-3 uppercase tracking-wide">Mud Weight Window</div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-neutral-500 mb-1">Minimum</div>
                      <div className="text-lg font-light tabular-nums">{pressures.minMudWeight.toFixed(2)} ppg</div>
                    </div>
                    <div>
                      <div className="text-xs text-neutral-500 mb-1">Current</div>
                      <div className="text-lg font-medium tabular-nums">{mudData.mudWeight.toFixed(2)} ppg</div>
                    </div>
                    <div>
                      <div className="text-xs text-neutral-500 mb-1">Maximum</div>
                      <div className="text-lg font-light tabular-nums">{pressures.maxMudWeight.toFixed(2)} ppg</div>
                    </div>
                  </div>
                  
                  <div className="relative h-2 bg-gradient-to-r from-neutral-300 via-neutral-600 to-neutral-300">
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-neutral-900"
                      style={{
                        left: `${Math.min(100, Math.max(0, ((mudData.mudWeight - pressures.minMudWeight) / pressures.mudWindow) * 100))}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </Section>

            {/* Rheology */}
            <Section title="Rheology" id="rheology" icon={Droplet}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <DataCard
                  label="Plastic Viscosity"
                  value={rheology.plasticViscosity.toFixed(0)}
                  unit="cP"
                  status="neutral"
                />
                <DataCard
                  label="Yield Point"
                  value={rheology.yieldPoint.toFixed(0)}
                  unit="lb/100ft²"
                  status="neutral"
                />
                <DataCard
                  label="PV/YP Ratio"
                  value={rheology.pvYpRatio.toFixed(2)}
                  status={(rheology.pvYpRatio >= 0.5 && rheology.pvYpRatio <= 3) ? "safe" : "warning"}
                />
                <DataCard
                  label="Gel Progression"
                  value={rheology.gelProgression.toFixed(2)}
                  unit="×"
                  status={rheology.gelProgression < 3 ? "safe" : "warning"}
                />
              </div>
            </Section>

            {/* Hydraulics */}
            {hydraulics.annularVelocity && (
              <Section title="Hydraulic Performance" id="hydraulics" icon={Gauge}>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <DataCard
                      label="Annular Velocity"
                      value={hydraulics.annularVelocity.toFixed(0)}
                      unit="ft/min"
                      status={(hydraulics.annularVelocity >= 120 && hydraulics.annularVelocity <= 240) ? "safe" : "warning"}
                    />
                    <DataCard
                      label="Nozzle Velocity"
                      value={hydraulics.nozzleVelocity.toFixed(0)}
                      unit="ft/sec"
                      status="neutral"
                    />
                    <DataCard
                      label="HHP"
                      value={pumpCalcs.hydraulicHP.toFixed(0)}
                      unit="hp"
                      status="neutral"
                    />
                    <DataCard
                      label="HHP/in²"
                      value={hydraulics.hhpPerSqIn.toFixed(2)}
                      status={hydraulics.hhpPerSqIn >= 2.0 ? "safe" : "info"}
                    />
                  </div>

                  <div className="bg-neutral-50 p-4">
                    <div className="text-xs font-medium text-neutral-600 mb-3 uppercase tracking-wide">
                      Pressure Loss Distribution
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={[
                        { name: 'Drill Pipe', value: hydraulics.pressureLossDP, fill: '#404040' },
                        { name: 'HWDP', value: hydraulics.pressureLossHWDP, fill: '#525252' },
                        { name: 'Drill Collars', value: hydraulics.pressureLossDC, fill: '#737373' },
                        { name: 'Bit', value: hydraulics.pressureLossBit, fill: '#262626' },
                        { name: 'Annular', value: hydraulics.pressureLossAnnular, fill: '#a3a3a3' }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                        <XAxis dataKey="name" stroke="#737373" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={60} />
                        <YAxis stroke="#737373" tick={{ fontSize: 11 }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff', 
                            border: '1px solid #e5e5e5',
                            fontSize: '12px'
                          }}
                          formatter={(value) => `${value.toFixed(0)} psi`}
                        />
                        <Bar dataKey="value" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Section>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="text-xs text-neutral-600 space-y-1">
            <p>OIL - Oil Industry Lab · Drilling Engineering Calculator</p>
            <p>References: API RP 13B-1, IADC Drilling Manual, Practical Well Control (PETEX)</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const TrendingUp = ({ className, strokeWidth }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const Zap = ({ className, strokeWidth }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);