import React from "react";
import { useDrillingStore } from "../../store/drilling-store";
import { AlertCircle, Thermometer, Gauge, Zap } from "lucide-react";

interface StuckPipeAnalysisProps {
  isDark?: boolean;
}

export const StuckPipeAnalysis: React.FC<StuckPipeAnalysisProps> = ({
  isDark = true,
}) => {
  const { results, wellData } = useDrillingStore();
  const { stuckPipe } = results;

  const [isSimulating, setIsSimulating] = React.useState(false);
  const [jarResult, setJarResult] = React.useState<"success" | "fail" | null>(
    null,
  );
  const [jarForceApplied, setJarForceApplied] = React.useState(0);
  const [requiredForce, setRequiredForce] = React.useState(0);

  const handleSimulate = () => {
    setIsSimulating(true);
    setJarResult(null);

    const baseMargin = (wellData.totalDepth || 10000) > 10000 ? 120000 : 80000;
    const diffForce = stuckPipe.differentialStickingForce || 85000;
    const reqForce = diffForce * 1.35; // 35% margin required to overcome static friction
    // Randomize impact force between 80% and 130% of base margin
    const appliedForce = baseMargin * (0.8 + Math.random() * 0.5);

    setTimeout(() => {
      const success = appliedForce >= reqForce;
      setRequiredForce(reqForce);
      setJarForceApplied(appliedForce);
      setJarResult(success ? "success" : "fail");
      setIsSimulating(false);
    }, 2500);
  };

  const getRiskProbability = (level: string) => {
    switch (level) {
      case "High":
        return 85;
      case "Med":
      case "Medium":
        return 50;
      default:
        return 15;
    }
  };

  const getRiskColor = (level: string, isDark: boolean) => {
    switch (level) {
      case "High":
        return isDark ? "#ef4444" : "#dc2626";
      case "Med":
      case "Medium":
        return isDark ? "#0ea5e9" : "#0284c7"; /* Azul Vibrante solicitado */
      default:
        return isDark ? "#22c55e" : "#16a34a"; /* Verde solicitado */
    }
  };

  const getRiskBgColor = (level: string, isDark: boolean) => {
    switch (level) {
      case "High":
        return isDark ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.05)";
      case "Med":
      case "Medium":
        return isDark ? "rgba(14, 165, 233, 0.15)" : "rgba(14, 165, 233, 0.05)";
      default:
        return isDark ? "rgba(34, 197, 94, 0.15)" : "rgba(34, 197, 94, 0.05)";
    }
  };

  // Colores dinámicos alineados a Pilar 1
  const primaryHsl = "hsl(230, 100%, 67%)"; // Premium Blue

  const glassBg = isDark
    ? "rgba(255, 255, 255, 0.03)" // Pilar 1 Surface
    : "rgba(255, 255, 255, 0.85)";
  const glassBorder = isDark
    ? "1px solid rgba(255, 255, 255, 0.1)"
    : "1px solid rgba(0, 0, 0, 0.1)";
  const titleColor = isDark ? "white" : "hsl(230, 25%, 20%)";
  const subTitleColor = isDark ? primaryHsl : "hsl(230, 100%, 60%)";
  const labelGray = isDark ? "rgba(243, 244, 246, 1)" : "hsl(230, 20%, 30%)";
  const subLabelGray = isDark ? "rgba(209, 213, 219, 1)" : "hsl(230, 15%, 45%)";
  const cardShadow = isDark
    ? "0 30px 60px -12px rgba(0, 0, 0, 0.8)"
    : "0 20px 40px -10px rgba(0, 0, 0, 0.12)";
  const innerBg = isDark
    ? "rgba(255, 255, 255, 0.02)"
    : "rgba(255, 255, 255, 0.5)";
  const innerBorder = isDark
    ? "1px solid rgba(255, 255, 255, 0.06)"
    : "1px solid rgba(0, 0, 0, 0.08)";

  // Datos integrados con la store para visualización premium
  const risks = [
    {
      name: "Pega Diferencial",
      probability:
        (stuckPipe as any).differentialProbability ||
        getRiskProbability(stuckPipe.differentialRiskLevel),
      status: stuckPipe.differentialRiskLevel,
      icon: <Thermometer size={24} />,
      color: getRiskColor(stuckPipe.differentialRiskLevel, isDark),
      bgColor: getRiskBgColor(stuckPipe.differentialRiskLevel, isDark),
    },
    {
      name: "Llave de Perfil (Key Seating)",
      probability:
        (stuckPipe as any).keySeatingProbability ||
        getRiskProbability(stuckPipe.keySeatingRisk),
      status: stuckPipe.keySeatingRisk,
      icon: <Zap size={24} />,
      color: getRiskColor(stuckPipe.keySeatingRisk, isDark),
      bgColor: getRiskBgColor(stuckPipe.keySeatingRisk, isDark),
    },
    {
      name: "Limpieza de Pozo",
      probability:
        (stuckPipe as any).holeCleaningProbability ||
        getRiskProbability(stuckPipe.holeCleaningRisk),
      status: stuckPipe.holeCleaningRisk,
      icon: <Gauge size={24} />,
      color: getRiskColor(stuckPipe.holeCleaningRisk, isDark),
      bgColor: getRiskBgColor(stuckPipe.holeCleaningRisk, isDark),
    },
  ];

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "40px", // Aumentado para evitar solapamiento
    padding: "20px", // Breathing room
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
  };

  const cardStyle: React.CSSProperties = {
    padding: "24px",
    borderRadius: "16px", // Premium radius from Pilar 1
    position: "relative",
    overflow: "hidden",
    border: glassBorder,
    backgroundColor: glassBg,
    backdropFilter: "blur(12px)", // Premium glassmorphism blur from Pilar 1
    WebkitBackdropFilter: "blur(12px)",
    boxShadow: cardShadow,
  };

  return (
    <div style={containerStyle}>
      {/* Risk Probability Header */}
      <div style={gridStyle}>
        {risks.map((risk, idx) => (
          <div key={idx} className="glass-panel" style={cardStyle}>
            <div
              style={{
                marginBottom: "20px",
                padding: "12px",
                borderRadius: "14px",
                backgroundColor: isDark
                  ? "rgba(0, 0, 0, 0.5)"
                  : "rgba(255, 255, 255, 1)",
                border: `1px solid ${risk.color.replace("1)", "0.3)")}`,
                width: "fit-content",
                color: risk.color,
                boxShadow: isDark
                  ? "0 4px 10px rgba(0,0,0,0.5)"
                  : "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              {risk.icon}
            </div>
            <h4
              style={{
                fontSize: "13px",
                fontWeight: 900,
                color: labelGray,
                textTransform: "uppercase",
                letterSpacing: "var(--sh-letter-spacing-alert)",
                marginBottom: "12px",
                textShadow: isDark ? "0 2px 4px rgba(0,0,0,0.5)" : "none",
              }}
            >
              {risk.name}
            </h4>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "12px",
              }}
            >
              <span
                style={{
                  fontSize: "42px",
                  fontWeight: 900,
                  fontFamily: "monospace",
                  color: risk.color,
                  lineHeight: 1,
                  textShadow: isDark
                    ? `0 0 20px ${risk.color.replace("1)", "0.3)")}`
                    : "none",
                }}
              >
                {risk.probability}%
              </span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 900,
                  color: isDark ? "white" : risk.color,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  backgroundColor: risk.bgColor,
                  padding: "4px 10px",
                  borderRadius: "8px",
                  border: `1px solid ${risk.color.replace("1)", "0.4)")}`,
                }}
              >
                Riesgo{" "}
                {risk.status === "High"
                  ? "Alto"
                  : risk.status === "Medium"
                    ? "Medio"
                    : "Bajo"}
              </span>
            </div>
            {/* Heat Bar Mini */}
            <div
              style={{
                height: "8px",
                width: "100%",
                backgroundColor: isDark
                  ? "rgba(0, 0, 0, 0.6)"
                  : "rgba(0, 0, 0, 0.05)",
                borderRadius: "999px",
                marginTop: "24px",
                overflow: "hidden",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${risk.probability}%`,
                  backgroundColor: risk.color,
                  transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: `0 0 15px ${risk.color.replace("1)", "0.6)")}`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Main Analysis Panel */}
      <div
        className="glass-panel"
        style={{
          ...cardStyle,
          padding: "48px",
          boxShadow: isDark
            ? "0 50px 100px -20px rgba(0, 0, 0, 0.9)"
            : "0 30px 60px -15px rgba(0, 0, 0, 0.1)",
          border: glassBorder,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-128px",
            right: "-128px",
            width: "350px",
            height: "350px",
            backgroundColor: isDark
              ? "hsla(230, 100%, 67%, 0.15)"
              : "hsla(230, 100%, 67%, 0.1)",
            borderRadius: "50%",
            filter: "blur(100px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 10 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              marginBottom: "48px",
            }}
          >
            <div
              style={{
                backgroundColor: isDark
                  ? "rgba(0, 0, 0, 0.7)"
                  : "rgba(255, 255, 255, 1)",
                padding: "18px",
                borderRadius: "20px",
                border: isDark
                  ? "2px solid rgba(239, 68, 68, 0.5)"
                  : "2px solid rgba(239, 68, 68, 0.3)",
                boxShadow: isDark
                  ? "0 10px 30px rgba(239, 68, 68, 0.2)"
                  : "0 8px 20px rgba(239, 68, 68, 0.08)",
              }}
            >
              <AlertCircle
                size={36}
                style={{
                  color: isDark
                    ? "rgba(248, 113, 113, 1)"
                    : "rgba(239, 68, 68, 1)",
                }}
              />
            </div>
            <div>
              <h3
                style={{
                  fontSize: "32px",
                  fontWeight: 900,
                  color: titleColor,
                  fontStyle: "italic",
                  letterSpacing: "-0.04em",
                  margin: 0,
                  textShadow: isDark ? "0 4px 10px rgba(0,0,0,0.5)" : "none",
                }}
              >
                DIAGNÓSTICO DE PEGA DE TUBERÍA
              </h3>
              <p
                style={{
                  fontSize: "13px",
                  color: subTitleColor,
                  textTransform: "uppercase",
                  letterSpacing: "0.5em",
                  fontWeight: 900,
                  margin: "6px 0 0 0",
                }}
              >
                Análisis Mecánico Predictivo
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
              gap: "48px",
            }}
          >
            {/* Indicators Column */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              <h5
                style={{
                  fontSize: "15px",
                  fontWeight: 900,
                  color: subLabelGray,
                  textTransform: "uppercase",
                  letterSpacing: "0.25em",
                  marginBottom: "8px",
                }}
              >
                Indicadores Críticos
              </h5>
              {[
                {
                  label: "Fuerza de Pega Dif.",
                  value: stuckPipe.differentialStickingForce.toLocaleString(
                    undefined,
                    { maximumFractionDigits: 0 },
                  ),
                  unit: "lbs",
                  risk:
                    stuckPipe.differentialRiskLevel === "High"
                      ? "Alto"
                      : stuckPipe.differentialRiskLevel === "Medium"
                        ? "Medio"
                        : "Bajo",
                  color: getRiskColor(stuckPipe.differentialRiskLevel, isDark),
                },
                {
                  label: "Prof. Punto Libre",
                  value: stuckPipe.freePointDepth.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  }),
                  unit: "ft",
                  risk: "Info",
                  color: isDark
                    ? "rgba(96, 165, 250, 1)"
                    : "rgba(59, 130, 246, 1)",
                },
                {
                  label: "Tubería Libre",
                  value: stuckPipe.feetOfFreePipe
                    ? stuckPipe.feetOfFreePipe.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })
                    : "N/A",
                  unit: "ft",
                  risk: "Seguro",
                  color: "rgba(52, 211, 153, 1)",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "24px",
                    backgroundColor: innerBg,
                    borderRadius: "22px",
                    border: innerBorder,
                    transition: "all 0.3s ease",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "12px",
                        color: subLabelGray,
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        margin: 0,
                      }}
                    >
                      {item.label}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "8px",
                        marginTop: "6px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "28px",
                          fontWeight: 900,
                          fontFamily: "monospace",
                          color: titleColor,
                        }}
                      >
                        {item.value}
                      </span>
                      <span
                        style={{
                          fontSize: "14px",
                          color: subLabelGray,
                          fontWeight: "bold",
                        }}
                      >
                        {item.unit}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "8px 20px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      backgroundColor: item.color,
                      color: "white",
                      boxShadow: `0 5px 15px ${item.color.replace("1)", "0.3)")}`,
                    }}
                  >
                    {item.risk}
                  </div>
                </div>
              ))}
            </div>

            {/* Differential Sticking Focus */}
            <div
              style={{
                backgroundColor: innerBg,
                padding: "40px",
                borderRadius: "32px",
                border: isDark
                  ? "2px dashed rgba(255, 255, 255, 0.2)"
                  : "2px dashed rgba(0, 0, 0, 0.15)",
                display: "flex",
                flexDirection: "column",
                gap: "32px",
                boxShadow: isDark ? "inset 0 0 30px rgba(0,0,0,0.4)" : "none",
              }}
            >
              {jarResult && (
                <div
                  style={{
                    backgroundColor:
                      jarResult === "success"
                        ? isDark
                          ? "rgba(16, 185, 129, 0.1)"
                          : "rgba(16, 185, 129, 0.05)"
                        : isDark
                          ? "rgba(239, 68, 68, 0.1)"
                          : "rgba(239, 68, 68, 0.05)",
                    border:
                      jarResult === "success"
                        ? "1px solid rgba(16, 185, 129, 0.5)"
                        : "1px solid rgba(239, 68, 68, 0.5)",
                    borderRadius: "16px",
                    padding: "24px",
                    textAlign: "center",
                    boxShadow:
                      jarResult === "success"
                        ? "0 0 30px rgba(16, 185, 129, 0.15)"
                        : "0 0 30px rgba(239, 68, 68, 0.15)",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "18px",
                      fontWeight: 900,
                      color:
                        jarResult === "success"
                          ? "rgba(52, 211, 153, 1)"
                          : "rgba(248, 113, 113, 1)",
                      margin: "0 0 16px 0",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {jarResult === "success"
                      ? "✅ Tubería Liberada con Éxito"
                      : "⚠️ La Tubería Sigue Pegada"}
                  </h4>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "32px",
                      marginBottom: "20px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: subLabelGray,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                        }}
                      >
                        Tensión Requerida
                      </div>
                      <div
                        style={{
                          fontSize: "20px",
                          fontWeight: 900,
                          color: titleColor,
                          fontFamily: "monospace",
                        }}
                      >
                        {requiredForce.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}{" "}
                        <span style={{ fontSize: "12px", color: subLabelGray }}>
                          lbs
                        </span>
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: subLabelGray,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                        }}
                      >
                        Impacto Aplicado
                      </div>
                      <div
                        style={{
                          fontSize: "20px",
                          fontWeight: 900,
                          color:
                            jarResult === "success"
                              ? "rgba(52, 211, 153, 1)"
                              : "rgba(248, 113, 113, 1)",
                          fontFamily: "monospace",
                        }}
                      >
                        {jarForceApplied.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}{" "}
                        <span style={{ fontSize: "12px", color: subLabelGray }}>
                          lbs
                        </span>
                      </div>
                    </div>
                  </div>

                  <p
                    style={{
                      margin: 0,
                      color: subLabelGray,
                      fontSize: "13px",
                      lineHeight: 1.6,
                    }}
                  >
                    {jarResult === "success"
                      ? "La fuerza de impacto superó con éxito la fricción diferencial estática. Es seguro reanudar la sacada (POOH)."
                      : "Percusión fallida. La fuerza aplicada fue insuficiente para romper el sello diferencial. Considere bombear un bache de aceite/ácido."}
                  </p>
                </div>
              )}

              <h5
                style={{
                  fontSize: "15px",
                  fontWeight: 900,
                  color: isDark
                    ? "rgba(248, 113, 113, 1)"
                    : "rgba(239, 68, 68, 1)",
                  textTransform: "uppercase",
                  letterSpacing: "0.25em",
                }}
              >
                Foco en Pega Diferencial
              </h5>

              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "13px",
                    color: titleColor,
                    marginBottom: "16px",
                    fontWeight: 900,
                    textTransform: "uppercase",
                  }}
                >
                  <span style={{ letterSpacing: "0.1em" }}>
                    Indicador de Punto Libre
                  </span>
                  <span
                    style={{
                      color: getRiskColor(
                        stuckPipe.differentialRiskLevel,
                        isDark,
                      ),
                      fontWeight: 900,
                      backgroundColor: getRiskBgColor(
                        stuckPipe.differentialRiskLevel,
                        isDark,
                      ),
                      padding: "2px 8px",
                      borderRadius: "6px",
                    }}
                  >
                    {(
                      (stuckPipe.freePointDepth / (wellData.totalDepth || 1)) *
                      100
                    ).toFixed(1)}
                    % del Pozo
                  </span>
                </div>
                <div
                  style={{
                    height: "16px",
                    width: "100%",
                    backgroundColor: isDark
                      ? "rgba(0, 0, 0, 0.5)"
                      : "rgba(0, 0, 0, 0.05)",
                    borderRadius: "999px",
                    overflow: "hidden",
                    border: isDark
                      ? "1px solid rgba(255, 255, 255, 0.1)"
                      : "1px solid rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.min(100, (stuckPipe.freePointDepth / (wellData.totalDepth || 1)) * 100)}%`,
                      backgroundColor: isDark
                        ? "rgba(167, 139, 250, 1)"
                        : "rgba(139, 92, 246, 1)",
                      borderRadius: "999px",
                      boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  paddingTop: "24px",
                  borderTop: isDark
                    ? "1px solid rgba(255, 255, 255, 0.15)"
                    : "1px solid rgba(0, 0, 0, 0.1)",
                }}
              >
                <p
                  style={{
                    fontSize: "15px",
                    color: titleColor,
                    fontStyle: "italic",
                    lineHeight: 1.8,
                    margin: 0,
                  }}
                >
                  Punto libre estimado a{" "}
                  <span
                    style={{
                      color: isDark
                        ? "rgba(167, 139, 250, 1)"
                        : "rgba(139, 92, 246, 1)",
                      fontWeight: 900,
                      backgroundColor: isDark
                        ? "rgba(0,0,0,0.3)"
                        : "rgba(0,0,0,0.05)",
                      padding: "2px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    {stuckPipe.freePointDepth.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}{" "}
                    ft
                  </span>
                  . Asegúrese de considerar las tablas de estiramiento y
                  constantes del material (ej.,{" "}
                  <span
                    style={{
                      color: isDark
                        ? "rgba(251, 191, 36, 1)"
                        : "rgba(217, 119, 6, 1)",
                      fontWeight: 900,
                    }}
                  >
                    {stuckPipe.freePointConstant.toFixed(5)}
                  </span>
                  ). Las operaciones de percusión deben realizarse por encima
                  del punto neutral.
                </p>
              </div>

              <button
                onClick={handleSimulate}
                disabled={isSimulating}
                style={{
                  width: "100%",
                  padding: "20px 0",
                  position: "relative",
                  overflow: "hidden",
                  backgroundColor: isDark
                    ? isSimulating
                      ? "hsla(230, 100%, 67%, 0.1)"
                      : "hsla(230, 100%, 67%, 0.15)"
                    : isSimulating
                      ? "hsla(230, 100%, 67%, 0.05)"
                      : "hsla(230, 100%, 67%, 0.1)",
                  border: isDark
                    ? isSimulating
                      ? "1px solid hsla(230, 100%, 67%, 0.5)"
                      : "1px solid hsla(230, 100%, 67%, 0.4)"
                    : isSimulating
                      ? "1px solid hsla(230, 100%, 67%, 0.3)"
                      : "1px solid hsla(230, 100%, 67%, 0.4)",
                  borderRadius: "16px",
                  fontSize: "14px",
                  fontWeight: 900,
                  color: isDark
                    ? isSimulating
                      ? "rgba(255, 255, 255, 0.7)"
                      : "hsl(230, 100%, 85%)"
                    : isSimulating
                      ? "hsl(230, 100%, 40%)"
                      : "hsl(230, 100%, 45%)",
                  textTransform: "uppercase",
                  letterSpacing: "0.25em",
                  cursor: isSimulating ? "wait" : "pointer",
                  transition: "all 0.3s cubic-bezier(0.19, 1, 0.22, 1)",
                  boxShadow: isDark
                    ? isSimulating
                      ? "0 10px 20px hsla(230, 100%, 67%, 0.1)"
                      : "0 15px 30px hsla(230, 100%, 67%, 0.15)"
                    : "0 8px 20px rgba(0,0,0,0.05)",
                  textShadow: isDark ? "0 2px 4px rgba(0,0,0,0.3)" : "none",
                }}
                onMouseOver={(e) => {
                  if (isSimulating) return;
                  e.currentTarget.style.backgroundColor = isDark
                    ? "hsla(230, 100%, 67%, 0.25)"
                    : "hsla(230, 100%, 67%, 0.15)";
                  e.currentTarget.style.borderColor = isDark
                    ? "hsla(230, 100%, 67%, 0.6)"
                    : "hsla(230, 100%, 67%, 0.6)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = isDark
                    ? "0 20px 40px hsla(230, 100%, 67%, 0.2)"
                    : "0 12px 25px hsla(230, 100%, 67%, 0.15)";
                }}
                onMouseOut={(e) => {
                  if (isSimulating) return;
                  e.currentTarget.style.backgroundColor = isDark
                    ? "hsla(230, 100%, 67%, 0.15)"
                    : "hsla(230, 100%, 67%, 0.1)";
                  e.currentTarget.style.borderColor = isDark
                    ? "hsla(230, 100%, 67%, 0.4)"
                    : "hsla(230, 100%, 67%, 0.4)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = isDark
                    ? "0 15px 30px hsla(230, 100%, 67%, 0.15)"
                    : "0 8px 20px rgba(0,0,0,0.05)";
                }}
              >
                Simulate Jarring Action ⚒️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
