# 🤖 PERSONALOS — DIRECTORIO MAESTRO (JARVIS)

**v4.1** | 2026-05-18

---

## 🚨 ESTADO DEL SISTEMA

| Componente                            | Total                                                               | Estado                                         |
|--------------------------------------|--------------------------------------------------------------------|-----------------------------------------------|
| MCPs Claude Code                      | **35**                                                              | ✅ OPERATIONAL                                  |
| Every CE                              | v2.55.0 (local repo) ✅                                              | ✅ ACTIVE — Local version                       |
| gentle-ai                             | v1.26.6                                                             | ✅ AVAILABLE                                    |
| Skills                                | **343** (12 áreas funcionales)                                      | ✅ VERIFIED — 0 sin frontmatter                 |
| Agentes                               | **58+** (22 archivos en 01_Agents + subdirs)                        | ✅ ACTIVE                                       |
| HUBs                                  | **31 scripts** (26 HUBs + 5 utility)                                | ✅ VERIFIED                                     |
| Workflows                             | **29+** (7 categorías en 00_Workflows_Os)                           | ✅ ACTIVE                                       |
| Hooks                                 | 6 categorías                                                         | ✅ ACTIVE                                       |
| Rules                                 | **12 (.mdc)** en 01_Rules                                           | ✅ DEFINED                                      |
| JARVIS Manifests                      | 7 en 00_Manifest/                                                   | ✅ VALIDATED                                    |
| Open Design                           | 62 skills + 138 design systems                                      | ✅ INTEGRATED                                   |

> **🟢 ÚLTIMA AUDITORÍA:** 2026-05-18 — v4.1 Bugs Corregidos
> config_paths.py (3 paths rotos), .mcp.json (2 duplicados eliminados), conteos sincronizados con disco

---

## 🆕 v4.0 Cambios desde v3.2

1. **Every CE v2.55.0** — Usando versión local del repo
2. **gentle-ai v1.26.6** — Latest Gentleman Programming tools
3. **Naming conventions** — Fixes aplicados a todos los folders/files
4. **Reports consolidated** — Auditoría paths corregidos
5. **Git state clean** — Pushed and synced with origin

## 📍 UBICACIONES CRÍTICAS

| Recurso                                   | Path                                                                               |
|------------------------------------------|-----------------------------------------------------------------------------------|
| **Skills (Sistema)**                      | `01_Personal_Os/01_Core/02_Tools/02_Skills/`                                       |
| **Agents**                                | `01_Personal_Os/01_Core/02_Tools/01_Agents/`                                       |
| **Rules**                                 | `01_Personal_Os/01_Core/01_Rules/`                                                 |
| **HUBs**                                  | `01_Personal_Os/04_Operations/03_Scripts_Os/`                                      |
| **Manifests**                             | `01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/`                    |
| **Workflows**                             | `01_Personal_Os/01_Core/00_Workflows_Os/`                                          |
| **Skills Globales**                       | `~/.config/opencode/skills/`                                                       |
| **Skills Locales**                        | `.opencode/skills/`                                                                |

---

## 🔧 HUBs JARVIS 4.0 — Comandos Canónicos

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

## 🗂️ ESTRUCTURA COMPLETA v4.0

```
Think_Different/                         # RAÍZ
├── 00_Winter_is_Coming/          ✅ Goals, Backlog, AGENTS.md, CHANGELOG
├── 01_Personal_Os/               ✅ EL SISTEMA OPERATIVO
│   ├── 01_Core/                  ✅ Motor del OS (FUENTE DE VERDAD)
│   │   ├── 00_Workflows_Os/     ✅ 28 workflows (5 categorías)
│   │   ├── 01_Rules/            ✅ 11 reglas .mdc
│   │   └── 02_Tools/
│   │       ├── 01_Agents/         ✅ 52+ agentes (Dream Team + Specialists + individuales)
│   │       ├── 02_Skills/         ✅ 341 skills (12 áreas funcionales)
│   │       ├── 03_Mcp/           ✅ Backup MCP configs
│   │       ├── 04_Integrations/  ✅ Fireflies, Granola
│   │       ├── 05_Hooks/          ✅ Pre/Post/Lifecycle/Sound
│   │       ├── 06_Plugins/        ✅ Plugins OS
│   │       ├── 07_Server/         ✅ Engram server
│   │       ├── 08_Evals/          ✅ Evaluadores
│   │       └── 09_Templates/      ✅ Templates
│   ├── 02_Knowledge/              ✅ Base de conocimiento
│   │   ├── 00_Examples_Personal_Os/
│   │   ├── 01_Research_Os/
│   │   ├── 02_Research/
│   │   ├── 03_Writing_Content/
│   │   ├── 04_Docs/
│   │   ├── 05_Aipm/
│   │   ├── 06_Unicorn/
│   │   ├── 07_Invictus/
│   │   ├── 08_Templates/
│   │   └── README.md
│   ├── 03_Task/                   ✅ Tareas activas
│   │   ├── 00_P0_Auditoria.md/
│   │   ├── 01_Tasks_Done/
│   │   ├── 02_Hillary_Inbox/
│   │   └── README.md
│   └── 04_Operations/             ✅ Operativo
│       ├── 00_Context_LLM/        ✅ Memoria LLM (Engram, notes)
│       ├── 01_Auto_Improvement/   ✅ Motor auto-mejora recursiva
│       ├── 02_Agent_Teams_Lite/  ✅ SDD registry + 7 manifests
│       ├── 03_Scripts_Os/         ✅ 21 HUBs + 5 aux (26 scripts .py)
│       ├── 04_Installer/          ✅ Installer scripts
│       ├── 05_Projects/          ✅ Proyectos activos
│       ├── GOVERNANCE.md
│       ├── README.md
│       └── RUNBOOK.md
├── 02_Playground/                ✅ Zona de pruebas (11 folders: Momentum, Hillary, Focus, etc.)
├── 03_Resultado/                 ✅ Outputs de proyectos (OIM, Portfolio, Exercises)
├── .agent/                       ✅ Backup estratégico
│   ├── 00_Rules/
│   ├── 01_Agents/
│   ├── 02_Skills/
│   ├── 03_Workflows/
│   ├── 04_Extensions/
│   └── 05_GGA/
├── .atl/                         ✅ SDD Registry + openspec/
├── .claude/                      ✅ Config Claude Code + rules
├── .opencode/                    ✅ Config OpenCode + skills locales
├── .mcp.json                     ✅ 37 MCPs activos (Claude Code)
├── OS_DIRECTORY.md               ✅ Este archivo — JARVIS discovery
├── AGENTS.md                     ✅ GGA Pre-Commit entry
├── CLAUDE.md                     ✅ Config IAs (FUENTE)
└── README.md                     ✅ Documentación principal
```

---

## 🧠 SKILLS — 11 ÁREAS FUNCIONALES (300+ skills)

| Área                                             | Items                      | Descripción                                                   |
|-------------------------------------------------|---------------------------|--------------------------------------------------------------|
| 00_Compound_Engineering                          | 11                         | Core CE — SDD + Compound Engineering                          |
| 00_Personal_Os_Stack                             | 11                         | Stack base OS + Gcierr                                        |
| 00_Skill_Auditor                                 | 4                          | Auditoría de skills                                           |
| 01_Creacion_Contenidos                           | 22                         | Brand, YouTube, SEO, Carruseles                               |
| 02_Diseno_Ui_Ux                                  | 14                         | Product Design, UI/UX, Taste, Minimal                         |
| 03_Video_Media                                   | 2                          | Video Intel, James Cameron                                    |
| 04_Automatizacion                                | 12                         | N8N, Firecrawl, GWS Client                                    |
| 05_Workflows                                     | 6                          | Agent Teams, PM, Orchestrator                                 |
| 06_Tools                                         | 14                         | Skill Creator, Testing, DevOps, Data                          |
| 07_Personal_Os                                   | 8                          | Life OS, Hillary, Rituales                                    |
| 08_Invictus_Web                                  | 3                          | Playwright, Superpowers, Browser Auto                         |
| **TOTAL**                                        | **107+**                   | Solo en áreas基底 + skills en subcarpetas                       |

> ⚠️ Las skills están tanto en carpetas de área como en subcarpetas internas. Total real: 300+.

---

## 📊 MCPs — 36 SERVIDORES ACTIVOS (Claude Code)

| Categoría                          | Servidores                                                                              |
|-----------------------------------|----------------------------------------------------------------------------------------|
| 🔍 Search                           | exa, brave-search, stackoverflow                                                        |
| 🧠 Memory                           | engram, aim-memory-bank, notebooklm                                                     |
| 📝 Notes                            | Notion, mcp-obsidian, obsidian-api                                                      |
| 🌐 Browser                          | Playwright, chrome-devtools, eagle-mcp, eagle (remote)                                  |
| 🤖 AI & Code                        | context7, zai-mcp-server, github, task-master-ai, @magicuidesign/mcp                    |
| 📊 Data                             | supabase, Amplitude, supadata                                                           |
| 🔄 Workflow                         | n8n-mcp, Linear                                                                         |
| 💬 Communication                    | fireflies, google-workspace                                                             |
| 📐 Design                           | excalidraw-yctimlin, pencil                                                             |
| 🛠️ DevOps                          | docker, filesystem                                                                      |
| 🚀 Deploy                           | vercel, recall, TestSprite                                                              |
| 🧩 Chain                            | sequential-thinking, nanobanana                                                         |
| 🎯 QMD                              | qmd                                                                                     |

---

## ⚡ AGENTES — 52+ CONFIGURADOS

| Categoría                                   | Cantidad                      | Ubicación                                                                        |
|--------------------------------------------|------------------------------|---------------------------------------------------------------------------------|
| **Dream Team**                              | 5 (+ README)                  | `01_Dream_Team/` (Product, Data, Marketing, Design, Platform)                    |
| **Specialists Compound**                    | 24 (+ README)                 | `02_Specialists_Compound/`                                                       |
| **Individuales**                            | 22 (+ READMEs)                | Raíz `01_Agents/` (Orchestrator, AIPM_Judge, LFG, etc.)                          |
| **TOTAL ARCHIVOS**                          | **51+**                       | 5+24+22 = 51 archivos de agentes                                                 |

---

## 🎯 HUBs — 26 SCRIPTS TOTALES (21 operativos + 5 auxiliary)

### Scripts Python en raíz de 03_Scripts_Os/ (principales)

| #                      | Hub                                          | Script                                          | Propósito                                                 |
|-----------------------|---------------------------------------------|------------------------------------------------|----------------------------------------------------------|
| 00                     | Sound Engine                                 | `00_Sound_Engine.py`                            | Notificaciones sonoras                                    |
| 01                     | Auditor                                      | `01_Auditor_Hub.py`                             | Auditorías del sistema                                    |
| 02                     | Git                                          | `02_Git_Hub.py`                                 | Operaciones Git                                           |
| 03                     | AIPM                                         | `03_AIPM_Hub.py`                                | AI Performance Monitoring                                 |
| 04                     | Ritual                                       | `04_Ritual_Hub.py`                              | Rituales de sesión                                        |
| 05                     | Validator                                    | `05_Validator_Hub.py`                           | Validación de código                                      |
| 06                     | Tool                                         | `06_Tool_Hub.py`                                | Gestión de herramientas                                   |
| 07                     | Integration                                  | `07_Integration_Hub.py`                         | Integraciones MCP                                         |
| 08                     | Workflow                                     | `08_Workflow_Hub.py`                            | Automatización de workflows                               |
| 09                     | Data                                         | `09_Data_Hub.py`                                | Procesamiento de datos                                    |
| 10                     | General                                      | `10_General_Hub.py`                             | Utilidades generales                                      |
| 11                     | Auto Learn                                   | `11_Auto_Learn_Hub.py`                          | Motor de automejora                                       |
| 14                     | Health Metrics                               | `14_Health_Metrics_Hub.py`                      | Métricas de salud del OS                                  |
| 15                     | MCP Sync ★                                   | `15_MCP_Sync_Hub.py`                            | Sync drift Claude ↔ OpenCode                              |
| 16                     | Agent Mirror                                 | `16_Agent_Mirror_Hub.py`                        | Mirror agentes source → backup                            |
| 17                     | Watchdog ★                                   | `17_Watchdog_Hub.py`                            | Health watchdog                                           |
| 18                     | Telemetry ★                                  | `18_Telemetry_Hub.py`                           | Dashboard de métricas                                     |
| 19                     | Agent Sync                                   | `19_Agent_Sync_Hub.py`                          | Sync .agent ↔ 01_Core                                     |
| 20                     | System Mapper ★                              | `20_System_Mapper_Hub.py`                       | Genera 7 manifests JARVIS                                 |
| 21                     | Legacy Cleanup                               | `21_Legacy_Path_Cleanup.py`                     | Limpia paths legacy v2.x                                  |
| 22                     | Skill Frontmatter                            | `22_Validate_Skill_Frontmatter.py`              | Detecta skills sin frontmatter YAML                       |

### Scripts Auxiliary

| #                      | Script                                               | Propósito                                                          |
|-----------------------|-----------------------------------------------------|-------------------------------------------------------------------|
| 33                     | `33_Parallel_Audit_Pro.py`                           | Auditoría paralela avanzada                                        |
| 34                     | `34_Skill_Auditor.py`                                | Auditoría específica de skills                                     |
| 50                     | `50_System_Health_Monitor.py`                        | Monitor de salud del sistema                                       |
| 57                     | `57_Repo_Sync_Auditor.py`                            | Auditor de sincronización de repos                                 |
| 23                     | `23_path_replacement.py`                             | Reemplazo de paths legacy                                          |

### Subdirectorios (organización)

| Dir                                  | Contenido                                                                  |
|-------------------------------------|---------------------------------------------------------------------------|
| `00_Context_LLM/`                    | Memoria y notas LLM                                                        |
| `01_Ritual/`                         | Scripts de rituales                                                        |
| `02_Tool/`                           | Herramientas auxiliares                                                    |
| `03_Validator/`                      | Validadores                                                                |
| `04_Workflow/`                       | Workflows                                                                  |
| `05_AIPM/`                           | AIPM scripts                                                               |
| `06_Auditor/`                        | Auditorías                                                                 |
| `07_Data/`                           | Datos                                                                      |
| `08_General/`                        | Generales                                                                  |
| `09_Integration/`                    | Integraciones                                                              |
| `10_Legacy/`                         | Legacy                                                                     |
| `11_Anthropic_Harness/`              | Harness Anthropic                                                          |
| `12_Audits/`                         | Auditorías                                                                 |
| `13_Auditors_Os/`                    | Auditores OS                                                               |
| `14_Otros/`                          | Otros                                                                      |

> ★ = HUB canónico JARVIS 4.0

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

| Rank                      | Skill                                       | Valor                      | SOTA                      | Diseño                      | Total                      |
|--------------------------|--------------------------------------------|---------------------------|--------------------------|----------------------------|---------------------------|
| 🥇 1                       | **Dumbledor Design**                        | 10                         | 9                         | 10                          | **29**                     |
| 🥈 2                       | **Huashu Design**                           | 10                         | 10                        | 9                           | **29**                     |
| 🥉 3                       | **Ui Ux Pro Max**                           | 9                          | 8                         | 9                           | **26**                     |
| 4                         | **Frontend Slides**                         | 10                         | 9                         | 7                           | **26**                     |
| 5                         | **Design SOTA**                             | 8                          | 9                         | 8                           | **25**                     |

---

## 📁 WORKFLOWS — 5 CATEGORÍAS (28+ workflows)

| Categoría                                   | Path                                         | Workflows                                       |
|--------------------------------------------|---------------------------------------------|------------------------------------------------|
| Personal OS                                 | `01_Personal_Os/`                            | Morning, Backlog, Content, Weekly               |
| Marvel                                      | `02_Marvel/`                                 | Marvel-related                                  |
| Gentleman                                   | `03_Gentleman/`                              | Gentleman standards                             |
| Hillary                                     | `04_Hillary/`                                | Hillary Life OS                                 |
| Compound Engineering                        | `05_Compound_Engineering/`                   | CE workflows                                    |

---

*Actualizado: 2026-05-13 | PersonalOS v4.0 Production Ready | Every CE v2.55.0 (local repo) ✅ | gentle-ai v1.26.6 | 300+ skills | 52+ agents | 36 MCPs*
