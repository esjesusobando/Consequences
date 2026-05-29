---
name: video-visuals-producer
description: Producer for high-quality video assets, scripts, and visual presentations. Use when the user requests help with video content creation, YouTube scripts, social media assets, or dynamic presentations using Remotion or PPTX.
---

# Video Visuals Producer 🎬

## Esencia Original
> **Propósito:** Producir activos de video programáticos usando Remotion y PPTX
> **Flujo:** Definir estilo → Crear guión → Generar video → Exportar assets


Esta Skill transforma conceptos técnicos y estratégicos en narrativas visuales de alto impacto. Diseñada para creadores de contenido y ejecutivos que buscan el estándar de calidad de Silicon Valley en sus presentaciones de video.

## 🛠️ Triggers y Uso
- **Guiones de Video**: Estructuración de narrativa (Hook, Value, CTA).
- **Assets para Remotion**: Creación de archivos de configuración y lógica para videos programáticos.
- **Presentaciones Dinámicas**: Diseño de slides y transiciones (integración con `PPTX Generator`).
- **Storytelling Visual**: Recomendación de metáforas visuales y paletas de colores.

## ⚙️ Integración con Ecosistema
- **Remotion**: Usa las habilidades `Remotion Video Creator` y `Remotion Best Practices`.
- **Assets**: Se apoya en `Managing Image Assets` para la organización de recursos.
- **Branding**: Aplica `Brand Identity` y `Brand Voice Generator`.

## 🚀 Workflow Elite
1. **Scripting**: Redacción del guion siguiendo el tono de marca.
2. **Visual Mapping**: Definición de los elementos visuales por cada sección del video.
3. **Producción de Assets**: Generación de imágenes (DALL-E/Midjourney via AI Studio) y esquemas (Canvas Diagram).
4. **Ensamblado**: Guía para la ejecución de comandos de renderizado y validación de calidad.
---

## ⚠️ Gotchas

1. **Remotion renders failing silently due to missing assets**
   - **Why**: Remotion projects often reference local assets (fonts, images, audio) that exist in dev but fail in render context, producing a corrupted or empty video without clear error messaging.
   - **Solution**: Always run `npx remotion validate` on the composition before full render. For each asset reference, use absolute imports and verify the file exists at build time.

2. **Assets in wrong format for programmatic PPTX use**
   - **Why**: PPTX Generator expects specific image formats (PNG, JPEG) and aspect ratios. Providing SVGs, WebP, or mis-sized images breaks the slide layout without visible warnings.
   - **Solution**: Normalize all output assets to PNG at the target slide resolution before passing to PPTX. Include a "format manifest" in the output stating exact dimensions and format of each asset.

3. **PPTX integration breaks on slide count limits**
   - **Why**: When producing presentation visuals, the skill may generate more slides/transitions than PPTX Generator can handle (performance cliff around 50+ slides with heavy transitions).
   - **Solution**: Set a hard limit of 40 slides per presentation in the visual mapping phase. For larger presentations, split into multiple PPTX files and link them via table of contents.

## 💾 State Persistence

This skill is stateless. Each invocation generates a visual production plan based purely on the script and brand inputs. Remotion projects and PPTX files are output artifacts managed externally. For multi-session projects (e.g., a video series), the orchestrator must track which assets and templates have been produced.

---

*"El video es el formato supremo de comunicación; haz que cada frame cuente."*
