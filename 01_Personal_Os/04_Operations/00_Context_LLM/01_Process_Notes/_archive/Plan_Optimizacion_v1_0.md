> ⚠️ DOCUMENTO HISTÓRICO — fecha desconocida
> Este documento es un registro histórico del sistema. Los conteos y métricas pueden estar desactualizados.
> Para el estado actual del sistema, ver Structure_v5.0.md o README.md.

---

# Plan_Optimizacion_Estructural_v1_0

> **Objetivo:** Reducir carpetas duplicadas, consolidar skills legacy, optimizar estructura sin perder información.
> **Principio rector:** No eliminar info — consolidar, mergear, archivar.
> **Fecha:** 2026-05-27
> **Estado:** Fase 1 Completada, Fase 2 Completada, Fase 3 Completada, Fase 4 Completada, Fase 5 Completada, Fase 6 Completada
> **Fecha ultima actualizacion:** 2026-05-28
> **Nota de paths:** Los paths en este plan usan la estructura VIEJA (02_Diseno_Ui_Ux/, 06_Tools/ en raiz).
> La estructura REAL los tiene en `01_Personal_Os/01_Core/02_Tools/02_Skills/02_Diseno_Ui_Ux/` y
> `01_Personal_Os/01_Core/02_Tools/02_Skills/06_Tools/`. Los merges aplican igual.

---

## Diagnostico_Actual

| Area               | Estado                                                                                     | Prioridad  |
|-------------------|-------------------------------------------------------------------------------------------|-----------|
| 02_Diseno_Ui_Ux    | 17 dirs -> ~7 skills reales (10 duplicados numerados)                                      | Alta       |
| 06_Tools           | 30 dirs -> ~10 skills reales (20 legacy numerados)                                         | Alta       |
| 00_Context_Memory  | 47 archivos, 21 archive, 6 jsons, naming inconsistente                                     | Media      |
| 02_Knowledge_Brain | 25 archivos planos sin indice de busqueda                                                  | Media      |
| .agent mirror      | 13 skills extra (Agent_Teams_Lite) sin sync                                                | Media      |
| 08_Evals           | 1 solo eval real, framework vacio                                                          | Baja       |
| 01_Auto_Improvement| **Existe en 04_Operations/ con 48 archivos** — engine completo pero sin ejecucion periodica| Baja       |
| Archive            | Bien organizado (00_Skills_Legacy con 22 dirs)                                             | Ok         |

> **Correccion:** Auto_Improvement NO esta en 02_Tools/09. Vive en `04_Operations/01_Auto_Improvement/` con 6 modulos (Engine, Rules, Metrics, Triggers, Backups, Utils) + 48 archivos. No hay que crearlo, hay que reactivarlo.

---

## Fase_1: Consolidacion_02_Diseno_Ui_Ux (17 -> 11 dirs)

> **Estado: COMPLETADA** (2026-05-27)
> **Resultado:** 17 -> 11 directorios (se archivaron 6 skills duplicadas)
> **Accion:** \[x\] Merges ejecutados \[x\] Archive sync \[x\] README actualizado \[x\] INDEX_AREA_FUNCTIONAL actualizado

### Problema
17 directorios para ~7 skills reales. Duplicados por numeracion legacy (07-13).

### Mapeo_Actual -> Target

| #  | Directorio_Actual      | Contenido_Real      | Accion                       |
|---|-----------------------|--------------------|-----------------------------|
| 01 | 01_Product_Design      | Product Design skill| Conservar                    |
| 02 | 02_Taste_Skills        | Taste/Design Taste  | Conservar                    |
| 03 | 03_Diseno_Minimalista  | Minimalist Design   | Conservar                    |
| 04 | 04_Directrices_Marca   | Brand Guidelines    | Conservar                    |
| 05 | 05_Excalidraw_Flowchart| Excalidraw/Diagramas| Conservar                    |
| 06 | 06_Design_Sota         | Design SOTA         | Conservar                    |
| 07 | 07_Marvel_Avengers     | Marvel/UI Theme     | Conservar (unico)            |
| 07 | 07_Ui_Ux_Pro_Max       | UI/UX Pro Max A     | Merge con 08_Ui_Ux_Pro_Max   |
| 08 | 08_Huashu_Design       | Huashu Design A     | Merge con 09_Huashu_Design   |
| 08 | 08_Ui_Ux_Pro_Max       | UI/UX Pro Max B     | Merge con 07_Ui_Ux_Pro_Max   |
| 09 | 09_Dumbledor_Design    | Dumbledor Design A  | Merge con 11_Dumbledor_Design|
| 09 | 09_Huashu_Design       | Huashu Design B     | Merge con 08_Huashu_Design   |
| 10 | 10_Design_Systems      | Design Systems A    | Merge con 11/12/13           |
| 11 | 11_Design_Systems      | Design Systems B    | Merge con 10/12/13           |
| 11 | 11_Dumbledor_Design    | Dumbledor Design B  | Merge con 09_Dumbledor_Design|
| 12 | 12_Design_Systems      | Design Systems C    | Merge con 10/11/13           |
| 13 | 13_Design_Systems      | Design Systems D    | Merge con 10/11/12           |

### Arbol_Target (11 directorios)

```
02_Diseno_Ui_Ux/
 01_Product_Design/           # Conservado
 02_Taste_Skills/             # Conservado
 03_Diseno_Minimalista/       # Conservado
 04_Directrices_Marca/        # Conservado
 05_Excalidraw_Flowchart/     # Conservado
 06_Design_Sota/              # Conservado
 07_Ui_Ux_Pro_Max/            # [OK] Merge 07+08
 08_Huashu_Design/            # [OK] Merge 08+09
 09_Dumbledor_Design/         # [OK] Merge 09+11
 10_Design_Systems/           # [OK] Merge 10+11+12+13 (canonico: version 12/13 con frontmatter especifico)
 11_Marvel_Avengers/          # [OK] Renumerado desde 07
```

Archivado en: `05_Archive/02_Skills_Legacy/02_Diseno_Ui_Ux/` (08_Ui_Ux_Pro_Max, 09_Huashu_Design, 11_Dumbledor_Design, 11/12/13_Design_Systems)

### Procedimiento_por_Skill (ejemplo: Huashu_Design)

```bash
# 1. Crear directorio temporal de merge
mkdir -p 02_Diseno_Ui_Ux/08_Huashu_Design
# 2. Copiar todo de 08_Huashu_Design + 09_Huashu_Design
cp -r 02_Diseno_Ui_Ux/08_Huashu_Design/* 02_Diseno_Ui_Ux/08_Huashu_Design/
cp -r 02_Diseno_Ui_Ux/09_Huashu_Design/* 02_Diseno_Ui_Ux/08_Huashu_Design/
# 3. Resolver conflictos manualmente (SKILL.md duplicados)
# 4. Mover legacy a Archive
mkdir -p 05_Archive/02_Skills_Legacy/02_Diseno_Ui_Ux/
mv 02_Diseno_Ui_Ux/09_Huashu_Design 05_Archive/02_Skills_Legacy/02_Diseno_Ui_Ux/
mv 02_Diseno_Ui_Ux/08_Ui_Ux_Pro_Max 05_Archive/02_Skills_Legacy/02_Diseno_Ui_Ux/
```

---

## Fase_2: Consolidacion_06_Tools (30 -> 15 dirs)

> **Estado: COMPLETADA** (2026-05-28)
> **Resultado:** 30 -> 15 directorios (se archivaron 12 skills duplicadas)
> **Accion:** \[x\] Merges ejecutados \[x\] Archive sync \[x\] README actualizado \[x\] INDEX_AREA_FUNCTIONAL actualizado

### Problema
30 directorios para ~10 skills reales. Duplicacion masiva por numeracion legacy (10-23).

### Mapeo_Actual -> Target

| Dirs_Actuales                                                                                                                 | Skill_Real                 | Accion                 |
|------------------------------------------------------------------------------------------------------------------------------|---------------------------|-----------------------|
| 01_Skill_Creator                                                                                                              | Skill Creator              | Conservar              |
| 02_Skill_Template                                                                                                             | Skill Template             | Conservar              |
| 03_Anthropic_Harness                                                                                                          | Anthropic Harness          | Conservar              |
| 04_DevOps                                                                                                                     | DevOps                     | Conservar              |
| 05_Vibe_Coding                                                                                                                | Vibe Coding                | Conservar              |
| 06_Testing                                                                                                                    | Testing                    | Conservar              |
| 07_Performance                                                                                                                | Performance                | Conservar              |
| 08_Skill_Creator_Invictus, 11_Skill_Creator_Invictus                                                                          | Skill Creator Invictus     | Merge 08+11            |
| 09_Accessibility, 12_Accessibility                                                                                            | Accessibility              | Merge 09+12            |
| 10_Octopus                                                                                                                    | Octopus                    | Conservar (unico)      |
| 13_Doc_Processing, 15_Doc_Processing, 16_Doc_Processing                                                                       | Doc Processing             | Merge 13+15+16         |
| 14_Qmd, 16_Qmd, 17_Qmd, 18_Qmd, 19_Qmd, 20_Qmd                                                                                | Qmd                        | Merge 14+16+17+18+19+20|
| 17_System_Master, 19_System_Master, 21_System_Master, 22_System_Master                                                        | System Master              | Merge 17+19+21+22      |
| 19_Silicon_Valley_Data_Analyst, 21_Silicon_Valley_Data_Analyst, 22_Silicon_Valley_Data_Analyst, 23_Silicon_Valley_Data_Analyst| Silicon Valley Data Analyst| Merge 19+21+22+23      |
| 23_Ai_News_Weekly_Report                                                                                                      | AI News Weekly Report      | Conservar (unico)      |

### Arbol_Target (15 directorios)

```
06_Tools/
 01_Skill_Creator/               # Conservado
 02_Skill_Template/              # Conservado
 03_Anthropic_Harness/           # Conservado
 04_DevOps/                      # Conservado
 05_Vibe_Coding/                 # Conservado
 06_Testing/                     # Conservado
 07_Performance/                 # Conservado
 08_Skill_Creator_Invictus/      # Merge 08+11
 09_Accessibility/               # Merge 09+12
 10_Octopus/                     # Conservado
 11_Doc_Processing/              # Merge 13+15+16
 12_Qmd/                         # Merge 14+16+17+18+19+20
 13_System_Master/               # Merge 17+19+21+22
 14_Silicon_Valley_Data_Analyst/ # Merge 19+21+22+23
 15_Ai_News_Weekly_Report/       # Conservado
```

### Procedimiento
1. Por cada skill con duplicados: mergear SKILL.md + assets en el directorio target mas completo
2. Mover duplicados a `05_Archive/02_Skills_Legacy/06_Tools/`
3. Actualizar referencias cruzadas en TOP_20_SKILLS.md y otros indices

---

## Fase_3: Context_Memory_Cleanup (47 -> ~27 archivos)

> **Estado: COMPLETADA** (2026-05-28)
> **Resultado:** 17 archivos CTX renombrados a formato estándar, 6 JSONs archivados a backups, Plan_Migracion movido a 05_Plans/
> **Accion:** \[x\] Renaming completo \[x\] Clashes resueltos \[x\] JSONs archivados \[x\] README actualizado \[x\] session_summary.txt convertido a .md

### Problema
- 21 archivos en `_archive/` con naming inconsistente
- 6 jsons de validacion que ocupan espacio
- Sesiones duplicadas (ej: `22_CTX_Session_2026-05-22` y `08_CTX_Session_2026-05-22`)
- Naming no estandarizado

### Acciones

| #  | Archivo                           | Accion                                         |
|---|----------------------------------|-----------------------------------------------|
| 1  | `_archive/` completo (21 archivos)| Conservar pero indexar en README               |
| 2  | `_jsons/` (6 archivos)            | Comprimir a 1 archivo o archivar fuera del repo|
| 3  | Archivos duplicados de sesion     | Mergear contenidos, archivar versiones viejas  |
| 4  | `README.md`                       | Actualizar con indice de todos los archivos    |
| 5  | `session_summary.txt`             | Convertir a markdown y numerar                 |

### Estandarizacion_de_Naming

Formato: `CTX_YYYY_MM_DD_Descripcion_Breve.md`
Ejemplo: `CTX_2026_05_27_Plan_Optimizacion.md`

### Archivos_Raiz_Target (~20 archivos)

```
00_Context_Memory/
 CTX_2026_03_20_System_Architecture.md       # ex 01
 CTX_2026_03_21_Agent_Ecosystem.md            # ex 02
 CTX_2026_04_20_Operations_History.md         # ex 03
 CTX_2026_04_21_Auditoria_Rutas.md            # ex 04
 CTX_2026_04_23_Auditoria_v1_2.md             # ex 04 alt
 CTX_2026_04_23_Session_Archive.md            # ex 03 alt
 CTX_2026_04_25_Session.md                    # ex 05
 CTX_2026_05_11_Session.md                    # ex 06
 CTX_2026_05_19_Session.md                    # ex 07
 CTX_2026_05_22_Session.md                    # ex 08
 CTX_2026_05_22_Plan_Resolution.md            # ex 22
 CTX_2026_05_23_Session.md                    # ex 09
 CTX_2026_05_24_SOTA_Audit.md                 # ex 23
 CTX_2026_05_25_Auditoria_OS_Completa.md      # ex 10
 CTX_2026_05_26_Auditoria_v4_8_Skills.md      # ex 11
 CTX_2026_05_27_Sesion_Auditoria_Arte.md      # ex 01 alt
 README.md                                     # Indice maestro
 _archive/                                     # Sesiones cerradas (< 2026-04)
 _jsons/                                       # Comprimir o mover a 03_Backups_Audits
```

---

## Fase_4: Knowledge_Brain_Index

> **Estado: COMPLETADA** (2026-05-28)
> **Resultado:** INDEX.md creado con 4 categorias, clash #13 resuelto, tree.txt eliminado, README actualizado
> **Accion:** [x] INDEX.md creado [x] Clash 13→14 [x] tree.txt removed [x] README updated

### Problema
25 archivos planos en un solo nivel + 1 subdirectorio `00_Library_PDFs/`. Sin indice de busqueda.

### Acciones
1. **Crear `INDEX.md`** con tabla de contenidos categorizada:
   - Reference Guides (01-05)
   - Frameworks & Methodology (06-09)
   - Technical Docs (10-14)
   - PDF Library (00_Library_PDFs)
2. **Mover PDFs** a subdirectorios por tema si > 10 archivos (solo 9 PDFs — no necesario)
3. **Asegurar naming consistente**: `NN_Descripcion.md` — verificado: 14 archivos sin clashes

---

## Fase_5: Evals_Reactivation + Auto_Improvement_Reactivation

> **Estado: COMPLETADA** (2026-05-28)
> **Resultado:** Evals restructurado con 3 subdirectorios + template. Auto_Improvement verificado SOTA y vinculado a Evals.
> **Accion:** [x] Subdirectorios creados [x] Template creado [x] System Evals examples [x] README actualizado [x] Link Auto_Improvement↔Evals

### Evals (08_Evals en 02_Tools)
- Estado anterior: 1 eval + README
- Accion completada:
  1. Subdirectorios: `01_Agente_Evals/`, `02_System_Evals/`, `03_Templates/`
  2. Template de eval creado (`03_Templates/EV_Template.md`)
  3. 2 system evals de ejemplo creados
  4. README actualizado con integracion Auto_Improvement

### Auto_Improvement (01_Auto_Improvement en 04_Operations)
- Estado: **SOTA — funcional** (no requeria cambios)
- Pipeline: Detector ✅ → Analyzer ✅ → Executor (stub) ✅ → Learner ✅
- Triggers: manual + cron (Task Scheduler cada 8h)
- Integracion: vinculado a 08_Evals para feedback loop

---

## Fase_6: Agent_Mirror_Sync_Protocol

> **Estado: COMPLETADA** (2026-05-28)
> **Resultado:** 00_Agent_Teams_Lite sincronizado al arbol principal + INDEX actualizado
> **Accion:** [x] Copia completa [x] diff verify IDENTICAL [x] INDEX_AREA_FUNCTIONAL actualizado

### Problema
.agent tiene 14 skills extra en `00_Agent_Teams_Lite/` que no existen en el arbol principal.
Son skills: 01_Shared, 02-10_Sdd_*, 11_Judgment_Day, 12_Go_Testing, 13_Branch_Pr, 14_Issue_Creation.

### Decision
- **Opcion A (sync a main)**: Copiarlos a `01_Core/02_Tools/02_Skills/00_Agent_Teams_Lite/`
- ~~**Opcion B (document drift)**~~: No seleccionada

**Resultado:** Opcion A ejecutada. Verificacion diff: IDENTICAL.

---

## Resumen_de_Impacto

| Metrica                | Antes                     | Despues                    | Reduccion           |
|-----------------------|--------------------------|---------------------------|--------------------|
| 02_Diseno_Ui_Ux dirs   | 17                        | 11                         | 35%                 |
| 06_Tools dirs          | 30                        | 15                         | 50%                 |
| Context Memory raiz    | 26                        | 18                         | 31%                 |
| Context Memory total   | 47                        | 40 (18 raiz + 22 archive)  | 15% (JSONs migrados)|
| Process Notes clashes  | 5 (01,10,17 + 2 no-prefix)| 0                          | 100% resuelto       |
| Knowledge_Brain clashes| 1 (#13)                   | 0                          | 100% resuelto       |
| .agent drift           | 14 extras                 | 0 (synced)                 | 100%                |
| Evals estructura       | Plana                     | 3 subdirectorios + template| Framework creado    |

---

## Orden_de_Ejecucion_Recomendado

```
Semana 1: Fase 1 (Diseno_Ui_Ux) + Fase 2 (06_Tools) — alto impacto visual ✅
Semana 2: Fase 3 (Context_Memory) + Fase 4 (Knowledge_Brain) — organizacion interna ✅ (F3 completada)
Semana 3: Fase 5 (Evals + Auto_Improvement) + Fase 6 (.agent sync) — madurez
```

Cada fase es **independiente** y puede ejecutarse en cualquier orden.

---

## Riesgos_y_Mitigaciones

| Riesgo                                      | Mitigacion                                     |
|--------------------------------------------|-----------------------------------------------|
| Perder info en merge de SKILL.md duplicados | Diff manual antes de merge, backup a Archive   |
| Ruptura de referencias en HUB_CATALOG.md    | Actualizar HUB_CATALOG.md despues de cada merge|
| .agent mirror out of sync post-merge        | Script de sync automatizado                    |
| Context Memory renaming rompe enlaces       | Usar symlinks o archivo de mapeo old->new      |
| Auto_Improvement scripts con paths obsoletos| Revisar paths en scripts post-consolidacion    |
