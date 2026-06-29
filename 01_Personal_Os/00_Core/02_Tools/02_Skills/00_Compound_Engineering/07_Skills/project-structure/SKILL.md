---
name: engram-project-structure
description: >
  Repository structure and placement rules for Engram. Trigger: Creating files,
  packages, handlers, templates, styles, or tests in this repo.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
sota_upgraded: true
---

## When to Use

Use this skill when:
- Creating a new package, file, or directory
- Deciding where code belongs
- Adding tests, templates, assets, or docs

---

## Placement Rules

1. Put behavior near its domain, not near the caller that happens to use it.
2. Keep templates in `internal/cloud/dashboard/*.templ` and generated files checked in.
3. Keep dashboard styling in `internal/cloud/dashboard/static/styles.css` unless a new static asset is clearly needed.
4. Put HTTP handlers in server packages, not in store packages.
5. Put persistence queries in store/cloudstore, not in handlers.

---

## File Creation Rules

- New route -> handler + tests in dashboard/server package
- New DB behavior -> store/cloudstore code + focused tests
- New UI partial/page -> templ component + generated `_templ.go`
- New contributor guidance -> update docs/catalog in same change

---

## Anti-Patterns

- Do not mix SQL, HTML, and transport logic in one file.
- Do not create utility packages for one-off helpers.
- Do not add package layers unless they remove real coupling.


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
