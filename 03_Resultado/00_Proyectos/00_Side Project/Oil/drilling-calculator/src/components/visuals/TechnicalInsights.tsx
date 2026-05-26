import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import { useDrillingStore } from "../../store/drilling-store";
import { Anchor, AlertTriangle } from "lucide-react";

export const TechnicalInsights: React.FC<{ isDark?: boolean }> = ({
  isDark = false,
}) => {
  const results = useDrillingStore((state) => state.results);
  const well = useDrillingStore((state) => state.wellData);
  const trajectory = results.directional?.trajectory || [];
  const neutralPointRaw = results.torqueDrag?.neutralPoint;

  // Theme Variables
  const bgColor = "var(--color-surface)";
  const borderColor = "var(--glass-border)";
  const titleColor = "var(--color-text-primary)";
  const textColor = "var(--color-text-secondary)";
  const gridColor = "var(--glass-border)";
  const axisColor = "var(--glass-border)";
  const axisTextColor = "var(--color-text-muted)";
  const accentColor = "var(--sh-azul)";
  const shadowValue = "var(--shadow-premium)";

  // Derive charts data
  const { chartData, maxDLS, neutralMD } = useMemo(() => {
    let mDLS = 0;
    const data = trajectory.map((p: any, i: number) => {
      let dls = 0;
      if (i > 0) {
        const p1 = trajectory[i - 1];
        const p2 = p;
        if (p2.md - p1.md > 0) {
          dls =
            (Math.sqrt(
              Math.pow(p2.inc - p1.inc, 2) +
                Math.pow(
                  Math.sin((p1.inc * Math.PI) / 180) * (p2.azi - p1.azi),
                  2,
                ),
            ) /
              (p2.md - p1.md)) *
            100;
        }
      }
      if (dls > mDLS) mDLS = dls;

      // Combinar también carga axial si existe
      const profilePoint = results.torqueDrag?.profile?.find(
        (tp: any) => Math.abs(tp.md - p.md) < 50,
      );

      return {
        md: p.md,
        dls: Number(dls.toFixed(2)),
        tvd: p.tvd,
        pickup: profilePoint ? profilePoint.pickup / 1000 : 0, // klbs
      };
    });

    // Obtener MD del Punto Neutro directamente del motor
    const nMD =
      neutralPointRaw !== undefined && neutralPointRaw !== null
        ? neutralPointRaw
        : null;

    return { chartData: data, maxDLS: mDLS, neutralMD: nMD };
  }, [trajectory, results.torqueDrag, neutralPointRaw]);

  if (chartData.length === 0) return null;

  return (
    <div
      style={{
        marginTop: "24px",
        background: bgColor,
        backdropFilter: "blur(24px)",
        borderRadius: "16px",
        border: `1px solid ${borderColor}`,
        padding: "20px",
        boxShadow: shadowValue,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Texture: Subtle Engineering Grid */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: isDark ? 0.05 : 0.02,
          pointerEvents: "none",
          backgroundImage: `radial-gradient(${textColor} 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
          zIndex: 0,
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          borderBottom: `1px solid ${borderColor}`,
          paddingBottom: "15px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "8px",
              height: "24px",
              background: accentColor,
              borderRadius: "4px",
              boxShadow: `0 0 10px ${accentColor}80`,
            }}
          />
          <h3
            style={{
              margin: 0,
              fontSize: "14px",
              fontWeight: 800,
              color: titleColor,
              textTransform: "uppercase",
              letterSpacing: "1px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            Master Technical Dashboard
            <span
              style={{
                fontSize: "9px",
                background: isDark
                  ? "rgba(0,180,216,0.15)"
                  : "rgba(0,180,216,0.1)",
                color: accentColor,
                padding: "2px 6px",
                borderRadius: "100px",
                border: `1px solid ${accentColor}30`,
                letterSpacing: "0",
              }}
            >
              LIVE ANALYTICS
            </span>
            <span style={{ fontSize: "9px", opacity: 0.4, fontWeight: 600 }}>
              • UPDATED:{" "}
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          </h3>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          {/* KPI Card: Neutral Point */}
          <div
            style={{
              background: isDark
                ? "rgba(255,255,255,0.03)"
                : "rgba(0,0,0,0.02)",
              padding: "8px 12px",
              borderRadius: "12px",
              border: `1px solid ${borderColor}`,
              display: "flex",
              flexDirection: "column",
              minWidth: "100px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "4px",
              }}
            >
              <Anchor size={12} color={accentColor} />
              <span
                style={{
                  fontSize: "10px",
                  color: axisTextColor,
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                Neutral Point
              </span>
            </div>
            <div
              style={{ display: "flex", alignItems: "baseline", gap: "4px" }}
            >
              <span
                style={{
                  color: titleColor,
                  fontSize: "18px",
                  fontWeight: 900,
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                {neutralMD !== null
                  ? Math.round(neutralMD).toLocaleString()
                  : "---"}
              </span>
              <span
                style={{
                  fontSize: "10px",
                  color: axisTextColor,
                  fontWeight: 600,
                }}
              >
                ft
              </span>
            </div>
          </div>

          {/* KPI Card: Peak DLS */}
          <div
            style={{
              background: isDark
                ? "rgba(255,255,255,0.03)"
                : "rgba(0,0,0,0.02)",
              padding: "8px 12px",
              borderRadius: "12px",
              border: `1px solid ${borderColor}`,
              display: "flex",
              flexDirection: "column",
              minWidth: "110px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "4px",
              }}
            >
              <AlertTriangle
                size={12}
                color={maxDLS > 3 ? "#ef4444" : "#eab308"}
              />
              <span
                style={{
                  fontSize: "10px",
                  color: axisTextColor,
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                Peak DLS
              </span>
            </div>
            <div
              style={{ display: "flex", alignItems: "baseline", gap: "4px" }}
            >
              <span
                style={{
                  color: maxDLS > 3 ? "#ef4444" : titleColor,
                  fontSize: "18px",
                  fontWeight: 900,
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                {maxDLS.toFixed(2)}
              </span>
              <span
                style={{
                  fontSize: "10px",
                  color: axisTextColor,
                  fontWeight: 600,
                }}
              >
                °/100ft
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Two Columns */}
      <div style={{ display: "flex", gap: "24px", minHeight: "300px" }}>
        {/* Left Column: Tactical Summary & Legend */}
        <div
          style={{
            width: "220px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            borderRight: `1px solid ${borderColor}`,
            paddingRight: "20px",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "10px",
                color: axisTextColor,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Well Geometry
            </span>
            <div
              style={{
                marginTop: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                }}
              >
                <span style={{ color: textColor }}>Total Depth:</span>
                <span style={{ color: titleColor, fontWeight: 700 }}>
                  {well.totalDepth.toLocaleString()} ft
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                }}
              >
                <span style={{ color: textColor }}>Hole Size:</span>
                <span style={{ color: titleColor, fontWeight: 700 }}>
                  {well.holeSize}"
                </span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "auto" }}>
            <span
              style={{
                fontSize: "10px",
                color: axisTextColor,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Legend
            </span>
            <div
              style={{
                marginTop: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "3px",
                    background: accentColor,
                    borderRadius: "2px",
                  }}
                />
                <span
                  style={{
                    fontSize: "11px",
                    color: textColor,
                    fontWeight: 600,
                  }}
                >
                  Dogleg Severity
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "2px",
                    border: `1px dashed #ef4444`,
                    borderRadius: "2px",
                  }}
                />
                <span
                  style={{
                    fontSize: "11px",
                    color: textColor,
                    fontWeight: 600,
                  }}
                >
                  Axial tension (Pickup)
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "3px",
                    background: "#eab308",
                    borderRadius: "2px",
                  }}
                />
                <span
                  style={{
                    fontSize: "11px",
                    color: textColor,
                    fontWeight: 600,
                  }}
                >
                  Neutral Point
                </span>
              </div>

              {/* Safety Legend (SLB Style) */}
              <div
                style={{
                  marginTop: "12px",
                  paddingTop: "12px",
                  borderTop: `1px solid ${borderColor}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div
                  style={{ fontSize: "10px", fontWeight: 800, opacity: 0.5 }}
                >
                  SAFETY ENVELOPES
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        background: "rgba(34, 197, 94, 0.4)",
                        borderRadius: "2px",
                      }}
                    />
                    <span style={{ fontSize: "10px", color: textColor }}>
                      SAFE
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        background: "rgba(234, 179, 8, 0.4)",
                        borderRadius: "2px",
                      }}
                    />
                    <span style={{ fontSize: "10px", color: textColor }}>
                      CAUTION
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        background: "rgba(239, 68, 68, 0.4)",
                        borderRadius: "2px",
                      }}
                    />
                    <span style={{ fontSize: "10px", color: textColor }}>
                      CRITICAL
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Charts Area */}
        <div style={{ flex: 1, position: "relative" }}>
          <div style={{ width: "100%", height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 40, right: 50, left: 50, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="dlsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={accentColor}
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor={accentColor}
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient
                    id="stressGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={gridColor}
                  vertical={true}
                  strokeOpacity={0.4}
                />

                {/* --- SAFETY ENVELOPES (SLB GRADE) --- */}
                {/* DLS Safe Zone (0-4) */}
                <ReferenceArea
                  yAxisId="left"
                  y1={0}
                  y2={4}
                  fill={
                    isDark
                      ? "rgba(34, 197, 94, 0.05)"
                      : "rgba(34, 197, 94, 0.1)"
                  }
                />
                {/* DLS Caution Zone (4-6) */}
                <ReferenceArea
                  yAxisId="left"
                  y1={4}
                  y2={6}
                  fill={
                    isDark
                      ? "rgba(234, 179, 8, 0.05)"
                      : "rgba(234, 179, 8, 0.1)"
                  }
                />
                {/* DLS Danger Zone (6+) */}
                <ReferenceArea
                  yAxisId="left"
                  y1={6}
                  y2={15}
                  fill={
                    isDark
                      ? "rgba(239, 68, 68, 0.05)"
                      : "rgba(239, 68, 68, 0.1)"
                  }
                />
                <XAxis
                  dataKey="md"
                  type="number"
                  domain={[
                    0,
                    (max: number) => {
                      // Estética SLB: Enfoque dinámico
                      // Si la data es menor a 3000, fijamos en 3000 para máximo detalle visual
                      if (max < 3000) return 3000;
                      // Si pasamos los 3000, mostramos el panorama completo o el máximo de data
                      return Math.max(
                        well.totalDepth,
                        Math.ceil(max / 1000) * 1000,
                      );
                    },
                  ]}
                  tick={{ fill: axisTextColor, fontSize: 10, fontWeight: 500 }}
                  tickLine={false}
                  axisLine={{ stroke: axisColor }}
                  tickFormatter={(val) => `${val.toFixed(0)} ft`}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: accentColor, fontSize: 10, fontWeight: 800 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val}°`}
                  label={{
                    value: "Dogleg Severity [°]",
                    angle: -90,
                    position: "insideLeft",
                    fill: accentColor,
                    fontSize: 9,
                    fontWeight: 700,
                    offset: 10,
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: "#ef4444", fontSize: 10, fontWeight: 800 }}
                  tickLine={false}
                  axisLine={false}
                  label={{
                    value: "Axial Load [k-lbs]",
                    angle: 90,
                    position: "insideRight",
                    fill: "#ef4444",
                    fontSize: 9,
                    fontWeight: 700,
                    offset: 10,
                  }}
                />

                {/* --- MECHANICAL LIMITS --- */}
                {(results.torqueDrag?.tensileLimit ?? 0) > 0 && (
                  <ReferenceLine
                    yAxisId="right"
                    y={results.torqueDrag!.tensileLimit}
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="10 5"
                    label={{
                      value: "TENSILE LIMIT (Yield)",
                      position: "insideTopRight",
                      fill: "#ef4444",
                      fontSize: 8,
                      fontWeight: 900,
                      offset: 5,
                    }}
                  />
                )}

                {(results.torqueDrag?.tensileLimit ?? 0) > 0 && (
                  <ReferenceLine
                    yAxisId="right"
                    y={(results.torqueDrag?.tensileLimit ?? 0) * 0.8}
                    stroke="#eab308"
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    label={{
                      value: "80% SAFETY MARGIN",
                      position: "insideTopRight",
                      fill: "#eab308",
                      fontSize: 8,
                      fontWeight: 700,
                      offset: 5,
                    }}
                  />
                )}
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const isAboveNeutral =
                        neutralMD !== null && Number(label) < neutralMD;

                      return (
                        <div
                          style={{
                            backgroundColor: isDark
                              ? "rgba(10, 10, 20, 0.95)"
                              : "rgba(255, 255, 255, 0.98)",
                            border: `1px solid ${borderColor}`,
                            borderRadius: "12px",
                            padding: "12px",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                            backdropFilter: "blur(12px)",
                            fontFamily: "var(--font-mono, monospace)",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "11px",
                              opacity: 0.6,
                              marginBottom: "8px",
                              borderBottom: `1px solid ${borderColor}`,
                              paddingBottom: "4px",
                            }}
                          >
                            POSITION: {Number(label).toFixed(0)} ft MD
                            {data.tvd && ` | ${Math.round(data.tvd)} ft TVD`}
                          </div>

                          {payload.map((entry, index) => (
                            <div
                              key={index}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: "20px",
                                alignItems: "center",
                                marginBottom: "4px",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  color: entry.color,
                                }}
                              >
                                {entry.name}:
                              </span>
                              <span
                                style={{
                                  fontSize: "13px",
                                  fontWeight: 900,
                                  color: titleColor,
                                }}
                              >
                                {Number(entry.value).toFixed(2)}{" "}
                                {entry.name.includes("Load") ? "klbs" : "°/100"}
                              </span>
                            </div>
                          ))}

                          {neutralMD !== null && (
                            <div
                              style={{
                                marginTop: "8px",
                                paddingTop: "8px",
                                borderTop: `1px dashed ${borderColor}`,
                                fontSize: "10px",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                color: isAboveNeutral ? accentColor : "#eab308",
                              }}
                            >
                              <div
                                style={{
                                  width: "6px",
                                  height: "6px",
                                  borderRadius: "50%",
                                  background: isAboveNeutral
                                    ? accentColor
                                    : "#eab308",
                                }}
                              />
                              STATUS:{" "}
                              {isAboveNeutral
                                ? "STRING IN TENSION"
                                : "STRING IN COMPRESSION"}
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="dls"
                  name="Dog Leg Severity"
                  stroke={accentColor}
                  strokeWidth={3}
                  fill="url(#dlsGradient)"
                  activeDot={{
                    r: 6,
                    fill: accentColor,
                    stroke: isDark ? "#000" : "#fff",
                    strokeWidth: 2,
                  }}
                />

                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="pickup"
                  name="Axial Load (k-lbs)"
                  stroke="#ef4444"
                  strokeWidth={1.5}
                  fill="url(#stressGradient)"
                  strokeDasharray="4 4"
                />

                {neutralMD && (
                  <ReferenceLine
                    yAxisId="left"
                    x={neutralMD}
                    stroke="#eab308"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    label={{
                      position: "insideTopLeft",
                      offset: 10,
                      value: "NEUTRAL POINT",
                      fill: "#eab308",
                      fontSize: 10,
                      fontWeight: 900,
                      letterSpacing: "1px",
                    }}
                  />
                )}
                {neutralMD && (
                  <ReferenceLine
                    yAxisId="left"
                    x={neutralMD}
                    stroke="#eab308"
                    strokeWidth={8}
                    strokeOpacity={0.1}
                  />
                )}

                {/* Reference Line for Well Target Depth */}
                <ReferenceLine
                  yAxisId="left"
                  x={well.totalDepth}
                  stroke={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}
                  strokeWidth={1}
                  label={{
                    position: "insideTopRight",
                    value: "PROJECTION TARGET",
                    fill: axisTextColor,
                    fontSize: 10,
                    fontWeight: 800,
                    offset: 10,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
