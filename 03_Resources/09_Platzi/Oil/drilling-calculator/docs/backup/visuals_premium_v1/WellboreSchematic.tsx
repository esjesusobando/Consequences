import { useDrillingStore } from "../../store/drilling-store";
import "./WellboreSchematic.css";

export function WellboreSchematic() {
  const { wellData, results } = useDrillingStore();

  // --- CONFIGURACIÓN DE LIENZO ---
  const SVG_WIDTH = 280;
  const SVG_HEIGHT = 500;
  const MARGIN_TOP = 40;
  const MARGIN_SIDE = 50;
  const CENTER_X = SVG_WIDTH / 2;
  const DRAW_HEIGHT = SVG_HEIGHT - 100;

  // --- DATOS Y ESCALAS ---
  const maxDepth = Math.max(wellData.totalDepth || 1000, 100);
  const scaleY = DRAW_HEIGHT / maxDepth;

  // Profundidades (MD)
  const dpLen = wellData.drillPipeLength || 0;
  const hwdpLen = wellData.hwdpLength || 0;
  const dcLen = wellData.dcLength || 0;

  // Posiciones Verticales (Y)
  const dpStart = MARGIN_TOP;
  const dpEnd = dpStart + dpLen * scaleY;
  const hwdpStart = dpEnd;
  const hwdpEnd = hwdpStart + hwdpLen * scaleY;
  const dcStart = hwdpEnd;
  const dcEnd = dcStart + dcLen * scaleY;
  const bitPos = dcEnd;
  const holeBottom = MARGIN_TOP + wellData.totalDepth * scaleY;

  // Radios (Escalamiento para Visibilidad Dinámica)
  // Nota: Multiplicamos por factores para que la diferencia sea visible pero mantenga jerarquía.
  const holeR = (wellData.holeSize / 12) * 55;
  const dpR = (wellData.drillPipeOD / 12) * 55;
  const hwdpR = (wellData.hwdpOD / 12) * 55;
  const dcR = (wellData.dcOD / 12) * 55;

  // --- CÁLCULOS DE APOYO (Para Leyenda Inteligente) ---
  const vol = results?.volumetrics;

  return (
    <div className="wellbore-schematic-container">
      <div className="wellbore-header">
        <div className="header-main">
          <h3>Geometría del Pozo</h3>
          <span className="status-badge">MD: {wellData.totalDepth} ft</span>
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

          {/* 1. MUD / ANNULUS BACKGROUND */}
          <path
            className="mud-annulus"
            d={`M ${CENTER_X - holeR} ${MARGIN_TOP} 
               L ${CENTER_X - holeR} ${holeBottom} 
               A ${holeR} ${holeR / 5} 0 0 0 ${CENTER_X + holeR} ${holeBottom}
               L ${CENTER_X + holeR} ${MARGIN_TOP}`}
            fill="url(#well-grad)"
          />

          {/* 2. HOLE WALLS */}
          <g className="hole-walls">
            <line
              x1={CENTER_X - holeR}
              y1={MARGIN_TOP}
              x2={CENTER_X - holeR}
              y2={holeBottom}
              stroke="rgba(255,255,255,0.2)"
              strokeDasharray="4 2"
            />
            <line
              x1={CENTER_X + holeR}
              y1={MARGIN_TOP}
              x2={CENTER_X + holeR}
              y2={holeBottom}
              stroke="rgba(255,255,255,0.2)"
              strokeDasharray="4 2"
            />
            <ellipse
              cx={CENTER_X}
              cy={holeBottom}
              rx={holeR}
              ry={holeR / 5}
              fill="none"
              stroke="rgba(255,255,255,0.2)"
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

            {/* Bit (Barrena de Precisión) */}
            <g className="bit-assembly" filter="url(#glow)">
              <rect
                x={CENTER_X - 6}
                y={bitPos}
                width={12}
                height={4}
                fill="#888"
              />
              <path
                d={`M ${CENTER_X - holeR + 2} ${bitPos + 4} 
                   L ${CENTER_X + holeR - 2} ${bitPos + 4} 
                   L ${CENTER_X + 2} ${bitPos + 12}
                   L ${CENTER_X - 2} ${bitPos + 12} Z`}
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

            <line
              x1={MARGIN_SIDE - 20}
              y1={bitPos}
              x2={MARGIN_SIDE - 10}
              y2={bitPos}
              stroke="var(--primary)"
            />
            <text
              x={MARGIN_SIDE - 25}
              y={bitPos + 4}
              textAnchor="end"
              className="ruler-text active"
            >
              {Math.round(wellData.totalDepth)} ft
            </text>
          </g>
        </svg>

        {/* 5. LEGEND & METRICS (Decision Support) */}
        <div className="engineering-legend">
          <div className="legend-section">
            <h4>Componentes</h4>
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
            <h4>Huelgos Anulares (Clearance)</h4>
            <div className="m-row">
              <span className="m-label">Annular DP:</span>
              <span className="m-val">
                {((wellData.holeSize - wellData.drillPipeOD) / 2).toFixed(2)} in
              </span>
            </div>
            <div className="m-row">
              <span className="m-label">Annular DC:</span>
              <span className="m-val">
                {((wellData.holeSize - wellData.dcOD) / 2).toFixed(2)} in
              </span>
            </div>
            <div className="m-row highlight">
              <span className="m-label">Vol. Total:</span>
              <span className="m-val">
                {vol?.totalSystemVolume.toFixed(1)} bbl
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
