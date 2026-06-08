# 🎣 05_Hooks — Sistema de Automatización PersonalOS v1.1

**Versión:** 1.1
**Última actualización:** 2026-05-26
**Fuente de verdad:** `01_Personal_Os/01_Core/02_Tools/05_Hooks/`
**Backup:** `.agent/04_Extensions/01_Hooks/`

---

## 🗺️ Flujo Completo de Hooks

```
Tool invocado por Claude
        │
        ▼
┌─────────────────────┐
│   01_Pre_Tool       │  → Validar seguridad + check batería
│   pre_tool_use.py   │    Bloquear si batería < 15%
└────────┬────────────┘
         │ Tool ejecutado
         ▼
┌─────────────────────┐
│   02_Post_Tool      │  → Validar output + backup automático
│   post_tool_use.py  │    Loggear resultado en JSON
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│   04_Sound          │  → Notificación sonora del resultado
│   notification.py   │    --task-complete / --success / --error
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│   05_Harness        │  → Monitorear uso de contexto
│   context_monitor   │    Disparar evals si necesario
│   eval_trigger.py   │
└─────────────────────┘

Sesión terminando:
        │
        ▼
┌─────────────────────┐
│   03_Lifecycle      │  → stop.py: cierre de sesión + mem_session_summary
│   stop.py           │    subagent_stop.py: cierre de sub-agente
│   subagent_stop.py  │
└─────────────────────┘

Post-Compound Engineering:
        │
        ▼
┌──────────────────────────────┐
│   06_Post_Hulk_Compound      │  → Acciones post-CE workflow
│   post_hulk_compound.py      │    Compound knowledge capture
└──────────────────────────────┘
```

---

## 📋 Directorio de Scripts

### 01_Pre_Tool — Prevención Pre-Ejecución

| Script                                     | Función                                                                                         | Cuándo se dispara                               |
|-------------------------------------------|------------------------------------------------------------------------------------------------|------------------------------------------------|
| `pre_tool_use.py`                          | Chequeo de batería (< 15% = warning), validación de seguridad, logging                          | Antes de CADA tool use                          |

**Acciones:**
- `check_battery()` — Verifica batería en Windows via PowerShell
- `speak()` — Notificación de voz si hay alerta
- `log_to_json()` — Logging de cada tool invocado

---

### 02_Post_Tool — Validación Post-Ejecución

| Script                                      | Función                                                                                 | Cuándo se dispara                                 |
|--------------------------------------------|----------------------------------------------------------------------------------------|--------------------------------------------------|
| `post_tool_use.py`                          | Validación de outputs, backup de cambios, logging de resultado                          | Después de CADA tool use                          |

---

### 03_Lifecycle — Ciclo de Vida de Sesión

| Script                                      | Función                                                                              | Cuándo se dispara                                                         |
|--------------------------------------------|-------------------------------------------------------------------------------------|--------------------------------------------------------------------------|
| `stop.py`                                   | Cierre limpio de sesión: guarda en Engram, notifica usuario                          | Cuando Claude termina (`Stop` event)                                      |
| `subagent_stop.py`                          | Cierre de sub-agente: guarda contexto antes de retornar                              | Cuando sub-agente termina (`SubagentStop` event)                          |

**Protocolo de cierre (`stop.py`):**
```python
# 1. engram_mem_session_summary() — OBLIGATORIO
# 2. Notificación de sonido --success
# 3. Log final en JSON
```

---

### 04_Sound — Notificaciones Sonoras

| Script                                             | Función                                                          | Uso                                                               |
|---------------------------------------------------|-----------------------------------------------------------------|------------------------------------------------------------------|
| `notification.py`                                  | Motor de notificaciones de audio                                 | `python notification.py --task-complete`                          |
| `task-complete-sound.ps1`                          | Script PowerShell para audio en Windows                          | Invocado por notification.py                                      |
| `task-complete.bat`                                | Wrapper batch para compatibilidad                                | Fallback Windows                                                  |

**Flags disponibles:**
```bash
python 01_Personal_Os/01_Core/02_Tools/05_Hooks/04_Sound/notification.py --task-complete
python 01_Personal_Os/01_Core/02_Tools/05_Hooks/04_Sound/notification.py --success
python 01_Personal_Os/01_Core/02_Tools/05_Hooks/04_Sound/notification.py --error
python 01_Personal_Os/01_Core/02_Tools/05_Hooks/04_Sound/notification.py --notify "Progreso: 45%"
```

---

### 05_Harness — Evaluación y Monitoreo

| Script                                        | Función                                                                                | Cuándo se dispara                               |
|----------------------------------------------|---------------------------------------------------------------------------------------|------------------------------------------------|
| `context_monitor.py`                          | Monitorea uso del contexto, alerta cuando se acerca al límite                          | Periódicamente                                  |
| `eval_trigger.py`                             | Dispara evaluaciones automáticas del sistema                                           | Por condición o manual                          |

---

### 06_Post_Hulk_Compound — Post Compound Engineering

| Script                                           | Función                                                                             | Cuándo se dispara                                             |
|-------------------------------------------------|------------------------------------------------------------------------------------|--------------------------------------------------------------|
| `post_hulk_compound.py`                          | Acciones post-CE: captura de learnings, compound knowledge                          | Al completar workflow `/ce:compound`                          |

---

## ⚙️ Hooks Wireados vs Documentados

> **Estado Real (2026-05-26):** No todos los hooks documentados están configurados en `settings.json`.

### Hooks Configurados en `.claude/settings.json` (✅ ACTIVOS)

| Hook                                      | Script                                                   | Estado                            |
|------------------------------------------|---------------------------------------------------------|----------------------------------|
| PreToolUse                                | `01_Pre_Tool/pre_tool_use.py`                            | ✅ Activo                          |
| PostToolUse                               | `02_Post_Tool/post_tool_use.py`                          | ✅ Activo                          |
| Stop                                      | `03_Lifecycle/stop.py`                                   | ✅ Activo                          |
| **SubagentStop**                          | `03_Lifecycle/subagent_stop.py`                          | ✅ Activo                          |

### Hooks Documentados pero NO Configurados (❌ INACTIVOS)

| Hook                                           | Script                                           | Estado                                | Acciones                                                                   |
|-----------------------------------------------|-------------------------------------------------|--------------------------------------|---------------------------------------------------------------------------|
| 04_Sound                                       | `notification.py`                                | ❌ No wireado                          | Manual: `--task-complete`, `--success`, `--error`                          |
| 05_Harness                                     | `context_monitor.py`                             | ❌ No wireado                          | Manual: monitoreo de contexto                                              |
| 05_Harness                                     | `eval_trigger.py`                                | ❌ No wireado                          | Manual: dispara evals                                                      |
| 06_Post_Hulk_Compound                          | `post_hulk_compound.py`                          | ❌ No wireado                          | Manual: post-CE workflow                                                   |

### Recomendación
Para activar los hooks inactivos, agregar al `settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [{ "command": "python .../01_Pre_Tool/pre_tool_use.py" }],
    "PostToolUse": [{ "command": "python .../02_Post_Tool/post_tool_use.py" }],
    "Stop": [{ "command": "python .../03_Lifecycle/stop.py" }],
    "SubagentStop": [{ "command": "python .../03_Lifecycle/subagent_stop.py" }]
  }
}
```

---

## ⚙️ Configuración en settings.json

Los hooks están configurados en `C:\Users\sebas\.claude\settings.json` con paths absolutos:

```json
{
  "hooks": {
    "PreToolUse": [{
      "command": "python C:/Users/sebas/.../Think_Different/01_Personal_Os/01_Core/02_Tools/05_Hooks/01_Pre_Tool/pre_tool_use.py"
    }],
    "PostToolUse": [{
      "command": "python C:/Users/sebas/.../Think_Different/01_Personal_Os/01_Core/02_Tools/05_Hooks/02_Post_Tool/post_tool_use.py"
    }],
    "Stop": [{
      "command": "python C:/Users/sebas/.../Think_Different/01_Personal_Os/01_Core/02_Tools/05_Hooks/03_Lifecycle/stop.py"
    }],
    "SubagentStop": [{
      "command": "python C:/Users/sebas/.../Think_Different/01_Personal_Os/01_Core/02_Tools/05_Hooks/03_Lifecycle/subagent_stop.py"
    }]
  }
}
```

> ⚠️ Los paths deben ser ABSOLUTOS. Paths relativos fallan cuando Claude Code se abre desde subdirectorios.

---

## 🔄 Sincronización con Backup

El runtime mirror en `.agent/04_Extensions/01_Hooks/` debe estar sincronizado con `01_Personal_Os/01_Core/02_Tools/05_Hooks/`.

**Fuente de verdad:** `01_Personal_Os/01_Core/02_Tools/05_Hooks/` (aquí)
**Backup:** `.agent/04_Extensions/01_Hooks/`

> ✅ Importante: la configuración de Claude puede apuntar al runtime mirror `.agent/04_Extensions/01_Hooks/`; por eso este directorio y `01_Personal_Os/01_Core/02_Tools/05_Hooks/` deben mantenerse sincronizados.

Al modificar un hook, actualizar AMBOS directorios y revalidar `.claude/settings.json` / `.claude/settings.local.json`.
