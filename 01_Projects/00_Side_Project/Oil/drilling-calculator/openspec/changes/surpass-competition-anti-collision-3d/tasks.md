# Tasks — surpass-competition-anti-collision-3d

Change: `surpass-competition-anti-collision-3d` — Continuous uncertainty + forward cones
Spec status: Specified. Design status: Draft for Tasks. Created by `sdd-tasks`, updated by `sdd-apply` (checkbox `[x]` per completed task).

Legend: `(P1|P2|P3)` priority · `~Nm` effort · **BC** = acceptance criteria (traced to spec scenarios/edge cases) · **Deps** = must-run-before.

- --

## Meta

| Item             | Value                                                                                                                                                                 |
|-----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Stack            | React 19, TypeScript 5.9 (strict), Vite 7, Vitest 4, Zustand 5, Three.js/r3f/drei, no Tailwind                                                                        |
| TDD mode         | **STRICT (red-green-refactor)** — every change task is preceded by its RED test task                                                                                  |
| Test command     | `npm test` (vitest run). Boundary checks: `npx tsc --noEmit` (zero errors, no `any`), `npm run build`                                                                 |
| Constraints      | `anti-collision.ts`, `uncertainty-engine.ts`, `directional.ts`, `mock-wells.ts`, `fallback-data.ts` **read-only** (spec N4 / design §3). No new npm dependencies (N4).|
| Delivery strategy| Not passed by orchestrator → default `ask-on-risk` assumed. No chained PRs recommended (see Review forecast).                                                         |

### Review workload forecast

- Estimated diff: **~350–450 lines** (implementation ~130–160 across 3 component files incl. tests-authored additions; tests ~200–260; docs ~20–40).
- Risk: **Medium** (borderline vs. the 400-line budget; all wrapped in one component section + one test surface, no engine changes).
- Chained PRs recommended: **No** — single PR justified: design §7 rollback seam is one commit-size (two component files; engine/visuals/tests-for-engine untouched) and the new contract tests double as the regression guard.
- **Decision needed before apply: Yes** — R1/R4 require tubes colored by `wellColor(wellId)` but `UncertaintyTube` exposes no color prop (verified: props are `stations, opacity, lod, riskColoring, autoLOD, camera`). Design §3 marks the visual components read-only. **Spec wins**: the smallest compliant change is a minimal additive `color?: string` prop on `UncertaintyTube` (default preserves current behavior; contract tests pin the default path). See T3.4. Confirm this deviation before apply; alternative (route `riskColoring`) violates R4's "color depends only on `wellId`" scenario.

### Known component caveats (wiring must not rely on them)

1. `UncertaintyTube` single-station branch renders a sphere at **world origin** (no `position` set) — the call site must gate `stations.length >= 2` for the tube and render a single-station ellipsoid at the **mapped center** itself (R1 EC-2). Mark with a `ponytail:`-style comment (spec N4).
2. `computeUncertaintyProfile` returns **raw centers** (`{north: p.north, east: p.east, tvd: -p.tvd}`; no subtraction happens despite its comment) — always map through `toCommonFrame` (ADR-1) before passing to visuals.

- --

## Phase 1 — Engine wiring / render boundary helpers

### 1.1 RED — Frame-mapping tests (R2)

- [ ] (P1) T1.1 — Frame mapping tests for `toCommonFrame`. ~20m. `src/components/sections/AntiCollision3D.test.tsx` — Port design §5 case 1: primary station `{north: 10_000_300, east: 500_300, tvd: X}` mapped with `(500_000, 10_000_000)` → `(300, 300, -X)`; adjacent station `{north: 300, east: 0, tvd: Y}` mapped with `(0, 0)` → unchanged. Fail RED against current code (mapper does not exist).
  - BC: R2 scenario "Primary anchors the origin" + "Adjacent wells keep true relative offsets". |
  - Deps: none.

### 1.2 GREEN — `toCommonFrame` mapper (ADR-1)

- [ ] (P1) T1.2 — Implement render-boundary mapper. ~20m. `src/components/sections/AntiCollision3D.tsx` (or optionally export from `src/engine/scene.ts` — design §3) — add `const toCommonFrame = (p: TrajectoryPoint, eOff = 0, nOff = 0) => ({ east: p.east - eOff, north: p.north - nOff, tvd: -p.tvd })`. Primary stations use `eOff = wellData.surfaceEast ?? 0`, `nOff = wellData.surfaceNorth ?? 0`; adjacent stations use `(0, 0)`. Engine stays pure — this is the only place frames are reconciled.
  - BC: T1.1 passes GREEN; `anti-collision.ts`/`uncertainty-engine.ts` untouched.
  - Deps: T1.1.

### 1.3 RED — Cone-fallback tests (R5)

- [ ] (P1) T1.3 — Tests for forward-station builder direction + fallback. ~25m. `src/components/sections/AntiCollision3D.test.tsx` — last segment `inc=0` (flat) and `inc≈90` (vertical) → projected forward stations point along the fallback axis (flat → +North/`azi=0`; vertical → last station `azi`) and hold no `NaN` centers/axes. RED first (builder absent).
  - BC: R5 scenario "Flat/vertical last segment still yields a forward projection"; EC-5 (`<2` points → no cone, no throw).
  - Deps: T1.2 (mapper in scope).

### 1.4 GREEN — Forward-station builder rotated by D (ADR-3)

- [ ] (P1) T1.4 — Build forward-cone stations. ~30m. `src/components/sections/AntiCollision3D.tsx` — for the primary well only: derive last-segment direction `D` from the last two mapped primary points (common NE-TVD frame); call `computeForwardCone(primary, { k: DEFAULT_SF_K, maxRadius: coneLength, slices })` for radial growth; synthesize stations along `D` from the bit, **pre-rotated** so `UncertaintyCone`'s intrinsic axis (start-station `axes[0]`, extruded with `-PI/2` X-rotation) aligns with `D`. Flat/vertical fallback per T1.3. Add a `ponytail:`-style comment naming the fallback choice (spec N4 / ADR-3).
  - BC: R3 scenario "Cone projects along last segment" (axis follows `D`, radius grows per `computeForwardCone`) + T1.3 passes.
  - Deps: T1.3.

### 1.5 GREEN — New props (ADR-5)

- [ ] (P1) T1.5 — Extend `AntiCollision3DProps`. ~15m. `src/components/sections/AntiCollision3D.tsx` (interface lines ~22–40) — add optional, defaulted `uncertaintyOpacity?: number` (default `0.25`, matches `UncertaintyTube`), `coneLength?: number` (default `1000` ft), `coneVisible?: boolean` (default `true`). Defaults keep current renders byte-identical.
  - BC: `AntiCollision3D.test.tsx` compile + existing suite green; defaults verified in component.
  - Deps: none (interface only).

- --

## Phase 2 — Visual integration (UncertaintyTube + UncertaintyCone)

### 2.1 RED — Tube mount-rule tests (R1, EC-1/2/5, design §5)

- [ ] (P1) T2.1 — Tube behavior tests, fail RED. ~30m. `src/components/sections/AntiCollision3D.test.tsx` — assert, per visible well: exactly one `UncertaintyTube` mounted for K visible wells and none for a legend-hidden well (R1 hidden scenario); `computeUncertaintyProfile` invoked with `adjacentTrajectory` set for adjacent wells (R1 combined-covariance scenario — pass primary as `adjacentTrajectory`, adjacent trajectory as `primary` arg); empty adjacent trajectory (EC-1) and `≤1`-station trajectory (EC-2) mount no tube and render a **single-station ellipsoid at the mapped center** without error; primary `<2` points (EC-5) mounts no tube and no cone; tubes still mounted under `labelsOnlyMode` (design §5 case 6, data-not-chrome).
  - BC: R1 scenarios 1–3, EC-1, EC-2, EC-5, ADR-4 visibility rules.
  - Deps: T1.2, T1.5.

### 2.2 GREEN — `UncertaintyTube` per visible well

- [ ] (P1) T2.2 — Wire the tube. ~30m. `src/components/sections/AntiCollision3D.tsx` — per visible entry: `computeUncertaintyProfile(entry.trajectory, { tool: "MWD", ellipseK: DEFAULT_ELLIPSE_K, adjacentTrajectory: primaryTrajectory })` (+ primary well: `computeUncertaintyProfile(primaryTrajectory, { tool: "MWD", ellipseK: DEFAULT_ELLIPSE_K })`), map stations via `toCommonFrame` with per-well offsets (ADR-1), mount `<UncertaintyTube stations opacity={uncertaintyOpacity} autoLOD />` gated by visible/`≥2`; `=== 1` station → single ellipsoid mesh at mapped center (never rely on the component's origin-centered single-station branch — `ponytail:` comment); hidden wells via the existing `isHidden` gate (lines ~1435–1452); empty trajectory skipped. No naive per-station mesh loops (N1 — component already instanced).
  - BC: T2.1 passes; N1 instanced-mesh usage confirmed at call site.
  - Deps: T2.1.

### 2.3 RED — Cone mount-rule tests (R3, ADR-4)

- [ ] (P1) T2.3 — Cone behavior tests, fail RED. ~20m. `src/components/sections/AntiCollision3D.test.tsx` — forward cone mounted only for the primary well, only at the bit (last mapped primary station), absent when primary has `<2` points (EC-5), absent when the primary is hidden, still present under `labelsOnlyMode`. Uses stations produced by T1.4.
  - BC: R3 scenarios + EC-5 + ADR-4.
  - Deps: T1.4, T2.1 (fails before T2.4 wiring).

### 2.4 GREEN — `UncertaintyCone` at the bit

- [ ] (P1) T2.4 — Mount the cone. ~20m. `src/components/sections/AntiCollision3D.tsx` — `<UncertaintyCone stations={forwardStations} startIndex={0} length={coneLength} color={…} />` behind `coneVisible` and the `isHidden` gate; color routed from T3.4's `wellColor` single source (temporary `SCENE_COLORS[0]` acceptable until T3.4 lands). Data-not-chrome: no `showChrome` gate.
  - BC: T2.3 passes; R5 direction correctness.
  - Deps: T2.3 (T3.4 for final color).

- --

## Phase 3 — Frame unification + color + camera

### 3.1 RED — No-overlap frame contract tests (R2)

- [ ] (P1) T3.1 — Frame-contract regression tests, RED first. ~20m. `src/components/sections/AntiCollision3D.test.tsx` — adjacent well `wellheadNorth: 300` renders ~300 ft north of origin and does not overlap the primary at origin (R2 scenario, design §5 case 2); primary path/tube points map to `(east − primaryEast, −tvd, north − primaryNorth)` (R2 "Primary anchors the origin"). Asserted against `toCommonFrame` + the wired section render (any future "subtract primary surface everywhere" attempt fails here).
  - BC: R2 scenarios; guards the per-well offset contract (ADR-1).
  - Deps: T1.1, T2.2.

### 3.2 GREEN — Frame reconciliation pass

- [ ] (P2) T3.2 — Verify/repair per-well frame usage. ~20m. `src/components/sections/AntiCollision3D.tsx` — audit every render path now that tubes are wired: primary `WellborePath`/bound/ellipsoid subtract `wellData.surfaceEast/surfaceNorth ?? 0` (already correct, lines ~1469–1507); adjacent paths keep explicit `(0,0)` offsets (already correct, ~1445–1449 — comment stays); new tube stations use the ADR-1 per-well offsets (T2.2). Fix only if a path regressed; run T3.1.
  - BC: T3.1 stays green; no double-subtraction introduced.
  - Deps: T3.1.

### 3.3 RED — Stable-color tests (R4)

- [ ] (P1) T3.3 — Color-routing tests, RED first. ~20m. `src/components/sections/AntiCollision3D.test.tsx` — `wellColor(wellId, ids)` is the single source for tube/cone/path/ellipsoid colors; color depends only on `wellId` (re-sort of the matrix does not shift a well's color — R4 scenario); primary resolves to `SCENE_COLORS[0]` for its tube/cone/path (R4 "Primary resolves to palette[0]").
  - BC: R4 scenarios; ADR-6.
  - Deps: T2.2, T2.4.

### 3.4 GREEN — `wellColor` routing (incl. tube color prop deviation)

- [ ] (P1) T3.4 — Route colors; add minimal tube color prop. ~25m. `src/components/sections/AntiCollision3D.tsx` + `src/components/visuals/UncertaintyTube.tsx` — keep `wellColor(entry.wellId, [PRIMARY_WELL_ID, ...entries.map(e => e.wellId)])` (existing line ~1433) as the single source; pass color to cone (`color` prop already exists) and paths/ellipsoids (unchanged). **Deviation (decision flagged in Meta):** add optional `color?: string` to `UncertaintyTubeProps`; material color = `color` when set, current default behavior otherwise (`riskColoring` still wins per-instance risk colors when enabled). Contract tests pin the default path (no behavior change when prop absent). This is the spec-mandated minimal change to the read-only list (spec R1/R4 > design §3).
  - BC: T3.3 passes; tube color == `wellColor(wellId)` for each well, `SCENE_COLORS[0]` for primary; existing suite still green (default path unpinned change).
  - Deps: T3.3.

### 3.5 RED — Camera-bounds tests (R6, EC-1/4)

- [ ] (P1) T3.5 — Bounds tests, RED first. ~20m. `src/components/sections/AntiCollision3D.test.tsx` — five visible wells spread across the scene → merged bounds contain all five trajectories (R6 scenario 1); a legend-hidden well's extremes excluded from center/extent (R6 scenario 2, EC-4); empty-trajectory adjacent entry excluded (EC-1). Tests exercise the existing `computeBounds`-based merged bounds path (lines ~1076–1105), NOT `visibleBounds` (ADR-2).
  - BC: R6 + EC-4 + EC-1 bounds clauses.
  - Deps: T2.2.

### 3.6 GREEN — Camera framing verification + ADR-2 note

- [ ] (P2) T3.6 — Verify merged bounds + annotate. ~15m. `src/components/sections/AntiCollision3D.tsx` — confirm the merged `computeBounds`-based bounds (lines ~1076–1105) derive from **visible** entries only (hidden + empty adjacent excluded); add the filter if absent (narrow fix, no rewire). Add the ADR-2 call-site comment: `visibleBounds()` becomes viable only once the data contract is normalized to a single absolute frame (future change). Do not route camera through `visibleBounds`.
  - BC: T3.5 passes; R6 scenarios green; ADR-2 honored.
  - Deps: T3.5.

- --

## Phase 4 — Auto-seed + dead props cleanup

### 4.1 RED — Auto-seed tests (R7, EC-3)

- [ ] (P1) T4.1 — Seed behavior tests, RED first. ~25m. `src/components/sections/Anticolision.test.tsx` (existing test surface) — fresh store with zero directional surveys + zero adjacent wells → section mount seeds `MOCK_PRIMARY` trajectory and the `MOCK_WELLS` presets as adjacent entries (R7 scenario 1, EC-3); seed runs at most once per mount across repeated re-renders (EC-3); store already holding user surveys/adjacent wells → unchanged, no seeding (R7 scenario 2). Use `__resetDemoSeedGuard()` where the module-level guard (useDemoSeed) is in play.
  - BC: R7 scenarios; EC-3; N2 coverage of the seed predicate.
  - Deps: none (tests may fail RED only if a scenario uncovered).

### 4.2 GREEN — Seed path verification (likely no code)

- [ ] (P1) T4.2 — Verify existing seed satisfies R7. ~15m. `src/components/sections/Anticolision.tsx` (~lines 95–112) + `src/hooks/useDemoSeed.ts` — the one-shot inline seed (`seededRef` + `hasUserSurveys`) and the `useDemoSeed` module-guard already implement the trigger predicate (empty store → `MOCK_PRIMARY.surveys`; never overwrites). Adjacent presets arrive via the `useState` initializer (`MOCK_WELLS.map(getPresetAsAdjacent)`). Fix **only** if T4.1 exposes a failing scenario (e.g., repeated mounts per strict-mode double-invoke). No refactor of the two seed paths — spec re-affirms behavior, it does not ask to consolidate.
  - BC: T4.1 passes; R7 + EC-3 green.
  - Deps: T4.1.

### 4.3 GREEN — Dead props removal (ADR-5)

- [ ] (P1) T4.3 — Strip six dead props. ~15m. `src/components/sections/Anticolision.tsx` — remove `selectedWellId`, `wellColors`, `onSelectWell`, `onToggleVisibility`, `effectiveSelectedWellId`, `effectiveSelectedEntry` from the `AntiCollision3D` mount at ~line 782 **and** check/clean the second mount at ~line 872 (grep: both currently pass `selectedWellId`; `hiddenWellIds` is a real interface prop — keep it). Do not add them to `AntiCollision3DProps`. TypeScript compile proves the interface mismatch.
  - BC: `npx tsc --noEmit` clean; neither mount passes a non-interface prop; existing suite green.
  - Deps: none.

### 4.4 GREEN — Frame-asymmetry comment (design §6)

- [ ] (P2) T4.4 — Document known frame-blind analysis. ~10m. `src/components/sections/Anticolision.tsx` — add a code comment at the analysis call site (`analyzeCollisionMatrix`/matrix computation): `closestTrajectoryPoints` computes raw Euclidean distance across mismatched frames (primary absolute ~10,000,000 vs adjacent origin-relative ~300); pre-existing, out of scope (spec excludes the calculation engine), to be normalized in a follow-up intersecting ADR-2's `visibleBounds` normalization.
  - BC: comment present at call site; zero behavior change.
  - Deps: none.

- --

## Phase 5 — Tests + verification

### 5.1 Contract tests that must NOT flip (design §5)

- [ ] (P1) T5.1 — Pin the render contract. ~20m. `src/components/sections/AntiCollision3D.test.tsx` — assert current-behavior contracts: "primary subtracts surface", "adjacent uses 0,0", "ClosestApproachMarker asymmetry" (`pointA` subtracts primary surface, `pointB` does not). These are the regression guard for the whole change (design §7): any future global-subtraction attempt breaks here.
  - BC: all three pass and stay green through Phase 2–4 rewiring.
  - Deps: T3.2 (frame reconciliation done).

### 5.2 Full suite + type + build gates (N2/N3/N4)

- [ ] (P1) T5.2 — Gate run. ~20m. repo root — `npm test` (all suites, incl. Phases 1–4 tests), `npx tsc --noEmit` (zero errors, no `any`), `npm run build`; confirm zero new npm dependencies (`git diff package*.json` empty).
  - BC: N2 (red-green-refactor evidence: RED test commits predate GREEN wiring per phase), N3, N4.
  - Deps: 5.1, all Phase 1–4 tasks.

### 5.3 Manual dev verification (visual-only regressions, N2)

- [ ] (P1) T5.3 — Visual pass in dev. ~30m. local dev server — primary tube hugs the primary path at the origin (not floating at 10,000,000 ft); adjacent tubes sit at their true offsets (~300 N / −250 N / 500,500 / 1200 E) with combined-covariance size; forward cone projects along the last primary segment, hidden toggle removes tubes/cone/path and reframes camera bounds; toggling `labelsOnlyMode` keeps tubes/cone; perf: one draw call per tube (instanced), cone single primitive (N1). Fixed-seed tests via `__resetDemoSeedGuard` where applicable.
  - BC: visual alignment + camera framing match R1/R3/R6; N1 draw-call ceiling respected.
  - Deps: 5.2 build passes.

### 5.4 Docs + READMEs (design §3, pre-commit doc rule)

- [ ] (P3) T5.4 — Update documentation. ~20m. `docs/` + `README.md` of every touched folder (`src/components/sections`, `src/components/visuals`, `openspec/changes/surpass-competition-anti-collision-3d/`) — reflect the post-change state: continuous uncertainty tubes per visible well, forward cone at the bit, per-well frame contract, camera bounds over visible wells, dead-prop removal.
  - BC: `git diff --name-only` folders ↔ README coverage matches the workspace rule; docs describe post-commit state.
  - Deps: all implementation tasks.

- --

## Scenario traceability checklist

Every spec scenario/edge case maps to at least one task (checkbox copy of the spec):

- [ ] R1 Tube renders along every visible well → T2.1/T2.2
- [ ] R1 Hidden well shows no tube → T2.1/T2.2
- [ ] R1 Combined covariance per station → T2.1/T2.2
- [ ] R2 Adjacent wells keep true relative offsets → T1.1/T3.1/T3.2
- [ ] R2 Primary anchors the origin → T1.1/T3.1
- [ ] R3 Cone projects along last segment → T1.4/T2.3/T2.4
- [ ] R3 Cone not rendered without enough stations → T2.3/T2.4 (EC-5)
- [ ] R4 Color stable across re-sort → T3.3/T3.4
- [ ] R4 Primary resolves to palette[0] → T3.3/T3.4
- [ ] R5 Flat/vertical last segment still yields a forward projection → T1.3/T1.4
- [ ] R6 Bounds contain every visible trajectory → T3.5/T3.6
- [ ] R6 Hidden well excluded from bounds → T3.5/T3.6
- [ ] R7 Empty store seeds the demo on first mount → T4.1/T4.2
- [ ] R7 Existing user data never overwritten → T4.1/T4.2
- [ ] EC-1 Empty adjacent trajectory → T2.1/T3.5
- [ ] EC-2 <2 station trajectory degrades safely → T2.1/T2.2
- [ ] EC-3 No directional data → one-shot seed → T4.1/T4.2
- [ ] EC-4 Hidden wells: no tube/cone/path + bounds exclusion → T2.1/T3.5
- [ ] EC-5 Primary <2 points → no tube/cone, stable → T1.3/T2.1/T2.3
- [ ] N1 InstancedMesh + autoLOD, ≤2 extra draw calls vs baseline → T2.2/T5.3
- [ ] N2 Pure wiring unit-tested red-green-refactor → every RED task + T5.2
- [ ] N3 `tsc --noEmit` zero errors, no `any`, engine untouched → T5.2
- [ ] N4 No new dependencies → T5.2
