---
title: OS Edge Cases — Path Guardian, Error Taxonomy, Secret Scanner, Hook Pipeline
type: refactor
status: completed
date: 2026-07-07
---

# OS Edge Cases: Path Guardian, Error Taxonomy, Secret Scanner, Hook Pipeline

## Overview

Elevar el Personal OS v5.0 a SOTA real resolviendo los edge cases estructurales identificados en la auditoría del 2026-07-07: fragilidad en resolución de paths, falta de taxonomía de errores, secret scanner con falsos negativos, hook pipeline incompleto, y patrones anti-estándar (shebang, asserts en producción, StopIteration).

## Problem Frame

El OS tiene 396 skills, 63 agents, 42 HUBs, 166 scripts — pero varios patrones frágiles se repiten en múltiples archivos. Cada fix aislado no escala. Necesitamos:

1. Un **Path Guardian** centralizado que elimine el patrón `next()` sin default (StopIteration crash)
2. Una **Error Taxonomy** con excepciones tipadas para todos los componentes
3. Un **Secret Scanner v2** que realmente detecte los secrets que existen en el OS
4. Un **Hook Pipeline completo** con los 4 hooks inactivos wireados
5. **Barrido de limpieza**: shebangs, asserts, `except: pass`

## Scope Boundaries

- **IN**: Solo scripts Python del OS (`05_Scripts/00_HUBs/03_Scripts_Os/`, `00_Core/02_Tools/05_Hooks/`)
- **IN**: Hooks pipeline, secret scanner, path resolution, sync_copies
- **OUT**: No tocar skills, agents, workflows (son contenido, no infraestructura)
- **OUT**: No migrar a TypeScript ni cambiar runtime
- **OUT**: No tocar config.json / mcp.json con API keys (se deja para fase .env)

## Requirements Trace

- R1. Ningún script del OS puede crashear con `StopIteration` por CWD inesperado
- R2. Todos los scripts de producción usan excepciones reales, no `assert`
- R3. `secret_scanner.py` detecta los patrones de tokens reales del OS
- R4. Los 4 hooks inactivos están wireados en settings.json o documentados como desactivados
- R5. Todos los scripts tienen shebang en línea 1
- R6. No hay `except: pass` silencioso en código de producción
- R7. `sync_copies.py` cubre todos los archivos compartidos entre Copy A y B
- R8. El boot adaptativo (`adaptive_boot.py`) tiene paths válidos

## Context & Research

### Relevant Code and Patterns

- `config_paths.py:29-55` — `find_project_root()` actual, funcional pero frágil
- `sync_copies.py:26-55` — `detect_copy()` con el mismo patrón de iteración
- `pre_tool_use.py` — hook actual con battery check y bloqueo de comandos
- `secret_scanner.py` — scanner actual con patterns genéricos
- Múltiples HUBs con `next(p for p in ...parents if p.name == "01_Personal_Os")` sin default

### Institutional Learnings

- (none — este es el primer fix estructural del OS)

## Key Technical Decisions

- **Path Guardian como módulo separado**: No mezclar en `config_paths.py` para mantener separación de concerns. `config_paths.py` define rutas absolutas; `path_guardian.py` provee helpers de búsqueda segura.
- **Error Taxonomy como módulo separado**: `os_errors.py` con excepciones tipadas, importado por todos los HUBs.
- **Secret Scanner v2 como reemplazo directo**: Misma interfaz CLI, más patterns, más modos.
- **Shebang fix como batch**: Un solo script de reparación que parchea los 11 archivos.

## Implementation Units

- [ ] **Unit 1: Error Taxonomy (`os_errors.py`)**

**Goal:** Crear un módulo centralizado de excepciones tipadas para todo el OS.

**Requirements:** R2, R6

**Dependencies:** None

**Files:**
- Create: `05_Scripts/00_HUBs/03_Scripts_Os/os_errors.py`

**Approach:**
- Definir `OSPathError`, `OSConfigError`, `OSSyncError`, `OSSecurityError`, `OSStateError`
- Todas heredan de `Exception` con soporte para `message`, `path`, `hint`
- Incluir helper `safe_find(iterable, predicate, name="item")` que reemplaza el patrón `next()` con `raise OSPathError(...)`
- Incluir helper `ensure_path(path: Path, purpose: str)` que verifica existencia y raise `OSPathError`
- No depender de `config_paths.py` para no crear import circular

**Patterns to follow:**
- Estilo Python estándar (no frameworks)
- Logging con `logging.getLogger(__name__)` como el resto del OS

**Test scenarios:**
- `safe_find` encuentra el item correcto en lista normal
- `safe_find` raise `OSPathError` si no encuentra
- `ensure_path` pasa si el path existe
- `ensure_path` raise `OSPathError` si no existe, con hint claro
- Todas las excepciones tienen `__str__` legible

**Verification:**
- `python -c "from os_errors import *; raise OSPathError('test')"` funciona
- `safe_find([], lambda x: True)` raisea con mensaje descriptivo

---

- [ ] **Unit 2: Path Guardian (`path_guardian.py`)**

**Goal:** Crear módulo de resolución segura de paths que elimine el patrón `next()` sin default.

**Requirements:** R1

**Dependencies:** Unit 1 (usa `OSPathError` de `os_errors`)

**Files:**
- Create: `05_Scripts/00_HUBs/03_Scripts_Os/path_guardian.py`

**Approach:**
- `resolve_os_root(start_path: Path) -> Path`: busca `01_Personal_Os` ascendiendo, raise `OSPathError` si no encuentra. Reemplaza el `next(... for p in ...parents if p.name == "01_Personal_Os")` en todos los HUBs.
- `resolve_project_root(start_path: Path) -> Path`: busca `00_Winter_is_Coming` ascendiendo (duplicado de `find_project_root` en `config_paths.py`, pero standalone).
- `detect_copy_type(start_path: Path) -> Literal["A", "B"]`: reemplaza `detect_copy()` en `sync_copies.py`.
- Todas las funciones aceptan `start_path: Optional[Path] = None` que default a `Path(__file__).resolve().parent`.
- Incluir `__main__` con `--validate` para testeo manual.

**Patterns to follow:**
- `config_paths.find_project_root()` como referencia de lógica
- `sync_copies.detect_copy()` como referencia de marcadores

**Test scenarios:**
- `resolve_os_root()` desde un script en `05_Scripts/00_HUBs/` encuentra el OS correctamente
- `resolve_os_root()` desde un path fuera del OS raisea `OSPathError` con hint
- `resolve_project_root()` desde `05_Scripts/` encuentra `00_Winter_is_Coming`
- `detect_copy_type()` identifica correctamente Copy B vs Copy A

**Verification:**
- `python path_guardian.py --validate` muestra OK y exit 0
- Todos los HUBs pueden importar `from path_guardian import resolve_os_root`

---

- [ ] **Unit 3: Reemplazar `next()` pattern en todos los scripts**

**Goal:** Eliminar el patrón `next(p for p in ... if p.name == "01_Personal_Os")` en todos los HUBs y scripts del OS, reemplazándolo con `resolve_os_root()`.

**Requirements:** R1

**Dependencies:** Unit 2

**Files:**
- Modify: `05_Scripts/00_HUBs/03_Scripts_Os/00_Sound_Engine.py`
- Modify: `05_Scripts/00_HUBs/03_Scripts_Os/03_AIPM_Hub.py`
- Modify: `05_Scripts/00_HUBs/03_Scripts_Os/04_Ritual_Hub.py`
- Modify: `05_Scripts/00_HUBs/03_Scripts_Os/16_Agent_Mirror_Hub.py`
- Modify: `05_Scripts/00_HUBs/03_Scripts_Os/19_Agent_Sync_Hub.py`
- Modify: `05_Scripts/00_HUBs/03_Scripts_Os/post_hulk_compound.py` (el `_ext_root.parent.parent.parent`)
- Potentially más (buscar con grep: `next(.*01_Personal_Os`)

**Approach:**
- Buscar todos los archivos con `grep -rn "next(.*01_Personal_Os" --include="*.py"` sobre `05_Scripts/` y `00_Core/`
- También buscar `_ext_root.parent.parent.parent` y patrones similares
- En cada archivo: reemplazar con `from path_guardian import resolve_os_root; resolve_os_root(Path(__file__).resolve().parent)`
- Preservar la lógica existente (no cambiar comportamiento, solo el mecanismo de búsqueda)

**Patterns to follow:**
- Import consistente: `from path_guardian import resolve_os_root`
- Un solo `resolve_os_root()` por archivo, cacheado al import

**Test scenarios:**
- Cada script modificado funciona desde cualquier CWD (no solo desde su propio directorio)

**Verification:**
- `python -c "from path_guardian import resolve_os_root; print(resolve_os_root())"` desde cualquier directorio
- Cada HUB modificado responde a `--help` sin crashear

---

- [ ] **Unit 4: Reemplazar `assert` en producción**

**Goal:** Eliminar todos los `assert` en scripts de producción, reemplazándolos con `if not ...: raise OSError(...)`.

**Requirements:** R2

**Dependencies:** Unit 1

**Files:**
- Modify: `05_Scripts/00_HUBs/03_Scripts_Os/sync_copies.py` (línea 95: `assert personal_os is not None`)
- Modify: `05_Scripts/00_HUBs/03_Scripts_Os/config_paths.py` (línea 50: `if not ROOT_DIR... raise RuntimeError` — actualmente usa RuntimeError, verificar si hay asserts)
- Buscar más asserts con `grep -rn "^    assert" --include="*.py"` sobre `05_Scripts/` y `00_Core/02_Tools/`

**Approach:**
- `grep` full OS por `assert` en scripts .py
- Cada `assert cond, msg` → `if not cond: raise OSSyncError(f"...")` (o `OSPathError`, `OSConfigError` según contexto)
- Sync con Unit 1: usar las excepciones tipadas correctas

**Test scenarios:**
- sync_copies.py falla con `OSSyncError` si `personal_os` no se encuentra (en vez de AssertionError)
- Ningún test pasa con `python -O` (asserts desactivados) — no rompe nada porque ya no hay asserts

**Verification:**
- `grep -rn "^    assert" --include="*.py" 05_Scripts/` → 0 resultados

---

- [ ] **Unit 5: Fix shebang positioning**

**Goal:** Mover `#!/usr/bin/env python3` a línea 1 en todos los scripts que lo tienen después de imports/docstrings.

**Requirements:** R5

**Dependencies:** None

**Files:**
- Modify (identificar 11 scripts con shebang fuera de línea 1):
  - Scripts identificados: `00_Sound_Engine`, `19_Agent_Sync`, `16_Agent_Mirror`, `15_MCP_Sync`, `18_Telemetry`, `21`, `22`, `03_AIPM`, `04_Ritual`, `installer.py`, `sync_copies.py`
  - Confirmar con `grep -rln "^#!/usr/bin/env python3" --include="*.py" | xargs grep -l "#!/usr/bin/env python3" | xargs -I{} sh -c 'head -1 "{}" | grep -q "#!/usr/bin/env python3" || echo "{}"'`

**Approach:**
- `grep` todos los .py que tienen shebang pero no en línea 1
- Para cada uno: leer primeras 3 líneas, mover shebang a línea 1, preservando docstring y resto del orden
- Batch: script único `fix_shebangs.py` que hace la reparación o manual archivo por archivo

**Patterns to follow:**
- `#!/usr/bin/env python3` (no `#!/usr/bin/python3` ni `#!/usr/bin/env python`)

**Verification:**
- Script `tool/check_shebangs.py --verify` exit 0 (o grep manual)
- Cada script es ejecutable directamente: `./script.py --help` funciona

---

- [ ] **Unit 6: Eliminar `except: pass` silencioso**

**Goal:** Reemplazar todos los `except: pass` con logging explícito.

**Requirements:** R6

**Dependencies:** None

**Files:**
- Modify: `05_Scripts/00_HUBs/03_Scripts_Os/config_paths.py` (línea 115: `try: EVAL_RUNS_DIR.mkdir(...); except OSError: pass`)
- Modify: `01_Memory/00_Context_LLM/lazy_loader.py` (cache failures)
- Buscar más con `grep -rn "except.*:[\s]*pass" --include="*.py"` sobre `05_Scripts/`, `01_Memory/`, `00_Core/`

**Approach:**
- `grep` full OS por `except.*pass`
- Cada `except X: pass` → `except X: logger.warning(f"..." if 'logger' in locals() else f"[WARN] ...")`
- Mínimo: print `[WARN]` con contexto del error (`str(e)` incluido)
- Ideal: usar `logging.getLogger(__name__)` donde ya existe

**Verification:**
- `grep -rn "except.*pass" --include="*.py" 05_Scripts/ 01_Memory/ 00_Core/` → 0 resultados

---

- [ ] **Unit 7: Secret Scanner v2**

**Goal:** Actualizar `secret_scanner.py` para detectar los tokens reales usados en el OS, agregar modo `--full-scan` y modo `--fix` para reemplazar con `${VAR}` placeholders.

**Requirements:** R3

**Dependencies:** None (standalone)

**Files:**
- Modify: `00_Core/02_Tools/05_Hooks/01_Pre_Tool/secret_scanner.py`

**Approach:**
- Agregar patterns reales del OS:
  - `napi_[a-zA-Z0-9]{32,}` (Notion)
  - `lf_|[a-zA-Z0-9]{40,}` (Linear - depende del formato real)
  - `sb_[a-zA-Z0-9_\-]{30,}` (Supabase)
  - `sk-ant-[a-zA-Z0-9]{40,}` (Anthropic — ya existe pero verificar)
  - `ghp_[a-zA-Z0-9]{36}` (GitHub PAT — ya existe)
  - `xapp-[0-9]-[A-Z0-9-]+` (Slack app token)
  - `fir_[a-zA-Z0-9]{32,}` (Firecrawl)
  - `exa_[a-zA-Z0-9]{32,}` (Exa)
- Agregar `--full-scan`: escanea todo el repo respetando .gitignore, produce JSON report
- Agregar `--fix`: interactivo o automático, reemplaza matches con `${VAR_NAME}` placeholders. **Solo opera sobre `config.json`, `mcp.json`, `opencode.json`** (los archivos con API keys reales)
- Agregar `--diff`: muestra qué cambiaría sin aplicar
- Default behavior (staged files scan) no cambia

**Patterns to follow:**
- Estructura actual de `SECRET_PATTERNS`, `main()` con argparse
- Misma interfaz CLI: `python secret_scanner.py [--file|--all|--full-scan|--fix|--diff]`

**Test scenarios:**
- `--full-scan` sobre el OS detecta las keys en `config.json` y `mcp.json`
- `--diff` muestra los reemplazos sin modificar archivos
- staged scan sigue funcionando igual
- Patterns nuevos no dan falsos positivos con hashes de git o UUIDs

**Verification:**
- `python secret_scanner.py --full-scan --json > report.json` produce report
- `python secret_scanner.py --diff` no modifica archivos
- `python secret_scanner.py --fix` reemplaza keys con placeholders

---

- [ ] **Unit 8: Fix `adaptive_boot.py` path**

**Goal:** Corregir el path roto `AGENTS_CONFIG_DIR` que apunta a un directorio inexistente.

**Requirements:** R8

**Dependencies:** None

**Files:**
- Modify: `01_Memory/00_Context_LLM/adaptive_boot.py`

**Approach:**
- Línea 15: `AGENTS_CONFIG_DIR` actualmente apunta a `02_Knowledge/10_Shared_Org/agents`
- Cambiar a `01_Memory/00_Context_LLM/00_Context_Memory/` (que SÍ existe)
- O alternativamente: detectar automáticamente el directorio de agents real (`grep` de `AGENTS_DIR` desde `config_paths` sin import circular, o simplemente apuntar a `00_Core/02_Tools/01_Agents/` que es el canonical)
- Decisión final: apuntar a `AGENTS_DIR = ROOT_DIR / "01_Personal_Os" / "00_Core" / "02_Tools" / "01_Agents"` (el canonical)
- Mantener el fallback: si no existe, warning + `return {}`

**Verification:**
- `python adaptive_boot.py --agent admin --json` no muestra paths rotos (`[!!]`)

---

- [ ] **Unit 9: Hook Pipeline — wirear hooks inactivos**

**Goal:** Activar (o documentar como desactivados) los 4 hooks que existen pero no están en `settings.json`.

**Requirements:** R4

**Dependencies:** None (pero Unit 7 agrega secret scanner que también es hook)

**Files:**
- Read: `00_Core/02_Tools/05_Hooks/README.md` (para entender qué hooks están documentados como activos)
- Read/Modify: `00_Core/02_Tools/03_Mcp/settings.local.json` (hook configuration)

**Approach:**
- Identificar los 4 hooks inactivos mencionados en `05_Hooks/README.md`:
  - `03_Lifecycle/stop.py`
  - `03_Lifecycle/subagent_stop.py`
  - `05_Harness/context_monitor.py`
  - `05_Harness/eval_trigger.py`
  - `04_Sound/notification.py`
  - `06_Post_Hulk_Compound/post_hulk_compound.py`
- Leer cada uno: si está listo para producción → wirear en `settings.local.json`
- Si necesita trabajo → dejar y documentar con comentario en README.md.
- Si faltan env vars → agregar al `04_Sound/` requerimiento y wirear condicional

**Patterns to follow:**
- Formato de `settings.local.json` (ver ejemplo de hooks ya activos)
- `00_Core/02_Tools/03_Mcp/settings.local.json` como referencia

**Verification:**
- `settings.local.json` tiene entries para hooks listos
- `README.md` documenta estado de cada hook (ACTIVE / INACTIVE / NEEDS_SETUP)

---

- [ ] **Unit 10: Expandir `sync_copies.py`**

**Goal:** Sincronizar todos los archivos compartidos entre Copy A y B, no solo `config_paths.py`.

**Requirements:** R7

**Dependencies:** None

**Files:**
- Modify: `05_Scripts/00_HUBs/03_Scripts_Os/sync_copies.py`
- Read: `.gitignore` (para entender qué NO debe sincronizarse)

**Approach:**
- Expandir `FILE_PATHS` en `sync_copies.py` para incluir:
  - Hooks compartidos (los que tienen versión flat en Copy A)
  - Scripts del engine que también existen en Copy A
  - Archivos de configuración críticos
- Decidir qué archivos realmente necesitan dual-copy:
  - `config_paths.py` — ya existe
  - Hooks? Si existen en Copy A
  - `secret_scanner.py`? Si se ejecuta desde pre-commit hook
- Marcar cada entrada con comentario de propósito

**Verification:**
- `python sync_copies.py --dry-run` desde Copy B reporta estado actual
- `python sync_copies.py --apply` sincroniza sin errores
- `python sync_copies.py --dry-run` después del apply muestra "All files in sync"

---

- [ ] **Unit 11: `pre_tool_use.py` — migrar WMI y soporte multi-agent**

**Goal:** Actualizar battery check a PowerShell 7+ y soportar OpenCode/Codex.

**Requirements:** R4

**Dependencies:** None

**Files:**
- Modify: `00_Core/02_Tools/05_Hooks/01_Pre_Tool/pre_tool_use.py`

**Approach:**
- Reemplazar `Get-WmiObject` con `Get-CimInstance` (PowerShell 7+ compatible)
- Agregar soporte para `OPENCODE_TOOL_INPUT` además de `CLAUDE_TOOL_INPUT`
- También verificar `CODEX_TOOL_INPUT` si aplica
- Mantener compatibilidad hacia atrás (si falla `Get-CimInstance`, probar `Get-WmiObject` como fallback)

**Verification:**
- `python pre_tool_use.py` no crashea en Windows con PowerShell 7
- El bloqueo `rm -rf` funciona también con OpenCode

---

- [ ] **Unit 12: `00_Sound_Engine.py` — agregar fallback cross-platform**

**Goal:** Que el sound engine no crashee en WSL/Linux.

**Requirements:** R1

**Dependencies:** None

**Files:**
- Modify: `05_Scripts/00_HUBs/03_Scripts_Os/00_Sound_Engine.py`

**Approach:**
- Detectar plataforma: `sys.platform == "win32"`
- Si Windows: usar `winsound` (actual)
- Si Linux/WSL: usar `print('\a')` o `os.system('echo -e "\\a"')`
- Si macOS: usar `os.system('say "beep"')` o `print('\a')`
- Wrap en try/except para que cualquier fallo de sonido no bloquee el OS

**Verification:**
- `python 00_Sound_Engine.py` no crashea en ninguna plataforma

---

- [ ] **Unit 13: Consolidar workflows duplicados**

**Goal:** Eliminar ambigüedad entre `06_Youtube_Full_Video.md` y `99_Youtube_Full_Video.md`.

**Requirements:** (limpieza)

**Dependencies:** None

**Files:**
- Read ambos archivos
- Decidir cuál es el canonical (probablemente `06_Youtube_Full_Video.md` en `00_Workflows/`)
- Eliminar o renombrar el duplicado

**Approach:**
- Leer ambos, comparar contenido
- Si son idénticos: eliminar `99_` (es copia)
- Si diffieren: consolidar en `06_`, respaldar `99_` como `99_Youtube_Full_Video.md.legacy`
- Actualizar cualquier referencia al archivo eliminado

**Verification:**
- `find . -name "*Youtube_Full_Video*"` muestra solo 1 archivo

---

## System-Wide Impact

- **Interaction graph**: Todos los HUBs que importan `path_guardian.py` cambian su dependencia de path resolution
- **Error propagation**: `OSPathError` y derivados reemplazan `RuntimeError`, `AssertionError`, `StopIteration` — scripts que capturaban `RuntimeError` pueden no capturar `OSPathError` (revisar try/except existentes)
- **State lifecycle risks**: `sync_copies.py` con más archivos = más superficie de sync. El backup automático mitiga.
- **API surface parity**: `secret_scanner.py` CLI cambia (nuevos flags). El default (staged files scan) no cambia.
- **Integration coverage**: Verificar que `path_guardian.py` no cree import circular con `config_paths.py`

## Risks & Dependencies

- **Import circular**: `path_guardian.py` NO debe importar `config_paths.py` (ni viceversa). Son independientes.
- **sync_copies.py con más archivos**: Si Copy A tiene estructura diferente, algunos paths pueden no mapear 1:1. Validar con dry-run antes de apply.
- **Secret Scanner --fix es DESTRUCTIVO**: Siempre mostrar `--diff` primero, no permitir `--fix` sin confirmación explícita.

## Documentation / Operational Notes

- `path_guardian.py` debe documentarse en `00_Core/README.md` como nuevo módulo core
- `os_errors.py` se referencia desde la guía de contribución
- Después de aplicar Units 1-13, correr `python 17_Watchdog_Hub.py` para verificar integridad del sistema

## Sources & References

- **Origin document**: Auditoría OS 2026-07-07 (exploración in-session)
- **Related code**: `config_paths.py`, `sync_copies.py`, `secret_scanner.py`
- **External docs**: https://learn.microsoft.com/en-us/powershell/scripting/whats-new/differences-from-windows-powershell (WMI → CIM migration)
