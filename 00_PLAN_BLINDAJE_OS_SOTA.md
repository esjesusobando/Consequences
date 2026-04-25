# 🛡️ PLAN DE BLINDAJE OS NIVEL SOTA — v2.0 Consequences → v2.1 Hardened

**Generado:** 2026-04-25 | **Modelo:** Opus 4.7 | **Salud actual:** 100% (15/15) ⚠️ con sub-SOTA gaps

> **Objetivo:** Llevar el OS de "PURE GREEN funcional" a **SOTA Hardened** — auto-validable, auto-recuperable, observable, sin nada roto, todo integrado.

---

## 📊 PARTE 1 — DIAGNÓSTICO (Ingeniería Inversa)

### ✅ Lo que YA funciona (no tocar)

| Componente | Estado | Métrica |
|------------|--------|---------|
| Estructura raíz v2.0 Consequences | ✅ SOTA | 4 carpetas limpias |
| Health Test Suite | ✅ SOTA | 15/15 PURE GREEN |
| MCPs configurados | ✅ SOTA | 33 servidores activos |
| Rules (.mdc) | ✅ SOTA | 10 reglas — fuente de verdad |
| Skills SKILL.md | ✅ SOTA | 297 SKILL.md — 9 áreas funcionales |
| HUBs operativos | ✅ FUNCIONAL | 14 HUBs, todos UTF-8 válidos, todos compilan |
| Hooks scripts | ✅ FUNCIONAL | 8 hooks (Pre/Post/Lifecycle/Sound) |
| Engram persistent memory | ✅ ACTIVO | Save/search/context operativos |
| GGA Pre-Commit | ✅ INSTALADO | v2.8.1 corre en cada commit |
| Auto-Improvement Engine | ✅ INSTALADO | Detector→Analyzer→Executor→Learner |
| Skills New_Skills + Maerks | ✅ INTEGRADAS | Las 4 `.skill` + Anthropic Harness sub-skills (5/7/8) ya en sistema vivo |

### ❌ Lo que está ROTO (P0 — fix obligatorio)

| Bug | Detalle | Impacto |
|-----|---------|---------|
| **B1 — `80_Edge_Case_Validator.py`** | Falla con `ModuleNotFoundError: config_paths` cuando se ejecuta directamente (sin PYTHONPATH) | El validator no se puede ejecutar standalone — requiere wrapper o fallback |
| **B2 — `.agent/01_Agents/` mismatch** | Backup tiene **6+ agentes** que NO están en `01_Personal_Os/01_Core/02_Tools/01_Agents/` (Workflow_Orchestrator, LFG_Autonomous_Engine, Content_Transformer, 4 YouTube agents, Hillary) | El backup ESPECULA agentes que el sistema vivo no tiene — divergencia silenciosa |
| **B3 — 3 LEEME.md duplicados** | `.agent/01_Agents/` tiene 3 archivos `LEEME.md` duplicados | Ruido en el backup, posible confusión |
| **B4 — Auto-Memory `~/.claude/projects/.../memory/`** | Directorio prácticamente vacío (1 archivo desde abril 18) — no se está usando | Sistema redundante mal aprovechado o no configurado |

### ⚠️ Lo que está SUB-SOTA (P1 — mejorar para hardening)

| Gap | Detalle | Por qué importa SOTA |
|-----|---------|----------------------|
| **G1 — Tests no cubren 100%** | Health Suite valida 15 dimensiones pero **no prueba ejecución real** de los 14 HUBs ni de los 8 hooks | Un HUB puede compilar pero crashear en runtime |
| **G2 — No hay regression suite** | Cada cambio depende de correr manualmente 02_Playground/00_OS_Health_Test.py | Sin CI, los breakages se descubren tarde |
| **G3 — No hay sync automático `.agent/`** | El backup .agent diverge del live sin alarma | Si el live se corrompe, el backup ya no refleja realidad |
| **G4 — GGA no detecta secrets** | Pre-commit corre code review pero no escanea API keys / .env / secrets en staged | Riesgo de leak en commits |
| **G5 — No hay observabilidad** | No hay dashboard ni métricas históricas de salud | Imposible ver tendencias o regresiones |
| **G6 — `00_PLAN_PROXIMA_SESION.md` se desactualiza** | Documento manual — fácilmente queda obsoleto | No es fuente de verdad confiable |
| **G7 — 250+ refs v1.x en archivos no-archive** | Maerks tiene 200+ refs (es zona de referencia, no archive) — confunde a quien las lea | Documentación residual confusa |
| **G8 — config_paths.py no tiene auto-fallback** | Si PYTHONPATH falla, los scripts crashean | Falta robustez de imports |
| **G9 — Auto-Improvement Engine no se ejecuta automáticamente** | Existe pero nadie lo invoca regularmente | El motor de auto-mejora está dormido |
| **G10 — `06_Tools/07_Skill_Creator_Invictus`** | Tercera versión de Skill Creator — ¿necesaria? duplicación posible | Decisión arquitectónica pendiente |

### 🎯 Lo que está PRESENTE pero SUB-EXPLOTADO (P2)

- **GGA Pre-Commit** corre solo en `.ts/.tsx/.js/.jsx` — el OS es Python/MD. No reviewa lo que importa.
- **Anthropic Harness** (Evaluator, Sprint, Auto Mode Security) está integrado pero no se usa en flujos.
- **Compound Engineering** completo en skills pero invocación manual.

---

## 🔥 PARTE 2 — PROBLEMAS POR PRIORIDAD

### P0 — CRÍTICOS (fix antes de cualquier otra cosa)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. B1 — 80_Edge_Case_Validator.py: agregar fallback path    │
│ 2. B2 — Decidir 6+ agentes huérfanos: integrar o archivar   │
│ 3. B3 — Limpiar 3 LEEME.md duplicados en .agent/01_Agents/  │
│ 4. B4 — Decidir Auto-Memory: configurar o desactivar        │
└─────────────────────────────────────────────────────────────┘
```

### P1 — ALTOS (blindaje real)

```
┌─────────────────────────────────────────────────────────────┐
│ 5. G1+G2 — Health Suite v2: tests de RUNTIME de HUBs+hooks  │
│ 6. G3 — Script de sync .agent/ con drift detection          │
│ 7. G4 — Pre-commit secret scanner (API keys, .env, tokens)  │
│ 8. G5 — Dashboard de métricas históricas (CSV+gráfico)      │
│ 9. G8 — config_paths.py con fallback robusto en TODOS los   │
│         scripts (patrón de recursive_improvement_engine.py)  │
└─────────────────────────────────────────────────────────────┘
```

### P2 — MEDIOS (SOTA upgrade)

```
┌─────────────────────────────────────────────────────────────┐
│ 10. G9 — Cron/hook para Auto-Improvement Engine semanal     │
│ 11. G10 — Decidir 07_Skill_Creator_Invictus: keep/archive   │
│ 12. GGA Pre-Commit reviewa .py y .md (no solo .ts/.js)      │
│ 13. Anthropic Harness: integrar Sprint Contract en SDD      │
│ 14. Onboarding doc para máquina nueva                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ PARTE 3 — PLAN DE ACCIÓN

### FASE 1 — FIX BUGS P0 (~30 min)

**1.1 — Fix `80_Edge_Case_Validator.py` (B1)**

Aplicar el patrón del `recursive_improvement_engine.py`:

```python
# Path resolution con fallback
_SCRIPT_DIR = Path(__file__).parent
_SCRIPTS_OS = _SCRIPT_DIR.parent  # 03_Scripts_Os/
sys.path.insert(0, str(_SCRIPTS_OS))

try:
    from config_paths import PROJECT_ROOT, ENGINE_DIR
except ImportError:
    PROJECT_ROOT = _SCRIPT_DIR.parent.parent.parent.parent
    ENGINE_DIR = _SCRIPT_DIR.parent
```

**Archivo a modificar:** `01_Personal_Os/04_Operations/03_Scripts_Os/03_Validator/80_Edge_Case_Validator.py`

**1.2 — Resolver mismatch agentes (B2)**

Decisión arquitectónica:
- **Opción A (recomendada):** Mover los 6+ agentes huérfanos del backup `.agent/01_Agents/` al sistema vivo `01_Personal_Os/01_Core/02_Tools/01_Agents/`
- **Opción B:** Si están deprecados, moverlos a `01_Personal_Os/05_Archive/`

Acción: leer cada uno de los 6 agentes para clasificarlos.

**1.3 — Limpiar LEEME.md duplicados (B3)**

```bash
# Ver dónde están los 3 LEEME.md
find .agent/01_Agents -name "LEEME.md"
# Mantener UNO en raíz de 01_Agents, eliminar los duplicados redundantes
```

**1.4 — Auto-Memory (B4)**

Decisión: **DESACTIVAR el sistema duplicado**. Engram es la fuente de verdad. Eliminar protocolo de auto-memory de `CLAUDE.md` global o configurarlo para que efectivamente se use.

---

### FASE 2 — BLINDAJE P1 (~2h)

**2.1 — Health Suite v2 (G1 + G2)**

Crear `02_Playground/01_OS_Runtime_Test.py` con tests de RUNTIME:

| Test | Qué prueba |
|------|-----------|
| R01-R14 | Cada HUB ejecuta `--help` o equivalente sin crash |
| R15 | Hook `notification.py --notify "test"` corre |
| R16 | `engram_mem_save` y `engram_mem_search` round-trip |
| R17 | `config_paths.py` resuelve PROJECT_ROOT correctamente |
| R18 | GGA pre-commit puede invocarse |
| R19 | Auto-Improvement Engine `--scan` no crashea |
| R20 | Skill Creator puede generar un skill stub |

**2.2 — Sync `.agent/` automático (G3)**

Crear `01_Personal_Os/04_Operations/03_Scripts_Os/15_Agent_Sync_Hub.py`:

- Compara `.agent/01_Agents/` ↔ `01_Personal_Os/01_Core/02_Tools/01_Agents/`
- Detecta archivos faltantes/extras
- Modo `--dry-run` (default) y `--apply`
- Reporta drift en STDOUT

**2.3 — Pre-commit secret scanner (G4)**

Crear `01_Personal_Os/01_Core/02_Tools/05_Hooks/01_Pre_Tool/secret_scanner.py`:

Patrones a detectar:
- API keys: `sk-[a-zA-Z0-9]{32,}`, `xoxb-`, `ghp_`, `AIza`, `AKIA`
- `.env` files staged
- AWS access keys
- Tokens base64 sospechosos

Bloquear commit si encuentra match. Permitir bypass con `--force-secret-allowed`.

**2.4 — Dashboard métricas históricas (G5)**

Crear `01_Personal_Os/04_Operations/03_Scripts_Os/14_Health_Metrics_Hub.py`:

- Cada vez que corre Health Test, grabar resultado en `01_Personal_Os/04_Operations/00_Context_LLM/11_Reports/health_history.csv`
- Comando `--report` muestra gráfico ASCII de los últimos 30 días
- Trigger automático en Pre-Commit hook

**2.5 — `config_paths.py` robusto (G8)**

Auditar TODOS los scripts en `03_Scripts_Os/` que importan `config_paths`. Agregar el patrón fallback en cada uno.

---

### FASE 3 — SOTA UPGRADE P2 (~3h opcional)

**3.1 — Auto-Improvement scheduling (G9)**

Configurar trigger semanal en hook de SessionEnd o cron:
```bash
python 01_Personal_Os/04_Operations/01_Auto_Improvement/01_Engine/recursive_improvement_engine.py --scan
```

**3.2 — Skill Creator consolidation (G10)**

Auditar las 3 versiones:
- `06_Tools/01_Skill_Creator/15_Skill_Creator_Oficial/`
- `06_Tools/02_Skill_Template/21_Skill_Template/`
- `06_Tools/07_Skill_Creator_Invictus/`

Decidir: cuál es CANONICAL, archivar las otras 2.

**3.3 — GGA Pre-Commit para `.py` y `.md`**

Configurar GGA en `.agent/05_GGA/` para incluir patrones `*.py,*.md` cuando se modifican archivos del OS.

**3.4 — Anthropic Harness en SDD**

Integrar Sprint Contract de `06_Tools/03_Anthropic_Harness/14_Anthropic_Harness/03_Sprint_Contract/` como pre-step en SDD `/sdd-apply`.

**3.5 — Onboarding docs**

Crear `01_Personal_Os/02_Knowledge/00_Onboarding/00_New_Machine_Setup.md` con:
- Clonado de repo
- Instalación de Python deps
- Configuración de `.env`
- Setup de MCPs
- Validación con health test

---

### FASE 4 — VALIDATION GATE (15 min final)

Antes de declarar SOTA Hardened, correr:

```bash
# 1. Health Test original
python 02_Playground/00_OS_Health_Test.py
# Expected: 15/15 PURE GREEN

# 2. Runtime Test nuevo
python 02_Playground/01_OS_Runtime_Test.py
# Expected: 20/20 PURE GREEN

# 3. Agent Sync drift check
python 01_Personal_Os/04_Operations/03_Scripts_Os/15_Agent_Sync_Hub.py --dry-run
# Expected: NO DRIFT

# 4. Auto-Improvement scan
python 01_Personal_Os/04_Operations/01_Auto_Improvement/01_Engine/recursive_improvement_engine.py --scan
# Expected: 0 issues críticos

# 5. SOTA Integrity Check
python 01_Personal_Os/04_Operations/03_Scripts_Os/13_Auditors_Os/scripts/15_SOTA_Integrity_Check.py
# Expected: ALL PASS
```

---

## 📈 PARTE 4 — MÉTRICAS OBJETIVO SOTA

| Métrica | Actual | Objetivo SOTA |
|---------|--------|---------------|
| Tests pasando | 15/15 | **35/35** (15 estructura + 20 runtime) |
| Tiempo de Health Test | ~5s | < 30s incluyendo runtime tests |
| Drift `.agent/` ↔ live | 6+ archivos | **0 archivos** |
| Refs v1.x en docs activos | 0 ✅ | 0 (mantener) |
| MCPs activos | 33 | 33 (mantener) |
| Skills con SKILL.md | 297 | 297+ (mantener o crecer) |
| Cobertura Pre-Commit | TS/JS only | **TS/JS + Py + MD + secrets** |
| Auto-Improvement runs/semana | 0 | **≥ 1** |
| Documentación drift | manual | **auto-detected** |
| Recovery time si falla algo | manual | **auto-rollback < 5 min** |

---

## ⏱️ PARTE 5 — CRONOGRAMA

| Fase | Duración | Bloqueante para producción |
|------|----------|---------------------------|
| FASE 1 — P0 fixes | 30 min | ✅ Sí |
| FASE 2 — P1 blindaje | 2 h | ✅ Sí |
| FASE 3 — P2 SOTA upgrade | 3 h | ❌ Opcional |
| FASE 4 — Validation gate | 15 min | ✅ Sí |
| **TOTAL mínimo (P0+P1+Gate)** | **~2h 45min** | — |
| **TOTAL completo SOTA** | **~5h 45min** | — |

---

## 🎯 DECISIÓN DEL USUARIO

Antes de ejecutar, necesito que confirmes:

1. **¿Vamos con FASE 1+2+4 (P0+P1, ~2h45min) o FASE 1+2+3+4 completa (~5h45min)?**

2. **B2 (agentes huérfanos):** ¿Los 6 agentes del backup (.agent) los integro al live, los archivo, o los reviso uno por uno antes de decidir?

3. **B4 (Auto-Memory):** ¿Desactivamos el protocolo `~/.claude/projects/.../memory/` (recomendado, Engram lo cubre) o lo configuramos para que se use?

4. **G7 (refs v1.x en Maerks):** ¿Lo dejamos como zona histórica o limpiamos las 200+ refs?

---

_PersonalOS v2.0 Consequences → v2.1 Hardened — Plan generado 2026-04-25 con Opus 4.7_
