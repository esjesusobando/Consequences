---
status: pending
priority: p2
issue_id: 001
tags: ["code-review", "quality", "testing"]
dependencies: []
---

# Problem Statement

The current codebase lacks automated unit tests for critical engineering calculations in `src/engine/`. While manual verification works for UI, complex physics logic (hydraulics, rheology) requires regression testing to prevent subtle bugs during future refactoring.

# Findings

- `src/engine/hydraulics.ts` contains complex math without corresponding `.test.ts`.
- Changes to `drilling-store.ts` default values could break calculations silently.
- Verified manually but not automatically.

# Proposed Solutions

## Option 1: Vitest (Recommended)

- Install Vitest + React Testing Library.
- Create `src/engine/__tests__/hydraulics.test.ts`.
- **Pros**: Fast, standard in Vite ecosystem.
- **Cons**: Setup time.
- **Effort**: Medium.

## Option 2: Jest

- Traditional setup.
- **Pros**: Well-known.
- **Cons**: Heavier configuration with Vite.
- **Effort**: Medium-High.

# Recommended Action

Implement Option 1 (Vitest).

# Technical Details

- Create `vitest.config.ts`.
- Add test scripts to `package.json`.
- Write test cases for `calculateHydraulics`, `calculateRheology`.

# Acceptance Criteria

- [ ] `npm run test` executes successfully.
- [ ] `hydraulics.ts` has >80% coverage.
- [ ] `orchestrator.ts` has integration tests.

# Work Log

- 2026-02-10: Identified during code review.
