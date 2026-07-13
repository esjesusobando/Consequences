# 00_Core — Personal OS v5.0 Engine

> **Version:** v5.0.0 SOTA
> **Last updated:** 2026-07-07 — OS Edge Cases fixed, Error Taxonomy, Path Guardian, Secret Scanner v2
> **Status:** ACTIVE | SOURCE OF TRUTH

---

## Directory Structure (v5.0)

```
Think_Different/
├── 00_Winter_is_Coming/       # Strategy, backlog, DNA
├── 01_Personal_Os/
│   ├── 00_Core/               # OS Engine: Workflows, Rules, Tools (SOURCE OF TRUTH)
│   │   ├── 00_Workflows/      # 31 workflows (8 categories)
│   │   ├── 01_Rules/          # 15 rules (.mdc)
│   │   └── 02_Tools/          # Agents, Skills, MCPs, Hooks, Plugins, Evals
│   ├── 01_Memory/             # LLM memory, process notes, context LLM
│   ├── 02_Knowledge/          # Knowledge base, research, docs
│   ├── 03_Learning/           # Active knowledge, auto-improvement
│   ├── 04_Tasks/              # Active task management
│   ├── 05_Scripts/            # Operations: 42 HUBs, 166+ scripts, core OS modules
│   ├── 06_Projects/           # Active projects
│   └── 07_Archive/            # Backups, snapshots, history
├── 02_Playground/             # Testing and experiments
└── 03_Resultado/              # Work outputs
```

---

## 00_Core Structure

| #  | Directory       | Content                                                                                          | Status |
| --- | --------------- | ------------------------------------------------------------------------------------------------ | ------ |
| 01 | `00_Workflows/` | 31 workflows (8 categories: Learning, Personal, Marvel, Gentleman, Hillary, CE, YouTube, Readme) | ACTIVE |
| 02 | `01_Rules/`     | 15 rules .mdc (00-14)                                                                          | ACTIVE |
| 03 | `02_Tools/`     | Agents, Skills, MCPs, Hooks, Plugins, Server, Evals                                              | ACTIVE |

---

## 02_Tools Structure

| #  | Directory          | Content                                                       | Status |
| --- | ------------------ | ------------------------------------------------------------- | ------ |
| 00 | `00_SDD/`          | SDD Registry + JARVIS manifests (7 manifests)                 | ACTIVE |
| 01 | `01_Agents/`       | 98 source agents (9 categories: Root, Dream Team, Specialists, etc.) | ACTIVE |
| 02 | `02_Skills/`       | 35+ skill areas (~3600+ files)                                | ACTIVE |
| 03 | `03_Mcp/`          | MCP server backup configs                                     | ACTIVE |
| 04 | `04_Integrations/` | Fireflies, Granola integrations                               | ACTIVE |
| 05 | `05_Hooks/`        | 10 hooks (6 phases) — Secret Scanner v2, Pre-Tool WMI→CIM     | ACTIVE |
| 06 | `06_Plugins/`      | OS plugins                                                    | ACTIVE |
| 07 | `07_Server/`       | Engram MCP server                                             | ACTIVE |
| 08 | `08_Evals/`        | Evaluators and metrics                                        | ACTIVE |
| 09 | `09_Templates/`    | Templates                                                     | ACTIVE |

---

## Key Documents

| Document           | Location                                      |
| ------------------ | --------------------------------------------- |
| Comandos Workflows | `00_Comandos_Workflows.md`                    |
| Workflows README   | `00_Workflows/README.md`                      |
| Rules README       | `01_Rules/README.md`                          |
| Agents Catalog     | `02_Tools/01_Agents/README.md`                |
| Skills Index       | `02_Tools/02_Skills/README.md`                |
| MCP Registry       | `02_Tools/03_Mcp/README.md`                   |
| JARVIS Manifests   | `05_Scripts/02_Agent_Teams_Lite/00_Manifest/` |

---

## Dual-Copy Architecture

See `01_Personal_Os/README.md` for details on the dual-copy structure:
- **Copy A** (`C:\Users\sebas\01_Personal_Os\`) — Flat scripts, quick access
- **Copy B** (`Desktop\Think_Different\01_Personal_Os\`) — Canonical v5, structured, rich content

---

## OS Engine Modules (v5.0.0)

| Module         | Path                                                  | Status |
| -------------- | ----------------------------------------------------- | ------ |
| Error Taxonomy | `05_Scripts/00_HUBs/03_Scripts_Os/os_errors.py`       | ACTIVE |
| Path Guardian  | `05_Scripts/00_HUBs/03_Scripts_Os/path_guardian.py`   | ACTIVE |
| Sound Engine   | `05_Scripts/00_HUBs/03_Scripts_Os/00_Sound_Engine.py` | ACTIVE |
| Sync Copies    | `05_Scripts/00_HUBs/03_Scripts_Os/sync_copies.py`     | ACTIVE |
| Config Paths   | `05_Scripts/00_HUBs/03_Scripts_Os/config_paths.py`    | ACTIVE |
| Secret Scanner | `02_Tools/05_Hooks/01_Pre_Tool/secret_scanner.py`     | ACTIVE |
| Pre-Tool Hook  | `02_Tools/05_Hooks/01_Pre_Tool/pre_tool_use.py`       | ACTIVE |

---

**Personal OS v5.0.0 SOTA — 2026-07-07 — OS Edge Cases Fixed: 0 StopIteration, 0 asserts, 0 except:pass, 0 misplaced shebangs, WMI→CIM migrated, Secret Scanner v2, Judgment Day APPROVED**