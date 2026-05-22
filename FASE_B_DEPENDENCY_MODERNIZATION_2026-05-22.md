# Fase B — Dependency Modernization Audit
**Fecha:** 2026-05-22
**Proyecto:** Think_Different
**Fuente:** PLAN_SEGUIR_2026-05-22.md

---

## Resumen Ejecutivo

| Proyecto | Risk | Action |
|---|---|---|
| `.opencode` | LOW | UPGRADE patch/minor |
| `05_OBAND` | LOW | UPGRADE patch/minor, defer lucide-react major |
| `06_OIM_Original` | MEDIUM | DEFER majors, upgrade only patch/minor |
| `08_Elite_Portfolio` | HIGH | MIGRATION PROJECT needed |
| `04_Macano_Rest/APP/frontend` | MEDIUM | INVESTIGATE npm install first |

**OIM_Website:** Path no existe en `03_Resultado/09_World_OIM/02_OIM_Website/` — verificar ubicación real.

---

## Detalle por Proyecto

### 1. `.opencode/` — plugins de entorno
- **Node:** v24.12.0 | **NPM:** 11.6.2
- **Framework:** plugins (no frontend framework)
- **Status:** LOW RISK
- **Upgrades disponibles:**
  - `@kilocode/plugin: 7.2.52 → 7.3.1` (patch)
  - `@opencode-ai/plugin: 1.14.50 → 1.15.7` (minor)
- **Majors pendientes:** Ninguno
- **Recomendacion:** HACER UPGRADE — solo patch/minor, seguro

---

### 2. `05_OBAND/`
- **Node:** v24.12.0 | **NPM:** 11.6.2
- **Framework:** Next 16.2.2 / React 19.2.4
- **Status:** LOW RISK
- **Upgrades disponibles:**
  - `@neondatabase/serverless: 1.0.2 → 1.1.0` (minor)
  - `@tailwindcss/postcss: 4.2.2 → 4.3.0` (minor)
  - `@vitejs/plugin-react: 6.0.1 → 6.0.2` (patch)
  - `framer-motion: 12.38.0 → 12.40.0` (patch)
  - `lucide-react: 1.7.0 → 1.16.0` **(MAJOR)**
  - `tailwindcss: 4.2.2 → 4.3.0` (minor)
- **Majors pendientes:** `lucide-react: 1.7.0 → 1.16.0`
- **Recomendacion:** UPGRADE patch/minor ahora. `lucide-react` major en branch separado.

---

### 3. `06_OIM_Original/`
- **Node:** v24.12.0 | **NPM:** 11.6.2
- **Framework:** Vite 6.4.1 / React 19.2.4
- **Status:** MEDIUM RISK
- **Upgrades disponibles (patch/minor safe):**
  - `@google/genai: 1.48.0 → 1.52.0` (minor)
  - `tailwindcss: 4.2.2 → 4.3.0` (minor)
- **Majors pendientes (DEFER):**
  - `@vitejs/plugin-react: 5.2.0 → 6.0.2`
  - `lucide-react: 0.546.0 → 1.16.0`
  - `express: 4.22.1 → 5.2.1`
  - `vite: 6.4.1 → 8.0.14`
  - `typescript: 5.8.3 → 6.0.3`
- **Recomendacion:** Solo patch/minor ahora. Majors requieren branch propio + testing.

---

### 4. `08_Elite_Portfolio/` — MIGRATION NEEDED
- **Node:** v24.12.0 | **NPM:** 11.6.2
- **Framework:** **Next 14.2.25 / React 18.3.1** (OUTDATED)
- **Status:** HIGH RISK — MIGRATION PROJECT
- **Todo es major:**
  - `next: 14.2.25 → 16.2.6`
  - `react: 18.3.1 → 19.2.6`
  - `react-dom: 18.3.1 → 19.2.6`
  - `eslint: 8.57.1 → 10.4.0`
  - `eslint-config-next: 14.2.25 → 16.2.6`
  - `framer-motion: 11.18.2 → 12.40.0`
  - `tailwindcss: 3.4.17 → 4.3.0`
  - `typescript: 5.4.5 → 6.0.3`
- **Recomendacion:** Crear SDD para migracion Next 16 + React 19 + Tailwind 4.

---

### 5. `04_Macano_Rest/APP/frontend/`
- **Node:** v24.12.0 | **NPM:** 11.6.2
- **Framework:** Vite 6 / React 19
- **Status:** MEDIUM RISK — DEPENDENCIAS MISSING
- **Nota:** `npm outdated` muestra todos los deps como MISSING pero package.json tiene rangos `^`. Posible issue de `npm install`.
- **Recomendacion:** Investigar — ejecutar `npm install` primero, luego re-check.

---

## Hallazgos

1. **OIM_Website no existe** en la ruta del plan (`03_Resultado/09_World_OIM/02_OIM_Website/`)
2. **Elite_Portfolio** es el proyecto mas desactualizado: Next 14 / React 18
3. **Macano frontend** tiene desincronizacion entre package.json y node_modules

---

## Acciones Recomendadas

| # | Proyecto | Accion | Prioridad |
|---|---|---|---|
| 1 | `.opencode` | `npm update --save` | P1 |
| 2 | `05_OBAND` | `npm update --save` (patch/minor) | P1 |
| 3 | `05_OBAND` | Branch para `lucide-react` major | P2 |
| 4 | `06_OIM_Original` | `npm update --save` (patch/minor) | P1 |
| 5 | `08_Elite_Portfolio` | SDD para migracion | P2 |
| 6 | `04_Macano_Rest/APP/frontend` | `npm install` + re-check | P1 |

---

## Siguiente Paso

Aprobacion para ejecutar upgrades patch/minor en:
1. `.opencode`
2. `05_OBAND`
3. `06_OIM_Original`