# Scripts Index — PersonalOS Think Different v4.0 Consequences

> **Total Scripts:** 98+ (HUBs + módulos + utilities)
> **Total HUBs:** 23 (v4.0 + JARVIS 3.1)
> **Last Updated:** 2026-05-27
> **Validation:** Production Ready — Sistema PURE GREEN v4.0 Consequences
> **Migration:** 12 scripts moved to skills using get_skill_script()
> **New:** 12_Auditors_Os folder + HUBs 14-23 (JARVIS 3.1)

---

## 📊 Estado del Sistema (Post-Migration 2026-04-20)

| Auditoría                                      | Estado                              | Notas                                                                             |
|-----------------------------------------------|------------------------------------|----------------------------------------------------------------------------------|
| **Estructura**                                 | ✅ PASS                              | 10 carpetas (00-13) válidas                                                       |
| **Health**                                     | ✅ PASS                              | SALUDABLE                                                                         |
| **Skills**                                     | ✅ FIXED                             | 22 categorías — 100% con SKILL.md                                                 |
| **12_Auditors_Os**                             | ✅ ACTIVE                            | Utilities + Beautify scripts                                                      |
| **Hub 07 rutas**                               | ✅ FIXED                             | `09_Integration/` (antes `Integration_Fixed`)                                     |
| **Hub 08 rutas**                               | ✅ FIXED                             | `04_Workflow/` (antes `Workflow_Fixed`)                                           |
| **PYTHONPATH**                                 | ✅ FIXED                             | Todos los hubs pasan PYTHONPATH a sub-scripts                                     |
| **Scripts legacy**                             | ✅ MOVED                             | 9 scripts migrados de 13_Legacy a módulos                                         |
| **Hooks Windows**                              | ✅ FIXED                             | WinError 5 + emoji encoding resueltos                                             |
| **Script Migration**                           | ✅ DONE                              | 12 scripts → skills using get_skill_script()                                      |
| **13_Legacy**                                  | ✅ ARCHIVED                          | `13_Legacy/`                                                                      |
| **HUBs 14-18**                                 | ✅ JARVIS 3.0                        | Health Metrics, MCP Sync, Agent Mirror/Mapper, Watchdog, Telemetry                |

---

## 🏗️ Standalone HUBs & Scripts (01_Personal_Os/04_Operations/03_Scripts_Os/)

> **Total:** 27 scripts standalone + 4 subdirectorios con scripts internos. Ver detalle completo en `HUB_CATALOG.md`

| #   | Script                    | Purpose                                           | Status           |
|-----|--------------------------|---------------------------------------------------|-----------------|
| 00  | `Sound_Engine.py`         | Motor de notificaciones sonoras                   | ✅ ACTIVO         |
| 01  | `Auditor_Hub.py`          | Orquestador de Auditorías                         | ✅ ACTIVO         |
| 02  | `Git_Hub.py`              | Orquestador de Git/Repos                          | ✅ ACTIVO         |
| 03  | `AIPM_Hub.py`             | Hub centralizador de AIPM                         | ✅ ACTIVO         |
| 04  | `Ritual_Hub.py`           | Hub centralizador de Rituales y Standups          | ✅ ACTIVO         |
| 05  | `Validator_Hub.py`        | Hub centralizador de Validaciones                 | ✅ ACTIVO         |
| 06  | `Tool_Hub.py`             | Tool Integration & Management Hub                 | ✅ ACTIVO         |
| 07  | `Integration_Hub.py`      | MCP & External Integrations Hub                   | ✅ ACTIVO         |
| 08  | `Workflow_Hub.py`         | Workflow Automation Hub                           | ✅ ACTIVO         |
| 09  | `Data_Hub.py`             | Data Processing & Analytics Hub                   | ✅ ACTIVO         |
| 10  | `General_Hub.py`          | General Utilities Hub                             | ✅ ACTIVO         |
| 11  | `Auto_Learn_Hub.py`       | Motor de automejora                               | ✅ ACTIVO         |
| 14  | `Health_Metrics_Hub.py`   | Métricas de salud del sistema (JARVIS)            | ✅ ACTIVO         |
| 15  | `MCP_Sync_Hub.py`         | Sync + drift report MCPs (JARVIS)                 | ✅ ACTIVO         |
| 16  | `Agent_Mirror_Hub.py`     | Mirror agentes source → backup                    | ✅ ACTIVO         |
| 17  | `Watchdog_Hub.py`         | Self-Healing Watchdog (JARVIS)                   | ✅ ACTIVO         |
| 18  | `Telemetry_Hub.py`        | Telemetry Dashboard (JARVIS)                     | ✅ ACTIVO         |
| 19  | `Agent_Sync_Hub.py`       | Sincronización de agentes                         | ✅ ACTIVO         |
| 20  | `System_Mapper_Hub.py`    | System Mapper — regenera manifest                | ✅ ACTIVO         |
| 21  | `Legacy_Path_Cleanup.py`  | Legacy Path Cleanup Scanner                      | ✅ ACTIVO         |
| 22  | `Validate_Skill_Frontmatter.py` | Skill Frontmatter Validator                 | ✅ ACTIVO         |
| 25  | `Minimax_Optimizer_Hub.py`| Gestión de Integración MiniMax                   | ✅ ACTIVO         |
| 26  | `Parallel_Audit_Pro.py`   | Auditoría paralela                               | ✅ ACTIVO         |
| 27  | `Skill_Auditor.py`        | Skill Auditor                                    | ✅ ACTIVO         |
| 28  | `System_Health_Monitor.py`| Health monitor del sistema                       | ✅ ACTIVO         |
| 29  | `Repo_Sync_Auditor.py`    | Repo sync auditor                                | ✅ ACTIVO         |
| 30  | `path_replacement.py`     | PATH Replacement Script — OS v4.8                | ✅ ACTIVO         |

> Nota: los # 12-13 fueron reasignados a directorios internos. `Context_Usage_Bar.py` y `Beautify_Tables.py` están en `12_Auditors_Os/scripts/`.

### Usage

```bash
# Desde cualquier ubicación (aliases en .bashrc)
gr              # Auditor_Hub.py - Dry run
audit           # Auditor_Hub.py
git-hub         # Git_Hub.py
aipm            # AIPM_Hub.py
ritual          # Ritual_Hub.py
validate        # Validator_Hub.py

# O directamente
cd Think_Different
python 01_Personal_Os/04_Operations/03_Scripts_Os/01_Auditor_Hub.py estructura
python 01_Personal_Os/04_Operations/03_Scripts_Os/01_Auditor_Hub.py skills
python 01_Personal_Os/04_Operations/03_Scripts_Os/01_Auditor_Hub.py health
python 01_Personal_Os/04_Operations/03_Scripts_Os/01_Auditor_Hub.py profundo
```

---

## 📁 Estructura v4.0 Consequences (Activo — 2026-05-14)

```
Think_Different/                        ← Raíz del proyecto
├── 00_Winter_is_Coming/                ✅ Goals, Backlog, AGENTS.md, OS_DIRECTORY.md
├── 01_Personal_Os/                     ✅ Sistema Operativo completo
│   ├── 01_Core/                        ✅ Motor del OS
│   │   ├── 00_Workflows_Os/            ✅ 28 Workflows (Personal, Marvel, CE, Hillary)
│   │   ├── 01_Rules/                   ✅ 13 reglas .mdc
│   │   └── 02_Tools/                   ✅ Agentes, Skills, MCPs, Hooks, Evals
│   │       ├── 01_Agents/              ✅ 52+ agentes (Dream Team + Specialists)
│   │       ├── 02_Skills/               ✅ 300+ skills en 11 áreas funcionales
│   │       └── 03_Mcp/ … 09_Templates ✅ MCPs, Hooks, Plugins, Server, Evals
│   ├── 02_Knowledge/                   ✅ Base de conocimiento
│   ├── 03_Task/                        ✅ Tareas activas
│   ├── 04_Operations/                  ✅ Todo lo operativo
│   │   ├── 03_Scripts_Os/              ✅ 23 HUBs + utilities (JARVIS 3.1)
│   │   │   ├── 12_Auditors_Os/         ✅ Utilities: Beautify, Carousel, SOTA, etc.
│   │   │   └── 13_Legacy/              ✅ Scripts legacy archivados
│   │   └── 02_Agent_Teams_Lite/00_Manifest/ ✅ 7 archivos JARVIS manifest
│   └── 05_Archive/                     ✅ Legacy + repos de referencia
├── 02_Playground/                      ✅ Zona de pruebas
├── 03_Resultado/                       ✅ Outputs (OIM, Elite Portfolio, etc.)
├── .agent/ .atl/ .claude/ .mcp.json   ✅ Config IA + GGA + SDD + 35 MCPs
└── OS_DIRECTORY.md CLAUDE.md README.md ✅ Documentación raíz
```

---

## 🎯 Skills (01_Personal_Os/01_Core/02_Tools/02_Skills/) — v4.0 Consequences

> **Total:** 300+ skills — 11 áreas funcionales | Índice completo: `INDEX_AREA_FUNCTIONAL.md`

| Área                           | Carpeta                                      | Descripción                                                                | SKILL.md                  |
|-------------------------------|---------------------------------------------|---------------------------------------------------------------------------|--------------------------|
| 00a                            | `00_Compound_Engineering`                    | Core CE (Spider, Avengers, LFG)                                            | ✅                         |
| 00b                            | `00_System_Core`                             | Stack base OS + Gcierr                                                     | ✅                         |
| 00c                            | `10_Skill_Auditor`                           | Auditoría de skills                                                        | ✅                         |
| 01                             | `01_Creacion_Contenidos`                     | Brand, YouTube, SEO, Carruseles, Contenidos                                | ✅                         |
| 02                             | `02_Diseno_Ui_Ux`                            | Product Design, UI/UX, Taste, Minimalismo                                  | ✅                         |
| 03                             | `03_Video_Media`                             | Video Intel, James Cameron (Remotion)                                      | ✅                         |
| 04                             | `04_Automatizacion`                          | N8N, Firecrawl, automación                                                 | ✅                         |
| 05                             | `05_Workflows`                               | Agent Teams, PM, Orchestrator                                              | ✅                         |
| 06                             | `06_Tools`                                   | Skill Creator, Testing, DevOps, System Master, Data Analyst                | ✅                         |
| 07                             | `07_Personal_Os`                             | Life OS, Hillary, Rituales                                                 | ✅                         |
| 08                             | `08_Invictus_Web`                            | Playwright, Superpowers, Web automation                                    | ✅                         |
| 09                             | `09_Legacy_Archive`                          | Skills obsoletas (archivadas en 05_Archive/)                               | N/A (archivado)           |
| 21                             | `21_Skill_Template`                          | Template para nuevas skills (pendiente verificar)                          | ⚠️                        |

**Total: 22 categorías de skills documentadas (09 y 21 no verificadas en este scan)**

---

## 🔧 Legacy Scripts (13_Legacy/)

Scripts legacy en `01_Personal_Os/04_Operations/03_Scripts_Os/13_Legacy/` — scripts históricos archivados:

| Rango     | Cantidad | Contenido                           |
|-----------|----------|-------------------------------------|
| 00-08     | 8+       | Scripts pre-migración de agentes    |

> ⚠️ Algunos scripts legacy pueden tener rutas obsoletas. Auditoría en progreso.

---

## ✅ Comandos del Sistema

| Comando                                  | Función                                              |
|-----------------------------------------|-----------------------------------------------------|
| `gr`                                     | System Guardian (dry-run)                            |
| `gr --apply`                             | Aplicar fixes                                        |
| `gr --agents`                            | Agentes de revisión                                  |
| `/sdd:*`                                 | SDD Workflow                                         |
| `/ce:*`                                  | Compound Engineering                                 |
| `engram`                                 | Memoria persistente                                  |

---

## 📝 Notas Importantes

1. **Rutas v4.0**: Skills ahora en `01_Personal_Os/01_Core/02_Tools/02_Skills/` (estructura v4.0 Consequences)
2. **.bashrc**: Alias configurados con rutas absolutas
3. **34_Skill_Auditor.py**: Corregido para auto-detectar categorías

---

## 🔗 Scripts → Skills Mapping (2026-04-20)

Scripts migrados a skills usando `get_skill_script()`:

| Script                                               | Skill Destino                                          | Estado                              |
|-----------------------------------------------------|-------------------------------------------------------|------------------------------------|
| `01_Spider_Brainstorm.py`                            | 00_Compound_Engineering/scripts                        | ✅                                   |
| `02_Professor_X_Plan.py`                             | 01_Agent_Teams_Lite/scripts                            | ✅                                   |
| `34_Skill_Auditor.py`                                | 10_Skill_Auditor/scripts                               | ✅                                   |
| `53_Structure_Auditor.py`                            | 00_System_Core/scripts                                 | ✅                                   |
| `50_System_Health_Monitor.py`                        | 08_Personal_Os/scripts                                 | ✅                                   |
| `33_Parallel_Audit_Pro.py`                           | 06_Testing/scripts                                     | ✅                                   |
| `57_Repo_Sync_Auditor.py`                            | 07_DevOps/scripts                                      | ✅                                   |
| `08_Ritual_Cierre.py`                                | 08_Personal_Os/scripts                                 | ✅                                   |
| `14_Morning_Standup.py`                              | 08_Personal_Os/scripts                                 | ✅                                   |
| `09_Backlog_Triage.py`                               | 02_Project_Manager/scripts                             | ✅                                   |
| `11_Sync_Notes.py`                                   | 18_Personal_Life_OS/scripts                            | ✅                                   |
| `16_Clean_System.py`                                 | 13_System_Master/scripts                               | ✅                                   |

**Total: 12 scripts migrados — Todos resolviendo con get_skill_script()**

---

## 📁 Scripts por Directorio

### 01_Ritual/
| Script                     | Función                        |
|---------------------------|--------------------------------|
| `00_Context_Reset.py`      | Resetea contexto de sesión     |
| `01_Campanilla.py`         | Notificación sonora (campana)  |
| `02_Alert_Manager.py`      | Gestor de alertas del sistema  |
| `03_Notify_System.py`      | Sistema de notificaciones      |

### 05_Validator/
| Script                         | Función                           |
|-------------------------------|-----------------------------------|
| `00_Parallel_Audit_Pro.py`     | Auditoría en paralelo             |
| `01_Skill_Auditor.py`          | Validador de skills               |
| `02_Linter_Autofix.py`         | Autofix de linter                 |
| `03_Validate_Rules.py`         | Validación de reglas              |
| `04_Edge_Case_Validator.py`    | Validación de edge cases          |
| `05_test_skill_lifecycle.py`   | Test de ciclo de vida de skills   |
| `skill_security_scan.py`       | Escaneo de seguridad              |
| `skill_validator.py`           | Validador genérico de skills      |

### 12_Auditors_Os/scripts/
| Script                     | Función                           |
|---------------------------|-----------------------------------|
| `00_Context_Usage_Bar.py`  | Barra de uso de contexto          |
| `01_Beautify_Tables.py`    | Formateo de tablas                |
| `02_Beauty_Doc.py`         | Formateo de documentación         |
| `03_SOTA_Integrity_Check.py` | Verificación de integridad SOTA |
| `04_Carousel_Engine.py`    | Motor de carruseles               |

### 13_Legacy/ (scripts archivados)
| Script                     | Función original                  |
|---------------------------|-----------------------------------|
| `00_Context_Reset.py`      | (archivado)                       |
| `01_Spider_Brainstorm.py`  | (archivado — migrado a skill)     |
| `02_Professor_X_Plan.py`   | (archivado — migrado a skill)     |
| `03_Thor_Work.py`          | (archivado)                       |
| ... (8+ scripts legacy)    |                                   |

---

*Actualizado: 2026-04-01 — Estructura 05_Archive estandarizada (01-09)*
