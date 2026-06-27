---
name: youtube-thumbnail-prompter
description: "Genera prompts de miniaturas de YouTube optimizados para herramientas de imagen AI. Triggers on: youtube thumbnails, AI image prompts, thumbnail optimization, click-worthy visuals, video cover design"
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
sota_upgraded: true
---

# Youtube Thumbnail Prompter

> Genera prompts optimizados para crear miniaturas de YouTube con AI.

## Esencia Original

- **Metaskill**: Traducir el título y guion de un video en prompts visuales ultra-detallados para generación de imagen AI (Midjourney, DALL-E, Flux), capturando el "momento clave" que maximiza el click.
- **Propósito original**: Cerrar el gap entre el contenido del video y su representación visual — una miniatura engañosa daña la retención, pero una miniatura precisa y llamativa multiplica el CTR sin romper la confianza del espectador.

## Propósito

Toma el título y el guion (o resumen) de un video y genera un prompt detallado y optimizado para herramientas de generación de imagen (Midjourney, DALL-E, Leonardo AI, Flux, etc.).

## Cuándo Usar

- Después de crear el guion (Agent 14) y los títulos (Agent 16)
- Para generar miniaturas llamativas y clickbait-étnico (sin ser falso)
- Necesitas enviar a una herramienta de AI image generation

## Input

- **Título del video**: El título principal o variante
- **Guion o resumen**: Para entender el contenido
- **Estilo de marca**: Colors, tipografía, mood
- **Plataforma target**: YouTube, Instagram, TikTok

## Proceso

1. **Analizar** título → extraer emotion keyword
2. **Identificar** el "momento clave" del video
3. **Construir** prompt con composición + lighting + style
4. **Añadir** elementos de marca (colors, fonts hints)
5. **Optimizar** para el modelo de AI específico

## Output

```markdown
## THUMBNAIL PROMPT

### Concepto Principal
[Descripción del concepto visual]

### Prompt (para AI)
```
[Prompt detallado optimizado para Flux/MJ/DALL-E]
```

### Elementos Visuales
- **Personaje**: [descripción]
- **Objeto central**: [qué destaca]
- **Texto (overlay)**: [qué dice - evitar en AI, añadir después]
- **Mood/Lighting**: [estilo]
- **Colores de marca**: [hex si aplica]

### Notas para Composición Final
- Posición del texto: [centro/derecha/izquierda]
- Tamaño del face: [grande/mediano]
- Estilo de typography: [sugerencia]

---

## VARIACIONES

### Variante 1: [Nombre]
[Prompt alternativo]

### Variante 2: [Nombre]
[Prompt alternativo]
```

## Ejemplo

**Input:** Título: "Cómo gané $10,000 con AI en 30 días"
**Output:** Prompt con cara de sorpresa + dinero/digitales + lighting dramático

---

## ⚠️ Gotchas

1. **Prompt de AI genera caras con expresiones grotescas**
   - **Por qué**: Los modelos de imagen AI (especialmente Flux y SD) tienden a generar expresiones faciales exageradas o uncanny valley cuando el prompt pide "sorpresa" o "emoción fuerte".
   - **Solución**: En prompts que incluyan rostros, añadir modificadores de naturalidad ("expresión natural, sin exageración", "retrato profesional") y especificar que la emoción sea sutil pero presente.

2. **Texto en imagen generado por AI es ilegible**
   - **Por qué**: Los modelos de imagen AI aún no manejan texto de forma confiable — cualquier overlay de texto en el prompt sale distorsionado, con errores ortográficos o simplemente ilegible.
   - **Solución**: Jamás incluir texto en el prompt de AI. El texto overlay debe añadirse en post-procesamiento (Canva, Photoshop, etc.). Incluir una nota de "text overlay" separada en el output.

3. **Estilo inconsciente entre miniaturas de la serie**
   - **Por qué**: Cada invocación del prompter genera un prompt desde cero, sin referencia a miniaturas anteriores del mismo canal, resultando en estilos visuales inconsistentes.
   - **Solución**: Exigir que el input incluya siempre "Brand Style Reference" (colores, tipografía, ejemplos de thumbnails previas) para mantener coherencia visual en toda la serie del canal.

## 💾 State Persistence

Esta skill es stateless. Cada invocación produce prompts de thumbnail independientes. No hay memoria de estilos previos usados por el canal. Para mantener consistencia visual, el orquestador debe pasar referencias de marca (colors, mood) en cada llamada.

---

*Agent 15 de Marketing Team*
*Anterior: 14_Youtube_Script_Writer*
*Siguiente: 16_Youtube_Title_Generator*


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
