# Spec: quality-requirements

> **Source**: archived change `drilling-calculator-phase1` (2026-08-08) — cross-cutting implementation-level requirements (Q-1..Q-4). Q-1..Q-3 accepted (gates green). **Q-4 is DEFERRED — NOT accepted** (task T-26 coverage infrastructure was out of scope for Phase 1; coverage threshold in `openspec/config.yaml` remains 0).

## Requirements

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

#### Requirement Q-4: Coverage threshold — DEFERRED (not accepted)

Engine modules SHALL reach ≥ 80% line coverage (config `openspec/config.yaml` `verify.coverage_threshold` raised from 0 to 80 for the engine layer).

> **Status: DEFERRED** — T-26 (coverage infrastructure: `@vitest/coverage-v8` + config) was declared out of scope for Phase 1 by the orchestrator. Re-enable via a future phase (e.g. Phase 3 or a dedicated coverage change). `coverage_threshold` remains 0 in `openspec/config.yaml`.

##### Scenario: Coverage gate

- GIVEN the engine layer
- WHEN coverage is measured
- THEN every engine module reports ≥ 80% line coverage
