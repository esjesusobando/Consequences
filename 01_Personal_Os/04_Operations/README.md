# 04_Operations — Motor Operativo PersonalOS v4.8

**Versión:** 4.8 Consequences
**Última actualización:** 2026-05-23
**Estado:** ✅ Activo (v4.8 Consequences)

---

## 📂 Estructura (Workspace) — v4.8 Consequences

```
Think_Different/
├── 00_Winter_is_Coming/    # Estrategia, Backlog y ADN (ESTRATÉGICO)
├── 01_Personal_Os/             # Sistema Operativo Personal
│   ├── 01_Core/              # Motor OS: Skills, Agents, MCPs (FUENTE DE VERDAD)
│   ├── 02_Knowledge/         # Base de Conocimiento, Research y Documentación
│   ├── 03_Task/              # Gestión de Tareas Activas
│   ├── 05_Archive/           # Backups, snapshots, históricos
│   └── 04_Operations/        # Cerebro Operativo y Automatización ✅
├── 02_Playground/         # Laboratorio de Pruebas y Experimentos
├── 03_Resultado/          # Resultados de proyectos
└── .atl/                  # SDD Registry + openspec
```

---

## 📂 Estructura 04_Operations

```
04_Operations/
├── 00_Context_LLM/           # Memoria de contexto de sesiones (CTX)
├── 01_Auto_Improvement/       # Lógica de auto-evolución del OS
├── 02_Agent_Teams_Lite/      # Orquestación SDD + Manifest ✅
│   ├── 00_Manifest/         # Registros YAML (MCP, Agents, HUBs, Workflows, Hooks)
│   └── 01_Agent_Teams_Lite/ # SDD Workflow Skills + AGENTS.md
├── 03_Scripts_Os/            # 21+2 HUBs operativos ✅
├── 04_Installer/             # Scripts de instalación y configuración
└── 05_Projects/             # Proyectos activos
```

---

## 📂 Estructura 02_Agent_Teams_Lite (SDD Workflow)

```
02_Agent_Teams_Lite/
├── 00_Manifest/
│   ├── 02_MCP_Registry.yaml     # 33 MCP servers
│   ├── 03_Agent_Catalog.yaml  # 52 agents
│   ├── 05_HUB_Catalog.yaml   # 18 HUBs
│   ├── 06_Workflow_Graph.yaml # Workflow orchestration
│   └── 07_Hook_Registry.yaml # 12 hooks
└── 01_Agent_Teams_Lite/
    ├── AGENTS.md              # SDD Workflow definition
    └── skills/               # 10 SDD skills (sdd-*, skill-registry)
```

---

## 📂 Estructura 03_Scripts_Os (21+2 HUBs operativos)

> **Nota:** Algunos números corresponden a **directorios** (ej. `02_Tool/`, `03_AIPM/`) que contienen herramientas auxiliares, no scripts individuales. La lista abajo son los HUBs/scripts principales en la raíz del directorio.

```
03_Scripts_Os/
├── 00_Sound_Engine.py            # Motor de notificaciones sonoras
├── 01_Auditor_Hub.py            # System validation
├── 02_Git_Hub.py                # Git operations + structure audits
├── 02_Tool/                     # Tool directory (auxiliary tools)
├── 03_AIPM_Hub.py               # AI Performance Monitoring
├── 03_AIPM/                     # AIPM tools directory
├── 03_Validator/                # Validator tools directory
├── 04_Ritual_Hub.py             # Session rituals
├── 04_LangGraph_Templates/      # LangGraph templates
├── 05_Validator_Hub.py          # Code validation
├── 05_AIPM/                     # AIPM tools (copy)
├── 05_Validator/                # Validator tools (copy)
├── 06_Tool_Hub.py               # Tool integration
├── 06_Tool/                     # Tool utilities
├── 07_Integration_Hub.py        # MCP and external integrations
├── 07_Data/                     # Data processing tools
├── 07_Integration/             # Integration tools
├── 08_Workflow_Hub.py           # Workflow automation
├── 08_General/                  # General utilities
├── 09_Data_Hub.py               # Data processing
├── 09_Data/                     # Data tools
├── 09_Integration/             # Integration tools
├── 10_General_Hub.py            # General utilities
├── 10_General/                  # General tools
├── 10_Legacy/                   # Legacy scripts archive
├── 11_Auto_Learn_Hub.py         # Motor de automejora
├── 11_Anthropic_Harness/        # Anthropic harness tools
├── 12_Audits/                   # Audit directory
├── 13_Auditors_Os/             # Auditor tools
├── 14_Health_Metrics_Hub.py     # Métricas de salud
├── 14_Otros/                    # Other miscellaneous tools
├── 15_MCP_Sync_Hub.py          # MCP drift report
├── 16_Agent_Mirror_Hub.py      # Agent sync
├── 17_Watchdog_Hub.py          # Health monitoring
├── 18_Telemetry_Hub.py         # Usage stats
├── 19_Agent_Sync_Hub.py        # Agent synchronization
├── 20_System_Mapper_Hub.py     # Map system state
├── 21_Legacy_Path_Cleanup.py   # Legacy path cleanup
├── 22_Validate_Skill_Frontmatter.py  # Validate skill YAML frontmatter
├── 23_path_replacement.py      # Path migration utility
├── 23_Preview_Generator.js     # HTML preview generator
├── 24_mass_path_migration.py   # Bulk path migration
├── 25_Minimax_Optimizer_Hub.py # Minimax API optimizer
├── 33_Parallel_Audit_Pro.py    # Parallel audit system
├── 34_Skill_Auditor.py         # Skill audit tool
├── 50_System_Health_Monitor.py # System health monitor
├── 57_Repo_Sync_Auditor.py     # Repo sync auditor
├── HUB_SOTA.py                 # SOTA Features Orchestrator
├── HUB_CATALOG.md              # Auto-generated HUB catalog
├── SCRIPTS_INDEX.md            # Scripts index
└── README.md                   # Documentation
```

---

## 🎯 Propósito

Esta carpeta contiene el **cerebro operativo** del sistema - memoria a largo plazo, notas de sesiones, y mapeos:

| Subcarpeta                            | Contenido                                           |
|--------------------------------------|----------------------------------------------------|
| `00_Context_LLM/`                     | CTX de sesiones, JSONs de validación                |
| `02_Agent_Teams_Lite/`                | SDD Workflow + Manifest registries ✅                |
| `03_Scripts_Os/`                      | 21+2 HUBs operativos + directorios auxiliares       |

---

## 📊 Estadísticas

| Área                       | Cantidad                                                                                                                                    |
|---------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| SDD Skills                 | 10 (sdd-init, sdd-explore, sdd-propose, sdd-spec, sdd-design, sdd-tasks, sdd-apply, sdd-verify, sdd-archive, skill-registry)                |
| MCP Servers                | 33                                                                                                                                          |
| Agents                     | 52                                                                                                                                          |
| HUBs                       | 28                                                                                                                                          |

---

## 🔄 Integración con Engram

El sistema usa Engram (MCP) para memoria persistente. Los archivos en esta carpeta son backups locales.

```bash
# Buscar en memoria
mem_search [query]

# Guardar memoria
mem_save [title] [content]
```

---

## 🔗 Referencias

- **SDD Config:** `.atl/openspec/config.yaml`
- **Skill Registry:** `.atl/skill-registry.md`
- **HUB Catalog:** `03_Scripts_Os/HUB_CATALOG.md`
- **Scripts Index:** `03_Scripts_Os/SCRIPTS_INDEX.md`

---

_Think Different PersonalOS v4.8 Consequences — Cerebro operativo_
