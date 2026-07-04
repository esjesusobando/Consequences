# CTX: SDD Model Eval Module — Full Implementation (2026-07-02)

## TL;DR
Se implementó el **Model Eval Engine** completo (Fases 3-5) vía SDD workflow. 14 archivos creados/modificados. Corregida estructura v4→v5 del Desktop (eliminado `04_Operations` residual, movido `13_Model_Evals` → `08_Model_Evals` en `01_Memory/00_Context_LLM/`).

## SDD Workflow Completado

| Fase | Output |
|------|--------|
| Init | Contexto híbrido (Engram + openspec), testing capabilities |
| Propose | `model-eval-phases-3-5` proposal, 8 capabilities |
| Spec | 8 specs, 27 reqs RFC 2119, 39 escenarios GWT |
| Design | 5 ADRs, 3 slices, 14 archivos diseñados |
| Tasks | 15 tareas en 3 PRs encadenados |
| Apply Slice 1 | RunHistory, DriftDetector, ParetoFrontier, Hub CLI |
| Apply Slice 2 | SemanticRouter, CascadeRouter, ContextualBandit, Router Hub |
| Apply Slice 3 | CalibrationLoop, g_eval bias, benchmark persistence |

## Archivos Creados (14)

**Phase 3 Core** (`26_Model_Eval_Engine/`):
- `run_history.py` — RunHistory class (JSON persistence en `08_Model_Evals/runs/`)
- `drift_detector.py` — DriftDetector (ventana temporal, 5 dominios)
- `pareto_frontier.py` — ParetoFrontier (frontera multi-modelo, ASCII viz)
- `26_Model_Eval_Hub.py` — Modificado: --history, --model, --pareto, --drift, --calibrate

**Phase 4 Routing** (`28_Model_Router_Engine/`):
- `semantic_router.py` — SemanticRouter (embeddings → top-1)
- `cascade_router.py` — CascadeRouter (fallback en cascada)
- `contextual_bandit.py` — ContextualBandit (10 arms, 100 rounds)
- `28_Model_Router_Hub.py` — Router CLI: --route, --policy, --learn

**Phase 5 Calibration**:
- `calibration_loop.py` — CalibrationLoop (6 judges, bias learning)
- `g_eval.py` — Modificado: set_calibration/get_calibration, bias_adjustments
- `config_paths.py` — +3 paths (RUN_HISTORY_DIR, DRIFT_REPORTS_DIR, CALIBRATION_FILE)

## Path Corrections
- `C:\Users\sebas\01_Personal_Os\04_Operations\03_Scripts_Os\` = ubicación de trabajo (44 .py files)
- `C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\05_Scripts\00_HUBs\03_Scripts_Os\` = ubicación canónica (150 .py files)
- `04_Operations/` en Desktop **eliminado** (residuo v4)
- `13_Model_Evals` movido → `01_Memory/00_Context_LLM/08_Model_Evals/` (con 3 JSON de runs)
- ⚠️ Engine files AÚN NO sincronizados al Desktop

## Decisiones Clave (ADRs)
1. **Persistencia JSON**: Archivos planos, no DB — consistente con el resto del OS
2. **Router Hub separado**: `28_Model_Router_Hub.py` independiente del eval hub
3. **Simulation mode**: Default `True` para prueba sin APIs externas
4. **Stack routing 3 capas**: Semántico → Cascada → Bandido Contextual
5. **Calibración como bias**: Scores G-Eval se calibran restando bias aprendido

## Pendientes
- [ ] Sync engine files → Desktop scripts location
- [ ] Agregar MODEL_EVALS_DIR a config_paths.py del Desktop
- [ ] Judgment day sobre los Evals → output en `03_Resultado/`
- [ ] Registrar features en HUB_SOTA.py
