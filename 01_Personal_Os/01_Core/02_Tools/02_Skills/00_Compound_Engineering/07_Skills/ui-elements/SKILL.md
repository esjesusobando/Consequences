---
name: engram-ui-elements
description: >
  Creation rules for Engram UI elements, pages, cards, metrics, and detail flows.
  Trigger: Adding or changing dashboard UI components or connected browsing flows.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
sota_upgraded: true
---

## When to Use

Use this skill when:
- Adding a new page or partial to the dashboard
- Creating cards, metrics, tables, lists, or detail views
- Designing connected navigation between related entities

---

## UX Rules

1. Every list item should lead somewhere useful when domain relationships exist.
2. Prefer connected flows: project -> session -> observation -> full detail.
3. Empty states must explain what is missing and what unlocks data.
4. Metrics must reflect real system state, not decorative counters.
5. Detail pages should show metadata, content, and the next relevant links.

---

## Composition Rules

- Use metrics for orientation, not for replacing core content.
- Use cards for browsable entities and tables for dense comparative admin data.
- Avoid nested framed boxes unless they communicate a hierarchy the user needs.
- Keep action controls close to the entity they affect.


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
