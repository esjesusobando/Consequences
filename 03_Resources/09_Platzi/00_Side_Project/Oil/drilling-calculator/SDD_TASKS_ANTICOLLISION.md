# SDD Tasks: Anti-Colisión 3D — Implementation Breakdown (MVP P0)

* *Change ID**: `surpass-competition-anti-collision-3d`
* *Fecha**: 2026-08-22
* *Basado en**: Design aprobado
* *Orden obligatorio**: S1 → S2 → S3 → S4
* *Regla**: Cada work unit ≤ 400 líneas modificadas | PR por slice

- --

## DEPENDENCY GRAPH

```
S1-WU1 (WellborePath props) ──────────────────────────────┐
S1-WU2 (WellborePath refactor) ← S1-WU1                   │
S1-WU3 (AntiCollision3D import WellborePath) ← S1-WU2     ├──→ S2, S3, S4 (todos dependen de S1)
S1-WU4 (Tests + visual parity) ← S1-WU3                   │
                                                          │
S2-WU1 (PanelDetailView component) ← S1-WU3               │
S2-WU2 (SplitView component) ← S1-WU3                     │
S2-WU3 (Anticolision.tsx: views + state sync) ← S2-WU1,2  ├──→ S3, S4 (integración final)
S2-WU4 (CSS Split/Panel styles) ← S2-WU3                  │
S2-WU5 (Tests visual split/panel) ← S2-WU4                │
                                                          │
S3-WU1 (uncertainty-engine.ts) ← S1-WU3 (independiente)   │
S3-WU2 (UncertaintyTube InstancedMesh) ← S3-WU1           │
S3-WU3 (UncertaintyCone) ← S3-WU1                         ├──→ Integración final
S3-WU4 (AntiCollision3D: integration + toggles) ← S3-WU2,3│
S3-WU5 (Auto-LOD + performance) ← S3-WU4                  │
S3-WU6 (Tests engine golden + visual) ← S3-WU5            │
                                                          │
S4-WU1 (traveling-cylinder.ts engine) ← S1-WU3 (indep)    │
S4-WU2 (TravelingCylinder Canvas 2D) ← S4-WU1             ├──→ Integración final
S4-WU3 (TravelingCylinderView + toolbar) ← S4-WU2         │
S4-WU4 (Anticolision.tsx: vista Cilindro + sync) ← S4-WU3 │
S4-WU5 (Tests visual TC 2 modos) ← S4-WU4                 │
                                                          ▼
                                    INTEGRACIÓN FINAL: S2-WU3 + S3-WU4 + S4-WU4 en Anticolision.tsx
```

- --

## SLICE S1: WellborePath Refactor (Habilitador) — ~200 líneas

### S1-WU1: Extender WellborePath Props

* *Archivo**: `src/components/visuals/WellborePath.tsx`
* *Líneas**: ~50
* *Descripción**: Añadir props `useSectionColors`, `sectionColors`, `toneMapped`, `segmentsPerPoint`, `tubeRadius`, `tubeSegments` a interface `WellborePathProps`. Mantener backward compat (todo opcional).

* *Acceptance**:
- [ ] Interface extendida con 6 props nuevas opcionales
- [ ] Defaults: `useSectionColors=false`, `toneMapped=false`, `segmentsPerPoint=2`, `tubeRadius=2`, `tubeSegments=16`
- [ ] TypeScript compila sin errores

- --

### S1-WU2: Implementar Lógica `useSectionColors`

* *Archivo**: `src/components/visuals/WellborePath.tsx`
* *Líneas**: ~80
* *Descripción**: Cuando `useSectionColors=true`:
- Dividir curva en segmentos por estación (o cada N puntos)
- Cada segmento = `Mesh` independiente con `TubeGeometry` corto
- Color = `sectionColors[i % length]` o generado por DLS:
  ```typescript
  const dls = segments[i].dls;
  if (dls > 10) return "#ef4444";  // CRITICAL
  if (dls > 5) return "#f59e0b";   // MONITOR
  return color;                     // SAFE
  ```
- Cuando `false`: comportamiento actual (single mesh, single material)

* *Acceptance**:
- [ ] Render condicional: single mesh vs array de meshes
- [ ] Colores por DLS funcionan sin `sectionColors` provisto
- [ ] `sectionColors` override manual funciona
- [ ] Labels 3D (Html overlay) siguen funcionando igual

- --

### S1-WU3: AntiCollision3D — Importar y Usar WellborePath Compartido

* *Archivo**: `src/components/sections/AntiCollision3D.tsx`
* *Líneas**: ~60
* *Descripción**:
- Eliminar `WellborePath` inline (líneas 194-247, ~54 líneas)
- Importar: `import { WellborePath } from "../visuals/WellborePath";`
- Reemplazar 3 usos (primary, entries map, fallback) por `<WellborePath ... />` con props existentes
- Props a pasar: `segments`, `color`, `emissiveColor`, `opacity`, `label`, `surfaceEast`, `surfaceNorth`, `toneMapped={false}`

* *Acceptance**:
- [ ] Cero código duplicado de tubería en AntiCollision3D
- [ ] 3 instancias WellborePath renderizando correctamente
- [ ] Build pasa, 225/225 tests pasan

- --

### S1-WU4: Tests Unitarios + Visual Parity

* *Archivos**: `src/components/visuals/WellborePath.test.tsx` (nuevo), Playwright test
* *Líneas**: ~30 test + visual
* *Descripción**:
- Unit: render con `useSectionColors=false` (default), `true` sin sectionColors, `true` con sectionColors
- Visual: Playwright screenshot comparación antes/después (debe ser idéntico pixel-perfect)

* *Acceptance**:
- [ ] 3 tests unitarios pasan
- [ ] Visual regression: 0 diff vs baseline commit 328116b9f

- --

## SLICE S2: Panel Detail Multi-Pozo + Split View — ~350 líneas

### S2-WU1: PanelDetailView Component

* *Archivo**: `src/components/sections/PanelDetailView.tsx` (NUEVO)
* *Líneas**: ~120
* *Props**:
```typescript
interface PanelDetailViewProps {
  matrix: CollisionEntry[];
  activeEntry: CollisionEntry | null;
  primaryTrajectory: TrajectoryPoint[];
  wellData: WellData;
  selectedWellId: string | null;
  hiddenWellIds: Set<string>;
  wellColors: Record<string, string>;
  onSelectWell: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onClose: () => void;
  onViewChange: (view: "matrix" | "split" | "3d") => void;
}
```
* *Estructura**:
- Header: nombre pozo activo + botones (Matrix, Dividida, 3D, Cerrar)
- 3D embebido: `<AntiCollision3D entries={matrix} selectedWellId={selectedWellId} hiddenWellIds={hiddenWellIds} wellColors={wellColors} ... />` (height 350px)
- Lista lateral: `matrix.map(e => WellItem)` con risk pill, SF, distancia, click → `onSelectWell`
- Tabs inferiores: Matrix | Critical Table | Narrative (reutiliza lógica existente de `Anticolision.tsx` panel view)

* *Acceptance**:
- [ ] Componente renderiza sin errores
- [ ] 3D embebido muestra TODAS las trayectorias (entries={matrix})
- [ ] Click en lista sincroniza selectedWellId → 3D enfoca pozo
- [ ] WellLegend integrado (reutiliza componente existente)

- --

### S2-WU2: SplitView Component

* *Archivo**: `src/components/sections/SplitView.tsx` (NUEVO)
* *Líneas**: ~100
* *Props**:
```typescript
interface SplitViewProps {
  matrix: CollisionEntry[];
  primaryTrajectory: TrajectoryPoint[];
  wellData: WellData;
  selectedWellId: string | null;
  hiddenWellIds: Set<string>;
  wellColors: Record<string, string>;
  onSelectWell: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onViewChange: (view: "matrix" | "panel" | "3d" | "cylinder") => void;
  rightPanelMode: "matrix" | "detail";  // toggle en header
}
```
* *Layout**: CSS Grid `grid-template-columns: 70% 30%` (desktop), stacked móvil
- Izquierda: `<AntiCollision3D entries={matrix} ... />` full height
- Derecha: `rightPanelMode === "matrix" ? MatrixViewCompacta : PanelDetailCompacta`
- Header derecho: toggle Matrix/Detail + WellLegend compacta

* *Acceptance**:
- [ ] Layout 70/30 desktop, stacked < 1024px
- [ ] Sincronización bidireccional: click matrix → 3D focus; click legend 3D → highlight row
- [ ] WellLegend en panel derecho funcional

- --

### S2-WU3: Anticolision.tsx — Vistas Nuevas + State Sync

* *Archivo**: `src/components/sections/Anticolision.tsx`
* *Líneas**: ~100
* *Cambios**:
- `view` type: agregar `"split" | "cylinder"` a union
- ViewSwitcher: agregar botones "Dividida" (Columns icon) y "Cilindro" (Cylinder icon)
- Importar `PanelDetailView`, `SplitView`, `TravelingCylinderView` (S4)
- Render condicional: `view === "panel" ? <PanelDetailView /> : view === "split" ? <SplitView /> : view === "cylinder" ? <TravelingCylinderView /> : null`
- State sync: `selectedWellId`, `hiddenWellIds`, `wellColors` ya existen en store → pasar a todas las vistas

* *Acceptance**:
- [ ] 5 vistas en switcher: Matriz, Detalle, Dividida, Cilindro, 3D
- [ ] Cambio de vista preserva `selectedWellId` y `hiddenWellIds`
- [ ] Split view funcional con toggle Matrix/Detail en panel derecho

- --

### S2-WU4: CSS Split View + Panel Detail

* *Archivo**: `src/components/sections/Anticolision.css`
* *Líneas**: ~80
* *Nuevas clases**:
- `.split-view`, `.split-view__3d`, `.split-view__panel`
- `.panel-detail`, `.panel-detail__3d`, `.panel-detail__list`, `.panel-detail__well-item`
- `@media (max-width: 1024px)` stacked layout
- Responsive `< 768px`: panel detail 3D full-width, lista colapsable

* *Acceptance**:
- [ ] Split view 70/30 desktop, stacked tablet/mobile
- [ ] Panel detail responsive verificado en 375px, 768px, 1024px, 1440px
- [ ] No layout shift al cambiar vistas

- --

### S2-WU5: Tests Integración + Visual Regression

* *Archivos**: `Anticolision.test.tsx` (extendido), Playwright tests
* *Líneas**: ~50 test + visual
* *Tests**:
- Panel detail: render con matrix 11 pozos, click lista → selectedWellId update
- Split view: desktop layout, mobile stacked, sync selection
- Visual: 3 screenshots (panel desktop, split desktop, split mobile)

* *Acceptance**:
- [ ] Tests unit/integration pasan
- [ ] Visual regression: 3 screenshots match baseline

- --

## SLICE S3: UncertaintyEngine + Elipsoides Continuos + Conos — ~600 líneas

### S3-WU1: UncertaintyEngine — Motor Puro

* *Archivo**: `src/engine/uncertainty-engine.ts` (NUEVO)
* *Líneas**: ~120
* *API**: `computeUncertaintyProfile(primary, opts)` → `UncertaintyStation[]`
- Reutiliza `stationCovariance`, `eigenSym3` de `anti-collision.ts`
- Si `adjacentTrajectory` provisto: covarianza combinada (C_A + C_B) en estación más cercana por MD
- Si no: solo covarianza primaria (self-uncertainty)
- Retorna array ordenado por MD con: `md`, `index`, `center` (Vec3), `axes[3]`, `rotation[9]`, `riskLevel`

* *Acceptance**:
- [ ] Zero dependencias React/Three (solo types + math)
- [ ] TypeScript strict mode pasa
- [ ] Función pura, determinista, sin side effects

- --

### S3-WU2: Golden Master Tests ISCWSA (5 Well Paths)

* *Archivo**: `src/engine/uncertainty-engine.test.ts`
* *Líneas**: ~80
* *Descripción**: Validar ejes elipsoides vs ISCWSA standard well paths (< 0.1% error)
- Cargar 5 well paths estándar ISCWSA (disponibles en literatura)
- Comparar `axes[0]` (semi-eje mayor) en estaciones clave
- Tolerancia: `Math.abs(computed - expected) / expected < 0.001`

* *Acceptance**:
- [ ] 5 well paths validados
- [ ] Todos < 0.1% error en semi-eje mayor
- [ ] Test performance: < 50ms para 100 estaciones

- --

### S3-WU3: UncertaintyTube — InstancedMesh

* *Archivo**: `src/components/visuals/UncertaintyTube.tsx` (NUEVO)
* *Líneas**: ~100
* *Props**: `stations`, `color`, `opacity=0.15`, `lod`, `riskColoring`, `showWireframe`
* *Implementación**:
- `THREE.InstancedMesh` con `SphereGeometry(1, segments, segments)`
- `segments` por LOD: high=16, medium=12, low=8
- `dummy` Object3D para matriz por instancia: posición + rotación (eigenvectors) + escala (axes)
- `instanceMatrix` DynamicDrawUsage, update en `useMemo` cuando cambien stations
- `riskColoring=true`: `instanceColor` buffer con `riskLevelColor(riskLevel)`

* *Acceptance**:
- [ ] 1 draw call para N elipsoides (InstancedMesh)
- [ ] LOD cambia geometría segments correctamente
- [ ] riskColoring pinta por riskLevel (rojo/naranja/amarillo/verde)
- [ ] Opacity 0.15 default, wireframe toggle funcional

- --

### S3-WU4: UncertaintyCone — Conos Forward

* *Archivo**: `src/components/visuals/UncertaintyCone.tsx` (NUEVO)
* *Líneas**: ~80
* *Props**: `stations`, `startIndex`, `length=1000`, `segments=24`, `color`, `opacity=0.08`, `showAxis=true`
* *Implementación**:
- Extrude `THREE.Shape` con radios = `majorAxis` por estación desde `startIndex`
- `ExtrudeGeometry` con `steps = radii.length - 1`
- Rotar -90° en X para alinear Y=TVD
- Material transparente opacity 0.08, side DoubleSide
- Axis line: `LineDashedMaterial` punteada desde bit hasta proyección

* *Acceptance**:
- [ ] Cono se ensancha según crecimiento incertidumbre
- [ ] Solo renderiza para primary/selected (controlado por parent)
- [ ] Opacity sutil (0.08), no obstruye tuberías
- [ ] Axis line visible con toggle

- --

### S3-WU5: AntiCollision3D — Integración Completa + Toggles

* *Archivo**: `src/components/sections/AntiCollision3D.tsx`
* *Líneas**: ~120
* *Cambios**:
- Importar `computeUncertaintyProfile`, `UncertaintyTube`, `UncertaintyCone`
- `useMemo`: `uncertaintyProfiles` = Map<wellId, UncertaintyStation[]> para primary + cada entry visible
- Render: `<UncertaintyTube stations={profile} lod={autoLOD} riskColoring={true} />` por well
- Render: `<UncertaintyCone stations={primaryProfile} startIndex={lastRealSurveyIdx} />` solo primary/selected
- Header 3D: toggles "Elipsoides continuos" / "Conos forward" (conectados a store `antiCollision.showUncertaintyTubes/Cones`)
- Auto-LOD: `visibleWells <= 4 → high, <= 8 → medium, > 8 → low`

* *Acceptance**:
- [ ] Elipsoides continuos renderizan en 11 pozos sin lag
- [ ] Conos solo en primary/selected
- [ ] Toggles en header 3D funcionan (conectados a store)
- [ ] Auto-LOD cambia segments según pozos visibles

- --

### S3-WU6: Performance + Tests Visuales

* *Archivos**: Playwright tests, performance marks
* *Líneas**: ~50 test + perf
* *Tests**:
- Visual: 4 screenshots (tubes on/off, cones on/off, LOD levels)
- Performance: `performance.mark` en render, target 60 FPS desktop / 30 FPS mobile con 11 pozos
- Memory: sin leaks en mount/unmount (InstancedMesh dispose en cleanup)

* *Acceptance**:
- [ ] 4 visual tests pasan
- [ ] 60 FPS desktop / 30 FPS mobile (11 pozos, tubes+cones on)
- [ ] Sin memory leaks en 10 ciclos mount/unmount

- --

## SLICE S4: Traveling Cylinder Plot (2D Canvas) — ~400 líneas

### S4-WU1: TravelingCylinderEngine — Motor Puro

* *Archivo**: `src/engine/traveling-cylinder.ts` (NUEVO)
* *Líneas**: ~120
* *API**: `computeTravelingCylinder(opts)` → `Map<wellId, TCPoint[]>`
- Para cada estación primary: closest approach vs cada adjacent trajectory completa
- Covarianza combinada por estación → SF, ellipseSep, bearing
- `hsRef=true`: bearing relativo a highside (azi - primaryAzi[i])
- `hsRef=false`: bearing true north
- Filtro `tvdMin`/`tvdMax`
- Risk bands: SF thresholds (1.0, 1.5, 4.0)

* *Acceptance**:
- [ ] Map con wellId keys, array TCPoint por well
- [ ] hsRef rota bearing correctamente
- [ ] tvdMin/tvdMax filtran puntos
- [ ] Risk bands match SF thresholds

- --

### S4-WU2: TravelingCylinder — Canvas 2D Component

* *Archivo**: `src/components/visuals/TravelingCylinder.tsx` (NUEVO)
* *Líneas**: ~150
* *Props**: `data`, `wellColors`, `wellNames`, `selectedWellId`, `onSelectWell`, `hsRef`, `viewMode`, `tvdRange`, callbacks
* *Modos**:
- `c2c-md`: X=MD, Y=C2C (ft), líneas por well, shaded area = ellipseSep
- `polar`: ángulo=bearing, radio=C2C, puntos por estación
* *Features**:
- High-DPI: `canvas.width = cssWidth * dpr; ctx.scale(dpr, dpr)`
- Zoom/pan: wheel zoom, drag pan, double-click reset
- Selected well: linewidth 3px vs 1.5px, highlight legend
- Risk bands: líneas horizontales punteadas en SF=1.0, 1.5, 4.0 con labels
- Toolbar overlay: HS Ref checkbox, viewMode select, TVD range slider dual, Reset button, Export PNG
- Keyboard: arrows pan, +/- zoom, R reset, Tab toolbar focus
- A11y: `role="img"`, `aria-label` dinámico, `tabIndex=0`

* *Acceptance**:
- [ ] 2 modos renderizan correctamente
- [ ] Zoom/pan/keyboard funcionan
- [ ] Selected well highlight visible
- [ ] Risk bands en posiciones correctas
- [ ] Export PNG genera blob descargable
- [ ] Responsive: se adapta al contenedor, min-width 320px

- --

### S4-WU3: TravelingCylinderView — Vista Dedicada

* *Archivo**: `src/components/sections/TravelingCylinderView.tsx` (NUEVO)
* *Líneas**: ~60
* *Props**: `matrix`, `primaryTrajectory`, `toolPrimary`, `sfK`, store bindings
* *Composición**:
- Toolbar sincronizada con store (`tcHsRef`, `tcViewMode`, `tcTvdRange`)
- `<TravelingCylinder ... />` con data computada en `useMemo`
- Legend lateral: wellNames + colors + risk pills

* *Acceptance**:
- [ ] Vista renderiza sin errores
- [ ] Toolbar sincroniza con store
- [ ] Legend muestra todos los pozos con colores correctos

- --

### S4-WU4: Anticolision.tsx — Vista Cilindro + Sync

* *Archivo**: `src/components/sections/Anticolision.tsx`
* *Líneas**: ~40
* *Cambios**:
- Agregar case `"cylinder"` en render condicional
- ViewSwitcher: botón "Cilindro" ya agregado en S2-WU3
- Pasar `matrix`, `primaryTrajectory`, `toolPrimary`, `sfK` a `TravelingCylinderView`
- `selectedWellId`/`hiddenWellIds` sync bidireccional con store

* *Acceptance**:
- [ ] Vista "Cilindro" accesible desde switcher
- [ ] Selección en TC sincroniza con 3D view y Matrix
- [ ] Cambio de vista preserva selección

- --

### S4-WU5: Tests Unit + Visual Regression

* *Archivos**: `traveling-cylinder.test.ts`, Playwright tests
* *Líneas**: ~30 test + visual
* *Tests**:
- Unit: `computeTravelingCylinder` hsRef, tvdRange, risk bands
- Visual Playwright: 3 screenshots (C2C vs MD mode, Polar mode, TVD range filtered)
- Viewports: desktop (1440px), tablet (768px), mobile (375px)

* *Acceptance**:
- [ ] Unit tests pasan
- [ ] 3 visual tests pasan en 3 viewports cada uno
- [ ] A11y: axe-core en canvas TC ≥ 95%

- --

## INTEGRACIÓN FINAL (Post-S4)

### INT-WU1: Anticolision.tsx — Integración Completa

* *Archivo**: `src/components/sections/Anticolision.tsx`
* *Líneas**: ~50
* *Verificación**:
- Todas las 5 vistas renderizan sin errores
- State sync: `selectedWellId`, `hiddenWellIds`, `wellColors` consistentes cross-views
- Store `antiCollision` object completo con todas las claves
- Feature flags (opcional) para rollback seguro

- --

### INT-WU2: E2E Test Suite Completo

* *Archivo**: `tests/e2e/anti-collision-mvp.spec.ts` (NUEVO)
* *Escenarios**:
1. Demo auto-seed → Matrix → Split → Panel → 3D → Cylinder → Matrix (full cycle)
2. 11 pozos: toggle tubes, toggle cones, LOD change, verify FPS
3. Traveling Cylinder: HS Ref toggle, viewMode switch, TVD range, export PNG
4. Keyboard nav: 3D (WASD), TC (arrows), Panel (Tab)
5. Responsive: 375px, 768px, 1024px, 1440px

- --

### INT-WU3: Documentation + README Update

* *Archivos**: `README.md`, `docs/engine/UNCERTAINTY_ENGINE.md`, `docs/engine/TRAVELING_CYLINDER.md`, `docs/components/visuals/VISUAL_COMPONENTS.md`
* *Contenido**: API reference, usage examples, performance tips, architecture diagram

- --

## RESUMEN WORK UNITS

| Slice    | WUs   | Líneas Totales  | PRs    | Tests Nuevos                 |
|---------|------|----------------|-------|-----------------------------|
| **S1**   | 4     | ~220            | 1      | 3 unit + 1 visual            |
| **S2**   | 5     | ~350            | 1      | 3 integration + 3 visual     |
| **S3**   | 6     | ~550            | 1-2    | 10 unit + 5 golden + 4 visual|
| **S4**   | 5     | ~400            | 1      | 5 unit + 3 visual            |
| **INT**  | 3     | ~100            | 1      | 5 E2E                        |
| **TOTAL**| **23**| **~1,620**      | **4-5**| **~30 tests**                |

- --

## ORDEN DE EJECUCIÓN (Secuencial Obligatorio)

```
PR 1: S1-WU1 → S1-WU2 → S1-WU3 → S1-WU4
         ↓
PR 2: S2-WU1 → S2-WU2 → S2-WU3 → S2-WU4 → S2-WU5
         ↓
PR 3: S3-WU1 → S3-WU2 → S3-WU3 → S3-WU4 → S3-WU5 → S3-WU6
         ↓
PR 4: S4-WU1 → S4-WU2 → S4-WU3 → S4-WU4 → S4-WU5
         ↓
PR 5: INT-WU1 → INT-WU2 → INT-WU3
```

* *Cada PR**: ≤ 400 líneas modificadas | Tests pasan | Visual regression pasa | Build limpio

- --

## CRITERIOS DE "DONE" GLOBAL (MVP COMPLETO)

- [ ] 4 PRs merged a `fix/review-corrections` (o main via PR chain)
- [ ] 225 tests originales + ~30 nuevos = 255+ tests passing
- [ ] 11 visual regression tests passing (Playwright + Firefox)
- [ ] 5 ISCWSA golden master tests < 0.1% error
- [ ] Performance: 60 FPS desktop / 30 FPS mobile (11 pozos, tubes+cones)
- [ ] A11y: axe-core ≥ 95% en todas las vistas
- [ ] Bundle size increase < 50KB gzipped
- [ ] Demo auto-seed funcional out-of-the-box
- [ ] Documentación técnica generada (4 archivos)

- --

* *Próximo paso**: `/sdd-apply` para ejecutar S1-WU1 (WellborePath props extension).
