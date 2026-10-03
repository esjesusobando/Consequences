// ============================================================
// Drilling Calculator — DepthGrid
// Renders horizontal planes at regular TVD intervals with labels
// Provides atmospheric perspective for depth perception
// ============================================================

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * DepthGrid — renders horizontal grid planes at specified TVD intervals.
 * Planes are rendered below the wellbores to provide depth context.
 * 
 * Props:
 *   interval: TVD interval in feet (default 1000)
 *   color: grid plane color (default dark blue)
 *   opacity: plane opacity (default 0.03)
 *   maxTVD: maximum TVD to render (auto from data if not specified)
 *   labelFormat: function to format TVD label text
 */
export function DepthGrid({
  interval = 1000,
  color = "#001f3f",
  opacity = 0.03,
  maxTVD,
  labelFormat = (tvd: number) => `${tvd} ft`,
}: {
  interval?: number;
  color?: string;
  opacity?: number;
  maxTVD?: number;
  labelFormat?: (tvd: number) => string;
}): THREE.Group {
  const group = new THREE.Group();

  // Determine max TVD if not provided
  // In real usage, this would come from the well trajectories
  // For now, use a reasonable default
  const effectiveMaxTVD = maxTVD || 12000;

  // Create grid planes
  const planes: THREE.Mesh[] = [];
  const labels: THREE.Object3D[] = [];

  // Generate planes from 0 to maxTVD at interval steps
  for (let tvd = interval; tvd <= effectiveMaxTVD; tvd += interval) {
    // Plane geometry: large XZ plane at Y = -tvd
    const planeGeo = new THREE.PlaneGeometry(2000, 2000);
    const planeMat = new THREE.MeshStandardMaterial({
      color: THREE.Color.convertHexToColor(color),
      opacity: opacity,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      roughness: 0.8,
      metalness: 0.1,
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.position.y = -tvd; // plane at negative TVD (depth)
    plane.rotation.x = -Math.PI / 2; // rotate to horizontal
    planes.push(plane);

    // Create label at edge of plane
    const labelPos = new THREE.Vector3(800, -tvd + 50, 0); // offset from center
    const labelObj = new THREE.Object3D();
    labelObj.position.copy(labelPos);
    // In real impl, would add Html label or Three.js TextGeometry
    // For now, just store position data
    labelObj.userData = { tvd, formatted: labelFormat(tvd) };
    labels.push(labelObj);
  }

  // Add all planes to group
  planes.forEach((plane) => group.add(plane));

  // Add labels (would be Html elements or TextGeometry in real impl)
  labels.forEach((label) => group.add(label));

  return group;
}

/**
 * UseDepthGrid hook — provides grid update logic based on camera bounds
 * Recomputes grid when camera changes TVD range
 */
export function useDepthGrid({
  interval = 1000,
  maxTVD,
}: {
  interval?: number;
  maxTVD?: number;
}) {
  const gridRef = useRef<THREE.Group | null>(null);
  const clock = useRef(0);

  useEffect(() => {
    clock.current = performance.now();
  }, []);

  const updateGrid = (newMaxTVD: number) => {
    if (gridRef.current) {
      // Remove old planes and recreate
      // In real impl, would update efficiently
      gridRef.current.remove.apply(gridRef.current, [0]);
      // Would recreate with new maxTVD
    }
  };

  return {
    gridRef,
    updateGrid,
    lastUpdate: clock.current,
  };
}

export type { DepthGridProps, UseDepthGridReturn };