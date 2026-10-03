# Think Different PersonalOS v1.0.0-consequences — Production Ready

[![License](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-orange)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![Version](https://img.shields.io/badge/Version-1.0.0-00FF00)]()
[![Status](https://img.shields.io/badge/Status-PRODUCTION%20READY-00FF00)]()
[![OS](https://img.shields.io/badge/Think%20Different-OS--1.0-7B68EE)]()

> 🧠 **Sistema operativo personal potenciado con IA** — Orquestación multi-agente, 429 skills SSOT (17 áreas), 140 agents Pure Green (70+70), metodologías integradas y automatización completa.

- --

## 🗺️ Workflow Triggers

> **Palabras que activan workflows.** Decir la palabra correcta activa el flujo correspondiente.

| Trigger | Workflow | Qué hace |
|---------|----------|----------|
| `/hillary`, "life os" | **Hillary** | Captura ágil → triaje → inbox zero |
| "supercampeones", "agent teams" | **Workflows** | Coordinación multi-agente |
| "octopus", "ejecuta en paralelo" | **Octopus** | Ejecución paralela formación 3-3-4 |
| "compound", "ce-review" | **Compound Engineering** | Review + documentar learnings |
| "nos vamos a casa", "cierre" | **Ritual Cierre** | Cierre de sesión, commit, limpieza |
| "backlog", "triage" | **Backlog Triage** | Auditoría issues/PRs, clasificación |
| "documentar", "documenta", "los 3 sitios" | **Documentar 3** | Sesión completa en los 3 sitios: Context Memory + Process Notes + Engram |
| "learning always" | **Learning Always** | Aprendizaje continuo |
| "marvel", "iron man" | **Marvel** | Agents especializados |
| "gentleman", "frontend" | **Gentleman** | Creación UI |
| "sdd", "propose", "spec" | **SDD Agent Teams** | Ciclo completo Spec-Driven |
| "judgment day" | **Judgment Day** | Review adversarial 2 jueces ciegos |
| "youtube", "video" | **Youtube Full Video** | Procesamiento video YouTube |
| "beauty", "embellece" | **Beautify Tables** | Formatear tablas markdown |

- --

## 📊 Estado del Sistema (v1.0.0-consequences — Production Ready — 2026-09-21)

> 🟢 **PRODUCTION READY** - v1.0.0-consequences lista para uso público

| Métrica           | Valor                         |
|------------------|------------------------------|
| **Overall Health**| **100%** 🟢                    |
| **Rules**         | **17** (.mdc)                 |
| **Skills**        | **429** (17 áreas funcionales)|
| **Agents**        | **140** (70 source + 70 backup)|
| **Workflows**     | **29** (8 categorías)         |
| **HUBs**          | **32 root + 185 scripts**     |
| **MCPs**          | **40 Claude** + **35 OpenCode**|

- --

## 🚀 Quick Start

```bash
# En tu AI assistant (OpenCode, Claude Code, etc.)

1. Leer 00_Winter_is_Coming/AGENTS.md
2. Ejecutar engram_mem_context(limit: 10)
3. ¡Listo para trabajar!
```

- --

## 📂 Estructura del Sistema (v1.0.0-consequences — Production Ready)

```
Think_Different/                           # RAÍZ

├── 00_Winter_is_Coming/           ✅ Goals, Backlog, AGENTS.md, CHANGELOG
├── 01_Personal_Os/                ✅ EL SISTEMA OPERATIVO
│   ├── 01_Core/                   ✅ Motor del OS (FUENTE DE VERDAD)
│   │   ├── 00_Workflows_Os/       ✅ 29 workflows (7 categorías)
│   │   ├── 01_Rules/              ✅ 17 reglas .mdc — FUENTE DE VERDAD
│   │   └── 02_Tools/              ✅ Todas las herramientas
│   │       ├── 01_Agents/         ✅ 99 agentes
│   │       ├── 02_Skills/         ✅ 429 skills — 17 áreas funcionales
│   │       ├── 03_Mcp/            ✅ Backup MCP configs
│   │       ├── 04_Integrations/   ✅ Fireflies, Granola
│   │       ├── 05_Hooks/          ✅ 11 hooks (6 fases)
│   │       ├── 06_Plugins/        ✅ Plugins OS
│   │       ├── 07_Server/         ✅ Engram server
│   │       ├── 08_Evals/          ✅ Evaluadores
│   │       └── 09_Templates/      ✅ Templates
│   ├── 02_Knowledge/              ✅ Base de conocimiento + Docs
│   ├── 03_Task/                   ✅ Tareas activas
│   │   ├── 00_P0_Auditoria.md/
│   │   ├── 01_Tasks_Done/
│   │   ├── 02_Hillary_Inbox/
│   │   └── README.md
│   ├── 04_Operations/            ✅ Motor operativo
│       ├── 00_EVOLUTION_LOG.md   ✅ Registro histórico de evolución del OS
│       ├── 00_Context_LLM/       ✅ Memoria LLM (Engram, notes)
│       ├── 01_Auto_Improvement/  ✅ Auto-mejora recursiva
│       ├── 02_Agent_Teams_Lite/  ✅ SDD registry + 7 manifests JARVIS
│       ├── 03_Scripts_Os/        ✅ 35 HUBs — 179 scripts totales
│       ├── 04_Installer/         ✅ Installer
│       ├── 05_Projects/          ✅ Proyectos activos
│       ├── 06_SOTA_Features/     ✅ Features estado-del-arte
│       ├── 07_Reports/           ✅ Reportes generados (consolidados en 04_Reportes_All)
│       ├── GOVERNANCE.md
│       └── RUNBOOK.md
│   └── 05_Archive/               ✅ Backups, snapshots, históricos
├── 02_Playground/                ✅ Zona de pruebas (gap numeración: no existe 05_ — preservado)
│   ├── 00_Momentum/
│   ├── 01_Branders_Skills/
│   ├── 02_Workflow_N8N/
│   ├── 03_Reports/
│   ├── 04_Side Project/
│   ├── 06_Testing_Legacy/         # Scripts de test

│   │   ├── 01_OS_Runtime_Test.py
│   │   ├── 05_OS_Health_Test.py
│   │   └── 06_OS_Deep_Audit.py
│   └── Kit_Diseño_Top.md
├── 03_Resultado/                 ✅ Outputs de proyectos (agrupado: Proyectos, Aprendizaje, Experimentos, Reportes, Documentacion)
│   ├── 00_Proyectos/            # Planes, revisiones, side projects

│   ├── 01_Aprendizaje/          # Skills output, fundamentos, referencias

│   ├── 02_Experimentos/         # World OIM, ejercicios, sesiones

│       ├── 04_Documentacion/        # Documentación general

│   │   ├── 01_Proyectos/          # Planes, revisiones, side projects
│   │   ├── 02_Aprendizaje/        # Skills output, fundamentos, referencias
│   │   ├── 03_Experimentos/       # World OIM, ejercicios, sesiones
│   │   ├── 04_Reportes_All/       # **Reportes consolidados**: técnicos y auditorías OS
│   │   │   ├── 01_Reportes/         # Reportes técnicos: watchdog, migración, paths
│   │   │   └── 02_Auditorias/       # Auditorías del Sistema Operativo
│   │   └── 05_Testing_Skills/     # Pruebas controladas y outputs HTML de skills

├── .agent/                      ✅ BACKUP ESTRATÉGICO
├── .atl/                        ✅ SDD Registry + openspec/
├── .claude/                     ✅ Config Claude Code
├── .opencode/                   ✅ Config OpenCode + skills locales
├── .mcp.json                    ✅ 40 MCPs Claude Code (canónico 03_Mcp/)
├── OS_DIRECTORY.md              ✅ JARVIS discovery
├── AGENTS.md                    ✅ GGA Pre-Commit
├── CLAUDE.md                    ✅ Config IAs
└── README.md                    ✅ Este archivo
```

> **📍 PATH CRITICAL:** Skills en `01_Personal_Os/01_Core/02_Tools/02_Skills/` — NO usar paths antiguos

- --

## 🆕 Nueva Regla: Validación de Secuencia y Numeración
**Siempre que vaya a cambiar nombre o numeración de carpetas/archivos:**
1. ⏸️ **Pare y analice** la secuencia y numeración actual
2. 📋 **Verifique** qué archivos/carpetas se ven afectados
3. 🔢 **Confirme** la numeración que le toca según el protocolo ODD
4. 📝 **Documente** el cambio en Notas_de_Proceso y Context_Memory
5. ✅ **Siga** el patrón establecido antes de proceder

Esta regla aplica a TODAS las operaciones de renombrado, reestructuración o migración de archivos. Evita la confusión causada por cambios impulsivos y asegura la consistencia a través de sesiones y compaction.

> **Recordatorio:** Los cambios de estructura nunca deben basarse solo en "parecer bien" — debe haber un patrón documentado y verificado.

## 🛠️ Componentes Principales

### Skills System (v1.0.0 — 17 Áreas Funcionales)

| Área                       | Items  | Descripción                                                                       |
|---------------------------|-------|----------------------------------------------------------------------------------|
| **00_Agent_Teams_Lite**    | 13     | SDD sub-agentes + JARVIS manifests                                                |
| **00_Compound_Engineering**| 63     | Core CE — SDD + Compound Engineering                                              |
| **00_Personal_Os**         | 32     | Life OS, Hillary, Rituales                                                        |
| **00_Skill_Auditor**       | 1      | Auditoría de skills                                                               |
| **00_System_Core**         | 1      | Stack base del OS                                                                 |
| **00_Workflows**           | 43     | Workflows OS                                                                      |
| **01_Creacion_Contenidos** | 47     | Brand, YouTube, SEO, Marketing — 16 sub-áreas                                     |
| **02_Diseno_Ui_Ux**        | 34     | Product Design, UI/UX, Taste, Minimal                                             |
| **03_Video_Media**         | 7      | Video Intel, James Cameron                                                        |
| **04_Automatizacion**      | 24     | N8N, Firecrawl, GWS Client                                                        |
| **05_Claude_Ads**          | 21     | Claude Ads & Promoted Content                                                     |
| **06_Tools**               | 83     | Skill Creator, Testing, DevOps, Data                                              |
| **07_Invictus_Web**        | 15     | Playwright, Superpowers, Browser Auto                                             |
| **10_Laia_Learning**       | 1      | Sistema de aprendizaje personal                                                   |
| **TOTAL**                  | **429**| 429 skills verificadas contra disk — 17 áreas funcionales — ver `00_Manifest/04_Skill_Index.json`|

> 📍 **SSOT:** El desglose detallado por área está en `04_Skill_Index.json` del manifest. Esta tabla resume las 17 áreas.
> 
> `--validate` compara estos números contra el manifest automáticamente.

- --

### HUBs v1.0.0 (35 HUBs — 179 scripts totales)

| Hub                      | Script                            | Propósito                         |
|-------------------------|----------------------------------|----------------------------------|
| **Sound Engine**         | `00_Sound_Engine.py`              | Notificaciones sonoras            |
| **Auditor**              | `01_Auditor_Hub.py`               | Auditorías del sistema            |
| **Git**                  | `02_Git_Hub.py`                   | Operaciones Git                   |
| **AIPM**                 | `03_AIPM_Hub.py`                  | AI Performance Monitoring         |
| **Ritual**               | `04_Ritual_Hub.py`                | Rituales de sesión                |
| **Validator**            | `05_Validator_Hub.py`             | Validación de código              |
| **Tool**                 | `06_Tool_Hub.py`                  | Gestión de herramientas           |
| **Integration**          | `07_Integration_Hub.py`           | Integraciones MCP                 |
| **Workflow**             | `08_Workflow_Hub.py`              | Automatización de workflows       |
| **Data**                 | `09_Data_Hub.py`                  | Procesamiento de datos            |
| **General**              | `10_General_Hub.py`               | Utilidades generales              |
| **Auto Learn**           | `11_Auto_Learn_Hub.py`            | Motor de automejora               |
| **Health Metrics**       | `14_Health_Metrics_Hub.py`        | Métricas de salud del OS          |
| **MCP Sync** ★           | `15_MCP_Sync_Hub.py`              | Sync Claude ↔ OpenCode            |
| **Agent Mirror**         | `16_Agent_Mirror_Hub.py`          | Mirror source → backup            |
| **Watchdog** ★           | `17_Watchdog_Hub.py`              | Health watchdog                   |
| **Telemetry** ★          | `18_Telemetry_Hub.py`             | Dashboard de métricas             |
| **Agent Sync**           | `19_Agent_Sync_Hub.py`            | Sync .agent ↔ 01_Core             |
| **System Mapper** ★      | `20_System_Mapper_Hub.py`         | Genera 7 manifests JARVIS         |
| **Legacy Cleanup**       | `21_Legacy_Path_Cleanup.py`       | Limpia paths legacy               |
| **Skill Frontmatter**    | `22_Validate_Skill_Frontmatter.py`| Detecta skills sin frontmatter    |
| **Path Replacement**     | `23_path_replacement.py`          | Reemplazo de paths legacy         |
| **Mass Path Migration**  | `24_mass_path_migration.py`       | Migración masiva de paths         |
| **Minimax Optimizer**    | `25_Minimax_Optimizer_Hub.py`     | Optimización Minimax              |
| **Parallel Audit Pro**   | `26_Parallel_Audit_Pro.py`        | Auditoría paralela                |
| **Skill Auditor**        | `27_Skill_Auditor.py`             | Auditoría específica de skills    |
| **System Health Monitor**| `28_System_Health_Monitor.py`     | Monitor de salud                  |
| **Repo Sync Auditor**    | `29_Repo_Sync_Auditor.py`         | Auditor de sincronización         |
| **HUB SOTA**             | `HUB_SOTA.py`                     | HUB de HUBs SOTA                  |
| **Config Paths**         | `config_paths.py`                 | Configuración de paths del sistema|

> ★ = HUB canónico JARVIS 4.5 | Scripts adicionales en subdirectorios organizados por función

- --

### Agentes (62 total)

> 📍 **SSOT:** `01_OS_Inventory.json` → `agents.by_category`. Esta tabla referencia los valores del manifest actual (2026-09-21).

| Categoría           | Cantidad  | Ubicación                                                                |
|--------------------|----------|-------------------------------------------------------------------------|
| Root                | 34        | Directo en `01_Agents/` + `00_Agent_Teams_Lite/` + `00_OS_Conductor/`    |
| Dream Team          | 5         | `01_Core/02_Tools/01_Agents/01_Dream_Team/`                              |
| Specialists Compound| 23        | `01_Core/02_Tools/01_Agents/02_Specialists_Compound/`                    |
| Growth              | 5         | `01_Core/02_Tools/01_Agents/03_Growth/`                                  |
| Other               | 3         | `04_Contexto/`, `05_Marca/`, `06_Plantillas/`, `07_Agent_Teams_Lite_Gen/`|
| **Backup .agent/**  | 70        | Sincronizado perfecto via `19_Agent_Sync_Hub.py`                       |
| **TOTAL**           | **140**   | 70 source + 70 backup - drift 0                                          |

### MCPs (8 root + 43 backup OpenCode)

| Servidor           | Propósito                | Fuente        |
|-------------------|-------------------------|--------------|
| exa               | Search (backup)         | root .mcp.json|
| brave-search      | Search (backup)         | root .mcp.json|
| stackoverflow     | Q&A (backup)            | root .mcp.json|
| aim-memory-bank   | Memory (root)           | root .mcp.json|
| notebooklm        | Notes (backup)          | root .mcp.json|
| Notion            | Notes (backup)          | root .mcp.json|
| obsidian-mcp      | Notes (root)            | root .mcp.json|
| Playwright        | Browser (backup)        | root .mcp.json|
| chrome-devtools   | Browser (backup)        | root .mcp.json|
| context7          | AI & Code (root)        | root .mcp.json|
| @magicuidesign/mcp| Design (root)           | root .mcp.json|
| zai-mcp-server    | AI SDK                 | root .mcp.json|
| github            | Version control         | root .mcp.json|
| task-master-ai    | Task automation         | root .mcp.json|
| supadata          | Data enrichment         | root .mcp.json|
| fireflies         | Communication (root)    | .mcp.json     |
| google-workspace  | Communication (root)    | .mcp.json     |
| excalidraw-yctimlin| Design               | root .mcp.json|
| pencil            | Design                 | root .mcp.json|
| docker            | DevOps (backup)         | .mcp.json     |
| filesystem        | DevOps (backup)         | .mcp.json     |
| vercel            | Deploy (backup)         | .mcp.json     |
| recall            | Deploy (backup)         | .mcp.json     |
| test-sprite       | Test (backup)           | .mcp.json     |
| brave-search      | Search                 | OpenCode      |
| aim-memory-bank   | Memory                 | OpenCode      |
| notebooklm        | Notes                  | OpenCode      |
| mcp-obsidian      | Notes                  | OpenCode      |
| obsidian-api      | Notes                  | OpenCode      |
| sequential-thinking| Workflow              | OpenCode      |
| nanobanana        | Chain                   | OpenCode      |
| qmd               | Render                   | OpenCode      |

> **Claude Code:** 40 servidores activos en `.mcp.json` (canónico `03_Mcp/`)
> **OpenCode:** 35 servidores activos — drift 0 vs `.mcp.json`

- --

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

## 🔧 Comandos CE (Compound Engineering)

```
/ce:ideate          # Generar ideas

/ce:brainstorm     # Lluvia de ideas

/ce:plan            # Crear planes

/ce:work            # Ejecutar trabajo

/ce:review          # Revisar

/ce:compound        # Documentar conocimiento → 01_Personal_Os/02_Knowledge/04_Docs/

```

## ⚙️ GGA — Guardian Angel

```bash
.agent/05_GGA/bin/gga run      # Revisar archivos staged

.agent/05_GGA/bin/gga install  # Instalar pre-commit hook

```

### Reglas GGA

- TypeScript: `const`/`let` solo, no `var`
- React: Componentes funcionales, named exports

- --

## 📚 Documentación

| Documento                      | Ubicación                                                    |
|-------------------------------|-------------------------------------------------------------|
| **OS_DIRECTORY.md**            | Raíz — JARVIS discovery                                      |
| **AGENTS.md**                  | `00_Winter_is_Coming/AGENTS.md`                              |
| **RULES_INDEX**                | `01_Personal_Os/01_Core/01_Rules/RULES_INDEX.md`             |
| **Skills README**              | `01_Personal_Os/01_Core/02_Tools/02_Skills/README.md`        |
| **Scripts INDEX**              | `01_Personal_Os/04_Operations/03_Scripts_Os/SCRIPTS_INDEX.md`|
| **OS_DIRECTORY** (este archivo)| Raíz                                                         |

- --

## 🤝 Metodologías Integradas

| Metodología             | Propósito                                 | Comando                |
|------------------------|------------------------------------------|-----------------------|
| **SDD**                 | Desarrollo guiado por specs (9 fases)     | `/sdd-*`               |
| **Super Campeones**     | Orquestación de agentes en equipo         | Activado por defecto   |
| **Compound Engineering**| Cada unidad facilita la siguiente         | `/ce:*`                |
| **GGA**                 | Code review automático pre-commit         | `.agent/05_GGA/bin/gga`|
| **Auto-Improvement**    | Detección y corrección recursiva de issues| `04_Operations/`       |

- --

## 🎯 Workflow Diario

1. **Inicio de sesión**: `engram_mem_context()` + leer GOALS.md
2. **Trabajo**: Usar SDD commands para tareas complejas
3. **Review**: GGA valida código automáticamente
4. **Cierre**: `engram_mem_session_summary()`

- --

## 📄 Licencia

CC BY-NC-SA 4.0 - Uso no comercial permitido.

- --

_Think Different PersonalOS v1.0.0-consequences — Production Ready ✅ — 2026-09-15_

* Estructura completa: ver `Structure_v4.9.md`*

## 🤝 Metodologías Integradas (duplicate removed - consolidated above)

- --
