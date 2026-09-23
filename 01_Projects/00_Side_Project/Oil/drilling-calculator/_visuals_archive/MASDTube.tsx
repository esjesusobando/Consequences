// ============================================================
// Drilling Calculator — MASDTube
// Renders Min Allowable Separation Distance tubes around offset wells
// Green (SF ≥ 4.0 = SAFE) / Red (SF < 1.0 = CRITICAL)
// Based on ISCWSA separation rules
// ============================================================

import React from "react";
import * as THREE from "three";
import { MASDTubeProps } from "./MASDTube";

/** MASDTube — renders a single min-allowable-separation-distance tube.
 * 
 * The tube radius is derived directly from the MASD distance value
 * (1 ft = 1 scene unit). Colored green for pass (SF ≥ 4.0), 
 * red for fail (SF < 1.0).
 * 
 * @param props.wellId - well identifier
 * @props.trajectory - wellbore trajectory points
 * @props.masdDistance - minimum allowable separation distance in feet
 * @props.isPass - true if SF ≥ 4.0 (green), false if SF < 1.0 (red)
 * @props.color - optional override color
 */
export function MASDTube({
  wellId,
  trajectory,
  masdDistance,
  isPass,
  color,
}: MASDTubeProps): THREE.Group {
  const group = new THREE.Group();

  // Compute tube radius from MASD distance (1 ft = 1 scene unit)
  const radius = Math.max(masdDistance, 2); // minimum 2ft radius

  // Create cylindrical tube geometry
  // We'll create a simplified tube using a cylinder
  const tubeGeo = new THREE.CylinderGeometry(radius, radius, 100, 16, 1);
  const tubeColor = color || (isPass ? "#00e676" : "#ef4444");
  const tubeMat = new THREE.MeshStandardMaterial({
    color: tubeColor,
    transparent: true,
    opacity: isPass ? 0.3 : 0.5,
    metalness: 0.9,
    roughness: 0.1,
    side: THREE.DoubleSide,
  });

  const tube = new THREE.Mesh(tubeGeo, tubeMat);
  // Position at origin — would be positioned per-well in the main component
  tube.position.set(0, -50, 0); // center at mid-height, goes from -50 to +50

  group.add(tube);

  // Add inner core line to show the wellbore path
  const coreGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, -50, 0),
    new THREE.Vector3(0, 50, 0),
  ]);
  const coreMat = new THREE.LineBasicMaterial({
    color: tubeColor,
    linewidth: 2,
    transparent: true,
    opacity: 0.8,
  });
  const coreLine = new THREE.Line(coreGeo, tubeMat);
  group.add(coreLine);

  // Add hemispherical caps at top and bottom
  const capGeo = new THREE.SphereGeometry(radius, 12, 12);
  const capMat = new THREE.MeshStandardMaterial({
    color: tubeColor,
    transparent: true,
    opacity: isPass ? 0.5 : 0.7,
    metalness: 0.9,
    roughness: 0.1,
    side: THREE.DoubleSide,
  });

  const topCap = new THREE.Mesh(capGeo, capMat);
  topCap.position.set(0, 50, 0); // top of tube
  group.add(topCap);

  const bottomCap = new THREE.Mesh(capGeo, capMat);
  bottomCap.position.set(0, -50, 0); // bottom of tube
  group.add(bottomCap);

  // Add label at the side
  const labelPos = new THREE.Vector3(radius + 5, 0, 0);
  const labelObj = new THREE.Object3D();
  labelObj.position.copy(labelPos);
  labelObj.userData = { wellId, masdDistance, isPass, type: "label" };
  group.add(labelObj);

  return group;
}

/** useMASDTube hook — computes pass/fail from SF value */
export function useMASDTube(sf: number): { isPass: boolean; color: string } {
  const isPass = sf >= 4.0;
  const color = isPass ? "#00e676" : "#ef4444";
  return { isPass, color };
}

export type { MASDTubeProps, UseMASDTubeReturn };