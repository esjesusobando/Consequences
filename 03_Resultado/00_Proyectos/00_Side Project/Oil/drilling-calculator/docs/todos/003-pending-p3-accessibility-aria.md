---
status: pending
priority: p3
issue_id: 003
tags: [accessibility, ui, quality]
dependencies: []
---

# Problem Statement

Icon-only buttons in `AIPMMenu`, `BitOptimizer`, and other visual components lack `aria-label` attributes. This makes the application inaccessible to screen reader users.

# Findings

- `JetroChat.tsx`: Minimize button has no aria-label.
- `AIPMMenu.tsx`: Toggle buttons relying only on visual icons.
- `Chart` headers: Previous focus buttons (now removed) lacked them, ensure new ones have them.

# Proposed Solutions

## Option 1: Add aria-label Props

Manually add `aria-label="Description"` to all icon buttons.

- **Pros**: standard web practice.
- **Cons**: manual effort.
- **Effort**: Small

# Recommended Action

Add `aria-label` to all interactive elements that do not have visible text labels.

# Technical Details

- Scan `src/components/**/*.tsx` for `<button>` or clickable `<div>`.

# Acceptance Criteria

- [ ] All icon-only buttons have descriptive `aria-label`.
