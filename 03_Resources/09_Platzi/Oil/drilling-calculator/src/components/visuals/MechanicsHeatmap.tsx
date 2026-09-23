import { useDrillingStore } from "../../store/drilling-store";

interface MechanicsHeatmapProps {
  isDark?: boolean;
}

export function MechanicsHeatmap({ isDark = true }: MechanicsHeatmapProps) {
  const { results, wellData } = useDrillingStore();
  const surgeSwab = results?.surgeSwab;
  const pressures = results?.pressures;
  const tvd = wellData.tvd || 10000;

  if (!surgeSwab || !pressures) return null;

  // Colores dinámicos
  const glassBg = isDark ? "rgba(10, 10, 15, 0.9)" : "rgba(255, 255, 255, 0.9)";
  const glassBorder = isDark
    ? "2px solid rgba(255, 255, 255, 0.3)"
    : "2px solid rgba(0, 0, 0, 0.1)";
  const titleColor = isDark ? "rgba(255, 255, 255, 1)" : "hsl(230, 25%, 20%)";
  const gridLineColor = isDark
    ? "rgba(255, 255, 255, 0.05)"
    : "rgba(0, 0, 0, 0.1)";
  const gridTextColor = isDark
    ? "rgba(255, 255, 255, 0.3)"
    : "rgba(0, 0, 0, 0.4)";
  const mwLineColor = isDark ? "#ffffff" : "hsl(230, 30%, 30%)";
  const mwCardBg = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.05)";
  const mwCardBorder = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.1)";
  const bottomCardBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)";
  const bottomCardBorder = isDark
    ? "1px solid rgba(255,255,255,0.1)"
    : "1px solid rgba(0,0,0,0.08)";
  const bottomLabelColor = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.5)";

  const SVG_WIDTH = 240;
  const SVG_HEIGHT = 600;
  const PADDING_X = 40;
  const PADDING_Y = 20;

  // Calculamos límites para la escala X (ppg)
  const porePPG = pressures.porePressure / (0.052 * tvd);
  const fracPPG = pressures.fracturePressure / (0.052 * tvd);
  const mudPPG = pressures.hydrostaticPressure / (0.052 * tvd) || 12;
  const surgePPG = surgeSwab.ecdSurge;
  const swabPPG = surgeSwab.ecdSwab;

  const minX = Math.floor(Math.min(porePPG, swabPPG) - 1);
  const maxX = Math.ceil(Math.max(fracPPG, surgePPG) + 1);
  const rangeX = maxX - minX;

  const getX = (ppg: number) => {
    return PADDING_X + ((ppg - minX) / rangeX) * (SVG_WIDTH - 2 * PADDING_X);
  };

  const poreX = getX(porePPG);
  const fracX = getX(fracPPG);
  const surgeX = getX(surgePPG);
  const swabX = getX(swabPPG);
  const mudX = getX(mudPPG);

  return (
    <div
      className="mechanics-heatmap-container"
      style={{
        background: glassBg,
        borderRadius: "24px",
        padding: "24px",
        border: glassBorder,
        boxShadow: isDark
          ? "0 12px 40px rgba(0,0,0,0.6)"
          : "0 8px 30px rgba(0,0,0,0.1)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h4
          style={{
            fontSize: "14px",
            color: titleColor,
            fontWeight: "900",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            margin: 0,
          }}
        >
          Perfil Dinámico de Presión
        </h4>
        <div
          style={{
            padding: "4px 10px",
            background: isDark
              ? "rgba(0, 243, 255, 0.1)"
              : "rgba(37, 99, 235, 0.1)",
            borderRadius: "8px",
            border: isDark
              ? "1px solid rgba(0, 243, 255, 0.3)"
              : "1px solid rgba(37, 99, 235, 0.3)",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              color: isDark ? "#00f3ff" : "#2563eb",
              fontWeight: "bold",
            }}
          >
            REAL-TIME ECD
          </span>
        </div>
      </div>

      <div style={{ flex: 1, position: "relative", minHeight: "450px" }}>
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          style={{ width: "100%", height: "100%", overflow: "visible" }}
        >
          <defs>
            <linearGradient id="safeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(34, 197, 94, 0.05)" />
              <stop offset="50%" stopColor="rgba(34, 197, 94, 0.15)" />
              <stop offset="100%" stopColor="rgba(34, 197, 94, 0.05)" />
            </linearGradient>
            <linearGradient
              id="surgeGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor={
                  isDark ? "rgba(0, 243, 255, 0)" : "rgba(37, 99, 235, 0)"
                }
              />
              <stop
                offset="50%"
                stopColor={
                  isDark ? "rgba(0, 243, 255, 0.4)" : "rgba(37, 99, 235, 0.2)"
                }
              />
              <stop
                offset="100%"
                stopColor={
                  isDark ? "rgba(0, 243, 255, 0)" : "rgba(37, 99, 235, 0)"
                }
              />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {[...Array(rangeX + 1)].map((_, i) => {
            const val = minX + i;
            const x = getX(val);
            return (
              <g key={val}>
                <line
                  x1={x}
                  y1={PADDING_Y}
                  x2={x}
                  y2={SVG_HEIGHT - PADDING_Y}
                  stroke={gridLineColor}
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={SVG_HEIGHT}
                  fontSize="10"
                  fill={gridTextColor}
                  textAnchor="middle"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Safe Drilling Window */}
          <rect
            x={poreX}
            y={PADDING_Y}
            width={fracX - poreX}
            height={SVG_HEIGHT - 2 * PADDING_Y}
            fill="url(#safeGradient)"
            stroke="rgba(34, 197, 94, 0.2)"
            strokeDasharray="4 4"
          />

          {/* Range: Surge to Swab */}
          <rect
            x={swabX}
            y={120}
            width={surgeX - swabX}
            height={SVG_HEIGHT - 240}
            fill="url(#surgeGradient)"
            rx="10"
            filter={isDark ? "url(#glow)" : ""}
          />

          {/* Pore Pressure Line */}
          <line
            x1={poreX}
            y1={PADDING_Y}
            x2={poreX}
            y2={SVG_HEIGHT - PADDING_Y}
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="6 4"
          />
          <text
            x={poreX - 5}
            y={PADDING_Y + 15}
            fontSize="11"
            fill="#ef4444"
            fontWeight="bold"
            textAnchor="end"
          >
            PORE
          </text>

          {/* Fracture Pressure Line */}
          <line
            x1={fracX}
            y1={PADDING_Y}
            x2={fracX}
            y2={SVG_HEIGHT - PADDING_Y}
            stroke="#b91c1c"
            strokeWidth="3"
          />
          <text
            x={fracX + 5}
            y={PADDING_Y + 15}
            fontSize="11"
            fill="#b91c1c"
            fontWeight="bold"
          >
            FRAC
          </text>

          {/* Static Mud Weight */}
          <line
            x1={mudX}
            y1={PADDING_Y}
            x2={mudX}
            y2={SVG_HEIGHT - PADDING_Y}
            stroke={mwLineColor}
            strokeWidth="2"
            filter={isDark ? "url(#glow)" : ""}
          />

          {/* Dynamic Labels */}
          <g transform={`translate(${surgeX}, 200)`}>
            <circle
              r="4"
              fill={isDark ? "#00f3ff" : "#2563eb"}
              filter={isDark ? "url(#glow)" : ""}
            />
            <text
              x="8"
              y="4"
              fontSize="12"
              fill={isDark ? "#00f3ff" : "#2563eb"}
              fontWeight="bold"
            >
              Surge: {surgePPG.toFixed(2)}
            </text>
          </g>

          <g transform={`translate(${swabX}, 400)`}>
            <circle
              r="4"
              fill={
                isDark ? "rgba(0, 243, 255, 0.8)" : "rgba(37, 99, 235, 0.8)"
              }
              opacity="0.7"
            />
            <text
              x="8"
              y="4"
              fontSize="12"
              fill={
                isDark ? "rgba(0, 243, 255, 0.8)" : "rgba(37, 99, 235, 0.8)"
              }
              fontWeight="bold"
            >
              Swab: {swabPPG.toFixed(2)}
            </text>
          </g>

          {/* Middle Indicator: Mud Weight */}
          <rect
            x={mudX - 25}
            y={280}
            width="50"
            height="40"
            rx="8"
            fill={mwCardBg}
            stroke={mwCardBorder}
          />
          <text
            x={mudX}
            y={300}
            fontSize="10"
            fill={isDark ? "#fff" : "hsl(230, 30%, 30%)"}
            textAnchor="middle"
            fontWeight="bold"
          >
            MW
          </text>
          <text
            x={mudX}
            y={312}
            fontSize="12"
            fill={isDark ? "#fff" : "hsl(230, 30%, 30%)"}
            textAnchor="middle"
            fontWeight="black"
          >
            {mudPPG.toFixed(2)}
          </text>
        </svg>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          background: bottomCardBg,
          padding: "12px",
          borderRadius: "16px",
          border: bottomCardBorder,
        }}
      >
        <div style={{ textAlign: "center", padding: "4px 0" }}>
          <span
            style={{
              fontSize: "9px",
              color: bottomLabelColor,
              textTransform: "uppercase",
              display: "block",
              letterSpacing: "0.1em",
              fontWeight: "700",
              marginBottom: "4px",
            }}
          >
            Margin Surge
          </span>
          <span
            style={{
              fontSize: "18px",
              color: fracPPG - surgePPG < 0.5 ? "#ef4444" : "#22c55e",
              fontWeight: "950",
              fontFamily: "var(--font-mono, monospace)",
              letterSpacing: "-0.02em",
            }}
          >
            {(fracPPG - surgePPG).toFixed(2)}
            <span style={{ fontSize: "10px", marginLeft: "4px", opacity: 0.7 }}>
              ppg
            </span>
          </span>
        </div>
        <div
          style={{
            textAlign: "center",
            borderLeft: bottomCardBorder,
            padding: "4px 0",
          }}
        >
          <span
            style={{
              fontSize: "9px",
              color: bottomLabelColor,
              textTransform: "uppercase",
              display: "block",
              letterSpacing: "0.1em",
              fontWeight: "700",
              marginBottom: "4px",
            }}
          >
            Margin Swab
          </span>
          <span
            style={{
              fontSize: "18px",
              color: swabPPG - porePPG < 0.5 ? "#ef4444" : "#22c55e",
              fontWeight: "950",
              fontFamily: "var(--font-mono, monospace)",
              letterSpacing: "-0.02em",
            }}
          >
            {(swabPPG - porePPG).toFixed(2)}
            <span style={{ fontSize: "10px", marginLeft: "4px", opacity: 0.7 }}>
              ppg
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
