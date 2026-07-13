# Plan de Mejoras — Think Different PersonalOS
**Versión:** 2.0 | **Fecha:** 2026-06-27 | **Horizonte:** Q3 2026

---

## Diagnóstico en una línea (actualizado)

El OS tiene 396 skills, 74 agentes, 30 HUBs, 28 workflows — **infraestructura de primera**. Pero los números no cuentan la historia completa: documentación desactualizada, skills no indexadas, cambios SDD sin cerrar, y **ningún pipeline de output externo funcionando**. El sistema es un motor de 10 cilindros al que le falta la transmisión.

---

## 📊 Estado Real vs Documentado (verificado contra disco)

| Métrica | Documentado | Real | Delta | Severidad |
|---------|-------------|------|-------|-----------|
| Skills locales | 392 | **396** | +4 | 🟡 Menor |
| Skills en registry | 243 | **208** (post-refresh) | -35 | 🟡 Registry no escanea skills locales |
| Agentes | 61-63 | **74** | +11-13 | 🔴 Brecha documental |
| Workflows | 28 | **28** | 0 | ✅ |
| HUBs | 30 | **30** | 0 | ✅ |
| Evals ejecutados | "Sistema listo" | **3 archivos** (1 agente, 2 sistema) | ⚠️ | 🟡 Esqueleto sin uso real |
| SDD changes abiertos | — | **6 cambios** (algunos posiblemente stale) | ⚠️ | 🟡 Sin revisión |
| Git remote | No hay push | **18 archivos modificados, 8 untracked** | ⚠️ | 🟡 Sin backup remoto |
| Output externo | 0 métricas | 0 piezas medidas | 🔴 | **Crítico** |

---

## 🔴 Bugs Activos Confirmados (de Context_Memory.md)

| ID | Problema | Estado |
|----|----------|--------|
| B001 | `.gitmodules` paths corregidos pero falta `git submodule update --init --recursive` | ⚠️ Fix aplicado, no verificado |
| B002 | Skills README dice "74 skills" cuando hay 396 — info gravemente incorrecta para agentes | 🔴 No corregido |
| B003 | 10+ agentes en disco no documentados en conteos oficiales | 🟡 Parcial |

---

## Fase 1 — Remover fricción y sincronizar la fuente de verdad

### Mejora 1: Boot Protocol Adaptativo (del plan original)

**Problema:** 6 archivos de lectura obligatoria antes de responder. En sesiones cortas, el costo de arranque es mayor que la tarea misma.

**Solución:** Tres modos de arranque según el tipo de tarea.

#### Pasos
1. Crear `00_Winter_is_Coming/BOOT_MODES.md` con tres protocolos (Quick < 30min, Standard, Deep)
2. Modificar CLAUDE.md para que el orquestador elija modo según la tarea
3. Regla en AGENTS.md: si la tarea tiene < 10 palabras y no menciona SDD/CE/audit → MODO QUICK

**Esfuerzo:** 2-3h | **Impacto:** ⭐⭐⭐⭐⭐

---

### Mejora 2: Sistema de Descubrimiento de Skills (del plan original)

**Problema:** 396 skills sin lookup rápido. El `.atl/skill-registry.md` SOLO escanea skills externas (208). Las **396 skills locales del OS** no aparecen en ningún índice unificado.

**Solución:** Unificar registry + crear lookup conversacional.

#### Pasos
1. Reconfigurar skill-registry para que escanee TAMBIÉN `01_Personal_Os/00_Core/02_Tools/02_Skills/` (skills locales)
2. Crear `01_Personal_Os/00_Core/02_Tools/02_Skills/00_SKILL_LOOKUP.md` organizado por intención
3. Vincular el LOOKUP.md en AGENTS.md como paso previo a buscar en disco

**Esfuerzo:** 3-4h | **Impacto:** ⭐⭐⭐⭐⭐

---

### 🔥 Mejora 2b (NUEVA): Sincronizar Documentación

**Problema:** La documentación dice cosas drásticamente distintas a la realidad:
- README de skills: "74 skills" → Real: 396
- Conteo de agentes: 61-63 → Real: 74
- INDEX_AREA_FUNCTIONAL.md: desactualizado vs disco

**Solución:** Barrer y corregir todos los archivos de documentación que mencionan conteos.

#### Pasos
1. Corregir `01_Personal_Os/00_Core/02_Tools/02_Skills/README.md` (74 → 396)
2. Corregir `README.md` raíz (skills, agentes, workflows)
3. Actualizar `INDEX_AREA_FUNCTIONAL.md` con conteos reales
4. Propagar a `Structure_v5.0.md` y `OS_DIRECTORY.md`

**Esfuerzo:** 2h | **Impacto:** ⭐⭐⭐⭐ (elimina desinformación para agentes)

---

## Fase 2 — Producir resultados externos

### Mejora 3: Pipeline de Output de Contenido (del plan original)

**Problema:** Existe `divulgando-tecnologia-ai-strong` pero no hay workflow que conecte idea → producción → distribución → métricas.

**Solución:** Workflow editorial end-to-end.

#### Pasos
1. Crear `01_Personal_Os/00_Core/00_Workflows/01_Personal_Os/05_Content_Pipeline.md`
2. Crear `03_Resultado/Contenido/`
3. Crear `01_Personal_Os/06_Projects/07_Reports/content_log.md`
4. Añadir métrica "Piezas publicadas" a GOALS.md

**Esfuerzo:** 2h | **Impacto:** ⭐⭐⭐⭐⭐

---

### Mejora 4: Pipeline de Monetización (del plan original)

**Problema:** "Generate first income stream" es el objetivo #1 sin ningún soporte en el OS.

**Solución:** Sistema mínimo: identificación → propuesta → seguimiento.

#### Pasos
1. Crear skill `identificando-oportunidades-ai-strong` con template de propuesta
2. Crear `01_Personal_Os/00_Core/00_Workflows/01_Personal_Os/06_Monetization_Pipeline.md`
3. Crear `01_Personal_Os/06_Projects/07_Reports/revenue_log.md`
4. Añadir a Weekly Review: revisión de pipeline de monetización

**Esfuerzo:** 4-5h | **Impacto:** ⭐⭐⭐⭐⭐

---

### 🔥 Mejora 4b (NUEVA): Cerrar SDD Changes Stale

**Problema:** 6 cambios abiertos en `.atl/openspec/changes/`. Algunos (como `fix-doc-counts`, `sound-hooks-opencode`, `video-intel-skill`) pueden estar completados o abandonados. Un SDD change abierto = deuda técnica blanda.

**Solución:** Revisar los 6, archivar los que correspondan, refrescar los activos.

#### Pasos
1. Revisar cada change: `archive/`, `fix-doc-counts/`, `oim-redesign/`, `pattern-intelligence-v1/`, `sound-hooks-opencode/`, `video-intel-skill/`
2. Los completados → ejecutar `sdd-archive`
3. Los activos → actualizar estado
4. Registrar resultado en sesión

**Esfuerzo:** 1-2h | **Impacto:** ⭐⭐⭐ (higiene)

---

## Fase 3 — El sistema aprende del mundo

### Mejora 5: Inglés Sistematizado (del plan original)

**Problema:** "Inglés" en Q2 como "En Progreso" sin skill, workflow ni métricas.

**Solución:** Sistema de práctica diaria integrado al OS.

#### Pasos
1. Crear skill `practicando-ingles-tecnico` con 4 modos (traducción, corrección, shadowing, vocabulary)
2. Añadir métrica semanal a GOALS.md
3. Crear tarea en 04_Tasks/ con práctica diaria 15min

**Esfuerzo:** 3h | **Impacto:** ⭐⭐⭐⭐

---

### Mejora 6: Resiliencia de Memoria (del plan original)

**Problema:** Dependencia total de Engram. Si falla o es compactado, el orquestador arranca ciego.

**Solución:** Estado persistente en texto plano.

#### Pasos
1. Crear `01_Personal_Os/01_Memory/SESSION_STATE.md`
2. Añadir al boot protocol: si Engram falla → leer SESSION_STATE.md
3. Añadir al cierre de sesión: actualizar SESSION_STATE.md

**Esfuerzo:** 1-2h | **Impacto:** ⭐⭐⭐⭐

---

### Mejora 7: Feedback Loop Externo (del plan original)

**Problema:** El OS aprende de sí mismo, no de sus resultados externos.

**Solución:** Punto de entrada semanal para señales del mundo real.

#### Pasos
1. Añadir sección "Señales Externas" al workflow Weekly Review
2. Crear `01_Personal_Os/02_Knowledge/05_External_Signals/`
3. Añadir al proceso de backlog: revisar External_Signals/ antes de priorizar

**Esfuerzo:** 2h | **Impacto:** ⭐⭐⭐

---

## Fase 4 — Escala y calidad sostenida

### 🔥 Mejora 8: Reactivar Eval System + Pipeline de Calidad (versión mejorada del plan original)

**Problema:** `08_Evals/` existe con estructura (README, templates, 3 archivos) pero **no se usa activamente**. El ciclo Eval → Learner → Mejora está documentado pero no ejecutado. 74 agentes sin evaluación de calidad.

**Solución:** No crear desde cero — reactivar lo que ya está armado.

#### Pasos
1. Revisar y actualizar `EVAL_PROTOCOL.md` (ya existe template)
2. Ejecutar primera eval real sobre el Dream Team (7 agentes)
3. Conectar con Auto-Improvement Learner (ya documentado en `05_Scripts/01_Auto_Improvement/`)
4. Registrar en `01_Personal_Os/06_Projects/07_Reports/agent_evals.md`

**Esfuerzo:** 3-4h | **Impacto:** ⭐⭐⭐⭐

---

### 🔥 Mejora 9 (NUEVA): Git Hygiene — Backup Remote

**Problema:** 18 archivos modificados, 8 untracked, 0 push a remote. El plan de Q2 dice "Push Think_Different a GitHub" y no se ha hecho.

**Solución:** Resolver cambios pendientes y hacer push.

#### Pasos
1. Revisar diff de 18 archivos modificados — confirmar intencionalidad
2. Decidir qué hacer con 8 untracked files (especialmente `SKILL.md`, `SKILL_.md`, `PLAN_MEJORAS_OS_v1.md`)
3. Commit de los cambios confirmados
4. Crear remote `think-different` y hacer push

**Esfuerzo:** 1-2h | **Impacto:** ⭐⭐⭐⭐⭐ (backup)

---

### Mejora 10: OS Democratizable (del plan original)

**Problema:** El objetivo "que cualquier persona pueda usarlo" requiere saber qué es SDD, CE, HUBs.

**Solución:** Capa de entrada simplificada.

#### Pasos
1. Crear skill `onboarding-personal-os`
2. Crear `03_Resultado/Guias/GUIA_USUARIO_EXTERNO.md`
3. Beta test con persona externa

**Esfuerzo:** 6-8h | **Impacto:** ⭐⭐⭐

---

### 🔥 Mejora 11 (NUEVA): Capital Token — Ejecutar Fase 1

**Problema:** `00_Capital_Token_Plan.md` tiene un plan detallado (Opción C — Híbrido) con Fase 1 marcada como "Foundation completada". Pero `10_Shared_Org/` solo tiene estructura vacía + 1 playbook + 1 ADR + 3 agent templates. No hay tracción real.

#### Pasos
1. Inventariar qué existe realmente en `10_Shared_Org/`
2. Documentar los playbooks pendientes (mínimo 3 más)
3. Activar el MCP Bridge (`capital-token-bridge.py` v0.1)
4. Decidir si esto es prioridad real o estaba en el plan por inercia

**Esfuerzo:** 3-4h | **Impacto:** ⭐⭐⭐⭐ (depende de prioridad)

---

## Resumen de ejecución

| # | Mejora | Fase | Esfuerzo | Impacto | Estado actual |
|---|--------|------|----------|---------|---------------|
| 1 | Boot Adaptativo | 1 | 2-3h | ⭐⭐⭐⭐⭐ | 🆕 No iniciado |
| 2 | Skill Discovery + Registry Unificado | 1 | 3-4h | ⭐⭐⭐⭐⭐ | 🆕 Registry refrescado, lookup no existe |
| 2b | **Sincronizar Documentación** | 1 | 2h | ⭐⭐⭐⭐ | 🔴 Bugs B002-B003 activos |
| 3 | Content Pipeline | 2 | 2h | ⭐⭐⭐⭐⭐ | 🆕 No iniciado |
| 4 | Monetización | 2 | 4-5h | ⭐⭐⭐⭐⭐ | 🆕 No iniciado |
| 4b | **Cerrar SDD Changes Stale** | 2 | 1-2h | ⭐⭐⭐ | 🟡 6 changes abiertos |
| 5 | Inglés Sistematizado | 3 | 3h | ⭐⭐⭐⭐ | 🆕 No iniciado |
| 6 | Resiliencia Memoria | 3 | 1-2h | ⭐⭐⭐⭐ | 🆕 No iniciado |
| 7 | Feedback Externo | 3 | 2h | ⭐⭐⭐ | 🆕 No iniciado |
| 8 | **Reactivar Eval System** | 4 | 3-4h | ⭐⭐⭐⭐ | 🟡 Esqueleto existe, 0 uso real |
| 9 | **Git Hygiene — Push a Remote** | 4 | 1-2h | ⭐⭐⭐⭐⭐ | 🔴 18 modified, 0 push |
| 10 | Democratización | 4 | 6-8h | ⭐⭐⭐ | 🆕 No iniciado |
| 11 | **Capital Token — Ejecutar** | 4 | 3-4h | ⭐⭐⭐⭐ | 🟡 Fase 1 parcial |

**Total estimado:** 33-43h distribuidas en 12 semanas.

**Prioridad sugerida (qué hacer primero):**
1. 🔴 **9 (Git Hygiene)** — 1-2h, desbloquea backup
2. 🔴 **2b (Docs Sync)** — 2h, elimina desinformación crítica
3. 🔴 **1 (Boot Adaptativo)** — 2-3h, mejora cada sesión de por vida
4. 🟡 **3 (Content Pipeline)** — 2h, primer pipeline de output real
5. 🟡 **4b (SDD Cleanup)** — 1-2h, cierra deuda técnica blanda

---

## Métricas de éxito del plan completo

Al final de Q3 2026, el OS debería mostrar:

- Tiempo de arranque para tareas cortas: < 2 minutos
- Documentación sincronizada: 0 bugs de conteo (B002-B003 cerrados)
- Git remote activo con push semanal
- Piezas de contenido publicadas por mes: ≥ 4
- Prospectos en pipeline de monetización: ≥ 3
- Sesiones de inglés por semana: ≥ 3
- Agentes evaluados con historial: ≥ 6 (Dream Team completo)
- SDD changes abiertos: 0 stale (todos activos o archivados)
- Mejoras del OS originadas en señales externas: ≥ 2 por mes

---

## Áreas de Oportunidad Adicionales (descubiertas en auditoría)

Estas no están en el plan de acción inmediato pero son worth watching:

| # | Oportunidad | Por qué |
|---|-------------|---------|
| A1 | **Graphify Knowledge Graph** — Existe en `02_Playground/Graphify_Out/` pero no se usa en el flujo diario | Podría reemplazar búsquedas manuales en la KB |
| A2 | **SOTA Features sin integrar** — `06_SOTA_Features/` tiene `ambient_intelligence/`, `contemplation_loop/`, `feedback_loop/`, `voice_profile/`, `memory_versioning/` | Features estado-del-arte que nadie usa |
| A3 | **Hillary Life OS** — Inbox vacío (solo test), triggers definidos pero sin uso real | Está configurado pero no hay engagement |
| A4 | **Process Notes sin acción** — `Context_LLM/01_Process_Notes/` tiene notas pero no hay mecanismo para convertirlas en acciones | Conocimiento capturado que se pierde |
| A5 | **Auto-Improvement sin feedback loop** — Corre cada 8h pero sus outputs no retroalimentan el backlog ni las tareas | Motor recursivo que podría estar haciendo más |

---

_Plan generado: 2026-06-27 | Revisión sugerida: 2026-07-15_
_Ubicación: `/PLAN_MEJORAS_OS_v1.md` (raíz del proyecto)_
