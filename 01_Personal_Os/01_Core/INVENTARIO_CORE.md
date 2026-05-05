# INVENTARIO CORE — PersonalOS v3.1 Consequences

> **Fecha:** 2026-04-28
> **Path:** `01_Personal_Os/01_Core/`
> **Versión:** v3.1 Consequences — JARVIS 3.1 Integrated
> **Estado:** ✅ PURE GREEN

---

## ESTRUCTURA DE 01_Core

```
01_Core/
├── README.md                     ← Índice central
├── INVENTARIO_CORE.md           ← Este archivo
├── 00_Comandos_Workflows.md     ← Comandos y HUBs (v3.1)
├── 01_Inventario_Total.md       ← Inventario completo del OS
├── 02_Dream_Team.md             ← Estructura del equipo
├── Requirements.txt              ← Dependencias Python
├── 00_Workflows_Os/            ← 5 categorías de workflows (27+ archivos)
├── 01_Rules/                   ← 11 archivos .mdc (00-10)
└── 02_Tools/
    ├── README.md
    ├── 01_Agents/             ← 52+ agents (Dream Team + Specialists + Growth)
    ├── 02_Skills/             ← 299 skills (11 áreas activas)
    ├── 03_Mcp/                ← MCP servers (backup de config)
    ├── 05_Hooks/              ← Hooks calidad (Pre/Post/Lifecycle/Sound)
    ├── 06_Plugins/            ← Plugins del OS
    ├── 07_Server/             ← Engram server
    ├── 08_Evals/              ← Evaluaciones
    └── 09_Templates/          ← Templates
```

---

## WORKFLOWS — 27+ archivos en 5 categorías

### 01_Personal_Os — Ritmos Core (11 workflows)

| #         | Workflow                      | Función                          |
|-----------|-------------------------------|----------------------------------|
| 01        | Morning_Standup.md            | Planificación diaria             |
| 02        | Backlog_Processing.md         | Triage del inbox                 |
| 03        | Content_Generation.md         | Creación de contenido            |
| 04        | Weekly_Review.md              | Revisión estratégica semanal     |
| 05        | Ritual_Cierre_Protocol.md     | Cierre del día                   |
| 06        | Validar_Reglas.md             | Validación de reglas             |
| 07        | System_Health_Audit.md        | Check del sistema                |
| 08        | Context_Recovery.md           | Recuperación de contexto         |
| 09        | AI_Task_Template.md           | Template de tarea IA             |
| 10        | Classify_Task.md              | Auto-clasificación               |
| 11        | AGENTS.md                     | Sistema de agentes               |

---

### 02_Marvel — Avengers (8 workflows)

| #         | Workflow                 | Función             |
|-----------|--------------------------|---------------------|
| 01        | Iron_Man_Gen.md          | Bootstrap           |
| 02        | Spider_Brainstorm.md     | Ideation            |
| 03        | Professor_X_Plan.md      | Planning            |
| 04        | Vision_Review.md         | Strategy review     |
| 05        | Thor_Work.md             | Implementation      |
| 06        | Hulk_Compound.md         | Compounding         |
| 07        | AntMan_Lfg_Lite.md       | Lite autonomous     |
| 08        | Doc_Strange_Lfg.md       | Full autonomous     |

---

### 03_Gentleman — UX & Docs (2 workflows)

| #         | Workflow                 | Función               |
|-----------|--------------------------|-----------------------|
| 10        | Frontend_Premium.md      | Design system         |
| 20        | Redaccion_de_Docs.md     | Technical writing     |

---

### 04_Hillary — Life OS (2 workflows)

| #         | Workflow               | Función           |
|-----------|------------------------|-------------------|
| 15        | Captura_Rapida.md      | Quick capture     |
| 25        | Hillary_Life_OS.md     | Full life OS      |

---

### 05_Compound_Engineering — Technical (4 workflows)

| #         | Workflow                 | Función          |
|-----------|--------------------------|------------------|
| 16        | Deep_Work_Session.md     | Focus work       |
| 17        | Ship_It.md               | Shipping         |
| 18        | Anthropic_Harness.md     | Eval harness     |
| 19        | Multi_Agent_Roles.md     | Multi-agent      |

---

## RULES — 11 archivos .mdc

**Ubicación:** `01_Personal_Os/01_Core/01_Rules/`

| #         | Rule                         | Propósito                           |
|-----------|------------------------------|-------------------------------------|
| 00        | Core_Protocol.mdc            | Protocolo central del OS            |
| 01        | Pilares_Sistema.mdc          | 4 pilares del sistema               |
| 02        | Motor_Agent.mdc              | Motor agentic                       |
| 03        | Protocolos_Ejecucion.mdc     | Protocolos de ejecución             |
| 04        | Observabilidad.mdc           | Logging y métricas                  |
| 05        | Reporting.mdc                | Reglas de reporte                   |
| 06        | Contexto_Gestion.mdc         | Gestión de contexto                 |
| 07        | Docs_Guias.mdc               | Guías de documentación              |
| 08        | Token_Economy.mdc            | Optimización de tokens              |
| 09        | Agent_Teams_Protocol.mdc     | Protocolo multi-agente              |
| 10        | Git_Directions.mdc           | Flujo y reglas Git ← NUEVO v3.1     |

---

## TOOLS — ESTRUCTURA

### 01_Agents (52+ agents)

**Ubicación:** `01_Personal_Os/01_Core/02_Tools/01_Agents/`

| Categoría                    | Agents       | Detalles                                                                                                                                                                        |
|------------------------------|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Orchestrator**             | 1            | `00_Orchestrator.md`                                                                                                                                                            |
| **Scope Architect**          | 1            | `01_Scope_Rule_Architect.md`                                                                                                                                                    |
| **Dream Team**               | 5            | `01_Dream_Team/` (Product, Data, Marketing, Design, Platform)                                                                                                                   |
| **Specialists Compound**     | 24           | `02_Specialists_Compound/` (review, architecture, framework, data, quality, security, research)                                                                                 |
| **Growth**                   | N            | `03_Growth/`                                                                                                                                                                    |
| **Contexto**                 | N            | `04_Contexto/`                                                                                                                                                                  |
| **Marca**                    | N            | `05_Marca/`                                                                                                                                                                     |
| **Plantillas**               | N            | `06_Plantillas/`                                                                                                                                                                |
| **Individuales**             | 12           | TDD, React Test, React Mentor, Security Auditor, Git Workflow Manager, Accessibility, PRD, Design SOP, AIPM Judge, Carousel, Workflow Orchestrator, LFG Autonomous, Hillary     |

---

### 02_Skills — 11 ÁREAS ACTIVAS (299 skills)

**Ubicación:** `01_Personal_Os/01_Core/02_Tools/02_Skills/`

| Área                        | Propósito                                        |
|-----------------------------|--------------------------------------------------|
| 00_Compound_Engineering     | Core CE — SDD + Reviews                          |
| 00_Personal_Os_Stack        | Stack base del OS + Gcierr                       |
| 00_Skill_Auditor            | Auditoría de skills                              |
| 01_Creacion_Contenidos      | Brand, YouTube, SEO, Carruseles                  |
| 02_Diseno_Ui_Ux             | Product Design, UI/UX, Taste, Minimal            |
| 03_Video_Media              | Video Intel, James Cameron, Remotion, Audio      |
| 04_Automatizacion           | N8N, Firecrawl                                   |
| 05_Workflows                | Agent Teams, PM, Orchestrator                    |
| 06_Tools                    | Skill Creator, Testing, DevOps, Data Analyst     |
| 07_Personal_Os              | Life OS, Hillary, Rituales                       |
| 08_Invictus_Web             | Playwright, Superpowers, Browser Automation      |

> ℹ️ `09_Legacy_Archive` → archivado en `01_Personal_Os/05_Archive/` (no es área activa)

---

### Personal Life OS — 07_Personal_Os/

| Skill               | Trigger                       | Función                   |
|---------------------|-------------------------------|---------------------------|
| Quick Capture       | "capture", "quick add"        | Captura de ideas          |
| Plan My Day         | "plan my day", "plan día"     | Planificación diaria      |
| Daily Notes         | "daily notes", "log this"     | Log de actividades        |
| Recording Mode      | "record", "transcribe"        | Transcripción             |
| Returns Tracker     | "create skill from"           | Detección de patrones     |

---

## CONEXIONES CORE

```
┌─────────────────────────────────────────────────────────────┐
│                        01_Core                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Workflows  │───▶│    Rules     │───▶│    Tools     │  │
│  │  (27+ files) │    │  (11 .mdc)   │    │ (299 skills) │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                   │                   │          │
│         │                   │                   │          │
│         ▼                   ▼                   ▼          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Personal   │    │  Compound    │    │   Hillary    │  │
│  │     OS       │    │  Engineering │    │   (Tasks)    │  │
│  │  (11 wf)     │    │  (52+ agents)│    │  (Life OS)   │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## INTEGRACIÓN CON OTRAS METODOLOGÍAS

| Metodología              | Conexión en 01_Core                                                            |
|--------------------------|--------------------------------------------------------------------------------|
| Gentleman                | `03_Gentleman/` workflows, `gentleman-*` skills                                |
| Compound Engineering     | `05_Compound_Engineering/` + `02_Tools/01_Agents/02_Specialists_Compound/`     |
| Hillary                  | `04_Hillary/` + `03_Task/` (fuera de 01_Core)                                  |
| Sistema Recursivo        | `07_System_Health_Audit.md` en workflows                                       |
| Learning Always          | Integrada en todos los workflows via Engram                                    |
| JARVIS 3.1               | `04_Operations/02_Agent_Teams_Lite/00_Manifest/` (7 manifests)                 |

---

## RESUMEN 01_Core — v3.1

| Componente                 | Cantidad       | Delta vs v2.0              |
|----------------------------|----------------|----------------------------|
| Workflows Totales          | 27+            | +2                         |
| Rules (.mdc)               | 11             | +1 (10_Git_Directions)     |
| Agents                     | 52+            | +17                        |
| Agents Dream Team          | 5              | =                          |
| Agents Specialists         | 24             | +1                         |
| Skills (áreas activas)     | 11             | +2                         |
| Skills (count total)       | 299            | +199                       |
| MCPs Claude Code           | 35             | +2                         |
| HUBs Scripts               | 23             | +9                         |
| JARVIS Manifests           | 7              | NEW                        |

**Estado: ✅ PURE GREEN — PersonalOS v3.1 JARVIS Integrated**

---

*PersonalOS v3.1 Consequences — PURE GREEN | 2026-04-28*
