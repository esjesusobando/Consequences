---
name: genesis-workflow
description: Protocolo de inicio y boot del sistema PersonalOS — carga de contexto inicial, verificación de integridad y alineación estratégica.
---

# Genesis Workflow — Protocolo de Inicio del Sistema

## Propósito
Cargar el contexto completo del sistema al inicio de cada sesión, asegurando que el agente entienda el estado actual, las prioridades estratégicas y las herramientas disponibles.

## Pasos del Genesis

### 1. Carga de Contexto Estratégico
```python
engram_mem_context(limit=10)
```
Recuperar las últimas 10 sesiones de Engram para entender qué se hizo antes.

### 2. Revisión de Metas y Prioridades
- Leer `00_Winter_is_Coming/GOALS.md` — Metas activas
- Leer `00_Winter_is_Coming/BACKLOG.md` — Tareas pendientes
- Leer `00_Winter_is_Coming/AGENTS.md` — Estructura del sistema

### 3. Verificación de Salud del Sistema
- Correr: `python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/17_Watchdog_Hub.py --quick`
- Verificar que `01_Personal_Os/00_Core/` existe y tiene estructura correcta
- Verificar que `01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/config_paths.py` funciona

### 4. Carga de Skills y Herramientas
- Skills activas en `~/.config/opencode/skills/`
- Agentes en `.agent/01_Agents/`
- Reglas en `.agent/00_Rules/`

### 5. Reporte de Estado
Resumir en el chat: metas activas, estado del sistema, últimas sesiones.

## Archivos Relacionados
- `00_Winter_is_Coming/GOALS.md` — Metas estratégicas
- `00_Winter_is_Coming/BACKLOG.md` — Backlog de tareas
- `00_Winter_is_Coming/AGENTS.md` — Documentación del sistema
- `.agent/CLAUDE.md` — Reglas del agente
- `01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/config_paths.py` — Rutas centralizadas
