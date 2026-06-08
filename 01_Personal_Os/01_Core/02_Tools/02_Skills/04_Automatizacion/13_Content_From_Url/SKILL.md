---
name: content-from-url
description: Extract clean content from any URL for use in the OS. Simpler than learning-url-to-knowledge - just fetches and cleans content without generating all 8 deliverables. Use when you need quick content extraction. Trigger: /content-from-url [URL]. Triggers on: /content-from-url, extract content, URL scraper, webpage cleaner, quick research, Firecrawl
---

# Content from URL

Extract clean, usable content from any URL. Simplified extraction without the full Learning Always pipeline.

---

## Esencia Original

**Metaskill**: Extract clean content from URLs quickly — Firecrawl, WebFetch, WebSearch, or YouTube transcript — without generating the 8 deliverables of the full learning-url-to-knowledge pipeline.

**Propósito original**: Provide a fast, single-step content extraction command (/content-from-url [URL]) for quick research, tool evaluation, content backup, and reference retrieval when you don't need deep analysis or knowledge compounding.

---

## Quick Start

```
/content-from-url [URL]
```

---

## When to Use This vs learning-url-to-knowledge

| Use This           | Use learning-url-to-knowledge  |
|-------------------|-------------------------------|
| Quick content check| Full learning pipeline         |
| Simple extraction  | 8 deliverables needed          |
| One-off content    | Knowledge compounding          |
| Tool evaluation    | Deep analysis                  |

---

## Extraction Methods

### 1. Firecrawl (Preferred)
```javascript
// Best for complex pages, proper extraction
firecrawl_scrape({url: "[URL]"})
```

### 2. WebFetch
```javascript
// Simple retrieval, quick checks
mcp__claude_ai_Exa__web_fetch_exa({urls: ["[URL]"]})
```

### 3. WebSearch + Fetch
```javascript
// Find related content first
mcp__claude_ai_Exa__web_search_exa({query: "[topic] [URL]"})
// Then fetch specific URLs
```

### 4. YouTube Transcript
```javascript
// For YouTube videos - get transcript
// Use Whisper or transcript service
```

---

## Output Formats

### Markdown
Clean markdown extracted from page

### Structured JSON
```json
{
  "title": "Page Title",
  "url": "https://...",
  "content": "Clean text content",
  "metadata": {
    "author": "...",
    "date": "...",
    "platform": "..."
  }
}
```

### Summary
Brief summary (100-200 words) of content

---

## Use Cases

1. **Quick Research**: Check what's on a page before diving deep
2. **Tool Evaluation**: Extract tool documentation
3. **Content Backup**: Save content from URLs that may disappear
4. **Reference Retrieval**: Get exact content for quoting

---

## Integration

Works with:
- **compound-knowledge**: Feed extracted content for connection finding
- **os-self-improvement**: Analyze for OS improvement opportunities
- **learning-url-to-knowledge**: Use as first step before full pipeline

---

## Related Skills

- **learning-url-to-knowledge**: Full pipeline (8 deliverables)
- **compound-knowledge**: Connect extracted content
- **os-self-improvement**: Find improvement opportunities

---

## Changelog

| Version  | Date      | Changes      |
|---------|----------|-------------|
| v1.0     | 2026-05-22| Initial skill|

---

## ⚠️ Gotchas

### 1. Firecrawl Falla en SPAs con JavaScript Pesado

**Por qué**: Firecrawl extrae contenido del HTML estático de la página. Si el contenido se renderiza dinámicamente con JavaScript (React, Vue, Angular SPAs), Firecrawl puede devolver HTML vacío o incompleto.

**Solución**: Si Firecrawl devuelve poco contenido, prueba con WebFetch como alternativa. Para SPAs críticas, considera herramientas headless browser-based. Si el contenido es de documentación técnica, la mayoría de los sites estáticos (docs, blogs, MDN-style) se extraen bien.

### 2. WebFetch Tiene Rate Limiting por Dominio

**Por qué**: WebFetch (Exa) puede tener rate limits por dominio. Si haces múltiples fetch al mismo sitio en corto tiempo, puedes recibir respuestas 429 o vacías.

**Solución**: Espacia las requests al mismo dominio. Si necesitas extraer múltiples páginas del mismo sitio, considera Firecrawl que maneja mejor la rate limiting. Para extracciones masivas, usa los métodos paginados si están disponibles.

### 3. YouTube Transcript Requiere Servicio Especializado

**Por qué**: Ni Firecrawl ni WebFetch pueden extraer transcripciones de YouTube. El contenido del video no está en el HTML de la página — está en la API de YouTube o requiere Whisper/STT.

**Solución**: Para videos de YouTube, usa transcript service dedicado (YouTube Transcript API, Whisper, o herramientas de subtítulos). `content-from-url` para YouTube se limita a la metadata del video (título, descripción). Para análisis completo del contenido hablado, usa el pipeline `learning-url-to-knowledge` con soporte de transcript.

### 4. El Output es Efímero — No Hay Persistencia Automática

**Por qué**: `content-from-url` devuelve el contenido extraído en la conversación, pero no lo guarda automáticamente a disco ni a la base de conocimiento del OS.

**Solución**: Si el contenido es valioso, guárdalo manualmente o pásalo a `compound-knowledge` o `learning-url-to-knowledge` para persistencia. El comando es intencionalmente simple — la persistencia es tu responsabilidad.

## 💾 State Persistence

| Qué                        | Dónde                                   | Notas                     |
|---------------------------|----------------------------------------|--------------------------|
| Contenido extraído         | Efímero — solo en la conversación actual| No persiste entre sesiones|
| Cache de Firecrawl/WebFetch| Del lado del proveedor (no controlado)  | Sin acceso local al cache |
| URL de origen              | En la metadata del output               | Referencia, no contenido  |

Este skill es intencionalmente **stateless** — no guarda nada. Es un pipeline de extracción puro: URL → contenido limpio → output en chat. Para persistencia, usa los skills de integración (compound-knowledge, learning-url-to-knowledge).

---

**Status**: Ready to use

*Generated by Think Different PersonalOS v6.1 | Pure Green State*
