---
name: engram-server-api
description: >
  API contract guardrails for Engram server changes.
  Trigger: Any route, handler, payload, or status code modification.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
sota_upgraded: true
---

## When to Use

Use this skill when:
- Adding or changing HTTP routes
- Updating handler request/response schemas
- Modifying status code behavior

---

## Contract Rules

1. Every new/changed endpoint must have tests.
2. Cover both success and error paths.
3. Keep scripts and docs aligned with real handlers.
4. Do not reference non-existent endpoints in plugins/hooks.

---

## Required Validation

- Handler-level tests for parsing/validation errors
- E2E tests for route behavior and response body
- Regression test for every bugfix related to API contracts

---

## Docs Rules

If payload or route changes, update docs in the same PR.


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
