# 🏆 PLAN OS 10/10 — Think Different PersonalOS Perfection Roadmap

> **Versión:** v5.0.3
> **Fecha:** 2026-07-13
> **Objetivo:** Llevar el OS de **9.2/10 actual** → **10/10** (SOTA absoluto, zero known issues, zero debt, self-healing, zero-friction)
> **Audiencia:** Junior que debe poder ejecutar TODO sin ambigüedad
> **Checkpoints:** `punto-de-control-2026-07-12` | `punto-de-control-2026-07-13` (actual)

---

## 📊 SCORE ACTUAL vs OBJETIVO

| Dimensión | Actual | Target 10/10 | Gap |
|-----------|--------|--------------|-----|
| **Infraestructura** | 10/10 | 10/10 | ✅ Done |
| **Validación automatizada** | 10/10 | 10/10 | ✅ Done |
| **Stats reconciliadas** | 10/10 | 10/10 | ✅ Done |
| **Consequences Tabs** | 10/10 | 10/10 | ✅ Done |
| **Marketing Agency** | 9/10 | 10/10 | 🟡 1 pipeline (Studio) necesita tests |
| **English Learning** | 9/10 | 10/10 | 🟡 Encoding fix done, falta streak 30d |
| **SOTA Gaps (10)** | 2/10 done | 10/10 done | 🔴 8 pendientes |
| **Auto-Improvement Engine** | 6/10 | 10/10 | 🔴 Path legacy, learnings.json duplicates |
| **Skill Discovery** | 0/10 | 10/10 | 🔴 No existe |
| **Content Pipeline** | 3/10 | 10/10 | 🔴 Fragmentado |
| **Disaster Recovery** | 2/10 | 10/10 | 🔴 Solo Engram, sin runbook testado |
| **Benchmarks/Telemetry** | 4/10 | 10/10 | 🔴 Parcial, sin drift alert |
| **Onboarding** | 3/10 | 10/10 | 🔴 Solo docs, sin TUI |
| **External Feedback** | 0/10 | 10/10 | 🔴 No existe |
| **Skill Registry Health** | 7/10 | 10/10 | 🟡 14_Graphify.mdc sin globs, case conflicts |
| **Path Sentinel Coverage** | 70% | 100% | 🟡 12 scripts sin migrar |
| **Git Hygiene** | 8/10 | 10/10 | 🟡 .agent/ en gitignore pero 1428 archivos legacy tracked en historia |

---

## 🎯 PLAN MAESTRO: 5 SPRINTS HACIA 10/10

```
Sprint 1 (Semana 1-2):  Foundation Hardening      → Elimina deuda técnica crítica
Sprint 2 (Semana 3-4):  Intelligence Layer        → Feedback + Discovery + Content
Sprint 3 (Semana 5-6):  Resilience & Safety       → DR + Benchmarks + Auto-Test
Sprint 4 (Semana 7-8):  UX & Onboarding           → Junior-ready, zero friction
Sprint 5 (Semana 9-10): Polish & Certification    → 10/10 audit + runbooks
```

---

## 📦 SPRINT 1: FOUNDATION HARDENING (Semana 1-2)
**Objetivo:** Deuda técnica = 0. Todo path resiliente. Auto-improvement funcional. Skill registry limpio.

### 1.1 Path Sentinel Migration (100% Coverage)
**Prioridad:** 🔴 CRÍTICO | **Esfuerzo:** 2 días | **Archivos:** 12 scripts

| Script | Ubicación | Estado | Fix |
|--------|-----------|--------|-----|
| `22_Validate_Skill_Frontmatter.py` | `03_Scripts_Os/` | ❌ Hardcoded | Import `config_paths` |
| `11 scripts en hooks/memory` | `05_Hooks/`, `01_Memory/` | ❌ Inline `_find_repo_root()` | Migrar a `config_paths` |
| `batch_replace_paths.py` | `03_Scripts_Os/` | ⚠️ Parcial | Ya usa config_paths pero idempotency fix done |
| `refactor_revert_id.py` | `03_Scripts_Os/` | ⚠️ Parcial | Verificar import config_paths |

**Template de migración (copiar-pegar):**
```python
# ANTES (hardcoded):
ROOT_DIR = Path(r"C:\Users\sebas\Desktop\Think_Different")

# DESPUÉS (sentinel):
import sys
sys.path.insert(0, str(Path(__file__).parent))
from config_paths import ROOT_DIR, TELEMETRY_DIR, CACHE_DIR
```

**Verificación:**
```bash
grep -r "C:\\Users\\sebas" 01_Personal_Os/05_Scripts/ --include="*.py" | grep -v ".backup" | grep -v "config_paths"
# Debe retornar 0 resultados
```

**Edge Cases:**
- Scripts que corren desde directorios distintos (cron, CI) → `config_paths.find_repo_root()` maneja esto
- Tests unitarios → mockear `config_paths.ROOT_DIR` con `monkeypatch`

---

### 1.2 Auto-Improvement Engine — Consolidation & Dedupe
**Prioridad:** 🔴 CRÍTICO | **Esfuerzo:** 3 días | **Problema:** `learnings.json` crece 1,364 duplicados en pattern 3

#### Tareas:
| ID | Tarea | Detalle |
|----|-------|---------|
| **AI.1** | Migrar path legacy | `05_Scripts/01_Auto_Improvement/` → `03_Learning/01_Auto_Improvement/01_Auto_Improvement/` (eliminar anidamiento duplicado) |
| **AI.2** | Dedupe engine | En `executor.py`: antes de append a `learnings.json`, calcular `fingerprint = hash(pattern + solution + file)` → skip si existe |
| **AI.3** | Rotación mensual | `learnings_YYYY-MM.json` + symlink `learnings.json` → actual. Limpieza > 12 meses en `17_Watchdog_Hub.py` |
| **AI.4** | Métricas de efectividad | Track: `fixes_applied`, `fixes_failed`, `patterns_recurring` → dashboard (Gap 5) |
| **AI.5** | Tests de idempotencia | Ejecutar engine 3x sobre mismo código → 0 duplicados, 0 crashes |

**Verificación:**
```bash
# 1. Path resuelto
python -c "from config_paths import AUTO_IMPROVE_DIR; print(AUTO_IMPROVE_DIR)"
# Debe apuntar a 03_Learning/01_Auto_Improvement/01_Auto_Improvement/

# 2. Dedupe funciona
python recursive_improvement_engine.py --test-dedupe
# Output: "Processed 50 patterns, 0 duplicates skipped, 0 new added"

# 3. Rotación mensual
ls 03_Learning/01_Auto_Improvement/learnings_*.json
# Debe mostrar: learnings_2026-07.json (symlink) + learnings_2026-06.json (archivo)
```

**Edge Cases:**
- Engine corre mientras se rota archivo → `filelock` (portalocker) en write
- `learnings.json` corrupto → backup `.bak` + reset desde último monthly válido
- Pattern nuevo pero solution idéntica a uno existente → considerar "duplicate semántico" (fuzzy match > 0.9)

---

### 1.3 Skill Registry — Health & Case Conflicts
**Prioridad:** 🟡 HIGH | **Esfuerzo:** 1 día

**Problemas detectados en Parallel Audit:**
- `14_Graphify.mdc` → falta field `globs`
- Case conflicts: `02_Agents_Docreview` vs `02_Agents_DocReview`, `04_PM_Orchestrator` vs `04_PM_Orchestrator`, `06_Higgsfield_Soul_Id` vs `06_Higgsfield_Soul_ID`, `01_N8N_JS` vs `01_N8n_Js`, etc. (8 conflicts)
- `05_Claude_Ads` skills referencian paths que no existen

#### Tareas:
| ID | Fix |
|----|-----|
| **SR.1** | Añadir `globs: ["**/*.md", "**/*.py"]` a `14_Graphify.mdc` |
| **SR.2** | Script `fix_case_conflicts.py` — detecta duplicados case-insensitive en `skill-registry.md` → renombra directorio a lowercase canonical → actualiza registry |
| **SR.3** | Validar paths en skills `05_Claude_Ads/*` → corregir o marcar `deprecated: true` en frontmatter |
| **SR.4** | Añadir check en `22_Validate_Skill_Frontmatter.py`: `globs` required, `case_conflict` check |

**Verificación:**
```bash
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/22_Validate_Skill_Frontmatter.py
# Debe salir: "All 397 skills valid. 0 case conflicts. 0 missing globs."
```

---

### 1.4 Git History Cleanup — .agent/ Legacy
**Prioridad:** 🟡 MEDIUM | **Esfuerzo:** 1 día

**Problema:** 1,428 archivos legacy tracked en historia de git (`.agent/`, `.pi/`, `.agents/`) → repo size inflado, `git clone` lento.

**Solución:** `git filter-repo` (requiere install) o `BFG Repo-Cleaner`.

```bash
# Opción A: git-filter-repo (recomendado)
pip install git-filter-repo
git filter-repo --path .agent --path .pi --path .agents --invert-paths

# Opción B: BFG (más rápido para repos grandes)
java -jar bfg.jar --delete-folders ".agent" --delete-folders ".pi" --delete-folders ".agents"
git reflog expire --expire=now --all && git gc --prune=now --aggressive
```

**⚠️ REGLAS DE ORO:**
1. **Backup completo** antes: `git bundle create think_different_backup.bundle --all`
2. **Coordinar con equipo** — reescribe historia, todos deben re-clonear
3. **Tags preservados** — `--tag-name-filter cat` en filter-repo
4. **Verificar post-cleanup:** `git count-objects -vH` → size reduction > 50%

---

## 📦 SPRINT 2: INTELLIGENCE LAYER (Semana 3-4)
**Objetivo:** OS que "escucha", "recomienda" y "produce contenido" autónomamente.

### 2.1 External Feedback Loop (Gap 3) — **FULL IMPLEMENTATION**
*Ver Plan SOTA Gaps sección 3 para tareas detalladas. Aquí resumen ejecutivo:*

**Entregables mínimos:**
- `capture_external_signals.py` — LinkedIn, Twitter, YouTube, Blog, Newsletter
- `signal_normalizer.py` — escala 0-100 cross-platform
- `show_feedback_dashboard.py` — ASCII table en ritual matutino
- `weekly_feedback_review.md` — workflow semanal
- `external_signals.yaml` + `.env.example` (template credenciales)
- Tests con mocks (`test_capture_signals.py`)

**Integración crítica:** Content Pipeline (Gap 8) debe registrar `content_id` al publicar para correlacionar señales posteriores.

---

### 2.2 Skill Discovery (Gap 6) — **FULL IMPLEMENTATION**
*Ver Plan SOTA Gaps sección 6.*

**Arquitectura:**
```
User Query ("quiero analizar competidores SEO")
    → skill_discovery.py (keyword + embedding)
    → skill-registry.md search
    → Ranked recommendations: [{skill, agent, workflow, command, confidence}]
    → Si confidence < 0.7: clarifying question
    → Output: JSON (CLI) o TUI interactivo
```

**Cache embeddings:** `03_Learning/04_Telemetry/skill_embeddings.pkl` (regenerar si `skill-registry.md` mtime changed)

**Integración:** Paso opcional en `ritual_matutino.md` → "¿Bloqueo? → `skill_discovery.py --interactive`"

---

### 2.3 Content Output Pipeline (Gap 8) — **FULL IMPLEMENTATION**
*Ver Plan SOTA Gaps sección 8.*

**Comando único:** `content_pipeline.py run --topic "X" --platform linkedin,twitter,blog`

**Fases:**
1. **Draft** → Skills `market-copy`, `market-social`, `market-articles` → `Drafts/{content_id}.md`
2. **Review** → Pipeline: Verificador → Humanizador → Copy Score → Dieter Rams → Pass/Fail + suggestions
3. **Publish** → Adaptadores por plataforma (LinkedIn API, Twitter API, Blog MD, Newsletter HTML)
4. **Analytics** → 1h, 24h, 7d fetch → `content_analytics_{id}.json` → feed Feedback Loop
5. **Compound** → 1 content → 5+ derivados (carousel, thread, clip, quote, email)

**Quality Gates:** Cada fase = exit code 0/1. Fail = stop + open editor en archivo problemático.

---

## 📦 SPRINT 3: RESILIENCE & SAFETY (Semana 5-6)
**Objetivo:** OS que sobrevive a desastres, se auto-testea, y avisa antes de romperse.

### 3.1 Disaster Recovery (Gap 9) — **FULL IMPLEMENTATION**
*Ver Plan SOTA Gaps sección 9.*

**RTO/RPO Targets:**
- **RPO:** 24h (snapshot diario 03:00)
- **RTO:** < 15 min (restore + verify)

**Entregables:**
- `engram_snapshot.py` — export → gzip → `07_Archive/04_Engram_Snapshots/` + checksum
- `engram_restore.py` — import con `--strategy merge|replace` + post-verify
- `engram_verify.py` — checksums + test restore mensual (CI)
- `DR_RUNBOOK.md` — pasos claros, contactos, tiempos
- Test mensual automatizado: `pytest test_disaster_recovery.py::test_full_restore`

**Edge Cases:**
- Engram schema migration (v1→v2) → detectar versión en snapshot → auto-migrate o abort con instrucciones
- Disco lleno durante snapshot → write to tmp → atomic rename → cleanup en `finally`
- Partial restore (solo project `sebas`) → flag `--project sebas`

---

### 3.2 Performance Benchmarks & Drift Alerts (Gap 10) — **FULL IMPLEMENTATION**
*Ver Plan SOTA Gaps sección 10.*

**Métricas por sesión (hook en `ritual_cierre`):**
```json
{
  "session_id": "2026-07-13_14-30-00",
  "duration_sec": 2400,
  "tokens_in": 45000,
  "tokens_out": 12000,
  "cache_hit_rate": 0.73,
  "tools_called": 34,
  "skills_invoked": ["learning-always", "market-copy", "sdd-propose"],
  "agents_invoked": ["hillary", "marketing_creador"],
  "validators_passed": 9,
  "validators_failed": 0,
  "errors": []
}
```

**Baseline + Alertas:**
- `benchmark_baseline.py` — P50/P90/P99 últimos 30 días
- `drift_detector.py` — Ventana 7d vs 30d anterior: media ± 2σ
- Alerta en dashboard (Gap 5) si métrica actual > P99 * 1.5
- Token economy: top 5 skills/agentes por consumo (regla `08_Token_Economy.mdc`)

**Weekly Perf Report:** `18_Telemetry_Hub.py --perf-report` → `perf_report_YYYY-WW.md` con sparklines ASCII + action items.

---

### 3.3 Auto-Testing Pipeline (Gap 7) — **FULL IMPLEMENTATION**
*Ver Plan SOTA Gaps sección 7.*

**`session_init_test.py` — Suite Pre-Sesión:**
```python
TESTS = [
    ("paths", "config_paths.py --validate", {"timeout": 10, "critical": True}),
    ("sync", "sync_copies.py --dry-run", {"timeout": 15, "critical": True}),
    ("structure", "01_Auditor_Hub.py --quick", {"timeout": 30, "critical": True}),
    ("rules", "05_Validator_Hub.py --rules", {"timeout": 20, "critical": True}),
    ("git", "git status --porcelain", {"timeout": 5, "critical": False, "allow_dirty": ["03_Learning/04_Telemetry/"]}),
    ("engram", "engram_mem_context", {"timeout": 10, "critical": False, "degraded_ok": True}),
]
```

**Integración en `04_Ritual_Hub.py`:**
```python
def ritual_apertura():
    if not os.getenv("SKIP_TESTS"):
        result = run_tests(block_on_fail=True)
        if result.failed:
            open_editor(result.failed_file)
            play_sound("alert")
            sys.exit(1)
    # ... resto del ritual
```

**Flags:** `--skip-tests` (loggea "TESTS SKIPPED - manual override"), `--test-timeout=N`

**Flakiness Tracking:** Log en `03_Learning/04_Telemetry/session_tests.json` → detectar tests con >10% fail rate en 30d → marcar `flaky: true` en registry.

---

## 📦 SPRINT 4: UX & ONBOARDING (Semana 7-8)
**Objetivo:** Junior productive en < 30 min. Zero friction. Modo simple por defecto.

### 4.1 Onboarding / Democratization (Gap 4) — **FULL IMPLEMENTATION**
*Ver Plan SOTA Gaps sección 4.*

**Entregables:**
- `quick_start_guide.md` (raíz) — 5 min read, 3 comandos core
- `onboarding_checklist.py` — TUI (rich/textual) + fallback `input()` 
- `no_se_por_donde_empezar.py` — NL → recomendación skill/agente/workflow/comando
- `guia_inicio.md` en `00_Workflows/01_Personal_Os/`
- `onboarding_demo.gif` en `02_Playground/03_Reports/`
- `04_Ritual_Hub.py --simple` — modo simplificado (3 comandos + tarea prioritaria)

**Test de aceptación:** Persona sin contexto completa tarea real ("publica post LinkedIn") en < 30 min siguiendo solo la guía.

---

### 4.2 Production Dashboard (Gap 5) — **POLISH TO 10/10**
*Ver Plan SOTA Gaps sección 5. Aquí mejoras para 10/10:*

**Mejoras Sprint 4:**
- **Modo "Solo Alertas"** → `--alerts-only` exit code 0/1 (CI friendly)
- **Sparklines ASCII** en tendencias 7d/30d (librería `sparkline` o custom)
- **Drill-down interactivo** → press `1` ver skills detail, `2` agentes, `3` git, `4` alertas
- **Export PNG/HTML** para compartir → `dashboard_export.py --format html`
- **Tema oscuro/claro** auto-detect (terminal background)
- **Accesibilidad** → modo alto contraste, sin emojis (flag `--no-emoji`)

**Verificación 10/10:**
- 0 falsos positivos en 2 semanas
- Junior entiende dashboard sin explicación
- Render < 2s (cache 5 min)
- Alertas actionables (cada una = link a fix o doc)

---

### 4.3 Skill Registry — Case Conflicts Resolution (Sprint 1 carry-over)
*Completar SR.2-SR.4 si no terminaron en Sprint 1.*

---

## 📦 SPRINT 5: POLISH & CERTIFICATION (Semana 9-10)
**Objetivo:** Auditoría 10/10 certificada. Runbooks completos. Zero known issues.

### 5.1 Marketing Agency — Pipeline 9 (Studio) Tests
**Gap actual:** Pipeline 9 (Product Studio) operativo pero sin tests automatizados.

**Tareas:**
- `test_product_studio.py` — mock Higgsfield/Fal.ai → verifica: 3 estilos generados, fidelity check, video export
- Integración en `00_Parallel_Audit_Pro.py` como test opcional (`--include-studio`)
- Documentar rate limits y costos en `05_Claude_Ads/05_Skills/` skills de ads

---

### 5.2 English Learning — Streak 30d + Advanced Features
**Gap actual:** Sistema funciona, falta validar streak 30 días + features avanzadas.

**Tareas:**
- **Gamificación:** XP, niveles, logros (primera semana, 100 palabras, racha 7/30)
- **Speaking practice:** Integración `elevenlabs` o `pyttsx3` para TTS + `speech_recognition` para STT
- **Contextual practice:** Frases de tus propios docs (skills, agentes, tasks) → vocabulario relevante
- **Weekly review:** Resumen semanal auto-generado → `english_weekly_review.md`

**Verificación:** `english_metrics.py --verify-streak` → 30 días consecutivos.

---

### 5.3 Full System Audit — 10/10 Certification
**Ejecutar TODOS los validadores en secuencia:**
```bash
# Script de certificación: certify_10_10.py
python config_paths.py --validate              # 82/82
python sync_copies.py --dry-run                # Synced
python 20_System_Mapper_Hub.py --scan          # Manifest OK
python 03_SOTA_Integrity_Check.py              # 9/9 PASSED
python 00_Parallel_Audit_Pro.py --full         # ≥ 90% purity
python session_init_test.py --verbose          # All pass
python 18_Telemetry_Hub.py --morning           # Dashboard renders
python engram_snapshot.py && python engram_restore.py --dry-run  # DR works
python skill_discovery.py --eval test_set.json # ≥ 80% accuracy
python content_pipeline.py --verify-cycle      # Full cycle OK
python benchmark_baseline.py --verify          # Baselines current
```

**Criterio 10/10:** **TODOS** los comandos arriba exit 0 + 0 warnings críticos + 0 falsos positivos en dashboard 2 semanas.

---

### 5.4 Runbooks Completos (Knowledge Transfer)
**Crear en `02_Knowledge/04_Docs/Runbooks/`:**

| Runbook | Contenido |
|---------|-----------|
| `ONBOARDING_JUNIOR.md` | Día 1-30 plan, links a guías, contactos, ritual diario |
| `INCIDENT_RESPONSE.md` | Qué hacer si: Engram caído, validators rotos, git corrupto, disco lleno, API keys rotadas |
| `RELEASE_PROCESS.md` | Versioning, changelog, tag, deploy, rollback |
| `SKILL_LIFECYCLE.md` | Crear → Test → Register → Document → Deprecate |
| `AGENT_LIFECYCLE.md` | Igual para agentes |
| `DISASTER_RECOVERY.md` | Paso a paso restore Engram + configs + git |
| `PERFORMANCE_TUNING.md` | Cómo leer perf report, top 5 optimizaciones comunes |

---

### 5.5 Final Cleanup & Tag
```bash
# 1. Verificar git clean
git status --short
# Solo .claude/skills/_shared/ (gitignored)

# 2. Tag final 10/10
git tag -a "v5.1.0-10-of-10" -m "Think Different PersonalOS v5.1.0 — 10/10 Certified

- All 10 SOTA gaps closed
- All validators green (config_paths, sync_copies, system_mapper, SOTA integrity, parallel_audit, session_init_test)
- Disaster recovery tested (RTO < 15min, RPO 24h)
- Auto-testing pipeline blocks broken sessions
- Content pipeline end-to-end functional
- Skill discovery + feedback loop operational
- Onboarding junior-ready (< 30 min to first task)
- Benchmarks + drift alerts active
- Dual checkpoints: punto-de-control-2026-07-12, punto-de-control-2026-07-13
- Runbooks complete for knowledge transfer

Checkpoint: 33fbc6696"

# 3. Push tags
git push origin --tags
```

---

## 📋 CHECKLIST MAESTRO 10/10 (Para Tracking)

### Sprint 1: Foundation
- [x] 1.1 Path Sentinel 100% (12 scripts migrados) ✅ 2026-07-14
- [x] 1.2 Auto-Improvement: dedupe (214→9) + dedup bug fix + scheduler path ✅ 2026-07-14
- [x] 1.3 Skill Registry: 430 skills valid, no case conflicts, Graphify removed ✅ 2026-07-14
- [ ] 1.4 Git history cleanup (.agent/.pi/.agents removed from history) ⏸️ DEFERRED

### Sprint 2: Intelligence
- [x] 2.1 Feedback Loop: capture + normalize + dashboard + weekly workflow ✅ 2026-07-14
- [x] 2.2 Skill Discovery: NL → skill + cache embeddings + ritual integration ✅ 2026-07-14
- [ ] 2.3 Content Pipeline: draft → review → publish → analytics → compound (1 comando)

### Sprint 3: Resilience
- [ ] 3.1 Disaster Recovery: snapshot + restore + verify + runbook + monthly CI test
- [ ] 3.2 Benchmarks: hook + baseline + drift + token tracking + weekly report
- [ ] 3.3 Auto-Testing: pre-session suite + ritual integration + flakiness tracking

### Sprint 4: UX
- [ ] 4.1 Onboarding: quick_start + checklist TUI + NL discovery + demo GIF + simple mode
- [ ] 4.2 Dashboard 10/10: alerts-only + sparklines + drill-down + export + themes + a11y
- [ ] 4.3 Skill Registry case conflicts resolved

### Sprint 5: Certification
- [ ] 5.1 Agency Studio tests
- [ ] 5.2 English Learning: streak 30d + gamification + speaking + contextual
- [ ] 5.3 Full cert suite: TODOS los validadores exit 0
- [ ] 5.4 Runbooks: 7 runbooks completos en `02_Knowledge/04_Docs/Runbooks/`
- [ ] 5.5 Tag `v5.1.0-10-of-10` + push

---

## 🛠 PATRONES REUTILIZABLES (Copy-Paste para Junior)

> **Estos son los MISMOS patrones del Plan SOTA Gaps.** Úsalos en CADA script nuevo.

### 1. Estructura Estándar + Windows Encoding Fix
```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Nombre: <descripción corta>
Ubicación: 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/
Propósito: <qué hace, inputs, outputs>
"""
import sys, os, json, argparse, logging
from pathlib import Path
from datetime import datetime, timezone

if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

sys.path.insert(0, str(Path(__file__).parent))
from config_paths import ROOT_DIR, TELEMETRY_DIR, CACHE_DIR

logging.basicConfig(level=logging.INFO, format='%(asctime)s | %(levelname)-8s | %(name)s | %(message)s', datefmt='%H:%M:%S')
logger = logging.getLogger(__name__)

def main():
    parser = argparse.ArgumentParser(description="Descripción")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--verbose", "-v", action="store_true")
    parser.add_argument("--test", action="store_true")
    args = parser.parse_args()
    if args.verbose: logger.setLevel(logging.DEBUG)
    try:
        return 0 if do_work(args) else 1
    except KeyboardInterrupt:
        logger.warning("Interrumpido por usuario"); return 130
    except Exception as e:
        logger.exception(f"Error fatal: {e}"); return 1

def do_work(args):
    # Lógica aquí
    return True

if __name__ == "__main__":
    sys.exit(main())
```

### 2. Path Sentinel (config_paths.py pattern)
```python
# EN CADA SCRIPT: from config_paths import ROOT_DIR, TELEMETRY_DIR, CACHE_DIR
# NUNCA hardcodear: C:/Users/sebas/Desktop/Think_Different
```

### 3. Cache con TTL
```python
def cached_fetch(key, fetch_fn, ttl=3600):
    f = CACHE_DIR / f"{key}.json"
    if f.exists():
        mtime = datetime.fromtimestamp(f.stat().st_mtime, tz=timezone.utc)
        if (datetime.now(timezone.utc) - mtime).total_seconds() < ttl:
            return json.loads(f.read_text())
    data = fetch_fn()
    safe_json_write(f, data)
    return data
```

### 4. Retry Tenacity (Patrón Oficial)
```python
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
@retry(wait=wait_exponential(multiplier=1, min=2, max=60), stop=stop_after_attempt(3), retry=retry_if_exception_type((ConnectionError, TimeoutError)), reraise=True)
def fetch(url, **kw): return requests.get(url, timeout=30, **kw)
```

### 5. Safe JSON Write (Atómico)
```python
def safe_json_write(path, data):
    tmp = path.with_suffix('.tmp')
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
    tmp.replace(path)
```

### 6. Exit Codes Estándar
```
0 = éxito
1 = error general
2 = uso incorrecto (args)
130 = Ctrl+C (KeyboardInterrupt)
```

---

## 🚨 ERRORES COMUNES JUNIOR (Memorizar)

| Error | Prevención |
|-------|------------|
| Hardcodear paths | **SIEMPRE** `from config_paths import ROOT_DIR` |
| No fix encoding Windows | `if sys.platform == "win32": fix_encoding()` AL INICIO de CADA script |
| `except:` sin tipo | `except SpecificError:` + `logger.exception()` |
| No validar input | `pydantic` models o `try: json.load() except:` |
| Commits sin tests | Pre-commit GGA + `session_init_test.py` bloquea |
| TODOs sin issue | `TODO(#123): desc` → link GitHub Issue |
| Edge cases no doc | Sección `## Edge Cases` EN EL MISMO ARCHIVO |
| Lógica + I/O mezclado | Separar: `fetch()` + `process(data)` + `write()` |
| Globals mutables | Clases con `__init__` + dependency injection |
| No cleanup resources | `with` + `try/finally` + `contextlib` |

---

## 📚 ARCHIVOS CLAVE — Referencia Rápida

| Para... | Leer |
|---------|------|
| Estructura OS | `00_Winter_is_Coming/Structure_v5.0.md` |
| Skills (397) | `.atl/skill-registry.md` o `01_Personal_Os/00_Core/02_Tools/02_Skills/` |
| Agentes (67) | `01_Personal_Os/00_Core/02_Tools/01_Agents/` |
| Workflows (31) | `01_Personal_Os/00_Core/00_Workflows/` |
| Rules (16 .mdc) | `01_Personal_Os/00_Core/01_Rules/` |
| HUBs (22) | `01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/` |
| Paths config | `config_paths.py` |
| Manifests (source of truth) | `01_Personal_Os/05_Scripts/02_Agent_Teams_Lite/00_Manifest/` |
| Memoria persistente | `engram search "tema"` |
| Proceso docs | `01_Personal_Os/01_Memory/Notas_de_Proceso.md` |
| Estado actual | `01_Personal_Os/01_Memory/Context_Memory.md` |
| Plan Gaps | `PLAN_SOTA_GAPS.md` (este directorio) |
| **ESTE PLAN** | `PLAN_OS_10_10.md` (este archivo) |

---

## 🎯 CÓMO EMPEZAR MAÑANA (Ritual Junior)

```bash
cd C:/Users/sebas/Desktop/Think_Different

# 1. Estado limpio
git status --short  # Solo .claude/skills/_shared/ (gitignored)

# 2. Validators sanity check
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/config_paths.py --validate
python 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/sync_copies.py --dry-run

# 3. Leer PRIMERA tarea del Sprint 1
cat PLAN_OS_10_10.md | grep -A 30 "### 1.1 Path Sentinel"

# 4. Branch por tarea
git checkout -b sprint1-1.1-path-sentinel

# 5. Copiar template estándar → rellenar
# 6. Commit atómico por tarea
git add -A && git commit -m "fix(paths): 1.1 migrate 22_Validate_Skill_Frontmatter.py to config_paths"

# 7. Push + PR si aplica
git push origin sprint1-1.1-path-sentinel
```

---

## ✅ DEFINICIÓN DE "10/10" — No Subjetivo

El OS es **10/10** cuando **TODOS** estos comandos devuelven `exit 0` **SIN WARNINGS CRÍTICOS**:

```bash
python config_paths.py --validate                    # 82/82 OK
python sync_copies.py --dry-run                      # Synced
python 20_System_Mapper_Hub.py --scan                # Manifest OK
python 12_Auditors_Os/scripts/03_SOTA_Integrity_Check.py  # 9/9 PASSED
python 05_Validator/00_Parallel_Audit_Pro.py --full  # ≥90% purity
python session_init_test.py --verbose                # All pass
python 18_Telemetry_Hub.py --morning                 # Dashboard renders
python engram_snapshot.py && python engram_restore.py --dry-run  # DR works
python skill_discovery.py --eval test_set.json       # ≥80% accuracy
python content_pipeline.py --verify-cycle            # Full cycle OK
python benchmark_baseline.py --verify                # Baselines current
```

**Y además:**
- [ ] 0 falsos positivos en dashboard por 14 días consecutivos
- [ ] Junior onboarding < 30 min a primera tarea real
- [ ] Disaster recovery test mensual pasa (RTO < 15 min)
- [ ] 7 runbooks completos en `02_Knowledge/04_Docs/Runbooks/`
- [ ] Tag `v5.1.0-10-of-10` pushed

---

**Cuando el caos surja → este plan + checkpoints duales + 4 validadores + Engram = tierra firme.**

*Think Different PersonalOS v5.0.3 — Plan 10/10 — 2026-07-13*