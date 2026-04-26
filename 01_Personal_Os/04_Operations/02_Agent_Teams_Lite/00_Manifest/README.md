# 00_Manifest — JARVIS Ground Truth

**Generated:** 2026-04-26T09:00:00
**Version:** v3.0 Consequences (Audit Fixed)

## ¿Qué es esto?

Inventario centralizado e inmutable del PersonalOS.
Es la fuente de verdad que TODOS los agentes consultan.

## Archivos

| # | Archivo | Contenido |
|---|---------|-----------|
| 01 | `01_OS_Inventory.json` | Inventario crudo (counts, paths) |
| 02 | `02_MCP_Registry.yaml` | MCPs Claude Code + OpenCode con drift |
| 03 | `03_Agent_Catalog.yaml` | 52 agentes (source: core, backup: .agent) |
| 04 | `04_Skill_Index.json` | Index navegable de las 297 skills |
| 05 | `05_HUB_Catalog.yaml` | 18 HUBs ejecutables (updated) |
| 06 | `06_Workflow_Graph.yaml` | 27 workflows en 5 categorías |
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

| Recurso | Cantidad | Estado |
|---------|---------|--------|
| MCPs Claude Code | 33 | ✅ Activos |
| MCPs OpenCode | 18 | ✅ Activos |
| Skills | 297 | ✅ Verificadas |
| Agentes | 52 (source) / 52 (backup) | ✅ Sincronizados |
| HUBs | 18 | ✅ Actualizado |
| Workflows | 27 | ✅ Activos |
| Hooks | 10 | ✅ Activos |
| Rules | 10 | ✅ Activas |
| Integrations | 2 | ✅ Fireflies, Granola |

## Known Issues (FIXED)

- ✅ KI-001: Hardcoded Windows paths - documentado en `openspec/config.yaml`
- ✅ KI-002: Duplicate sections in config.yaml - fixed
- ✅ KI-003: Version mismatch - fixed (v3.0)

## Referencias

- **Config SDD:** `.atl/openspec/config.yaml`
- **Skill Registry:** `.atl/skill-registry.md`
- **Ops README:** `01_Personal_Os/04_Operations/README.md`