---
status: pending
priority: p2
issue_id: 002
tags: [ui, css, maintainability]
dependencies: []
---

# Problem Statement

Multiple components (`RheologyChart.tsx`, `HydraulicsChart.tsx`, `BitOptimizer.tsx`) contain hardcoded styling values (colors, dimensions) instead of using the defined design tokens or CSS classes. This leads to inconsistent UI and makes theming difficult.

# Findings

- `RheologyChart.tsx`: Hardcoded colors `stroke="rgba(255, 255, 255, 0.05)"`, `fill="#4ade80"`.
- `HydraulicsChart.tsx`: Inline styles for bar colors `color: "hsl(280, 100%, 60%)"`.
- `BitOptimizer.tsx`: Inline `style={{ gap: "8px" }}`.

# Proposed Solutions

## Option 1: Move to CSS Modules / Classes

Extract all inline styles to `*.css` files and use utility classes.

- **Pros**: Clean JSX, better performance, consistent theming.
- **Cons**: Requires refactoring existing CSS files.
- **Effort**: Medium

## Option 2: Use Design Tokens

Replace hardcoded values with CSS variables (`var(--token-name)`).

- **Pros**: Centralized control of design system.
- **Cons**: checking `tokens.css` coverage.
- **Effort**: Medium

# Recommended Action

Combine both. Extract layout styles to CSS classes and use CSS variables for colors/dimensions.

# Technical Details

- Review `src/styles/tokens.css`.
- Refactor `RheologyChart.tsx` and `HydraulicsChart.tsx`.

# Acceptance Criteria

- [ ] No inline `style` props (except for dynamic values like width/height percentages).
- [ ] All colors use CSS variables.
