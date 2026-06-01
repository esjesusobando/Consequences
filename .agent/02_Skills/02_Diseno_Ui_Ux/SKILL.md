---
name: diseno-ui-ux
description: Diseño UI/UX profesional — skills de diseño visual, prototipado, sistemas de diseño, y experiencia de usuario. Triggers on: diseño, ui, ux, prototipo, figma, design system, interface, experiencia de usuario, visual design, carrusel, thumbnail, imagen premium, video prompt
globs: 
alwaysApply: false
---

# 02_Diseño UI/UX — Área de Skills

**Versión:** v2.0 (2026-05-29)
**Skills:** 16 skills en 16 sub-áreas

> Consolidación de skills visuales desde `01_Creacion_Contenidos/` + skills nativas de diseño.

---

## Sub-áreas

| #     | Sub-área                            | Descripción                                                       | Estado                                  |
|------|------------------------------------|------------------------------------------------------------------|----------------------------------------|
| 01    | `01_Product_Design/`                | Diseño de producto — 12 sub-skills (Taste → Shadcn)               | ✅ SKILL.md promovido desde subdirectorio|
| 02    | `02_Taste_Skills/`                  | Taste skills — Alto impacto visual con criterio estético          | ✅ SKILL.md promovido desde subdirectorio|
| 03    | `03_Diseno_Minimalista/`            | Minimalismo utilitario premium + UI editorial                     | ✅ SKILL.md promovido desde subdirectorio|
| 04    | `04_Directrices_Marca/`             | Directrices de marca y guías de estilo                            | ✅ SKILL.md promovido desde subdirectorio|
| 05    | `05_Excalidraw_Flowchart/`          | Diagramas Excalidraw de argumentación visual                      | ✅ SKILL.md promovido desde subdirectorio|
| 06    | `06_Design_Sota/`                   | **Design SOTA** — Arquitecto de interfaces premium                | ✅ Referencia de calidad                 |
| 07    | `07_Ui_Ux_Pro_Max/`                 | UI/UX Pro Max — Base de datos de diseño consultable               | ✅ Completa (path stale corregido)       |
| 08    | `08_Huashu_Design/`                 | Huashu Design — Prototipado HTML de alta fidelidad                | ✅ Completa                              |
| 09    | `09_Dumbledor_Design/`              | Diseño editorial de alto impacto                                  | ✅ Completa                              |
| 10    | `10_Design_Systems/`                | Sistemas de diseño (atomic design, tokens, shadcn)                | ✅ Completa                              |
| 11    | `11_Marvel_Avengers/`               | Marvel Avengers — Workflow multi-agente de diseño                 | ✅ Skill de proceso                      |
| **12**| **`12_Premium_Image_Studio/`**      | Suite creativa — Identidades visuales, banners y activos digitales| 📦 Migrada de Content                    |
| **13**| **`13_Carousel_Master/`**           | Automatización de carruseles Instagram/LinkedIn                   | 📦 Migrada de Content                    |
| **14**| **`14_Video_Visuals_Producer/`**    | Producción de assets visuales y presentaciones                    | 📦 Migrada de Content                    |
| **15**| **`15_Youtube_Thumbnail_Prompter/`**| Prompts optimizados para miniaturas YouTube                       | 📦 Migrada de Content                    |
| **16**| **`16_Video_Prompt_Builder/`**      | Prompts detallados para video AI (Seedance)                       | 📦 Migrada de Content                    |

---

## Skills Principales

| Skill              | Directorio                | Trigger principal                              |
|-------------------|--------------------------|-----------------------------------------------|
| **Design SOTA**    | `06_Design_Sota/`         | UIs premium, bento grid, paletas monocromáticas|
| **UI/UX Pro Max**  | `07_Ui_Ux_Pro_Max/`       | Sistema de recomendación de diseño vía CLI     |
| **Huashu Design**  | `08_Huashu_Design/`       | Prototipado HTML, animación, diseño visual     |
| **Premium Image**  | `12_Premium_Image_Studio/`| Identidad visual, banners, activos digitales   |
| **Carousel Master**| `13_Carousel_Master/`     | Carruseles IG/LinkedIn                         |

## Metodologías Integradas

- **Design SOTA** — Minimalismo editorial + alto impacto visual
- **Huashu Design** — HTML como herramienta de prototipado, no como tecnología
- **Dumbledor Design** — Jerarquía visual 3 niveles, contraste binario
- **Marvel/Avengers** — Workflow multi-agente para proyectos de diseño
- **Taste Skills** — Curated design taste system

---

## Runbook: Flujo de diseño típico

```
1. UI/UX Pro Max → Generar design system (estilo, paleta, tipografía)
2. Design SOTA → Arquitectura de interfaz
3. Huashu Design → Prototipado HTML de alta fidelidad
4. Design Systems → Tokens y componentes atómicos
5. Premium Image Studio → Assets visuales finales
```

---

## ⚠️ Gotchas

### Sub-áreas 01-05 con estructura legacy (corregido)
> Los directorios 01-05 tenían contenido anidado con nombres no estándar (`1. TASTE SKILLS/` dentro de `02_Taste_Skills/`). Se promovieron los SKILL.md al nivel wrapper.

- **Por qué**: Migración legacy donde los contenidos se copiaron dentro de subdirectorios numerados manualmente.
- **Solución aplicada**: Se copió cada SKILL.md al nivel superior. Los subdirectorios legacy se conservan intactos (no se eliminó nada). El agente escanea recursivamente y encuentra la skill sin importar la profundidad.

### Stale path en 07_Ui_Ux_Pro_Max (corregido)
> El SKILL.md referenciaba `09_Ui_Ux_Pro_Max` en todos los paths de script.

- **Por qué**: Error de copia al renombrar el área.
- **Solución aplicada**: `sed` reemplazó `09_Ui_Ux_Pro_Max` → `07_Ui_Ux_Pro_Max` (12 ocurrencias).

### Skills migradas de Content aún referenciadas desde allá
> `08_Youtube_Full_Video/` en Content invoca Thumbnail_Prompter.

- **Por qué**: Thumbnail se movió al área de diseño pero el pipeline YouTube la referencia por nombre.
- **Solución**: El agente escanea todas las áreas — encuentra la skill por nombre. Si hay fallo, actualizar path en `08_Youtube_Full_Video/SKILL.md`.

---

## Estado de las sub-áreas

| Estado              | Significado                                             |
|--------------------|--------------------------------------------------------|
| ✅ Completa          | SKILL.md completo con triggers, contenido, gotchas      |
| ⚠️ Requiere revisión| Estructura interna legacy o SKILL.md faltante           |
| 📦 Migrada           | Movida desde `01_Creacion_Contenidos/` en esta iteración|

---

## 💾 State Persistence

| Componente            | Persistencia| Mecanismo                         |
|----------------------|------------|----------------------------------|
| Design system generado| ✅ Archivo   | `--persist` en `07_Ui_Ux_Pro_Max/`|
| Prototipos HTML       | ✅ Archivo   | Outputs de `08_Huashu_Design/`    |
| Assets visuales       | ✅ Archivo   | `12_Premium_Image_Studio/`        |
| Carruseles            | ✅ Archivo   | `13_Carousel_Master/`             |
| Thumbnail prompts     | ✅ Archivo   | `15_Youtube_Thumbnail_Prompter/`  |
| Video prompts         | ✅ Archivo   | `16_Video_Prompt_Builder/`        |

---

**Source of Truth:** `01_Personal_Os/01_Core/02_Tools/02_Skills/02_Diseno_Ui_Ux/`

*Área Diseño UI/UX v2.0 — 2026-05-29*
