# 01_Personal_Os — Personal Operating System

> **Versión:** v5.0 SOTA
> **Última actualización:** 2026-06-27

---

## 🎯 DESCRIPCIÓN

El núcleo del sistema operativo personal. Contiene toda la infraestructura, herramientas, conocimiento y operaciones del PersonalOS.

---

## 📁 ESTRUCTURA

```
01_Personal_Os/
├── 01_Core/               ✅ Motor del OS — Reglas, Agents, Skills, MCPs, Hooks, Plugins
├── 02_Knowledge/          ✅ Base de conocimiento — Docs, recursos, system knowledge
├── 03_Task/               ✅ Tareas activas — Workflows, sprints, tracking
├── 04_Operations/         ✅ Operaciones — Scripts (42 HUBs), MCPs, Projects, Installer
├── 05_Archive/            ✅ Archivo — Legacy docs, repos de referencia
└── 06_Evals/              ✅ Evaluadores — Escenarios, dashboard y métricas
```

---

## 📊 ESTADO DEL SISTEMA (v5.0 SOTA — 2026-06-27)

> Fuente: `20_System_Mapper_Hub.py --scan` — 2026-06-27T13:19:17

| Componente      | Total | Estado                           |
| --------------- | ----- | -------------------------------- |
| Skills          | 396   | ✅ SOTA — CoT injected (15 áreas) |
| Agents (source) | 63    | ✅ VERIFIED — backup 72 (drift 9) |
| MCPs Claude     | 11    | ✅ ACTIVE                         |
| MCPs OpenCode   | 45    | ✅ ACTIVE                         |
| HUBs            | 42    | ✅ ACTIVE (33 .py + 9 dirs)       |
| Scripts totales | 166   | ✅ DOCUMENTED                     |
| Workflows       | 29    | ✅ ACTIVE — 7 categorías          |
| Hooks           | 10    | ✅ ACTIVE — 6 fases               |
| Rules           | 14    | ✅ DEFINED (.mdc)                 |

---

## 🚀 QUICK COMMANDS

```bash
# Health check
python 01_Personal_Os/04_Operations/03_Scripts_Os/17_Watchdog_Hub.py

# Regenerar manifests
python 01_Personal_Os/04_Operations/03_Scripts_Os/20_System_Mapper_Hub.py --scan

# Agent sync
python 01_Personal_Os/04_Operations/03_Scripts_Os/19_Agent_Sync_Hub.py --apply

# Telemetry dashboard
python 01_Personal_Os/04_Operations/03_Scripts_Os/18_Telemetry_Hub.py --dashboard
```

---

## 📖 DOCUMENTACIÓN

| Recurso                   | Descripción                      |
| ------------------------- | -------------------------------- |
| `01_Core/README.md`       | Motor del OS — herramientas core |
| `02_Knowledge/README.md`  | Base de conocimiento             |
| `03_Task/README.md`       | Gestión de tareas                |
| `04_Operations/README.md` | Scripts y operaciones            |
| `05_Archive/README.md`    | Archivo y legacy                 |
| `06_Evals/README.md`      | Evaluadores y métricas           |

---

## 🔗 RELACIONES

- **Source of Truth:** `01_Core/01_Rules/` para reglas del sistema
- **Backup:** `.agent/01_Agents/` sincronizado con source
- **Config MCP:** `.mcp.json` en raíz del proyecto
- **Memory:** `04_Operations/00_Context_LLM/`

---

*Think Different PersonalOS v5.0 SOTA — Production Ready ✅ — Ground Truth: System Mapper scan*