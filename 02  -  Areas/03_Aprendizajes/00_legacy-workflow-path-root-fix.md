---
source: "C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\01_Memory\00_Context_LLM\06_Solutions\00_legacy-workflow-path-root-fix.md"
sync_source: "C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\01_Research\00_legacy-workflow-path-root-fix.md"
sync_date: "2026-08-01T00:55:43.493214"
sync_updated: true
---

# 🧠 Compound: Legacy `00_Workflows/` Path at Root

**Type:** `bugfix` · `pattern`  
**Date:** 2026-07-16  
**Author:** Jesús Obando

---

## The Problem

Al hacer `git checkout`, `git stash`, o cualquier operación que restaurara el working tree, aparecía la carpeta `00_Workflows/` en la raíz del proyecto con la estructura vieja del Personal OS.

## Root Cause

El archivo `00_Workflows/01_Personal_Os/weekly_feedback_review.md` estaba trackeado en git desde el commit `90ff7d55` (cuando el OS tenía otra estructura). Cuando la estructura se migró a `01_Personal_Os/00_Core/00_Workflows/`, ese archivo quedó huérfano en el index de git — presente en HEAD pero ausente en el working tree.

Cada vez que git necesitaba restaurar el estado completo del repo, recreaba el directorio `00_Workflows/` con ese archivo adentro.

## The Fix

```bash
git rm --cached "00_Workflows/01_Personal_Os/weekly_feedback_review.md"
```

Y se agregó al `.gitignore`:

```
# Legacy workflow path (old OS structure — moved to 01_Personal_Os/00_Core/00_Workflows/)
00_Workflows/
```

## Prevention

- Cuando se migran directorios completos, verificar que no queden archivos huérfanos en HEAD con `git ls-tree -r HEAD --name-only | grep "^old-path"`
- Agregar el path viejo al `.gitignore` inmediatamente después de la migración

## Affected

- `.gitignore` (modified)
- `00_Workflows/01_Personal_Os/weekly_feedback_review.md` (deleted from tracking)


> 🔗 Zona: [[02  -  Areas/03_Aprendizajes/index]]
