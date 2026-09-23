# Tasks: Multi-Well 3D Anti-Collision Visualization Fix

## Review Workload Forecast

| Field                  | Value                         |
|-----------------------|------------------------------|
| Estimated changed lines| ~700–900 additions + deletions|
| 400-line budget risk   | High                          |
| Chained PRs recommended| No (single-pr decided)        |
| Suggested split        | Single PR                     |

Decision needed before apply: **Yes** — single-pr with ~700–900 changed lines exceeds the 400-line review budget; orchestrator must confirm `size:exception` before apply.
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: High

## Phase 1: Scene helper module (TDD)

> Apply-phase note (2026-08-15): orchestrator renamed the helpers in the apply prompt — `toCommonFrame`→`commonFramePoint(p, wellheadE, wellheadN): Vec3`, `buildColorMap`→`wellColor(wellId, wellIds): string`, `computeSceneBounds`/`combineBounds`→`visibleBounds(...): {center, extent}`. Behavior per spec/design preserved (AC3D-1/-5/-6). Phase 4 tasks referencing the old names must use the new ones.

- [x] 1.1 Write failing `src/engine/scene.test.ts`: `toCommonFrame` preserves a 300 ft north offset, primary at origin, tvd depth ordering
- [x] 1.2 Implement `src/engine/scene.ts` — `toCommonFrame`, `LocalPoint`
- [x] 1.3 Add failing tests: `buildColorMap` stable across re-sort (D6), `computeSceneBounds`/`combineBounds` over multiple wells (D7)
- [x] 1.4 Implement color map + bounds helpers; add `SCENE_COLORS` palette
- [x] 1.5 Green: `npx vitest run src/engine/scene.test.ts`

## Phase 2: Mock primary preset

- [x] 2.1 Add `MOCK_PRIMARY` to `src/engine/mock-wells.ts` (surveys + wellhead offsets, distinct from the 5 presets)
- [x] 2.2 Assert presets list still has 5 entries + primary (test update in `Anticolision.test.tsx` if it counts wells)

## Phase 3: Legend component (TDD)

- [x] 3.1 Write failing `WellLegend` tests: renders primary + entries with color swatches; click fires `onSelect`; eye toggle fires `onToggleVisibility`; primary has no eye toggle; hover shows tooltip (name, risk, min distance ft)
- [x] 3.2 Implement `src/components/sections/WellLegend.tsx` (HTML only, no three imports)
- [x] 3.3 Green: legend suite passes

> Apply note (2026-08-15 batch 3): props contract per apply prompt — `wells: Array<{id, name, color, visible}>`, `selectedWellId`, `onSelect`, `onToggleVisibility`. wells[0] = primary (selectable, never hideable, no eye). Eye hover tooltip = "Ocultar este pozo"/"Mostrar" (title + aria-label). AC3D-3's name/risk/min-distance tooltip deferred — risk/minDistanceFt not in the batch-3 props contract (see apply-progress).

## Phase 4: 3D view fixes

> Apply note (2026-08-15 batch 4): all 4.x tasks used the renamed helpers (`commonFramePoint`, `wellColor`, `visibleBounds`). Added `PRIMARY_WELL_ID = "__primary__"` to `scene.ts` so `wellColor(PRIMARY_WELL_ID, ids)` always resolves to `SCENE_COLORS[0]` (underscore sorts first). The 3D scene renders 6 tubes (primary + 5 entries), not 5 — the prompt's "5 WellborePath instances" counted entries only. `WellborePath`/`ClosestApproachMarker` now take `surfaceEast`/`surfaceNorth` (primary wellhead) so every trajectory lives in the common frame.

- [x] 4.1 Fix `WellborePath`: map every trajectory through `toCommonFrame(primarySurfaceNorth, primarySurfaceEast)` — tubes, ellipsoids, markers all in the same frame (D1)
- [x] 4.2 Fix `ClosestApproachMarker`: raw a/b vertices + group `position={mid}` + Html label relative to group
- [x] 4.3 Ellipsoid policy (D4): render primary + selected-entry ellipsoids and distance label only; remove per-entry ellipsoid loop for unselected wells
- [x] 4.4 Colors (D6): use `wellColors` prop keyed by `wellId`; drop `WELL_COLORS[(i+1)%len]`
- [x] 4.5 Camera (D7): `computeSceneBounds` over all visible wells; pass to initial camera + focus controller
- [x] 4.6 Visibility (D3): skip hidden wells in tube/ellipsoid/bounds rendering
- [x] 4.7 Remove dead `activeEntry` prop usage (keep interface compat or update callers)

## Phase 5: Section wiring + auto-seed

- [x] 5.1 In `Anticolision.tsx`: maintain `selectedWellId`, `hiddenWellIds` (Set), `wellColors` (from `buildColorMap`)
- [x] 5.2 Auto-seed (D5): on first mount, if store has no surveys AND no adjacent wells → `setSurveys(MOCK_PRIMARY.surveys)` + load all 5 `MOCK_WELLS` presets; guard at-most-once per mount; never overwrite user data
- [x] 5.3 Render `WellLegend` overlaid on the 3D view; wire `onSelect`/`onToggleVisibility` → `AntiCollision3D` props
- [x] 5.4 Update `Anticolision.test.tsx`: auto-seed once, no overwrite, legend wiring
- [x] 5.5 Dashboard Trajectory3D RC-1 fix: Trajectory3D never seeded → cold-load showed the 3-point vertical/45deg demo stub (degenerate invisible tube). Add shared `useDemoSeed` hook (seeds MOCK_PRIMARY when trajectory < 10pts, never overwrites user data) mirroring Anticolision; migrate Trajectory3D to shared `WellborePath`. RC-2: shared WellborePath default radius 1.8→3ft, segments 12→16, vertical color #8e9af→#00d2ff (luminance 0.53). Removes ~323-line inline duplicate. Tests +7, 224/224 green, tsc clean. (commit 137d2ec98)

## Phase 6: Verification + commit

- [ ] 6.1 `npm test` — all suites green (scene, WellLegend, Anticolision, anti-collision, directional)
- [ ] 6.2 `npx tsc --noEmit` — strict pass
- [ ] 6.3 Manual `npm run dev` — visual check: wells offset correctly, marker aligned, ellipsoids only for selected pair, camera frames all wells
- [ ] 6.4 `npm run build` passes
- [ ] 6.5 Conventional commit `fix(3d): unify anti-collision view frame, add legend + demo seed`; push branch + single PR

## Exit Criteria

- All TDD tests green; tsc strict; manual visual check documented in PR.
- `MOCK_PRIMARY` + 5 presets render with correct relative offsets; selected-pair ellipsoids; legend works in jsdom and browser.
