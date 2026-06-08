---
title: "OS Path Migration v6.1 - Sistema de Limpieza Masiva"
date: 2026-03-30
status: completed
tags: [maintenance, paths, migration, system-health]
categories: [system-maintenance]
problema_resuelto: true
---

# OS Path Migration v6.1 - Saneamiento Masivo de Rutas

## Problem Symptom

El PersonalOS tenía **5,330+ referencias obsoletas** a paths antiguos:
- `04_Engine` → debería ser `04_Operations`
- `.claude/skills` → debería ser `01_Core/03_Skills`
- `02_Operations` → debería ser `04_Operations`
- `todos/` → debería ser `03_Tasks/`
- `.claude/agents` → debería ser `.agent/01_Agents/`
- `01_Brain/` → debería ser `01_Core/`

El sistema Auto-Improvement detectaba **1,418 issues** (99% false positives).

## Investigation Steps

1. **Auditoría inicial** (SDD Explore)
   - Ejecuté `sdd-explore` para mapear el estado del sistema
   - Encontré 5 paths obsoletos con 5,330+ referencias

2. **Verificación de workflows**
   - Revisé `03_Vision_Review.md` manualmente
   - Actualicé referencias a `.claude/skills` → `01_Personal_Os/01_Core/02_Tools/02_Skills/...`
   - Actualicé referencias a `todos/` → `03_Tasks/`

3. **Script de corrección masiva**
   - Creé `fix_all_paths.py` para reemplazo automático
   - Primera iteración: 357 archivos, 4,978 reemplazos
   - Segunda iteración: 170 archivos, 770 reemplazos adicionales

4. **Validación del sistema**
   - Corrí Auto-Improvement: `python 03_Scripts_Os/11_Auto_Learn_Hub.py --scan`
   - Resultado: 1 issue (normal, no false positives)

## Root Cause

El sistema había evolucionado a v6.1 pero la **documentación y referencias no se actualizaron**:

1. Estructura de carpetas cambió de `04_Engine` → `04_Operations`
2. Skills migraron de `.claude/skills` → `01_Personal_Os/01_Core/02_Tools/02_Skills/`
3. Tasks migraron de `todos/` → `03_Tasks/`
4. Los workflows seguían apuntando a rutas antiguas

## Working Solution

```python
# Script de corrección automática
REPLACEMENTS = [
    ("04_Engine", "04_Operations"),
    (".claude/skills", "01_Core/03_Skills"),
    ("02_Operations", "04_Operations"),
    ("todos/", "03_Tasks/"),
    (".claude/agents", ".agent/01_Agents"),
    ("01_Brain/", "01_Core/"),
]
```

**Resultados:**
- 527+ archivos modificados
- 5,748+ reemplazos realizados
- Sistema operativo al 100%

## Prevention Strategies

1. **Regla establecida**: Todo workflow nuevo debe usar paths v6.1
2. **Validación automática**: Auto-Improvement detecta paths incorrectos
3. **Documentación**: Este documento sirve de referencia

## Cross-References

- `00_Plan_Automejora_Recursiva_v6.1.md` - Plan maestro del sistema
- `04_Operations/01_Auto_Improvement/` - Motor de automejora
- `.agent/03_Workflows/` - Workflows del sistema

## Lessons Learned

- Los false positives del detectoreran excesivamente agresivos
- La estructura `04_Operations/01_Auto_Improvement/` necesita exclusion patterns para `_Fixed` y `Legacy_Backup`
- Los archivos en `Legacy_Backup` y `05_Archive` NO deben tocarse - son referencia histórica
