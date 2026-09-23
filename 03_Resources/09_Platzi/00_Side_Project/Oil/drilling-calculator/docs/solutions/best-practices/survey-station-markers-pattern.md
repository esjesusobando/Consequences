- --
title: "Survey Station Markers — Interactive Spheres + R3F Hover Pattern"
date: 2026-08-28
category: best-practices
module: anti-collision
problem_type: best_practice
component: tooling
severity: medium
applies_when:
  - "Rendering interactive markers at survey station points along 3D wellbore trajectories"
  - "Building hover tooltips in React Three Fiber that don't intercept pointer events"
  - "Coordinating coordinate transforms between multiple 3D components (WellborePath + markers)"
tags:
  - react-three-fiber
  - R3F
  - three.js
  - hover-tooltip
  - coordinate-transform
  - wellbore-path
  - survey-station
  - drilling-3d
- --

# Survey Station Markers — Interactive Spheres + R3F Hover Pattern

## Context

Fase 2 of the AntiCollision3D visualization introduced SurveyStationMarkers — small spheres at each survey station point along a wellbore trajectory that reveal MD/INC/AZI/TVD on hover. Two patterns emerged as non-obvious and worth preserving: the coordinate transform contract that must match WellborePath exactly, and the R3F hover architecture that prevents pointer event conflicts with the orbit controls.

## Pattern 1: Coordinate Transform Contract

### The Rule

Every component that renders 3D points from `TrajectoryPoint[]` must use the **identical** coordinate transform. In this codebase:

```typescript
// Shared transform — single source of truth
new THREE.Vector3(
  p.east - surfaceEast,   // X axis = Easting (subtracted to origin)
  - p.tvd,                  // Y axis = depth (negated: depth increases downward, Y increases upward)
  p.north - surfaceNorth,  // Z axis = Northing (subtracted to origin)
)
```

This transform appears in:
- `WellborePath.buildTrajectoryPoints()` (`src/components/visuals/WellborePath.tsx:73-81`)
- `SurveyStationMarkers.points` (`src/components/sections/AntiCollision3D.tsx:339-353`)
- `UncertaintyEllipsoid` position calculation
- `computeBounds()` for camera framing

### The gotcha: Primary vs Adjacent wells

* *Primary well** subtracts its own `surfaceEast`/`surfaceNorth` (state-plane coordinates):

```tsx
<SurveyStationMarkers
  segments={primaryTrajectory}
  surfaceEast={wellData.surfaceEast ?? 0}   // e.g., 500000
  surfaceNorth={wellData.surfaceNorth ?? 0} // e.g., 6000000
/>
```

* *Adjacent wells** pass `0`/`0` because their trajectories are already in local coordinates (relative to the primary wellhead):

```tsx
<SurveyStationMarkers
  segments={entry.trajectory}
  surfaceEast={0}   // Already local
  surfaceNorth={0}  // Already local
/>
```

* *Why:** Adjacent well trajectories are pre-computed in the anti-collision engine as offsets from the primary wellhead. They don't carry state-plane coordinates. If you accidentally subtract `wellData.surfaceEast` from an adjacent well, the markers drift thousands of meters away from the wellbore path.

* *Test:** `src/components/sections/AntiCollision3D.test.tsx:161-179` verifies that WellborePath and SurveyStationMarkers produce identical transforms for the same input.

## Pattern 2: R3F Hover with stopPropagation + Local State

### The Problem

R3F's event system routes pointer events through the Three.js scene graph. Without `stopPropagation`, hovering a sphere bubbles the event to parent groups and can trigger orbit controls or other handlers. Tooltips rendered via `<Html>` (from `@react-three/drei`) are DOM elements overlaid on the canvas — if they have `pointerEvents: auto`, they intercept clicks meant for the 3D scene.

### The Solution

```tsx
const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

// 1. Sphere mesh — captures hover, stops propagation
<mesh
  onPointerOver={(e) => { e.stopPropagation(); setHoveredIdx(i); }}
  onPointerOut={() => setHoveredIdx(null)}
>
  <sphereGeometry args={[3, 8, 8]} />
  <meshStandardMaterial
    color={hoveredIdx === i ? "#ffffff" : color}
    emissive={color}
    emissiveIntensity={hoveredIdx === i ? 1.0 : 0.4}
    toneMapped={false}
  />
</mesh>

// 2. Tooltip — Html portal, pointer-events disabled
{hoveredIdx === i && (
  <Html position={[0, 12, 0]} center style={{ pointerEvents: "none" }}>
    <div style={{
      background: "rgba(10, 10, 20, 0.95)",
      color: "#fff",
      padding: "6px 10px",
      borderRadius: "8px",
      border: `1px solid ${color}`,
      fontSize: "10px",
      fontFamily: "monospace",
      whiteSpace: "nowrap",
      boxShadow: `0 0 12px ${color}44`,
      lineHeight: "1.5",
    }}>
      <div style={{ fontWeight: "bold", color, marginBottom: "2px" }}>
        #{i + 1} {label ? `- ${label}` : ""}
      </div>
      <div>MD: {pt.md.toLocaleString()} ft</div>
      <div>INC: {pt.inc.toFixed(1)}°</div>
      <div>AZI: {pt.azi.toFixed(1)}°</div>
      <div>TVD: {pt.tvd.toLocaleString()} ft</div>
    </div>
  </Html>
)}
```

### Key details

| Aspect                                 | Why                                                                |
|---------------------------------------|-------------------------------------------------------------------|
| `e.stopPropagation()`                  | Prevents hover from bubbling to parent `<group>` or orbit controls |
| `pointerEvents: "none"` on `<Html>`    | Tooltip is visual-only; clicks pass through to 3D scene beneath    |
| Local `useState` per component instance| Each wellbore path manages its own hover state independently       |
| `hoveredIdx === i` conditional render  | Only the hovered sphere shows the tooltip — not all spheres at once|
| Visual feedback via `emissiveIntensity`| Hovered sphere glows brighter, confirming interactivity            |

## Why This Matters

- **Coordinate mismatch** is silent — markers render at wrong positions with no error. The only symptom is visual: markers float away from the wellbore line. Tests in `AntiCollision3D.test.tsx` catch this.
- **Hover event leaks** cause orbit controls to stutter or stop responding when the user hovers over a marker. `stopPropagation` is the only reliable fix in R3F's event system.
- **`pointerEvents: "none"`** on Html tooltips is mandatory. Without it, the DOM tooltip captures mouse events and the user cannot rotate/pan the 3D scene while hovering near a marker.

## When to Apply

- Adding any new 3D marker/label component that renders alongside WellborePath
- Building hover tooltips in R3F scenes with orbit controls
- Any `TrajectoryPoint[]` consumer that renders in the same scene as WellborePath
- When adjacent well trajectories are pre-transformed to local coordinates

## Related

- `src/components/sections/AntiCollision3D.tsx:322-407` — SurveyStationMarkers component
- `src/components/visuals/WellborePath.tsx:73-81` — `buildTrajectoryPoints()` shared transform
- `src/components/sections/AntiCollision3D.test.tsx:161-179` — Coordinate transform consistency test
