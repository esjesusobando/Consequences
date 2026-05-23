---
name: automatizacion
description: >
  Área de AUTOMATIZACIÓN — N8N, Firecrawl, GWS Client.
  Skills para workflow automation, web scraping, y integración de servicios.
---

# ⚙️ AUTOMATIZACIÓN — N8N, Firecrawl, GWS Client

**Área Funcional:** 04_Automatizacion
**Versión:** 1.0 | **Última actualización:** 2026-05-19

---

## Sub-áreas y Contenido

| Sub-área | Descripción |
|----------|-------------|
| `01_N8N_JS/` | Scripts N8N en JavaScript |
| `02_N8N_Python/` | Scripts N8N en Python |
| `03_N8N_Expressions/` | Expresiones N8N |
| `04_N8N_MCP/` | MCP nodes para N8N |
| `05_N8N_Nodes/` | Nodos personalizados |
| `06_N8N_Validation/` | Validación en workflows |
| `07_N8N_Workflows/` | Workflows completos |
| `08_N8N_Invictus/` | N8N para Invictus |
| `09_Firecrawl/` | Web scraping con Firecrawl |
| `10_GWS_Client/` | Google Workspace Client |

## Integración

- **Firecrawl MCP**: Web scraping de URLs
- **N8N MCP**: Workflow automation
- **Google Workspace MCP**: Gmail, Drive, Calendar

## Estándares N8N

### Naming Workflow
```
[N0]_[nombre]_[fecha].json
01_MiWorkflow_2026-05-19.json
```

### Estructura
```json
{
  "name": "Workflow Name",
  "nodes": [...],
  "connections": {...},
  "settings": {...}
}
```

## Web Scraping

```bash
# Usar Firecrawl MCP
"Extraé el contenido de [URL]"
```

---

*Área Automatización v1.0 — 2026-05-19*
