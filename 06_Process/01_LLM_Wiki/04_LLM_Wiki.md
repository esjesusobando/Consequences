---
tags: [concept, knowledge-base, pattern]
date: 2026-08-02
source_count: 1
status: active
---

# LLM Wiki

## Resumen
Un patrón para construir bases de conocimiento personales usando LLMs donde el wiki es un artifacto persistente que compila conocimiento con cada fuente y pregunta.

## Definición
El LLM Wiki es un directorio de archivos markdown generado por LLM que:
- Se construye incrementalmente con cada source
- Mantiene cross-references automáticamente
- Flaggea contradicciones
- Compila síntesis que refleja todo lo leído
- Crece con cada source y pregunta

## Arquitectura

### Tres Capas
1. **Fuentes RAW** - Documentos inmutables (solo lectura para LLM)
2. **Wiki** - Markdown generado por LLM (solo LLM escribe)
3. **Schema** - CLAUDE.md con reglas y workflows

### Operaciones
- **Ingest**: LLM lee source, crea/actualiza páginas wiki
- **Query**: Preguntas contra wiki, LLM sintetiza con citas
- **Lint**: Mantener salud del wiki (contradicciones, orphans, gaps)

## Diferencia con RAG

| Aspecto | RAG | LLM Wiki |
|---------|-----|----------|
| Knowledge | Rediscovered each query | Compiled once, kept current |
| Cross-references | No | Yes, maintained by LLM |
| Contradictions | Not flagged | Flagged automatically |
| Synthesis | Ad-hoc per query | Persistent, evolving |
| Maintenance | Manual or none | Automated by LLM |

## Beneficios
- Knowledge compounds over time
- Cross-references already there
- Contradictions already flagged
- Synthesis reflects everything read
- Maintenance cost near zero

## Uso en Oband_Os
- Fuentes en `00_Inbox/01_Raw/`
- Wiki en `02_Process/01_LLM_Wiki/`
- Schema en `02_Process/02_Schema/CLAUDE.md`
- Index en `index.md`
- Log en `log.md`

## Relacionado
- [[Andrej_Karpathy|Andrej Karpathy]] - Creator
- [[RAG_vs_Wiki|RAG vs Wiki]]
- [[Obsidian|Obsidian]]
- [[../../00_Inbox/01_Raw/Karpathy_LLM_Wiki_Gist|Source]]

## Fuentes
- [[../../00_Inbox/01_Raw/Karpathy_LLM_Wiki_Gist|Karpathy LLM Wiki Gist]] (2026-08-02)

---
*Última actualización: 2026-08-02*
