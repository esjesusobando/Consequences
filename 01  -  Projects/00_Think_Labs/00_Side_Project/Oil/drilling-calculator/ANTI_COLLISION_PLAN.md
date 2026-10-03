# Anti-Collision / Well Collision Analysis — Plan & Phase I Spec

## Context

The directional module computes a **single** well trajectory (Minimum Curvature
Method). Real rigs drill many wells from one pad; the highest-consequence gap is
collision avoidance against adjacent (existing or planned) wellbores. This module
adds **ISCWSA-standard** collision analysis: per-station position covariance,
95% uncertainty ellipsoids, closest-approach distance, and a Separation Factor
(SF) risk classification.

## Phased Plan (6 phases)

- **Phase I**  — Core Math (this doc): ISCWSA covariance + eigen + SF + min distance + unit tests.
- **Phase II** — Collision matrix: one primary well vs N adjacent wells, sorted risk table.
- **Phase III** — Crowded-azimuth + offset-well / re-entry (wellb8) special cases.
- **Phase IV** — UI: 3D cross-section viewer (Three.js) rendering ellipsoids + closest-approach marker.
- **Phase V**  — Tactical advice / proactive alerts integrated into the existing alert-engine.
- **Phase VI** — Regression + performance test suite, docs, archive.

## Phase I — Specification (SDD)

### Inputs

- Two trajectories (primary + one adjacent) as `TrajectoryPoint[]` (north/east/tvd in ft).
- Per-well survey tool: `"MWD" | "GYRO" | "SENSOR"` (drives the error model).
- Two independent confidence multipliers (`AnalyzeOptions`): `sfK` (Separation
  Factor confidence, default `2.0` = the common "2-sigma ellipse + limit 1.5"
  pairing; **SPE-WPTS HSE-risk recommendation 3.5**, SPE-187037-PA) and `ellipseK`
  (95% 3D uncertainty-ellipsoid scaling, default `sqrt(χ²₃,0.95) = 2.795`, NOT the
  1D 2.0).

### Model

- **ISCWSA-style reduced station covariance** `C(N,E,T)` (Burgoyne / Williamson
  closed form). Coefficients are tunable constants in `ISCWSA_ERRORS`.
  > **SOTA provenance**: the full ISCWSA error model (Rev 4/5) is *accumulative* —
  > 80+ error sources with weighting functions and propagation modes (systematic
  > within a leg, random per station, global across wells) summed along the
  > wellpath. The closed-form single-station propagation used here is a valid
  > Phase I reduction; the full accumulating model + cross-well correlation of
  > global errors (r12, e.g. declination DEC) is the documented Phase III upgrade.
  > Combined covariance assumes uncorrelated wells (r12 = 0, the standard default).
- **95% 3D uncertainty ellipsoid** = eigen-decomposition of `C`, axes scaled by `ellipseK`.
- **Closest approach** = min pairwise Euclidean distance over station samples
  (station-sampled; segment-level refinement is Phase II/III).
- **Separation Factor** (ISCWSA R-type rule): `SF = D0 / (k · σs)` with
  `s = pA − pB`, `D0 = |s|`, `u = s/D0`, and `σs = sqrt(uᵀ (C_A + C_B) u)`
  (combined relative uncertainty projected onto the center-to-center direction).

### Risk bands (ISCWSA Separation Rules)

- `SF ≥ 4.0` SAFE (monitoring threshold — report below 4.0)
- `1.5–4.0` MONITOR
- `1.0–1.5` CAUTION (approach the plan-adjust band → adjust below 1.5)
- `< 1.0` CRITICAL (never plan below 1.0 without dispensation)

### Output

`CollisionResult { minDistance, sf, sepSigma, riskLevel, stationA, stationB,
closestA, closestB, ellipseA, ellipseB }`

### Acceptance (unit tests)

1. Vertical well covariance: `TT = (0.001·MD)²`, `NN = (σI·L)²`, `EE = 0` at azi 0,
   matrix symmetric.
2. `eigenSym3(diag(4,2,1))` ⇒ values `[4,2,1]`; off-diagonal block ⇒ `[4.414,1.586,1]`.
3. `closestTrajectoryPoints` of two 50 ft-separated verticals ⇒ 50 ft.
4. `analyzeCollision` of crossing wells ⇒ dist 0, sf 0, CRITICAL.
5. `analyzeCollision` of wells 2000 ft apart ⇒ sf ≥ 4.0, SAFE.
6. `sfK` and `ellipseK` are independent knobs; ellipsoid axes scale with 2.795.

### Files

- `src/store/drilling-types.ts` — new types (`SurveyTool`, `Vec3`, `Ellipsoid3D`, `CollisionResult`)
- `src/engine/anti-collision.ts` — engine
- `src/engine/anti-collision.test.ts` — tests
- `openspec/changes/anti-collision-phase1/` — SDD artifacts (proposal, spec, tasks)
