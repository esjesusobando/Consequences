# 45_NP — SDD Model Eval Module Implementation 2026-07-02

## Goal

Completar el Módulo de Evaluación de Modelos (Model Eval Engine) del Personal OS v5.0 mediante el workflow SDD (Specification-Driven Development), implementando las Fases 3-5 que integran detección de deriva, análisis Pareto, historial de ejecuciones, enrutamiento inteligente, calibración y telemetría.

## Estado Inicial (Pre-Sesión)

**Fases 1-2 ya completadas (sin SDD):**
- Phase 1 — Foundation: `model_registry.json`, `eval_rubrics.json`, 5 gold standards, `config_paths.py`, `29_SOTA_Registry_Sync.py`
- Phase 2 — Engine: `quality_runner.py`, `g_eval.py`, `speed_profiler.py`, `cost_analyzer.py`, `token_counter.py`, `26_Model_Eval_Hub.py`

## SDD Workflow Completado

| Fase SDD | Output Clave |
|----------|-------------|
| **Init** | Contexto SDD híbrido (Engram + openspec). Testing: pytest 9.0.2 global, strict_tdd: false |
| **Propose** | Propuesta con 8 capacidades, 3 fases, rollback plan |
| **Spec** | 8 specs, **27 requisitos** RFC 2119, **39 escenarios** Given/When/Then |
| **Design** | **5 ADRs**, 3 slices, 14 archivos diseñados con diagramas de flujo |
| **Tasks** | **15 tareas** distribuidas en 3 PRs encadenados |
| **Apply Slice 1** | RunHistory, DriftDetector, ParetoFrontier, CLI wiring (6 tasks) |
| **Apply Slice 2** | SemanticRouter, CascadeRouter, ContextualBandit, Router Hub (5 tasks) |
| **Apply Slice 3** | CalibrationLoop, g_eval bias, benchmark persistence (4 tasks) |

## Archivos Creados (14 total)

### Phase 3 — Core (Drift + Pareto + History)
| Archivo | Path en trabajo | Propósito |
|---------|----------------|-----------|
| `config_paths.py` | `03_Scripts_Os/` | +3 paths: RUN_HISTORY_DIR, DRIFT_REPORTS_DIR, CALIBRATION_FILE |
| `run_history.py` | `26_Model_Eval_Engine/` | RunHistory — registro JSON de ejecuciones eval |
| `drift_detector.py` | `26_Model_Eval_Engine/` | DriftDetector — deriva en ventanas de 5 runs |
| `pareto_frontier.py` | `26_Model_Eval_Engine/` | ParetoFrontier — análisis multi-modelo + ASCII viz |
| `__init__.py` | `26_Model_Eval_Engine/` | Version bump + docstring |
| `26_Model_Eval_Hub.py` | `03_Scripts_Os/` | CLI: --history, --model, --pareto, --drift, --calibrate |

### Phase 4 — Routing Engine
| Archivo | Path | Propósito |
|---------|------|-----------|
| `__init__.py` | `28_Model_Router_Engine/` | Package init |
| `semantic_router.py` | `28_Model_Router_Engine/` | SemanticRouter — embeddings → top-1 |
| `cascade_router.py` | `28_Model_Router_Engine/` | CascadeRouter — fallback en 3 niveles |
| `contextual_bandit.py` | `28_Model_Router_Engine/` | ContextualBandit — 10 arms, 100 rounds |
| `28_Model_Router_Hub.py` | `03_Scripts_Os/` | Router CLI: --route, --policy, --learn |

### Phase 5 — Calibration
| Archivo | Path | Propósito |
|---------|------|-----------|
| `calibration_loop.py` | `26_Model_Eval_Engine/` | CalibrationLoop — 6 judges, bias learning |
| `g_eval.py` | `26_Model_Eval_Engine/` | Modificado: set_calibration/get_calibration, bias_adjustments param |

## Path Corrections (v4→v5)

### Problema Detectado
El código se implementó en `C:\Users\sebas\01_Personal_Os\04_Operations\03_Scripts_Os\` (ruta v4), pero la estructura canónica v5 en el Desktop es `C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\05_Scripts\00_HUBs\03_Scripts_Os\`.

### Correcciones Aplicadas

| Acción | Detalle |
|--------|---------|
| ✅ `04_Operations/` **eliminado** del Desktop | Era residuo v4 que contenía solo `00_Context_LLM/13_Model_Evals` |
| ✅ `13_Model_Evals/` **movido** | De `01_Memory/13_Model_Evals/` → `01_Memory/00_Context_LLM/08_Model_Evals/` |
| ✅ `08_Model_Evals/` **creado** | Con 3 archivos JSON de runs (`eval_20260703_*.json`) |
| ⚠️ **14 archivos engine** | PENDIENTE de sync al Desktop (root tiene los nuevos, Desktop no) |
| ⚠️ `config_paths.py` Desktop | PENDIENTE agregar MODEL_EVALS_DIR apuntando a `01_Memory/00_Context_LLM/08_Model_Evals/` |

### Mapa de Ubicaciones

```
Root (working copy, 44 .py files):
  C:\Users\sebas\01_Personal_Os\04_Operations\03_Scripts_Os\
  ├── 26_Model_Eval_Engine/    ← NUEVO (7 files)
  ├── 28_Model_Router_Engine/  ← NUEVO (4 files)
  ├── 26_Model_Eval_Hub.py     ← MODIFICADO
  ├── 28_Model_Router_Hub.py   ← NUEVO
  └── config_paths.py          ← MODIFICADO

Desktop (canonical git repo, 150 .py files):
  C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\05_Scripts\00_HUBs\03_Scripts_Os\
  └── (NO tiene ninguno de los archivos nuevos)
```

## Decisiones de Arquitectura (ADRs)

1. **Persistencia JSON**: Archivos JSON planos — sin base de datos, coherente con el resto del OS
2. **Router Hub separado**: `28_Model_Router_Hub.py` como orquestador CLI independiente del eval hub
3. **Simulation mode default**: `simulation=True` en todos los módulos para prueba sin APIs externas
4. **Stack routing 3 capas**: Semántico → Cascada → Bandido Contextual (progresión de sofisticación)
5. **Calibración como bias ajustable**: Scores G-Eval se calibran restando bias aprendido, no modificando el prompt

## Verificación (mode simulation)

```
python 26_Model_Eval_Hub.py --status                   → ✓  (Health OK)
python 26_Model_Eval_Hub.py --pareto reasoning         → ✓  (4-6 frontier models)
python 26_Model_Eval_Hub.py --drift gpt-5.1            → ✓  (5 domains analyzed)
python 26_Model_Eval_Hub.py --history --model gpt-5.1  → ✓  (20 simulated runs)
python 28_Model_Router_Hub.py --route "..."            → ✓  (semantic cascade)
python 28_Model_Router_Hub.py --policy                 → ✓  (10 arms)
python 28_Model_Router_Hub.py --learn                  → ✓  (100 rounds)
python 26_Model_Eval_Hub.py --calibrate                → ✓  (6 judges)
```

## Archivos SDD Generados

```
.atl/openspec/
├── changes/model-eval-phases-3-5/
│   ├── proposal.md       — 8 capacidades, 395 palabras
│   ├── design.md         — 5 ADRs, 12 módulos, diagramas
│   └── tasks.md          — 15 tasks en 3 slices
└── specs/
    ├── drift-detection/spec.md    — 3 reqs, 4 escenarios
    ├── pareto-frontier/spec.md    — 3 reqs, 4 escenarios
    ├── run-history/spec.md        — 4 reqs, 7 escenarios
    ├── semantic-routing/spec.md   — 3 reqs, 4 escenarios
    ├── cascade-routing/spec.md    — 3 reqs, 4 escenarios
    ├── contextual-bandit/spec.md  — 3 reqs, 5 escenarios
    ├── calibration-loop/spec.md   — 3 reqs, 5 escenarios
    └── model-router-hub/spec.md   — 5 reqs, 6 escenarios
```

## Pendientes (Post-Sesión)

- [ ] **Sync** 14 engine files → Desktop `05_Scripts/00_HUBs/03_Scripts_Os/`
- [ ] **config_paths.py** Desktop: agregar MODEL_EVALS_DIR → `01_Memory/00_Context_LLM/08_Model_Evals/`
- [ ] **Judgment Day** sobre los Evals → output en `03_Resultado/`
- [ ] **SDD Verify + Archive** formales (fases pendientes del workflow)
- [ ] **Registrar** features en `HUB_SOTA.py` (`FEATURE_ENGINES` dict)
- [ ] **Integrar** telemetría con sistema de trazado existente

## Notas Técnicas

- `config_paths.py` ya tenía rutas preparadas para `ROUTER_ENGINE_DIR`, `ROUTING_POLICY_FILE`, `PARETO_FILE` — el diseño anterior ya las había anticipado
- El Hub ya tenía stubs `cmd_pareto()` y `cmd_drift()` con datos hardcoded — fueron reemplazados por implementaciones reales
- `quality_runner.py` no tenía mecanismo de persistencia (resultados solo en memoria vía `_results` list) — ahora se integra con RunHistory
- La migración v4→v5 anterior (`sdd/fix-script-paths` y `v5-purge-migration`) ya había corregido paths pero `04_Operations` residual quedó en el Desktop
- El anchor `00_Winter_is_Coming` existe en la raíz del repo (no dentro de `01_Personal_Os/`)
- Engram session IDs: `think_different_phase7_2026-06-28` (migración), `sebas` (SDD actual)
