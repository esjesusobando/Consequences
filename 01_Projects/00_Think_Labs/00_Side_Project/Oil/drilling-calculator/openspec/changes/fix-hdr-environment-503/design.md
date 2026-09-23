# Design: Remove Remote HDR Environment from 3D Scenes (fix-hdr-environment-503)

## Context

Both 3D scenes (`AntiCollision3D.tsx` and `Trajectory3D.tsx`) mount `<Environment preset="night" />` from `@react-three/drei`. This component fetches an HDR environment map from `raw.githubusercontent.com/pmndrs/drei-assets` at runtime. When the CDN responds 503 (down or rate-limited), drei logs the failure on every reload.

Both scenes already provide full explicit lighting — `ambientLight intensity={0.5}`, `pointLight intensity={1.5}`, `spotLight intensity={2} castShadow` — placed as siblings immediately before the `<Environment>` line. The remote HDR is not load-bearing for illumination.

This change is pure deletion: 2 JSX elements + 2 import tokens. No new code, no dependencies, no config.

## Architecture Impact

* *None.** The rendering pipeline is unchanged. `Environment` was additive IBL (image-based lighting) layered on top of the explicit lights. Removing it means scenes render under explicit lights only — which is how every Three.js scene works without IBL. `meshStandardMaterial` metalness/roughness PBR properties fall back to the scene's light sources; this is the standard Three.js behavior and is visually equivalent for the dark 3D tool view where subtle reflections from a night HDR add negligible visual difference.

## Change Points

### File 1: `src/components/sections/AntiCollision3D.tsx`

* *Change A — Import (line 3–9):**

```tsx
// BEFORE (lines 3-9)
import {
  OrbitControls,
  PerspectiveCamera,
  Html,
  Environment,
  Grid,
} from "@react-three/drei";

// AFTER
import {
  OrbitControls,
  PerspectiveCamera,
  Html,
  Grid,
} from "@react-three/drei";
```

Delete line 7: `  Environment,`

* *Change B — JSX element (line 612):**

```tsx
// BEFORE (lines 611-614)
        <Environment preset="night" />

        <Grid

// AFTER
        <Grid
```

Delete line 612: `        <Environment preset="night" />` and the blank line after it (line 613).

### File 2: `src/components/visuals/Trajectory3D.tsx`

* *Change C — Import (line 3–11):**

```tsx
// BEFORE (lines 3-11)
import {
  OrbitControls,
  PerspectiveCamera,
  Stars,
  Text,
  Grid,
  Environment,
  Html,
} from "@react-three/drei";

// AFTER
import {
  OrbitControls,
  PerspectiveCamera,
  Stars,
  Text,
  Grid,
  Html,
} from "@react-three/drei";
```

Delete line 9: `  Environment,`

* *Change D — JSX element (line 892):**

```tsx
// BEFORE (lines 891-894)
        <Environment preset="night" />

        <Stars

// AFTER
        <Stars
```

Delete line 892: `        <Environment preset="night" />` and the blank line after it (line 893).

### Summary

| #  | File                 | Line   | What                                         | Action        |

|---|---------------------|-------|---------------------------------------------|--------------|
| A  | `AntiCollision3D.tsx`| 7      | `Environment,` import token                  | Delete line   |
| B  | `AntiCollision3D.tsx`| 612–613| `<Environment preset="night" />` + blank line| Delete 2 lines|
| C  | `Trajectory3D.tsx`   | 9      | `Environment,` import token                  | Delete line   |
| D  | `Trajectory3D.tsx`   | 892–893| `<Environment preset="night" />` + blank line| Delete 2 lines|

* *Net: 6 lines deleted, 0 lines added.**

## Mesh Material Behavior After Removal

`meshStandardMaterial` in Three.js computes lighting from:
1. Scene light sources (ambient, point, spot, directional)
2. Environment map (if present via `Environment` or `scene.environment`)
3. Background color

After removal, path (2) is absent. All meshes fall back to (1) and (3) only. Since both scenes already define ambient + point + spot lights with sufficient intensity (0.5 + 1.5 + 2 = 4.0 total), and the tool's dark 3D view uses dark backgrounds where IBL reflections are minimal, this is **visually equivalent**. The HDR "night" preset provides subtle blue-tinted reflections on metal surfaces; these will disappear, but in a drilling calculator's dark viewport the difference is negligible and arguably cleaner.

No `meshStandardMaterial` properties need adjustment. No `roughness`, `metalness`, or `envMapIntensity` changes are required or permitted.

## Testing Strategy

| Layer          | Command                           | What it proves                                                    |
|---------------|----------------------------------|------------------------------------------------------------------|
| Type check     | `npx tsc --noEmit`                | No unused-import or missing-reference errors                      |
| Unit tests     | `npx vitest run`                  | All 217 tests pass; no rendering regression in jsdom              |
| Visual (manual)| `npm run dev` → open both 3D views| Scenes render with correct illumination under explicit lights only|

* *Verification checklist:**
- [ ] `tsc -b` exits 0
- [ ] `vitest run` passes 217/217
- [ ] AntiCollision3D renders trajectories + ellipsoids under explicit lights
- [ ] Trajectory3D renders trajectory model under explicit lights
- [ ] Browser Network tab shows zero requests to `raw.githubusercontent.com` after reload
- [ ] Console is clean — no 503 or HDR-related errors

## Rollback

Single-commit revert: `git revert <commit-sha>`. Re-adds the `Environment` import and JSX element in both files. No migration, no schema changes, no dependency updates to undo. This is the lowest-risk rollback possible — zero state to reconcile.

## Affected Areas

| Area                                         | Impact  | Changes                                                  |
|---------------------------------------------|--------|---------------------------------------------------------|
| `src/components/sections/AntiCollision3D.tsx`| Modified| Remove `Environment` import (line 7) + JSX (line 612–613)|
| `src/components/visuals/Trajectory3D.tsx`    | Modified| Remove `Environment` import (line 9) + JSX (line 892–893)|

No new files. No files deleted. No dependency changes. No engine changes.

## Risks / Mitigations

| Risk                                                | Likelihood  | Mitigation                                                                                    |
|----------------------------------------------------|------------|----------------------------------------------------------------------------------------------|
| Subtle visual change (loss of IBL reflections)      | Low         | HDR "night" reflections are negligible on dark tool viewport; manual dev check confirms parity|
| Unused-import lint error if import not fully removed| Low         | `tsc --noEmit` catches this immediately                                                       |
| CDN still hit by something else                     | Negligible  | Grep confirms exactly 2 `Environment` references, both targeted                               |

## Design Decisions

| #  | Decision                                   | Rationale                                                                                          |

|---|-------------------------------------------|---------------------------------------------------------------------------------------------------|
| D1 | Delete only; no replacements               | The explicit lights are sufficient; adding a local HDR would re-introduce the same dependency class|
| D2 | No `envMapIntensity` or material tweaks    | meshStandardMaterial without IBL is standard Three.js; no fallback needed                          |
| D3 | Remove trailing blank line with JSX element| Keeps surrounding whitespace clean; avoids orphan blank lines                                      |
