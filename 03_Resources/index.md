# 03_Resources — Índice Principal

Directorio principal de recursos, referencias y materiales de investigación.

## Estructura

| # | Carpeta | Descripción | Archivos |
|---|---------|-------------|----------|
| 01 | AI_Research_OS | Motor de investigación AI Research OS — Workshop Paul Iusztin | 46 archivos |
| 02 | Coding_Agent_Architectures | Arquitecturas de agentes de código | 19+ wiki pages |
| 03 | Custom_URLs | URLs personalizados | — |
| 04 | Deep_Research_Example | Ejemplo de investigación profunda | — |
| 05 | Playground | Espacio experimental de conocimiento | — |
| 06 | Migracion_Segundo_Cerebro | Plan de migración al segundo cerebro | — |
| 07 | From_Think_Different | 14 archivos migrados desde Think_Different | — |
| 08 | Graph_Engineering | Ingeniería de grafos de conocimiento | — |
| 09 | Platzi | 13 archivos (6 cursos + README) | — |
| 10 | Templates | 10 plantillas numeradas | — |
| 11 | Excalidraw | Diagramas y visualizaciones | — |
| 12 | README | Este README | — |

## AI_Research_OS — Contenido Reciente

`01_AI_Research_OS/` ahora incluye:
- **7 Skills instaladas** en `.claude/skills/`
  - `/research` — Orquestador principal (query, append, deep, init)
  - `/research:distill` — Extraer sources usados en research.md
  - `/research:lint` — Health check del wiki
  - `/research:render` — Visualización (Marp, charts, Canvas)
  - `/research:nlm` — NotebookLM integration
  - `/research:obsidian` — Obsidian CLI management
  - `/research:readwise` — Readwise highlights sync
- **3 capas de contenido:**
  - `raw/` — Fuentes inmutables (YouTube transcript, etc.)
  - `wiki/` — Síntesis LLM (sources, concepts, entities, comparisons)
  - `index.yaml` + `index.md` — Catálogo central
- **Ejemplos integrados del workshop:**
  - `example_1_deep_research/` — Deep research con agent harness
  - `example_3_ingest_links/` — Ingest de URLs custom (GraphRAG, agent memory)
- **Media:** Slides, diagramas y visualizaciones del workshop
- **Plan:** `INTEGRATION_PLAN.md` — Plan de integración de 6 fases

## Metadatos

- `index.yaml` — Configuración del índice de investigación
- `MIGRATION_NOTE.md` — Notas de migración del sistema

---
*Actualizado: 2026-09-23 | 22 commits | 1091 archivos en el vault*
