import React from "react";
import { DataCard } from "../ui/DataCard";
import { useDrillingStore } from "../../store/drilling-store";
import { ArrowDownToLine } from "lucide-react";
import "./Results.css";

export const PressureResults: React.FC = () => {
  const { results } = useDrillingStore();
  const pressures = results?.pressures || {};

  return (
    <div className="results-panel">
      <div className="results-header">
        <ArrowDownToLine size={18} />
        <h3 className="results-title">Presiones de Fondo</h3>
      </div>

      <div className="results-grid">
        <DataCard
          label="P. Hidrostática"
          value={pressures.hydrostaticPressure}
          unit="psi"
        />
        <DataCard
          label="Gradiente Lodo"
          value={pressures.mudGradient}
          unit="psi/ft"
          decimals={3}
        />
        <DataCard
          label="P. de Poro"
          value={pressures.porePressure}
          unit="psi"
        />
        <DataCard
          label="P. de Fractura"
          value={pressures.fracturePressure}
          unit="psi"
        />
        <DataCard
          label="Sobrebalance"
          value={pressures.overbalance}
          unit="psi"
          status={pressures.overbalance < 0 ? "error" : "valid"}
          highlight
        />
      </div>
      <div className="results-footer">
        <span>Ventana Operativa (MW):</span>
        <span className="results-kpi">
          {pressures.minMudWeight?.toFixed(2)} —{" "}
          {pressures.maxMudWeight?.toFixed(2)} ppg
        </span>
      </div>
    </div>
  );
};
