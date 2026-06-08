# Plan de Implementación: Carousel Master Skill

Este plan detalla la creación de un sistema de automatización de carruseles de alto impacto para PersonalOS v6.1, diseñado para funcionar exclusivamente en Claude sin herramientas externas (N8N/Make).

## Resumen del Proyecto

El sistema "Carousel Master" permitirá al usuario generar carruseles completos en formato storytelling (5 slides), incluyendo investigación de FAQ, guion, imágenes y previsualización interactiva, todo gestionado por un agente especializado.

## Componentes a Crear

---

### [Componente] Agente Estratega (Growth)

#### [NEW] [Carousel_Strategist.md](file:///c:/Users/sebas/Downloads/01%20Revisar/09%20Versiones/00%20Respaldo%20PC%20Sebas/01%20Github/personal-os/Think_Different/01_Core/04_Agents/03_Growth/Carousel_Strategist.md)
- Perfil: Experto en copywriting, psicología del consumidor y diseño visual.
- Misión: Realizar el onboarding, investigar el nicho, redactar las 5 slides y coordinar la generación de imágenes.

---

### [Componente] Habilidad de Sistema (Skill)

#### [NEW] [SKILL.md](file:///c:/Users/sebas/Downloads/01%20Revisar/09%20Versiones/00%20Respaldo%20PC%20Sebas/01%20Github/personal-os/Think_Different/01_Personal_Os/01_Core/02_Tools/02_Skills/28_Carousel_Master/SKILL.md)
- Define los disparadores (`carousel`, `crear carrusel`, `automatización carrusel`).
- Establece el flujo operativo SOTA (Investigación -> Storytelling -> Diseño -> Preview).

---

### [Componente] Motor de Generación y Previsualización

#### [NEW] [Carousel_Engine.py](file:///c:/Users/sebas/Downloads/01%20Revisar/09%20Versiones/00%20Respaldo%20PC%20Sebas/01%20Github/personal-os/Think_Different/03_Scripts_Os/16_Carousel_Engine.py)
- Script Python para:
  - Generar metadatos de las slides.
  - Generar imágenes vía `generate_image`.
  - Crear el paquete de publicación (descripción + hashtags).

#### [NEW] [Preview_Generator.js](file:///c:/Users/sebas/Downloads/01%20Revisar/09%20Versiones/00%20Respaldo%20PC%20Sebas/01%20Github/personal-os/Think_Different/03_Scripts_Os/17_Preview_Generator.js)
- Componente para renderizar un carrusel interactivo en el navegador del usuario a través de un artefacto HTML.

---

### [Componente] Documentación y Lanzamiento

#### [NEW] [Carousel_Step_by_Step.pdf](file:///c:/Users/sebas/Downloads/01%20Revisar/09%20Versiones/00%20Respaldo%20PC%20Sebas/01%20Github/personal-os/Think_Different/02_Knowledge/03_Writing_Content/Carousel_Step_by_Step.md)
- Documento guía (Markdown -> PDF) con instrucciones claras para el usuario final.

---

## Flujo de Trabajo (Arco Narrativo SOTA)

1. **Slide 1: El Gancho.** Título magnético + Visual fuerte.
2. **Slide 2: El Contexto.** Identificación del problema/empatía.
3. **Slide 3: La Solución (Paso 1).** Valor inmediato.
4. **Slide 4: La Solución (Paso 2).** Continuación del valor.
5. **Slide 5: CTA Magnético.** Instrucción clara (Guardar/Seguir).

## Preguntas Abiertas

> [!IMPORTANT]
> 1. **¿Nicho Recomendado?** ¿Tienes un nicho o marca personal específica para el primer carrusel de prueba, o prefieres que el sistema detecte uno solo basado en el mercado actual?
> 2. **¿Estilo Visual?** ¿Deseas un estilo minimalista (estilo Apple 2026), Dark Mode (estilo Vibe Coding), o algo más "Punchy" y colorido?
> 3. **¿PDF Manual?** ¿En qué idioma prefieres el manual PDF de configuración paso a paso?

## Plan de Verificación

### Pruebas Automatizadas
- Ejecutar ` Carousel_Engine.py` con una entrada de prueba para validar la generación de las 5 slides.

### Verificación Manual
- Abrir la previsualización HTML en el navegador para asegurar que el "swipe" funciona perfectamente.
- Validar la calidad de las imágenes generadas por el agente.
