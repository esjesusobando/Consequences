---
name: weekly-review
description: Weekly reflection and planning session. Triggers on: weekly planning, weekly review, reflect on progress, plan next week, goal check-in, end of week reflection, monthly recap.
sota_upgraded: true
---

# Weekly Review Skill

> A 15-30 minute session to reflect on progress and plan ahead.

## Esencia Original
> Focus: Celebrate, Evaluate, Identify Blockers, Plan Future, Time Budget.

## ⚠️ Gotchas (Errores Comunes a Evitar)

- **[ERROR]**: Revisión superficial
  - **Por qué**: Reflexión sin métricas es solo opinión.
  - **Solución**: Usar `analyze-progress.py` para datos reales.

- **[ERROR]**: Olvidar revisar bloqueos antiguos
  - **Por qué**: Los bloqueos que no se escalan mueren en el backlog.
  - **Solución**: Revisar el archivo `backlog-triage.py` y reportes de bloqueos antiguos.

- **[ERROR]**: Planificar sin presupuesto de tiempo
  - **Por qué**: Sobrecarga = Fracaso.
  - **Solución**: Siempre calcular "Deep work" vs "Meetings" vs "Buffer".

- **[ERROR]**: No actualizar GOALS.md
  - **Por qué**: Priorities shift, el archivo queda desactualizado.
  - **Solución**: Modificar GOALS.md si hay cambios en prioridades.

---

## 📁 Progressive Disclosure

> Para la sesión de reflexión, sigue estas guías:

- [references/reflection-guide.md](references/reflection-guide.md) — Prompts originales del workflow.
- [references/progress-metrics.md](references/progress-metrics.md) — Cómo medir el éxito.

---

## 🛠️ Scripts (Automatización)

- [scripts/analyze-progress.py](scripts/analyze-progress.py) — Compara Tasks/ vs GOALS.md.

---

## 📋 Flujo de Ejecución

1. **Ejecutar `analyze-progress.py`** → Obtener datos de tareas
2. **Seguir reflection-guide.md** → Paso 1-4 de reflexión
3. **Usar progress-metrics.md** → Calcular métricas
4. **Actualizar GOALS.md** → Si prioridades cambiaron
5. **Planificar próxima semana** → Con budget de tiempo

---

## 💾 State Persistence

Esta skill puede guardar un log de sesiones anteriores en:
- `${CLAUDE_PLUGIN_DATA}/weekly-review/logs/` (si está configurado)
- O en archivo local `logs/weekly-review.log`

Esto permite comparar con semanas anteriores.


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
