import { useDrillingStore } from "../../store/drilling-store";
import "./WellboreSchematic.css";

interface WellboreSchematicProps {
  isDark?: boolean;
}

export function WellboreSchematic({ isDark = true }: WellboreSchematicProps) {
  const { wellData, results } = useDrillingStore();

  // --- CONFIGURACIÓN DE LIENZO ---
  const SVG_WIDTH = 280;
  const SVG_HEIGHT = 600; // Más espacio vertical
  const MARGIN_TOP = 40;
  const MARGIN_BOTTOM = 60; // Margen inferior para etiquetas y bit
  const DRAW_HEIGHT = SVG_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM;
  const CENTER_X = SVG_WIDTH / 2;
  const MARGIN_SIDE = 50;

  // --- DATOS Y ESCALAS ---
  const totalDepth = Number(wellData.totalDepth) || 0;
  const maxDepth = Math.max(totalDepth, 1500); // Mínimo 1500 ft para evitar saltos
  const scaleY = DRAW_HEIGHT / maxDepth;

  // Profundidades (MD)
  const dpLen = Number(wellData.drillPipeLength) || 0;
  const hwdpLen = Number(wellData.hwdpLength) || 0;
  const dcLen = Number(wellData.dcLength) || 0;

  // Posiciones Verticales (Y)
  const dpStart = MARGIN_TOP;
  const dpEnd = dpStart + dpLen * scaleY;
  const hwdpStart = dpEnd;
  const hwdpEnd = hwdpStart + hwdpLen * scaleY;
  const dcStart = hwdpEnd;
  const dcEnd = dcStart + dcLen * scaleY;

  // La barrena termina en dcEnd. El fondo del hoyo siempre es TVD/TD.
  const bitPos = dcEnd;
  const holeBottom = MARGIN_TOP + totalDepth * scaleY;

  // Ajuste inteligente de etiquetas para evitar solapamientos
  const isBitAtBottom = Math.abs(bitPos - holeBottom) < 15;

  // Radios (Escalamiento para Visibilidad Dinámica)
  // Nota: Multiplicamos por factores para que la diferencia sea visible pero mantenga jerarquía.
  const holeR = (wellData.holeSize / 12) * 55;
  const dpR = (wellData.drillPipeOD / 12) * 55;
  const hwdpR = (wellData.hwdpOD / 12) * 55;
  const dcR = (wellData.dcOD / 12) * 55;

  // --- CÁLCULOS DE APOYO (Para Leyenda Inteligente) ---
  const hydraulics = results?.hydraulics || {};
  const vol = results?.volumetrics;

  const getRegimeColor = (regime: string | undefined) => {
    switch (regime) {
      case "Turbulent":
        return "#ef4444"; // Rojo (Riesgo Erosión)
      case "Transition":
        return "#f59e0b"; // Naranja (Inestabilidad)
      case "Laminar":
        return "#3b82f6"; // Azul (Seguro / API Pick)
      default:
        return "rgba(255,255,255,0.05)";
    }
  };

  return (
    <div
      className={`wellbore-schematic-container ${!isDark ? "light-mode" : ""}`}
    >
      <div className="wellbore-header">
        <div className="header-main">
          <h3>Geometría del Pozo</h3>
          <div className="header-actions">
            <span className="status-badge">MD: {wellData.totalDepth} ft</span>
          </div>
        </div>
        <div className="header-sub">
          <span>Hoyo: {wellData.holeSize}"</span>
          <span>Barrena: {wellData.bitSize}"</span>
        </div>
      </div>

      <div className="wellbore-layout">
        <svg
          className="wellbore-svg-v3"
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        >
          <defs>
            <linearGradient id="well-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.02)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.08)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
            </linearGradient>
            <linearGradient id="hwdp-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#a3e635" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 1. MUD / ANNULUS BACKGROUND (Dynamic Heatmap) */}
          <g className="annular-heatmap">
            {/* Annulus around DP */}
            <path
              className={`mud-annulus regime-${hydraulics.flowRegimeDP?.toLowerCase() || "laminar"}`}
              d={`M ${CENTER_X - holeR} ${dpStart} 
                 L ${CENTER_X - holeR} ${dpEnd} 
                 L ${CENTER_X + holeR} ${dpEnd}
                 L ${CENTER_X + holeR} ${dpStart} Z`}
              fill={getRegimeColor(hydraulics.flowRegimeDP)}
              fillOpacity="0.15"
            />
            {/* Annulus around HWDP */}
            <path
              className={`mud-annulus regime-${hydraulics.flowRegimeAnnular?.toLowerCase() || "laminar"}`}
              d={`M ${CENTER_X - holeR} ${hwdpStart} 
                 L ${CENTER_X - holeR} ${hwdpEnd} 
                 L ${CENTER_X + holeR} ${hwdpEnd}
                 L ${CENTER_X + holeR} ${hwdpStart} Z`}
              fill={getRegimeColor(hydraulics.flowRegimeAnnular)}
              fillOpacity="0.2"
            />
            {/* Annulus around DC (Critical Section) */}
            <path
              className={`mud-annulus regime-${hydraulics.flowRegimeAnnular?.toLowerCase() || "laminar"}`}
              d={`M ${CENTER_X - holeR} ${dcStart} 
                 L ${CENTER_X - holeR} ${dcEnd} 
                 L ${CENTER_X + holeR} ${dcEnd}
                 L ${CENTER_X + holeR} ${dcStart} Z`}
              fill={getRegimeColor(hydraulics.flowRegimeAnnular)}
              fillOpacity="0.25"
            />
            {/* Bottom transition (Transition to hole bottom) */}
            <path
              className="mud-annulus-bottom"
              d={`M ${CENTER_X - holeR} ${dcEnd}
                 L ${CENTER_X} ${holeBottom + 10}
                 L ${CENTER_X + holeR} ${dcEnd} Z`}
              fill={getRegimeColor(hydraulics.flowRegimeAnnular)}
              fillOpacity="0.1"
            />
          </g>

          {/* 2. HOLE WALLS */}
          <g className="hole-walls">
            <line
              x1={CENTER_X - holeR}
              y1={MARGIN_TOP}
              x2={CENTER_X - holeR}
              y2={holeBottom}
              stroke={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"}
              strokeDasharray="4 2"
            />
            <line
              x1={CENTER_X + holeR}
              y1={MARGIN_TOP}
              x2={CENTER_X + holeR}
              y2={holeBottom}
              stroke={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"}
              strokeDasharray="4 2"
            />
            {/* Fondo del hoyo estilo V-Shape (IADC) */}
            <path
              d={`M ${CENTER_X - holeR} ${holeBottom} L ${CENTER_X} ${holeBottom + 15} L ${CENTER_X + holeR} ${holeBottom}`}
              fill="none"
              stroke={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)"}
              strokeWidth="1.5"
            />
          </g>

          {/* 3. DRILL STRING (The Heart) */}
          <g className="drill-string-v3">
            {/* Drill Pipe */}
            {dpLen > 0 && (
              <rect
                className="pipe-segment dp"
                x={CENTER_X - dpR}
                y={dpStart}
                width={dpR * 2}
                height={dpLen * scaleY}
              />
            )}

            {/* HWDP */}
            {hwdpLen > 0 && (
              <rect
                className="pipe-segment hwdp"
                x={CENTER_X - hwdpR}
                y={hwdpStart}
                width={hwdpR * 2}
                height={hwdpLen * scaleY}
              />
            )}

            {/* Drill Collars */}
            {dcLen > 0 && (
              <rect
                className="pipe-segment dc"
                x={CENTER_X - dcR}
                y={dcStart}
                width={dcR * 2}
                height={dcLen * scaleY}
              />
            )}

            {/* Bit Assembly (Contenido en el hoyo) */}
            <g className="bit-assembly">
              <rect
                x={CENTER_X - 6}
                y={bitPos}
                width={12}
                height={4}
                fill="#888"
              />
              <path
                d={`M ${CENTER_X - dcR - 2} ${bitPos + 4} 
                   L ${CENTER_X + dcR + 2} ${bitPos + 4} 
                   L ${CENTER_X + 4} ${bitPos + 14}
                   L ${CENTER_X - 4} ${bitPos + 14} Z`}
                className="bit-head"
              />
            </g>
          </g>

          {/* 4. ANNOTATIONS (Rulers & Markers) */}
          <g className="depth-ruler">
            <line
              x1={MARGIN_SIDE - 20}
              y1={MARGIN_TOP}
              x2={MARGIN_SIDE - 10}
              y2={MARGIN_TOP}
              stroke="#666"
            />
            <text
              x={MARGIN_SIDE - 25}
              y={MARGIN_TOP + 4}
              textAnchor="end"
              className="ruler-text"
            >
              0 ft
            </text>

            {/* Marcador de Barrena (Si no está en el fondo) */}
            {!isBitAtBottom && (
              <g>
                <line
                  x1={CENTER_X + holeR + 5}
                  y1={bitPos}
                  x2={CENTER_X + holeR + 25}
                  y2={bitPos}
                  stroke="var(--primary)"
                  strokeWidth={1}
                  opacity={0.6}
                />
                <text
                  x={CENTER_X + holeR + 30}
                  y={bitPos + 4}
                  className="ruler-text active"
                  style={{ fill: "var(--primary)", fontSize: "10px" }}
                >
                  BIT: {Math.round(bitPos / scaleY - MARGIN_TOP / scaleY)} ft
                </text>
              </g>
            )}

            {/* Etiqueta de Fondo Real (TD) */}
            <line
              x1={MARGIN_SIDE - 20}
              y1={holeBottom}
              x2={MARGIN_SIDE - 10}
              y2={holeBottom}
              stroke={isDark ? "rgba(255,255,255,0.4)" : "#666"}
            />
            <text
              x={MARGIN_SIDE - 25}
              y={holeBottom + 4}
              textAnchor="end"
              className="ruler-text active"
              style={{ fontWeight: "800" }}
            >
              {Math.round(wellData.totalDepth)} ft
            </text>
          </g>
        </svg>

        {/* 5. LEGEND & METRICS (Decision Support) */}
        <div className="engineering-legend">
          <div className="legend-section">
            <h4>COMPONENTES</h4>
            <div className="l-item">
              <div className="l-box dp" />
              <div className="l-details">
                <span className="l-name">
                  Drill Pipe {wellData.drillPipeOD}"
                </span>
                <span className="l-val">0 - {dpLen} ft</span>
              </div>
            </div>
            <div className="l-item">
              <div className="l-box hwdp" />
              <div className="l-details">
                <span className="l-name">HWDP {wellData.hwdpOD}"</span>
                <span className="l-val">
                  {dpLen} - {dpLen + hwdpLen} ft
                </span>
              </div>
            </div>
            <div className="l-item">
              <div className="l-box dc" />
              <div className="l-details">
                <span className="l-name">Drill Collars {wellData.dcOD}"</span>
                <span className="l-val">
                  {dpLen + hwdpLen} - {dpLen + hwdpLen + dcLen} ft
                </span>
              </div>
            </div>
          </div>

          <div className="legend-section metrics">
            <h4>HUELGOS ANULARES (CLEARANCE)</h4>
            <div className="m-row">
              <span className="m-label">Annular DP:</span>
              <span className="m-val">
                {wellData.holeSize && wellData.drillPipeOD
                  ? ((wellData.holeSize - wellData.drillPipeOD) / 2).toFixed(2)
                  : "0.00"}{" "}
                in
              </span>
            </div>
            <div className="m-row">
              <span className="m-label">Annular DC:</span>
              <span className="m-val">
                {wellData.holeSize && wellData.dcOD
                  ? ((wellData.holeSize - wellData.dcOD) / 2).toFixed(2)
                  : "0.00"}{" "}
                in
              </span>
            </div>
            <div className="m-row highlight">
              <span className="m-label">Vol. Total:</span>
              <span className="m-val">
                {vol?.totalSystemVolume
                  ? vol.totalSystemVolume.toFixed(1)
                  : "0.0"}{" "}
                bbl
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
