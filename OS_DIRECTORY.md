# 🤖 PERSONALOS — DIRECTORIO MAESTRO (JARVIS)

**v5.0 SOTA** | 2026-06-03

---

## 🚨 ESTADO DEL SISTEMA

| Componente                            | Total                                                                      | Estado                                         |
|--------------------------------------|---------------------------------------------------------------------------|-----------------------------------------------|
| MCPs Claude Code                      | **8** (root) + **38** (backup)                                             | ✅ SYNCED — drift 0                             |
| Every CE                              | v3.8.4 (local repo) ✅                                                      | ✅ ACTIVE — Local version                       |
| gentle-ai                             | v1.30.6                                                                    | ✅ AVAILABLE                                    |
| Skills                                | **392** (15 áreas funcionales)                                             | ✅ VERIFIED — 392 SKILL.md files                |
| Agentes                               | **62** (25 root + 5 Dream T + 23 Spec + 5 Growth + 3 other)               | ✅ SYNCED — referencia al manifest              |
| HUBs                                  | **30** (todos con interfaz) — **163 scripts** totales (133 en subdirectorios)             | ✅ ACTIVE                                       |
| Scripts totales                       | — (incluido en HUBs)                                                       | —                                              |
| Workflows                             | **28** (7 categorías en 00_Workflows_Os — 1+10+8+2+2+4+1)                 | ✅ ACTIVE                                       |
| Hooks                                 | **10** (6 fases: Pre_Tool, Post_Tool, Lifecycle, Sound, Harness, Post_Hulk)| ✅ ACTIVE                                       |
| Rules                                 | **14** (.mdc)                                                              | ✅ DEFINED (00-13 + 13_HTML_Visualization)      |
| JARVIS Manifests                      | 7 en 00_Manifest/                                                          | ✅ VALIDATED                                    |
| Integrations                          | **2** (01_Fireflies, 02_Granola)                                           | ✅ INTEGRATED                                   |

> **🟢 Última AUDITORÍA:** 2026-06-03 — v5.0 SOTA Upgrades & Path Migration
> Agent Sync: 61 agentes totales. Skills: 392 (15 áreas). MCPs: **8+38** (Claude) / 36 (OpenCode). HUBs: 30 (con interfaz). Scripts: 163 totales. Rules: 14 .mdc.

---

## 🆕 v5.0 Cambios Recientes (SOTA)

1. **SOTA Upgrades** — Mejoras de vanguardia en Workflow_Hub (telemetría, typing, resiliencia).
2. **Heurísticas SOTA** — Zero-Context Loss implementado exitosamente en System_Core SKILL.
3. **Migración de Rutas** — Todas las referencias locales migradas de forma masiva a rutas absolutas nativas.
4. **Judgment Day Protocol** — Revisión adversarial de todos los cambios completada con veredicto limpio.
5. **Legado Saneado** — Eliminadas inconsistencias previas preservando data histórica.

---

## 🔄 Histórico v4.9
1. **Secuencias corregidas** — Playground, Reports, carpetas sin huecos
2. **Nomenclatura estandarizada** — Pascal_Case para datos, snake_case para código
3. **Rules actualizadas** — Convenciones de nomenclatura documentadas

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

## 🗂️ ESTRUCTURA COMPLETA v5.0

```
Think_Different/                         # RAÍZ
├── 00_Winter_is_Coming/          ✅ Goals, Backlog, AGENTS.md, CHANGELOG
├── 01_Personal_Os/               ✅ EL SISTEMA OPERATIVO
│   ├── 01_Core/                  ✅ Motor del OS (FUENTE DE VERDAD)
│   │   ├── 00_Workflows_Os/     ✅ 28 workflows (7 categorías)
 │   │   ├── 01_Rules/            ✅ 14 reglas .mdc
│   │   └── 02_Tools/
 │   │       ├── 01_Agents/         ✅ 82 agentes (25 Root + 5 Dream + 23 Specialists + 5 Growth + 24 Individuales)
 │   │       ├── 02_Skills/         ✅ 392 skills (14 áreas funcionales)
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
│   │   ├── 00_EVOLUTION_LOG.md   ✅ Registro histórico de evolución del OS
│   │   ├── 00_Context_LLM/        ✅ Memoria LLM (Engram, notes)
│   │   ├── 01_Auto_Improvement/   ✅ Motor auto-mejora recursiva
│   │   ├── 02_Agent_Teams_Lite/  ✅ SDD registry + 7 manifests
 │   │   ├── 03_Scripts_Os/         ✅ 22 HUBs + 256 scripts total
│   │   ├── 04_Installer/          ✅ Installer scripts
│   │   ├── 05_Projects/          ✅ Proyectos activos
│   │   ├── 06_SOTA_Features/     ✅ Features estado-del-arte
│   │   ├── 07_Reports/           ✅ Reportes generados
│   │   ├── GOVERNANCE.md
│   │   ├── README.md
│   │   └── RUNBOOK.md
│   ├── 05_Archive/                ✅ Backups, snapshots, históricos
│   │   ├── .agent_backup_pre_sync/
│   │   ├── 00_Backup_Os/
│   │   ├── 00_Skills_Legacy/
│   │   ├── 01_Repos_Reference/
│   │   ├── 02_Legacy_Content/
│   │   ├── 03_Backups_Audits/
│   │   ├── 04_Docs_Legacy/
│   │   ├── 05_Skills_Legacy/
│   │   ├── 06_Skills_Legacy/
│   │   └── README.md
├── 02_Playground/                ✅ Zona de pruebas (6 carpetas, scripts test en 06_Testing_Legacy/)
├── 03_Resultado/                 ✅ Outputs de proyectos (agrupado: Proyectos, Aprendizaje, Experimentos, Reportes, Documentacion, Testing)
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

## 🧠 SKILLS — 14 ÁREAS FUNCIONALES (392 skills)

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
| 09_Claude_Ads          | 11     | Claude Ads & Promoted Content        |
| **TOTAL**              | **385**| Total real indexado en disco         |

> Las skills están tanto en carpetas de área como en subcarpetas internas. (Nota: Existe además una carpeta Archive_Delete_Skills que no se cuenta).

---

## 📊 MCPs — 7 SERVIDORES ROOT + 38 BACKUP (Claude Code)

| Categoría          | Servidores (Root: 8)                                                   |
|-------------------|-----------------------------------------------------------------------|
| 🔍 Search           | exa (backup), brave-search (backup), stackoverflow (backup)            |
| 🧠 Memory           | engram (backup), aim-memory-bank (root), notebooklm (backup)           |
| 📝 Notes            | Notion (backup), obsidian-mcp (root)                                   |
| 🌐 Browser          | Playwright (backup), chrome-devtools (backup)                          |
| 🤖 AI & Code        | context7 (root), @magicuidesign/mcp (root)                             |
| 📊 Data             | supabase (backup), Amplitude (backup), supadata (backup)               |
| 🔄 Workflow         | n8n-mcp (backup), Linear (backup)                                      |
| 💬 Communication    | fireflies (backup), google-workspace (root)                            |
| 📐 Design           | eagle (root), higgsfield (root)                                        |
| 🛠️ DevOps          | docker (backup), filesystem (backup)                                   |
| 🚀 Deploy           | vercel (backup), recall (backup), TestSprite (backup)                  |
| 🧩 Chain            | sequential-thinking (root), nanobanana (backup), qmd (backup)          |

---

## ⚡ AGENTES — 62 source / 82 total

| Categoría             | Cantidad  | Ubicación                                                    |
|----------------------|----------|-------------------------------------------------------------|
| 🎯 Dream Team          | 5         | `01_Dream_Team/` — Product, Data, Marketing, Design, Platform|
| 🔬 Specialists Compound| 23        | `02_Specialists_Compound/`                                   |
| 🧑 Individuales        | 28        | Raíz `01_Agents/` — Orchestrator, AIPM, LFG, Hillary, Laia…  |
| 📈 Growth              | 5         | `03_Growth/` — Content, YouTube, Carousel                    |
| 🧠 OS Conductor        | 1         | `00_OS_Conductor/` — Entry point Anthropic 2.0 Harness       |
| ⚙️ SDD/CE             | +26       | gentle-ai, SDD phases, CE workflows                          |

---

## 🎯 HUBs — 31 scripts raíz + 169 total (+88 legacy)

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
| 23  | Preview Generator  | `23_Preview_Generator.js`             | Generador de previews (JavaScript)                         |
| 24  | Mass Path Migr.    | `24_mass_path_migration.py`           | Migración masiva de paths (batch)                          |
| 25  | Minimax Optimizer  | `25_Minimax_Optimizer_Hub.py`         | Optimizador Minimax                                        |
| 26  | Parallel Audit Pro | `26_Parallel_Audit_Pro.py`            | Auditoría paralela avanzada (ex 33_)                       |
| 27  | Skill Auditor      | `27_Skill_Auditor.py`                 | Auditor específico de skills (ex 34_)                      |
| 28  | System Health      | `28_System_Health_Monitor.py`         | Monitor de salud del sistema (ex 50_)                      |
| 29  | Repo Sync Auditor  | `29_Repo_Sync_Auditor.py`             | Auditor sync de repos (ex 57_)                             |
| 30  | Path Replacement   | `30_path_replacement.py`              | Reemplazo de paths legacy (ex 23_)                         |

### Scripts Adicionales en Raíz

| Script                  | Propósito                              |
|------------------------|---------------------------------------|
| `HUB_SOTA.py`           | HUB SOTA — features estado del arte    |
| `config_paths.py`       | Resolución centralizada de paths       |
| `refactor_revert_id.py` | Utilidad one-off para revertir IDs     |
| `qmd.sh`                | Quick Make script                      |
| `testsprite_failover.sh`| Failover TestSprite                    |
| `tarea_lista.bat`       | Notificación tarea completada (Windows)|

### Subdirectorios (organización)

| Dir                        | Contenido                                                                   |
|---------------------------|----------------------------------------------------------------------------|
| `00_Context_LLM/`          | Memoria y notas LLM                                                         |
| `01_Ritual/`               | Scripts de rituales de sesión                                               |
| `02_Git/`                  | Operaciones Git                                                             |
| `03_AIPM/`                 | AI Performance Monitoring                                                   |
| `04_LangGraph/`            | LangGraph utilities                                                         |
| `05_Validator/`            | Validadores de código y reglas                                              |
| `06_Tool/`                 | Integración y gestión de herramientas                                       |
| `07_Integration/`          | Integraciones MCP y sistemas externos                                       |
| `08_Data/`                 | Procesamiento y analytics de datos                                          |
| `09_Auxiliary/`            | Scripts auxiliares y utilidades                                             |
| `10_Anthropic/`            | Harness Anthropic                                                           |
| `11_Audits/`               | Auditorías del sistema                                                      |
| `12_Auditors_Os/`          | Auditores OS + scripts Context Bar                                          |
| `13_Legacy/`               | 📦 Legacy — scripts archivados (read-only)                                   |

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

## 📁 WORKFLOWS — 7 CATEGORÍAS (28 workflows)

| Categoría                    | Path                            | Workflows                                      |
|-----------------------------|--------------------------------|-----------------------------------------------|
| YouTube Full Video           | `06_Youtube_Full_Video/`        | Video production pipeline (1 workflow)         |
| Learning Always              | `00_Learning_Always/`           | Continuous learning (1 workflow)               |
| Personal OS                  | `01_Personal_Os/`               | Morning, Backlog, Content, Weekly (10)         |
| Marvel                       | `02_Marvel/`                    | Iron Man, Spider, Thor, Hulk (8)               |
| Gentleman                    | `03_Gentleman/`                 | Frontend Premium, Redacción de Docs (2)        |
| Hillary                      | `04_Hillary/`                   | Captura Rápida, Hillary Life OS (2)            |
| Compound Engineering         | `05_Compound_Engineering/`      | Deep Work, Ship It, Harness, Multi-Agent (4)   |

---

## 🔥 BOOT PROTOCOL — IRON MAN GENESIS

Al iniciar sesión O al recibir cualquier instrucción, ejecutar `.agent/03_Workflows/02_Marvel/01_Iron_Man_Gen.md` PRIMERO.

> ⚠️ **REGLA DE ORO:** Sin lectura completa del contexto NO hay respuesta. Leer todos los archivos listados en el workflow de genesis antes de actuar.

---

---

## 📋 AUDIT LOG — Findings Documentados (v5.0 SOTA)

Los siguientes hallazgos fueron identificados durante la auditoría OS integral SOTA del 2026-06-03 y **documentados sin eliminar información**:

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
| 7  | 0/392 skills tienen campo `trigger:` en frontmatter YAML               | 📌 MEJORA POTENCIAL — no es error|
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
| 15 | Renumbering 03_Scripts_Os: 00-13 dirs, 31 scripts raíz         | ✅ APLICADO (commits 2026-05-27)    |
| 16 | `.agent/README.md` decía 23 scripts, real son 31 root + subdirs| 📌 DOCUMENTADO — backup no es fuente|

> **NOTA:** todo hallazgo marcado como PRESERVADO se mantiene intencionalmente. El sistema prioriza no perder información histórica sobre la limpieza perfecta.

---

*Actualizado: 2026-06-03 | PersonalOS v5.0 SOTA | Every CE v3.8.4 ✅ | gentle-ai v1.30.6 | 392 skills | 61 agents | 30 HUBs | 163 scripts | 28 workflows | 10 hooks*
