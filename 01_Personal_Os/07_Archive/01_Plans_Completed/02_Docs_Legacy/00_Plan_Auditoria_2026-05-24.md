> ⚠️ DOCUMENTO HISTÓRICO — 2026-05-24
> Este documento es un registro histórico del sistema. Los conteos y métricas pueden estar desactualizados.
> Para el estado actual del sistema, ver Structure_v5.0.md o README.md.

---

# Plan de Acción — Auditoría Integral v4.7

> **Fecha:** 2026-05-24
> **Versión OS:** v4.7 Consequences
> **Origen:** Auditoría integral realizada por gentle-orchestrator
> **Estado:** 🟡 PLANEADO — Esperando aprobación

---

## 📋 Resumen Ejecutivo

Se detectaron **12 hallazgos** en la auditoría: 3 críticos (P0), 4 importantes (P1), 3 medios (P2), 2 menores (P3).

Este plan organiza la resolución en **5 fases** secuenciales, cada una con entregables claros y dependencias mínimas.

---

## 🗺️ Mapa de Fases

```
FASE 0 ──► FASE 1 ──► FASE 2 ──► FASE 3 ──► FASE 4
SEGURIDAD   CONFIG     DOCS       CLEANUP    POLISH
  P0         P1         P1          P2         P3
  
  │           │           │           │           │
  ▼           ▼           ▼           ▼           ▼
Rotar      Sincronizar  Unificar   Eliminar   Estandarizar
API keys   .agent/     conteos     duplicados  versión
+ .env     CLAUDE.md   skills/     +          docs
blindar    + fix       agentes     renombrar
           config_                 carpetas
           paths.py
```

---

## 🔴 FASE 0 — SEGURIDAD (P0)

> **Objetivo:** Eliminar exposición de API keys y blindar el repo contra futuros leaks.

### 0.1 Rotar todas las API keys expuestas

**Problema:** 14+ API keys en plain text en `.env`, committeadas al repo.

**Keys a rotar:**
| Key                             | Proveedor  | Riesgo                |
|--------------------------------|-----------|----------------------|
| `GITHUB_TOKEN`                  | GitHub     | 🛑 ACCESO TOTAL A REPOS|
| `OPEN_AI_API_KEY` (x2)          | OpenAI     | 🛑 USO DE CRÉDITOS     |
| `OPENAI_API_KEY` (duplicada)    | OpenAI     | 🛑 DUPLICADA Y DISTINTA|
| `GEMINI_API_KEY`                | Google     | ⚠️ Gemini API         |
| `NOTION_API_KEY`                | Notion     | ⚠️ Acceso a workspace |
| `LINEAR_API_KEY`                | Linear     | ⚠️ Issues privados    |
| `ANTHROPIC_API_KEY`             | Anthropic  | ⚠️ Si existe          |
| Las demás (Exa, Fireflies, etc.)| Varios     | ⚠️ Depende del scope  |

**Acciones:**
1. Identificar cada key y generar una nueva desde el panel del proveedor
2. Actualizar `.env` con las nuevas keys
3. **NO** pushear el cambio (`.env` debe estar en `.gitignore`)
4. Verificar que los MCPs funcionen con las nuevas keys

### 0.2 Bloquear `.env` en `.gitignore`

**Check actual:**
```bash
git check-ignore .env   # debe decir .env
git rm --cached .env    # sacar del tracking (sin borrar archivo local)
```

**Si no está en `.gitignore`:**
1. Agregar `.env` y `.env.*` al `.gitignore`
2. Hacer `git rm --cached .env`
3. Commit: `chore(security): gitignore .env and remove from tracking`

### 0.3 Purgar `.env` del historial (solo si ya se hizo push)

```bash
git filter-repo --path .env --invert-paths --force
```

⚠️ **Esto reescribe el historial.** Solo hacer si el repo ya fue pusheado a GitHub.

### 0.4 Verificar `secret_scanner.py` operativo

El hook ya existe en `01_Personal_Os/01_Core/02_Tools/05_Hooks/01_Pre_Tool/secret_scanner.py`. Verificar que:
- Esté activo en `.claude/settings.json`
- Detecte keys de OpenAI, GitHub, Anthropic en `.env` y archivos staged
- Bloquee commits que contengan keys

---

## 🟠 FASE 1 — CONFIGURACIÓN (P1)

> **Objetivo:** Sincronizar archivos de configuración desactualizados y corregir bugs de runtime.

### 1.1 Sincronizar `.agent/CLAUDE.md` a v4.7

**Problema:** `.agent/CLAUDE.md` dice v3.1, 11 áreas, 299 skills, 23 scripts. La realidad es v4.7, 12 áreas, 394 skills, 28+ HUBs.

**Acciones:**
1. Copiar estructura y métricas desde `CLAUDE.md` (raíz)
2. Actualizar: versión v4.7, 12 áreas funcionales, 394 skills, 46+ agentes, 36 MCPs
3. Corregir fecha a 2026-05-24
4. Mantener las secciones específicas de `.agent/` (hooks, GGA, etc.)

**Archivo:** `.agent/CLAUDE.md`

### 1.2 Sincronizar `.agent/README.md` a v4.7

**Problema:** Misma desactualización — dice v3.1, 11 áreas, 299 skills, 23 scripts.

**Acciones:**
1. Actualizar métricas: 12 áreas, 394 skills, 28+ HUBs
2. Fecha a 2026-05-24
3. Versión a v4.7

**Archivo:** `.agent/README.md`

### 1.3 Eliminar fallback `pattern_engine` de `config_paths.py`

**Problema:** Código muerto que intenta importar `pattern_engine.api` que no existe.

**Acción:** Eliminar bloque try/except de las líneas 330-351 en `03_Scripts_Os/config_paths.py`.

```python
# ANTES (líneas 328-351):
    # Fallback: búsqueda semántica via Pattern Intelligence Engine
    try:
        from pattern_engine.api import find_similar_scripts
        ...
    except ImportError:
        pass

# DESPUÉS:
    return None
```

**Archivo:** `01_Personal_Os/04_Operations/03_Scripts_Os/config_paths.py`

### 1.4 Limpiar `config_paths.py` duplicados

**Problema:** 5 copias de `config_paths.py`, 2 pueden causar conflictos de import.

**Acciones:**
1. Verificar `03_Scripts_Os/10_Legacy/config_paths.py` — si es idéntico al source, eliminarlo
2. Verificar `01_Core/02_Tools/07_Server/00_Env/config_paths.py` — actualizar o eliminar
3. Los de `05_Archive/` y `.backup/` dejarlos (son snapshots)

### 1.5 Sacar troubleshooting de "Claude Code no abre" de CLAUDE.md

**Problema:** Sección de error que probablemente ya está resuelto.

**Acción:** Mover a `05_Archive/` como referencia histórica o eliminar si está resuelto.

**Archivo:** `CLAUDE.md` (raíz), líneas 334-348 aproximadamente.

### 1.6 Actualizar `Requirements.txt`

**Problema:** Versiones pinneadas que pueden estar desactualizadas.

**Acción:** 
- `mcp>=1.26.0,<1.28.0` → `mcp>=1.26.0` (sacar el upper bound o actualizarlo)
- `anthropic>=0.84.0,<0.103.0` → idem
- Probar que los scripts sigan funcionando

---

## 🟡 FASE 2 — DOCUMENTACIÓN (P1)

> **Objetivo:** Unificar cifras y eliminar contradicciones entre documentos.

### 2.1 Auditar conteo real de skills

**Problema:** 3 cifras distintas: 393 (README), 394 (OS_DIRECTORY, CLAUDE), 504 (.agent backup).

**Acción:** Ejecutar conteo real:
```bash
find 01_Personal_Os/01_Core/02_Tools/02_Skills/ -name "SKILL.md" | wc -l
find .agent/02_Skills/ -name "SKILL.md" | wc -l
```

### 2.2 Auditar conteo real de agentes

**Problema:** Cifras de 46 a 82 según el documento.

**Acción:** Ejecutar conteo real:
```bash
find 01_Personal_Os/01_Core/02_Tools/01_Agents/ -name "*.md" | wc -l
```

### 2.3 Unificar cifras en TODOS los documentos

Una vez con las cifras reales, actualizar:

| Documento                      | Sección a corregir                 |
|-------------------------------|-----------------------------------|
| `README.md`                    | Skills, Agentes, HUBs              |
| `OS_DIRECTORY.md`              | Skills, Agentes                    |
| `00_Winter_is_Coming/AGENTS.md`| Skills, Agentes                    |
| `CLAUDE.md`                    | Skills, Agentes, Estado del Sistema|
| `Structure_v4.7.md`            | Skills, Agentes                    |
| `.agent/CLAUDE.md`             | TODO (ya está en Fase 1)           |
| `.agent/README.md`             | TODO (ya está en Fase 1)           |
| `.agent/SKILLS_INVENTORY.md`   | Skills count                       |

### 2.4 Actualizar `README.md` estructura de Playground

**Problema:** La estructura documentada de `02_Playground` en `README.md` no coincide con la real (faltan `00_Momentum/`, `01_Branders_Skills/` aparece mal).

**Acción:** Reflejar la estructura real.

---

## 🧹 FASE 3 — LIMPIEZA (P2)

> **Objetivo:** Eliminar archivos duplicados y renombrar carpetas mal numeradas.

### 3.1 Eliminar `08_OS_Runtime_Test.py` duplicado

**Problema:** `02_Playground/` tiene `07_OS_Runtime_Test.py` y `08_OS_Runtime_Test.py` que son esencialmente lo mismo.

**Acción:** 
1. Comparar ambos archivos
2. Si son idénticos o uno es versión del otro: eliminar el más viejo
3. Si tienen diferencias: mergear y mantener uno

### 3.2 Renombrar `02_Workflow_N8N/` → `04_Workflow_N8N/`

**Problema:** La carpeta está mal numerada y marcada como "locked" desde la auditoría anterior.

**Acción:**
```bash
mkdir "02_Playground/04_Workflow_N8N"
mv 02_Playground/02_Workflow_N8N/* "02_Playground/04_Workflow_N8N/"
rmdir 02_Playground/02_Workflow_N8N
```

**OJO:** Verificar que ningún workflow/script referencie la ruta vieja.

### 3.3 Sacar sección obsoleta de CLAUDE.md

**Problema:** "PROBLEMA DETECTADO: Claude Code no abre" — troubleshooting que ya no aplica.

**Acción:** Mover a `01_Personal_Os/05_Archive/` o eliminar si ya está resuelto.

---

 ## ✨ FASE 4 — POLISH (P3)

> **Objetivo:** Detalles menores de consistencia y calidad de vida.

### 4.1 Unificar versión en todos los documentos

| Documento              | Versión actual           | Versión target  |
|-----------------------|-------------------------|----------------|
| `.agent/CLAUDE.md`     | v3.1                     | v4.7            |
| `.agent/README.md`     | v3.1                     | v4.7            |
| `WORKSPACE.md` (.agent)| v2.0                     | v4.7 o archivar |
| `Structure_v4.7.md`    | v4.7                     | ✅ ya está       |
| `OS_DIRECTORY.md`      | v4.7                     | ✅ ya está       |
| `README.md`            | v4.5 (badge) v4.7 (texto)| v4.7 consistente|

### 4.2 Verificar que `00_Personal_Os_Stack` y `00_Skill_Auditor` estén documentados

Estas 2 áreas existen en disco pero revisar que aparezcan en todas las tablas de áreas funcionales.

### 4.3 Correr `19_Agent_Sync_Hub.py` 

Verificar que `.agent/` esté realmente sincronizado con `01_Core/`:
```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/19_Agent_Sync_Hub.py
```

---

## 📊 DEPENDENCIAS ENTRE FASES

```
FASE 0 ──► FASE 1 ──► FASE 2 ──► FASE 3 ──► FASE 4
  P0         P1         P1          P2         P3
  │           │
  │           ├── 1.3 (config_paths) ← depende de entender el archivo
  │           ├── 1.1 (agent/CLAUDE.md) ← depende de 2.1, 2.2 (cifras reales)
  │           └── 1.6 (Requirements.txt) ← independiente
  │
  FASE 2 ──► docs unificados ──► FASE 3 ──► FASE 4
```

**Nota:** Fase 1.1 (sincronizar `.agent/CLAUDE.md`) depende de Fase 2.1 y 2.2 (cifras reales). Hacer Fase 2 primero o dejar 1.1 para después de 2.

---

## ⏱️ ESTIMACIÓN DE ESFUERZO

| Fase      | Ítems  | Tiempo estimado  | Dependencias              |
|----------|-------|-----------------|--------------------------|
| **FASE 0**| 4      | ~30 min          | Ninguna                   |
| **FASE 1**| 6      | ~40 min          | Fase 0 (seguridad primero)|
| **FASE 2**| 4      | ~25 min          | Fase 1.1, 1.2             |
| **FASE 3**| 3      | ~15 min          | Fase 2 (cifras para docs) |
| **FASE 4**| 3      | ~15 min          | Fase 3                    |
| **TOTAL** | **20** | **~2 horas**     |                           |

---

## ✅ CHECKLIST DE APROBACIÓN

Antes de ejecutar cada fase:

- [ ] **FASE 0:** ¿Estás listo para rotar las API keys?
- [ ] **FASE 1:** ¿Aprobás sincronizar `.agent/CLAUDE.md` con v4.7?
- [ ] **FASE 2:** ¿Querés que audite las cifras reales primero?
- [ ] **FASE 3:** ¿Eliminamos duplicados y renombramos?
- [ ] **FASE 4:** ¿Unificamos versión y detalles finales?

---

## 📁 ARCHIVOS A MODIFICAR (por fase)

### FASE 0
- `.env` — rotar keys
- `.gitignore` — agregar `.env`

### FASE 1
- `.agent/CLAUDE.md` — sincronizar a v4.7
- `.agent/README.md` — sincronizar a v4.7
- `01_Personal_Os/04_Operations/03_Scripts_Os/config_paths.py` — eliminar pattern_engine
- `01_Personal_Os/04_Operations/03_Scripts_Os/10_Legacy/config_paths.py` — eliminar
- `01_Personal_Os/01_Core/02_Tools/07_Server/00_Env/config_paths.py` — sync o eliminar
- `CLAUDE.md` (raíz) — sacar troubleshooting obsoleto
- `01_Personal_Os/01_Core/Requirements.txt` — actualizar versión bounds

### FASE 2
- `01_Personal_Os/01_Core/02_Tools/02_Skills/` — auditar skills reales
- `01_Personal_Os/01_Core/02_Tools/01_Agents/` — auditar agentes reales
- `README.md` — cifras y estructura Playground
- `OS_DIRECTORY.md` — cifras
- `00_Winter_is_Coming/AGENTS.md` — cifras
- `CLAUDE.md` (raíz) — cifras
- `Structure_v4.7.md` — cifras

### FASE 3
- `02_Playground/08_OS_Runtime_Test.py` — eliminar
- `02_Playground/02_Workflow_N8N/` — renombrar a 04_

### FASE 4
- `01_Personal_Os/01_Core/02_Tools/02_Skills/` — verificar documentación de áreas
- Ejecutar `19_Agent_Sync_Hub.py`

---

*Plan generado: 2026-05-24 | gentle-orchestrator | Think Different PersonalOS v4.7*
