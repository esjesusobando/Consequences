- --
title: "AntiCollision3D review fixes — correctness, performance, and maintainability"
module: "3d-viewer"
date: "2026-08-28"
problem_type: "best_practice"
component: "frontend_stimulus"
severity: "high"
tags:
  - "3d-rendering"
  - "react-performance"
  - "heatmap"
  - "collision-detection"
  - "code-review"
  - "stack-overflow"
  - "bounding-box"
  - "usememo"
- --

# AntiCollision3D Review Fixes

## Problem

After implementing the professional 3D anti-collision viewer (Fases 1-3), a comprehensive 4-reviewer ce:review session identified 5 P0 correctness bugs, 6 P1 issues, 7 P2, and 4 P3 findings across correctness, maintainability, performance, and testing dimensions.

## Fixes Applied

### P0 — Critical Correctness

| #  | Fix                                                   | Root Cause                                                     | Lesson                                                  |

|---|------------------------------------------------------|---------------------------------------------------------------|--------------------------------------------------------|
| 1  | `realMinDistance` loops ALL entries                   | Was only checking `entries[0]`, missing true global minimum    | Always iterate full collection when computing aggregates|
| 2  | `Math.min(...sfs)` → `sfs.reduce()`                   | Spread operator stack-overflowing on large arrays (~120K+)     | Never use spread on unbounded arrays; use `reduce`      |
| 3  | Heatmap `t` clamped to `1 - 1e-6`                     | Off-by-one: `t=1.0` caused `distanceColors[ci+1]` out-of-bounds| Float interpolation at boundary needs epsilon guard     |
| 4  | `SurveyStationPoint` extracted with own state         | Single `hoveredIdx` re-rendered ALL N spheres on every hover   | Isolate hover state per interactive element             |
| 5  | `computeDistanceHeatmap` bbox prefilter + squared dist| O(P×ΣAᵢ) with no spatial skip; `Math.sqrt` on every pair       | Use squared distance comparison + AABB early rejection  |

### P1 — Important

| #  | Fix                                         | Why                                                                              |

|---|--------------------------------------------|---------------------------------------------------------------------------------|
| 6  | Comment for adjacent coords local assumption| Adjacent segments use local coords (surfaceEast=0), not documented in type system|
| 7  | `labelsOnlyMode` dev warning in `useEffect` | Controlled/uncontrolled mismatch warning was firing every render                 |
| 8  | `bounds` wrapped in `useMemo`               | Recomputing `THREE.Vector3` every render → geometry rebuild cascade              |
| 10 | `distanceColors` stabilized with `useRef`   | Reference changes trigger expensive geometry rebuild                             |

### Safe Auto (also applied)

- `VIEWS` → `as const` with `ViewMode` type
- `adjacentBounds` fallback simplified (was redundantly reconstructing `primaryBounds`)
- Risk color logic consolidated into `getRiskColorFromSF()` utility

## Code Examples

### Before: Stack overflow on large arrays

```tsx
// DANGEROUS: spread operator on unbounded array
const minSF = sfs.length > 0 ? Math.min(...sfs) : Infinity;
```

### After: Safe reduce

```tsx
const minSF = sfs.length > 0 ? sfs.reduce((m, v) => Math.min(m, v), Infinity) : Infinity;
```

### Before: Off-by-one heatmap interpolation

```tsx
const t = i / (totalVertices - 1); // t=1.0 at last vertex
const ci = Math.min(Math.floor(t * colorCount), colorCount - 2);
const c1 = distanceColors[ci + 1]; // OUT OF BOUNDS when t=1.0
```

### After: Epsilon guard

```tsx
const t = Math.min(i / Math.max(totalVertices - 1, 1), 1 - 1e-6);
const frac = Math.max(0, Math.min(1, (t * colorCount) - ci));
```

### Before: O(P×A) with sqrt on every pair

```tsx
for (const adj of adjacentSegments) {
  for (const a of adj) {
    const dist = Math.sqrt(dx*dx + dz*dz + dy*dy); // expensive
    if (dist < minDist) minDist = dist;
  }
}
```

### After: Squared distance + bounding box prefilter

```tsx
// Precompute AABB per adjacent well
const adjBoxes = adjacentSegments.map((adj) => { /* ... */ });

// Skip entire well if primary point is farther than SAFE_DIST from box
const closestE = Math.max(box.minE, Math.min(px, box.maxE));
const boxDistSq = (px-closestE)**2 + ...;
if (boxDistSq > SAFE_DIST_SQ) continue;

// Compare squared distances (no sqrt needed for ordering)
const distSq = dx*dx + dz*dz + dy*dy;
if (distSq < minDistSq) minDistSq = distSq;
```

## Prevention

1. **Spread operator ban**: Never use `Math.min(...unboundedArray)`. Always use `reduce`.
2. **Float boundary guards**: When interpolating with `t ∈ [0, 1]`, clamp to `1 - epsilon` before indexing.
3. **Per-element hover state**: Extract individual interactive elements into their own `React.memo` components with local `useState`.
4. **Spatial prefilter**: For O(N×M) distance computations, add AABB early rejection when N or M is large.
5. **useMemo for geometry inputs**: Any computation that creates `THREE.Vector3` or similar objects should be memoized.
6. **useRef stabilization**: When a memo returns a new array reference on every call, gate with `useRef` + value comparison.

## Testing

- 10 tests in `AntiCollision3D.test.tsx` covering: `computeBounds`, `ClosestApproachMarker`, `WellborePath` transforms, `mergeBounds`, `realMinDistance`
- Full suite: 28/28 test files, 235/235 tests passing
- `tsc --noEmit` clean

## Related

- `docs/solutions/best-practices/anti-collision-professional-features.md` — Fase 1 features
- `docs/solutions/best-practices/survey-station-markers-pattern.md` — Fase 2 pattern
- `docs/solutions/distance-heatmap-pattern.md` — Fase 3 heatmap
