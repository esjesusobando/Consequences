# MCP Sync Fix — Think Different v4.1

**Fecha:** 2026-05-17
**Problema:** 3 MCPs existen en Claude Code pero no en OpenCode

---

## MCPs con Drift

| MCP                | Claude Code  | OpenCode  | Status           |
|-------------------|-------------|----------|-----------------|
| higgsfield         | ✅            | ❌         | Falta en OpenCode|
| playwright         | ✅            | ❌         | Falta en OpenCode|
| sequential-thinking| ✅            | ❌         | Falta en OpenCode|

---

## Solución — Opción A: Agregar a OpenCode Global

Editá `~/.config/opencode/opencode.json` y agregá después de la sección `mcpServers`:

```json
"higgsfield": {
  "transport": "streamableHttp",
  "url": "https://mcp.higgsfield.ai/mcp",
  "env": {}
},
"playwright": {
  "transport": "stdio",
  "command": "npx.cmd",
  "args": ["-y", "@playwright/mcp@latest"]
},
"sequential-thinking": {
  "transport": "stdio",
  "command": "npx.cmd",
  "args": ["-y", "sequential-thinking-mcp"]
}
```

---

## Solución — Opción B: Crear Config Local (Proyecto)

El proyecto ya tiene backup en:
```
01_Personal_Os/01_Core/02_Tools/03_Mcp/02_OpenCode/opencode.json
```

Para usar una config local, crear `opencode.local.json` en raíz con los MCPs adicionales.

---

## Script de Verificación

```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/15_MCP_Sync_Hub.py --report
```

---

## Recomendación

Si usás **tanto Claude Code como OpenCode** para este proyecto, usá Opción A para mantener ambos sincronizados.

Si solo usás **OpenCode**, no necesitás hacer nada — los 3 MCPs son Claude-only.

---

*Generado: 2026-05-17*
