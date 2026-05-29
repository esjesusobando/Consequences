# 00_Manifest — JARVIS Ground Truth

**Generated:** 2026-05-24T08:43:53
**Version:** v3.0 Consequences

## ¿Qué es esto?

Inventario centralizado e inmutable del PersonalOS.
Es la fuente de verdad que TODOS los agentes consultan.

## Archivos

| #  | Archivo                 | Contenido                                |
|---|------------------------|-----------------------------------------|
| 01 | `01_OS_Inventory.json`  | Inventario crudo (counts, paths)         |
| 02 | `02_MCP_Registry.yaml`  | MCPs Claude Code + OpenCode con drift    |
| 03 | `03_Agent_Catalog.yaml` | 52 agentes (source: core, backup: .agent)|
| 04 | `04_Skill_Index.json`   | Index navegable de las 385 skills        |
| 05 | `05_HUB_Catalog.yaml`   | 21+2 HUBs + 284 scripts                  |
| 06 | `06_Workflow_Graph.yaml`| 30 workflows en 7 categorías             |
| 07 | `07_Hook_Registry.yaml` | 12 hooks en 6 fases                      |

## Cómo regenerar

```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/16_System_Mapper_Hub.py --scan
```

## Cómo validar integridad

```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/16_System_Mapper_Hub.py --validate
```

## Ground Truth

- **MCPs Claude Code:** 7+38
- **MCPs OpenCode:** 7+38
- **Skills:** 385 activas en 14 áreas funcionales + ~490 legacy
- **Agentes:** 58 (source) / 95 (backup)
- **HUBs:** 21+2 (+ 284 scripts)
- **Workflows:** 30
- **Hooks:** 12
- **Rules:** 13
- **Integrations:** 2 (01_Fireflies, 02_Granola)
