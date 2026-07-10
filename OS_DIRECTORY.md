# OS_DIRECTORY.md — Personal OS v5.0 SOTA

**Updated:** 2026-07-05
**Status:** 🟢 PRODUCTION READY

## Project Root
`C:/Users/sebas/Desktop/Think_Different/`

## Overview
Think Different PersonalOS — Multi-agent orchestration system powered by AI.
- **Skills:** 396+ (15 functional areas, CoT injected)
- **Agents:** 63 source | 72 backup
- **MCPs:** 11 Claude | 45 OpenCode
- **HUBs:** 42 (166+ total scripts)
- **Workflows:** 30 (8 categories)

## Directory Map

### Root Level
| Directory | Purpose | Status |
|-----------|---------|--------|
| `00_Winter_is_Coming/` | System bootstrap, goals, backlog, AGENTS.md | ✅ TRACKED |
| `01_Personal_Os/` | **THE OPERATING SYSTEM** — Core, Memory, Knowledge, Scripts | ✅ TRACKED |
| `02_Playground/` | Testing & experiments — Zero Consequences, JAO, Momentum | ✅ TRACKED |
| `03_Resultado/` | Project deliverables — reports, experiments, documentation | ✅ TRACKED |
| `.agent/` | Agent configs (CLAUDE.md, hooks, extensions) | ✅ TRACKED |
| `.atl/` | SDD Registry (gitignored except config) | ✅ IGNORED |
| `.opencode/` | OpenCode config | ✅ TRACKED |
| `.claude/` | Claude Code config | ✅ TRACKED |

### 01_Personal_Os (Source of Truth)
| Directory | Contents |
|-----------|----------|
| `00_Core/` | Workflows (30), Rules (14 .mdc), Tools (Agents 63, Skills 396+, MCPs, Hooks 10, Plugins, Evals, Templates) |
| `01_Memory/` | Context LLM (00-12), Process Notes, Solutions, Plans, Telemetry |
| `02_Knowledge/` | Examples, Research, Docs, Unicorn, Invictus, Anthropic |
| `03_Learning/` | Shared Org (Capital Token), Auto-Improvement (every 8h), Content, Telemetry |
| `04_Tasks/` | Active tasks (YAML frontmatter) |
| `05_Scripts/` | 42 HUBs (166+ scripts), Installer, Agent Teams Lite |
| `06_Projects/` | Active projects — Efrain, Cassette, Macano, OBAND, OIM, Elite |
| `07_Archive/` | Plans, backups, repos reference, legacy |

### 02_Playground (Experiments)
| Directory | Contents |
|-----------|----------|
| `07_Zero_Consequences/` | **Audited 2026-07-05** — React 19 + Vite 6 app (26 findings, 20 fixes) |
| `00_Momentum/` | Momentum experiments [SACRED] |
| `01-06/` | Branding, N8N, Reports, Legacy, Obanlover, JAO |
| `08-10/` | Plans, Skills Drafts, Scripts & Logs |

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
| Date | Scope | Findings | Status |
|------|-------|----------|--------|
| 2026-07-05 | Zero Consequences | 26 → 20 fixed (CRIT: 1, HIGH: 3, MED: 9, LOW: 7) | ✅ COMPLETE |
| 2026-07-03 | Path Audit | 84/84 paths OK, dual-copy sync | ✅ COMPLETE |
| 2026-06-29 | v5.0 Full Audit | SOTA upgrade, 393 READMEs, restructure | ✅ COMPLETE |
