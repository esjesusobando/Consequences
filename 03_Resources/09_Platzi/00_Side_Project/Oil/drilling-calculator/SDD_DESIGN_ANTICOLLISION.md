# SDD Design: Anti-Colisión 3D — Arquitectura Técnica (MVP P0)

* *Change ID**: `surpass-competition-anti-collision-3d`
* *Fecha**: 2026-08-22
* *Basado en**: Spec aprobado
* *Orden de implementación**: S1 → S2 → S3 → S4

- --

## 1. ARQUITECTURA GENERAL — COMPONENT TREE

```
Anticolision.tsx (Container Principal)
├── ViewSwitcher (Matriz | Detalle | Dividida | Cilindro | 3D)
├── MatrixView (existente, mejorada)
├── PanelDetailView (NUEVO - S2)
│   ├── WellLegend (existente)
│   ├── AntiCollision3D (embebido, entries={matrix})
│   └── DetailTabs (Matrix | Critical | Narrative)
├── SplitView (NUEVO - S2)
│   ├── AntiCollision3D (70%, entries={matrix}, selectedWellId sync)
│   └── RightPanel (30%)
│       ├── MatrixView compacta | PanelDetailView compacta (toggle)
│       └── WellLegend compacta
├── TravelingCylinderView (NUEVO - S4)
│   ├── TravelingCylinder (Canvas 2D)
│   ├── TCToolbar (HS Ref, TVD/MD, C2C/Bearing, Range)
│   └── TCLegend
└── View3DFull (existente, mejorada - S3)
    ├── AntiCollision3D (full-screen)
    │   ├── WellborePath (refactorizado - S1)
    │   ├── UncertaintyTube (InstancedMesh - S3)
    │   ├── UncertaintyCone (S3)
    │   ├── ClosestApproachMarker (existente)
    │   └── AxisLabels (existente)
    └── WellLegend (existente)
```

- --

## 2. NUEVOS ARCHIVOS Y MODIFICACIONES

### 2.1 Archivos Nuevos (Engine - Pure TS)

| Archivo                           | Responsabilidad                                        | Dependencias                                                           |
|----------------------------------|-------------------------------------------------------|-----------------------------------------------------------------------|
| `src/engine/uncertainty-engine.ts`| `computeUncertaintyProfile()` — elipsoides por estación| `anti-collision.ts` (stationCovariance, eigenSym3), `drilling-types.ts`|
| `src/engine/traveling-cylinder.ts`| `computeTravelingCylinder()` — C2C/bearing/SF por MD   | `anti-collision.ts`, `drilling-types.ts`                               |

### 2.2 Archivos Nuevos (Components - Visuals)

| Archivo                                            | Responsabilidad                   | Props Clave                                                |
|---------------------------------------------------|----------------------------------|-----------------------------------------------------------|
| `src/components/visuals/UncertaintyTube.tsx`       | InstancedMesh elipsoides continuos| `stations`, `color`, `opacity`, `lod`, `riskColoring`      |
| `src/components/visuals/UncertaintyCone.tsx`       | Conos forward projection          | `stations`, `startIndex`, `length`, `opacity`              |
| `src/components/visuals/TravelingCylinder.tsx`     | Canvas 2D traveling cylinder      | `data`, `wellColors`, `hsRef`, `mode`, callbacks           |
| `src/components/sections/TravelingCylinderView.tsx`| Vista dedicada + toolbar          | `matrix`, `primaryTrajectory`, `toolPrimary`, `sfK`        |
| `src/components/sections/PanelDetailView.tsx`      | Panel detail multi-pozo           | `matrix`, `activeEntry`, `selectedWellId`, callbacks       |
| `src/components/sections/SplitView.tsx`            | Split view 70/30                  | `matrix`, `primaryTrajectory`, `selectedWellId`, `viewMode`|

### 2.3 Archivos Modificados (Existentes)

| Archivo                                      | Cambios                                                                                                                                             |
|---------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| `src/components/visuals/WellborePath.tsx`    | **+** `useSectionColors`, `sectionColors` props; **REFACTOR** extraer de AntiCollision3D                                                            |
| `src/components/sections/AntiCollision3D.tsx`| **IMPORT** WellborePath, UncertaintyTube, UncertaintyCone; **REMOVE** inline WellborePath; **ADD** uncertainty profiles computation; **ADD** toggles|
| `src/components/sections/Anticolision.tsx`   | **ADD** view "split" + "cylinder"; **ADD** PanelDetailView, SplitView, TravelingCylinderView; **SYNC** selectedWellId/hiddenWellIds cross-views     |
| `src/components/sections/Anticolision.css`   | **ADD** styles para SplitView, PanelDetailView, TravelingCylinderView, TCToolbar                                                                    |
| `src/store/drilling-store.ts`                | **EXTEND** `subscribeToWellUpdates(wellId, callback)` interface (no-op implementation para futuro)                                                  |

- --

## 3. API DETALLADAS — ENGINE PURO

### 3.1 UncertaintyEngine (`uncertainty-engine.ts`)

```typescript
// src/engine/uncertainty-engine.ts
import type { TrajectoryPoint, Vec3, SurveyTool, Ellipsoid3D } from "../store/drilling-types";
import { stationCovariance, eigenSym3, DEFAULT_ELLIPSE_K, DEFAULT_SF_K } from "./anti-collision";

export interface UncertaintyStation {
  md: number;
  index: number;
  center: Vec3;                    // common frame (NE-TVD)
  axes: [number, number, number];  // [major, medium, minor] en ft
  rotation: number[];              // 3x3 row-major eigenvectors
  riskLevel?: "SAFE" | "MONITOR" | "CAUTION" | "CRITICAL";
}

export interface UncertaintyProfileOptions {
  trajectory: TrajectoryPoint[];
  tool: SurveyTool;
  ellipseK?: number;               // default: DEFAULT_ELLIPSE_K
  sfK?: number;                    // default: DEFAULT_SF_K
  toolPrimary?: SurveyTool;
  adjacentTrajectory?: TrajectoryPoint[];
  adjacentTool?: SurveyTool;
}

/**
 * Computa perfil de incertidumbre para TODAS las estaciones de una trayectoria.
 * Si adjacentTrajectory se provee: covarianza combinada (C_A + C_B) proyectada.
 * Si no: solo covarianza primaria (self-uncertainty).
 * /
export function computeUncertaintyProfile(
  primary: TrajectoryPoint[],
  opts: UncertaintyProfileOptions
): UncertaintyStation[] {
  const {
    tool,
    ellipseK = DEFAULT_ELLIPSE_K,
    sfK = DEFAULT_SF_K,
    toolPrimary = "MWD",
    adjacentTrajectory,
    adjacentTool = "MWD",
  } = opts;

  // Si hay adjacent, pre-computar covarianza adyacente por estación
  const adjCovCache = adjacentTrajectory
    ? new Map(adjacentTrajectory.map((p, i) => [i, stationCovariance(p.md, p.inc, p.azi, adjacentTool)]))
    : null;

  return primary.map((p, i) => {
    const cA = stationCovariance(p.md, p.inc, p.azi, tool);
    let cTotal = cA;

    if (adjacentTrajectory && adjCovCache) {
      // Encontrar estación adyacente más cercana en MD
      let bestIdx = 0;
      let bestDiff = Infinity;
      for (let j = 0; j < adjacentTrajectory.length; j++) {
        const diff = Math.abs(adjacentTrajectory[j].md - p.md);
        if (diff < bestDiff) { bestDiff = diff; bestIdx = j; }
      }
      const cB = adjCovCache.get(bestIdx)!;
      cTotal = cA.map((v, k) => v + cB[k]);
    }

    // Eigen decomposition
    const { values, vectors } = eigenSym3(cTotal);
    const axes: [number, number, number] = [
      ellipseK * Math.sqrt(Math.max(0, values[0])),
      ellipseK * Math.sqrt(Math.max(0, values[1])),
      ellipseK * Math.sqrt(Math.max(0, values[2])),
    ] as const;

    // Center en common frame (se aplica en componente 3D via surfaceEast/North)
    const center: Vec3 = { north: p.north, east: p.east, tvd: -p.tvd };

    return {
      md: p.md,
      index: i,
      center,
      axes,
      rotation: vectors,
    };
  });
}

/**
 * Helper: genera color por riskLevel para riskColoring
 * /
export function riskLevelColor(level: UncertaintyStation["riskLevel"]): string {
  switch (level) {
    case "CRITICAL": return "#ef4444";
    case "CAUTION": return "#f43f5e";
    case "MONITOR": return "#f59e0b";
    case "SAFE": return "#22c55e";
    default: return "#00b4d8";
  }
}
```

- --

### 3.2 TravelingCylinderEngine (`traveling-cylinder.ts`)

```typescript
// src/engine/traveling-cylinder.ts
import type { TrajectoryPoint, SurveyTool, AdjacentWellInput, CollisionResult } from "../store/drilling-types";
import { analyzeCollision, closestTrajectoryPoints, calculateTrajectory } from "./anti-collision";
import { commonFramePoint } from "./scene";

export interface TCPoint {
  md: number;
  c2c: number;
  bearing: number;       // deg, 0=N, 90=E (relative to primary azimuth if hsRef)
  tvd: number;
  ellipseSep: number;
  sf: number;
  riskLevel: "SAFE" | "MONITOR" | "CAUTION" | "CRITICAL";
  stationPrimary: number;
  stationAdjacent: number;
}

export interface TravelingCylinderOptions {
  primary: TrajectoryPoint[];
  adjacents: AdjacentWellInput[];
  toolPrimary: SurveyTool;
  sfK: number;
  hsRef?: boolean;
  tvdMin?: number;
  tvdMax?: number;
}

function riskFromSF(sf: number): TCPoint["riskLevel"] {
  if (sf >= 4.0) return "SAFE";
  if (sf >= 1.5) return "MONITOR";
  if (sf >= 1.0) return "CAUTION";
  return "CRITICAL";
}

export function computeTravelingCylinder(
  opts: TravelingCylinderOptions
): Map<string, TCPoint[]> {
  const { primary, adjacents, toolPrimary, sfK, hsRef = false, tvdMin, tvdMax } = opts;
  const result = new Map<string, TCPoint[]>();

  // Pre-compute adjacent trajectories
  const adjTrajs = adjacents.map((adj) => ({
    id: adj.id,
    name: adj.name,
    trajectory: calculateTrajectory(adj.surveys, adj.wellheadNorth ?? 0, adj.wellheadEast ?? 0).trajectory,
    tool: adj.tool ?? "MWD",
  }));

  // Primary azimuth at each station (for HS Ref)
  const primaryAzimuths = primary.map((p) => p.azi);

  for (const adj of adjTrajs) {
    const points: TCPoint[] = [];

    for (let i = 0; i < primary.length; i++) {
      const pPrim = primary[i];
      const tvd = pPrim.tvd;

      // TVD filter
      if (tvdMin !== undefined && tvd < tvdMin) continue;
      if (tvdMax !== undefined && tvd > tvdMax) continue;

      // Closest approach at this primary station vs full adjacent trajectory
      const { dist, j, pa, pb } = closestTrajectoryPoints(
        [pPrim], // single station
        adj.trajectory
      );

      // Covariance at this primary station + adjacent station
      const cA = stationCovarianceAt(primary, i, toolPrimary);
      const cB = stationCovarianceAt(adj.trajectory, j, adj.tool);
      const cTotal = cA.map((v, k) => v + cB[k]);

      // SF calculation (reuse logic from analyzeCollision)
      const s = [pa.north - pb.north, pa.east - pb.east, pa.tvd - pb.tvd];
      const d0 = Math.hypot(s[0], s[1], s[2]);
      let sigmaS = 0;
      if (d0 > 0) {
        const u = [s[0] / d0, s[1] / d0, s[2] / d0];
        sigmaS = Math.sqrt(Math.max(0, dot3(u, matVec3(cTotal, u))));
      }
      const sf = d0 === 0 ? 0 : d0 / (sfK * sigmaS);

      // Bearing
      let bearing = Math.atan2(pb.east - pa.east, pb.north - pa.north) * 180 / Math.PI;
      if (bearing < 0) bearing += 360;
      if (hsRef) {
        bearing = bearing - primaryAzimuths[i];
        if (bearing < 0) bearing += 360;
      }

      // Ellipse separation
      const ellA = ellipsoidAt(pa, cA, DEFAULT_ELLIPSE_K);
      const ellB = ellipsoidAt(pb, cB, DEFAULT_ELLIPSE_K);
      const ellipseSep = d0 - (ellA.axes[0] + ellB.axes[0]);

      points.push({
        md: pPrim.md,
        c2c: d0,
        bearing,
        tvd,
        ellipseSep,
        sf,
        riskLevel: riskFromSF(sf),
        stationPrimary: i,
        stationAdjacent: j,
      });
    }

    result.set(adj.id, points);
  }

  return result;
}

// --- Helpers privados (copiados/adaptados de anti-collision.ts) ---
function stationCovarianceAt(traj: TrajectoryPoint[], idx: number, tool: SurveyTool): number[] {
  const p = traj[idx];
  return stationCovariance(p.md, p.inc, p.azi, tool);
}

function dot3(a: number[], b: number[]): number {
  return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
}

function matVec3(m: number[], x: number[]): number[] {
  return [
    m[0]*x[0] + m[1]*x[1] + m[2]*x[2],
    m[3]*x[0] + m[4]*x[1] + m[5]*x[2],
    m[6]*x[0] + m[7]*x[1] + m[8]*x[2],
  ];
}

function ellipsoidAt(center: any, cov: number[], k: number) {
  const { values } = eigenSym3(cov);
  return {
    center,
    axes: [
      k * Math.sqrt(Math.max(0, values[0])),
      k * Math.sqrt(Math.max(0, values[1])),
      k * Math.sqrt(Math.max(0, values[2])),
    ],
  };
}
```

- --

## 4. COMPONENTES VISUALES — PROPS Y RENDER

### 4.1 WellborePath Refactorizado (`WellborePath.tsx`)

```typescript
// src/components/visuals/WellborePath.tsx
interface WellborePathProps {
  segments: TrajectoryPoint[];
  color?: string;
  emissiveColor?: string;
  opacity?: number;
  label?: string;
  surfaceEast?: number;
  surfaceNorth?: number;
  // NUEVAS PROPS:
  useSectionColors?: boolean;
  sectionColors?: string[];        // si useSectionColors=true y no se provee, genera por DLS
  toneMapped?: boolean;            // default false
  segmentsPerPoint?: number;       // default 2 (points.length * 2)
  tubeRadius?: number;             // default 2
  tubeSegments?: number;           // default 16
}
```

* *Lógica `useSectionColors`**:
- Si `false` (default): comportamiento actual — un mesh, un material, color único
- Si `true`:
  - Divide curva en segmentos por estación (o cada N puntos)
  - Cada segmento = `Mesh` independiente con `TubeGeometry` corto
  - Color = `sectionColors[i % sectionColors.length]` o generado por DLS:
    ```typescript
    const dls = segments[i].dls;
    if (dls > 10) return "#ef4444";      // CRITICAL - dogleg severo
    if (dls > 5) return "#f59e0b";       // MONITOR
    return color;                         // SAFE
    ```

- --

### 4.2 UncertaintyTube (`UncertaintyTube.tsx`)

```typescript
// src/components/visuals/UncertaintyTube.tsx
import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { UncertaintyStation } from "../../engine/uncertainty-engine";

interface UncertaintyTubeProps {
  stations: UncertaintyStation[];
  color?: string;
  opacity?: number;           // default 0.15
  showWireframe?: boolean;    // default false
  lod?: "high" | "medium" | "low";  // segments: 16 | 12 | 8
  riskColoring?: boolean;     // override color con riskLevel
}

export const UncertaintyTube: React.FC<UncertaintyTubeProps> = ({
  stations,
  color = "#00b4d8",
  opacity = 0.15,
  showWireframe = false,
  lod = "high",
  riskColoring = false,
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const { dummy, geometry, material, count } = useMemo(() => {
    const segMap = { high: 16, medium: 12, low: 8 };
    const geo = new THREE.SphereGeometry(1, segMap[lod], segMap[lod]);
    const mat = new THREE.MeshPhysicalMaterial({
      transparent: true,
      opacity,
      metalness: 0.1,
      roughness: 0.9,
      side: THREE.DoubleSide,
    });
    const dummy = new THREE.Object3D();
    return { dummy, geometry: geo, material: mat, count: stations.length };
  }, [stations.length, lod, opacity, color, riskColoring]);

  // Update instance matrices cuando cambien stations
  useMemo(() => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;
    mesh.count = stations.length;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    stations.forEach((station, i) => {
      const axes = station.axes;
      const rot = station.rotation; // 3x3 row-major
      const pos = station.center;

      dummy.position.set(pos.east, pos.tvd, pos.north); // THREE: x=E, y=TVD, z=N
      dummy.rotation.setFromRotationMatrix(new THREE.Matrix4().fromArray([
        rot[0], rot[1], rot[2], 0,
        rot[3], rot[4], rot[5], 0,
        rot[6], rot[7], rot[8], 0,
        0, 0, 0, 1
      ]));
      dummy.scale.set(axes[0], axes[1], axes[2]);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      // Color por riskLevel si riskColoring
      if (riskColoring && station.riskLevel) {
        const c = new THREE.Color(riskLevelColor(station.riskLevel));
        mesh.setColorAt(i, c);
      }
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [stations, riskColoring]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      castShadow
      receiveShadow
    />
  );
};
```

- --

### 4.3 UncertaintyCone (`UncertaintyCone.tsx`)

```typescript
// src/components/visuals/UncertaintyCone.tsx
import { useMemo } from "react";
import * as THREE from "three";
import type { UncertaintyStation } from "../../engine/uncertainty-engine";

interface UncertaintyConeProps {
  stations: UncertaintyStation[];
  startIndex: number;        // default: última estación con survey real
  length?: number;           // default 1000 ft
  segments?: number;         // default 24
  color?: string;
  opacity?: number;          // default 0.08
  showAxis?: boolean;        // default true
}

export const UncertaintyCone: React.FC<UncertaintyConeProps> = ({
  stations,
  startIndex,
  length = 1000,
  segments = 24,
  color = "#00b4d8",
  opacity = 0.08,
  showAxis = true,
}) => {
  const coneRef = useRef<THREE.Mesh>(null);
  const axisRef = useRef<THREE.Line>(null);

  const { coneGeo, coneMat, axisGeo, axisMat } = useMemo(() => {
    // Generar perfil de radio: majorAxis por estación desde startIndex
    const radii = stations.slice(startIndex).map(s => s.axes[0]);
    if (radii.length < 2) return { coneGeo: null, coneMat: null, axisGeo: null, axisMat: null };

    // Extrusionar forma cónica
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    radii.forEach((r, i) => {
      const y = (i / (radii.length - 1)) * length;
      shape.lineTo(r, y);
    });
    shape.lineTo(0, length);
    shape.closePath();

    const extrudeSettings = { steps: radii.length - 1, depth: 1, bevelEnabled: false };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.rotateX(-Math.PI / 2); // Alinear Y hacia arriba (TVD)

    const mat = new THREE.MeshPhysicalMaterial({
      color,
      transparent: true,
      opacity,
      metalness: 0.0,
      roughness: 1.0,
      side: THREE.DoubleSide,
    });

    // Axis line
    const axisGeo = new THREE.BufferGeometry();
    const axisPts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, length, 0)];
    axisGeo.setFromPoints(axisPts);
    const axisMat = new THREE.LineDashedMaterial({
      color,
      dashSize: 10,
      gapSize: 5,
      transparent: true,
      opacity: 0.3,
    });

    return { coneGeo: geo, coneMat: mat, axisGeo, axisMat };
  }, [stations, startIndex, length, color, opacity]);

  return (
    <group>
      {coneGeo && <mesh ref={coneRef} geometry={coneGeo} material={coneMat} />}
      {showAxis && axisGeo && <line ref={axisRef} geometry={axisGeo} material={axisMat} />}
    </group>
  );
};
```

- --

### 4.4 TravelingCylinder Canvas 2D (`TravelingCylinder.tsx`)

```typescript
// src/components/visuals/TravelingCylinder.tsx
import { useRef, useEffect, useMemo } from "react";
import type { TCPoint } from "../../engine/traveling-cylinder";

type ViewMode = "c2c-md" | "polar";

interface TravelingCylinderProps {
  data: Map<string, TCPoint[]>;
  wellColors: Record<string, string>;
  wellNames: Record<string, string>;
  selectedWellId?: string | null;
  onSelectWell: (id: string) => void;
  hsRef: boolean;
  onHsRefChange: (v: boolean) => void;
  viewMode: ViewMode;
  onViewModeChange: (m: ViewMode) => void;
  tvdRange: [number, number];
  onTvdRangeChange: (r: [number, number]) => void;
  width?: number;
  height?: number;
}

const RISK_BANDS = [
  { sf: 1.0, label: "CRITICAL", color: "#ef4444" },
  { sf: 1.5, label: "CAUTION", color: "#f43f5e" },
  { sf: 4.0, label: "MONITOR", color: "#f59e0b" },
];

export const TravelingCylinder: React.FC<TravelingCylinderProps> = ({
  data,
  wellColors,
  wellNames,
  selectedWellId,
  onSelectWell,
  hsRef,
  onHsRefChange,
  viewMode,
  onViewModeChange,
  tvdRange,
  onTvdRangeChange,
  width = 800,
  height = 500,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // Flatten all points para bounds
  const allPoints = useMemo(() => {
    const pts: TCPoint[] = [];
    data.forEach((arr) => pts.push(...arr));
    return pts;
  }, [data]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      // ... render logic: axes, grid, risk bands, well lines, selection highlight
      // Modo "c2c-md": X=MD, Y=C2C
      // Modo "polar": angle=bearing, radius=C2C
      // Zoom/pan transform
      // Selected well: linewidth 3, others 1.5
      // Risk bands: horizontal lines at SF thresholds
      // Legend: wellNames + colors
    };

    let animId: number;
    const loop = () => { draw(); animId = requestAnimationFrame(loop); };
    loop();
    return () => cancelAnimationFrame(animId);
  }, [data, selectedWellId, viewMode, hsRef, tvdRange, zoom, pan, width, height]);

  // Event handlers: wheel zoom, drag pan, click select, double-click reset
  // Keyboard: arrows pan, +/- zoom, R reset, Tab toolbar

  return (
    <div style={{ position: "relative", width, height }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ width: "100%", height: "100%", touchAction: "none" }}
        role="img"
        aria-label={`Traveling Cylinder: ${data.size} pozos, modo ${viewMode}, HS Ref: ${hsRef ? "Highside" : "True North"}`}
        tabIndex={0}
      />
      {/* Toolbar overlay */}
      <div className="tc-toolbar">
        <label><input type="checkbox" checked={hsRef} onChange={e=>onHsRefChange(e.target.checked)} /> HS Ref</label>
        <select value={viewMode} onChange={e=>onViewModeChange(e.target.value as ViewMode)}>
          <option value="c2c-md">C2C vs MD</option>
          <option value="polar">Polar (Bearing vs C2C)</option>
        </select>
        <input type="range" min={tvdRange[0]} max={tvdRange[1]} value={tvdRange[0]} onChange={...} /> {/* Range slider dual */}
        <button onClick={()=>{setZoom(1);setPan({x:0,y:0})}}>Reset</button>
        <button onClick={()=>canvasRef.current?.toBlob(b=>{...})}>Export PNG</button>
      </div>
    </div>
  );
};
```

- --

## 5. DATA FLOW — ESTADO GLOBAL (drilling-store)

```typescript
// src/store/drilling-store.ts — Extensiones para MVP

interface DrillingStore {
  // ... existente ...
  
  // NUEVO: Estado cross-view sincronizado
  antiCollision: {
    view: "matrix" | "panel" | "split" | "cylinder" | "3d";
    selectedWellId: string | null;
    hiddenWellIds: Set<string>;
    wellColors: Record<string, string>;
    
    // S3: Uncertainty toggles
    showUncertaintyTubes: boolean;
    showUncertaintyCones: boolean;
    uncertaintyLOD: "high" | "medium" | "low";
    
    // S4: Traveling Cylinder state
    tcHsRef: boolean;
    tcViewMode: "c2c-md" | "polar";
    tcTvdRange: [number, number];
  };
  
  // NUEVO: Interface para futuro real-time (no-op ahora)
  subscribeToWellUpdates: (wellId: string, callback: (data: WellUpdate) => void) => () => void;
}

// Acciones nuevas
const useDrillingStore = create<DrillingStore>()((set, get) => ({
  // ... existente ...
  
  setAntiCollisionView: (view) => set({ antiCollision: { ...get().antiCollision, view } }),
  setSelectedWellId: (id) => set({ antiCollision: { ...get().antiCollision, selectedWellId: id } }),
  toggleWellVisibility: (id) => set(state => {
    const next = new Set(state.antiCollision.hiddenWellIds);
    next.has(id) ? next.delete(id) : next.add(id);
    return { antiCollision: { ...state.antiCollision, hiddenWellIds: next } };
  }),
  
  setUncertaintyTubes: (v) => set(s => ({ antiCollision: { ...s.antiCollision, showUncertaintyTubes: v } })),
  setUncertaintyCones: (v) => set(s => ({ antiCollision: { ...s.antiCollision, showUncertaintyCones: v } })),
  setUncertaintyLOD: (v) => set(s => ({ antiCollision: { ...s.antiCollision, uncertaintyLOD: v } })),
  
  setTcHsRef: (v) => set(s => ({ antiCollision: { ...s.antiCollision, tcHsRef: v } })),
  setTcViewMode: (v) => set(s => ({ antiCollision: { ...s.antiCollision, tcViewMode: v } })),
  setTcTvdRange: (v) => set(s => ({ antiCollision: { ...s.antiCollision, tcTvdRange: v } })),
  
  subscribeToWellUpdates: () => () => {}, // No-op placeholder
}));
```

- --

## 6. CSS TOKENS NUEVOS (`Anticolision.css` — Extensiones)

```css
/* ─── Split View ─── */
.split-view {
  display: grid;
  grid-template-columns: 70% 30%;
  gap: 1rem;
  height: calc(100vh - 200px);
  min-height: 600px;
}

@media (max-width: 1024px) {
  .split-view {
    grid-template-columns: 1fr;
    grid-template-rows: 60% 40%;
  }
}

.split-view__3d { min-width: 0; }
.split-view__panel { 
  overflow-y: auto; 
  background: var(--color-surface);
  border: 1px solid var(--sh-grey-200);
  border-radius: var(--radius-card);
}

/* ─── Panel Detail Multi-Pozo ─── */
.panel-detail {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
}

.panel-detail__3d {
  flex: 1;
  min-height: 300px;
  border-radius: var(--radius-card);
  overflow: hidden;
}

.panel-detail__list {
  max-height: 300px;
  overflow-y: auto;
}

.panel-detail__well-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: var(--radius-control);
  cursor: pointer;
  transition: background 0.15s;
}

.panel-detail__well-item:hover,
.panel-detail__well-item.selected {
  background: rgba(96, 165, 250, 0.1);
}

.panel-detail__well-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  flex-shrink: 0;
}

/* ─── Traveling Cylinder View ─── */
.tc-view {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 200px);
  min-height: 600px;
}

.tc-toolbar {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
  padding: 0.75rem 1rem;
  background: rgba(15, 15, 25, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-control);
  margin-bottom: 1rem;
}

.tc-toolbar select,
.tc-toolbar input[type="range"] {
  padding: 0.4rem 0.6rem;
  border-radius: var(--radius-control);
  border: 1px solid var(--sh-grey-200);
  background: var(--color-surface);
  color: var(--text-primary);
}

.tc-canvas-wrapper {
  flex: 1;
  position: relative;
  min-height: 400px;
}

/* ─── 3D Header Toggles (S3) ─── */
.view-3d-toggles {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.view-3d-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.75rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--sh-grey-200);
  background: var(--color-surface);
  color: var(--text-secondary);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.view-3d-toggle.active {
  border-color: var(--color-azure);
  background: rgba(96, 165, 250, 0.12);
  color: var(--color-azure);
}

.view-3d-toggle:hover:not(.active) {
  border-color: var(--color-azure);
  color: var(--color-azure);
}

/* ─── LOD Indicator ─── */
.lod-indicator {
  font-size: 0.65rem;
  opacity: 0.6;
  font-family: var(--font-mono);
}
```

- --

## 7. PERFORMANCE STRATEGY — LOD & INSTANCING

| Componente                | Técnica                        | Parámetros                                                         |
|--------------------------|-------------------------------|-------------------------------------------------------------------|
| **WellborePath** (S1)     | Single mesh per well           | `segments=16`, `tubeRadius=2` — sin cambios                        |
| **UncertaintyTube** (S3)  | **InstancedMesh** (1 draw call)| `lod: high=16 seg, medium=12, low=8`; auto-LOD por distancia cámara|
| **UncertaintyCone** (S3)  | Single mesh per well           | `segments=24`, `opacity=0.08` — solo primary/selected              |
| **TravelingCylinder** (S4)| Canvas 2D (no WebGL)           | Cero overhead GPU, responsive nativo                               |

* *Auto-LOD Logic** (en `AntiCollision3D`):
```typescript
const autoLOD = useMemo(() => {
  const visibleWells = entries?.filter(e => !hiddenWellIds?.has(e.wellId)).length ?? 1;
  if (visibleWells <= 4) return "high";
  if (visibleWells <= 8) return "medium";
  return "low";
}, [entries, hiddenWellIds]);
```

- --

## 8. TESTING STRATEGY

### 8.1 Unit Tests (Engine)

```typescript
// uncertainty-engine.test.ts
describe("computeUncertaintyProfile", () => {
  it("returns station per trajectory point", () => {});
  it("matches ISCWSA golden master < 0.1% error", () => {}); // 5 well paths
  it("combined covariance matches analyzeCollision at closest approach", () => {});
  it("performance < 50ms for 100 stations", () => {});
});

// traveling-cylinder.test.ts
describe("computeTravelingCylinder", () => {
  it("returns Map with wellId keys", () => {});
  it("hsRef=true rotates bearing by primary azimuth", () => {});
  it("tvdMin/tvdMax filters correctly", () => {});
  it("risk bands match SF thresholds", () => {});
});
```

### 8.2 Visual Regression (Playwright + Firefox)

```typescript
// tests/visual/anti-collision-3d.spec.ts
test("S1: WellborePath refactor - visual parity", async ({ page }) => {
  await page.goto("/anti-collision");
  await expect(page.locator("canvas")).toHaveScreenshot("s1-wellborepath-refactor.png");
});

test("S2: Split View - desktop layout", async ({ page }) => {
  await page.goto("/anti-collision");
  await page.click("button:has-text('Dividida')");
  await expect(page.locator(".split-view")).toHaveScreenshot("s2-split-desktop.png");
});

test("S2: Split View - mobile layout", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/anti-collision");
  await page.click("button:has-text('Dividida')");
  await expect(page.locator(".split-view")).toHaveScreenshot("s2-split-mobile.png");
});

test("S3: UncertaintyTube ON - 11 wells", async ({ page }) => {
  await page.goto("/anti-collision");
  await page.click("button:has-text('3D')");
  await page.click(".view-3d-toggle:has-text('Elipsoides continuos')");
  await expect(page.locator("canvas")).toHaveScreenshot("s3-tubes-on.png");
});

test("S3: UncertaintyCone ON - primary well", async ({ page }) => {
  await page.goto("/anti-collision");
  await page.click("button:has-text('3D')");
  await page.click(".view-3d-toggle:has-text('Conos forward')");
  await expect(page.locator("canvas")).toHaveScreenshot("s3-cones-on.png");
});

test("S4: Traveling Cylinder - C2C vs MD mode", async ({ page }) => {
  await page.goto("/anti-collision");
  await page.click("button:has-text('Cilindro')");
  await expect(page.locator(".tc-canvas-wrapper canvas")).toHaveScreenshot("s4-tc-c2c-md.png");
});

test("S4: Traveling Cylinder - Polar mode", async ({ page }) => {
  await page.goto("/anti-collision");
  await page.click("button:has-text('Cilindro')");
  await page.selectOption("select", "polar");
  await expect(page.locator(".tc-canvas-wrapper canvas")).toHaveScreenshot("s4-tc-polar.png");
});
```

- --

## 9. MIGRACIÓN Y COMPATIBILIDAD

### 9.1 Breaking Changes: **NINGUNO**

- `WellborePath` props son **aditivas** (nuevas props opcionales)
- `AntiCollision3D` props existentes **inalteradas**
- `Anticolision` view state **extendido** (nuevos valores en union type)
- Store **extendido** (nuevas claves en `antiCollision` object)

### 9.2 Feature Flags (para rollback seguro)

```typescript
// En drilling-store o config
const FEATURES = {
  uncertaintyTubes: true,
  uncertaintyCones: true,
  splitView: true,
  travelingCylinder: true,
  panelDetailMulti: true,
};
```

- --

## 10. SECUENCIA DE IMPLEMENTACIÓN (PRs)

| PR    | Archivos Táctiles                                                                                                    | Líneas Estimadas  | Tests Nuevos                 |
|------|---------------------------------------------------------------------------------------------------------------------|------------------|-----------------------------|
| **S1**| `WellborePath.tsx`, `AntiCollision3D.tsx`, `WellborePath.test.tsx`                                                   | ~200              | 5 unit + 1 visual            |
| **S2**| `PanelDetailView.tsx`, `SplitView.tsx`, `Anticolision.tsx`, `Anticolision.css`                                       | ~350              | 3 integration + 2 visual     |
| **S3**| `uncertainty-engine.ts`, `UncertaintyTube.tsx`, `UncertaintyCone.tsx`, `AntiCollision3D.tsx`, tests                  | ~600              | 10 unit + 5 golden + 4 visual|
| **S4**| `traveling-cylinder.ts`, `TravelingCylinder.tsx`, `TravelingCylinderView.tsx`, `Anticolision.tsx`, `Anticolision.css`| ~400              | 5 unit + 3 visual            |

* *Total**: ~1,550 líneas | 4 PRs | < 400 líneas/PR

- --

## 11. RIESGOS TÉCNICOS Y MITIGACIONES (Diseño)

| Riesgo                           | Mitigación en Diseño                                                                               |
|---------------------------------|---------------------------------------------------------------------------------------------------|
| **InstancedMesh memory leak**    | `useMemo` con cleanup en `useEffect` return; `geometry.dispose()` / `material.dispose()` en unmount|
| **Canvas 2D high-DPI blur**      | `canvas.width = cssWidth * dpr; ctx.scale(dpr, dpr)` en resize handler                             |
| **UncertaintyEngine performance**| Memoización de `stationCovariance` por MD; cache LRU si > 500 estaciones                           |
| **Split View layout shift**      | CSS Grid con `min-width: 0` en children; `contain: layout paint`                                   |
| **Color stability cross-views**  | Single source of truth: `wellColor(wellId, wellIds)` en `scene.ts` — ya implementado               |
| **Mobile WebGL fallback**        | Detect `WebGLRenderingContext` en mount; si null → auto-switch a Traveling Cylinder view           |

- --

## 12. DOCUMENTACIÓN TÉCNICA A GENERAR

| Doc                    | Ubicación                 | Contenido                                              |
|-----------------------|--------------------------|-------------------------------------------------------|
| `UNCERTAINTY_ENGINE.md`| `docs/engine/`            | API reference, golden master validation, extensibilidad|
| `TRAVELING_CYLINDER.md`| `docs/engine/`            | Algoritmo, HS Ref math, modos de vista                 |
| `VISUAL_COMPONENTS.md` | `docs/components/visuals/`| Props, LOD, performance tips                           |
| `VIEW_ARCHITECTURE.md` | `docs/architecture/`      | Split View, Panel Detail, state sync diagram           |

- --

* *Próximo paso**: `/sdd-tasks` para breakdown en work units ≤ 400 líneas con dependency graph.
