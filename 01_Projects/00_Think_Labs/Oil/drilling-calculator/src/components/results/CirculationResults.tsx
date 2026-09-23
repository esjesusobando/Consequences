import React from "react";
import { DataCard } from "../ui/DataCard";
import { useDrillingStore } from "../../store/drilling-store";
import { Timer } from "lucide-react";
import "./Results.css";

export const CirculationResults: React.FC = () => {
  const { results } = useDrillingStore();
  const circulation = results?.circulation || {};
  const pump = results?.pump || {};
  const vol = results?.volumetrics || {};
  const spm = useDrillingStore((state) => state.pumpData.strokesPerMinute) || 0;

  // Emboladas: tiempo (min) × SPM
  const toStrokes = (time: number) =>
    time && spm ? Math.round(time * spm) : 0;

  return (
    <div className="results-panel">
      <div className="results-header">
        <Timer size={18} />
        <h3 className="results-title">Circulación</h3>
      </div>

      {/* ── SECCIÓN 1: Tiempos de Circulación ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span className="results-subtitle">Tiempos (min) y Emboladas</span>
        <div className="results-grid">
          <DataCard
            label="Superficie → Barrena"
            value={circulation.surfaceToBit}
            unit="min"
          />
          <DataCard
            label="Emboladas S→B"
            value={toStrokes(circulation.surfaceToBit)}
            unit="stks"
            decimals={0}
          />
          <DataCard
            label="Fondo Arriba (B.U.)"
            value={circulation.bottomsUp}
            unit="min"
            highlight
          />
          <DataCard
            label="Emboladas B.U."
            value={toStrokes(circulation.bottomsUp)}
            unit="stks"
            decimals={0}
          />
          <DataCard
            label="Circulación Completa"
            value={circulation.fullCirculation}
            unit="min"
          />
          <DataCard
            label="Emboladas Totales"
            value={toStrokes(circulation.fullCirculation)}
            unit="stks"
            decimals={0}
          />
        </div>
      </div>

      {/* ── SECCIÓN 2: Volúmenes del Sistema ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span className="results-subtitle">Volúmenes del Sistema (bbl)</span>
        <div className="results-grid">
          <DataCard
            label="Vol. Interior (Sarta)"
            value={vol.totalInsideVolume}
            unit="bbl"
          />
          <DataCard
            label="Vol. Anular"
            value={vol.totalAnnularVolume}
            unit="bbl"
            highlight
          />
          <DataCard
            label="Vol. Sistema Total"
            value={vol.totalSystemVolume}
            unit="bbl"
          />
        </div>
      </div>

      {/* ── FOOTER: Datos de Bomba (Premium Badge Design) ── */}
      <div className="results-footer">
        <div className="results-footer-info">
          <div className="gasto-badge-container">
            <span className="gasto-label">Flujo Máximo (GASTO)</span>
            <div className="gasto-badges">
              <div className="results-kpi primary-kpi">
                <span className="kpi-value">
                  {pump.flowRateGPM ? pump.flowRateGPM.toFixed(0) : "0"}
                </span>
                <span className="kpi-unit">GPM</span>
              </div>
              <div className="results-kpi secondary-kpi">
                <span className="kpi-value">
                  {pump.flowRateBBLmin
                    ? pump.flowRateBBLmin.toFixed(3)
                    : "0.000"}
                </span>
                <span className="kpi-unit">bbl/min</span>
              </div>
            </div>
          </div>
        </div>
        <div className="pump-output-info">
          <span className="stk-value">
            {pump.outputPerStroke
              ? Number(pump.outputPerStroke).toFixed(4)
              : "0.0000"}
          </span>
          <span className="stk-unit">BBL / STK</span>
        </div>
      </div>
    </div>
  );
};
