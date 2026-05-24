# Think Different PersonalOS v4.7 Consequences — Production Ready

[![License](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-orange)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![Version](https://img.shields.io/badge/Version-4.7-00FF00)]()
[![Status](https://img.shields.io/badge/Status-PRODUCTION%20READY-00FF00)]()
[![OS](https://img.shields.io/badge/Think%20Different-OS--4.7-7B68EE)]()

> 🧠 **Sistema operativo personal potenciado con IA** — Orquestación multi-agente, 394 skills SOTA, 12 áreas funcionales, 46 agentes, metodologías integradas y automatización completa.

---

## 📊 Estado del Sistema (v4.7 Consequences — Production Ready — 2026-05-24)

> 🟢 **PRODUCTION READY** - v4.7 Consequences lista para uso público

| Métrica                             | Valor                                           |
|------------------------------------|------------------------------------------------|
| **Overall Health**                  | **100%** 🟢                                      |
| **Every CE**                        | v3.8.4 ✅ (local repo)                           |
| **gentle-ai**                       | v1.30.6 ✅                                       |
| **Skills**                          | **394** (12 áreas funcionales)                  |
| **Rules**                           | **12** (.mdc)                                   |
| **MCPs**                            | **36** Claude Code                              |
| **HUBs**                            | **28** HUBs + 152 scripts                       |
| **Agentes**                         | **58** (source) / 95 (backup)                   |
| **Workflows**                       | **30** (7 categorías)                           |

---

## 📂 Estructura del Sistema (v4.7 Consequences — Production Ready)

```
Think_Different/                           # RAÍZ
├── 00_Winter_is_Coming/           ✅ Goals, Backlog, AGENTS.md, CHANGELOG
├── 01_Personal_Os/                ✅ EL SISTEMA OPERATIVO
│   ├── 01_Core/                   ✅ Motor del OS (FUENTE DE VERDAD)
│   │   ├── 00_Workflows_Os/      ✅ 30 workflows (7 categorías)
│   │   ├── 01_Rules/             ✅ 12 reglas .mdc — FUENTE DE VERDAD
│   │   └── 02_Tools/             ✅ Todas las herramientas
│   │       ├── 01_Agents/         ✅ 46 agentes
│   │       ├── 02_Skills/        ✅ 394 skills — 12 áreas funcionales
│   │       ├── 03_Mcp/           ✅ Backup MCP configs
│   │       ├── 04_Integrations/  ✅ Fireflies, Granola
│   │       ├── 05_Hooks/         ✅ 10 hooks (6 fases)
│   │       ├── 06_Plugins/        ✅ Plugins OS
│   │       ├── 07_Server/         ✅ Engram server
│   │       ├── 08_Evals/         ✅ Evaluadores
│   │       └── 09_Templates/     ✅ Templates
│   ├── 02_Knowledge/             ✅ Base de conocimiento + Docs
│   ├── 03_Task/                  ✅ Tareas activas
│   │   ├── 00_P0_Auditoria.md/
│   │   ├── 01_Tasks_Done/
│   │   ├── 02_Hillary_Inbox/
│   │   └── README.md
│   └── 04_Operations/            ✅ Motor operativo
│       ├── 00_Context_LLM/       ✅ Memoria LLM (Engram, notes)
│       ├── 01_Auto_Improvement/  ✅ Auto-mejora recursiva
│       ├── 02_Agent_Teams_Lite/  ✅ SDD registry + 7 manifests JARVIS
│       ├── 03_Scripts_Os/        ✅ 19 HUBs + 284 scripts
│       ├── 04_Installer/         ✅ Installer
│       ├── 05_Projects/          ✅ Proyectos activos
│       ├── GOVERNANCE.md
│       └── RUNBOOK.md
├── 02_Playground/                 ✅ Zona de pruebas
│   ├── 00_Momentum/
│   ├── 01_Branders_Skills/
│   ├── 01_OS_Runtime_Test.py
│   ├── 02_Workflow_N8N/
│   ├── 03_Reports/
│   ├── 04_Side Project/
│   ├── 05_OS_Health_Test.py
│   ├── 06_OS_Deep_Audit.py
│   └── Kit_Diseño_Top.md
├── 03_Resultado/                 ✅ Outputs de proyectos
│   └── 09_World_OIM/
├── .agent/                      ✅ BACKUP ESTRATÉGICO
├── .atl/                        ✅ SDD Registry + openspec/
├── .claude/                     ✅ Config Claude Code
├── .opencode/                   ✅ Config OpenCode + skills locales
├── .mcp.json                    ✅ 36 MCPs Claude Code activos
├── OS_DIRECTORY.md              ✅ JARVIS discovery
├── AGENTS.md                    ✅ GGA Pre-Commit
├── CLAUDE.md                    ✅ Config IAs
└── README.md                    ✅ Este archivo
```

> **📍 PATH CRITICAL:** Skills en `01_Personal_Os/01_Core/02_Tools/02_Skills/` — NO usar paths antiguos

---

## 🚀 Quick Start

```bash
# En tu AI assistant (OpenCode, Claude Code, etc.)

1. Leer 00_Winter_is_Coming/AGENTS.md
2. Ejecutar engram_mem_context(limit: 10)
3. ¡Listo para trabajar!
```

---

## 🛠️ Componentes Principales

### Skills System (v4.7 — 12 Áreas Funcionales)

| Área                                                         | Items                      | Descripción                                                   |
|-------------------------------------------------------------|---------------------------|--------------------------------------------------------------|
| **00_Compound_Engineering**                                  | 63                         | Core CE — SDD + Compound Engineering                          |
| **00_System_Core**                                           | 1                          | Stack base del OS                                             |
| **01_Creacion_Contenidos**                                   | 40                         | Brand, YouTube, SEO, Carruseles                               |
| **02_Diseno_Ui_Ux**                                          | 29                         | Product Design, UI/UX, Taste, Minimal                         |
| **03_Video_Media**                                           | 7                          | Video Intel, James Cameron, Remotion                          |
| **04_Automatizacion**                                        | 37                         | N8N, Firecrawl, GWS Client                                    |
| **05_Workflows**                                             | 37                         | Agent Teams, PM, Orchestrator                                 |
| **06_Tools**                                                 | 112                        | Skill Creator, Testing, DevOps, Data                          |
| **07_Personal_Os**                                           | 32                         | Life OS, Hillary, Rituales                                    |
| **08_Invictus_Web**                                          | 15                         | Playwright, Superpowers, Browser Auto                         |
| **09_Claude_Ads**                                            | 20                         | Claude Ads & Promoted Content                                 |
| **10_Skill_Auditor**                                         | 1                          | Auditoría de skills                                           |
| **TOTAL**                                                    | **394**                    | Total real indexado en disco                                  |

> ⚠️ Skills están en carpetas de área + subcarpetas. Total real: 394 skills
> Índice completo: `01_Personal_Os/01_Core/02_Tools/02_Skills/INDEX_AREA_FUNCTIONAL.md`

---

### HUBs v4.7 (19 HUBs + 284 scripts)

| Hub                                          | Script                                          | Propósito                                             |
|---------------------------------------------|------------------------------------------------|------------------------------------------------------|
| **Sound Engine**                             | `00_Sound_Engine.py`                            | Notificaciones sonoras                                |
| **Auditor**                                  | `01_Auditor_Hub.py`                             | Auditorías del sistema                                |
| **Git**                                      | `02_Git_Hub.py`                                 | Operaciones Git                                       |
| **AIPM**                                     | `03_AIPM_Hub.py`                                | AI Performance Monitoring                             |
| **Ritual**                                   | `04_Ritual_Hub.py`                              | Rituales de sesión                                    |
| **Validator**                                | `05_Validator_Hub.py`                           | Validación de código                                  |
| **Tool**                                     | `06_Tool_Hub.py`                                | Gestión de herramientas                               |
| **Integration**                              | `07_Integration_Hub.py`                         | Integraciones MCP                                     |
| **Workflow**                                 | `08_Workflow_Hub.py`                            | Automatización de workflows                           |
| **Data**                                     | `09_Data_Hub.py`                                | Procesamiento de datos                                |
| **General**                                  | `10_General_Hub.py`                             | Utilidades generales                                  |
| **Auto Learn**                               | `11_Auto_Learn_Hub.py`                          | Motor de automejora                                   |
| **Health Metrics**                           | `14_Health_Metrics_Hub.py`                      | Métricas de salud del OS                              |
| **MCP Sync** ★                               | `15_MCP_Sync_Hub.py`                            | Sync Claude ↔ OpenCode                                |
| **Agent Mirror**                             | `16_Agent_Mirror_Hub.py`                        | Mirror source → backup                                |
| **Watchdog** ★                               | `17_Watchdog_Hub.py`                            | Health watchdog                                       |
| **Telemetry** ★                              | `18_Telemetry_Hub.py`                           | Dashboard de métricas                                 |
| **Agent Sync**                               | `19_Agent_Sync_Hub.py`                          | Sync .agent ↔ 01_Core                                 |
| **System Mapper** ★                          | `20_System_Mapper_Hub.py`                       | Genera 7 manifests JARVIS                             |
| **Legacy Cleanup**                           | `21_Legacy_Path_Cleanup.py`                     | Limpia paths legacy                                   |
| **Skill Frontmatter**                        | `22_Validate_Skill_Frontmatter.py`              | Detecta skills sin frontmatter                        |
| **Path Replacement**                         | `23_path_replacement.py`                        | Reemplazo de paths legacy                             |
| **Mass Path Migration**                      | `24_mass_path_migration.py`                     | Migración masiva de paths                             |
| **Minimax Optimizer**                        | `25_Minimax_Optimizer_Hub.py`                   | Optimización Minimax                                  |
| **Parallel Audit Pro**                       | `33_Parallel_Audit_Pro.py`                      | Auditoría paralela                                    |
| **Skill Auditor**                            | `34_Skill_Auditor.py`                           | Auditoría específica de skills                        |
| **System Health Monitor**                    | `50_System_Health_Monitor.py`                   | Monitor de salud                                      |
| **Repo Sync Auditor**                        | `57_Repo_Sync_Auditor.py`                       | Auditor de sincronización                             |
| **HUB SOTA**                                 | `HUB_SOTA.py`                                   | HUB de HUBs SOTA                                      |
| **Config Paths**                             | `config_paths.py`                               | Configuración de paths del sistema                    |

> ★ = HUB canónico JARVIS 4.5 | Scripts adicionales en subdirectorios organizados por función

---

### Agentes (46 total)

| Categoría                                   | Cantidad                      | Ubicación                                                                   |
|--------------------------------------------|------------------------------|----------------------------------------------------------------------------|
| Dream Team                                  | 5                             | `01_Core/02_Tools/01_Agents/01_Dream_Team/`                                 |
| Specialists Compound                        | 23                            | `01_Core/02_Tools/01_Agents/02_Specialists_Compound/`                       |
| Individuales                                | 13                            | Raíz `01_Core/02_Tools/01_Agents/`                                          |
| Growth                                      | 5                             | `01_Core/02_Tools/01_Agents/03_Growth/`                                     |

---

### MCPs (36 Claude Code)

| Categoría                                                               | Servidores                                                                          |
|------------------------------------------------------------------------|------------------------------------------------------------------------------------|
| 🔍 Search                                                                | exa, brave-search, stackoverflow                                                    |
| 🧠 Memory                                                                | engram, aim-memory-bank, notebooklm                                                 |
| 📝 Notes                                                                 | Notion, mcp-obsidian, obsidian-api                                                  |
| 🌐 Browser                                                               | Playwright, chrome-devtools, eagle-mcp                                              |
| 🤖 AI & Code                                                             | context7, zai-mcp-server, github, task-master-ai, @magicuidesign/mcp                |
| 📊 Data                                                                  | supabase, Amplitude, supadata                                                       |
| 🔄 Workflow                                                              | n8n-mcp, Linear                                                                     |
| 💬 Communication                                                         | fireflies, google-workspace                                                         |
| 📐 Design                                                                | excalidraw-yctimlin, pencil                                                         |
| 🛠️ DevOps                                                               | docker, filesystem                                                                  |
| 🚀 Deploy                                                                | vercel, recall, TestSprite                                                          |
| 🧩 Chain                                                                 | sequential-thinking, nanobanana, qmd                                                |

---

## 📋 Comandos SDD

```
/sdd-init           # Inicializar contexto SDD
/sdd-explore        # Explorar tema
/sdd-propose        # Crear propuesta
/sdd-spec           # Especificación
/sdd-design         # Diseño técnico
/sdd-tasks          # Descomponer tareas
/sdd-apply          # Implementar
/sdd-verify         # Verificar
/sdd-archive        # Archivar
```

---

## 🔧 Comandos CE (Compound Engineering)

```
/ce:ideate          # Generar ideas
/ce:brainstorm     # Lluvia de ideas
/ce:plan            # Crear planes
/ce:work            # Ejecutar trabajo
/ce:review          # Revisar
/ce:compound        # Documentar conocimiento
```

---

## ⚙️ GGA — Guardian Angel

```bash
.agent/05_GGA/bin/gga run      # Revisar archivos staged
.agent/05_GGA/bin/gga install  # Instalar pre-commit hook
```

### Reglas GGA

- TypeScript: `const`/`let` solo, no `var`
- React: Componentes funcionales, named exports

---

## 📚 Documentación

| Documento                                                                       | Ubicación                                                                    |
|--------------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| **OS_DIRECTORY.md**                                                             | Raíz — JARVIS discovery                                                      |
| **AGENTS.md**                                                                   | `00_Winter_is_Coming/AGENTS.md`                                              |
| **RULES_INDEX**                                                                 | `01_Personal_Os/01_Core/01_Rules/RULES_INDEX.md`                             |
| **Skills README**                                                               | `01_Personal_Os/01_Core/02_Tools/02_Skills/README.md`                        |
| **Scripts INDEX**                                                               | `01_Personal_Os/04_Operations/03_Scripts_Os/SCRIPTS_INDEX.md`                |
| **OS_DIRECTORY** (este archivo)                                                 | Raíz                                                                         |

---

## 🤝 Metodologías Integradas

| Metodología                                                                     | Propósito                                                      | Comando                              |
|--------------------------------------------------------------------------------|---------------------------------------------------------------|-------------------------------------|
| **SDD**                                                                         | Desarrollo guiado por specs (9 fases)                          | `/sdd-*`                             |
| **Super Campeones**                                                             | Orquestación de agentes en equipo                              | Activado por defecto                 |
| **Compound Engineering**                                                        | Cada unidad facilita la siguiente                              | `/ce:*`                              |
| **GGA**                                                                         | Code review automático pre-commit                              | `.agent/05_GGA/bin/gga`              |
| **Auto-Improvement**                                                            | Detección y corrección recursiva de issues                     | `04_Operations/`                     |

---

## 🎯 Workflow Diario

1. **Inicio de sesión**: `engram_mem_context()` + leer GOALS.md
2. **Trabajo**: Usar SDD commands para tareas complejas
3. **Review**: GGA valida código automáticamente
4. **Cierre**: `engram_mem_session_summary()`

---

## 📄 Licencia

CC BY-NC-SA 4.0 - Uso no comercial permitido.

---

_Think Different PersonalOS v4.7 Consequences — Production Ready ✅ — 2026-05-24_

*Estructura completa: ver `Structure_v4.7.md`*
