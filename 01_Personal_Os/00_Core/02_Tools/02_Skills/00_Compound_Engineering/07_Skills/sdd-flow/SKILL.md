---
name: engram-sdd-flow
description: >
  Spec-Driven Development workflow for Engram.
  Trigger: When user requests SDD or multi-phase implementation planning.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
sota_upgraded: true
---

## When to Use

Use this skill when:
- Starting non-trivial changes
- Coordinating spec, design, implementation, and validation
- Running command-based SDD flow

---

## Canonical Phase Order

1. `explore` - understand existing behavior and constraints
2. `propose` - define intent and scope
3. `apply` - implement tasks from approved plan
4. `verify` - validate behavior against spec and regressions
5. `archive` - capture completion and close loop

Never skip a phase without explicit rationale.

---

## Artifacts per Phase

- Explore: findings and risks
- Propose: change proposal with scope boundaries
- Apply: code + tests
- Verify: evidence of validation
- Archive: finalized summary and follow-ups

---

## Exit Criteria

- [ ] Scope and risks understood before implementation
- [ ] Tests prove expected behavior
- [ ] Verification covers regressions
- [ ] Session summary captures learnings for next work


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
