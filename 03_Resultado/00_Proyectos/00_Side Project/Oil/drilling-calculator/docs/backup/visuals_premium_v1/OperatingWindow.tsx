// ============================================================
// Drilling Calculator — OperatingWindow Component (Visual V3)
// Premium Triple Overlaid Bar System (MW vs ECD vs FG)
// ============================================================

import "./OperatingWindow.css";

interface OperatingWindowProps {
  mudWeight: number; // MW
  ecd: number; // ECD (Actual)
  fractureGradient: number; // FG (Límite)
  unit: string;
}

export function OperatingWindow({
  mudWeight,
  ecd,
  fractureGradient,
  unit = "ppg",
}: OperatingWindowProps) {
  // Aseguramos que los valores sean números válidos para evitar fallos de renderizado
  const validMW = mudWeight || 0;
  const validECD = ecd || 0;
  const validFG = fractureGradient || 0;

  // Escala para las barras: el máximo es siempre la fractura + un margen pequeño
  const maxScale = validFG > 0 ? validFG * 1.05 : 20; // Default a 20 ppg si FG es 0

  const getWidth = (val: number) => {
    return Math.min(100, Math.max(0, (val / maxScale) * 100));
  };

  const mwWidth = getWidth(validMW);
  const ecdWidth = getWidth(validECD);
  const fgWidth = getWidth(validFG);

  // Colores dinámicos del ECD según proximidad a la fractura
  const isDangerous = validECD >= validFG && validFG > 0;
  const ecdColor = isDangerous ? "#ef4444" : "#BFF333";
  const ecdGlow = isDangerous
    ? "rgba(239, 68, 68, 0.4)"
    : "rgba(191, 243, 51, 0.4)";

  return (
    <div className="operating-window-v3">
      <div className="ow-header">
        <span className="ow-title">Ventana Operativa (Triple Barra)</span>
        <span className="ow-unit">{unit}</span>
      </div>

      <div className="ow-container">
        {/* Empty State: Si todos los valores son 0, mostramos un placeholder */}
        {validFG === 0 && validECD === 0 && validMW === 0 ? (
          <div className="ow-empty-state">
            <span className="ow-empty-text">
              Esperando datos de simulación...
            </span>
          </div>
        ) : (
          <>
            {/* Barra 3: Fractura (El Techo - Background) */}
            <div className="ow-bar-row">
              <div className="ow-bar-label">FG</div>
              <div className="ow-progress-container">
                <div
                  className="ow-bar ow-bar--fg"
                  style={{ width: `${fgWidth}%` }}
                >
                  <span className="ow-bar-val">{validFG.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Barra 2: ECD (El Protagonista - Middle) */}
            <div className="ow-bar-row ow-bar-row--highlight">
              <div
                className="ow-bar-label ow-bar-label--ecd"
                style={{ color: ecdColor }}
              >
                ECD
              </div>
              <div className="ow-progress-container">
                <div
                  className="ow-bar ow-bar--ecd"
                  style={{
                    width: `${ecdWidth}%`,
                    background: `linear-gradient(90deg, #2563EB 0%, ${ecdColor} 100%)`,
                    boxShadow: `0 0 20px ${ecdGlow}`,
                  }}
                >
                  <div
                    className="ow-bar-glow"
                    style={{ background: ecdColor }}
                  />
                  <div className="ow-data-bubble">
                    <span className="ow-bubble-val">{validECD.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Barra 1: Lodo (La Base - Bottom) */}
            <div className="ow-bar-row">
              <div className="ow-bar-label">MW</div>
              <div className="ow-progress-container">
                <div
                  className="ow-bar ow-bar--mw"
                  style={{ width: `${mwWidth}%` }}
                >
                  <span className="ow-bar-val">{validMW.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
