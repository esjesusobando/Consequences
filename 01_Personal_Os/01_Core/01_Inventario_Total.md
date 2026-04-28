# 📦 INVENTARIO TOTAL — PersonalOS v3.1 Consequences

> **Fecha:** 2026-04-28
> **Versión:** v3.1 Consequences — JARVIS 3.1 Integrated
> **Estado:** ✅ PURE GREEN — Documento de referencia principal

---

## RESUMEN EJECUTIVO

| Componente | Cantidad | Estado |
|:-----------|:--------:|:------:|
| Versión OS | v3.1 Consequences | ✅ |
| Workflows | 27+ | ✅ |
| Rules (.mdc) | 11 | ✅ |
| Agents | 52+ | ✅ |
| Dream Team | 5 | ✅ |
| Specialists | 24 | ✅ |
| Skills (áreas activas) | 11 | ✅ |
| Skills (count total) | 299 | ✅ |
| MCPs (Claude Code) | 35 | ✅ |
| Scripts (HUBs) | 23 | ✅ |
| HUBs principales | 19 | ✅ |
| Scripts auxiliares | 4 | ✅ |
| Manifests JARVIS | 7 | ✅ |
| Sistema Recursivo | 4+ engines | ✅ |

---

## ESTRUCTURA PRINCIPAL v3.1

```
Think_Different/
├── 00_Winter_is_Coming/           ← AGENTS.md, Goals, Backlog, Memory
├── 01_Personal_Os/
│   ├── 01_Core/
│   │   ├── 00_Workflows_Os/      ← 27+ workflows en 5 categorías
│   │   ├── 01_Rules/              ← 11 .mdc (00-10)
│   │   └── 02_Tools/
│   │       ├── 01_Agents/          ← 52+ agents (Dream Team + Specialists + Growth)
│   │       ├── 02_Skills/          ← 299 skills en 11 áreas activas
│   │       ├── 03_Mcp/            ← MCP servers (35 Claude / 18 OpenCode)
│   │       ├── 05_Hooks/          ← Hooks (Pre/Post/Lifecycle/Sound/Harness)
│   │       ├── 06_Plugins/        ← Plugins
│   │       ├── 07_Server/          ← Engram server
│   │       ├── 08_Evals/          ← Evaluaciones
│   │       └── 09_Templates/       ← Templates
│   ├── 02_Knowledge/
│   │   └── 02_Research/           ← SOTA, MCP Catalog, Inventarios
│   ├── 03_Task/                   ← Hillary (Inbox, Templates)
│   ├── 04_Operations/
│   │   ├── 00_Context_LLM/        ← Memoria, notas, knowledge brain
│   │   ├── 01_Auto_Improvement/   ← Sistema Recursivo
│   │   ├── 02_Agent_Teams_Lite/   ← SDD workflows + 7 manifests JARVIS
│   │   ├── 03_Scripts_Os/          ← 23 scripts (19 HUBs + 4 auxiliares)
│   │   ├── 04_Installer/          ← Scripts de instalación
│   │   └── 05_Projects/           ← Proyectos activos
│   └── 05_Archive/               ← Legacy + repos + snapshots
├── 02_Playground/
└── 03_Resultado/
```

---

## WORKFLOWS — 27+ archivos en 5 categorías

### 00_Workflows_Os/01_Personal_Os (core)

| # | Workflow | Función |
|:---:|:---------|:---------|
| 01 | Morning_Standup.md | Daily planning |
| 02 | Backlog_Processing.md | Triage inbox |
| 03 | Content_Generation.md | Create content |
| 04 | Weekly_Review.md | Strategic review |
| 05 | Ritual_Cierre_Protocol.md | End of day |
| 06 | Validar_Reglas.md | Rules validation |
| 07 | System_Health_Audit.md | System check |
| 08 | Context_Recovery.md | Recover context |
| 09 | AI_Task_Template.md | Task template |
| 10 | Classify_Task.md | Auto-classify |
| 11 | AGENTS.md | Agent system |

---

### 00_Workflows_Os/02_Marvel (Avengers)

| # | Workflow | Función |
|:---:|:---------|:---------|
| 01 | Iron_Man_Gen.md | Bootstrap |
| 02 | Spider_Brainstorm.md | Ideation |
| 03 | Professor_X_Plan.md | Planning |
| 04 | Vision_Review.md | Strategy review |
| 05 | Thor_Work.md | Implementation |
| 06 | Hulk_Compound.md | Compounding |
| 07 | AntMan_Lfg_Lite.md | Lite autonomous |
| 08 | Doc_Strange_Lfg.md | Full autonomous |

---

### 00_Workflows_Os/03_Gentleman

| # | Workflow | Función |
|:---:|:---------|:---------|
| 10 | Frontend_Premium.md | Design system |
| 20 | Redaccion_de_Docs.md | Technical writing |

---

### 00_Workflows_Os/04_Hillary

| # | Workflow | Función |
|:---:|:---------|:---------|
| 15 | Captura_Rapida.md | Quick capture |
| 25 | Hillary_Life_OS.md | Full life OS |

---

### 00_Workflows_Os/05_Compound_Engineering

| # | Workflow | Función |
|:---:|:---------|:---------|
| 16 | Deep_Work_Session.md | Focus work |
| 17 | Ship_It.md | Shipping |
| 18 | Anthropic_Harness.md | Eval harness |
| 19 | Multi_Agent_Roles.md | Multi-agent |

---

## RULES — 11 archivos .mdc

**Ubicación:** `01_Personal_Os/01_Core/01_Rules/`

| # | Rule | Propósito |
|:---:|:-----|:---------|
| 00 | Core_Protocol.mdc | Protocolo central del OS |
| 01 | Pilares_Sistema.mdc | 4 pilares del sistema |
| 02 | Motor_Agent.mdc | Motor agentic |
| 03 | Protocolos_Ejecucion.mdc | Protocolos de ejecución |
| 04 | Observabilidad.mdc | Logging y métricas |
| 05 | Reporting.mdc | Reglas de reporte |
| 06 | Contexto_Gestion.mdc | Gestión de contexto |
| 07 | Docs_Guias.mdc | Documentación |
| 08 | Token_Economy.mdc | Optimización de tokens |
| 09 | Agent_Teams_Protocol.mdc | Protocolo multi-agente |
| 10 | Git_Directions.mdc | Reglas y flujo Git ← NUEVO v3.1 |

---

## AGENTS — 52+ agents

**Ubicación:** `01_Personal_Os/01_Core/02_Tools/01_Agents/`

| Categoría | Agents | Ubicación |
|:---------|:-------|:----------|
| **Orchestrator** | 00_Orchestrator.md | Raíz de Agents |
| **Scope Architect** | 01_Scope_Rule_Architect.md | Raíz de Agents |
| **Dream Team** | 5 agents | `01_Dream_Team/` |
| **Specialists Compound** | 24 agents | `02_Specialists_Compound/` |
| **Growth** | N agents | `03_Growth/` |
| **Contexto** | N agents | `04_Contexto/` |
| **Marca** | N agents | `05_Marca/` |
| **Plantillas** | N agents | `06_Plantillas/` |
| **Individuales** | 12 agents | TDD, React, Security, Git, Accessibility, PRD, Design, AIPM, Carousel, Workflow, LFG, Hillary |

---

### Dream Team (5 Agents — `01_Dream_Team/`)

| Jugador | Posición | Especialidad |
|:----------|:----------:|:------------|
| 01_Product_Builder | Delantero | PRD, Planning, React, TypeScript |
| 02_Data_Engineer | Centrocampista | Python, Supabase, CSV, Analytics |
| 03_Marketing_Tech | Extremo | Marketing, SEO, Firecrawl |
| 04_Design_Ops | Lateral | Diseño, Vercel, Playwright |
| 05_Platform_Engineer | Portero | DevOps, System, MCP Client |

---

### Specialists Compound (24 Agents — `02_Specialists_Compound/`)

| Tipo | Agents |
|:-----|:-------|
| **Code Review** | correctness, security, performance, simplicity, maintainability |
| **Architecture** | pattern-recognition, architecture-strategist |
| **Framework** | kieran-typescript, kieran-python, kieran-rails, dhh-rails, julik-frontend |
| **Data** | data-integrity, data-migrations, schema-drift |
| **Quality** | testing, reliability, api-contract, deployment-verification |
| **Security** | security-sentinel |
| **Research** | best-practices, framework-docs, git-history, issue-intelligence, learnings, repo-research |

---

## SKILLS — 299 en 11 áreas activas

**Ubicación:** `01_Personal_Os/01_Core/02_Tools/02_Skills/`

| Área | Propósito |
|:-----|:----------|
| 00_Compound_Engineering | Core CE — SDD + Reviews |
| 00_Personal_Os_Stack | Stack base del OS |
| 00_Skill_Auditor | Auditoría de skills |
| 01_Creacion_Contenidos | Marketing, SEO, Carruseles, YouTube |
| 02_Diseno_Ui_Ux | Product Design, UI/UX, Taste, Minimal |
| 03_Video_Media | Video Intel, James Cameron, Remotion, Audio |
| 04_Automatizacion | N8N, Firecrawl |
| 05_Workflows | Agent Teams, PM, Orchestrator |
| 06_Tools | Skill Creator, Testing, DevOps, Data Analyst |
| 07_Personal_Os | Life OS, Hillary, Rituales |
| 08_Invictus_Web | Playwright, Superpowers, Browser Automation |

> ℹ️ `09_Legacy_Archive` → movido a `01_Personal_Os/05_Archive/` (no es un área activa)

---

### Life OS Skills (07_Personal_Os/)

| Skill | Trigger | Función |
|:------|:--------|:---------|
| Quick Capture | "capture", "quick add" | Captura de ideas |
| Plan My Day | "plan my day", "plan día" | Planificación diaria |
| Daily Notes | "daily notes", "log this" | Log de actividades |
| Recording Mode | "record", "transcribe" | Transcripción |
| Returns Tracker | "create skill from" | Detección de patrones |

---

## MCPs — 35 Claude Code / 18 OpenCode

**Ubicación:** `.mcp.json` (raíz)

| Categoría | Count | Ejemplos |
|:---------|:-----:|:--------|
| Knowledge | 5 | context7, memories, engram |
| Dev | 8 | github, gitlab, filesystem |
| Scraping | 3 | firecrawl, puppeteer |
| Notes | 3 | evernote, onenote |
| Productivity | 4 | slack, linear |
| Media | 3 | image generation, video |
| Data | 2 | postgres, mysql |
| Security | 2 | stealth-dev, vault |
| Testing | 1 | playwright-mcp |
| Tools | 4 | magicui-design, figma, gamma |

---

## SCRIPTS — 23 (19 HUBs + 4 auxiliares)

**Ubicación:** `01_Personal_Os/04_Operations/03_Scripts_Os/`

| HUB | Script | Función |
|:---|:--------|:---------|
| Sound Engine | `00_Sound_Engine.py` | Notificaciones sonoras |
| Auditor | `01_Auditor_Hub.py` | Validación del sistema |
| Git | `02_Git_Hub.py` | Git operations |
| AIPM | `03_AIPM_Hub.py` | AI Performance Monitoring |
| Ritual | `04_Ritual_Hub.py` | Rituales (morning, cierre, weekly) |
| Validator | `05_Validator_Hub.py` | Validación de código |
| Tool | `06_Tool_Hub.py` | Integración de tools |
| Integration | `07_Integration_Hub.py` | MCP e integraciones |
| Workflow | `08_Workflow_Hub.py` | Automatización de workflows |
| Data | `09_Data_Hub.py` | Procesamiento de datos |
| General | `10_General_Hub.py` | Utilidades generales |
| Auto Learn | `11_Auto_Learn_Hub.py` | Motor de auto-aprendizaje |
| Health Metrics | `14_Health_Metrics_Hub.py` | Métricas de salud |
| MCP Sync | `15_MCP_Sync_Hub.py` | Drift MCP detection |
| Agent Mirror | `16_Agent_Mirror_Hub.py` | Sync agents source → backup |
| Watchdog | `17_Watchdog_Hub.py` | Health watchdog |
| Telemetry | `18_Telemetry_Hub.py` | Dashboard ASCII métricas |
| Agent Sync | `19_Agent_Sync_Hub.py` | Sync .agent/ ↔ 01_Core/ |
| System Mapper | `20_System_Mapper_Hub.py` | Genera 7 manifests JARVIS |
| **Auxiliares** | `13_Auditors_Os/scripts/` | |
| Context Bar | `12_Context_Usage_Bar.py` | Uso de contexto |
| Beautify | `13_Beautify_Tables.py` | Formateo de tablas |
| SOTA Check | `15_SOTA_Integrity_Check.py` | Integridad SOTA |
| Carousel | `16_Carousel_Engine.py` | Motor de carruseles |

---

## MANIFESTS JARVIS — 7 archivos

**Ubicación:** `01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/`

| Manifest | Contenido |
|:---------|:----------|
| `01_OS_Inventory.json` | Inventario completo del OS |
| `02_MCP_Registry.yaml` | 35 MCPs Claude / 18 OpenCode |
| `03_Agent_Catalog.yaml` | 52+ agentes |
| `04_Skill_Index.json` | 299 skills |
| `05_HUB_Catalog.yaml` | 23 scripts |
| `06_Workflow_Graph.yaml` | Workflows |
| `07_Hook_Registry.yaml` | 10 hooks |

---

## SISTEMA RECURSIVO DE AUTO-MEJORAMIENTO

**Ubicación:** `01_Personal_Os/04_Operations/01_Auto_Improvement/`

```
01_Auto_Improvement/
├── 01_Engine/
│   ├── detector.py
│   ├── analyzer.py
│   ├── executor.py
│   ├── learner.py
│   └── recursive_improvement_engine.py
├── 02_Rules/
│   └── rules_engine.py
├── 03_Metrics/
│   └── metrics_tracker.py
├── 04_Triggers/
│   ├── manual_trigger.py
│   └── cron_trigger.py
└── 99_Utils/
    └── [utilities]
```

**Ciclo:** `Detect → Analyze → Execute → Learn (repite hasta max_iterations)`

---

## HILLARY — Task Management

**Ubicación:** `01_Personal_Os/03_Task/`

| Carpeta | Contenido |
|:--------|:----------|
| 00_Templates/ | Templates (SOTA, Medio, Corto, Routine, Skeleton) |
| 01_Tasks_Done/ | Tareas completadas |
| 02_Hillary_Inbox/ | Inbox activo |

---

## INTEGRACIÓN CON 6 METODOLOGÍAS

| # | Metodología | Skills | Workflows | Agents | Ubicación |
|:---:|:------------|:------:|:---------:|:------:|:----------|
| 1 | Personal OS | 6 | 11 | - | `01_Core/00_Workflows_Os/01_*` |
| 2 | Marvel | - | 8 | - | `01_Core/00_Workflows_Os/02_*` |
| 3 | Gentleman | 6 | 2 | - | `01_Core/00_Workflows_Os/03_*` |
| 4 | Hillary | 2 | 2 | - | `01_Core/00_Workflows_Os/04_*` + `03_Task/` |
| 5 | Compound Eng | 35+ | 4 | 52+ | `01_Core/00_Workflows_Os/05_*` + `02_Tools/` |
| 6 | Sistema Recursivo | - | 1 | - | `04_Operations/01_Auto_Improvement/` |

---

## DOCUMENTACIÓN CLAVE

| Documento | Ubicación |
|:----------|:----------|
| AGENTS.md principal | `00_Winter_is_Coming/AGENTS.md` |
| Dream Team | `01_Personal_Os/01_Core/02_Dream_Team.md` |
| Inventario Core | `01_Personal_Os/01_Core/INVENTARIO_CORE.md` |
| OS Directory | `OS_DIRECTORY.md` (raíz — JARVIS discovery) |
| CLAUDE.md | `CLAUDE.md` (raíz — config IA) |
| README.md | `README.md` (raíz — documentación principal) |
| Rules Index | `01_Personal_Os/01_Core/01_Rules/RULES_INDEX.md` |
| Skills Index | `01_Personal_Os/01_Core/02_Tools/02_Skills/README.md` |
| SDD Registry | `.atl/skill-registry.md` |

---

## CHANGELOG

| Fecha | Versión | Cambio |
|:------|:--------|:-------|
| 2026-04-28 | **v3.1** | Actualización JARVIS 3.1 — 11 áreas, 11 rules, 52+ agents, 23 HUBs |
| 2026-04-25 | v3.0 | Plan Consequences 3.0 JARVIS Integration |
| 2026-04-24 | v2.0 | Estructura v2.0 Consequences |
| 2026-04-20 | v1.x | Script Migration |

---

**PersonalOS v3.1 Consequences — PURE GREEN | 2026-04-28**
