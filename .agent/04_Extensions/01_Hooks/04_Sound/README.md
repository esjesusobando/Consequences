# Sound Hooks — Backup Copy

## Source of Truth
The canonical version of these hooks lives at:
`01_Personal_Os/01_Core/02_Tools/05_Hooks/04_Sound/`

`.agent/04_Extensions/` is the **strategic backup**. This copy is synced from the source of truth.

## Files
- `notification.py` — Python sound engine (cross-platform)
- `task-complete.bat` — Windows batch launcher
- `task-complete-sound.ps1` — PowerShell launcher with configurable sounds

## Usage
```bash
# Windows
task-complete.bat

# PowerShell
.\task-complete-sound.ps1 -Sound Exclamation -Duration 300
```
