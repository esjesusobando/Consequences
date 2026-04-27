# 🛡️ PLAN DE BLINDAJE OS NIVEL SOTA — v2.1 Hardened

**Generado:** 2026-04-25 | **Modelo:** MiniMax-M2.7
**Estado actual:** ✅ SOTA HARDENED — Validation Gate PASSED (35/35) + Deps Updated
**Último commit:** `a1fa1e1` — "feat(os): SOTA hardening — FASE 2 P1 blindaje completo"
**Esta sesión:** MiniMax-M2.7 | Dependencias: gga v2.8.1 ✅, engram 1.13.1 ✅, gentle-ai 1.23.0 ✅ | Tools: opencode-subagent-statusline ✅, TubeMaster clonado ✅ | Engram Cloud: not configured

---

## ✅ ESTADO ACTUAL: v2.1 Hardened (2026-04-25)

```
════════════════════════════════════════════════════
  🛡️  VALIDATION GATE — SOTA Hardened
════════════════════════════════════════════════════

▶ 1. Health Test (estructural)   → 15/15  🎉 PURE GREEN
▶ 2. Runtime Test (ejecución)    → 20/20  🎉 PURE GREEN
▶ 3. Agent Sync Drift Check      → 🎉 ZERO DRIFT
▶ 4. Auto-Improvement scan       → OK
▶ 5. SOTA Integrity Check        → 9/9 PASSED
▶ 6. Secret Scanner staged       → ✅ INSTALADO Y FUNCIONAL
```

### Commits de esta sesión (orden cronológico):
| Commit | Descripción |
|--------|-------------|
| `b94043d` | docs(os): actualizar paths v1.x → v2.0 en documentos activos |
| `fabffda` | docs(os): limpiar refs v1.x residuales en documentos activos |
| `029341b` | feat(os): SOTA hardening — FASE 1 P0 bugs + agent integration |
| `a1fa1e1` | feat(os): SOTA hardening — FASE 2 P1 blindaje completo |

---

## ✅ FASE 1 — COMPLETADA (commit `029341b`)

### B1 — Fix `80_Edge_Case_Validator.py` ✅
**Problema:** `ModuleNotFoundError: config_paths` cuando se ejecuta standalone.
**Fix:** Patrón fallback en todas las importaciones:
```python
_SCRIPT_DIR = Path(__file__).parent.resolve()
_SCRIPTS_OS = _SCRIPT_DIR.parent
sys.path.insert(0, str(_SCRIPT_DIR))
sys.path.insert(0, str(_SCRIPTS_OS))
try:
    from config_paths import PROJECT_ROOT, ENGINE_DIR
except ImportError:
    PROJECT_ROOT = _SCRIPTS_OS.parent.parent.parent
    ENGINE_DIR = _SCRIPTS_OS
```
**Archivo:** `01_Personal_Os/04_Operations/03_Scripts_Os/03_Validator/80_Edge_Case_Validator.py`

### B2 — Agentes integrados y renumerados ✅
**Problema:** 7 agentes en `.agent/01_Agents/` backup sin equivalente en live.
**Fix:** Integrados al sistema vivo con renumeración limpia:

| Agente integrado | Destino | Número nuevo |
|-----------------|---------|-------------|
| `Workflow_Orchestrator.md` | root | `10_Workflow_Orchestrator.md` |
| `LFG_Autonomous_Engine.md` | root | `12_LFG_Autonomous_Engine.md` |
| `Hillary.md` | root | `13_Hillary.md` |
| `Content_Transformer.md` | `03_Growth/` | `01_Content_Transformer.md` |
| `Youtube_Script_Writer.md` | `03_Growth/` | `02_Youtube_Script_Writer.md` |
| `Youtube_Thumbnail_Prompter.md` | `03_Growth/` | `03_Youtube_Thumbnail_Prompter.md` |
| `Youtube_Title_Generator.md` | `03_Growth/` | `04_Youtube_Title_Generator.md` |
| `Carousel_Strategist.md` | `03_Growth/` | `05_Carousel_Strategist.md` |

Subcarpetas creadas: `03_Growth/`, `04_Contexto/`, `05_Marca/`, `06_Plantillas/` con LEEMEs.

### B3 — LEEME.md (falso positivo) ✅
**Resultado:** NO eran duplicados. Cada LEEME.md está en subcarpeta única — correcto.

### B4 — Auto-Memory inicializada ✅
**Fix:** Creados en `~/.claude/projects/.../memory/`:
- `MEMORY.md` (índice)
- `user_profile.md` (perfil de Sebas)
- `os_architecture_v2.md` (rutas clave del OS)

### Fix encoding Windows cp1252 ✅
**Problema:** `subprocess.run(text=True)` usaba cp1252 en Windows, crasheaba con emojis.
**Fix:** `encoding="utf-8", errors="replace"` en TODOS los subprocess.run de `00_OS_Health_Test.py`.

---

## ✅ FASE 2 — COMPLETADA (commit `a1fa1e1`)

### G1+G2 — Runtime Test Suite ✅
**Archivo creado:** `02_Playground/01_OS_Runtime_Test.py`
**20 tests de ejecución real:**
| Tests | Qué validan |
|-------|-------------|
| R01-R14 | Sintaxis de todos los HUBs (compile, no subprocess) |
| R15 | `config_paths.py` resuelve PROJECT_ROOT correctamente |
| R16 | Validator standalone corre sin crash |
| R17 | Auto-Improvement `--scan` ejecuta OK |
| R18 | Agent sync: ZERO DRIFT entre live y backup |
| R19 | Health test ejecuta y devuelve resultados parseable |
| R20 | Docs activos sin refs v1.x (`01_Core/03_Skills`, `03_Scripts_Os`) |

### G5 — Health Metrics Hub ✅
**Archivo creado:** `01_Personal_Os/04_Operations/03_Scripts_Os/14_Health_Metrics_Hub.py`
- `--record`: corre ambos tests y graba en CSV
- `--report`: gráfico ASCII de últimos 30 registros
- CSV en: `01_Personal_Os/04_Operations/00_Context_LLM/11_Reports/health_history.csv`
- Primera entrada: structural 15/15 + runtime 20/20 = **100.0%**

### G3 — Agent Sync Hub ✅
**Archivo creado:** `01_Personal_Os/04_Operations/03_Scripts_Os/15_Agent_Sync_Hub.py`
- Compara live ↔ backup por relative path (no solo nombre)
- `--dry-run` (default): reporta drift sin tocar nada
- `--apply`: copia bidireccional para sincronizar
- Resultado actual: **ZERO DRIFT (52/52 archivos)**

### G4 — Secret Scanner Pre-Commit ✅
**Archivo creado:** `01_Personal_Os/01_Core/02_Tools/05_Hooks/01_Pre_Tool/secret_scanner.py`
**Instalado en:** `.git/hooks/pre-commit` (ANTES del GGA)

Detecta:
- Anthropic API key (`sk-ant-api03-...`)
- OpenAI/Generic (`sk-[32+ chars]`)
- Stripe LIVE/TEST (`sk_live_`, `sk_test_`)
- GitHub tokens (`ghp_`, `ghs_`, `gho_`)
- Google API key (`AIza...`)
- AWS Access Key (`AKIA...`)
- Slack tokens (`xoxb-`, `xoxp-`)
- Private keys PEM
- Hardcoded passwords
- `.env` files staged

Probado en producción: bloqueó correctamente un commit con Anthropic key de prueba.

### Validation Gate PASSED ✅
Pre-commit hook en producción (`a1fa1e1`): Secret Scanner → GGA → commit exitoso.

---

## ⏳ FASE 3 — PENDIENTE (P2 — ~3h opcional, no bloqueante)

> El OS está SOTA Hardened. Esta fase es upgrade adicional.

### PASO 0 — Integrar opencode-subagent-statusline (G8) — ~15min ✅ COMPLETADO
**Status:** npm install global ✅ | Repo clonado en Archive ✅ | tui.json configurado ✅

**Repo:** `Joaquinvesapa/sub-agent-statusline` — 32 stars, 6 forks
**Funcionalidad:** Monitor Sidebar en OpenCode para tracking de subagentes (running, done, failed, elapsed, tokens)

### PASO 0b — TubeMaster (Gentleman-Programming) ✅ INSTALADO
**Status:** Repo clonado en `07_Repos_Gentleman/tubemaster/`. Pendiente: configurar credenciales Google Cloud + YouTube API.

**Repo:** `Gentleman-Programming/tubemaster` — 9 stars, MIT License
**Funcionalidad:** YouTube Channel Operations Manager (Web UI, CLI, MCP, API)
**Próximo paso:** Seguir `tubemaster/docs/getting-started.md` para OAuth setup

### PASO 0c — Engram Cloud Integration — PENDIENTE
**Estado actual:** `engram cloud status` → "not configured"

**Qué hacer:**
1. `engram cloud config` — configurar cloud server URL
2. `engram cloud enroll` — enrolar proyecto para sync
3. O usar `engram cloud serve` para correr cloud backend + dashboard localmente
4. Requiere: `ENGRAM_DATABASE_URL` (Postgres DSN) para cloud serve mode

**Documentación:** `engram help cloud` para detalles de configuración

---

### PASO 1 — Auto-Improvement scheduling (G9) — ~30min

**Problema:** El engine existe pero nadie lo invoca regularmente.

**Qué hacer:**
1. Verificar que el engine corre OK:
   ```bash
   python 01_Personal_Os/04_Operations/01_Auto_Improvement/01_Engine/recursive_improvement_engine.py --scan
   ```
2. Agregar al hook de fin de sesión en `.agent/04_Extensions/hooks/03_Lifecycle/` o crear cron:
   ```bash
   # Opción A — Hook SessionEnd
   python $PROJECT_ROOT/01_Personal_Os/04_Operations/01_Auto_Improvement/01_Engine/recursive_improvement_engine.py --scan
   
   # Opción B — Usar /schedule en Claude Code
   # /schedule weekly: python 01_Personal_Os/04_Operations/01_Auto_Improvement/01_Engine/recursive_improvement_engine.py --scan
   ```
3. Verificar que `--scan` produce output parseable (no crash)

### PASO 2 — Skill Creator consolidation (G10) — ~1h

**Problema:** 3 versiones del Skill Creator coexisten.

**Qué hacer:**
1. Leer los 3 SKILL.md:
   - `01_Personal_Os/01_Core/02_Tools/02_Skills/06_Tools/01_Skill_Creator/15_Skill_Creator_Oficial/SKILL.md`
   - `01_Personal_Os/01_Core/02_Tools/02_Skills/06_Tools/02_Skill_Template/21_Skill_Template/SKILL.md`
   - `01_Personal_Os/01_Core/02_Tools/02_Skills/06_Tools/07_Skill_Creator_Invictus/SKILL.md`
2. Identificar cuál es el más completo/actualizado (canónico)
3. `git mv` los otros 2 a `01_Personal_Os/01_Core/02_Tools/02_Skills/09_Legacy_Archive/`
4. Actualizar:
   - `01_Personal_Os/01_Core/02_Tools/02_Skills/INDEX_AREA_FUNCTIONAL.md`
   - `.atl/skill-registry.md`
   - `CLAUDE.md` si tiene referencia

### PASO 3 — GGA para Python y Markdown (G3 GGA extension) — ~30min

**Problema:** GGA solo revisa `*.ts,*.tsx,*.js,*.jsx`. El OS es mayoritariamente Python/MD.

**Qué hacer:**
1. Buscar la config de GGA:
   ```bash
   find .agent/05_GGA -name "*.json" -o -name "*.yaml" -o -name "*.toml" | head -10
   ```
2. Agregar `*.py,*.md` a los patrones de archivos revisados
3. Testear con un commit que modifique un .py del OS

### PASO 4 — Onboarding docs — ~1h

**Qué hacer:**
Crear `01_Personal_Os/02_Knowledge/00_Onboarding/00_New_Machine_Setup.md` con:
```markdown
# Setup Nueva Máquina — PersonalOS v2.1

## 1. Clonar repositorio
git clone [repo-url] Think_Different

## 2. Python deps
pip install -r requirements.txt  # si existe

## 3. MCP setup
# Copiar .mcp.json a raíz del proyecto
# Claude Code lo detecta automáticamente

## 4. Instalar hooks
bash .agent/05_GGA/bin/gga install

## 5. Validar sistema
python 02_Playground/00_OS_Health_Test.py     # → 15/15
python 02_Playground/01_OS_Runtime_Test.py    # → 20/20
```

### PASO 5 — Métricas finales — ~5min

Al terminar FASE 3:
```bash
python 01_Personal_Os/04_Operations/03_Scripts_Os/14_Health_Metrics_Hub.py --record --report
```

---

## 🔧 PARA EL PRÓXIMO AGENTE: Guía de Continuación

### Contexto del sistema
- **Branch:** `master`
- **Repo:** `Think_Different/` (raíz del proyecto)
- **Estado:** v2.1 Hardened, SOTA certificado, 100% health
- **Estructura:** 4 carpetas raíz: `00_Winter_is_Coming/`, `01_Personal_Os/`, `02_Playground/`, `03_Resultado/`

### Cómo arrancar una sesión
```bash
# 1. Verificar estado actual
python 02_Playground/00_OS_Health_Test.py && python 02_Playground/01_OS_Runtime_Test.py

# 2. Ver health history
python 01_Personal_Os/04_Operations/03_Scripts_Os/14_Health_Metrics_Hub.py --report

# 3. Verificar sync
python 01_Personal_Os/04_Operations/03_Scripts_Os/15_Agent_Sync_Hub.py
```

### Archivos clave del blindaje
| Archivo | Rol |
|---------|-----|
| `02_Playground/00_OS_Health_Test.py` | 15 tests estructurales |
| `02_Playground/01_OS_Runtime_Test.py` | 20 tests de ejecución |
| `01_Personal_Os/04_Operations/03_Scripts_Os/14_Health_Metrics_Hub.py` | Dashboard histórico |
| `01_Personal_Os/04_Operations/03_Scripts_Os/15_Agent_Sync_Hub.py` | Sync live ↔ .agent |
| `01_Personal_Os/01_Core/02_Tools/05_Hooks/01_Pre_Tool/secret_scanner.py` | Scanner pre-commit |
| `.git/hooks/pre-commit` | Hook: Secret Scanner → GGA |

### Comandos de validación rápida
```bash
# Gate completa (lo que se corre antes de declarar SOTA)
python 02_Playground/00_OS_Health_Test.py
python 02_Playground/01_OS_Runtime_Test.py
python 01_Personal_Os/04_Operations/03_Scripts_Os/15_Agent_Sync_Hub.py
python 01_Personal_Os/04_Operations/01_Auto_Improvement/01_Engine/recursive_improvement_engine.py --scan
python 01_Personal_Os/04_Operations/03_Scripts_Os/13_Auditors_Os/scripts/15_SOTA_Integrity_Check.py
```

### Convenciones a mantener
- **Commits:** `git commit` activa Secret Scanner → GGA. Si falla Secret Scanner, revisar staged files con `git diff --cached`
- **Encoding:** SIEMPRE `encoding="utf-8", errors="replace"` en subprocess.run
- **Imports:** SIEMPRE patrón fallback para config_paths (ver B1 arriba)
- **Paths:** Nunca hardcodear — usar `config_paths.PROJECT_ROOT / "ruta/relativa"`
- **Docs a actualizar siempre:** CLAUDE.md, README.md, AGENTS.md, INDEX_AREA_FUNCTIONAL.md

---

## 📋 BACKLOG ORIGINAL (pre-SOTA, independiente del blindaje)

| Ítem | Prioridad | Estado | Detalle |
|------|-----------|--------|---------|
| Elite Portfolio redesign | P1 | Pendiente | Exaggerated Minimalism con taste-skill |
| OIM Website Hostinger | P1 | Bloqueado | Espera: tipo hosting, dominio, acceso SSH |
| `claude doctor` | P2 | Pendiente | Requiere TTY real — correr en terminal separada |
| Marvel Workflows verificar | P3 | Pendiente | 8 archivos en `00_Workflows_Os/02_Marvel/` |
| Avengers Plan decisión | P3 | Pendiente | Ejecutar / actualizar / archivar |

---

## 📈 MÉTRICAS OBJETIVO — ALCANZADAS

| Métrica | Antes | Objetivo | Ahora |
|---------|-------|----------|-------|
| Tests pasando | 15/15 | **35/35** | ✅ 35/35 |
| Drift `.agent/` ↔ live | 6+ archivos | **0** | ✅ 0 |
| Refs v1.x en docs activos | residuales | **0** | ✅ 0 |
| Cobertura Pre-Commit | TS/JS only | **+ secrets** | ✅ Secrets bloqueados |
| Dashboard histórico | ninguno | **CSV + ASCII** | ✅ Operativo |
| Agentes integrados | faltaban 7 | **100% sync** | ✅ 52/52 |

---

_PersonalOS v2.1 Hardened — Actualizado 2026-04-25_
_Próximo milestone: FASE 3 P2 (~3h opcional) o Elite Portfolio_

---

## ✅ SESIÓN COMPACTACIÓN 2026-04-25 — FIXES ADICIONALES

### Fix sys.path en legacy health monitor (50_System_Health_Monitor.py) ✅
**Problema:** Script usaba `sys.path.append(os.path.join("..", ".."))` que desde `10_Legacy/` sube 2 niveles → cae en `04_Operations/` (no `03_Scripts_Os/`), causando que Python encontrará otro `config_paths.py` con paths v1.x.

**Fix:** Cambiar a `sys.path.insert(0, os.path.join(".."))` (solo 1 nivel):
```python
# ANTES (bug)
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

# DESPUÉS (fix)
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
```

**Archivo:** `01_Personal_Os/04_Operations/03_Scripts_Os/10_Legacy/50_System_Health_Monitor.py`

### 01_PLAN_VALIDACION_TOTAL_OS.md actualizado ✅
**Cambios:**
- Issues A1, A2, A3 marcados como **FIXED** (ya estaban corregidos en v6.2)
- FASE A marcada como completada
- Nota de Update 2026-04-25 agregada

### Pendientes de FASE 3:
- A4: Reports huérfanos en `02_Playground/reports/`
- A5: `04_Engine` carpetas huérfanas (buscar en disco)
- A6: Skills auto-loading por contexto
- A7: skill-registry sync (80+/297)
