# Design: Anti-Colisión 3D Visual SOTA Upgrade

## Architecture

### Component Decomposition

`AntiCollision3D.tsx` (883 lines) → **Orchestrator < 300 lines** + **8 sub-components** in `src/components/visuals/`:

```
AntiCollision3D (orchestrator, <300 lines)
├─ CameraController (extracted from useEffect)
├─ WellRenderer (tubes, ellipsoids, MASD tubes)
├─ RiskOverlay (risk-colored sections, markers)
├─ DepthGrid (planes at TVD intervals)
├─ CompassRose (N-E orientation overlay)
├─ WellheadMarkers (per-well surface markers)
├─ ParticleTrail (drilling direction particles)
├─ GlowEffect (bloom on critical indicators)
└─ InfoPanel (glassmorphism overlay)
```

### Interface Contracts

#### `CameraController` Props

```typescript
interface CameraControllerProps {
  view: string;
  isRotating: boolean;
  primaryTrajectory: TrajectoryPoint[];
  entries?: CollisionEntry[];
  surfaceEast: number;
  surfaceNorth: number;
  focusTrigger: number;
  selectedWellId: string | null;
  effectiveSelectedEntry?: CollisionEntry | null;
  fov?: number; // V-3: camera FOV
}
```

#### `MASDTube` Props

```typescript
interface MASDTubeProps {
  wellId: string;
  trajectory: TrajectoryPoint[];
  masdDistance: number; // SF-derived distance in feet
  isPass: boolean; // SF ≥ 4.0
  color?: string; // override if needed
}
```

#### `RiskWellbore` Props

```typescript
interface RiskWellboreProps {
  trajectory: TrajectoryPoint[];
  sfValues: number[]; // per-point SF values
  colorGradient: [string, string]; // [startColor, endColor]
  lineWidth?: number;
}
```

#### `DepthGrid` Props

```typescript
interface DepthGridProps {
  interval: number; // TVD interval in feet (1000 default)
  color: string; // grid color
  opacity?: number;
  labelFormat?: (tvd: number) => string;
}
```

#### `CompassRose` Props

```typescript
interface CompassRoseProps {
  showNESW: boolean;
  size: number;
  color: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}
```

#### `GlassmorphismPanel` Props

```typescript
interface GlassmorphismPanelProps {
  title: string;
  content: ReactNode;
  maximized: boolean;
  onToggleMaximize: () => void;
  width?: number;
  height?: number;
}
```

### Visual Pipeline Specification

#### Render Order (Critical for Transparent Layers)

Layer | Component | depthWrite | depthTest | renderOrder
- -----|-----------|------------|-----------|------------
1 | Grid + Floor | true | true | 0
2 | Depth Grid Planes | false | true | 1
3 | Uncertainty Tubes (all wells) | false | true | 2
4 | MASD Tubes (pass/fail) | false | true | 3
5 | Wellbore Trajectory Lines | false | true | 4
6 | Ellipsoid Surfaces | false | true | 5
7 | Closest-Approach Markers | false | true | 6
8 | Risk-Colored Wellbore Sections | false | true | 7
9 | Particle Trails | false | true | 8
10| Glassmorphism Panels | false | false | 9 (on top)
11| Html Labels / Tooltips | false | false | 10

#### Key Settings

- `transparent={true}` on all Canvas elements with transparency
- `depthWrite={false}` for ALL transparent layers except grid/floor
- `depthTest={true}` to prevent z-fighting between opaque elements
- `renderOrder` control for deterministic layering
- `instancedCount` reuse: single InstancedMesh for all uncertainty tubes

### MASD Tube Geometry

```typescript
// Compute tube radius from MASD distance
// masdDistance is in feet (same scene units)
function masdRadius(masdDistance: number): number {
  // Direct 1:1 mapping — 1 ft = 1 scene unit
  return Math.max(masdDistance, 2); // minimum 2ft radius
}

// Pass/Fail Coloring
const masdColor = (sf: number): string => {
  if (sf >= 4.0) return '#00e676'; // SAFE green
  if (sf >= 1.0) return '#f59e0b'; // TRANSITION yellow-orange
  return '#ef4444'; // CRITICAL red
};

// Tube geometry: capsule around wellbore path
// Points: trajectory points + offset for radius
// Each segment: two circles (top/bottom) connected by quads
```

### Risk Coloring Algorithm

```typescript
// Map SF values to gradient colors
// SF ≥ 4.0 → SAFE green
// SF 1.0-4.0 → Transition yellow→orange
// SF < 1.0 → CRITICAL red

function sfToColor(sf: number, minSF: number = 1.0, maxSF: number = 4.0): string {
  const t = Math.min(Math.max((sf - minSF) / (maxSF - minSF), 0), 1);
  // Interpolate between green → yellow → red
  const green = 0x00e676;
  const yellow = 0xf59e0b;
  const red = 0xef4444;
  
  if (t < 0.5) {
    // Green to Yellow
    const lt = t * 2;
    return lerpColor(green, yellow, lt);
  } else {
    // Yellow to Red
    const lt = (t - 0.5) * 2;
    return lerpColor(yellow, red, lt);
  }
}

// Apply per-wellbore: compute per-point SF, map to color, set line color
```

### Camera Animation (Slerp)

```typescript
// Smooth camera transitions between views
const slerpCamera = (from: THREE.Vector3, to: THREE.Vector3, t: number): THREE.Vector3 => {
  // Spherical linear interpolation
  const fromSphere = new THREE.Spherical()
    .setFromVector3(from.clone().normalize())
    .setAngleZ(-Math.PI / 2); // adjust for up direction
  const toSphere = new THREE.Spherical()
    .setFromVector3(to.clone().normalize())
    .setAngleZ(-Math.PI / 2);
  
  const interpolated = new THREE.Spherical()
    .setAngleX(lerp(fromSphere.theta, toSphere.theta, t))
    .setAngleY(lerp(fromSphere.phi, toSphere.phi, t))
    .setRadius(lerp(fromSphere.radius, toSphere.radius, t));
  
  return new THREE.Vector3()
    .setFromSpherical(interpolated);
};

// Use over 500ms with ease-out
useFrame((state, delta) => {
  if (cameraTransition.active) {
    const elapsed = state.clock.getElapsedTime();
    const t = Math.min(elapsed / cameraTransition.duration, 1);
    const easedT = 1 - Math.pow(1 - t, 3); // ease-out cubic
    camera.position.set(
      lerp(cameraTransition.from.x, cameraTransition.to.x, easedT),
      lerp(cameraTransition.from.y, cameraTransition.to.y, easedT),
      lerp(cameraTransition.from.z, cameraTransition.to.z, easedT)
    );
    if (t >= 1) cameraTransition.active = false;
  }
});
```

### Particle Trail System

```typescript
interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number; // seconds
  maxLife: number;
  color: string;
}

class ParticleSystem {
  particles: Particle[] = [];
  maxParticles = 50;
  clock = new THREE.Clock();
  
  spawn(trajectory: TrajectoryPoint[], wellId: string) {
    // Spawn at regular intervals along trajectory
    const interval = trajectory.length / this.maxParticles;
    for (let i = 0; i < trajectory.length; i += interval) {
      const p = trajectory[i];
      this.particles.push({
        position: new THREE.Vector3(p.east, -p.tvd, p.north),
        velocity: new THREE.Vector3(0, -0.1, 0), // slowly drift upward
        life: 0,
        maxLife: 2.5 + Math.random() * 1.0,
        color: wellColors[wellId],
      });
    }
  }
  
  update() {
    for (const p of this.particles) {
      p.life += this.clock.getDelta();
      if (p.life >= p.maxLife) {
        // Respawn at start
        p.life = 0;
        // Keep same position or randomize
      }
      // Update position based on velocity + trajectory flow
      p.position.addScaledVector(p.velocity, this.clock.getDelta());
    }
    // Cap total particles
    if (this.particles.length > this.maxParticles) {
      this.particles.splice(0, this.particles.length - this.maxParticles);
    }
  }
  
  render() {
    this.particles.forEach(p => {
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 8, 8),
        new THREE.MeshBasicMaterial({ color: p.color, opacity: 1 - p.life / p.maxLife, transparent: true })
      );
      sphere.position.copy(p.position);
      // ... render
    });
  }
}
```

### Bloom/Glow Effect

```typescript
// Three.js EffectComposer setup (single instance)
const composer = new EffectComposer(renderer);
composer.setSize(window.innerWidth, window.innerHeight);

// Render pass
composer.addPass(new RenderPass(scene, camera));

// Bloom pass (thresholded)
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.8, // strength
  0.4, // radius
  0.85 // threshold — only bright/emissive materials
);
composer.addPass(bloomPass);

// Only apply to critical indicators
// - Red MASD tubes (SF < 1.0)
// - Critical risk markers (red)
// - Primary well outline (emissive)

// Exclude: normal wellbore geometry, tubes, grid
```

### Glassmorphism Panel

```html
<div className="glassmorphism-panel" style={{
  backdropFilter: 'blur(12px)',
  background: 'rgba(15, 15, 25, 0.7)',
  border: '1px solid var(--sh-grey-200)',
  borderRadius: '16px',
  padding: '20px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
  minWidth: '280px',
  maxWidth: '360px',
  width: 'calc(25vw)',
  position: 'absolute',
  top: '20px',
  right: '20px',
  zIndex: 1000,
}}>
  <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1rem' }}>
    {title}
  </h3>
  <div style={{ display: 'grid', gap: '8px', fontSize: '0.875rem' }}>
    <div>
      <div style={{ opacity: 0.7, marginBottom: '2px' }}>{labelSF}:</div>
      <div style={{ fontWeight: 600 }}>{sfValue.toFixed(4)}</div>
    </div>
    <div>
      <div style={{ opacity: 0.7, marginBottom: '2px' }}>{labelDmin}:</div>
      <div style={{ fontWeight: 600 }}>{minDistance.toFixed(4)} ft</div>
    </div>
    <div>
      <div style={{ opacity: 0.7, marginBottom: '2px' }}labelSigma>:</div>
      <div style={{ fontWeight: 600 }}>{sepSigma.toFixed(4)} ft</div>
    </div>
    <div>
      <div style={{ opacity: 0.7, marginBottom: '2px' }}>{labelRisk}:</div>
      <div 
        style={{ 
          display: 'inline-block', 
          padding: '2px 6px', 
          borderRadius: '10px', 
          background: riskColor,
          color: 'white',
          fontWeight: 600 
        }}>{riskLabel}</div>
    </div>
  </div>
</div>
```

### Performance Budget

| Element              | Count (max 5 wells) | Draw Calls                     | Memory  | Priority  |
|---------------------|--------------------|-------------------------------|--------|----------|
| Uncertainty Tubes    | 6 × 5 = 30          | 30 (InstancedMesh)             | 2MB     | Critical  |
| MASD Tubes           | 6 × 5 = 30          | 30 (InstancedMesh, conditional)| 1MB     | High      |
| Wellbore Trajectories| 6 × 5 = 30          | 30 (line segments)             | 1MB     | High      |
| Ellipsoids           | 2 × 5 = 10          | 10                             | 500KB   | Medium    |
| Markers              | 2 × 5 = 10          | 10                             | 200KB   | Medium    |
| Depth Grid Planes    | 5-10 planes         | 5-10                           | 200KB   | Medium    |
| Compass Rose         | 1                   | 1                              | 50KB    | Low       |
| Particle Trails      | 50 max              | 50                             | 300KB   | Low-Medium|
| Glassmorphism Panels | 1-2                 | 1-2                            | 100KB   | Low       |

* *Total**: ~120-140 draw calls, ~8.5MB memory — well within WebGL2 limits

### Implementation Order (Recommended)

1. **Week 1**: Component decomposition (AntiCollision3D → <300 lines)
2. **Week 2**: Tier 1 spec gaps (FOV, color, opacity, tooltips)
3. **Week 3**: MASD tubes + risk coloring + depth grid
4. **Week 4**: Camera animation + particle trails
5. **Week 5**: Bloom/glassmorphism + entrance animations
6. **Week 6**: Verification + manual testing

### Risks & Mitigations

| Risk                               | Likelihood  | Mitigation                                                         |
|-----------------------------------|------------|-------------------------------------------------------------------|
| 883→decomposition breaks tests     | Low         | Extract pure sub-components first; test each independently         |
| Transparent layer z-fighting       | Medium      | depthWrite={false} for all transparent; renderOrder control        |
| Performance hit (>150 draw calls)  | Low         | InstancedMesh reuse; particle cap at 50; conditional MASD rendering|
| Bloom affects non-critical elements| Medium      | Strict threshold 0.8; exclude normal geometry from bloom pass      |
| Color gradient not perceptible     | Low         | Test with actual SF values from engine; adjust thresholds if needed|

### Dependencies

- Existing stack: React 19, Three.js/R3F, drei, Zustand, vitest
- New: No new npm packages (all using three.js built-ins)
- Depends on: Anti-collision engine unchanged (SF values already computed)
- Depended by: Tasks phase for implementation
