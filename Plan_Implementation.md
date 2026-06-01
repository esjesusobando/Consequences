# Plan de Implementación: SSOT Unification v4.9+

> **Generado:** 2026-06-01
> **SDD Cycle:** `ssot-unification-v4.9`
> **Filosofía:** Single Source of Truth — el manifest es la fuente, los docs referencian, nada se elimina.

---

## Resumen

Unificar las métricas del sistema PersonalOS (agentes, skills, HUBs, scripts, workflows, hooks) bajo una sola fuente de verdad: el JARVIS Manifest (`01_OS_Inventory.json`). Los 4 docs maestros y ~55 archivos satélite pasan de hardcodear números a referenciar el manifest.

**Problema:** Un mismo concepto tiene 4 números distintos según el archivo. Cada auditoría requiere corregir manualmente 15+ archivos.

**Solución:** Pirámide SSOT de 3 capas — Manifest → OS_DIRECTORY.md → CLAUDE.md/AGENTS.md/README.md.

---

## FASE 1 — System_Mapper_Hub.py

**Archivo:** `01_Personal_Os/04_Operations/03_Scripts_Os/20_System_Mapper_Hub.py`

### 1.1 scan_agents() — Categorización por subdirectorio

Agregar detección de categoría de agente basada en subdirectorio:

```python
AGENT_CATEGORIES = {
    "01_Dream_Team": "dream_team",
    "02_Specialists_Compound": "specialists",
    "03_Growth_Agents": "growth",
    "04_Individual_Agents": "individual",
}
```

Nuevo output en `scan_agents()`:

```json
"by_category": {
  "root": 25,
  "dream_team": 5,
  "specialists": 23,
  "growth": 5,
  "individual": 24
}
```

**Criterio:** Root = archivos `.md` directo en `01_Agents/` (sin subdirectorio). Categorizados = en subdirectorios.

### 1.2 scan_hubs() — Detección de interfaz HUB

Agregar función `_detect_hub_interface()`:

```python
def _detect_hub_interface(path: Path) -> dict:
    content = path.read_text(encoding="utf-8", errors="ignore")
    return {
        "has_run": "def run(" in content,
        "has_help": any(x in content for x in ["--help", "add_argument", "argparse"]),
        "is_numerado": path.stem[:2].isdigit(),
    }
```

Nuevo output:

```json
"totals": {
  "hubs_numerados": 33,
  "hubs_con_interfaz": 22,
  "scripts_totales": 258,
  "scripts_no_hub": 236
}
```

### 1.3 scan_inventory() — Schema enriquecido

Agregar al JSON de inventario:

```json
{
  "agents": {
    "definition": "archivos .md en 01_Agents/ (excluye README, templates)",
    "source_count": 62,
    "atl_subagents": 20,
    "total_operational": 82,
    "by_category": { ... }
  },
  "hubs": {
    "definition_hub": "scripts con interfaz run() + --help",
    "hubs_numerados": 33,
    "hubs_con_interfaz": 22,
    "scripts_totales": 258,
    "scripts_no_hub": 236
  },
  "skills_totals": {
    "total": 392,
    "areas": 15,
    "per_area": { "00_Agent_Teams_Lite": 63, ... }
  },
  "doc_sources": {
    "os_directory": "OS_DIRECTORY.md",
    "claude_md": "CLAUDE.md",
    "agents_md": "00_Winter_is_Coming/AGENTS.md",
    "readme_md": "README.md"
  }
}
```

### 1.4 validate() — Drift detection contra docs

Agregar `_check_doc_drift(inventory)`:

```python
DOC_PATTERNS = [
    ("OS_DIRECTORY.md", r"Skills\s*\|\|\s*(\d+)", "skills"),
    ("CLAUDE.md", r"(\d+)\s+skills", "skills"),
    # ...
]
```

Output: tabla de salud comparando manifest vs cada doc.

### 1.5 README generation — Health dashboard

Agregar tabla al README.md generado en `00_Manifest/`:

```markdown
## 📋 Health Dashboard — SSOT vs Docs

| Componente | Manifest | OS_DIRECTORY.md | CLAUDE.md | AGENTS.md | README.md |
|------------|----------|-----------------|-----------|-----------|-----------|
| Skills     | 392      | 392 ✅          | 392 ✅    | 392 ✅    | 392 ✅    |
```

---

## FASE 2 — Docs Migration

### 2.1 OS_DIRECTORY.md

| Línea | Cambio |
|-------|--------|
| 14 | `392 skills (14 áreas)` → `392 skills (15 áreas funcionales)` |
| 16 | `22 HUBs + 256 scripts` → `22 HUBs con interfaz / 33 numerados / 258 scripts total` |
| 25 (auditoría) | Counts sincronizados con manifest |
| 153-169 | Skills table: renombrar áreas a source naming, total 392, 15 áreas |
| 194 | `62 source / 82 total` → `62 source + 20 ATL = 82 operational (Source: manifest)` |

### 2.2 CLAUDE.md

- **Líneas 164-270:** Reemplazar árbol estructural por:
  ```markdown
  > 🗺️ **Tree estructural:** [`OS_DIRECTORY.md`](OS_DIRECTORY.md#-estructura-completa-v49)
  > **Counts:** `01_OS_Inventory.json` (via `20_System_Mapper_Hub.py --scan`)
  ```
- **Líneas 247-252:** Tabla de counts → referencias con nota "Source: manifest"
- **Conservar:** Diagrama de Super Campeones (no es árbol estructural)

### 2.3 AGENTS.md

- **Línea 39-51:** Mapa de recursos → counts con "Source: manifest"
- **Línea 169-170:** Tree → link a `OS_DIRECTORY.md`
- **Conservar:** Diagrama de Agent Teams Protocol

### 2.4 README.md

| Métrica | Antes | Después |
|---------|-------|---------|
| Agentes | 55 | 82 |
| Skills | 385 | 392 |
| HUBs | 20 | 22 |
| Scripts | 256 | 258 |

### 2.5 Core READMEs (5 archivos)

| Archivo | Cambio |
|---------|--------|
| `01_Personal_Os/01_Core/README.md` | 55 → 82 |
| `01_Personal_Os/01_Core/01_Inventario_Core.md` | 55 → 82 |
| `01_Personal_Os/01_Core/02_Tools/README.md` | 55 → 82 |
| `01_Personal_Os/04_Operations/README.md` | 55 → 82 |
| `00_Winter_is_Coming/README.md` | 55 → 82 |

### 2.6 Rules .mdc (2 archivos)

| Archivo | Cambio |
|---------|--------|
| `01_Personal_Os/01_Core/01_Rules/12_Audit_OS_Integrity.mdc` | 386 → 392 |
| `.claude/02_Rules/12_Audit_OS_Integrity.mdc` | 385 → 392 |

---

## FASE 3 — Backup Sync

### 3.1 Agent_Sync_Hub.py — Skills sync

Agregar:
- Flag `--skills` para sync de `.agent/02_Skills/`
- Trash retention: `.trash/YYYY-MM-DD/` con 30 días de retención
- Purge automático de trash viejo
- Detección de renombrado de áreas (log WARNING en vez de delete)

### 3.2 Area renaming map

| Backup (viejo) | Source (nuevo) | Acción |
|----------------|----------------|--------|
| `05_Workflows` | `00_Workflows` | trash + copy |
| `07_Personal_Os` | `00_Personal_Os` | trash + copy |
| `08_Invictus_Web` | `07_Invictus_Web` | trash + copy |
| `09_Claude_Ads` | `05_Claude_Ads` | trash + copy |
| `10_Skill_Auditor` | `00_Skill_Auditor` | trash + copy |
| — | `08_JAO` | crear nueva |
| — | `10_Laia_Learning` | crear nueva |

### 3.3 Procedimiento

```bash
# 1. Dry-run
python 19_Agent_Sync_Hub.py --skills

# 2. Verificar diff
# 3. Apply
python 19_Agent_Sync_Hub.py --skills --apply

# 4. Verificar post-sync
python 19_Agent_Sync_Hub.py --skills
```

---

## FASE 4 — Validación

### 4.1 Regenerar manifests

```bash
python 20_System_Mapper_Hub.py --scan
```

### 4.2 Validar drift

```bash
python 20_System_Mapper_Hub.py --validate
```

Esperado: 0 errores, health dashboard todo ✅

### 4.3 Verificación manual

- [ ] OS_DIRECTORY.md skills table con 15 áreas, naming source, total 392
- [ ] CLAUDE.md sin árbol duplicado, counts referencian manifest
- [ ] AGENTS.md sin árbol duplicado, resource map con referencias
- [ ] README.md con 82/392/22/258/28/10
- [ ] Core READMEs con 82
- [ ] Rules .mdc con 392
- [ ] `.agent/02_Skills/` con 15 áreas mirror

### 4.4 Engram save

```bash
# Guardar decisión arquitectónica
```

---

## Resumen de tareas

| Fase | Tareas | Archivos tocados | Líneas estimadas |
|------|--------|------------------|------------------|
| 1 — System_Mapper | 5 | 1 | ~40 nuevas |
| 2 — Docs | 6 | ~11 | ~80 modificadas |
| 3 — Backup | 3 | 1 + directorio | ~60 nuevas |
| 4 — Validación | 4 | 0 (solo comandos) | — |
| **Total** | **18** | **~13** | **~180** |

---

## Rollback Plan

```bash
# Revertir cambios de código
git checkout HEAD -- 01_Personal_Os/04_Operations/03_Scripts_Os/20_System_Mapper_Hub.py
git checkout HEAD -- 01_Personal_Os/04_Operations/03_Scripts_Os/19_Agent_Sync_Hub.py

# Revertir cambios de docs
git checkout HEAD -- OS_DIRECTORY.md CLAUDE.md README.md
git checkout HEAD -- 00_Winter_is_Coming/AGENTS.md
git checkout HEAD -- 00_Winter_is_Coming/GOALS.md

# Revertir manifests
git checkout HEAD -- 01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/

# Revertir backup
git checkout HEAD -- .agent/02_Skills/

# Regenerar manifests con versión anterior
python 20_System_Mapper_Hub.py --scan
```

---

## Success Criteria

- [ ] `20_System_Mapper_Hub.py --validate` reporta 0 divergencias
- [ ] Health dashboard en `00_Manifest/README.md` muestra todo ✅
- [ ] CLAUDE.md no contiene árbol duplicado de 80+ líneas
- [ ] AGENTS.md no contiene árbol duplicado
- [ ] Skills table en OS_DIRECTORY.md tiene 15 áreas con naming source
- [ ] `.agent/02_Skills/` es mirror de source (15 áreas)
- [ ] Backup tiene `.trash/` con retention funcional
- [ ] Engram guardado con decisión arquitectónica
