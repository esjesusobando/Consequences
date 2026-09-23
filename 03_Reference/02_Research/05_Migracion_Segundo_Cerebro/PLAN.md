# PLAN — Migración Segundo Cerebro (Oband_Os)

> **Fecha:** 2026-07-30 | **Estado:** COMPLETO (7/7 fases, 2026-07-31 — 286 notas migradas)
> **Arquitectura:** Oband_Os = Knowledge layer (Second Brain) | Think_Different = Executable layer (Hands)
> **Principio:** Un archivo vive en UN solo lugar. Conocimiento → Obsidian. Código → Think_Different. Referenciar con wikilink, NUNCA duplicar.

---

## 1. Mapeo Fuente → Destino

| # | Fuente (Think_Different) | Nº .md | Destino (Oband_Os) | Acción |
|---|---|---|---|---|
| M1 | `01_Personal_Os/01_Memory/00_Context_LLM/01_Process_Notes` | 83 (52 raíz + 31 `_archive`) | `01_OS/Knowledge/Sesiones/` + `01_OS/Archive/Sessions/` | ✅ COPIADO: 52 raíz → Sesiones, 31 `_archive` → Archive/Sessions, `source:` verificado |
| M2 | `01_Personal_Os/01_Memory/Notas_de_Proceso.md` (1330 líneas) | 1 | `01_OS/Knowledge/Sesiones/Notas_de_Proceso.md` (index, sin renombrar a fecha) | ✅ COPIADO: 1334 líneas, `source:` corregido a `01_Memory/` |
| M3 | `01_Personal_Os/01_Memory/00_Context_LLM/00_Context_Memory` | 54 (32 raíz + 22 `_archive`) | `01_OS/Knowledge/Referencias/Context_Memory/` + `01_OS/Archive/Context_Memory/` | ✅ COPIADO 54/54 (32+22) |
| M4 | `01_Personal_Os/01_Memory/00_Context_LLM/06_Solutions` | 12 | `01_OS/Knowledge/Aprendizajes/` | ✅ COPIADO 12/12 (raíz 3 + subdirs 9) |
| M5 | `01_Personal_Os/01_Memory/00_Context_LLM/07_Auditorias` | 5 | `01_OS/Knowledge/Post_Mortems/` | ✅ COPIADO 5/5 |
| M6 | `02_Knowledge/02_Docs/` completo (38: Docs 28 + Runbooks 7 + sueltos 3) | 38 | `01_OS/Knowledge/Referencias/` | ✅ COPIADO 38/38, subestructura mantenida |
| M7 | `02_Knowledge/05_Frameworks/` (Anthropic 10, Unicorn 25, Invictus 1, Frictionless 4) | 40 | `01_OS/Knowledge/Referencias/Frameworks/` | ✅ COPIADO 40/40 (Engineering_Principles excluido — ya en Patterns vía M12) |
| M8 | `02_Knowledge/01_Research` | 22 | `06_Research/06_From_Think_Different/` | ✅ COPIADO 22/22 (incluye subdirs `_transcripts` y `2026-07-28_LA...`); .html excluido |
| M9 | `03_Learning/` completo | 31 | `03_Learning/` | ✅ COPIADO 31/31 (Shared_Org 22 + Learning_Always 2 + Content 5 + Telemetry 1 + README) |
| M10 | `00_Winter_is_Coming/GOALS.md, BACKLOG.md, CHANGELOG.md` | 3 | `00_Captain/` (resumen + wikilink a Think_Different) | ✅ RESUMIDO 3/3 (viejos de abril reemplazados por resúmenes frescos de julio con wikilink) |
| M11 | `04_Tasks/*.md` raíz (24 activas) | 24 | `01_OS/Tasks/Active/` | ✅ COPIADO 24/24 (templates 14, Done 55, Inbox 2 NO — wikilink) |
| M12 | `02_Knowledge/06_Voice` (7) + `05_Frameworks/13_Engineering_Principles` (3) | 10 | `02_Memory/Conventions/` + `02_Memory/Patterns/` | ✅ COPIADO 10/10, README actualizado con wikilinks |
| M13 | `01_Memory/00_Context_LLM/05_Plans` | 4 | `01_OS/Knowledge/Referencias/Planes/` | ✅ COPIADO 4/4 |

**NO migrar** (se queda en Think_Different): `06_Projects` (791 md — solo índice), `05_Scripts` (código), `00_Core/00_Workflows` (código), `02_Playground` (38 — solo aprendizajes sueltos), `AGENTS.md`/`CLAUDE.md` completos, `08_Model_Evals`, `13_Scripts`, `10_Telemetry`, `.git`, binarios, caches.

**Total candidatos:** ~240 .md de conocimiento | **Total a copiar:** ~220 | **Total resumidos:** ~3-5 | **0 código**

---

## 2. Edge Cases

| # | Riesgo | Mitigación |
|---|---|---|
| E1 | **Links internos rotos**: los .md de Think_Different usan rutas relativas/absolutas (`C:\Users\sebas\Desktop\Think_Different\...`) que no existen en el vault | Convertir a wikilinks `[[ruta]]`; conservar la ruta original en frontmatter `source:` para trazabilidad |
| E2 | **Nombres no conformes**: kebab-case (`smoke-vs-unit-test-counts`), espacios, fechas sin prefijo | Renombrar a convención vault: `YYYY-MM-DD_Name_Pascal_Case.md` |
| E3 | **Duplicados**: `07_Archive/00_Duplicates_Auto` + contenido repetido entre Context_Memory/Knowledge_Brain/Memory_Brain | Dry-run con `dedup_findings.py` (verificado, funciona) antes de copiar |
| E4 | **Monolito Notas_de_Proceso.md**: 1330 líneas, ~20 sesiones mezcladas | Copiar como index; NO dividir en esta fase (lote 2 opcional: split por `## NP-`/`## Sesión`) |
| E5 | **Frontmatter Obsidian faltante**: los .md fuente no tienen `type/tags` | Aplicar template correspondiente (session/learning/decision/reference) en la copia |
| E6 | **Archivos no-.md** (scripts .py, .json dentro de zonas de conocimiento) | NO copiar — solo `.md`; si son referenciados, wikilink al path real |
| E7 | **Hooks de Think_Different** (GGA pre-commit) si se copia vía git | Copiar con `cp` plano, nunca `git` — evita hooks y cache |
| E8 | **Gráfica vacía post-migración** | Cada nota migrada DEBE enlazar a su zona-hub (`README`) y viceversa; verificación final con grep `[[` |
| E9 | **Pérdida de trazabilidad** (¿de dónde vino cada nota?) | Frontmatter `source: <ruta original completa>` en TODA nota migrada |
| E10 | **08_Model_Evals y 13_Scripts vacíos** (0 .md) | Nada que migrar — documentar en README de destino que existen en Think_Different |

---

## 3. Análisis de Impacto

**Positivo:**
- Vault pasa de 99 → ~320 .md; la gráfica de Obsidian cobra vida (notas reales + links)
- `01_OS/Knowledge/*` deja de ser esqueleto: Sesiones (~84), Referencias (~90), Aprendizajes (~12), Post_Mortems (~5)
- `03_Learning` y `02_Memory` se pueblan por primera vez
- Think_Different conserva TODO su código/sistema intacto — cero riesgo operativo

**Negativo / riesgo:**
- **Nunca se toca Think_Different** (solo lectura). Nada se mueve, todo se copia — reversión = borrar la carpeta destino
- Los links internos rotos son el riesgo #1: cada lote debe validarse con grep antes de darlo por bueno
- El monolito Notas_de_Proceso (1330 líneas) infla el vault — aceptado como index inicial
- Tiempo estimado: **2-3 horas** en 6 lotes (lotes M1-M2 son los pesados: 84 archivos)

**Orden de ejecución (por riesgo/valor):** M1+M2 (memoria) → M12 (memory/patterns, rápido) → M6+M7 (referencias) → M8 (research) → M9 (learning) → M3+M4+M5 (context/solutions/auditorías) → M13 (planes) → M11 (tasks) → M10 (captain resúmenes) → verificación gráfica.

---

## 4. Fases de Implementación

### Fase 0 — Preparación (15 min)
- [ ] Backups: dry-run `dedup_findings.py` sobre Context_Memory/Knowledge_Brain/Memory_Brain (E3)
- [ ] Crear estructura destino vacía (carpetas + README stub con wikilink a Think_Different)
- [ ] Script helper: copia .md + aplica frontmatter + renombra a convención

### Fase 1 — Memoria (M1+M2) (30 min) ✅ COMPLETA
- [x] Copiar `01_Process_Notes` (52 raíz) → `01_OS/Knowledge/Sesiones/` con template session + `source:`
- [x] Copiar `_archive/` (31) → `01_OS/Archive/Sessions/` (decision: histórico separado)
- [x] Copiar `Notas_de_Proceso.md` (1334 líneas) como index con `source:` a `01_Memory/`
- [x] Verificar: 84 archivos con `source:` limpio (grep 0 corruptos)

### Fase 2 — Memory/Patterns (M12) (10 min) ✅ COMPLETA
- [x] Voice (7: guide + 6 samples) → `02_Memory/Conventions/`; Engineering Principles (3) → `02_Memory/Patterns/`
- [x] Actualizar `02_Memory/README.md` con conteo real (3 + 7) y wikilinks

### Fase 3 — Referencias (M6+M7+M13) (30 min) ✅ COMPLETA
- [x] Docs (38: 28 Docs + 7 Runbooks + 3 sueltos) → `01_OS/Knowledge/Referencias/` (subestructura mantenida)
- [x] Frameworks (40: Anthropic 10, Unicorn 25, Invictus 1, Frictionless 4) → `.../Referencias/Frameworks/`; Engineering_Principles NO duplicado (M12)
- [x] Plans (4) → `.../Referencias/Planes/`
- [x] README de Referencias actualizado con conteos reales

### Fase 4 — Research + Learning (M8+M9) (25 min) ✅ COMPLETA
- [x] Research (22) → `06_Research/06_From_Think_Different/` + entrada en README de 06_Research
- [x] Learning (31: Shared Org 22, Learning Always 2, Content 5, Telemetry 1, README 1) → `03_Learning/` (subestructura original)
- [x] READMEs de 06_Research y 03_Learning actualizados

### Fase 5 — Context/Solutions/Auditorías/Tasks (M3+M4+M5+M11) (25 min) ✅ COMPLETA
- [x] Context_Memory (54: 32 raíz + 22 archive) → `Referencias/Context_Memory/` + `Archive/Context_Memory/`
- [x] Solutions (12, con subdirs) → `Aprendizajes/`
- [x] Auditorias (5) → `Post_Mortems/`; Tasks activas (24) → `Tasks/Active/` (solo raíz; Done/Inbox/Templates con wikilink)

### Fase 6 — Captain resúmenes (M10) (15 min) ✅ COMPLETA
- [x] GOALS/BACKLOG/CHANGELOG → resúmenes frescos en `00_Captain/` con wikilink a los originales de Think_Different
- [x] Los archivos viejos de abril en 00_Captain reemplazados (estaban desactualizados frente a julio)

### Fase 7 — Verificación gráfica (15 min) ✅ COMPLETA
- [x] grep `[[` global: **391/469 = 83%** con links salientes (objetivo ≥80% — hoy 62% pre-migración)
- [x] Footers `> 🔗 Zona: [[<README>]]` añadidos a 303 notas migradas sin links (E8)
- [x] Think_Different `git status` limpio (C4 ✅ — 0 cambios, solo lectura)
- [x] Verificación C1/C2/C3/C5 completada (325 source:, 0 código, 83% links)

---

## 5. Criterios de Éxito (medibles)

1. ≥ 200 notas migradas con frontmatter `source:` completo
2. Cero archivos de código (.py/.js/.json) en el vault
3. ≥ 80% de notas con links salientes (gráfica viva)
4. Think_Different sin modificar (verificar `git status` limpio al final)
5. Cada zona-hub (README) del vault actualizado con conteos reales

---

## 6. Riesgos que requieren decisión del usuario

- **R1**: ¿Dividir Notas_de_Proceso.md (1330 líneas) en notas por sesión? (default: NO en esta fase)
- **R2**: ¿Migrar también 02_Playground (38 .md)? (default: NO — solo aprendizajes)
- **R3**: ¿Crear índice con MOC (Map of Content) manual vs confiar en la gráfica? (default: MOC manual en 00_Captain)

---

## Judgment Day — Sesión de Migración (2026-07-31)

| Campo | Valor |
|---|---|
| **Target identity** | `5194522ea64a1aab56dc8f7cff08b33a39e13134c846428d8f139679d2756a52` |
| **Ronda** | 2 (round 1 fix + round 2 scoped re-judgment) |
| **Confirmed** | JD-1 (CRITICAL, resuelto) |
| **Suspect** | JD-2 (wikilinks absolutos 00_Captain), JD-3 (../ wikilinks Referencias), JD-4 (index link roto 06_Research), JD-5 (conteos READMEs inconsistentes) |
| **Pre-existing** | JD-6 (Sesiones/README stale links), JD-7 (04_Deep_Research_Example/index roto) |
| **Fix work units** | JD-1 → creados `Archive/Sessions/README.md` + `Archive/Context_Memory/README.md` |
| **Scoped re-judgment** | approved (ambos jueces round 2: 0 findings) |
| **Veredicto terminal** | `JUDGMENT: APPROVED ✅` |
