// ============================================================
// Drilling Calculator — CompassRose
// Renders N-E-S-W orientation indicator overlay in camera corner
// Provides spatial orientation for well positions in 3D view
// ============================================================

import React from "react";
import * as THREE from "three";

/**
 * CompassRose — renders a cardinal direction overlay (N, E, S, W)
 * in the corner of the 3D view. Uses HTML for text labels
 * with CSS styling for the needle/box appearance.
 * 
 * Can also be rendered as a Three.js object3D if HTML overlay
 * is not preferred.
 */
export function CompassRoseHTML({
  position = "top-right",
  size = 120,
  color = "#ff006e",
  showNE = true,
  showSE = true,
  showNW = true,
  showSW = true,
}: {
  position?: "top-right" | "top-left" | "bottom-left" | "bottom-right";
  size?: number;
  color?: string;
  showNE?: boolean;
  showSE?: boolean;
  showNW?: boolean;
  showSW?: boolean;
}): JSX.Element {
  const styles = {
    position: "absolute",
    width: `${size}px`,
    height: `${size}px`,
    pointerEvents: "none",
    fontFamily: "Inter, sans-serif",
    fontSize: "12px",
    fontWeight: 600,
    color: color,
    background: "rgba(15, 15, 25, 0.7)",
    border: "1px solid var(--sh-grey-200)",
    borderRadius: "8px",
    padding: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  };

  const positionStyles: Record<string, string> = {
    "top-right": "top: 10px; right: 10px;",
    "top-left": "top: 10px; left: 10px;",
    "bottom-left": "bottom: 10px; left: 10px;",
    "bottom-right": "bottom: 10px; right: 10px;",
  };

  return (
    <div style={{ ...styles, ...positionStyles[position] }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        {showNW && <span>N</span>}
        {showNE && <span>E</span>}
      </div>
      {showSW && <span>S</span>}
      {showSE && <span>W</span>}
    </div>
  );
}

/**
 * CompassRose3D — renders a Three.js spherical arrow indicator
 * at the camera position showing up direction and cardinal directions.
 * Useful when HTML overlays aren't feasible.
 */
export function CompassRose3D({
  cameraPos: cameraPosition,
  size = 50,
  color = "#ff006e",
}: {
  cameraPos: THREE.Vector3;
  size?: number;
  color?: string;
}): THREE.Group {
  const group = new THREE.Group();

  // North indicator (positive Y in camera space)
  const northGeo = new THREE.ArrowHelper(
    new THREE.Vector3(0, 1, 0), // North = +Y
    new THREE.Vector3(0, 0, 0),
    size,
    color,
    0.5,
    0.5,
  );
  group.add(northGeo);

  // East indicator (positive X in camera space)
  const eastGeo = new THREE.ArrowHelper(
    new THREE.Vector3(1, 0, 0), // East = +X
    new THREE.Vector3(0, 0, 0),
    size,
    new THREE.Color(0xffd700), // Gold for East
    0.5,
    0.5,
  );
  group.add(eastGeo);

  // Label placeholder objects
  const northLabel = new THREE.Object3D();
  northLabel.position.set(0, size + 10, 0);
  northLabel.userData.label = "N";
  group.add(northLabel);

  const eastLabel = new THREE.Object3D();
  eastLabel.position.set(size + 10, 0, 0);
  eastLabel.userData.label = "E";
  group.add(eastLabel);

  return group;
}

/**
 * useCompassRose hook — tracks camera rotation and updates
 * compass direction labels accordingly.
 */
export function useCompassRose({
  camera,
  onDirectionChange,
}: {
  camera: { position: THREE.Vector3; target: THREE.Vector3 };
  onDirectionChange?: (direction: "N" | "E" | "S" | "W") => void;
}) {
  const lastDirection = useRef<"N" | "E" | "S" | "W">("N");

  useEffect(() => {
    const updateDirection = () => {
      const { position, target } = camera;
      const { y } = position; // Up component
      
      // Simple quadrant detection based on camera orientation
      let direction: "N" | "E" | "S" | "W" = "N";
      
      // In a full impl, would use vector math with camera matrix
      // For now, simple heuristic
      if (Math.abs(position.x) > Math.abs(position.z)) {
        direction = position.x > 0 ? "E" : "W";
      } else if (position.z > 0) {
        direction = "S";
      }
      
      if (direction !== lastDirection.current && onDirectionChange) {
        onDirectionChange(direction);
        lastDirection.current = direction;
      }
    };

    updateDirection();
    // Would attach to render loop or resize event in production
  }, [camera, onDirectionChange]);

  return { lastDirection: lastDirection.current };
}

export type { CompassRoseProps, CompassRose3DProps };