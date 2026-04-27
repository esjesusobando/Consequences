# 🤖 PERSONALOS — DIRECTORIO MAESTRO (JARVIS)

**v3.1 Consequences** | 2026-04-27

## ¿Qué hay aquí?

| Componente | Total | Manifest |
|-----------|-------|---------|
| MCPs Claude Code | 35 | `01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/02_MCP_Registry.yaml` |
| Skills | 297+ (13 áreas) | `01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/04_Skill_Index.json` |
| Agentes | 52 | `01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/03_Agent_Catalog.yaml` |
| HUBs | 19 (23 scripts totales) | `01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/05_HUB_Catalog.yaml` / `03_Scripts_Os/HUB_CATALOG.md` |
| Workflows | 28 | `01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/06_Workflow_Graph.yaml` |
| Hooks | 10 | `01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/07_Hook_Registry.yaml` |
| Rules | 10 | `01_Personal_Os/01_Core/01_Rules/` |

> Manifest base: `01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/`

## ¿Cómo invoco X?

- **MCP** → usar como tool en Claude Code
- **Skill** → trigger keyword en CLAUDE.md
- **HUB** → `python 01_Personal_Os/04_Operations/03_Scripts_Os/<NN>_<Name>_Hub.py`
- **Agente** → Task tool con `subagent_type`

## Ecosistemas

| Ecosistema | Ubicación |
|-----------|-----------|
| Personal OS Core | `00_Winter_is_Coming/AGENTS.md` |
| Compound Engineering | `01_Personal_Os/01_Core/02_Tools/02_Skills/00_Compound_Engineering/` |
| Dream Team | `01_Personal_Os/01_Core/02_Tools/01_Agents/01_Dream_Team/` |
| Specialists | `01_Personal_Os/01_Core/02_Tools/01_Agents/02_Specialists_Compound/` |
| Agent Teams Protocol | `01_Personal_Os/01_Core/01_Rules/09_Agent_Teams_Protocol.mdc` |
| Gentleman GGA | `.agent/05_GGA/` | |

## HUBs JARVIS 3.0

```bash
# Canónicos JARVIS 3.0
python 01_Personal_Os/04_Operations/03_Scripts_Os/16_System_Mapper_Hub.py --scan     # regenerar manifest
python 01_Personal_Os/04_Operations/03_Scripts_Os/17_Watchdog_Hub.py --check         # health check
python 01_Personal_Os/04_Operations/03_Scripts_Os/18_Telemetry_Hub.py --dashboard    # stats
python 01_Personal_Os/04_Operations/03_Scripts_Os/15_MCP_Sync_Hub.py --report        # MCP drift

# HUBs adicionales
python 01_Personal_Os/04_Operations/03_Scripts_Os/14_Health_Metrics_Hub.py           # salud del OS
python 01_Personal_Os/04_Operations/03_Scripts_Os/15_Agent_Sync_Hub.py               # sync agentes
python 01_Personal_Os/04_Operations/03_Scripts_Os/16_Agent_Mirror_Hub.py             # mirror agentes

# Sub-scripts del módulo 13_Auditors_Os (viven en subcarpeta)
python 01_Personal_Os/04_Operations/03_Scripts_Os/13_Auditors_Os/scripts/12_Context_Usage_Bar.py   # barra contexto
python 01_Personal_Os/04_Operations/03_Scripts_Os/13_Auditors_Os/scripts/13_Beautify_Tables.py     # alinear tablas md
```

> Ver catálogo completo: `01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/05_HUB_Catalog.yaml`
