# Proposal: Drilling Calculator — Anti-Collision Module (Phase I)

## Intent

The directional module computes a **single** well trajectory (MCM). Rigs drill multiple wells per pad — collision avoidance is the highest-consequence gap. Phase I delivers the core anti-collision math (ISCWSA position uncertainty + Separation Factor) as a pure engine with strict-TDD tests. It does NOT add UI or multi-well orchestration yet.

## Scope

### In Scope

- `AdjacentWellInput`/`Vec3`/`Ellipsoid3D`/`CollisionResult`/`SurveyTool` types
- `src/engine/anti-collision.ts`: `stationCovariance` (ISCWSA closed-form), `eigenSym3` (Jacobi), `closestTrajectoryPoints`, `analyzeCollision` (SF + risk), `analyzeAdjacentWell` (wrapper)
- `src/engine/anti-collision.test.ts` (strict TDD RED→GREEN)
- Root plan doc `ANTI_COLLISION_PLAN.md` (6-phase roadmap)

### Out of Scope

Phase II (collision matrix 1 primary vs N), Phase III (crowded azimuth / offset-well), Phase IV (3D Three.js viewer), Phase V (alert-engine integration), Phase VI (perf/docs/archive infra). Station-sampled min distance only — segment-level refinement is a later phase.

## Capabilities

Contract with sdd-spec; new capability `openspec/specs/anti-collision/` (this change body is the spec source; openspec/specs is populated on archive).

## Approach

SDD pipeline: proposal → spec → tasks → apply → verify → archive. STRICT TDD: RED (assert model via tests) → GREEN (implement) → REFACTOR. Gates: `npm test` (anti-collision suite + full regression), `npx tsc -b`.

## Affected Areas

| Area                               | Impact                                        |
|-----------------------------------|----------------------------------------------|
| `src/store/drilling-types.ts`      | Modified (new types after `DirectionalResult`)|
| `src/engine/anti-collision.ts`     | New (pure engine)                             |
| `src/engine/anti-collision.test.ts`| New                                           |
| `ANTI_COLLISION_PLAN.md`           | New (root roadmap)                            |

## Risks

| Risk                                                           | Likelihood  | Mitigation                                                                            |
|---------------------------------------------------------------|------------|--------------------------------------------------------------------------------------|
| ISCWSA single-station covariance degenerates at vertical (EE=0)| High        | Test locks real model behavior; documented for later phase (vertical-station handling)|
| Vitest forks worker hangs on Node 24                           | High        | Run `--pool=threads` (config-level fix deferred)                                      |
| Ellipsoid axes ordering                                        | Low         | Jacobi sorts eigenvalues descending; test asserts ordering                            |

## Rollback Plan

Delete the 3 new files + revert `drilling-types.ts` (pure additive type block). No engine consumers exist yet — zero regression surface.

## Dependencies

None external. Reuses `calculateTrajectory` from `directional.ts` for the adjacent-well wrapper.

## Success Criteria

- [ ] `npx vitest run src/engine/anti-collision.test.ts --pool=threads` → 8/8 green
- [ ] Full `npm test` regression green (existing 20 suites unaffected)
- [ ] `npx tsc -b` passes

## Prior Artifacts

- `ANTI_COLLISION_PLAN.md` (root) — roadmap + Phase I spec
- Engram `architecture/anti-collision` (#2067), tests-green note (#2068)
