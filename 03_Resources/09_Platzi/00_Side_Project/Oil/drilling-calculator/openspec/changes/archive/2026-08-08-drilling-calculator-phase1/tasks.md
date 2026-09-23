# Tasks: Drilling Calculator Phase 1 — Critical Fixes & Test Coverage

* *Change**: `drilling-calculator-phase1` · **Mode**: hybrid · **Strict TDD**: true (`npm test`, RED→GREEN→REFACTOR) · **Gates**: `npm test` · `npx tsc -b` · `npm run lint` · `npm run build`

> ✅ **ARCHIVED**: 2026-08-08 → `openspec/changes/archive/2026-08-08-drilling-calculator-phase1/`. Verification `success` (npm test 20 files/153 tests · tsc · lint · build), 0 CRITICAL. **Intentional partial archive (orchestrator-approved)**: T-26 (coverage ≥80% infra, Q-4) left unchecked — out of scope per orchestrator, documented in apply-progress (Engram #2005) and session summaries (#2004/#2006). `design.md` was never produced — known gap, non-blocking.

> ⚠️ **Design artifact missing**: `design.md` was not found on disk (`openspec/changes/drilling-calculator-phase1/design.md`) nor in Engram (`sdd/drilling-calculator-phase1/design`). Tasks below are grounded in the spec (test plan + formula matrix F1–F15) and direct source inspection. Recommend sdd-design before apply if design-level decisions are required.

## Review Workload Forecast

| Field                  | Value                                                                                          |
|-----------------------|-----------------------------------------------------------------------------------------------|
| Estimated changed lines| ~2050 (impl ~500 + tests ~1400 + config ~60 + lint fixes ~90)                                  |
| 400-line budget risk   | High                                                                                           |
| Chained PRs recommended| Yes                                                                                            |
| Suggested split        | 8 PRs: P1 SurgeSwab → P2 lint → P3 cuttings UI → P4 twin UI → P5–P7 engine suites → P8 coverage|
| Delivery strategy      | auto-forecast                                                                                  |
| Chain strategy         | pending                                                                                        |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

> **Decision required**: total ≈ 2050 changed lines — exceeds the 400-line budget ~5×. A chain strategy must be chosen before apply: `stacked-to-main` (each PR merges to main) or `feature-branch-chain` (PR1 → tracker branch `phase1/critical-fixes`; PR2 base = PR1 branch; PR3 base = PR2 branch; … only the tracker merges to main).

### Suggested Work Units

| Unit  | Goal                                                     | Likely PR  | Focused test command                                                                                                         | Runtime harness                                                   | Rollback boundary                                                                                 |
|------|---------------------------------------------------------|-----------|-----------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| 1     | SurgeSwab 8-field contract + consumers (S-1..S-6)        | PR 1       | `npm test -- src/engine/surge-swab.test.ts src/engine/orchestrator.test.ts src/guards/alert-engine.test.ts`                  | `npx tsc -b` + `npm run lint` (engine-level; no UI harness needed)| Revert 4 prod files (surge-swab, drilling-types, orchestrator, TrippingChart); delete 3 test files|
| 2     | Lint gate: 0 `any`, 0 hooks (Q-1, Q-2)                   | PR 2       | `npm run lint`                                                                                                               | `npx tsc -b && npm run build`                                     | Per-file revert of type/hook edits                                                                |
| 3     | CuttingsTransportSection (C-1..C-4)                      | PR 3       | `npm test -- src/components/sections/CuttingsTransportSection.test.tsx`                                                      | `npm run dev` → nav "Transporte Recortes"                         | Delete section + css + test; revert App.tsx/SidebarNav                                            |
| 4     | Twin wiring + purity (D-1..D-3)                          | PR 4       | `npm test -- src/components/visuals/DynamicTwinWindow.test.tsx src/engine/twin-engine.test.ts`                               | `npm run dev` → twin view                                         | Revert App.tsx/SidebarNav; delete test files                                                      |
| 5     | Suites: rheology, pump, pressures, circulation (Q-3)     | PR 5       | `npm test -- src/engine/rheology.test.ts src/engine/pump.test.ts src/engine/pressures.test.ts src/engine/circulation.test.ts`| N/A — pure engine units, no harness                               | Delete the 4 test files                                                                           |
| 6     | Suites: hydraulics, volumetrics, directional (Q-3)       | PR 6       | `npm test -- src/engine/hydraulics.test.ts src/engine/volumetrics.test.ts src/engine/directional.test.ts`                    | N/A — pure engine units                                           | Delete the 3 test files                                                                           |
| 7     | Suites: torque-drag, stuck-pipe, cuttings-transport (Q-3)| PR 7       | `npm test -- src/engine/torque-drag.test.ts src/engine/stuck-pipe.test.ts src/engine/cuttings-transport.test.ts`             | N/A — pure engine units                                           | Delete the 3 test files                                                                           |
| 8     | Coverage gate ≥80% engine (Q-4)                          | PR 8       | `npx vitest run --coverage`                                                                                                  | N/A — config change                                               | Revert config.yaml + vitest.config.ts                                                             |

- --

## Capability 1: surge-swab-calculation (S-1..S-6)

- [x] **T-01** (RED, critical, deps: —, medium, ~180) Create `src/engine/surge-swab.test.ts`: params-object contract (S-1); 8-field result all populated (S-2); velocity monotonicity F10 + zero-velocity equilibrium (S-5); annulus-collapse clamp + zero-PV/YP/L guards + default pipeSpeed 90 (S-6); Burkhardt v_ann F12, EMW F11, regime classification. **AC**: suite fails against current 4-field engine (`ecdSurge` undefined); passes after T-02.
- [x] **T-02** (GREEN, critical, deps: T-01, medium, ~40) Extend `src/engine/surge-swab.ts` `SurgeSwabResult` (lines 20–25) to 8 fields: rename `equivalentMudWeightSurge/Swab` → `ecdSurge/ecdSwab`; add `effectiveAnnularVelocity` (F12), `flowRegimeSurge`, `modelUsed`, `pipeSpeed`; keep diam diff clamp (line 42). **AC**: `npm test` green; `tsc -b` clean.
- [x] **T-03** (high, deps: T-02, low, ~15) Reconcile `src/store/drilling-types.ts`: delete local `SurgeSwabResult` (lines 268–278), import + re-export from `src/engine/surge-swab.ts`; `DrillingResults.surgeSwab` (line 16) resolves to engine type. **AC**: exactly 1 `SurgeSwabResult` definition (grep); `tsc -b` green.
- [x] **T-04** (critical, deps: T-02, T-03, low, ~20) Fix `src/engine/orchestrator.ts:88-93` → single `SurgeSwabParams` object `{ mudWeight: mudData.mudWeight, plasticViscosity: mudData.plasticViscosity, yieldPoint: mudData.yieldPoint, holeDiameter: wellData.holeSize, pipeDiameter: wellData.drillPipeOD, pipeVelocity: wellControlData.pipeSpeed ?? 90, pipeLength: wellData.drillPipeLength }`; verify fallback (lines 251–260) 8-field; type `surveys`/`tdData`/`wellControlData` (lines 30–32), `emptyVol` (126), risk engine (280, 291). **AC**: `tsc -b` no arity error; grep: zero `calculateSurgeSwab(` with >1 arg; fallback `ecdSurge` numeric.
- [x] **T-05** (critical, deps: T-02, low, ~15) Fix `src/components/visuals/TrippingChart.tsx:103-108` → single `SurgeSwabParams` object per speed (from store wellData/mudData + `speed`); reads `res.ecdSurge/ecdSwab` (111–112) stay defined; type `PremiumTooltip` (22), `entry` (53), `formatter` (222). **AC**: 21-point curve renders defined ECDs; lint clean on file.
- [x] **T-06** (high, deps: T-02, T-04, medium, ~90) Add `src/engine/orchestrator.test.ts` (store path: `calculateAll()` → `results.surgeSwab.ecdSurge` defined > MW, `ecdSwab` < MW, `pipeSpeed === (wellControlData.pipeSpeed ?? 90)`) and `src/guards/alert-engine.test.ts` (S-4: `ecdSurge > maxMudWeight` → "SURGE CRÍTICO" with defined `toFixed(2)`; `ecdSwab < minMudWeight` → "SWAB CRÍTICO"; no "undefined" in details). **AC**: both suites green; existing `well-control*.test.ts` green.

## Capability 2: digital-twin-view (D-1..D-3)

- [x] **T-14** (RED, high, deps: —, medium, ~140) Create `src/components/visuals/DynamicTwinWindow.test.tsx` (D-2: Simulated ECD card finite + `ppg`, signed VAR ECD delta, status `"error"` when simECD > fractureGradient else `"valid"`; null-safe when `results`/`hydraulics` absent) + `src/engine/twin-engine.test.ts` (D-3: `simulateScenario` with `mudWeight` delta leaves store `wellData`/`mudData`/`pumpData` unchanged; typed `modifications`). **AC**: fails until wiring exists; passes after T-15.
- [x] **T-15** (GREEN, high, deps: T-14, low, ~20) Wire `src/App.tsx`: render `DynamicTwinWindow` inside `ErrorBoundary` when `activeView === "twin"` (full-view-panel, near line 231 pattern); add `SidebarNav` entry `{ id: "twin", icon: Gauge, label: "Simulador Digital (Twin)" }` in `src/components/ui/SidebarNav.tsx` (lines 25–41). **AC**: `npm test` green; twin renders in dev without crash; no `undefined` ECD reads.

## Capability 3: cuttings-transport (C-1..C-4)

- [x] **T-10** (RED, high, deps: —, medium, ~110) Create `src/components/sections/CuttingsTransportSection.test.tsx` (C-1: 5 DataCards, CCI shows `1.20`, HCE `85.0 %`; empty `results.cuttings` → `null` no throw; C-2: CCI 0.4 + HCE 55 → both `"error"`, CCI 1.1 + HCE 90 → both `"valid"`). **AC**: fails (component missing); passes after T-11.
- [x] **T-11** (GREEN, high, deps: T-10, medium, ~130) Create `src/components/sections/CuttingsTransportSection.tsx` (named export, functional): reads `results.cuttings` via `useDrillingStore`, renders `Section` (id `"cuttings"`, icon `Layers`) with 5 `DataCard`s (CCI, HCE %, cuttingsConcentration %, slipVelocity ft/min, transportRatio %); status map C-2; returns `null` when results empty. **AC**: render test green; named export; no Tailwind classes.
- [x] **T-12** (high, deps: T-11, low, ~90) Create `src/components/sections/CuttingsTransportSection.css` using tokens only (`var(--color-surface)`, `--glass-border`, `--color-safe/--color-warning/--color-critical`, mono font) with responsive grid. **AC**: audit grep on new files → no Tailwind utilities (`grid-cols`, `p-*`, `rounded-2xl`); `npm run build` passes.
- [x] **T-13** (high, deps: T-11, T-12, low, ~20) Wire `src/App.tsx`: render `CuttingsTransportSection` inside `ErrorBoundary` when `activeView === "cuttings"`; add `SidebarNav` entry `{ id: "cuttings", icon: Layers, label: "Transporte Recortes" }`. **AC**: nav renders section; navigate away/back no runtime error.

## Quality Requirements (Q-1, Q-2, Q-3, Q-4)

- [x] **T-07** (high, deps: —, medium, ~30) Fix react-hooks violations in `src/components/visuals/Trajectory3D.tsx:83` (`ControlsConfig` mutates `controls` — move into legal effect boundary) and `:226` (`CameraController` `useFrame` camera mutation — guard/refactor to satisfy rules-of-hooks; R3F render loop mutation stays but lint-clean). **AC**: `npm run lint` 0 `react-hooks/*` errors; `npm run build` green; 3D views still switch.
- [x] **T-08** (high, deps: —, low, ~10) Fix `src/components/visuals/TechnicalInsights.tsx:78` (`useMemo` dependency array — stabilize deps per exhaustive-deps). **AC**: lint 0; chart data identical before/after.
- [x] **T-09** (high, deps: —, medium, ~90) Eliminate remaining `no-explicit-any`: `src/components/sections/JetroChat.tsx` (59, 207, 208, 215, 220, 419, 437, 518, 771), `src/components/visuals/TorqueDragChart.tsx` (19), `StuckPipeAnalysis.tsx` (105, 115, 125), `MudProperties.tsx` (38), `src/engine/well-control-edge.test.ts` (~30 `as any` → typed fixtures/interfaces) + any stragglers. **AC**: `npm run lint` reports 0 `no-explicit-any`; `tsc -b` green.
- [x] **T-16** (high, deps: —, low, ~100) Create `src/engine/rheology.test.ts` (F2: PV=θ600−θ300, YP=θ300−PV; F3: n≈0.678 for 40/25; F4: K finite >0; F5: τ₀, μ_eff > PV when YP>0; zero-theta guards; AV). **AC**: green under `npm test`.
- [x] **T-17** (high, deps: —, low, ~90) Create `src/engine/pump.test.ts` (F9: output/stroke liner+rod geometry; GPM = strokes·output·eff·pumps; HHP = P·Q/1714). **AC**: green.
- [x] **T-18** (high, deps: —, low, ~90) Create `src/engine/pressures.test.ts` (F1: 0.052; hydrostatic = 0.052·MW·TVD; mud-window bounds; overbalance signs). **AC**: green.
- [x] **T-19** (high, deps: —, low, ~80) Create `src/engine/circulation.test.ts` (times = volume/flow; lag strokes monotonic with volume). **AC**: green.
- [x] **T-20** (high, deps: —, medium, ~130) Create `src/engine/hydraulics.test.ts` (F6: 24.51·Q/(D₁²−D₂²); F7: Re regimes <2100/>4000; F9: bit HHP/IF/P_bit constants; ECD ≥ MW; pressure-loss sums). **AC**: green.
- [x] **T-21** (high, deps: —, low, ~100) Create `src/engine/volumetrics.test.ts` (F8: capacity = ID²/1029.4 bbl/ft; volume conservation; open-hole vs cased annulus). **AC**: green.
- [x] **T-22** (high, deps: —, medium, ~100) Create `src/engine/directional.test.ts` (MCM closure position; DLS per 100 ft; TVD/north/east consistency). **AC**: green.
- [x] **T-23** (high, deps: —, medium, ~100) Create `src/engine/torque-drag.test.ts` (hook loads ≤ tensile limit; neutral point position; profile length). **AC**: green.
- [x] **T-24** (high, deps: —, medium, ~90) Create `src/engine/stuck-pipe.test.ts` (differential force ∝ overbalance·contact area; risk-level thresholds). **AC**: green.
- [x] **T-25** (high, deps: —, medium, ~110) Create `src/engine/cuttings-transport.test.ts` (F13: Moore slip ≥5 clamp when AV>0,PV>0, else 0; F14: CCI = K·AV·MW/400000 scales; F15: concentration positive/bounded; HCE ≤ 100). **AC**: green.
- [ ] **T-26** (medium, deps: T-16..T-25, low, ~60) Raise `openspec/config.yaml` `verify.coverage_threshold` 0 → 80 (line 36); add coverage block to `vitest.config.ts` (`coverage: { provider: 'v8', include: ['src/engine/**'] }`, add `@vitest/coverage-v8` devDep if absent); fill any engine module under 80% with gap cases. **AC**: coverage run reports every `src/engine` module ≥80% line; all suites still green.

- --

## Execution Notes

1. **Strict TDD**: write RED test → run (fail) → minimal GREEN impl → REFACTOR → `npx tsc -b` + `npm run lint` before commit. Q-3/Q-4 suites lock existing pure engines — they pass on first run; that is expected (regression locks), the RED discipline applies to T-01/T-10/T-14 (new behavior).
2. **Preserved suites**: `src/engine/well-control.test.ts`, `well-control-edge.test.ts`, `src/hooks/useToolManager.test.ts` must stay green after every PR.
3. **PR budget**: each PR ≤ 400 changed lines (forecast above). Do not merge T-groups; keep chain bases per the chosen strategy.
4. **No Tailwind** in new files; vanilla CSS tokens only (C-3). Interfaces over types; named exports; no `any` (Q-1).
