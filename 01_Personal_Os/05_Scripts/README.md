# 05_Scripts — Scripts del OS

## Qué hay aquí
Todos los scripts Python del OS. HUBs, utilidades, pipelines.

## Cuándo usarlo
- Para ejecutar cualquier automatización
- Para agregar nuevas funcionalidades

## Cómo acceder
- `00_HUBs/03_Scripts_Os/` — scripts principales
- Siempre importar desde `config_paths.py`

## REGLAS DE ORO
1. ✅ SIEMPRE `from config_paths import ROOT_DIR`
2. ✅ SIEMPRE Windows UTF-8 fix
3. ❌ NUNCA hardcodear paths
4. ❌ NUNCA usar `except:` sin tipo específico
