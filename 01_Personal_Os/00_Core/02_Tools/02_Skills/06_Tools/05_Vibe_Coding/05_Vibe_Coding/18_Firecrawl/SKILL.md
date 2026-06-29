---
name: firecrawl
description: > Triggers on: 17_Firecrawl, firecrawl, scraping, web crawl, scrape.
  Firecrawl patterns - AI-first web scraping and crawling.
  Trigger: When scraping websites, crawling sites, extracting web content.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
sota_upgraded: true
---

# 🕷️ Firecrawl Intelligence

## Overview Triggers on: 18_Firecrawl, patterns, coding.

Esta Skill otorga al sistema la capacidad de "ver" y "digerir" la web completa. Firecrawl permite realizar scraping profundo, convirtiendo cualquier URL en un formato Markdown estructurado, ideal para procesos de RAG y análisis de datos.

## 🚀 Capacidades

- **Crawl Automático**: Escanea sitios completos y extrae contenido relevante.
- **Formato Markdown**: Limpia el ruido visual (anuncios, menús) para dejar solo el conocimiento.
- **Integración con IA**: Optimizado para que los agentes analicen documentación y noticias en tiempo real.

## 🛠️ Herramientas Vinculadas

El motor de Firecrawl se encuentra en: `03_KNOWLEDGE/Resources/tools/firecrawl`.

### Ejecución

Usa el motor de Python en la carpeta de recursos para activar escaneos programados.

---

_Alineado con el Pilar 1: Motor AI-Prime (Herramientas Técnicas)_

## Esencia Original
> **Propósito:** Propósito del skill aquí
> **Flujo:** Pasos principales del flujo

## ⚠️ Gotchas (Errores Comunes a Evitar)

- **[ERROR]**: Rate limiting blocks requests
  - **Por qué**: Sitio objetivo tiene protección anti-bot
  - **Solución**: Usar proxy rotativo y delays entre requests

- **[ERROR]**: JavaScript content not loaded
  - **Por qué**: Sitio usa SPA/client-side rendering
  - **Solución**: Usar firecrawl con modo `javascript: true`

- **[ERROR]**: Partial content extracted
  - **Por qué**: Página carga contenido lazy
  - **Solución**: Usar `waitFor` option o esperar a que cargue

## 💾 State Persistence

Guardar en:
- `03_Knowledge/` — Documentación
- `05_Scripts/` — Estado activo


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
