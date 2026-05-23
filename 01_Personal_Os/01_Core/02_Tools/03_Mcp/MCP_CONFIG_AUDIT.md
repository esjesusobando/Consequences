# MCP Configuration Audit — Think Different OS v3.1

> **Fecha:** 2026-05-03
> **Versión:** v4.7 Consequences
> **Estado:** ✅ Documentado

---

## 📊 Overview

Este documento audita y documenta el estado de las configuraciones MCP en el proyecto, incluyendo drift entre configs, conflictos de naming, y seguridad de credenciales.

---

## 🔍 Configs Analizadas

| ID               | Config                        | Path                                                           | Servers              | Auth Type                        | Status              |
|-----------------|------------------------------|---------------------------------------------------------------|---------------------|---------------------------------|--------------------|
| **A**            | Root                          | `.mcp.json`                                                    | 38                   | `${VAR}` placeholders            | ✅ ACTIVO            |
| **B**            | Backup Claude Code            | `01_Core/02_Tools/03_Mcp/01_Claude_Code/mcp.json`              | 30                   | HARDCODED                        | 🔴 BACKUP            |
| **C**            | OpenCode Global               | `~/.config/opencode/opencode.json`                             | 36                   | HARDCODED                        | 🔴 BACKUP            |
| **D**            | OpenCode Project              | `01_Core/02_Tools/03_Mcp/02_OpenCode/opencode.json`            | 36                   | HARDCODED                        | 🔴 BACKUP            |

---

## ⚠️ SECURITY WARNINGS

### 🔴 Credenciales Hardcodeadas

| Config              | Severity              | Issue                                       |
|--------------------|----------------------|--------------------------------------------|
| **B**               | 🔴 CRITICAL            | API keys visibles en texto plano            |
| **C**               | 🔴 CRITICAL            | API keys visibles en texto plano            |
| **D**               | 🔴 CRITICAL            | API keys visibles en texto plano            |

**Recomendación:** Usar `.mcp.json` (root) como config activa. Las otras son backups.

---

## 📋 Drift Analysis

### Server Count Discrepancy

| Config                        | Servers              | Delta vs Root              |
|------------------------------|---------------------|---------------------------|
| Root (`.mcp.json`)            | 38                   | —                          |
| Backup Claude Code            | 30                   | -8                         |
| OpenCode Global               | 36                   | -2                         |
| OpenCode Project              | 36                   | -2                         |

### Servers Únicos por Config

**Root exclusivo (8 servers):**
- `recall`
- `sequential-thinking`
- `nanobanana`
- `playwright` (CLI)
- `eagle` (duplicate entry)
- `TestSprite`
- `mcp-obsidian`
- `obsidian-api`

**Backup Claude Code exclusivo (9 servers):**
- `brave-search`
- `postgres`
- `sqlite`
- `slack`
- `sentry`
- `atlassian`
- `jira-extended`

**OpenCode exclusivo (3 servers):**
- `notebooklm-mcp.cmd` (vs npx)
- `engram` con path `C:\Users\sebas\go\bin\engram.exe`

---

## 🔴 Conflictos Detectados

### 1. Naming Mismatch: `@magicuidesign/mcp`

| Config              | Nombre                                       | Transport              |
|--------------------|---------------------------------------------|-----------------------|
| Root                | `@magicuidesign/mcp` (slash)                 | stdio                  |
| OpenCode            | `@magicuidesign_mcp` (underscore)            | stdio                  |

**Impacto:** Puede causar que uno de los dos no cargue correctamente.

**Solución:** Estandarizar a `@magicuidesign/mcp` en todas las configs.

### 2. Duplicate Entry: `eagle-mcp`

| Config              | Entry 1                                  | Entry 2                              |
|--------------------|-----------------------------------------|-------------------------------------|
| Root                | `eagle-mcp` (localhost:41596)            | `eagle` (localhost:41596)            |

**Impacto:** Entry duplicada apuntando al mismo servidor.

**Solución:** Eliminar entrada `eagle` redundante.

### 3. Obsidian Duplicado

| Config              | Entry                                | Vault                         |
|--------------------|-------------------------------------|------------------------------|
| Root                | `mcp-obsidian`                       | `AI Strong Bunker`            |
| Root                | `obsidian-api` (failover)            | `AI Strong Bunker`            |

**Impacto:** Dos entries para el mismo vault.

**Solución:** Mantener como failover activo (OK).

### 4. Engram Path Difference

| Config              | Command                                       | Args                                  |
|--------------------|----------------------------------------------|--------------------------------------|
| Root                | `engram`                                      | `["mcp"]`                             |
| OpenCode            | `C:\Users\sebas\go\bin\engram.exe`            | `["mcp", "--tools=agent"]`            |

**Impacto:** Comportamiento diferenciado entre herramientas.

**Solución:** Documentado, no requiere fix inmediato.

---

## 📁 Skills Lock Status

### Duplicados Identificados

| Location                                            | Content                                                     | Status              |
|----------------------------------------------------|------------------------------------------------------------|--------------------|
| `.claude/skills-lock.json`                          | 4 skills (find-skills, mcp-builder, prd, shadcn)            | ✅                   |
| `03_Mcp/skills-lock.json`                           | **IDENTICAL** — mismo contenido                             | ✅                   |
| `Archive/curso-ai-devs/skills-lock.json`            | **DIFFERENT** — skills diferentes                           | ✅                   |

**Nota:** Los dos primeros son idénticos. El tercero es de un contexto diferente.

---

## 🛠️ Recomendaciones

### Inmediatas
1. ❌ **NO editar** configs B, C, D directamente (contienen credenciales)
2. ✅ Usar `.mcp.json` (root) como config de referencia
3. ✅ Mantener backup de configs con credenciales en lugar seguro

### Mediano Plazo
1. Generar nuevas configs desde `.mcp.json` usando placeholders `${VAR}`
2. Estandarizar naming `@magicuidesign/mcp` en todas las configs
3. Eliminar entrada `eagle` redundante

### Largo Plazo
1. Implementar sistema de credenciales via environment variables
2. Centralizar todas las credenciales en `.env` file
3. Automatizar sync entre configs via script

---

## 📊 Matrix de Compatibilidad

| Feature                       | Root              | Backup CC              | OpenCode              | Compatibilidad              |
|------------------------------|------------------|-----------------------|----------------------|----------------------------|
| Placeholder vars              | ✅                 | ❌                      | ❌                     | —                           |
| 38 servers                    | ✅                 | ❌                      | ❌                     | —                           |
| @magicuidesign/mcp            | ✅                 | ❌                      | ❌                     | ⚠️                          |
| eagle single entry            | ❌                 | ✅                      | ❌                     | ⚠️                          |
| engram path                   | ⚠️                | ⚠️                     | ⚠️                    | ⚠️                          |

---

## 📝 Notas de Auditoría

- **Fecha última auditoría:** 2026-05-03
- **Auditor:** Think Different OS v3.1 Internal Audit
- **Próxima auditoría:** 2026-06-03 (30 días)

---

## 🔗 Referencias

- Root config: `.mcp.json`
- Backup configs: `01_Personal_Os/01_Core/02_Tools/03_Mcp/`
- Skills lock: `.claude/skills-lock.json`

---

_MCP Config Audit — Think Different OS v3.1 Consequences_
