---
source: "C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\05_Frameworks\09_Unicorn\06_Engineering\decisions\2026-04-01_Dual_Config_MCP.md"
sync_source: "C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\02_Docs\Frameworks\09_Unicorn\06_Engineering\decisions\2026-04-01_Dual_Config_MCP.md"
sync_date: "2026-08-01T00:55:48.136434"
sync_updated: true
---

## Dual-Config MCP Pattern — Claude Code vs OpenCode

### Context
PersonalOS uses two separate MCP configs — one for Claude Code, one for OpenCode. Both have 31 active MCPs.

### Problem
Claude Code and OpenCode read configs from different paths and with different formats. Original error: config at wrong path for OpenCode.

### Decision
Keep two separate MCP config files documented:
- Claude Code: `.mcp.json` at root
- OpenCode: `opencode.mcp.json` at root

### Application
Validate that both files exist and have the same MCPs in each audit.

### Related Lessons
- OpenCode v1.3.13 changed `env` → `environment` (breaking change)


> 🔗 Zona: [[02  -  Areas/10_Referencias/Frameworks/09_Unicorn/README]]
