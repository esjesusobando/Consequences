# Spec: cuttings-transport

> **Source**: archived change `drilling-calculator-phase1` (2026-08-08) — Capability 2. Verbatim from the change spec; owned by `src/components/sections/CuttingsTransportSection.tsx` + `src/engine/cuttings-transport.ts`.

## Requirements

#### Requirement C-1: CuttingsTransportSection renders results

The system SHALL provide `CuttingsTransportSection` (`src/components/sections/CuttingsTransportSection.tsx`, named export, functional component) that reads `results.cuttings` from `useDrillingStore` and renders five metrics with `DataCard`: `cuttingCarryingIndex` (CCI), `holeCleaningEfficiency` (%), `cuttingsConcentration` (%), `slipVelocity` (ft/min), `transportRatio` (%). Layout SHALL use the `Section` primitive (id `"cuttings"`, icon `Layers`) with a responsive grid.

##### Scenario: Results available

- GIVEN store results with populated `cuttings` values (e.g. CCI 1.2, HCE 85)
- WHEN the component renders
- THEN five DataCards are present
- AND the CCI card displays `1.20` and the HCE card displays `85.0 %`

##### Scenario: Empty results

- GIVEN `results.cuttings` is missing or zeroed
- WHEN the component renders
- THEN it returns `null` without throwing

#### Requirement C-2: Status thresholds

The system SHALL map CCI and HCE to `ValidationStatus` (`"valid" | "warning" | "error"`): CCI ≥ 1.0 → `valid`, 0.5 ≤ CCI < 1.0 → `warning`, CCI < 0.5 → `error`; HCE ≥ 80 → `valid`, 60 ≤ HCE < 80 → `warning`, HCE < 60 → `error`.

##### Scenario: Poor hole cleaning flagged

- GIVEN CCI = 0.4 and HCE = 55
- WHEN cards render
- THEN both cards carry status `"error"` (renders red indicator per `DataCard`)

##### Scenario: Acceptable cleaning

- GIVEN CCI = 1.1 and HCE = 90
- WHEN cards render
- THEN both cards carry status `"valid"`

#### Requirement C-3: Vanilla CSS tokens only

The system SHALL style the section with a dedicated `CuttingsTransportSection.css` consuming design tokens (`var(--color-surface)`, `--glass-border`, `--color-safe/--color-warning/--color-critical`, mono font). Tailwind utility classes (`grid grid-cols-*`, `p-*`, `rounded-2xl`) MUST NOT appear in the new component or CSS.

##### Scenario: Style audit

- GIVEN the merged component files
- WHEN `npm run lint` and a class-name audit run
- THEN no Tailwind utility tokens are present and `npm run build` passes

#### Requirement C-4: App integration

The system SHALL render `CuttingsTransportSection` in the App shell and expose it via `SidebarNav` (nav id `"cuttings"`, label "Transporte Recortes").

##### Scenario: Navigation

- GIVEN the app boots
- WHEN the user selects the cuttings view
- THEN the section renders inside an `ErrorBoundary` wrapper
- AND no runtime error occurs when navigating away and back

### Acceptance Criteria (cuttings-transport)

- [ ] `CuttingsTransportSection.tsx` + `.css` exist with named export; no Tailwind classes
- [ ] Section renders 5 DataCards with correct threshold statuses (C-1, C-2)
- [ ] Renders `null` safely on empty results (C-1)
- [ ] `SidebarNav` + App shell wiring present (C-4)
- [ ] Component render test green in jsdom (Test Plan T-CUT-UI)
