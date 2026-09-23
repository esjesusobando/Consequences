# SDD Tasks - drilling-calculator Improvements

## Task Organization

Tasks are organized in execution order (Phase 1 → Phase 5) with dependencies clearly marked. Each task has:
- **ID**: Unique identifier (T1, T2, etc.)
- **Title**: Task description
- **File**: Target file(s)
- **Dependencies**: Task IDs that must complete first
- **Acceptance Criteria**: What must be true for task completion
- **Estimated Effort**: Complexity rating (L/M/H)

- --

## Phase 1: Bug Fixes (Critical - First)

### T1: Coordinate System Fix - AntiCollision3D.tsx

- **File**: `src/components/sections/AntiCollision3D.tsx`
- **Dependencies**: None (Phase 1 first)
- **Acceptance Criteria**: 
  - When primary and adjacent points coincide after coordinate transform, `minDistance === 0`
  - `npx tsc --noEmit` passes
  - `npm run dev` starts without errors
- **Effort**: M (2-3 hours)

### T2: Depth Color Degeneracy Fix - AntiCollision3D.tsx

- **File**: `src/components/sections/AntiCollision3D.tsx`
- **Dependencies**: None (Phase 1 first)
- **Acceptance Criteria**:
  - When all TVDs identical, `wellColor` gives consistent color (not degenerate)
  - `npm run build` passes
- **Effort**: M (1-2 hours)

### T3: Dead Code Removal - orchestrator.ts

- **File**: `src/engine/orchestrator.ts`
- **Dependencies**: None (Phase 1 first)
- **Acceptance Criteria**:
  - `fracGradient / 0.052;` expression removed or assigned
  - `npx tsc --noEmit` passes without unused variable errors
- **Effort**: L (30 min)

- --

## Phase 2: Type & Lint Improvements

### T4: no-explicit-any Reduction - orchestrator.ts (Priority 1)

- **File**: `src/engine/orchestrator.ts`
- **Dependencies**: T3 (dead code removal first)
- **Acceptance Criteria**:
  - Specific `any` occurrences replaced with proper types or `unknown` + guards
  - `npm run lint` shows reduced `no-explicit-any` count
- **Effort**: M (3-4 hours)

### T5: no-explicit-any Reduction - anti-collision.ts (Priority 2)

- **File**: `src/engine/anti-collision.ts`
- **Dependencies**: T4 (orchestrator types fixed first)
- **Acceptance Criteria**:
  - Key `any` occurrences replaced (at least 50% reduction)
  - Critical type improvements: `AnalyzeOptions`, `CollisionResult`, `AdjacentWellInput`
  - `npm run lint` passes
- **Effort**: M (3-4 hours)

### T6: no-explicit-any Reduction - AntiCollision3D.tsx (Priority 3)

- **File**: `src/components/sections/AntiCollision3D.tsx`
- **Dependencies**: T5 (anti-collision types fixed first)
- **Acceptance Criteria**:
  - UI-related `any` replacements (props, state)
  - Render type improvements
  - `npm run lint` passes
- **Effort**: M (3-4 hours)

### T7: ESLint Configuration Review

- **File**: `eslint.config.js`
- **Dependencies**: T4, T5, T6 (type fixes completed)
- **Acceptance Criteria**:
  - `npm run lint` passes with 0 errors (or reduced from baseline)
  - `no-explicit-any` rule configured appropriately
  - Project-specific rules enforced
- **Effort**: L (1-2 hours)

- --

## Phase 3: Test Expansion

### T8: Engine anti-collision Test Expansion

- **File**: `src/engine/anti-collision.test.ts`
- **Dependencies**: T4, T5 (types stable first)
- **Acceptance Criteria**:
  - At least 8 test cases covering: mixed tools, empty trajectories, single points, shallow wells
  - `npm test` includes these tests passing
  - No new test failures
- **Effort**: M (4-5 hours)

### T9: Engine scene Test Expansion

- **File**: `src/engine/scene.test.ts`
- **Dependencies**: T4 (types stable)
- **Acceptance Criteria**:
  - At least 6 test cases covering: all-hidden wells, single-entry, mixed visible/hidden
  - `npm test` includes these tests passing
- **Effort**: M (3-4 hours)

### T10: AntiCollision3D Component Tests

- **File**: `src/components/sections/AntiCollision3D.test.tsx`
- **Dependencies**: T1, T2 (bug fixes first)
- **Acceptance Criteria**:
  - At least 10 test cases covering: render, prop changes, coordinate transforms
  - `npm test` includes AntiCollision3D suite passing
  - No "no test suite found" error (file must have describe/it blocks)
- **Effort**: M (5-6 hours)

- --

## Phase 4: Structure Migration

### T11: Remove 06_ENGINE/ Python Scripts

- **File**: Delete `C:\Users\sebas\Desktop\Think_Different\03_Resultado\00_Proyectos\00_Side_Project\Oil\drilling-calculator\06_ENGINE\`
- **Dependencies**: None (structural cleanup)
- **Acceptance Criteria**:
  - `06_ENGINE/` directory removed
  - `npm run build` still passes
  - No import references to `06_ENGINE/` files remain
- **Effort**: L (30 min)

### T12: Clean 08_ARCHIVE/ Structure

- **File**: `C:\Users\sebas\Desktop\Think_Different\03_Resultado\00_Proyectos\00_Side_Project\Oil\drilling-calculator\08_ARCHIVE/`
- **Dependencies**: T11 (06_ENGINE removed first)
- **Acceptance Criteria**:
  - `temporales/` subdirectory deleted or empty
  - Validation `.mjs` scripts either moved to `src/engine/` or `scripts/`, or deleted if redundant
  - Directory structure clean
- **Effort**: M (1-2 hours)

### T13: Move .md Files to docs/

- **Files**: 
  - `DRILLING-ADVISORY-SYSTEM-DEFINITION.md` → `docs/`
  - `jetro-ai-dynamic-analysis-design.md` → `docs/`
  - `SOTA-2026-ROADMAP.md` → `docs/`
  - `SOTA-AI-MODELS-2026.md` → `docs/`
- **Dependencies**: None (structural)
- **Acceptance Criteria**:
  - Root level has no these .md files
  - Files exist in `docs/` with correct paths
  - `npm run dev` still works
- **Effort**: M (1-2 hours)

### T14: Move START_CALCULATOR.bat to scripts/

- **File**: `START_CALCULATOR.bat` → `scripts/START_CALCULATOR.bat`
- **Dependencies**: T13 (.md files moved first, for logical order)
- **Acceptance Criteria**:
  - `scripts/START_CALCULATOR.bat` exists with same content
  - Root level `START_CALCULATOR.bat` removed
  - `npm run dev` still works
- **Effort**: L (30 min)

### T15: Clean openspec/ Empty Directories

- **File**: `openspec/` cleanup
- **Dependencies**: T14 (batch with file moves)
- **Acceptance Criteria**:
  - `openspec/changes/archive/` deleted
  - `openspec/changes/ml-ai-layer/` deleted
  - `openspec/specs/` deleted
  - `openspec/config.yaml` kept at root as reference
  - `npm run build` passes
- **Effort**: L (30 min)

- --

## Phase 5: Verification & Archive

### T16: Full Verification - Build & Lint

- **Dependencies**: All previous tasks complete
- **Acceptance Criteria**:
  - `npx tsc --noEmit` passes with 0 errors
  - `npm run build` (vite build) passes cleanly
  - `npm run lint` passes (reduced `no-explicit-any` count)
- **Effort**: M (2-3 hours)

### T17: Full Verification - Tests

- **Dependencies**: T8, T9, T10 complete
- **Acceptance Criteria**:
  - `npm test` runs successfully
  - Minimum 20 test files in `src/engine/`
  - AntiCollision3D test suite with 10+ passing tests
  - No worker crash errors (the 2 errors from before should be resolved or documented)
- **Effort**: M (3-4 hours)

### T18: Full Verification - Structure

- **Dependencies**: T11, T12, T13, T14, T15 complete
- **Acceptance Criteria**:
  - Root level has only allowed files (per Spec section 5.3)
  - `06_ENGINE/` removed
  - `08_ARCHIVE/` cleaned
  - .md files in `docs/`
  - `START_CALCULATOR.bat` in `scripts/`
  - `openspec/` empty dirs deleted
- **Effort**: M (1-2 hours)

### T19: Final Archive & Tag

- **Dependencies**: T16, T17, T18 all pass
- **Acceptance Criteria**:
  - `git tag -a "SOS- improved" -m "SDD improvements completion"` creates tag
  - `git log --oneline -1` shows final commit
  - All acceptance criteria met
  - Engram topics updated with final state
- **Effort**: L (1 hour)

- --

## Task Dependencies Graph

```
PHASE 1:       T1 → T2 → T3
               (Bug fixes - must complete before Phase 2)

PHASE 2:       T4 → T5 → T6 → T7
               (Type/lint - after bug fixes)

PHASE 3:       T8 → T9 → T10
               (Tests - after types stable)

PHASE 4:       T11 → T12 → T13 → T14 → T15
               (Structure - parallel possible after Phase 2)

PHASE 5:       T16 → T17 → T18 → T19
               (Verify & Archive - all previous must pass)
```

## Task Execution Order Recommendation

* *Happy Path** (recommended):
```
T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8 → T9 → T10 → T11 → T12 → T13 → T14 → T15 → T16 → T17 → T18 → T19
```

* *Parallel Opportunities** (safe combinations):
- T11, T12, T13, T14, T15 can run in parallel after T7 (structure tasks don't depend on test expansion)
- But recommended to complete Phase 1 (bug fixes) first for stability

- --

## Task Resource allocation

| Task   | Sub-agent needed        | Estimated Time  | Risk                           |
|-------|------------------------|----------------|-------------------------------|
| T1-T3  | None (direct edits)     | 5-5.5 hours     | Low (bugs, easy fixes)         |
| T4-T7  | May need type refinement| 11-13 hours     | Medium (type errors possible)  |
| T8-T10 | None (write test files) | 12-15 hours     | Medium (test failures possible)|
| T11-T15| None (file ops)         | 5-8 hours       | Low (file moves, safe)         |
| T16-T19| None (verification)     | 6-12 hours      | Medium (integration issues)    |

* *Total Estimated Effort**: ~44-53 hours across all tasks

* *Critical Path**: T1 → T4 → T8 → T16 → T19 (bug fixes → type → tests → verification → archive)

- --

* *SDD Tasks Version**: 1.0  
* *Created**: 2026-09-09  
* *Dependencies**: Spec section 5 acceptance required before Phase 1 start  
* *Related Artifacts**: 
- Spec: openspec/changes/improvement-plan/spec.md
- Design: openspec/changes/improvement-plan/design.md
- SOS Tag: 44aac76
- Exploration: Comprehensive codebase analysis
