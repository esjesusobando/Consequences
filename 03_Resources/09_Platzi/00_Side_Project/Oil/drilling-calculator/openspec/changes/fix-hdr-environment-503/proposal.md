# Proposal: Remove remote HDR Environment dependency from 3D scenes (fix-hdr-environment-503)

Status: Proposed

## Intent

On app reload, both 3D views log a runtime error: `<Environment preset="night" />` (from `@react-three/drei`) fetches an HDR environment map from a remote CDN (`raw.githubusercontent.com/pmndrs/drei-assets`). When the CDN responds 503 (down or rate-limited), drei logs the failure on every reload. The scenes already have their own explicit lights (`ambientLight 0.5`, `pointLight 1.5`, `spotLight 2` with `castShadow`) in both views, so the remote HDR is not load-bearing for illumination. Removing it eliminates the network dependency and the console error with zero visual regressions.

## Scope

### In Scope

- Remove `<Environment preset="night" />` element from `AntiCollision3D.tsx` (line 612) and `Trajectory3D.tsx` (line 892).
- Remove the now-unused `Environment` import from both files (line 7 and line 9 respectively).
- Verify no other references to `Environment` exist in the codebase (confirmed: exactly 2 occurrences, both targeted).

### Out of Scope

- HDR bundling: no local `.hdr` files will be added to `public/`.
- New dependencies: nothing added or removed from `package.json`.
- Lighting redesign: existing ambient + point + spot lights are sufficient; no re-balancing.
- Engine modules: `src/engine/*` untouched (pure calculation logic).

## Capabilities

### New Capabilities

None — pure defect removal, no new spec-level behavior.

### Modified Capabilities

None — no existing spec requirements reference Environment or drei HDR loading. Both `anti-collision-calculation` and `digital-twin-view` specs are unaffected.

## Approach

Single surgical removal per file:

1. Delete `<Environment preset="night" />` from both scenes.
2. Delete the `Environment` import from both files' `@react-three/drei` import blocks.
3. Run `npm test` (217 tests must stay green).
4. Run `npx tsc --noEmit` (zero errors).
5. Visual check: scenes render identically with existing explicit lights only.

## Affected Areas

| Area                                         | Impact  | Description                                                                |
|---------------------------------------------|--------|---------------------------------------------------------------------------|
| `src/components/sections/AntiCollision3D.tsx`| Modified| Remove `<Environment preset="night" />` (line 612) + unused import (line 7)|
| `src/components/visuals/Trajectory3D.tsx`    | Modified| Remove `<Environment preset="night" />` (line 892) + unused import (line 9)|

## Risks

| Risk                                       | Likelihood  | Mitigation                                                                                                                                                       |
|-------------------------------------------|------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Subtle visual change (material reflections)| Low         | Both scenes have full explicit light stacks; `meshStandardMaterial` metalness/roughness falls back to scene lighting. Manual `npm run dev` check confirms parity.|
| Test breakage from unused import           | Low         | `npm run lint` or `tsc` will catch unused imports before commit.                                                                                                 |

## Rollback Plan

Single-line revert per file: re-add the `Environment` import and `<Environment preset="night" />` element. `git revert` restores prior behavior with zero migration. This is the lowest-risk rollback possible.

## Dependencies

None beyond existing stack (React 19, three/R3F, `@react-three/drei`).

## Success Criteria

- [ ] Zero `503` console errors on app reload.
- [ ] 217 Vitest tests pass (no regressions).
- [ ] `npx tsc --noEmit` returns zero errors.
- [ ] Both 3D scenes render with correct illumination (ambient + point + spot only).
