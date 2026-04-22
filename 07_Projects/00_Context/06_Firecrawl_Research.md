# Firecrawl — AI Web Scraping & Data Extraction

**Categoría:** Web Scraping / AI Data / MCP Integration
**Tags:** #ai #scraping #mcp #web-data #llm #automation
**Fecha:** 2026-04-17
**Fuente:** https://github.com/firecrawl/firecrawl

---

## 🎯 Resumen

**Firecrawl** — "The API to search, scrape, and interact with the web for AI"

- **110k+ stars** en GitHub
- **Estándar de facto** para web scraping para LLM
- **Open Source** (AGPL-3.0) + Cloud service

---

## 🚀 Características Principales

### Endpoints Core
- **Search** — Buscar y obtener contenido completo
- **Scrape** — Convertir URL a markdown/JSON/screenshots
- **Interact** — Click, scroll, write antes de extraer
- **Agent** — Recolección automatizada (describe lo que necesitas)
- **Crawl** — Raspar website completo
- **Map** — Descubrir todas las URLs
- **Batch Scrape** — Miles de URLs asincrónicamente

### Métricas
- **96% cobertura web** (incluye JS-heavy)
- **P95 latency: 3.4s**
- **LLM-ready output** — Markdown limpio

---

## 🔧 Integración PersonalOS

### MCP Config (.mcp.json)
```json
{
  "mcpServers": {
    "firecrawl-mcp": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": { "FIRECRAWL_API_KEY": "fc-..." }
    }
  }
}
```

### Python SDK
```python
from firecrawl import Firecrawl
app = Firecrawl(api_key="fc-...")
doc = app.scrape("https://firecrawl.dev", formats=["markdown"])
```

### Agent (Autonomous)
```python
result = app.agent(prompt="Find pricing plans for Notion")
print(result.data)
```

---

## 📋 Casos de Uso

1. **Research automatizado** — Competidores, tendencias, precios
2. **Content aggregation** — Múltiples fuentes
3. **Market intelligence** — Monitorizar competidores
4. **Knowledge Base** — Alimentar con datos actualizados

---

## 🔗 Recursos

- **Web:** https://firecrawl.dev
- **Docs:** https://docs.firecrawl.dev
- **MCP Server:** github.com/mendableai/firecrawl-mcp-server

---

*Generado: 2026-04-17*
