# 04_Operations — Motor Operativo PersonalOS v4.5

**Versión:** 4.5 Consequences
**Última actualización:** 2026-05-21
**Estado:** ✅ Activo (v4.5 Consequences)

---

## 📂 Estructura (Workspace) — v4.5 Consequences

```
Think_Different/
├── 00_Winter_is_Coming/    # Estrategia, Backlog y ADN (ESTRATÉGICO)
├── 01_Personal_Os/             # Sistema Operativo Personal
│   ├── 01_Core/              # Motor OS: Skills, Agents, MCPs (FUENTE DE VERDAD)
│   ├── 02_Knowledge/         # Base de Conocimiento, Research y Documentación
│   ├── 03_Task/              # Gestión de Tareas Activas
│   └── 04_Operations/        # Cerebro Operativo y Automatización ✅
├── 05_Archive/            # Repositorio de Proyectos Finalizados
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
├── 03_Scripts_Os/            # 18 HUBs operativos ✅
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
│   └── 07_Hook_Registry.yaml # 10 hooks
└── 01_Agent_Teams_Lite/
    ├── AGENTS.md              # SDD Workflow definition
    └── skills/               # 10 SDD skills (sdd-*, skill-registry)
```

---

## 📂 Estructura 03_Scripts_Os (18 HUBs operativos)

```
03_Scripts_Os/
├── 00_Sound_Engine.py       # Motor de notificaciones sonoras
├── 01_Auditor_Hub.py       # System validation
├── 02_Git_Hub.py          # Git operations + structure audits
├── 03_AIPM_Hub.py         # AI Performance Monitoring
├── 04_Ritual_Hub.py      # Session rituals
├── 05_Validator_Hub.py    # Code validation
├── 06_Tool_Hub.py        # Tool integration
├── 07_Integration_Hub.py # MCP and external integrations
├── 08_Workflow_Hub.py    # Workflow automation
├── 09_Data_Hub.py       # Data processing
├── 10_General_Hub.py    # General utilities
├── 11_Auto_Learn_Hub.py # Motor de automejora
├── 14_Health_Metrics_Hub.py # Métricas de salud
├── 15_MCP_Sync_Hub.py   # MCP drift report
├── 16_Agent_Mirror_Hub.py # Agent sync
├── 16_System_Mapper_Hub.py # Map system state
├── 17_Legacy_Path_Cleanup.py # Legacy path cleanup
├── 17_Watchdog_Hub.py    # Health monitoring
└── 18_Telemetry_Hub.py  # Usage stats
```

---

## 🎯 Propósito

Esta carpeta contiene el **cerebro operativo** del sistema - memoria a largo plazo, notas de sesiones, y mapeos:

| Subcarpeta                            | Contenido                                           |
|--------------------------------------|----------------------------------------------------|
| `00_Context_LLM/`                     | CTX de sesiones, JSONs de validación                |
| `02_Agent_Teams_Lite/`                | SDD Workflow + Manifest registries ✅                |
| `03_Scripts_Os/`                      | 18 HUBs operativos                                  |

---

## 📊 Estadísticas

| Área                       | Cantidad                                                                                                                                    |
|---------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| SDD Skills                 | 10 (sdd-init, sdd-explore, sdd-propose, sdd-spec, sdd-design, sdd-tasks, sdd-apply, sdd-verify, sdd-archive, skill-registry)                |
| MCP Servers                | 33                                                                                                                                          |
| Agents                     | 52                                                                                                                                          |
| HUBs                       | 18                                                                                                                                          |

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

_Think Different PersonalOS v7.0 — Cerebro operativo (v3.0 Consequences)_
