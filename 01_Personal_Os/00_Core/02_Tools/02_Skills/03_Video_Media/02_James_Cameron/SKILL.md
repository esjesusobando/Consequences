---
name: james-cameron-video
description: "Producción de video y animación con IA. Triggers: video, animación, remotion, video generation, video prompt, seedance, browser animation, cards showcase."
version: 1.0.0
sota_upgraded: true
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


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
