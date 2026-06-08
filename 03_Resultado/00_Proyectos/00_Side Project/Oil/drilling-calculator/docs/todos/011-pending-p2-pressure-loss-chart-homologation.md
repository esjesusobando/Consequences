---
status: pending
priority: p2
issue_id: 011
tags: [ui, visuals, charts]
dependencies: []
---

# Problem Statement

The recent notes state the need to "Homologar gráfica de barras de Pérdidas de Presión (PressureLossBreakdown) a mismo estilo que el resto" (Homologate Pressure Loss bar chart to the same style as the rest). This implies replacing basic Tailwind blue styles with the official palette (Lime/Cyan), and applying glassmorphism / consistent gradients so it doesn't look like "basic bars." The review confirmed that this is pending.

# Findings

- Component: Likely `HydraulicsChart.tsx` or a related breakdown component inside the `drilling-calculator` app, as the exact `PressureLossBreakdown` name wasn't matched but fits the domain.
- Evidence: Use of basic styles instead of official CSS vars like `var(--sh-lima)` and `var(--color-cyan)`.

# Proposed Solutions

**Option 1: Refactor the relevant pressure loss visualization component**

- Apply `glassmorphism.css` and `tokens.css` utility classes.
- Use the official gradient colors.

# Technical Details

- Need to locate the bar chart handling pressure losses (likely in `HydraulicsChart.tsx` or similar).

# Acceptance Criteria

- [ ] Pressure loss bars use official Lime/Cyan palette.
- [ ] Bars have glassmorphism aesthetics.
- [ ] No default/basic Tailwind blues.

# Work Log

- 2026-02-19: Finding reported during `/workflows:review` session based on session goals.

# Resources

- [21_Session_Note_2026-02-19.md]
