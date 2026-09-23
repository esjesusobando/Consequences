---
source: "C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\05_Frameworks\09_Unicorn\06_Engineering\bugfixes\2026-04-01_OpenCode_Startup_Crash.md"
sync_source: "C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\02_Docs\Frameworks\09_Unicorn\06_Engineering\bugfixes\2026-04-01_OpenCode_Startup_Crash.md"
sync_date: "2026-08-01T00:55:48.100051"
sync_updated: true
---

## OpenCode Startup Crash Fix & Compound Plugin Updates

### Context
OpenCode crashed with "unrecognized key: plugin" - violated Pure Green state.

### Problem
Legacy `plugins` key in OpenCode config caused crash on startup.

### Solution
- Removed legacy `plugins` key from OpenCode config
- Documented `compound-engineering-plugin` v2.60.0 capabilities in `01_Report_Status.md`

### Lesson
Deprecated keys must be removed completely. Not using them is not enough.


> 🔗 Zona: [[03_Reference/01_Knowledge/Referencias/Frameworks/09_Unicorn/README]]
