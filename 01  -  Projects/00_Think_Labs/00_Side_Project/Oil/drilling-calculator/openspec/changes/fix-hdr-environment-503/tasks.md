# Tasks: Remove Remote HDR Environment from 3D Scenes

## Review Workload Forecast

| Field                  | Value                    |
|-----------------------|-------------------------|
| Estimated changed lines| ~6 deletions, 0 additions|
| 400-line budget risk   | Low                      |
| Chained PRs recommended| No                       |
| Suggested split        | Single PR                |
| Delivery strategy      | single-pr                |
| Chain strategy         | pending                  |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

## Phase 1: Delete Environment references (both files)

- [ ] 1.1 `src/components/sections/AntiCollision3D.tsx` — delete `Environment,` from the `@react-three/drei` import (line 7), delete `<Environment preset="night" />` + trailing blank line (lines 612–613)
- [ ] 1.2 `src/components/visuals/Trajectory3D.tsx` — delete `Environment,` from the `@react-three/drei` import (line 9), delete `<Environment preset="night" />` + trailing blank line (lines 892–893)

## Phase 2: Verification

- [ ] 2.1 `npx vitest run` — 217 tests pass, zero regressions
- [ ] 2.2 `npx tsc --noEmit` — zero errors
- [ ] 2.3 Grep both files: `grep -c "Environment" AntiCollision3D.tsx Trajectory3D.tsx` returns 0 for each
- [ ] 2.4 Manual `npm run dev` — both 3D views render with explicit lights only; browser Network tab shows zero requests to `raw.githubusercontent.com`
