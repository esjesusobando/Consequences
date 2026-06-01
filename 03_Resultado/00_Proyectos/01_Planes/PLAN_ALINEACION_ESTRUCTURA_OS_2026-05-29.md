# PLAN DE ALINEACIÓN ESTRUCTURAL DEL OS — 2026-05-29

> **Objetivo:** Corregir referencias stale, paths incorrectos y documentación desactualizada sin eliminar ni reestructurar archivos existentes. Respetar la arquitectura actual y solo alinear la metadata con la realidad del disco.
>
> **Principio rector:** No se elimina nada. No se mueve nada. Solo se corrigen referencias para que reflejen la estructura real del sistema.

---

## ESTADO ACTUAL

### Diagnóstico base (Auditoría 16 áreas — 2026-05-28)

Se auditaron los 16 archivos SKILL.md / index de nivel área. Resultados consolidados:

#### 🔴 Errores críticos (path numbering incorrecto)

| Archivo                                                             | Dice                                                           | Debería decir    |
|--------------------------------------------------------------------|---------------------------------------------------------------|-----------------|
| `01_Personal_Os/01_Core/02_Tools/02_Skills/00_Personal_Os/SKILL.md` | "Área Funcional: 07_Personal_Os" ✅ ya corregido                | `00_Personal_Os` |
| `01_Personal_Os/01_Core/02_Tools/02_Skills/00_Workflows/SKILL.md`   | "Área Funcional: 05_Workflows" ✅ ya corregido                  | `00_Workflows`   |
| `01_Personal_Os/01_Core/02_Tools/02_Skills/07_Invictus_Web/SKILL.md`| "Área Funcional: 08_Invictus_Web" ✅ ya corregido               | `07_Invictus_Web`|
| `01_Personal_Os/01_Core/01_Rules/RULES_INDEX.md`                    | Referencia `07_Personal_Os`                                    | `00_Personal_Os` |
| `01_Personal_Os/01_Core/01_Inventario_Core.md`                      | Referencia `07_Personal_Os`                                    | `00_Personal_Os` |
| `README.md` (raíz)                                                  | Lista `07_Personal_Os`, `05_Workflows`, `08_Invictus_Web`, etc.| Números reales   |
| `OS_DIRECTORY.md` (raíz)                                            | Múltiples paths stale (`07_Personal_Os`, `05_Workflows`, etc.) | Números reales   |
| `Structure_v4.8.md`                                                 | Ídem                                                           | Números reales   |
| `00_Winter_is_Coming/OS_DIRECTORY.md`                               | Ídem                                                           | Números reales   |
| `CLAUDE.md` (raíz)                                                  | Tabla de áreas con números viejos                              | Números reales   |

#### 🔴 Missing SKILL.md por área

| Área              | Archivo faltante |
|------------------|-----------------|
| `02_Diseno_Ui_Ux/`| SKILL.md         |
| `05_Claude_Ads/`  | SKILL.md         |

#### 🟡 Sub-áreas incorrectas

| Archivo                     | Lista                             | Real en disco                           |
|----------------------------|----------------------------------|----------------------------------------|
| `03_Video_Media/SKILL.md`   | 1 sub-área (`01_Video_Intel`)     | 2 (`01_Video_Intel`, `02_James_Cameron`)|
| `04_Automatizacion/SKILL.md`| 10 sub-áreas (01-10)              | 17 sub-dirs                             |
| `00_System_Core/SKILL.md`   | Lista sub-dirs que no existen     | Solo 2 existen                          |
| `00_Personal_Os/SKILL.md`   | Sub-áreas con numbering off-by-one| `08_Hillary/` → `07_Hillary/`           |

#### 🟡 Documentación raíz desactualizada

| Archivo                   | Problema                                                                |
|--------------------------|------------------------------------------------------------------------|
| `README.md`               | Dice "12 áreas canónicas" (hay 13), "394/407 skills" (hay 369)          |
| `INDEX_AREA_FUNCTIONAL.md`| Paths stale, Agent Teams Lite duplicado, dice 12 áreas pero lista 9     |
| `MAPA_MIGRACION.md`       | Completamente stale (abril 2026), paths en ALL_CAPS, números incorrectos|

---

## FASES DE TRABAJO

### FASE 0 — Verificación inicial (SIN COMMIT)

Auditar estado actual de cada archivo antes de tocarlo para confirmar qué está realmente mal.

- Releer cada archivo listado abajo en su ubicación real
- Confirmar que el problema persiste vs. ya fue corregido en sesiones anteriores
- Si ya está corregido, marcarlo como ✅ y no tocarlo
- Si hay discrepancias entre ubicaciones (`.agent/` backup vs. `01_Personal_Os/` activo), priorizar el activo

**Output:** Lista final de archivos a modificar (eliminando falsos positivos).

---

### FASE 1 — Corrección de paths en archivos raíz del repositorio (SIN ELIMINAR)

Corregir únicamente referencias textuales a paths que ya no existen. No renombrar directorios. No eliminar archivos.

| Archivo                              | Corrección                                                                                                 |
|-------------------------------------|-----------------------------------------------------------------------------------------------------------|
| `CLAUDE.md`                          | Tabla de áreas: `07_Personal_Os` → `00_Personal_Os`                                                        |
| `README.md`                          | Tabla de áreas + path de skills                                                                            |
| `OS_DIRECTORY.md`                    | `07_Personal_Os` → `00_Personal_Os`, `05_Workflows` → `00_Workflows`, `08_Invictus_Web` → `07_Invictus_Web`|
| `Structure_v4.8.md`                  | Ídem                                                                                                       |
| `00_Winter_is_Coming/GOALS.md`       | Path de skill `07_Personal_Os` → `00_Personal_Os`                                                          |
| `00_Winter_is_Coming/AGENTS.md`      | Tabla de áreas                                                                                             |
| `00_Winter_is_Coming/OS_DIRECTORY.md`| Ídem que `OS_DIRECTORY.md` raíz                                                                            |

**Regla:** Solo cambiar texto que referencia un path incorrecto. No cambiar estructura, no eliminar contenido, no mover archivos.

---

### FASE 2 — Corrección de paths en archivos activos (`01_Personal_Os/`)

| Archivo                                                                  | Corrección esperada                               |
|-------------------------------------------------------------------------|--------------------------------------------------|
| `01_Personal_Os/01_Core/01_Rules/RULES_INDEX.md`                         | `07_Personal_Os` → `00_Personal_Os`               |
| `01_Personal_Os/01_Core/01_Rules/08_Token_Economy.mdc`                   | Path de skill `07_Personal_Os` → `00_Personal_Os` |
| `01_Personal_Os/01_Core/01_Inventario_Core.md`                           | `07_Personal_Os` → `00_Personal_Os`               |
| `01_Personal_Os/01_Core/00_Comandos_Workflows.md`                        | Path de skills PersonalOS                         |
| `01_Personal_Os/01_Core/00_Workflows_Os/04_Hillary/25_Hillary_Life_OS.md`| Ruta de carga de skill                            |
| `01_Personal_Os/01_Core/02_Tools/01_Agents/00_OS_Conductor/SKILL.md`     | Tabla de ruteo `07_Personal_Os` → `00_Personal_Os`|

**Regla:** Solo texto. No se toca estructura de directorios.

---

### FASE 3 — Corrección de paths en `.agent/` (copia de seguridad)

El directorio `.agent/` es un backup. Debe reflejar las mismas correcciones que el activo para que no haya confusión entre versiones.

| Archivo                                               | Corrección    |
|------------------------------------------------------|--------------|
| `.agent/README.md`                                    | Tabla de áreas|
| `.agent/CLAUDE.md`                                    | Tabla + paths |
| `.agent/SKILLS_INVENTORY.md`                          | Paths         |
| `.agent/00_Rules/RULES_INDEX.md`                      | Paths         |
| `.agent/02_Skills/README.md`                          | Paths         |
| `.agent/02_Skills/INDEX_AREA_FUNCTIONAL.md`           | Paths         |
| `.agent/03_Workflows/04_Hillary/25_Hillary_Life_OS.md`| Ruta de carga |

---

### FASE 4 — Corrección de SKILL.md de áreas con información incorrecta

| Archivo                                                               | Corrección                                               |
|----------------------------------------------------------------------|---------------------------------------------------------|
| `01_Personal_Os/01_Core/02_Tools/02_Skills/03_Video_Media/SKILL.md`   | Actualizar lista de sub-áreas (añadir `02_James_Cameron`)|
| `01_Personal_Os/01_Core/02_Tools/02_Skills/04_Automatizacion/SKILL.md`| Actualizar lista de sub-áreas de 10 a 17                 |
| `01_Personal_Os/01_Core/02_Tools/02_Skills/00_Personal_Os/SKILL.md`   | Corregir numbering de sub-áreas si está off-by-one       |
| `01_Personal_Os/01_Core/02_Tools/02_Skills/00_System_Core/SKILL.md`   | Actualizar lista de sub-dirs existentes                  |

**Importante:** No eliminar contenido existente. Solo agregar lo que falta o corregir números.

---

### FASE 5 — Crear SKILL.md faltantes

Crear SKILL.md para las 2 áreas que no tienen:

#### 5.1 `02_Diseno_Ui_Ux/SKILL.md`

Ubicación: `01_Personal_Os/01_Core/02_Tools/02_Skills/02_Diseno_Ui_Ux/SKILL.md`

Template a seguir (mismo formato que las demás áreas):
- Frontmatter YAML (name, description, triggers)
- Esencia Original (2-3 párrafos)
- Sub-áreas y Contenido (tabla con las sub-áreas reales en disco)
- Skills Principales
- Metodologías Integradas
- Gotchas (al menos 2-3)
- State Persistence

**Sub-áreas actuales en disco:**
```
00_Components/
01_Landing_Sotolab/
02_Disenos/
03_Motion_Graphics/
04_Animated_Illustration/
05_Bento_Grids/
06_Huashu_Personal_Pro/
07_Ui_Ux_Pro_Max/
08_Whiteboard/
09_Flujo_Ventas_Soto/
10_Huashu_Design/
11_Ui_Shots/
```

#### 5.2 `05_Claude_Ads/SKILL.md`

Ubicación: `01_Personal_Os/01_Core/02_Tools/02_Skills/05_Claude_Ads/SKILL.md`

Template: mismo formato con sus sub-áreas reales en disco.

---

### FASE 6 — Corrección de índices y documentos de referencia

| Archivo                                                                      | Corrección                                 |
|-----------------------------------------------------------------------------|-------------------------------------------|
| `01_Personal_Os/01_Core/02_Tools/02_Skills/INDEX_AREA_FUNCTIONAL.md`         | Paths stale + duplicados                   |
| `01_Personal_Os/02_Knowledge/02_Research/04_INVENTARIO_INTEGRADO_SISTEMAS.md`| Paths stale                                |
| `01_Personal_Os/04_Operations/03_Scripts_Os/SCRIPTS_INDEX.md`                | Número de área                             |
| `01_Personal_Os/04_Operations/01_Auto_Improvement/AUDITORIA_2026-04-23.md`   | Path stale                                 |
| `.claude-plugin/plugin.json`                                                 | Glob pattern de skills **SOLO si está mal**|

---

### FASE 7 — MAPA_MIGRACION.md: Actualizar o archivar

El archivo `INDEX_AREA_FUNCTIONAL.md` contiene un mapa de migración que:
- Usa ALL_CAPS en paths destino (no coincide con la realidad)
- Tiene números de área incorrectos
- Muestra todo como `⏳` (pendiente) desde abril 2026

**Opción A (recomendada):** Actualizar el mapa para reflejar los números reales y marcar como completo (`✅`) lo que ya migró.

**Opción B:** Mover a `05_Archive/` si ya no es relevante.

---

## ERRORES CONOCIDOS (NO BLOQUEANTES)

### README.md cuenta mal
Dice "12 áreas canónicas" pero hay 13 directorios top-level. Corregir el número.

### README.md cuenta mal skills
Dice "394 source / 407 backup" pero el conteo real es ~369 SKILL.md. Recontar y corregir.

### Conteo de áreas en INDEX_AREA_FUNCTIONAL.md
Dice "12 áreas" pero lista solo 9 en la tabla. Falta agregar las 4 restantes o corregir el número.

### Agent Teams Lite duplicado
`00_Agent_Teams_Lite` aparece en ÁREA 00 y ÁREA 05 del INDEX_AREA_FUNCTIONAL.md. Decidir en cuál debe estar (no eliminar contenido, solo corrección de índice).

---

## REGLAS DE EJECUCIÓN

1. **NO ELIMINAR NADA** — ningún archivo, directorio, ni línea de contenido
2. **NO RENOMBRAR** — no cambiar nombres de directorios ni archivos
3. **NO REESTRUCTURAR** — no mover contenido entre directorios
4. **SOLO TEXTO** — cambiar referencias textuales que apuntan a paths incorrectos
5. **VERIFICAR ANTES DE EDITAR** — confirmar que el archivo existe y el path stale está presente
6. **UN ARCHIVO POR VEZ** — hacer un cambio, verificar, pasar al siguiente
7. **MANTENER FORMATO** — respetar el estilo del archivo original (tables, listas, etc.)
8. **ACTIVO PRIMERO** — los archivos en `01_Personal_Os/` son autoridad; `.agent/` backup se actualiza después

---

## NOTAS TÉCNICAS

- **Rama activa:** verificar con `git branch` antes de empezar
- **Remote:** verificar con `git remote -v`
- **Commits sugeridos:** por fase (1 commit por fase) para mantener trazabilidad
- **Verificación post-cambio:** `grep -r "07_Personal_Os" --include="*.md" --include="*.json" --include="*.yaml" --include="*.mdc" .` para confirmar que no quedaron referencias stale en archivos activos

---

*Plan v1.0 — 2026-05-29 — Basado en auditoría de 16 áreas + 3 revisiones adversariales*
