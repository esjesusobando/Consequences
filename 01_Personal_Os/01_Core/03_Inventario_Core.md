# INVENTARIO CORE — PersonalOS v4.7 Consequences

> **Fecha:** 2026-05-22
> **Path:** `01_Personal_Os/01_Core/`
> **Versión:** v4.7 Consequences — Boot Protocol强化, Dependency Modernization
> **Estado:** ✅ PURE GREEN

---

## ESTRUCTURA DE 01_Core

```
01_Core/
├── README.md                     ← Índice central
├── INVENTARIO_CORE.md           ← Este archivo (v4.7)
├── 00_Comandos_Workflows.md     ← Comandos y HUBs
├── 01_Inventario_Total.md       ← Inventario completo del OS
├── 02_Dream_Team.md             ← Estructura del equipo
├── Requirements.txt              ← Dependencias Python
├── 00_Workflows_Os/            ← 30 workflows (7 categorías)
├── 01_Rules/                   ← 12 archivos .mdc (00-11)
└── 02_Tools/
    ├── README.md
    ├── 01_Agents/             ← 46 agents (Dream + Specialists + Individuales + Growth)
    ├── 02_Skills/             ← 394 skills (12 áreas activas)
    ├── 03_Mcp/                ← MCP servers (backup de config)
    ├── 04_Integrations/       ← Fireflies, Granola
    ├── 05_Hooks/              ← 10 hooks (6 fases)
    ├── 06_Plugins/            ← Plugins del OS
    ├── 07_Server/             ← Engram server
    ├── 08_Evals/              ← Evaluaciones
    └── 09_Templates/          ← Templates
```

---

## WORKFLOWS — 30 archivos en 7 categorías

### 00_Learning_Always — Continuous Learning

| # | Workflow | Función |
|---|----------|---------|
| 00 | Continuo | Learning permanente del sistema |

### 01_Personal_Os — Ritmos Core (4 workflows)

| # | Workflow | Función |
|---|----------|---------|
| 01 | Morning_Standup.md | Planificación diaria |
| 02 | Backlog_Processing.md | Triage del inbox |
| 03 | Content_Generation.md | Creación de contenido |
| 04 | Weekly_Review.md | Revisión estratégica semanal |

### 02_Marvel — Avengers (4+ workflows) 🔥

| # | Workflow | Función |
|---|----------|---------|
| 01 | Iron_Man_Gen.md | **Bootstrap / Genesis** (boot protocol强化) |
| 02 | Spider_Brainstorm.md | Ideation |
| 03 | Thor_Work.md | Implementation |
| 04 | Hulk_Compound.md | Compounding |

### 03_Gentleman — UX & Docs (2 workflows)

| # | Workflow | Función |
|---|----------|---------|
| 10 | Frontend_Premium.md | Design system |
| 20 | Redaccion_de_Docs.md | Technical writing |

### 04_Hillary — Life OS (2 workflows)

| # | Workflow | Función |
|---|----------|---------|
| 15 | Captura_Rapida.md | Quick capture |
| 25 | Hillary_Life_OS.md | Full life OS |

### 05_Compound_Engineering — Technical (4 workflows)

| # | Workflow | Función |
|---|----------|---------|
| 16 | Deep_Work_Session.md | Focus work |
| 17 | Ship_It.md | Shipping |
| 18 | Anthropic_Harness.md | Eval harness |
| 19 | Multi_Agent_Roles.md | Multi-agent |

### 06_Youtube_Full_Video — Video Production

| # | Workflow | Función |
|---|----------|---------|
| - | Video production pipeline | Full video production |

---

## RULES — 12 archivos .mdc

**Ubicación:** `01_Personal_Os/01_Core/01_Rules/`

| # | Rule | Propósito |
|---|------|-----------|
| 00 | Core_Protocol.mdc | Protocolo central del OS |
| 01 | Pilares_Sistema.mdc | 4 pilares del sistema |
| 02 | Motor_Agent.mdc | Motor agentic |
| 03 | Protocolos_Ejecucion.mdc | Protocolos de ejecución |
| 04 | Observabilidad.mdc | Logging y métricas |
| 05 | Reporting.mdc | Reglas de reporte |
| 06 | Contexto_Gestion.mdc | Gestión de contexto |
| 07 | Docs_Guias.mdc | Guías de documentación |
| 08 | Token_Economy.mdc | Optimización de tokens |
| 09 | Agent_Teams_Protocol.mdc | Protocolo multi-agente |
| 10 | Git_Directions.mdc | Flujo y reglas Git |
| 11 | Minimax.mdc | Configuración Minimax |

---

## TOOLS — ESTRUCTURA

### 01_Agents (46 agents) ✅

| Categoría | Agents | Detalles |
|-----------|---------|-----------|
| **Orchestrator** | 1 | `00_Orchestrator.md` |
| **Scope Architect** | 1 | `01_Scope_Rule_Architect.md` |
| **Dream Team** | 5 | `01_Dream_Team/` (Product, Data, Marketing, Design, Platform) |
| **Specialists Compound** | 23 | `02_Specialists_Compound/` (review, architecture, framework, data, quality, security, research) |
| **Growth** | 5 | `03_Growth/` (Content Transformer, YouTube Script/Thumbnail/Title, Carousel) |
| **Individuales** | 13 | Orchestrator, Scope, TDD, React Test, React Mentor, Security, Git, Accessibility, PRD, Design SOP, AIPM Judge, Workflow Orchestrator, LFG, Hillary |

---

### 02_Skills — 12 ÁREAS ACTIVAS (394 skills) ✅

**Ubicación:** `01_Personal_Os/01_Core/02_Tools/02_Skills/`

| Área | Skills | Descripción |
|------|--------|-------------|
| 00_Compound_Engineering | 63 | Core CE — SDD + Reviews |
| 00_Personal_Os_Stack | 1 | Stack base del OS + Gcierr |
| 00_Skill_Auditor | 4 | Auditoría de skills |
| 01_Creacion_Contenidos | 38 | Brand, YouTube, SEO, Carruseles |
| 02_Diseno_Ui_Ux | 23 | Product Design, UI/UX, Taste, Minimal |
| 03_Video_Media | 6 | Video Intel, James Cameron |
| 04_Automatizacion | 21 | N8N, Firecrawl, GWS Client |
| 05_Workflows | 33 | Agent Teams, PM, Orchestrator |
| 06_Tools | 93 | Skill Creator, Testing, DevOps, Data Analyst |
| 07_Personal_Os | 29 | Life OS, Hillary, Rituales |
| 08_Invictus_Web | 14 | Playwright, Superpowers, Browser Automation |
| 09_Claude_Ads | 20 | Claude Ads & Promoted Content |

---

### 03_Mcp — MCPs (36 Claude / 36 OpenCode)

| MCP | Función |
|-----|---------|
| engram | Memory persistente |
| brave-search, exa, stackoverflow | Búsqueda |
| Notion, mcp-obsidian, obsidian-api | Notas |
| Playwright, chrome-devtools, eagle-mcp | Browser |
| context7, zai-mcp-server, github | AI & Code |
| supabase, Amplitude, supadata | Data |
| n8n-mcp, Linear | Workflow |
| fireflies, google-workspace | Communication |
| excalidraw-yctimlin, pencil | Design |
| docker, filesystem | DevOps |
| vercel, recall, TestSprite | Deploy |

---

### 05_Hooks — 10 hooks (6 fases)

| Fase | Hooks |
|------|-------|
| Pre_Tool | 2 |
| Post_Tool | 2 |
| Lifecycle | 2 |
| Sound | 1 |
| Harness | 2 |
| Post_Hulk | 1 |

---

## CONEXIONES CORE

```
┌─────────────────────────────────────────────────────────────┐
│                        01_Core                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Workflows  │───▶│    Rules     │───▶│    Tools     │  │
│  │  (29 files)  │    │  (12 .mdc)   │    │ (393 skills) │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                   │                   │          │
│         │                   │                   │          │
│         ▼                   ▼                   ▼          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Personal   │    │  Compound    │    │   Hillary    │  │
│  │     OS       │    │  Engineering │    │   (Tasks)    │  │
│  │  (4 wf)      │    │  (82 agents)│    │  (Life OS)   │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            🔥 BOOT PROTOCOL — IRON MAN GENESIS      │  │
│  │  Leer AGENTS → GOALS → BACKLOG → Rules → Iron_Man   │  │
│  │  → engram_mem_context → Process Notes → Tasks s/b   │  │
│  │  ⚠️ Sin lectura completa, NO hay respuesta           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## INTEGRACIÓN CON OTRAS METODOLOGÍAS

| Metodología | Conexión en 01_Core |
|-------------|---------------------|
| Gentleman | `03_Gentleman/` workflows, `gentleman-*` skills |
| Compound Engineering | `05_Compound_Engineering/` + `02_Tools/01_Agents/02_Specialists_Compound/` |
| Hillary | `04_Hillary/` + `03_Task/` |
| Sistema Recursivo | `System_Health_Audit.md` en workflows |
| Learning Always | Integrada en todos los workflows via Engram |
| JARVIS 4.5 | `04_Operations/02_Agent_Teams_Lite/00_Manifest/` (7 manifests) |

---

## RESUMEN 01_Core — v4.7 Consequences

| Componente | Cantidad | Delta vs v3.1 |
|------------|----------|---------------|
| Workflows Totales | 30 | +3 |
| Rules (.mdc) | 12 | +1 (11_Minimax) |
| Agents | 46 | -6 |
| Agents Dream Team | 5 | = |
| Agents Specialists | 23 | = |
| Skills (áreas activas) | 12 | +1 |
| Skills (count total) | 394 | +95 |
| MCPs Claude Code | 36 | +1 |
| HUBs Scripts | 19 | -4 |
| JARVIS Manifests | 7 | = |
| Hooks | 10 | NEW |

---

## 🔥 BOOT PROTOCOL — IRON MAN GENESIS (v4.7)

Al iniciar sesión, la IA ejecuta EXACTAMENTE:

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

*PersonalOS v4.7 Consequences — PURE GREEN | 2026-05-23*
*Skills: 394 | Agents: 46 | MCPs: 36 | HUBs: 19 | Workflows: 30*