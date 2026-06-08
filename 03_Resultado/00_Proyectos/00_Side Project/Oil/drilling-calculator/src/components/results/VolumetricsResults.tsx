import React from "react";
import { DataCard } from "../ui/DataCard";
import { useDrillingStore } from "../../store/drilling-store";
import { CircleDashed } from "lucide-react";
import "./Results.css";

export const VolumetricsResults: React.FC = () => {
  const { results } = useDrillingStore();
  // Default empty objects if results are not yet calculated to prevent crash
  const volumetrics = results?.volumetrics || {};

  return (
    <div className="results-panel">
      <div className="results-header">
        <CircleDashed size={18} />
        <h3 className="results-title">Volumetría</h3>
      </div>

      <div className="results-grid">
        <DataCard
          label="Volumen Total Sistema"
          value={volumetrics.totalSystemVolume}
          unit="bbl"
          highlight
        />

        {/* Capacities */}
        <DataCard
          label="Volumen Int. TP"
          value={volumetrics.volumeInsideDP}
          unit="bbl"
        />
        <DataCard
          label="Volumen Int. DC"
          value={volumetrics.volumeInsideDC}
          unit="bbl"
        />

        {/* Annular Volumes */}
        <DataCard
          label="Anular TP"
          value={volumetrics.volumeAnnularDP}
          unit="bbl"
        />
        <DataCard
          label="Anular DC"
          value={volumetrics.volumeAnnularDC}
          unit="bbl"
        />

        {/* Totals */}
        <DataCard
          label="Vol. Interior Total"
          value={volumetrics.totalInsideVolume}
          unit="bbl"
        />
        <DataCard
          label="Vol. Anular Total"
          value={volumetrics.totalAnnularVolume}
          unit="bbl"
        />
      </div>
      <div className="results-footer">
        <span>Capacidad del Hoyo:</span>
        <span className="results-kpi">
          {volumetrics.holeCapacity?.toFixed(4)} bbl/ft
        </span>
      </div>
    </div>
  );
};
