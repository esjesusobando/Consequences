# 03_Mcp — MCP Configurations Backup

> **Versión:** v4.1
> **Última actualización:** 2026-05-31

---

## 🎯 DESCRIPCIÓN

Carpeta de backup para configuraciones de MCP (Model Context Protocol). Contiene las configs de respaldo para Claude Code y OpenCode.

---

## 📁 ESTRUCTURA

```
03_Mcp/
├── CLAUDE_CODE/           # Configs Claude Code
│   └── mcp.json           # MCP servers config
└── OPENCODE/              # Configs OpenCode
    └── opencode.json      # MCP servers config
```

---

## 📊 MCPs ACTIVOS (7+38)

| Categoría     | MCPs                                             |
| ------------- | ------------------------------------------------ |
| Search        | exa, brave-search, stackoverflow                 |
| Memory        | engram, aim-memory-bank, notebooklm              |
| Notes         | Notion, mcp-obsidian, obsidian-api               |
| Browser       | Playwright, chrome-devtools, eagle-mcp           |
| AI & Code     | context7, zai-mcp-server, github, task-master-ai |
| Data          | supabase, Amplitude, supadata                    |
| Workflow      | n8n-mcp, Linear                                  |
| Communication | fireflies, google-workspace                      |
| Design        | excalidraw-yctimlin, pencil                      |
| DevOps        | docker, filesystem                               |
| Deploy        | vercel, recall, TestSprite                       |
| Chain         | sequential-thinking, nanobanana, qmd             |

---

## 🔗 RELACIONES

- **Config activa:** `.mcp.json` en raíz del proyecto
- **Sync status:** 7+38 MCPs sync entre Claude y OpenCode ✅

---

## ⚠️ NOTA

Al modificar MCPs: actualizar SIEMPRE el source (este) Y el config activo correspondiente.

---

*Think Different PersonalOS v4.1*