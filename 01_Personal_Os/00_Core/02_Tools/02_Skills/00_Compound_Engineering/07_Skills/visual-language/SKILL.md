---
name: engram-visual-language
description: >
  Visual language rules for Engram surfaces. Trigger: Any dashboard styling,
  typography, spacing, or visual identity change.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
sota_upgraded: true
---

## When to Use

Use this skill when:
- Editing `styles.css`
- Creating new dashboard sections or states
- Refining layout, spacing, typography, or color use

---

## Visual Rules

1. The dashboard must feel like Engram, not a generic SaaS admin.
2. Prefer strong hierarchy, fewer containers, and clearer breathing room.
3. Use the TUI-inspired palette and mono/display accents intentionally.
4. Format machine timestamps and raw identifiers into human-scannable UI.
5. Decorative framing must never make content harder to read.

---

## Density Rules

- Avoid box-inside-box repetition unless it clarifies information grouping.
- Important text must never touch borders or feel cramped.
- Metrics should read instantly.
- Tables should stay clean, aligned, and visually quieter than hero areas.


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
