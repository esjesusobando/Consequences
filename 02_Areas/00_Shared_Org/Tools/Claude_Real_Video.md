---
tags: [tool, video, llm, skill]
date: 2026-09-20
source: https://github.com/HUANGCHIHHUNGLeo/claude-real-video
status: active
---

# Claude Real Video (crv)

## Resumen

Herramienta MIT que permite a cualquier LLM **ver** el contenido visual de un video. Extrae keyframes con detección de escenas (no muestreo fijo) + transcripción Whisper, todo local.

## Qué hace diferente

| Aspecto | Muestreo fijo (1fps típico) | claude-real-video |
|---------|------------------------------|-------------------|
| Selección de frames | Cada N segundos | **Detección de cambios de escena** + dedup |
| Shots repetidos (A-B-A) | Se envían cada vez | **Sliding window dedup** - cada shot una vez |
| Slide estática (10 min) | ~600 frames idénticos | **Colapsa a 1** |
| Fast-cut reel | Pierde frames entre muestras | **Captura cada cambio visual** |
| Audio | A menudo ignorado | Whisper transcript + detección de idioma |
| Procesamiento | Cloud | **100% local** |
| Input | Solo archivos locales | **URL (yt-dlp) o archivo local** |

## Instalación

```bash
pip install "claude-real-video[whisper]"   # frames + dedup + transcripción
pip install "claude-real-video[fast]"      # faster-whisper (recomendado, más rápido)
pip install "claude-real-video[mlx]"       # GPU Apple Silicon (M1-M4)
```

### Requisitos del sistema

```bash
# ffmpeg (Windows)
winget install Gyan.FFmpeg
# o
choco install ffmpeg
```

## Uso CLI

```bash
# YouTube/Instagram/TikTok link
crv "https://www.youtube.com/watch?v=..."

# Archivo local, transcript en inglés
crv lecture.mp4 -o out --lang en

# Solo frames, sin transcripción
crv clip.mp4 --no-transcribe

# Con grid de contact sheets
crv video.mp4 --grid

# Con viewer interactivo
crv video.mp4 --viewer
```

### Flags importantes

| Flag | Default | Descripción |
|------|---------|-------------|
| `--from` / `--to` | todo | Analizar solo parte del video |
| `--scene` | 0.30 | Sensibilidad a cambio de escena |
| `--max-frames` | auto (150-600) | Cap máximo de frames |
| `--frame-width` | 640 | Ancho de frames extraídos |
| `--adaptive` | off | Captura morphs lentos (2-3s) |
| `--grid` | off | Contact sheets 3x3 |
| `--viewer` | off | HTML interactivo local |
| `--why` | - | Contexto de análisis |
| `--kb` | - | Guardar en knowledge base |

## MCP Server

```bash
pip install "claude-real-video[mcp]"
claude mcp add crv -- crv-mcp
```

Herramientas MCP: `watch_video`, `get_frames`, `search_memory`, `list_watched`, `get_transcript`

## crv Pro ($29)

Versión de pago con:
- **`--motion`**: Análisis de cámara y ritmo (pan, tilt, zoom, handheld)
- **`--senses`**: Emoción vocal, eventos de audio, BPM
- **`--breakdown`**: Reporte completo de producción
- **`crv-pro-ask`**: Búsqueda por cámara/emoción en toda la librería

## Relación con Video_Intel

| Aspecto | Video_Intel | Claude Real Video |
|---------|-------------|-------------------|
| **Propósito** | Extraer conocimiento/metodologías | Dar "ojos" al LLM |
| **Input** | YouTube URLs | Cualquier video/URL |
| **Output** | Plan de implementación | Keyframes + transcript |
| **Uso principal** | "¿Qué enseña este video?" | "¿Qué se ve en este video?" |
| **Complemento** | ✅ Se complementan | ✅ Comparten Whisper |

**Integración sugerida**: Video_Intel llama a crv para obtener frames → más contexto visual en los planes de implementación.

## Instalación en OS

**Skill path**: `01_Personal_Os/01_Core/02_Tools/02_Skills/03_Video_Media/02_Claude_Real_Video/`

**Trigger**: "ver video", "analizar frames", "keyframes", "crv", "watch video"

## Fuentes

- [GitHub](https://github.com/HUANGCHIHHUNGLeo/claude-real-video)
- [crv Pro](https://leoaido.com/crv-pro/)
- [PyPI](https://pypi.org/project/claude-real-video/)

---
*Última actualización: 2026-09-20*