---
name: engram-business-rules
description: >
  Product and business-rule guardrails for Engram. Trigger: Any change that
  affects sync behavior, project controls, permissions, or memory semantics.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
sota_upgraded: true
---

## When to Use

Use this skill when:
- Changing enrollment, sync, auth, admin controls, or cloud behavior
- Implementing project-level or org-level policy
- Adjusting what data appears locally vs remotely

---

## Product Rules

1. Local-first remains the default mental model.
2. Org-wide security controls belong in cloud, not only in local clients.
3. Project sync policy must be enforceable server-side if it is meant for admins.
4. UI controls must map to real business rules, never fake toggles.
5. Data visibility and sync permissions must be deterministic and testable.

---

## Sync Rules

- Enrollment controls what may sync from local.
- Cloud pause controls what the organization currently allows.
- When a policy blocks sync, fail loudly rather than dropping data silently.
- Preserve auditability whenever admin policy changes behavior.


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
