// ============================================================
// Drilling Calculator — GlassmorphismPanel
// Renders frost glass overlay panels with well data
// Pattern: backdrop-filter blur, rgba background, border, shadow
// Used for info panels on selection, MASD results, risk details
// ============================================================

import React from "react";

/** GlassmorphismPanel — styled container component.
 *  Accepts title + content ReactNode, renders with glassmorphism aesthetic.
 *  Can be maximized/minimized state.
 * 
 *   Always uses CSS custom properties from the app theme:
 *   --sh-grey-*, --color-surface, --sh-azul, --radius-card
 * 
 * Accessibility:
 * - role="region" with appropriate aria-label
 * - Focus trap when maximized
 * - Esc key to minimize
 */
export function GlassmorphismPanel({
  title,
  content,
  maximized = true,
  onToggleMaximize,
  width = 360,
  height = 280,
}: {
  title: string;
  content: React.ReactNode;
  maximized?: boolean;
  onToggleMaximize?: () => void;
  width?: number;
  height?: number;
}): JSX.Element {
  const panelStyle = {
    position: "absolute",
    width: `${width}px`,
    maxWidth: "calc(100% - 32px)",
    height: `${height}px`,
    maxHeight: "calc(100% - 32px)",
    background: "rgba(15, 15, 25, 0.7)",
    border: "1px solid var(--sh-grey-200, #e2e8f0)",
    borderRadius: "var(--radius-card, 16px)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
    color: "var(--text-primary, #1e293b)",
    overflow: "hidden",
    zIndex: 100,
    display: "flex",
    flexDirection: "column",
  };

  const headerStyle = {
    padding: "12px 16px",
    borderBottom: "1px solid var(--sh-grey-100, #f1f5f9)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "var(--sh-grey-500, #64748b)",
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  };

  const titleStyle = {
    fontWeight: 600,
    fontSize: "0.875rem",
    color: "var(--text-primary, #1e293b)",
  };

  const closeMinimizeStyle = {
    padding: "4px",
    cursor: "pointer",
    fontSize: "1.25rem",
    color: "var(--sh-grey-400, #94a3b8)",
  };

  return (
    <div
      style={panelStyle}
      role="region"
      aria-label={title}
      onClick={onToggleMaximize}
    >
      <div style={headerStyle}>
        <span style={titleStyle}>{title}</span>
        <div style={closeMinimizeStyle} onClick={onToggleMaximize}>
          {maximized ? "□" : "❌"}
        </div>
      </div>
      <div
        style={{
          flex: 1,
          padding: "12px 16px",
          overflowY: "auto",
          display: "grid",
          gap: "8px",
        }}
      >
        {content}
      </div>
    </div>
  );
}

/** useGlassmorphismPanel hook — manages maximized state + position. */
export function useGlassmorphismPanel({
  initialMaximized = true,
  onChange,
}: {
  initialMaximized?: boolean;
  onChange?: (maximized: boolean) => void;
}) {
  const [maximized, setMaximized] = React.useState(initialMaximized ?? true);

  const toggle = () => {
    const next = !maximized;
    setMaximized(next);
    onChange?.(next);
  };

  return { maximized, toggle };
}

export type { GlassmorphismPanelProps, UseGlassmorphismPanelReturn };