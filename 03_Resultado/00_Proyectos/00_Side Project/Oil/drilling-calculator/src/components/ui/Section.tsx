// ============================================================
// Drilling Calculator — Section Component (Layout)
// Collapsible panel with Silicon Valley status indicators
// ============================================================

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ValidationStatus } from "../../store/drilling-types";
import "./Section.css";

export interface SectionProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  validationV1?: ValidationStatus;
  validationV2?: ValidationStatus;
  defaultExpanded?: boolean;
  onFocusTrigger?: () => void;
  children: React.ReactNode;
}

export function Section({
  title,
  icon,
  validationV1 = "pending",
  validationV2 = "pending",
  defaultExpanded = true,
  onFocusTrigger,
  children,
}: SectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const overallStatus: ValidationStatus =
    validationV1 === "error" || validationV2 === "error"
      ? "error"
      : validationV1 === "warning" || validationV2 === "warning"
        ? "warning"
        : validationV1 === "valid" && validationV2 === "valid"
          ? "valid"
          : "pending";

  const statusColor =
    overallStatus === "valid"
      ? "var(--color-safe)"
      : overallStatus === "warning"
        ? "var(--color-warning)"
        : overallStatus === "error"
          ? "var(--color-critical)"
          : "var(--sh-grey-200)";

  return (
    <div className="section">
      <button
        className="section__header"
        onClick={() => {
          setExpanded(!expanded);
          if (onFocusTrigger) onFocusTrigger();
        }}
        aria-expanded={expanded}
      >
        <div className="section__left">
          <div
            className="section__status-dot"
            style={{ backgroundColor: statusColor }}
          />
          {icon && <span className="section__icon">{icon}</span>}
          <h2 className="section__title">{title}</h2>
        </div>
        <div className="section__right">
          <div className="section__guards">
            <span
              className={`section__guard section__guard--${validationV1}`}
              title="Validación de Entrada"
            >
              V1
            </span>
            <span
              className={`section__guard section__guard--${validationV2}`}
              title="Validación de Salida"
            >
              V2
            </span>
          </div>
          <ChevronDown
            size={14}
            className={`section__chevron ${expanded ? "section__chevron--open" : ""}`}
          />
        </div>
      </button>
      {expanded && <div className="section__body">{children}</div>}
    </div>
  );
}
