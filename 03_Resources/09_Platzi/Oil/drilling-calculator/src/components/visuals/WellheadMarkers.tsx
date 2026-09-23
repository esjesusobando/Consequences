// ============================================================
// Drilling Calculator — WellheadMarkers
// Renders distinct per-well markers at wellhead surface locations
// Each well has a unique color and icon at the surface (y=0 plane)
// Provides visual reference for well positions at surface
// ============================================================

import React from "react";
import * as THREE from "three";
import { TrajectoryPoint } from "../../store/drilling-types";

/**
 * WellheadMarker — single well marker at surface location.
 * Renders a colored sphere with well ID label at the point
 * where the well intersects the surface (TVD = 0).
 */
function WellheadMarkerSphere({
  position,
  color,
  wellId,
}: {
  position: THREE.Vector3; // surface easting/northing
  color: string;
  wellId: string;
}): THREE.Mesh {
  const sphereGeo = new THREE.SphereGeometry(8, 12, 12);
  const sphereMat = new THREE.MeshStandardMaterial({
    color,
    emissive: color === "#ff006e" ? "#ff006e" : undefined,
    emissiveIntensity: color === "#ff006e" ? 0.5 : 0,
    metalness: 0.9,
    roughness: 0.1,
    transparent: color === "#ff006e" ? false : true,
    opacity: color === "#ff006e" ? 1 : 0.9,
  });
  const sphere = new THREE.Mesh(sphereGeo, sphereMat);
  sphere.position.copy(position);
  return sphere;
}

/** Label component for wellhead marker (HTML-based in real impl) */
function WellheadMarkerLabel({
  position,
  wellId,
}: {
  position: THREE.Vector3;
  wellId: string;
}): THREE.Object3D {
  const label = new THREE.Object3D();
  label.position.copy(position);
  label.position.y = 30; // above the sphere
  label.userData = { wellId, type: "label" };
  return label;
}

/**
 * WellheadMarkers — renders markers for all wells at their surface positions.
 * Each well gets a distinct color from the palette, with the primary
 * well marked in #ff006e (magenta) for immediate visual distinction.
 * 
 * In a full implementation, this would use the well's surfaceEast/surfaceNorth
 * from the well data, mapping them to the 3D scene coordinates.
 */
export function WellheadMarkers({
  wells,
  primaryWellId,
  wellColors,
}: {
  wells: Array<{
    id: string;
    name: string;
    surfaceEast: number;
    surfaceNorth: number;
    trajectory: TrajectoryPoint[];
  }>;
  primaryWellId: string;
  wellColors: Record<string, string>;
}): { spheres: THREE.Mesh[]; labels: THREE.Object3D[] } {
  const spheres: THREE.Mesh[] = [];
  const labels: THREE.Object3D[] = [];

  wells.forEach((well) => {
    // Determine color: primary gets #ff006e, others get palette color
    const color = well.id === primaryWellId ? "#ff006e" : wellColors[well.id] || "#00b4d8";

    // Surface position: east/north at TVD 0
    // In real scene, would map to 3D coordinates considering camera/clipping
    const surfacePos = new THREE.Vector3(
      well.surfaceEast,
      0, // TVD 0 at surface
      well.surfaceNorth,
    );

    // Create sphere marker
    const sphere = WellheadMarkerSphere({ position: surfacePos, color, wellId: well.id });
    spheres.push(sphere);

    // Create label
    const label = WellheadMarkerLabel({ position: surfacePos, wellId: well.id });
    labels.push(label);
  });

  return { spheres, labels };
}

export type { WellheadMarkerSphereProps, WellheadMarkersReturn };