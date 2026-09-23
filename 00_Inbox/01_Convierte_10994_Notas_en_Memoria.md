# Convierte 10,994 notas en memoria - Paul Iusztin & Louis-François Bouchard

**Source:** https://www.youtube.com/watch?v=ZRM_TfEZcIo
**Clipped:** 2026-08-02
**Duration:** ~38 minutes
**Tags:** #second-brain #obsidian #research #memory #ai-engineering

---

## Summary

Paul Iusztin (Decoding AI) y Louis-François Bouchard (Towards AI) presentan cómo construir un "AI Research OS" para convertir tu second brain en una memoria de investigación viva. Tienen 5,000+ notas en Obsidian y 5,000+ en Readwise, y necesitaban un sistema para extraer información de alta señal de todo ese ruido.

## Key Insights

### El Problema
- **Reading list = cementerio**: Guardas cosas pero nunca las encuentras cuando las necesitas
- **El contexto se pierde**: Cuando paras una conversación con Codex/ChatGPT, todo se pierde
- **No es el bottleneck de contexto**: El bottleneck es cómo aprovechar la información en el futuro

### La Solución: AI Research OS (3 capas)

1. **Raw Content** (archivos inmutables)
   - Fuentes crudas de Obsidian, Readwise, NotebookLM, GitHub, YouTube, etc.
   - Nunca se modifican

2. **Index** (index.yaml)
   - Catálogo de todas las fuentes con metadata
   - Resúmenes ejecutivos de cada fuente
   - Puntos de referencia para el agente

3. **Wiki Layer** (derivados del LLM)
   - **Sources**: Resúmenes ejecutivos expandidos
   - **Concepts**: Conceptos extraídos automáticamente
   - **Entities**: Entidades (herramientas, frameworks, etc.)
   - **Comparisons**: Comparaciones entre conceptos
   - **Notes**: Notas derivadas de preguntas
   - **Open Questions**: Preguntas que el LLM no pudo responder

### Cómo Funciona

1. **Deep Research Algorithm**:
   - Input: Topic + fuentes del second brain
   - Orquestador genera preguntas por round (3-6 queries/round)
   - Cada agente busca en fuentes propias + web pública
   - Ranking por relevancia vs topic inicial
   - Compilación en research MD o wiki

2. **Query al Wiki**:
   - Agente lee index.yaml (resúmenes + metadata)
   - Si no encuentra → lee source wiki page (resumen expandido)
   - Si no encuentra → lee raw source completo
   - Jerarquía = eficiencia de tokens

3. **Wiki Viva**:
   - Cada pregunta deja traza en el wiki
   - Evoluciona con tus preguntas, no solo con ingestiones
   - Nunca se congela

### Stack Recomendado
- **Obsidian**: Reader de notas (local, multiplataforma)
- **Readwise**: Highlights de redes sociales/artículos
- **NotebookLM**: Research profundo
- **GitHub repos**: Código fuente
- **Claude Code / Codex**: Harness para agentes

### Niveles de Research
- **Light**: 1 round, 3 queries
- **Fast**: 2 rounds, 3 queries cada uno
- **Deep**: Múltiples rounds (consume más tokens)

### Frase Clave
> "El contexto se convierte en todo: la base de datos, el sistema de archivos, la memoria, el espacio de razonamiento. Cuando paras la conversación, pierdes todo."

### Repo
- AI Research OS Workshop: https://github.com/Pauliusztin/ai-research-os-workshop

---

## Notes

- El sistema no usa vector databases ni knowledge graphs para el wiki personal
- Todo es basado en archivos markdown + index.yaml
- La wiki se integra con Obsidian (graph view para visualizar conexiones)
- Puedes ingestar repos de GitHub completos y crear comparaciones de arquitectura
- El wiki evoluciona con cada pregunta que haces

---

*Transcript source: YouTube auto-generated*
