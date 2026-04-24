# Plan Próxima Sesión — PersonalOS v2.0 Consequences
**Fecha:** 2026-04-24 | **Salud actual:** 87% | **Meta:** 100% Pure Green

---

## ✅ LO QUE YA ESTÁ LISTO

| Componente | Estado | Detalle |
|---|---|---|
| Estructura raíz (4 carpetas) | ✅ DONE | 00_Winter / 01_Personal_Os / 02_Playground / 03_Resultado |
| 10 Rules (.mdc) | ✅ DONE | 00_Core_Protocol → 09_Agent_Teams_Protocol |
| Skills (13 áreas) | ✅ DONE | 296 SKILL.md distribuidos, todas con contenido |
| config_paths.py | ✅ DONE | Auto-detección por 00_Winter_is_Coming, rutas v2.0 |
| 80_Edge_Case_Validator.py | ✅ DONE | REQUIRED_DIRS y SCRIPTS_DIR actualizados |
| .agent/ backup completo | ✅ DONE | CLAUDE.md, README, WORKSPACE, RULES_INDEX v2.0 |
| Beautifier (35_Beautify_Tables.py) | ✅ DONE | Fix code blocks — nunca más rompe árboles |
| Claude Code binario | ✅ DONE | @anthropic-ai/claude-code-win32-x64 v2.1.119 |
| Disco limpiado | ✅ DONE | ~95MB liberados (tool-results, telemetry, debug) |
| Compound Engineering skill | ✅ DONE | 6 subcarpetas de agents, scripts, SKILL.md |
| Hillary / 03_Task/ | ✅ DONE | 02_Hillary_Inbox presente |
| Gentleman Workflows | ✅ DONE | 5 workflows (Personal, Marvel, Gentleman, Hillary, CE) |
| 31 MCPs activos | ✅ DONE | .mcp.json válido (excepto 1 ruta obsoleta) |
| Nota de proceso | ✅ DONE | 07_NP_Migracion_v2_Consequences_Cierre_2026-04-24.md |
| Plan deploy OIM → Hostinger | ✅ DONE | 03_Resultado/00_Plan_Deploy_OIM_Hostinger.md |

---

## ❌ LO QUE FALTA — FIXES CRÍTICOS (P0)

### FIX 1 — 15_SOTA_Integrity_Check.py — ROOT mal calculado
**Archivo:** `01_Personal_Os/04_Operations/03_Scripts_Os/13_Auditors_Os/scripts/15_SOTA_Integrity_Check.py`

**Problema:** Línea 32 — falta un `.parent`
```python
# ACTUAL (ROTO):
ROOT = SCRIPT_DIR.parent.parent.parent

# CORRECTO (v2.0 — script está 4 niveles abajo de raíz):
ROOT = SCRIPT_DIR.parent.parent.parent.parent
```
O mejor: importar desde config_paths.

---

### FIX 2 — .mcp.json TestSprite — ruta v1.x
**Archivo:** `.mcp.json`

**Problema:** TestSprite args apunta a `08_Scripts_Os/` (no existe en v2.0)
```json
// ACTUAL (ROTO):
"08_Scripts_Os/testsprite_failover.sh"

// CORRECTO:
"01_Personal_Os/04_Operations/03_Scripts_Os/testsprite_failover.sh"
```
Verificar primero si el archivo existe en la nueva ruta.

---

### FIX 3 — recursive_improvement_engine.py — rutas v1.x
**Archivo:** `01_Personal_Os/04_Operations/01_Auto_Improvement/01_Auto_Improvement/01_Engine/recursive_improvement_engine.py`

**Problema:** 2 rutas hardcodeadas con "08_Scripts_Os"
```python
# ACTUAL (ROTO):
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "08_Scripts_Os"))
SCRIPTS_OS_DIR = PROJECT_ROOT / "08_Scripts_Os"

# CORRECTO:
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent.parent / "01_Personal_Os" / "04_Operations" / "03_Scripts_Os"))
SCRIPTS_OS_DIR = PROJECT_ROOT / "01_Personal_Os" / "04_Operations" / "03_Scripts_Os"
```

---

## ⚠️ LO QUE FALTA — MEJORAS (P1)

### MEJORA 1 — Auto-Improvement Engine — estructura duplicada
**Problema:** Existe doble nesting `01_Auto_Improvement/01_Auto_Improvement/`
**Acción:** Evaluar si consolidar (mover 01_Engine, 02_Rules, 04_Triggers un nivel arriba)
**Riesgo:** Medio — cambiar imports en todos los scripts internos

---

### MEJORA 2 — HUBs faltantes (12, 13, 14)
**Problema:** Solo hay 11 HUBs en raíz de 03_Scripts_Os/ — 12_Context_Usage_Bar y 13_Beautify_Tables están en 10_Legacy/
**Acción:** Decidir si moverlos a raíz o actualizar la documentación para reflejar que están en Legacy

---

### MEJORA 3 — tech-defaults.md — verificar ruta
**Archivo:** `.claude/rules/tech-defaults.md`
**Contenido actual:** `@../../01_Core/01_Rules/03_Pilar_Motor.mdc`
**Verificar:** Si Claude Code resuelve esto correctamente desde .claude/rules/ (sube 2 niveles = Think_Different/, luego busca 01_Core/ que NO existe en raíz v2.0)
**Fix si falla:** `@../../01_Personal_Os/01_Core/01_Rules/03_Pilar_Motor.mdc`

---

### MEJORA 4 — claude doctor 8 issues
**Acción:** Ejecutar en terminal separado (necesita TTY real):
```bash
claude doctor
```
Traer el output para analizar y resolver los 8 issues detectados.

---

## ⏳ PENDIENTE DE DECISIÓN (P2)

### DECISIÓN 1 — Deploy OIM → Hostinger
**Plan listo en:** `03_Resultado/00_Plan_Deploy_OIM_Hostinger.md`
**Necesito saber:**
- ¿Tipo de hosting? (Shared / VPS / Cloud)
- ¿Dominio del sitio?
- ¿Tenés acceso SSH?

### DECISIÓN 2 — Metodologías: check completo
El usuario pidió validar que estas metodologías estén 100% integradas y activas:
- PersonalOS → ✅ estructura v2.0 OK
- Gentleman Ecosistema → ✅ workflows presentes
- Compound Engineering → ✅ skill completo
- Hillary → ✅ inbox presente
- Auto-Improvement Engine → ⚠️ scripts con rutas v1.x (ver FIX 3)

**Acción:** Ejecutar el engine manualmente y verificar que corre sin errores:
```bash
cd Think_Different
python 01_Personal_Os/04_Operations/01_Auto_Improvement/01_Auto_Improvement/04_Triggers/manual_trigger.py
```

---

## ORDEN DE EJECUCIÓN PRÓXIMA SESIÓN

```
1. FIX 1 — 15_SOTA_Integrity_Check.py (5 min)
2. FIX 2 — .mcp.json TestSprite (5 min)
3. FIX 3 — recursive_improvement_engine.py (10 min)
4. MEJORA 3 — verificar tech-defaults.md (5 min)
5. Ejecutar Auto-Improvement manual_trigger.py y verificar (10 min)
6. MEJORA 1 — decidir estructura duplicada Auto-Improvement (15 min)
7. MEJORA 2 — decidir HUBs 12/13 en Legacy vs raíz (5 min)
8. claude doctor — traer output desde terminal (5 min)
9. Hostinger deploy — cuando el usuario dé datos del hosting
```

**Tiempo estimado total:** ~60 minutos

---

## SCORING ACTUAL vs META

| Área | Ahora | Meta |
|---|---|---|
| Estructura raíz | 100% | 100% |
| Rules | 100% | 100% |
| Skills | 85% | 90% |
| HUBs | 79% | 100% |
| config_paths.py | 100% | 100% |
| Scripts auditores | 80% | 100% |
| Auto-Improvement | 60% | 100% |
| MCPs | 97% | 100% |
| Hooks | 75% | 90% |
| **PROMEDIO** | **87%** | **97%** |

---

_Generado 2026-04-24 | PersonalOS v2.0 Consequences_
