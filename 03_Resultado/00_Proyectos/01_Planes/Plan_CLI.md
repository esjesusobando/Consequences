> ⚠️ DOCUMENTO HISTÓRICO — fecha desconocida
> Este documento es un registro histórico del sistema. Los conteos y métricas pueden estar desactualizados.
> Para el estado actual del sistema, ver Structure_v5.0.md o README.md.

---

# Plan de Saneamiento: Claude Code (Local & Global)

Este plan detalla las acciones necesarias para corregir los errores de Claude Code detectados durante la auditoría, tanto en el repositorio local `Think_Different` como en la configuración global del usuario. El objetivo es restaurar el estado "Pure Green" y eliminar los bloqueos en la CLI y el startup.

## User Review Required

> [!IMPORTANT]
> Se realizarán cambios en la configuración global de Claude Code (`~/.claude/`). Esto afectará a todas las sesiones de Claude Code en esta máquina, no solo en este repositorio.
> 
> Se recomienda **hacer un backup** manual de `C:\Users\sebas\.claude\` antes de proceder si hay configuraciones personalizadas que quieras preservar fuera de lo detectado.

## Proposed Changes

### 1. Repositorio Local (`Think_Different/`)

#### [MODIFY] Git Index & Submodules
- Ejecutar `git rm --cached 07_Projects/01_Projects_Lab/07_Backup_OIM` para eliminar el submodule huérfano que bloquea la CLI.
- Limpiar `.gitmodules` eliminando las entradas de paths que ya no existen (`Momentum_Os`, `03_Resources_External`, `Every_Sync_Zone`).
- Ejecutar `git config --local --remove-section` para limpiar el `.git/config` de referencias a estos submodules.

#### [DELETE] Agentes Duplicados
- Eliminar las versiones "legacy" (sin numeración) en `.claude/03_Agents/`:
  - `workflow-orchestrator.md`
  - `aipm-judge.md`
  - `lfg.md`

#### [MODIFY] Configuraciones Locales
- Limpiar `.claude/settings.json` eliminando permisos a paths inexistentes (`New_Skills`, `/tmp/`).
- Deshabilitar el MCP server `docker` en `.mcp.json` local (ya que el binario no está en el sistema).

---

### 2. Configuración Global (`~/.claude/`)

#### [MODIFY] Global Settings
- Limpiar `C:\Users\sebas\.claude\settings.local.json` de permisos con paths absolutos que ensucian el contexto global si no se está en este proyecto.
- Verificar y sincronizar el `.mcp.json` global para evitar conflictos con el local.

---

### 3. Consolidación de Reglas (Rules)

#### [MODIFY] Sincronización de Reglas (.mdc)
- Unificar el naming convention a `hyphens` (ej: `05_ritual-integrity.mdc`) en todos los directorios.
- Sincronizar las reglas faltantes (23, 24, 25) desde `00_Core/01_Rules/` hacia `.claude/02_Rules/` y `.agent/00_Rules/`.
- *Opcional:* Se puede automatizar esta sincronización vía el `01_Auditor_Hub.py` en el futuro.

## Open Questions

- ¿Deseas que mueva las API Keys detectadas en `.mcp.json` a un archivo `.env` externo (fuera de git) como parte de este plan, o lo dejamos para una fase de seguridad posterior?

## Verification Plan

### Automated Tests
- Ejecutar `git submodule status` para confirmar que no hay errores fatales.
- Ejecutar el `01_Auditor_Hub.py` (si está operativo) para verificar la integridad de la estructura.
- Verificar la existencia de archivos post-borrado.

### Manual Verification
- Solicitar al usuario que abra Claude Code en la CLI y confirme que ya no aparecen los mensajes de error de "issue" o "submodule mapping".
