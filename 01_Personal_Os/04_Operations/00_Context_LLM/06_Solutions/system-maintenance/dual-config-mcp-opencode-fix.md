---
title: Dual-Config MCP Pattern + OpenCode v1.3.13 Fix
date: 2026-04-03
status: completed
tags: [mcp, opencode, claude-code, breaking-change, dual-config]
categories: [system-maintenance]
problema_resuelto: true
---

# Dual-Config MCP Pattern + OpenCode v1.3.13 Breaking Change Fix

## Problem Symptom

1. Claude Code cargaba **0 MCPs** -- herramientas como engram, notion, firecrawl no disponibles
2. OpenCode fallaba al abrir con errores: "Invalid input mcp.exa" x7
3. MCP pencil lanzaba error de path not found

## Root Cause Analysis

### Problema 1: .mcp.json faltante
Claude Code busca MCPs en `.mcp.json` en la raiz del proyecto. El archivo existia SOLO en
`01_Core/05_Mcp/01_Claude_Code/mcp.json` como backup documental -- ningun tool lo leia.

### Problema 2: OpenCode v1.3.13 breaking change
OpenCode v1.3.13 renombro el campo `env` a `environment` en `McpLocalConfig`.
El schema usa `additionalProperties: false`, por lo que cualquier MCP con `env` falla
completamente -- todos los MCPs con ese campo son rechazados (no parcialmente).

### Problema 3: path 05_System inexistente
El MCP pencil apuntaba a `./05_System/09_Bin/.bin/openpencil-mcp.cmd`.
La carpeta `05_System` nunca existio en v6.1.

## Working Solution

### Fix 1: Crear .mcp.json en raiz
Crear `.mcp.json` con el contenido de `01_Core/05_Mcp/01_Claude_Code/mcp.json`
adaptado al formato correcto (npx.cmd en Windows, transport: stdio).

### Fix 2: Renombrar env -> environment

```python
import json

def fix_env(obj):
    if isinstance(obj, dict):
        if "env" in obj:
            obj["environment"] = obj.pop("env")
        for v in obj.values():
            fix_env(v)
    elif isinstance(obj, list):
        for item in obj:
            fix_env(item)

for path in [
    "~/.config/opencode/opencode.json",
    "01_Core/05_Mcp/02_OpenCode/opencode.json"
]:
    config = json.load(open(path))
    fix_env(config["mcp"])
    json.dump(config, open(path, "w"), indent=2)
```

MCPs afectados: exa, Notion, task-master-ai, supadata, zai-mcp-server, excalidraw-yctimlin, firecrawl-mcp

### Fix 3: MCP pencil con npm global
Cambiar command de `./05_System/09_Bin/.bin/openpencil-mcp.cmd`
a `openpencil-mcp.cmd` (npm global disponible en PATH).

## Dual-Config Pattern (Arquitectura Definitiva)

```
Claude Code  ->  .mcp.json (raiz proyecto)              31 MCPs
OpenCode     ->  ~/.config/opencode/opencode.json       31 MCPs
Backup CC    ->  01_Core/05_Mcp/01_Claude_Code/mcp.json (documental, 38 entries)
Backup OC    ->  01_Core/05_Mcp/02_OpenCode/opencode.json (documental, 31)
```

REGLA: Al modificar MCPs, actualizar SIEMPRE el activo Y el backup.

## Prevention

- Al actualizar OpenCode, verificar changelog por breaking changes en schema MCP
- Testear con `opencode debug config` antes de usar
- Mantener `.mcp.json` en raiz -- no depender de paths secundarios
- Validar JSON: `py -3 -c "import json; json.load(open('.mcp.json'))"`

## Verification

```bash
opencode debug config
py -3 -c "import json; d=json.load(open('.mcp.json')); print(len(d['mcpServers']), 'servers')"
```

*Resolucion: 2026-04-03 -- PersonalOS v6.1*
