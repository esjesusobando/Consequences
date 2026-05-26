import React from "react";
import { Zap } from "lucide-react";
import { AIPMMenu } from "../ui/AIPMMenu";
import "./Layout.css";

export const Header: React.FC = () => {
  return (
    <header className="app-header glass-panel">
      <div className="header-brand">
        <div className="logo-container">
          <Zap
            size={20}
            strokeWidth={1.5}
            fill="var(--sh-lima)"
            color="var(--sh-lima)"
          />
        </div>
        <div className="brand-text">
          <h1 className="app-title">Drilling Calc</h1>
          <span className="app-subtitle">Hybrid Intelligence Engine</span>
        </div>
      </div>

      <div className="header-actions">
        <AIPMMenu />
        <div className="header-status">
          <span className="status-badge valid">System Ready</span>
        </div>
      </div>
    </header>
  );
};
