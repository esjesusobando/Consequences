---
tags: [entity, tool, llm]
date: 2026-08-02
source_count: 1
status: active
---

# Claude

## Resumen
LLM de Anthropic. Herramienta recomendada por Karpathy para mantener el wiki en el patrón LLM Wiki.

## Características para LLM Wiki

### Fortalezas
- **Long context**: Puede leer múltiples páginas de una vez
- **Structured output**: Genera markdown consistente
- **Code execution**: Puede ejecutar scripts para lint
- **Tool use**: Puede usar herramientas externas

### Uso en LLM Wiki
- **Ingest**: Lee sources, crea/actualiza páginas
- **Query**: Busca páginas relevantes, sintetiza con citas
- **Lint**: Buscar contradicciones, orphans, gaps
- **Maintenance**: Actualiza index.md, log.md

## Configuración para Oband_Os

### Schema
- Schema file con reglas y workflows
- Define formato de páginas
- Especifica operaciones (ingest, query, lint)
- Co-evoluciona con el tiempo
- Ver: [[06  -  Process/02_Schema/CLAUDE.md|CLAUDE.md]]

### Skills
- `research`: Workflow completo de research
- `research-lint`: Health check del wiki
- `research-distill`: Extraer fuentes usadas
- `research-render`: Generar múltiples formatos

## Flujo de Trabajo

### Ingest
1. Usuario drop source en `00_Inbox/01_Raw/`
2. Claude lee el source
3. Discute takeaways con usuario
4. Crea/actualiza páginas en wiki
5. Actualiza `index.md`
6. Agrega entrada a `log.md`

### Query
1. Usuario hace pregunta
2. Claude lee `index.md`
3. Busca páginas relevantes
4. Sintetiza respuesta con citas
5. Si es valioso, guarda como nueva página

### Lint
1. Usuario pide health check
2. Claude busca contradicciones
3. Identifica claims obsoletos
4. Encuentra páginas huérfanas
5. Actualiza `index.md`
6. Registra en `log.md`

## Relacionado
- [[06  -  Process/01_LLM_Wiki/99_LLM_Wiki_Overview.md|LLM_Wiki]]
- [[06  -  Process/01_LLM_Wiki/99_Andrej_Karpathy.md|Andrej_Karpathy]]
- [[03  -  Resources/01_AI_Research_OS/wiki/entities/obsidian|Obsidian]]

## Fuentes
- [[../../00_Inbox/01_Raw/Karpathy_LLM_Wiki_Gist|Karpathy LLM Wiki Gist]] (2026-08-02)

---
*Última actualización: 2026-08-02*
