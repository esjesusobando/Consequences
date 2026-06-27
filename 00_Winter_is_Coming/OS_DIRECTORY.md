# 🤖 PERSONALOS — DIRECTORIO MAESTRO (JARVIS)

**v4.9.1** | 2026-06-27

---

## 🚨 ESTADO DEL SISTEMA

| Componente                          | Total                                                                  | Estado                                       |
|------------------------------------|-----------------------------------------------------------------------|---------------------------------------------|
| Auto-Improvement                    | 🔄 Activo cada 8h (Task Scheduler)                                     | ✅ 29+ días autónomo — 6 fixers              |
| Capital Token                       | 🌕 Fase 1 Foundation — 10_Shared_Org/                                  | ✅ 1 playbook, 1 ADR, 3 agent templates       |
| MCPs root                           | **11** (en .mcp.json)                                                  | ✅ SYNCED — drift 0                           |
| MCPs backup                         | **4** (2 JSON + 3 subdirs en 03_Mcp/)                                 | ✅ VERIFIED                                   |
| Every CE                            | v3.8.4 (local repo)                                                    | ✅ ACTIVE — Local version                     |
| gentle-ai                           | v1.30.6                                                                | ✅ AVAILABLE                                  |
| Skills                              | **396** (15 áreas funcionales)                                         | ✅ VERIFIED — 0 sin frontmatter               |
| Agentes                             | **76** (8 categorías) [MAY DRIFT]                                      | ✅ SYNCED                                     |
| HUBs                                | **32** directorios                                                     | ✅ VERIFIED                                   |
| Scripts totales                     | **167** (.py en Scripts_Os/ y subdirs)                                 | ✅ DOCUMENTED                                 |
| Workflows                           | **30** (8 categorías)                                                  | ✅ VERIFIED                                   |
| Rules                               | **14 (.mdc)** en 01_Rules                                              | ✅ DEFINED                                    |
| Hooks                               | **9** (.py en 05_Hooks/) [MAY DRIFT]                                  | ✅ ACTIVE                                     |
| JARVIS Manifests                    | 7 en 00_Manifest/                                                      | ✅ VALIDATED                                  |
| Open Design                         | 62 skills + 138 design systems                                         | ✅ INTEGRATED                                 |

> **🟢 ÚLTIMA AUDITORÍA:** 2026-06-27 — v4.9.1 — Full Project Audit + Count Corrections
> Skills: 396. HUBs: 32. Workflows: 30. Rules: 14. Scripts: 167. Agentes: 76. Hooks: 9.

---

## 🆕 v4.9.1 Changes (2026-06-27)

1. **🌕 Capital Token Fase 1**: `10_Shared_Org/` en Knowledge — 1 playbook, 1 ADR, 3 agent templates, MCP Bridge v0.1
2. **🔄 Auto-Improvement validado**: 29+ días autónomo, Task Scheduler cada 8h, 6 fixers reales
3. **Full Project Audit**: Conteo completo de agentes (76), workflows (30), HUBs (32), scripts (167), hooks (9)
4. **Count Corrections**: Todos los docs actualizados con valores verificados contra disco
5. **Skills verified**: 396 SKILL.md activas en 15 áreas funcionales — 0 sin frontmatter

---

## 📍 UBICACIONES CRÍTICAS

| Recurso                               | Path                                                                           |
|--------------------------------------|-------------------------------------------------------------------------------|
| **Skills (Sistema)**                  | `01_Personal_Os/01_Core/02_Tools/02_Skills/`                                   |
| **Agents**                            | `01_Personal_Os/01_Core/02_Tools/01_Agents/`                                   |
| **Rules**                             | `01_Personal_Os/01_Core/01_Rules/`                                             |
| **HUBs**                              | `01_Personal_Os/04_Operations/03_Scripts_Os/`                                  |
| **Manifests**                         | `01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/`                |
| **Workflows**                         | `01_Personal_Os/01_Core/00_Workflows_Os/`                                      |
| **Skills Globales**                   | `~/.config/opencode/skills/`                                                   |
| **Skills Locales**                    | `.opencode/skills/`                                                            |

---

## 🔧 HUBs JARVIS 4.5 — Comandos Canónicos

```bash
# regenerar 7 manifests JARVIS
python 01_Personal_Os/04_Operations/03_Scripts_Os/20_System_Mapper_Hub.py --scan

# health check
python 01_Personal_Os/04_Operations/03_Scripts_Os/17_Watchdog_Hub.py

# stats ASCII
python 01_Personal_Os/04_Operations/03_Scripts_Os/18_Telemetry_Hub.py --dashboard

# MCP drift
python 01_Personal_Os/04_Operations/03_Scripts_Os/15_MCP_Sync_Hub.py --report

# sync de agentes
python 01_Personal_Os/04_Operations/03_Scripts_Os/19_Agent_Sync_Hub.py
```

---

## 🗂️ ESTRUCTURA COMPLETA v4.9

```
Think_Different/
├── 00_Winter_is_Coming/          ✅ Goals, Backlog, AGENTS.md, CHANGELOG
├── 01_Personal_Os/               ✅ EL SISTEMA OPERATIVO
│   ├── 01_Core/                  ✅ Motor del OS (FUENTE DE VERDAD)
│   │   ├── 00_Workflows_Os/     ✅ 30 workflows (8 categorías)
│   │   ├── 01_Rules/           ✅ 14 reglas .mdc
│   │   └── 02_Tools/
│   │       ├── 01_Agents/         ✅ 76 agentes (8 categorías) [MAY DRIFT]
│   │       ├── 02_Skills/         ✅ 396 skills (15 áreas)
│   │       ├── 03_Mcp/           ✅ Backup MCP (2 JSON + 3 subdirs)
│   │       ├── 04_Integrations/  ✅ Fireflies, Granola
│   │       ├── 05_Hooks/          ✅ 9 hooks (6 fases) [MAY DRIFT]
│   │       ├── 06_Plugins/        ✅ Plugins OS
│   │       ├── 07_Server/         ✅ Engram server
│   │       ├── 08_Evals/          ✅ Evaluadores
│   │       └── 09_Templates/      ✅ Templates
│   ├── 02_Knowledge/              ✅ Base de conocimiento (10_Shared_Org/ — Capital Token F1)
│   ├── 03_Task/                   ✅ Tareas activas
│   └── 04_Operations/             ✅ Motor operativo
│       ├── 00_Context_LLM/        ✅ Memoria LLM
│       ├── 01_Auto_Improvement/  ✅ Auto-mejora recursiva
│       ├── 02_Agent_Teams_Lite/  ✅ SDD registry + 7 manifests
│       ├── 03_Scripts_Os/         ✅ 32 HUBs — 167 scripts [MAY DRIFT]
│       ├── 04_Installer/          ✅ Scripts de instalación
│       ├── 05_Projects/          ✅ Proyectos activos
│       └── 06_SOTA_Features/     ✅ Features SOTA
├── 02_Playground/                ✅ Zona de pruebas
│   └── Graphify_Out/            ✅ Knowledge graph (god nodes, communities)
├── 03_Resultado/                 ✅ Outputs de proyectos
├── .agent/                       ✅ Backup estratégico
├── .atl/                         ✅ SDD Registry + openspec/
├── .claude/                      ✅ Config Claude Code + rules
├── .opencode/                    ✅ Config OpenCode + skills locales
├── .mcp.json                     ✅ 11 MCPs root activos (ver 03_Mcp/ para backup)
├── OS_DIRECTORY.md               ✅ Este archivo — JARVIS discovery
├── AGENTS.md                    ✅ GGA Pre-Commit entry
├── CLAUDE.md                    ✅ Config IAs (FUENTE)
└── README.md                    ✅ Documentación principal
```

---

## 🧠 SKILLS — 15 ÁREAS FUNCIONALES (396 skills)

| Área                                         | Descripción                                               | Skills  |
|---------------------------------------------|----------------------------------------------------------|--------|
| 00_Agent_Teams_Lite                          | SDD sub-agentes + JARVIS manifests                        | 14      |
| 00_Compound_Engineering                      | Core CE — SDD + Compound Engineering                      | 63      |
| 00_Personal_Os                               | Life OS, Hillary, Rituales                                | 24      |
| 00_Skill_Auditor                             | Auditoría de skills                                       | 1       |
| 00_System_Core                               | Stack base OS + Gcierr                                    | 1       |
| 00_Workflows                                 | Workflows OS                                              | 39      |
| 01_Creacion_Contenidos                       | Brand, YouTube, SEO, Marketing — 16 sub-áreas             | 52      |
| 02_Diseno_Ui_Ux                              | Product Design, UI/UX, Taste, Minimal                     | 34      |
| 03_Video_Media                               | Video Intel, James Cameron                                | 11      |
| 04_Automatizacion                            | N8N, Firecrawl, GWS Client                                | 27      |
| 05_Claude_Ads                                | Claude Ads & Promoted Content                             | 21      |
| 06_Tools                                     | Skill Creator, Testing, DevOps, Data                      | 83      |
| 07_Invictus_Web                              | Playwright, Superpowers, Browser Auto                     | 18      |
| 08_JAO                                       | Entrevistador, Humanizador, Optimizador, Superpowers      | 7       |
| 10_Laia_Learning                             | Sistema de aprendizaje personal                           | 1       |

> **Skill global destacada:** `claude-seo-ai` (Hainrixz) — `~/.config/opencode/skills/claude-seo-ai/` — 5 sub-skills: audit, fix, geo, score, seo-orchestrator. Auditoría SEO + AI Visibility.

---

## 📊 MCPs — 11 SERVIDORES ROOT ACTIVOS

Configurados en `.mcp.json` (raíz del proyecto). **11 servidores root activos** + 4 configs de backup en `03_Mcp/`.

| Categoría                      | Servidores                                                                          |
|-------------------------------|------------------------------------------------------------------------------------|
| 🔍 Research                    | context7                                                                            |
| 🧠 Memory                       | aim-memory-bank                                                                     |
| 📝 Notes                        | obsidian-mcp                                                                        |
| 🌐 Browser                      | (via Playwright en .opencode/)                                                      |
| 🤖 AI & Code                    | @magicuidesign/mcp                                                                  |
| 🖼️ Image                        | higgsfield, magnific                                                                |
| 🎬 Video                        | heygen                                                                              |
| 📐 Design                       | mobbin                                                                              |
| 💬 Communication                | google-workspace                                                                    |
| 🔗 Integration                  | eagle                                                                               |

> **Nota:** La lista anterior de 36 MCPs incluía MCPs configurados en `~/.config/opencode/opencode.json` (OpenCode), no solo los del proyecto. Los 11 activos en `.mcp.json` son los de este proyecto específico.

---

## ⚡ AGENTES — 76 CONFIGURADOS (8 categorías) [MAY DRIFT]

| Categoría                               | Cantidad                  | Ubicación                                                                    |
|----------------------------------------|--------------------------|-----------------------------------------------------------------------------|
| Root (Orchestrator + Template)          | 26                        | Raíz `01_Agents/` (00_Template, 00_Orchestrator, 01-22 + README)            |
| Dream Team                              | 7                         | `01_Dream_Team/` (Product, Data, Marketing, Design, Platform + README)      |
| Specialists Compound                    | 24                        | `02_Specialists_Compound/` (24 archivos .md + README)                        |
| Growth                                  | 6                         | `03_Growth/` (Content Transformer → Carousel + README)                       |
| OS Conductor                            | 9                         | `00_OS_Conductor/` (SKILL.md, registry, unified registry + 6 refs)           |
| ATL Gen                                 | 13                        | `07_Agent_Teams_Lite_Gen/` (SDD sub-agentes 01-09 + 4 shared)                |
| Agent Teams Lite                        | 3                         | `00_Agent_Teams_Lite/` (AGENTS.md, README.md, skills/sdd-apply/)             |
| Legacy (Contexto/Marca/Plantillas)      | 5                         | `04_Contexto/, 05_Marca/, 06_Plantillas/` (LEEME + README)                   |

> ⚠️ Conteo incluye todos los .md hasta profundidad 2, incluyendo README/LEEME. El número exacto puede variar. Verificado 2026-06-27.

---

## 🎯 HUBs — 32 SCRIPTS/DIRECTORIOS TOTALES

### HUBs Principales (en raíz de 03_Scripts_Os/)

| #   | Hub                                      | Script                                                         | Propósito                                             |
|----|-----------------------------------------|---------------------------------------------------------------|------------------------------------------------------|
| 00  | Sound Engine                             | `00_Sound_Engine.py`                                           | Notificaciones sonoras                                |
| 01  | Auditor                                  | `01_Auditor_Hub.py`                                            | Auditorías del sistema                                |
| 02  | Git                                      | `02_Git_Hub.py`                                                | Operaciones Git                                       |
| 03  | AIPM                                     | `03_AIPM_Hub.py`                                               | AI Performance Monitoring                             |
| 04  | Ritual                                   | `04_Ritual_Hub.py`                                             | Rituales de sesión                                    |
| 05  | Validator                                | `05_Validator_Hub.py`                                          | Validación de código                                  |
| 06  | Tool                                     | `06_Tool_Hub.py`                                               | Gestión de herramientas                               |
| 07  | Integration                              | `07_Integration_Hub.py`                                        | Integraciones MCP                                     |
| 08  | Workflow                                 | `08_Workflow_Hub.py`                                           | Automatización de workflows                           |
| 09  | Data                                     | `09_Data_Hub.py`                                               | Procesamiento de datos                                |
| 10  | General                                  | `10_General_Hub.py`                                            | Utilidades generales                                  |
| 11  | Auto Learn                               | `11_Auto_Learn_Hub.py`                                         | Motor de automejora                                   |
| 14  | Health Metrics ★                         | `14_Health_Metrics_Hub.py`                                     | Métricas de salud del OS                              |
| 15  | MCP Sync ★                               | `15_MCP_Sync_Hub.py`                                           | Sync drift Claude ↔ OpenCode                          |
| 16  | Agent Mirror                             | `16_Agent_Mirror_Hub.py`                                       | Mirror agentes source → backup                        |
| 17  | Watchdog ★                               | `17_Watchdog_Hub.py`                                           | Health watchdog                                       |
| 18  | Telemetry ★                              | `18_Telemetry_Hub.py`                                          | Dashboard de métricas                                 |
| 19  | Agent Sync                               | `19_Agent_Sync_Hub.py`                                         | Sync .agent ↔ 01_Core                                 |
| 20  | System Mapper ★                          | `20_System_Mapper_Hub.py`                                      | Genera 7 manifests JARVIS                             |
| 25  | Minimax Optimizer                        | `25_Minimax_Optimizer_Hub.py`                                  | Optimización MiniMax                                  |
| —   | HUB SOTA                                 | `HUB_SOTA.py`                                                  | HUB de HUBs SOTA                                      |

### Scripts Auxiliares

| #   | Script                                           | Propósito                                                      |
|----|-------------------------------------------------|---------------------------------------------------------------|
| 21  | `21_Legacy_Path_Cleanup.py`                      | Limpia paths legacy v2.x                                       |
| 22  | `22_Validate_Skill_Frontmatter.py`               | Detecta skills sin frontmatter YAML                            |
| 24  | `24_mass_path_migration.py`                      | Migración masiva de paths                                      |
| 26  | `26_Parallel_Audit_Pro.py`                       | Auditoría paralela avanzada                                    |
| 27  | `27_Skill_Auditor.py`                            | Auditoría específica de skills                                 |
| 28  | `28_System_Health_Monitor.py`                    | Monitor de salud del sistema                                   |
| 29  | `29_Repo_Sync_Auditor.py`                        | Auditor de sincronización de repos                             |
| 30  | `30_path_replacement.py`                         | Reemplazo de paths en archivos                                 |

> ★ = HUB canónico JARVIS 4.5

---

## 🔗 QUICK ACCESS

```bash
# OS Directory (este archivo)
cat OS_DIRECTORY.md

# HUBs canónicos JARVIS
python 01_Personal_Os/04_Operations/03_Scripts_Os/20_System_Mapper_Hub.py --scan
python 01_Personal_Os/04_Operations/03_Scripts_Os/17_Watchdog_Hub.py
python 01_Personal_Os/04_Operations/03_Scripts_Os/18_Telemetry_Hub.py --dashboard
python 01_Personal_Os/04_Operations/03_Scripts_Os/15_MCP_Sync_Hub.py --report

# Skill registry
cat .atl/skill-registry.md

# JARVIS manifests
ls 01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/
```

---

## 🎨 TOP 5 DESIGN SKILLS

| Rank  | Skill                                   | Valor  | SOTA  | Diseño  | Total  |
|------|----------------------------------------|-------|------|--------|-------|
| 🥇 1   | **Dumbledor Design**                    | 10     | 9     | 10      | **29** |
| 🥈 2   | **Huashu Design**                       | 10     | 10    | 9       | **29** |
| 🥉 3   | **Ui Ux Pro Max**                       | 9      | 8     | 9       | **26** |
| 4     | **Frontend Slides**                     | 10     | 9     | 7       | **26** |
| 5     | **Design SOTA**                         | 8      | 9     | 8       | **25** |

---

*Actualizado: 2026-06-27 | PersonalOS v4.9.1 — Full Project Audit + Count Corrections | 396 skills | 76 agents [MAY DRIFT] | 32 HUBs | 30 workflows | 14 rules | 9 hooks [MAY DRIFT]*
