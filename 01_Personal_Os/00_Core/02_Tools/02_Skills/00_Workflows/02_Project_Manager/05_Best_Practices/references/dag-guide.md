# DAG Guide

## What is a DAG?

**Directed Acyclic Graph** - A way to model task dependencies without cycles.

## DAG Structure

```json
{
  "tasks": {
    "task-1": {
      "description": "Foundation setup",
      "depends_on": [],
      "status": "pending"
    },
    "task-2": {
      "description": "Config layer",
      "depends_on": ["task-1"],
      "status": "pending"
    },
    "task-3": {
      "description": "Execution",
      "depends_on": ["task-2"],
      "status": "pending"
    }
  }
}
```

## Why DAG?

- **Explicit dependencies** - No hidden order requirements
- **Parallel execution** - Tasks without dependencies can run together
- **Visual clarity** - See the whole picture
- **Error isolation** - Failures don't cascade

## Rules

1. No circular dependencies
2. Each task has explicit `depends_on`
3. Use wave execution (tasks in same wave can parallelize)
4. Store DAG in `tasks.json` or `DAG.md`

## Wave Strategy

- **Wave 1**: Foundation (no deps)
- **Wave 2**: Config (depends on Wave 1)
- **Wave 3**: Execution (depends on Wave 2)
- etc.


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
