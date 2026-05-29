# 00_Manifest — JARVIS Ground Truth

**Generated:** 2026-05-29T12:53:43
**Version:** v4.9 Consequences

## ¿Qué es esto?

Inventario centralizado e inmutable del PersonalOS.
Es la fuente de verdad que TODOS los agentes consultan.

## Archivos

| # | Archivo | Contenido |
|---|---------|-----------|
| 01 | `01_OS_Inventory.json` | Inventario crudo (counts, paths) |
| 02 | `02_MCP_Registry.yaml` | MCPs Claude Code + OpenCode con drift |
| 03 | `03_Agent_Catalog.yaml` | 55 agentes (source: core, backup: .agent) |
| 04 | `04_Skill_Index.json` | Index navegable de las 385 skills |
| 05 | `05_HUB_Catalog.yaml` | 28 HUBs + 128 scripts |
| 06 | `06_Workflow_Graph.yaml` | 28 workflows en 7 categorías |
| 07 | `07_Hook_Registry.yaml` | 10 hooks en 6 fases |

## Cómo regenerar

```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/20_System_Mapper_Hub.py --scan
```

## Cómo validar integridad

```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/20_System_Mapper_Hub.py --validate
```

## Ground Truth

- **MCPs Claude Code:** 8
- **MCPs OpenCode:** 43
- **Skills:** 385 en 14 áreas
- **Agentes:** 55 (source) / 52 (backup)
- **HUBs:** 28 (+ 128 scripts)
- **Workflows:** 28
- **Hooks:** 10
- **Rules:** 13
- **Integrations:** 2 (01_Fireflies, 02_Granola)
