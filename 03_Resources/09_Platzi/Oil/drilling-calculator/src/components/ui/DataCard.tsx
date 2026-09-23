// ============================================================
// Drilling Calculator — DataCard Component (Atomic)
// Displays a labelled value with unit, sparkline and delta
// ============================================================

import type { ValidationStatus } from "../../store/drilling-types";
import { Sparkline } from "../visuals/Sparkline";
import "./DataCard.css";

interface DataCardProps {
  label: string;
  value: number | string;
  unit?: string;
  decimals?: number;
  status?: ValidationStatus;
  highlight?: boolean;
  trend?: number[];
  delta?: { value: number; type: "up" | "down" | "neutral" };
}

export function DataCard({
  label,
  value,
  unit,
  decimals = 2,
  status = "valid",
  highlight = false,
  trend,
  delta,
}: DataCardProps) {
  const displayValue =
    typeof value === "number"
      ? isFinite(value)
        ? value.toFixed(decimals)
        : "—"
      : value;

  const statusColor =
    status === "valid"
      ? "#00b4d8"
      : status === "warning"
        ? "#ffcc00"
        : status === "error"
          ? "#ff006e"
          : "rgba(255, 255, 255, 0.2)";

  return (
    <div className={`data-card ${highlight ? "data-card--highlight" : ""}`}>
      <div
        className="data-card__indicator"
        style={{ backgroundColor: statusColor }}
      />
      <div className="data-card-header">
        <span className="data-card-label">{label}</span>
      </div>

      <div className="data-card-body">
        <div className="data-card-main">
          <span className="data-card-value">{displayValue}</span>
          {unit && <span className="data-card-unit">{unit}</span>}
        </div>

        {delta !== undefined && (
          <div
            className={`data-card-delta ${delta.type === "up" ? "positive" : delta.type === "down" ? "negative" : "neutral"}`}
          >
            {delta.type === "up" ? "+" : delta.type === "down" ? "-" : ""}
            {delta.value}%
          </div>
        )}
      </div>

      {trend && (
        <div className="data-card-visual">
          <Sparkline data={trend} status={status} />
        </div>
      )}
    </div>
  );
}
