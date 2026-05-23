# Fase B — Dependency Modernization Audit
**Fecha:** 2026-05-22
**Proyecto:** Think_Different
**Fuente:** SDD_PLAN_PROBAR_FASES_2026-05-22.md
**Actualizado:** 2026-05-22 18:00

---

## Resumen Ejecutivo

| Proyecto | Risk | Action |
|---|---|---|
| `.opencode` | LOW | UPGRADE patch/minor ahora |
| `05_OBAND` | MEDIUM | UPGRADE patch/minor, diferir lucide major |
| `06_OIM_Original` | HIGH | UPGRADE patch/minor, majors requieren SDD propio |
| `04_Macano_Rest/APP` | MEDIUM | UPGRADE patch/minor ahora |
| `08_Elite_Portfolio` | CRITICAL | MIGRATION PROJECT SDD necesario |

---

## Rutas Correctas (actualizadas)

> **Ubicación real:** `01_Personal_Os/04_Operations/05_Projects/01_Projects_Lab/`

| Proyecto | Ruta Correcta |
|----------|---------------|
| `.opencode` | `C:\Users\sebas\Desktop\Think_Different\.opencode\` |
| `05_OBAND` | `01_Personal_Os\04_Operations\05_Projects\01_Projects_Lab\05_OBAND\` |
| `06_OIM_Original` | `01_Personal_Os\04_Operations\05_Projects\01_Projects_Lab\06_OIM_Original\` |
| `04_Macano_Rest/APP` | `01_Personal_Os\04_Operations\05_Projects\01_Projects_Lab\04_Macano_Rest\APP\` |
| `08_Elite_Portfolio` | `01_Personal_Os\04_Operations\05_Projects\01_Projects_Lab\08_Elite_Portfolio\` |

---

## Detalle por Proyecto

### 1. `.opencode/` — plugins de entorno
- **Node:** v24.12.0 | **NPM:** 11.6.2
- **Framework:** plugins (no frontend framework)
- **Status:** LOW RISK
- **Upgrades disponibles:**
  - `@opencode-ai/plugin: 1.15.7 → 1.15.9` (minor)
- **Recomendacion:** HACER UPGRADE — solo minor, seguro

---

### 2. `05_OBAND/`
- **Node:** v24.12.0 | **NPM:** 11.6.2
- **Framework:** Vite / React 19
- **Status:** MEDIUM RISK
- **Upgrades disponibles (patch/minor):**
  - `vitest: 4.1.2 → 4.1.7`
  - `jsdom: 29.0.1 → 29.1.1`
  - `next: 16.2.2 → 16.2.6` (minor)
  - `@types/react: 19.2.14 → 19.2.15`
  - `@types/node: 20.19.39 → 20.19.41`
- **Majors pendientes (DIFERIR):**
  - `lucide-react: 1.7.0 → 1.16.0`
  - `eslint: 9.39.4 → 10.4.0`
  - `typescript: 5.9.3 → 6.0.3`
- **Recomendacion:** UPGRADE patch/minor ahora. Majors en branch separado.

---

### 3. `06_OIM_Original/`
- **Node:** v24.12.0 | **NPM:** 11.6.2
- **Framework:** Vite / React 19
- **Status:** HIGH RISK
- **Upgrades disponibles (patch/minor):**
  - `@types/node: 22.19.17 → 22.19.19`
  - `react: 19.2.4 → 19.2.6` (minor)
  - `react-dom: 19.2.4 → 19.2.6` (minor)
- **Majors pendientes (REQUIEREN SDD PROPIO):**
  - `lucide-react: 0.546.0 → 1.16.0`
  - `@google/genai: 1.52.0 → 2.6.0`
  - `express: 4.22.2 → 5.2.1`
  - `vite: 6.4.2 → 8.0.14`
  - `typescript: 5.8.3 → 6.0.3`
  - `@vitejs/plugin-react: 5.2.0 → 6.0.2`
- **Recomendacion:** Solo patch/minor ahora. Majors requieren SDD dedicado.

---

### 4. `04_Macano_Rest/APP/`
- **Node:** v24.12.0 | **NPM:** 11.6.2
- **Framework:** Vite / React
- **Status:** MEDIUM RISK
- **Upgrades disponibles (patch/minor):**
  - Ninguno crítico disponible
- **Majors pendientes:**
  - `vite: 6.4.2 → 8.0.14`
  - `@vitejs/plugin-react: 4.7.0 → 6.0.2`
- **Recomendacion:** Monitorizar. Sin action inmediata.

---

### 5. `08_Elite_Portfolio/` — MIGRATION CRITICAL
- **Node:** v24.12.0 | **NPM:** 11.6.2
- **Framework:** **Next 14.2.25 / React 18.3.1** (OUTDATED)
- **Status:** 🔴 CRITICAL — MIGRATION PROJECT
- **Upgrades disponibles (patch/minor):**
  - `framer-motion: 11.18.2 → 12.40.0` (minor)
- **Majors pendientes (REQUIEREN SDD MIGRATION):**
  - `next: 14.2.25 → 16.2.6`
  - `react: 18.3.1 → 19.2.6`
  - `react-dom: 18.3.1 → 19.2.6`
  - `eslint: 8.57.1 → 10.4.0`
  - `tailwind-merge: 2.6.0 → 3.6.0`
- **Recomendacion:** CREAR SDD para migracion Next 16 + React 19.

---

## Acciones Inmediatas (patch/minor seguros)

| # | Proyecto | Comando | Prioridad |
|---|---|---|---|
| 1 | `.opencode` | `npm update --save` | P1 |
| 2 | `05_OBAND` | `npm update --save` (patch/minor) | P1 |
| 3 | `06_OIM_Original` | `npm update --save` (patch/minor) | P1 |
| 4 | `08_Elite_Portfolio` | `framer-motion` upgrade | P2 |

---

## Pendientes Requieren SDD Propio

| # | Proyecto | Tipo | Bloqueo |
|---|---|---|---|
| 1 | `05_OBAND` | lucide-react major | Breaking changes |
| 2 | `06_OIM_Original` | 5 majors | genai, express, vite, lucide, ts |
| 3 | `08_Elite_Portfolio` | Next + React migration | Full stack major |

---

## Siguiente Paso

Aprobación para ejecutar:
```bash
cd .opencode && npm update --save
cd 01_Personal_Os/04_Operations/05_Projects/01_Projects_Lab/05_OBAND && npm update --save
cd 01_Personal_Os/04_Operations/05_Projects/01_Projects_Lab/06_OIM_Original && npm update --save
```
