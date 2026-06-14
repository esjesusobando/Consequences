# Resumen — Sistema de Automatización de Marketing con Claude Code

## Visión General
Sistema de 3 fases que transforma un audio grabado en contenido publicado en múltiples plataformas, usando Claude Code como orquestador, agentes especializados como ejecutores, y MCPs como conectores a servicios externos.

## Fase 1: Audio → Texto
- Usa **Faster-Whisper** (local, 3GB, corre offline)
- Ventaja: No consume tokens de Claude en transcripción
- El script `transcribe.py` toma un `.mp3` / `.m4a` y produce transcripción limpia
- Se guarda en `output/` para las siguientes fases

## Fase 2: Texto → Contenido
- **Agente Redactor** (Sonnet) — Lee transcripción + brand_voice.md
  - Genera: 3 posts LinkedIn, 1 newsletter, 1 Twitter thread
  - Guarda en `output/linkedin/`, `output/newsletter/`
- **Agente Revisor** (Haiku) — Evalúa calidad contra brand_voice.md
  - Devuelve JSON con `aprobado_global: true/false`
  - Si no aprueba → muestra qué piezas fallaron y para
- **Agente Publicador** (Haiku) — Programa en Metricool solo si revisor aprobó
  - Usa Metricool MCP para programar posts
  - La newsletter se publica manualmente

## Fase 3: Contenido → Visual
- **Agente Carrusel-Designer** (Sonnet) — Lee brand_design.md
  - Usa Higgsfield MCP para generar imágenes con modelos (Soul, Nano Banana, etc.)
  - Produce carrusel de Instagram con slides
  - Se programa en Metricool como post de Instagram

## Arquitectura Técnica
```
Audio → Whisper (local) → Transcripción
  → Redactor (Sonnet) → Posts + Newsletter
  → Revisor (Haiku) → JSON approval gate
  → Publicador (Haiku + Metricool MCP) → Publicado
  → Carrusel-Designer (Sonnet + Higgsfield MCP) → Carrusel
```

## Patrones Clave
1. **Review Gate** — Nunca publicar sin aprobación de un revisor dedicado
2. **Brand Voice como fuente de verdad** — Archivo único que todos los agentes referencian
3. **MCP como tool attachment** — Agentes usan MCPs directamente para publicar/generar
4. **Pipeline orchestrator via skills** — Skills orquestan la secuencia multi-agente
5. **Procesamiento local** — Whisper corre local, ahorra tokens
6. **Brand Design** — Archivo separado para consistencia visual (paleta, tipografía, layout)
