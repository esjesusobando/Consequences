# Spec: digital-twin-view

> **Source**: archived change `drilling-calculator-phase1` (2026-08-08) — Capability 3. Verbatim from the change spec; owned by `src/App.tsx`, `src/components/visuals/DynamicTwinWindow.tsx`, `src/engine/twin-engine.ts`.

## Requirements

#### Requirement D-1: Twin reachable from App shell

The system SHALL wire `DynamicTwinWindow` (`src/components/visuals/DynamicTwinWindow.tsx`, exists) into `App.tsx` so it renders when `activeView === "twin"`, wrapped in `ErrorBoundary`, and SHALL add a `SidebarNav` entry (`id: "twin"`, icon `Gauge`, label "Simulador Digital (Twin)").

##### Scenario: Navigate to twin

- GIVEN the app boots with calculated results
- WHEN the user selects the twin view
- THEN `DynamicTwinWindow` renders inside the app shell without crashing

#### Requirement D-2: Twin shows simulated ECD delta

The system SHALL display simulated ECD (from `simulateScenario`), the delta against the baseline `results.hydraulics.ecd`, and fracture-gradient status — all values defined numbers, no `undefined` reads.

##### Scenario: Valid simulation

- GIVEN results present and `simResults.hydraulics.ecd` computed
- WHEN the twin renders
- THEN `Simulated ECD` DataCard shows a finite value with unit `ppg`
- AND the VAR ECD delta shows signed value (`+`/`-`), and status is `"error"` when `simECD > formationData.fractureGradient`, else `"valid"`

##### Scenario: Baseline absent

- GIVEN `results` or `results.hydraulics` is null/undefined
- WHEN the twin renders
- THEN it returns `null` without throwing

#### Requirement D-3: Twin scenario engine purity

The system SHALL keep `twin-engine.ts` pure: `simulateScenario` SHALL NOT mutate store state and SHALL accept typed `modifications: { mudWeight?, gpm?, rpm?, rop? }`.

##### Scenario: No store mutation

- GIVEN a baseline store snapshot
- WHEN `simulateScenario` runs with `mudWeight` delta
- THEN `wellData`, `mudData`, `pumpData` in the store are unchanged
- AND the returned `DrillingResults` reflects the simulated mud weight

### Acceptance Criteria (digital-twin-view)

- [ ] `App.tsx` renders `DynamicTwinWindow` for `activeView === "twin"` inside `ErrorBoundary` (D-1)
- [ ] `SidebarNav` exposes the twin entry (D-1)
- [ ] No `undefined` ECD reads; null-safe when results absent (D-2)
- [ ] `simulateScenario` typed, side-effect free (D-3)
- [ ] Component render test green in jsdom (Test Plan T-TWIN-UI)
