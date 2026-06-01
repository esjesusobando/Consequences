# 📁 ESTRUCTURA COMPLETA — Think Different PersonalOS v4.9 Consequences

> **Versión:** 4.9 Consequences
> **Fecha:** 2026-06-01
> **Estado:** Production Ready — Consolidación SOTA
> **Audit v2:** 2026-05-23 — 23 duplicates removed, 3 folders synced, docs pixel-perfect
> **Audit v3 (Judgment Day):** 2026-05-25 — 12 bugs corregidos, 18 complementos añadidos, estructura sincronizada con realidad
> **Audit v4 (SOTA Consolidation):** 2026-05-29 — Skills visuales consolidadas en 02_Diseno_Ui_Ux, duplicado archivado, numeración secuenciada Content 01-16, path stale corregido, SKILL.md promovidos áreas legacy

---

## 🏠 RAÍZ — 4 Carpetas Principales

```
Think_Different/                    # RAÍZ
├── 00_Winter_is_Coming/           # Goals, Backlog, Memoria estratégica
├── 01_Personal_Os/                # SISTEMA OPERATIVO (FUENTE DE VERDAD)
├── 02_Playground/                  # Zona de pruebas y experimentos
└── 03_Resultado/                   # Outputs de proyectos
```

### 📝 Notas de la Raíz

| Carpeta                    | Propósito                                                            |
|---------------------------|---------------------------------------------------------------------|
| **00_Winter_is_Coming**    | Dirección estratégica. Goals, Backlog, AGENTS.md (GGA), CHANGELOG.   |
| **01_Personal_Os**         | EL SISTEMA OPERATIVO. Skills, agentes, HUBs, workflows, memoria.     |
| **02_Playground**          | Zona de pruebas. Skills nuevas, flujos experimentales.               |
| **03_Resultado**           | Outputs de proyectos. Entregables, reportes, contenido generado.     |

---

## 📂 01_Personal_Os — Sistema Operativo (FUENTE DE VERDAD)

```
01_Personal_Os/
├── 01_Core/                       # MOTOR DEL OS
│   ├── 00_Workflows_Os/          # 27 workflows (7 categorías)
│   ├── 01_Rules/                 # 13 reglas .mdc
│   └── 02_Tools/                 # Herramientas del OS
│   ├── 01_Agents/            # 55 agentes
│       ├── 02_Skills/           # 385 skills (14 áreas)
│       ├── 03_Mcp/              # Backup MCP configs
│       ├── 04_Integrations/     # Fireflies, Granola
│       ├── 05_Hooks/            # 10 hooks (6 fases)
│       ├── 06_Plugins/          # Plugins OS
│       ├── 07_Server/           # Engram server
│       ├── 08_Evals/            # Evaluadores
│       └── 09_Templates/        # Templates
├── 02_Knowledge/                 # Base de conocimiento
├── 03_Task/                      # Tareas activas (18 tareas P0-P3)
├── 04_Operations/                 # MOTOR OPERATIVO
│   ├── 00_Context_LLM/          # Memoria LLM
│   ├── 01_Auto_Improvement/     # Motor auto-mejora
│   ├── 02_Agent_Teams_Lite/     # SDD + 7 JARVIS manifests
│   ├── 03_Scripts_Os/          # 20 HUBs (numerados 00-20 + HUB_SOTA) + 256 scripts
│   ├── 04_Installer/           # Scripts de instalación
│   ├── 05_Projects/             # Proyectos activos
│   │   └── 01_Projects_Lab/    # Lab de proyectos (9 proyectos)
│   ├── 06_SOTA_Features/        # Features SOTA
│   └── 07_Reports/              # Reports (OFICIAL, 10_Reports eliminado)
└── 05_Archive/                   # LEGADO
```

---

## 📂 01_Core — Motor del OS

### 00_Workflows_Os — Workflows (27 workflows, 7 categorías)

| Categoría                      | Workflows                                                                                                                                      | Propósito                            |
|-------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------|
| **00_Learning_Always**         | 1                                                                                                                                              | Aprendizaje continuo                 |
| **01_Personal_Os**             | 10 (Morning, Backlog, Content, Weekly, Ritual_Cierre, Validar_Reglas, System_Health, Context_Recovery, AI_Task_Template, Classify_Task)        | Rutinas personales                   |
| **02_Marvel**                  | 8 (Iron Man Gen, Spider, Thor, Hulk)                                                                                                           | Identidades temáticas de agente      |
| **03_Gentleman**               | 2 (Frontend, Docs)                                                                                                                             | Diseño premium y redacción           |
| **04_Hillary**                 | 2 (Life OS, Inbox)                                                                                                                             | Gestión de vida personal             |
| **05_Compound_Engineering**    | 4                                                                                                                                              | Ingeniería avanzada (CE)             |
| **06_Youtube_Full_Video**      | 1                                                                                                                                              | Pipeline de producción de video      |

### 01_Rules — Reglas (13 .mdc + README + RULES_INDEX.md + .Backup/)

| #    | Regla                             | Propósito                 |
|-----|----------------------------------|--------------------------|
| 00   | **00_Core_Protocol.mdc**          | Protocolo core            |
| 01   | **01_Pilares_Sistema.mdc**        | Pilares fundamentales     |
| 02   | **02_Motor_Agent.mdc**            | Motor de agentes          |
| 03   | **03_Protocolos_Ejecucion.mdc**   | Protocolos de ejecución   |
| 04   | **04_Observabilidad.mdc**         | Sistema de observación    |
| 05   | **05_Reporting.mdc**              | Reportes y métricas       |
| 06   | **06_Contexto_Gestion.mdc**       | Gestión de contexto       |
| 07   | **07_Docs_Guias.mdc**             | Convenciones              |
| 08   | **08_Token_Economy.mdc**          | Economía de tokens        |
| 09   | **09_Agent_Teams_Protocol.mdc**   | Protocolo de equipos      |
| 10   | **10_Git_Directions.mdc**         | Direcciones Git           |
| 11   | **11_Minimax.mdc**                | Configuración Minimax     |
| 12   | **12_Audit_OS_Integrity.mdc**     | Auditoría integridad OS   |

> **Nota:** También existe `.Backup/00_Rules_Backup/` con copia de seguridad de las rules.

### 02_Tools — Herramientas del OS

| #    | Herramienta          | Cantidad                                                           | Propósito                          |
|-----|---------------------|-------------------------------------------------------------------|-----------------------------------|
| 01   | **01_Agents**        | 55 (2 Root + 5 Dream + 23 Specialists + 5 Growth + 20 Individuales)| Orquestación multi-agente          |
| 02   | **02_Skills**        | 385 activos + ~490 legacy                                          | 14 áreas funcionales (00-10)       |
| 03   | **03_Mcp**           | —                                                                  | Backup configs MCP                 |
| 04   | **04_Integrations**  | —                                                                  | Fireflies, Granola                 |
| 05   | **05_Hooks**         | 10 hooks                                                           | Ganchos 6 fases                    |
| 06   | **06_Plugins**       | —                                                                  | Plugins OS (Staff, Personal_Os)    |
| 07   | **07_Server**        | —                                                                  | Engram server + AIPM + MCP         |
| 08   | **08_Evals**         | —                                                                  | Evaluadores (vacíos)               |
| 09   | **09_Templates**     | —                                                                  | Templates (vacíos)                 |

**Agentes por Categoría (numeración secuencial 00-19):**

| #         | Categoría                                  | Tipo              | Cantidad              |
|----------|-------------------------------------------|------------------|----------------------|
| 00        | Orchestrator / Agent_Template              | Root              | 2 archivos            |
| 01        | Dream Team                                 | Subdirectorio     | 5 agentes + README    |
| 02        | Specialists Compound                       | Subdirectorio     | 23 agentes + README   |
| 03        | Growth                                     | Subdirectorio     | 5 agentes + README    |
| 04        | Contexto                                   | Subdirectorio     | 0 agentes (LEEME)     |
| 05        | Marca                                      | Subdirectorio     | 0 agentes (LEEME)     |
| 06        | Plantillas                                 | Subdirectorio     | 0 agentes (LEEME)     |
| 07–13     | Individuales (Accessibility → Hillary)     | Root              | 7 archivos            |
| 14–19     | Specialist Individuales (Git → TDD)        | Root              | 6 archivos            |
|           | **TOTAL**                                  |                   | **55 agentes**        |

**Skills por Área (v4.9 — auditada contra disco):**

| Área                           | SKILL.md  | Descripción (directorio real)                                   |
|-------------------------------|----------|----------------------------------------------------------------|
| **00_Agent_Teams_Lite**        | 13        | SDD sub-agentes + JARVIS manifests                              |
| **00_Compound_Engineering**    | 63        | Core CE — SDD + CE workflow skills                              |
| **00_Personal_Os**             | 32        | Life OS, Hillary, Rituales (antes 07_)                          |
| **00_Skill_Auditor**           | 1         | Auditoría de skills                                             |
| **00_System_Core**             | 1         | Stack base OS                                                   |
| **00_Workflows**               | 43        | Workflows OS (antes no listado)                                 |
| **01_Creacion_Contenidos**     | 47        | Brand, YouTube, SEO, Marketing — 16 sub-áreas secuenciales 01-16|
| **02_Diseno_Ui_Ux**            | 34        | 16 sub-áreas (01-16): Product Design → Video Prompt             |
| **03_Video_Media**             | 7         | Video Intel, James Cameron                                      |
| **04_Automatizacion**          | 24        | N8N, Firecrawl, GWS Client                                      |
| **05_Claude_Ads**              | 21        | Claude Ads & Promoted Content (antes 09_)                       |
| **06_Tools**                   | 83        | Skill Creator, Testing, DevOps, Data Analyst                    |
| **07_Invictus_Web**            | 15        | Playwright, Superpowers, Browser Auto (antes 08_)               |
| **10_Laia_Learning**           | 1         | Sistema de aprendizaje personal                                 |

---

## 📂 02_Knowledge — Base de Conocimiento

```
02_Knowledge/
├── 00_Examples_Personal_Os/
├── 01_Research_Os/
├── 02_Research/
├── 03_Writing_Content/
├── 04_Docs/
├── 05_Aipm/
├── 06_Unicorn/
├── 07_Invictus/
├── 08_Templates/
└── 09_Anthropic/
```

---

## 📂 03_Task — Tareas Activas

```
03_Task/
├── 00_P0_Auditoria.md                  # P0 Auditoría general
├── 00_Templates/
├── 01_P0_System_Guardian_Test.md       # P0 Test Guardian
├── 01_Tasks_Done/
├── 02_Hillary_Inbox/
├── 02_P1_Consolidated_Tasks.md         # P1 Consolidated
├── 03_P1_Documentacion_Sistema.md      # P1 Documentación
├── 04_P1_Estructura_Carpetas.md        # P1 Estructura
├── 05_P1_Documentar_Sistema.md         # P1 Documentar
├── 06_P2_Audience_Growth.md            # P2 Audience Growth
├── 07_Test_Content_Draft.md            # P2 Content Draft
├── 08_P2_Deuda_Tecnica_Paths_Legacy.md # P2 Deuda Técnica
├── 09_Plan_Seguir_2026-05-22.md        # Plan de seguimiento
├── 10_Task_Elite_Portfolio_P1.md       # P1
├── 11_Task_OIM_Website_P1.md           # P1
├── 12_Task_PreCommit_API_Keys_P2.md    # P2
├── 13_Task_Onboarding_New_Machine_P2.md # P2
├── 14_Task_Automate_Reports_P3.md      # P3 ✅ RESUELTO
├── 15_Task_Revisar_Marvel_Workflows_P3.md # P3
├── 16_Task_Revisar_Ritual_Cierre_P3.md # P3
├── 17_Task_Evaluar_Avengers_Plan_P3.md # P3
├── README.md
└── SDD_Elite_Portfolio_Migration.md    # SDD Migration Plan
```

---

## 📂 04_Operations — Motor Operativo

### 00_Context_LLM — Memoria y Contexto (15 subdirectorios)

```
00_Context_LLM/
├── 00_Context_Memory/         # Memoria de contexto (_archive, _jsons)
├── 01_Process_Notes/          # 35 Notas de Proceso (01-33 + 27b + README) + _archive/
├── 02_Knowledge_Brain/        # Cerebro de conocimiento (16 entradas, 9 PDFs en 00_Library_PDFs/)
├── 03_Memory_Brain/           # Active, Mapeos, Code_Reviews, Archive_Memory
├── 04_Docs/                   # Documentación con planes/
├── 05_Plans/                  # Planes activos
├── 06_Solutions/              # Soluciones documentadas (system-reorg, system-maintenance)
├── 07_Auditorias/             # Auditorías, health checks
├── 11_Reports/                # legacy_health_logs, health_history.csv
├── 13_Telemetry/              # Telemetría
├── 14_Scripts/                # Scripts operativos (pm_agents_sota.py, pm_agents_hook.ps1)
├── 15_Resources/              # Recursos externos (a16z GenAI Top100 insights)
└── README.md
```

### 01_Auto_Improvement — Motor de Automejora (12 entradas)

```
01_Auto_Improvement/
├── 01_Engine/                # analyzer.py, detector.py, executor.py, learner.py
├── 02_Rules/                 # rules_engine.py, detector_config.json, auto_fix_rules.json
├── 03_Metrics/               # metrics_tracker.py, improvement_log.json
├── 04_Triggers/              # manual_trigger.py, cron_trigger.py
├── 05_Backups/               # 14 .bak backups
├── 06_Utils/                 # 11 Python utilities + AUDIT_REPORT_SDD
├── AUDITORIA_2026-04-23.md
├── PLAN_PENDIENTES.md
├── README.md
├── recursive_improvement_engine.py
├── REPO_CONFIG.md
└── verify_report.md
```

### 02_Agent_Teams_Lite — SDD Registry + JARVIS Manifests

```
02_Agent_Teams_Lite/
├── 00_Manifest/              # 7 JARVIS manifests (OS_Inventory → Hook_Registry)
├── 01_Agent_Teams_Lite/      # Framework de agentes
├── 03_Pattern_Engine/        # Python engine (indexer, search, embedding, api, database)
├── README.md
└── SDD_SKILLS.md
```

### 03_Scripts_Os — Scripts del Sistema

> **Total:** 64 entradas | **HUBs:** 21 (00-18, con 15a/b y 16a/b) + HUB_SOTA.py + HUB_CATALOG.md
> **Scripts:** 283 .py + 1 .js = 284 total | **HUBs canónicos JARVIS 3.0:** 15a, 16a, 17, 18

```
03_Scripts_Os/
├── HUB_CATALOG.md             # Catálogo completo de HUBs (21+5 auxiliares)
├── SCRIPTS_INDEX.md           # Índice de scripts (98+ HUBs + módulos + utilities)
├── 00_Sound_Engine.py         # Motor de sonido
├── 01_Auditor_Hub.py → 25_Minimax_Optimizer_Hub.py  # 21 HUBs core
├── HUB_SOTA.py                # HUB SOTA orchestrator
├── 21_Legacy_Path_Cleanup.py → 57_Repo_Sync_Auditor.py  # Scripts utilitarios
├── 12_Auditors_Os/            # Auditors + Context_Usage_Bar, Beautify_Tables
├── .backup/                   # Legacy backup 20260420
└── ... (data dirs: 02_Tool, 03_AIPM, 03_Validator, etc.)
```

### 04_Installer — Scripts de Instalación

```
04_Installer/
├── installer.py               # Instalador principal
├── config.json                # Config con datos reales
├── config.template.json       # Template de configuración
├── .mcp.template.json         # Template MCP
├── 01_Setup_Guide.md          # Guía de setup
├── README.md
├── requirements.txt           # Dependencias Python
└── scripts/                   # validate.py, setup_dependencies.py, setup_aliases.py, detect_machine.py, configure_paths.py
```

### 05_Projects / 00_Context — Contexto de Proyectos

```
05_Projects/00_Context/
├── 00_Learning_Always/        # Aprendizaje continuo
├── 01_PRDs/                   # Product Requirements Documents
├── 02_Strategy/               # Documentos de estrategia
├── 03_Tech/                   # Documentación técnica
└── 04_Learnings/              # Lecciones aprendidas
```

### 05_Projects / 01_Projects_Lab — Proyectos

```
05_Projects/01_Projects_Lab/
├── 01_Efrain_World/
├── 02_Cassette/
├── 03_Side_Project_Backup/
├── 04_Macano_Rest/
│   └── APP/frontend/
├── 05_OBAND/               # ✅ Deps actualizadas
├── 06_OIM_Original/       # ✅ Deps actualizadas
├── 07_Backup_OIM/
├── 08_Elite_Portfolio/    # ✅ DEPS OK (framer-motion 12.40.0)
└── 09_Valeria/
```

### 06_SOTA_Features — Features SOTA (5 módulos activos)

```
06_SOTA_Features/
├── 00_Common/                 # base_engine.py + __init__.py
├── ambient_intelligence/      # engine.py, context_cache.json, activity_log.json
├── config.py                  # Config module
├── config.yaml                # YAML config
├── contemplation_loop/        # engine.py, contemplation_log.json
├── feedback_loop/             # engine.py, feedback_rules/ (2 rules + index)
├── HUB_SOTA.py                # SOTA Hub orchestrator
├── memory_versioning/         # engine.py, versions/ (manifest + 1 version)
├── voice_profile/             # engine.py, me/VOICE_PROFILE.md, samples/
└── README.md
```

### 07_Reports — Reports (OFICIAL)

```
07_Reports/
├── README.md               # ✅ Actualizado a 07_Reports
├── 00_Templates/           # (vacíos)
└── 01_Generated/           # (vacíos)
```

---

## 📂 05_Archive — Legado

```
05_Archive/
├── 00_Backup_Os/             # Backup completo OS (Source Backups, Agents, Workflows, Plans)
├── 00_Plan_Auditoria_2026-05-24.md  # Plan de auditoría
├── 00_Skills_Legacy/         # Skills legacy v3 (24 directorios, ~490 SKILL.md)
│   ├── 00_Agent_Teams_Lite/ → 22_Huashu_Design/ # Skills de versiones anteriores
│   └── INDEX.md              # Índice completo con 24 categorías archivadas
├── 01_Repos_Reference/       # Repos de referencia
│   ├── 01_Rules_Legacy/      # Rules legacy
│   ├── 02_Repos_Gentleman/   # 23 repos de Gentleman (01-23 + engram + gentle-pi)
│   │   ├── 23_Tubemaster/
│   │   ├── engram/
│   │   └── gentle-pi/        # ✅ Actualizado a 848a1fd62
│   └── 03_OpenSpec_Archive/  # Archive openspec
├── 02_Legacy_Content/        # Contenido legacy (Planes, Skills, Docs antiguos)
│   ├── 03_Backups_Audits/        # Backups y auditorías (Raíz, Auditorías, Snapshots, v4.9)
├── 04_Docs_Legacy/           # Documentos legacy
├── 05_Skills_Legacy/         # Skills backup adicional
├── 06_Skills_Legacy/         # Skills backup adicional
├── New_Implementation_Plan.md
└── README.md
```

---

## 🎮 02_Playground — Zona de Pruebas

```
02_Playground/
├── 00_Momentum/              # Agenda momentum (7 subcarpetas)
├── 01_Branders_Skills/       # Skills de branding (10 archivos)
├── 02_Workflow_N8N/          # Workflows N8N
├── 03_Reports/               # Reportes generados
├── 04_Side Project/          # Oil Brain (repo propio, ignorado)
├── 06_Testing_Legacy/        # Scripts de test legacy
│   ├── 01_OS_Runtime_Test.py # Test runtime v4.9 Consequences
│   ├── 05_OS_Health_Test.py  # Test de salud
│   └── 06_OS_Deep_Audit.py   # Auditoría profunda v2
├── Kit_Diseño_Top.md         # Guía diseño legacy
└── README.md
```

---

## 📤 03_Resultado — Outputs de Proyectos

```
03_Resultado/
├── .opencode/                   # ✅ Config OpenCode
├── 00_Proyectos/                # Proyectos activos y planes
│   ├── 00_Side Project/         # Oil/Brain (repo propio, ignorado)
│   ├── 01_Planes/              # Planes de proyecto
│   ├── 02_Revisar_Now/         # Pendientes de revisión
│   ├── 03_Revisar_Planes/      # Planes en revisión
│   ├── 04_Pruebas_Ads/         # Pruebas de anuncios
│   └── README.md
├── 01_Aprendizaje/              # Outputs de aprendizaje
│   ├── 00_Output_Skills/       # Skills generadas
│   ├── 01_Fundamentos_AI/      # Fundamentos de IA
│   ├── 02_Contenido_Learning/  # Contenido de aprendizaje
│   ├── 03_Documentacion/       # Documentación (Design.md, Pattern_Intelligence.md)
│   ├── 04_Referencias_Pre/     # Referencias previas
│   └── README.md
├── 02_Experimentos/             # Experimentos y ejercicios
│   ├── 00_Recursos_Varios/     # 00_Imagenes, 01_Videos
│   ├── 00_World_OIM/           # 4 variantes OIM
│   │   ├── 01_OIM_Website_v2/
│   │   ├── 02_OIM_Website/
│   │   ├── 03_OIM_Website_One/
│   │   ├── 04_OIM_Website_Backup/
│   │   └── Imagenes_Finales/
│   ├── 01_Frontend_Slides_Exercise/    # Frontend/Slides
│   ├── 02_Huashu_Design_Exercise/      # Huashu Design
│   ├── 04_Sessions/                    # Sesiones de trabajo
│   ├── 05_Imagenes_Finales/            # Imágenes finales
│   ├── 06_AI_News_Weekly/              # AI News Weekly
│   ├── 07_Clinica_Infantil/            # Clínica Infantil (repo propio .git)
│   ├── 08_Suerte_Repeticion_Test/      # Experimento repetición/probabilidad
│   └── README.md
├── 03_Reportes/                 # Reportes y auditorías del sistema
│   ├── 01_Auditorias_OS/       # JSONs de auditoría (manifest + 5 JSONs)
│   ├── audit_*.txt             # Reportes de auditoría (estructura, health, profundo, skills)
│   ├── watchdog_report_*.txt   # Reportes watchdog
│   ├── sota_integrity_*.txt    # Verificaciones SOTA
│   └── PROCESO_NOTES_*.md      # Notas de proceso
├── 04_Documentacion/            # Documentación general
├── 00_Think_Different.code-workspace
├── ORGANIZACION_SUMMARY.md      # Documento de reorganización
└── README.md

*Nota: Estructura reorganizada 2026-05-24. Consolidada 2026-06-01 (04_Reportes→fusionado, 09_World_OIM→eliminado duplicado, 05_Documentacion→renumerada 04_).*
```

---

## ⚙️ Archivos y Directorios de Configuración Raíz

| Archivo/Directorio         | Propósito                                                                                                                      |
|---------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| **.mcp.json**              | 8 MCPs root (magicui, aim, context7, obsidian, eagle, higgsfield, sequential-thinking, google-workspace) + 38 backup en 03_Mcp/|
| **.claude/**               | Config Claude Code (skills, rules, agents, memory, history)                                                                    |
| **.claude-plugin/**        | Claude plugin directory                                                                                                        |
| **.opencode/**             | Config OpenCode + plugins + skills locales (ui-ux-pro-max → Archivado a 05_Archive/)                                           |
| **.atl/**                  | SDD Registry + openspec/ + skill-registry cache                                                                                |
| **.agent/**                | Backup estratégico: Rules, Agents, Skills, Workflows, GGA                                                                      |
| **.pi/**                   | PI config: 10 SDD agents, 3 chains, gentle-ai support                                                                          |
| **.codex/**                | Config Codex (mínimo)                                                                                                          |
| **.playwright-mcp/**       | Logs de Playwright MCP                                                                                                         |
| **.env**                   | Variables de entorno                                                                                                           |
| **.gga**                   | Guardian Angel config (FILE — opencode, skill validation)                                                                      |
| **.vscode/**               | Config VS Code                                                                                                                 |
| **AGENTS.md**              | GGA Pre-Commit entry (redirect → 00_Winter_is_Coming)                                                                          |
| **CLAUDE.md**              | Config IAs (FUENTE) — Boot Protocol, 12 Laws, Super Campeones                                                                  |
| **OS_DIRECTORY.md**        | JARVIS discovery — 36 MCPs, 28 HUBs, 16 audit findings                                                                         |
| **Structure_v4.9.md**      | Este archivo — estructura completa                                                                                             |

---

## 📊 ESTADO DEL SISTEMA v4.9

| Componente                       | Total                                                         | Estado  |
|---------------------------------|--------------------------------------------------------------|--------|
| Skills (activas)                 | 385 en 14 áreas funcionales                                   | ✅       |
| Skills (legacy)                  | ~490 en 24 categorías archivadas (00_Skills_Legacy)           | 💾       |
| Agentes                          | 55 (source) / 82 (con SDD/CE) / 20 agent-files root           | ✅       |
| Rules                            | 13 .mdc (00–12) + README + RULES_INDEX.md + .Backup/          | ✅       |
| MCPs                             | 8 servidores root + 38 backup en 03_Mcp/                      | ✅       |
| HUBs                             | 20 (00-20) + HUB_SOTA                                         | ✅       |
| Scripts                          | 256 (.py)                                                     | ✅       |
| Workflows                        | 27 en 7 categorías                                            | ✅       |
| Process Notes                    | 35 NP activas (01-33 + 27b + README) + _archive histórico     | ✅       |
| SOTA Features                    | 5 módulos (ambient, contemplation, feedback, memory, voice)   | ✅       |
| JARVIS Manifests                 | 7 manifests (OS_Inventory → Hook_Registry)                    | ✅       |
| Projects Lab                     | 9 proyectos activos (Efrain → Valeria)                        | ✅       |
| Directorios Config               | 12 (`.agent`, `.atl`, `.claude`, `.opencode`, `.pi`, etc)     | ✅       |
| OpenCode Skills Registrados      | 8 CE skills + 10 SDD (ui-ux-pro-max → 05_Archive/)            | ✅       |

---

## 🔥 BOOT PROTOCOL — IRON MAN GENESIS (v4.9)

Al iniciar sesión, ejecutar EN ORDEN:

1. Leer `00_Winter_is_Coming/AGENTS.md`
2. Leer `00_Winter_is_Coming/GOALS.md`
3. Leer `00_Winter_is_Coming/BACKLOG.md`
4. Leer rules con `alwaysApply: true`
5. Leer `.agent/03_Workflows/02_Marvel/01_Iron_Man_Gen.md`
6. `engram_mem_context(limit=10)`
7. Process notes recientes
8. Tasks status s/b
9. Reportar contexto

⚠️ **REGLA DE ORO:** Sin lectura completa, NO hay respuesta.

---

## 📋 CONVENCIONES DE NOMENCLATURA

| Tipo                      | Estándar                         | Ejemplo                            |
|--------------------------|---------------------------------|-----------------------------------|
| Archivos de código        | `snake_case.py`                  | `os_health_test.py`                |
| Archivos de datos         | `Pascal_Case` + guion_bajo       | `OS_Health_2026-05-22.txt`         |
| Carpetas principales      | `XX_Nombre`                      | `00_Winter_is_Coming`              |
| SKILL.md                  | `SKILL.md` (fijo)                | `Skills/.../SKILL.md`              |
| Scripts HUBs              | `NN_Nombre_Hub.py`               | `20_System_Mapper_Hub.py`          |
| Archivos `00_`            | `00_` prefix = NO TOCAR          | `00_SALUD_REPORTS.md`              |
| Directorios Config        | `.nombre` (dotfiles)             | `.agent/`, `.atl/`, `.claude/`     |
| Notas de Proceso          | `NN_NP_Titulo.md`                | `34_NP_Sesion_Auditoria_v4.9.md`   |

**Reglas de Secuencia:**
1. **Enumeración limpia** — Sin huecos ni duplicados
2. **00_ = No tocar** — Archivos de referencia rápida
3. **Renombrados** — `09b_World_OIM` → `09_World_OIM` (audit v2)

---

## ✅ PURE GREEN STATE

**Think Different PersonalOS v4.9 Consequences — 2026-06-01**

*Audit v4 (SOTA Consolidation) complete. Skills visuales consolidadas en 02_Diseno_Ui_Ux. Duplicado .opencode archivado. Content renombrado secuencia 01-16. Laia renumerada 10_. Path stale corregido. SKILL.md promovidos áreas legacy. 13 directorios Content renombrados a secuencia limpia. 5 skills visuales migradas sin pérdida de datos. Estructura sincronizada con realidad.*

---

*Versión: v4.9 Consequences*
*Audit: 2026-06-01 (SOTA Consolidation)*
*Skills: 385 active + ~490 legacy | Agents: 55 (source) / 82 (con SDD/CE) | Rules: 13 .mdc | MCPs: 8+38 | HUBs: 20 | Scripts: 256*
