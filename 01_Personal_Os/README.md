# 01_Personal_Os — Personal Operating System

> **Versión:** v5.0 SOTA
> **Última actualización:** 2026-07-03 — Full path audit: 84/84 paths OK

---

## 🎯 DESCRIPCIÓN

El núcleo del sistema operativo personal. Contiene toda la infraestructura, herramientas, conocimiento y operaciones del PersonalOS.

---

## 📁 ESTRUCTURA (v5.0 — 2026-07-03)

```
01_Personal_Os/
├── 00_Core/               ✅ Motor del OS — Workflows, Rules, Agents, Skills, MCPs, Hooks, Plugins
├── 01_Memory/             ✅ Memoria LLM — Context_Memory, Process_Notes, Context_LLM
├── 02_Knowledge/          ✅ Base de conocimiento — Docs, Research, Content, Examples, Unicorn
├── 03_Learning/           ✅ Conocimiento activo — Auto-Improvement, Shared_Org, Telemetry
├── 04_Tasks/              ✅ Tareas activas — Hillary Inbox, proyectos
├── 05_Scripts/            ✅ Operaciones — 42 HUBs, 166+ scripts, Installer, Agent Teams
├── 06_Projects/           ✅ Proyectos activos — Efrain, Cassette, Macano, OBAND, OIM, Elite
└── 07_Archive/            ✅ Backups, snapshots, históricos, repos de referencia
```

---

## 📊 ESTADO DEL SISTEMA (v5.0 SOTA — 2026-07-03)

> Fuente: `20_System_Mapper_Hub.py --scan` — 2026-07-03 (auditoría de integridad referencial)

| Componente            | Total       | Estado                                 |
|-----------------------|-------------|----------------------------------------|
| Skills                | 396         | ✅ SOTA — CoT injected (15 áreas)       |
| Agents (source)       | 63          | ✅ VERIFIED — backup 72 (drift 9)       |
| MCPs Claude           | 11          | ✅ ACTIVE                               |
| MCPs OpenCode         | 45          | ✅ ACTIVE                               |
| HUBs                  | 42          | ✅ ACTIVE (33 .py + 9 dirs)             |
| Scripts totales       | 166         | ✅ DOCUMENTED                           |
| Workflows             | 29          | ✅ ACTIVE — 7 categorías                |
| Hooks                 | 10          | ✅ ACTIVE — 6 fases                     |
| Rules                 | 14          | ✅ DEFINED (.mdc)                       |

---

## 🚀 QUICK COMMANDS

```bash
# Health check
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/17_Watchdog_Hub.py

# Regenerar manifests
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/20_System_Mapper_Hub.py --scan

# Agent sync
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/19_Agent_Sync_Hub.py --apply

# Telemetry dashboard
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/18_Telemetry_Hub.py --dashboard
```

---

## 📖 DOCUMENTACIÓN

| Recurso                                     | Descripción                            |
|---------------------------------------------|----------------------------------------|
| `00_Core/README.md`                         | Motor del OS — herramientas core       |
| `02_Knowledge/README.md`                    | Base de conocimiento                   |
| `04_Tasks/README.md`                        | Gestión de tareas                      |
| `07_Archive/README.md`                      | Archivo y legacy                       |
| `00_Core/02_Tools/08_Evals/README.md`       | Evaluadores y métricas                 |

---

## 🔗 RELACIONES

- **Source of Truth:** `00_Core/01_Rules/` para reglas del sistema
- **Backup:** `.agent/01_Agents/` sincronizado con source
- **Config MCP:** `.mcp.json` en raíz del proyecto
- **Memory:** `01_Memory/00_Context_LLM/`

---

*Think Different PersonalOS v5.0 SOTA — Production Ready ✅ — Ground Truth: System Mapper scan*
