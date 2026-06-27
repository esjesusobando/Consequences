> ⚠️ DOCUMENTO HISTÓRICO — fecha desconocida
> Este documento es un registro histórico del sistema. Los conteos y métricas pueden estar desactualizados.
> Para el estado actual del sistema, ver Structure_v5.0.md o README.md.

---

# 17_NP — Subagent Statusline Plugin + Git Fixes

> **Fecha**: 2026-05-22
> **Tags**: `#plugin` `#subagent-statusline` `#git` `#gitignore` `#opencode` `#joaquinvesapa`

---

## 1. Plugin: opencode-subagent-statusline

### Instalación verificada

El plugin ya estaba instalado de una sesión previa (referenciado en
`08_NP_Session_Archive_2026-04-25.md`), pero nunca se había verificado ni
documentado formalmente.

**Package**: `opencode-subagent-statusline@0.7.1` (103 dependencias instaladas)
**Dist compilado**: `dist/tui.js` (137KB) y `dist/index.js` (53KB) existen

### Configuración

```json
// ~/.config/opencode/tui.json
{
  "$schema": "https://opencode.ai/tui.json",
  "theme": "gentleman-kanagawa",
  "plugin": ["opencode-subagent-statusline"]
}
```

Key `"plugin"` (singular) es correcta según la documentación oficial del package.

### Notas técnicas

- El plugin NO va en `opencode.json` ni en `profiles/default/opencode.jsonc`
  — es exclusivamente UI-side (TUI plugin)
- OpenCode requiere **restart** después de agregarlo a `tui.json`
- Si el plugin no aparece tras restart, limpiar cache:
  ```bash
  rm -rf ~/.cache/opencode/packages/
  ```
- El README confirma que el plugin persiste estado local en `$XDG_RUNTIME_DIR`
  o temp dir del sistema

---

## 2. Gitignore Fix (CRITICO)

### Problema raíz

Cursor no mostraba el estado git porque el `.gitignore` tenía **3 paths rotos**
del template original `Gentleman Programming PersonalOS Template`:

```
03_Tasks/*.md     → NO existe (la carpeta es 03_Task/)
02_Knowledge/*.md → NO existe (la carpeta es 01_Personal_Os/02_Knowledge/)
CLAUDE.md         → gitignored pero YA TRACKEADO → inconsistencia
```

Además, el repo clonado `sub-agent-statusline/` en la ruta
`01_Repos_Reference/02_Repos_Gentleman/` no estaba en `.gitignore`.

### Fix aplicado

1. `03_Tasks/` → `03_Task/` en todas las líneas
2. `02_Knowledge/` → `01_Personal_Os/02_Knowledge/` en todas las líneas
3. Removida línea `CLAUDE.md` del gitignore (el archivo ya está trackeado)
4. Removida línea `!CLAUDE_TEMPLATE.md` (ya no aplica)
5. Agregado `01_Personal_Os/05_Archive/01_Repos_Reference/02_Repos_Gentleman/`

### Por qué esto rompía Cursor

Cursor usa su propio parser de git status. Con 29 archivos en estado mixto
(staged/unstaged/untracked) sumado a patrones de gitignore inconsistentes,
el parser se saturaba y mostraba pantalla en blanco.

---

## 3. Documentación en Git Rules

Se actualizó `01_Personal_Os/01_Core/01_Rules/10_Git_Directions.mdc`:

- **Nueva sección 9**: Plugin subagent-statusline con repo, autor, versión, config
- **Checklist expandido**: de 6 a 9 pasos (agregados checks de subagent-statusline
  y gitignore)
- **NOTA DE MANTENIMIENTO actualizada**: ahora incluye tui.json y gitignore
- **Fecha actualizada**: 2026-05-22

---

## 4. Regla de Documentación Establecida

A partir de esta sesión, cuando el usuario diga **"documentar"** o **"documentar todo"**:

| Destino             | Formato                           | Propósito                        |
|--------------------|----------------------------------|---------------------------------|
| `00_Context_Memory/`| `NN_CTX_Session_YYYY-MM-DD.md`    | Contexto ligero de sesión        |
| `01_Process_Notes/` | `NN_NP_Descripcion_YYYY-MM-DD.md` | Detalle técnico completo         |
| Engram              | `mem_save` + `mem_session_summary`| Memoria persistente cross-session|

---

## Referencias

- Repo plugin: https://github.com/Joaquinvesapa/sub-agent-statusline
- Config: `~/.config/opencode/tui.json`
- Package: `~/.config/opencode/node_modules/opencode-subagent-statusline/`
- Git rules: `01_Personal_Os/01_Core/01_Rules/10_Git_Directions.mdc`
- Process Note previa: `08_NP_Session_Archive_2026-04-25.md` (mención inicial del plugin)
