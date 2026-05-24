---
name: learning-always
description: >
  Metodología LEARNING ALWAYS — Knowledge Compounding Workflow. Transforma cualquier URL en conocimiento estructurado.
  Activa cuando: "/Learning [URL]", "/LA [URL]", "aprendé de esto", "investigá esta URL", "extraé el conocimiento".
---

# 📚 LEARNING ALWAYS — Knowledge Compounding Workflow

## Concepto

Transformar cualquier contenido (YouTube, artículos, docs) en conocimiento estructurado, contexto para el OS, y contenido ready-to-use. 8x ROI por cada input.

## Principios

1. **Input agnostic** — Cualquier URL → mismo pipeline
2. **Output compounding** — 8 deliverable por URL
3. **Multiperspectiva** — Mismo contenido × 7 perfiles de agente
4. **Automejora** — Cada URL mejora el OS

## 8 Deliverables

1. **Resumen estructurado** — Notas organizadas
2. **Contexto para el OS** — Integración a Engram
3. **Contenido para redes** — Listo para publicar
4. **Prompts reutilizables** — Para GEMs/GPTs
5. **Ingeniería inversa** — Pattern del contenido original
6. **Action items** — Tareas derivadas
7. **Referencias cruzadas** — Links a conocimiento existente
8. **Second brain entry** — Información estructurada reusable

## Runbook

### Trigger
```bash
/Learning [URL]
/LA [URL]
```

### PHASE 1: Fetch & Research

#### Step 1.1: Detectar tipo de URL
```
- YouTube video → Step 1.2
- Articulo/Blog → Step 1.3
- Otro → Firecrawl o webfetch
```

#### Step 1.2: YouTube → Exa Web Search
```bash
# Buscar info del video
-usar Exa MCP o websearch
```

#### Step 1.3: Fetch contenido
```bash
# Usar tool apropiada según tipo
webfetch, firecrawl, transcribir video
```

### PHASE 2: Análisis Multi-Agente

Ejecutar 7 perfiles en paralelo:
1. **Researcher** — Datos y facts
2. **Analyst** — Patrones y conexiones
3. **Writer** — Contenido para redes
4. **Teacher** — Explicación simple
5. **Prompter** — Prompts reutilizables
6. **Architect** — Integración OS
7. **Critic** — Gap analysis

### PHASE 3: Compounding

1. Guardar en Engram
2. Crear entry en Knowledge
3. Generar thread de LinkedIn/Twitter
4. Crear prompts para GPT/GEM
5. Identificar action items → BACKLOG

## Estándares

- **Naming**: `[fecha]_Learning_[tema].md`
- **Ubicación**: `02_Knowledge/01_Research_Os/`
- **Tags**: `learning, [tema], [tipo_contenido]`
- **Metadata**: URL, fecha, duracion (si video), source

## Integración

- **Engram**: Persistencia de conocimiento
- **Knowledge Base**: Archivo estructurado
- **BACKLOG**: Action items derivados
- **Social Hub**: Contenido para publicar

---

*Skill Learning Always — v1.0 | Activated 2026-04-18*
