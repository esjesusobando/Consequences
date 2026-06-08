---
name: creacion-contenidos
description: >
  Área de CREACIÓN DE CONTENIDOS — Brand Voice, YouTube, SEO, Marketing.
  Skills para generación de contenido estratégico, copywriting y optimización.
  Triggers on: brand voice, youtube, seo, marketing strategy, content creation, copywriting, ai agents, remotion, video
---

# CREACIÓN DE CONTENIDOS — 16 Sub-áreas

**Versión:** v2.0 | **Última actualización:** 2026-05-29

> **Nota:** Skills visuales de diseño (Thumbnail, Carousel, Premium Image, Video Visuals, Video Prompt) migraron a `02_Diseno_Ui_Ux/` para consolidar todas las skills de diseño en un solo lugar.

---

## Esencia Original

La creación de contenido no es el producto final — es el vehículo. Cada sub-área aquí cubre un eslabón de la cadena: desde descubrir qué decir (ideation) hasta empaquetarlo para el canal correcto (YouTube, LinkedIn, blog). El componente crítico no es la generación, es la transformación: raw content → multi-canal sin perder la voz de marca. Por eso Brand Voice es la sub-área 01 — sin voz definida, el contenido generado por IA suena a genérico.

**Área Funcional:** 01_Creacion_Contenidos

---

## Sub-áreas

| #  | Sub-área (directorio real)                           | Descripción                                  |
|---|-----------------------------------------------------|---------------------------------------------|
| 01 | `01_Brand_Voice/`                                    | Sistema de voz de marca                      |
| —  | ~~`01_Imported_Packages/`~~ → `16_Imported_Packages/`| Paquetes importados (movido al final)        |
| 02 | `02_Content_Ideation/`                               | Ideación de contenido                        |
| 03 | `03_Content_Transformer/`                            | Transformación de contenido raw a multi-canal|
| 04 | `04_Offer_And_Bio_Writer/`                           | Redacción de ofertas y biografías            |
| 05 | `05_Youtube_Script_Writer/`                          | Guiones optimizados para YouTube             |
| 06 | `06_Youtube_Title_Generator/`                        | Generación de títulos para YouTube           |
| 07 | `07_Youtube_Full_Video/`                             | Pipeline completo de producción YouTube      |
| 08 | `08_Seo_Sota_Master/`                                | SEO técnico + keyword research               |
| 09 | `09_Remotion_Video_Creator/`                         | Creación de videos con Remotion              |
| 10 | `10_Remotion_Best_Practices/`                        | Mejores prácticas para Remotion              |
| 11 | `11_Ai_Agents/`                                      | Agentes AI para marketing                    |
| 12 | `12_Compound_Engine/`                                | Integración con Compound Engine              |
| 13 | `13_Marketing_Strategy/`                             | Estrategias de marketing (copy, CRO, pricing)|
| 14 | `14_Marketing_Tech/`                                 | Tecnología de marketing (SEO, analytics, ads)|
| 15 | `15_Marketing_Scripts/`                              | Scripts de automatización de marketing       |
| 16 | `16_Imported_Packages/`                              | Paquetes importados (.skill files)           |

## Skills de diseño visual migradas a `02_Diseno_Ui_Ux/`

| Skill                           | Nueva ubicación                                 |
|--------------------------------|------------------------------------------------|
| `08_Youtube_Thumbnail_Prompter/`| `02_Diseno_Ui_Ux/15_Youtube_Thumbnail_Prompter/`|
| `10_Video_Prompt_Builder/`      | `02_Diseno_Ui_Ux/16_Video_Prompt_Builder/`      |
| `11_Video_Visuals_Producer/`    | `02_Diseno_Ui_Ux/14_Video_Visuals_Producer/`    |
| `12_Premium_Image_Studio/`      | `02_Diseno_Ui_Ux/12_Premium_Image_Studio/`      |
| `12_Carousel_Master/`           | `02_Diseno_Ui_Ux/13_Carousel_Master/`           |

## Workflows Relacionados

- `08_Youtube_Full_Video/` — Pipeline completo de producción YouTube
- Learning Always — Para investigar y aprender de contenido

---

## ⚠️ Gotchas

### Pipeline YouTube con Thumbnail en otra área
> `08_Youtube_Full_Video/` referencia a Thumbnail_Prompter que ahora está en `02_Diseno_Ui_Ux/`.

- **Por qué**: Thumbnail se movió al área de diseño para consolidación. El pipeline en `08_Youtube_Full_Video` lo invoca por nombre, no por path — sigue funcionando.
- **Solución**: Si el pipeline falla, actualizar el path de referencia en `08_Youtube_Full_Video/SKILL.md`. Hasta entonces, funciona porque el agente escanea todas las áreas.

### Numbering de directorios normalizado (v2.0)
> Los directorios se renombraron a secuencia 01-16 limpia (anterior: 01, 01, 02, 04, 06, 07, 08, 13...). `Imported_Packages` movido de `01_` a `16_` por ser un área auxiliar.

---

## 💾 State Persistence

| Componente        | Persistencia| Mecanismo                     |
|------------------|------------|------------------------------|
| Brand Voice system| ✅ Archivo   | En `01_Brand_Voice/`          |
| YouTube scripts   | ✅ Archivo   | En `05_Youtube_Script_Writer/`|
| SEO audits        | ✅ Archivo   | En `08_Seo_Sota_Master/`      |
| Marketing strategy| ✅ Archivo   | En `13_Marketing_Strategy/`   |

---

*Área Creación de Contenidos v1.2 — 2026-05-29*
