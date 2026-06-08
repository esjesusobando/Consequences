import React from "react";
import { Zap, Activity, ShieldAlert } from "lucide-react";
import { useDrillingStore } from "../../store/drilling-store";
import TorqueDragChart from "../visuals/TorqueDragChart";
import "./TorqueDrag.css";

export const TorqueDrag: React.FC = () => {
  const { results, torqueDragData, setTorqueDragData } = useDrillingStore();
  const td = results.torqueDrag;

  return (
    <div className="torque-drag-section">
      <div className="section-header">
        <div className="title-group">
          <Zap className="section-icon" size={20} />
          <h2>Torque & Drag (Fricción Soft-String)</h2>
        </div>
      </div>

      <div className="torque-drag-grid">
        <div className="input-card card-panel">
          <div className="card-header">
            <h3>Parámetros de Fricción</h3>
          </div>
          <div className="input-group">
            <label>Coeficiente de Fricción (Uniforme)</label>
            <input
              type="number"
              value={
                torqueDragData.frictionCoefficient === 0
                  ? ""
                  : torqueDragData.frictionCoefficient
              }
              step={0.01}
              placeholder="0.25"
              onChange={(e) =>
                setTorqueDragData({
                  frictionCoefficient:
                    e.target.value === "" ? 0 : parseFloat(e.target.value),
                })
              }
            />
          </div>
          <div className="input-group" style={{ marginTop: "12px" }}>
            <label>Weight on Bit (WOB) - k-lbs</label>
            <input
              type="number"
              value={
                torqueDragData.weightOnBit === 0
                  ? ""
                  : torqueDragData.weightOnBit
              }
              step={1}
              placeholder="0"
              onChange={(e) =>
                setTorqueDragData({
                  weightOnBit:
                    e.target.value === "" ? 0 : parseFloat(e.target.value),
                })
              }
            />
          </div>
          <div className="input-info friction-info">
            <p
              className="text-muted"
              style={{ fontSize: "11px", lineHeight: "1.4", marginTop: "12px" }}
            >
              <strong>Impacto del Coeficiente:</strong> Valores más altos (ej.
              &gt;0.30) aumentan la resistencia por contacto sarta/pozo. En la
              gráfica, desplazan la curva de <em>Pick-up</em> a la derecha
              (mayor carga al levantar) y la curva de <em>Slack-off</em> a la
              izquierda (menor peso en gancho al bajar). Crucial para anticipar
              el punto neutro y riesgos de pandeo.
            </p>
          </div>
        </div>

        <div className="results-card card-panel highlight">
          <div className="card-header">
            <h3>Hook Load Predictions</h3>
          </div>
          <div className="load-stats">
            <div className="stat-item">
              <span className="label">Pick-up (klbs)</span>
              <span className="value accent">
                {(td.pickupHookLoad / 1000).toFixed(1)}
              </span>
            </div>
            <div className="stat-item">
              <span className="label">Slack-off (klbs)</span>
              <span className="value">
                {(td.slackoffHookLoad / 1000).toFixed(1)}
              </span>
            </div>
            <div className="stat-item">
              <span className="label">Rotating Torque (ft-lb)</span>
              <span className="value">
                {td.rotatingTorque.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
          </div>
          <div className="buckling-status">
            <ShieldAlert size={16} />
            <span>Sin riesgos de pandeo (Buckling) detectados</span>
          </div>
        </div>

        <div className="chart-card card-panel full-width">
          <div className="card-header">
            <Activity size={16} />
            <h3>Tension Profile vs Depth</h3>
          </div>
          <TorqueDragChart />
        </div>
      </div>
    </div>
  );
};
