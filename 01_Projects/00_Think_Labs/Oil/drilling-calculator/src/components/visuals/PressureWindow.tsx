import { useState, type FC } from "react";
import "./PressureWindow.css";

interface PressureWindowProps {
  tvd: number;
  porePressure: number;
  fracturePressure: number;
  mudWeight: number;
  ecd?: number;
  isDark?: boolean;
}

export const PressureWindow: FC<PressureWindowProps> = ({
  tvd,
  porePressure,
  fracturePressure,
  mudWeight,
  ecd = 0,
  isDark = false,
}) => {
  const [showHydro, setShowHydro] = useState(true);

  const hydroPsi = mudWeight * 0.052 * tvd;
  const ecdPsi = ecd > 0 ? ecd * 0.052 * tvd : hydroPsi;
  const overbalance = hydroPsi - porePressure;
  const fracMargin = fracturePressure - ecdPsi;

  const isEcdSafe = ecdPsi < fracturePressure && ecdPsi > porePressure;
  const isLowOB = overbalance < 100 && overbalance >= 0;
  const isKick = overbalance < 0;

  let statusLabel = "OPERACIÓN SEGURA";
  let statusColor = "#10b981";
  if (isKick) {
    statusLabel = "⛔ KICK RISK";
    statusColor = "#dc2626";
  } else if (!isEcdSafe) {
    statusLabel = "⚠️ ECD FUERA";
    statusColor = "#f59e0b";
  } else if (isLowOB) {
    statusLabel = "⚠️ OB BAJO";
    statusColor = "#f59e0b";
  }

  // SVG layout: horizontal axis = pressure 0..maxP
  const pad = 1;
  const maxP =
    Math.max(porePressure, fracturePressure, hydroPsi, ecdPsi, 1) * 1.08;
  const W = 100;
  const H = 56;
  const getX = (v: number) => pad + (v / maxP) * (W - pad * 2);

  // Zones
  const xPore = getX(porePressure);
  const xHydro = getX(hydroPsi);
  const xEcd = getX(ecdPsi);
  const xFrac = getX(fracturePressure);

  // Tick marks every ~20% of maxP
  const ticks: number[] = [];
  const tickStep = maxP / 5;
  for (let i = 0; i <= 5; i++) ticks.push(tickStep * i);

  return (
    <div className={`pw-container ${isDark ? "pw-dark" : "pw-light"}`}>
      {/* Accent bar top */}
      <div
        className="pw-accent-bar"
        style={{
          background: `linear-gradient(90deg, ${statusColor} 0%, #00b4d8 60%, #cbff6a 100%)`,
        }}
      />

      {/* Header — Fila 1: badge + toggle */}
      <div className="pw-header-row1">
        <div className="pw-status-badge" style={{ background: statusColor }}>
          <span className="pw-pulse" />
          {statusLabel}
        </div>
        <button
          className={`pw-toggle ${showHydro ? "active" : ""}`}
          onClick={() => setShowHydro((p) => !p)}
          title="Mostrar/Ocultar Presión Hidrostática"
        >
          <span className="pw-toggle-dot" style={{ background: "#0284c7" }} />
          HIDROSTÁTICA
        </button>
      </div>

      {/* Header — Fila 2: título + TVD */}
      <div className="pw-header-row2">
        <span className="pw-section-title">VENTANA DE PRESIÓN</span>
        <span className="pw-tvd-label">@ {tvd.toLocaleString()} ft TVD</span>
      </div>

      {/* SVG Chart */}
      <div className="pw-chart-wrapper">
        <svg
          viewBox={`0 0 ${W} ${H + 14}`}
          className="pw-svg"
          style={{ overflow: "visible" }}
        >
          <defs>
            {/* Zone gradients */}
            <linearGradient id="pw-kick-zone" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0.04" />
            </linearGradient>
            <linearGradient id="pw-safe-zone" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="pw-frac-zone" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0.22" />
            </linearGradient>
            {/* ECD line glow */}
            <filter id="pw-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="0.7" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Grid pattern */}
            <pattern
              id="pw-grid"
              width="10"
              height="8"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 8"
                fill="none"
                stroke="rgba(100,116,139,0.08)"
                strokeWidth="0.3"
              />
            </pattern>
          </defs>
          {/* Background */}
          <rect
            x={pad}
            y="0"
            width={W - pad * 2}
            height={H}
            fill="url(#pw-grid)"
            rx="2"
          />
          {/* Zone 1: Kick Risk (left of pore) */}
          <rect
            x={pad}
            y="0"
            width={Math.max(0, xPore - pad)}
            height={H}
            fill="url(#pw-kick-zone)"
            rx="2"
          />
          {/* Zone 2: Safe Operating Window */}
          <rect
            x={xPore}
            y="0"
            width={Math.max(0, xFrac - xPore)}
            height={H}
            fill="url(#pw-safe-zone)"
          />
          {/* Zone 3: Fracture Zone (right of frac) */}
          <rect
            x={xFrac}
            y="0"
            width={Math.max(0, W - pad - xFrac)}
            height={H}
            fill="url(#pw-frac-zone)"
            rx="2"
          />
          {/* Tick marks + labels */}
          {ticks.map((v, i) => (
            <g key={i}>
              <line
                x1={getX(v)}
                y1={H}
                x2={getX(v)}
                y2={H + 2}
                stroke="rgba(100,116,139,0.4)"
                strokeWidth="0.4"
              />
              <text
                x={getX(v)}
                y={H + 7}
                textAnchor="middle"
                fontSize="3.2"
                fill="rgba(100,116,139,0.7)"
                fontFamily="monospace"
              >
                {(v / 1000).toFixed(1)}k
              </text>
            </g>
          ))}
          {/* X axis line */}
          <line
            x1={pad}
            y1={H}
            x2={W - pad}
            y2={H}
            stroke="rgba(100,116,139,0.2)"
            strokeWidth="0.4"
          />
          {/* ── Pore Pressure Line */}
          <line
            x1={xPore}
            y1="0"
            x2={xPore}
            y2={H}
            stroke="#1e40af"
            strokeWidth="2"
            strokeDasharray="3.5 2"
          />
          <circle cx={xPore} cy={H * 0.5} r="1.8" fill="#1e40af" />
          PORO: {porePressure}
          {/* ── Hydrostatic Line (toggleable) */}
          {showHydro && (
            <g style={{ transition: "opacity 0.3s" }}>
              <line
                x1={xHydro}
                y1="0"
                x2={xHydro}
                y2={H}
                stroke="#0284c7"
                strokeWidth="1.8"
                strokeDasharray="2 1.5"
              />
              <circle cx={xHydro} cy={H * 0.3} r="1.5" fill="#0284c7" />
              MW: {mudWeight}
            </g>
          )}
          {/* ── ECD Line (dynamic, glowing) */}
          <g filter="url(#pw-glow)">
            <line
              x1={xEcd}
              y1="0"
              x2={xEcd}
              y2={H}
              stroke={statusColor}
              strokeWidth="2.8"
            />
          </g>
          <circle
            cx={xEcd}
            cy={H * 0.5}
            r="2.8"
            fill={statusColor}
            style={{ filter: `drop-shadow(0 0 2px ${statusColor})` }}
          />
          <text
            x={xEcd + 1.8}
            y={H * 0.5 - 4}
            fontSize="3.4"
            fill={statusColor}
            fontWeight="800"
          >
            ECD
          </text>
          {/* ── Fracture Pressure Line */}
          <line
            x1={xFrac}
            y1="0"
            x2={xFrac}
            y2={H}
            stroke="#b91c1c"
            strokeWidth="2.2"
          />
          <circle cx={xFrac} cy={H * 0.5} r="1.8" fill="#b91c1c" />
          FRAC: {fracturePressure}
        </svg>
      </div>

      {/* ── Legend — Silicon Valley Premium ── */}
      <div className="pw-legend">
        {/* Zonas */}
        <div className="pw-legend-group">
          <span className="pw-legend-group-label">ZONAS</span>
          <div className="pw-legend-pills">
            <span
              className="pw-legend-pill"
              style={{
                background: "rgba(220,38,38,0.1)",
                border: "1px solid rgba(220,38,38,0.3)",
                color: "#b91c1c",
              }}
            >
              <span className="pw-pill-dot" style={{ background: "#b91c1c" }} />{" "}
              Kick Risk
            </span>
            <span
              className="pw-legend-pill"
              style={{
                background: "rgba(16,185,129,0.08)",
                border: "1px solid rgba(16,185,129,0.3)",
                color: "#059669",
              }}
            >
              <span className="pw-pill-dot" style={{ background: "#10b981" }} />{" "}
              Ventana Segura
            </span>
            <span
              className="pw-legend-pill"
              style={{
                background: "rgba(245,158,11,0.08)",
                border: "1px solid rgba(245,158,11,0.3)",
                color: "#b45309",
              }}
            >
              <span className="pw-pill-dot" style={{ background: "#f59e0b" }} />{" "}
              Zona Fractura
            </span>
          </div>
        </div>

        {/* Líneas de presión */}
        <div className="pw-legend-group">
          <span className="pw-legend-group-label">PRESIONES</span>
          <div className="pw-legend-pills">
            <span
              className="pw-legend-pill"
              style={{
                background: "rgba(30,64,175,0.07)",
                border: "1px solid rgba(30,64,175,0.25)",
                color: "#1e40af",
              }}
            >
              <span
                className="pw-pill-line dashed"
                style={{ background: "#1e40af" }}
              />
              Poro · {porePressure} psi
            </span>
            {showHydro && (
              <span
                className="pw-legend-pill"
                style={{
                  background: "rgba(2,132,199,0.07)",
                  border: "1px solid rgba(2,132,199,0.3)",
                  color: "#0369a1",
                }}
              >
                <span
                  className="pw-pill-line dashed"
                  style={{ background: "#0284c7" }}
                />
                Hidro · {hydroPsi} psi
              </span>
            )}
            <span
              className="pw-legend-pill active-pill"
              style={{
                background: `${statusColor}12`,
                border: `1.5px solid ${statusColor}55`,
                color: statusColor,
              }}
            >
              <span
                className="pw-pill-dot pulsing"
                style={{ background: statusColor }}
              />
              ECD · {ecdPsi} psi
            </span>
            <span
              className="pw-legend-pill"
              style={{
                background: "rgba(185,28,28,0.07)",
                border: "1px solid rgba(185,28,28,0.25)",
                color: "#b91c1c",
              }}
            >
              <span
                className="pw-pill-line"
                style={{ background: "#b91c1c" }}
              />
              Fractura · {fracturePressure} psi
            </span>
          </div>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="pw-metrics">
        <div className="pw-metric-card pw-m-pore">
          <span className="pw-m-label">PORO</span>
          <span className="pw-m-value">{porePressure}</span>
          <span className="pw-m-unit">psi</span>
        </div>
        {showHydro && (
          <div className="pw-metric-card pw-m-hydro">
            <span className="pw-m-label">HÍDRO</span>
            <span className="pw-m-value">{hydroPsi}</span>
            <span className="pw-m-unit">psi</span>
          </div>
        )}
        <div
          className="pw-metric-card pw-m-ecd active"
          style={{
            borderColor: statusColor,
            boxShadow: `0 4px 16px ${statusColor}20`,
          }}
        >
          <div className="pw-m-dot" style={{ background: statusColor }} />
          <span className="pw-m-label">ECD</span>
          <span className="pw-m-value" style={{ color: statusColor }}>
            {ecdPsi}
          </span>
          <span className="pw-m-unit">psi</span>
        </div>
        <div className="pw-metric-card pw-m-frac">
          <span className="pw-m-label">FRACTURA</span>
          <span className="pw-m-value">{fracturePressure}</span>
          <span className="pw-m-unit">psi</span>
        </div>
        <div
          className={`pw-metric-card pw-m-ob ${overbalance < 0 ? "danger" : overbalance < 100 ? "warn" : "ok"}`}
        >
          <span className="pw-m-label">SOBREBALANCE</span>
          <span className="pw-m-value">{overbalance}</span>
          <span className="pw-m-unit">psi</span>
        </div>
        <div
          className={`pw-metric-card pw-m-margin ${fracMargin < 500 ? "warn" : "ok"}`}
        >
          <span className="pw-m-label">MARGEN FRAC</span>
          <span className="pw-m-value">+{Math.max(0, fracMargin)}</span>
          <span className="pw-m-unit">psi</span>
        </div>
      </div>
    </div>
  );
};
