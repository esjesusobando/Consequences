import React from "react";
import { DataCard } from "../ui/DataCard";
import { useDrillingStore } from "../../store/drilling-store";
import { Activity } from "lucide-react";
import "./Results.css";

export const HydraulicsResults: React.FC = () => {
  const { results } = useDrillingStore();
  const hydraulics = results?.hydraulics || {};

  return (
    <div className="results-panel">
      <div className="results-header">
        <Activity size={18} />
        <h3 className="results-title">Hidráulica</h3>
      </div>

      <div className="results-grid">
        <DataCard
          label="Modelo Activo"
          value={hydraulics.rheologyModelSelected || "Bingham"}
          unit=""
          highlight
        />
        <DataCard
          label="ECD"
          value={hydraulics.ecd}
          unit="ppg"
          highlight
          decimals={2}
        />
        <DataCard
          label="Régimen Anular"
          value={hydraulics.flowRegimeAnnular}
          unit=""
          highlight={hydraulics.flowRegimeAnnular === "Transition"}
        />
        <DataCard
          label="Ratio de Velocidad (V/Vc)"
          value={hydraulics.velocityRatio}
          unit=""
          decimals={2}
          highlight={
            hydraulics.velocityRatio > 0.9 && hydraulics.velocityRatio < 1.1
          }
        />
        <DataCard
          label="Número de Reynolds"
          value={hydraulics.reynoldsDP} // Asumiendo que ahora se expone
          unit=""
          decimals={0}
        />
        <DataCard
          label="Pérdida Presión Total"
          value={hydraulics.totalPressureLoss}
          unit="psi"
        />
        <DataCard
          label="Pérdida en Barrena"
          value={hydraulics.pressureLossBit}
          unit="psi"
        />
        <DataCard
          label="HSI (Optimización)"
          value={hydraulics.hhpPerSqIn}
          unit="hp/in²"
          decimals={2}
        />
        <DataCard
          label="Fuerza de Impacto"
          value={hydraulics.impactForce}
          unit="lbf"
        />
      </div>
    </div>
  );
};
