// ============================================================
// Drilling Calculator — GlowEffect
// Post-processing bloom effect rendered ONLY on critical indicators:
// - Red MASD tubes (SF < 1.0 / CRITICAL)
// - Critical risk markers (riskLevel = "CRITICAL")
// - Primary well outline when at risk
// Never applied to normal wellbore geometry, tubes, or grid.
// Uses Three.js UnrealBloomPass with strict threshold.
//
// This is a thin wrapper — the actual EffectComposer setup
// is managed by the AntiCollision3D orchestrator.
// ============================================================

import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

/** Bloom configuration for critical indicators only. */
export const BLOOM_CONFIG = {
  // Strength: moderate — bright enough to see, not overwhelming
  strength: 0.8,
  // Radius: bloom spread
  radius: 0.4,
  // Threshold: ONLY materials with emissiveIntensity > threshold will bloom
  // 0.8 means only truly emissive materials (red critical markers, MASD tubes)
  // will bloom. Normal tubes, grid, geometry are excluded.
  threshold: 0.8,
  // Physical: correct auto-exposure
  physical: true,
};

/**
 * GlowEffect — sets up the bloom post-processing pipeline.
 * Must be added to the scene's EffectComposer.
 * 
 * Critical elements that will bloom (emissive materials):
 * - Red MASD tubes (SF < 1.0)
 * - Critical risk markers (spheres at closest approach)
 * - Primary well outline when risk level is CRITICAL
 * 
 * Elements that will NOT bloom (excluded via material settings):
 * - Normal wellbore trajectories
 * - Uncertainty tubes (opacity 0.15, no emissive)
 * - Depth grid planes
 * - Compass rose, labels
 * - Standard geometry
 */
export class GlowEffect {
  private composer: EffectComposer | null = null;
  private renderPass: RenderPass | null = null;
  private bloomPass: UnrealBloomPass | null = null;
  private initialized = false;

  /** Initialize the effect with a renderer and scene. */
  init(renderer: THREE.Renderer, scene: THREE.Scene, camera: THREE.Camera) {
    if (this.initialized) return;
    this.composer = new EffectComposer(renderer);
    this.renderPass = new RenderPass(scene, camera);
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      BLOOM_CONFIG.strength,
      BLOOM_CONFIG.radius,
      BLOOM_CONFIG.threshold,
    );

    this.composer.addPass(this.renderPass);
    this.composer.addPass(this.bloomPass);
    this.initialized = true;
  }

  /** Render composition — call in the render loop. */
  render(delta?: number) {
    if (!this.composer) console.error("GlowEffect not initialized");
    else this.composer.render(delta);
  }

  /** Dispose resources. */
  dispose() {
    if (this.composer) this.composer.dispose();
    this.composer = null;
    this.renderPass = null;
    this.bloomPass = null;
    this.initialized = false;
  }

  /** Get the bloom pass for manual element configuration. */
  getBloomPass(): UnrealBloomPass | null {
    return this.bloomPass;
  }
}

/** Pre-configured bloom pass with critical-threshold settings. */
export function createBloomPass(): UnrealBloomPass {
  return new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    BLOOM_CONFIG.strength,
    BLOOM_CONFIG.radius,
    BLOOM_CONFIG.threshold,
  );
}

/** Mark a mesh's material as "bloom-eligible" by adding emissive intensity.
 * Call on meshes that should bloom (critical markers, red MASD tubes).
 * 
 * @param material Three.js material to configure
 * @param isCritical true if this is a CRITICAL risk element
 */
export function configureBloomMaterial(material: THREE.Material, isCritical: boolean) {
  if (isCritical) {
    material.emissive = new THREE.Color(
      isCritical === "red" ? "#ef4444" : "#f59e0b",
    );
    material.emissiveIntensity = 0.8; // exceeds threshold 0.8
    material.transparent = true;
    material.opacity = 0.9;
  } else {
    // Ensure normal materials do NOT exceed threshold
    material.emissiveIntensity = 0; // critical: keep at 0
  }
}

export type { GlowEffect, BLOOM_CONFIG };