# SDD Specification - drilling-calculator Improvements

## Overview

This specification details the improvements to the drilling-calculator project based on comprehensive codebase analysis. The change addresses critical bugs, code quality, test coverage, and project structure.

## Change Identification

- **SDD Tag**: SOS (44aac76) - save point before improvements
- **Execution Mode**: Interactive
- **Artifact Store**: Both (openspec + engram)
- **PR Strategy**: Ask me (single PR if <400 lines changed, size:exception if >400)
- **Review Budget**: 800 lines

## 1. Bug Fixes - Critical

### 1.1 Coordinate System Bug (AntiCollision3D.tsx)

* *Files**: `src/components/sections/AntiCollision3D.tsx`
* *Lines**: 1448-1449 vs 1491-1492

* *Problem**: Adjacent well trajectories use local coordinates (relative to wellhead), but ClosestApproachMarker uses real coordinates. This causes incorrect minimum distance calculations in the 3D view.

* *Current Code (lines 1448-1449)**:
```tsx
// Adjacent well in local coords (already in local frame)
const adjacentPoint = { east: entry.east, north: entry.north, tvd: entry.tvd };
```

* *Current Code (lines 1491-1492)**:
```tsx
// Closest approach marker - subtracts surface offsets
const a = { x: pointA.east - surfaceEast, z: pointA.north - surfaceNorth };
const b = { x: pointB.east, z: pointB.north };
```

* *Fix**: Ensure consistent coordinate system. Either:
- Transform adjacent trajectory points to real coords before rendering markers, OR
- Transform marker coords to local frame

* *Acceptance Criterion**: After fix, minimum distance displayed matches Euclidean distance between transformed points (test verifies dist === 0 when points coincide after transformation).

### 1.2 Depth Color Degeneracy (AntiCollision3D.tsx)

* *Files**: `src/components/sections/AntiCollision3D.tsx`
* *Lines**: 319-322

* *Problem**: When all TVD values are identical, `range = maxTVD - minTVD` equals 0, but the `|| 1` fallback causes all points to get t=1 → same color. No visual distinction for single-depth wells.

* *Current Code**:
```tsx
const range = maxTVD - minTVD || 1;
const t = (tvd - minTVD) / range;
```

* *Fix**: Handle zero range case properly:
```tsx
const range = maxTVD - minTVD;
const safeRange = range !== 0 ? range : 1;
const t = (tvd - minTVD) / safeRange;
// When range is 0, all points get t=0 (first color) instead of t=1
```

* *Acceptance Criterion**: When all TVDs are identical, depth gradient shows consistent coloring (all same color, but not degenerate), and test verifies `wellColor` deduplication works.

### 1.3 Dead Code (orchestrator.ts)

* *Files**: `src/engine/orchestrator.ts`
* *Lines**: 330-332

* *Problem**: `fracGradient / 0.052;` - division result is computed but discarded. Likely a bug fragment from previous development.

* *Current Code**:
```tsx
if (results.pressures) {
  fracGradient / 0.052;  // ← Result discarded!
}
```

* *Fix**: Remove the dead code or assign to a variable if intended:
```tsx
if (results.pressures) {
  // const computedGradient = fracGradient / 0.052; // removed - not used
}
```

* *Acceptance Criterion**: `npx tsc --noEmit` passes without errors related to unused variables, and the line is either removed or assigned.

## 2. Code Quality Improvements

### 2.1 Reduce `no-explicit-any` Offenses

* *Files**: Multiple files (identified in exploration: ~80 occurrences)
* *Problem**: 80+ uses of `as any` or type assertions that bypass TypeScript strict checking.

* *Impact**: Type safety issues, harder maintenance, potential runtime errors.

* *Fix Strategy**:
- Review each `no-explicit-any` occurrence
- Replace with proper types or `unknown` + type guards
- Prioritize critical files: `src/engine/orchestrator.ts`, `src/engine/anti-collision.ts`, `src/components/sections/AntiCollision3D.tsx`

* *Acceptance Criterion**: `npm run lint` shows 0 `no-explicit-any` errors (or reduced from current count).

### 2.2 Lint Configuration

* *Files**: `eslint.config.js`
* *Problem**: Current configuration may not be enforcing best practices consistently.

* *Fix**: Review and update eslint config to match project standards (Strict TS, functional components, named exports).

* *Acceptance Criterion**: `npm run lint` passes with 0 errors (or current error count reduced).

## 3. Test Coverage Expansion

### 3.1 Engine Module Tests

* *Files**: `src/engine/*test*.ts`
* *Problem**: Only 11 test files exist for 27 engine modules. Critical gaps:
- No tests for `analyzeCollisionMatrix` with mixed tool types
- No tests for edge cases (empty trajectories, single points, very shallow wells)
- No integration tests combining well control + hydraulics + anti-collision

* *Fix**: Add test files for:
- `anti-collision.test.ts` - expand with mixed tools, edge cases
- `scene.test.ts` - add visibleBounds edge cases
- `orchestrator.test.ts` - new file for orchestrator logic

* *Acceptance Criterion**: 20+ test files in `src/engine/`, with 80+ tests passing.

### 3.2 Component Tests

* *Files**: `src/components/sections/AntiCollision3D.test.tsx` (currently empty)
* *Problem**: No component-level tests for AntiCollision3D, WellborePath, WellRenderer.

* *Fix**: Add basic component tests using @testing-library/react:
- Render AntiCollision3D with minimal props
- Test prop changes (useDepthGradient, showDistanceHeatmap)
- Test coordinate transform consistency

* *Acceptance Criterion**: `npm test` includes AntiCollision3D test suite with 10+ passing tests.

## 4. Project Structure Improvements

### 4.1 Root-Level Cleanup

* *Files to Move**:
1. `DRILLING-ADVISORY-SYSTEM-DEFINITION.md` → `docs/`
2. `jetro-ai-dynamic-analysis-design.md` → `docs/`
3. `SOTA-2026-ROADMAP.md` → `docs/`
4. `SOTA-AI-MODELS-2026.md` → `docs/`
5. `START_CALCULATOR.bat` → `scripts/`

* *Files to Clean**:
6. `06_ENGINE/` → Delete or migrate Python scripts to `src/engine/`. Project is TypeScript-based per `openspec/config.yaml`.

7. `08_ARCHIVE/` → 
   - Delete `temporales/` contents (stale backups)
   - Move/integrate validation `.mjs` scripts into `src/engine/` or `scripts/`

8. `openspec/` → 
   - Delete empty `changes/archive/`, `changes/ml-ai-layer/`, `specs/`
   - Keep `config.yaml` at root as reference OR move to `docs/`

### 4.2 Documentation Consolidation

* *Files to Move to `docs/`**:
- All .md files currently at root (except `DRILLING-CALCULATOR-AUDIT-2026-09-06.md` which stays at root for quick reference)
- Create subdirectories in `docs/`:
  - `docs/methodology/` - design docs
  - `docs/todos/` - pending items (already has 3 items)
  - `docs/plans/` - improvement plans (already has 1 plan)
  - `docs/evidences/` - completed work evidence

* *Acceptance Criterion**: Root level has only these files:
- `.atl/`, `.git/`, `ARCHITECTURE.md`, `AUDIT.md`, `dist/`, `eslint.config.js`, `index.html`, `node_modules/`, `openspec/`, `package.json`, `package-lock.json`, `public/`, `README.md`, `scripts/`, `tsconfig*.json`, `vercel.json`, `vite.config.ts`, `vitest.config.ts`
- No loose .md files at root

### 4.3 New Directory Structure

```
drilling-calculator/
├── .atl/                    → skill-registry.md
├── ARCHITECTURE.md          → Keep at root
├── AUDIT.md                 → Keep at root
├── dist/                    → Build output
├── docs/                    → All documentation consolidated
│   ├── DRILLING-CALCULATOR-AUDIT-2026-09-06.md  (root for quick ref)
│   ├── methodology/
│   ├── plans/
│   ├── evidences/
│   ├── context/
│   └── [other .md files moved from root]
├── eslint.config.js         → Keep at root
├── index.html               → Keep at root
├── node_modules/            → Keep at root
├── openspec/                → Cleanup: delete empty dirs, config.yaml as reference
├── package.json             → Keep at root
├── package-lock.json        → Keep at root
├── public/                  → Keep at root
├── README.md                → Keep at root
├── scripts/                 → JS validation + START_CALCULATOR.bat
│   ├── component-health-check.js
│   ├── validate-imports.js
│   ├── validate-war3.js
│   └── START_CALCULATOR.bat
├── src/                     → Well-organized as-is
├── tsconfig.app.json        → Keep at root
├── tsconfig.json            → Keep at root
├── tsconfig.node.json       → Keep at root
├── vercel.json              → Keep at root
├── vite.config.ts           → Keep at root
└── vitest.config.ts         → Keep at root
```

## 5. Acceptance Criteria - Complete Definition

### 5.1 Build Gates

- [ ] `npx tsc --noEmit` passes with 0 errors
- [ ] `npm run build` (vite build) passes cleanly
- [ ] `npm run lint` passes with 0 `no-explicit-any` errors (reduced from current)

### 5.2 Test Gates

- [ ] `npm test` runs with all engine test files passing
- [ ] Minimum 20 test files in `src/engine/`
- [ ] AntiCollision3D component test suite with 10+ passing tests
- [ ] No `Test Files 0 passed` or worker crash errors

### 5.3 Structure Gates

- [ ] Root level has only allowed files (see list above)
- [ ] No `06_ENGINE/` Python scripts (deleted or migrated)
- [ ] No `08_ARCHIVE/` stale temporales (cleaned)
- [ ] `openspec/` empty subdirs deleted
- [ ] All .md files consolidated in `docs/` (except audit at root)
- [ ] `START_CALCULATOR.bat` moved to `scripts/`

### 5.4 Functional Gates

- [ ] `AntiCollision3D` builds and renders without errors
- [ ] Depth gradient (`useDepthGradient={true}`) works correctly
- [ ] Minimum distance calculation uses consistent coordinate system
- [ ] No dead code orchestrator.ts line 331 issue
- [ ] `npx vite dev` starts successfully

### 5.4 Documentation Gates

- [ ] All .md files consolidated in `docs/` or at root (as approved)
- [ ] New routes documented in this spec
- [ ] No duplicate documentation

## 6. Risk Assessment

| Risk                                         | Likelihood  | Impact  | Mitigation                                                             |
|---------------------------------------------|------------|--------|-----------------------------------------------------------------------|
| Coordinate system fix breaks existing 3D view| Medium      | High    | Test with existing trajectories; verify dist === 0 when points coincide|
| Type reductions cause type errors            | Medium      | Medium  | Incremental type fixes; run `tsc --noEmit` after each change           |
| Test expansion introduces new failures       | Low         | Medium  | Add tests incrementally; run full test suite after each addition       |
| Structure moves break imports                | Medium      | High    | Run full app after moves; verify `npm run dev` works                   |
| Orchestrator dead code removal               | Low         | Low     | Simple removal; verify no runtime references exist                     |

## 7. Dependencies Between Improvements

1. **Bug fixes must complete before type reductions** - coordinate system fix may change types
2. **Test expansion depends on bug fixes** - need stable code to test
3. **Structure moves depend on bug fixes** - need stable code to move without breaking
4. **All improvements must pass build & test gates** before archive

## 7. Success Metrics

* *Primary Metrics**:
- Build passes: `vite build` ✓, `tsc --noEmit` ✓
- Test coverage: ≥20 engine test files, ≥10 AntiCollision3D tests
- Structure: Root level compliant (see gates)
- Lint: 0 `no-explicit-any` errors (reduced)

* *Secondary Metrics**:
- Performance: no regression in frame rate
- UX: depth gradient visible when `useDepthGradient={true}`
- Code quality: reduced lint error count

- --

* *Specification Version**: 1.0  
* *Author**: SDD Orchestrator  
* *Created**: 2026-09-09  
* *Status**: Draft - awaiting design phase approval  
* *Related Artifacts**: 
- SOS Tag: 44aac76
- Engram Topics: `sdd-init/drilling-calculator`, `sdd/drilling-calculator/testing-capabilities`
- OpenSpec: `openspec/config.yaml`
