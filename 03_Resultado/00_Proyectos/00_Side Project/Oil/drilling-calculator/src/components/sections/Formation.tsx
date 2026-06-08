import { Layers, AlertTriangle, CheckCircle } from "lucide-react";
import { Section } from "../ui/Section";
import { InputField } from "../ui/InputField";
import { useDrillingStore } from "../../store/drilling-store";
import "./Formation.css";

/** Clasifica el régimen de presión según los gradientes */
function classifyRegime(
  pore: number,
  frac: number,
): { label: string; color: string } {
  const window = frac - pore;
  if (window < 0.1) return { label: "VENTANA CRÍTICA", color: "#dc2626" };
  if (window < 0.3) return { label: "VENTANA ESTRECHA", color: "#f59e0b" };
  return { label: "VENTANA NORMAL", color: "#10b981" };
}

export function Formation() {
  const {
    formationData,
    setFormationData,
    validationResults,
    setActiveFocus,
    wellData,
    results,
    mudData, // Necesario para el cálculo local de sobrebalance
  } = useDrillingStore();
  const validation = validationResults.formation;

  // ── Indicadores Derivados ─────────────────────────────────
  const pore = formationData.porePressureGradient || 0;
  const frac = formationData.fractureGradient || 0;
  const norm = formationData.normalGradient || 0;
  const tvd = wellData?.tvd || 0;

  // Gradiente de Poro en ppg equivalente (psi/ft ÷ 0.052)
  const porePPG = pore > 0 ? (pore / 0.052).toFixed(2) : "—";
  const fracPPG = frac > 0 ? (frac / 0.052).toFixed(2) : "—";
  const normalPPG = norm > 0 ? (norm / 0.052).toFixed(2) : "—";

  // Ventana de Lodo en psi/ft
  const mudWindow = frac > 0 && pore > 0 ? (frac - pore).toFixed(3) : "—";

  // Presiones absolutas en el TVD actual
  const porePsi = tvd > 0 && pore > 0 ? Math.round(pore * tvd) : 0;
  const fracPsi = tvd > 0 && frac > 0 ? Math.round(frac * tvd) : 0;

  const regime = pore > 0 && frac > 0 ? classifyRegime(pore, frac) : null;

  // Reconexión Elite: Cálculo local directo para evitar latencia o desconexión del engine
  const mudWeight = mudData.mudWeight || 0;
  const computedOverbalancePPG =
    mudWeight > 0 && pore > 0
      ? mudWeight - pore / 0.052
      : (results?.pressures?.overbalancePPG ?? 0);

  return (
    <Section
      id="formation"
      title="Formación Geológica"
      icon={<Layers size={18} />}
      validationV1={validation.inputGuard.status}
      validationV2={validation.outputGuard.status}
      onFocusTrigger={() => setActiveFocus("pressures")}
    >
      <div className="section-content">
        {/* ── INPUTS ── */}
        <InputField
          label="Gradiente de Poro"
          unit="psi/ft"
          value={formationData.porePressureGradient}
          onChange={(val) => setFormationData({ porePressureGradient: val })}
        />
        <InputField
          label="Gradiente de Fractura"
          unit="psi/ft"
          value={formationData.fractureGradient}
          onChange={(val) => setFormationData({ fractureGradient: val })}
        />
        <InputField
          label="Gradiente Normal"
          unit="psi/ft"
          value={formationData.normalGradient}
          onChange={(val) => setFormationData({ normalGradient: val })}
        />

        {/* ── PANEL DE INDICADORES DERIVADOS ── */}
        {(pore > 0 || frac > 0) && (
          <div className="formation-derived-panel">
            {/* Régimen de Presión */}
            {regime && (
              <div
                className="formation-regime-badge"
                style={{
                  boxShadow: `0 0 15px ${regime.color}20`,
                  color: regime.color,
                }}
              >
                {regime.label === "VENTANA CRÍTICA" ? (
                  <AlertTriangle size={11} />
                ) : (
                  <CheckCircle size={11} />
                )}
                <span>{regime.label}</span>
                <span className="regime-window">Δ {mudWindow} psi/ft</span>
              </div>
            )}

            {/* Grid de indicadores */}
            <div className="formation-indicators-grid">
              <div className="formation-indicator">
                <span className="fi-label">Poro (ppg equiv.)</span>
                <span
                  className="fi-value"
                  style={{ fontWeight: 850, color: "#1e293b" }}
                >
                  {porePPG}
                </span>
              </div>
              <div className="formation-indicator">
                <span className="fi-label">Fractura (ppg equiv.)</span>
                <span
                  className="fi-value"
                  style={{ fontWeight: 850, color: "#1e293b" }}
                >
                  {fracPPG}
                </span>
              </div>
              <div className="formation-indicator">
                <span className="fi-label">Normal (ppg equiv.)</span>
                <span
                  className="fi-value"
                  style={{ fontWeight: 850, color: "#1e293b" }}
                >
                  {normalPPG}
                </span>
              </div>

              {computedOverbalancePPG !== 0 && (
                <div
                  className="formation-indicator highlight"
                  style={{ gridColumn: "1 / -1", marginTop: "8px" }}
                >
                  <span
                    className="fi-label"
                    style={{ color: "#0f172a", fontWeight: 800 }}
                  >
                    Sobre-balance Operativo
                  </span>
                  <div
                    className="fi-main"
                    style={{
                      color: computedOverbalancePPG > 0 ? "#059669" : "#dc2626",
                      display: "flex",
                      alignItems: "baseline",
                      gap: "4px",
                    }}
                  >
                    <span
                      className="fi-value"
                      style={{
                        fontSize: "1.6rem",
                        fontWeight: 950,
                        color: "inherit",
                      }}
                    >
                      {computedOverbalancePPG.toFixed(2)}
                    </span>
                    <span
                      className="fi-unit"
                      style={{
                        fontWeight: 900,
                        fontSize: "10px",
                        color: "inherit",
                      }}
                    >
                      ppg
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Presiones absolutas a TVD */}
            {tvd > 0 && (porePsi > 0 || fracPsi > 0) && (
              <div className="formation-absolutes">
                <div className="formation-absolutes-header">
                  Presiones absolutas @ {tvd} ft TVD
                </div>
                <div className="formation-abs-grid">
                  <div className="abs-pressure-card pore">
                    <span className="abs-label">PRESIÓN DE PORO (Pₚ)</span>
                    <div className="abs-value-group">
                      <span className="abs-value">
                        {porePsi.toLocaleString()}
                      </span>
                      <span className="abs-unit">psi</span>
                    </div>
                  </div>
                  <div className="abs-pressure-card frac">
                    <span className="abs-label">
                      PRESIÓN DE FRACTURA (P_frac)
                    </span>
                    <div className="abs-value-group">
                      <span className="abs-value">
                        {fracPsi.toLocaleString()}
                      </span>
                      <span className="abs-unit">psi</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Section>
  );
}
