# Spec: Drilling Calculator Phase 1 — Critical Fixes & Test Coverage

* *Change**: `drilling-calculator-phase1` | **Mode**: hybrid (engram + openspec) | **Strict TDD**: true (Vitest 4, `npm test`)

* *Gates**: `npm test` · `npx tsc -b` · `npm run lint` · `npm run build`

* *Standards**: TypeScript strict (no `any`), interfaces over types, named exports, functional components, vanilla CSS design tokens (`src/styles/tokens.css` — NO Tailwind), SI field units. Engine modules remain pure and side-effect free (no React imports in `src/engine`) — `rheology.ts` is the reference pattern.

* *Domain note**: `openspec/specs/` is empty — all three capabilities are NEW full specs. Lint/hooks/coverage work is implementation-level and governed by Quality Requirements Q-1..Q-4 below.

- --

## Capability 1: surge-swab-calculation

### Requirements

#### Requirement S-1: Single-object API contract

The system SHALL expose `calculateSurgeSwab(params: SurgeSwabParams): SurgeSwabResult` accepting exactly one object with fields `mudWeight, plasticViscosity, yieldPoint, holeDiameter, pipeDiameter, pipeVelocity, pipeLength`. All callers SHALL pass a single object; positional argument calls are forbidden.

##### Scenario: Orchestrator conforms

- GIVEN `orchestrateCalculations` is invoked with valid well/mud/formation/pump data and `wellControlData.pipeSpeed`
- WHEN the SurgeSwab stage runs
- THEN `calculateSurgeSwab` is called with a `SurgeSwabParams` object built from `mudData.mudWeight`, `rheology.pv`, `rheology.yp`, `wellData.holeSize`, `wellData.drillPipeOD`, `pipeSpeed`, `wellData.drillPipeLength`
- AND `npx tsc -b` reports no arity/type error at the call site

##### Scenario: TrippingChart conforms

- GIVEN `TrippingChart` generates its 21-point speed curve
- WHEN each point calls the engine
- THEN the call passes a single `SurgeSwabParams` object per speed
- AND `res.ecdSurge` / `res.ecdSwab` are defined numbers for every point

#### Requirement S-2: Single reconciled SurgeSwabResult type

The system SHALL define exactly ONE `SurgeSwabResult` interface: `{ surgePressure, swabPressure, ecdSurge, ecdSwab, effectiveAnnularVelocity, flowRegimeSurge, modelUsed, pipeSpeed }`. The engine (`surge-swab.ts`) SHALL be the owner; `drilling-types.ts` SHALL import it (no duplicate interface). Every field SHALL be populated by the engine — consumers MUST never read `undefined`.

##### Scenario: Store imports engine type

- GIVEN `src/store/drilling-types.ts`
- WHEN the change is applied
- THEN `SurgeSwabResult` is re-exported from `src/engine/surge-swab.ts`, the local duplicate is deleted
- AND `tsc -b` passes with `DrillingResults.surgeSwab` typed as the engine type

##### Scenario: All fields populated

- GIVEN valid params with `pipeVelocity = 90`
- WHEN `calculateSurgeSwab(params)` returns
- THEN all 8 fields are finite numbers or typed literals (`flowRegimeSurge` ∈ `"Laminar" | "Turbulent" | "Transition"`)
- AND `ecdsurge >= mudWeight >= ecdSwab` and `surgePressure, swabPressure > 0`

#### Requirement S-3: Orchestrator produces a complete result

The system SHALL return a fully populated `surgeSwab` sub-result inside `DrillingResults` from `orchestrateCalculations`, including the fallback branch (catch path) matching the same 8-field shape.

##### Scenario: Happy path

- GIVEN valid inputs
- WHEN `orchestrateCalculations` completes
- THEN `results.surgeSwab.ecdSurge` is a defined number > `mudData.mudWeight` (surge adds ECD)
- AND `results.surgeSwab.ecdSwab` is a defined number < `mudData.mudWeight`
- AND `results.surgeSwab.pipeSpeed === (wellControlData.pipeSpeed ?? 90)`

##### Scenario: Engine failure fallback

- GIVEN an engine stage throws
- WHEN the orchestrator catch path returns the safe result
- THEN `results.surgeSwab` has the 8-field shape with numeric zeros and `flowRegimeSurge: "Laminar"` — no `undefined` reads possible in consumers

#### Requirement S-4: Consumer safety

The system SHALL update every consumer to read only reconciled fields: `App.tsx` (metrics panel), `alert-engine.ts` (surge/swab alerts), `TrippingChart.tsx` (chart + status), `orchestrator.ts` risk engine (`ecdSurge`). Alert thresholds (`ecdSurge > maxMudWeight`, `ecdSwab < minMudWeight`) SHALL operate on the same values the engine computes.

##### Scenario: Alert engine emits surge alerts

- GIVEN results where `surgeSwab.ecdSurge > pressures.maxMudWeight` and `maxMudWeight > 0`
- WHEN `generateAlerts(results)` runs
- THEN a `critical` alert with message containing "SURGE CRÍTICO" is emitted
- AND the detail string interpolates a defined `ecdSurge.toFixed(2)` (no "undefined")

##### Scenario: Swab kick risk

- GIVEN results where `surgeSwab.ecdSwab < pressures.minMudWeight` and `minMudWeight > 0`
- WHEN `generateAlerts(results)` runs
- THEN a `critical` "SWAB CRÍTICO" alert is emitted with defined `ecdSwab` value

#### Requirement S-5: Physics behavior (API RP 13D / Bourgoyne §4)

Surge/swab dynamic pressures SHALL increase monotonically with `pipeVelocity` (0 < v ≤ 400 ft/min) and with `pipeLength`; swab magnitude SHALL equal surge magnitude (symmetric simplified-Bingham model); ECDs SHALL be symmetric about `mudWeight`.

##### Scenario: Velocity monotonicity

- GIVEN two param sets differing only in `pipeVelocity` (60 vs 120 ft/min)
- WHEN both are computed
- THEN `surgePressure(v=120) > surgePressure(v=60)` and `ecdSurge(v=120) > ecdSurge(v=60)`

##### Scenario: Zero-velocity equilibrium

- GIVEN `pipeVelocity = 0`
- WHEN computed
- THEN `surgePressure === 0`, `ecdSurge === mudWeight`, `ecdSwab === mudWeight`

#### Requirement S-6: Edge-case robustness

The system SHALL guard `holeDiameter - pipeDiameter <= 0` (clamp to minimum 0.1 in, per current engine), SHALL NOT emit NaN/Infinity for zero PV, zero YP, or zero pipeLength, and SHALL default `pipeVelocity` to 90 ft/min when `wellControlData.pipeSpeed` is absent.

##### Scenario: Annulus collapse

- GIVEN `holeDiameter <= pipeDiameter`
- WHEN computed
- THEN every result field is a finite number and `ecdsurge >= mudWeight >= ecdSwab` still holds

##### Scenario: Missing pipe speed

- GIVEN `wellControlData.pipeSpeed` is `undefined`
- WHEN the orchestrator computes SurgeSwab
- THEN the computed `pipeSpeed` field equals 90

### Acceptance Criteria (surge-swab-calculation)

- [ ] `calculateSurgeSwab` has exactly one object-typed parameter; zero positional-arg call sites (grep for `calculateSurgeSwab(` with >1 arg)
- [ ] Exactly one `SurgeSwabResult` interface exists; `drilling-types.ts` imports it
- [ ] `results.surgeSwab.ecdSurge` is never `undefined` (App, alert-engine, TrippingChart, orchestrator risk engine)
- [ ] `npm test` suite `surge-swab.test.ts` green (S-1..S-6)
- [ ] Existing `well-control*.test.ts` suites stay green

- --

## Capability 2: cuttings-transport

### Requirements

#### Requirement C-1: CuttingsTransportSection renders results

The system SHALL provide `CuttingsTransportSection` (`src/components/sections/CuttingsTransportSection.tsx`, named export, functional component) that reads `results.cuttings` from `useDrillingStore` and renders five metrics with `DataCard`: `cuttingCarryingIndex` (CCI), `holeCleaningEfficiency` (%), `cuttingsConcentration` (%), `slipVelocity` (ft/min), `transportRatio` (%). Layout SHALL use the `Section` primitive (id `"cuttings"`, icon `Layers`) with a responsive grid.

##### Scenario: Results available

- GIVEN store results with populated `cuttings` values (e.g. CCI 1.2, HCE 85)
- WHEN the component renders
- THEN five DataCards are present
- AND the CCI card displays `1.20` and the HCE card displays `85.0 %`

##### Scenario: Empty results

- GIVEN `results.cuttings` is missing or zeroed
- WHEN the component renders
- THEN it returns `null` without throwing

#### Requirement C-2: Status thresholds

The system SHALL map CCI and HCE to `ValidationStatus` (`"valid" | "warning" | "error"`): CCI ≥ 1.0 → `valid`, 0.5 ≤ CCI < 1.0 → `warning`, CCI < 0.5 → `error`; HCE ≥ 80 → `valid`, 60 ≤ HCE < 80 → `warning`, HCE < 60 → `error`.

##### Scenario: Poor hole cleaning flagged

- GIVEN CCI = 0.4 and HCE = 55
- WHEN cards render
- THEN both cards carry status `"error"` (renders red indicator per `DataCard`)

##### Scenario: Acceptable cleaning

- GIVEN CCI = 1.1 and HCE = 90
- WHEN cards render
- THEN both cards carry status `"valid"`

#### Requirement C-3: Vanilla CSS tokens only

The system SHALL style the section with a dedicated `CuttingsTransportSection.css` consuming design tokens (`var(--color-surface)`, `--glass-border`, `--color-safe/--color-warning/--color-critical`, mono font). Tailwind utility classes (`grid grid-cols-*`, `p-*`, `rounded-2xl`) MUST NOT appear in the new component or CSS.

##### Scenario: Style audit

- GIVEN the merged component files
- WHEN `npm run lint` and a class-name audit run
- THEN no Tailwind utility tokens are present and `npm run build` passes

#### Requirement C-4: App integration

The system SHALL render `CuttingsTransportSection` in the App shell and expose it via `SidebarNav` (nav id `"cuttings"`, label "Transporte Recortes").

##### Scenario: Navigation

- GIVEN the app boots
- WHEN the user selects the cuttings view
- THEN the section renders inside an `ErrorBoundary` wrapper
- AND no runtime error occurs when navigating away and back

### Acceptance Criteria (cuttings-transport)

- [ ] `CuttingsTransportSection.tsx` + `.css` exist with named export; no Tailwind classes
- [ ] Section renders 5 DataCards with correct threshold statuses (C-1, C-2)
- [ ] Renders `null` safely on empty results (C-1)
- [ ] `SidebarNav` + App shell wiring present (C-4)
- [ ] Component render test green in jsdom (Test Plan T-CUT-UI)

- --

## Capability 3: digital-twin-view

### Requirements

#### Requirement D-1: Twin reachable from App shell

The system SHALL wire `DynamicTwinWindow` (`src/components/visuals/DynamicTwinWindow.tsx`, exists) into `App.tsx` so it renders when `activeView === "twin"`, wrapped in `ErrorBoundary`, and SHALL add a `SidebarNav` entry (`id: "twin"`, icon `Gauge`, label "Simulador Digital (Twin)").

##### Scenario: Navigate to twin

- GIVEN the app boots with calculated results
- WHEN the user selects the twin view
- THEN `DynamicTwinWindow` renders inside the app shell without crashing

#### Requirement D-2: Twin shows simulated ECD delta

The system SHALL display simulated ECD (from `simulateScenario`), the delta against the baseline `results.hydraulics.ecd`, and fracture-gradient status — all values defined numbers, no `undefined` reads.

##### Scenario: Valid simulation

- GIVEN results present and `simResults.hydraulics.ecd` computed
- WHEN the twin renders
- THEN `Simulated ECD` DataCard shows a finite value with unit `ppg`
- AND the VAR ECD delta shows signed value (`+`/`-`), and status is `"error"` when `simECD > formationData.fractureGradient`, else `"valid"`

##### Scenario: Baseline absent

- GIVEN `results` or `results.hydraulics` is null/undefined
- WHEN the twin renders
- THEN it returns `null` without throwing

#### Requirement D-3: Twin scenario engine purity

The system SHALL keep `twin-engine.ts` pure: `simulateScenario` SHALL NOT mutate store state and SHALL accept typed `modifications: { mudWeight?, gpm?, rpm?, rop? }`.

##### Scenario: No store mutation

- GIVEN a baseline store snapshot
- WHEN `simulateScenario` runs with `mudWeight` delta
- THEN `wellData`, `mudData`, `pumpData` in the store are unchanged
- AND the returned `DrillingResults` reflects the simulated mud weight

### Acceptance Criteria (digital-twin-view)

- [ ] `App.tsx` renders `DynamicTwinWindow` for `activeView === "twin"` inside `ErrorBoundary` (D-1)
- [ ] `SidebarNav` exposes the twin entry (D-1)
- [ ] No `undefined` ECD reads; null-safe when results absent (D-2)
- [ ] `simulateScenario` typed, side-effect free (D-3)
- [ ] Component render test green in jsdom (Test Plan T-TWIN-UI)

- --

## Quality Requirements (implementation-level, cross-cutting)

#### Requirement Q-1: No explicit `any`

The system SHALL eliminate all 78 `@typescript-eslint/no-explicit-any` violations (typed interfaces; `unknown` where a type is not yet known). `npm run lint` SHALL report 0 `no-explicit-any`.

##### Scenario: Lint gate

- GIVEN the full source tree
- WHEN `npm run lint` runs
- THEN zero `no-explicit-any` errors are reported

#### Requirement Q-2: No React hooks violations

The system SHALL fix the hooks violations in `Trajectory3D.tsx` (lines 83, 226 — render-phase camera mutation) and `TechnicalInsights.tsx` (line 78 — `useMemo` dependency array). `npm run lint` SHALL report 0 `react-hooks` errors.

##### Scenario: Rules-of-hooks gate

- GIVEN the full source tree
- WHEN `npm run lint` runs
- THEN zero `react-hooks/*` errors are reported

#### Requirement Q-3: Engine test coverage

The system SHALL add 10 Vitest suites (one per engine module) — `rheology`, `hydraulics`, `volumetrics`, `pump`, `pressures`, `circulation`, `directional`, `torque-drag`, `stuck-pipe`, `cuttings-transport` — plus `surge-swab` (S-1..S-6) — all green under `npm test`.

##### Scenario: Suite runs

- GIVEN the test workspace
- WHEN `npm test` runs
- THEN all suites pass and existing `well-control*.test.ts` remain green

#### Requirement Q-4: Coverage threshold

Engine modules SHALL reach ≥ 80% line coverage (config `openspec/config.yaml` `verify.coverage_threshold` raised from 0 to 80 for the engine layer).

##### Scenario: Coverage gate

- GIVEN the engine layer
- WHEN coverage is measured
- THEN every engine module reports ≥ 80% line coverage

- --

## Test Plan (TDD — RED → GREEN → REFACTOR)

* *Harness**: Vitest 4, jsdom environment, `src/test/setup.ts`; component tests use `@testing-library/react`. **Command**: `npm test` (strict TDD per `config.yaml`). **Workflow per module**: write failing test (RED) → minimal implementation/type fix (GREEN) → refactor to codebase pattern (REFACTOR) → `npx tsc -b` + `npm run lint` before commit.

| Suite             | File                                                       | Covers  | Key assertions (formula-backed)                                                                                  |
|------------------|-----------------------------------------------------------|--------|-----------------------------------------------------------------------------------------------------------------|
| rheology          | `src/engine/rheology.test.ts`                              | Q-3     | PV=θ600−θ300; YP=θ300−PV; AV=θ600/2; n=3.322·log10(θ600/θ300); K=θ300/511ⁿ; zero-theta guards                    |
| hydraulics        | `src/engine/hydraulics.test.ts`                            | Q-3     | Annular velocity via 24.51; ECD ≥ MW; pressure-loss sums; regime classification                                  |
| volumetrics       | `src/engine/volumetrics.test.ts`                           | Q-3     | Capacity = ID²/1029.4 bbl/ft; volume conservation; open-hole vs cased annulus                                    |
| pump              | `src/engine/pump.test.ts`                                  | Q-3     | Output/stroke (liner/rod geometry); GPM = strokes·output·efficiency·pumps; HHP = P·Q/1714                        |
| pressures         | `src/engine/pressures.test.ts`                             | Q-3     | Hydrostatic = 0.052·MW·TVD; mud window bounds; overbalance signs                                                 |
| circulation       | `src/engine/circulation.test.ts`                           | Q-3     | Times = volume/flow; lag strokes monotonic with volume                                                           |
| directional       | `src/engine/directional.test.ts`                           | Q-3     | MCM closure position; DLS per 100 ft; TVD/north/east consistency                                                 |
| torque-drag       | `src/engine/torque-drag.test.ts`                           | Q-3     | Hook loads bounded by tensile limit; neutral point position; profile length                                      |
| stuck-pipe        | `src/engine/stuck-pipe.test.ts`                            | Q-3     | Differential force ∝ overbalance·contact area; risk-level thresholds                                             |
| cuttings-transport| `src/engine/cuttings-transport.test.ts`                    | Q-3     | Moore slip velocity; CCI = K·AV·MW/400000; HCE ≤ 100; concentration formula                                      |
| surge-swab        | `src/engine/surge-swab.test.ts`                            | S-1..S-6| Params-object contract; 8-field result; velocity monotonicity; zero-velocity; annulus collapse; default pipeSpeed|
| cuttings UI       | `src/components/sections/CuttingsTransportSection.test.tsx`| C-1..C-4| Renders 5 cards; threshold statuses; null on empty                                                               |
| twin UI           | `src/components/visuals/DynamicTwinWindow.test.tsx`        | D-1..D-3| Renders sim ECD + delta; null-safe; no store mutation                                                            |

* *Integration**: `orchestrator` test asserts `results.surgeSwab.ecdSurge` defined after `calculateAll()` (store path) — locks the API fix end-to-end. **Preserved**: `well-control.test.ts`, `well-control-edge.test.ts` must stay green.

- --

## Formula Validation Matrix (API RP 13D · Bourgoyne §4 · IADC · Moore/Burkhardt)

| #  | Formula                                                                     | Module            | Source                                         | Test asserts                                     |

|---|----------------------------------------------------------------------------|------------------|-----------------------------------------------|-------------------------------------------------|
| F1 | Hydrostatic gradient 0.052 psi/ft per ppg                                   | physics           | API RP 13D                                     | gradient constant = 0.052                        |
| F2 | PV = θ600 − θ300; YP = θ300 − PV                                            | rheology          | API RP 13B-1 / Bourgoyne §4                    | θ600=40, θ300=25 → PV=15, YP=10                  |
| F3 | n = 3.322·log10(θ600/θ300)                                                  | rheology          | Bourgoyne §4                                   | n(40/25) ≈ 0.678                                 |
| F4 | K = θ300/511ⁿ                                                               | rheology          | Bourgoyne §4                                   | finite, > 0 for valid inputs                     |
| F5 | τ₀ = 2θ3 − θ6; μ_eff = PV + YP·300/511                                      | rheology          | API RP 13D §4                                  | μ_eff > PV when YP > 0                           |
| F6 | Annular velocity = 24.51·Q/(D₁²−D₂²)                                        | hydraulics        | API RP 13D                                     | matches hand calc                                |
| F7 | Re = 928·MW·V·D/μ; regime: <2100 laminar, >4000 turbulent                   | hydraulics        | API RP 13D / IADC                              | regime thresholds                                |
| F8 | Capacity = ID²/1029.4 bbl/ft                                                | volumetrics       | IADC Drilling Manual                           | constant 1029.4                                  |
| F9 | HHP = P·Q/1714; IF = MW·Q·V/1930; P_bit = MW·Q²/(10858·TFA²)                | pump/hydraulics   | IADC / API RP 13D                              | constants 1714/1930/10858                        |
| F10| ΔP_surge = [(PV·v)/(1000·(Dh−Dp)) + YP/(200·(Dh−Dp))]·(L/1000)              | surge-swab        | Bourgoyne §4 simplified Bingham (field approx.)| monotonic in v, L; symmetric surge=swab magnitude|
| F11| EMW = MW ± ΔP/(0.052·L)                                                     | surge-swab        | API RP 13D                                     | ecdSurge = MW + ΔP/(0.052·L)                     |
| F12| Annular displacement velocity (Burkhardt): v_ann = v_pipe·Dp²/(Dh²−Dp²)     | surge-swab        | Burkhardt 1961                                 | effectiveAnnularVelocity > 0, ∝ pipeSpeed        |
| F13| Moore slip velocity: (PV/(MW·0.25))·(√(1+0.048·0.25·(MW·(21−MW))/PV²)−1)·100| cuttings-transport| Moore (IADC)                                   | ≥ 5 clamp when AV>0, PV>0; 0 otherwise           |
| F14| CCI = K·AV·MW/400000                                                        | cuttings-transport| Moore / API RP 13D                             | > 0 when AV > 0; scales with K·AV·MW             |
| F15| Cuttings concentration: ROP·Dh²/(14.7·AV·(Dh²−Dp²))                         | cuttings-transport| IADC                                           | positive, bounded when AV > 0                    |

Note: F10 uses the existing simplified-Bingham field approximation (not full API RP 13D annular pressure-loss model) — Phase 1 locks current behavior via tests; the full RP 13D model is out of scope.

- --

## Success Metrics

| Metric                       | Target                                           | Gate                     |
|-----------------------------|-------------------------------------------------|-------------------------|
| `no-explicit-any` lint errors| 0                                                | `npm run lint`           |
| React hooks violations       | 0                                                | `npm run lint`           |
| Engine module coverage       | ≥ 80% line                                       | coverage run             |
| New test suites              | 13 (10 engine + surge-swab + 2 UI)               | `npm test`               |
| Existing tests               | Green (well-control ×2)                          | `npm test`               |
| SurgeSwab API mismatch       | Resolved — single-param object calls             | grep audit + `tsc -b`    |
| SurgeSwabResult mismatch     | Resolved — one interface, 8 fields               | grep audit (1 definition)|
| Undefined SurgeSwab reads    | 0 (App, alert-engine, TrippingChart, risk engine)| grep audit               |
| CuttingsTransportSection     | Renders 5 metrics, vanilla CSS                   | build + component test   |
| DynamicTwinWindow            | Wired + nav entry                                | build + component test   |

## Requirement → Task Traceability (implementable mapping)

| Req     | Task                                                                                                     |
|--------|---------------------------------------------------------------------------------------------------------|
| S-1, S-3| Fix `orchestrator.ts` SurgeSwab call (param object) + extend fallback to 8-field shape                   |
| S-2     | Extend engine `SurgeSwabResult` to 8 fields (compute v_ann, regime, modelUsed); store imports engine type|
| S-4     | Update `App.tsx` metrics, `alert-engine.ts`, `TrippingChart.tsx` to reconciled fields                    |
| S-5, S-6| `surge-swab.test.ts` (RED first) — physics + edge cases                                                  |
| C-1..C-3| Create `CuttingsTransportSection.tsx` + `.css` (Section + DataCard, tokens) + render test                |
| C-4     | Wire into `App.tsx` shell + `SidebarNav` ("cuttings")                                                    |
| D-1, D-2| Wire `DynamicTwinWindow` into `App.tsx` (`activeView === "twin"`) + `SidebarNav` entry + render test     |
| D-3     | Type `simulateScenario` modifications; purity test                                                       |
| Q-1     | Type-fix pass across 78 `any` sites (interfaces/`unknown`)                                               |
| Q-2     | Fix hooks in `Trajectory3D.tsx:83,226`, `TechnicalInsights.tsx:78`                                       |
| Q-3     | 10 engine suites (table above)                                                                           |
| Q-4     | Coverage config + gap tests                                                                              |
