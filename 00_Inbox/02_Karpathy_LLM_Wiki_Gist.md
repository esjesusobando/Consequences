---
tags: [source, article, gist]
date: 2026-08-02
url: https://gist.github.com/karpathy/...
type: idea-file
---

# Andrej Karpathy's Gist Prompt for Obsidian

## Resumen
Un patrón para construir bases de conocimiento personales usando LLMs. En lugar de RAG (retrieval-augmented generation) que rediscovering knowledge from scratch en cada pregunta, el LLM construye y mantiene un wiki persistente — una colección estructurada e interconectada de archivos markdown que está entre tú y las fuentes crudas.

## Idea Central
- **Wiki como artifacto persistente**: Las cross-references ya están ahí. Las contradicciones ya han sido flagged. La síntesis ya refleja todo lo que has leído.
- **El wiki crece con cada fuente**: Cada source que agregas y cada pregunta que haces enriquece el wiki.
- **Tú diriges, el LLM ejecuta**: Tu trabajo es curar fuentes, dirigir el análisis, hacer buenas preguntas. El LLM hace todo lo demás.

## Arquitectura de Tres Capas

### 1. Fuentes RAW
- Colección curada de documentos fuente
- Artículos, papers, imágenes, archivos de datos
- **Inmutables**: El LLM lee pero nunca modifica
- Source of truth

### 2. El Wiki
- Directorio de archivos markdown generados por LLM
- Resúmenes, páginas de entidades, páginas de conceptos, comparaciones, overview, síntesis
- **El LLM es dueño**: Crea páginas, las actualiza, mantiene cross-references
- Tú lees; el LLM escribe

### 3. El Schema
- Documento CLAUDE.md o AGENTS.md
- Le dice al LLM cómo está estructurado el wiki
- Define workflows para ingest, queries, lint
- **Co-evoluciona** con el tiempo

## Operaciones Principales

### Ingest
1. Drop source en raw collection
2. LLM lee el source
3. Discute takeaways contigo
4. Actualiza páginas existentes o crea nuevas
5. Un source puede tocar 10-15 páginas

### Query
1. Preguntas contra el wiki
2. LLM busca páginas relevantes
3. Sintetiza respuesta con citas
4. Respuestas valiosas se guardan como nuevas páginas

### Lint
- Buscar contradicciones
- Claims obsoletos
- Páginas huérfanas
- Conceptos sin página propia
- Data gaps

## Archivos Especiales

### index.md
- Catálogo de contenido
- Organizado por categoría
- Actualizado en cada ingest
- Aproximadamente 100 sources, hundreds de páginas

### log.md
- Append-only record
- Formato: `## [YYYY-MM-DD] TYPE | Title`
- Parseable con unix tools

## Tips
- Obsidian Web Clipper para capturar artículos
- Download images localmente
- Graph view para ver conexiones
- Marp para presentaciones
- Dataview para queries
- Git para version history

## Por Qué Funciona
- El tedio de mantener un wiki es el bookkeeping
- Actualizar cross-references, mantener summaries, flagged contradictions
- Humanos abandonan wikis por el maintenance burden
- LLMs no se aburren, no olvidan updates, pueden tocar 15 archivos en un pass

## Relacionado
- [[02_Process/01_LLM_Wiki/LLM_Wiki|LLM Wiki]]
- [[02_Process/01_LLM_Wiki/RAG_vs_Wiki|RAG vs Wiki]]
- Steph Ango Method (page not yet created in vault)
