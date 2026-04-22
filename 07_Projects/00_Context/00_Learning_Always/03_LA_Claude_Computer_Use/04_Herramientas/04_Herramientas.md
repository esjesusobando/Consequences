# Herramientas — Claude Computer Use

| Herramienta | Tipo | Propósito |
|------------|------|-----------|
| Claude Desktop App | App | Interfaz principal |
| Browser Use | Feature | Navegar Chrome |
| Computer Use | Feature | Controlar Mac |
| Claude Dispatch | Feature | Tareas desde phone |
| Chrome Extension | Extension | Browser integration |

---

## MCP Connectors

| Connector | Setup |
|-----------|-------|
| Notion | `npx @notionhq/notion-mcp-server` |
| Gmail | En desarrollo |
| Google Calendar | En desarrollo |
| Slack | Futuro |

---

## Stack Recomendado

```
Mac → Claude Desktop → Computer Use → MCPs →[Notion]
                                     →[Gmail]
                                     →[Calendar]
```

---

## Comparación

| Feature | Claude Computer Use | otros AI |
|---------|---------------------|----------|
| Control real | ✅ Click, type, navigate | ❌ Solo chat |
| Dispatch | ✅ Tareas desde phone | ❌ No tiene |
| Vision-Action | ✅ Loop completo | ❌ No tiene |
| MCPs | ✅ Integraciones | Limitado |