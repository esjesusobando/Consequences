# Proposal: Fix multi-well 3D anti-collision visualization (anti-collision-3d-wells)

Status: Proposed

## Intent

The 3D anti-collision view (`AntiCollision3D.tsx`) renders each well in its **own local frame** (each `WellborePath` re-relativizes by its own first point), so real surface offsets are lost and wells visually overlap at the origin. Ellipsoids and markers use the common NE-TVD frame, so the scene is internally misaligned. The closest-approach marker is internally inconsistent (line/spheres at local coords, label at absolute coords). There is no selection UX, colors are keyed by risk-sorted index (unstable across re-sorts), the camera only frames the primary plus one adjacent well, and the store ships with no demo data.

This change fixes the root cause (coordinate-frame unification around the primary wellhead), adds an HTML legend panel for selection/visibility/tooltip, shows ellipsoids + distance label only for the selected pair, stabilizes colors by `wellId`, frames the camera on all visible wells, and auto-seeds a demo scene (5 mock wells + mock primary) on first mount.

## Scope

### In Scope

- Unify all well trajectories in the primary-wellhead frame (single subtraction of `surfaceNorth/surfaceEast`).
- Fix `ClosestApproachMarker` internal consistency (group at `mid`, raw a/b vertices, Html label relative).
- New HTML legend panel (click-to-select, eye toggle visibility, hover tooltip) — jsdom-testable, no raycasting.
- Ellipsoids + distance label rendered only for the selected pair (reduces clutter).
- Stable per-`wellId` color assignment from a fixed palette.
- Camera framing (initial bounds + focus) computed over all visible wells.
- Auto-seed: load `MOCK_WELLS` (5 presets) + a new `MOCK_PRIMARY` on first mount.
- New pure helper `src/engine/scene.ts` (common-frame math) with tests.

### Out of Scope

- Engine changes: `anti-collision.ts` math (ISCWSA covariance, SF, min distance) is already correct and tested (T-AC1) — untouched.
- WebGL raycasting selection.
- Editing well data inside the 3D view.
- Performance optimizations beyond camera bounds (R3F `frameloop` tuning).

## Capabilities

### New Capabilities

- `anti-collision-3d-visualization`: common-frame multi-well 3D rendering with legend selection, visibility toggles, selected-pair ellipsoids, stable colors, and all-wells camera framing.

### Modified Capabilities

- None (`anti-collision-calculation` spec unchanged — engine untouched).

## Approach

Phase-gated SDD pipeline with strict TDD (`vitest + jsdom`, red-green per task):

1. **Scene helpers** (`scene.ts`): pure functions for common-frame mapping, color assignment, camera bounds — unit-tested.
2. **Legend** (`WellLegend.tsx`): pure HTML component — jsdom-tested (click/eye/hover).
3. **3D view fix** (`AntiCollision3D.tsx`): frame unification, marker fix, selected-pair ellipsoids, color map, all-wells camera.
4. **Section wiring** (`Anticolision.tsx`): auto-seed on first mount, selection state, legend render.
5. **Verification**: `npm test`, `npx tsc --noEmit`.

Impacted engine modules (explicit): `src/engine/scene.ts` (new), `src/engine/mock-wells.ts` (add `MOCK_PRIMARY`). `anti-collision.ts`, `directional.ts` unchanged.

## Affected Areas

| Area                                                                       | Impact      | Description                                                           |
|---------------------------------------------------------------------------|------------|----------------------------------------------------------------------|
| `src/components/sections/AntiCollision3D.tsx`                              | Modified    | Frame unification, marker fix, ellipsoid policy, camera bounds, colors|
| `src/components/sections/Anticolision.tsx`                                 | Modified    | Auto-seed, selection state, legend wiring                             |
| `src/components/sections/WellLegend.tsx`                                   | New         | HTML legend panel                                                     |
| `src/engine/scene.ts`                                                      | New         | Pure common-frame helpers                                             |
| `src/engine/mock-wells.ts`                                                 | Modified    | Add `MOCK_PRIMARY`                                                    |
| `src/components/sections/Anticolision.test.tsx`, `src/engine/scene.test.ts`| New/Modified| TDD suites                                                            |

## Risks

| Risk                                            | Likelihood  | Mitigation                                                                                                      |
|------------------------------------------------|------------|----------------------------------------------------------------------------------------------------------------|
| 3D visual regressions not covered by jsdom      | Medium      | Unit-test all frame math; manual `npm run dev` check in phase 5                                                 |
| Auto-seed surprises users (mutates global store)| Medium      | Seed only on first mount when `adjacentWells` empty and store has no directional data; never overwrite user data|
| Color/flavor churn in legend                    | Low         | Single palette constant in `scene.ts`, keyed by `wellId`                                                        |

## Rollback Plan

Revert the change's commits. All changes are additive or self-contained (new files + two modified components); engine outputs and store schema are untouched, so `git revert` restores prior behavior with zero migration.

## Dependencies

None beyond existing stack (React 19, three/R3F, Zustand, vitest). Uses existing `MOCK_WELLS` presets and `getPresetAsAdjacent`.
