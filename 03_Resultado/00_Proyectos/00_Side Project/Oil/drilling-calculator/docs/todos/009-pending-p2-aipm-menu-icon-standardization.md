---
status: resolved
priority: p2
issue_id: 009
tags: [ui, standardization, aipm-menu]
dependencies: []
---

# Problem Statement

The icons in the `AIPMMenu.tsx` component do not follow the Dieter Rams standard specifically requested for the project (1.5px stroke width, consistent sizes like 16-20px based on hierarchy). The `strokeWidth` attribute is missing from the Lucide React icons, causing them to use their default thicker strokes.

# Findings

- File: `Side Project/Oil/drilling-calculator/src/components/ui/AIPMMenu.tsx`
- Evidence: `<Zap size={20} fill={...} />`, `<Bookmark size={18} />`, etc. lack the `strokeWidth={1.5}` attribute as mandated in the daily notes.

# Proposed Solutions

**Option 1: Hardcode strokeWidth on each icon**

- Pros: Quick to implement.
- Cons: Repetitive.
- Effort: Small

**Option 2: Create a wrapper or use a context provider for Lucide icons**

- Pros: Ensures all future icons use `strokeWidth={1.5}` by default.
- Cons: Slight architectural change.
- Effort: Small to Medium

# Recommended Action

# Technical Details

- Components affected: `AIPMMenu.tsx`
- Action needed: Apply `strokeWidth={1.5}` to all imported Lucide icons in `AIPMMenu`. Zap should remain size 20, other menu items 18, and small UI controls 12-14.

# Acceptance Criteria

- [ ] Zap icon has `strokeWidth={1.5}`.
- [ ] All other icons in `AIPMMenu.tsx` have `strokeWidth={1.5}`.

# Work Log

- 2026-02-19: Finding reported during `/workflows:review` session.

# Resources

- [21_Session_Note_2026-02-19.md]
