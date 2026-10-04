## 2026-09-26
- Daily note created: captured workflow insights
- Sistema PARA reviewed and updated
- Engram audit performed

## 2026-07-30 — AI Research OS instalado en Oband_Os

> Detalle completo: [[05  -  Daily/2026-07/2026-07-30]]

- Instaladas 7 skills del plugin `ai-research-os` (iusztinpaul/ai-research-os-workshop) en `.claude/skills/`, `.opencode/skills/` y global `C:/Users/sebas/.config/opencode/skills/`.
- Creada carpeta `06_Research/` con README (metodología: seeds→raw→wiki→index) y 4 temas: `01_AI_Research_OS` (activo, index generado), `02_Coding_Agent_Architectures`, `03_Custom_URLs`, `04_Deep_Research_Example`.
- Verificado: `uv run --script` funciona; nlm 0.3.11 listo; `youtube_extract_transcript` extrajo 1003 snippets (2.73s); research-lint 0 errores en 01.
- `OBSIDIAN_CLI` configurada → `C:\Program Files\Obsidian\Obsidian.com` (CLI habilitado por el usuario; create real OK).
- Convención de nombres MANDATORY grabada en skill: `NN_Name_Pascal_Case` (2 dígitos + guion bajo).
- **Diagnóstico resuelto**: skills no visibles en `/` de OpenCode — causa era frontmatter `user_invocable` (guion bajo) vs `user-invocable` (guion) que usa OpenCode. ✅ Corregido en 21 archivos (7 skills × 3 ubicaciones). Falta reiniciar OpenCode para validar.
- **Pendiente**: validar tras reinicio, referencia a ejemplos del repo en skill, token Raindrop, readwise-cli (opcional).
- Fuente: repo clonado en `C:/Users/sebas/AppData/Local/Temp/opencode/ai-research-os-workshop`.

## 2026-09-15 — Second Brain Bridge: OS ↔ Vault

> Detalle completo: [[05  -  Daily/2026-09/2026-09-15]]

- Creada regla `15_Second_Brain_Bridge.mdc` en el OS (Think_Different): documenta el vault como capa de conocimiento, acceso vía mcp-obsidian, límite Engram↔vault y convención de daily notes.
- Iron Man boot integra el vault como prerequisite no bloqueante (lea schema `06  -  Process/02_Schema/CLAUDE.md` + wiki `index.md`).
- Reconcilación de versiones: gentle-ai real `2.5.0-rc.1` (doc decía 1.36.6), compound-engineering real `3.24.0` (doc decía 3.8.4), subagent-statusline convergido a `1.3.0`.

## 2026-09-22 — Daily Migration + Auditoría Completa

> Detalle completo: [[05  -  Daily/2026-09/2026-09-22]]

- **Daily Migration:** Carpeta `Daily/` legacy → `05  -  Daily/` oficial (38 archivos: 1 julio, 28 agosto, 9 septiembre)
- **Carpeta `Daily/` eliminada** completamente del vault
- **BACKLOG.md creada** para Oband_Os (Consequences/BACKLOG.md)
- **BACKLOG_Oband_Os.md** copiada a Think_Different (00_Winter_is_Coming/)
- **Daily note** `05  -  Daily/2026-09-22.md` creada
- **Session summary** guardado en Engram (project: think_different_ai, ID: 2387)
- **Auditoría Think_Different:** 15 áreas, 429 skills, index/registry/AGENTS.md sync completados
- **trigger: YAML** añadido a 3 skills (GWS_Client, N8N_Workflows, Ui_Ux_Pro_Max)
- **LOG.md actualizado** en ambos sistemas (Think_Different + Obsidian)
- **Index.md actualizado** con nuevas daily notes y migración
- **Daily notes:** 2026-09-20, 2026-09-21, 2026-09-22 en `05  -  Daily/2026-09/`

## 2026-09-26 - Daily created with mixed OS+Obsidian integration

## 2026-10-03 — Vault Restoration Complete ✅

> Detalle completo: [[05  -  Daily/2026-10/2026-10-03]]

- **Restauración completa del vault Obsidian Consequences**: README.md restaurado desde commit d183079f (formato doble espacio correcto PARA), carpetas duplicadas eliminadas (01_Areas/, 01_Projects/, 04_Archive/, 06_Process/ con underscore), estructura PARA verificada
- **Git**: 2 commits nuevos (2926f471 docs, 457572ef chore), push a origin/master exitoso
- **Backup**: Creado en Think_Different/00_Winter_is_Coming/00_Consequences_Backup/2026-09-28/ (12 archivos)
- **Estructura PARA verificada**: 7 carpetas raíz con formato correcto `NN  -  Nombre`
- **Backup en Obsidian**: Think_Different/00_Winter_is_Coming/00_Consequences_Backup/2026-09-28/ (12 archivos)
- **Daily note**: [[05  -  Daily/2026-10/2026-10-03]]

