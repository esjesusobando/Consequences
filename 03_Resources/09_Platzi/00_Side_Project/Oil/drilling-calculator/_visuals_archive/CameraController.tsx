// ============================================================
// Drilling Calculator — CameraController
// Pure camera control with slerp interpolation for smooth transitions
// No React state in the hook — renders in AntiCollision3D orchestrator
// ============================================================

import { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import { Vec3 } from "../../store/drilling-types";

/**
 * Spherical linear interpolation for camera positioning.
 * Interpolates between two spherical coordinates.
 */
function lerpSpherical(
  a: THREE.Spherical,
  b: THREE.Spherical,
  t: number,
): THREE.Spherical {
  return new THREE.Spherical()
    .setAngleX(THREE.MathUtils.lerp(a.phi, b.phi, t))
    .setAngleY(THREE.MathUtils.lerp(a.theta, b.theta, t))
    .setRadius(THREE.MathUtils.lerp(a.radius, b.radius, t));
}

/**
 * Convert camera position to spherical coords (y-up convention).
 * Three.js uses z-up; we normalize to y-up for consistent slerp.
 */
function posToSpherical(pos: THREE.Vector3): THREE.Spherical {
  const r = pos.length();
  const theta = Math.atan2(pos.x, pos.z); // azimuthal angle in xy-plane
  const phi = Math.acos(Math.max(-1, Math.min(1, pos.y / r))); // polar angle
  return new THREE.Spherical(r, theta, phi);
}

/**
 * Convert spherical coords back to position vector.
 */
function sphericalToPos(s: THREE.Spherical, radiusOverride?: number): THREE.Vector3 {
  const r = radiusOverride ?? s.radius;
  return new THREE.Vector3()
    .setFromSpherical(new THREE.Spherical(s.theta, s.phi, r));
}

/**
 * CameraController hook — provides target position + transition logic.
 * Usage in orchestrator:
 *  - cameraTransition.active ?= transition in progress
 *  - cameraTransition.from/start positions
 *  - cameraTransition.to/end positions
 *  - cameraTransition.duration = transition time (ms)
 *  - cameraTransition.easedT = eased progress (0..1)
 */
export function useCameraController() {
  const transition = useRef({
    active: false,
    duration: 500, // ms
    start: new THREE.Vector3(),
    end: new THREE.Vector3(),
    from: new THREE.Vector3(), // initial at t=0
    to: new THREE.Vector3(), // current at t=now
    startTime: 0,
    easing: "cubic-out",
  });

  // Start a transition to a new target
  const startTransition = useCallback(
    (endPos: THREE.Vector3, duration?: number) => {
      transition.current.active = true;
      transition.current.start = transition.current.from.clone();
      transition.current.end = endPos.clone();
      transition.current.duration = duration ?? 500;
      transition.current.startTime = performance.now();
      transition.current.from = transition.current.from.clone();
      transition.current.to = transition.current.end.clone();
    },
    [],
  );

  // Interpolated position for current frame
  const getInterpolatedPos = useCallback(
    (clock: THREE.Clock): THREE.Vector3 => {
      if (!transition.current.active) return transition.current.to;

      const elapsed = clock.getElapsedTime() - transition.current.startTime;
      const t = Math.min(elapsed / transition.current.duration, 1);

      // Easing: cubic-out
      const easedT = 1 - Math.pow(1 - t, 3);

      return new THREE.Vector3().lerpVectors(
        transition.current.from,
        transition.current.to,
        easedT,
      );
    },
    [],
  );

  // Reset transition
  const reset = useCallback(() => {
    transition.current.active = false;
  }, []);

  return {
    startTransition,
    getInterpolatedPos,
    reset,
  };
}

/**
 * Pre-defined view targets for the 5 camera views.
 * Each target is a THREE.Vector3 in the common NE-TVD frame.
 */
export const CAMERA_VIEWS = {
  iso: new THREE.Vector3(100, 100, 100).normalize().multiplyScalar(800),
  top: new THREE.Vector3(0, 800, 0),
  side: new THREE.Vector3(800, 0, 0),
  front: new THREE.Vector3(0, 0, 800),
  bit: new THREE.Vector3(0, 0, 0), // will be set per-primary trajectory
} as const;

/** Camera FOV — Phase 1: changed from 40 to 50 for wider viewing angle. */
export const CAMERA_FOV = 50;

/**
 * Get camera target for a given view name.
 * In a real implementation, this would compute based on well positions.
 * For now, returns predefined targets.
 */
export function getCameraTarget(view: keyof typeof CAMERA_VIEWS): THREE.Vector3 {
  return CAMERA_VIEWS[view];
}

/**
 * Interpolate between two camera targets over time.
 * Used by the AntiCollision3D orchestrator.
 */
export function interpolateCamera(
  from: THREE.Vector3,
  to: THREE.Vector3,
  t: number, // 0..1
  easing: "linear" | "cubic-out" | "slerp" = "cubic-out",
): THREE.Vector3 {
  if (easing === "linear") {
    return new THREE.Vector3().lerpVectors(from, to, t);
  }

  if (easing === "cubic-out") {
    const eased = 1 - Math.pow(1 - t, 3);
    return new THREE.Vector3().lerpVectors(from, to, eased);
  }

  if (easing === "slerp") {
    // Spherical linear interpolation
    const fromSphere = new THREE.Spherical().setFromVector3(from.clone().normalize());
    const toSphere = new THREE.Spherical().setFromVector3(to.clone().normalize());
    const interpolated = new THREE.Spherical()
      .setAngleX(THREE.MathUtils.lerp(fromSphere.theta, toSphere.theta, t))
      .setAngleY(THREE.MathUtils.lerp(fromSphere.phi, toSphere.phi, t))
      .setRadius(THREE.MathUtils.lerp(fromSphere.radius, toSphere.radius, t));
    return new THREE.Vector3().setFromSpherical(interpolated);
  }

  return new THREE.Vector3().lerpVectors(from, to, t);
}

export type { Vec3 };