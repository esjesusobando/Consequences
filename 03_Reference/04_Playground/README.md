# Categories

> Capa transversal de hubs estilo MOC. Agrupa notas por el valor de la propiedad `categories` en lugar de por su ubicación en el árbol de carpetas.

## Qué es

El vault se organiza top-down por carpetas numeradas (01_Capture → 06_Excalidraw). Los hubs de categorías complementan la navegación: **agregan** notas por su propiedad `categories` sin duplicarlas ni moverlas de su carpeta original.

- Una nota vive en UNA sola carpeta.
- Puede pertenecer a VARIAS categorías mediante la propiedad `categories`.

## Hubs

| Hub | Categoría | Carpeta |
|-----|-----------|---------|
| OS | `os, sistema` | 03_Reference/01_Knowledge |
| Conocimiento | `conocimiento, knowledge` | Knowledge, Memory, Learning |
| Investigacion | `investigacion, research` | 03_Reference/02_Research |

## Cómo agregar una nota a un hub

1. Añade (o amplía) la propiedad `categories` en el frontmatter de la nota con el valor del hub, p. ej. `categories: [os, sistema]`.
2. La nota NO se mueve de su carpeta original.
3. Opcional: enlázala desde el hub correspondiente en "Notas relacionadas".

## Bases (sugerido)

Un bloque de Bases por hub permite filtrar por `categories` y ver todas las notas de la categoría en una sola vista, sin reescribir el árbol de carpetas.
