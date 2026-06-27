# 🔍 DIAGNÓSTICO DE DOCUMENTACIÓN — Qué archivar y qué actualizar

> **Fecha:** 2026-06-25 | **Objetivo:** Identificar ruido, duplicados y docs obsoletas

---

## 📊 RESUMEN EJECUTIVO

```
┌─────────────────────────────────────────────────────────────────┐
│  TOTAL DOCS ESCANEADAS:     ~200+ archivos .md                 │
│  DUPLICADOS ENCONTRADOS:    2 (Os_Directory.md vs OS_DIR)      │
│  DOCS OBSOLETAS:            3                                  │
│  ITEMS COMPLETADOS EN BACKLOG: 17                              │
│  READMEs EN node_modules:   462 (noise total)                  │
│  DIRECTORIOS VACÍOS:        0                                  │
│  ACCIONES RECOMENDADAS:     8                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔴 ACCIONES CRÍTICAS (Hacer ahora)

| # | Archivo | Problema | Acción | Prioridad |
|---|---------|----------|--------|-----------|
| 1 | `Os_Directory.md` (root) | DUPLICADO exacto de `OS_DIRECTORY.md` | Eliminar `Os_Directory.md` | 🔴 CRÍTICO |
| 2 | `00_Winter_is_Coming/BACKLOG.md` | 17 items completados `[x]` sin limpiar | Mover completados a sección ✅ | 🔴 CRÍTICO |
| 3 | `00_Winter_is_Coming/COMPLETION_SUMMARY.md` | Primera entrada es de 24/05/2026 (vieja) | Mantener como histórico, agregar flag | 🟡 MEDIO |

---

## 🟡 DOCS QUE PUEDEN ARCHIVARSE (No suman al OS)

| # | Archivo | Razón | Acción |
|---|---------|-------|--------|
| 4 | `00_Winter_is_Coming/ARCHIVE_MANIFEST.md` | Doc histórico de fusión de skills (2026-05-29), no se usa | Mover a `05_Archive/01_Plans_Completed/` |
| 5 | `00_Winter_is_Coming/Skills/PM_Agent_Orchestrator.md` | Skill suelta en 00_Winter, ya existe en `01_Agents/06_Marketing_Orchestrator.md` | Mover a archive o eliminar |
| 6 | `CLAUDE.marketing.md` (root) | Template de marketing, no se referencia desde ningún lado | Verificar si se usa, si no → archive |

---

## 🟢 DOCS QUE SE MANTIENEN (Suman al OS)

| # | Archivo | Estado | Nota |
|---|---------|--------|------|
| 7 | `README.md` (root) | ✅ Actualizado v4.9.1 | OK |
| 8 | `CLAUDE.md` (root) | ✅ Actualizado v4.9.1 | OK |
| 9 | `OS_DIRECTORY.md` (root) | ✅ Actualizado v4.9.1 | OK (el otro es duplicado) |
| 10 | `AGENTS.md` (root) | ✅ Actualizado v4.9.1 | OK |
| 11 | `Structure_v5.0.md` | ✅ Actualizado v4.9.1 | OK |
| 12 | `00_Capital_Token_Plan.md` | ✅ Activo | OK |
| 13 | `00_Resumen_Sesion.md` | ✅ Activo | OK |
| 14 | `00_Winter_is_Coming/AGENTS.md` | ✅ v4.9.1 | OK |
| 15 | `00_Winter_is_Coming/GOALS.md` | ✅ 2026-06-25 | OK |
| 16 | `00_Winter_is_Coming/CHANGELOG.md` | ✅ v4.9.1 | OK |
| 17 | `00_Winter_is_Coming/OS_DIRECTORY.md` | ✅ v4.9.1 | OK |
| 18 | `00_Winter_is_Coming/README.md` | ✅ v4.9.1 | OK |
| 19 | `00_Winter_is_Coming/00_Iron_Man_Gen.md` | ✅ v4.9.1 | OK |
| 20 | `00_Winter_is_Coming/BACKLOG.md` | ⚠️ Tiene 17 items completados | Limpiar |

---

## 📦 NODE_MODULES NOISE

```
┌──────────────────────────────────────────────────────────────┐
│  READMEs en node_modules:  462 archivos                      │
│  Ubicaciones:                                                 │
│    - 02_Playground/07_Zero_Consequences/.../node_modules/    │
│    - 03_Resultado/02_Experimentos/00_World_OIM/.../node_modules/ │
│    - 01_Personal_Os/04_Operations/05_Projects/.../node_modules/  │
│                                                              │
│  Acción: Agregar node_modules/ a .gitignore si no está       │
│  Impacto: -462 archivos de ruido en git                      │
└──────────────────────────────────────────────────────────────┘
```

---

## 📋 PLAN DE ACCIÓN

| Paso | Acción | Archivos | Riesgo |
|------|--------|----------|--------|
| 1 | Eliminar `Os_Directory.md` duplicado | 1 archivo | Ninguno |
| 2 | Limpiar BACKLOG.md (17 items completados) | 1 archivo | Ninguno |
| 3 | Archivar `ARCHIVE_MANIFEST.md` | 1 archivo | Ninguno |
| 4 | Mover `Skills/PM_Agent_Orchestrator.md` | 1 archivo | Ninguno |
| 5 | Verificar `CLAUDE.marketing.md` uso | 1 archivo | Bajo |
| 6 | Agregar `node_modules/` a .gitignore | 1 archivo | Ninguno |
| 7 | Commit + push | — | — |
| 8 | Documentar en NP + CTX | — | — |

---

## ⚠️ NOTA SOBRE node_modules

Los 462 READMEs en node_modules son de proyectos en:
- `02_Playground/07_Zero_Consequences/` — App React/Firebase
- `03_Resultado/02_Experimentos/00_World_OIM/` — Website Next.js
- `01_Personal_Os/04_Operations/05_Projects/09_Valeria/` — Proyecto Valeria

**Recomendación:** Verificar si `.gitignore` ya excluye `node_modules/`. Si no, agregarlo.

---

*Diagnóstico: 2026-06-25 | Think Different PersonalOS v4.9.1*
