---
title: "Cleanup paths obsoletos en subdirectorios 03_Scripts_Os"
category: technical
priority: P2
status: n
created_date: 2026-04-25
estimated_time: 120
resource_refs:
  - 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/config_paths.py
  - 03_Resultado/00_Plan_Consequences.md
---

# Deuda Técnica: Legacy Path Cleanup en subdirectorios

## Contexto

Durante Consequences 3.0 (2026-04-25) se detectaron ~184 refs a paths obsoletos.
Los 18 HUBs en raíz **ya funcionan correctamente** con `config_paths.py`.
Esta deuda es de **bajo riesgo** y **bajo retorno inmediato** — no bloquea nada.

## Desglose detectado

| Ubicación | Matches | Acción |
|-----------|---------|--------|
| `10_Legacy/` | ~120 | ⛔ NO tocar — histórico intencional |
| `03_Validator/`, `07_Data/`, etc. | ~50 | Fix quirúrgico por área |
| READMEs en subdirectorios | ~10 | Actualizar docs |
| HUBs raíz | 0 | ✅ Ya correctos |

## Paths obsoletos más comunes

```
03_Scripts_Os/  →  01_Personal_Os/04_Operations/03_Scripts_Os/
01_Personal_Os/00_Core/02_Tools/02_Skills/  →  01_Personal_Os/00_Core/02_Tools/02_Skills/
06_Playground/  →  02_Playground/
```

## Criterio de activación

Activar esta tarea SOLO si:
1. Un auditor especializado falla en producción por path incorrecto, O
2. Se hace un sprint de limpieza estructural (después de Consequences 4.0), O
3. Se detecta regresión en tests que apunte a estas refs

## Estrategia de ejecución (cuando se active)

```bash
# 1. Dry-run por área — NO bulk replace
# NOTA: 17_Legacy_Path_Cleanup.py fue reemplazado por batch_replace_paths.py
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/batch_replace_paths.py --category hub-scripts --dry-run

# 2. Revisar diff antes de aplicar
# 3. Apply por área individual
# 4. Validar tests después de cada área
```

## Exclusiones permanentes

- `10_Legacy/` — nunca tocar (memoria histórica del sistema)
- Archivos de archive (`05_Archive/`) — histórico intencional
- READMEs de planes pasados — no reemplazar

## Notas

- `17_Legacy_Path_Cleanup.py` ya existe en `03_Scripts_Os/` para esto
- Marcar refs intencionales con `<!-- LEGACY-OK -->` antes de correr el script
