---
tags: [concept, comparison, knowledge-base]
date: 2026-08-02
source_count: 1
status: active
---

# RAG vs Wiki

## Resumen
Comparación entre Retrieval-Augmented Generation (RAG) y el patrón LLM Wiki para bases de conocimiento personales.

## RAG (Retrieval-Augmented Generation)

### Cómo funciona
1. Upload de documentos a una colección
2. LLM retrieval de chunks relevantes en query time
3. Genera respuesta basada en chunks encontrados

### Problema
- **No hay acumulación**: El LLM rediscovering knowledge from scratch en cada pregunta
- **Cross-references no existen**: Cada pregunta es independiente
- **Contradicciones no flagged**: El LLM puede contradictarse entre queries
- **Synthesis es ad-hoc**: No se mantiene entre queries

### Ejemplos
- NotebookLM
- ChatGPT file uploads
- La mayoría de sistemas RAG

## LLM Wiki

### Cómo funciona
1. LLM lee source y lo integra al wiki existente
2. Actualiza páginas de entidades, conceptos, summaries
3. Mantiene cross-references automáticamente
4. Flaggea contradicciones

### Ventaja
- **Knowledge compiles once**: Se mantiene actualizado
- **Cross-references ya están ahí**: El LLM las mantiene
- **Contradictions flagged**: Automáticamente
- **Synthesis persistente**: Evoluciona con cada source

## Comparación Detallada

| Aspecto | RAG | LLM Wiki |
|---------|-----|----------|
| Knowledge discovery | Each query | Compiled once |
| Cross-references | Manual or none | Automated |
| Contradictions | Not detected | Flagged |
| Synthesis | Ad-hoc | Persistent |
| Maintenance | Manual | Automated by LLM |
| Compounding | No | Yes |
| Cost over time | High (re-retrieval) | Low (compiled) |

## Cuándo usar cada uno

### RAG es mejor para:
- Documentos que cambian frecuentemente
- Queries simples de fact retrieval
- Cuando no necesitas synthesis

### LLM Wiki es mejor para:
- Knowledge que acumula con el tiempo
- Cuando necesitas cross-references
- Para contradiction detection
- Para synthesis persistente
- Para personal knowledge bases

## En Oband_Os
- Usamos **LLM Wiki** para el second brain
- Fuentes en `00_Inbox/01_Raw/`
- Wiki en `06_Process/01_LLM_Wiki/`
- Schema en `06  -  Process/02_Schema/CLAUDE.md`

## Relacionado
- [[06  -  Process/01_LLM_Wiki/99_LLM_Wiki_Overview.md|LLM_Wiki]]
- [[06  -  Process/01_LLM_Wiki/99_Andrej_Karpathy.md|Andrej_Karpathy]]
- [[03  -  Resources/01_AI_Research_OS/wiki/entities/obsidian|Obsidian]]

## Fuentes
- [[../../00_Inbox/01_Raw/Karpathy_LLM_Wiki_Gist|Karpathy LLM Wiki Gist]] (2026-08-02)

---
*Última actualización: 2026-08-02*
