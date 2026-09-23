// ============================================================
// Drilling Calculator — WellLegend Component
// HTML legend for the 3D anti-collision view (AC3D-3): primary +
// adjacent wells, color swatches, click-to-select, eye visibility
// toggle with hover tooltip, selected highlight. No three/R3F
// imports — jsdom-testable by design (D3).
// ============================================================

import React from "react";
import { Eye, EyeOff } from "lucide-react";
import "./WellLegend.css";

export interface WellLegendWell {
  id: string;
  name: string;
  color: string;
  visible: boolean;
  riskLevel?: "CRITICAL" | "CAUTION" | "MONITOR" | "SAFE";
  minDistanceFt?: number;
}

export interface WellLegendProps {
  wells: WellLegendWell[];
  selectedWellId: string | null;
  onSelect: (id: string) => void;
  onToggleVisibility: (id: string) => void;
}

/** Tooltip hover states */
const EYE_HOVER = {
  visible: "Ocultar este pozo",
  hidden: "Mostrar",
} as const;

/** Default tooltip delay in ms before hiding on mouse leave */
const TOOLTIP_HIDE_DELAY = 300;

/**
 * Legend rows are driven entirely by props. Contract: wells[0] is the
 * primary well (it anchors the common frame) — it is selectable but
 * never hideable, so its row has no eye toggle (AC3D-3).
 */
export function WellLegend({
  wells,
  selectedWellId,
  onSelect,
  onToggleVisibility,
}: WellLegendProps) {
  // Tooltip state: visible tooltip wellId + hide timeout reference
  const [tooltipInfo, setTooltipInfo] = React.useState<{
    showing: boolean;
    wellId: string | null;
    timeoutId: ReturnType<typeof setTimeout> | null;
  }>({ showing: false, wellId: null, timeoutId: null });

  // Clear previous timeout on unmount / re-render
  React.useEffect(() => {
    return () => {
      if (tooltipInfo.timeoutId) {
        clearTimeout(tooltipInfo.timeoutId);
      }
    };
  }, [tooltipInfo]);

  // Hide tooltip after delay
  const hideTooltip = (delay = TOOLTIP_HIDE_DELAY) => {
    if (tooltipInfo.timeoutId) {
      clearTimeout(tooltipInfo.timeoutId);
    }
    const id = setTimeout(() => {
      setTooltipInfo({ showing: false, wellId: null, timeoutId: null });
    }, delay);
    return id;
  };

  // Show tooltip for a well
  const showTooltip = (wellId: string) => {
    // Clear any existing timeout
    if (tooltipInfo.timeoutId) {
      clearTimeout(tooltipInfo.timeoutId);
    }
    setTooltipInfo({ showing: true, wellId, timeoutId: null });
  };

  // Hide tooltip
  const hide = () => {
    const id = hideTooltip();
    setTooltipInfo({ showing: false, wellId: null, timeoutId: id });
  };

  return (
    <div className="well-legend">
      <span className="well-legend__title">Pozos</span>
      <ul className="well-legend__list">
        {wells.map((well, index) => (
          <li
            key={well.id}
            className={`well-legend__row ${
              well.id === selectedWellId ? "selected" : ""
            } ${well.visible ? "" : "is-hidden"}`}
            onMouseEnter={() => showTooltip(well.id)}
            onMouseLeave={() => hide()}
          >
            <button
              type="button"
              className="well-legend__select"
              onClick={() => onSelect(well.id)}
              aria-pressed={well.id === selectedWellId}
            >
              <span
                className="well-legend__swatch"
                style={{ backgroundColor: well.color }}
                aria-hidden="true"
              />
              <span className="well-legend__name">{well.name}</span>
            </button>
            {index > 0 && (
              <button
                type="button"
                className={`well-legend__eye ${
                  well.visible ? "" : "is-hidden"
                }`}
                onClick={() => onToggleVisibility(well.id)}
                aria-label={well.visible ? EYE_HOVER.visible : EYE_HOVER.hidden}
                title={well.visible ? EYE_HOVER.visible : EYE_HOVER.hidden}
              >
                {well.visible ? (
                  <Eye size={15} aria-hidden="true" />
                ) : (
                  <EyeOff size={15} aria-hidden="true" />
                )}
              </button>
            )}
            {/* Tooltip: shows well name, risk level, and min distance */}
            {tooltipInfo.showing && tooltipInfo.wellId === well.id && (
              <div className="well-legend__tooltip">
                <span className="well-legend__tooltip-name">
                  <strong>{well.name}</strong>
                </span>
                {well.riskLevel !== undefined && (
                  <span className="well-legend__tooltip-risk">
                    {riskMeta(well.riskLevel).label}
                  </span>
                )}
                {well.minDistanceFt !== undefined && (
                  <span className="well-legend__tooltip-distance">
                    {well.minDistanceFt} ft
                  </span>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** riskMeta - converts risk level to meta object */
function riskMeta(risk: WellLegendWell["riskLevel"]) {
  switch (risk) {
    case "SAFE":
      return { label: "SEGURO", className: "is-safe" };
    case "MONITOR":
      return { label: "VIGILAR", className: "is-monitor" };
    case "CAUTION":
      return { label: "PRECAUCIÓN", className: "is-caution" };
    default:
      return { label: "CRÍTICO", className: "is-critical" };
  }
}