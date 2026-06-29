# Progress Metrics Guide

## Cómo Medir el Éxito de la Semana

### Métricas Cuantitativas

| Métrica                                               | Cómo Calcular                                                              | Meta Sugerida                                   |
|------------------------------------------------------|---------------------------------------------------------------------------|------------------------------------------------|
| **Completion Rate**                                   | Tareas completadas / Tareas totales                                        | > 70%                                           |
| **Goal Alignment**                                    | Tareas P0 completadas / Total P0                                           | > 80%                                           |
| **Blocker Resolution**                                | Bloqueos resueltos / Bloqueos identificados                                | > 50%                                           |
| **Time Investment**                                   | Horas de deep work registradas                                             | 15-20 hrs/semana                                |

### Categorías de Tiempo

```
Deep Work:     [████████░░░░░░░░] 65% - Trabajo enfocado sin interrupciones
Meetings:      [████░░░░░░░░░░░░] 25% - Reuniones obligatorias
Buffer:        [██░░░░░░░░░░░░░░] 10% - Espacio para imprevistos
```

### Indicadores de Alerta

| Señal                                                      | Qué Significa                                            | Acción                                               |
|-----------------------------------------------------------|---------------------------------------------------------|-----------------------------------------------------|
| 🔴 < 50% completion                                         | Sobrecarga o bloqueos                                    | Revisar prioridades                                  |
| 🔴 Bloqueos > 3 sin resolver                                | Falta de seguimiento                                     | Escalar o pedir ayuda                                |
| 🟡 Deep work < 10 hrs                                       | Demasiadas interrupciones                                | Proteger tiempo fokus                                |
| 🟢Completion > 80%                                          | Semana productiva                                        | Celebrar y mantener                                  |

### Cómo Usar estos Datos

1. **Ejecutar `analyze-progress.py`** - Obtiene lista de tareas
2. **Calcular completion rate** - Tareas con `status: d` / total
3. **Revisar blockers** - Identificar bloqueos > 3 días
4. **Ajustar presupuesto de tiempo** - Para la próxima semana


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
