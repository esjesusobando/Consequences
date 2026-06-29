---
name: engram-pr-review-deep
description: >
  Deep technical review protocol for Engram pull requests.
  Trigger: Reviewing any external or internal contribution before merge.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
sota_upgraded: true
---

## When to Use

Use this skill when:
- Evaluating PRs from contributors
- Reviewing risky refactors
- Deciding merge vs request-changes

---

## Review Protocol

1. Read full diff, not only summary.
2. Run relevant tests locally.
3. Validate API/contracts and migration safety.
4. Check docs against implementation.
5. Flag commit hygiene violations.

---

## Merge Gate

Merge only when:
- checks are green
- risk is understood
- blockers are resolved
- scope is coherent

Otherwise request changes with actionable items.


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
