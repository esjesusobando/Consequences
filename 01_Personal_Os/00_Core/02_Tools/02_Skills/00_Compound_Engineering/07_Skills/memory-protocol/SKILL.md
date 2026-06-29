---
name: engram-memory-protocol
description: >
  Persistent memory discipline for Engram contributors.
  Trigger: Decisions, bugfixes, discoveries, preferences, or session closure.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
sota_upgraded: true
---

## When to Use

Use this skill when:
- Making architecture or implementation decisions
- Fixing bugs with non-obvious root causes
- Discovering patterns, gotchas, or user preferences
- Closing a session or after compaction

---

## Save Rules

Call `mem_save` immediately after:
- decision
- bugfix
- pattern/discovery
- config/preference changes

Use structured content:
- What
- Why
- Where
- Learned

Use stable `topic_key` for evolving topics.

---

## Search Rules

- On recall requests: `mem_context` first, then `mem_search`.
- Before similar work: run proactive `mem_search`.
- On first message: if user references the project, a feature, or a problem, call `mem_search` with their keywords before responding.

---

## Session Close Rules

Before saying done/listo:
1. Call `mem_session_summary`.
2. Include goal, discoveries, accomplished, next steps, relevant files.

After compaction:
1. Save summary first.
2. Recover context.
3. Continue work.


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
