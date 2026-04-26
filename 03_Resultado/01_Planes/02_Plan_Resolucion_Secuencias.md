# Plan: Resolución de Secuencias Numéricas

**Fecha:** 2026-04-26
**Estado:** PENDIENTE DE APROBACIÓN
**Secuencia:** Ejecución FASE 3 → FASE 4 (según Plan Consequences 3.0)

---

## Contexto

Tras completar el Plan Consequences 3.0 (JARVIS Integration), queda pendiente validar y resolver las carpetas numeradas que están fuera de secuencia.

Las carpetas `00_*` **NO se tocan** — son carpetas quemadas/fijas del sistema.

---

## Gaps Identificados (preliminar)

| Ubicación | Estado Esperado | Estado Actual |
|:-----------|:----------------|:--------------|
| `04_Operations/` | 00_, 01_, 02_, 03_, 04_ | Faltan carpetas 04 |
| `03_Task/` | 00_-07 | Solo 00_, 01_, 08_ |
| `02_Tools/` (skills) | Secuencial por área | Requiere validación |

---

## FASE 1 — Inventario de Carpetas Numeradas

### Scaneo automático

```bash
# Listar todas las carpetas con XX_ (excepto 00_)
find . -type d -name "[0-9][0-9]_*" | grep -v "/00_" | sort
```

### Output esperado

Archivo: `03_Resultado/04_Reportes/SEQUENCE_INVENTORY.md`

---

## FASE 2 — Análisis de Gaps

### Lógica de detección

1. Por cada directorio padre, listar subdirectorios numerados
2. Ordenar por número
3. Detectar:
   - **GAP:** cuando `num[n] != num[n-1] + 1`
   - **DUPLICADO:** cuando `num[n] == num[n-1]`
   - **IGNORAR:** `00_*` → son fijas

### Clasificación por severity

| Severity | Definición |
|:---------|:------------|
| 🔴 CRITICAL | Gap > 1 (carpeta faltante real) |
| 🟡 WARNING | Gap = 1 (podría ser intencional) |
| 🟢 OK | Secuencia continua |

---

## FASE 3 — Reporte

### Generar documento

`03_Resultado/04_Reportes/SEQUENCE_VALIDATION.md`

### Formato del reporte

```markdown
## Directorio: 01_Personal_Os/04_Operations/

| # | Carpeta | Status | Acción |
|:---|---------|:-------|:-------|
| 01 | Context_LLM | ✅ OK | - |
| 02 | Auto_Improvement | ✅ OK | - |
| 03 | Agent_Teams_Lite | ✅ OK | - |
| 04 | Scripts_Os | 🔴 GAP | Crear o reordenar |
| 05 | Projects | ✅ OK | - |
```

### Directorios a validar

| Prioridad | Directorio | Razón |
|:----------|:----------|:------|
| 🔴 ALTA | `01_Personal_Os/04_Operations/` | HUBs + Scripts críticos |
| 🔴 ALTA | `01_Personal_Os/03_Task/` | Tareas activas |
| 🟡 MEDIA | `01_Personal_Os/01_Core/02_Tools/` | Skills + Agents |
| 🟡 MEDIA | `01_Personal_Os/01_Core/01_Rules/` | Reglas del sistema |
| 🟡 MEDIA | `02_Playground/` | Zones de prueba |
| 🟡 MEDIA | `03_Resultado/` | Planes y reportes |

---

## FASE 4 — Resolución (Manual)

### Reglas de resolución

| Caso | Acción |
|:----|:-------|
| Gap > 1 | **CREAR** carpeta vacía placeholder |
| Gap = 1 | **IGNORAR** (puede ser intencional) |
| Duplicado | **MERGE** o eliminar duplicado |
| Secuencia OK | **NO TOCAR** |

### Git backup obligatorio

Antes de cualquier renombrar:

```bash
# Pre-resolución
git tag v3.0-pre-sequence-fix
git branch backup-pre-sequence-fix
```

### Ejecución paso a paso

```bash
# 1. Generar inventario
python 01_Personal_Os/04_Operations/03_Scripts_Os/16_System_Mapper_Hub.py --scan

# 2. Generar reporte
python 01_Personal_Os/04_Operations/03_Scripts_Os/16_System_Mapper_Hub.py --sequence-report

# 3. Aplicar fixes manualmente (uno por uno)
# 4. Validar después de cada fix
# 5. Commitear cambios
```

---

## Criterio de Done

| Criterio | Status |
|:---------|:-------|
| 📋 Inventario completo generado | ⬜ Pendiente |
| 📊 Reporte con gaps por directorio | ⬜ Pendiente |
| ✅ Decisión del usuario aplicada | ⬜ Pendiente |
| 💾 Git backup creado antes de fixes | ⬜ Pendiente |
| 🔄 Secuencias resueltas | ⬜ Pendiente |

---

## Pre-requisitos

| Requisito | Verificación |
|:---------|:--------------|
| Git status limpio | `git status` |
| Backup tag creado | `git tag -l | grep v3.0` |
| Plan Consequences 3.0 commiteado | Commit `721698e` existe |

---

## Notas

- Las carpetas `00_*` son **INTOCABLES** — son las quemadas del sistema
- Solo se tocan carpetas con numeración `01_` en adelante
- Si hay duda: **PREGUNTAR** al usuario antes de renombrar

---

**Última actualización:** 2026-04-26
**Estado:** PENDIENTE DE APROBACIÓN
**Autor:** Claude (Plan Mode)