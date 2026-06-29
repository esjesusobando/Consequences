# Weekly Metrics Guide

## Key Metrics to Track

### Completion Metrics

| Metric                                         | Formula                                           | Target                                  |
|-----------------------------------------------|--------------------------------------------------|----------------------------------------|
| Completion Rate                                | Done / Total                                      | > 70%                                   |
| P0 Completion                                  | P0 Done / P0 Total                                | > 80%                                   |
| Blocked Rate                                   | Blocked / Total                                   | < 10%                                   |

### Time Metrics

| Metric                                      | Formula                                          | Target                                  |
|--------------------------------------------|-------------------------------------------------|----------------------------------------|
| Deep Work                                   | Hours on P0/P1                                   | > 15 hrs                                |
| Meeting Time                                | Hours in meetings                                | < 10 hrs                                |
| Buffer                                      | Unplanned time                                   | > 5 hrs                                 |

### Health Metrics

| Metric                                               | Target                                    |
|-----------------------------------------------------|------------------------------------------|
| Backlog Size                                         | < 20 items                                |
| Blocked Tasks                                        | < 3                                       |
| Old Tasks (> 2 weeks)                                | 0                                         |

## How to Measure

1. Run `analyze-progress.py` to get task stats
2. Review calendar for time allocation
3. Check backlog for size and age

## Weekly Report Template

```
## Week of [Date]

### Accomplished
- [Task 1]
- [Task 2]

### Blocked
- [Blocked task + reason]

### Next Week Plan
1. [P0 Task]
2. [P0 Task]
3. [P0 Task]

### Goals Progress
- Goal 1: X% complete
- Goal 2: Y% complete
```


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
