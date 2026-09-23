# Proposal: Surpass competition with continuous uncertainty + forward cones (surpass-competition-anti-collision-3d)

Status: Proposed

## Intent

The 3D anti-collision view (`AntiCollision3D.tsx`) has a mathematically strong ISCWSA base (R-type separation factor, covariance eigen-decomposition, 95% ellipsoids) but its visualization layer lags the 2026 industry standard (Halliburton LOGIX, Innova VANTAGE, Baker Hughes WellArchitect/CoViz 4D). Today only a single closest-approach ellipsoid pair is drawn, so there is no *continuous* uncertainty picture along the wellbore and no forward projection — the core differentiator the competition shows and that no open-source tool offers.

The engine scaffolding for the differentiator already exists and is tested: `computeUncertaintyProfile()` already computes continuous per-station ISO 95% ellipsoids (`UncertaintyStation[]`), `computeForwardCone()` already projects the uncertainty halo ahead of the bit, and `UncertaintyCone`/`UncertaintyTube` R3F components are already written. This change's real work is **wiring that scaffolding into the live 3D render** so continuous ellipsoids + forward cones appear, plus the frame-unification, stable-color, camera-bounds and auto-seed polish that make the scene correct and production-credible. Delivering this P0 MVP makes Drilling Calculator the only open-source tool with continuous uncertainty visualization.

## Scope

### In Scope (P0 MVP — 2–3 sprints)

- **Continuous uncertainty ellipsoids**: render `UncertaintyStation[]` along every visible wellbore via `UncertaintyTube` (instanced mesh, risk/LOD coloring), not just the closest-approach pair.
- **Forward cones**: render `computeForwardCone()` output ahead of the bit via `UncertaintyCone`, projected along the last trajectory segment direction.
- **Frame unification**: render every trajectory (primary + adjacent) in the single primary-wellhead NE-TVD frame via one shared `commonFramePoint()` subtraction — removes the visual overlap-at-origin defect.
- **Stable color assignment**: `wellColor(id, ids)` from `scene.ts` keyed by `wellId` (survives risk re-sorts) for tubes, cones, paths, ellipsoids.
- **Camera bounds**: frame the camera over **all visible** wells via `visibleBounds()` (not only primary + one adjacent).
- **Auto-seed demo data**: on first mount when the store is empty of directional data, seed `MOCK_PRIMARY` + `MOCK_WELLS` (never overwrite user input).

### Out of Scope (later, iterative — not in P0)

- Traveling cylinders, separation-factor ladder plots, project-ahead engine, real-time WebSocket alerts, remote multi-well dashboard, casing/hole diameters in SF, custom IPM models.
- WebGL raycasting selection / in-view editing.
- Any change to the `anti-collision.ts` ISCWSA math (already correct and tested).

## Capabilities

### New Capabilities

- `anti-collision-3d-visualization`: continuous per-wellbore uncertainty ellipsoids + bit-forward cones, unified primary-wellhead frame, stable `wellId` colors, all-visible-wells camera framing, and auto-seeded demo scene.

### Modified Capabilities

- None. The `anti-collision-calculation` spec is unchanged (engine math untouched). Engine modules are referenced/consumed as-is.

## Approach

Phase-gated SDD pipeline with strict TDD (vitest + jsdom, red-green-refactor per task, `npm test`):

1. **Engine wiring (pure)**: extend `computeUncertaintyProfile()` call sites to be invoked per visible well with adjacent covariance; confirm `computeForwardCone()` projection along the last segment's direction. Pure, unit-tested — no React.
2. **Visual integration** (`AntiCollision3D.tsx`): mount `UncertaintyTube` (per well, wellId color, LOD/risk coloring) + `UncertaintyCone` (forward of bit) alongside `WellborePath`; route all wellbore paths through `commonFramePoint()`.
3. **Stable color + camera**: apply `wellColor()` palette across all 3D elements; compute camera bounds via `visibleBounds()` over all visible wells (replacing primary+adjacent-only).
4. **Auto-seed** (`Anticolision.tsx` section): seed `MOCK_PRIMARY` + `MOCK_WELLS` on first mount only when the store has no directional data.
5. **Verification**: `npm test`, `npx tsc --noEmit`, `npm run build`; manual `npm run dev` 3D check.

Impacted engine modules (explicit): `src/engine/uncertainty-engine.ts` (extend call sites / projection), `src/engine/scene.ts` (frame + color + bounds, already present, consumed). `src/engine/mock-wells.ts`, `src/engine/anti-collision.ts` unchanged semantics.

## Affected Areas

| Area                                                               | Impact      | Description                                                                                |
|-------------------------------------------------------------------|------------|-------------------------------------------------------------------------------------------|
| `src/components/sections/AntiCollision3D.tsx`                      | Modified    | Render continuous tubes + forward cones; frame unification; wellId colors; all-wells camera|
| `src/components/sections/Anticolision.tsx`                         | Modified    | Auto-seed demo data on first mount                                                         |
| `src/engine/uncertainty-engine.ts`                                 | Modified    | Per-well invocation; forward-cone projection along last segment                            |
| `src/engine/scene.ts`                                              | Consumed    | `commonFramePoint`, `wellColor`, `visibleBounds` reused                                    |
| `src/components/visuals/UncertaintyTube.tsx`, `UncertaintyCone.tsx`| Consumed    | Existing R3F visuals wired in                                                              |
| `src/engine/mock-wells.ts`                                         | Consumed    | `MOCK_PRIMARY`, `MOCK_WELLS` for auto-seed                                                 |
| `src/engine/*.test.ts`, `src/components/sections/*.test.tsx`       | New/Modified| TDD suites for wiring + behaviors                                                          |

## Risks

| Risk                                      | Likelihood  | Mitigation                                                                                                                   |
|------------------------------------------|------------|-----------------------------------------------------------------------------------------------------------------------------|
| Performance with 11+ continuous ellipsoids| Medium      | `UncertaintyTube` instanced mesh (single draw call), `getLodLevel()`/`computeStationLod()` segment reduction, frustum culling|
| 3D visual regressions not covered by jsdom| Medium      | Unit-test all engine/frame math; manual `npm run dev` check in phase 5                                                       |
| Auto-seed mutates global store            | Medium      | Seed only on first mount when store has no directional data; never overwrite user inputs                                     |
| Three/R3F version drift                   | Low         | Versions already pinned; keep `@react-three/fiber`/`drei` locked                                                             |

## Rollback Plan

Revert the change's commits with `git revert`. The change is additive/self-contained (new wiring in two components + engine call-site extensions); no schema or store-data migration, and the calculation engine (`anti-collision.ts`, spec `anti-collision-calculation`) is untouched, so reverting restores the prior single-ellipsoid visualization with zero migration.

## Dependencies

None beyond the existing stack (React 19, Three.js / react-three-fiber / drei, Zustand 5, Vitest 4). Reuses existing, tested `UncertaintyStation[]` pipeline, `scene.ts` helpers, and `MOCK_WELLS`/`MOCK_PRIMARY` presets.

## Effort Estimate

2–3 sprints (matches plan RICE: Reach 300, Impact 10, Confidence 0.9, Effort 3). Margin exists because the engine scaffolding is already built and tested; the core remaining work is integration in the 3D render layer.
