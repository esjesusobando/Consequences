# Think Different PersonalOS — DIRECTORY MAESTRO (JARVIS)

**Version:** v3.0 | **Date:** 2026-04-25

---

## Que hay aqui?

| Resource        | Count     | Location                                                             |
|-----------------|-----------|----------------------------------------------------------------------|
| **MCPs**        | 33        | `00_Manifest/02_MCP_Registry.yaml`                                   |
| **Skills**      | 297       | `00_Manifest/04_Skill_Index.json`                                    |
| **Agents**      | 52        | `00_Manifest/03_Agent_Catalog.yaml`                                  |
| **HUBs**        | 19        | `00_Manifest/05_HUB_Catalog.yaml` / `03_Scripts_Os/HUB_CATALOG.md`   |
| **Workflows**   | 28        | `00_Manifest/06_Workflow_Graph.yaml`                                 |
| **Hooks**       | 10        | `00_Manifest/07_Hook_Registry.yaml`                                  |

---

## Como invoco X?

| Component      | How to Invoke                                                            |
|----------------|--------------------------------------------------------------------------|
| **MCP**        | Use as tool in Claude Code / OpenCode                                    |
| **Skill**      | Trigger with keyword in CLAUDE.md                                        |
| **HUB**        | `python 01_Personal_Os/04_Operations/03_Scripts_Os/<NN>_<Name>_Hub.py`   |
| **Workflow**   | See `Workflow_Graph.yaml` for precedence                                 |
| **Agent**      | Invoke via Task tool with subagent_type                                  |

---

## Ecosistemas integrados

| Ecosystem                         | Location                                                               |
|-----------------------------------|------------------------------------------------------------------------|
| **Personal OS Core**              | `00_Winter_is_Coming/AGENTS.md`                                        |
| **Gentleman GGA**                 | `.agent/05_GGA/`                                                       |
| **Compound Engineering**          | `01_Personal_Os/01_Core/02_Tools/02_Skills/00_Compound_Engineering/`   |
| **Hillary**                       | Skills in `08_Personal_Os/`                                            |
| **Avengers**                      | Spider, Hulk, Thor in Compound                                         |
| **Dream Team / Super Cameroon**   | `01_Dream_Team/`                                                       |

---

## HUBs disponibles

```bash
# Core HUBs
python 01_Personal_Os/04_Operations/03_Scripts_Os/01_Auditor_Hub.py
python 01_Personal_Os/04_Operations/03_Scripts_Os/02_Git_Hub.py
python 01_Personal_Os/04_Operations/03_Scripts_Os/03_AIPM_Hub.py
python 01_Personal_Os/04_Operations/03_Scripts_Os/15_MCP_Sync_Hub.py --report
python 01_Personal_Os/04_Operations/03_Scripts_Os/16_Agent_Mirror_Hub.py
python 01_Personal_Os/04_Operations/03_Scripts_Os/16_System_Mapper_Hub.py --scan
python 01_Personal_Os/04_Operations/03_Scripts_Os/17_Watchdog_Hub.py
python 01_Personal_Os/04_Operations/03_Scripts_Os/18_Telemetry_Hub.py --dashboard
```

---

## Manifiesto

`01_Personal_Os/04_Operations/02_Agent_Teams_Lite/00_Manifest/`

| File                       | Description                              | Status     |
|----------------------------|------------------------------------------|------------|
| `01_OS_Inventory.json`     | OS Inventory                             | ✅          |
| `02_MCP_Registry.yaml`     | MCP Registry (33 Claude / 18 OpenCode)   | ✅          |
| `03_Agent_Catalog.yaml`    | Agent Catalog (52 agents)                | ✅          |
| `04_Skill_Index.json`      | Skill Index (297 skills)                 | ✅          |
| `05_HUB_Catalog.yaml`      | HUB Catalog (19 HUBs)                    | ✅          |
| `06_Workflow_Graph.yaml`   | Workflow Graph                           | ✅          |
| `07_Hook_Registry.yaml`    | Hook Registry (10 hooks)                 | ✅          |

---

*Think Different PersonalOS v3.0 Consequences — JARVIS Integrated*
