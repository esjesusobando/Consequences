---
name: engram-dashboard-htmx
description: >
  HTMX and templ interaction rules for the Engram dashboard. Trigger: Any
  change to htmx attributes, partial updates, forms, or server-rendered browser UI.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
sota_upgraded: true
---

## When to Use

Use this skill when:
- Adding htmx partial loading or filter controls
- Wiring forms or toggles in the dashboard
- Changing browser/search interactions

---

## HTMX Rules

1. Server-rendered HTML is the product; htmx enhances it, it does not replace it.
2. Prefer simple `hx-get` and `hx-include` over custom client-side state.
3. Filters must preserve the active state users would expect across interactions.
4. Forms that mutate system state must still work as normal HTTP posts.
5. Partial endpoints return meaningful HTML on their own, not fragments that depend on hidden JS assumptions.

---

## Interaction Rules

- Search and filter controls must compose cleanly.
- Toggle actions must visibly reflect the resulting server state.
- Connected navigation should keep URLs meaningful and shareable.
- Use htmx for speed, not to hide business logic in the browser.


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
