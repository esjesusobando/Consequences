# Wiki Layer (AI Research OS)

## Definition
Capa derivada del LLM que se construye sobre raw content + index. Evoluciona con cada pregunta, no solo con ingestiones.

## Components

### Sources
- Resúmenes ejecutivos expandidos de cada raw source
- Se computan una vez durante ingestión
- El agente las lee antes de acceder al raw completo

### Concepts
- Conceptos extraídos automáticamente del contenido
- Ejemplos: "agent loop", "context compaction", "sandboxing"
- Se conectan entre sí en el graph view

### Entities
- Entidades identificadas: herramientas, frameworks, personas
- Ejemplos: "OpenCode", "Claude Code", "MCP"
- Referenciadas en comparaciones y notes

### Comparisons
- Diferencias entre conceptos/entities
- Ejemplos: "Adaptive RAG vs File Systems", "Compaction vs Recursive LMs"
- Generadas automáticamente por el LLM

### Notes
- Derivadas de preguntas del usuario
- Cada pregunta deja traza en el wiki
- Evoluciona con el uso

### Open Questions
- Preguntas que el LLM no pudo responder
- Se acumulan como trabajo futuro
- Útil para identificar gaps de conocimiento

## Query Flow
```
User Question
    ↓
Index.yaml (metadata + resúmenes)
    ↓ (si no encuentra)
Source Wiki Page (resumen expandido)
    ↓ (si no encuentra)
Raw Source (contenido completo)
```

## Key Properties
- **Viva**: Evoluciona con cada pregunta
- **Immutable raw**: Raw content nunca se modifica
- **Token efficient**: Jerarquía de acceso
- **Inspectable**: Fácil de revisar en Obsidian
- **Conexiones**: Graph view muestra relaciones

## Source
- Video: Paul Iusztin & Louis-François Bouchard
- https://www.youtube.com/watch?v=ZRM_TfEZcIo

## Relacionado
- [[AI_Research_OS|AI Research OS]] - Sistema completo
- [[LLM_Wiki|LLM Wiki]] - Patrón base (Karpathy)
- [[RAG_vs_Wiki|RAG vs Wiki]] - Comparación de enfoques

---

*Created: 2026-08-02*
