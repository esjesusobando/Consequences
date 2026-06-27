---
name: engram-plugin-thin
description: >
  Adapter boundary rules for plugin integrations.
  Trigger: Changes in plugin scripts/hooks for Claude, OpenCode, Gemini, or Codex.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
sota_upgraded: true
---

## When to Use

Use this skill when:
- Editing plugin hooks/scripts/adapters
- Adding passive/active memory capture integrations
- Wiring agent-specific setup behavior

---

## Boundary Rules

1. Keep adapters thin: parse input, call API/tool, return.
2. Put complex logic in Go core (`store/server/mcp`).
3. Avoid extra runtime dependencies in plugin scripts.
4. Reuse a shared contract across all supported agents.

---

## Compatibility Checklist

- [ ] Claude Code flow still works
- [ ] OpenCode flow still works
- [ ] Gemini/Codex config paths remain valid
- [ ] Docs reflect real integration behavior


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
