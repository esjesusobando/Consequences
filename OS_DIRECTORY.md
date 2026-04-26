# 🤖 PERSONALOS — DIRECTORIO MAESTRO (JARVIS)

**v3.0 Consequences** | 2026-04-25

## ¿Qué hay aquí?

| Componente | Total | Manifest |
|-----------|-------|---------|
| MCPs Claude Code | 33 | `00_Manifest/02_MCP_Registry.yaml` |
| Skills | 297 (12 áreas) | `00_Manifest/04_Skill_Index.json` |
| Agentes | 52 | `00_Manifest/03_Agent_Catalog.yaml` |
| HUBs | 19 | `00_Manifest/05_HUB_Catalog.yaml` / `03_Scripts_Os/HUB_CATALOG.md` |
| Workflows | 27 | `00_Manifest/06_Workflow_Graph.yaml` |
| Hooks | 10 | `00_Manifest/07_Hook_Registry.yaml` |
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
| Compound Engineering | `01_Personal_Os/01_Core/02_Tools/02_Skills/00_Compound_Engineering/README.md` |
| Dream Team | `01_Personal_Os/01_Core/02_Tools/01_Agents/01_Dream_Team/README.md` |
| Specialists | `01_Personal_Os/01_Core/02_Tools/01_Agents/02_Specialists_Compound/README.md` |
| Agent Teams Protocol | `01_Personal_Os/01_Core/01_Rules/09_Agent_Teams_Protocol.mdc` |
| Gentleman GGA | `.agent/05_GGA/` |

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
```

> Ver catálogo completo: `01_Personal_Os/04_Operations/03_Scripts_Os/HUB_CATALOG.md`
