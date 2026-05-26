---
status: pending
priority: p2
issue_id: 010
tags: [ui, standardization, sidebar]
dependencies: []
---

# Problem Statement

The `SidebarNav.tsx` component is using `strokeWidth={1.6}` for active states and `1.4` for inactive states, which conflicts with the requested Dieter Rams standard of `1.75` for active and `1.5` for inactive.

# Findings

- File: `Side Project/Oil/drilling-calculator/src/components/ui/SidebarNav.tsx`
- Evidence: `<item.icon size={15.5} strokeWidth={isActive ? 1.6 : 1.4} />`

# Proposed Solutions

**Option 1: Update the values directly**

- Pros: Corrects the issue immediately in a single file.
- Effort: Small

# Recommended Action

# Technical Details

- Components affected: `SidebarNav.tsx`

# Acceptance Criteria

- [ ] Active icons use `strokeWidth={1.75}`.
- [ ] Inactive icons use `strokeWidth={1.5}`.

# Work Log

- 2026-02-19: Finding reported during `/workflows:review` session.

# Resources

- [21_Session_Note_2026-02-19.md]
