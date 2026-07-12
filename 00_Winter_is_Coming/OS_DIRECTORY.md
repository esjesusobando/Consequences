# 🤖 PERSONALOS — DIRECTORIO MAESTRO (JARVIS)

**v5.0.2+** | 2026-07-12 — Root Cleanup, Every Trigger Pipeline, y fixes ZC

---

## 🚨 ESTADO DEL SISTEMA

| Componente       | Total                                       | Estado                                 |
| ---------------- | ------------------------------------------- | -------------------------------------- |
| Auto-Improvement | 🔄 Activo cada 8h (Task Scheduler)           | ✅ 29+ días autónomo — 6 fixers         |
| Capital Token    | 🌕 Fase 1 Foundation — 10_Shared_Org/        | ✅ 1 playbook, 1 ADR, 3 agent templates |
| MCPs root        | **11** (en .mcp.json)                       | ⚠️ Engram CAÍDO (timeout)              |
| MCPs backup      | **4** (2 JSON + 3 subdirs en 03_Mcp/)       | ✅ VERIFIED                             |
| Every CE         | v3.8.4 (local repo)                         | ✅ ACTIVE — Local version               |
| gentle-ai        | v1.30.6                                     | ✅ AVAILABLE                            |
| Skills           | **429** (16 áreas funcionales en 02_Skills) | ✅ VERIFIED — 0 sin frontmatter         |
| Agentes          | **85** (source)                             | ✅ SYNCED                               |
| HUBs             | **44** funcionales (en 03_Scripts_Os)       | ✅ VERIFIED                             |
| Scripts totales  | **241** (.py en Scripts_Os/ y subdirs)      | ✅ DOCUMENTED                           |
| Workflows        | **31**                                      | ✅ VERIFIED                             |
| Rules            | **15 (.mdc)** en 01_Rules                   | ✅ DEFINED                              |
| Hooks            | **9** (.py en 05_Hooks/) [MAY DRIFT]        | ✅ ACTIVE                               |
| JARVIS Manifests | 7 en 00_Manifest/                           | ✅ VALIDATED                            |
| Open Design      | 62 creative skills + 138 design systems     | ✅ INTEGRATED                           |

> **🟢 ÚLTIMA AUDITORÍA:** 2026-07-12 — v5.0.2+ — Root Cleanup + Every Trigger Pipeline
> Skills: 429. HUBs: 44. Workflows: 31. Rules: 15. Scripts: 241. Agentes: 85. Hooks: 9.

---

## 🆕 v5.0 Changes (2026-07-10)

1. **HyperFrames Suite**: 17 nuevas skills en 03_Video_Media
2. **Equipo Strong MKT**: 7 nuevos agentes en Playground
3. **Full Project Audit**: Conteo completo de agentes (85 source), workflows (31), HUBs (44), scripts (241)
4. **Zero Consequences Fix**: TypeScript strictness, ErrorBoundary fixes para React 19, y @imgly exclude WASM
5. **Rules Update**: 15_Graphify.mdc añadida (total 15)

## 🧹 v5.0.2+ Changes (2026-07-12)

1. **Root Cleanup**: 8 items ejecutados — CLAUDE.marketing.md git mv a .claude/, openspec archive mergeado a .atl/, _sdd_backup movido a archive, excalidraw.log + .pytest_cache eliminados, .gitignore actualizado
2. **Every Trigger Pipeline**: ce:review → ce:compound → judgment-day completado (quality post-cambio)
3. **ZC Fixes**: `any` leak en googleAuth.ts fixeado (→ AuthUser), dead code en DashboardView.tsx removido
4. **Solution Doc**: `06_Solutions/logic-errors/path-traversal-sentinel-detection-2026-07-11.md` creado
5. **Nuevos directorios**: `.claude/skills/` (skills copy), `01_Personal_Os/06_Projects/05_Claude_Ads/`, `01_Personal_Os/07_Archive/03_Backups_Refs/01_Repos_Reference/03_Repos_Hyperframes/`

---

## 📍 UBICACIONES CRÍTICAS

| Recurso              | Path                                                  |
| -------------------- | ----------------------------------------------------- |
| **Skills (Sistema)** | `01_Personal_Os/00_Core/02_Tools/02_Skills/`          |
| **Agents**           | `01_Personal_Os/00_Core/02_Tools/01_Agents/`          |
| **Rules**            | `01_Personal_Os/00_Core/01_Rules/`                    |
| **HUBs**             | `01_Personal_Os/05_Scripts/00_HUBs/`                  |
| **Manifests**        | `01_Personal_Os/05_Scripts/02_Agent_Teams_Lite/00_Manifest/` |
| **Workflows**        | `01_Personal_Os/00_Core/00_Workflows/`                |
| **Skills Globales**  | `~/.config/opencode/skills/`                          |
| **Skills Locales**   | `.opencode/skills/`                                   |

---

## 🔧 HUBs JARVIS 4.5 — Comandos Canónicos

```bash
# regenerar 7 manifests JARVIS
python 01_Personal_Os/05_Scripts/00_HUBs/20_System_Mapper_Hub.py --scan

# health check
python 01_Personal_Os/05_Scripts/00_HUBs/17_Watchdog_Hub.py

# stats ASCII
python 01_Personal_Os/05_Scripts/00_HUBs/18_Telemetry_Hub.py --dashboard

# MCP drift
python 01_Personal_Os/05_Scripts/00_HUBs/15_MCP_Sync_Hub.py --report

# sync de agentes
python 01_Personal_Os/05_Scripts/00_HUBs/19_Agent_Sync_Hub.py
```

---

## 🗂️ ESTRUCTURA COMPLETA v5.0

```
Think_Different/
├── 00_Winter_is_Coming/          ✅ Goals, Backlog, AGENTS.md, CHANGELOG
├── 01_Personal_Os/               ✅ EL SISTEMA OPERATIVO
│   ├── 00_Core/                  ✅ Motor del OS (FUENTE DE VERDAD)
│   │   ├── 00_Workflows/     ✅ 30 workflows (8 categorías)
│   │   ├── 01_Rules/           ✅ 14 reglas .mdc
│   │   └── 02_Tools/
│   │       ├── 00_SDD/          ✅ SDD Registry + JARVIS manifests
│   │       ├── 01_Agents/         ✅ 63 agentes (9 categorías) [FIXED]
│   │       ├── 02_Skills/         ✅ 396 skills (15 áreas)
│   │       ├── 03_Mcp/           ✅ Backup MCP
│   │       ├── 04_Integrations/  ✅ Fireflies, Granola
│   │       ├── 05_Hooks/          ✅ 10 hooks (6 fases) [FIXED]
│   │       ├── 06_Plugins/        ✅ Plugins OS
│   │       ├── 07_Server/         ✅ MCP Server
│   │       ├── 08_Evals/          ✅ Evaluadores
│   │       └── 09_Templates/      ✅ Templates
│   ├── 01_Memory/                  ✅ Memoria LLM, Process Notes
│   ├── 02_Knowledge/              ✅ Base de conocimiento (estática)
│   ├── 03_Learning/               ✅ Conocimiento activo
│   │   ├── 00_Shared_Org/        ✅ Capital Token F1
│   │   ├── 01_Auto_Improvement/  ✅ Auto-mejora recursiva
│   │   ├── 02_Learning_Always/   ✅ Aprendizaje continuo
│   │   ├── 03_Content/           ✅ Creación de contenido
│   │   └── 04_Telemetry/         ✅ Telemetría y monitoreo
│   ├── 04_Tasks/     ✅ Tareas activas (YAML 100%)
│   ├── 05_Scripts/                 ✅ Scripts operativos
│   │   ├── 00_HUBs/              ✅ 39 HUBs — 163 scripts [FIXED]
│   │   └── 01_Installer/         ✅ Instalador del OS
│   ├── 06_Projects/                ✅ Proyectos activos
│   └── 07_Archive/                 ✅ Backups, snapshots, históricos
├── 02_Playground/                ✅ Zona de pruebas
│   └── Graphify_Out/            ✅ Knowledge graph (god nodes, communities)
├── 03_Resultado/                 ✅ Outputs de proyectos
├── .agent/                       ✅ Backup estratégico
├── .atl/                         ✅ SDD Registry + openspec/
├── .claude/                      ✅ Config Claude Code + rules
├── .opencode/                    ✅ Config OpenCode + skills locales
├── .mcp.json                     ✅ 11 MCPs root activos (ver 00_Core/02_Tools/03_Mcp/ para backup)
├── OS_DIRECTORY.md               ✅ Este archivo — JARVIS discovery
├── AGENTS.md                    ✅ GGA Pre-Commit entry
├── CLAUDE.md                    ✅ Config IAs (FUENTE)
└── README.md                    ✅ Documentación principal
```

---

## 🧠 SKILLS — 15 ÁREAS FUNCIONALES (396 skills)

| Área                    | Descripción                                          | Skills |
| ----------------------- | ---------------------------------------------------- | ------ |
| 00_Agent_Teams_Lite     | SDD sub-agentes + JARVIS manifests                   | 14     |
| 00_Compound_Engineering | Core CE — SDD + Compound Engineering                 | 63     |
| 00_Personal_Os          | Life OS, Hillary, Rituales                           | 24     |
| 00_Skill_Auditor        | Auditoría de skills                                  | 1      |
| 00_System_Core          | Stack base OS + Gcierr                               | 1      |
| 00_Workflows            | Workflows OS                                         | 39     |
| 01_Creacion_Contenidos  | Brand, YouTube, SEO, Marketing — 16 sub-áreas        | 52     |
| 02_Diseno_Ui_Ux         | Product Design, UI/UX, Taste, Minimal                | 34     |
| 03_Video_Media          | Video Intel, James Cameron                           | 11     |
| 04_Automatizacion       | N8N, Firecrawl, GWS Client                           | 27     |
| 05_Claude_Ads           | Claude Ads & Promoted Content                        | 21     |
| 06_Tools                | Skill Creator, Testing, DevOps, Data                 | 83     |
| 07_Invictus_Web         | Playwright, Superpowers, Browser Auto                | 18     |
| 08_JAO                  | Entrevistador, Humanizador, Optimizador, Superpowers | 7      |
| 10_Laia_Learning        | Sistema de aprendizaje personal                      | 1      |

> **Skill global destacada:** `claude-seo-ai` (Hainrixz) — `~/.config/opencode/skills/claude-seo-ai/` — 5 sub-skills: audit, fix, geo, score, seo-orchestrator. Auditoría SEO + AI Visibility.

---

## 📊 MCPs — 11 SERVIDORES ROOT ACTIVOS

Configurados en `.mcp.json` (raíz del proyecto). **11 servidores root activos** + 4 configs de backup en `03_Mcp/`.

| Categoría       | Servidores                     |
| --------------- | ------------------------------ |
| 🔍 Research      | context7                       |
| 🧠 Memory        | aim-memory-bank                |
| 📝 Notes         | obsidian-mcp                   |
| 🌐 Browser       | (via Playwright en .opencode/) |
| 🤖 AI & Code     | @magicuidesign/mcp             |
| 🖼️ Image        | higgsfield, magnific           |
| 🎬 Video         | heygen                         |
| 📐 Design        | mobbin                         |
| 💬 Communication | google-workspace               |
| 🔗 Integration   | eagle                          |

> **Nota:** La lista anterior de 36 MCPs incluía MCPs configurados en `~/.config/opencode/opencode.json` (OpenCode), no solo los del proyecto. Los 11 activos en `.mcp.json` son los de este proyecto específico.

---

## ⚡ AGENTES — 76 CONFIGURADOS (8 categorías) [MAY DRIFT]

| Categoría                          | Cantidad | Ubicación                                                              |
| ---------------------------------- | -------- | ---------------------------------------------------------------------- |
| Root (Orchestrator + Template)     | 26       | Raíz `01_Agents/` (00_Template, 00_Orchestrator, 01-22 + README)       |
| Dream Team                         | 7        | `01_Dream_Team/` (Product, Data, Marketing, Design, Platform + README) |
| Specialists Compound               | 24       | `02_Specialists_Compound/` (24 archivos .md + README)                  |
| Growth                             | 6        | `03_Growth/` (Content Transformer → Carousel + README)                 |
| OS Conductor                       | 9        | `00_OS_Conductor/` (SKILL.md, registry, unified registry + 6 refs)     |
| ATL Gen                            | 13       | `07_Agent_Teams_Lite_Gen/` (SDD sub-agentes 01-09 + 4 shared)          |
| Agent Teams Lite                   | 3        | `00_Agent_Teams_Lite/` (AGENTS.md, README.md, skills/sdd-apply/)       |
| Legacy (Contexto/Marca/Plantillas) | 5        | `04_Contexto/, 05_Marca/, 06_Plantillas/` (LEEME + README)             |

> ⚠️ Conteo incluye todos los .md hasta profundidad 2, incluyendo README/LEEME. El número exacto puede variar. Verificado 2026-06-27.

---

## 🎯 HUBs — 32 SCRIPTS/DIRECTORIOS TOTALES

### HUBs Principales (en raíz de 05_Scripts/00_HUBs/)

| #  | Hub               | Script                        | Propósito                      |
| --- | ----------------- | ----------------------------- | ------------------------------ |
| 00 | Sound Engine      | `00_Sound_Engine.py`          | Notificaciones sonoras         |
| 01 | Auditor           | `01_Auditor_Hub.py`           | Auditorías del sistema         |
| 02 | Git               | `02_Git_Hub.py`               | Operaciones Git                |
| 03 | AIPM              | `03_AIPM_Hub.py`              | AI Performance Monitoring      |
| 04 | Ritual            | `04_Ritual_Hub.py`            | Rituales de sesión             |
| 05 | Validator         | `05_Validator_Hub.py`         | Validación de código           |
| 06 | Tool              | `06_Tool_Hub.py`              | Gestión de herramientas        |
| 07 | Integration       | `07_Integration_Hub.py`       | Integraciones MCP              |
| 08 | Workflow          | `08_Workflow_Hub.py`          | Automatización de workflows    |
| 09 | Data              | `09_Data_Hub.py`              | Procesamiento de datos         |
| 10 | General           | `10_General_Hub.py`           | Utilidades generales           |
| 11 | Auto Learn        | `11_Auto_Learn_Hub.py`        | Motor de automejora            |
| 14 | Health Metrics ★  | `14_Health_Metrics_Hub.py`    | Métricas de salud del OS       |
| 15 | MCP Sync ★        | `15_MCP_Sync_Hub.py`          | Sync drift Claude ↔ OpenCode   |
| 16 | Agent Mirror      | `16_Agent_Mirror_Hub.py`      | Mirror agentes source → backup |
| 17 | Watchdog ★        | `17_Watchdog_Hub.py`          | Health watchdog                |
| 18 | Telemetry ★       | `18_Telemetry_Hub.py`         | Dashboard de métricas          |
| 19 | Agent Sync        | `19_Agent_Sync_Hub.py`        | Sync .agent ↔ 00_Core          |
| 20 | System Mapper ★   | `20_System_Mapper_Hub.py`     | Genera 7 manifests JARVIS      |
| 25 | Minimax Optimizer | `25_Minimax_Optimizer_Hub.py` | Optimización MiniMax           |
| —  | HUB SOTA          | `HUB_SOTA.py`                 | HUB de HUBs SOTA               |

### Scripts Auxiliares

| #  | Script                             | Propósito                           |
| --- | ---------------------------------- | ----------------------------------- |
| 21 | `21_Legacy_Path_Cleanup.py`        | Limpia paths legacy v2.x            |
| 22 | `22_Validate_Skill_Frontmatter.py` | Detecta skills sin frontmatter YAML |
| 24 | `24_mass_path_migration.py`        | Migración masiva de paths           |
| 26 | `26_Parallel_Audit_Pro.py`         | Auditoría paralela avanzada         |
| 27 | `27_Skill_Auditor.py`              | Auditoría específica de skills      |
| 28 | `28_System_Health_Monitor.py`      | Monitor de salud del sistema        |
| 29 | `29_Repo_Sync_Auditor.py`          | Auditor de sincronización de repos  |
| 30 | `30_path_replacement.py`           | Reemplazo de paths en archivos      |

> ★ = HUB canónico JARVIS 4.5

---

## 🔗 QUICK ACCESS

```bash
# OS Directory (este archivo)
cat OS_DIRECTORY.md

# HUBs canónicos JARVIS
python 01_Personal_Os/05_Scripts/00_HUBs/20_System_Mapper_Hub.py --scan
python 01_Personal_Os/05_Scripts/00_HUBs/17_Watchdog_Hub.py
python 01_Personal_Os/05_Scripts/00_HUBs/18_Telemetry_Hub.py --dashboard
python 01_Personal_Os/05_Scripts/00_HUBs/15_MCP_Sync_Hub.py --report

# Skill registry
cat .atl/skill-registry.md

# JARVIS manifests
ls 01_Personal_Os/05_Scripts/02_Agent_Teams_Lite/00_Manifest/
```

---

## 🎨 TOP 5 DESIGN SKILLS

| Rank | Skill                | Valor | SOTA | Diseño | Total  |
| ---- | -------------------- | ----- | ---- | ------ | ------ |
| 🥇 1  | **Dumbledor Design** | 10    | 9    | 10     | **29** |
| 🥈 2  | **Huashu Design**    | 10    | 10   | 9      | **29** |
| 🥉 3  | **Ui Ux Pro Max**    | 9     | 8    | 9      | **26** |
| 4    | **Frontend Slides**  | 10    | 9    | 7      | **26** |
| 5    | **Design SOTA**      | 8     | 9    | 8      | **25** |

---

*Actualizado: 2026-07-12 | PersonalOS v5.0.2+ | 429 skills | 85 agents source | 44 HUBs | 31 workflows | 15 rules*