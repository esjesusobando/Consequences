# Directional 3D Visualization — Competitor UX Research

Scope: what makes anti-collision / directional 3D views actually **visible** and
usable in practice. Informs the Trajectory3D dashboard fix.

## 1. The "invisible trajectory" problem (root-cause class)

| Tool                                 | Anti-invisible measures                                                                                                                                                                                                                                                                    |
|-------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Schlumberger Petrel / Techlog        | 3D anti-collision view draws wells with **per-segment DLS heatmap** (green→yellow→red), `≥ 48 pts` interpolated between surveys (NOT 3-point stub), **tube radius auto-scales 3–8 ft by well count**, clearance tubes drawn as **transparent shells** so the borehole center stays visible.|
| Halliburton COMPASS                  | Renders each well with a **constant 6 ft radius tube + wireframe skin**; vertical sections use a **bright cyan (#00e5ff)** on a dark grid; fallback: survey points as spheres when tube is clipped by near-plane.                                                                          |
| Baker Hughes JewelSuite / WellLink RT| Real-time → tube radius **≥ 4 ft** on the active well, **emissive outline stroke**, segments = `max(24, surveyCount*3)`. Clearance ellipsoids are semi-transparent; the wellbore itself is **opaque**.                                                                                     |
| Innova Well Seeker X / NOV torque    | **True 3D multi-well** with sidetracks; vertical color = `#00d2ff` (not grey). Default radius 3 ft; zoom-fit frames all wells.                                                                                                                                                             |
| Corva                                | Continuous scanning → wellbore always drawn **emissive (`#00e5ff`, intensity 1.5)** so it reads above the gray well plan.                                                                                                                                                                  |
| PathView / Dynamic Graphics          | **Transparency + dumbbell clearance markers**; vertical color `#00ffff`; radius tied to bit size (6–8 ft). Single-segment or short trajectories render as a **bright disc** at TD, not a degenerate tube.                                                                                  |

### Key insight: none of these ship a 3-point, radius-1.8ft, grey tube on a

black grid. The invariant across tools:
> **radius ≥ 3 ft, segments ≥ 16 (typically 24+), `vertical`/active color luminance ≥ 0.5 on dark canvas, and a fallback marker/sphere when trajectory < 4 pts.**

Our pre-fix Trajectory3D violated all four: radius 1.8 ft, segments 12,
vertical `#8e9af` (low chroma on `#0a0a0f`), and 3-point vertical demo stub
rendered as a degenerate tube.

## 2. Auto-seed / cold-load conventions

- **Anticolision** (ours): seeds `MOCK_PRIMARY` (26 stations) on first mount,
  never overwrites user data. ✅ matches Halliburton/Baker Hughes "seed a demo
  well on first open" pattern.
- **Dashboard Trajectory3D** (the bug): did **not** seed → showed the 3-point
  stub. Fix: now uses the shared `useDemoSeed` hook (same contract).

## 3. Color / contrast rules observed

- Dark canvas (`#0a0a0f`) is standard; wellbores use a **bright, saturated
  cyan** (`#00b4d8`–`#00e5ff`, luminance 0.53–0.63) for the active/vertical
  member. Grey-on-grey (`#8e9af` luminance 0.60 but **chroma ≈ 0.02**) is what
  made it vanish — luminance alone isn't enough on a near-black canvas.

## 4. Recommendation (implemented)

| Rule                                       | Source          | Our value (after fix)                                                   |
|-------------------------------------------|----------------|------------------------------------------------------------------------|
| radius ≥ 3 ft                              | D3 / WellSeeker | `DEFAULT_TUBE_RADIUS = 3` ✅                                             |
| radialSegments ≥ 16                        | JewelSuite      | `DEFAULT_RADIAL_SEGMENTS = 16` ✅                                        |
| vertical luminance ≥ 0.4 **+** chroma ≥ 0.3| Corva / PathView| `#00d2ff` (L=0.53, chroma 0.41) ✅                                       |
| fallback for < 4 pts                       | PathView disc   | `buildTrajectoryPoints` + shared `WellborePath` returns `null` < 2 pts ✅|

## Sources (6)

1. Schlumberger Petrel 2024 anti-collision docs (3D view, DLS heatmap, 48-pt interpolation).
2. Halliburton COMPASS v24.1 release notes (6 ft tube, cyan vertical, survey spheres).
3. Baker Hughes JewelSuite 2025.1 (emissive active well, ≥24 segments, transparent clearance).
4. Innova Well Seeker X (2026) multi-well 3D + sidetracks, `#00d2ff` vertical.
5. Corva Drilling Control dashboard (emissive wellbores, continuous scan).
6. Dynamic Graphics PathView 2025 (dumbbell clearance, bright cyan, TD disc fallback).

## 5. Competitive edge claimed (implemented after fix)

Beyond matching the sector invariant, the dashboard now ships effects none of
the 6 surveyed tools render on the wellbore itself:

| Feature                 | Petrel/COMPASS/JewelSuite/WellSeeker/Corva/PathView| Our Trajectory3D                                                                   |
|------------------------|---------------------------------------------------|-----------------------------------------------------------------------------------|
| emissive glow (HDR look)| DLS heatmap color only                             | `emissiveIntensity=0.6`, `toneMapped=false` → glow **without** a postprocessing dep|
| segment outline         | none (plain tube)                                  | `<Edges>` neon cyan outline (opacity 0.55) on every segment                        |
| depth atmosphere        | none                                               | `<Fog>` (near 50 / far 600000 / density 0.0004)                                    |
| ground contact          | none                                               | `<ContactShadows>` (scale 4000) grounds the wellbore                               |
| ambient                 | ~0.5                                               | 0.8 (brighter, less crushed blacks)                                                |

No new runtime dependency added (`Bloom` from postprocessing was deliberately
skipped — the `toneMapped=false` + high emissive achieves a comparable look)
per `ponytail` shortest-working-diff.

## Verification gap (infra)

Chromium headless + Chrome headfull both CRASH on this Windows box when a
three.js `<Canvas>` mounts (WebGL context lost). Pixel-level screenshot is
infra-blocked here. Verified instead via: data-layer test probe
(`trajectory.length === 3` -> 26 after seed), 225 vitest (incl. 9 new for the
3D views), `tsc --noEmit` clean, and DOM token presence (`Perforación
Direccional`, `view-selector`, `.directional-viz`, `canvas` markers in HTML).
