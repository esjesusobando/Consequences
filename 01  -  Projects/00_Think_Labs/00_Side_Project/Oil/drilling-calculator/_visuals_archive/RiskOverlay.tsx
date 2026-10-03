// ============================================================
// Drilling Calculator — RiskOverlay
// Renders risk-colored wellbore sections and closest-approach markers
// Gradient from green (safe) → yellow (caution) → red (critical)
// based on Separation Factor (SF) values
// ============================================================

import * as THREE from "three";
import type { CollisionEntry } from "../../engine/anti-collision";

/**
 * Risk coloring gradient based on SF (Separation Factor).
 * SF ≥ 4.0 → SAFE green
 * SF 1.0–4.0 → Transition yellow→orange
 * SF < 1.0 → CRITICAL red
 */
function sfToColor(sf: number): string {
  if (sf >= 4.0) return "#00e676"; // SAFE
  if (sf >= 1.0) return "#f59e0b"; // TRANSITION
  return "#ef4444"; // CRITICAL
}

/**
 * RiskWellbore — renders a single wellbore section with risk-based coloring.
 * The tube/line color varies along the trajectory based on per-point SF values.
 */
export function RiskWellbore({
  entry,
  wellColor,
}: {
  entry: CollisionEntry;
  wellColor: string;
}): THREE.Group {
  const group = new THREE.Group();

  // Create trajectory line with risk-based color grading
  const trajectory = entry.trajectory;
  if (trajectory.length >= 2) {
    const points = trajectory.map((p) => new THREE.Vector3(p.east, -p.tvd, p.north));

    // Build geometry with per-point colors (simplified: uniform color for now)
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineBasicMaterial({
      color: sfToColor(entry.result.sf),
      linewidth: 3,
      transparent: true,
      opacity: 0.9,
    });
    const line = new THREE.Line(lineGeo, lineMat);
    group.add(line);
  }

  // Create closest-approach marker
  if (entry.result) {
    // Spheroid at closest approach A
    const sphereGeoA = new THREE.SphereGeometry(4, 12, 12);
    const matA = new THREE.MeshStandardMaterial({
      color: sfToColor(entry.result.sf),
      emissive: sfToColor(entry.result.sf) === "#ef4444" ? "#ff0000" : "#00b358",
      emissiveIntensity: sfToColor(entry.result.sf) === "#ef4444" ? 0.8 : 0.3,
      transparent: true,
      opacity: 0.9,
      metalness: 0.2,
      roughness: 0.8,
    });
    const sphereA = new THREE.Mesh(sphereGeoA, matA);
    sphereA.position.set(
      entry.result.closestA.east,
      -entry.result.closestA.tvd,
      entry.result.closestA.north,
    );
    group.add(sphereA);

    // Spheroid at closest approach B
    const sphereGeoB = new THREE.SphereGeometry(4, 12, 12);
    const matB = new THREE.MeshStandardMaterial({
      color: sfToColor(entry.result.sf),
      emissive: sfToColor(entry.result.sf) === "#ef4444" ? "#ff0000" : "#00b358",
      emissiveIntensity: sfToColor(entry.result.sf) === "#ef4444" ? 0.8 : 0.3,
      transparent: true,
      opacity: 0.9,
      metalness: 0.2,
      roughness: 0.8,
    });
    const sphereB = new THREE.Mesh(sphereGeoB, matB);
    sphereB.position.set(
      entry.result.closestB.east,
      -entry.result.closestB.tvd,
      entry.result.closestB.north,
    );
    group.add(sphereB);

    // Marker line between A and B
    const midPoints = new THREE.Vector3()
      .addVectors(
        new THREE.Vector3(entry.result.closestA.east, -entry.result.closestA.tvd, entry.result.closestA.north),
        new THREE.Vector3(entry.result.closestB.east, -entry.result.closestB.tvd, entry.result.closestB.north),
      )
      .multiplyScalar(0.5);
    const markerGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(entry.result.closestA.east, -entry.result.closestA.tvd, entry.result.closestA.north),
      new THREE.Vector3(entry.result.closestB.east, -entry.result.closestB.tvd, entry.result.closestB.north),
    ]);
    const markerMat = new THREE.LineBasicMaterial({
      color: sfToColor(entry.result.sf),
      linewidth: 4,
      dashSize: 4,
      gapSize: 2,
      transparent: true,
      opacity: 0.9,
    });
    const markerLine = new THREE.Line(markerGeo, markerMat);
    group.add(markerLine);

    // Distance label (Html overlay would go here in real impl)
    // For now, just add a small helper object
    const helper = new THREE.Object3D();
    helper.userData.distance = entry.result.minDistance;
    helper.userData.riskLevel = entry.result.riskLevel;
    group.add(helper);
  }

  return group;
}

/**
 * RiskOverlay — renders all entries with risk-based visual styling.
 * Conditionally renders MASD tubes for entries with SF data.
 */
export function RiskOverlay({
  entries,
  wellColorMap,
  masdData,
  selectedEntryId,
  onMarkerClick,
}: {
  entries: CollisionEntry[];
  wellColorMap: Record<string, string>;
  masdData?: {
    wellId: string;
    masdDistance: number;
    sf: number;
    isPass: boolean;
  }[];
  selectedEntryId: string | null;
  onMarkerClick?: (entry: CollisionEntry) => void;
}): THREE.Group {
  const root = new THREE.Group();

  entries.forEach((entry, idx) => {
    const color = wellColorMap[entry.wellId] || (entry.wellId === "__primary__" ? "#ff006e" : "#00b4d8");
    const riskGroup = RiskWellbore({ entry, wellColor: color });

    // Highlight selected entry
    if (selectedEntryId && entry.wellId === selectedEntryId) {
      riskGroup.traverse((child) => {
        if (child.isMesh) {
          child.material.emissiveIntensity *= 1.5;
          child.material.opacity *= 1.2;
        }
      });
    }

    root.add(riskGroup);
  });

  // Render MASD tubes if data available
  if (masdData && masdData.length > 0) {
    masdData.forEach((masd) => {
      const color = masd.isPass ? "#00e676" : "#ef4444";
      const masdGeo = new THREE.CylinderGeometry(1, 1, masd.masdDistance, 8, 1);
      const masdMat = new THREE.MeshStandardMaterial({
        color,
        emissive: masd.isPass ? "#00b358" : "#ff0000",
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.35,
        metalness: 0.9,
        roughness: 0.1,
      });
      const masdMesh = new THREE.Mesh(masdGeo, masdMat);
      // Position at wellhead offset (simplified)
      masdMesh.position.set(0, -masd.masdDistance / 2, 0);
      root.add(masdMesh);
    });
  }

  return root;
}

export { sfToColor };