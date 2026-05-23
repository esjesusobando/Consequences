# 01_Personal_Os — Personal Operating System

> **Versión:** v4.7 — Production Ready
> **Última actualización:** 2026-05-23

---

## 🎯 DESCRIPCIÓN

El núcleo del sistema operativo personal. Contiene toda la infraestructura, herramientas, conocimiento y operaciones del PersonalOS.

---

## 📁 ESTRUCTURA

```
01_Personal_Os/
├── 01_Core/               ✅ Motor del OS — Reglas, Agents, Skills, MCPs, Hooks, Plugins
├── 02_Knowledge/         ✅ Base de conocimiento — Docs, recursos, sistem knowledge
├── 03_Task/               ✅ Tareas activas — Workflows, sprints, tracking
├── 04_Operations/         ✅ Operaciones — Scripts, MCPs, Projects, Installer
└── 05_Archive/           ✅ Archivo — Legacy docs, repos de referencia
```

---

## 📊 ESTADO DEL SISTEMA (v4.7 — 2026-05-23)

| Componente | Total | Estado |
|---|---|---|
| Agents | 46 | ✅ SYNCED — 46↔46 |
| Skills | 394 | ✅ VERIFIED — 12 áreas |
| MCPs | 36 | ✅ SYNCED — drift 0 |
| HUBs | 19 | ✅ ACTIVE |
| Scripts totales | 284 | ✅ DOCUMENTED — recursivo |
| Workflows | 30 | ✅ ACTIVE — 7 categorías |
| Hooks | 10 | ✅ ACTIVE — 6 fases |
| Rules | 12 | ✅ DEFINED |

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

| Recurso | Descripción |
|---|---|
| `01_Core/README.md` | Motor del OS — herramientas core |
| `02_Knowledge/README.md` | Base de conocimiento |
| `03_Task/README.md` | Gestión de tareas |
| `04_Operations/README.md` | Scripts y operaciones |
| `05_Archive/README.md` | Archivo y legacy |

---

## 🔗 RELACIONES

- **Source of Truth:** `01_Core/01_Rules/` para reglas del sistema
- **Backup:** `.agent/01_Agents/` sincronizado con source
- **Config MCP:** `.mcp.json` en raíz del proyecto
- **Memory:** `04_Operations/00_Context_LLM/`

---

*Think Different PersonalOS v4.7 — Pure Green State*