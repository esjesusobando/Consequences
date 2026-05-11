# 🤖 PERSONALOS — DIRECTORIO MAESTRO (JARVIS)

**v4.0 Production** | 2026-05-11

---

## 🚨 ESTADO DEL SISTEMA

| Componente               | Total                                  | Estado                            |
|--------------------------|----------------------------------------|-----------------------------------|
| MCPs Claude Code         | 38                                     | ✅ OPERATIONAL                     |
| Every CE                 | v3.7.3 (latest)                        | ✅ UPDATED                         |
| gentle-ai                | v1.26.6                                | ✅ AVAILABLE                       |
| Skills                   | 300+ (11 áreas activas)                | ✅ VERIFIED                        |
| Agentes                  | 52+                                    | ✅ ACTIVE                          |
| HUBs                     | 28 scripts (23 principales + 5 aux)    | ✅ VERIFIED                        |
| Workflows                | 28+                                    | ✅ ACTIVE                          |
| Hooks                    | 10+                                    | ✅ ACTIVE                          |
| Rules                    | 11 (.mdc)                              | ✅ DEFINED                         |
| JARVIS Manifests         | 7                                      | ✅ VALIDATED                       |
| Open Design              | 62 skills + 138 design systems         | ✅ INTEGRATED                      |

> **🟢 ÚLTIMA AUDITORÍA:** 2026-05-11 — v4.0 Production Ready
> Sistema actualizado: Every CE v3.7.3, gentle-ai v1.26.6, gitmodules paths fix, reports consolidated
> Ver: `01_Personal_Os/04_Operations/00_Context_LLM/08_Auditorias/HEALTH_CHECK_2026-05-11.md`

---

## 🆕 v4.0 Cambios desde v3.2

1. **Every CE v3.7.3** — Latest compound-engineering-plugin
2. **gentle-ai v1.26.6** — Latest Gentleman Programming tools
3. **Naming conventions** — Fixes applied to all folders/files
4. **Reports consolidated** — 58 audit files → 3 summary files
5. **Git state clean** — Pushed and synced with origin

## 📍 UBICACIONES CRÍTICAS

| Recurso                    | Path                                                                |
|----------------------------|---------------------------------------------------------------------|
| **Skills (Sistema)**       | `01_Personal_Os/01_Core/02_Tools/02_Skills/`                        |
| **Agents**                 | `01_Personal_Os/01_Core/02_Tools/01_Agents/`                        |
| **Rules**                  | `01_Personal_Os/01_Core/01_Rules/`                                  |
| **HUBs**                   | `01_Personal_Os/04_Operations/03_Scripts_Os/`                       |
| **Manifests**              | `01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/`     |
| **Skills Globales**        | `~/.config/opencode/skills/`                                        |
| **Skills Locales**         | `.opencode/skills/`                                                 |

---

## 🔧 HUBs JARVIS 3.1 — Comandos Canónicos

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
Think_Different/
├── 00_Winter_is_Coming/          ✅ MATRIX: Goals, Backlog, AGENTS.md
├── 01_Personal_Os/               ✅ EL SISTEMA OPERATIVO
│   ├── 01_Core/                  ✅ Motor del OS (FUENTE DE VERDAD)
│   │   ├── 00_Workflows_Os/      ✅ 27 workflows (5 categorías)
│   │   ├── 01_Rules/             ✅ 11 reglas .mdc
│   │   └── 02_Tools/
│   │       ├── 01_Agents/         ✅ 52+ agentes (Dream Team + Specialists)
│   │       ├── 02_Skills/         ✅ 300 skills (11 áreas)
│   │       ├── 03_Mcp/           ✅ Backup MCP configs
│   │       ├── 05_Hooks/          ✅ Pre/Post/Lifecycle/Sound
│   │       ├── 06_Plugins/        ✅ Plugins OS
│   │       ├── 07_Server/         ✅ Engram server
│   │       ├── 08_Evals/          ✅ Evaluadores
│   │       └── 09_Templates/      ✅ Templates
│   ├── 02_Knowledge/              ✅ Base de conocimiento
│   ├── 03_Task/                   ✅ Tareas activas
│   ├── 04_Operations/             ✅ Operativo
│   │   ├── 00_Context_LLM/        ✅ Memoria LLM
│   │   ├── 01_Auto_Improvement/   ✅ Motor auto-mejora
│   │   ├── 02_Agent_Teams_Lite/  ✅ SDD registry + 7 manifests
│   │   └── 03_Scripts_Os/         ✅ 28 scripts (23 HUBs + 5 aux)
│   └── 05_Archive/                ✅ Legacy archivado
├── 02_Playground/                ✅ Zona de pruebas
├── 03_Resultado/                 ✅ Outputs de proyectos
├── .agent/                       ✅ Backup estratégico
├── .atl/                         ✅ SDD Registry
├── .claude/                      ✅ Config Claude Code + rules
├── .opencode/                    ✅ Config OpenCode + skills locales
├── .mcp.json                     ✅ 38 MCPs activos (Claude Code)
├── OS_DIRECTORY.md               ✅ Este archivo — JARVIS discovery
├── AGENTS.md                     ✅ GGA Pre-Commit entry
├── CLAUDE.md                     ✅ Config IAs (FUENTE)
└── README.md                     ✅ Documentación principal
```

---

## 🧠 SKILLS — 11 ÁREAS FUNCIONALES (300 skills)

| Área                              | Descripción                                    | Skills       |
|-----------------------------------|------------------------------------------------|--------------|
| 00_Compound_Engineering           | Core CE — SDD + Reviews                        | 20+          |
| 00_Personal_Os_Stack              | Stack base OS + Gcierr                         | 5+           |
| 00_Skill_Auditor                  | Auditoría de skills                            | 3+           |
| 01_Creacion_Contenidos            | Brand, YouTube, SEO, Carruseles                | 15+          |
| 02_Diseno_Ui_Ux                   | Product Design, UI/UX, Taste, Minimal          | 12+          |
| 03_Video_Media                    | Video Intel, James Cameron, Remotion           | 8+           |
| 04_Automatizacion                 | N8N, Firecrawl                                 | 10+          |
| 05_Workflows                      | Agent Teams, PM, Orchestrator                  | 15+          |
| 06_Tools                          | Skill Creator, Testing, DevOps, Data           | 25+          |
| 07_Personal_Os                    | Life OS, Hillary, Rituales                     | 10+          |
| 08_Invictus_Web                   | Playwright, Superpowers, Browser Auto          | 15+          |

---

## 📊 MCPs — 38 SERVIDORES ACTIVOS (Claude Code)

| Categoría           | Servidores                                                               |
|---------------------|--------------------------------------------------------------------------|
| 🔍 Search            | exa, brave-search, stackoverflow                                         |
| 🧠 Memory            | engram, aim-memory-bank, notebooklm                                      |
| 📝 Notes             | Notion, mcp-obsidian, obsidian-api                                       |
| 🌐 Browser           | Playwright, chrome-devtools, eagle-mcp                                   |
| 🤖 AI & Code         | context7, zai-mcp-server, github, task-master-ai, @magicuidesign/mcp     |
| 📊 Data              | supabase, Amplitude, supadata                                            |
| 🔄 Workflow          | n8n-mcp, Linear                                                          |
| 💬 Communication     | fireflies, google-workspace                                              |
| 📐 Design            | excalidraw-yctimlin, pencil                                              |
| 🛠️ DevOps           | docker, filesystem                                                       |
| 🚀 Deploy            | vercel, recall, TestSprite                                               |
| 🧩 Chain             | sequential-thinking, nanobanana                                          |

---

## ⚡ AGENTES — 52+ CONFIGURADOS

| Categoría                    | Cantidad       | Ubicación                                                         |
|------------------------------|----------------|-------------------------------------------------------------------|
| Dream Team                   | 5              | `01_Dream_Team/` (Product, Data, Marketing, Design, Platform)     |
| Specialists Compound         | 24             | `02_Specialists_Compound/`                                        |
| Growth                       | N              | `03_Growth/`                                                      |
| Individuals                  | 12+            | Raíz `01_Agents/`                                                 |

---

## 🎯 HUBs — 28 SCRIPTS TOTALES (23 operativos + 5 auxiliares)

### HUBs Principales (en raíz de 03_Scripts_Os/)

| #       | Hub                           | Script                                              | Propósito                                  |
|---------|-------------------------------|-----------------------------------------------------|--------------------------------------------|
| 00      | Sound Engine                  | `00_Sound_Engine.py`                                | Notificaciones sonoras                     |
| 01      | Auditor                       | `01_Auditor_Hub.py`                                 | Auditorías del sistema                     |
| 02      | Git                           | `02_Git_Hub.py`                                     | Operaciones Git                            |
| 03      | AIPM                          | `03_AIPM_Hub.py`                                    | AI Performance Monitoring                  |
| 04      | Ritual                        | `04_Ritual_Hub.py`                                  | Rituales de sesión                         |
| 05      | Validator                     | `05_Validator_Hub.py`                               | Validación de código                       |
| 06      | Tool                          | `06_Tool_Hub.py`                                    | Gestión de herramientas                    |
| 07      | Integration                   | `07_Integration_Hub.py`                             | Integraciones MCP                          |
| 08      | Workflow                      | `08_Workflow_Hub.py`                                | Automatización de workflows                |
| 09      | Data                          | `09_Data_Hub.py`                                    | Procesamiento de datos                     |
| 10      | General                       | `10_General_Hub.py`                                 | Utilidades generales                       |
| 11      | Auto Learn                    | `11_Auto_Learn_Hub.py`                              | Motor de automejora                        |
| 14      | Health Metrics                | `14_Health_Metrics_Hub.py`                          | Métricas de salud del OS                   |
| 15      | MCP Sync ★                    | `15_MCP_Sync_Hub.py`                                | Sync drift Claude ↔ OpenCode               |
| 16      | Agent Mirror                  | `16_Agent_Mirror_Hub.py`                            | Mirror agentes source → backup             |
| 17      | Watchdog ★                    | `17_Watchdog_Hub.py`                                | Health watchdog                            |
| 18      | Telemetry ★                   | `18_Telemetry_Hub.py`                               | Dashboard de métricas                      |
| 19      | Agent Sync                    | `19_Agent_Sync_Hub.py`                              | Sync .agent ↔ 01_Core                      |
| 20      | System Mapper ★               | `20_System_Mapper_Hub.py`                           | Genera 7 manifests JARVIS                  |
| 21      | Legacy Cleanup                | `21_Legacy_Path_Cleanup.py`                         | Limpia paths legacy v2.x                   |
| 22      | Skill Frontmatter             | `22_Validate_Skill_Frontmatter.py`                  | Detecta skills sin frontmatter YAML        |

### Scripts Auxiliares (en subdirectorios)

| #       | Script                                | Propósito                                           |
|---------|---------------------------------------|-----------------------------------------------------|
| 33      | `33_Parallel_Audit_Pro.py`            | Auditoría paralela avanzada                         |
| 34      | `34_Skill_Auditor.py`                 | Auditoría específica de skills                      |
| 50      | `50_System_Health_Monitor.py`         | Monitor de salud del sistema                        |
| 57      | `57_Repo_Sync_Auditor.py`             | Auditor de sincronización de repos                  |

> ★ = HUB canónico JARVIS 3.1

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

## 🎨 TOP 13 DESIGN SKILLS

| Rank       | Skill                        | Valor       | SOTA       | Diseño       | Total       |
|------------|------------------------------|-------------|------------|--------------|-------------|
| 🥇 1        | **Dumbledor Design**         | 10          | 9          | 10           | **29**      |
| 🥈 2        | **Huashu Design**            | 10          | 10         | 9            | **29**      |
| 🥉 3        | **Ui Ux Pro Max**            | 9           | 8          | 9            | **26**      |
| 4          | **Frontend Slides**          | 10          | 9          | 7            | **26**      |
| 5          | **Design SOTA**              | 8           | 9          | 8            | **25**      |

---

*Actualizado: 2026-05-10 | PersonalOS v4.0 Production Ready | Every CE v3.7.3 | gentle-ai v1.26.6 | 300+ skills | Reports consolidated | Naming conventions fixed*
