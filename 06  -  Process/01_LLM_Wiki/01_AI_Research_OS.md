# AI Research OS

## Overview
Sistema de investigación personal que convierte un second brain en una memoria de investigación viva. Creado por Paul Iusztin (Decoding AI) y Louis-François Bouchard (Towards AI).

## Three-Layer Architecture

### 1. Raw Content
- Archivos inmutables de fuentes originales
- Obsidian, Readwise, NotebookLM, GitHub, YouTube
- Nunca se modifican después de la ingestión

### 2. Index Layer
- **index.yaml**: Catálogo central con metadata de cada fuente
- Resúmenes ejecutivos por fuente
- Puntos de referencia para el agente
- Entry point para queries

### 3. Wiki Layer (derivados LLM)
- **Sources**: Resúmenes ejecutivos expandidos
- **Concepts**: Conceptos extraídos automáticamente
- **Entities**: Herramientas, frameworks, personas
- **Comparisons**: Diferencias entre conceptos
- **Notes**: Derivadas de preguntas del usuario
- **Open Questions**: Lo que el LLM no pudo resolver

## Deep Research Algorithm

```
Topic → Orquestador → Queries → Fuentes (second brain + web) → Ranking → Wiki
```

### Niveles
- Light: 1 round, 3 queries
- Fast: 2 rounds, 3 queries
- Deep: Múltiples rounds

## Query Hierarchy (Token Efficiency)
1. Index.yaml (resúmenes + metadata)
2. Source wiki page (resumen expandido)
3. Raw source (contenido completo)

## Key Insight
> "El contexto se convierte en todo: base de datos, archivos, memoria, razonamiento. Cuando paras la conversación, pierdes todo."

## Stack
- Obsidian (reader local)
- Readwise (highlights)
- NotebookLM (research profundo)
- GitHub (código)
- Claude Code / Codex (harness)

## Source
- Video: https://www.youtube.com/watch?v=ZRM_TfEZcIo
- Repo: https://github.com/Pauliusztin/ai-research-os-workshop

## Relacionado
- [[06  -  Process/01_LLM_Wiki/11_Wiki_Layer.md|Wiki_Layer]] - Capa derivada del LLM
- [[06  -  Process/01_LLM_Wiki/99_LLM_Wiki_Overview.md|LLM_Wiki]] - Patrón base (Karpathy)
- [[06  -  Process/01_LLM_Wiki/08_Paul_Iusztin.md|Paul_Iusztin]] - Creador
- [[Louis-François_Bouchard|Louis-François Bouchard]] - Co-creador
- [[03  -  Resources/01_AI_Research_OS/wiki/entities/obsidian|Obsidian]] - Reader de notas
- [[06  -  Process/01_LLM_Wiki/10_Readwise.md|Readwise]] - Captura de highlights
- [[06  -  Process/01_LLM_Wiki/06_NotebookLM.md|NotebookLM]] - Research profundo

---

*Created: 2026-08-02*
