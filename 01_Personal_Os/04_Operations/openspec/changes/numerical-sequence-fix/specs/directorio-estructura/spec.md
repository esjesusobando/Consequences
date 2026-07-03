# Delta: directorio-estructura

Corrección de secuencias numéricas en la estructura de directorios de `01_Personal_Os/`. Cambio puramente estructural — no modifica capacidades del sistema, solo rutas físicas.

## RENAMED Requirements

### R1: 05_Archive → migrar a 07_Archive

La carpeta `05_Archive/` en la raíz de `01_Personal_Os/` comparte el prefijo `05` con `05_Scripts/`.

- Mover `01_Personal_Os/07_Archive/05_Repos/` → `01_Personal_Os/07_Archive/05_Repos/`
- Eliminar `01_Personal_Os/07_Archive/05_Repos/`
- Actualizar `ARCHIVE_DIR` en `config_paths.py` si referencia rutas intermedias
- Actualizar referencias en `.agent/00_Rules/`, `.agent/02_Skills/`, manifiestos SDD y cualquier script `.py`/`.md` que contenga `05_Archive`

Riesgo: scripts con ruta `05_Archive` hardcodeada podrían no detectarse. Mitigación: `grep -r "05_Archive"` exhaustivo post-cambio.

### R2: 02_Knowledge/ — renumerar 06/07/09 → 03/04/05

Los directorios `06_Unicorn`, `07_Invictus`, `09_Anthropic` en `02_Knowledge/` crean saltos numéricos (faltan 03, 04, 05).

- Renombrar `02_Knowledge/03_Unicorn` → `02_Knowledge/03_Unicorn`
- Renombrar `02_Knowledge/04_Invictus` → `02_Knowledge/04_Invictus`
- Renombrar `02_Knowledge/05_Anthropic` → `02_Knowledge/05_Anthropic`
- Actualizar referencias internas en esos directorios (README.md, archivos que se autoricen)
- Verificar que `02_Knowledge/00_Examples_Personal_Os`, `01_Research`, `02_Docs` NO se modifican

Riesgo: bajo — `UNICORN_DIR` en `config_paths.py` apunta a `KNOWLEDGE_DIR` (que no cambia), no a la ruta específica.

### R3: 01_Creacion_Contenidos/ — renombrar 15 duplicado

Existen `15_Audio_Pipeline` y `15_Marketing_Scripts` en `02_Skills/01_Creacion_Contenidos/`.

- Renombrar `15_Audio_Pipeline` → `19_Audio_Pipeline`
- `15_Marketing_Scripts` se queda con el prefijo 15
- El resto (01-14, 16-18) NO se modifica
- Actualizar referencias en skills, registros y archivos que mencionen `15_Audio_Pipeline`

Riesgo: bajo — `Audio_Pipeline` es un skill de contenido, referenciado principalmente en índices y README.

### R4: 04_Automatizacion/ — eliminar duplicados y llenar huecos

En `02_Skills/04_Automatizacion/` existen prefijos duplicados (08, 10, 11, 16) y huecos (09, 12).

| Actual | Nuevo | Motivo |
|--------|-------|--------|
| `08_N8N_Invictus` | `09_N8N_Invictus` | Libera 08 (ya usado por AI_News_Weekly) |
| `10_GWS_Client` | `12_GWS_Client` | Libera 10 (ya usado por Firecrawl) |
| `11_Gws_Client` | `18_Gws_Client` | Lleva al final de la secuencia |
| `16_Reverse_Engineering` | `17_Reverse_Engineering` | Llena hueco, libera 16 (ya usado por N8n) |
| `17_Learning_Url_To_Knowledge` | `19_Learning_Url_To_Knowledge` | Lleva al final junto con Gws_Client |

Los directorios 01-07, 08_AI_News_Weekly, 10_Firecrawl, 11_Gcierr, 13-16_N8n NO se modifican.

- Actualizar TODAS las referencias internas: `README.md`, `SKILL.md`, `references/`, `references_v2.md`
- Actualizar índices: `INDEX_AREA_FUNCTIONAL.md`, `MAPA_MIGRACION.md`, `TOP_20_SKILLS.md`

Riesgo: medio — skills de automatización tienen referencias cruzadas en `references/` y archivos de compound knowledge que deben actualizarse manualmente.

### R5: 00_Workflows/01_Personal_Os/ — renombrar 05 duplicado

Existen `05_Audio_To_Content.md` y `05_Ritual_Cierre_Protocol.md`.

- Renombrar `05_Audio_To_Content.md` → `11_Audio_To_Content.md`
- `05_Ritual_Cierre_Protocol.md` se queda con 05
- El resto (01-04, 06-10) no se modifica
- Actualizar referencias en workflows, `.agent/03_Workflows/`, hooks y reglas

Riesgo: bajo — archivo referenciado principalmente en cadenas de workflows matutinos.

## ADDED Requirements

### R6: crear 00_Respaldo_Workflow_MKT

- Crear `01_Personal_Os/00_Core/00_Workflows/00_Respaldo_Workflow_MKT/`
- Agregar `README.md` que documente que es un directorio de respaldo para workflows de marketing
- No debe contener skills activas — solo respaldos y versiones anteriores
- No requiere actualización de scripts operativos (no hay referencias activas)

## MODIFIED Requirements

### Actualización de referencias post-cambio

El sistema DEBE verificar que TODOS los archivos que referencian rutas antiguas se actualicen.

- Buscar patrón: `grep -r "05_Archive\|08_N8N_Invictus\|10_GWS_Client\|11_Gws_Client\|16_Reverse_Engineering\|15_Audio_Pipeline\|05_Audio_To_Content"` sobre todo el repo
- Archivos objetivo: `.py`, `.md`, `.yaml`, `.json`, `.mdc`, `.agent/**`
- El commit final DEBE incluir solo cambios de ruta, sin refactor de lógica
- Verificar con `git diff --stat` que no haya cambios inesperados
