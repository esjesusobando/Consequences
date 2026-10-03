# 🗜️ Drilling Calculator - Elite Engine

Este proyecto es una herramienta avanzada de cálculos de ingeniería de perforación, optimizada para precisión industrial y visualización de datos de alto rendimiento.

## 🧪 SDD Phase 1 — Surge & Swab (2026-08-07)

Contrato del motor de surge/swab reconciliado a **8 campos** (spec `drilling-calculator-phase1`, S-1..S-6):

- **API única**: `calculateSurgeSwab(params: SurgeSwabParams)` recibe **un solo objeto** (mudWeight, plasticViscosity, yieldPoint, holeDiameter, pipeDiameter, pipeVelocity, pipeLength) — ver `src/engine/surge-swab.ts`.
- **`SurgeSwabResult`**: `surgePressure`, `swabPressure` (magnitudes > 0), `ecdSurge`, `ecdSwab`, `effectiveAnnularVelocity` (Burkhardt F12), `flowRegimeSurge` (`Laminar | Turbulent | Transition`, Re API RP 13D), `modelUsed`, `pipeSpeed`. Definido **solo en el engine**; `drilling-types.ts` lo re-exporta (S-2).
- **Consumidores**: `orchestrator.ts` (params desde `mudData`/`rheology`/`wellData` + `wellControlData.pipeSpeed ?? 90`) y `TrippingChart.tsx` (curva de 21 puntos con objeto por velocidad).
- **Tests**: `src/engine/surge-swab.test.ts` (11), `src/engine/orchestrator.test.ts` (3), `src/guards/alert-engine.test.ts` (3 — alertas S-4 sin `undefined`).

## 🧪 SDD Phase 2 — Twin, Cuttings & Engine Suites (2026-08-08)

Ampliación del plan de mejora (spec `drilling-calculator-phase1`, capacidades D-1..D-3, C-1..C-4, Q-3):

- **Digital Twin (D-1..D-3)**: vista "Simulador Digital (Twin)" — `DynamicTwinWindow` cableado en `App.tsx` (`activeView === "twin"`) + entrada en `SidebarNav` (icono Gauge). Motor `twin-engine.ts` con `simulateScenario` puro (no muta el store; ref-equality verificado en test).
- **Cuttings Transport (C-1..C-4)**: sección "Transporte Recortes" (`CuttingsTransportSection.tsx` + `.css` tokens-only) con 5 DataCards (CCI, HCE %, concentración, slip velocity, transport ratio), estados valid/warning/error y render nulo cuando no hay resultados. Entrada `cuttings` en `Sidebar` (icon Layers).
- **10 suites de engine (Q-3, T-16..T-25)**: rheology, pump, pressures, circulation, hydraulics, volumetrics, directional, torque-drag, stuck-pipe, cuttings-transport — 153 tests en total, Verificación F1..F15.
- **Guards añadidos/verificados**: `rheology.ts` (n_pl sin NaN con θ600/θ300 = 0), `cuttings-transport.ts` (clamp Moore ≥5 solo cuando AV>0 y PV>0), `torque-drag.ts` (trajectory vacía → resultado zeroed, sin `points[0]` crash).
- **Gates**: `npm test` (20 files / 153 tests) · `npx tsc -b` · `npm run lint` (0 `any`) · `npm run build` — todos verdes.
- **Archivado**: delta specs sincronizadas a `openspec/specs/{surge-swab-calculation,cuttings-transport,digital-twin-view,quality-requirements}/spec.md`; cambio archivado en `openspec/changes/archive/2026-08-08-drilling-calculator-phase1/`. Q-4 (cobertura ≥80%) declarado DEFERRED.

## 🧪 SDD Phase 3 — Anti-Collision Core Math (2026-08-14)

Motor de anti-colisión Phase I (spec `anti-collision-phase1`, T-AC1..T-AC7) validado por ce:review + judgment-day (2 jueces ciegos; veredicto APPROVED tras round-1 fix):

- **`src/engine/anti-collision.ts`**: `stationCovariance` (covarianza de estación ISCWSA cerrada `C = J·diag(sD²,sI²,sA²)·Jᵀ`, MWD/GYRO/SENSOR), `eigenSym3` (Jacobi cíclico 3×3), `closestTrajectoryPoints` (distancia mínima estación-estación, guard de arrays vacíos), `analyzeCollision` y wrapper `analyzeAdjacentWell`.
- **Separation Factor R-type** (ISCWSA "Common Practice" Oct 2017): `SF = D0/(k·σs)` con `σs = sqrt(uᵀ(C_A+C_B)u)` proyectado en la dirección centro-a-centro (`u = s/D0`). Knobs independientes: `sfK` (default 2.0, HSE 3.5 SPE-187037-PA) y `ellipseK` (default √7.815 = 2.795, 95% 3D).
- **Risk bands ISCWSA**: `SF ≥ 4.0` SAFE, `1.5–4.0` MONITOR, `1.0–1.5` CAUTION, `< 1.0` CRITICAL.
- **Tests**: `src/engine/anti-collision.test.ts` (13 — cross-terms vía `J·diag·Jᵀ` explícito independiente del impl, R-type vs Mahalanobis, guard vacíos). Regresión 22 files / 182 tests green.
- **Hallazgos corregidos en review**: cross-terms NE/NT/ET (signos y unidades), SF Mahalanobis → R-type proyectado, `sin(incDeg)` grados→radianes, crash arrays vacíos, dead-code `matInv3`.
- **Gates**: `npm test` (182) · `npx tsc -b` · `npm run lint` — verdes.
- **Archivado**: delta spec sincronizada a `openspec/specs/anti-collision-calculation/spec.md`; cambio archivado en `openspec/changes/archive/2026-08-14-anti-collision-phase1/`.

## 🔱 Auditoría Élite (2026-02-20)

El motor de cálculo ha sido sometido a una auditoría forense profunda, logrando la certificación **Elite Grade 10.0**.

### 🔬 Correcciones Críticas (Invictus)

- **μ_eff Bingham:** Corregida desviación en el factor de ajuste (Bourgoyne §4). Anteriormente utilizaba constantes no estándar para 511 s⁻¹.
- **μ_eff Power Law & HB:** Integración del factor de conversión dimensional **478.8** (API RP 13D §5). Esto corrige cálculos de Reynolds que presentaban errores de magnitud de hasta 100x.
- **Velocity Ratio:** Implementación de cálculo dinámico `AV / PipeV` eliminando constantes estáticas.
- **NaN Shielding:** Blindaje total contra valores nulos en el flujo de datos reactivo.

## 🛠️ Stack Tecnológico

- **Core:** React 18 + TypeScript + Vite
- **Engine:** PersonalOS Engine v2.0 (Validador Lógico Integrado)
- **Estándares:** API RP 13D, API RP 13B-1, Bourgoyne et al.

- --

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

### Validación de Lógica

```bash
# Requiere PersonalOS Engine

python ../../../../06_ENGINE/14_logic_validator.py
```

- --

## Expanding the ESLint configuration

...

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
