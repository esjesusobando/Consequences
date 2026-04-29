# 🧪 PLAN DE VALIDACIÓN TOTAL — PersonalOS v2.1 → v2.2 Integrated

**Generado:** 2026-04-25 | **Modelo:** Opus 4.7
**Objetivo:** Probar TODO el OS, integrar todo, corregir rutas viejas residuales, validar las 297 skills, verificar el sistema recursivo, optimizar el llamado de skills (auto-trigger por contexto).

> **Estado actual:** v2.1 Hardened (35/35 tests, ZERO drift). Pero hay residuos de v1.x en código activo y skills no se auto-invocan por contexto.

> **⚠️ UPDATE 2026-04-25:** Issues A1, A2, A3 FUERON CORREGIDOS en sesión v6.2 (protocolo actualizado a `01_Personal_Os/04_Operations/03_Scripts_Os`). A4-A7 siguen PENDIENTES.

---

## 🔍 PARTE 1 — DIAGNÓSTICO (ya hecho)

### 🔴 Issues HIGH detectados

| #            | Issue                                                     | Archivo                                                                                                                      | Línea     | Impacto                              | Estado               |
|--------------|-----------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------|-----------|--------------------------------------|----------------------|
| ~~**A1**~~   | ~~`sys.path.insert(0, str(_root / "03_Scripts_Os"))`~~    | ~~`01_Auditor_Hub.py`~~                                                                                                      | ~~31~~    | ~~Import legacy roto en v2.1~~       | ✅ **FIXED** (v6.2)   |
| ~~**A2**~~   | ~~`sys.path.insert(0, str(_root / "03_Scripts_Os"))`~~    | ~~`02_Git_Hub.py`~~                                                                                                          | ~~19~~    | ~~Mismo problema~~                   | ✅ **FIXED** (v6.2)   |
| ~~**A3**~~   | ~~Dimensión `"03_Scripts_Os"` listada como ENGINE_DIR~~   | ~~`01_Auditor_Hub.py`~~                                                                                                      | ~~65~~    | ~~Reportes muestran nombre viejo~~   | ✅ **FIXED** (v6.2)   |
| **A4**       | 12 reportes huérfanos                                     | `02_Playground/reports/health_*.txt` — debería ir a `01_Personal_Os/04_Operations/00_Context_LLM/11_Reports/` o consolidar   |-----------| 🔴 PENDIENTE                          |
| **A5**       | `04_Engine` mencionado por usuario                        | Buscar carpetas `04_Engine` huérfanas creadas por scripts (no encontradas en código pero pueden existir en disco)            |-----------| 🟡 PENDIENTE                          |
| **A6**       | Skills NO auto-cargan por contexto                        | `CLAUDE.md` describe skills pero no hay context-triggers tipo "si tarea contiene X → leer SKILL.md de Y"                     |-----------| 🟡 PENDIENTE                          |
| **A7**       | `skill-registry.md` incompleto                            | Lista 80+ skills pero hay 297 SKILL.md → falta sincronización masiva                                                         |-----------| 🟡 PENDIENTE                          |
| **A5**       | `04_Engine` mencionado por usuario                        | Buscar carpetas `04_Engine` huérfanas creadas por scripts (no encontradas en código pero pueden existir en disco)            |-----------| 🟡 PENDIENTE                          |
| **A6**       | Skills NO auto-cargan por contexto                        | `CLAUDE.md` describe skills pero no hay context-triggers tipo "si tarea contiene X → leer SKILL.md de Y"                     |-----------| 🟡 PENDIENTE                          |
| **A7**       | `skill-registry.md` incompleto                            | Lista 80+ skills pero hay 297 SKILL.md → falta sincronización masiva                                                         |-----------| 🟡 PENDIENTE                          |

### 🟡 Issues MEDIUM detectados

| #        | Issue                                | Detalle                                                                                                                      |
|----------|--------------------------------------|------------------------------------------------------------------------------------------------------------------------------|
| **A4**   | 12 reportes huérfanos                | `02_Playground/reports/health_*.txt` — debería ir a `01_Personal_Os/04_Operations/00_Context_LLM/11_Reports/` o consolidar   |
| **A5**   | `04_Engine` mencionado por usuario   | Buscar carpetas `04_Engine` huérfanas creadas por scripts (no encontradas en código pero pueden existir en disco)            |
| **A6**   | Skills NO auto-cargan por contexto   | `CLAUDE.md` describe skills pero no hay context-triggers tipo "si tarea contiene X → leer SKILL.md de Y"                     |
| **A7**   | `skill-registry.md` incompleto       | Lista 80+ skills pero hay 297 SKILL.md → falta sincronización masiva                                                         |

### 🟢 Issues LOW

| #        | Issue                                                         | Detalle                         |
|----------|---------------------------------------------------------------|---------------------------------|
| **A8**   | `13_Beautify_Tables.py` muta archivos en lugar de outputear   | Diseño OK pero no documentado   |
| **A9**   | `14_Beauty_Doc.py` igual                                      | Mismo patrón                    |

### ✅ Lo que YA está OK

- Auto-Improvement engine: `--scan`, `--full`, `--learn` operativos
- 4 componentes recursivos presentes (detector/analyzer/executor/learner)
- 297 SKILL.md en 9 áreas
- `skill_validator.py` existe
- Health Test 15/15 + Runtime 20/20 + Sync ZERO drift
- `health_history.csv` correcto en `00_Context_LLM/11_Reports/`

---

## 🛠️ PARTE 2 — FASES DE EJECUCIÓN

### FASE A — Fix Rutas Viejas (~30 min) 🔴 CRÍTICO

**A.1 — Corregir `01_Auditor_Hub.py`**
```python
# ANTES (línea 31)
sys.path.insert(0, str(_root / "03_Scripts_Os"))

# DESPUÉS
sys.path.insert(0, str(_root / "01_Personal_Os" / "04_Operations" / "03_Scripts_Os"))
# O usar config_paths.ENGINE_DIR directamente
```
También fix línea 65: actualizar nombre de dimensión.

**A.2 — Corregir `02_Git_Hub.py`**
Mismo fix que A.1, línea 19.

**A.3 — Buscar carpetas `04_Engine` huérfanas**
```bash
find . -type d -name "04_Engine" 2>/dev/null
find . -type d -name "03_Metrics" -not -path "*/01_Auto_Improvement/*"
```
Si aparecen fuera de `01_Auto_Improvement/`, son creadas por scripts con paths relativos rotos. Mover a destino correcto y fix el script causante.

**A.4 — Consolidar reports huérfanos**
```bash
mkdir -p 01_Personal_Os/04_Operations/00_Context_LLM/11_Reports/legacy_health_logs/
mv 02_Playground/reports/health_*.txt 01_Personal_Os/04_Operations/00_Context_LLM/11_Reports/legacy_health_logs/
```
Decidir si `02_Playground/reports/` debe seguir existiendo o eliminarse.

**A.5 — Auditoría exhaustiva de paths legacy**
Script grep en todo el repo (excluir `05_Archive`, `04_Maerks`):
- `03_Scripts_Os` (sin prefijo correcto)
- `04_Engine` huérfano
- `01_Core/03_Skills` (sin `02_Tools/`)
- `06_Playground` → `02_Playground`
- `07_Projects` → `04_Operations/05_Projects`
- `03_Tasks` → `03_Task` (singular)

Reportar TODOS los matches en archivos activos.

---

### FASE B — Test Suite Total (~45 min)

**B.1 — Health Test estructural**
```bash
python 02_Playground/00_OS_Health_Test.py
# Expected: 15/15 PURE GREEN
```

**B.2 — Runtime Test ejecución**
```bash
python 02_Playground/01_OS_Runtime_Test.py
# Expected: 20/20 PURE GREEN
```

**B.3 — Agent Sync drift**
```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/15_Agent_Sync_Hub.py
# Expected: ZERO DRIFT
```

**B.4 — SOTA Integrity**
```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/13_Auditors_Os/scripts/15_SOTA_Integrity_Check.py
# Expected: 9/9 PASSED
```

**B.5 — Auditor Hub completo**
```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/01_Auditor_Hub.py --dry-run
# Expected: PASS sin warnings de imports
```

**B.6 — Git Hub**
```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/02_Git_Hub.py --status
# Expected: PASS
```

**B.7 — Validator Hub completo**
```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/05_Validator_Hub.py
# Expected: PASS
```

**B.8 — Tour de los 14 HUBs**
Por cada HUB (00-13), invocar `--help` o equivalente:
```bash
for hub in 00_Sound_Engine 01_Auditor_Hub 02_Git_Hub 03_AIPM_Hub \
          04_Ritual_Hub 05_Validator_Hub 06_Tool_Hub 07_Integration_Hub \
          08_Workflow_Hub 09_Data_Hub 10_General_Hub 11_Auto_Learn_Hub \
          12_Context_Usage_Bar 13_Beautify_Tables; do
    python 01_Personal_Os/04_Operations/03_Scripts_Os/${hub}.py --help 2>&1 | head -5
done
```
**Expected:** Todos responden sin crash.

---

### FASE C — Validación Skills 100% (~1h)

**C.1 — Inventario completo**
```bash
find 01_Personal_Os/01_Core/02_Tools/02_Skills/ -name "SKILL.md" | wc -l
# Expected: 297 (o más, no menos)
```

**C.2 — Validador masivo**
```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/03_Validator/skill_validator.py --all
```

**C.3 — Skills sin SKILL.md (huérfanas)**
Encontrar carpetas en `02_Skills/` que NO tienen `SKILL.md`:
```python
# Script ad-hoc — listar dirs sin SKILL.md
for skill_dir in skills_root.rglob("*/"):
    if not (skill_dir / "SKILL.md").exists() and skill_dir.parent.name in AREAS:
        print(f"⚠️ Sin SKILL.md: {skill_dir}")
```

**C.4 — Skills duplicadas**
Detectar skills con el mismo `name:` en frontmatter pero diferente ubicación.

**C.5 — Sincronizar `skill-registry.md`**
Regenerar `.atl/skill-registry.md` para que liste TODAS las 297 skills (no solo 80+).

**C.6 — Skills en `02_Playground/05_New_Skills/` y `04_Maerks/`**
Decidir cuáles integrar al live, cuáles archivar.

---

### FASE D — Validar Sistema Recursivo (~30 min)

**D.1 — Scan rápido**
```bash
python 01_Personal_Os/04_Operations/01_Auto_Improvement/01_Engine/recursive_improvement_engine.py --scan
```
**Verificar:** No crashea, output parseable, escribe en `01_Auto_Improvement/03_Metrics/improvement_log.json`.

**D.2 — Full cycle**
```bash
python 01_Personal_Os/04_Operations/01_Auto_Improvement/01_Engine/recursive_improvement_engine.py --full --dry-run
```
**Verificar:** Detector → Analyzer → Executor → Learner ejecutan en orden.

**D.3 — Validar componentes**
- `detector.py`: ¿qué detecta? listar issue types.
- `analyzer.py`: ¿clasifica bien? Test con issue conocido.
- `executor.py`: ¿aplica fixes? Test en sandbox.
- `learner.py`: ¿escribe en learnings DB? Verificar persistencia.

**D.4 — Schedule recurrente**
Decidir: cron / hook SessionEnd / `/schedule` semanal.
```bash
# /schedule weekly
python 01_Personal_Os/04_Operations/01_Auto_Improvement/01_Engine/recursive_improvement_engine.py --scan
```

---

### FASE E — Optimización Llamado de Skills (~1h) 🚀 CLAVE

**El problema actual:** Skills NO se auto-cargan por contexto. El usuario o el orquestador deben invocarlas manualmente.

**Solución SOTA:** Auto-trigger por contexto en `CLAUDE.md` (similar al patrón en `~/.claude/CLAUDE.md`).

**E.1 — Crear tabla de context-triggers en CLAUDE.md**

Agregar sección al `CLAUDE.md` raíz:
```markdown
## Skills Auto-Loading por Contexto

Cuando detecto cualquiera de estos contextos, leo INMEDIATAMENTE el SKILL.md ANTES de escribir código:

| Contexto detectado                           | Skill a cargar                                              |
|----------------------------------------------|-------------------------------------------------------------|
| Diseño web, UI, frontend visual, landing     | `02_Diseno_Ui_Ux/00_Taste_Skill/SKILL.md`                   |
| Brand voice, voz de marca                    | `01_Creacion_Contenidos/11_Brand_Voice_Guardian/SKILL.md`   |
| Carrusel, contenido visual                   | `01_Creacion_Contenidos/28_Carousel_Master/SKILL.md`        |
| Video prompt, shot list                      | `03_Video_Media/01_Video_Prompt_Builder/SKILL.md`           |
| Testing TDD                                  | `06_Tools/05_Testing/SKILL.md`                              |
| Skill creation                               | `06_Tools/01_Skill_Creator/SKILL.md`                        |
| ... (extender a todas las skills críticas)   |
```

**E.2 — Generar tabla automática**
Script Python que lee TODOS los `SKILL.md`, extrae `description` y `triggers` del frontmatter, genera la tabla.

**E.3 — Pre-Tool hook para auto-loading**
Crear hook en `01_Personal_Os/01_Core/02_Tools/05_Hooks/01_Pre_Tool/skill_autoloader.py`:
- Lee el prompt actual del usuario
- Match contra triggers de skill-registry
- Inyecta el contenido del SKILL.md relevante en el contexto

**E.4 — Compactar skills muy largas**
Skills con >500 líneas → crear versión COMPACT en mismo SKILL.md (frontmatter `compact_rules:`).

**E.5 — Documentar en CLAUDE.md el protocolo**

---

### FASE F — Outputs y Reports Cleanup (~30 min)

**F.1 — Convención de outputs**
Documentar en CLAUDE.md:
```
TODO output de auditor/script va a:
  01_Personal_Os/04_Operations/00_Context_LLM/11_Reports/<categoría>/

TODO plan/propuesta para usuario va a:
  03_Resultado/  (raíz)

TODO output de proyecto activo va a:
  03_Resultado/<nombre_proyecto>/
```

**F.2 — Auditar TODOS los scripts**
Buscar `open(`, `Path(...) / `, `mkdir`. Verificar que escriben en lugar correcto.

**F.3 — Eliminar `04_Engine` huérfanos** (si existen)

**F.4 — Migrar `02_Playground/reports/`** a la convención.

---

### FASE G — VALIDATION GATE TOTAL (15 min)

**Gate completa post-fixes:**

```bash
# 1. Health
python 02_Playground/00_OS_Health_Test.py
# 2. Runtime
python 02_Playground/01_OS_Runtime_Test.py
# 3. Drift
python 01_Personal_Os/04_Operations/03_Scripts_Os/15_Agent_Sync_Hub.py
# 4. SOTA
python 01_Personal_Os/04_Operations/03_Scripts_Os/13_Auditors_Os/scripts/15_SOTA_Integrity_Check.py
# 5. Auto-Improvement
python 01_Personal_Os/04_Operations/01_Auto_Improvement/01_Engine/recursive_improvement_engine.py --scan
# 6. Skill validation masiva
python 01_Personal_Os/04_Operations/03_Scripts_Os/03_Validator/skill_validator.py --all
# 7. Audit completo
python 01_Personal_Os/04_Operations/03_Scripts_Os/01_Auditor_Hub.py --dry-run
# 8. Métricas finales
python 01_Personal_Os/04_Operations/03_Scripts_Os/14_Health_Metrics_Hub.py --record --report
```

**Criterios SOTA Integrated:**
- ✅ 35/35 tests pasando
- ✅ 297/297 skills validadas
- ✅ ZERO drift live ↔ backup
- ✅ ZERO refs `03_Scripts_Os` / `04_Engine` / `06_Playground` en código activo
- ✅ Recursive engine ejecutable sin crash
- ✅ Auto-Loading de skills documentado y operable
- ✅ Outputs centralizados en `11_Reports/` o `03_Resultado/`

---

## ⏱️ PARTE 3 — CRONOGRAMA

| Fase                                 | Duración        | Bloqueante      |
|--------------------------------------|-----------------|-----------------|
| FASE A — Fix rutas viejas            | 30 min          | ✅ Sí            |
| FASE B — Test suite total            | 45 min          | ✅ Sí            |
| FASE C — Validación skills           | 1 h             | ✅ Sí            |
| FASE D — Validar recursivo           | 30 min          | ✅ Sí            |
| FASE E — Optimización auto-loading   | 1 h             | ❌ No (mejora)   |
| FASE F — Outputs cleanup             | 30 min          | ✅ Sí            |
| FASE G — Validation gate             | 15 min          | ✅ Sí            |
| **TOTAL**                            | **~4h 30min**   | —               |
| **Mínimo (sin E)**                   | **~3h 30min**   | —               |

---

## 🎯 PARTE 4 — DECISIONES NECESARIAS

Antes de ejecutar, confirmá:

1. **¿Vamos con todas las fases (~4h30) o sin FASE E (~3h30)?**
2. **FASE E (auto-loading):** ¿Querés generar la tabla automáticamente desde frontmatter o la escribimos manual con las skills más críticas?
3. **FASE A.4 (reports huérfanos):** ¿Mover a `legacy_health_logs/` o eliminar directamente los 12 archivos?
4. **FASE C.5 (skill-registry):** ¿Regenerar de cero el archivo o hacer merge respetando notas manuales existentes?
5. **FASE D.4 (Auto-Improvement schedule):** ¿Hook SessionEnd, cron del SO, o `/schedule` de Claude Code?

---

## 📊 PARTE 5 — MÉTRICAS OBJETIVO

| Métrica                               | Actual v2.1     | Objetivo v2.2 Integrated           |
|---------------------------------------|-----------------|------------------------------------|
| Tests pasando                         | 35/35           | **35/35 + 297 skills validadas**   |
| Refs `03_Scripts_Os` activas          | 2               | **0**                              |
| Carpetas `04_Engine` huérfanas        | ¿?              | **0**                              |
| Reports en lugar correcto             | parcial         | **100%**                           |
| Skills auto-loadeables por contexto   | 0               | **≥ 30 críticas**                  |
| Skill-registry sync                   | 80+/297         | **297/297**                        |
| Recursive engine ejecutable           | ✅               | ✅ + scheduled                      |
| Outputs centralizados                 | parcial         | **convención documentada**         |

---

## 🔧 PARA EL PRÓXIMO AGENTE: Cómo continuar

Si te quedás sin contexto en medio de la ejecución:

1. **Leer este plan:** `01_PLAN_VALIDACION_TOTAL_OS.md`
2. **Ver el estado del git:** `git log --oneline -10` + `git status`
3. **Revisar último commit de SOTA:** `a1fa1e1`
4. **Saber dónde estamos:** Buscar en este plan qué fase tiene ✅ y cuál ⏳
5. **Continuar desde la fase pendiente**

### Fases marcables:
- [x] FASE A — Fix rutas办事处
  - [x] A.1 — `01_Auditor_Hub.py` línea 31 + 65
  - [x] A.2 — `02_Git_Hub.py` línea 19
  - [x] A.3 — Buscar `04_Engine` huérfanos
  - [x] A.4 — Consolidar 12 health_*.txt
  - [x] A.5 — Grep exhaustivo legacy paths
- [ ] FASE B — Test suite total
  - [ ] B.1 a B.8 — los 8 tests
- [ ] FASE C — Validación skills 100%
  - [ ] C.1 — Inventario
  - [ ] C.2 — Validador masivo
  - [ ] C.3 — Skills huérfanas
  - [ ] C.4 — Duplicadas
  - [ ] C.5 — Sync registry
  - [ ] C.6 — New_Skills + Maerks
- [ ] FASE D — Validar recursivo
  - [ ] D.1 — Scan rápido
  - [ ] D.2 — Full cycle
  - [ ] D.3 — Componentes
  - [ ] D.4 — Schedule
- [ ] FASE E — Auto-loading skills
  - [ ] E.1 — Tabla en CLAUDE.md
  - [ ] E.2 — Script generador
  - [ ] E.3 — Hook autoloader
  - [ ] E.4 — Compactar skills largas
  - [ ] E.5 — Documentar
- [ ] FASE F — Outputs cleanup
  - [ ] F.1 — Convención
  - [ ] F.2 — Audit scripts
  - [ ] F.3 — Eliminar 04_Engine
  - [ ] F.4 — Migrar reports
- [ ] FASE G — Validation Gate Total

---

_PersonalOS v2.1 → v2.2 Integrated — Plan generado 2026-04-25 con Opus 4.7_
_Pre-requisito: v2.1 Hardened (commit a1fa1e1) — ✅ cumplido_
