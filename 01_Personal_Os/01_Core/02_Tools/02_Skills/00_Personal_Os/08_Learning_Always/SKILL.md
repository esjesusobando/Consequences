---
name: learning-always
description: >
  Metodología LEARNING ALWAYS — Knowledge Compounding Workflow. Transforma cualquier URL en conocimiento estructurado.
  Activa cuando: "/Learning [URL]", "/LA [URL]", "aprendé de esto", "investigá esta URL", "extraé el conocimiento".
  Triggers on: /Learning, /LA, aprendé de esto, investigá esta URL, extraé el conocimiento, knowledge compounding, URL research, aprendizaje
---

# 📚 LEARNING ALWAYS — Knowledge Compounding Workflow

## Esencia Original

Learning Always es el pipeline de compounding de conocimiento del Personal OS.
Toma cualquier URL (YouTube, artículos, documentación) y la transforma en 8
deliverables estructurados: resumen, contexto para Engram, contenido para redes,
prompts reutilizables, ingeniería inversa del patrón, action items, referencias
cruzadas y second brain entry. Opera con 7 perfiles de agente en paralelo
(Researcher, Analyst, Writer, Teacher, Prompter, Architect, Critic) para
maximizar el ROI de cada input. El principio rector: 8x retorno por cada URL
procesada.

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

## ⚠️ Gotchas (SOTA v5.1)

### 1. URL caída o inaccesible
- **Por qué**: El pipeline falla si la URL original no responde (paywall, 404, contenido eliminado). El usuario no siempre lo sabe cuando envía el link.
- **Solución**: Antes de iniciar el pipeline completo, hacer un health check del URL (responder en <3s, status 200). Si falla, informar al usuario y ofrecer alternativas (web archive, texto pegado manualmente).

### 2. YouTube sin transcripción disponible
- **Por qué**: No todos los videos de YouTube tienen transcripción (autogenerada desactivada, contenido muy corto, música sin voz).
- **Solución**: Detectar disponibilidad de captions antes de ejecutar los 7 perfiles. Si no hay transcripción, ofrecer resumen por búsqueda Exa o pedir al usuario un texto alternativo. No ejecutar agentes en paralelo contra datos vacíos.

### 3. 8 deliverables es ambicioso para contenido delgado
- **Por qué**: Un tweet o un short de 30 segundos no tiene suficiente sustancia para generar 8 outputs útiles. El pipeline sobreingenieriza contenido trivial.
- **Solución**: Detectar densidad del contenido antes de elegir el pipeline. Contenido <200 palabras o <2 minutos → pipeline ligero (resumen + action items + Engram). Solo pipeline completo para contenido >5 minutos o >1000 palabras.

### 4. Agentes en paralelo compiten por contexto compartido
- **Por qué**: Los 7 perfiles se ejecutan en paralelo y pueden escribir al mismo archivo o solaparse en referencias cruzadas, generando duplicados o contradicciones.
- **Solución**: Usar un namespace único por sesión (timestamp-based). Cada perfil escribe a su propio archivo. Un paso final de merge/dedup consolida los 7 outputs en los 8 deliverables finales.

## 💾 State Persistence

| State              | Almacenamiento                            | Persistencia         |
|--------------------|-------------------------------------------|----------------------|
| URL original       | Parámetro de invocación                   | Volátil              |
| Contenido fetchado | Archivo temporal `/tmp/`                  | Sesión (se limpia)   |
| Outputs parciales  | `[timestamp]_[perfil].md`                | Hasta merge          |
| Deliverables finales| `02_Knowledge/01_Research_Os/`           | Persistente          |
| Contexto Engram    | Engram (via mem_save)                     | Persistente          |
| Action items       | BACKLOG.md                                | Persistente          |

Los artifacts intermedios se limpian al finalizar. Solo persisten los deliverables finales,
el contexto en Engram, y los action items en el backlog.

---

*Skill Learning Always — v1.0 | Activated 2026-04-18 | SOTA v5.1*
