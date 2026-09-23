# Spec: surge-swab-calculation

> **Source**: archived change `drilling-calculator-phase1` (2026-08-08) — Capability 1. Verbatim from the change spec; owned by `src/engine/surge-swab.ts` + `src/engine/orchestrator.ts`.

## Requirements

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
