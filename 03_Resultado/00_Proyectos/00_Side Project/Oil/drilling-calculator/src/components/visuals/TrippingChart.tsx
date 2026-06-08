import React, { useState } from "react";
import { useDrillingStore } from "../../store/drilling-store";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine,
} from "recharts";
import "./TrippingChart.css";
import { calculateSurgeSwab } from "../../engine/surge-swab";

interface TrippingChartProps {
  isDark?: boolean;
}

/* ── Custom Tooltip ─────────────────────────────────── */
const PremiumTooltip = ({ active, payload, label, isDark }: any) => {
  if (!active || !payload?.length) return null;
  const bg = isDark ? "rgba(10,12,20,0.95)" : "rgba(255,255,255,0.97)";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const textColor = isDark ? "#f1f5f9" : "#0f172a";
  const sub = isDark ? "#94a3b8" : "#64748b";

  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 14,
        padding: "10px 14px",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        minWidth: 160,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: "0.8px",
          color: sub,
          marginBottom: 6,
          textTransform: "uppercase",
        }}
      >
        Velocidad: {label} ft/min
      </div>
      {payload.map((entry: any) => (
        <div
          key={entry.dataKey}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            marginBottom: 4,
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 700, color: entry.color }}>
            {entry.name}
          </span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: textColor,
              fontFamily: "monospace",
            }}
          >
            {Number(entry.value).toFixed(2)}{" "}
            <span style={{ fontSize: 10, fontWeight: 600, color: sub }}>
              ppg
            </span>
          </span>
        </div>
      ))}
    </div>
  );
};

export const TrippingChart: React.FC<TrippingChartProps> = ({
  isDark = true,
}) => {
  const { mudData, formationData, results, setPipeSpeed } = useDrillingStore();
  const [showMW, setShowMW] = useState(true);

  const mw = mudData.mudWeight ?? 0;
  const pore = formationData.porePressureGradient ?? 0;
  const frac = formationData.fractureGradient ?? 0;

  // Sincronización con el motor de ingeniería global
  const pipeSpeed = results.surgeSwab.pipeSpeed ?? 100;
  const currentSurge = results.surgeSwab.ecdSurge;
  const currentSwab = results.surgeSwab.ecdSwab;

  const generateChartData = () =>
    Array.from({ length: 21 }, (_, i) => i * 20).map((speed) => {
      const res = calculateSurgeSwab(
        { ...useDrillingStore.getState().wellData },
        { ...useDrillingStore.getState().mudData },
        results.rheology,
        speed,
      );
      return {
        speed,
        surgeECD: res.ecdSurge,
        swabECD: res.ecdSwab,
        mudWeight: mw,
      };
    });

  const chartData = generateChartData();

  const surgeStatus = frac > 0 && currentSurge >= frac ? "CRÍTICO" : "SEGURO";
  const swabStatus = pore > 0 && currentSwab <= pore ? "CRÍTICO" : "SEGURO";

  const grid = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
  const axisClr = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)";

  const SURGE_COLOR = isDark ? "hsl(0, 84%, 60%)" : "hsl(0, 80%, 45%)";
  const SWAB_COLOR = isDark ? "hsl(210, 100%, 60%)" : "hsl(210, 90%, 45%)";
  const MW_COLOR = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)";
  const SAFE_FILL = isDark
    ? "hsla(230,100%,67%,0.07)"
    : "hsla(230,100%,60%,0.06)";

  return (
    <div
      className={`tripping-simulator-container ${!isDark ? "light-mode" : ""}`}
    >
      {/* ── Accent bar ── */}
      <div className="tc-accent-bar" />

      {/* ── Header ── */}
      <div className="tc-header-row1">
        <div className="tripping-title-group">
          <h3 className="tripping-title">
            SIMULADOR DE VIAJE <span className="flash-emoji">⚡</span>
          </h3>
          <p className="tripping-subtitle">
            Dinámica de Presión — Surge &amp; Swab
          </p>
        </div>
        <div className="velocity-badge">
          <span className="velocity-label">VELOCIDAD</span>
          <div className="velocity-value-row">
            <span className="velocity-number">{pipeSpeed.toFixed(2)}</span>
            <span className="velocity-unit">ft/min</span>
          </div>
        </div>
      </div>

      {/* ── Slider ── */}
      <div className="slider-container">
        <div className="slider-labels">
          <span>Estático</span>
          <span className="optimized-label">Rango Optimizado</span>
          <span>Máximo (400)</span>
        </div>
        <input
          type="range"
          min="0"
          max="400"
          value={pipeSpeed}
          onChange={(e) => setPipeSpeed(Number(e.target.value))}
          className="custom-range-input"
        />
      </div>

      {/* ── Chart ── */}
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 12, left: -8, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              stroke={grid}
              vertical={false}
            />

            <XAxis
              dataKey="speed"
              stroke={axisClr}
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}`}
              label={{
                value: "ft/min",
                position: "insideRight",
                offset: 8,
                fill: axisClr,
                fontSize: 9,
              }}
            />

            {/* FIX: tickFormatter evita el float overflow IEEE 754 */}
            <YAxis
              stroke={axisClr}
              fontSize={10}
              fontWeight="700"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => v.toFixed(2)}
              domain={["dataMin - 0.5", "dataMax + 0.5"]}
              width={45}
            />

            <Tooltip
              content={<PremiumTooltip isDark={isDark} />}
              cursor={{
                stroke: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                strokeWidth: 2,
              }}
              formatter={(value: any) => [Number(value).toFixed(2), undefined]}
            />

            {/* Zona segura: entre poro y fractura */}
            {pore > 0 && frac > 0 && (
              <ReferenceArea
                y1={pore}
                y2={frac}
                fill={SAFE_FILL}
                strokeOpacity={0}
              />
            )}

            {/* Referencia: líneas límite */}
            {frac > 0 && (
              <ReferenceLine
                y={frac}
                stroke="rgba(185,28,28,0.55)"
                strokeDasharray="5 3"
                strokeWidth={1.5}
                label={{
                  value: `FRACTURA: ${frac}`,
                  position: "insideTopRight",
                  fill: "rgba(185,28,28,0.8)",
                  fontSize: 8,
                  fontWeight: 700,
                }}
              />
            )}
            {pore > 0 && (
              <ReferenceLine
                y={pore}
                stroke="rgba(30,64,175,0.55)"
                strokeDasharray="5 3"
                strokeWidth={1.5}
                label={{
                  value: `PORO: ${pore}`,
                  position: "insideBottomRight",
                  fill: "rgba(30,64,175,0.8)",
                  fontSize: 8,
                  fontWeight: 700,
                }}
              />
            )}

            {showMW && (
              <ReferenceLine
                y={mw}
                stroke={MW_COLOR}
                strokeDasharray="5 4"
                strokeWidth={1.5}
                label={{
                  value: `MW: ${mw.toFixed(2)}`,
                  position: "insideBottomLeft",
                  fill: MW_COLOR,
                  fontSize: 10,
                  fontWeight: 600,
                }}
              />
            )}
            <Line
              type="monotone"
              dataKey="surgeECD"
              name="ECD Surge"
              stroke={SURGE_COLOR}
              strokeWidth={2.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="swabECD"
              name="ECD Swab"
              stroke={SWAB_COLOR}
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ── Leyenda Silicon Valley ── */}
      <div className="tc-legend">
        <div className="tc-legend-group">
          <span className="tc-legend-group-label">ZONAS</span>
          <div className="tc-legend-pills">
            <span
              className="tc-pill"
              style={{
                background: "rgba(30,64,175,0.08)",
                border: "1px solid rgba(30,64,175,0.25)",
                color: "#1e40af",
              }}
            >
              <span className="tc-pill-dot" style={{ background: "#1e40af" }} />{" "}
              Kick Risk
            </span>
            <span
              className="tc-pill"
              style={{
                background: "rgba(99,102,241,0.07)",
                border: "1px solid rgba(99,102,241,0.25)",
                color: "#4338ca",
              }}
            >
              <span className="tc-pill-dot" style={{ background: "#6366f1" }} />{" "}
              Ventana Segura
            </span>
            <span
              className="tc-pill"
              style={{
                background: "rgba(185,28,28,0.08)",
                border: "1px solid rgba(185,28,28,0.25)",
                color: "#b91c1c",
              }}
            >
              <span className="tc-pill-dot" style={{ background: "#b91c1c" }} />{" "}
              Zona Fractura
            </span>
          </div>
        </div>
        <div className="tc-legend-group">
          <span className="tc-legend-group-label">LÍNEAS</span>
          <div className="tc-legend-pills">
            <span
              className="tc-pill"
              style={{
                background: "rgba(220,38,38,0.08)",
                border: `1px solid ${SURGE_COLOR}55`,
                color: SURGE_COLOR,
              }}
            >
              <span
                className="tc-pill-line"
                style={{ background: SURGE_COLOR }}
              />
              Surge · {currentSurge.toFixed(2)} ppg
              <span
                className={`tc-status-dot ${surgeStatus === "CRÍTICO" ? "danger" : "ok"}`}
              >
                {surgeStatus}
              </span>
            </span>
            <span
              className="tc-pill"
              style={{
                background: "rgba(59,130,246,0.08)",
                border: `1px solid ${SWAB_COLOR}55`,
                color: SWAB_COLOR,
              }}
            >
              <span
                className="tc-pill-line"
                style={{ background: SWAB_COLOR }}
              />
              Swab · {currentSwab.toFixed(2)} ppg
              <span
                className={`tc-status-dot ${swabStatus === "CRÍTICO" ? "danger" : "ok"}`}
              >
                {swabStatus}
              </span>
            </span>
            <span
              className="tc-pill"
              onClick={() => setShowMW(!showMW)}
              style={{
                background: isDark
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(0,0,0,0.04)",
                border: `1px solid ${MW_COLOR}`,
                color: isDark ? "#94a3b8" : "#64748b",
                cursor: "pointer",
                opacity: showMW ? 1 : 0.4,
              }}
            >
              <span
                className="tc-pill-line dashed"
                style={{
                  borderColor: isDark
                    ? "rgba(255,255,255,0.3)"
                    : "rgba(0,0,0,0.3)",
                }}
              />
              Lodo · {mw} ppg
            </span>
          </div>
        </div>
      </div>

      {/* ── Metric cards ── */}
      <div className="metrics-grid">
        {[
          {
            label: "ECD de Surge",
            val: currentSurge,
            limit: frac,
            limitLabel: `Frac: ${frac}`,
            color: SURGE_COLOR,
            status: surgeStatus,
          },
          {
            label: "ECD de Swab",
            val: currentSwab,
            limit: pore,
            limitLabel: `Poro: ${pore}`,
            color: SWAB_COLOR,
            status: swabStatus,
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="metric-card"
            style={{
              background: "var(--color-surface)",
              border: `1px solid ${item.status === "CRÍTICO" ? `${item.color}44` : "var(--glass-border)"}`,
              borderLeft: `4px solid ${item.color}`,
              padding: "16px",
              borderRadius: "16px",
              flex: 1,
              minWidth: "140px",
              backdropFilter: "var(--glass-blur)",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              boxShadow:
                item.status === "CRÍTICO" ? `0 0 20px ${item.color}20` : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  color: "var(--color-text-secondary)",
                  fontWeight: 700,
                  fontSize: "11px",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                {item.label}
              </span>
              <span
                style={{
                  background:
                    item.status === "CRÍTICO" ? item.color : "transparent",
                  color:
                    item.status === "CRÍTICO"
                      ? "#fff"
                      : isDark
                        ? "hsl(150, 84%, 70%)"
                        : "hsl(150, 84%, 30%)",
                  border: `1px solid ${item.status === "CRÍTICO" ? "transparent" : isDark ? "hsla(150,84%,35%,0.4)" : "hsla(150,84%,35%,0.2)"}`,
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontSize: "10px",
                  fontWeight: "bold",
                }}
              >
                {item.status}
              </span>
            </div>
            <div
              style={{ display: "flex", alignItems: "baseline", gap: "4px" }}
            >
              <span
                style={{
                  color:
                    item.status === "CRÍTICO"
                      ? item.color
                      : "var(--color-text-primary)",
                  fontSize: "24px",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  fontFamily: "monospace",
                }}
              >
                {item.val.toFixed(2)}
              </span>
              <span
                style={{ color: "var(--color-text-muted)", fontSize: "12px" }}
              >
                ppg
              </span>
            </div>
            <span
              style={{
                fontSize: 10,
                color: "var(--color-text-muted)",
                fontWeight: 600,
              }}
            >
              {item.limitLabel} ppg
            </span>
          </div>
        ))}
      </div>

      <details className="interpretation-guide">
        <summary className="guide-summary">
          ℹ️ &nbsp;CÓMO INTERPRETAR SURGE &amp; SWAB
        </summary>
        <div className="guide-content">
          <div>
            <strong>¿Qué es Surge &amp; Swab?</strong>
            <p>
              Cuando se mueve la tubería dentro del pozo, se generan presiones
              dinámicas. El Surge aumenta la presión y el Swab la reduce.
            </p>
          </div>
          <div>
            <strong>Ventana Operativa</strong>
            <p>
              Mantenga el ECD dentro de la zona sombreada (entre gradiente de
              poro y fractura) ajustable con la velocidad.
            </p>
          </div>
        </div>
      </details>
    </div>
  );
};
