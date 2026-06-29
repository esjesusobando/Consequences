---
name: content-generation
description: Assists in creating high-quality content based on established patterns. Triggers on: generate content, create article, write post, make media, content creation, generate post.
sota_upgraded: true
---

# Content Generation Skill

## Esencia Original
> **Propósito:** Asistir en crear contenido de alta calidad basado en patrones establecidos (artículos, posts, emails).
> **Flujo:** Identificar tipo → Seleccionar template → Generar contenido → Revisar y ajustar



## When to use this skill

- Writing blog posts, articles, or documentation.
- Drafting professional or personal emails.
- Creating social media content (LinkedIn, Twitter).
- Any task categorized as `content`, `writing`, or `marketing`.

## Workflow

1.  **Analyze Voice**: Read samples in `03_Knowledge/voice-samples/` and `voice-guide.md`.
2.  **Gather Context**: Read relevant documentation for the topic in `03_Knowledge/`.
3.  **Drafting**: Apply voice principles (short paragraphs, direct tone, avoid AI cliches).
4.  **Refine**: Present draft with options to adjust tone or structure.

## Instructions

- Avoid "throat-clearing" intros.
- Use the user's authentic voice, not generic AI style.
- Refer to `zinking-transform` skill for deep clarity.

## Resources

- [Workflow Example](../../05_Examples/workflows/content-generation.md)
- [Content Script](../../08_Workflow/18_Generacion_Contenido.py)

<!--
# Habilidad de Generación de Contenido

## Cuándo usar esta habilidad

- Al redactar correos electrónicos, artículos de blog o publicaciones en redes sociales.
- Cuando necesites que el agente imite tu estilo de escritura personal.

## Flujo de trabajo

1.  **Análisis de Voz**: Leer comunicaciones anteriores del usuario para capturar el tono, el vocabulario y el estilo.
2.  **Recopilación de Contexto**: Preguntar sobre el objetivo del contenido, la audiencia y los puntos clave.
3.  **Primer Borrador**: Generar un borrador inicial basado en el análisis de voz.
4.  **Iteración**: Refinar el contenido basándose en los comentarios del usuario.

## Instrucciones

- Evitar el lenguaje "robótico" o excesivamente formal a menos que se especifique lo contrario.
- Utilizar el "Guía de Voz" (si existe) como referencia principal.
- Mostrar, no solo contar; usar ejemplos específicos para ilustrar los puntos.
-->

## 💾 State Persistence

Guardar contenido en:
- `03_Knowledge/06_Writing/` — Artículos y posts generados
- `04_Docs/content/` — Contenido documentado

## ⚠️ Gotchas (Errores Comunes a Evitar)

> Common mistakes and edge cases to watch for when using this skill.

- **[ERROR]**: Add common error here
  - **Por qué**: Explanation of why it's an error
  - **Solución**: How to fix or avoid it


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
