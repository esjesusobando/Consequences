---
name: james-cameron-video
description: "Producción de video y animación con IA. Triggers: video, animación, remotion, video generation, video prompt, seedance, browser animation, cards showcase."
version: 1.0.0
---

# James Cameron — Skill Index

## Esencia Original

> **Metaskill**: Habilidad para crear producciones de video cinematográficas usando IA, combinando prompts efectivos con herramientas de animación (Remotion, Seedance).

Esta skill es el **estudio de producción visual** del PersonalOS. Permite crear videos, animaciones y contenido motion graphics con calidad cinematográfica.

## Descripción
Producción de video y animación con IA: prompts para video, animaciones Remotion (browser search, cards showcase, audio engine). Inspirado en la visión cinematográfica de James Cameron.

## Sub-Skills

| #                                | Skill                                                     | Descripción                                                                            |
|---------------------------------|----------------------------------------------------------|---------------------------------------------------------------------------------------|
| 01                               | `01_Video_Prompt_Builder`                                 | Constructor de prompts para video con IA (Seedance, etc.)                              |
| 02                               | `02_Remotion_Browser_Search`                              | Animación Remotion — secuencia de búsqueda en browser                                  |
| 03                               | `03_Remotion_Cards_Showcase`                              | Animación Remotion — showcase de cards de plataformas                                  |
| 04                               | `04_Remotion_Audio_Engine`                                | Motor de audio para animaciones Remotion                                               |

## Uso
Cargar la sub-skill según el tipo de producción de video. Ver CLAUDE.md para triggers específicos de cada skill.

---

## ⚠️ Gotchas

### ERROR 1: Prompts de video genéricos sin estructura
- **Por qué**: Prompts vagaos producen videos de baja calidad o genéricos
- **Solución**: Usar estructura: [estilo] + [sujeto] + [acción] + [cámara] + [iluminación]. Incluir referencias a cinematografía existente

### ERROR 2: Animaciones Remotion sin prerender
- **Por qué**: Render enTiempo real es lento y causa frame drops
- **Solución**: Usar prerender para assets pesados. Precompilar secuencias

### ERROR 3: No testeas en móvil
- **Por qué**: Lo que funciona en desktop falla en mobile (codecs, resolución)
- **Solución**: Testear siempre en múltiples devices. Usar formatos universales (MP4/H.264)

---

*Skill Version: 2.0*
*Framework: Anthropic Skill Creator v2.0 + PersonalOS SOTA v5.1*
*Last Updated: 2026-04-20*
