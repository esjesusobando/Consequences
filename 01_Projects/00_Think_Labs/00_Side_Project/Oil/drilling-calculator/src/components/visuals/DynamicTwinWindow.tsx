import { useState } from "react";
import { useDrillingStore } from "../../store/drilling-store";
import { simulateScenario } from "../../engine/twin-engine";
import { API_HYDROSTATIC_GRADIENT } from "../../engine/physics";
import { Info } from "lucide-react";
import { DataCard } from "../ui/DataCard";
import "./DynamicTwin.css";

export function DynamicTwinWindow() {
  const { wellData, mudData, pumpData, formationData, results } =
    useDrillingStore();
  const [simMW, setSimMW] = useState(mudData.mudWeight);

  if (!results || !results.hydraulics) return null;

  const simResults = simulateScenario(
    wellData,
    mudData,
    pumpData,
    formationData,
    {
      mudWeight: simMW,
      strokesPerMinute: pumpData.strokesPerMinute,
    },
  );

  const deltaEcd = simResults.hydraulics.ecd - results.hydraulics.ecd;

  return (
    <div className="twin-glass-panel">
      <div className="twin-header">
        <h3 className="twin-title">Dynamic Delta Simulator (Twin)</h3>
        <span className="twin-tag">PREDICTIVE MODE</span>
      </div>

      <div className="twin-controls">
        <div className="control-group">
          <label>Simulated Mud Weight (ppg)</label>
          <input
            type="range"
            min={mudData.mudWeight - 2}
            max={mudData.mudWeight + 2}
            step="0.1"
            value={simMW}
            onChange={(e) => setSimMW(parseFloat(e.target.value))}
          />
          <span className="control-val">{simMW.toFixed(1)}</span>
        </div>
      </div>

      <div className="twin-results-grid">
        <DataCard
          label="Simulated ECD"
          value={simResults.hydraulics.ecd}
          unit="ppg"
          status={
            simResults.hydraulics.ecd * API_HYDROSTATIC_GRADIENT >
            formationData.fractureGradient
              ? "error"
              : "valid"
          }
        />
        <div className="delta-indicator">
          <span className="delta-label">
            VAR ECD:
            <span
              className="twin-info-trigger"
              role="tooltip"
              tabIndex={0}
              aria-label="VAR ECD: variación del ECD (Densidad Circular Equivalente) respecto al escenario real. Indica cuánto cambiaría la densidad efectiva de circulación si se modificara el peso del lodo simulado. (+) Riesgo de fractura. (-) Riesgo de kick (aflujo)."
            >
              <Info size={14} />
            </span>
          </span>
          <span className={`delta-val ${deltaEcd >= 0 ? "pos" : "neg"}`}>
            {deltaEcd >= 0 ? "+" : ""}
            {deltaEcd.toFixed(4)}
          </span>
        </div>
      </div>
    </div>
  );
}
