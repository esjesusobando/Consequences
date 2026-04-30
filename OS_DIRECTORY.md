# 🤖 PERSONALOS — DIRECTORIO MAESTRO (JARVIS)

**v3.1 Consequences** | 2026-04-29

---

## 🚨 ESTADO DEL SISTEMA

| Componente         | Total                     | Estado                      |
|--------------------|---------------------------|-----------------------------|
| MCPs Claude Code   | 35                        | ✅ OPERATIONAL               |
| Skills             | 299 (11 áreas activas)    | ✅ VERIFIED                  |
| Agentes            | 52+                       | ✅ ACTIVE                    |
| HUBs               | 19 + 4 auxiliares = 23    | ✅ VERIFIED                  |
| Workflows          | 27+                       | ✅ ACTIVE                    |
| Hooks              | 10+                       | ✅ ACTIVE                    |
| Rules              | 11 (.mdc)                 | ✅ DEFINED                   |
| JARVIS Manifests   | 7                         | ✅ VALIDATED                |

> **⚠️ PROBLEMA DETECTADO:** Claude Code native binary no instalado
> Solución: `node node_modules/@anthropic-ai/claude-code/install.cjs`
> O reinstalar sin `--ignore-scripts` / `--omit=optional`

---

## 📍 UBICACIONES CRÍTICAS

| Recurso              | Path                                           |
|----------------------|------------------------------------------------|
| **Skills (Sistema)** | `01_Personal_Os/01_Core/02_Tools/02_Skills/`  |
| **Agents**           | `01_Personal_Os/01_Core/02_Tools/01_Agents/`  |
| **Rules**            | `01_Personal_Os/01_Core/01_Rules/`             |
| **HUBs**             | `01_Personal_Os/04_Operations/03_Scripts_Os/`  |
| **Manifests**         | `01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/` |
| **Skills Globales**  | `~/.config/opencode/skills/`                   |
| **Skills Locales**   | `.opencode/skills/`                            |

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

## 🗂️ ESTRUCTURA COMPLETA v3.1

```
Think_Different/
├── 00_Winter_is_Coming/          ✅ MATRIX: Goals, Backlog, AGENTS.md
├── 01_Personal_Os/               ✅ EL SISTEMA OPERATIVO
│   ├── 01_Core/                  ✅ Motor del OS (FUENTE DE VERDAD)
│   │   ├── 00_Workflows_Os/      ✅ 27 workflows (5 categorías)
│   │   ├── 01_Rules/             ✅ 11 reglas .mdc
│   │   └── 02_Tools/
│   │       ├── 01_Agents/         ✅ 52+ agentes (Dream Team + Specialists)
│   │       ├── 02_Skills/         ✅ 299 skills (11 áreas)
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
│   │   └── 03_Scripts_Os/         ✅ 23 scripts (19 HUBs + 4 aux)
│   └── 05_Archive/                ✅ Legacy archivado
├── 02_Playground/                ✅ Zona de pruebas
├── 03_Resultado/                 ✅ Outputs de proyectos
├── .agent/                       ✅ Backup estratégico
├── .atl/                         ✅ SDD Registry
├── .claude/                      ✅ Config Claude Code + rules
├── .opencode/                    ✅ Config OpenCode + skills locales
├── .mcp.json                     ✅ 35 MCPs activos (Claude Code)
├── OS_DIRECTORY.md               ✅ Este archivo — JARVIS discovery
├── AGENTS.md                     ✅ GGA Pre-Commit entry
├── CLAUDE.md                     ✅ Config IAs (FUENTE)
└── README.md                     ✅ Documentación principal
```

---

## 🧠 SKILLS — 11 ÁREAS FUNCIONALES (299 skills)

| Área                        | Descripción                              | Skills |
|-----------------------------|------------------------------------------|--------|
| 00_Compound_Engineering     | Core CE — SDD + Reviews                  | 20+    |
| 00_Personal_Os_Stack        | Stack base OS + Gcierr                   | 5+     |
| 00_Skill_Auditor            | Auditoría de skills                      | 3+     |
| 01_Creacion_Contenidos     | Brand, YouTube, SEO, Carruseles          | 15+    |
| 02_Diseno_Ui_Ux             | Product Design, UI/UX, Taste, Minimal   | 12+    |
| 03_Video_Media             | Video Intel, James Cameron, Remotion     | 8+     |
| 04_Automatizacion           | N8N, Firecrawl                            | 10+    |
| 05_Workflows               | Agent Teams, PM, Orchestrator            | 15+    |
| 06_Tools                   | Skill Creator, Testing, DevOps, Data     | 25+    |
| 07_Personal_Os             | Life OS, Hillary, Rituales               | 10+    |
| 08_Invictus_Web             | Playwright, Superpowers, Browser Auto     | 15+    |

---

## 📊 MCPs — 35 SERVIDORES ACTIVOS

| Categoría      | Servidores                                |
|---------------|-------------------------------------------|
| 🔍 Search      | exa, brave-search, stackoverflow         |
| 🧠 Memory      | engram, aim-memory-bank, notebooklm      |
| 📝 Notes       | Notion, mcp-obsidian, obsidian-api       |
| 🌐 Browser     | Playwright, chrome-devtools              |
| 🤖 AI & Code   | context7, zai-mcp-server, github, task-master-ai, @magicuidesign/mcp |
| 📊 Data        | supabase, Amplitude, supadata            |
| 🔄 Workflow    | n8n-mcp, Linear                          |
| 💬 Communication| fireflies, google-workspace             |
| 📐 Design      | excalidraw-yctimlin, pencil              |
| 🛠️ DevOps     | docker, filesystem                       |
| 🚀 Deploy      | vercel, recall, TestSprite              |

---

## ⚡ AGENTES — 52+ CONFIGURADOS

| Categoría              | Cantidad | Ubicación                              |
|------------------------|----------|----------------------------------------|
| Dream Team             | 5        | `01_Dream_Team/` (Product, Data, Marketing, Design, Platform) |
| Specialists Compound   | 24       | `02_Specialists_Compound/`             |
| Growth                 | N        | `03_Growth/`                           |
| Individuals            | 12+      | Raíz `01_Agents/`                      |

---

## 🎯 HUBs — 23 SCRIPTS TOTALES

| Hub                     | Script                                        | Propósito                            |
|-------------------------|-----------------------------------------------|--------------------------------------|
| Sound Engine           | `00_Sound_Engine.py`                          | Notificaciones sonoras               |
| Auditor                | `01_Auditor_Hub.py`                           | Auditorías del sistema               |
| Git                    | `02_Git_Hub.py`                               | Operaciones Git                      |
| AIPM                   | `03_AIPM_Hub.py`                              | AI Performance Monitoring            |
| Ritual                 | `04_Ritual_Hub.py`                            | Rituales de sesión                   |
| Validator              | `05_Validator_Hub.py`                         | Validación de código                |
| Tool                   | `06_Tool_Hub.py`                              | Gestión de herramientas              |
| Integration            | `07_Integration_Hub.py`                        | Integraciones MCP                   |
| Workflow               | `08_Workflow_Hub.py`                          | Automatización de workflows         |
| Data                   | `09_Data_Hub.py`                             | Procesamiento de datos              |
| General                | `10_General_Hub.py`                           | Utilidades generales                |
| Auto Learn             | `11_Auto_Learn_Hub.py`                        | Motor de automejora                 |
| Context Bar            | `13_Auditors_Os/scripts/12_Context_Usage_Bar.py` | Barra de contexto                |
| Beautify Tables        | `13_Auditors_Os/scripts/13_Beautify_Tables.py` | Formateo de tablas markdown         |
| Health Metrics         | `14_Health_Metrics_Hub.py`                    | Métricas de salud del OS            |
| MCP Sync ★             | `15_MCP_Sync_Hub.py`                          | Sync drift Claude ↔ OpenCode        |
| Agent Mirror           | `16_Agent_Mirror_Hub.py`                      | Mirror agentes source → backup      |
| Watchdog ★             | `17_Watchdog_Hub.py`                         | Health watchdog                     |
| Telemetry ★            | `18_Telemetry_Hub.py`                         | Dashboard de métricas               |
| Agent Sync             | `19_Agent_Sync_Hub.py`                        | Sync .agent ↔ 01_Core              |
| System Mapper ★        | `20_System_Mapper_Hub.py`                     | Genera 7 manifests JARVIS          |
| Legacy Cleanup         | `21_Legacy_Path_Cleanup.py`                  | Limpia paths legacy v2.x            |
| Skill Frontmatter      | `22_Validate_Skill_Frontmatter.py`            | Detecta skills sin frontmatter YAML |

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

## 🎨 TOP 11 DESIGN SKILLS

| Rank | Skill                  | Valor | SOTA | Diseño | Total |
|------|------------------------|-------|------|--------|-------|
| 🥇 1 | **Dumbledor Design**   | 10    | 9    | 10     | **29** |
| 🥈 2 | **Huashu Design**      | 10    | 10   | 9      | **29** |
| 🥉 3 | **Ui Ux Pro Max**      | 9     | 8    | 9      | **26** |
| 4    | **Frontend Slides**    | 10    | 9    | 7      | **26** |
| 5    | **Design SOTA**        | 8     | 9    | 8      | **25** |

---

*Actualizado: 2026-04-29 | PersonalOS v3.1 Consequences | JARVIS 3.1 Integrated*
