---
source: "C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\05_Frameworks\09_Unicorn\06_Engineering\bugfixes\2026-03-31_Edge_Cases_Duplicates_Removed.md"
sync_source: "C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\02_Docs\Frameworks\09_Unicorn\06_Engineering\bugfixes\2026-03-31_Edge_Cases_Duplicates_Removed.md"
sync_date: "2026-08-01T00:55:48.077414"
sync_updated: true
---

## Fixed Edge Cases - Duplicates Removed

### Context
User requested to get OS to 100%.

### Problem
- `.mcp.json` was markdown, not JSON (corrupt file)
- Duplicates in Maerks: OpenCode_Commands_Reference.md, OpenCode_Active_Configuration.md, OpenCode_Integration.md

### Solution
- Removed corrupt `.mcp.json`
- Removed duplicates in Maerks/Otros/
- Pending: API keys to rotate, placeholder tokens in MCPs

### Location
- `.mcp.json` (root)
- `Maerks/Otros/`

### Lesson
Verify file types before assuming format. Duplicates reduce quality.


> 🔗 Zona: [[03_Resources/01_AI_Research_OS/Referencias/Frameworks/09_Unicorn/README]]
