---
name: creacion-contenidos
description: >
  Área de CREACIÓN DE CONTENIDOS — Brand Voice, YouTube, SEO, Carruseles,
  Marketing Strategy, Marketing Tech, AI Agents. 20 sub-áreas numeradas
  para generación de contenido estratégico, copywriting y optimización.
  Triggers on: brand voice, youtube, seo, carruseles, marketing strategy, content creation, copywriting, ai agents, remotion, video
---

# CREACIÓN DE CONTENIDOS — 20 Sub-áreas

## Esencia Original

La creación de contenido no es el producto final — es el vehículo. Cada sub-área aquí cubre un eslabón de la cadena: desde descubrir qué decir (ideation) hasta empaquetarlo para el canal correcto (YouTube, LinkedIn, blog). El componente crítico no es la generación, es la transformación: raw content → multi-canal sin perder la voz de marca. Por eso Brand Voice es la sub-área 01 — sin voz definida, el contenido generado por IA suena a genérico.

**Área Funcional:** 01_Creacion_Contenidos
**Versión:** 1.1 | **Última actualización:** 2026-05-26

---

## Sub-áreas

| #  | Sub-área                   | Descripción                                    |
|----|---------------------------|------------------------------------------------|
| 00 | `00_Imported_Packages/`    | Paquetes importados (brand-voice, ideation)     |
| 01 | `01_Brand_Voice/`          | Sistema de voz de marca                         |
| 02 | `02_Content_Ideation/`     | Ideación de contenido                           |
| 03 | `03_Content_Transformer/`  | Transformación de contenido raw a multi-canal   |
| 04 | `04_Offer_And_Bio_Writer/` | Redacción de ofertas y biografías               |
| 05 | `05_Youtube_Script_Writer/`| Guiones optimizados para YouTube                |
| 06 | `06_Youtube_Title_Generator/`| Generación de títulos para YouTube            |
| 07 | `07_Youtube_Thumbnail_Prompter/`| Prompts para miniaturas YouTube           |
| 08 | `08_Youtube_Full_Video/`   | Pipeline completo de producción YouTube         |
| 09 | `09_Video_Prompt_Builder/` | Construcción de prompts para video Seedance     |
| 10 | `10_Video_Visuals_Producer/`| Producción de visuales para video             |
| 11 | `11_Premium_Image_Studio/` | Generación de imágenes premium                  |
| 12 | `12_Carousel_Master/`      | Estrategia y diseño de carruseles               |
| 13 | `13_Seo_Sota_Master/`      | SEO técnico + keyword research                  |
| 14 | `14_Remotion_Video_Creator/`| Creación de videos con Remotion                |
| 15 | `15_Remotion_Best_Practices/`| Mejores prácticas para Remotion               |
| 16 | `16_Ai_Agents/`            | Agentes AI para marketing (onboarding, exec)    |
| 17 | `17_Compound_Engine/`      | Integración con Compound Engine                 |
| 18 | `18_Marketing_Strategy/`   | Estrategias de marketing (copy, CRO, pricing)   |
| 19 | `19_Marketing_Tech/`       | Tecnología de marketing (SEO, analytics, ads)   |
| 20 | `20_Marketing_Scripts/`    | Scripts de automatización de marketing          |

## Workflows Relacionados

- `08_Youtube_Full_Video/` — Pipeline completo de producción YouTube
- Learning Always — Para investigar y aprender de contenido

## Integración

- **Hillary**: Captura de ideas de contenido
- **Learning Always**: Investigación previa
- **4 Fantásticos**: Para producción batch

## Estándares de Contenido

### Naming
```
[fecha]_[tipo]_[tema].[ext]
2026-05-19_LinkedIn_Post_Skills.md
```

### Estructura
```
# Título
## Contexto
## Contenido
## CTA
## Tags
```

## ⚠️ Gotchas

### Voz de marca inconsistente
> Contenido generado para distintos canales suena a agentes diferentes.

- **Por qué**: Cada skill (YouTube, LinkedIn, carrusel) tiene su propio prompt y no comparte el brand voice file. Sin un sistema de referencia común, cada pieza de contenido suena distinta.
- **Solución**: Centralizar brand voice en `01_Brand_Voice/` y hacer que todas las skills de contenido lo referencien. Agregar validación de tono al final del pipeline.

### Contenido sin diferenciación
> El output es genérico porque el prompt no incluye suficiente contexto.

- **Por qué**: Las skills de contenido funcionan con instrucciones generales. Si no se inyectan datos específicos (audiencia, objetivo, diferenciación), el resultado es contenido que cualquiera podría haber generado.
- **Solución**: Antes de ejecutar cualquier skill de contenido, recolectar contexto mínimo: (1) audiencia target, (2) qué diferencia este contenido, (3) call to action deseado. Inyectar estos 3 datos en el prompt base.

### Pipeline roto por pieza faltante
> El workflow completo falla si una sub-skill intermedia no se ejecuta.

- **Por qué**: Los pipelines multicanal (ej: YouTube Full Video) dependen de outputs de skills anteriores. Si Thumbnail Prompter no se ejecutó, el pipeline no tiene imagen para publicar, pero el script ya está listo.
- **Solución**: Cada paso debe producir un output verificable antes de pasar al siguiente. Implementar validación de dependencias: si falta input requerido, pausar el pipeline y reportar qué específicamente falta.

## 💾 State Persistence

| Componente | Persistencia | Mecanismo |
|---|---|---|
| Brand Voice | ✅ Permanente | Archivos `.md` en `01_Brand_Voice/` |
| Contenido generado | ✅ Archivo | Archivos con naming `[fecha]_[tipo]_[tema].[ext]` |
| Pipeline en progreso | ⚠️ Por sesión | No persiste — completar pipeline en una sesión |
| Contexto de audiencia | ❌ No persiste | Se define por prompt cada vez |

---

*Área Creación de Contenidos v1.1 — 2026-05-26*
