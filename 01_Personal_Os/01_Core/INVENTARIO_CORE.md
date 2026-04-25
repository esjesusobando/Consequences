# INVENTARIO CORE — PersonalOS v2.0 Consequences

> **Fecha:** 2026-04-24
> **Path:** `01_Personal_Os/01_Core/`
> **Estado:** ✅ OPERATIVO

---

## ESTRUCTURA DE 01_Core

```
01_Core/
├── README.md                     ← Índice central
├── INVENTARIO_CORE.md           ← Este archivo
├── Requirements.txt              ← Dependencias
├── 00_Workflows_Os/            ← 5 categorías de workflows
├── 01_Rules/                   ← 10 archivos .mdc
└── 02_Tools/
    ├── README.md
    ├── 01_Agents/             ← 35+ agents
    ├── 02_Skills/             ← 100+ skills (9 áreas)
    ├── 03_Mcp/                ← MCP servers
    ├── 05_Hooks/              ← Hooks calidad
    ├── 06_Plugins/            ← Plugins
    ├── 07_Server/             ← Engram server
    ├── 08_Evals/              ← Evaluations
    └── 09_Templates/          ← Templates
```

---

## WORKFLOWS — 25 archivos en 5 categorías

### 01_Personal_Os — Ritmos Core (11 workflows)

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

### 02_Marvel — Avengers (8 workflows)

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

### 03_Gentleman — UX & Docs (2 workflows)

| # | Workflow | Función |
|:---:|:---------|:---------|
| 10 | Frontend_Premium.md | Design system |
| 20 | Redaccion_de_Docs.md | Technical writing |

---

### 04_Hillary — Life OS (2 workflows)

| # | Workflow | Función |
|:---:|:---------|:---------|
| 15 | Captura_Rapida.md | Quick capture |
| 25 | Hillary_Life_OS.md | Full life OS |

---

### 05_Compound_Engineering — Technical (4 workflows)

| # | Workflow | Función |
|:---:|:---------|:---------|
| 16 | Deep_Work_Session.md | Focus work |
| 17 | Ship_It.md | Shipping |
| 18 | Anthropic_Harness.md | Eval harness |
| 19 | Multi_Agent_Roles.md | Multi-agent |

---

## RULES — 10 archivos .mdc

| # | Rule | Propósito |
|:---:|:-----|:----------|
| 00 | Core_Protocol.mdc | Protocolo central |
| 01 | Pilares_Sistema.mdc | 4 pilares OS |
| 02 | Motor_Agent.mdc | Motor agentic |
| 03 | Protocolos_Ejecucion.mdc | Execution protocols |
| 04 | Observabilidad.mdc | Logging y metrics |
| 05 | Reporting.mdc | Reporting rules |
| 06 | Contexto_Gestion.mdc | Context management |
| 07 | Docs_Guias.mdc | Documentation |
| 08 | Token_Economy.mdc | Token optimization |
| 09 | Agent_Teams_Protocol.mdc | Multi-agent |

---

## TOOLS — ESTRUCTURA

### 01_Agents (35+ agents)

| Categoría | Agents |
|:---------|:-------|
| **Orchestrator** | 00_Orchestrator.md |
| **Scope** | 01_Scope_Rule_Architect.md |
| **Dream Team** | 01_Dream_Team/ (5 agents) |
| **Specialists Compound** | 02_Specialists_Compound/ (23 agents) |
| **Individuals** | TDD_Test_First, React_Test_Implementer, React_Mentor, Security_Auditor, Git_Workflow_Manager, Accessibility_Auditor, PRD_Dashboard_Template, Design_SOP_Document, AIPM_Judge, Carousel_Strategist |

---

### 02_Skills — 9 ÁREAS FUNCIONALES

| Área | Skills | Propósito |
|:-----|:------:|:----------|
| 00_Compound_Engineering | 1+ | SDD + Reviews |
| 01_Creacion_Contenidos | 7 | Marketing, SEO, Video |
| 02_Diseno_Ui_Ux | 3 | Design, Taste |
| 03_Video_Media | 1 | James Cameron |
| 04_Automatizacion | 4 | N8N, GWS |
| 05_Workflows | 2 | Teams, PM |
| 06_Tools | 1 | MCP Client |
| 07_Personal_Os | 1 | Life OS |
| 08_Invictus_Web | 1 | Superpowers |

---

### Personal Life OS — 18_Personal_Life_OS

| Skill | Trigger | Función |
|:------|:--------|:---------|
| Quick Capture | "capture", "quick add" | Capture ideas |
| Plan My Day | "plan my day", "plan día" | Daily planning |
| Daily Notes | "daily notes", "log this" | Activity log |
| Recording Mode | "record", "transcribe" | Transcription |
| Returns Tracker | "create skill from" | Pattern detection |

---

## CONEXIONES CORE

```
┌─────────────────────────────────────────────────────────────┐
│                      01_Core                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Workflows  │───▶│    Rules    │───▶│    Tools    │  │
│  │  (25 files)  │    │  (10 .mdc)  │    │ (100+ skills)│  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                   │                   │          │
│         │                   │                   │          │
│         ▼                   ▼                   ▼          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Personal   │    │  Compound   │    │   Hillary   │  │
│  │     OS        │    │  Engineering │    │   (Tasks)   │  │
│  │  (11 wf)     │    │  (35+ agents)│    │  (Life OS)  │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## INTEGRACIÓN CON OTRAS METODOLOGÍAS

| Metodología | Conexión en 01_Core |
|:------------|:---------------------|
| Gentleman | `03_Gentleman/` workflows, `gentleman-*` skills |
| Compound Engineering | `05_Compound_Engineering/` + `02_Tools/01_Agents/02_Specialists_Compound/` |
| Hillary | `04_Hillary/` + `03_Task/` (fuera de 01_Core) |
| Sistema Recursivo | `07_System_Health_Audit.md` en workflows |
| Learning Always | Integrada en todos los workflows |

---

## RESUMEN 01_Core

| Componente | Cantidad |
|:-----------|:---------|
| Workflows Totales | 25 |
| Rules (.mdc) | 10 |
| Agents | 35+ |
| Skills (áreas) | 9 |
| Skills (Life OS) | 5 |

**Estado: ✅ TODO INTEGRADO Y OPERATIVO**

---

*Generated: 2026-04-24*
