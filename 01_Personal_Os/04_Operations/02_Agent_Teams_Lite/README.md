# 02_Agent_Teams_Lite — SDD Registry & JARVIS Manifests

> **Versión:** v4.1 → **MIGRADO A gentle-ai**
> **Última actualización:** 2026-05-26
> **Estado:** DEPRECATED — El upstream `agent-teams-lite` fue archivado. Reemplazado por [`gentle-ai`](https://github.com/Gentleman-Programming/gentle-ai).

---

## 🎯 DESCRIPCIÓN

Este directorio contiene el **legacy de Agent Teams Lite** y los **7 manifests de JARVIS** del PersonalOS.

**Agent Teams Lite** fue el framework original de SDD (Spec-Driven Development). Desde Mar 2026, el proyecto upstream fue **deprecado** y todo su contenido migró a [`gentle-ai`](https://github.com/Gentleman-Programming/gentle-ai) — un ecosistema completo con orquestador SDD, memoria persistente (Engram), MCPs, perfiles multi-modelo y actualización automática.

---

## 📁 ESTRUCTURA

```
02_Agent_Teams_Lite/
├── 00_Manifest/                    # JARVIS 7 manifests (ACTIVO — fuente de verdad del OS)
│   ├── 01_OS_Inventory.json        # Inventario OS
│   ├── 02_MCP_Registry.yaml        # 7+38 MCPs
│   ├── 03_Agent_Catalog.yaml       # 82 agents
│   ├── 04_Skill_Index.json        # 385 skills
│   ├── 05_HUB_Catalog.yaml        # 20 HUBs
│   ├── 06_Workflow_Graph.yaml     # 27 workflows
│   └── 07_Hook_Registry.yaml        # 10 hooks
├── 00_SDD_Registry/                 # SDD skills registry (LEGACY — mantener como referencia)
│   ├── sdd-init/
│   ├── sdd-explore/
│   ├── sdd-propose/
│   ├── sdd-spec/
│   ├── sdd-design/
│   ├── sdd-tasks/
│   ├── sdd-apply/
│   ├── sdd-verify/
│   └── sdd-archive/
├── 03_Pattern_Engine/              # Motor de patrones (ACTIVO)
└── SDD_SKILLS.md                   # Documentación legacy
```

---

## 📊 JARVIS MANIFESTS — ESTADO (v4.1 → gentle-ai)

| Manifest      | Total       | Drift| Nota       |
|--------------|------------|-----|-----------|
| OS Inventory  | 1 archivo   | 0 ✅  | Se mantiene|
| MCP Registry  | 7+38 MCPs   | 0 ✅  | Se mantiene|
| Agent Catalog | 82 agents   | 0 ✅  | Se mantiene|
| Skill Index   | 385 skills  | 0 ✅  | Se mantiene|
| HUB Catalog   | 20 HUBs     | 0 ✅  | Se mantiene|
| Workflow Graph| 27 workflows| 0 ✅  | Se mantiene|
| Hook Registry | 10 hooks    | 0 ✅  | Se mantiene|

> Los manifests JARVIS SIGUEN ACTIVOS como fuente de verdad del PersonalOS.
> Lo deprecado son las skills SDD de ATL, ahora reemplazadas por gentle-ai.

---

## 🚀 COMANDOS

```bash
# Regenerar todos los manifests
python 01_Personal_Os/04_Operations/03_Scripts_Os/20_System_Mapper_Hub.py --scan

# Health check
python 01_Personal_Os/04_Operations/03_Scripts_Os/17_Watchdog_Hub.py

# Agent sync
python 01_Personal_Os/04_Operations/03_Scripts_Os/19_Agent_Sync_Hub.py --apply

# --- gentle-ai (NUEVO — reemplaza ATL) ---
gentle-ai sync              # Sincronizar skills y configs
gentle-ai update            # Actualizar gentle-ai
gentle-ai skill-registry refresh   # Refrescar registry de skills
```

---

## 🔗 RELACIONES

| Componente                      | Ubicación                                        | Estado                              |
|--------------------------------|-------------------------------------------------|------------------------------------|
| **gentle-ai (SDD Orchestrator)**| Global (brew/scoop)                              | ✅ ACTIVO — reemplaza ATL            |
| **Manifests JARVIS**            | `02_Agent_Teams_Lite/00_Manifest/`               | ✅ ACTIVO — fuente de verdad         |
| **Agentes pipeline**            | `01_Core/02_Tools/01_Agents/`                    | ✅ ACTIVOS — #01→#07                 |
| **HUBs**                        | `03_Scripts_Os/`                                 | ✅ ACTIVOS                           |
| **Skills ATL (legacy)**         | `02_Agent_Teams_Lite/01_Agent_Teams_Lite/skills/`| 🗄️ LEGACY — mantener como referencia|

---

## 📋 SDD WORKFLOW (vía gentle-ai)

El SDD ahora corre sobre **gentle-ai** con un orquestador dedicado (`gentle-orchestrator`):

| Fase   | Comando                | Descripción                                                |
|-------|-----------------------|-----------------------------------------------------------|
| Init   | `/sdd-init`            | Inicializar contexto SDD                                   |
| Explore| `/sdd-explore <topic>` | Investigar idea                                            |
| New    | `/sdd-new <change>`    | Crear cambio completo (propuesta + specs + diseño + tareas)|
| Apply  | `/sdd-apply [change]`  | Implementar tareas                                         |
| Verify | `/sdd-verify [change]` | Validar contra specs                                       |
| Archive| `/sdd-archive [change]`| Archivar cambio                                            |

> **Diferencia clave con ATL legacy:** gentle-ai añade orquestador, memoria Engram, perfiles multi-modelo, skill registry automático y GGA integrado.

---

## 🧭 Migración ATL → gentle-ai

Si venís de Agent Teams Lite, esto cambió:

| Aspecto    | ATL (legacy)     | gentle-ai                                           |
|-----------|-----------------|----------------------------------------------------|
| Instalación| Clone manual     | `brew install gentle-ai` / `scoop install gentle-ai`|
| Skills     | Markdown estático| Binario + markers + auto-actualización              |
| Memoria    | No tenía         | Engram (persistente entre sesiones)                 |
| Orquestador| Manual           | `gentle-orchestrator` con 10 sub-agentes            |
| MCPs       | No configuraba   | Context7, GitHub, filesystem, etc.                  |
| Modelos    | 1 modelo         | Perfiles multi-modelo por fase SDD                  |

---

*Think Different PersonalOS v4.9 — gentle-ai ACTIVE | ATL LEGACY*

