// ============================================================
// Drilling Calculator — WellRenderer
// Renders uncertainty tubes, ellipsoids, MASD tubes, and wellbore trajectories
// InstancedMesh-optimized for 5+ wells
// ============================================================

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { InstancedMesh } from "three";
import { TrajectoryPoint } from "../../store/drilling-types";
import { UncertaintyTubeProps } from "../../engine/uncertainty-tube";
import { UncertaintyEllipsoidProps } from "./UncertaintyEllipsoid";
import { MASDTubeProps } from "./MASDTube";
import { WellborePathProps } from "../visuals/WellborePath";
import { CollisionEntry } from "../../engine/anti-collision";

/** Maximum number of tubes to render simultaneously (performance cap). */
const MAX_TUBES = 30;

/** Instanced mesh configuration for uncertainty tubes. */
interface TubeInstancedConfig {
  count: number;
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
}

/** Render result for a single well's rendering pipeline. */
interface WellRenderResult {
  tubeMesh?: InstancedMesh;
  ellipsoidMeshes: THREE.Mesh[];
  masdMesh?: THREE.Mesh;
  trajectoryLine?: THREE.Line;
}

/**
 * WellRenderer — renders all visual elements for a set of wells.
 * Uses InstancedMesh for tubes to minimize draw calls.
 * Conditionally renders MASD tubes based on SF values.
 */
export function WellRenderer({
  wells,
  onTubeClick,
  selectedWellId,
  hiddenWellIds,
}: {
  wells: Array<{
    id: string;
    trajectory: TrajectoryPoint[];
    color: string;
    masdDistance?: number;
    sf?: number;
    visible?: boolean;
  }>;
  onTubeClick?: (wellId: string) => void;
  selectedWellId: string | null;
  hiddenWellIds: Set<string>;
}): WellRenderResult {
  const tubeRef = useRef<InstancedMesh | null>(null);
  const ellipsoidRef = useRef<THREE.Mesh[]>([]);
  const masdRef = useRef<THREE.Mesh | null>(null);
  const trajectoryRef = useRef<THREE.Line | null>(null);

  useEffect(() => {
    if (wells.length === 0) return;

    // 1. Build InstancedMesh for uncertainty tubes
    const tubeCount = Math.min(wells.length, MAX_TUBES);
    if (tubeCount > 0) {
      const geometries: THREE.BufferGeometry[] = [];
      const materials: THREE.Material[] = [];

      wells.slice(0, tubeCount).forEach((well, idx) => {
        // Get or create tube geometry per well
        // In production, would share geometry with different materials
        const tubeGeo = new THREE.CylinderGeometry(1, 1, 100, 8, 1);
        const tubeMat = new THREE.MeshStandardMaterial({
          color: well.color,
          transparent: true,
          opacity: well.visible ? 0.15 : 0.02,
          metalness: 0.9,
          roughness: 0.1,
          side: THREE.DoubleSide,
        });
        geometries.push(tubeGeo);
        materials.push(tubeMat);
      });

      // Create instanced mesh (simplified — real impl would use
      // a single shared geometry with varying transforms)
      const sharedGeo = geometries[0];
      const sharedMat = materials[0];

      tubeRef.current = new InstancedMesh(sharedGeo, sharedMat, tubeCount);
      tubeRef.current.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    }

    // 2. Render ellipsoids for each visible well
    const ellipsoids: THREE.Mesh[] = [];
    wells.slice(0, MAX_TUBES).forEach((well) => {
      if (!well.visible || hiddenWellIds.has(well.id)) return;
      // Create ellipsoid at closest approach (simplified)
      const ellipsoidGeo = new THREE.SphereGeometry(5, 12, 12);
      const ellipsoidMat = new THREE.MeshStandardMaterial({
        color: well.color,
        opacity: 0.6,
        transparent: true,
        metalness: 0.2,
        roughness: 0.8,
        side: THREE.DoubleSide,
      });
      const ellipsoid = new THREE.Mesh(ellipsoidGeo, ellipsoidMat);
      ellipsoid.position.set(0, 0, 0); // would be computed per-well
      ellipsoids.push(ellipsoid);
    });
    ellipsoidRef.current = ellipsoids;

    // 3. Render MASD tube if SF data available
    wells.slice(0, MAX_TUBES).forEach((well) => {
      if (!well.sf || well.masdDistance === undefined || hiddenWellIds.has(well.id))
        return;
      const isPass = well.sf >= 4.0;
      const color = isPass ? "#00e676" : "#ef4444";
      const masdGeo = new THREE.CylinderGeometry(1, 1, well.masdDistance, 8, 1);
      const masdMat = new THREE.MeshStandardMaterial({
        color,
        emissive: isPass ? "#00b358" : "#ff0000",
        emissiveIntensity: isPass ? 0.3 : 0.8,
        transparent: true,
        opacity: 0.4,
        metalness: 0.9,
        roughness: 0.1,
      });
      const masdMesh = new THREE.Mesh(masdGeo, masdMat);
      masdMesh.position.set(0, -well.masdDistance / 2, 0); // center at origin
      masdRef.current = masdMesh;
    });

    // 4. Render trajectory lines
    wells.slice(0, MAX_TUBES).forEach((well, idx) => {
      const points = well.trajectory.map((p) => new THREE.Vector3(p.east, -p.tvd, p.north));
      if (points.length < 2) return;
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: well.color,
        linewidth: 2,
        transparent: true,
        opacity: well.visible ? (selectedWellId && well.id === selectedWellId ? 0.8 : 0.68) : 0.4,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      // Would be added to scene — simplified here
      if (idx === 0) trajectoryRef.current = line;
    });
  }, [wells]);

  return {
    tubeMesh: tubeRef.current,
    ellipsoidMeshes: ellipsoidRef.current,
    masdMesh: masdRef.current,
    trajectoryLine: trajectoryRef.current,
  };
}

export type { WellRenderResult, TubeInstancedConfig };