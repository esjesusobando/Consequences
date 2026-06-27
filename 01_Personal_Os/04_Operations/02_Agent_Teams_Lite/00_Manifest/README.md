# 00_Manifest — JARVIS Ground Truth

**Generated:** 2026-06-27T13:19:17
**Version:** v4.9 Consequences

## ¿Qué es esto?

Inventario centralizado e inmutable del PersonalOS.
Es la fuente de verdad que TODOS los agentes consultan.

## Archivos

| # | Archivo | Contenido |
|---|---------|-----------|
| 01 | `01_OS_Inventory.json` | Inventario crudo (counts, paths) |
| 02 | `02_MCP_Registry.yaml` | MCPs Claude Code + OpenCode con drift |
| 03 | `03_Agent_Catalog.yaml` | 63 agentes (source: core, backup: .agent) |
| 04 | `04_Skill_Index.json` | Index navegable de las 396 skills |
| 05 | `05_HUB_Catalog.yaml` | 42 HUBs + 133 scripts |
| 06 | `06_Workflow_Graph.yaml` | 29 workflows en 7 categorías |
| 07 | `07_Hook_Registry.yaml` | 10 hooks en 6 fases |

## Cómo regenerar

```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/20_System_Mapper_Hub.py --scan
```

## Cómo validar integridad

```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/20_System_Mapper_Hub.py --validate
```

## 🔵 Single Source of Truth

> **Este archivo es la fuente de verdad.** Todos los docs maestros (OS_DIRECTORY.md, CLAUDE.md, AGENTS.md, README.md) deben referenciar estos números. Si ves una divergencia, corre `--validate`.

## Ground Truth

- **MCPs Claude Code:** 11
- **MCPs OpenCode:** 45
- **Skills:** 396 en 15 áreas
- **Agentes:** 63 (63 source + ATL) — categorías: atl_gen=3, dream_team=6, growth=5, individual=0, os_conductor=1, other=0, root=25, specialists=23
- **HUBs:** 42 funcionales (33 scripts raiz + 9 directorios)
- **Scripts totales:** 166 (133 no-HUB)
- **Workflows:** 29
- **Hooks:** 10
- **Rules:** 14
- **Integrations:** 2 (01_Fireflies, 02_Granola)

## 📋 Health Dashboard

Corré `--validate` para ver la tabla comparativa entre el manifest y los 4 docs maestros:

```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/20_System_Mapper_Hub.py --validate
```
