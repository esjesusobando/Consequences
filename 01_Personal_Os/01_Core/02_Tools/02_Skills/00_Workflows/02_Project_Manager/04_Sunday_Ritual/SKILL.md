---
name: sunday-ritual
description: Weekly reset and planning session. Triggers on: sunday ritual, weekly reset, end of week, prepare next week, sunday planning, weekly cleanup.
sota_upgraded: true
---

# Sunday Ritual Skill

> Weekly reset (30-45 min) to prepare for the next week.

## Esencia Original
> Based on PersonalOS: "Weekly: Process my backlog + Clean up old tasks"
> Set intentions for the coming week during the Sunday ritual.

## When to Use

- Sunday evenings for a "Weekly Reset."
- When the user wants to align their Digital Brain with long-term goals.

## Workflow (Original)

1. **Reflective Harvest**: Analyze progress against metrics in `GOALS.md`.
2. **Capture Sweep**: Process backlog focusing on the past week's captures.
3. **Architecture**: Plan next week's top 3 P0 tasks.
4. **System Maintenance**:
   - Archive completed tasks.
   - Sync process notes.
   - Run self-healing checks.

## ⚠️ Gotchas (Errores Comunes a Evitar)

- **[ERROR]**: No revisar progress de la semana
  - **Por qué**: Sin métricas, es solo opinión
  - **Solución**: Usar `analyze-progress.py` para datos reales

- **[ERROR]**: No procesar el backlog
  - **Por qué**: El backlog crece sin control
  - **Solución**: Usar `backlog-triage.py` antes de planificar

- **[ERROR]**: No actualizar GOALS.md
  - **Por qué**: Priorities shift durante la semana
  - **Solución**: Revisar y ajustar objetivos

- **[ERROR]**: No archivar tareas completadas
  - **Por qué**: Tasks activas polucionan la vista
  - **Solución**: Mover tasks done a `06_Archive/`

- **[ERROR]**: Planificar más de 3 P0
  - **Por qué**: Es imposible completar más de 3 P0 por semana
  - **Solución**: Ser realista con la capacidad

---

## 📁 Progressive Disclosure

> Para información detallada, ver:
- [references/ritual-guide.md](references/ritual-guide.md) — Guía del ritual dominical
- [references/weekly-metrics.md](references/weekly-metrics.md) — Métricas semanales

---

## 🛠️ Scripts

- [scripts/weekly-metrics.py](scripts/weekly-metrics.py) — Genera reporte semanal
- [scripts/archive-completed.py](scripts/archive-completed.py) — Archiva tareas completadas

---

## 📋 Flujo de Ejecución

1. **Ejecutar `weekly-metrics.py`** → Obtener datos de la semana
2. **Ejecutar `backlog-triage.py`** → Procesar backlog acumulado
3. **Revisar GOALS.md** → Ajustar prioridades
4. **Planificar próxima semana** → Max 3 P0 tasks
5. **Ejecutar `archive-completed.py`** → Limpiar tareas done

---

## 💾 State Persistence

Guardar log del ritual en:
- `${CLAUDE_PLUGIN_DATA}/sunday-ritual/logs/` (si está configurado)
- O en archivo local `logs/sunday-ritual.log`


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
