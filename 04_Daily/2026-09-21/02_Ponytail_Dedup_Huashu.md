---
type: dedup
date: 2026-09-21
status: done
---

# Ponytail: Deduplicación Huashu Design

## Problema

3 archivos JavaScript duplicados **idénticamente** en dos ubicaciones:
- `02_Diseno_Ui_Ux/08_Huashu_Design/` (copia)
- `00_Compound_Engineering/07_Skills/huashu-design/` (fuente de verdad)

## Archivos eliminados

| Archivo | Líneas | Ubicación eliminada |
|---------|--------|---------------------|
| `html2pptx.js` | 978 | `02_Diseno_Ui_Ux/08_Huashu_Design/scripts/` |
| `deck_stage.js` | 420 | `02_Diseno_Ui_Ux/08_Huashu_Design/assets/` |
| `render-video.js` | 289 | `02_Diseno_Ui_Ux/08_Huashu_Design/scripts/` |
| **Total** | **1,687** | |

## Fuente de verdad

`00_Compound_Engineering/07_Skills/huashu-design/` — canonical location.

## Verificación

- `diff` entre ambas copias: **0 diferencias** (archivos idénticos byte-a-byte)
- Archivos restantes en `02_Diseno_Ui_Ux/08_Huashu_Design/` son **únicos** (verify.py, add-music.sh, convert-formats.sh, .mjs exports, assets JSX/SVG/MP3)

## Cuándo aplicar

Cuando un skill tiene código duplicado entre `02_Diseno_Ui_Ux` y `00_Compound_Engineering`, mantener solo la copia en `00_Compound_Engineering/07_Skills/`.
