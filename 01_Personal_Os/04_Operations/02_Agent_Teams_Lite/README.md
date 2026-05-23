# 02_Agent_Teams_Lite — SDD Registry & JARVIS Manifests

> **Versión:** v4.1
> **Última actualización:** 2026-05-20

---

## 🎯 DESCRIPCIÓN

Sistema de Agent Teams Lite (basado en metodología Super Campeones). Contiene el registry de SDD y los 7 manifests de JARVIS.

---

## 📁 ESTRUCTURA

```
02_Agent_Teams_Lite/
├── 00_Manifest/                    # JARVIS 7 manifests
│   ├── 01_OS_Inventory.json        # Inventario OS
│   ├── 02_MCP_Registry.yaml        # 36 MCPs
│   ├── 03_Agent_Catalog.yaml       # 82 agents
│   ├── 04_Skill_Index.json        # 352 skills
│   ├── 05_HUB_Catalog.yaml        # 28 HUBs
│   ├── 06_Workflow_Graph.yaml     # 29 workflows
│   └── 07_Hook_Registry.yaml        # 10 hooks
├── 00_SDD_Registry/                 # SDD skills registry
│   ├── sdd-init/
│   ├── sdd-explore/
│   ├── sdd-propose/
│   ├── sdd-spec/
│   ├── sdd-design/
│   ├── sdd-tasks/
│   ├── sdd-apply/
│   ├── sdd-verify/
│   └── sdd-archive/
└── [configuraciones]
```

---

## 📊 JARVIS MANIFESTS — ESTADO (v4.1)

| Manifest | Total | Drift |
|---|---|---|
| OS Inventory | 1 archivo | 0 ✅ |
| MCP Registry | 36 MCPs | 0 ✅ |
| Agent Catalog | 82 agents | 0 ✅ |
| Skill Index | 352 skills | 0 ✅ |
| HUB Catalog | 28 HUBs | 0 ✅ |
| Workflow Graph | 29 workflows | 0 ✅ |
| Hook Registry | 10 hooks | 0 ✅ |

---

## 🚀 COMANDOS

```bash
# Regenerar todos los manifests
python 01_Personal_Os/04_Operations/03_Scripts_Os/20_System_Mapper_Hub.py --scan

# Health check
python 01_Personal_Os/04_Operations/03_Scripts_Os/17_Watchdog_Hub.py

# Agent sync
python 01_Personal_Os/04_Operations/03_Scripts_Os/19_Agent_Sync_Hub.py --apply
```

---

## 🔗 RELACIONES

- **Source:** `01_Personal_Os/01_Core/02_Tools/01_Agents/` (agents)
- **Skills:** `01_Personal_Os/01_Core/02_Tools/02_Skills/` (skills)
- **HUBs:** `03_Scripts_Os/` (scripts)
- **Workflows:** `01_Core/00_Workflows_Os/` (workflows)

---

## 📋 SDD WORKFLOW

El SDD (Spec-Driven Development) usa Agent Teams Lite:

1. **sdd-init** — Inicializar contexto
2. **sdd-explore** — Investigar
3. **sdd-propose** — Crear propuesta
4. **sdd-spec** — Especificar
5. **sdd-design** — Diseñar
6. **sdd-tasks** — Planificar tareas
7. **sdd-apply** — Implementar
8. **sdd-verify** — Verificar
9. **sdd-archive** — Archivar

---

*Think Different PersonalOS v4.7 — JARVIS 4.1 ACTIVE*