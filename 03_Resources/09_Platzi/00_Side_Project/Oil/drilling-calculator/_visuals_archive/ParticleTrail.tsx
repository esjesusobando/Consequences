// ============================================================
// Drilling Calculator — ParticleTrail
// Renders subtle particle trails along wellbore paths
// Indicates drilling direction and wellbore flow
// Low-performance impact: capped at 50 particles total
// ============================================================

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { TrajectoryPoint } from "../../store/drilling-types";

/** Single particle in the trail system. */
interface Particle {
  mesh: THREE.Mesh;
  life: number; // seconds
  maxLife: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: string;
}

/**
 * ParticleTrail — renders a fading trail of particles along a wellbore.
 * Particles spawn at regular intervals along the trajectory and fade out
 * over their lifetime, creating a subtle visual indication of flow direction.
 */
export function ParticleTrail({
  trajectory,
  wellColor,
  maxParticles = 50,
  spawnInterval = 5, // spawn particle every N trajectory points
  lifeSpan = 3, // seconds
}: {
  trajectory: TrajectoryPoint[];
  wellColor: string;
  maxParticles?: number;
  spawnInterval?: number;
  lifeSpan?: number;
}): {
  particles: Particle[];
  totalSpawned: number;
  activeCount: number;
} {
  const particleRef = useRef<Particle[]>([]);
  const clockRef = useRef(0);

  useEffect(() => {
    // Initialize particles
    const points = trajectory;
    const particles: Particle[] = [];
    const totalSpawned = Math.min(
      Math.ceil(points.length / spawnInterval),
      maxParticles,
    );

    for (let i = 0; i < totalSpawned; i++) {
      const pointIdx = i * spawnInterval;
      if (pointIdx >= points.length) break;

      const p = points[pointIdx];
      const pos = new THREE.Vector3(p.east, -p.tvd, p.north);
      const vel = new THREE.Vector3(0, -0.05, 0); // slowly upward drift
      const life = 0;
      const maxL = lifeSpan ?? 3;
      const color = wellColor;

      particles.push({
        mesh: createParticleMesh(pos, color),
        life,
        maxLife: maxL,
        position: pos,
        velocity: vel,
        color,
      });
    }

    particleRef.current = particles;
    clockRef.current = performance.now();
  }, [trajectory, wellColor, maxParticles, spawnInterval, lifeSpan]);

  // Update particle life and positions each frame
  useEffect(() => {
    let animationFrame: number;
    const start = performance.now();

    const animate = () => {
      const now = performance.now();
      const delta = (now - start) / 1000; // seconds
      const elapsed = now - clockRef.current;

      if (elapsed > 1000 && particleRef.current) {
        particleRef.current.forEach((p) => {
          p.life += delta;
          if (p.life >= p.maxLife) {
            // Respawn at start of trajectory
            p.life = 0;
            const firstPoint = particleRef.current[0]?.position;
            if (firstPoint) {
              p.position.copy(firstPoint);
            }
          }
          // Update position based on velocity
          p.position.addScaledVector(p.velocity, delta);
          // Fade out based on life
          const fadeFactor = Math.max(0, 1 - p.life / p.maxLife);
          if (p.mesh.material) {
            ;(p.mesh.material as THREE.Material).opacity = fadeFactor;
            ;(p.mesh.material as THREE.Material).needsUpdate = true;
          }
        });
        clockRef.current = now;
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [particleRef, clockRef]);

  // Create individual particle mesh
  function createParticleMesh(position: THREE.Vector3, color: string): THREE.Mesh {
    const geo = new THREE.SphereGeometry(0.5, 8, 8);
    const mat = new THREE.MeshBasicMaterial({
      color,
      opacity: 1,
      transparent: true,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(position);
    return mesh;
  }

  return {
    particles: particleRef.current,
    totalSpawned: particleRef.current?.length ?? 0,
    activeCount: particleRef.current?.filter((p) => p.life < p.maxLife).length ?? 0,
  };
}

export type { Particle, ParticleTrailProps };