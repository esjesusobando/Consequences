# OS_DIRECTORY.md — Personal OS v5.0 SOTA

**Updated:** 2026-07-12
# 🤖 PERSONALOS — DIRECTORIO MAESTRO (JARVIS)

**v5.0.2** | 2026-07-10 — v5.0 SOTA Audit, HyperFrames suite, y fixes Zero Consequences

## Project Root
`C:/Users/sebas/Desktop/Think_Different/`

## Overview
| Item             | Estatus / Metadata                          | Auditoría                              |
| ---------------- | ------------------------------------------- | -------------------------------------- |
| Auto-Improvement | 🔄 Activo cada 8h (Task Scheduler)           | ✅ 29+ días autónomo — 6 fixers         |
| Capital Token    | 🌕 Fase 1 Foundation — 10_Shared_Org/        | ✅ 1 playbook, 1 ADR, 3 agent templates |
| MCPs root        | **11** (en .mcp.json)                       | ⚠️ Engram CAÍDO (timeout)              |
| MCPs backup      | **4** (2 JSON + 3 subdirs en 03_Mcp/)       | ✅ VERIFIED                             |
| Every CE         | v3.8.4 (local repo)                         | ✅ ACTIVE — Local version               |
| gentle-ai        | v1.30.6                                     | ✅ AVAILABLE                            |
| Skills           | **397** (35 áreas funcionales en 02_Skills) | ✅ VERIFIED — 0 sin frontmatter         |
| Agentes          | **67** (36 OS + 30 Claude + 1 OpenCode)    | ✅ SYNCED                               |
| HUBs             | **44** funcionales (en 03_Scripts_Os)       | ✅ VERIFIED                             |
| Scripts totales  | **241** (.py en Scripts_Os/ y subdirs)      | ✅ DOCUMENTED                           |
| Workflows        | **31**                                      | ✅ VERIFIED                             |
| Rules            | **15 (.mdc)** en 01_Rules                   | ✅ DEFINED                              |
| Hooks            | **18** (05_Hooks/)                          | ✅ ACTIVE                               |
| JARVIS Manifests | 7 en 00_Manifest/                           | ✅ VALIDATED                            |
| Open Design      | 62 creative skills + 138 design systems     | ✅ INTEGRATED                           |

> **🟢 ÚLTIMA AUDITORÍA:** 2026-07-12 — v5.0.2 — Monetization Pipeline (track_leads.py) + full auditor run
> Skills: 397. HUBs: 22. Workflows: 7. Rules: 16. Scripts: 241. Agentes: 67. Hooks: 6.

## Directory Map

### Root Level
| Directory              | Purpose                                                     | Status    |
| ---------------------- | ----------------------------------------------------------- | --------- |
| `00_Winter_is_Coming/` | System bootstrap, goals, backlog, AGENTS.md                 | ✅ TRACKED |
| `01_Personal_Os/`      | **THE OPERATING SYSTEM** — Core, Memory, Knowledge, Scripts | ✅ TRACKED |
| `02_Playground/`       | Testing & experiments — Zero Consequences, JAO, Momentum    | ✅ TRACKED |
| `03_Resultado/`        | Project deliverables — reports, experiments, documentation  | ✅ TRACKED |
| `.agent/`              | Agent configs (CLAUDE.md, hooks, extensions)                | ✅ TRACKED |
| `.atl/`                | SDD Registry (gitignored except config)                     | ✅ IGNORED |
| `.opencode/`           | OpenCode config                                             | ✅ TRACKED |
| `.claude/`             | Claude Code config                                          | ✅ TRACKED |

### 01_Personal_Os (Source of Truth)
| Directory       | Contents                                                                                                  |
| --------------- | --------------------------------------------------------------------------------------------------------- |
| `00_Core/`      | Workflows (7), Rules (16 .mdc), Tools (Agents 67, Skills 397, MCPs, Hooks 6, Plugins, Evals, Templates) |
| `01_Memory/`    | Context LLM (00-12), Process Notes, Solutions, Plans, Telemetry                                           |
| `02_Knowledge/` | Examples, Research, Docs, Unicorn, Invictus, Anthropic                                                    |
| `03_Learning/`  | Shared Org (Capital Token), Auto-Improvement (every 8h), Content, Telemetry                               |
| `04_Tasks/`     | Active tasks (YAML frontmatter)                                                                           |
| `05_Scripts/`   | 44 HUBs (241 scripts), Installer, Agent Teams Lite                                                        |
| `06_Projects/`  | Active projects — Efrain, Cassette, Macano, OBAND, OIM, Elite                                             |
| `07_Archive/`   | Plans, backups, repos reference, legacy                                                                   |

### 02_Playground (Experiments)
| Directory               | Contents                                                               |
| ----------------------- | ---------------------------------------------------------------------- |
| `07_Zero_Consequences/` | **Audited 2026-07-05** — React 19 + Vite 6 app (26 findings, 20 fixes) |
| `00_Momentum/`          | Momentum experiments [SACRED]                                          |
| `01-03/`                | Branding, N8N, Reports                                                 |
| `06-07/`                | JAO, Zero Consequences                                                 |

### 03_Resultado (Outputs)
Projects, learning, experiments, documentation, reports, testing.

## Quick Reference

### Engine & Health
```bash
# Health check
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/17_Watchdog_Hub.py

# System scan
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/20_System_Mapper_Hub.py --scan

# Path validation
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/config_paths.py --validate
```

### Zero Consequences (ZC)
```
02_Playground/07_Zero_Consequences/01_Zero_Consequences/
├── src/         — 22 React components, hooks, lib, types
├── scripts/     — backup/scan skills
├── server.ts    — Express + Gemini 2.5 API proxy
├── tsconfig.json  — strict mode enabled
└── openspec/    — SDD artifacts (gitignored)
```

## Recent Audits
| Date       | Scope             | Findings                                         | Status     |
| ---------- | ----------------- | ------------------------------------------------ | ---------- |
| 2026-07-05 | Zero Consequences | 26 → 20 fixed (CRIT: 1, HIGH: 3, MED: 9, LOW: 7) | ✅ COMPLETE |
| 2026-07-12 | Numbering Audit   | 19 locations, 1 critical fix (07_Archive 04_ dup) | ✅ COMPLETE |
| 2026-07-12 | Path Validation   | 82/82 paths OK                                   | ✅ COMPLETE |
| 2026-07-03 | Path Audit        | 84/84 paths OK, dual-copy sync                   | ✅ COMPLETE |
| 2026-06-29 | v5.0 Full Audit   | SOTA upgrade, 393 READMEs, restructure           | ✅ COMPLETE |