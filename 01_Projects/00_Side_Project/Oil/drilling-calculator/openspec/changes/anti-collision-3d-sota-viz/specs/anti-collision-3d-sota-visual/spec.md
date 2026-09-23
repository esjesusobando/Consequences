# Spec: anti-collision-3d-sota-visual

## Purpose

Petroleum-industry-standard visual elements and premium visual effects for the 3D anti-collision view. Covers MASD tubes, risk coloring, depth grids, compass rose, animated camera, particles, bloom, fog, glassmorphism, and entrance animations.

## Requirements

### Tier 2 — Petroleum Industry Standard

#### Requirement S-1: MASD tubes

The system SHALL render a transparent tube around each offset well trajectory representing the Minimum Allowable Separation Distance. Tube radius SHALL equal the MASD value (ft) mapped to 3D scale. Tube color SHALL be green when `SF ≥ 4.0` and red when `SF < 4.0` at the closest approach station.

##### Scenario: Safe separation

- GIVEN an offset well with `SF = 5.2` at closest approach
- WHEN the MASD tube renders
- THEN the tube color SHALL be green (hex `#00c853`)

##### Scenario: Critical separation

- GIVEN an offset well with `SF = 0.8` at closest approach
- WHEN the MASD tube renders
- THEN the tube color SHALL be red (hex `#ff1744`)

##### Scenario: Tube radius matches MASD

- GIVEN MASD = 50 ft, scene scale 1 ft = 1 unit
- WHEN the tube renders
- THEN the tube radius SHALL be 50 units

#### Requirement S-2: Risk-colored wellbore sections

The system SHALL color each wellbore segment by proximity to the nearest offset well using a continuous gradient: green (`SF ≥ 4.0`) → yellow (`SF ≈ 2.0`) → red (`SF < 1.0`). Color SHALL update when the selected well pair changes.

##### Scenario: Gradient at transition

- GIVEN a well with `SF` ranging from 5.0 (shallow) to 0.5 (deep)
- WHEN the wellbore renders
- THEN shallow segments SHALL be green and deep segments SHALL be red with a smooth transition

##### Scenario: Pair change updates colors

- GIVEN well A is colored against well B
- WHEN the user selects well C as the new offset
- THEN well A's segment colors SHALL recompute against well C's proximity

#### Requirement S-3: Depth grid planes

The system SHALL render horizontal grid planes at 1000 ft TVD intervals from surface to maximum TVD. Grid lines SHALL use `#ffffff` at 0.08 opacity. Labels SHALL display depth in feet, positioned at the grid edge, font 11px, color `#ffffff` at 0.5 opacity.

##### Scenario: Grid plane count

- GIVEN wells with max TVD = 12,000 ft
- WHEN the depth grid renders
- THEN grid planes SHALL exist at 0, 1000, 2000, ... 12000 ft (13 planes)

##### Scenario: Label readability

- GIVEN a depth grid plane at 5000 ft
- WHEN the camera is at a normal viewing distance
- THEN the label "5000 ft" SHALL be visible at the grid edge

#### Requirement S-4: Wellhead surface markers

The system SHALL render a distinct marker at each well's surface location (TVD = 0). Each well SHALL have a unique marker shape or icon from a set of at least 5 distinct markers (circle, diamond, square, triangle, cross). Marker color SHALL match the well's assigned color.

##### Scenario: Distinct markers for 5 wells

- GIVEN 5 wells with different assigned colors
- WHEN markers render at surface
- THEN each well SHALL have a visually distinct shape

##### Scenario: Marker at wellhead

- GIVEN well A with wellhead at `(N=0, E=0)`
- WHEN the scene renders
- THEN a marker SHALL be positioned at `(0, 0, 0)` (surface plane)

#### Requirement S-5: Compass rose

The system SHALL display a compass rose overlay in the top-right corner of the 3D viewport. The compass SHALL show N, E, S, W labels and rotate with camera azimuth. Size SHALL be 80×80px. Background SHALL be transparent with a subtle ring border.

##### Scenario: North indicator

- GIVEN the 3D scene with default camera orientation
- WHEN the compass renders
- THEN "N" SHALL point in the scene's north direction

##### Scenario: Camera rotation

- GIVEN the camera orbiting 90° clockwise
- WHEN the compass updates
- THEN the "N" label SHALL rotate to match the new azimuth

### Tier 3 — Wow Factor

#### Requirement S-6: Animated camera transitions

The system SHALL animate camera transitions using slerp interpolation over 800ms ± 100ms with ease-in-out cubic easing. Transitions SHALL trigger on well selection change and view reset.

##### Scenario: Well selection transition

- GIVEN camera at well A's viewpoint
- WHEN the user selects well B
- THEN the camera SHALL smoothly animate to well B's viewpoint over ~800ms
- AND the motion SHALL use slerp (not linear lerp)

##### Scenario: Instant selection blocked during transition

- GIVEN a camera transition in progress
- WHEN the user selects another well
- THEN the current transition SHALL complete before starting a new one

#### Requirement S-7: Particle trail along wellbore

The system SHALL render particles along the primary well trajectory. Particle count SHALL not exceed 100. Particles SHALL move in the drilling direction (MD increasing) with a lifecycle of 2000ms ± 200ms. Emission rate SHALL be 10 particles/second. Particle color SHALL match the primary well color (`#ff006e`). Particle size SHALL be 0.15 scene units.

##### Scenario: Particle visibility

- GIVEN the primary well is selected and visible
- WHEN the scene renders
- THEN up to 100 particles SHALL be visible along the wellbore

##### Scenario: Performance cap

- GIVEN the scene with 5 wells loaded
- WHEN particle system runs
- THEN total draw calls SHALL not increase by more than 1 (instanced particles)

#### Requirement S-8: Glow/bloom post-processing

The system SHALL apply Unreal Bloom post-processing to the 3D scene. Bloom intensity SHALL be 0.4, luminance threshold SHALL be 0.8, radius SHALL be 0.3. Only emissive materials (closest-approach markers at `SF < 1.5`, MASD tube red sections) SHALL trigger bloom.

##### Scenario: Bloom on critical marker

- GIVEN a closest-approach marker at `SF = 1.0`
- WHEN the scene renders with post-processing
- THEN the marker SHALL exhibit visible glow

##### Scenario: No bloom on normal elements

- GIVEN a well trajectory with normal (non-emissive) material
- WHEN the scene renders
- THEN the trajectory SHALL NOT bloom

#### Requirement S-9: Depth fog

The system SHALL enable exponential depth fog. Fog color SHALL match scene background. Density SHALL be 0.002. Fog SHALL begin at 500 scene units from camera and fully obscure geometry at 8000 scene units.

##### Scenario: Near objects clear

- GIVEN an object at 100 scene units from camera
- WHEN fog renders
- THEN the object SHALL be fully visible

##### Scenario: Far objects faded

- GIVEN an object at 6000 scene units from camera
- WHEN fog renders
- THEN the object SHALL be partially obscured (~75% fogged)

#### Requirement S-10: Glassmorphism info panel

The system SHALL render the info panel (SF, d_min, sigma, risk) with glassmorphism styling: `backdrop-filter: blur(12px)`, background `rgba(15, 23, 42, 0.7)`, border `1px solid rgba(255,255,255,0.1)`, border-radius `12px`, box-shadow `0 8px 32px rgba(0,0,0,0.3)`.

##### Scenario: Panel visual style

- GIVEN the info panel is visible
- WHEN rendered
- THEN the panel background SHALL have visible backdrop blur
- AND the panel SHALL have a subtle border and shadow

#### Requirement S-11: Entrance animations

The system SHALL animate well trajectories and UI elements on initial load. Well trajectories SHALL draw in over 1200ms ± 200ms (path growth from wellhead to TD). UI panels SHALL fade-in over 600ms with ease-out. Entrance animations SHALL play once on mount, not on re-render.

##### Scenario: Well path draw-in

- GIVEN the 3D scene mounts for the first time
- WHEN wells appear
- THEN each well trajectory SHALL grow from surface to TD over ~1200ms

##### Scenario: Re-selection no re-animate

- GIVEN entrance animations have completed
- WHEN the user selects a different well
- THEN entrance animations SHALL NOT replay

## Acceptance Criteria

- [ ] MASD tubes green/red by SF, radius = MASD value (S-1)
- [ ] Wellbore gradient green→yellow→red by proximity (S-2)
- [ ] Depth grid at 1000 ft intervals with labels (S-3)
- [ ] Per-well distinct surface markers (S-4)
- [ ] Compass rose 80×80px, rotates with camera (S-5)
- [ ] Camera transitions 800ms slerp (S-6)
- [ ] ≤ 100 particles, instanced, 2s lifecycle (S-7)
- [ ] Bloom on critical markers only, intensity 0.4 (S-8)
- [ ] Depth fog density 0.002, range 500–8000 units (S-9)
- [ ] Glassmorphism panel: blur(12px), rgba bg, border, shadow (S-10)
- [ ] Entrance: 1200ms path draw-in, 600ms panel fade, play once (S-11)
- [ ] 225+ tests green, `tsc --noEmit` clean
- [ ] No new npm dependencies
