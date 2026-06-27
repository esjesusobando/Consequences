# .claude — Claude Code Configuration & Memory

> **Version:** v4.9 Desktop-aligned
> **Last update:** 2026-05-26

---

## Purpose

Project-local Claude Code configuration, commands, rules, agents, skills, memory and historical session artifacts for Think_Different.

---

## Canonical Structure

```text
.claude/
├── 01_Commands/          # Claude commands and workflow entrypoints
├── 02_Rules/             # Numbered Claude rules; canonical replacement for legacy rules/
├── 03_Agents/            # Claude agent definitions
├── 04_Skills/            # Claude skills grouped by priority/domain
├── 05_Memory/            # Preserved project memory artifacts
├── 06_History/           # Session history and preserved legacy history
├── 07_Local_Settings/    # Archived local/nested settings that are not active defaults
├── settings.json         # Portable Claude Code settings
├── settings.local.json   # Desktop-local Claude Code settings
└── skills-lock.json      # Skill lock metadata
```

---

## Canonical Rules

- Prefer numbered folders as source of truth.
- Legacy unnumbered folders were merged into the numbered structure on 2026-05-26.
- Active rules live in `.claude/02_Rules/`.
- Active memory artifacts live in `.claude/05_Memory/`.
- Active/preserved history lives in `.claude/06_History/`.

---

## Related Documentation

| Resource                           | Description                      |
| ---------------------------------- | -------------------------------- |
| `AGENTS.md`                        | Root Guardian Angel entrypoint   |
| `00_Winter_is_Coming/AGENTS.md`    | Main Matrix Core rules           |
| `01_Personal_Os/01_Core/01_Rules/` | PersonalOS source-of-truth rules |

---

*Think Different PersonalOS v4.9 Desktop-aligned*