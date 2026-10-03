# Design — Continuous Uncertainty + Forward Cones

* *Change**: `surpass-competition-anti-collision-3d`
* *Phase**: Design
* *Status**: Draft for Tasks

- --

## 1. Context & Goal

The current 3D view draws wellbore paths, survey-station markers, a single 95% ellipsoid at the closest-approach pair, and a 2D risk color plan. Competitors show the *continuous* positional uncertainty along every wellbore plus a forward look-ahead cone ahead of the current bit position.

This change wires in the already-existing but **unused** uncertainty primitives — `UncertaintyTube`, `UncertaintyCone`, `computeUncertaintyProfile`, `computeForwardCone` (all present in `src/components/visuals/` and `src/engine/`, none referenced by `AntiCollision3D.tsx`) — and unifies the NE-TVD frame used by every rendered element so all trajectories, tubes, cones, ellipsoids, markers, and the camera sit in the **primary-wellhead frame**.

Calculation engine (`anti-collision.ts`) stays untouched (per spec).

- --

## 2. Frame contract (foundation for everything below)

Verified data flow (source order matters):

1. **Primary trajectory** is delivered in **absolute state-plane coordinates**. `FALLBACK_PRIMARY_TRAJECTORY` is `calculateTrajectory(MOCK_PRIMARY.surveys, 10,000,000, 500,000)` — i.e. `surfaceNorth`/`surfaceEast` from `FALLBACK_WELL_DATA` baked in. The store's own trajectory uses the same `DEFAULT_WELL` offsets.
2. **Adjacent trajectories** are delivered **relative to the origin (= primary wellhead)**: `analyzeCollisionMatrix` computes each entry's trajectory via `calculateTrajectory(surveys, ownWellheadNorth, ownWellheadEast)` where mock offsets are small (`300 N`, `500/500`, `-250 N`, `1200 E`). They must **not** be further displaced.
3. Current render already encodes this asymmetry correctly:
   - Primary `WellborePath`/bound/ellipsoid: `east - (wellData.surfaceEast ?? 0)`, `north - (wellData.surfaceNorth ?? 0)` (lines 1469-1471, 1505-1507).
   - Adjacent `WellborePath`/markers: `surfaceEast={0}`, `surfaceNorth={0}` with the explicit comment "Adjacent trajectories are already in local coordinates … do NOT subtract the primary well's state-plane surface coordinates" (lines 1445-1449).
   - `ClosestApproachMarker`: `pointA` subtracts primary surface, `pointB` does not (lines 1488-1493) — codified by `AntiCollision3D.test.tsx` "offset asymmetry".

### ADR-1 — Per-well offsets, not global subtraction

* *Rule**: every rendered point maps as `commonFramePoint(p, offsetE, offsetN)` (scene.ts) with **per-well offsets**: `primary → (wellData.surfaceEast, wellData.surfaceNorth)`, `adjacent → (0, 0)`.

* *Why not the spec-literal global rule** ("subtract the primary wellhead from every trajectory")? The data contract delivers adjacent trajectories already relative to the primary wellhead. Applying the primary's ~10,000,000-ft state-plane offsets to an adjacent point at `300` would place it ≈ −9,999,700 ft from origin — the scene would collapse into a void. The spec-literal model assumes a single absolute frame for all wells (the model `scene.test.ts`/`visibleBounds` simulate with synthetic absolute data); the fallback/store pipeline does not follow that model. The scenario in R2 ("primary at (0,0), adjacent wellheadNorth 300 → sits ≈300 north of origin") is satisfied identically by the per-well rule.

* *The actual R2 defect** is in the *untested new wiring*, not the paths: `computeUncertaintyProfile` (uncertainty-engine.ts) returns **raw centers** (`center = {north: p.north, east: p.east, tvd: -p.tvd}`; its comment "relative to primary wellhead" is misleading — no subtraction happens). Wiring raw centers directly → primary tube floats at 10,000,000 ft while its path renders at origin. Fix **at the render boundary** with a small mapper (engine stays pure):

```ts
// render-boundary helper (AntiCollision3D.tsx or scene.ts)
const toCommonFrame = (p: TrajectoryPoint, eOff = 0, nOff = 0) => ({
  east: p.east - eOff,
  north: p.north - nOff,
  tvd: -p.tvd,
});
```

Primary stations: `eOff = wellData.surfaceEast ?? 0`, `nOff = wellData.surfaceNorth ?? 0`. Adjacent stations: `(0, 0)`. Tube/cone stations arrays are pre-mapped before passing to the visual components — the components themselves are untouched (they already receive `stations` and have no frame knowledge).

### ADR-2 — Camera framing must keep the per-well convention

`scene.ts` `visibleBounds(entries, primarySurface)` maps **every** entry through the primary surface (scene.test.ts "anchors all trajectories through the primary wellhead frame"). Merged against origin-relative fallback data, bounds would span −9,999,700 … +1000 ft and the camera would float in a void.

* *Decision**: keep the existing `computeBounds`-based merged bounds (AntiCollision3D.tsx 1076-1105) for camera framing; **do not** rewire to `visibleBounds` in this change. Note at the call site that `visibleBounds` becomes viable only when the data contract is normalized to a single absolute frame (future change). This keeps R4 (camera fits all wells) correct with zero risk.

### ADR-3 — Cone direction (R5): feed the last-segment direction explicitly

`UncertaintyCone` anchors/rotates its geometry to the **start-station ellipsoid** orientation (ExtrudeGeometry profile extruded along the station's `axes[0]` eigenvector, rotated `-PI/2` about X). The spec requires the cone to project along the **last segment direction** `D` in the common NE-TVD frame (and a deterministic fallback when the last segment is flat or vertical).

* *Decision**: keep `UncertaintyCone` geometry as-is; **pre-rotate the stations** in the render boundary before passing them — build the forward stations, rotate them by `D` about the cone origin so the cone's intrinsic axis aligns with `D` (and the ellipse cross-sections with it). Fallback when the last segment has `inc ≈ 0` (flat) or `inc ≈ 90` (vertical): use `azi = 0` direction (map to +North) or `azi` of the last station respectively; document the choice in a `ponytail:`-style comment at the call site. The alternative (a `direction` prop on `UncertaintyCone`) adds component surface area for no benefit — one call site.

### ADR-4 — Visibility rules (R1/R3)

- Per visible well: `UncertaintyTube` from `computeUncertaintyProfile(well.trajectory, tool, sfK)`, stations mapped by the per-well offset rule (ADR-1).
- Single station → render a single ellipsoid at that station (R1); `< 2` points → no tube.
- `UncertaintyCone` only for the **primary well** (ahead of the bit = last primary station); `< 2` primary points → no cone (R3).
- Hidden wells (`hiddenWellIds`) → no tube, no cone, no markers (reuse the existing `isHidden` gate at lines 1435-1452).
- Tubes/cone are **data, not chrome** → render regardless of `labelsOnlyMode`; existing `showChrome` gates stay for ellipsoids/markers.

### ADR-5 — Props and the stale mount

Extend `AntiCollision3DProps` (lines 22-36) with optional, defaulted props:

```ts
uncertaintyOpacity?: number;   // default 0.25 (matches UncertaintyTube default)
coneLength?: number;           // default 1000 ft
coneVisible?: boolean;         // default true
```

`Anticolision.tsx` mount at line 782 passes six props absent from the interface (`selectedWellId, wellColors, onSelectWell, onToggleVisibility, effectiveSelectedWellId, effectiveSelectedEntry`). These are dead — nothing in `AntiCollision3D` consumes them (grep confirmed). **Decision**: remove the six dead props from the 782 mount (and check the 872 mount). Do not add them to the interface. Smallest diff, and prevents future confusion when the interface grows with the new props.

### ADR-6 — Colors and performance

- Colors: keep `wellColor(entry.wellId, [PRIMARY_WELL_ID, ...entries.map(e => e.wellId)])` (existing line 1433) — stable under risk re-sorts (D6). No change.
- Performance: 11 wells × ~eg 16-segment instanced spheres is one draw call each via `InstancedMesh` (autoLOD active). Cone: single primitive, gated to primary only. No new dependencies.

- --

## 3. Component changes

| File                                         | Change                                                                                                                                                                                                                                                                                                                                                                                                      |
|---------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `src/components/sections/AntiCollision3D.tsx`| Add `UncertaintyTube`/`UncertaintyCone` imports (verify: no current import — grep confirmed absent). Add `uncertaintyOpacity`, `coneLength`, `coneVisible` props + defaults. Add `toCommonFrame` mapper (ADR-1). Per entry: profile → mapped stations → tube, gated by hidden/`<2`. For primary: forward cone (R5) at last station, rotated by `D` (ADR-3). Keep merged bounds (ADR-2). Remove nothing else.|
| `src/components/sections/Anticolision.tsx`   | Remove the six dead props at mount 782 (ADR-5). No new props needed (well color/trajectory/result already flow).                                                                                                                                                                                                                                                                                            |
| `src/engine/scene.ts`                        | Optional: export the `toCommonFrame` mapper instead of inline; no change to `visibleBounds` (ADR-2).                                                                                                                                                                                                                                                                                                        |
| Tests                                        | See §5.                                                                                                                                                                                                                                                                                                                                                                                                     |
| `docs/` + READMEs                            | Update per pre-commit doc rule for touched folders.                                                                                                                                                                                                                                                                                                                                                         |

Engine files (`anti-collision.ts`, `uncertainty-engine.ts`, `directional.ts`, `mock-wells.ts`, `fallback-data.ts`) and visual components (`UncertaintyTube.tsx`, `UncertaintyCone.tsx`) are **read-only** in this change.

- --

## 4. Data flow (render path)

```
Anticolision (782)
 └─ AntiCollision3D
     ├─ primaryTrajectory (absolute state-plane)
     │    ├─ WellborePath      → commonFramePoint(p, wellData.surfaceE/N)
     │    ├─ UncertaintyTube   → profile(primary, MWD, 2.0) → stations mapped by (surfaceE/N)
     │    └─ UncertaintyCone   → computeForwardCone(last segment, coneLength)
     │                            → stations rotated by D (flat/vertical fallback) at last station
     └─ entries[] (origin-relative)
          ├─ WellborePath      → offsets (0,0)
          └─ UncertaintyTube   → profile(entry.trajectory) → stations mapped by (0,0)
```

- --

## 5. Testing

Port the existing reimplementation style (`AntiCollision3D.test.tsx` re-implements `computeBounds`; `scene.test.ts` tests `commonFramePoint`). New cases:

1. **Frame mapping**: primary station `{north: 10_000_300, east: 500_300}` mapped with `(500_000, 10_000_000)` → `(300, 300, -tvd)`; adjacent station `{north: 300, east: 0}` mapped with `(0,0)` → unchanged. Proves the R2 scenario precisely.
2. **No-overlap, primary surface ≠ 0**: adjacent at wellheadNorth 300 stays 300 ft north of origin (regression against any future "subtract primary surface everywhere" attempt).
3. **Single station** → single ellipsoid, not a tube; `< 2` points → no tube; `< 2` primary points → no cone (R1/R3).
4. **Hidden well** → no tube rendered (R1) — reuse `hiddenWellIds` gate.
5. **Cone fallback**: last segment `inc=0` (flat) and `inc≈90` (vertical) → forward axis fallback (R5); assert the rotated stations point along the fallback axis, not NaN.
6. **`labelsOnlyMode`**: tubes/cone still present; chrome absent.

Contract tests that must NOT flip (current behavior is the intended contract): "primary subtracts surface", "adjacent uses 0,0", "ClosestApproachMarker asymmetry".

- --

## 6. Known pre-existing issue (out of scope, flagged)

The analysis path is **frame-blind**: `closestTrajectoryPoints` computes raw Euclidean distance between primary points (absolute, ~10,000,000) and adjacent points (origin-relative, ~300), i.e., nominal distances are dominated by the primary's state-plane offsets. This predates this change, the spec explicitly excludes the calculation engine, and the demo's risk outputs are driven by the same `FALLBACK_MATRIX` consumed today. Add a code comment at the analysis call site in `Anticolision.tsx` noting the frame asymmetry; normalize frames as a follow-up change (it intersects ADR-2's `visibleBounds` normalization).

- --

## 7. Rollback

Revert the two component files' diffs (§3); engine, visuals, and tests for the engine are untouched, so the seam is one commit-size. Contract tests added in §5 double as the regression guard.
