import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import type { UncertaintyStation } from "../../engine/uncertainty-engine";
import { extend } from "@react-three/fiber";

// Extend the JSX namespace to include Three.js line element
extend({ line: THREE.Line });

interface UncertaintyConeProps {
  stations: UncertaintyStation[];
  startIndex: number;
  length?: number;
  color?: string;
  opacity?: number;
  showAxis?: boolean;
}

export const UncertaintyCone: React.FC<UncertaintyConeProps> = ({
  stations,
  startIndex,
  length = 1000,
  color = "#00b4d8",
  opacity = 0.08,
  showAxis = true,
}) => {
  const coneRef = useRef<THREE.Mesh>(null);
  const axisRef = useRef<THREE.Line>(null);

  const coneGeo = useMemo((): THREE.ExtrudeGeometry | null => {
    if (stations.length < 2 || startIndex >= stations.length - 1) return null;
    // Build radius profile from major axis of ellipsoids
    const radii = stations.slice(startIndex).map(s => s.axes[0]);
    if (radii.length < 2) return null;

    // Create cone profile: start radius = 0, then grow according to uncertainty
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    radii.forEach((r, i) => {
      const y = (i / (radii.length - 1)) * length;
      shape.lineTo(r, y);
    });
    shape.lineTo(0, length);
    shape.closePath();

    const extrudeSettings = { 
      steps: radii.length - 1, 
      depth: 1, 
      bevelEnabled: false 
    };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.rotateX(-Math.PI / 2); // Align Y upward (TVD)
    return geo;
  }, [stations, startIndex, length, color, opacity]);

const coneMat = useMemo((): THREE.MeshPhysicalMaterial | null => {
    if (stations.length < 2) {
      // Minimum visualization: small cone at origin with basic material
      return new THREE.MeshPhysicalMaterial({
        color,
        transparent: true,
        opacity: 0.02,
        metalness: 0.0,
        roughness: 1.0,
      });
    }
    if (startIndex >= stations.length - 1) return null;
    return new THREE.MeshPhysicalMaterial({
      color,
      transparent: true,
      opacity,
      metalness: 0.0,
      roughness: 1.0,
    });
  }, [color, opacity]);

  const { axisGeo, axisMat } = useMemo((): { axisGeo: THREE.BufferGeometry | null; axisMat: THREE.LineDashedMaterial | null } => {
    if (stations.length < 2) {
      // Minimum visualization: simple line at origin for single station
      const _axisGeo = new THREE.BufferGeometry();
      _axisGeo.setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, length > 0 ? length : 1, 0),
      ]);
      const _axisMat = new THREE.LineDashedMaterial({
        color,
        dashSize: 2,
        gapSize: 2,
        transparent: true,
        opacity: 0.3,
      });
      return { axisGeo: _axisGeo, axisMat: _axisMat };
    }
    if (startIndex >= stations.length - 1) return { axisGeo: null, axisMat: null };

    // Build radius profile from major axis of ellipsoids
    const radii = stations.slice(startIndex).map(s => s.axes[0]);
    if (radii.length < 2) return { axisGeo: null, axisMat: null };

    // Axis line
    const _axisGeo = new THREE.BufferGeometry();
    const axisPts = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, length, 0),
    ];
    _axisGeo.setFromPoints(axisPts);
    const _axisMat = new THREE.LineDashedMaterial({
      color,
      dashSize: 10,
      gapSize: 5,
      transparent: true,
      opacity: 0.3,
    });

    return { axisGeo: _axisGeo, axisMat: _axisMat };
  }, [stations, startIndex, length, color, opacity]);

  // Update cone position based on start station
  useEffect(() => {
    if (!coneRef.current || !coneGeo) return;
    
    const startStation = stations[startIndex];
    if (!startStation) return;

    coneRef.current.position.set(
      startStation.center.east,
      startStation.center.tvd,
      startStation.center.north
    );
    
    // Align cone rotation with start station's ellipsoid rotation
    if (coneRef.current && startStation.rotation) {
      const rot = startStation.rotation;
      const m = new THREE.Matrix4().fromArray([
        rot[0], rot[1], rot[2], 0,
        rot[3], rot[4], rot[5], 0,
        rot[6], rot[7], rot[8], 0,
        0, 0, 0, 1
      ]);
      coneRef.current.rotation.setFromRotationMatrix(m);
    }

    if (axisRef.current) {
      axisRef.current.position.copy(coneRef.current.position);
      axisRef.current.rotation.copy(coneRef.current.rotation);
      axisRef.current.computeLineDistances();
    }
  }, [stations, startIndex]);

  if (!coneGeo) return null;

  return (
    <group>
      {coneGeo && <mesh ref={coneRef} geometry={coneGeo} material={coneMat as THREE.Material} />}
      {showAxis && axisGeo && axisMat && React.createElement("line", {
        ref: axisRef,
        geometry: axisGeo,
        material: axisMat as THREE.Material,
      })}
    </group>
  );
};