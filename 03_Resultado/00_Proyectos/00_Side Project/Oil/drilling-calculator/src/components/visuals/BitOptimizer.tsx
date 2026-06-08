import { Info } from "lucide-react";
import { useDrillingStore } from "../../store/drilling-store";
import "./BitOptimizer.css";

export function BitOptimizer() {
  const { results, wellData, activeNozzleIndex } = useDrillingStore();

  // Armor Layer: Prevenir crash si los resultados aún no se han calculado
  if (!results || !results.hydraulics) return null;

  const { hydraulics } = results;

  // Renderización de los jets (visualización SVG de la mecha)
  const renderJets = () => {
    const nozzles = wellData.bitNozzles;
    const centerX = 60;
    const centerY = 60;
    const radius = 40;

    return nozzles.map((size, index) => {
      const angle = (index * 360) / nozzles.length - 90;
      const angleRad = (angle * Math.PI) / 180;
      const x = centerX + radius * Math.cos(angleRad);
      const y = centerY + radius * Math.sin(angleRad);

      const isActive = activeNozzleIndex === index;

      return (
        <g key={index} className={`bit-jet ${isActive ? "is-active" : ""}`}>
          <circle cx={x} cy={y} r={size / 4} className="jet-outer" />
          <circle cx={x} cy={y} r={size / 8} className="jet-inner" />
          <text x={x} y={y + 12} className="jet-label">
            {size}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="bit-optimizer trivi-card">
      <div className="card-header">
        <div className="header-main">
          <h4 className="card-title">Bit Optimizer & TFA</h4>
          <div className="header-actions" style={{ gap: "8px" }}>
            <div className="story-trigger">
              <Info size={14} className="info-icon" />
              <div className="story-tooltip">
                <h5>Storytelling Sistémico</h5>
                <p>
                  El TFA conecta las Bombas (Q) con la Presión de Fondo (BHP).
                  Cada boquilla es un regulador de energía que impacta tu
                  ventana de seguridad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bit-visual-grid">
        <div className="bit-render">
          <svg viewBox="0 0 120 120" className="bit-svg">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <circle cx="60" cy="60" r="55" className="bit-body" />

            {/* Capa de Crossflow (Dinámica) */}
            <g
              className="crossflow-layer"
              style={{ opacity: Math.min(hydraulics?.hhpPerSqIn / 8, 0.8) }}
            >
              {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                <path
                  key={i}
                  className="crossflow-stream"
                  d="M 60 60 Q 80 40 100 60"
                  transform={`rotate(${angle} 60 60)`}
                />
              ))}
            </g>

            <circle cx="60" cy="60" r="10" className="bit-center" />
            {renderJets()}
          </svg>
        </div>

        <div className="bit-metrics">
          <div className="metric-row">
            <span className="label">Total Flow Area (TFA)</span>
            <span className="value">
              {hydraulics?.totalFlowArea
                ? hydraulics.totalFlowArea.toFixed(4)
                : "0.0000"}{" "}
              <small>in²</small>
            </span>
          </div>
          <div className="metric-row">
            <span className="label">Velocidad de Boquilla</span>
            <span className="value">
              {hydraulics?.nozzleVelocity
                ? hydraulics.nozzleVelocity.toFixed(0)
                : "0"}{" "}
              <small>ft/sec</small>
            </span>
          </div>
          <div className="metric-row highlight">
            <span className="label">Bit HHP</span>
            <span className="value">
              {hydraulics?.bitHHP ? hydraulics.bitHHP.toFixed(1) : "0.0"}{" "}
              <small>hp</small>
            </span>
          </div>
          <div className="metric-row highlight-alt">
            <span className="label">Fuerza de Impacto</span>
            <span className="value">
              {hydraulics?.impactForce
                ? hydraulics.impactForce.toFixed(0)
                : "0"}{" "}
              <small>lbs</small>
            </span>
          </div>
        </div>
      </div>

      <div className="bit-efficiency">
        <div className="efficiency-bar">
          <div
            className="efficiency-fill"
            style={{
              width: `${Math.min((hydraulics.hhpPerSqIn / 8) * 100, 100)}%`,
            }}
          />
        </div>
        <div className="efficiency-labels">
          <span>Limpieza de Fondo</span>
          <span>
            {hydraulics?.hhpPerSqIn ? hydraulics.hhpPerSqIn.toFixed(2) : "0.00"}{" "}
            hp/in²
          </span>
        </div>
      </div>
    </div>
  );
}
