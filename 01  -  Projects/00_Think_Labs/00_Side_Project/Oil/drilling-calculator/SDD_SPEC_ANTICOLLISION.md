# SDD Spec: Anti-Colisión 3D — Superar a la Competencia (MVP P0)

* *Change ID**: `surpass-competition-anti-collision-3d`
* *Fecha**: 2026-08-22
* *Basado en**: Explore + Proposal aprobados
* *Scope**: MVP P0-only (S1–S4)
* *Decisiones confirmadas**:
- MVP P0-only (sin P1/P2)
- Traveling Cylinder en **2D Canvas**
- **Split View en MVP** (S2)
- Testing visual: **Playwright + Firefox only**

- --

## 1. REQUISITOS FUNCIONALES POR SLICE

- --

### SLICE S1: WellborePath Refactor (Habilitador)

#### FR-S1.1: Componente Compartido WellborePath

* *Descripción**: El componente `WellborePath` en `src/components/visuals/WellborePath.tsx` debe ser la **única implementación** de renderizado de tubería wellbore. Eliminar la copia inline en `AntiCollision3D.tsx:194-247`.

* *Criterios de Aceptación**:
- [ ] `AntiCollision3D.tsx` importa `WellborePath` de `../visuals/WellborePath`
- [ ] Cero código duplicado de tubería en `AntiCollision3D.tsx`
- [ ] Build pasa, tests 225/225 pasan
- [ ] Visual idéntico a antes (regresión 0)

#### FR-S1.2: Prop `useSectionColors` para Coloreo por Sección

* *Descripción**: Añadir prop opcional `useSectionColors?: boolean` que, cuando `true`, colorea la tubería por segmentos MD usando un array de colores provisto o generado automáticamente (DLS, formación, riesgo).

* *Criterios de Aceptación**:
- [ ] Prop `useSectionColors` tipada en `WellborePathProps`
- [ ] Cuando `false` (default): comportamiento actual (color único)
- [ ] Cuando `true`: tubería segmentada por estaciones, cada segmento con color correspondiente
- [ ] Prop `sectionColors?: string[]` opcional para override manual
- [ ] Tests unitarios: render con/sin `useSectionColors`

#### FR-S1.3: Props Compatibles con AntiCollision3D

* *Descripción**: `WellborePath` debe aceptar todas las props que usa `AntiCollision3D` hoy: `segments`, `color`, `emissiveColor`, `opacity`, `label`, `surfaceEast`, `surfaceNorth`, `toneMapped`.

* *Criterios de Aceptación**:
- [ ] Interface `WellborePathProps` incluye todas las props requeridas
- [ ] `AntiCollision3D` pasa props existentes sin cambios
- [ ] Labels 3D (Html overlay) funcionan igual

- --

### SLICE S2: Panel Detail Multi-Pozo + Split View

#### FR-S2.1: Panel Detail Muestra TODOS los Pozos (no solo activeEntry)

* *Descripción**: En vista `panel` de `Anticolision.tsx`, reemplazar el detalle de un solo pozo por una vista que muestre **todas las trayectorias de `matrix`** con navegación/selección.

* *Criterios de Aceptación**:
- [ ] Vista `panel` renderiza `<AntiCollision3D entries={matrix} ... />` (no solo `adjacentTrajectory`)
- [ ] Lista lateral o tabs muestran todos los pozos de `matrix` con risk pill, SF, distancia mínima
- [ ] Click en lista → actualiza `selectedWellId` → enfoca ese pozo en 3D
- [ ] `activeEntry` sigue existiendo para backward compat (critical-table, narrative)
- [ ] Responsive: en móvil (<768px) lista colapsable, 3D full-width

#### FR-S2.2: Split View (3D Izquierda + Matrix/Panel Derecha)

* *Descripción**: Nueva vista `split` (o mode en panel) que muestra 3D a la izquierda (70%) y Matrix/Panel a la derecha (30%), sincronizados por `selectedWellId`.

* *Criterios de Aceptación**:
- [ ] Botón en view-switcher: "Dividida" (icon: `Columns` de lucide-react)
- [ ] Layout CSS Grid: `grid-template-columns: 70% 30%` (desktop), stacked en móvil
- [ ] 3D view recibe `entries={matrix}`, `selectedWellId`, `hiddenWellIds`, `wellColors`
- [ ] Panel derecho muestra matrix table O detail del pozo seleccionado (toggle)
- [ ] Sincronización: click en matrix → update 3D focus; click en legend 3D → highlight row en matrix
- [ ] `WellLegend` integrado en 3D view (ya existe) + legend compacta en panel derecho

#### FR-S2.3: WellLegend en Panel Detail

* *Descripción**: Mostrar `WellLegend` (ya existente) dentro del panel detail/split view para toggle visibilidad y selección sin ir a vista 3D full.

* *Criterios de Aceptación**:
- [ ] `WellLegend` renderizado en panel derecho (split) o arriba del 3D embebido (panel)
- [ ] `onSelect` y `onToggleVisibility` conectados al estado global (`selectedWellId`, `hiddenWellIds`)
- [ ] Primary well siempre visible (sin eye toggle), seleccionable

- --

### SLICE S3: UncertaintyEngine + Elipsoides Continuos + Conos (KILLER FEATURE)

#### FR-S3.1: UncertaintyEngine — Motor Puro TypeScript

* *Archivo**: `src/engine/uncertainty-engine.ts` (NUEVO)

* *API Requerida**:
```typescript
// Types exportados
interface UncertaintyStation {
  md: number;
  index: number;           // índice en trajectory
  center: Vec3;            // en common frame (NE-TVD)
  axes: [number, number, number];  // semi-ejes: [major, medium, minor] en ft
  rotation: number[];      // matriz 3x3 row-major (eigenvectors)
  riskLevel?: "SAFE" | "MONITOR" | "CAUTION" | "CRITICAL"; // opcional, para coloring
}

interface UncertaintyProfileOptions {
  trajectory: TrajectoryPoint[];
  tool: SurveyTool;
  ellipseK?: number;       // default: DEFAULT_ELLIPSE_K (2.795)
  sfK?: number;            // default: 2.0
  toolPrimary?: SurveyTool; // para covariance combinada si se provee adjacent
  adjacentTrajectory?: TrajectoryPoint[];
  adjacentTool?: SurveyTool;
}

function computeUncertaintyProfile(
  primary: TrajectoryPoint[],
  opts: UncertaintyProfileOptions
): UncertaintyStation[];
```

* *Criterios de Aceptación**:
- [ ] Archivo `uncertainty-engine.ts` sin dependencias React/Three (solo types + math)
- [ ] `computeUncertaintyProfile` calcula elipsoides **por cada estación** de la trayectoria principal
- [ ] Usa `stationCovariance` + `eigenSym3` existentes (reutiliza `anti-collision.ts`)
- [ ] Si se provee `adjacentTrajectory`: calcula covarianza combinada (C_A + C_B) proyectada
- [ ] Si no se provee adjacent: usa solo covarianza primaria (self-uncertainty)
- [ ] Retorna array ordenado por MD ascendente
- [ ] **Unit tests**: 5 well paths ISCWSA estándar → validar ejes vs golden master (< 0.1% error)
- [ ] Performance: < 50ms para 100 estaciones en Node

#### FR-S3.2: UncertaintyTube — Elipsoides Continuos (InstancedMesh)

* *Archivo**: `src/components/visuals/UncertaintyTube.tsx` (NUEVO)

* *Props**:
```typescript
interface UncertaintyTubeProps {
  stations: UncertaintyStation[];
  color?: string;           // base color (default: well color)
  opacity?: number;         // default: 0.15 (transparente)
  showWireframe?: boolean;  // default: false
  lod?: "high" | "medium" | "low"; // segments: 16 | 12 | 8
  riskColoring?: boolean;   // si true, usa riskLevel para color (override color prop)
}
```

* *Criterios de Aceptación**:
- [ ] Usa `THREE.InstancedMesh` con `sphereGeometry` (1 draw call para todos los elipsoides)
- [ ] Cada instancia: matriz de transformación = posición + rotación + escala (axes * ellipseK)
- [ ] `lod` controla `sphereGeometry` segments (high=16, medium=12, low=8)
- [ ] `riskColoring=true`: mapea riskLevel → color (CRITICAL=rojo, CAUTION=naranja, MONITOR=amarillo, SAFE=verde)
- [ ] `opacity` default 0.15 para superposición visible (E1.2: 0.6 era para closest-only)
- [ ] Frustum culling automático (Three.js nativo)
- [ ] Performance: 11 pozos × 50 estaciones = 550 instancias @ 60 FPS desktop, 30 FPS mobile
- [ ] Tests visuales Playwright: render 11 pozos con elipsoides, screenshot comparison

#### FR-S3.3: UncertaintyCone — Conos de Incertidumbre Forward

* *Archivo**: `src/components/visuals/UncertaintyCone.tsx` (NUEVO)

* *Props**:
```typescript
interface UncertaintyConeProps {
  stations: UncertaintyStation[];
  startIndex: number;       // desde qué estación proyectar (default: último survey real)
  length?: number;          // longitud proyección en ft (default: 1000)
  segments?: number;        // subdivisiones cono (default: 24)
  color?: string;
  opacity?: number;         // default: 0.08 (muy sutil)
  showAxis?: boolean;       // línea central del cono
}
```

* *Criterios de Aceptación**:
- [ ] Genera geometría de cono truncado (frustum) desde `startIndex` hasta `startIndex + length`
- [ ] Radio del cono en cada estación = `majorAxis` (semi-eje mayor) del elipsoide
- [ ] Cono se ensancha según crecimiento de incertidumbre (extrapolación lineal de axes)
- [ ] `opacity` muy baja (0.08) — sugerencia visual, no obstrucción
- [ ] `showAxis=true`: línea central punteada desde bit actual hasta proyección
- [ ] Solo se renderiza para pozo principal (primary) o pozo seleccionado
- [ ] Toggle en legend/well-legend-3d: "Mostrar conos forward"
- [ ] Tests visuales: cono visible en 3D view, no interfiere con tuberías

#### FR-S3.4: Integración en AntiCollision3D

* *Modificaciones**: `src/components/sections/AntiCollision3D.tsx`

* *Criterios de Aceptación**:
- [ ] Importa `computeUncertaintyProfile` de `uncertainty-engine`
- [ ] Importa `UncertaintyTube` y `UncertaintyCone` de `../visuals`
- [ ] En `useMemo`: computa `uncertaintyProfiles` para cada well visible (primary + entries)
- [ ] Renderiza `<UncertaintyTube stations={profile} lod={autoLOD} />` por well
- [ ] Renderiza `<UncertaintyCone stations={primaryProfile} />` solo para primary/selected
- [ ] `autoLOD`: basado en distancia cámara / número de pozos (high si <5 pozos, medium 5-8, low >8)
- [ ] Toggle en `WellLegend` / header 3D: "Elipsoides continuos" / "Conos forward"
- [ ] No rompe elipsoides existentes en closest-approach (mantener ambos por ahora)

- --

### SLICE S4: Traveling Cylinder Plot (2D Canvas)

#### FR-S4.1: TravelingCylinderEngine — Cálculos Puros

* *Archivo**: `src/engine/traveling-cylinder.ts` (NUEVO)

* *API**:
```typescript
interface TCPoint {
  md: number;
  c2c: number;           // center-to-center distance (ft)
  bearing: number;       // bearing from primary well (deg, 0=N, 90=E)
  tvd: number;           // TVD of primary station (ft)
  ellipseSep: number;    // ellipse separation (C2C - sum of semi-major axes)
  sf: number;            // separation factor
  riskLevel: "SAFE" | "MONITOR" | "CAUTION" | "CRITICAL";
}

interface TravelingCylinderOptions {
  primary: TrajectoryPoint[];
  adjacents: AdjacentWellInput[];
  toolPrimary: SurveyTool;
  sfK: number;
  hsRef?: boolean;       // true = highside reference, false = true north
  tvdMin?: number;
  tvdMax?: number;
}

function computeTravelingCylinder(
  opts: TravelingCylinderOptions
): Map<string, TCPoint[]>;  // key = wellId, value = points along primary MD
```

* *Criterios de Aceptación**:
- [ ] Calcula C2C, bearing, ellipseSep, SF para **cada estación del pozo principal** vs cada pozo adyacente
- [ ] `hsRef=true`: bearing relativo a highside del pozo principal (azi - primaryAzi)
- [ ] `hsRef=false`: bearing true north (azi absoluto)
- [ ] Filtra por `tvdMin`/`tvdMax` si provistos
- [ ] Retorna `Map<wellId, TCPoint[]>` para renderizado eficiente
- [ ] Unit tests: comparar vs Innova VANTAGE traveling cylinder ejemplo conocido

#### FR-S4.2: TravelingCylinderView — Componente 2D Canvas

* *Archivo**: `src/components/visuals/TravelingCylinder.tsx` (NUEVO)

* *Props**:
```typescript
interface TravelingCylinderProps {
  data: Map<string, TCPoint[]>;
  wellColors: Record<string, string>;
  wellNames: Record<string, string>;
  selectedWellId?: string | null;
  onSelectWell: (wellId: string) => void;
  hsRef: boolean;
  onHsRefChange: (hsRef: boolean) => void;
  tvdRange: [number, number];
  onTvdRangeChange: (range: [number, number]) => void;
  width?: number;
  height?: number;
}
```

* *Criterios de Aceptación**:
- [ ] Canvas 2D (no Three.js) — responsive, ligero, funciona en mobile sin WebGL
- [ ] Eje X: MD o TVD (toggle), Eje Y: C2C (ft) o Bearing (deg) — **dos modos de vista**
- [ ] Modo 1: **C2C vs MD/TVD** — líneas por pozo, shaded area = ellipseSep
- [ ] Modo 2: **Polar / Cylinder** — bearing (ángulo) vs C2C (radio), puntos por estación
- [ ] Cada pozo: color = `wellColors[wellId]`, nombre en tooltip/legend
- [ ] Pozo seleccionado: línea más gruesa (3px vs 1.5px), highlight en legend
- [ ] Risk bands horizontales: SF=1.0 (CRITICAL), 1.5 (CAUTION), 4.0 (MONITOR) — líneas punteadas con labels
- [ ] Zoom/pan: wheel zoom, drag pan, double-click reset
- [ ] Toolbar: HS Ref toggle, TVD/MD toggle, C2C/Bearing toggle, TVD range slider
- [ ] Export: botón "Descargar PNG" / "Copiar imagen"
- [ ] Responsive: se adapta al contenedor, min-width 320px
- [ ] Tests visuales Playwright: render con 11 pozos, screenshot en 3 viewports

#### FR-S4.3: Vista Dedicada + Integración en Anticolision

* *Archivos**: `src/components/sections/TravelingCylinderView.tsx` (NUEVO), `Anticolision.tsx` (MODIFICAR)

* *Criterios de Aceptación**:
- [ ] Nueva vista en `view-switcher`: "Cilindro" (icon: `Cylinder` de lucide-react)
- [ ] `TravelingCylinderView` compone `TravelingCylinder` + toolbar + legend
- [ ] Recibe `matrix`, `primaryTrajectory`, `toolPrimary`, `sfK` del estado
- [ ] `selectedWellId` sincronizado con `WellLegend` y `AntiCollision3D`
- [ ] En Split View (S2): opción de mostrar Traveling Cylinder en panel derecho
- [ ] Accesibilidad: canvas con `role="img"`, `aria-label` descriptivo, keyboard nav (arrows para pan, +/- para zoom)

- --

## 2. REQUISITOS NO FUNCIONALES

### NFR-1: Performance

| Métrica                                         | Target  | Medición                                     |
|------------------------------------------------|--------|---------------------------------------------|
| FPS 3D (11 pozos, elipsoides continuos, desktop)| ≥ 60 FPS| Chrome DevTools Performance                  |
| FPS 3D (11 pozos, mobile Chrome)                | ≥ 30 FPS| Real device test                             |
| Bundle size increase (gzipped)                  | < 50 KB | `npm run build && gzip-size dist/assets/*.js`|
| UncertaintyEngine compute (100 stations)        | < 50 ms | `performance.now()` en test                  |
| Traveling Cylinder render (11 pozos × 100 pts)  | < 100 ms| Canvas render time                           |

### NFR-2: Accesibilidad (WCAG 2.1 AA)

- [ ] Canvas 3D: `role="img"`, `aria-label="Vista 3D anti-colisión con X pozos, pozo seleccionado: Y"`
- [ ] Canvas 2D (Traveling Cylinder): `role="img"`, `aria-label` dinámico con resumen
- [ ] Keyboard navigation 3D: WASD/arrows para orbit, +/- zoom, R reset
- [ ] Keyboard navigation 2D: arrows pan, +/- zoom, Enter reset, Tab para toolbar
- [ ] Color blind safe: paleta 11 colores verificada con simulador (Protanopia/Deuteranopia/Tritanopia)
- [ ] Contraste texto/UI: WCAG AA mínimo (brand-kit ya cumple AAA)

### NFR-3: Testing

| Test Type                     | Cobertura Mínima                                                          |
|------------------------------|--------------------------------------------------------------------------|
| Unit (engine)                 | 100% funciones puras (`uncertainty-engine`, `traveling-cylinder`)         |
| Integration (components)      | Render + props + interactions clave                                       |
| Visual Regression (Playwright)| 1 test por slice 3D/2D: S1 (refactor), S2 (split), S3 (tube+cone), S4 (TC)|
| Golden Master (ISCWSA)        | 5 well paths estándar validados < 0.1% error                              |

### NFR-4: Browser Support

- Chrome 110+, Firefox 110+, Safari 16+, Edge 110+
- WebGL 2 requerido (Three.js r158+)
- Fallback graceful: si WebGL no disponible → mostrar Traveling Cylinder 2D + mensaje

- --

## 3. ESCENARIOS DE USO (USER SCENARIOS)

### US-1: Ingeniero Revisa Matriz → Ve Detalle Multi-Pozo → Analiza en 3D

1. Usuario abre Anti-Colisión → ve **Matrix** con 11 pozos, risk pills
2. Click "Dividida" (Split View) → 3D izquierda (11 trayectorias), Matrix derecha
3. Click fila "Pozo Cruzado Crítico" en Matrix → 3D enfoca ese pozo, WellLegend destaca
4. Toggle "Elipsoides continuos" → ve tubo de incertidumbre completo en ambos pozos
5. Toggle "Conos forward" → ve proyección de riesgo hacia adelante
6. Exporta CSV + Reporte narrativo

### US-2: Ingeniero Analiza Traveling Cylinder para Decisión Rápida

1. Usuario selecciona vista "Cilindro" (Traveling Cylinder)
2. Ve modo Polar: bearing vs C2C, identifica pozos en cuadrante NE riesgosos
3. Cambia a modo C2C vs MD: ve evolución separación con profundidad
4. Ajusta TVD range slider → enfoca zona crítica (2000-4000 ft)
5. Toggle HS Ref → compara bearing highside vs true north
6. Click pozo crítico → sincroniza selección en 3D view y Matrix

### US-3: Demo/Webinar — Muestra "Superamos a LOGIX/VANTAGE"

1. Carga demo auto-seed (11 pozos MOCK_WELLS)
2. Split View: 3D spaghetti + Matrix lado a lado
3. "Miren: elipsoides continuos en TODOS los pozos, no solo closest approach"
4. "Conos forward proyectan riesgo — Innova lo tiene, nosotros GRATIS"
5. Traveling Cylinder: "Estándar industria, 2D canvas, funciona en iPad en rig site"
4. "Matemáticas ISCWSA auditables — click aquí, vean el código en GitHub"

- --

## 4. DEFINICIONES DE "DONE" POR SLICE

### S1 Done:

- [ ] `WellborePath` refactorizado, `AntiCollision3D` usa import
- [ ] `useSectionColors` implementado + tests
- [ ] 0 regresión visual (Playwright screenshot match)
- [ ] 225/225 tests pasan

### S2 Done:

- [ ] Panel detail muestra todos los pozos con 3D embebido
- [ ] Split View funcional (botón en view-switcher)
- [ ] WellLegend integrado en panel/split
- [ ] Sincronización selection bidireccional (Matrix ↔ 3D ↔ Legend)
- [ ] Responsive < 768px verificado
- [ ] Tests visuales Playwright: split view desktop + mobile

### S3 Done:

- [ ] `uncertainty-engine.ts` puro + unit tests (5 golden paths ISCWSA)
- [ ] `UncertaintyTube` (InstancedMesh) + `UncertaintyCone` renderizando
- [ ] Integración en `AntiCollision3D` con auto-LOD
- [ ] Toggles en UI (header 3D / WellLegend)
- [ ] Performance: 11 pozos @ 60 FPS desktop, 30 FPS mobile
- [ ] Tests visuales Playwright: 4 screenshots (tube on/off, cone on/off, LOD levels)

### S4 Done:

- [ ] `traveling-cylinder.ts` engine puro + unit tests
- [ ] `TravelingCylinder` Canvas 2D con 2 modos (C2C vs MD, Polar)
- [ ] Toolbar: HS Ref, TVD/MD, C2C/Bearing, TVD range
- [ ] Vista dedicada "Cilindro" en view-switcher
- [ ] Integración en Split View (panel derecho)
- [ ] Accesibilidad: aria-label, keyboard nav
- [ ] Tests visuales Playwright: 3 viewports × 2 modos

- --

## 5. DEPENDENCIAS ENTRE SLICES

```
S1 (WellborePath Refactor) ──────┐
                                  ├──→ S2 (Panel Detail + Split View) — usa WellborePath refactorizado
S3 (UncertaintyEngine + Tube) ───┤
                                  ├──→ S4 (Traveling Cylinder) — independiente, usa engine puro
                                  │
S2 + S3 ──→ Integración final en AntiCollision3D + Anticolision.tsx
```

* *Orden de implementación obligatorio**: S1 → S2 → S3 → S4
- S1 habilita S2 y S3 (componente base)
- S2 y S3 son paralelos tras S1 (diferentes archivos)
- S4 independiente, puede empezar tras S1

- --

## 6. CRITERIOS DE ACEPTACIÓN GLOBALES (MVP COMPLETO)

El MVP se considera **COMPLETO** cuando:

1. ✅ **Todos los 4 slices implementados** con sus criterios de aceptación
2. ✅ **Tests pasan**: 225 unit/integration + 4 visual regression + 5 golden master
3. ✅ **Performance**: 11 pozos @ 60 FPS desktop / 30 FPS mobile
4. ✅ **A11y**: axe-core score ≥ 95%, keyboard nav funcional
5. ✅ **Build limpio**: `npm run build` sin warnings, bundle < +50KB gzipped
6. ✅ **Documentación**: README actualizado con nuevas vistas/features
7. ✅ **Demo funcional**: Auto-seed 11 pozos muestra todo funcionando out-of-the-box

- --

## 7. TRAZABILIDAD: REQUISITOS → COMPETENCIA

| Requisito                 | Competencia                 | Gap Cerrado  |
|--------------------------|----------------------------|-------------|
| FR-S3.2 UncertaintyTube   | Innova: elipsoides continuos| ✅ CERRADO    |
| FR-S3.3 UncertaintyCone   | Innova: conos forward       | ✅ CERRADO    |
| FR-S4 Traveling Cylinder  | Halliburton, Innova, BH     | ✅ CERRADO    |
| FR-S2.2 Split View        | Halliburton/Innova dashboard| ✅ CERRADO    |
| FR-S2.1 Panel Detail Multi| Innova: all wells in detail | ✅ CERRADO    |
| NFR-2 A11y                | WCAG 2.1 AA (estándar)      | ✅ CERRADO    |

- --

## 8. FUERA DE SCOPE (Confirmado No-Hacer en MVP)

- ❌ Project-ahead engine (P1)
- ❌ Alertas RT/WebSocket (P1)
- ❌ Custom IPM Editor (P2)
- ❌ Ladder Plot + SF Plot (P2)
- ❌ MASD/Depleted Zones overlay (P2)
- ❌ Performance LOD avanzado (P2)
- ❌ Dashboard remoto multi-pozo (P3)
- ❌ Backend WITSML/WebSocket
- ❌ Integración sísmica/geológica
- ❌ Geosteering automation

- --

* *Próximo paso**: `/sdd-design` para definir arquitectura técnica detallada, APIs, component tree, data flow.
