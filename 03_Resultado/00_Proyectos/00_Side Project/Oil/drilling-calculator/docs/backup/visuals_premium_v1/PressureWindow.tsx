import React from "react";
import "./PressureWindow.css";

interface PressureWindowProps {
  tvd: number;
  porePressure: number;
  fracturePressure: number;
  mudWeight: number;
}

export const PressureWindow: React.FC<PressureWindowProps> = ({
  tvd,
  porePressure,
  fracturePressure,
  mudWeight,
}) => {
  const hydrostaticPsi = mudWeight * 0.052 * tvd;

  // Escala Estable: Redondeamos al millar más cercano (ej: 4200 -> 5000)
  // Esto evita que el valor máximo siempre ocupe el ~91% de la barra y las líneas no se muevan.
  const currentMax = Math.max(
    porePressure,
    fracturePressure,
    hydrostaticPsi,
    500,
  );
  const maxP = Math.ceil(currentMax / 1000) * 1000 || currentMax * 1.2;

  const getX = (val: number) => (val / maxP) * 100;

  return (
    <div className="pressure-window-container">
      <div className="pressure-header">
        <h3>Ventana de Presión</h3>
        <span className="depth-label">@ {tvd} ft TVD</span>
      </div>

      <div className="pressure-content">
        <svg viewBox="0 0 100 60" className="pressure-svg">
          {/* Safe Zone Area */}
          <path
            d={`M${getX(porePressure)},0 L${getX(fracturePressure)},0 L${getX(fracturePressure)},50 L${getX(porePressure)},50 Z`}
            className="safe-zone"
          />

          {/* Lines */}
          <line
            x1={getX(porePressure)}
            y1="0"
            x2={getX(porePressure)}
            y2="50"
            className="line-pore"
          />
          <line
            x1={getX(fracturePressure)}
            y1="0"
            x2={getX(fracturePressure)}
            y2="50"
            className="line-frac"
          />
          <line
            x1={getX(hydrostaticPsi)}
            y1="0"
            x2={getX(hydrostaticPsi)}
            y2="50"
            className="line-hydro"
          />

          <circle
            cx={getX(hydrostaticPsi)}
            cy="25"
            r="1.5"
            className="dot-hydro"
          />

          {/* Labels */}
          <text x="0" y="58" className="svg-label">
            0
          </text>
          <text x="100" y="58" className="svg-label" textAnchor="end">
            {maxP.toFixed(0)} psi
          </text>
        </svg>

        <div className="pressure-metrics">
          <div className="metric-item pore">
            <span className="m-val">{porePressure.toFixed(0)}</span>
            <span className="m-label">PORO</span>
          </div>
          <div className="metric-item hydro">
            <span className="m-val">{hydrostaticPsi.toFixed(0)}</span>
            <span className="m-label">HIDRO</span>
          </div>
          <div className="metric-item frac">
            <span className="m-val">{fracturePressure.toFixed(0)}</span>
            <span className="m-label">FRAC</span>
          </div>
        </div>
      </div>
    </div>
  );
};
