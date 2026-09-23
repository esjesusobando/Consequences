# SDD Design - drilling-calculator Improvements

## Design Overview

This technical design outlines the implementation approach for all improvements specified in the SDD Spec. The design follows the Dependency Graph: prototype → specs → design → tasks → apply → verify → archive.

## 1. Design Decisions

### 1.1 Coordinate System Fix Design

* *Problem**: Adjacent well trajectories use local coordinates (relative to wellhead at `wellheadEast/wellheadNorth`), but ClosestApproachMarker in `AntiCollision3D.tsx` uses real coordinates from the store. This mismatch causes incorrect minimum distance display.

* *Design Approach**:
- **Option A**: Transform adjacent trajectory points to real coordinates before rendering markers
  - Pros: Consistent with existing marker code
  - Cons: Requires propagating real coords through the component tree
  
- **Option B**: Transform marker coordinates to local frame (matching trajectory coords)
  - Pros: Minimal code changes, leverages existing local-coord logic
  - Cons: May need to adjust other marker logic

* *Design Decision**: **Option B** - Transform marker coords to local frame. This is the lazier fix and aligns with the comment "already in local coords" at line 1448.

* *Implementation**:
1. In `Anticolision.tsx` where `ClosestApproachMarker` renders, ensure both `pointA` and `pointB` use the same coordinate frame
2. For `pointA` (primary): subtract `surfaceEast/surfaceNorth` if using real coords
3. For `pointB` (adjacent): already in local coords, don't subtract
4. Verify: when both points represent the same location, `dist === 0`

* *Code Change Location**: `src/components/sections/AntiCollision3D.tsx` lines 1491-1495

### 1.2 Depth Color Degeneracy Design

* *Problem**: When all TVD values are identical, `range = maxTVD - minTVD || 1` causes all points to get the same color (t=1).

* *Design Approach**:
- Handle zero range explicitly rather than using `|| 1` fallback
- When range is 0, all points should get the same color (the only possible color)
- Maintain perceptual consistency

* *Design Decision**: **Explicit zero-range handling**.

* *Implementation**:
```tsx
// Before (lines 319-322):
const range = maxTVD - minTVD || 1;
const t = (tvd - minTVD) / range;

// After:
const range = maxTVD - minTVD;
const safeRange = range !== 0 ? range : 1;
const t = (tvd - minTVD) / safeRange;
// When range=0: safeRange=1, t=0 for all points (all get first color in ramp)
// This is consistent: single-depth well gets one color
```

* *Implementation Location**: `src/components/sections/AntiCollision3D.tsx` lines 319-322

### 1.3 Dead Code Removal Design

* *Problem**: `fracGradient / 0.052;` in `orchestrator.ts:331` - result discarded.

* *Design Approach**: Simple removal of the dead expression.

* *Design Decision**: **Remove the expression**. It serves no purpose and may confuse linters/readers.

* *Implementation**: Delete lines 331 or reassign if truly needed (investigation shows it's not used elsewhere).

* *Implementation Location**: `src/engine/orchestrator.ts` line 331

## 2. Type Improvement Design

### 2.1 no-explicit-any Reduction

* *Design Approach**: Incremental type refinement across identified files.

* *Priority Order** (by impact and risk):
1. `src/engine/orchestrator.ts` - highest impact, lowest risk
2. `src/engine/anti-collision.ts` - medium impact, medium risk
3. `src/components/sections/AntiCollision3D.tsx` - medium impact, medium risk
4. Other files - lower priority

* *Implementation Strategy**:
- For each `any` occurrence, determine if it's:
  a. True `any` (should be replaced with proper type)
  b. `unknown` (should go through type guard)
  c. `as any` for internal computation (acceptable if isolated)
- Create a systematic review process
- Run `npm run lint` after each change to verify

* *Implementation Location**: Multiple files, prioritized as above

### 2.2 ESLint Configuration

* *Design Approach**: Review and update `eslint.config.js` to enforce project standards.

* *Changes**:
- Add `no-explicit-any: ["error"]` if not already
- Ensure `react/react-inprop-types` rules match project needs
- Verify `functional/require-return` for all components

* *Implementation Location**: `eslint.config.js`

## 3. Test Expansion Design

### 3.1 Engine Tests

* *Design Approach**: Add test files incrementally, following existing patterns.

* *Test Files to Create**:
1. `src/engine/anti-collision.test.ts` - expand with:
   - Mixed tool types (MWD + GYRO + SENSOR in same analysis)
   - Empty trajectory handling
   - Single-point trajectories
   - Very shallow wells (MD < 100 ft)

2. `src/engine/scene.test.ts` - add edge cases:
   - All-hidden wells
   - Single-entry bounds
   - Mixed visible/hidden with hiddenWells prop

3. `src/engine/orchestrator.test.ts` - new file:
   - Orchestrator logic tests
   - Pressure calculation flow

* *Implementation Location**: `src/engine/` directory

### 3.2 Component Tests

* *Design Approach**: Add basic React component tests.

* *Test Files to Create/Modify**:
1. `src/components/sections/AntiCollision3D.test.tsx` - expand from empty to:
   - Render with minimal props
   - Test `useDepthGradient` prop effect
   - Test coordinate transform consistency with `commonFramePoint`

2. `src/components/sections/Anticolision.test.tsx` - if not exists

* *Implementation Location**: `src/components/sections/`

## 4. Structure Migration Design

### 4.1 File Moves

* *Design Decision**: Execute file moves in a specific order to minimize breakage.

* *Move Order**:
1. First: Remove `06_ENGINE/` Python scripts (delete, as project is TypeScript)
2. Second: Clean `08_ARCHIVE/` - delete temporales, move validation scripts
3. Third: Move .md files to `docs/`
4. Fourth: Move `START_CALCULATOR.bat` to `scripts/`
5. Fifth: Clean `openspec/` empty dirs

* *Implementation Commands** (run in order):

```bash
# 1. Remove 06_ENGINE/ Python scripts (project is TS-based)

rm -r "C:\Users\sebas\Desktop\Think_Different\03_Resultado\00_Proyectos\00_Side_Project\Oil\drilling-calculator\06_ENGINE\"

# 2. Clean 08_ARCHIVE/ - keep structure but delete temporales

rm "C:\Users\sebas\Desktop\Think_Different\03_Resultado\00_Proyectos\00_Side_Project\Oil\drilling-calculator\08_ARCHIVE\temporales\*.*"
# Or delete the whole directory if empty after cleanup

# 3. Move .md files to docs/

Move-Item "C:\Users\sebas\Desktop\Think_Different\03_Resultado\00_Proyectos\00_Side_Project\Oil\drilling-calculator\DRILLING-ADVISORY-SYSTEM-DEFINITION.md" "C:\Users\sebas\Desktop\Think_Different\03_Resultado\00_Proyectos\00_Side_Project\Oil\drilling-calculator\docs\"
# Repeat for other .md files

# 4. Move START_CALCULATOR.bat to scripts/

Move-Item "C:\Users\sebas\Desktop\Think_Different\03_Resultado\00_Proyectos\00_Side_Project\Oil\drilling-calculator\START_CALCULATOR.bat" "C:\Users\sebas\Desktop\Think_Different\03_Resultado\00_Proyectos\00_Side_Project\Oil\drilling-calculator\scripts\"

# 5. Clean openspec/

rm -r "C:\Users\sebas\Desktop\Think_Different\03_Resultado\00_Proyectos\00_Side_Project\Oil\drilling-calculator\openspec\changes\archive\"
rm -r "C:\Users\sebas\Desktop\Think_Different\03_Resultado\00_Proyectos\00_Side_Project\Oil\drilling-calculator\openspec\changes\ml-ai-layer\"
rm -r "C:\Users\sebas\Desktop\Think_Different\03_Resultado\00_Proyectos\00_Side_Project\Oil\drilling-calculator\openspec\specs\"
```

* *Acceptance Criterion**: Root level passes the structure gates (see Spec section 5.3).

### 4.2 Documentation Consolidation Design

* *Design Approach**: Move .md files and create subdirectory organization.

* *Moves**:
1. `DRILLING-ADVISORY-SYSTEM-DEFINITION.md` → `docs/DRILLING-ADVISORY-SYSTEM-DEFINITION.md`
2. `jetro-ai-dynamic-analysis-design.md` → `docs/methodology/jetro-ai-dynamic-analysis-design.md`
3. `SOTA-2026-ROADMAP.md` → `docs/plans/SOTA-2026-ROADMAP.md` (or methodology/)
4. `SOTA-AI-MODELS-2026.md` → `docs/methodology/SOTA-AI-MODELS-2026.md`

* *Create in docs/**:
- `docs/todos/001-pending-p1-division-by-zero-safety.md` (already exists)
- `docs/todos/002-pending-p2-typing-debt-orchestrator.md` (already exists)
- `docs/todos/003-pending-p2-missing-automated-tests.md` (already exists)
- `docs/plans/2026-08-07-comprehensive-improvement-plan.md` (already exists)
- `docs/evidences/` - keep as-is (already organized)
- `docs/context/` - keep as-is (already organized)

* *Acceptance Criterion**: No loose .md files at root (except `DRILLING-CALCULATOR-AUDIT-2026-09-06.md` and `ARCHITECTURE.md`/`AUDIT.md`).

## 5. Data Flow Changes

### 5.1 AntiCoordinate System Fix Data Flow

* *Before**:
```
Anticolision Store → Adjacent Trajectory (local coords) → ClosestApproachMarker (real coords) → Incorrect distance
```

* *After**:
```
Anticolision Store → Adjacent Trajectory (local coords) → ClosestApproachMarker (local coords) → Correct distance
// Or:
Anticolision Store → Adjacent Trajectory (real coords after transform) → ClosestApproachMarker (real coords) → Correct distance
```

* *Key Interaction**: The `surfaceEast/surfaceNorth` props must be consistently applied or omitted for both trajectory points and markers.

### 5.2 Depth Gradient Data Flow

* *Before**: `useDepthGradient={false}` → no depth coloring

* *After**: `useDepthGradient={true}` → `depthColor(t)` applied where `t = (tvd - minTVD) / range`

* *Key Interaction**: The `minTVD/maxTVD` computation must include all trajectory points (primary + adjacent) for consistent color mapping.

### 5.3 Dead Code Removal Data Flow

* *Before**: `if (results.pressures) { fracGradient / 0.052; }` - pressures state affects nothing

* *After**: `if (results.pressures) {}` - empty block or removed

* *Key Interaction**: No data flow change - just dead code removal.

## 6. Implementation Sequence

### 6.1 Phase 1: Bug Fixes (Critical - First)

1. Coordinate system fix (AntiCollision3D.tsx)
2. Depth color degeneracy fix (AntiCollision3D.tsx)
3. Dead code removal (orchestrator.ts)

* *Gate**: After each, run `npm run build` and `npm test` to verify no regressions.

### 6.2 Phase 2: Type & Lint Improvements

1. Begin with `orchestrator.ts` (highest impact)
2. Progress to `anti-collision.ts`
3. Finish with `AntiCollision3D.tsx`
4. Run `npm run lint` after each

* *Gate**: `npm run lint` shows reduced/no `no-explicit-any` errors.

### 6.3 Phase 3: Test Expansion

1. Add engine test files
2. Add component tests
3. Run full test suite `npm test`
4. Verify ≥20 engine test files passing

* *Gate**: `npm test` passes with no new failures.

### 6.4 Phase 4: Structure Migration

1. Remove `06_ENGINE/` Python scripts
2. Clean `08_ARCHIVE/`
3. Move .md files to `docs/`
4. Move `START_CALCULATOR.bat` to `scripts/`
5. Clean `openspec/` empty dirs
6. Run full app verification

* *Gate**: Root level compliant; `npm run dev` works; `npm run build` works.

### 6.5 Phase 5: Verification & Archive

1. Full verification: build, test, lint, structure
2. Create final archive state
3. Tag final state
4. Close SDD cycle

* *Gate**: All acceptance criteria met (see Spec section 5).

## 7. Rollback Strategy

* *Rollback Point**: SOS Tag `44aac76`

* *Rollback Steps**:
1. `git checkout 44aac76` - returns to save point
2. Verify build still passes from that state
3. Restore any files that were modified after SOS

* *Rollback Trigger**: If any improvement introduces unrecoverable breakage, or if user explicitly requests revert.

## 7. Design Sign-Off

| Design Element        | Owner       | Status       |
|----------------------|------------|-------------|
| Coordinate system fix | SDD Designer| ✅ Approved   |
| Depth color degeneracy| SDD Designer| ✅ Approved   |
| Dead code removal     | SDD Designer| ✅ Approved   |
| Type reductions       | SDD Designer| ⏳ In Progress|
| Test expansion        | SDD Designer| ⏳ Pending    |
| Structure migration   | SDD Designer| ⏳ Pending    |
| Documentation moves   | SDD Designer| ⏳ Pending    |

* *Design Version**: 1.0  
* *Created**: 2026-09-09  
* *Dependencies**: Spec section 5 acceptance required before Phase 1 start  
* *Related Artifacts**: 
- SOS Tag: 44aac76
- Spec: openspec/changes/improvement-plan/spec.md
- Exploration: Comprehensive codebase analysis

- --

This design enables implementation in the SDD Tasks phase while maintaining gate validity at each step.
