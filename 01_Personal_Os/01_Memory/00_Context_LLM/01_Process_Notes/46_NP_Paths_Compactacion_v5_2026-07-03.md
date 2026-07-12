# 46 NP — Path Compactación v5.0 (2026-07-03)

## Problema
Tras la migración v4→v5 de la estructura de directorios, quedaron cientos de archivos con paths hardcodeados a `04_Operations/` que ya no existe. Esto causaba:
- Scripts Python crasheando con `FileNotFoundError`
- Agentes leyendo paths incorrectos en sus definiciones
- Documentación referencing ubicaciones que ya no existen

## Solución Aplicada

### Fase 1 — Python scripts críticos
Los scripts que ejecutan operaciones del sistema tenían paths hardcodeados sin usar `config_paths.py`:
- `backlog-triage.py`: `get_tasks_dir()` retornaba `04_Operations/02_Tasks` en vez de `04_Tasks`
- `03_Validate_Rules.py`: path key del diccionario de rutas
- `62_Tool_Shed.py` + 4x `00_Notifier.py`: `sys.path.insert` apuntando a ubicación vieja
- `post_hulk_compound.py`: tenía doble path anidado `04_Operations/05_Scripts`

**Lección:** `config_paths.py` es la fuente de verdad — scripts que hardcodean paths directamente son fragiles. Pero en scripts legacy con `sys.path.insert()`, no hay alternativa, hay que fixear directo.

### Fase 2 — Automatización con batch_replace_paths.py
El script existente necesitaba reglas adicionales:
- `04_Operations/02_Tasks/` → `04_Tasks/` (y sin trailing slash)
- Orden de reglas crítico: específicas ANTES de genéricas (evita `04_Operations/02_Tasks` → `05_Scripts/02_Tasks`)

### Fase 3 — Documentación
- Skills + Workflows: 8 files, 22 replacements batch
- Root docs: 7 files manuales (los batch no cubrían todos los patrones)
- `.agent/` boot docs: 3 files que los agentes leen al arrancar
- Task files: 5 files con paths operativos

## Archivos Clave Modificados
- `05_Scripts/00_HUBs/03_Scripts_Os/batch_replace_paths.py`
- `04_Tasks/README.md` (completamente reescrito)
- `.agent/CLAUDE.md`, `.agent/README.md`, `.agent/02_Skills/README.md`

## Estado Actual
- ✅ 6 scripts Python críticos corregidos
- ✅ 8 skills/workflows funcionales actualizados
- ✅ 7 root docs + 3 .agent/ docs + 5 task files al día
- ⏳ ~97 agent definitions en `00_Core/02_Tools/01_Agents/` pendientes

## Notas Técnicas
- `04_Operations/06_Solutions/` → `01_Memory/00_Context_LLM/06_Solutions/`
- `04_Operations/05_Plans/` → `01_Memory/00_Context_LLM/05_Plans/`
- `.agent/` es backup de `00_Core/` — fixear `00_Core/` es la fuente de verdad
