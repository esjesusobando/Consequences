import { useState, useEffect } from "react";
import { useDrillingStore } from "../../store/drilling-store";
import { Section } from "../ui/Section";
import { Activity } from "lucide-react";
import "./RheologyChart.css";

export function RheologyChart() {
  const { mudData, results } = useDrillingStore();
  const rheology = results?.rheology || {
    pv: 0,
    yp: 0,
    n_pl: 1,
    k_pl: 0,
    n_hb: 1,
    k_hb: 0,
    tau0_hb: 0,
  };

  // Dial readings mapping
  const readings = [
    { rpm: 600, theta: mudData.theta600 || 0 },
    { rpm: 300, theta: mudData.theta300 || 0 },
    { rpm: 200, theta: mudData.theta200 || 0 },
    { rpm: 100, theta: mudData.theta100 || 0 },
    { rpm: 6, theta: mudData.theta6 || 0 },
    { rpm: 3, theta: mudData.theta3 || 0 },
  ];

  const activeModel = mudData.rheologyModel;

  const [visibleModels, setVisibleModels] = useState({
    BINGHAM: true,
    POWER_LAW: true,
    HERSCHEL_BULKLEY: true,
  });

  // Auto-Sync: Ensure active model is always visible when changed from sidebar
  useEffect(() => {
    if (
      activeModel &&
      !visibleModels[activeModel as keyof typeof visibleModels]
    ) {
      setVisibleModels((prev) => ({ ...prev, [activeModel]: true }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeModel]); // Only trigger on model change

  const toggleModel = (model: string) => {
    setVisibleModels((prev) => ({
      ...prev,
      [model]: !prev[model as keyof typeof prev],
    }));
  };

  // ─── Dynamic Scaling Engine ──────────────────────────────
  const calculateThetaAtRPM = (rpm: number, model: string) => {
    if (model === "BINGHAM") {
      return (rheology.yp || 0) + (rheology.pv || 0) * (rpm / 300);
    }
    const gamma = 1.703 * rpm;
    if (model === "POWER_LAW") {
      return (rheology.k_pl || 0) * Math.pow(gamma, rheology.n_pl || 0);
    }
    if (model === "HERSCHEL_BULKLEY") {
      return (
        (rheology.tau0_hb || 0) +
        (rheology.k_hb || 0) * Math.pow(gamma, rheology.n_hb || 0)
      );
    }
    return 0;
  };

  // Find the absolute maximum to prevent clipping
  const maxReadings = Math.max(...readings.map((r) => r.theta), 0.1);
  let maxTheoretical = maxReadings;

  Object.keys(visibleModels).forEach((model) => {
    if (visibleModels[model as keyof typeof visibleModels]) {
      const theta600 = calculateThetaAtRPM(600, model);
      if (theta600 > maxTheoretical) maxTheoretical = theta600;
    }
  });

  const maxTheta = Math.max(maxTheoretical, maxReadings) * 1.15; // 15% breathing room
  const chartHeight = 220;
  const chartWidth = 420;

  // ─── Scale Functions ──────────────────────────────────────
  const getX = (rpm: number) => {
    const k = 0.4;
    const normalized = Math.pow(rpm / 600, k);
    return 65 + normalized * (chartWidth - 105);
  };

  const getY = (theta: number) => {
    return chartHeight - 50 - (theta / maxTheta) * (chartHeight - 120);
  };

  // ─── Theoretical Curves ──────────────────────────────────
  const generateModelPoints = (model: string) => {
    const points: { x: number; y: number }[] = [];
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const rpm = (i / steps) * 600;
      const thetaVal = Math.max(calculateThetaAtRPM(rpm, model), 0);
      points.push({ x: getX(rpm), y: getY(thetaVal) });
    }
    return points.map((p) => `${p.x},${p.y}`).join(" ");
  };

  const binghamPath = generateModelPoints("BINGHAM");
  const powerLawPath = generateModelPoints("POWER_LAW");
  const hbPath = generateModelPoints("HERSCHEL_BULKLEY");

  return (
    <Section
      id="rheology"
      title="Análisis Reológico"
      icon={<Activity size={18} />}
    >
      <div className="rheology-chart-content">
        <div className="rheology-header">
          <div className="header-main" style={{ width: "100%" }}>
            <div className="model-badges-pro">
              <button
                className={`badge-pro bingham ${visibleModels.BINGHAM ? "active" : ""} ${activeModel === "BINGHAM" ? "selected" : ""}`}
                onClick={() => toggleModel("BINGHAM")}
              >
                <span /> Bingham
              </button>
              <button
                className={`badge-pro powerlaw ${visibleModels.POWER_LAW ? "active" : ""} ${activeModel === "POWER_LAW" ? "selected" : ""}`}
                onClick={() => toggleModel("POWER_LAW")}
              >
                <span /> Power Law
              </button>
              <button
                className={`badge-pro hb ${visibleModels.HERSCHEL_BULKLEY ? "active" : ""} ${activeModel === "HERSCHEL_BULKLEY" ? "selected" : ""}`}
                onClick={() => toggleModel("HERSCHEL_BULKLEY")}
              >
                <span /> HB
              </button>
            </div>
          </div>
        </div>

        <div className="rheology-content">
          <div className="chart-wrapper-pro">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="rheo-svg-pro"
              style={{ overflow: "visible" }}
            >
              <defs>
                <linearGradient
                  id="gradBINGHAM"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#00b4d8" />
                  <stop offset="100%" stopColor="#0077b6" />
                </linearGradient>
                <linearGradient
                  id="gradPOWER_LAW"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#ffcc00" />
                  <stop offset="100%" stopColor="#ff9900" />
                </linearGradient>
                <linearGradient
                  id="gradHERSCHEL_BULKLEY"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#cbff6a" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <filter id="glow-neon">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                <line
                  key={i}
                  x1="60"
                  y1={chartHeight - 50 - p * (chartHeight - 120)}
                  x2={chartWidth - 25}
                  y2={chartHeight - 50 - p * (chartHeight - 120)}
                  stroke="rgba(0, 0, 0, 0.05)"
                  strokeWidth="0.5"
                />
              ))}

              {/* Comparison Curves (Inactive) */}
              {visibleModels.BINGHAM && activeModel !== "BINGHAM" && (
                <polyline
                  fill="none"
                  stroke="#0056b3"
                  strokeWidth="1.5"
                  strokeDasharray="4,3"
                  opacity="0.3"
                  points={binghamPath}
                />
              )}
              {visibleModels.POWER_LAW && activeModel !== "POWER_LAW" && (
                <polyline
                  fill="none"
                  stroke="#b35900"
                  strokeWidth="1.5"
                  strokeDasharray="4,3"
                  opacity="0.3"
                  points={powerLawPath}
                />
              )}
              {visibleModels.HERSCHEL_BULKLEY &&
                activeModel !== "HERSCHEL_BULKLEY" && (
                  <polyline
                    fill="none"
                    stroke="#28a745"
                    strokeWidth="1.5"
                    strokeDasharray="4,3"
                    opacity="0.3"
                    points={hbPath}
                  />
                )}

              {/* Active Model Filled Area */}
              {visibleModels[activeModel as keyof typeof visibleModels] && (
                <polygon
                  fill={`url(#grad${activeModel})`}
                  opacity="0.15"
                  points={`${activeModel === "BINGHAM" ? binghamPath : activeModel === "POWER_LAW" ? powerLawPath : hbPath} ${getX(600)},${getY(0)} ${getX(0)},${getY(0)}`}
                />
              )}

              {/* Active Model Curve (Neon/High Contrast) */}
              {visibleModels[activeModel as keyof typeof visibleModels] && (
                <polyline
                  fill="none"
                  stroke={`url(#grad${activeModel})`}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={
                    activeModel === "BINGHAM"
                      ? binghamPath
                      : activeModel === "POWER_LAW"
                        ? powerLawPath
                        : hbPath
                  }
                  filter="url(#glow-neon)"
                />
              )}

              {/* Real Data Points */}
              <polyline
                fill="none"
                stroke="rgba(0,0,0,0.2)"
                strokeWidth="2"
                points={readings
                  .map((r) => `${getX(r.rpm)},${getY(r.theta)}`)
                  .join(" ")}
              />

              {readings.map((r, i) => (
                <g key={i}>
                  <circle
                    cx={getX(r.rpm)}
                    cy={getY(r.theta)}
                    r="4.5"
                    fill="var(--sh-blue-600, #0284c7)"
                    filter="drop-shadow(0 0 3px rgba(0, 180, 216, 0.4))"
                  />
                  <circle
                    cx={getX(r.rpm)}
                    cy={getY(r.theta)}
                    r="2"
                    fill="white"
                  />
                </g>
              ))}

              {/* Labels Axes */}
              <text
                x="35"
                y={getY(0)}
                textAnchor="end"
                fontSize="9"
                fontWeight="700"
                fill="#999"
              >
                0
              </text>
              <text
                x="35"
                y={getY(maxTheta / 1.15)}
                textAnchor="end"
                fontSize="9"
                fontWeight="700"
                fill="#999"
              >
                {Math.round(maxTheta / 1.15)}
              </text>

              {[3, 6, 100, 200, 300, 600].map((rpm) => (
                <text
                  key={rpm}
                  x={getX(rpm)}
                  y={chartHeight - 15}
                  textAnchor="middle"
                  fontSize="8"
                  fontWeight="800"
                  fill="#aaa"
                >
                  {rpm}
                </text>
              ))}
            </svg>
          </div>

          <div className="rheo-metrics-panel">
            <div className="metrics-dashboard">
              <div className="m-card">
                <span className="m-val">{(rheology.pv || 0).toFixed(1)}</span>
                <span className="m-tag">PV</span>
              </div>
              <div className="m-card">
                <span className="m-val">{(rheology.yp || 0).toFixed(1)}</span>
                <span className="m-tag">YP</span>
              </div>
              <div className="m-card">
                <span className="m-val">
                  {(activeModel === "POWER_LAW"
                    ? rheology.n_pl || 0
                    : rheology.n_hb || 0
                  ).toFixed(3)}
                </span>
                <span className="m-tag">n</span>
              </div>
              <div className="m-card">
                <span className="m-val">
                  {(activeModel === "POWER_LAW"
                    ? rheology.k_pl || 0
                    : rheology.k_hb || 0
                  ).toFixed(3)}
                </span>
                <span className="m-tag">K</span>
              </div>
              {(rheology.tau0_hb || 0) > 0 && (
                <div className="m-card highlight">
                  <span className="m-val">
                    {(rheology.tau0_hb || 0).toFixed(1)}
                  </span>
                  <span className="m-tag">τ₀</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
