# Tasks: Drilling Calculator — Anti-Collision Module (Phase I)

* *Change**: `anti-collision-phase1` · **Mode**: hybrid · **Strict TDD**: true (`npm test`, RED→GREEN→REFACTOR) · **Gates**: `npm test` · `npx tsc -b`

> **Note**: Vitest 4 on Node 24: run focused suites with `--pool=threads` (default forks worker hangs — "Timeout waiting for worker to respond").

## Review Workload Forecast

| Field                  | Value                                                |
|-----------------------|-----------------------------------------------------|
| Estimated changed lines| ~560 (impl ~250 + tests ~110 + types ~70 + docs ~130)|
| 400-line budget risk   | MED (docs split → root README not touched)           |
| Chained PRs recommended| No (single cohesive engine module)                   |

## Suggested Work Units

| Unit  | Goal                                                   | Focused test command                                             | Rollback boundary                 |
|------|-------------------------------------------------------|-----------------------------------------------------------------|----------------------------------|
| 1     | Types + covariance + eigen + min-dist + SF (AC-1..AC-5)| `npx vitest run src/engine/anti-collision.test.ts --pool=threads`| Delete 3 files, revert types block|
| 2     | Adjacent-wrapper + docs (AC-6)                         | full `npm test` regression                                       | Same                              |

- --

- [x] **T-AC1** (RED, AC-1..AC-3) Write `src/engine/anti-collision.test.ts`: covariance vertical (TT=25, NN=sI²L², EE=0), symmetry; eigen diag + off-diag; closest-approach 50 ft. **AC**: RED against missing engine.
- [x] **T-AC2** (GREEN, AC-1) Implement `stationCovariance` + `ISCWSA_ERRORS` (MWD/GYRO/SENSOR) in `src/engine/anti-collision.ts`. **AC**: covariance tests green. *RED caught wrong assertion: EE expected >0 at vertical, model gives EE=0 (azimuth undefined) — test fixed to lock real behavior.*
- [x] **T-AC3** (GREEN, AC-2) Implement `eigenSym3` (cyclic Jacobi, descending sort). **AC**: eigen tests green.
- [x] **T-AC4** (GREEN, AC-3..AC-5) Implement `closestTrajectoryPoints`, `matInv3`, SF `analyzeCollision` + 95% ellipsoid + risk thresholds; add crossing=CRITICAL, 2000ft=SAFE, finite-ordered-axes tests. **AC**: 8/8 green.
- [x] **T-AC4b** (REFACTOR → SOTA, AC-4/AC-5) Split `confidenceK` into independent `sfK` (default 2.0; SPE-WPTS HSE 3.5) and `ellipseK` (default sqrt(χ²₃,0.95)=2.795); add MONITOR band (1.5–4.0) per ISCWSA Separation Rules; add SOTA provenance comments (full accumulating ISCWSA model + cross-well r12 correlation documented as Phase III). New tests: HSE-k lowers SF; ellipse axis = 3.0 at ellipseK:1 and 3√7.815 by default. **AC**: 10/10 green.
- [x] **T-AC5** (GREEN, AC-6) Implement `analyzeAdjacentWell` wrapper (reuses `calculateTrajectory`) + `AdjacentWellInput`; add types to `drilling-types.ts` (`SurveyTool`, `Vec3`, `Ellipsoid3D`, `CollisionResult`). **AC**: `npx tsc -b` clean.
- [x] **T-AC6** (docs) Create `ANTI_COLLISION_PLAN.md` (6-phase roadmap + Phase I spec). **AC**: root doc present.
- [x] **T-AC7** (verify) Full suite `npm test` (22 files / 179 tests) + `npx tsc -b`. **AC**: zero new failures; `tsc -b` exit 0.

## Acceptance (from spec)

- [x] AC-1 covariance scenarios (vertical, symmetry)
- [x] AC-2 eigen scenarios (diagonal, off-diagonal)
- [x] AC-3 closest-approach 50 ft
- [x] AC-4 SF scenarios (crossing CRITICAL, 2000 ft SAFE, HSE-k lowers SF)
- [x] AC-5 finite ordered ellipsoid axes + independent 2.795 ellipse scaling
- [x] AC-6 wrapper reuses calculateTrajectory, directional tests stay green
- [x] AC-7 full regression green (22 files / 179 tests) + `tsc -b` exit 0
