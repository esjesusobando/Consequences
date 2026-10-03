# Tasks: Adaptive Boot

## Phase 1: Analysis & Design

- [ ] **1.1 Measure current boot token usage**
  - Run current BOOT.md and measure tokens loaded
  - Log to `01_Personal_Os/04_Operations/00_Context_LLM/boot_metrics_baseline.json`
  - Files: `boot_metrics_baseline.json`
  - Verify: Metrics file created with token counts

- [ ] **1.2 Define context profiles**
  - Create `01_Personal_Os/01_Core/01_Rules/context_profiles.yaml`
  - Define profiles for: admin, finance, hr, marketing_strategist, content_creator
  - Each profile: required context, optional context, excluded context
  - Files: `context_profiles.yaml`
  - Verify: YAML is valid, contains all 5 profiles

## Phase 2: Implementation

- [ ] **2.1 Implement conditional loading in BOOT.md**
  - Add IF/THEN blocks for each agent type
  - Load only required context per profile
  - Add fallback to full load if detection fails
  - Files: `BOOT.md`, `00_Winter_is_Coming/BOOT.md`
  - Verify: Conditional syntax is valid

- [ ] **2.2 Implement agent type detection**
  - Parse agent config file (if available)
  - Parse agent name for keywords (admin, finance, hr, marketing, content)
  - Parse task description for role mentions
  - Files: `00_Winter_is_Coming/BOOT.md`
  - Verify: Detection works for each agent type

- [ ] **2.3 Implement task type detection**
  - Parse task description for keywords
  - Map to task types: onboarding, reporting, content_creation, analysis, coordination
  - Files: `00_Winter_is_Coming/BOOT.md`
  - Verify: Detection works for common tasks

- [ ] **2.4 Implement lazy loading**
  - Create wrapper for optional context file reads
  - Load on first access
  - Cache for session duration
  - Track lazy-loaded files in boot log
  - Files: `01_Personal_Os/04_Operations/00_Context_LLM/lazy_loader.py`
  - Verify: Lazy loading works, files loaded on demand

## Phase 3: Metrics & Optimization

- [ ] **3.1 Add token measurement**
  - Measure tokens loaded per context file
  - Measure total tokens loaded (before and after)
  - Calculate tokens saved by conditional loading
  - Files: `01_Personal_Os/04_Operations/00_Context_LLM/boot_metrics.json`
  - Verify: Metrics are accurate

- [ ] **3.2 Test each agent type**
  - Load Admin agent → verify only admin context loaded
  - Load Finance agent → verify only finance context loaded
  - Load HR agent → verify only HR context loaded
  - Load Marketing agent → verify only marketing context loaded
  - Load Content agent → verify only content context loaded
  - Files: (runtime only)
  - Verify: Each agent loads correct context

- [ ] **3.3 Test fallback behavior**
  - Load agent without type → verify full context loaded
  - Load agent with invalid type → verify full context loaded
  - Files: (runtime only)
  - Verify: Fallback works correctly

## Phase 4: Documentation

- [ ] **4.1 Document context profiles**
  - Add comments to `context_profiles.yaml` explaining:
    - How to add new profiles
    - How to modify existing profiles
    - What each context file provides
  - Files: `context_profiles.yaml`
  - Verify: Documentation is clear

- [ ] **4.2 Document boot optimization methodology**
  - Create `01_Personal_Os/04_Operations/00_Context_LLM/BOOT_OPTIMIZATION.md`
  - Explain:
    - How conditional loading works
    - How to add new agent types
    - How to measure token savings
    - How to test changes
  - Files: `BOOT_OPTIMIZATION.md`
  - Verify: Documentation is complete

## Phase 5: Verification

- [ ] **5.1 Measure token savings**
  - Run boot with each agent type
  - Compare to baseline
  - Calculate % savings
  - Files: (runtime only)
  - Verify: Token savings >30%

- [ ] **5.2 Verify no regressions**
  - Load each agent type
  - Verify all required context is loaded
  - Verify no errors in boot log
  - Files: (runtime only)
  - Verify: No agents broken

- [ ] **5.3 Update completion record**
  - Fill in dates in proposal.md
  - Files: `.atl/openspec/changes/adaptive-boot/proposal.md`
