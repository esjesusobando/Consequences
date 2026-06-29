---
name: engram-docs-alignment
description: >
  Documentation alignment rules for Engram.
  Trigger: Any code or workflow change that affects user or contributor behavior.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
sota_upgraded: true
---

## When to Use

Use this skill when:
- Changing APIs, setup flows, or plugin behavior
- Updating CLI commands or examples
- Writing contributor guidance

---

## Alignment Rules

1. Docs must describe current behavior, not intended behavior.
2. Update docs in the same PR as the code change.
3. Validate examples before publishing.
4. Remove references to deprecated files, endpoints, or scripts.

---

## Verification

- [ ] Endpoint names match server routes
- [ ] Script names match repository paths
- [ ] Command examples execute as documented
- [ ] Cross-agent notes are still accurate


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
