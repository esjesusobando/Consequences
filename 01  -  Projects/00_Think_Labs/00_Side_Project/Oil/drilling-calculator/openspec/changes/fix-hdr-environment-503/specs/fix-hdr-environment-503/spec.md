# Delta for HDR Environment Removal (fix-hdr-environment-503)

## Purpose

Eliminate remote HDR asset fetching from the two 3D scenes (`AntiCollision3D.tsx`, `Trajectory3D.tsx`) that caused 503 console errors on reload. Both scenes already provide full explicit lighting; the remote HDR is not load-bearing.

## ADDED Requirements

### Requirement: No remote HDR network requests at runtime

The application SHALL NOT fetch any external HDR environment maps at runtime. No `<Environment>` element from `@react-three/drei` that triggers a remote asset load SHALL be present in any 3D scene component.

#### Scenario: App reload with 3D view open produces no HDR network request

- GIVEN the application has loaded and a 3D scene (AntiCollision3D or Trajectory3D) is mounted
- WHEN the user reloads the browser page
- THEN no HTTP request to `raw.githubusercontent.com` (or any drei-assets HDR URL) SHALL appear in the network tab
- AND no console error related to HDR loading SHALL appear

#### Scenario: 3D scene renders without remote HDR

- GIVEN a 3D scene component with explicit ambient, point, and spot lights
- WHEN the scene mounts and renders
- THEN the scene SHALL render meshes, trajectories, and ellipsoids using only the explicit light sources
- AND no `Environment` component SHALL be present in the scene's React tree

### Requirement: No unused Environment imports

`AntiCollision3D.tsx` and `Trajectory3D.tsx` SHALL NOT contain an `Environment` import from `@react-three/drei` after this change.

#### Scenario: AntiCollision3D has no Environment reference

- GIVEN the file `src/components/sections/AntiCollision3D.tsx`
- WHEN a developer inspects the file
- THEN no import statement SHALL reference `Environment` from `@react-three/drei`
- AND no JSX element `<Environment .../>` SHALL exist in the file

#### Scenario: Trajectory3D has no Environment reference

- GIVEN the file `src/components/visuals/Trajectory3D.tsx`
- WHEN a developer inspects the file
- THEN no import statement SHALL reference `Environment` from `@react-three/drei`
- AND no JSX element `<Environment .../>` SHALL exist in the file

### Requirement: Explicit lighting preserves scene illumination

Both 3D scenes SHALL maintain their existing explicit light stacks (`ambientLight`, `pointLight`, `spotLight` with `castShadow`) after Environment removal. No lighting parameter changes are permitted as part of this change.

#### Scenario: AntiCollision3D renders trajectories and ellipsoids under explicit lights

- GIVEN `AntiCollision3D.tsx` with ambient (0.5), point (1.5), and spot (2, castShadow) lights
- WHEN the component mounts
- THEN trajectories and ellipsoids SHALL render without throwing errors
- AND scene illumination SHALL be visually equivalent to pre-fix state

#### Scenario: Trajectory3D renders under explicit lights

- GIVEN `Trajectory3D.tsx` with its existing explicit light stack
- WHEN the component mounts
- THEN the trajectory model SHALL render without throwing errors
- AND scene illumination SHALL be visually equivalent to pre-fix state

## Non-Goals

- HDR bundling: no local `.hdr` files will be added to `public/`
- New dependencies: no additions or removals from `package.json`
- Lighting redesign: existing ambient + point + spot lights are sufficient
- Engine module changes: `src/engine/*` is untouched
