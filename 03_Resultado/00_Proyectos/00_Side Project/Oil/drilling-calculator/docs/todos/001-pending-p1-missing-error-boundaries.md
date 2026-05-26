---
status: pending
priority: p1
issue_id: 001
tags: [architecture, reliability, react]
dependencies: []
---

# Problem Statement

The application lacks Error Boundaries around major components (`BitOptimizer`, `RheologyChart`, `HydraulicsChart`, `AIPMMenu`). A single runtime error in any of these components (like the recent `JetroChat` import error) currently crashes the entire application ("White Screen of Death"). This violates the "Component Isolation" principle agreed upon in `methodology_alignment.md`.

# Findings

- `App.tsx` directly renders components without wrapping them in an ErrorBoundary.
- No global ErrorBoundary is defined in `main.tsx` or `App.tsx`.
- Recent crash due to `JetroChat` import error proved the fragility of the current setup.

# Proposed Solutions

## Option 1: Granular Error Boundaries (Recommended)

Wrap each major widget in a `WidgetErrorBoundary`.

- **Pros**: Isolates failures. If `RheologyChart` fails, `BitOptimizer` keeps working.
- **Cons**: Requires creating a reusable wrapper component.
- **Effort**: Medium

## Option 2: Global Error Boundary

Wrap the entire `App` in a single Error Boundary.

- **Pros**: Prevents blank screen, shows a generic "Something went wrong" message.
- **Cons**: The whole app still becomes unusable, just with a nicer error message.
- **Effort**: Small

# Recommended Action

Implement Option 1. Create a `components/common/ErrorBoundary.tsx` and wrap main widgets in `App.tsx`.

# Technical Details

- Create `src/components/common/ErrorBoundary.tsx`
- Modify `App.tsx` to import and use it.

# Acceptance Criteria

- [ ] Create `ErrorBoundary` component.
- [ ] Wrap `BitOptimizer`, `RheologyChart`, `HydraulicsChart` in `App.tsx`.
- [ ] Verify that throwing an error in one component does not crash the others.
