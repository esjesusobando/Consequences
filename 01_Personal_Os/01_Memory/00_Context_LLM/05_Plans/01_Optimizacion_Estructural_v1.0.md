# Plan de Optimización Estructural v1.0

> **Objetivo:** Reducir carpetas duplicadas, consolidar skills legacy, optimizar estructura sin perder información.
> **Principio rector:** NO eliminar info — consolidar, mergear, archivar.
> **Fecha:** 2026-05-27
> **Estado:** Propuesto

---

## Diagnóstico Actual

| Área               | Estado                                                | Prioridad  |
|-------------------|------------------------------------------------------|-----------|
| 02_Diseno_Ui_Ux    | 17 dirs → ~7 skills reales (10 duplicados numerados)  | 🔴 ALTA     |
| 06_Tools           | 30 dirs → ~10 skills reales (20 legacy numerados)     | 🔴 ALTA     |
| 00_Context_Memory  | 47 archivos, 21 archive, 6 JSONs, naming inconsistente| 🟡 MEDIA    |
| 02_Knowledge_Brain | 25 archivos planos sin índice de búsqueda             | 🟡 MEDIA    |
| .agent mirror      | 13 skills extra (Agent_Teams_Lite) sin sync           | 🟡 MEDIA    |
| 08_Evals           | 1 solo eval real, framework vacío                     | 🟢 BAJA     |
| 09_Auto-Improvement| **NO existe** — hay que crearlo                       | 🟢 BAJA     |
| Archive            | Bien organizado (00_Skills_Legacy con 22 dirs)        | 🟢 OK       |

---

## Fase 1: Consolidación 02_Diseno_Ui_Ux (17 → 7 dirs)

### Problema
17 directorios para ~7 skills reales. Duplicados por numeración legacy (07-13).

### Mapeo Actual → Target

| #  | Directorio Actual      | Contenido Real      | Acción                         |
|---|-----------------------|--------------------|-------------------------------|
| 01 | 01_Product_Design      | Product Design skill| ✅ CONSERVAR                    |
| 02 | 02_Taste_Skills        | Taste/Design Taste  | ✅ CONSERVAR                    |
| 03 | 03_Diseno_Minimalista  | Minimalist Design   | ✅ CONSERVAR                    |
| 04 | 04_Directrices_Marca   | Brand Guidelines    | ✅ CONSERVAR                    |
| 05 | 05_Excalidraw_Flowchart| Excalidraw/Diagramas| ✅ CONSERVAR                    |
| 06 | 06_Design_Sota         | Design SOTA         | ✅ CONSERVAR                    |
| 07 | 07_Marvel_Avengers     | Marvel/UI Theme     | ✅ CONSERVAR (único)            |
| 07 | 07_Ui_Ux_Pro_Max       | UI/UX Pro Max       | 🔀 MERGE con 08_Ui_Ux_Pro_Max   |
| 08 | 08_Huashu_Design       | Huashu Design A     | 🔀 MERGE con 09_Huashu_Design   |
| 08 | 08_Ui_Ux_Pro_Max       | UI/UX Pro Max B     | 🔀 MERGE con 07_Ui_Ux_Pro_Max   |
| 09 | 09_Dumbledor_Design    | Dumbledor Design A  | 🔀 MERGE con 11_Dumbledor_Design|
| 09 | 09_Huashu_Design       | Huashu Design B     | 🔀 MERGE con 08_Huashu_Design   |
| 10 | 10_Design_Systems      | Design Systems A    | 🔀 MERGE con 11/12/13           |
| 11 | 11_Design_Systems      | Design Systems B    | 🔀 MERGE con 10/12/13           |
| 11 | 11_Dumbledor_Design    | Dumbledor Design B  | 🔀 MERGE con 09_Dumbledor_Design|
| 12 | 12_Design_Systems      | Design Systems C    | 🔀 MERGE con 10/11/13           |
| 13 | 13_Design_Systems      | Design Systems D    | 🔀 MERGE con 10/11/12           |

### Árbol Target (7 directorios)

```
02_Diseno_Ui_Ux/
├── 01_Product_Design/          # Conservado
├── 02_Taste_Skills/            # Conservado
├── 03_Diseno_Minimalista/      # Conservado
├── 04_Directrices_Marca/       # Conservado
├── 05_Excalidraw_Flowchart/    # Conservado (renombrar a Canvas_Diagram_Studio?)
├── 06_Design_Sota/             # Conservado
├── 07_Ui_Ux_Pro_Max/           # MERGE 07+08
├── 08_Huashu_Design/           # MERGE 08+09
├── 09_Dumbledor_Design/        # MERGE 09+11
├── 10_Design_Systems/          # MERGE 10+11+12+13
└── 11_Marvel_Avengers/         # Conservado (renumerado)
```

**Nota:** Se puede considerar renombrar `11_Marvel_Avengers` a `07_Marvel_Avengers` y recorrer numeración, pero no es crítico. El numbering es solo orden, no funcional.

### Procedimiento por skill (ejemplo: Huashu_Design)
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
# etc.
```

---

## Fase 2: Consolidación 06_Tools (30 → 12 dirs)

### Problema
30 directorios para ~10 skills reales. Duplicación masiva por numeración legacy (10-23).

### Mapeo Actual → Target

| Dirs Actuales                                                                                                                 | Skill Real                 | Acción                   |
|------------------------------------------------------------------------------------------------------------------------------|---------------------------|-------------------------|
| 01_Skill_Creator                                                                                                              | Skill Creator              | ✅ CONSERVAR              |
| 02_Skill_Template                                                                                                             | Skill Template             | ✅ CONSERVAR              |
| 03_Anthropic_Harness                                                                                                          | Anthropic Harness          | ✅ CONSERVAR              |
| 04_DevOps                                                                                                                     | DevOps                     | ✅ CONSERVAR              |
| 05_Vibe_Coding                                                                                                                | Vibe Coding                | ✅ CONSERVAR              |
| 06_Testing                                                                                                                    | Testing                    | ✅ CONSERVAR              |
| 07_Performance                                                                                                                | Performance                | ✅ CONSERVAR              |
| 08_Skill_Creator_Invictus, 11_Skill_Creator_Invictus                                                                          | Skill Creator Invictus     | 🔀 MERGE 08+11            |
| 09_Accessibility, 12_Accessibility                                                                                            | Accessibility              | 🔀 MERGE 09+12            |
| 10_Octopus                                                                                                                    | Octopus                    | ✅ CONSERVAR (único)      |
| 13_Doc_Processing, 15_Doc_Processing, 16_Doc_Processing                                                                       | Doc Processing             | 🔀 MERGE 13+15+16         |
| 14_Qmd, 16_Qmd, 17_Qmd, 18_Qmd, 19_Qmd, 20_Qmd                                                                                | Qmd                        | 🔀 MERGE 14+16+17+18+19+20|
| 17_System_Master, 19_System_Master, 21_System_Master, 22_System_Master                                                        | System Master              | 🔀 MERGE 17+19+21+22      |
| 19_Silicon_Valley_Data_Analyst, 21_Silicon_Valley_Data_Analyst, 22_Silicon_Valley_Data_Analyst, 23_Silicon_Valley_Data_Analyst| Silicon Valley Data Analyst| 🔀 MERGE 19+21+22+23      |
| 23_Ai_News_Weekly_Report                                                                                                      | AI News Weekly Report      | ✅ CONSERVAR (único)      |

### Árbol Target (12 directorios)

```
06_Tools/
├── 01_Skill_Creator/              # Conservado
├── 02_Skill_Template/             # Conservado
├── 03_Anthropic_Harness/          # Conservado
├── 04_DevOps/                     # Conservado
├── 05_Vibe_Coding/                # Conservado
├── 06_Testing/                    # Conservado
├── 07_Performance/                # Conservado
├── 08_Skill_Creator_Invictus/     # MERGE 08+11
├── 09_Accessibility/              # MERGE 09+12
├── 10_Octopus/                    # Conservado
├── 11_Doc_Processing/             # MERGE 13+15+16
├── 12_Qmd/                        # MERGE 14+16+17+18+19+20
├── 13_System_Master/              # MERGE 17+19+21+22
├── 14_Silicon_Valley_Data_Analyst/ # MERGE 19+21+22+23
└── 15_Ai_News_Weekly_Report/      # Conservado
```

### Procedimiento
1. Por cada skill con duplicados: mergear SKILL.md + assets en el directorio target más completo
2. Mover duplicados a `05_Archive/02_Skills_Legacy/06_Tools/`
3. Actualizar referencias cruzadas en TOP_20_SKILLS.md y otros índices

---

## Fase 3: Context Memory Cleanup (47 → ~25 archivos)

### Problema
- 21 archivos en `_archive/` con naming inconsistente (`01_CTX_*`, `02_CTX_*`, etc.)
- 6 JSONs de validación que ocupan espacio
- Sesiones duplicadas (ej: `22_CTX_Session_2026-05-22` y `08_CTX_Session_2026-05-22`)
- Naming no estandarizado

### Acciones

| #  | Archivo                           | Acción                                         |
|---|----------------------------------|-----------------------------------------------|
| 1  | `_archive/` completo (21 archivos)| ✅ CONSERVAR pero indexar en README             |
| 2  | `_jsons/` (6 archivos)            | Comprimir a 1 archivo o archivar fuera del repo|
| 3  | Archivos duplicados de sesión     | Mergear contenidos, archivar versiones viejas  |
| 4  | `README.md`                       | Actualizar con índice de todos los archivos    |
| 5  | `session_summary.txt`             | Convertir a markdown y numerar                 |

### Estandarización de Naming
```
CTX_YYYY-MM-DD_DescripcionBreve.md
Ej: CTX_2026-05-27_Plan_Optimizacion.md
```

### Archivos Raíz Target (~20 archivos)
```
00_Context_Memory/
├── CTX_2026-03-20_System_Architecture.md      # (ex 01)
├── CTX_2026-03-21_Agent_Ecosystem.md           # (ex 02)
├── CTX_2026-04-20_Operations_History.md        # (ex 03)
├── CTX_2026-04-21_Auditoria_Rutas.md           # (ex 04)
├── CTX_2026-04-23_Auditoria_v1.2.md            # (ex 04)
├── CTX_2026-04-23_Session_Archive.md           # (ex 03 alt)
├── CTX_2026-04-25_Session.md                   # (ex 05)
├── CTX_2026-05-11_Session.md                   # (ex 06)
├── CTX_2026-05-19_Session.md                   # (ex 07)
├── CTX_2026-05-22_Session.md                   # (ex 08)
├── CTX_2026-05-22_Plan_Resolution.md           # (ex 22)
├── CTX_2026-05-23_Session.md                   # (ex 09)
├── CTX_2026-05-24_SOTA_Audit.md                # (ex 23)
├── CTX_2026-05-25_Auditoria_OS_Completa.md     # (ex 10)
├── CTX_2026-05-26_Auditoria_v4.8_Skills.md     # (ex 11)
├── CTX_2026-05-27_Sesion_Auditoria_Arte.md     # (ex 01 alt)
├── README.md                                    # Índice maestro
├── _archive/                                    # Sesiones cerradas (< 2026-04)
└── _jsons/                                      # (comprimir o mover a 03_Backups_Audits)
```

---

## Fase 4: Knowledge Brain Index

### Problema
25 archivos planos en un solo nivel + 1 subdirectorio `00_Library_PDFs/`. Sin índice de búsqueda.

### Acciones
1. **Crear `INDEX.md`** con tabla de contenidos categorizada:
   - 📚 Reference Guides (01-08)
   - 🎓 Courses & Learning (09)
   - 🔧 Technical Docs (10-13)
   - 📄 PDF Library (00_Library_PDFs)
2. **Mover PDFs** a subdirectorios por tema si > 10 archivos
3. **Asegurar naming consistente**: `NN_Descripcion.md`

---

## Fase 5: Evals + Auto-Improvement Resurrection

### Evals (08_Evals)
- Estado: 1 eval + README
- Acción: Agregar template de eval y 2-3 evals de ejemplo
- Crear subdirectorios: `01_Agente_Evals/`, `02_System_Evals/`, `03_Templates/`

### Auto-Improvement (nuevo: 09_Auto_Improvement)
- Estado actual: NO EXISTE (09 es Templates)
- Acción: Crear `09_Auto_Improvement/` con:
  - `01_Engine/` — scripts de mejora automática
  - `02_Schedules/` — definiciones de periodicidad
  - `03_Reports/` — output de ejecuciones
  - `README.md` — instrucciones de uso
- Renombrar `09_Templates` → `10_Templates` (o dejarlo donde está y poner 09 como Auto-Improvement)

---

## Fase 6: .agent Mirror Sync Protocol

### Problema
.agent tiene 13 skills extra en `00_Agent_Teams_Lite/` que no existen en el árbol principal.
Son skills válidos (SDD flow: init, explore, propose, spec, design, tasks, apply, verify, archive + judgment_day, go_testing, branch_pr, issue_creation).

### Decisión
Estos skills existen SOLO en .agent. Pueden ser:
- **Opción A (sync a main)**: Copiarlos a `00_Core/02_Tools/02_Skills/00_Agent_Teams_Lite/`
- **Opción B (document drift)**: Documentar que .agent tiene skills extras intencionales para el ecosistema OpenCode

**Recomendación**: Opción A — sync para mantener consistencia. Los skills SDD son funcionales y deberían estar disponibles desde el árbol principal.

---

## Resumen de Impacto

| Métrica             | Antes    | Después   | Reducción  |
|--------------------|---------|----------|-----------|
| 02_Diseno_Ui_Ux dirs| 17       | 10        | **41%**    |
| 06_Tools dirs       | 30       | 15        | **50%**    |
| Context Memory raíz | 26       | ~20       | **23%**    |
| Context Memory total| 47       | ~27       | **43%**    |
| .agent drift        | 13 extras| 0 (synced)| **100%**   |

---

## Orden de Ejecución Recomendado

```
Semana 1: Fase 1 (Diseno_Ui_Ux) + Fase 2 (06_Tools) — alto impacto visual
Semana 2: Fase 3 (Context Memory) + Fase 4 (Knowledge Brain) — organización interna
Semana 3: Fase 5 (Evals + Auto-Improvement) + Fase 6 (.agent sync) — madurez
```

Cada fase es **independiente** y puede ejecutarse en cualquier orden si hay restricciones de tiempo.

---

## Riesgos y Mitigaciones

| Riesgo                                     | Mitigación                                     |
|-------------------------------------------|-----------------------------------------------|
| Perder info en merge de SKILL.md duplicados| Diff manual antes de merge, backup a Archive   |
| Ruptura de referencias en HUB_CATALOG.md   | Actualizar HUB_CATALOG.md después de cada merge|
| .agent mirror out of sync post-merge       | Script de sync automatizado                    |
| Context Memory renaming rompe enlaces      | Usar symlinks o archivo de mapeo old→new       |
