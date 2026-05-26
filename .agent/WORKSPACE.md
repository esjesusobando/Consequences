# Workspace Structure — Think Different v2.0 Consequences

> **4 carpetas raíz con propósito claro — estructura limpia post-migración 2026-05-22**

---

## 📂 Estructura Raíz (Workspace v2.0)

```
Think_Different/
├── 00_Winter_is_Coming/    # ESTRATÉGICO: Goals, Backlog, AGENTS.md
├── 01_Personal_Os/         # EL SISTEMA OPERATIVO (motor completo)
├── 02_Playground/          # ZONA DE PRUEBAS (no contamina el OS)
├── 03_Resultado/           # OUTPUTS DE PROYECTOS (zona de entrega)
├── .agent/                 # Backup estratégico
├── .atl/                   # SDD Registry + openspec
├── .claude/                # Config Claude Code
├── .mcp.json               # 33 MCPs activos
├── AGENTS.md               # Entry point GGA (Pre-Commit)
├── CLAUDE.md               # Config oficial para IAs
└── README.md               # Documentación principal
```

---

## 📂 Estructura 01_Personal_Os (Sistema Operativo)

```
01_Personal_Os/
├── 01_Core/                         # Motor del OS
│   ├── 00_Workflows_Os/             # Workflows (Personal, Marvel, Gentleman, Hillary, CE)
│   ├── 01_Rules/                    # 10 reglas del sistema (.mdc)
│   └── 02_Tools/                    # Todas las herramientas
│       ├── 01_Agents/               # Dream Team + 23 Specialists
│       ├── 02_Skills/               # 9 áreas funcionales (limpias)
│       ├── 03_Mcp/                  # Config MCPs (33 activos)
│       ├── 04_Integrations/         # Fireflies, Granola
│       ├── 05_Hooks/                # Pre/Post/Lifecycle/Sound/Harness
│       ├── 06_Plugins/              # Plugins OS
│       ├── 07_Server/               # MCP Server
│       ├── 08_Evals/                # Evaluadores
│       └── 09_Templates/            # Templates
│
├── 02_Knowledge/                    # Base de conocimiento
│   ├── 00_Examples_Personal_Os/
│   ├── 01_Research_Os/
│   └── 03_Writing_Content/
│
├── 03_Task/                         # Tareas activas (singular)
│   ├── 00_Templates/
│   ├── 01_Tasks_Done/
│   └── 02_Hillary_Inbox/
│
├── 04_Operations/                   # TODO LO OPERATIVO
│   ├── 00_Context_LLM/              # Memoria y contexto
│   │   ├── 00_Context_Memory/
│   │   ├── 01_Process_Notes/
│   │   ├── 02_Knowledge_Brain/
│   │   ├── 03_Memory_Brain/
│   │   ├── 04_Memory_Brain/
│   │   └── 05_Plans/
│   ├── 01_Auto_Improvement/         # Motor auto-mejora
│   ├── 02_Agent_Teams_Lite/         # SDD registry
│   ├── 03_Scripts_Os/               # 14 HUBs + scripts
│   ├── 04_Installer/                # Instalación
│   └── 05_Projects/                 # Proyectos activos
│
└── 05_Archive/                      # Legacy y repos de referencia
    ├── 01_Repos_Gentleman/
    ├── 02_Raiz_Archive/
    └── 03_Planes/
```

---

## 📋 Tabla de Carpetas (v2.0)

| #     | Carpeta                    | Contenido                                                 | Estado          |
|-------|----------------------------|-----------------------------------------------------------|-----------------|
| 01    | **00_Winter_is_Coming/**   | Goals, Backlog, AGENTS.md                                 | ✅ ESTRATÉGICO   |
| 02    | **01_Personal_Os/**        | Sistema completo (Core, Knowledge, Tasks, Ops, Archive)   | ✅ SISTEMA OS    |
| 03    | **02_Playground/**         | Pruebas y experimentos (aislado)                          | ✅ TESTING       |
| 04    | **03_Resultado/**          | Outputs de proyectos (entrega)                            | ✅ OUTPUTS       |

---

## 🎯 Rutas Importantes (v2.0)

| Recurso                       | Ruta                                                           |
|-------------------------------|----------------------------------------------------------------|
| **Fuente de Verdad Skills**   | `01_Personal_Os/01_Core/02_Tools/02_Skills/`                   |
| **Rules (10 .mdc)**           | `01_Personal_Os/01_Core/01_Rules/`                             |
| **Scripts (14 HUBs)**         | `01_Personal_Os/04_Operations/03_Scripts_Os/`                  |
| **Workflows**                 | `01_Personal_Os/01_Core/00_Workflows_Os/`                      |
| **Agents**                    | `01_Personal_Os/01_Core/02_Tools/01_Agents/`                   |
| **MCPs**                      | `01_Personal_Os/01_Core/02_Tools/03_Mcp/`                      |
| **Projects**                  | `01_Personal_Os/04_Operations/05_Projects/`                    |
| **Context LLM**               | `01_Personal_Os/04_Operations/00_Context_LLM/`                 |
| **Auto-Improvement**          | `01_Personal_Os/04_Operations/01_Auto_Improvement/`            |
| **config_paths.py**           | `01_Personal_Os/04_Operations/03_Scripts_Os/config_paths.py`   |
| **Sound Engine**              | `01_Personal_Os/01_Core/02_Tools/05_Hooks/04_Sound/`           |
| **MCP Config Activo**         | `.mcp.json` (raíz)                                             |

---

## 📂 Estructura 03_Scripts_Os (14 HUBs)

```
03_Scripts_Os/
├── 00_Sound_Engine.py         # Notificaciones sonoras
├── 01_Auditor_Hub.py          # System validation
├── 02_Git_Hub.py              # Git operations
├── 03_AIPM_Hub.py             # AI Performance Monitoring
├── 04_Ritual_Hub.py           # Session rituals
├── 05_Validator_Hub.py        # Code validation
├── 06_Tool_Hub.py             # Tool integration
├── 07_Integration_Hub.py      # MCP integrations
├── 08_Workflow_Hub.py         # Workflow automation
├── 09_Data_Hub.py             # Data processing
├── 10_General_Hub.py          # General utilities
├── 11_Auto_Learn_Hub.py       # Motor de automejora
├── 12_Context_Usage_Bar.py    # Barra de contexto
├── 13_Beautify_Tables.py      # Formateo tablas
├── config_paths.py            # Rutas centralizadas (auto-detección)
└── 03_Validator/              # Scripts de validación avanzada
```

---

*Generado: 2026-05-22 | PersonalOS v4.7 Consequences — 4 carpetas raíz*
