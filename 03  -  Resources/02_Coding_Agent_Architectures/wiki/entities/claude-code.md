---
type: entity
name: Claude Code
aliases: []
sources: "[[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/opencode]]", "[[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/pi]]", "[[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]]"]
related: "[[03  -  Resources/02_Coding_Agent_Architectures/wiki/concepts/instruction-files]]", "[[03  -  Resources/02_Coding_Agent_Architectures/wiki/concepts/context-compaction]]", "[[03  -  Resources/02_Coding_Agent_Architectures/wiki/concepts/permission-gating]]", "[[03  -  Resources/02_Coding_Agent_Architectures/wiki/concepts/mcp]]"]
created: 2026-06-12T17:45:00
last_updated: 2026-06-12T17:45:00
source_count: 3
mention_count: 6
confidence: high
---

# Claude Code

> Anthropic's coding-agent CLI, present in this corpus not as a studied artifact but as the reference harness whose conventions all three studied harnesses adopt, emulate, or define themselves against.

## Definition

In this research, Claude Code is never examined directly — it appears through its **compatibility surfaces**: the `CLAUDE.md` instruction-file convention that all three harnesses parse [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/opencode]] [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/pi]] [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]], the markdown-plus-frontmatter skills format pi explicitly targets [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/pi]], and the `/compact` and deny-rule mechanisms hermes-agent names among its design influences [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]]. It functions as the de facto standard the field interoperates with: hermes-agent's docs frame it as a competitor whose instruction files are worth reading anyway [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]].

## Key claims

- All three harnesses read `CLAUDE.md` files as project memory, treating Claude Code's instruction-file convention as a de facto standard each reimplements differently. [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/opencode]], [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/pi]], [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]]
- opencode layers `AGENTS.md`/`CLAUDE.md` project memory in a global → project → directory hierarchy, lazily attached as files are read. [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/opencode]]
- pi discovers `AGENTS.md`/`CLAUDE.md` global-first then root-most-first down to cwd and inlines them into the system prompt. [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/pi]]
- hermes-agent loads exactly one project-context source via first-match-wins priority — `.hermes.md` → `AGENTS.md` → `CLAUDE.md` → `.cursorrules` — ranking Claude Code's file third behind its own and the neutral standard; it "reads competitors' instruction files." [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]]
- pi's skills system is Claude Code-compatible (markdown + frontmatter), listed by name+description and lazily read on demand — progressive disclosure positioned as pi's no-MCP alternative. [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/pi]]
- hermes-agent openly indexes Claude Code's `/compact` and deny rules among its influences (alongside OpenClaw and OpenAI Codex). [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]]
- The Claude Code-style instruction-file tier stays human-curated and read-only across harnesses: pi never writes back to instruction files, and opencode pairs user-curated `AGENTS.md` with a deliberate absence of model-written memory files. [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/opencode]], [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/pi]]

## Notable quotes

> "skills (Claude Code-compatible markdown + frontmatter) are listed name+description and lazily read on demand — progressive disclosure as the no-MCP alternative."
> — [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/pi]]

> "The codebase also openly indexes its influences — OpenClaw's subagent prompt and MCP bridge surface, OpenAI Codex's smart approvals, Claude Code's `/compact` and deny rules."
> — [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]]

## Relationships

- **Instruction files**: `CLAUDE.md` is the originating instance of the convention; all three harnesses parse it, each with different discovery/priority rules. [[03  -  Resources/02_Coding_Agent_Architectures/wiki/concepts/instruction-files]] · [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/opencode]], [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/pi]], [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]]
- **Context compaction**: Claude Code's `/compact` is a named influence on hermes-agent's session-splitting compaction design. [[03  -  Resources/02_Coding_Agent_Architectures/wiki/concepts/context-compaction]] · [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]]
- **Permission gating**: Claude Code's deny rules influenced hermes-agent's paired file-tool/terminal hard-denies on its own config. [[03  -  Resources/02_Coding_Agent_Architectures/wiki/concepts/permission-gating]] · [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]]
- **MCP**: pi positions Claude Code-compatible skills (lazy progressive disclosure) as its replacement for MCP entirely. [[03  -  Resources/02_Coding_Agent_Architectures/wiki/concepts/mcp]] · [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/pi]]

## Tensions

- Stacking vs. exclusive loading of Claude Code's instruction-file convention: opencode and pi layer multiple `AGENTS.md`/`CLAUDE.md` files (hierarchical / root-most-first), while hermes-agent loads exactly one project-context source, with `CLAUDE.md` only third in priority. [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/opencode]], [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/pi]] vs. [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]]

## Open questions

- The corpus only sees Claude Code through emulation surfaces — how faithful are these reimplementations (pi's skills compatibility, hermes-agent's `/compact`-inspired compaction) to Claude Code's actual behavior? [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/pi]], [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]]
- hermes-agent ranks `AGENTS.md` above `CLAUDE.md` while opencode and pi treat them as peers — is the vendor-neutral `AGENTS.md` displacing `CLAUDE.md` as the standard instruction-file name? [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/opencode]], [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/pi]], [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]]

> Synthesis: For this comparative study, Claude Code is the invisible fourth harness — the gravitational reference point none of the three repos can ignore. Its conventions split into two adoption patterns: file-format conventions (`CLAUDE.md`, skills frontmatter) are adopted wholesale as interoperability surfaces, while behavioral mechanisms (`/compact`, deny rules) are cited as inspiration but reimplemented divergently (hermes-agent's session-splitting compaction, pattern-keyed denies). That asymmetry — formats standardize, behaviors fork — is itself a finding about how the coding-agent ecosystem consolidates.
