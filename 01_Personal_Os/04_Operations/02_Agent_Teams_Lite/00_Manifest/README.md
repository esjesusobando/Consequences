# 00_Manifest — JARVIS Ground Truth

**Generated:** 2026-05-18T15:44:01
**Version:** v3.0 Consequences

## ¿Qué es esto?

Inventario centralizado e inmutable del PersonalOS.
Es la fuente de verdad que TODOS los agentes consultan.

## Archivos

| # | Archivo | Contenido |
|---|---------|-----------|
| 01 | `01_OS_Inventory.json` | Inventario crudo (counts, paths) |
| 02 | `02_MCP_Registry.yaml` | MCPs Claude Code + OpenCode con drift |
| 03 | `03_Agent_Catalog.yaml` | 52 agentes (source: core, backup: .agent) |
| 04 | `04_Skill_Index.json` | Index navegable de las 342 skills |
| 05 | `05_HUB_Catalog.yaml` | 28 HUBs ejecutables |
| 06 | `06_Workflow_Graph.yaml` | 29 workflows en 7 categorías |
| 07 | `07_Hook_Registry.yaml` | 10 hooks en 6 fases |

## Cómo regenerar

```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/16_System_Mapper_Hub.py --scan
```

## Cómo validar integridad

```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/16_System_Mapper_Hub.py --validate
```

## Ground Truth

- **MCPs Claude Code:** 35
- **MCPs OpenCode:** 34
- **Skills:** 342 en 12 áreas
- **Agentes:** 58 (source) / 58 (backup)
- **HUBs:** 28
- **Workflows:** 29
- **Hooks:** 10
- **Rules:** 12
- **Integrations:** 2 (01_Fireflies, 02_Granola)
