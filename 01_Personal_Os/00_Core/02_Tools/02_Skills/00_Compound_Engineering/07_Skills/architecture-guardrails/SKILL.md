---
name: engram-architecture-guardrails
description: >
  Architecture guardrails for Engram across local store, cloud sync, dashboard,
  and plugins. Trigger: Any change that affects system boundaries, ownership,
  state flow, or cross-package responsibilities.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
sota_upgraded: true
---

## When to Use

Use this skill when:
- Adding a new subsystem or major package
- Moving responsibilities between local store, cloud, dashboard, or plugins
- Changing sync flow, source-of-truth rules, or persistence boundaries

---

## Core Guardrails

1. Local SQLite is the source of truth; cloud is replication and shared access.
2. Keep plugin/adaptor layers thin; real behavior belongs in Go packages.
3. Prefer explicit boundaries: store, cloudstore, server, dashboard, autosync.
4. New features must fit the existing local-first mental model before they fit the UI.
5. Do not hide cross-system coupling inside helpers or templates.

---

## Decision Rules

- Local-only concern -> `internal/store`
- Cloud materialization or org-wide control -> `internal/cloud/cloudstore`
- HTTP contract or enforcement -> `internal/cloud/cloudserver`
- Browser rendering and UX -> `internal/cloud/dashboard`
- Background orchestration -> `internal/cloud/autosync`

---

## Validation

- Add regression tests for every boundary change.
- Verify local, remote, and dashboard behavior still tell the same product story.
- If the change touches sync, test both push and pull paths.


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
