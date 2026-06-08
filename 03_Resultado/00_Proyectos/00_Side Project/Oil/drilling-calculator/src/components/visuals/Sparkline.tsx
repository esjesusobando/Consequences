// ============================================================
// Drilling Calculator — Sparkline Component (Visual)
// Simple SVG trend line for metric cards
// ============================================================

import type { ValidationStatus } from "../../store/drilling-types";

interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  status?: ValidationStatus;
}

export function Sparkline({
  data,
  color = "var(--color-secondary-neon)",
  width = 80,
  height = 30,
}: SparklineProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="sparkline">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}
