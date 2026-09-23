# Spec: anti-collision-3d-visualization

## Purpose

3D visualization of well trajectories, uncertainty ellipsoids, and collision risk. Covers component architecture (decomposition from monolith) and baseline visual parameters (FOV, color, opacity, tooltips).

## Requirements

#### Requirement V-1: AntiCollision3D orchestrator line budget

The system SHALL keep `AntiCollision3D.tsx` under 300 lines by extracting all sub-rendering logic into named sub-components under `src/components/visuals/`. The orchestrator SHALL compose sub-components and manage Zustand state only.

##### Scenario: File size after decomposition

- GIVEN the source tree with all visual components extracted
- WHEN `wc -l src/components/sections/AntiCollision3D.tsx` runs
- THEN the line count SHALL be ≤ 299

##### Scenario: Zero behavior change

- GIVEN all 225 existing tests pass before decomposition
- WHEN component extraction completes
- THEN `npm test` SHALL pass with 0 failures

##### Scenario: Named exports only

- GIVEN any new file under `src/components/visuals/`
- WHEN the module is inspected
- THEN it SHALL use named exports (no default exports)

#### Requirement V-2: Extracted sub-component contracts

The system SHALL provide these sub-components with typed props:

| Component              | Props                                                                 | Source Responsibility       |
|-----------------------|----------------------------------------------------------------------|----------------------------|
| `CameraController`     | `{ target: Vector3; fov: number }`                                    | Orbit controls, FOV, look-at|
| `UncertaintyEllipsoid` | `{ center: Vector3; axes: number[]; rotation: Matrix4; color: Color }`| Scaled ellipsoid mesh       |
| `ClosestApproachMarker`| `{ position: Vector3; distance: number; riskLevel: string }`          | Sphere marker at d_min      |
| `SurfaceMarker`        | `{ position: Vector3; wellName: string; color: Color }`               | Wellhead icon at surface    |
| `WellTrajectory`       | `{ points: Vector3[]; color: Color; opacity: number }`                | Tube geometry for path      |

##### Scenario: Type safety

- GIVEN any sub-component rendered with valid props
- WHEN TypeScript strict mode compiles (`npx tsc --noEmit`)
- THEN zero type errors SHALL occur

#### Requirement V-3: Camera field of view

The system SHALL set the perspective camera FOV to `50` degrees (previously `40`).

##### Scenario: FOV value

- GIVEN the 3D scene renders
- WHEN `CameraController` mounts
- THEN the Three.js `PerspectiveCamera.fov` SHALL be `50`

#### Requirement V-4: Primary well color

The system SHALL render the primary (selected) well trajectory with color `#ff006e` (vibrant pink-red). Adjacent wells SHALL use their existing palette.

##### Scenario: Primary well color

- GIVEN the primary well is selected
- WHEN `WellTrajectory` renders for the primary well
- THEN the mesh material color SHALL be `#ff006e`

##### Scenario: Adjacent wells unaffected

- GIVEN adjacent wells exist
- WHEN they render
- THEN their colors SHALL remain from the existing palette

#### Requirement V-5: Adjacent well opacity de-emphasis

The system SHALL render adjacent (non-selected) wells at `0.85×` their base opacity to visually de-emphasize them relative to the primary well.

##### Scenario: Primary at full opacity

- GIVEN the primary well has base opacity 1.0
- WHEN it renders
- THEN material opacity SHALL be 1.0

##### Scenario: Adjacent at reduced opacity

- GIVEN an adjacent well with base opacity 1.0
- WHEN it renders while a primary is selected
- THEN material opacity SHALL be 0.85

#### Requirement V-6: Sticky tooltip on legend hover

The system SHALL display a tooltip for well entries in `WellLegend` after a 300ms hover delay. The tooltip SHALL persist (sticky) until the cursor leaves the legend entry or the tooltip itself.

##### Scenario: Hover delay

- GIVEN the legend is visible
- WHEN the cursor enters a well entry
- THEN the tooltip SHALL appear after 300ms ± 50ms

##### Scenario: Cursor leaves entry

- GIVEN a tooltip is visible
- WHEN the cursor leaves both the entry and the tooltip
- THEN the tooltip SHALL disappear within 150ms

##### Scenario: Cursor enters tooltip

- GIVEN a tooltip is visible for entry A
- WHEN the cursor moves from entry A into the tooltip
- THEN the tooltip SHALL remain visible

#### Requirement V-7: Tooltip content hierarchy

The system SHALL display tooltip content in this vertical order: (1) well name (bold, 14px), (2) risk level with colored badge, (3) minimum separation distance with units.

##### Scenario: Tooltip layout

- GIVEN a tooltip rendered for a well pair
- WHEN the tooltip is visible
- THEN the first line SHALL be the well name
- AND the second line SHALL show the risk level badge
- AND the third line SHALL show `d_min` in feet

## Acceptance Criteria

- [ ] `AntiCollision3D.tsx` ≤ 299 lines (V-1)
- [ ] 225+ tests green, `tsc --noEmit` clean (V-1, V-2)
- [ ] FOV = 50 (V-3)
- [ ] Primary color = `#ff006e` (V-4)
- [ ] Adjacent opacity = 0.85× (V-5)
- [ ] Tooltip appears at 300ms, sticky on hover-into-tooltip (V-6)
- [ ] Tooltip shows name → risk → distance (V-7)
