// ============================================================
// Drilling Calculator — AlertBanner Component
// Refactored for TRIVI Aesthetic (Pill Tags)
// ============================================================

import { AlertCircle, AlertTriangle, Info, CheckCircle } from "lucide-react";
import type { DrillingAlert } from "../../store/drilling-types";
import "./AlertBanner.css";

interface AlertBannerProps {
  alerts: DrillingAlert[];
}

const ICONS = {
  critical: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle,
};

export function AlertBanner({ alerts }: AlertBannerProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="alert-banner">
      {alerts.map((alert, i) => {
        const Icon = ICONS[alert.level];
        if (!Icon) return null;

        return (
          <div
            key={`${alert.module}-${i}`}
            className={`alert-item alert-item--${alert.level}`}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="alert-item__side-strip" />
            <div className="alert-item__main">
              <div className="alert-item__header">
                <div className="alert-item__title-group">
                  <Icon size={18} className="alert-item__icon" />
                  <span className="alert-item__message">{alert.message}</span>
                </div>
                <span className="alert-item__module">{alert.module}</span>
              </div>

              <div className="alert-item__body">
                {alert.detail.split(". ").map((sentence, idx) => {
                  if (!sentence.trim()) return null;
                  const isRecommendation =
                    sentence.includes("RECOMENDACIÓN:") ||
                    sentence.includes("ACCIÓN:");
                  return (
                    <div
                      key={idx}
                      className={`alert-item__line ${isRecommendation ? "recommendation" : ""}`}
                    >
                      <span className="bullet">•</span>
                      <span className="text">
                        {sentence.trim()}
                        {idx < alert.detail.split(". ").length - 1 ? "." : ""}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
