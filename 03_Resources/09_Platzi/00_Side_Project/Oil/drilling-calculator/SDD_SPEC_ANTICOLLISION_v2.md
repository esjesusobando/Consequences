# SDD Spec: Anti-Colisión 3D — SOTA Competitive Parity + Open Source Advantage

* *Change ID**: `surpass-competition-anti-collision-3d`
* *Fecha**: 2026-08-22
* *Basado en**: Investigación exhaustiva Halliburton LOGIX, Innova VANTAGE, SLB DrillPlan, Baker Hughes WellArchitect, Oliasoft
* *Decisión**: MVP P0-only con 6 Slices + datos de fallback para visualización inmediata

- --

## 1. MAPA COMPETITIVO — FEATURES SOTA vs NUESTRO ESTADO

| Feature SOTA                    | Innova VANTAGE                                | Halliburton LOGIX         | SLB DrillPlan    | Baker Hughes      | NOSOTROS (Actual)      | GAP             |
|--------------------------------|----------------------------------------------|--------------------------|-----------------|------------------|-----------------------|----------------|
| **3D Visualization**            | ✅ WebGL interactivo                           | ✅ 3D manipulable          | ✅ 3D + subsurface| ✅ 3D + geosteering| ✅ Three.js/R3F         | ✅ Paridad       |
| **Continuous Uncertainty Tubes**| ✅ "Along wellbore, true 3D ellipsoid"         | ❓                         | ❓                | ❓                 | ❌ Solo closest approach| 🔴 **KILLER GAP**|
| **Uncertainty Cones (Forward)** | ✅ "Transformed into cones, projecting forward"| ❓                         | ❓                | ❓                 | ❌                      | 🔴 **KILLER GAP**|
| **Traveling Cylinder Plot**     | ✅ 4 charts: Summary, TC, SF Plot, Ladder      | ✅ TC 3D manipulable       | ✅ TC + Ladder    | ✅ TC              | ❌                      | 🔴 **KILLER GAP**|
| **Separation Factor Plot**      | ✅ SF vs MD, warning levels, zoom/pan          | ✅                         | ✅                | ✅                 | ❌                      | 🟡 GAP           |
| **Ladder Plot**                 | ✅ C2C vs MD, red uncertainty bars             | ✅                         | ✅                | ✅                 | ❌                      | 🟡 GAP           |
| **Anti-Collision Summary**      | ✅ Min C2C/ES/SF per offset, color coded       | ✅ Dashboard               | ✅                | ✅                 | ⚠️ Matrix table        | 🟡 GAP           |
| **Depleted Zones**              | ✅ Toggle, highlighted red                     | ❓                         | ❓                | ❓                 | ❌                      | 🟢 Nice-to-have  |
| **Project-Ahead**               | ✅ Real-time trajectory projection             | ✅ Adjustable project-ahead| ✅                | ✅ Real-time WITSML| ❌                      | 🟡 P1            |
| **Configurable Alerts**         | ✅ Real-time, user-defined                     | ✅ Pop-ups, email, text    | ❓                | ❓                 | ❌                      | 🟡 P1            |
| **Anti-Collision Dashboard**    | ✅ Multi-well remote monitoring                | ✅ Customizable dashboard  | ❓                | ❓                 | ❌                      | 🟢 P2            |
| **IPM Management**              | ✅ Custom IPM creation                         | ❓                         | ❓                | ❓                 | ❌ 3 hardcoded          | 🟡 P2            |
| **Casing/Hole in SF**           | ✅ Included in SF calc                         | ❓                         | ✅ MAS            | ❓                 | ❌                      | 🟡 P2            |
| **WPTS + MASD**                 | ✅ Latest standards                            | ❓                         | ✅ MAS            | ✅                 | ❌ Only k=2.0/3.5       | 🟡 P2            |
| **Custom Error Models**         | ✅ 80+ sources, full ISCWSA                    | ❓                         | ❓                | ❓                 | ❌ 3 hardcoded          | 🟢 P3            |
| **HS Ref Toggle**               | ✅ Highside vs True North                      | ✅                         | ✅                | ✅                 | ❌                      | 🟢 Easy win      |
| **TVD Min/Max Filters**         | ✅ Depth filters on charts                     | ✅                         | ✅                | ✅                 | ❌                      | 🟢 Easy win      |
| **Depth Labels / Well Names**   | ✅ On charts                                   | ✅                         | ✅                | ✅                 | ❌                      | 🟢 Easy win      |
| **MAS Visualization**           | ❓                                             | ❓                         | ✅ MAS            | ✅                 | ❌                      | 🟢 P2            |
| **Offset Selector**             | ✅ Checkbox grid                               | ✅                         | ✅                | ✅                 | ⚠️ Matrix clicks       | 🟢 Easy win      |

- --

## 2. NUESTRA VENTAJA DIFERENCIAL (Open Source)

| Ventaja                   | Descripción                                       |
|--------------------------|--------------------------------------------------|
| **Matemáticas Auditables**| ISCWSA R-Type open source vs black box propietario|
| **Zero License**          | Gratis vs $50k-200k/año                           |
| **Web-Native**            | Corre en navegador, sin instalación               |
| **Extensible**            | Arquitectura modular, plugins                     |
| **Data Ownership**        | Tus datos, tu infraestructura                     |
| **Audit Trail**           | Código abierto = confianza regulatoria            |

- --

## 3. ARQUITECTURA OBJETIVO — MOTORES PUROS + REACT

```
src/
├── engine/                    # MOTORES PUROS (Zero React/Three, 100% testable)

│   ├── anti-collision.ts      # EXISTENTE - ISCWSA R-Type math (NO TOCAR)

│   ├── uncertainty-engine.ts  # NUEVO - computeUncertaintyProfile()

│   ├── traveling-cylinder.ts  # NUEVO - computeTravelingCylinder()

│   ├── separation-factor.ts   # NUEVO - computeSeparationFactorProfile()

│   ├── ladder-plot.ts         # NUEVO - computeLadderPlot()

│   ├── project-ahead.ts       # NUEVO - projectTrajectoryAhead()

│   └── ipm-engine.ts          # NUEVO - custom IPM support

│
├── components/
│   ├── visuals/               # COMPONENTES 3D/2D REUTILIZABLES

│   │   ├── WellborePath.tsx       # Refactorizado con useSectionColors

│   │   ├── UncertaintyTube.tsx    # InstancedMesh - tubos continuos

│   │   ├── UncertaintyCone.tsx    # Conos forward projection

│   │   ├── TravelingCylinder.tsx  # Canvas 2D - TC Plot

│   │   ├── SeparationFactorPlot.tsx # Canvas 2D - SF Plot

│   │   ├── LadderPlot.tsx         # Canvas 2D - Ladder Plot

│   │   ├── DepletedZoneOverlay.tsx # Zonas depletadas

│   │   └── MASVisualization.tsx   # MAS visual

│   │
│   ├── sections/              # VISTAS PRINCIPALES

│   │   ├── Anticolision.tsx       # Contenedor principal + state sync

│   │   ├── AntiCollision3D.tsx    # Vista 3D full

│   │   ├── PanelDetailView.tsx    # Panel detail multi-pozo

│   │   ├── SplitView.tsx          # 70/30 split

│   │   ├── TravelingCylinderView.tsx # Vista TC + toolbar

│   │   ├── SeparationFactorView.tsx  # Vista SF Plot

│   │   ├── LadderPlotView.tsx       # Vista Ladder Plot

│   │   ├── AntiCollisionSummaryView.tsx # Vista Summary

│   │   └── AntiCollisionDashboard.tsx   # Dashboard multi-pozo (P2)

│   │
│   └── ui/                    # UI components existentes

│
├── store/
│   └── drilling-store.ts      # EXTENDER: antiCollision object + subscribeToWellUpdates()

│
├── data/
│   └── fallback-data.ts       # NUEVO - Datos de demo para visualización inmediata

│
└── styles/
    └── anticollision-charts.css # Estilos para charts 2D

```

- --

## 4. DATOS DE FALLBACK — FUNCIONA OUT-OF-THE-BOX

```typescript
// src/data/fallback-data.ts
import { calculateTrajectory } from "../engine/directional";
import { MOCK_PRIMARY, MOCK_WELLS, getPresetAsAdjacent } from "../engine/mock-wells";
import { analyzeCollisionMatrix } from "../engine/anti-collision";

export const FALLBACK_PRIMARY_TRAJECTORY = calculateTrajectory(
  MOCK_PRIMARY.surveys,
  MOCK_PRIMARY.wellheadNorth,
  MOCK_PRIMARY.wellheadEast
).trajectory;

export const FALLBACK_ADJACENT_WELLS = MOCK_WELLS.map(getPresetAsAdjacent);

export const FALLBACK_MATRIX = analyzeCollisionMatrix(
  FALLBACK_PRIMARY_TRAJECTORY,
  FALLBACK_ADJACENT_WELLS,
  { toolPrimary: "MWD", sfK: 2.0 }
);

export const FALLBACK_WELL_COLORS = {
  "__primary__": "#00b4d8",
  ...Object.fromEntries(FALLBACK_MATRIX.map((e, i) => [e.wellId, ["#ff006e", "#ffcc00", "#00ff88", "#8a2be2", "#ff6b6b", "#4ecdc4", "#ffe66d", "#ff9f1c", "#2ec4b6", "#e71d36"][i]]))
};
```

- --

## 5. SLICES DE IMPLEMENTACIÓN (ORDEN OBLIGATORIO)

### **S1: WellborePath Refactor + useSectionColors** (Habilitador)

- **Archivos**: `WellborePath.tsx` (extend), `AntiCollision3D.tsx` (import)
- **Props nuevas**: `useSectionColors`, `sectionColors`, `toneMapped`, `segmentsPerPoint`, `tubeRadius`, `tubeSegments`
- **Lógica**: Si `useSectionColors=true` → colorear por DLS (rojo >10°, ámbar >5°, azul base)
- **Tests**: Visual parity + unit tests
- **Líneas**: ~150

### **S2: Panel Detail Multi-Pozo + Split View** (UX Inmediato)

- **Archivos**: `PanelDetailView.tsx`, `SplitView.tsx`, `Anticolision.tsx` (views)
- **Features**: 3D embebido con `entries={matrix}`, lista lateral clickeable, sync `selectedWellId`/`hiddenWellIds`
- **Split View**: 70% 3D + 30% panel (Matrix compacta / Detail), responsive stacked <1024px
- **Líneas**: ~300

### **S3: UncertaintyEngine + Continuous Tubes + Forward Cones** (KILLER FEATURE)

- **Engine**: `uncertainty-engine.ts` - `computeUncertaintyProfile(primary, opts)` → `UncertaintyStation[]`
  - Reutiliza `stationCovariance` + `eigenSym3` existentes
  - Si `adjacentTrajectory` provisto → covarianza combinada (C_A + C_B)
  - Retorna por estación: `md`, `index`, `center(Vec3)`, `axes[3]`, `rotation[9]`, `riskLevel`
- **UncertaintyTube**: `InstancedMesh` (1 draw call) - `lod: high=16, medium=12, low=8`, `riskColoring`
- **UncertaintyCone**: Extrude Shape con radios = majorAxis, `opacity=0.08`, axis line punteada
- **Integración**: `AntiCollision3D` usa `autoLOD` (≤4 wells=high, ≤8=medium, >8=low)
- **Toggles**: Header 3D "Elipsoides continuos" / "Conos forward"
- **Golden Tests**: 5 well paths ISCWSA < 0.1% error
- **Líneas**: ~550

### **S4: Traveling Cylinder Plot (2D Canvas)** (Estándar Industria)

- **Engine**: `traveling-cylinder.ts` - `computeTravelingCylinder(opts)` → `Map<wellId, TCPoint[]>`
  - Por estación primary: closest approach vs cada adjacent
  - `hsRef`: bearing relativo a highside (azi - primaryAzi[i])
  - `tvdMin/tvdMax` filters
  - Risk bands: SF thresholds (1.0, 1.5, 4.0)
- **Canvas Component**: `TravelingCylinder.tsx`
  - Modo "c2c-md": X=MD, Y=C2C, shaded ellipseSep
  - Modo "polar": ángulo=bearing, radio=C2C
  - Toolbar: HS Ref checkbox, viewMode select, TVD range slider dual, Reset, Export PNG
  - Zoom/pan: wheel, drag, double-click reset
  - Keyboard: arrows pan, +/- zoom, R reset
  - A11y: `role="img"`, `aria-label`, `tabIndex=0`
- **Vista**: `TravelingCylinderView.tsx` + toolbar sync con store
- **Líneas**: ~400

### **S5: Separation Factor Plot + Ladder Plot** (2 Charts 2D)

- **Engines**: `separation-factor.ts`, `ladder-plot.ts`
- **Canvas Components**: `SeparationFactorPlot.tsx`, `LadderPlot.tsx`
- **Shared Toolbar**: HS Ref, TVD range, viewMode, zoom/pan, export
- **Ladder Plot**: C2C vs MD, barras rojas = uncertainty (semi-major axis)
- **SF Plot**: SF vs MD, warning level lines horizontales
- **Vistas**: `SeparationFactorView.tsx`, `LadderPlotView.tsx`
- **Líneas**: ~350

### **S6: Anti-Collision Summary View + Offset Selector** (Dashboard Parity)

- **Vista**: `AntiCollisionSummaryView.tsx`
- **Features**: Min C2C/ES/SF por offset, color coding, checkbox selector
- **Offset Selector**: Grid con checkboxes, nombres, wellhead distance
- **Líneas**: ~200

- --

## 6. STATE MANAGEMENT — STORE EXTENSION

```typescript
// drilling-store.ts additions
interface AntiCollisionState {
  view: "matrix" | "panel" | "split" | "cylinder" | "3d" | "sf-plot" | "ladder" | "summary";
  selectedWellId: string | null;
  hiddenWellIds: Set<string>;
  wellColors: Record<string, string>;
  
  // S3: Uncertainty
  showUncertaintyTubes: boolean;
  showUncertaintyCones: boolean;
  uncertaintyLOD: "high" | "medium" | "low";
  
  // S4-S5: Charts 2D
  tcHsRef: boolean;
  tcViewMode: "c2c-md" | "polar";
  tcTvdRange: [number, number];
  sfTvdRange: [number, number];
  ladderTvdRange: [number, number];
  
  // P1: Project-ahead
  projectAheadEnabled: boolean;
  projectAheadLength: number;
  
  // P2: Dashboard
  dashboardWells: string[]; // wellIds being monitored
}

interface DrillingStore {
  // ... existing ...
  antiCollision: AntiCollisionState;
  setAntiCollisionView: (view) => void;
  setSelectedWellId: (id) => void;
  toggleWellVisibility: (id) => void;
  setUncertaintyTubes: (v) => void;
  setUncertaintyCones: (v) => void;
  setUncertaintyLOD: (v) => void;
  setTcHsRef: (v) => void;
  setTcViewMode: (v) => void;
  setTcTvdRange: (v) => void;
  // ... etc
  
  // Future real-time interface (no-op now)
  subscribeToWellUpdates: (wellId: string, callback: (data) => void) => () => void;
}
```

- --

## 7. CRITERIOS DE ACEPTACIÓN GLOBALES (MVP COMPLETO)

| Criterio                 | Target                                                     |
|-------------------------|-----------------------------------------------------------|
| **Build**                | ✅ `npm run build` sin errors                               |
| **Tests**                | ✅ 225 originales + 30 nuevos = 255+ passing                |
| **Visual Regression**    | ✅ 12 screenshots (Playwright + Firefox)                    |
| **Golden Master ISCWSA** | ✅ 5 well paths < 0.1% error                                |
| **Performance 3D**       | ✅ 60 FPS desktop / 30 FPS mobile (11 wells, tubes+cones)   |
| **Performance 2D Charts**| ✅ < 100ms render (11 wells × 100 pts)                      |
| **A11y**                 | ✅ axe-core ≥ 95%, keyboard nav all views                   |
| **Bundle Size**          | ✅ < +100KB gzipped                                         |
| **Out-of-the-box**       | ✅ Demo auto-seed muestra 11 trayectorias + todas las vistas|
| **Fallback Data**        | ✅ Si store vacío → usa `fallback-data.ts` automáticamente  |

- --

## 8. RIESGOS Y MITIGACIONES

| Riesgo                           | Probabilidad  | Impacto  | Mitigación                                                                                    |
|---------------------------------|--------------|---------|----------------------------------------------------------------------------------------------|
| **Scope creep**                  | Alta          | Crítico  | **Hard gate**: Solo P0 slices. P1+ van a backlog con labels GitHub.                           |
| **InstancedMesh memory leak**    | Media         | Alto     | `useMemo` + cleanup `useEffect` return; `geometry.dispose()` / `material.dispose()` en unmount|
| **Canvas 2D high-DPI blur**      | Media         | Medio    | `canvas.width = cssWidth * dpr; ctx.scale(dpr, dpr)` en resize handler                        |
| **UncertaintyEngine performance**| Baja          | Medio    | Memoización `stationCovariance` por MD; cache LRU si > 500 estaciones                         |
| **Mobile WebGL limits**          | Media         | Medio    | Detect `WebGLRenderingContext` en mount; si null → auto-switch a 2D charts                    |
| **Store inicial vacío**          | Alta          | Crítico  | **Fallback Data**: `fallback-data.ts` auto-inyectado si `primaryTrajectory.length < 2`        |

- --

## 9. PRÓXIMO PASO INMEDIATO

* *Ejecutar S1-WU1**: Extender `WellborePath.tsx` props → luego S1-WU2 implementar `useSectionColors` → S1-WU3 importar en `AntiCollision3D` → S1-WU4 tests.

¿Procedo con **S1-WU1** ahora?
