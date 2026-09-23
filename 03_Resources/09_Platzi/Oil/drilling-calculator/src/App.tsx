import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { SidebarNav } from "./components/ui/SidebarNav";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { WellGeometry } from "./components/sections/WellGeometry";
import { Formation } from "./components/sections/Formation";
import { MudProperties } from "./components/sections/MudProperties";
import { PumpConfig } from "./components/sections/PumpConfig";
import { BitConfig } from "./components/sections/BitConfig";
import { JetroChat } from "./components/sections/JetroChat";
import { PressureResults } from "./components/results/PressureResults";
import { HydraulicsResults } from "./components/results/HydraulicsResults";
import { VolumetricsResults } from "./components/results/VolumetricsResults";
import { CirculationResults } from "./components/results/CirculationResults";
import { WellboreSchematic } from "./components/visuals/WellboreSchematic";
import { StuckPipeAnalysis } from "./components/visuals/StuckPipeAnalysis";
import { MechanicsHeatmap } from "./components/visuals/MechanicsHeatmap";
import { TrippingChart } from "./components/visuals/TrippingChart";
import { PressureWindow } from "./components/visuals/PressureWindow";
import { RheologyChart } from "./components/visuals/RheologyChart";
import { HydraulicsChart } from "./components/visuals/HydraulicsChart";
import { BitOptimizer } from "./components/visuals/BitOptimizer";
import { AlertBanner } from "./components/ui/AlertBanner";
import { ZenOverlay } from "./components/ui/ZenOverlay";
import { Simulator } from "./components/sections/Simulator";
import { Directional } from "./components/sections/Directional";
import { TorqueDrag } from "./components/sections/TorqueDrag";
import { WellControl } from "./components/sections/WellControl";
import { AIPMMenu } from "./components/ui/AIPMMenu";
import { TechnicalInsights } from "./components/visuals/TechnicalInsights";

import { useDrillingStore } from "./store/drilling-store";
import "./App.css";

function App() {
  console.log("📦 [DEBUG] App Component Rendering...");

  const store = useDrillingStore();

  // ── Modos visuales ──
  const [isDarkResults, setIsDarkResults] = useState(false); // Light Mode por defecto

  console.log("🏪 [DEBUG] Store state:", {
    activeView: store.activeView,
    resultsLoaded: !!store.results,
    alerts: store.alerts.length,
  });

  const {
    wellData,
    formationData,
    mudData,
    alerts,
    results,
    activeFocus,
    activeView,
    setActiveView,
    showLeftPanel,
    showRightPanel,
    toggleLeftPanel,
    toggleRightPanel,
    zenMode,
    showGraphs,
  } = useDrillingStore();

  // Sincronizar tema con el DOM para CSS Tokens
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkResults ? "dark" : "light",
    );
  }, [isDarkResults]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        toggleLeftPanel();
        toggleRightPanel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleLeftPanel, toggleRightPanel]);

  // Sections: drilling | formation | fluids | bha | hydraulics

  useEffect(() => {
    // Check initial calculation state if results are 0
    if (results.rheology.pv === 0) {
      useDrillingStore.getState().calculateAll();
    }
  }, [results.rheology.pv]);

  return (
    <div
      className={`app-container ${zenMode ? "zen-active" : ""} ${activeFocus ? "focus-mode-active" : ""} ${!showLeftPanel ? "left-hidden" : ""} ${!showRightPanel ? "right-hidden" : ""} ${!showGraphs ? "graphs-hidden" : ""}`}
    >
      <SidebarNav activeView={activeView} onViewChange={setActiveView} />
      <AIPMMenu />

      <main className="main-content-layout">
        {zenMode && <ZenOverlay />}

        <div className="workspace-wrapper">
          <div className="main-scroll-area">
            <div className="work-flow">
              {/* ── Single-section view: solo muestra la sección activa ── */}

              {activeView === "drilling" && (
                <ErrorBoundary>
                  <div className="work-block section-panel">
                    <div className="input-side">
                      <WellGeometry />
                    </div>
                    <div className="visual-side">
                      <WellboreSchematic isDark={isDarkResults} />
                    </div>
                  </div>
                </ErrorBoundary>
              )}

              {activeView === "formation" && (
                <ErrorBoundary>
                  <div className="work-block section-panel">
                    <div className="input-side">
                      <Formation />
                    </div>
                    <div
                      className="visual-side"
                      style={{ position: "relative" }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          zIndex: 10,
                        }}
                      >
                        <button
                          onClick={() => setIsDarkResults(!isDarkResults)}
                          title="Cambiar tema visual"
                          style={{
                            background: isDarkResults
                              ? "rgba(255,255,255,0.05)"
                              : "rgba(0,0,0,0.04)",
                            border: `1px solid ${isDarkResults ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                            borderRadius: "50%",
                            width: "28px",
                            height: "28px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backdropFilter: "blur(4px)",
                            transition: "all 0.2s ease",
                          }}
                        >
                          {isDarkResults ? (
                            <Sun size={14} color="#facc15" />
                          ) : (
                            <Moon size={14} color="#6366f1" />
                          )}
                        </button>
                      </div>
                      <PressureWindow
                        tvd={wellData.tvd}
                        porePressure={results?.pressures?.porePressure ?? 0}
                        fracturePressure={
                          results?.pressures?.fracturePressure ?? 0
                        }
                        mudWeight={mudData.mudWeight}
                        ecd={results?.hydraulics?.ecd ?? 0}
                        isDark={isDarkResults}
                      />
                    </div>
                  </div>
                </ErrorBoundary>
              )}

              {activeView === "fluids" && (
                <ErrorBoundary>
                  <div className="work-block section-panel">
                    <div className="input-side">
                      <MudProperties />
                    </div>
                    <div className="visual-side">
                      <RheologyChart />
                    </div>
                  </div>
                </ErrorBoundary>
              )}

              {activeView === "bha" && (
                <ErrorBoundary>
                  <div className="work-block section-panel">
                    <div className="input-side">
                      <BitConfig />
                    </div>
                    <div className="visual-side">
                      <BitOptimizer />
                    </div>
                  </div>
                </ErrorBoundary>
              )}

              {activeView === "hydraulics" && (
                <ErrorBoundary>
                  <div className="work-block section-panel">
                    <div className="input-side">
                      <PumpConfig />
                      <Simulator />
                    </div>
                    <div className="visual-side">
                      <HydraulicsChart />
                    </div>
                  </div>
                </ErrorBoundary>
              )}

              {activeView === "directional" && (
                <ErrorBoundary>
                  <div className="full-view-panel">
                    <Directional />
                  </div>
                </ErrorBoundary>
              )}

              {activeView === "torquedrag" && (
                <ErrorBoundary>
                  <div className="full-view-panel">
                    <TorqueDrag />
                  </div>
                </ErrorBoundary>
              )}

              {activeView === "wellcontrol" && (
                <ErrorBoundary>
                  <div className="full-view-panel">
                    <WellControl />
                  </div>
                </ErrorBoundary>
              )}

              {activeView === "simulation" && (
                <ErrorBoundary>
                  <div className="full-view-panel">
                    <Simulator />
                  </div>
                </ErrorBoundary>
              )}

              {activeView === "surgeswab" && (
                <ErrorBoundary>
                  <div className="work-block section-panel">
                    <div className="input-side">
                      <div
                        className="p-6 rounded-2xl border"
                        style={{
                          background: isDarkResults
                            ? "var(--glass-bg, rgba(20, 25, 40, 0.4))"
                            : "rgba(255, 255, 255, 0.6)",
                          backdropFilter: "blur(12px)",
                          borderColor: isDarkResults
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.1)",
                          boxShadow: isDarkResults
                            ? "0 8px 32px rgba(0, 0, 0, 0.4)"
                            : "0 8px 32px rgba(0, 0, 0, 0.05)",
                        }}
                      >
                        <h3
                          className="text-xs font-black mb-4 tracking-[0.2em] flex items-center gap-2"
                          style={{
                            color: isDarkResults ? "var(--primary)" : "#0071e3",
                          }}
                        >
                          <span
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              background: "currentColor",
                              boxShadow: "0 0 10px currentColor",
                            }}
                          ></span>
                          MÉTRICAS DE INGENIERÍA
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                          {[
                            {
                              label: "Mud Weight",
                              value: mudData.mudWeight.toFixed(2),
                              unit: "ppg",
                              icon: "💧",
                            },
                            {
                              label: "ECD de Surge",
                              value: results.surgeSwab.ecdSurge.toFixed(2),
                              unit: "ppg",
                              icon: "↑",
                            },
                            {
                              label: "Presión de Surge",
                              value: results.surgeSwab.surgePressure.toFixed(2),
                              unit: "psi",
                              icon: "⚡",
                            },
                            {
                              label: "ECD de Swab",
                              value: results.surgeSwab.ecdSwab.toFixed(2),
                              unit: "ppg",
                              icon: "↓",
                            },
                            {
                              label: "Presión de Swab",
                              value: results.surgeSwab.swabPressure.toFixed(2),
                              unit: "psi",
                              icon: "🌊",
                            },
                            {
                              label: "Régimen de Flujo",
                              value: results.surgeSwab.flowRegimeSurge,
                              isRegime: true,
                            },
                            {
                              label: "Velocidad Anular",
                              value:
                                results.surgeSwab.effectiveAnnularVelocity.toFixed(
                                  0,
                                ),
                              unit: "ft/min",
                              icon: "≋",
                            },
                          ].map((metric, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                background: isDarkResults
                                  ? "rgba(10,10,15,0.6)"
                                  : "rgba(255,255,255,0.8)",
                                padding: "12px 16px",
                                borderRadius: "14px",
                                border: `1px solid ${isDarkResults ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"}`,
                                boxShadow: isDarkResults
                                  ? "0 4px 20px rgba(0,0,0,0.2)"
                                  : "0 2px 10px rgba(0,0,0,0.05)",
                                position: "relative",
                                overflow: "hidden",
                              }}
                            >
                              {/* Decodator line for Digital Twin feel */}
                              <div
                                style={{
                                  position: "absolute",
                                  left: 0,
                                  top: "20%",
                                  bottom: "20%",
                                  width: "3px",
                                  background: metric.isRegime
                                    ? isDarkResults
                                      ? "#00f3ff"
                                      : "#0071e3"
                                    : "var(--primary)",
                                  borderRadius: "0 4px 4px 0",
                                  opacity: 0.8,
                                }}
                              ></div>

                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "2px",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "9px",
                                    color: isDarkResults
                                      ? "rgba(255,255,255,0.5)"
                                      : "var(--sh-grey-500)",
                                    textTransform: "uppercase",
                                    fontWeight: "var(--sh-font-weight-title)",
                                    letterSpacing: "0.05em",
                                  }}
                                >
                                  {metric.label}
                                </span>
                                {metric.icon && !metric.isRegime && (
                                  <span
                                    style={{
                                      fontSize: "10px",
                                      color: "var(--primary)",
                                      opacity: 0.6,
                                    }}
                                  >
                                    {metric.icon} Sensor Tiempo Real
                                  </span>
                                )}
                              </div>

                              <div style={{ textAlign: "right" }}>
                                <span
                                  style={{
                                    fontSize: metric.isRegime ? "14px" : "18px",
                                    color: metric.isRegime
                                      ? isDarkResults
                                        ? "#00f3ff"
                                        : "#0071e3"
                                      : isDarkResults
                                        ? "#fff"
                                        : "var(--sh-grey-900)",
                                    fontWeight: "900",
                                    fontFamily: "var(--font-mono)",
                                    textTransform: metric.isRegime
                                      ? "uppercase"
                                      : "none",
                                    letterSpacing: "-0.02em",
                                  }}
                                >
                                  {metric.value}
                                </span>
                                {metric.unit && (
                                  <span
                                    style={{
                                      marginLeft: "6px",
                                      color: isDarkResults
                                        ? "rgba(255,255,255,0.4)"
                                        : "var(--sh-grey-400)",
                                      fontSize: "10px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    {metric.unit}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div
                      className="visual-side"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "24px",
                        alignItems: "stretch",
                        flex: 1,
                      }}
                    >
                      <div style={{ flex: 1.2 }}>
                        <TrippingChart isDark={isDarkResults} />
                      </div>
                      <div style={{ width: "240px" }}>
                        <MechanicsHeatmap isDark={isDarkResults} />
                      </div>
                    </div>
                  </div>
                </ErrorBoundary>
              )}

              {activeView === "stuckpipe" && (
                <ErrorBoundary>
                  <div
                    className="work-block section-panel"
                    style={{ display: "block", paddingTop: "24px" }}
                  >
                    <StuckPipeAnalysis isDark={isDarkResults} />
                  </div>
                </ErrorBoundary>
              )}
            </div>

            {/* Analytics siempre visible debajo (Ocultar controles en Geometría) */}
            {activeView !== "drilling" && (
              <div
                className="analytics-header-wrapper"
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: "12px",
                  paddingRight: "12px",
                }}
              >
                <button
                  onClick={() => setIsDarkResults(!isDarkResults)}
                  style={{
                    background: isDarkResults
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 180, 216, 0.08)",
                    border: "1px solid",
                    borderColor: isDarkResults
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 180, 216, 0.2)",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(8px)",
                    transition: "all 0.2s ease",
                  }}
                  title={
                    isDarkResults
                      ? "Cambiar a Modo Claro"
                      : "Cambiar a Modo Oscuro"
                  }
                >
                  {isDarkResults ? (
                    <Sun size={14} color="#facc15" />
                  ) : (
                    <Moon size={14} color="#6366f1" />
                  )}
                </button>
              </div>
            )}
            <div
              className={`analytics-grid ${isDarkResults ? "theme-dark" : ""}`}
            >
              <VolumetricsResults />
              <PressureResults />
              <CirculationResults />
              <HydraulicsResults />
            </div>

            {/* Dashboard Técnico Premium */}
            <TechnicalInsights />
          </div>

          <aside className="alerts-sidebar">
            <h3 className="column-title">
              Alertas Operativas ({alerts.length})
            </h3>
            <AlertBanner alerts={alerts} />

            <div className="safety-summary-card">
              <div className="safety-summary-card__header">
                <h4>Sobrebalance</h4>
                <span className="safety-summary-card__dot"></span>
              </div>
              <div className="safety-summary-card__value">
                +
                {(
                  (results?.pressures?.hydrostaticPressure ??
                    mudData.mudWeight * 0.052 * wellData.tvd) -
                  (results?.pressures?.porePressure ??
                    formationData.porePressureGradient * wellData.tvd)
                ).toFixed(0)}{" "}
                <span className="safety-summary-card__unit">psi</span>
              </div>
              <p
                className="safety-summary-card__footer"
                style={{ fontSize: "12px", fontWeight: "bold", opacity: 0.8 }}
              >
                Sobrebalance Estático @ TD
              </p>
            </div>

            <div className="safety-summary-card">
              <div className="safety-summary-card__header">
                <h4>Margen de Pérdida</h4>
                <span className="safety-summary-card__dot"></span>
              </div>
              <div className="safety-summary-card__value">
                +
                {(
                  (results?.pressures?.fracturePressure ??
                    formationData.fractureGradient * wellData.tvd) -
                  (results?.pressures?.hydrostaticPressure ??
                    mudData.mudWeight * 0.052 * wellData.tvd)
                ).toFixed(0)}{" "}
                <span className="safety-summary-card__unit">psi</span>
              </div>
              <p
                className="safety-summary-card__footer"
                style={{ fontSize: "12px", fontWeight: "bold", opacity: 0.8 }}
              >
                Margen a Fractura @ TD
              </p>
            </div>
          </aside>
        </div>
      </main>

      <JetroChat />
    </div>
  );
}

export default App;
