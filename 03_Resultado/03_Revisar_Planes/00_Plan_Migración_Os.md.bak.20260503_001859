# 📋 Plan de Migración PersonalOS → Consequences v2.0

> **Fecha:** 2026-04-24
> **Estado:** 🚀 EN EJECUCIÓN
> **Versión destino:** v2.0 — Estructura Consequences
> **Tiempo estimado total:** ~105 min

---

## 🎯 Objetivo

Reorganizar `Think_Different/` de 9 carpetas raíz a 4 carpetas con propósito claro, siguiendo el blueprint de `Desktop/00_Consequences/`. Sin pérdida de información — solo reorganización y fixes de bugs.

**Principio arquitectónico:**
- `00_Winter_is_Coming/` → Reglas de Oro (inmutable, estratégico)
- `01_Personal_Os/` → El Sistema Operativo (todo el motor)
- `02_Playground/` → Zona de pruebas (no contamina el OS)
- `03_Resultado/` → Outputs de proyectos (zona de entrega)

---

## 🗺️ Mapa de Migración

### Raíz

| Actual                   | Destino                                          | Tipo                        |
|--------------------------|--------------------------------------------------|-----------------------------|
| `00_Winter_is_Coming/`   | `00_Winter_is_Coming/`                           | Sin cambio                  |
| `01_Core/`               | `01_Personal_Os/01_Core/`                        | Mover dentro de OS          |
| `02_Knowledge/`          | `01_Personal_Os/02_Knowledge/`                   | Mover dentro de OS          |
| `03_Tasks/`              | `01_Personal_Os/03_Task/`                        | Mover + rename (singular)   |
| `04_Operations/`         | `01_Personal_Os/04_Operations/00_Context_LLM/`   | Mover + restructurar        |
| `05_Archive/`            | `01_Personal_Os/05_Archive/`                     | Mover dentro de OS          |
| `06_Playground/`         | `02_Playground/`                                 | Mover a raíz                |
| `07_Projects/`           | `01_Personal_Os/04_Operations/05_Projects/`      | Mover a Operations          |
| `03_Scripts_Os/`         | `01_Personal_Os/04_Operations/03_Scripts_Os/`    | Mover a Operations          |
| `Now/`                   | `03_Resultado/`                                  | Renombrar                   |

### `01_Core/` → `01_Personal_Os/01_Core/`

| Actual                       | Destino                                              |
|------------------------------|------------------------------------------------------|
| `01_Core/00_Workflows/`      | `01_Personal_Os/01_Core/00_Workflows_Os/`            |
| `01_Core/01_Rules/`          | `01_Personal_Os/01_Core/01_Rules/`                   |
| `01_Core/02_Evals/`          | `01_Personal_Os/01_Core/02_Tools/08_Evals/`          |
| `01_Core/03_Skills/`         | `01_Personal_Os/01_Core/02_Tools/02_Skills/`         |
| `01_Core/04_Agents/`         | `01_Personal_Os/01_Core/02_Tools/01_Agents/`         |
| `01_Core/05_Mcp/`            | `01_Personal_Os/01_Core/02_Tools/03_Mcp/`            |
| `01_Core/06_Integrations/`   | `01_Personal_Os/01_Core/02_Tools/04_Integrations/`   |
| `01_Core/07_Hooks/`          | `01_Personal_Os/01_Core/02_Tools/05_Hooks/`          |
| `01_Core/08_Plugins/`        | `01_Personal_Os/01_Core/02_Tools/06_Plugins/`        |
| `01_Core/09_Server/`         | `01_Personal_Os/01_Core/02_Tools/07_Server/`         |
| `01_Core/10_Templates/`      | `01_Personal_Os/01_Core/02_Tools/09_Templates/`      |

### `04_Operations/` → `01_Personal_Os/04_Operations/00_Context_LLM/`

| Actual                                 | Destino                                              |
|----------------------------------------|------------------------------------------------------|
| `04_Operations/00_Context_Memory/`     | `04_Operations/00_Context_LLM/00_Context_Memory/`    |
| `04_Operations/02_Knowledge_Brain/`    | `04_Operations/00_Context_LLM/02_Knowledge_Brain/`   |
| `04_Operations/03_Process_Notes/`      | `04_Operations/00_Context_LLM/01_Process_Notes/`     |
| `04_Operations/04_Memory_Brain/`       | `04_Operations/00_Context_LLM/02_Memory_Brain/`      |
| `04_Operations/05_Plans/`              | `04_Operations/00_Context_LLM/05_Plans/`             |
| `04_Operations/06_Solutions/`          | `04_Operations/00_Context_LLM/06_Solutions/`         |
| `04_Operations/08_Auditorias/`         | `04_Operations/00_Context_LLM/08_Auditorias/`        |
| `04_Operations/09_Agent_Teams_Lite/`   | `04_Operations/02_Agent_Teams_Lite/`                 |
| `04_Operations/11_Reports/`            | `04_Operations/00_Context_LLM/11_Reports/`           |
| `04_Operations/01_Auto_Improvement/`   | `04_Operations/01_Auto_Improvement/` (igual)         |

---

## 🏗️ Estructura Destino Final

```
PersonalOS/
│
├── 00_Winter_is_Coming/          ← REGLAS DE ORO (inmutable)
│   ├── AGENTS.md
│   ├── GOALS.md
│   ├── BACKLOG.md
│   ├── CHANGELOG.md
│   └── README.md
│
├── 01_Personal_Os/               ← EL SISTEMA OPERATIVO
│   ├── 01_Core/
│   │   ├── 00_Workflows_Os/      ← Workflows (renombrado con _Os)
│   │   ├── 01_Rules/             ← 10 reglas (.mdc)
│   │   └── 02_Tools/             ← Todas las herramientas
│   │       ├── 01_Agents/
│   │       ├── 02_Skills/        ← 9 áreas funcionales (limpias)
│   │       ├── 03_Mcp/
│   │       ├── 04_Integrations/
│   │       ├── 05_Hooks/
│   │       ├── 06_Plugins/
│   │       ├── 07_Server/
│   │       ├── 08_Evals/
│   │       └── 09_Templates/
│   │
│   ├── 02_Knowledge/
│   ├── 03_Task/                  ← (singular, antes 03_Tasks)
│   ├── 04_Operations/
│   │   ├── 00_Context_LLM/       ← Memoria LLM
│   │   ├── 01_Auto_Improvement/
│   │   ├── 02_Agent_Teams_Lite/
│   │   ├── 03_Scripts_Os/        ← 14 HUBs (antes 03_Scripts_Os/)
│   │   ├── 04_Installer/
│   │   └── 05_Projects/          ← (antes 07_Projects/)
│   └── 05_Archive/
│
├── 02_Playground/                ← ZONA DE PRUEBAS
│   └── 00_Momentum/
│
├── 03_Resultado/                 ← OUTPUTS
│
├── .agent/ | .atl/ | .claude/ | .mcp.json
├── AGENTS.md | CLAUDE.md | README.md
└── 00_Plan_Migración_Os.md      ← Este archivo
```

---

## ✅ Fases de Ejecución

| Fase         | Descripción                                         | Estado                | Tiempo     |
|--------------|-----------------------------------------------------|-----------------------|------------|
| **FASE 0**   | Git snapshot pre-migración                          | ✅ Listo (`2474f94`)   | 5 min      |
| **FASE 1**   | Fix Skills: rename UPPERCASE + absorber huérfanas   | 🔄 En curso            | 15 min     |
| **FASE 2**   | Crear estructura destino (mkdir)                    | ⏳ Pendiente           | 10 min     |
| **FASE 3**   | Mover contenido (git mv)                            | ⏳ Pendiente           | 30 min     |
| **FASE 4**   | Actualizar config_paths.py                          | ⏳ Pendiente           | 10 min     |
| **FASE 5**   | Actualizar documentación                            | ⏳ Pendiente           | 15 min     |
| **FASE 6**   | Fix scripts auditores                               | ⏳ Pendiente           | 10 min     |
| **FASE 7**   | Verificación final                                  | ⏳ Pendiente           | 10 min     |

---

## 🔧 Skills: Fix Durante Migración

### Rename UPPERCASE → Proper_Case

| Actual                      | Destino                     |
|-----------------------------|-----------------------------|
| `01_CREACION_Contenidos/`   | `01_Creacion_Contenidos/`   |
| `02_DISENO_UI_UX/`          | `02_Diseno_Ui_Ux/`          |
| `03_VIDEO_MEDIA/`           | `03_Video_Media/`           |
| `04_AUTOMATIZACION/`        | `04_Automatizacion/`        |
| `05_WORKFLOWS/`             | `05_Workflows/`             |
| `06_TOOLS/`                 | `06_Tools/`                 |
| `07_PERSONAL_OS/`           | `07_Personal_Os/`           |
| `08_INVICTUS_WEB/`          | `08_Invictus_Web/`          |

### Absorber Huérfanas en 9 Áreas

| Carpeta huérfana                    | Destino en área             |
|-------------------------------------|-----------------------------|
| `20_James_Cameron/`                 | `03_Video_Media/`           |
| `28_Carousel_Master/`               | `01_Creacion_Contenidos/`   |
| `17_SEO_SOTA_Master/`               | `01_Creacion_Contenidos/`   |
| `11_Doc_Processing/`                | `06_Tools/`                 |
| `13_System_Master/`                 | `06_Tools/`                 |
| `16_Silicon_Valley_Data_Analyst/`   | `06_Tools/`                 |
| `27_Qmd/`                           | `06_Tools/`                 |
| `00_Gcierr/`                        | `00_Personal_Os_Stack/`     |

---

## 🐛 Bugs Pendientes a Corregir (FASE 6)

### `80_Edge_Case_Validator.py` — doble path nesting
```python
# BUG (línea 33)
SCRIPTS_DIR = ENGINE_DIR / "03_Scripts_Os"  # ENGINE_DIR YA ES 03_Scripts_Os

# FIX
SCRIPTS_DIR = ENGINE_DIR
```

### `15_SOTA_Integrity_Check.py` — paths de SKILL.md post-migración
- Actualizar referencia de directorio base al nuevo `02_Tools/02_Skills/`

### `33_Parallel_Audit_Pro.py` — `14_Otros` path
- Ahora válido en `03_Scripts_Os/14_Otros/` — verificar y confirmar.

---

## 📊 Datos del Sistema (Verificados)

| Componente              | Valor                                                 |
|-------------------------|-------------------------------------------------------|
| MCPs activos            | 33                                                    |
| Rules (fuente verdad)   | 10 .mdc en `01_Core/01_Rules/`                        |
| HUBs                    | 14 (→ `04_Operations/03_Scripts_Os/`)                 |
| Skills                  | 165+ en 9 áreas funcionales                           |
| `.mcp.json`             | ✅ JSON válido                                         |
| `config_paths.py`       | ✅ Auto-detección por `01_Core` (survives migration)   |

---

_PersonalOS v2.0 Migration Plan — 2026-04-24_
