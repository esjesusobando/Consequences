---
name: video-media
description: >
  Área de VIDEO & MEDIA — Video Intel, James Cameron, Production.
  Skills para producción de video, transcripción, y análisis multimedia.
  Triggers on: video production, video intel, transcripción, multimedia, james cameron, youtube pipeline, análisis de video
sota_upgraded: true
---

# 🎥 VIDEO & MEDIA — Video Intel, James Cameron, Production

## Esencia Original

Video no es un formato más en el stack — es el que más contexto retiene y el que más trabajo cuesta producir bien. Este skill área no trata solo de editar video: trata de cerrar el ciclo investigación → guión → producción → thumbnail → publicación. El pipeline YouTube es el ejemplo perfecto: aprender de videos existentes (Learning Always + Video Intel) antes de escribir una sola línea de guión. James Cameron no es una referencia casual — es recordatorio de que la preproducción es donde se gana o pierde el video.

**Área Funcional:** 03_Video_Media
**Versión:** 1.0 | **Última actualización:** 2026-05-19

---

## Sub-áreas y Contenido

| Sub-área              | Descripción                       |
|----------------------|----------------------------------|
| `01_Video_Intel/`     | Inteligencia de video             |
| `02_James_Cameron/`   | Filosofía de preproducción extrema|
| `03_Higgsfield_Generate/` | Generación de imágenes/video con AI (Higgsfield) |
| `04_Higgsfield_Marketplace/` | Cards de producto para marketplaces |
| `05_Higgsfield_Product_Photoshoot/` | Fotos de producto profesionales con AI |
| `06_Higgsfield_Soul_ID/`  | Entrenamiento de identidad facial para gen consistente |

## Integración

- **Learning Always**: Para analizar videos de YouTube
- **Fireflies MCP**: Transcripción de reuniones
- **Exa**: Búsqueda de información de videos

## Pipeline YouTube

```
1. Learning Always → Investigar tema
2. Video Intel → Analizar videos similares
3. Content Creation → Generar script
4. Thumbnail Prompter → Generar thumbnail
5. Publicación → YouTube
```

## Estándares

### Metadata Video
```yaml
---
title: "[título]"
duration: "[mm:ss]"
topic: "[tema]"
platform: "YouTube"
date: "[YYYY-MM-DD]"
---
```

## ⚠️ Gotchas

### Transcripción sin estructura
> El output de transcripción es texto plano sin timestamps ni speaker diarization.

- **Por qué**: Fireflies MCP devuelve texto sin metadatos de tiempo. Sin timestamps, no se puede mapear el guión a segmentos de video, y sin speaker diarization no se distingue quién dijo qué.
- **Solución**: Configurar Fireflies para output con timestamps. Si no está disponible, post-procesar con script de segmentación por párrafos y estimar tiempos por longitud de texto.

### Investigación sin sincronización
> Learning Always investiga un tema pero Video Intel analiza otro.

- **Por qué**: Son skills independientes sin paso de contexto. Si el usuario no explicita que ambas deben trabajar sobre el mismo tema, cada una agarra un tema diferente.
- **Solución**: El pipeline YouTube debe inyectar el mismo `topic` en ambas skills. Usar formato `topic: [tema]` como parámetro compartido. Ninguna skill debe inferir el tema por sí sola.

### Thumbnail sin coherencia
> El thumbnail prompter genera imágenes que no reflejan el contenido del video.

- **Por qué**: Thumbnail prompter recibe el título pero no el script completo. Sin contexto del contenido, las miniaturas son clickbait que no se corresponde con lo que el usuario va a ver.
- **Solución**: Pasar al Thumbnail Prompter no solo el título, sino un resumen de 3 bullets del contenido del video. Así la miniatura refleja el contenido real.

## 💾 State Persistence

| Componente        | Persistencia | Mecanismo                                               |
|------------------|-------------|--------------------------------------------------------|
| Análisis de video | ✅ Archivo    | Outputs de Video Intel en `01_Video_Intel/`             |
| Transcripciones   | ✅ Archivo    | Almacenadas con metadata YAML (título, duración, tema)  |
| Pipeline YouTube  | ⚠️ Por sesión| Estado del pipeline en memoria — completar en una sesión|
| Metadata de videos| ✅ Archivo    | Formato YAML embebido en cada archivo de análisis       |

---

*Área Video & Media v1.0 — 2026-05-19*


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
