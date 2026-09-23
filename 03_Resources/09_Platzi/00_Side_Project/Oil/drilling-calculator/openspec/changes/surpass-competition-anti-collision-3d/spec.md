# Delta Spec: Continuous Uncertainty + Forward Cones (surpass-competition-anti-collision-3d)

Status: Specified
Baseline domain: `anti-collision-3d-visualization` (existing specs AC3D-1..7 from `anti-collision-3d-wells`, plus `anti-collision-3d-sota-viz`). This delta extends the existing 3D visualization behavior; the `anti-collision-calculation` engine (`anti-collision.ts`) is untouched.

## Intent traceability

This spec delivers the P0 MVP differentiator: continuous per-wellbore uncertainty + forward cones in the live 3D render, plus the frame-unification, stable-color, camera-bounds and auto-seed polish that make the scene correct. Each requirement traces to a proposal scope bullet.

- --

## ADDED Requirements

### Requirement R1: Continuous uncertainty ellipsoids per visible wellbore

The system SHALL render a continuous uncertainty tube (`UncertaintyTube`, instanced mesh) along **every visible wellbore** — primary and each visible adjacent entry — from `computeUncertaintyProfile()` output for that well. This replaces the current single closest-approach-pair ellipsoid as the continuous uncertainty picture. `(Proposal: Continuous uncertainty ellipsoids)`

#### Scenario: Tube renders along every visible well

- GIVEN a scene with a primary and N visible adjacent wells, each with ≥2 station trajectories
- WHEN the 3D view renders
- THEN an `UncertaintyTube` instance is mounted for each well at that well's `wellColor`
- AND station count ≤ 1 renders a single-station ellipsoid (no tube) without error

#### Scenario: Hidden well shows no tube

- GIVEN K visible wells and a well hidden via the legend eye toggle
- WHEN the scene renders
- THEN exactly K `UncertaintyTube` instances are mounted and the hidden well's tube is absent

#### Scenario: Combined covariance per station

- GIVEN a well adjacent to the primary
- WHEN its tube is computed
- THEN `computeUncertaintyProfile()` is invoked with `adjacentTrajectory` set, and ellipsoid axes/centers reflect combined uncertainty

### Requirement R3: Forward cone ahead of the bit

The system SHALL render a forward uncertainty cone (`UncertaintyCone`) ahead of the **bit** (end of the primary trajectory) for the primary well, projected along the last trajectory segment's direction, using `computeForwardCone()` radii. `(Proposal: Forward cones)`

#### Scenario: Cone projects along last segment

- GIVEN a primary trajectory whose last two points define direction D
- WHEN the cone renders
- THEN the cone axis follows D from the last point forward, and radius grows per `computeForwardCone(maxRadius, k, slices)`

#### Scenario: Cone not rendered without enough stations

- GIVEN a primary trajectory with <2 points
- WHEN the scene renders
- THEN no forward cone is mounted (no projection possible)

### Requirement R5: Forward-cone direction is frame-consistent

The `computeForwardCone()` call site SHALL consume a projection seeded by the primary's last segment direction, in the common NE-TVD frame, so the returned radii profile is positioned and oriented correctly. `(Proposal: Approach 1 — projection along last segment)`

#### Scenario: Flat/vertical last segment still yields a forward projection

- GIVEN a primary whose last segment has zero horizontal displacement (vertical drop)
- WHEN the cone projects
- THEN the projection falls back to a consistent forward axis instead of a zero/degenerate direction

- --

## MODIFIED Requirements

### Requirement R2: Frame unification to primary wellhead (MODIFIED AC3D-1)

Every trajectory (primary + adjacent) SHALL render in the **primary** wellhead NE-TVD frame: `WellborePath` and uncertainty centers SHALL map points via the shared `commonFramePoint(p, primarySurfaceE, primarySurfaceN)` subtraction, NOT each well's own surface. This removes the visual overlap-at-origin defect. `(Previously: AC3D-1 required the shared frame, but the render path passed per-well surface offsets to `WellborePath`, so adjacent wells could overlap at origin.)`

#### Scenario: Adjacent wells keep true relative offsets

- GIVEN a primary at (0,0) and an adjacent well with `wellheadNorth: 300`
- WHEN every path/tube renders with the primary surface offsets applied
- THEN the adjacent geometry sits ≈300 north of origin and does not overlap the primary at origin

#### Scenario: Primary anchors the origin

- GIVEN any valid scene
- WHEN `WellborePath` and `UncertaintyTube` map the primary
- THEN each point maps to `(east − primaryEast, −tvd, north − primaryNorth)` and the primary wellhead is the origin

### Requirement R4: Stable wellId colors across all 3D elements (MODIFIED AC3D-5)

`wellColor(wellId, ids)` SHALL be the single color source for tubes, cones, wellbore paths, and closest-approach ellipsoids — keyed by `wellId` so risk re-sorts cannot shift colors. `(Previously: AC3D-5 keyed stable colors; tubes/cones were not yet routed through `wellColor`.)`

#### Scenario: Color stable across re-sort

- GIVEN the result matrix re-sorts by risk
- WHEN the view re-renders tubes, cones, and paths
- THEN each `wellId` keeps its palette color; color depends only on `wellId`

#### Scenario: Primary resolves to palette[0]

- GIVEN the primary `wellId = PRIMARY_WELL_ID`
- WHEN its tube/cone/path render
- THEN its color is `SCENE_COLORS[0]`

### Requirement R6: Camera bounds over all visible wells (MODIFIED AC3D-6)

Initial camera bounds and focus SHALL derive from `visibleBounds()` over **all visible** wells (primary + every visible entry), honoring the legend hidden set — replacing any primary-plus-one-adjacent heuristic. `(Previously: AC3D-6 required all-well framing; the render must actually route through `visibleBounds()`, including the hidden-well filter.)`

#### Scenario: Bounds contain every visible trajectory

- GIVEN five visible wells spread across the scene
- WHEN the camera initializes or refocuses
- THEN the bounding box contains all five trajectories

#### Scenario: Hidden well excluded from bounds

- GIVEN a scene where one well is hidden via the eye toggle
- WHEN `visibleBounds()` computes
- THEN the hidden well's extremes are excluded from center/extent

### Requirement R7: Demo auto-seed on empty directional store (MODIFIED AC3D-7)

On first mount, when the store holds **no directional surveys**, the section SHALL seed the demo: `MOCK_PRIMARY` as primary trajectory and the `MOCK_WELLS` presets as adjacent entries. The seed SHALL run at most once per mount and SHALL NOT overwrite user-entered data. `(Previously: AC3D-7 required auto-seed; this re-affirms the trigger predicate and one-shot, no-overwrite guarantees for the wired behavior.)`

#### Scenario: Empty store seeds the demo on first mount

- GIVEN a fresh store with zero directional surveys
- WHEN the section mounts
- THEN the 5 preset wells render as adjacent entries and a mock primary trajectory renders

#### Scenario: Existing user data never overwritten

- GIVEN a store already holding user surveys and/or adjacent wells
- WHEN the section mounts
- THEN the user data is unchanged and no seeding occurs

- --

## Edge Cases

### EC-1: Empty adjacent trajectory

- GIVEN an adjacent entry with an empty trajectory (no stations)
- WHEN `computeUncertaintyProfile()` / tube renders for that well
- THEN no `UncertaintyTube` is mounted for it (no crash), and it is excluded from bounds

### EC-2: <2 station trajectory

- GIVEN a well trajectory with fewer than 2 stations
- WHEN its uncertainty tube would render
- THEN `UncertaintyTube`/`UncertaintyCone` degrade safely (single-station ellipsoid or skipped); the view does not throw

### EC-3: No directional data in store (auto-seed trigger)

- GIVEN the store has zero directional surveys AND zero adjacent wells
- WHEN the section mounts
- THEN auto-seed loads `MOCK_PRIMARY` + `MOCK_WELLS`; seeding runs once even across repeated re-renders within the mount

### EC-4: Hidden wells via legend toggle

- GIVEN a well toggled hidden in the legend
- WHEN tubes/cones/paths and camera bounds update
- THEN the hidden well's tube/cone/path are not rendered and its geometry is excluded from `visibleBounds()`

### EC-5: Primary trajectory < 2 points

- GIVEN a primary trajectory with fewer than 2 points
- WHEN the scene renders
- THEN no tube and no forward cone render for the primary; the view remains stable (no runtime error)

- --

## Non-functional

### N1: Performance (continuous tubes)

- The `UncertaintyTube` SHALL be an `InstancedMesh` (single draw call) with auto-LOD lowering segment counts as station count grows (high >8 → low, >4 → medium) to bound draw calls with 11+ wells. Target: scene renders with ≤2 extra draw calls vs. the pre-change single-pair baseline at 11 wells.

### N2: Test coverage

- The changed pure wiring (frame subtraction vector, `visibleBounds` exclusion, `computeForwardCone` projection direction, `computeUncertaintyProfile` per-well invocation, empty/＜2-point guards) SHALL be unit-tested under vitest+jsdom (red-green-refactor). Visual-only regressions not covered by jsdom are verified manually in dev.

### N3: Type safety & build

- `npx tsc --noEmit` SHALL pass with zero errors and no `any` at the build boundary. Specs SHALL NOT alter `anti-collision.ts` semantics (engine math untouched).

### N4: No new dependencies

- The change SHALL add no new npm dependencies; it consumes the existing `UncertaintyTube`, `UncertaintyCone`, `scene.ts` helpers, and mock presets.
