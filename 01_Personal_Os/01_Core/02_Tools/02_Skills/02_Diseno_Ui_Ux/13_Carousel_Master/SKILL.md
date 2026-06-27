---
name: carousel-master
description: "Automatización total de carruseles de Instagram/LinkedIn. Storytelling, diseño y previsualización. Triggers: carousel, carrusel, crear post carousel, carousel automation."
version: 1.0.0
sota_upgraded: true
---

# 🎨 Carousel Master Skill

## Esencia Original

> **Metaskill**: Sistema de generación automática de carruseles visuales con narrativa integrada para Instagram y LinkedIn.

Esta skill es el **motor de contenido visual** del PersonalOS. Crea carruseles persuasivos desde investigación hasta previsualización.

## 🚀 Triggers
- "carousel" / "carrusel"
- "crear carrusel sobre [TEMA]"
- "automatización de carruseles"

## 🛠️ Flujo Operativo (Algoritmo Narrativo)

1. **Investigación de Nicho**: El sistema debe buscar en el backlog de `02_Knowledge` o usar `search_web` para encontrar ganchos reales.
2. **Onboarding**: Preguntar por nombre, nicho y objetivo si no están definidos.
3. **Escritura (Copywriting)**: Generar el guion de 5 slides (Arco: Gancho -> Empatía -> Valor 1 -> Valor 2 -> CTA).
4. **Diseño (Visuals)**:
   - Definir una paleta de colores (ej: Vibe Coding Dark o Minimal Light).
   - Generar descripciones de imagen para `generate_image`.
5. **Previsualización**: Usar el `Preview_Generator.js` para mostrar el resultado final.

## 📐 Estándares de Diseño
- **Relación de aspecto**: 4:5 (1080x1350).
- **Tipografía**: Títulos masivos, cuerpo de texto ligero.
- **Storytelling**: Una idea por slide.

## 📦 Scripts Relacionados
- `01_Personal_Os/04_Operations/03_Scripts_Os/16_Carousel_Engine.py`: Lógica de generación.
- `01_Personal_Os/04_Operations/03_Scripts_Os/17_Preview_Generator.js`: Render interactivo.

---

## ⚠️ Gotchas

### ERROR 1: Copy sin estructura narrativa
- **Por qué**: Slides sin arco pierden engagement
- **Solución**: Always seguir: Gancho -> Empatía -> Valor 1 -> Valor 2 -> CTA

### ERROR 2: Imágenes no optimizadas para móvil
- **Por qué**: Lo que se ve bien en desktop pixelpea en móvil
- **Solución**: Testear siempre en resolución 1080x1350 (4:5)

### ERROR 3: No investigar el nicho primero
- **Por qué**: Contenido genérico no convierte
- **Solución**: Buscar en backlog o web antes de generar

---

*Skill Version: 2.0*
*Framework: Anthropic Skill Creator v2.0 + PersonalOS SOTA v5.1*
*Last Updated: 2026-04-20*

---

*PersonalOS Module | Growth Engineering 2026*


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
