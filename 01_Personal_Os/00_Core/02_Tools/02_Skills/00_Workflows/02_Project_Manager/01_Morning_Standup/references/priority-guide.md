# Priority Guide

## P0 — Critical
- Security issues
- Production bugs
- Blocker for other team members
- Deadline TODAY

## P1 — Important
- Core feature work
- Technical debt that affects velocity
- Deadline this week

## P2 — Nice to Have
- Improvements
- Refactoring
- Documentation

## P3 — Backlog
- Ideas
- Future work
- Nice to have someday

## Decision Tree

```
Is it blocking someone?
  YES → P0

NO → Is it breaking production?
  YES → P0

NO → Is deadline today?
  YES → P0

NO → Does it affect >50% of users?
  YES → P1

NO → Is it core to current goal?
  YES → P1

NO → P2/P3
```

## Standup Rules

| Priority                                  | Include in Standup?                                  | Frequency                                     |
|------------------------------------------|-----------------------------------------------------|----------------------------------------------|
| P0                                        | ✅ ALWAYS                                             | Daily                                         |
| P1                                        | ✅ Max 3                                              | Daily                                         |
| P2                                        | ❌ NO                                                 | Weekly review                                 |
| P3                                        | ❌ NO                                                 | Monthly review                                |


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
