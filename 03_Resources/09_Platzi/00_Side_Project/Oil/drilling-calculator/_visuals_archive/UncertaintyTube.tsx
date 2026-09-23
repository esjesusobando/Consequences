// ============================================================
// UncertaintyTube — Continuous uncertainty ellipsoids as InstancedMesh
// High-performance rendering of uncertainty tubes along wellbore
// Uses InstancedMesh for single draw call regardless of station count
// ============================================================

import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import type { UncertaintyStation } from "../../engine/uncertainty-engine";
import { riskLevelColor } from "../../engine/uncertainty-engine";

interface UncertaintyTubeProps {
  stations: UncertaintyStation[];
  opacity?: number;
  lod?: "high" | "medium" | "low";
  riskColoring?: boolean;
  autoLOD?: boolean;
  camera?: THREE.Camera;
}

const LOD_SEGMENTS = { high: 16, medium: 12, low: 8 };

export const UncertaintyTube: React.FC<UncertaintyTubeProps> = ({
  stations,
  opacity = 0.25,
  lod = "high",
  riskColoring = false,
  autoLOD = true,
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const geometryRef = useRef<THREE.SphereGeometry>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const dummyRef = useRef<THREE.Object3D>(null);
  const prevLODRef = useRef(lod);

  const { geometry, material, count } = useMemo(() => {
    const segments = LOD_SEGMENTS[lod];
    const geo = new THREE.SphereGeometry(1, segments, segments);
    const mat = new THREE.MeshPhysicalMaterial({
      transparent: true,
      opacity,
      metalness: 0.1,
      roughness: 0.9,
      side: THREE.DoubleSide,
      vertexColors: riskColoring,
    });
    return { geometry: geo, material: mat, count: stations.length };
  }, [stations.length, lod, opacity, riskColoring]);

  // Initialize refs
  useEffect(() => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;
    mesh.count = stations.length;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    if (riskColoring) {
      mesh.instanceColor = new THREE.InstancedBufferAttribute(
        new Float32Array(count * 3),
        3
      );
    }
  }, [geometry, material, count, riskColoring]);

  // Update instance matrices when stations change
  useEffect(() => {
    if (!meshRef.current || stations.length === 0) return;
    
    const mesh = meshRef.current;
    const dummy = dummyRef.current || new THREE.Object3D();
    
    stations.forEach((station, i) => {
      const axes = station.axes;
      const rot = station.rotation; // 3x3 row-major
      const pos = station.center;

      dummy.position.set(pos.east, pos.tvd, pos.north);
      dummy.rotation.setFromRotationMatrix(new THREE.Matrix4().fromArray([
        rot[0], rot[1], rot[2], 0,
        rot[3], rot[4], rot[5], 0,
        rot[6], rot[7], rot[8], 0,
        0, 0, 0, 1
      ]));
      dummy.scale.set(axes[0], axes[1], axes[2]);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      if (riskColoring && station.riskLevel) {
        const c = new THREE.Color(riskLevelColor(station.riskLevel));
        mesh.setColorAt(i, c);
      }
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [stations, riskColoring]);

  // Auto-LOD based on station count (camera distance check removed - useFrame would be better)
  useEffect(() => {
    if (!autoLOD || stations.length < 5) return;
    
    let newLOD: "high" | "medium" | "low" = "high";
    const visibleCount = stations.length;
    
    if (visibleCount > 8) newLOD = "low";
    else if (visibleCount > 4) newLOD = "medium";
    
    if (newLOD !== prevLODRef.current) {
      prevLODRef.current = newLOD;
      // Recreate geometry with new LOD
      const segments = LOD_SEGMENTS[newLOD];
      const newGeo = new THREE.SphereGeometry(1, segments, segments);
      if (meshRef.current) {
        meshRef.current.geometry.dispose();
        meshRef.current.geometry = newGeo;
      }
    }
  }, [autoLOD, stations.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (geometryRef.current) geometryRef.current.dispose();
      if (materialRef.current) materialRef.current.dispose();
    };
  }, []);

  if (stations.length === 0) return null;

  if (stations.length === 1) {
    // Single station visualization: simple sphere at origin
    return (
      <mesh
        args={[geometry, material]}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[1, 12, 12]} />
        <meshPhysicalMaterial
          transparent={true}
          opacity={opacity}
          metalness={0.1}
          roughness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
    );
  }
  
  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, stations.length]}
      castShadow
      receiveShadow
    />
  );
};