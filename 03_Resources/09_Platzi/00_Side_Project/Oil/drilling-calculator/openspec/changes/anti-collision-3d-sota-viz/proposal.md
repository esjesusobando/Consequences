# Proposal: Anti-Colisión 3D Visual SOTA Upgrade

## Intent

The 3D anti-collision view is functionally correct (225 tests green, common-frame unified, legend working) but visually underwhelming. The user wants petroleum-industry SOTA with "wow" factor — not just correct, but **stunning**. Competitors (Petrel, WellArchitect, LOGIX) have risk-colored wellbore sections, MASD tubes, depth grid planes, and polished camera/animation UX. Our 883-line god component also needs decomposition before adding more features.

## Scope

### In Scope

* *Component Decomposition** (prerequisite — enables everything else):
- Extract `CameraController`, `UncertaintyEllipsoid`, `ClosestApproachMarker`, `SurfaceMarker` into `src/components/visuals/`
- Extract `DepthGrid`, `CompassRose`, `InfoPanel` as new components
- Target: `AntiCollision3D.tsx` < 300 lines (orchestrator only)

* *Tier 1 — Spec Gaps (trivial fixes):**
- Adjacent well opacity 0.85x de-emphasis
- Camera FOV 50 (currently 40)
- Primary well color `#ff006e` (currently cyan)
- Sticky tooltip on legend hover (300ms)
- Tooltip content hierarchy (name → risk → distance)

* *Tier 2 — Petroleum Industry Standard (HIGH impact):**
- MASD tubes around offset wells (green/red pass/fail)
- Risk-colored wellbore sections (green→yellow→red gradient by proximity)
- Depth grid planes at 1000ft TVD intervals with labels
- Wellhead surface markers (distinct per-well markers at surface)
- Compass rose / N-E orientation indicator

* *Tier 3 — Wow Factor:**
- Animated camera transitions (slerp interpolation, not instant jump)
- Subtle particle trail along wellbore paths (drilling direction indicator)
- Glow/bloom effects on critical risk indicators, emissive wellbore outlines
- Depth fog enhancement (atmospheric perspective)
- Glassmorphism info panel overlay
- Loading/transition entrance animations for wells and UI elements

### Out of Scope

- `anti-collision.ts` engine (untouched — math is correct)
- Ladder plot, traveling cylinder (2D chart overlays, deferred)
- No-go zone visualization (complex geometry, deferred)
- Real-time WITSML streaming (not a planning tool)
- Earth model / seismic context

## Capabilities

### New Capabilities

- `anti-collision-3d-sota-visual`: petroleum-industry-grade visual elements (MASD tubes, risk coloring, depth grids, compass, particle trails, glow effects, animated transitions)

### Modified Capabilities

- `anti-collision-3d-visualization` (existing): spec gaps E1.1, E3.2, E4.2, E5.1, E5.2 applied; component decomposition

## Approach

1. **Phase 0**: Decompose `AntiCollision3D.tsx` (extract sub-components, zero behavior change)
2. **Phase 1**: Spec gap fixes (FOV, color, opacity, tooltips) — quick wins
3. **Phase 2**: Petroleum standard (MASD tubes, risk coloring, depth grids, markers, compass)
4. **Phase 3**: Wow factor (camera animation, particles, glow, fog, glassmorphism)
5. **Verification**: `npm test` (225+ green), `npx tsc --noEmit`, manual `npm run dev`

## Affected Areas

| Area                                         | Impact  | Description                                                                                                                          |
|---------------------------------------------|--------|-------------------------------------------------------------------------------------------------------------------------------------|
| `src/components/sections/AntiCollision3D.tsx`| Modified| Decompose from 883→<300 lines, consume new sub-components                                                                            |
| `src/components/visuals/`                    | New     | CameraController, UncertaintyEllipsoid, ClosestApproachMarker, MASDTube, DepthGrid, CompassRose, InfoPanel, ParticleTrail, GlowEffect|
| `src/components/sections/WellLegend.tsx`     | Modified| Tooltip additions (E5.1, E5.2)                                                                                                       |
| `src/engine/scene.ts`                        | Modified| MASD distance computation, risk-level color mapping                                                                                  |
| `src/engine/masd.ts`                         | New     | MASD tube geometry + pass/fail logic (pure, no React)                                                                                |

## Risks

| Risk                                     | Likelihood  | Mitigation                                                                        |
|-----------------------------------------|------------|----------------------------------------------------------------------------------|
| Performance regression (more draw calls) | Med         | Reuse InstancedMesh pattern; particle count capped; bloom via post-processing only|
| Component decomposition breaks tests     | Low         | Extract pure sub-components first; test each independently; final integration test|
| Multi-layer transparent sorting artifacts| Med         | Use `depthWrite: false` + renderOrder control; test with 5+ wells                 |
| Html overlay proliferation (perf)        | Low         | Cap labels at selected pair + nearest 3 wells                                     |

## Rollback Plan

All changes additive (new components) + decomposition (behavior-preserving refactor). `git revert` of change commits restores prior state. Engine untouched. No migration.

## Dependencies

Existing stack only: React 19, Three.js/R3F, drei, Zustand, vitest. No new npm packages.

## Success Criteria

- [ ] 225+ tests green, `tsc --noEmit` clean, build passes
- [ ] `AntiCollision3D.tsx` < 300 lines
- [ ] FOV=50, primary=#ff006e, adjacent opacity=0.85x
- [ ] Tooltips visible on legend hover with name/risk/distance hierarchy
- [ ] MASD tubes render around offset wells with green/red coloring
- [ ] Risk-colored wellbore sections (gradient by proximity)
- [ ] Depth grid planes at 1000ft intervals with labels
- [ ] Per-well surface markers at wellhead locations
- [ ] Compass rose overlay (N-E indicator)
- [ ] Smooth animated camera transitions between views
- [ ] Particle trail visible along wellbore paths
- [ ] Glow/bloom on critical risk indicators
- [ ] Depth fog enhances atmospheric perspective
- [ ] Glassmorphism info panel with SF, d_min, sigma, risk
- [ ] Entrance animations for wells and UI elements
