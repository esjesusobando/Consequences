import React from "react";

import "./Charts.css";

// ============================================================
// Drilling Calculator — GaugeChart Component (Visual)
// Premium SVG Gauge with animated needle and zones
// ============================================================

interface GaugeChartProps {
  value: number;
  min: number;
  max: number;
  label: string;
  unit: string;
  color?: string;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  min,
  max,
  label,
  unit,
  color = "var(--primary)",
}) => {
  const isInvalid = isNaN(value) || value === null || !isFinite(value);
  const normalizedValue = isInvalid ? 0 : Math.min(Math.max(value, min), max);
  const percentage = ((normalizedValue - min) / (max - min)) * 100;

  // SVG Calculations
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ textAlign: "center" }}>
      <svg
        width="200"
        height="120"
        viewBox="0 0 200 120"
        style={{ overflow: "visible" }}
      >
        {/* Track */}
        <path
          d="M 30 100 A 70 70 0 0 1 170 100"
          fill="none"
          stroke="var(--sh-grey-200)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Animated Progress */}
        <path
          d="M 30 100 A 70 70 0 0 1 170 100"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
        />
        {/* Needle base */}
        <circle cx="100" cy="100" r="6" fill="var(--color-text-main)" />
      </svg>{" "}
      <div style={{ marginTop: "-12px", paddingBottom: "8px" }}>
        <div
          style={{
            fontSize: "24px",
            fontWeight: 700,
            fontFamily: "var(--font-mono)",
            color: "var(--sh-grey-900)",
            lineHeight: 1.2,
          }}
        >
          {normalizedValue.toFixed(2)}
          <span
            style={{
              fontSize: "12px",
              color: "var(--sh-grey-400)",
              marginLeft: "4px",
              fontWeight: 500,
            }}
          >
            {unit}
          </span>
        </div>
        <div
          style={{
            fontSize: "10px",
            fontWeight: 800,
            color: "var(--sh-grey-400)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginTop: "4px",
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};
