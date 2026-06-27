---
description: Pipeline de marketing que convierte 1 audio en 5 piezas de contenido publicadas en piloto automático. Basado en el sistema de Lorena Bordonaba adaptado para Think Different OS.
trigger: "audio a contenido", "1 audio 5 piezas", "audio linkedin newsletter", "marketing automation", "audio content pipeline"
agent: Marketing Tech
category: content-creation
subcategory: audio-pipeline
tags: [audio, marketing, linkedin, newsletter, automation, agents, mcp]
version: 1.0.0
created: 2026-06-09
owner: Sebas / Gentleman Programming
status: active
sota_upgraded: true
---

# 🎙️ Audio Pipeline — 1 Audio → 5 Piezas

Pipeline de contenido que parte de un audio y genera:
- **3 LinkedIn Posts** (adaptados a formato y audiencia)
- **1 Twitter/Thread** (quick insights)
- **1 Newsletter** (formato epistolar)
- **1 Carousel** (imágenes generadas con AI)
- **Analítica** ( Métricas de rendimiento)

Todo programado y publicado en piloto automático.

---

## Arquitectura del Pipeline

```
[AUDIO] → Whisper (transcripción local)
              ↓
         [TRANSCRIPCIÓN]
              ↓
         CLAUDE.md (contexto proyecto)
              ↓
    ┌──────────────────────────────────┐
    │         PHASE 2: TEXTO           │
    │  → 3 LinkedIn posts             │
    │  → 1 Twitter thread             │
    │  → 1 Newsletter                 │
    └──────────────────────────────────┘
              ↓
    ┌──────────────────────────────────┐
    │        PHASE 3: VISUAL          │
    │  → Imágenes (Higgsfield MCP)    │
    │  → Carousel                     │
    │  → Programar (Metricool MCP)    │
    └──────────────────────────────────┘
              ↓
         ANALYTICS
              ↓
         FEEDBACK LOOP
```

---

## Patrones v2.0 (Learning Always)

### Review Gate Pattern
Nunca publicar contenido sin aprobación de un revisor dedicado:

```
Contenido → Agente Revisor → JSON {aprobado_global: bool}
  → true: continuar pipeline
  → false: detener, reportar qué piezas fallaron
```

El revisor evalúa contra **brand_voice.md** y devuelve aprobación estructurada por pieza.

### Brand Voice + Brand Design
- `brand_voice.md` → fuente de verdad para tono/texto (agentes de texto)
- `brand_design.md` → fuente de verdad para visual (agentes visuales)
- Separación de concerns: cada agente carga solo el contexto que necesita

### MCP como Tool Attachment
Los MCPs se asignan por agente, no globalmente:
- `publicador` → Metricool MCP
- `carrusel-designer` → Higgsfield MCP
- Configurar en `.mcp.json` + referencia en el agente `.md`

---

## Herramientas Requeridas

| Herramienta | Uso | Config |
|---|---|---|
| **Whisper** | Transcripción audio→texto (local) | `pip install faster-whisper` |
| **Higgsfield MCP** | Generación imágenes AI | OAuth en .mcp.json (asignar solo a agente visual) |
| **Metricool MCP** | Programar posts + analytics | OAuth en .mcp.json (asignar solo a agente publicador) |
| **Sequential Thinking** | Razonamiento paso a paso | `.mcp.json` |
| **Brand Voice** | Contexto de marca | `.agent/01_Agents/04_Contexto/03_Contexto/02_tono-de-voz.md` |
| **Brand Design** | Contexto visual | Archivo separado para agentes visuales |

---

## Archivos del Proyecto

```
audio-pipeline/
├── CLAUDE.md              # Contexto del proyecto ( obligatorio)
├── .mcp.json              # Configuración MCPs
├── brand-voice.md        # Tono de voz (del OS)
├── tools/
│   └── transcribe.py     # Script Whisper
├── agents/
│   ├── 01_transcriber.md
│   ├── 02_text_specialist.md
│   ├── 03_visual_creator.md
│   └── 04_scheduler.md
├── analytics/
│   └── report.md
└── output/
    ├── linkedin/
    ├── twitter/
    ├── newsletter/
    └── carousel/
```

---

## Ejecución Rápida

### Paso 1: Transcribir Audio

```bash
python tools/transcribe.py "path/to/audio.m4a"
```

### Paso 2: Generar Contenido

```bash
# En terminal con Claude Code:
@agents/02_text_specialist.md
# Pegar transcripción → obtener posts
```

### Paso 3: Crear Visual

```bash
# Generar imágenes con Higgsfield
/mcp higgsfield generate --prompt "..."
```

### Paso 4: Programar

```bash
# Programar con Metricool
/mcp metricool schedule --platform linkedin --content "..."
```

---

## Agents (Sub-Agentes)

### 01_transcriber.md
- Recibe: Audio file path
- Ejecuta: Whisper transcription
- Entrega: `transcripcion.md`

### 02_text_specialist.md
- Recibe: `transcripcion.md` + `brand-voice.md` + `CLAUDE.md`
- Ejecuta: Genera 3 LinkedIn + 1 Twitter + 1 Newsletter
- Entrega: Archivos en `output/linkedin/`, `output/twitter/`, `output/newsletter/`

### 03_visual_creator.md
- Recibe: Contenido de Phase 2
- Ejecuta: Genera imágenes con Higgsfield,arma carousel
- Entrega: `output/carousel/` + imágenes

### 04_scheduler.md
- Recibe: Todo el contenido de Phase 2 y 3
- Ejecuta: Programa en Metricool
- Entrega: `analytics/report.md` con URLs programadas

---

## Métricas de Éxito

| KPI | Meta |
|---|---|
| LinkedIn Impressions | >5K por post |
| Newsletter Open Rate | >45% |
| Carousel Saves | >100 |
| Engagement Rate | >3% |

---

## Resources

- Brand Voice: `.agent/01_Agents/04_Contexto/03_Contexto/02_tono-de-voz.md`
- Estrategia: `.agent/01_Agents/04_Contexto/03_Contexto/00_estrategia.md`
- Colores: `.agent/01_Agents/05_Marca/04_Marca/00_colores.md`
- Plantillas: `.agent/01_Agents/06_Plantillas/05_Plantillas/`

---

*Sistema activo — Actualizar basándose en analytics y learnings*

---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
