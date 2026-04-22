# Firecrawl — AI Web Scraping & Data Extraction

**Categoría:** Web Scraping / AI Data / MCP Integration
**Tags:** #ai #scraping #mcp #web-data #llm #automation
**Fecha:** 2026-04-17
**Fuente:** https://github.com/firecrawl/firecrawl

---

## 🎯 Resumen

**Firecrawl** es la API para buscar, raspar e interactuar con la web para AI. Con **110k+ stars** en GitHub, es el estándar de facto para obtener datos limpios de sitios web para aplicaciones LLM.

> "Power AI agents with clean web data."

---

## 📊 Estadísticas

| Métrica                | Valor                  |
|------------------------|------------------------|
| **Stars**              | 110k+                  |
| **Forks**              | 7k                     |
| **Commits**            | 5,290                  |
| **Lenguaje principal** | TypeScript (67.1%)     |
| **Licencia**           | AGPL-3.0 (Open Source) |
| **Última versión**     | v2.9.0 (2026-04-10)    |

---

## 🚀 Características Principales

### Endpoints Core

| Endpoint         | Descripción                                                        |
|------------------|--------------------------------------------------------------------|
| **Search**       | Buscar en la web y obtener contenido completo de resultados        |
| **Scrape**       | Convertir cualquier URL a markdown, HTML, JSON, screenshots        |
| **Interact**     | Raspar página y luego interactuar con ella (click, scroll, write)  |
| **Agent**        | Recolección automatizada de datos — solo describe lo que necesitas |
| **Crawl**        | Raspar todas las URLs de un website con una sola petición          |
| **Map**          | Descubrir todas las URLs de un website instantáneamente            |
| **Batch Scrape** | Raspar miles de URLs asincrónicamente                              |

### Features Clave

- **96% de cobertura web** — incluyendo páginas JS-heavy
- **P95 latency: 3.4s** — construido para agentes en tiempo real
- **LLM-ready output** — Markdown limpio, JSON estructurado, screenshots
- **Sin configuración** — maneja proxies, rate limits, contenido bloqueado
- **MCP listo** — conecta Firecrawl a cualquier agente AI con un comando
- **Media parsing** — extrae contenido de PDFs, DOCX hospedados
- **Acciones** — click, scroll, write, wait, press antes de extraer

---

## 💻 SDKs Disponibles

| Lenguaje    | Install                              |
|-------------|--------------------------------------|
| **Python**  | `pip install firecrawl-py`           |
| **Node.js** | `npm install @mendable/firecrawl-js` |
| **Java**    | Gradle/Maven (ver docs)              |
| **Elixir**  | `{:firecrawl, "~> 1.0"}`             |
| **Rust**    | `firecrawl = "2"`                    |
| **Go**      | SDK community                        |

---

## 🔧 Integración con PersonalOS

### MCP Configuration

```json
{
  "mcpServers": {
    "firecrawl-mcp": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "fc-YOUR_API_KEY"
      }
    }
  }
}
```

### Skill CLI

```bash
npx -y firecrawl-cli@latest init --all --browser
```

**Compatible con:**
- Claude Code
- Antigravity
- OpenCode

---

## 💡 Casos de Uso

### Para Product Designer & AI Strategist

1. **Research automatizado** — Recolectar información de competidores, tendencias, precios
2. **Content aggregation** — Agregar contenido de múltiples fuentes para análisis
3. **Market intelligence** — Monitorizar sitios de competidores
4. **Portfolio enhancement** — Extraer datos para proyectos de portfolio
5. **Learning system** — Alimentar el Knowledge Base con datos actualizados

### Para el PersonalOS

- **Engram integration** — Guardar research directo a memoria
- **Workflow automation** — Integrar con n8n para flujos automáticos
- **Data collection** — Alimentar proyectos en `07_Projects/`

---

## 📋 Ejemplos de Código

### Python — Scrape básico

```python
from firecrawl import Firecrawl

app = Firecrawl(api_key="fc-YOUR_API_KEY")
doc = app.scrape("https://firecrawl.dev", formats=["markdown"])
print(doc.markdown)
```

### Python — Agent (autonomous)

```python
result = app.agent(prompt="Find the pricing plans for Notion")
print(result.data)
```

### Python — Structured Output (Pydantic)

```python
from pydantic import BaseModel, Field
from typing import List

class Founder(BaseModel):
    name: str = Field(description="Full name")
    role: Optional[str] = Field(None, description="Role")

class FoundersSchema(BaseModel):
    founders: List[Founder]

result = app.agent(
    prompt="Find the founders of Firecrawl",
    schema=FoundersSchema
)
```

---

## 🔗 Recursos

- **Web:** https://firecrawl.dev
- **Docs:** https://docs.firecrawl.dev
- **Playground:** https://firecrawl.dev/playground
- **MCP Server:** https://github.com/mendableai/firecrawl-mcp-server

---

## 🆚 Open Source vs Cloud

| Feature              | Open Source   | Cloud   |
|----------------------|---------------|---------|
| Core scraping        | ✅             | ✅       |
| Search               | ✅             | ✅       |
| Agent (spark-1-mini) | ✅             | ✅       |
| Agent (spark-1-pro)  | ❌             | ✅       |
| Crawl website        | ✅             | ✅       |
| Batch scrape         | ❌             | ✅       |
| Priority support     | ❌             | ✅       |
| Self-hosting         | ✅             | ❌       |

---

## ✅ Próximos Pasos (PersonalOS)

- [ ] Agregar API key de Firecrawl al `.mcp.json`
- [ ] Testear scraping con Playwright MCP + Firecrawl
- [ ] Crear workflow de research automatizado
- [ ] Integrar con Engram para guardar hallazgos
- [ ] Usar para proyectos en `07_Projects/`

---

*Documento generado: 2026-04-17 | Tags: #firecrawl #web-scraping #ai-tools #mcp*
