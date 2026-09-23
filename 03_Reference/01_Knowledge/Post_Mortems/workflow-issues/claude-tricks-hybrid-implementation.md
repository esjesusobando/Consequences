---
source: 'C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\07_Solutions\workflow-issues\claude-tricks-hybrid-implementation.md'
sync_source: "C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\07_Solutions\workflow-issues\claude-tricks-hybrid-implementation.md"
sync_date: "2026-08-01T00:55:45.883496"
sync_updated: true
title: "Claude Tricks Hybrid Implementation — Rules + Skills Pattern"
---

# Claude Tricks Hybrid Implementation

## Problem

Implementing 17 behavioral tricks from a YouTube video as OpenCode agent configuration, balancing always-on rules vs on-demand skills while avoiding redundancy and noise.

## Symptoms

- AGENTS.md growing too large (150+ lines) with overlapping rules
- Skills not appearing in `<available_skills>` until fresh session
- Redundancy between AGENTS.md rules and skill content
- Sub-agents returning empty results during verification

## What Didn't Work

1. **17 individual skills** — too granular, each skill loads into context unnecessarily
2. **All 17 as AGENTS.md rules** — file too large, most rules not high-impact enough for always-on
3. **Mixed approach without clear separation** — created confusion about what's authoritative

## Solution

### Hybrid Pattern: Rules (always-on) + Skills (on-demand)

**AGENTS.md** contains only high-impact, executable rules:
- Trick 3 (Auto Approve): with concrete criteria
- Trick 6 (Status Line): with measurable threshold
- Trick 8 (Model per Task): with tier table
- Operational patterns: sub-agent fallback, Engram availability check

**Skills** contain detailed how-to guides for on-demand use:
- Foundation: Tricks 1, 2, 4, 5, 12, 17
- Compounding: Tricks 7, 9, 10, 11
- Orchestration: Tricks 13, 14, 15, 16

### Key Design Decisions

1. **Generic model naming** ("cheap", "medium", "best") — user configures which model is each tier
2. **Trick 5 updated for Handy tool** — user's actual voice-to-text tool
3. **Tricks 11, 14 marked as meta-practices** — skills already follow these patterns
4. **Trick 4 clarified as complement to Engram** — not a replacement
5. **Cross-reference notes** added to AGENTS.md listing all on-demand skills

## Why This Works

- **Signal-to-noise ratio**: Only high-impact rules consume system prompt space
- **Discoverability**: Skills appear in `<available_skills>` when relevant
- **Preservation**: Removed rules from AGENTS.md still exist in skills
- **Maintainability**: Clear separation between always-on and on-demand

## Prevention

1. **When adding rules to AGENTS.md**: Ask "Is this high-impact enough for always-on?" If not, make it a skill.
2. **When removing rules from AGENTS.md**: Always verify the rule exists in at least one skill before deleting.
3. **When creating skills**: Include YAML frontmatter with descriptive `name` and `description` fields.
4. **When moving rules between AGENTS.md and skills**: Update intro/cross-reference notes to match.

## Files Created/Modified

- `C:\Users\sebas\.config\opencode\AGENTS.md` — 164 lines, 5 sections
- `C:\Users\sebas\.config\opencode\skills\00_Claude_Tricks_Foundation\SKILL.md` — 136 lines, 6 tricks
- `C:\Users\sebas\.config\opencode\skills\01_Claude_Tricks_Compounding\SKILL.md` — 86 lines, 4 tricks
- `C:\Users\sebas\.config\opencode\skills\02_Claude_Tricks_Orchestration\SKILL.md` — 91 lines, 4 tricks

## SDD Artifacts

- `openspec/changes/claude-tricks-implementation/` — proposal, spec, design, tasks
- `openspec/changes/archive/2026-07-21-claude-tricks-implementation/` — archived change

## Related

- `06_Solutions/system-maintenance/every-trigger-workflow.md` — Every trigger pipeline
- `01_Personal_Os/00_Core/01_Workflows/05_Compound_Engineering/20_Every_Trigger.md` — Every workflow
