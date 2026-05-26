import { useState, useMemo } from "react";
import { useDrillingStore } from "../../store/drilling-store";
import { simulateScenario } from "../../engine/twin-engine";
import { Section } from "../ui/Section";
import { InputField } from "../ui/InputField";
import { Zap, AlertTriangle, CheckCircle } from "lucide-react";
import "./Simulator.css";

export function Simulator() {
  const { wellData, mudData, pumpData, formationData, results } =
    useDrillingStore();
  const [simMW, setSimMW] = useState(mudData.mudWeight);
  const [simGPM, setSimGPM] = useState(results.pump.flowRateGPM || 0);
  const [simRPM, setSimRPM] = useState(60);
  const [simROP, setSimROP] = useState(30);

  const simResults = useMemo(() => {
    return simulateScenario(wellData, mudData, pumpData, formationData, {
      mudWeight: simMW,
      gpm: simGPM,
      rpm: simRPM,
      rop: simROP,
    });
  }, [
    wellData,
    mudData,
    pumpData,
    formationData,
    simMW,
    simGPM,
    simRPM,
    simROP,
  ]);

  const diffECD = simResults.hydraulics.ecd - results.hydraulics.ecd;
  const isSafe = simResults.hydraulics.ecd < formationData.fractureGradient;

  return (
    <Section
      id="simulator"
      title="Gemelo Digital (DDS-Twin)"
      icon={<Zap size={18} />}
    >
      <div className="simulator-container">
        <div className="simulator-controls">
          <div className="sim-group">
            <h3 className="sim-subtitle">Variables de Simulación</h3>
            <div className="sim-inputs">
              <InputField
                label="Densidad Objetivo"
                unit="ppg"
                value={simMW}
                onChange={setSimMW}
                step={0.1}
              />
              <InputField
                label="Caudal Objetivo"
                unit="gpm"
                value={Math.round(simGPM)}
                onChange={(val) => setSimGPM(Math.round(val))}
                step={10}
              />
              <InputField
                label="Rotación (RPM)"
                unit="rpm"
                value={simRPM}
                onChange={setSimRPM}
                step={10}
              />
              <InputField
                label="Penetración (ROP)"
                unit="ft/h"
                value={simROP}
                onChange={setSimROP}
                step={5}
              />
            </div>
          </div>

          <div className="simulator-prediction">
            <div className={`prediction-card ${isSafe ? "safe" : "danger"}`}>
              <div className="prediction-header">
                <span className="prediction-label">ECD Proyectado</span>
                {isSafe ? (
                  <CheckCircle size={16} />
                ) : (
                  <AlertTriangle size={16} />
                )}
              </div>
              <div className="prediction-value">
                {Number(simResults.hydraulics.ecd || 0).toFixed(2)}
                <span className="prediction-unit">ppg</span>
              </div>
              <div className="prediction-diff">
                {diffECD > 0 ? "+" : ""}
                {Number(diffECD || 0).toFixed(2)} vs Actual
              </div>
            </div>
          </div>
        </div>

        <div className="simulator-diagnostics">
          <div className="diag-panel">
            <h4 className="diag-title">Insights de Ingeniería</h4>
            <ul className="diag-list">
              {diffECD > 0.5 && (
                <li>Incremento crítico por fricción anular.</li>
              )}
              {simGPM > 1000 && (
                <li>Turbulencia detectada en conexiones de superficie.</li>
              )}
              <li>
                Reología base: {mudData.plasticViscosity} cP /{" "}
                {mudData.yieldPoint} lb/100ft².
              </li>
            </ul>
          </div>
          <div className="diag-panel">
            <h4 className="diag-title">Soluciones Sugeridas</h4>
            <div className="solution-tag">Optimizar RPM</div>
            <div className="solution-tag">Ajustar Reología</div>
            {!isSafe && (
              <div className="solution-tag urgency-high">
                Reducir GPM Inmediatamente
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
