# Proposal: Drilling Calculator Phase 1 — Critical Fixes & Test Coverage

## Intent

The calculator (React 19 + TS 5.9 strict + Vitest 4) carries verified debt: 78 `no-explicit-any` errors, 2 hooks violations, 10/12 engine modules untested, and a CRITICAL SurgeSwab bug — `orchestrator.ts:88` passes 4 positional args to a 1-param function, so consumers read `ecdSurge` as undefined. Judges confirmed these gaps. Phase 1 fixes bugs + adds tests; it does NOT rebuild the working architecture.

## Scope

### In Scope

- Eliminate 78 `no-explicit-any` (typed interfaces; `unknown`)
- Fix hooks: `Trajectory3D.tsx:83,226`, `TechnicalInsights.tsx:78`
- Fix SurgeSwab API: orchestrator call → `SurgeSwabParams` object
- Reconcile `SurgeSwabResult` (engine vs store types); fix consumers (App.tsx, alert-engine.ts, TrippingChart.tsx)
- Add 10 Vitest suites: rheology, hydraulics, volumetrics, pump, pressures, circulation, directional, torque-drag, stuck-pipe, cuttings-transport
- Build `CuttingsTransportSection.tsx` (vanilla CSS — no Tailwind)
- Wire `DynamicTwinWindow.tsx` into App.tsx

### Out of Scope

Phase 2 (alert history, CSV/PDF export, share URLs, print CSS), Phase 4 (memoization, code splitting), store/architecture refactors, style migrations, Web Workers, JetoChat, 3D upgrades, ARIA/strings/SVG pass.

## Capabilities

Contract with sdd-spec; `openspec/specs/` empty — all new.
- `surge-swab-calculation`: params/result contract + consumers
- `cuttings-transport`: results section UI
- `digital-twin-view`: twin wiring in App shell
- Modified: None (lint/hooks/tests are implementation-level)

## Approach

Per module: type-fix → hook-fix → test. STRICT TDD (RED→GREEN→REFACTOR). SurgeSwab per improvement-plan template; store imports engine type; UI follows `Section`/`DataCard` + design tokens. Gates: `npm test`, `tsc -b`, `npm run lint`, `npm run build`.

## Affected Areas

| Area                                                     | Impact                     |
|---------------------------------------------------------|---------------------------|
| `src/engine/orchestrator.ts`                             | Modified (call:88)         |
| `src/engine/surge-swab.ts`, `src/store/drilling-types.ts`| Modified (type contract)   |
| `Trajectory3D.tsx`, `TechnicalInsights.tsx`              | Modified (hooks: 83,226,78)|
| `src/engine/*.test.ts` ×10                               | New                        |
| `CuttingsTransportSection.tsx`                           | New                        |
| `src/App.tsx`                                            | Modified (wire twin)       |

## Risks

| Risk                         | Likelihood  | Mitigation                      |
|-----------------------------|------------|--------------------------------|
| SurgeSwab fix changes outputs| Med         | Tests lock contract             |
| `any` fixes regress types    | Med         | `tsc -b` per commit             |
| >400-line PR budget          | High        | Chained PRs (sdd-tasks forecast)|
| Plan sample uses Tailwind    | High        | Translate to vanilla CSS tokens |

## Rollback Plan

Per-module git revert; additive/type-level. SurgeSwab isolated to call + type import — revert those two files on regression, keep `output-guards.ts`. Tests removed last; build gate blocks merge.

## Dependencies

None external. SurgeSwabResult contract decided first; existing `well-control*.test.ts` stays green.

## Success Criteria

- [ ] `npm run lint` → 0 `no-explicit-any`; `tsc -b` passes
- [ ] 10 new suites + existing tests green
- [ ] No undefined SurgeSwab reads; sections render

## Prior Artifacts

- `AUDIT.md` (repo root) — audit, gap inventory (129-143)
- `os_docs/Drilling_Calculator_Improvement_Plan_FINAL.md` — plan + code
- Engram #1991 (plan), #1990/#1992 (judges)
- Judges: A NO-GO (gaps confirmed); B GO-WITH-MODIFICATIONS (SurgeSwab bugs)
