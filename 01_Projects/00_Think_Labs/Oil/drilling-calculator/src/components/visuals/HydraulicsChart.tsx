// ============================================================
// Drilling Calculator — HydraulicsChart (Premium Redesign)
// Pressure losses by section · Dynamic coloring · Rich KPIs
// ============================================================

import { useDrillingStore } from "../../store/drilling-store";
import { Section } from "../ui/Section";
import { Activity } from "lucide-react";
import "./Charts.css";

/** Color by section for visual clarity */
const SECTION_COLORS: Record<string, { base: string; glow: string }> = {
  DP: { base: "#4fc3f7", glow: "rgba(79,195,247,0.4)" },
  HWDP: { base: "#aed581", glow: "rgba(174,213,129,0.4)" },
  DC: { base: "#ff8a65", glow: "rgba(255,138,101,0.4)" },
  BIT: { base: "#ce93d8", glow: "rgba(206,147,216,0.5)" },
  ANULAR: { base: "#4dd0e1", glow: "rgba(77,208,225,0.4)" },
};

/** Determine ECD severity color */
function ecdColor(ecd: number, maxMW: number): string {
  if (ecd >= maxMW) return "#f44336"; // crítico
  if (ecd >= maxMW - 0.3) return "#ff9800"; // advertencia
  return "#4dd0e1"; // seguro
}

/** Flow regime badge */
function RegimeBadge({ regime }: { regime: string }) {
  const map: Record<string, { color: string; label: string }> = {
    Laminar: { color: "#4dd0e1", label: "LAMINAR" },
    Transition: { color: "#ff9800", label: "TRANSICIÓN" },
    Turbulent: { color: "#aed581", label: "TURBULENTO" },
  };
  const { color, label } = map[regime] ?? { color: "#888", label: regime };
  return (
    <span
      className="regime-badge"
      style={{ borderColor: color, color, boxShadow: `0 0 8px ${color}50` }}
    >
      {label}
    </span>
  );
}

export function HydraulicsChart() {
  const { results } = useDrillingStore();
  const h = results?.hydraulics;
  const p = results?.pressures;

  if (!h) {
    return (
      <Section
        id="hydraulics"
        title="Pérdidas de Presión"
        icon={<Activity size={18} />}
      >
        <div className="hydraulics-chart-container">
          <p
            style={{
              color: "rgba(0,0,0,0.3)",
              textAlign: "center",
              padding: "40px 0",
            }}
          >
            Ingresa datos para calcular hidráulica
          </p>
        </div>
      </Section>
    );
  }

  const losses = [
    { label: "DP", value: h.pressureLossDP ?? 0 },
    { label: "HWDP", value: h.pressureLossHWDP ?? 0 },
    { label: "DC", value: h.pressureLossDC ?? 0 },
    { label: "BIT", value: h.pressureLossBit ?? 0 },
    { label: "ANULAR", value: h.pressureLossAnnular ?? 0 },
  ];

  const totalLoss = h.totalPressureLoss ?? 0;
  const maxLoss = Math.max(...losses.map((l) => l.value), 1);
  const maxMW = p?.maxMudWeight ?? 99;
  const eColor = ecdColor(h.ecd ?? 0, maxMW);

  return (
    <Section
      id="hydraulics"
      title="Pérdidas de Presión"
      icon={<Activity size={18} />}
    >
      <div className="hydraulics-chart-content">
        {/* ── Header Stats ── */}
        <div className="hydraulics-header-compact">
          <div className="total-pill-premium">
            <span className="total-label">Sistema Total</span>
            <span className="total-value">
              {Math.round(totalLoss).toLocaleString()} <small>psi</small>
            </span>
          </div>
          <div className="regime-indicators">
            <div className="regime-item">
              <span className="regime-sublabel">DP</span>
              <RegimeBadge regime={h.flowRegimeDP ?? "Laminar"} />
            </div>
            <div className="regime-item">
              <span className="regime-sublabel">ÁNULO</span>
              <RegimeBadge regime={h.flowRegimeAnnular ?? "Laminar"} />
            </div>
          </div>
        </div>

        {/* ── Pressure Bars ── */}
        <div className="hydraulics-bars">
          {losses.map((loss) => {
            const col = SECTION_COLORS[loss.label] || {
              base: "#4fc3f7",
              glow: "rgba(79,195,247,0.4)",
            };
            const pct = (loss.value / maxLoss) * 100;
            const pctOfTotal =
              totalLoss > 0 ? ((loss.value / totalLoss) * 100).toFixed(0) : "0";
            return (
              <div key={loss.label} className="h-bar-row">
                <span className="h-label">{loss.label}</span>
                <div className="h-progress-bg">
                  <div
                    className="h-progress-fill"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${col.base}cc 0%, ${col.base} 100%)`,
                      boxShadow: `0 0 8px ${col.glow}`,
                    }}
                  />
                </div>
                <div className="h-val-group">
                  <div className="h-val-psi-container">
                    <span className="h-val-psi">
                      {Math.round(loss.value).toLocaleString()}
                    </span>
                    <span className="h-val-unit">psi</span>
                  </div>
                  <span className="h-val-pct">{pctOfTotal}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── KPI Grid ── */}
        <div className="hydraulics-kpi-grid">
          {/* AV */}
          <div className="summary-card">
            <span className="card-lbl">VEL. ANULAR</span>
            <span className="card-val-accent">
              {(h.annularVelocity ?? 0).toFixed(0)}
              <small className="card-unit"> ft/min</small>
            </span>
            <span className="card-sub-hint">
              {(h.annularVelocity ?? 0) < 120 ? "⚠ Baja" : "✓ OK"}
            </span>
          </div>

          {/* ECD */}
          <div
            className="summary-card highlight"
            style={{
              borderColor: eColor,
              boxShadow: `inset 0 0 20px ${eColor}15`,
            }}
          >
            <span className="card-lbl">ECD</span>
            <span
              className="card-val-accent text-glow"
              style={{ color: eColor }}
            >
              {(h.ecd ?? 0).toFixed(2)}
              <small className="card-unit"> ppg</small>
            </span>
            <span className="card-sub-hint">
              {p ? `Fractura: ${p.maxMudWeight.toFixed(2)} ppg` : "—"}
            </span>
          </div>

          {/* BHP */}
          <div className="summary-card">
            <span className="card-lbl">PRESIÓN FONDO</span>
            <span className="card-val-accent">
              {Math.round(h.bottomHolePressure ?? 0).toLocaleString()}
              <small className="card-unit"> psi</small>
            </span>
            <span className="card-sub-hint">Bottom Hole</span>
          </div>

          {/* HHP */}
          <div className="summary-card">
            <span className="card-lbl">HHP/IN²</span>
            <span
              className="card-val-accent"
              style={{
                color: (h.hhpPerSqIn ?? 0) >= 2 ? "#059669" : "#dc2626",
              }}
            >
              {(h.hhpPerSqIn ?? 0).toFixed(2)}
              <small className="card-unit" style={{ color: "inherit" }}>
                {" "}
                hp/in²
              </small>
            </span>
            <span className="card-sub-hint">Obj: 2.0–7.0</span>
          </div>

          {/* Reynolds Annular */}
          <div className="summary-card">
            <span className="card-lbl">REYNOLDS ÁNULO</span>
            <span className="card-val-accent">
              {Math.round(h.reynoldsAnnular ?? 0).toLocaleString()}
              <small className="card-unit"> Re</small>
            </span>
            <span className="card-sub-hint">Flujo Ánulo</span>
          </div>

          {/* Impact Force */}
          <div className="summary-card">
            <span className="card-lbl">FUERZA IMPACTO</span>
            <span className="card-val-accent">
              {(h.impactForce ?? 0).toFixed(0)}
              <small className="card-unit"> lbf</small>
            </span>
            <span className="card-sub-hint">Bit Impact</span>
          </div>
        </div>
      </div>
    </Section>
  );
}
