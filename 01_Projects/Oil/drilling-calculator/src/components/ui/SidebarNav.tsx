import React from "react";
import {
  Layers,
  Mountain,
  Droplets,
  Drill,
  Gauge,
  Zap,
  Compass,
  ShieldAlert,
  Anchor,
  Scale,
} from "lucide-react";
import "./SidebarNav.css";

interface SidebarNavProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeView,
  onViewChange,
}) => {
  const menuItems = [
    { id: "drilling", icon: Layers, label: "Geometría" },
    { id: "directional", icon: Compass, label: "Perforación Direccional" },
    { id: "torquedrag", icon: Zap, label: "Torque & Drag" },
    { id: "formation", icon: Mountain, label: "Formación" },
    { id: "fluids", icon: Droplets, label: "Fluidos" },
    { id: "bha", icon: Drill, label: "BHA / Bit" },
    { id: "hydraulics", icon: Gauge, label: "Hidráulica" },
    { id: "surgeswab", icon: Anchor, label: "Surge & Swab (Burkhardt)" },
    { id: "stuckpipe", icon: Scale, label: "Stuck Pipe Analysis" },
    {
      id: "wellcontrol",
      icon: ShieldAlert,
      label: "Well Control (Kick Shield)",
    },
    { id: "simulation", icon: Zap, label: "Gemelo Digital" },
  ];

  return (
    <aside className="sidebar-nav">
      <div className="sidebar-nav__container">
        {menuItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              className={`sidebar-nav__item ${isActive ? "is-active" : ""}`}
              onClick={() => onViewChange(item.id)}
              title={item.label}
            >
              <div className="sidebar-nav__icon-wrapper">
                <item.icon size={15.5} strokeWidth={isActive ? 1.75 : 1.5} />
              </div>
              {isActive && <div className="sidebar-nav__dot" />}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
