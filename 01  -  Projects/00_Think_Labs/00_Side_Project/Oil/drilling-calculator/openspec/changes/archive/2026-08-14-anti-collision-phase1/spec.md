# Spec: Drilling Calculator — Anti-Collision Module (Phase I)

* *Change**: `anti-collision-phase1` | **Mode**: hybrid (engram + openspec) | **Strict TDD**: true (Vitest 4)

* *Gates**: `npm test` · `npx tsc -b`

* *Standards**: TypeScript strict (no `any`), interfaces over types, named exports, engine modules pure and side-effect free (no React imports in `src/engine`) — `directional.ts` is the reference pattern. Units: ft (depth), deg (inc/azi).

- --

## Capability 1: anti-collision

### Requirements

#### Requirement AC-1: ISCWSA station covariance

The system SHALL produce the symmetric 3x3 position covariance matrix (N,E,TVD, row-major `[NN,NE,NT,EN,EE,ET,TN,TE,TT]`) for a survey station using the ISCWSA closed-form propagation (Burgoyne/Williamson), with tunable error-model coefficients per tool (`MWD | GYRO | SENSOR`): depth `σD = depth·md`, inclination `σI`, azimuth `σA = σA0 + σA1/sin(inc)` (blow-up near vertical).

##### Scenario: Vertical well at 5000 ft

- GIVEN `stationCovariance(5000, 0, 0, "MWD")` with MWD depth coefficient 0.001
- WHEN the covariance is computed
- THEN `TT` SHALL equal `(0.001·5000)² = 25 ft²` (depth error dominates TVD)
- AND `NN` SHALL equal `(0.0145° in rad)²·5000²` (inclination error → northing)
- AND `EE` SHALL be `0` (single-station model degenerates at vertical, azimuth undefined)

##### Scenario: Matrix is symmetric

- GIVEN any `stationCovariance(md, inc, azi, tool)` result
- THEN `NE == EN`, `NT == TN`, `ET == TE`

#### Requirement AC-2: Symmetric 3x3 eigen-decomposition

The system SHALL decompose a symmetric 3x3 covariance into eigenvalues (descending) and matching orthonormal eigenvectors via the Jacobi rotation method.

##### Scenario: Diagonal matrix

- GIVEN `eigenSym3([4,0,0,0,2,0,0,0,1])`
- THEN values `[4, 2, 1]` (descending)

##### Scenario: Off-diagonal block

- GIVEN `eigenSym3([4,1,0,1,2,0,0,0,1])`
- THEN eigenvalues `[4.414213, 1.585786, 1]`

#### Requirement AC-3: Closest-approach distance

The system SHALL return the minimum center-to-center Euclidean distance between two sampled trajectories (station-to-station), with the indices and position vectors of the closest stations.

##### Scenario: Wells 50 ft apart

- GIVEN two vertical trajectories at `north+0` and `north+50`
- WHEN `closestTrajectoryPoints` runs
- THEN distance SHALL be `50 ft`

#### Requirement AC-4: Separation Factor and risk

The system SHALL compute `D0 = |s|` with `s = pA − pB`, then `sepSigma = σs = sqrt(uᵀ(C_A + C_B)u)` with `u = s / D0` (ISCWSA R-type: combined relative uncertainty projected onto the center-to-center direction) and `SF = D0 / (k · σs)`. `k` SHALL default to `2.0` (common "2-sigma ellipse + limit 1.5" pairing) and SHALL accept `3.5` (SPE-WPTS HSE-risk recommendation, SPE-187037-PA). Risk SHALL classify per the ISCWSA Separation Rules: `SF ≥ 4.0` SAFE, `1.5–4.0` MONITOR, `1.0–1.5` CAUTION, `< 1.0` CRITICAL.

##### Scenario: Crossing wells

- GIVEN two identical vertical trajectories sharing all stations
- WHEN `analyzeCollision` runs
- THEN `minDistance` SHALL be `0`, `sf` SHALL be `0`, `riskLevel` SHALL be `"CRITICAL"`

##### Scenario: Wells well-separated

- GIVEN two trajectories with `north` separated by `2000 ft`
- WHEN `analyzeCollision` runs
- THEN `sf >= 4.0` and `riskLevel` SHALL be `"SAFE"`

##### Scenario: HSE policy lowers SF

- GIVEN identical geometry analyzed with `sfK: 3.5` vs default
- WHEN both results are computed
- THEN the `sfK: 3.5` result SHALL have strictly lower `sf` for the same geometry

#### Requirement AC-5: 95% 3D uncertainty ellipsoids

The system SHALL return the 95% 3D uncertainty ellipsoid at each closest station: semi-axes `ellipseK·sqrt(eigenvalues)` with rotation from the eigenvectors, axes sorted largest → smallest. `ellipseK` SHALL default to `sqrt(χ²₃,0.95) = 2.795` (3D 95%), independent of `sfK`.

##### Scenario: Independent ellipse scaling

- GIVEN two vertical wells crossing at depth where the closest primary station has `TT = (0.001·3000)² = 9`
- WHEN `analyzeCollision` runs with `ellipseK: 1` then with the default
- THEN the semi-major axis SHALL be `3.0` for `ellipseK: 1` and `3·sqrt(7.815)` by default
- AND `ellipseK` changes do NOT alter `sf`

##### Scenario: Finite ordered axes

- GIVEN any `analyzeCollision` result
- THEN both ellipsoids have finite non-negative axes ordered `axes[0] ≥ axes[1] ≥ axes[2]`

#### Requirement AC-6: Adjacent-well wrapper

The system SHALL provide `analyzeAdjacentWell` that computes the adjacent trajectory from raw surveys via `calculateTrajectory` (honoring its wellhead offset) and analyzes it against the primary's trajectory.

##### Scenario: No regression on directional

- GIVEN the wrapper is used
- THEN it reuses `calculateTrajectory` and exposes the same `CollisionResult` contract
- AND existing `directional.test.ts` stays green

- --

## Files

- `src/store/drilling-types.ts` (modified — additive types)
- `src/engine/anti-collision.ts` (new)
- `src/engine/anti-collision.test.ts` (new)
- `ANTI_COLLISION_PLAN.md` (new — roadmap)
