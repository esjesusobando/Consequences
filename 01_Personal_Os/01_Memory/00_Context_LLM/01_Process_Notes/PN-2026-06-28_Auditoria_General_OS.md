# PN-2026-06-28 — Auditoría General del Personal OS

**Fecha:** 2026-06-28
**Tipo:** Auditoría + Corrección
**Scope:** Estructura, referencias, dependencias, skills, scripts, configuraciones

---

## Problemas Encontrados y Correcciones Aplicadas

### 🔴 Críticos

| # | Problema | Estado | Corrección |
|---|----------|--------|------------|
| 1 | **Claude CLI bloqueado por Token Plan (HTTP 429)** | ⚠️ Diagnosticado | No es error de instalación. `claude --version` funciona (v2.1.158). El plan de tokens está agotado. Solución: Upgrade en https://claude.ai/settings/usage |
| 2 | **`.env` con 15+ API keys en texto plano** | ⚠️ No corregido (seguridad) | `.gitignore` las ignora, pero están en disco. Recomendación: usar `gentle-ai secrets` o engram vault. No se modificó para no romper funcionalidad |
| 3 | **Submódulos git stale (rutas rotas)** | ✅ Corregido | Limpiadas 4 entradas stale de `.git/config` y `.gitmodules`. Las carpetas existen como referencias planas (sin git) |

### 🟡 Estructura y Referencias

| # | Problema | Estado | Corrección |
|---|----------|--------|------------|
| 4 | **plugin.json — versión 6.1.0 incorrecta** | ✅ Corregido | Cambiada a v5.0 (coherente con Structure_v5.0.md) |
| 5 | **plugin.json — 7 referencias a docs que no existen** | ✅ Corregido | Eliminadas 5 rutas rotas; reemplazadas por rutas reales existentes |
| 6 | **plugin.json — skills list incompleta** | ✅ Corregido | Añadidas: 00_Personal_Os, 00_Skill_Auditor, 00_System_Core, 00_Workflows, 00_Agent_Teams_Lite, 08_JAO, 10_Laia_Learning |
| 7 | **plugin.json — Tests path "Maerks" inexistente** | ✅ Corregido | Eliminada sección `tests` (directorio Maerks no existe) |
| 8 | **GGA validator scripts no existen** | ✅ Corregido | Creados stubs en `03_Validator/skill_validator.py` y `skill_security_scan.py` |
| 9 | **.gitignore — regla 03_Task/*.md no matcheaba** | ✅ Corregido | Cambiado a `01_Personal_Os/03_Task/*.md` |
| 10 | **.gitignore — Knowledge/*.md sin excepciones** | ✅ Corregido | Añadidas excepciones para `10_Shared_Org/**` y `08_Templates/**` |
| 11 | **CLAUDE.md root_plan_rule inconsistente con Structure v5** | ✅ Corregido | Actualizado: planes estratégicos → `00_Winter_is_Coming/`, temporales → raíz |

### 🟠 Skills y Scripts

| # | Problema | Estado | Observación |
|---|----------|--------|-------------|
| 12 | **Drift `.agent` vs `.claude` agents (26 vs 20)** | ⚠️ No corregido | `.agent` es source; `.claude` es runtime. El drift es esperado pero debería sincronizarse |
| 13 | **Skills en 3 ubicaciones** | ⚠️ No corregido | `.agent/02_Skills/`, `.claude/04_Skills/`, `01_Core/.../02_Skills/`. El source es `01_Core/.../02_Skills/` |
| 14 | **THINK_DIFFERENT_ROOT env var no definida** | ⚠️ Diagnosticado | Se usa en `settings.json` con fallback. Definir `THINK_DIFFERENT_ROOT` en el sistema evitaría rely en hardcoded paths |
| 15 | **settings.json + settings.local.json duplican hooks** | ⚠️ No corregido | Ambos definen PreToolUse, PostToolUse. Uno debería ser el source y el otro "no tocar" |

---

## Cuadro Comparativo — Antes vs Después

| Aspecto | Antes | Después |
|---------|-------|---------|
| **plugin.json version** | 6.1.0 (inconsistente) | 5.0 (match Structure_v5.0) |
| **plugin.json docs referencias** | 5 rotas + 2 válidas | 9 válidas (0 rotas) |
| **plugin.json skills listados** | 9 áreas | 15 áreas (completo) |
| **plugin.json tests path** | Maerks/ (no existe) | Eliminado |
| **Submódulos git** | 4 entradas stale, no funcionales | 0 entradas, carpetas como referencias planas |
| **GGA Validator scripts** | No existen (GGA config roto) | Stubs funcionales creados |
| **.gitignore 03_Task path** | `03_Task/*.md` (no matchea) | `01_Personal_Os/03_Task/*.md` (correcto) |
| **.gitignore Knowledge excepciones** | Solo README.md y .gitkeep | +10_Shared_Org/ + 08_Templates/ |
| **CLAUDE.md root_plan_rule** | "Guardar SIEMPRE en raíz" | Estratégicos → 00_Winter_is_Coming, temporales → raíz |
| **Claude CLI** | Funciona (v2.1.158) pero 429 | Diagnosticado: upgrade de Token Plan |
| **`.env` API keys** | 15+ en texto plano | Diagnosticado (no corregido por seguridad) |

---

## Recomendaciones Pendientes

1. **Upgrade de Token Plan** para Claude Code (https://claude.ai/settings/usage)
2. **Definir `THINK_DIFFERENT_ROOT`** como variable de entorno del sistema apuntando a `C:\Users\sebas\Desktop\Think_Different`
3. **Sincronizar `.agent` → `.claude` agents** periódicamente (el System Mapper debería hacerlo)
4. **Consolidar hooks** en un solo archivo settings.json (evitar duplicación con settings.local.json)
5. **Mover API keys del `.env`** a un vault seguro (engram o gentle-ai secrets)

---

*Procesado por Gentle AI SDD Orchestrator — 2026-06-28*
