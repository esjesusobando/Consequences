# Atomic Tasks

## Definition

An atomic task is a single, self-contained unit of work that:
- Can be completed in one session
- Has clear input and output
- Is < 100 lines of code change
- Has no hidden dependencies

## Why Atomic?

- **Reviewable**: Easy to review in one pass
- **Testable**: Clear input/output for tests
- **Reversible**: Easy to rollback if needed
- **Parallelizable**: No coupling to other tasks

## Atomic Task Template

```yaml
---
id: TASK-001
title: [Action verb + what]
description: One sentence description
wave: 1
depends_on: []
inputs:
  - file: path/to/input
outputs:
  - file: path/to/output
estimate: 30min
---
```

## Rules

1. **Single responsibility**: One clear purpose
2. **Small scope**: < 100 lines changes max
3. **Clear interfaces**: Input/output well defined
4. **Independent**: No hidden deps to other tasks

## Breaking Down Large Tasks

If a task is too big:
1. Split into smaller subtasks
2. Each subtask becomes its own task
3. Use dependencies to enforce order
4. Each subtask should be < 100 lines

## Warning Signs

- Task takes > 1 day
- Description > 2 sentences
- "And" in description = too big
- Needs other tasks to start = add dependency


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
