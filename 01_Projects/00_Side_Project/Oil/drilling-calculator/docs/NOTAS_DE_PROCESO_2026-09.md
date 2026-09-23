# 📝 Notas de Proceso — Revisión y Reparación del drilling-calculator

* *Módulo objetivo:** Anti-Colisión (3er módulo)
* *Copia oficial:** `01_Personal_Os/06_Projects/00_Projects_Lab/00_Side_Project/Oil/drilling-calculator`
* *Fecha del loop:** 2026-09-08 (sesión extendida) / 2026-09-09 (lint y cierre)
* *Regla de trabajo:** complementa, mejora y añade — solo se elimina lo roto. `drilling-types.ts` FROZEN, sin `any`, sin `ts-ignore`, alertas en español, strict TDD.

- --

## 🧾 CUADRO COMPARATIVO — ANTES → DESPUÉS

| Métrica                               | ANTES (diagnóstico inicial)                          | DESPUÉS (cierre del loop)                       |
|--------------------------------------|-----------------------------------------------------|------------------------------------------------|
| Errores `tsc`                         | **98** (todo en `visuals/` huérfanas + secciones)    | **0**                                           |
| Tests Vitest                          | —                                                    | **253/253** (29 archivos)                       |
| Build `tsc -b && vite build`          | roto (bloqueado por tsc)                             | ✅ OK                                            |
| Referencias rotas (imports a nada)    | varias                                               | **0**                                           |
| Archivos componentes `visuals/`       | 41 (12 muertas)                                      | **29** (todas usadas)                           |
| Problemas ESLint (código vivo)        | **54 errores**                                       | **0 errores / 7 warnings** (deliberados)        |
| Problemas ESLint (total incl. archive)| 65                                                   | 19 → 7 warnings (archive excluido del lint)     |
| Dependencias                          | `@types/three` en production deps                    | movido a devDependencies                        |
| Script `validate-imports.js`          | roto (lista hardcodeada de 36 iconos, desactualizada)| ✅ reescrito (valida contra node_modules)        |
| Imports de lucide-react inválidos     | — (indetectable con el script roto)                  | **0** (113 archivos, 1914 iconos)               |
| ErrorBoundary en componentes          | 2.1% (47 sin)                                        | deuda documentada, NO implementado (scope creep)|

## 🔧 CAMBIOS APLICADOS

### 1. Archivo de visuales muertas → `_visuals_archive/`

12 componentes rotos sin imports reales y con errores de tsc fueron movidos fuera del `include` de tsc/vite (su funcionalidad ya vive duplicada en `AntiCollision3D.tsx`):
WellRenderer, GlowEffect, CompassRose, RiskOverlay, DepthGrid, CameraController, WellheadMarkers, MASDTube, GlassmorphismPanel, ParticleTrail, UncertaintyCone, UncertaintyTube. Incluye README explicativo.

### 2. Reparación tsc (98 → 0)

- **Anticolision.tsx** — quitados 6 props no soportados al `<AntiCollision3D>`; código muerto (`effectiveWellColors`, `FALLBACK_WELL_COLORS`).
- **AntiCollision3D.tsx** — type `ViewMode` sin uso; prop `entries` de CameraController (nunca se leía).
- **WellLegend.tsx** — export de props duplicado; `NodeJS.Timeout` → `ReturnType<typeof setTimeout>`.
- **AntiCollision3D.test.tsx** — imports sin uso; datos de test incompletos (`dls`, `cl` requeridos por `TrajectoryPoint`).

### 3. Bugs reales de React 19 (lint de código vivo)

- **AntiCollision3D.tsx** — early return EN MEDIO de los hooks (violación de rules-of-hooks, estado intermitente). La guarda se movió después de todos los hooks.
- **AntiCollision3D.tsx** — escritura de ref durante render (`primaryDistanceColorsRef.current = ...` dentro de useMemo). Ref estabilizador redundante eliminado.
- **useDemoSeed.ts** — `setSurveysRef.current = setSurveys` en el cuerpo del render. Ref innecesario eliminado (selector de Zustand ya es estable).
- **Anticolision.tsx** — 2 effects con setState síncrono (cascading renders) → **render-phase updates** (setState condicional durante render, patrón React 19 para estado derivado; converge porque la condición deja de cumplirse tras el update).
- **Anticolision.test.tsx** — 2× `any` eliminados; shim de ResizeObserver retipado (`as unknown as typeof ResizeObserver`).

### 4. Config de lint saneada (eslint.config.js)

- `react-hooks/compiler: off` — falso positivo con objetos THREE mutables ("Compilation Skipped"); el proyecto no usa React Compiler.
- `react-refresh/only-export-components: warn` — los exports de helpers puros son deliberados (testing headless); solo afecta HMR.
- `globalIgnores` añade `_visuals_archive` — 46 problemas fantasma del código muerto eliminados.

### 5. Scripts de validación

- **validate-imports.js** — REESCRITO: valida imports de lucide-react contra `node_modules` (kebab-case real), maneja conversión PascalCase→kebab con dígitos (`BarChart3`→`bar-chart-3`) e `import type`. Resultado: ✅ 0 inválidos.
- **validate-war3.js** — 🔴 47 componentes sin ErrorBoundary (2.1%). **Deuda documentada, NO se implementó** (fuera de scope; el usuario pedía reparar lo roto, no añadir).
- **component-health-check.js** — 22 problemas (19 er, 3 w). Los errores reales de React quedaron resueltos en el punto 3.

### 6. package.json

- `@types/three` → devDependencies (todo lo demás confirmado en uso).

- --

## 🟢 ESTADO FINAL (verificado)

```
tsc -b          ✅ 0 errores
vitest run      ✅ 253/253 (29 archivos)
npm run build   ✅ OK (solo aviso pre-existente de chunk >500 kB)
npm run lint    ✅ 0 errores / 7 warnings (react-refresh, deliberados)
```

## 🧾 DEUDA DOCUMENTADA (no es bug)

| Deuda                        | Detalle                                                  | Cuándo atenderla                       |
|-----------------------------|---------------------------------------------------------|---------------------------------------|
| ErrorBoundary 2.1%           | 47 de 48 componentes sin boundary                        | si la app va a producción multi-usuario|
| Warnings react-refresh (7)   | exports de helpers puros junto a componentes (deliberado)| nunca — trade-off HMR aceptado         |
| Chunk >500 kB                | aviso de build (three.js + recharts)                     | si el bundle importa para el negocio   |
| `0` (archivo 0 bytes en raíz)| resto extraño del repo original                          | decidir al ordenar estructura          |

- --

* *Estado del loop:** ✅ completo para el módulo Anti-Colisión. La copia espejo `03_Resultado` NO se tocó (commit `d34dbcbdb`), sigue pendiente de sincronizar por decisión del usuario.
