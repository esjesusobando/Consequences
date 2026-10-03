# Design: Multi-Well 3D Anti-Collision Visualization Fix

## Context

`AntiCollision3D.tsx` (713 lines) has a root-cause coordinate-frame bug and several UX gaps, confirmed by exploration (change `anti-collision-3d-wells`):

1. **Frame conflict**: `WellborePath` re-relativizes each well by ITS OWN first point → surface offsets lost, wells overlap at origin. But ellipsoids/markers use the common NE-TVD frame minus `surfaceEast ?? 0` → misaligned.
2. **Marker inconsistency**: `ClosestApproachMarker` line/spheres at `a−m`/`b−m` with no `position={mid}` while Html label is at `mid` (absolute) → line/spheres near origin, label elsewhere.
3. **No selection UX**, colors keyed by risk-sorted index (unstable), camera frames only primary + one adjacent, empty store by default (no demo), dead `activeEntry` prop.

User decisions (locked): auto-seed demo (5 mock wells + mock primary) on first mount; HTML legend panel (click-select, eye toggle, hover tooltip) — no raycasting; ellipsoids + distance label only for the selected pair.

## Technical Approach

Three layers, each independently testable:

1. **`src/engine/scene.ts` (new, pure)** — common-frame mapping and derived scene data. No React, no three imports; plain TS. Fully unit-testable in vitest/jsdom.
2. **`src/components/sections/WellLegend.tsx` (new, pure HTML)** — legend panel rendering entries + primary; emits `onSelect`/`onToggleVisibility`; hover tooltip. No three/R3F imports → jsdom-testable.
3. **`AntiCollision3D.tsx` + `Anticolision.tsx` (modified)** — consume `scene.ts` helpers and the legend; fix frame, marker, colors, camera, ellipsoid policy; auto-seed.

## Architecture Decisions

| #  | Decision                                  | Rationale                                                                                                             | Alternative rejected                              |

|---|------------------------------------------|----------------------------------------------------------------------------------------------------------------------|--------------------------------------------------|
| D1 | Anchor all wells in primary-wellhead frame| Root-cause fix: single subtraction of primary `surfaceNorth/surfaceEast`; tubes, ellipsoids, markers, bounds all agree| Per-well re-relativization (current bug)          |
| D2 | Pure `scene.ts` helper module             | Frame math testable without WebGL; single source of truth                                                             | Inline math in component (untestable)             |
| D3 | HTML legend (not raycasting)              | jsdom-testable, matches existing store-driven UI, no WebGL pick logic                                                 | three.js raycasting (untestable in jsdom)         |
| D4 | Ellipsoids only for selected pair         | Reduces clutter; distance context on demand (user decision)                                                           | Render all pairs (current)                        |
| D5 | Auto-seed demo on first mount             | Empty store → invisible feature; demo-by-default (user decision)                                                      | Manual "load demo" button                         |
| D6 | Color keyed by `wellId`, first-seen order | Stable across risk re-sorts                                                                                           | Index-keyed `WELL_COLORS[(i+1)%len]` (current bug)|
| D7 | Camera bounds over all visible wells      | Users must see all wells to assess collision context                                                                  | Primary + one adjacent only (current)             |

## Data Flow

```
store (surveys, wellData, adjacentWells)
   │  Anticolision.tsx: auto-seed (once) / selection state / color map
   ▼
scene.ts: toCommonFrame(traj, primarySurface) → local points
          buildColorMap(wellIds) → Record<wellId, color>
          computeSceneBounds(wells) → {center, size, distance}
   ▼
AntiCollision3D.tsx ── renders ──► CanvasScene (tubes, ellipsoids, marker, camera)
        │ WellLegend.tsx (HTML, overlaid) ──► onSelect(wellId) / onToggleVisibility(wellId)
        ▼
selection state in Anticolision → ellipsoid pair, camera focus
```

## Interfaces / Contracts

### `src/engine/scene.ts`

```ts
export interface LocalPoint { east: number; tvd: number; north: number }
export interface SceneBounds { center: { x: number; y: number; z: number }; size: { w: number; h: number; d: number }; distance: number }

export function toCommonFrame(
  points: TrajectoryPoint[],
  surfaceNorth: number,
  surfaceEast: number,
): LocalPoint[];

export function buildColorMap(wellIds: string[]): Record<string, string>;
export const SCENE_COLORS: readonly string[];

export function computeSceneBounds(wells: LocalPoint[][]): SceneBounds;
export function combineBounds(a: SceneBounds | null, b: SceneBounds | null): SceneBounds | null;
```

Constraints: pure, no React/three imports, no side effects.

### `src/components/sections/WellLegend.tsx`

```ts
interface WellLegendProps {
  wells: Array<{ wellId: string; name: string; color: string; isPrimary?: boolean; risk?: string; minDistanceFt?: number }>;
  selectedWellId: string | null;
  hiddenWellIds: Set<string>;
  onSelect: (wellId: string) => void;
  onToggleVisibility: (wellId: string) => void;
}
```

Constraints: no three/R3F imports; jsdom-safe.

### `AntiCollision3D` prop contract (extended)

```ts
interface AntiCollision3DProps {
  // existing: primaryTrajectory, adjacentTrajectory, result, wellData, onClose, entries
  selectedWellId: string | null;          // D4
  hiddenWellIds: Set<string>;             // D3 visibility
  wellColors: Record<string, string>;     // D6
  onSelect: (wellId: string) => void;     // D3
  onToggleVisibility: (wellId: string) => void;
}
```

## Affected Areas

| Area                                               | Impact      | Changes                                                                             |
|---------------------------------------------------|------------|------------------------------------------------------------------------------------|
| `src/engine/scene.ts`                              | New         | Common-frame, colors, bounds                                                        |
| `src/components/sections/WellLegend.tsx`           | New         | Legend panel                                                                        |
| `src/components/sections/AntiCollision3D.tsx`      | Modified    | `WellborePath` frame fix, marker fix, ellipsoid policy, camera, colors, legend embed|
| `src/components/sections/Anticolision.tsx`         | Modified    | Auto-seed, selection state, color map, legend wiring                                |
| `src/engine/mock-wells.ts`                         | Modified    | Add `MOCK_PRIMARY`                                                                  |
| `src/engine/scene.test.ts`, `Anticolision.test.tsx`| New/Modified| TDD suites                                                                          |

## Testing Strategy

| Layer                  | Focus                                                        | Runner              |
|-----------------------|-------------------------------------------------------------|--------------------|
| `scene.test.ts`        | Frame math (offset preservation), color stability, bounds    | vitest (jsdom)      |
| `WellLegend` tests     | Click-select, eye toggle, primary not hideable, hover tooltip| vitest + RTL (jsdom)|
| `Anticolision.test.tsx`| Auto-seed once, no overwrite of user data, wiring            | vitest + RTL (jsdom)|
| Manual                 | `npm run dev` — visual check of alignment, camera, ellipsoids| browser             |

## Risks / Mitigations

| Risk                                 | Likelihood  | Mitigation                                                            |
|-------------------------------------|------------|----------------------------------------------------------------------|
| Visual regression not caught by jsdom| Medium      | Pure math fully tested; manual dev check as explicit task             |
| Auto-seed conflicts with user data   | Medium      | Seed only when store empty of surveys+adjacent; at-most-once per mount|
| Camera focus on hidden wells         | Low         | Bounds recomputed from visible wells only                             |

## Rollout / Rollback

Additive (new files) + contained edits to two components; store schema untouched. Rollback = `git revert` of the change's commits. No migration.
