# Spec: Anti-Collision 3D Visualization

## Purpose

Define the behavior of the multi-well 3D anti-collision view: all trajectories rendered in a single common coordinate frame anchored at the primary wellhead, with an HTML legend for selection/visibility/tooltip, selected-pair ellipsoids, stable per-well colors, and camera framing over all visible wells.

This spec owns the behavior of `src/components/sections/AntiCollision3D.tsx`, `src/components/sections/WellLegend.tsx`, `src/engine/scene.ts`, and the demo auto-seed in `Anticolision.tsx`.

## Requirements

### Requirement AC3D-1: Common coordinate frame

All wells SHALL render in the primary-wellhead frame: every trajectory point is offset by the **primary** well's `surfaceNorth`/`surfaceEast` (from the shared frame), NOT by each well's own first point. The primary well SHALL render at the origin.

#### Scenario: Wells keep their true relative offsets

- GIVEN a primary at (0, 0) and an adjacent well with `wellheadNorth: 300`
- WHEN the 3D view renders
- THEN the adjacent tube starts at north ≈ 300 in scene space, and the two tubes do NOT overlap at the origin

#### Scenario: Primary anchors the origin

- GIVEN any valid scene
- WHEN the primary trajectory is rendered
- THEN every primary point maps to (east − surfaceEast, −tvd, north − surfaceNorth) with the primary wellhead at (0, 0, 0)

### Requirement AC3D-2: Closest-approach marker consistency

The closest-approach marker SHALL be internally consistent: the dashed line and endpoint spheres use raw frame vertices (a, b), the group is positioned at the midpoint `mid`, and the Html label is relative to the group.

#### Scenario: Marker line, spheres and label align

- GIVEN closest points a and b from one entry
- WHEN the marker renders
- THEN the line spans a and b, the spheres sit at a and b, and the label sits at mid (all in the common frame)

### Requirement AC3D-3: Legend selection and visibility

The 3D view SHALL include an HTML legend listing the primary and every adjacent entry, each with: color swatch, name, risk badge, click-to-select, and eye toggle for visibility. The legend SHALL be testable in jsdom (no WebGL/raycasting). The primary well SHALL NOT be hidden by the eye toggle.

#### Scenario: Selecting an entry shows its ellipsoids

- GIVEN a rendered scene with multiple entries and a legend
- WHEN the user clicks an entry row
- THEN that entry becomes selected and its ellipsoid pair (entry + primary) plus distance label render

#### Scenario: Eye toggle hides a tube

- GIVEN a visible entry with a tube
- WHEN the user toggles its eye off
- THEN the tube is not rendered and the camera bounds exclude it

#### Scenario: Primary cannot be hidden

- GIVEN the legend with the primary row
- WHEN the user attempts to toggle the primary eye
- THEN the primary row has no working eye toggle and the primary remains rendered

#### Scenario: Hover shows details

- GIVEN a legend row with a computed result
- WHEN the user hovers the row
- THEN a tooltip shows the well name, risk level, and minimum distance (ft)

### Requirement AC3D-4: Ellipsoid pair policy

Uncertainty ellipsoids and the distance label SHALL render only for the **selected** entry pair (selected adjacent well + primary). Non-selected entries SHALL render tubes only.

#### Scenario: Only the selected pair shows ellipsoids

- GIVEN a scene with N entries, one selected
- WHEN the scene renders
- THEN exactly one pair of ellipsoids (primary + selected) and one distance label are rendered

#### Scenario: Nothing selected shows no ellipsoids

- GIVEN a scene with no selection
- WHEN the scene renders
- THEN no ellipsoids and no distance label render

### Requirement AC3D-5: Stable well colors

Each well SHALL receive a color from a fixed palette keyed by `wellId` (first-seen order), stable across re-sorts of the risk-ordered matrix.

#### Scenario: Color survives a matrix re-sort

- GIVEN entries sorted by risk
- WHEN the result matrix re-sorts and the view re-renders
- THEN each `wellId` keeps its previously assigned color

### Requirement AC3D-6: Camera framing over all visible wells

Initial camera bounds and the focus controller SHALL consider every visible well trajectory (primary + visible adjacent entries), not only the primary and one adjacent.

#### Scenario: Camera bounds include all wells

- GIVEN five visible wells spread across the scene
- WHEN the camera initializes or refocuses
- THEN the bounding box contains all five trajectories

### Requirement AC3D-7: Demo auto-seed

On first mount of the section, when the store holds no directional/adjacent data, the section SHALL auto-load the demo: the 5 `MOCK_WELLS` presets as adjacent entries and a `MOCK_PRIMARY` as the primary trajectory. The seed SHALL run at most once per mount and SHALL NOT overwrite user-entered data.

#### Scenario: Empty store seeds the demo on first mount

- GIVEN a fresh store with no surveys and no adjacent wells
- WHEN the section mounts
- THEN 5 preset wells appear in the legend/matrix and a mock primary trajectory renders

#### Scenario: Existing user data is not overwritten

- GIVEN a store already holding user surveys and/or adjacent wells
- WHEN the section mounts
- THEN the user data remains unchanged and no seeding occurs
