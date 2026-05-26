import React from "react";
import { ShieldAlert, Activity, Bell, Info, BarChart3 } from "lucide-react";
import { useDrillingStore } from "../../store/drilling-store";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./WellControl.css";

export const WellControl = () => {
  const { wellControlData, results } = useDrillingStore();

  const wc = results.wellControl;

  // Theme check (pattern sync with TorqueDrag)
  const isDark = document.querySelector(".theme-dark") !== null;

  const chartData = wc.stepDownSchedule.map((step) => ({
    strokes: step.strokes,
    pressure: Math.round(step.pressure),
  }));

  return (
    <div className={`well-control-section ${isDark ? "theme-dark" : ""}`}>
      <div className="section-header">
        <div className="title-group">
          <ShieldAlert className="section-icon" color="#ff006e" size={24} />
          <h2 style={{ color: "#ff006e" }}>
            The Kick Shield (Control de Brotes)
          </h2>
        </div>
        <div className="badge critical">IADC / IWCF STANDARD</div>
      </div>

      <div className="well-control-grid">
        {/* Input Card: Presión de Cierre */}
        <div className="input-card card-panel">
          <div className="card-header">
            <Bell size={16} color="var(--sh-azul)" />
            <h3>Presiones de Cierre</h3>
          </div>
          <div className="input-grid-2col" style={{ marginTop: "15px" }}>
            <div className="input-group">
              <label>SIDPP (psi)</label>
              <input
                type="number"
                step="5"
                min="0"
                value={wellControlData.sidpp === 0 ? "" : wellControlData.sidpp}
                placeholder="0"
                onChange={(e) =>
                  setWellControlData({
                    sidpp:
                      e.target.value === "" ? 0 : parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div className="input-group">
              <label>SICP (PSI)</label>
              <input
                type="number"
                step="5"
                min="0"
                value={wellControlData.sicp === 0 ? "" : wellControlData.sicp}
                placeholder="0"
                onChange={(e) =>
                  setWellControlData({
                    sicp:
                      e.target.value === "" ? 0 : parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <div className="input-group" style={{ marginTop: "15px" }}>
            <label>SCR @ KILL RATE (PSI)</label>
            <input
              type="number"
              step="5"
              min="0"
              value={
                wellControlData.killRatePressure === 0
                  ? ""
                  : wellControlData.killRatePressure
              }
              placeholder="0"
              onChange={(e) =>
                setWellControlData({
                  killRatePressure:
                    e.target.value === "" ? 0 : parseFloat(e.target.value),
                })
              }
            />
          </div>
          <div className="input-info">
            <p
              style={{
                marginTop: "12px",
                fontSize: "11px",
                fontStyle: "italic",
              }}
            >
              * SIDPP es la base para calcular el Kill Mud Weight (KMW).
            </p>
          </div>
        </div>

        {/* Results Card: Kill Parameters */}
        <div className="results-card card-panel highlight">
          <div className="card-header">
            <Activity size={16} color="#ff006e" />
            <h3>Parámetros de Ahogo</h3>
          </div>
          <div className="load-stats">
            <div className="stat-item">
              <span className="label">Kill Mud Weight (KMW)</span>
              <span className="value danger">{wc.kmw.toFixed(2)} ppg</span>
            </div>
            <div className="stat-item">
              <span className="label">Initial Circ. Pressure (ICP)</span>
              <span className="value accent">{Math.round(wc.icp)} psi</span>
            </div>
            <div className="stat-item">
              <span className="label">Final Circ. Pressure (FCP)</span>
              <span className="value accent">{Math.round(wc.fcp)} psi</span>
            </div>
            <div className="stat-item">
              <span className="label">MAASP @ Shoe</span>
              <span className="value danger">{Math.round(wc.maasp)} psi</span>
            </div>
          </div>
        </div>

        {/* Results Card: Volumetría de Ahogo */}
        <div className="results-card card-panel highlight">
          <div className="card-header">
            <BarChart3 size={16} color="#cbff6a" />
            <h3>Strokes de Ahogo</h3>
          </div>
          <div className="load-stats">
            <div className="stat-item">
              <span className="label">Strokes to Bit (Surface to Bit)</span>
              <span className="value">{Math.round(wc.strokesToBit)}</span>
            </div>
            <div className="stat-item">
              <span className="label">Strokes to Surface (Bottoms Up)</span>
              <span className="value">{Math.round(wc.strokesToSurface)}</span>
            </div>
            <div className="stat-item">
              <span className="label">Total Kill Strokes</span>
              <span className="value success">
                {Math.round(wc.totalStrokes)}
              </span>
            </div>
          </div>
        </div>

        {/* Step-Down Chart */}
        <div className="chart-card card-panel full-width">
          <div className="card-header">
            <Activity size={16} color="var(--sh-azul)" />
            <h3>Step-Down Schedule (Wait & Weight)</h3>
            <div className="info-tooltip">
              <Info size={14} />
              <span className="tooltip-text">
                Plan de reducción de presión mientras el lodo de ahogo viaja a
                la broca.
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 45, bottom: 50 }}
            >
              <defs>
                <linearGradient id="colorPressure" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--sh-azul)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--sh-azul)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(0,0,0,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="strokes"
                stroke="#64748b"
                fontSize={10}
                tickFormatter={(val) => `${val} stk`}
              />
              <YAxis
                stroke="#64748b"
                fontSize={10}
                tickFormatter={(val) => `${val} psi`}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  fontSize: "12px",
                }}
                itemStyle={{ color: "var(--sh-azul)", fontWeight: 700 }}
              />
              <Area
                type="monotone"
                dataKey="pressure"
                stroke="var(--sh-azul)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorPressure)"
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
