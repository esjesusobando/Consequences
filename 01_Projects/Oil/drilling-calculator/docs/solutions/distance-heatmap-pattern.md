---
title: "Distance Heatmap Pattern — Fase 3 Learnings"
category: best_practice
date: 2026-08-28
tags: [threejs, heatmap, ISCWSA, wellbore, drilling-calculator, color, bounds]
component: frontend_stimulus
root_cause: logic_error
severity: medium
last_updated: 2026-08-28
---

# Distance Heatmap Pattern — Fase 3 Learnings

## Problem

Color wellbore trajectories by proximity to nearest danger (other wellbores) with ISCWSA-defined thresholds. Required coordinate frame awareness for correct bounds merging.

## Learning 1: Distance Heatmap Color Thresholds

Color trajectories by proximity to nearest danger point. ISCWSA thresholds:

| Distance | Color | Meaning |
|----------|-------|---------|
| < 50 ft | Red | Critical — high collision risk |
| < 150 ft | Yellow | Warning — approaching danger zone |
| < 400 ft | Green | Safe — acceptable clearance |
| > 400 ft | Green | Safe — well separated |

**Complexity**: O(n × m) where n = primary wellbore points, m = adjacent wellbore points. For each primary point, iterate all adjacent points to find minimum distance. Acceptable for typical well counts (< 20 adjacent wells, < 500 points each).

**Implementation**: Compute `THREE.Color` array per primary wellbore. For each vertex, find closest adjacent point via Euclidean distance, then map to color using thresholds.

```typescript
// Pseudocode for distance color computation
function computeDistanceColors(
  primaryPoints: THREE.Vector3[],
  adjacentPoints: THREE.Vector3[][],
  thresholds = { red: 50, yellow: 150, green: 400 }
): THREE.Color[] {
  return primaryPoints.map((p) => {
    let minDist = Infinity;
    for (const well of adjacentPoints) {
      for (const q of well) {
        const d = p.distanceTo(q);
        if (d < minDist) minDist = d;
      }
    }
    if (minDist < thresholds.red) return new THREE.Color(0xff0000);
    if (minDist < thresholds.yellow) return new THREE.Color(0xffcc00);
    return new THREE.Color(0x00cc00); // green for both >150 and >400
  });
}
```

## Learning 2: WellborePath `distanceColors` Prop

The `WellborePath` component accepts a `distanceColors` prop (`THREE.Color[]`) that colors the tube geometry via vertex colors.

**Conflict with `useDepthGradient`**: These are mutually exclusive. Use `if/else` — never both. `useDepthGradient` applies a Z-axis gradient; `distanceColors` overrides with proximity-based coloring.

```typescript
// In WellborePath component
const colors = distanceColors ?? (useDepthGradient ? depthColors : null);
// Apply to buffer geometry as vertex color attribute
```

**Key detail**: Vertex colors must match the vertex count of the tube geometry. BufferGeometry's `setColorAttribute` requires an array sized to the tessellated tube vertices, not the original path points. Use `geometry.getAttribute('position').count` for sizing.

## Learning 3: Bounds Merge Coordinate Frame Issue

**Bug**: Primary wellbore subtracts surface offsets (local coordinate frame), but adjacent wellbores use raw (0,0) coordinates. Merging bounding boxes across mismatched frames produces incorrect camera framing — camera looks at the wrong region.

**Root cause**: Two coordinate systems coexist:
- Primary: `point - surfaceOffset` (local frame, origin at surface)
- Adjacent: raw coordinates (global frame, origin at 0,0)

**Fix**: Unify coordinate frames before merging bounds.

```typescript
// WRONG — mismatched frames
const primaryBounds = computeBounds(primaryLocalPoints);
const adjacentBounds = computeBounds(adjacentRawPoints); // different frame!
const merged = primaryBounds.union(adjacentBounds);

// CORRECT — unify first
const primaryLocal = primaryPoints.map(p => p.clone().sub(surfaceOffset));
const adjacentLocal = adjacentPoints.map(p => p.clone().sub(surfaceOffset));
const merged = computeBounds(primaryLocal).union(computeBounds(adjacentLocal));
```

**Prevention**: Always log `boundingBox.min` and `boundingBox.max` after merging. If values look off (e.g., extremely large ranges), check coordinate frame consistency.

## Prevention

1. **Distance thresholds**: Define ISCWSA thresholds as constants, not magic numbers. Reuse across heatmap, legend, and collision warning UI.
2. **Color prop conflicts**: Document mutual exclusivity in component JSDoc. TypeScript union types (`distanceColors | useDepthGradient`) make the conflict explicit.
3. **Coordinate frames**: Add a comment at every `.sub(surfaceOffset)` call noting the frame transform. When merging bounds from multiple sources, verify all inputs share the same frame.

## Files Affected

- `src/components/WellborePath.tsx` — distanceColors prop, vertex color application
- `src/utils/distance.ts` — computeDistanceColors, ISCWSA threshold constants
- `src/components/Scene.tsx` — bounds merging, coordinate frame unification
