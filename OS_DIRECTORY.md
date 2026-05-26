# 🤖 PERSONALOS — DIRECTORIO MAESTRO (JARVIS)

**v4.8 Consequences** | 2026-05-25

---

## 🚨 ESTADO DEL SISTEMA

| Componente                            | Total                                                                      | Estado                                         |
|--------------------------------------|---------------------------------------------------------------------------|-----------------------------------------------|
| MCPs Claude Code                      | **7** (root) + **38** (backup)                                             | ✅ SYNCED — drift 0                             |
| Every CE                              | v3.8.4 (local repo) ✅                                                      | ✅ ACTIVE — Local version                       |
| gentle-ai                             | v1.30.6                                                                    | ✅ AVAILABLE                                    |
| Skills                                | **394** (12 áreas funcionales)                                             | ✅ VERIFIED — 0 sin frontmatter                 |
| Agentes                               | **48** (source) / 82 (con SDD/CE)                                          | ✅ SYNCED                                       |
| HUBs                                  | **21** (19 Hub.py + HUB_SOTA + HUB_CATALOG)                               | ✅ VERIFIED                                     |
| Scripts totales                       | **267** (.py, excl legacy) + **88** legacy                                | ✅ DOCUMENTED                                   |
| Workflows                             | **30** (7 categorías en 00_Workflows_Os)                                   | ✅ ACTIVE                                       |
| Hooks                                 | **13** (6 fases: Pre_Tool, Post_Tool, Lifecycle, Sound, Harness, Post_Hulk)| ✅ ACTIVE                                       |
| Rules                                 | **14** (13 .mdc + 1 .md index)                                             | ✅ DEFINED                                      |
| JARVIS Manifests                      | 7 en 00_Manifest/                                                          | ✅ VALIDATED                                    |
| Integrations                          | **2** (01_Fireflies, 02_Granola)                                           | ✅ INTEGRATED                                   |

> **🟢 ÚLTIMA AUDITORÍA:** 2026-05-25 — v4.8 Consequences
> Agent Sync: 48 agents (source) / 82 total con SDD/CE. Skills: 394 (SKILL.md source) / 407 (backup .agent). MCPs: 7+38. HUBs: 21. Scripts: 267 activos + 88 legacy.

---

## 🆕 v4.5 Cambios desde v4.1

1. **Secuencias corregidas** — Playground, Reports, carpetas sin huecos
2. **Nomenclatura estandarizada** — Pascal_Case para datos, snake_case para código
3. **00_ prefix rule** — Archivos "a la mano" no se tocan
4. **06_Testing_Youtube organizado** — 5 subcarpetas (Agents/Outputs/Sessions/Tests/Skills_Test)
5. **Rules actualizadas** — Convenciones de nomenclatura documentadas

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

## 🗂️ ESTRUCTURA COMPLETA v4.8

```
Think_Different/                         # RAÍZ
├── 00_Winter_is_Coming/          ✅ Goals, Backlog, AGENTS.md, CHANGELOG
├── 01_Personal_Os/               ✅ EL SISTEMA OPERATIVO
│   ├── 00_EVOLUTION_LOG.md       ✅ Registro histórico de evolución del OS
│   ├── 01_Core/                  ✅ Motor del OS (FUENTE DE VERDAD)
│   │   ├── 00_Workflows_Os/     ✅ 30 workflows (7 categorías)
│   │   ├── 01_Rules/            ✅ 13 reglas .mdc
│   │   └── 02_Tools/
│   │       ├── 01_Agents/         ✅ 48 agentes (5 Dream + 23 Specialists + 13 Indiv + 5 Growth + 2 Root)
│   │       ├── 02_Skills/         ✅ 394 skills (12 áreas funcionales)
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
│   ├── 04_Operations/             ✅ Operativo
│   └── 05_Archive/                ✅ Backups, snapshots, históricos
│       ├── 00_Context_LLM/        ✅ Memoria LLM (Engram, notes)
│       ├── 01_Auto_Improvement/   ✅ Motor auto-mejora recursiva
│       ├── 02_Agent_Teams_Lite/  ✅ SDD registry + 7 manifests
│       ├── 03_Scripts_Os/         ✅ 21 HUBs (19 Hub.py + HUB_SOTA + HUB_CATALOG) + 267 scripts + 88 legacy
│       ├── 04_Installer/          ✅ Installer scripts
│       ├── 05_Projects/          ✅ Proyectos activos
│       ├── 06_SOTA_Features/     ✅ Features estado-del-arte
│       ├── 07_Reports/           ✅ Reportes generados
│       ├── GOVERNANCE.md
│       ├── README.md
│       └── RUNBOOK.md
├── 02_Playground/                ✅ Zona de pruebas (6 carpetas, scripts test en 06_Testing_Legacy/)
├── 03_Resultado/                 ✅ Outputs de proyectos (agrupado: Proyectos, Aprendizaje, Experimentos, Reportes, Documentacion)
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
├── .mcp.json                     ✅ 7 MCPs activos root + 38 backup
├── OS_DIRECTORY.md               ✅ Este archivo — JARVIS discovery
├── AGENTS.md                     ✅ GGA Pre-Commit entry
├── CLAUDE.md                     ✅ Config IAs (FUENTE)
└── README.md                     ✅ Documentación principal
```

---

## 🧠 SKILLS — 12 ÁREAS FUNCIONALES (394 skills)

| Área                   | Items  | Descripción                          |
|-----------------------|-------|-------------------------------------|
| 00_Compound_Engineering| 63     | Core CE — SDD + Compound Engineering |
| 00_System_Core         | 1      | Stack base OS + Gcierr               |
| 10_Skill_Auditor       | 1      | Auditoría de skills                  |
| 01_Creacion_Contenidos | 40     | Brand, YouTube, SEO, Carruseles      |
| 02_Diseno_Ui_Ux        | 29     | Product Design, UI/UX, Taste, Minimal|
| 03_Video_Media         | 7      | Video Intel, James Cameron           |
| 04_Automatizacion      | 37     | N8N, Firecrawl, GWS Client           |
| 05_Workflows           | 37     | Agent Teams, PM, Orchestrator        |
| 06_Tools               | 112    | Skill Creator, Testing, DevOps, Data |
| 07_Personal_Os         | 32     | Life OS, Hillary, Rituales           |
| 08_Invictus_Web        | 15     | Playwright, Superpowers, Browser Auto|
| 09_Claude_Ads          | 20     | Claude Ads & Promoted Content        |
| **TOTAL**              | **394**| Total real indexado en disco         |

> Las skills están tanto en carpetas de área como en subcarpetas internas.

---

## 📊 MCPs — 7 SERVIDORES ROOT + 38 BACKUP (Claude Code)

| Categoría          | Servidores                                                             |
|-------------------|-----------------------------------------------------------------------|
| 🔍 Search           | exa, brave-search, stackoverflow                                       |
| 🧠 Memory           | engram, aim-memory-bank, notebooklm                                    |
| 📝 Notes            | Notion, mcp-obsidian, obsidian-api                                     |
| 🌐 Browser          | Playwright, chrome-devtools, eagle-mcp                                 |
| 🤖 AI & Code        | context7, zai-mcp-server, github, task-master-ai, @magicuidesign/mcp   |
| 📊 Data             | supabase, Amplitude, supadata                                          |
| 🔄 Workflow         | n8n-mcp, Linear                                                        |
| 💬 Communication    | fireflies, google-workspace                                            |
| 📐 Design           | excalidraw-yctimlin, pencil                                            |
| 🛠️ DevOps          | docker, filesystem                                                     |
| 🚀 Deploy           | vercel, recall, TestSprite                                             |
| 🧩 Chain            | sequential-thinking, nanobanana, qmd                                   |

---

## ⚡ AGENTES — 48 configuraciones activas

| Categoría                 | Cantidad  | Ubicación                                                              |
|--------------------------|----------|-----------------------------------------------------------------------|
| **Dream Team**            | 5         | `01_Dream_Team/` (Product, Data, Marketing, Design, Platform)          |
| **Specialists Compound**  | 23        | `02_Specialists_Compound/`                                             |
| **Individuales**          | 13        | Raíz `01_Agents/` (Orchestrator, AIPM_Judge, LFG, etc.)                |
| **Growth**                | 5         | `03_Growth/`                                                           |
| **Root**                  | 2         | `01_Agents/` (00_Orchestrator, 00_Agent_Template)                      |

---

## 🎯 HUBs — 21 HUBs + 267 SCRIPTS (+88 legacy)

### Scripts Python en raíz de 03_Scripts_Os/ (principales)

| #   | Hub                | Script                                | Propósito                                                  |
|----|-------------------|--------------------------------------|-----------------------------------------------------------|
| 00  | Sound Engine       | `00_Sound_Engine.py`                  | Notificaciones sonoras                                     |
| 01  | Auditor            | `01_Auditor_Hub.py`                   | Auditorías del sistema                                     |
| 02  | Git                | `02_Git_Hub.py`                       | Operaciones Git                                            |
| 03  | AIPM               | `03_AIPM_Hub.py`                      | AI Performance Monitoring                                  |
| 04  | Ritual             | `04_Ritual_Hub.py`                    | Rituales de sesión                                         |
| 05  | Validator          | `05_Validator_Hub.py`                 | Validación de código                                       |
| 06  | Tool               | `06_Tool_Hub.py`                      | Gestión de herramientas                                    |
| 07  | Integration        | `07_Integration_Hub.py`               | Integraciones MCP                                          |
| 08  | Workflow           | `08_Workflow_Hub.py`                  | Automatización de workflows                                |
| 09  | Data               | `09_Data_Hub.py`                      | Procesamiento de datos                                     |
| 10  | General            | `10_General_Hub.py`                   | Utilidades generales                                       |
| 11  | Auto Learn         | `11_Auto_Learn_Hub.py`                | Motor de automejora                                        |
| 14  | Health Metrics     | `14_Health_Metrics_Hub.py`            | Métricas de salud del OS                                   |
| 15  | MCP Sync ★         | `15_MCP_Sync_Hub.py`                  | Sync drift Claude ↔ OpenCode                               |
| 16  | Agent Mirror       | `16_Agent_Mirror_Hub.py`              | Mirror agentes source → backup                             |
| 17  | Watchdog ★         | `17_Watchdog_Hub.py`                  | Health watchdog                                            |
| 18  | Telemetry ★        | `18_Telemetry_Hub.py`                 | Dashboard de métricas                                      |
| 19  | Agent Sync         | `19_Agent_Sync_Hub.py`                | Sync .agent ↔ 01_Core                                      |
| 20  | System Mapper ★    | `20_System_Mapper_Hub.py`             | Genera 7 manifests JARVIS                                  |
| 21  | Legacy Cleanup     | `21_Legacy_Path_Cleanup.py`           | Limpia paths legacy v2.x                                   |
| 22  | Skill Frontmatter  | `22_Validate_Skill_Frontmatter.py`    | Detecta skills sin frontmatter YAML                        |

### Scripts Auxiliary

| #   | Script                                  | Propósito                                                           |
|----|----------------------------------------|--------------------------------------------------------------------|
| 33  | `33_Parallel_Audit_Pro.py`              | Auditoría paralela avanzada                                         |
| 34  | `34_Skill_Auditor.py`                   | Auditoría específica de skills                                      |
| 50  | `50_System_Health_Monitor.py`           | Monitor de salud del sistema                                        |
| 57  | `57_Repo_Sync_Auditor.py`               | Auditor de sincronización de repos                                  |
| 23  | `23_path_replacement.py`                | Reemplazo de paths legacy                                           |
| —   | `refactor_revert_id.py`                 | Utilidad one-off para revertir IDs en refactor                      |

### Subdirectorios (organización)

| Dir                        | Contenido                                                                   |
|---------------------------|----------------------------------------------------------------------------|
| `00_Context_LLM/`          | Memoria y notas LLM                                                         |
| `01_Ritual/`               | Scripts de rituales                                                         |
| `02_Tool/`                 | Herramientas auxiliares                                                     |
| `03_Validator/`            | Validadores                                                                 |
| `04_Workflow/`             | Workflows                                                                   |
| `05_AIPM/`                 | AIPM scripts (9)                                                            |
| `06_Auditor/`              | Auditorías                                                                  |
| `07_Data/`                 | Datos (4)                                                                   |
| `08_General/`              | Generales (4)                                                               |
| `09_Integration/`          | Integraciones (3)                                                           |
| `10_Legacy/`               | Legacy (88)                                                                 |
| `11_Anthropic_Harness/`    | Harness Anthropic                                                           |
| `12_Audits/`               | Auditorías                                                                  |
| `13_Auditors_Os/`          | Auditores OS                                                                |
| `14_Otros/`                | Otros                                                                       |
| `05_Validator/`            | Validadores (8)                                                             |

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

| Rank                      | Skill                                       | Valor                      | SOTA                      | Diseño                      | Total                      |
|--------------------------|--------------------------------------------|---------------------------|--------------------------|----------------------------|---------------------------|
| 🥇 1                       | **Dumbledor Design**                        | 10                         | 9                         | 10                          | **29**                     |
| 🥈 2                       | **Huashu Design**                           | 10                         | 10                        | 9                           | **29**                     |
| 🥉 3                       | **Ui Ux Pro Max**                           | 9                          | 8                         | 9                           | **26**                     |
| 4                         | **Frontend Slides**                         | 10                         | 9                         | 7                           | **26**                     |
| 5                         | **Design SOTA**                             | 8                          | 9                         | 8                           | **25**                     |

---

## 📁 WORKFLOWS — 7 CATEGORÍAS (30 workflows)

| Categoría                    | Path                            | Workflows                                      |
|-----------------------------|--------------------------------|-----------------------------------------------|
| YouTube Full Video           | `__Youtube_Full_Video/`         | Video production pipeline                      |
| Learning Always              | `00_Learning_Always/`           | Continuous learning                            |
| Personal OS                  | `01_Personal_Os/`               | Morning, Backlog, Content, Weekly              |
| Marvel                       | `02_Marvel/`                    | **Iron Man Genesis** (boot), Spider, Thor, Hulk|
| Gentleman                    | `03_Gentleman/`                 | Gentleman standards                            |
| Hillary                      | `04_Hillary/`                   | Hillary Life OS                                |
| Compound Engineering         | `05_Compound_Engineering/`      | CE workflows                                   |

---

## 🔥 BOOT PROTOCOL — IRON MAN GENESIS

Al iniciar sesión O al recibir cualquier instrucción, ejecutar `.agent/03_Workflows/02_Marvel/01_Iron_Man_Gen.md` PRIMERO.

> ⚠️ **REGLA DE ORO:** Sin lectura completa del contexto NO hay respuesta. Leer todos los archivos listados en el workflow de genesis antes de actuar.

---

---

## 📋 AUDIT LOG — Findings Documentados (v4.7 Consequences)

Los siguientes hallsazgos fueron identificados durante la auditoría OS integral del 2026-05-25 y **documentados sin eliminar información**:

### Estructurales
| #  | Hallazgo                                                   | Estado                 |
|---|-----------------------------------------------------------|-----------------------|
| 1  | `05_Archive/` faltaba en árbol README.md                   | ✅ CORREGIDO            |
| 2  | `05_Archive/` antes que `04_Operations/` en OS_DIRECTORY.md| ✅ CORREGIDO            |
| 3  | `00_EVOLUTION_LOG.md` no documentado en ningún árbol       | ✅ CORREGIDO            |
| 4  | Gap de numeración en `02_Playground/`: no existe `05_`     | 📌 DOCUMENTADO          |
| 5  | `refactor_revert_id.py` huérfano (sin documentar en HUBs)  | ✅ CORREGIDO            |
| 6  | `excalidraw.log` en raíz                                   | ✅ .gitignore (fase 1-2)|

### Skills
| #  | Hallazgo                                                               | Estado                          |
|---|-----------------------------------------------------------------------|--------------------------------|
| 7  | 0/394 skills tienen campo `trigger:` en frontmatter YAML               | 📌 MEJORA POTENCIAL — no es error|
| 8  | ~30 skills duplicadas de migración incompleta (áreas 02/04)            | 📌 PRESERVADO — no se elimina    |
| 9  | 18 skills Engram existen solo en backup (`.agent/02_Skills/02_Engram/`)| 📌 PRESERVADO — backup natural   |
| 10 | `.opencode/skills/ui-ux-pro-max` huérfano (no en árbol source)         | 📌 PRESERVADO — skill local      |

### Scripts
| #  | Hallazgo                                                                                                                      | Estado                                          |
|---|------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------|
| 11 | Directorios duplicados en `03_Scripts_Os/`: 05_AIPM↔03_AIPM, 05_Validator↔03_Validator, 09_Data↔07_Data, 10_General↔08_General| 📌 PRESERVADO — inflación intencional para backup|
| 12 | `HUB_SOTA.py` duplicado (v4.7 raíz + v4.1 en 10_Legacy)                                                                       | 📌 PRESERVADO — versiones históricas             |
| 13 | `10_Legacy/` con ~85 scripts mayormente duplicados de versiones modernas                                                      | 📌 PRESERVADO — archivo histórico                |
| 14 | `config_paths.py`: 0 referencias rotas verificadas                                                                            | ✅ VERIFICADO                                    |

### Referencias Cruzadas
| #  | Hallazgo                                                       | Estado                             |
|---|---------------------------------------------------------------|-----------------------------------|
| 15 | Números canónicos 28/284/394/36 sync post-Judgment Day         | ✅ VERIFICADO (commit fb823448e)    |
| 16 | `.agent/README.md` decía 23 scripts, real son 31 root + subdirs| 📌 DOCUMENTADO — backup no es fuente|

> **NOTA:** todo hallazgo marcado como PRESERVADO se mantiene intencionalmente. El sistema prioriza no perder información histórica sobre la limpieza perfecta.

---

*Actualizado: 2026-05-25 | PersonalOS v4.8 Consequences | Every CE v3.8.4 ✅ | gentle-ai v1.30.6 | 394 skills source / 407 backup | 48 agents | 21 HUBs | 267 active scripts + 88 legacy | 30 workflows | 13 hooks*
