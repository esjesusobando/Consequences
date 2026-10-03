import React, { useMemo, useState, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Html,
  Grid,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Maximize2, Box, Play, Pause, Focus, RotateCcw, Eye, EyeOff, Table2, BarChart3 } from "lucide-react";
import type { TrajectoryPoint, Vec3, CollisionResult, WellData } from "../../store/drilling-types";
import type { CollisionEntry } from "../../engine/anti-collision";
import { wellColor, PRIMARY_WELL_ID } from "../../engine/scene";

const WELL_COLORS = ["#00b4d8", "#ff006e", "#ffcc00", "#00ff88", "#8a2be2", "#ff6b6b", "#4ecdc4", "#ffe66d"];

const VIEWS = ["iso", "top", "side", "front", "bit"] as const;
type ViewMode = (typeof VIEWS)[number];

interface AntiCollision3DProps {
  primaryTrajectory: TrajectoryPoint[];
  adjacentTrajectory: TrajectoryPoint[];
  result: CollisionResult | null;
  wellData: WellData;
  onClose: () => void;
  /** All matrix entries for multi-well rendering. */
  entries?: CollisionEntry[];
  /** Set of wellIds hidden via legend eye toggles. */
  hiddenWellIds?: Set<string>;
  /** Controlled labels-only mode value. */
  labelsOnlyMode?: boolean;
  /** Callback when labels-only mode toggles. */
  onLabelsOnlyModeChange?: (v: boolean) => void;
}

const useOrbitControls = (): OrbitControlsImpl | null => {
  const controls = useThree((state) => state.controls);
  return controls instanceof OrbitControlsImpl ? controls : null;
};

const computeBounds = (traj: TrajectoryPoint[], surfaceEast: number, surfaceNorth: number) => {
  let minE = Infinity, maxE = -Infinity;
  let minN = Infinity, maxN = -Infinity;
  let minTVD = Infinity, maxTVD = -Infinity;
  
  traj.forEach((p) => {
    const e = p.east - surfaceEast;
    const n = p.north - surfaceNorth;
    minE = Math.min(minE, e);
    maxE = Math.max(maxE, e);
    minN = Math.min(minN, n);
    maxN = Math.max(maxN, n);
    minTVD = Math.min(minTVD, -p.tvd);
    maxTVD = Math.max(maxTVD, -p.tvd);
  });
  
  const center = new THREE.Vector3(
    (minE + maxE) / 2 || 0,
    (minTVD + maxTVD) / 2 || -200,
    (minN + maxN) / 2 || 0,
  );
  const extE = maxE - minE || 1000;
  const extN = maxN - minN || 1000;
  const extTVD = maxTVD - minTVD || 1000;
  const maxExt = Math.max(extE, extN, extTVD);
  const cameraDistance = Math.max(maxExt * 1.5, 1000);
  
  return { center, cameraDistance, minE, maxE, minN, maxN, minTVD, maxTVD };
};

const CameraController = ({
  view,
  isRotating,
  primaryTrajectory,
  entries,
  surfaceEast,
  surfaceNorth,
  focusTrigger,
  mergedBounds,
}: {
  view: string;
  isRotating: boolean;
  primaryTrajectory: TrajectoryPoint[];
  entries?: CollisionEntry[];
  surfaceEast: number;
  surfaceNorth: number;
  focusTrigger: number;
  mergedBounds: { center: THREE.Vector3; cameraDistance: number };
}) => {
  const camera = useThree((state) => state.camera);
  const controls = useOrbitControls();
  const rotationAngle = useRef(0);
  const prevFocusTrigger = useRef(focusTrigger);

  useEffect(() => {
    if (!controls || primaryTrajectory.length === 0) return;

    const { center, cameraDistance } = mergedBounds;
    const lastPoint = primaryTrajectory[primaryTrajectory.length - 1];

    if (prevFocusTrigger.current !== focusTrigger) {
      prevFocusTrigger.current = focusTrigger;
      const currentDir = new THREE.Vector3()
        .subVectors(camera.position, controls.target)
        .normalize();
      if (currentDir.lengthSq() < 0.1) currentDir.set(1, 1, 1).normalize();

      controls.target.copy(center);
      const newPos = center.clone().add(currentDir.multiplyScalar(cameraDistance));
      camera.position.copy(newPos);
    } else {
      switch (view) {
        case "top":
          camera.position.set(center.x, center.y + cameraDistance, center.z);
          controls.target.copy(center);
          break;
        case "side":
          camera.position.set(center.x + cameraDistance, center.y, center.z);
          controls.target.copy(center);
          break;
        case "front":
          camera.position.set(center.x, center.y, center.z + cameraDistance);
          controls.target.copy(center);
          break;
        case "bit":
          camera.position.set(
            lastPoint.east - surfaceEast + 50,
            -lastPoint.tvd + 50,
            lastPoint.north - surfaceNorth + 50,
          );
          controls.target.set(
            lastPoint.east - surfaceEast,
            -lastPoint.tvd,
            lastPoint.north - surfaceNorth,
          );
          break;
        case "iso":
        default:
          camera.position.set(
            center.x + cameraDistance * 0.7,
            center.y + cameraDistance * 0.5,
            center.z + cameraDistance * 0.7,
          );
          controls.target.copy(center);
          break;
      }

      if (view === "top") {
        camera.up.set(0, 0, -1);
      } else {
        camera.up.set(0, 1, 0);
      }
      camera.lookAt(controls.target);
    }

    controls.update();
  }, [view, camera, controls, primaryTrajectory, surfaceEast, surfaceNorth, focusTrigger, mergedBounds]);

  useFrame((_, delta) => {
    if (isRotating && controls && view !== "bit") {
      rotationAngle.current += delta * 0.2;
      const { center, cameraDistance } = mergedBounds;
      const radius = Math.max(600, cameraDistance * 0.8);
      camera.position.set(
        center.x + Math.sin(rotationAngle.current) * radius,
        center.y + Math.sin(rotationAngle.current * 0.5) * 100,
        center.z + Math.cos(rotationAngle.current) * radius,
      );
      controls.target.copy(center);
      controls.update();
    }
  });

  return null;
};

/** Map a normalised t ∈ [0,1] to a drilling-depth colour ramp (shallow→deep).
 *  Brightness-boosted so wells are visible against dark #0a0a0f background. */
const depthColor = (t: number): THREE.Color => {
  // bright blue → cyan → green → yellow → red (all channels ≥ 0.25 for visibility)
  const stops: [number, number, number, number][] = [
    [0.0, 0.2, 0.55, 1.0],   // bright blue
    [0.25, 0.15, 0.85, 1.0],  // cyan
    [0.5, 0.2, 0.9, 0.35],    // green
    [0.75, 1.0, 0.9, 0.2],    // yellow
    [1.0, 1.0, 0.3, 0.2],     // red
  ];
  const clamped = Math.max(0, Math.min(1, t));
  for (let i = 0; i < stops.length - 1; i++) {
    const [t0, r0, g0, b0] = stops[i];
    const [t1, r1, g1, b1] = stops[i + 1];
    if (clamped >= t0 && clamped <= t1) {
      const f = (clamped - t0) / (t1 - t0);
      return new THREE.Color(r0 + (r1 - r0) * f, g0 + (g1 - g0) * f, b0 + (b1 - b0) * f);
    }
  }
  return new THREE.Color(1, 0.15, 0.15);
};

/** Compute per-point distance colors for the primary trajectory based on proximity to adjacent wells.
 *  Red = close (danger), green = far (safe). Returns array of THREE.Color matching primary points length.
 *  Adjacent segments MUST be in local coords (surfaceEast=0, surfaceNorth=0). */
const computeDistanceHeatmap = (
  primarySegments: TrajectoryPoint[],
  adjacentSegments: TrajectoryPoint[][],
  surfaceEast: number,
  surfaceNorth: number,
): THREE.Color[] => {
  if (primarySegments.length === 0 || adjacentSegments.length === 0) return [];

  // ISCWSA distance thresholds (feet) — squared for comparison without sqrt
  const DANGER_DIST_SQ = 50 * 50;     // < 50 ft = red
  const CAUTION_DIST_SQ = 150 * 150;  // < 150 ft = yellow
  const SAFE_DIST_SQ = 400 * 400;     // > 400 ft = green

  // Precompute bounding boxes for each adjacent well to skip distant wells entirely
  const adjBoxes = adjacentSegments.map((adj) => {
    let minE = Infinity, maxE = -Infinity;
    let minN = Infinity, maxN = -Infinity;
    let minTVD = Infinity, maxTVD = -Infinity;
    for (const a of adj) {
      if (a.east < minE) minE = a.east;
      if (a.east > maxE) maxE = a.east;
      if (a.north < minN) minN = a.north;
      if (a.north > maxN) maxN = a.north;
      if (a.tvd < minTVD) minTVD = a.tvd;
      if (a.tvd > maxTVD) maxTVD = a.tvd;
    }
    return { minE, maxE, minN, maxN, minTVD, maxTVD };
  });

  return primarySegments.map((p) => {
    const px = p.east - surfaceEast;
    const pz = p.north - surfaceNorth;
    const py = p.tvd;

    // Find minimum squared distance to any adjacent well at any depth
    let minDistSq = Infinity;
    for (let wi = 0; wi < adjacentSegments.length; wi++) {
      const box = adjBoxes[wi];
      // Coarse bounding-box skip: if primary point is farther than SAFE_DIST from the box, skip entire well
      const closestE = Math.max(box.minE, Math.min(px, box.maxE));
      const closestN = Math.max(box.minN, Math.min(pz, box.maxN));
      const closestTVD = Math.max(box.minTVD, Math.min(py, box.maxTVD));
      const boxDx = px - closestE;
      const boxDz = pz - closestN;
      const boxDy = py - closestTVD;
      const boxDistSq = boxDx * boxDx + boxDz * boxDz + boxDy * boxDy;
      if (boxDistSq > SAFE_DIST_SQ) continue; // skip entire well

      for (const a of adjacentSegments[wi]) {
        const dx = px - a.east;
        const dz = pz - a.north;
        const dy = py - a.tvd;
        const distSq = dx * dx + dz * dz + dy * dy;
        if (distSq < minDistSq) minDistSq = distSq;
      }
    }

    // Map squared distance to color: red → yellow → green
    if (minDistSq <= DANGER_DIST_SQ) {
      return new THREE.Color(1.0, 0.15, 0.15); // red
    } else if (minDistSq <= CAUTION_DIST_SQ) {
      const t = (Math.sqrt(minDistSq) - 50) / 100; // 50→150 ft
      return new THREE.Color(1.0, 0.15 + Math.max(0, Math.min(1, t)) * 0.75, 0.15); // red → yellow
    } else if (minDistSq <= SAFE_DIST_SQ) {
      const t = (Math.sqrt(minDistSq) - 150) / 250; // 150→400 ft
      const ct = Math.max(0, Math.min(1, t));
      return new THREE.Color(1.0 - ct * 0.8, 0.9, 0.15 + ct * 0.5); // yellow → green
    } else {
      return new THREE.Color(0.2, 0.9, 0.3); // green
    }
  });
};

const WellborePath = ({
  segments,
  color = "#00b4d8",
  emissiveColor = "#00b4d8",
  opacity = 1,
  label,
  surfaceEast = 0,
  surfaceNorth = 0,
  useDepthGradient = false,
  showEndLabel = false,
  distanceColors,
}: {
  segments: TrajectoryPoint[];
  color?: string;
  emissiveColor?: string;
  opacity?: number;
  label?: string;
  surfaceEast?: number;
  surfaceNorth?: number;
  useDepthGradient?: boolean;
  showEndLabel?: boolean;
  distanceColors?: THREE.Color[];
}) => {
  const points = useMemo(
    () => segments.map(
      (p) => new THREE.Vector3(p.east - surfaceEast, -p.tvd, p.north - surfaceNorth),
    ),
    [segments, surfaceEast, surfaceNorth],
  );

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);

  // Assign vertex colours based on TVD depth when useDepthGradient is on
  const geometry = useMemo(() => {
    if (points.length < 2) return null;
    const tubeSegments = Math.max(8, points.length * 4);
    const radialSegments = 12;
    const geo = new THREE.TubeGeometry(curve, tubeSegments, 4, radialSegments, false);

    if (useDepthGradient && points.length > 1) {
      // compute depth range from original segments
      const tvds = segments.map((p) => p.tvd);
      const minTVD = Math.min(...tvds);
      const maxTVD = Math.max(...tvds);
      const range = maxTVD - minTVD;
      const safeRange = range !== 0 ? range : 1;

      const pos = geo.attributes.position;
      const colors = new Float32Array(pos.count * 3);
      for (let i = 0; i < pos.count; i++) {
        // Y = -TVD, so shallower = higher Y → t=0, deeper = lower Y → t=1
        const tvd = -pos.getY(i);
        const t = (tvd - minTVD) / safeRange;
        const c = depthColor(t);
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    } else if (distanceColors && distanceColors.length > 0 && points.length > 1) {
      // Distance heatmap: interpolate colors along the tube
      const pos = geo.attributes.position;
      const colors = new Float32Array(pos.count * 3);
      const totalVertices = pos.count;
      const colorCount = distanceColors.length;
      for (let i = 0; i < totalVertices; i++) {
        // Map vertex index to color index (tube has more vertices than control points)
        // Clamp t to [0, 1-epsilon] to avoid out-of-bounds access at the last vertex
        const t = Math.min(i / Math.max(totalVertices - 1, 1), 1 - 1e-6);
        const ci = Math.min(Math.floor(t * colorCount), colorCount - 2);
        const frac = Math.max(0, Math.min(1, (t * colorCount) - ci));
        const c0 = distanceColors[ci];
        const c1 = distanceColors[ci + 1];
        colors[i * 3] = c0.r + (c1.r - c0.r) * frac;
        colors[i * 3 + 1] = c0.g + (c1.g - c0.g) * frac;
        colors[i * 3 + 2] = c0.b + (c1.b - c0.b) * frac;
      }
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    }
    return geo;
  }, [curve, points, useDepthGradient, distanceColors]);

  const labelPos = useMemo(() => {
    if (!label || points.length === 0) return null;
    const anchor = showEndLabel ? points[points.length - 1] : points[0];
    const offset = showEndLabel ? new THREE.Vector3(0, 30, 0) : new THREE.Vector3(0, 40, 0);
    return anchor.clone().add(offset);
  }, [label, points, showEndLabel]);

  if (!geometry || points.length < 2) return null;

  return (
    <group>
      <mesh geometry={geometry} castShadow receiveShadow>
      {(useDepthGradient || (distanceColors && distanceColors.length > 0)) ? (
        <meshStandardMaterial
          vertexColors
          emissive={emissiveColor}
          emissiveIntensity={0.6}
          metalness={0.3}
          roughness={0.5}
          transparent={opacity < 1}
          opacity={opacity}
          toneMapped={false}
        />
      ) : (
        <meshStandardMaterial
          color={color}
          emissive={emissiveColor}
          emissiveIntensity={0.5}
          metalness={0.3}
          roughness={0.5}
          transparent={opacity < 1}
          opacity={opacity}
          toneMapped={false}
        />
      )}
      </mesh>
      {labelPos && (
        <Html position={labelPos} center style={{ pointerEvents: "none" }}>
          <div style={{
            color: "#fff",
            fontWeight: 900,
            fontSize: showEndLabel ? "11px" : "14px",
            textShadow: "0 0 8px #000, 0 0 16px #000, 0 0 24px currentColor",
            background: "rgba(0,0,0,0.85)",
            padding: showEndLabel ? "3px 8px" : "4px 10px",
            borderRadius: "6px",
            border: `2px solid ${color}`,
            whiteSpace: "nowrap",
            letterSpacing: showEndLabel ? "1px" : "0",
          }}>
            {label}
          </div>
        </Html>
      )}
    </group>
  );
};

WellborePath.displayName = "WellborePath";

/* ─── Survey Station Markers ────────────────────────────────────────────── */
/** Single survey station point — owns its own hover state to avoid re-rendering siblings. */
const SurveyStationPoint = React.memo(({
  position,
  md,
  inc,
  azi,
  tvd,
  color,
  label,
  index,
}: {
  position: THREE.Vector3;
  md: number;
  inc: number;
  azi: number;
  tvd: number;
  color: string;
  label?: string;
  index: number;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[3, 8, 8]} />
        <meshStandardMaterial
          color={hovered ? "#ffffff" : color}
          emissive={color}
          emissiveIntensity={hovered ? 1.0 : 0.4}
          toneMapped={false}
        />
      </mesh>
      {hovered && (
        <Html position={[0, 12, 0]} center style={{ pointerEvents: "none" }}>
          <div
            style={{
              background: "rgba(10, 10, 20, 0.95)",
              color: "#fff",
              padding: "6px 10px",
              borderRadius: "8px",
              border: `1px solid ${color}`,
              fontSize: "10px",
              fontFamily: "monospace",
              whiteSpace: "nowrap",
              boxShadow: `0 0 12px ${color}44`,
              lineHeight: "1.5",
            }}
          >
            <div style={{ fontWeight: "bold", color, marginBottom: "2px" }}>
              #{index + 1} {label ? `- ${label}` : ""}
            </div>
            <div>MD: {md.toLocaleString()} ft</div>
            <div>INC: {inc.toFixed(1)}°</div>
            <div>AZI: {azi.toFixed(1)}°</div>
            <div>TVD: {tvd.toLocaleString()} ft</div>
          </div>
        </Html>
      )}
    </group>
  );
});
SurveyStationPoint.displayName = "SurveyStationPoint";

const SurveyStationMarkers = ({
  segments,
  surfaceEast,
  surfaceNorth,
  color,
  label,
  visible = true,
}: {
  segments: TrajectoryPoint[];
  surfaceEast: number;
  surfaceNorth: number;
  color: string;
  label?: string;
  visible?: boolean;
}) => {
  const points = useMemo(
    () =>
      segments.map((p) => ({
        position: new THREE.Vector3(
          p.east - surfaceEast,
          -p.tvd,
          p.north - surfaceNorth,
        ),
        md: p.md,
        inc: p.inc,
        azi: p.azi,
        tvd: p.tvd,
      })),
    [segments, surfaceEast, surfaceNorth],
  );

  if (!visible || points.length === 0) return null;

  return (
    <group>
      {points.map((pt, i) => (
        <SurveyStationPoint
          key={pt.md}
          position={pt.position}
          md={pt.md}
          inc={pt.inc}
          azi={pt.azi}
          tvd={pt.tvd}
          color={color}
          label={label}
          index={i}
        />
      ))}
    </group>
  );
};

SurveyStationMarkers.displayName = "SurveyStationMarkers";

const UncertaintyEllipsoid = ({
  position,
  axes,
  color = "#ff006e",
  label,
}: {
  position: THREE.Vector3;
  axes: [number, number, number];
  color?: string;
  label?: string;
}) => {
  const [scale, setScale] = useState(0);

  useEffect(() => {
    let t = 0;
    const anim = setInterval(() => {
      t += 0.1;
      if (t >= 1) {
        clearInterval(anim);
        setScale(1);
      } else {
        setScale(t);
      }
    }, 30);
    return () => clearInterval(anim);
  }, []);

  return (
    <group position={position}>
      <mesh scale={[scale * axes[0], scale * axes[1], scale * axes[2]]}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}  // E1.2: uncertainty ellipsoids use 0.6 opacity for better overlap visibility
          metalness={0.2}
          roughness={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh scale={[axes[0], axes[1], axes[2]]} renderOrder={10}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
        />
      </mesh>
      {label && (
        <Html position={new THREE.Vector3(0, axes[1] + 15, 0)} center style={{ pointerEvents: "none" }}>
          <div style={{ color: "#fff", fontWeight: 900, fontSize: "12px", textShadow: "0 0 8px #000, 0 0 16px #000, 0 0 24px currentColor", background: "rgba(0,0,0,0.85)", padding: "4px 10px", borderRadius: "6px", border: "2px solid currentColor", whiteSpace: "nowrap" }}>
            {label}
          </div>
        </Html>
      )}
    </group>
  );
};

UncertaintyEllipsoid.displayName = "UncertaintyEllipsoid";

const ClosestApproachMarker = ({
  pointA,
  pointB,
  surfaceEast = 0,
  surfaceNorth = 0,
}: {
  pointA: Vec3;
  pointB: Vec3;
  surfaceEast?: number;
  surfaceNorth?: number;
}) => {
  const lineRef = useRef<THREE.Object3D>(null);

  const lineObj = useMemo(() => new THREE.Line(
    new THREE.BufferGeometry(),
    new THREE.LineDashedMaterial({
      color: "#ffcc00",
      dashSize: 4,
      gapSize: 2,
      transparent: true,
      opacity: 0.9,
    })
  ), []);

  const { vertices, posA, posB, mid, distance } = useMemo(() => {
    // Both pointA and pointB are now transformed to local coords (surface offset subtracted)
    const a = new THREE.Vector3(pointA.east - surfaceEast, -pointA.tvd, pointA.north - surfaceNorth);
    const b = new THREE.Vector3(pointB.east - surfaceEast, -pointB.tvd, pointB.north - surfaceNorth);
    const m = a.clone().lerp(b, 0.5);
    const verts = new Float32Array([
      a.x - m.x, a.y - m.y, a.z - m.z,
      b.x - m.x, b.y - m.y, b.z - m.z,
    ]);
    return { vertices: verts, posA: a, posB: b, mid: m, distance: a.distanceTo(b) };
  }, [pointA, pointB, surfaceEast, surfaceNorth]);

  useEffect(() => {
    if (lineRef.current) {
      const line = lineRef.current as THREE.Line;
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
      line.geometry = geo;
      line.computeLineDistances();
    }
  }, [vertices]);

  return (
    <group>
      <primitive ref={lineRef} object={lineObj} />
      <mesh position={posA.clone().sub(mid)}>
        <sphereGeometry args={[3, 16, 16]} />
        <meshStandardMaterial color="#ffcc00" emissive="#ffcc00" emissiveIntensity={1} />
      </mesh>
      <mesh position={posB.clone().sub(mid)}>
        <sphereGeometry args={[3, 16, 16]} />
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={1} />
      </mesh>
      <Html position={mid.clone().add(new THREE.Vector3(0, 20, 0))} center style={{ pointerEvents: "none" }}>
        <div style={{
          color: "#ffcc00",
          fontWeight: 900,
          fontSize: "12px",
          textShadow: "0 0 6px #000",
          whiteSpace: "nowrap",
          background: "rgba(0,0,0,0.7)",
          padding: "2px 8px",
          borderRadius: "4px",
          border: "1px solid #ffcc00",
        }}>
          d_min = {distance.toFixed(4)} ft
        </div>
      </Html>
    </group>
  );
};

ClosestApproachMarker.displayName = "ClosestApproachMarker";

/** Surface disc — replaces trivial wireframe box with a solid ground plane. */
const SurfaceMarker = ({ radius = 300 }: { radius?: number }) => (
  <group position={[0, 0, 0]}>
    {/* Solid dark disc */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[radius, 64]} />
      <meshStandardMaterial
        color="#0d0d18"
        transparent
        opacity={0.7}
        metalness={0.1}
        roughness={0.9}
      />
    </mesh>
    {/* Radial grid lines */}
    {[1, 2, 3, 4].map((i) => (
      <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[radius * i * 0.25 - 0.5, radius * i * 0.25 + 0.5, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.08} />
      </mesh>
    ))}
  </group>
);

SurfaceMarker.displayName = "SurfaceMarker";

/** Depth scale — tick marks + labels along the TVD axis every `interval` ft. */
const DepthScale = ({
  minTVD,
  maxTVD,
  interval = 500,
  xPos = 0,
  zPos = 0,
}: {
  minTVD: number;
  maxTVD: number;
  interval?: number;
  xPos?: number;
  zPos?: number;
}) => {
  const marks = useMemo(() => {
    const start = Math.ceil(minTVD / interval) * interval;
    const result: number[] = [];
    for (let tvd = start; tvd <= maxTVD; tvd += interval) result.push(tvd);
    return result;
  }, [minTVD, maxTVD, interval]);

  return (
    <group>
      {marks.map((tvd) => (
        <group key={tvd} position={[xPos, -tvd, zPos]}>
          {/* Horizontal tick line */}
          <mesh>
            <boxGeometry args={[20, 0.8, 0.8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.35} />
          </mesh>
          {/* Label */}
          <Html position={[18, 0, 0]} center style={{ pointerEvents: "none" }}>
            <div style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "9px",
              fontFamily: "monospace",
              whiteSpace: "nowrap",
              textShadow: "0 0 4px #000",
            }}>
              {tvd.toLocaleString()} ft
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
};

DepthScale.displayName = "DepthScale";

/* ─── Risk Matrix Panel (professional: Landmark Compass style) ──────────── */
const RISK_COLORS: Record<string, string> = {
  CRITICAL: "#ff3e3e",
  CAUTION: "#ffcc00",
  MONITOR: "#00b4d8",
  SAFE: "#00ff88",
};

/** Get risk color from Safety Factor value (ISCWSA thresholds). */
const getRiskColorFromSF = (sf: number): string =>
  sf < 1.0 ? RISK_COLORS.CRITICAL : sf < 1.5 ? RISK_COLORS.CAUTION : sf < 4.0 ? RISK_COLORS.MONITOR : RISK_COLORS.SAFE;

const RiskMatrixPanel = ({
  entries,
  hiddenWellIds,
}: {
  entries: CollisionEntry[];
  hiddenWellIds?: Set<string>;
}) => {
  const visible = useMemo(
    () => entries.filter((e) => !hiddenWellIds?.has(e.wellId)),
    [entries, hiddenWellIds],
  );
  if (visible.length === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "16px",
        right: "16px",
        zIndex: 15,
        background: "rgba(10, 10, 15, 0.92)",
        backdropFilter: "blur(20px)",
        padding: "10px 12px",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "#fff",
        fontFamily: "Inter, sans-serif",
        boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
        maxHeight: "220px",
        overflowY: "auto",
        minWidth: "260px",
      }}
    >
      <div style={{ fontSize: "9px", opacity: 0.5, marginBottom: "6px", letterSpacing: "1px", display: "flex", alignItems: "center", gap: "6px" }}>
        <Table2 size={12} /> RISK MATRIX
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
            <th style={{ textAlign: "left", padding: "3px 4px", opacity: 0.6, fontWeight: 500 }}>Pozo</th>
            <th style={{ textAlign: "right", padding: "3px 4px", opacity: 0.6, fontWeight: 500 }}>SF</th>
            <th style={{ textAlign: "right", padding: "3px 4px", opacity: 0.6, fontWeight: 500 }}>d_min</th>
            <th style={{ textAlign: "center", padding: "3px 4px", opacity: 0.6, fontWeight: 500 }}>Riesgo</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((e) => {
            const risk = e.result.riskLevel.toUpperCase();
            const riskColor = RISK_COLORS[risk] ?? "#888";
            return (
              <tr
                key={e.wellId}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
              >
                <td style={{ padding: "3px 4px", maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {e.wellName}
                </td>
                <td
                  style={{
                    textAlign: "right",
                    padding: "3px 4px",
                    fontWeight: "bold",
                    color: riskColor,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {Number.isFinite(e.result.sf) ? e.result.sf.toFixed(2) : "∞"}
                </td>
                <td
                  style={{
                    textAlign: "right",
                    padding: "3px 4px",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {e.result.minDistance.toFixed(0)} ft
                </td>
                <td
                  style={{
                    textAlign: "center",
                    padding: "3px 4px",
                    fontWeight: "bold",
                    color: riskColor,
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      padding: "1px 6px",
                      borderRadius: "4px",
                      background: `${riskColor}22`,
                      fontSize: "9px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {risk}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

RiskMatrixPanel.displayName = "RiskMatrixPanel";

/* ─── Dashboard Stats Panel ─────────────────────────────────────────────── */
const DashboardStats = ({
  entries,
  hiddenWellIds,
  realMinDistance,
  primaryTVD,
}: {
  entries?: CollisionEntry[];
  hiddenWellIds?: Set<string>;
  realMinDistance: number;
  primaryTVD: number;
}) => {
  const stats = useMemo(() => {
    if (!entries || entries.length === 0) return null;
    const visible = entries.filter((e) => !hiddenWellIds?.has(e.wellId));
    if (visible.length === 0) return null;

    const sfs = visible.map((e) => e.result.sf).filter(Number.isFinite);
    const avgSF = sfs.length > 0 ? sfs.reduce((a, b) => a + b, 0) / sfs.length : Infinity;
    const minSF = sfs.length > 0 ? sfs.reduce((m, v) => Math.min(m, v), Infinity) : Infinity;
    const dangerCount = visible.filter((e) => e.result.riskLevel.toUpperCase() === "CRITICAL").length;
    const warningCount = visible.filter((e) => e.result.riskLevel.toUpperCase() === "CAUTION").length;
    const closestWell = visible.reduce((best, e) =>
      e.result.minDistance < best.result.minDistance ? e : best,
      visible[0],
    );

    return {
      totalWells: visible.length,
      avgSF,
      minSF,
      dangerCount,
      warningCount,
      closestWell: closestWell.wellName,
      closestDist: closestWell.result.minDistance,
      currentDepth: primaryTVD,
    };
  }, [entries, hiddenWellIds, primaryTVD]);

  if (!stats) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "16px",
        left: "16px",
        zIndex: 15,
        background: "rgba(10, 10, 15, 0.92)",
        backdropFilter: "blur(20px)",
        padding: "10px 14px",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "#fff",
        fontFamily: "Inter, sans-serif",
        boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
        minWidth: "180px",
      }}
    >
      <div style={{ fontSize: "9px", opacity: 0.5, marginBottom: "8px", letterSpacing: "1px", display: "flex", alignItems: "center", gap: "6px" }}>
        <BarChart3 size={12} /> DASHBOARD
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "10px", opacity: 0.7 }}>Pozos:</span>
          <span style={{ fontWeight: "bold" }}>{stats.totalWells}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "10px", opacity: 0.7 }}>SF promedio:</span>
           <span style={{ fontWeight: "bold", color: getRiskColorFromSF(stats.avgSF) }}>
            {Number.isFinite(stats.avgSF) ? stats.avgSF.toFixed(2) : "∞"}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "10px", opacity: 0.7 }}>SF mínimo:</span>
           <span style={{ fontWeight: "bold", color: getRiskColorFromSF(stats.minSF) }}>
            {Number.isFinite(stats.minSF) ? stats.minSF.toFixed(2) : "∞"}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "10px", opacity: 0.7 }}>Más cercano:</span>
          <span style={{ fontWeight: "bold", fontSize: "9px" }}>{stats.closestWell}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "10px", opacity: 0.7 }}>d_min global:</span>
          <span style={{ fontWeight: "bold", color: "#ffcc00" }}>{realMinDistance.toFixed(0)} ft</span>
        </div>
        {stats.dangerCount > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "10px", opacity: 0.7 }}>🔴 Crítico:</span>
            <span style={{ fontWeight: "bold", color: "#ff3e3e" }}>{stats.dangerCount}</span>
          </div>
        )}
        {stats.warningCount > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "10px", opacity: 0.7 }}>🟡 Precaución:</span>
            <span style={{ fontWeight: "bold", color: "#ffcc00" }}>{stats.warningCount}</span>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", paddingTop: "4px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <span style={{ fontSize: "10px", opacity: 0.7 }}>Profundidad actual:</span>
          <span style={{ fontWeight: "bold" }}>{stats.currentDepth.toLocaleString()} ft</span>
        </div>
      </div>
    </div>
  );
};

DashboardStats.displayName = "DashboardStats";

export const AntiCollision3D: React.FC<AntiCollision3DProps> = ({
  primaryTrajectory,
  adjacentTrajectory,
  result,
  wellData,
  onClose,
  entries,
  hiddenWellIds,
  labelsOnlyMode: labelsOnlyModeProp,
  onLabelsOnlyModeChange,
}) => {
  const [viewIndex, setViewIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [focusTrigger, setFocusTrigger] = useState(0);
  const [labelsOnlyModeInternal, setLabelsOnlyModeInternal] = useState(false);
  const labelsOnlyMode = labelsOnlyModeProp ?? labelsOnlyModeInternal;
  const setLabelsOnlyMode = onLabelsOnlyModeChange ?? setLabelsOnlyModeInternal;
  // Dev warning: controlled mode requires callback
  useEffect(() => {
    if (labelsOnlyModeProp !== undefined && !onLabelsOnlyModeChange) {
      console.warn("AntiCollision3D: labelsOnlyMode is controlled but onLabelsOnlyModeChange is not provided. Toggle will not work.");
    }
  }, [labelsOnlyModeProp, onLabelsOnlyModeChange]);
  const showChrome = !labelsOnlyMode;
  const [showRiskMatrix, setShowRiskMatrix] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);
  const [showDistanceHeatmap, setShowDistanceHeatmap] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const cycleView = () => {
    setViewIndex((prev) => (prev + 1) % VIEWS.length);
    setIsRotating(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.warn);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const currentView = VIEWS[viewIndex];
  const lastPrimary = primaryTrajectory[primaryTrajectory.length - 1];

  const btnStyle = (isActive: boolean) => ({
    background: isActive ? "rgba(203, 255, 106, 0.15)" : "rgba(255, 255, 255, 0.05)",
    border: `1px solid ${isActive ? "rgba(203, 255, 106, 0.5)" : "transparent"}`,
    color: isActive ? "var(--sh-lima, #cbff6a)" : "rgba(255,255,255,0.7)",
    padding: "8px",
    borderRadius: "10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
  });

  if (primaryTrajectory.length < 2 || adjacentTrajectory.length < 2 || !result) {
    return (
      <div style={{ 
        width: "100%", 
        height: "500px", 
        background: "#0a0a0f", 
        borderRadius: "16px", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        color: "rgba(255,255,255,0.5)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}>
        Carga datos en ambos pozos para visualizar en 3D
      </div>
    );
  }

  // Compute bounds: primary uses real coordinates (subtract surfaceNorth/East),
  // adjacent wells use local coordinates (wellheadNorth/East already relative to primary)
  const bounds = useMemo(() => {
    const primaryBounds = computeBounds(primaryTrajectory, wellData.surfaceEast ?? 0, wellData.surfaceNorth ?? 0);
    const adjacentAllPoints = entries?.flatMap((e) => e.trajectory) ?? adjacentTrajectory;
    if (adjacentAllPoints.length === 0) return primaryBounds;
    const adjacentBounds = computeBounds(adjacentAllPoints, 0, 0);
    // Merge bounds from both coordinate systems
    return {
      minE: Math.min(primaryBounds.minE, adjacentBounds.minE),
      maxE: Math.max(primaryBounds.maxE, adjacentBounds.maxE),
      minN: Math.min(primaryBounds.minN, adjacentBounds.minN),
      maxN: Math.max(primaryBounds.maxN, adjacentBounds.maxN),
      minTVD: Math.min(primaryBounds.minTVD, adjacentBounds.minTVD),
      maxTVD: Math.max(primaryBounds.maxTVD, adjacentBounds.maxTVD),
      center: new THREE.Vector3(
        (Math.min(primaryBounds.minE, adjacentBounds.minE) + Math.max(primaryBounds.maxE, adjacentBounds.maxE)) / 2 || 0,
        (Math.min(primaryBounds.minTVD, adjacentBounds.minTVD) + Math.max(primaryBounds.maxTVD, adjacentBounds.maxTVD)) / 2 || -200,
        (Math.min(primaryBounds.minN, adjacentBounds.minN) + Math.max(primaryBounds.maxN, adjacentBounds.maxN)) / 2 || 0,
      ),
      cameraDistance: Math.max(
        primaryBounds.cameraDistance,
        adjacentBounds.cameraDistance,
        1000,
      ),
    };
  }, [primaryTrajectory, entries, adjacentTrajectory, wellData.surfaceEast, wellData.surfaceNorth]);

  const mergedBounds = useMemo(() => ({
    center: bounds.center,
    cameraDistance: bounds.cameraDistance,
  }), [bounds.center.x, bounds.center.y, bounds.center.z, bounds.cameraDistance]);

  // Real minDistance from transformed closest points (engine computes between mismatched coords)
  const realMinDistance = useMemo(() => {
    if (!entries || entries.length === 0) return result?.minDistance ?? 0;
    let minD = Infinity;
    for (const entry of entries) {
      const a = entry.result.closestA;
      const b = entry.result.closestB;
      const ax = a.east - (wellData.surfaceEast ?? 0);
      const az = a.north - (wellData.surfaceNorth ?? 0);
      const bx = b.east;
      const bz = b.north;
      const d = Math.sqrt((ax - bx) ** 2 + (az - bz) ** 2 + (a.tvd - b.tvd) ** 2);
      if (d < minD) minD = d;
    }
    return minD;
  }, [entries, result, wellData.surfaceEast, wellData.surfaceNorth]);

  // Distance heatmap colors for primary trajectory — stabilized with ref to avoid geometry rebuild
  const primaryDistanceColorsRef = useRef<THREE.Color[] | undefined>(undefined);
  const primaryDistanceColors = useMemo(() => {
    if (!showDistanceHeatmap || !entries || entries.length === 0) return undefined;
    const adjTrajectories = entries
      .filter((e) => !hiddenWellIds?.has(e.wellId))
      .map((e) => e.trajectory);
    if (adjTrajectories.length === 0) return undefined;
    const newColors = computeDistanceHeatmap(
      primaryTrajectory,
      adjTrajectories,
      wellData.surfaceEast ?? 0,
      wellData.surfaceNorth ?? 0,
    );
    // Only update ref if colors actually changed (compare length + first/last)
    const prev = primaryDistanceColorsRef.current;
    if (prev && prev.length === newColors.length &&
        prev[0].r === newColors[0].r && prev[0].g === newColors[0].g && prev[0].b === newColors[0].b &&
        prev[prev.length - 1].r === newColors[newColors.length - 1].r &&
        prev[prev.length - 1].g === newColors[newColors.length - 1].g &&
        prev[prev.length - 1].b === newColors[newColors.length - 1].b) {
      return prev; // stable reference
    }
    primaryDistanceColorsRef.current = newColors;
    return newColors;
  }, [showDistanceHeatmap, entries, hiddenWellIds, primaryTrajectory, wellData.surfaceEast, wellData.surfaceNorth]);

  return (
    <div
      ref={containerRef}
      style={
        isFullscreen
          ? {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100vw",
              height: "100vh",
              background: "#0a0a0f",
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
            }
          : {
              position: "relative",
              width: "100%",
              height: "550px",
              background: "#0a0a0f",
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.05)",
              zIndex: 1,
            }
      }
    >
      <div
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          background: "rgba(15, 15, 25, 0.85)",
          backdropFilter: "blur(12px)",
          padding: "8px",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}
      >
        <button onClick={onClose} style={btnStyle(false)} title="Cerrar vista 3D">
          <RotateCcw size={18} />
        </button>
        <button onClick={() => setIsRotating(!isRotating)} style={btnStyle(isRotating)} title={isRotating ? "Pausar" : "Auto-rotar"}>
          {isRotating ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
        </button>
        <button onClick={cycleView} style={btnStyle(currentView !== "iso")} title={`Vista: ${currentView.toUpperCase()}`}>
          <Box size={18} style={{ transform: currentView === "top" ? "rotate(90deg)" : "none", transition: "all 0.4s ease" }} />
          {currentView !== "iso" && <span style={{ fontSize: "8px", marginLeft: "4px", fontWeight: "bold" }}>{currentView === "bit" ? "MECHA" : currentView.toUpperCase()}</span>}
        </button>
        <button onClick={() => { setFocusTrigger((p) => p + 1); setIsRotating(false); }} style={btnStyle(false)} title="Centrar">
          <Focus size={18} />
        </button>
        <button onClick={toggleFullscreen} style={btnStyle(isFullscreen)} title="Pantalla completa">
          <Maximize2 size={18} />
        </button>
        <button onClick={() => setLabelsOnlyMode(!labelsOnlyMode)} style={btnStyle(labelsOnlyMode)} title={labelsOnlyMode ? "Modo completo" : "Solo tubos + etiquetas"} aria-label="Toggle labels only mode" data-testid="toggle-labels-only">
          {labelsOnlyMode ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        <button onClick={() => setShowRiskMatrix(!showRiskMatrix)} style={btnStyle(showRiskMatrix)} title="Matriz de riesgo" aria-label="Toggle risk matrix">
          <Table2 size={18} />
        </button>
        <button onClick={() => setShowDashboard(!showDashboard)} style={btnStyle(showDashboard)} title="Dashboard" aria-label="Toggle dashboard">
          <BarChart3 size={18} />
        </button>
        <button onClick={() => setShowDistanceHeatmap(!showDistanceHeatmap)} style={btnStyle(showDistanceHeatmap)} title="Mapa de calor por distancia" aria-label="Toggle distance heatmap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="6"/>
            <circle cx="12" cy="12" r="2"/>
          </svg>
        </button>
      </div>

      {showChrome && lastPrimary && (
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            left: "16px",
            zIndex: 15,
            background: "rgba(10, 10, 15, 0.9)",
            backdropFilter: "blur(20px)",
            padding: "12px 16px",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "#fff",
            fontFamily: "Inter, sans-serif",
            minWidth: "200px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ fontSize: "9px", opacity: 0.5, marginBottom: "6px", letterSpacing: "1px" }}>ANTI-COLLISION 3D</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "10px", opacity: 0.7 }}>SF:</span>
              <span style={{ fontWeight: "bold", color: "var(--sh-lima)" }}>{Number.isFinite(result.sf) ? result.sf.toFixed(4) : "∞"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "10px", opacity: 0.7 }}>d_min:</span>
              <span style={{ fontWeight: "bold", color: "#ffcc00" }}>{realMinDistance.toFixed(4)} ft</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "10px", opacity: 0.7 }}>σs:</span>
              <span style={{ fontWeight: "bold" }}>{result.sepSigma.toFixed(4)} ft</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "10px", opacity: 0.7 }}>Risk:</span>
              <span style={{ fontWeight: "bold", textTransform: "capitalize" }}>{result.riskLevel.toLowerCase()}</span>
            </div>
          </div>
        </div>
      )}

      {showChrome && (
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            color: "rgba(255,255,255,0.35)",
            fontSize: "9px",
            letterSpacing: "2px",
          fontWeight: "bold",
          pointerEvents: "none",
          textTransform: "uppercase",
        }}
      >
        {currentView} view
      </div>
      )}

      {showChrome && isRotating && (
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            right: "16px",
            color: "var(--sh-lima)",
            fontWeight: "bold",
            fontSize: "9px",
            letterSpacing: "2px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(0,0,0,0.5)",
            padding: "6px 12px",
            borderRadius: "20px",
            border: "1px solid rgba(203, 255, 106, 0.2)",
          }}
        >
          <div style={{ width: "8px", height: "8px", background: "var(--sh-lima)", borderRadius: "50%", animation: "pulse 1.5s infinite" }} />
          AUTO-ROTATE
        </div>
      )}

      {/* Risk Matrix Panel (professional anti-collision feature) */}
      {showChrome && showRiskMatrix && entries && entries.length > 0 && (
        <RiskMatrixPanel entries={entries} hiddenWellIds={hiddenWellIds} />
      )}

      {/* Dashboard Stats Panel */}
      {showChrome && showDashboard && (
        <DashboardStats
          entries={entries}
          hiddenWellIds={hiddenWellIds}
          realMinDistance={realMinDistance}
          primaryTVD={lastPrimary?.tvd ?? 0}
        />
      )}

      <Canvas shadows gl={{ antialias: true, logarithmicDepthBuffer: true }}>
        <React.Fragment>
        <PerspectiveCamera makeDefault fov={40} far={500000} />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          makeDefault
          enableRotate
          enablePan
        />
        <CameraController
          view={currentView}
          isRotating={isRotating}
          primaryTrajectory={primaryTrajectory}
          entries={entries}
          surfaceEast={wellData.surfaceEast ?? 0}
          surfaceNorth={wellData.surfaceNorth ?? 0}
          focusTrigger={focusTrigger}
          mergedBounds={mergedBounds}
        />

        <ambientLight intensity={0.4} />
        {/* Exponential fog: lowercase intrinsic (THREE.FogExp2 as JSX throws 'cannot invoke without new') */}
        {showChrome && <fogExp2 attach="fog" args={["#0a0a0f", 0.00015]} />}
        {showChrome && (
          <ContactShadows
            position={[0, -0.01, 0]}
            opacity={0.45}
            scale={4000}
            blur={2}
            far={2000}
            resolution={512}
          />
        )}
        {/* Key light — warm directional from above-right */}
        <directionalLight
          position={[800, 1200, 600]}
          intensity={1.8}
          color="#fff5e6"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        {/* Fill light — cool from opposite side for depth contrast */}
        <directionalLight
          position={[-600, 400, -400]}
          intensity={0.6}
          color="#b0c4de"
        />
        {/* Rim / back light */}
        <pointLight position={[-800, -200, -800]} intensity={0.8} color="#4a90e2" />

        {showChrome && (
          <Grid
            infiniteGrid
            fadeDistance={1200}
            sectionColor="#303045"
            cellColor="#151520"
            sectionSize={100}
            cellSize={10}
            rotation={[Math.PI / 2, 0, 0]}
          />
        )}

        {showChrome && <SurfaceMarker radius={Math.max(bounds.maxE - bounds.minE, bounds.maxN - bounds.minN) * 0.6 || 300} />}

        {/* Depth scale ticks along the TVD axis */}
        {showChrome && (
          <DepthScale
            minTVD={bounds.minTVD}
            maxTVD={bounds.maxTVD}
            interval={500}
            xPos={bounds.maxE + 60}
            zPos={0}
          />
        )}

        {/* Primary well trajectory (common frame via wellData surface offsets D1) */}
        {primaryTrajectory.length > 0 && (
          <WellborePath
            segments={primaryTrajectory}
            color={WELL_COLORS[0]}
            emissiveColor={WELL_COLORS[0]}
            label="POZO PRINCIPAL"
            surfaceEast={wellData.surfaceEast ?? 0}
            surfaceNorth={wellData.surfaceNorth ?? 0}
            useDepthGradient={!showDistanceHeatmap}
            showEndLabel={labelsOnlyMode}
            distanceColors={primaryDistanceColors}
          />
        )}
        {showChrome && primaryTrajectory.length > 0 && (
          <SurveyStationMarkers
            segments={primaryTrajectory}
            surfaceEast={wellData.surfaceEast ?? 0}
            surfaceNorth={wellData.surfaceNorth ?? 0}
            color={WELL_COLORS[0]}
            label="PRINCIPAL"
          />
        )}

        {/* Adjacent well trajectories from matrix entries */}
        {entries?.map((entry) => {
          // D6: stable color keyed by wellId, not index (colors survive risk re-sorts)
          const color = wellColor(entry.wellId, [PRIMARY_WELL_ID, ...(entries?.map((e) => e.wellId) ?? [])]);
          // D3: skip hidden wells
          const isHidden = entry.wellId && hiddenWellIds?.has(entry.wellId);
          return (
            <React.Fragment key={entry.wellId}>
              {/* D1: use common primary wellhead frame; D3: skip if hidden */}
              {!isHidden && (
                <WellborePath
                  segments={entry.trajectory}
                  color={color}
                  emissiveColor={color}
                  label={entry.wellName.toUpperCase()}
                  // Adjacent trajectories are already in local coordinates
                  // (wellheadNorth/East relative to primary), do NOT subtract
                  // the primary well's state-plane surface coordinates
                  surfaceEast={0}
                  surfaceNorth={0}
                  useDepthGradient
                  showEndLabel={labelsOnlyMode}
                />
              )}
              {showChrome && !isHidden && (
                <SurveyStationMarkers
                  segments={entry.trajectory}
                  surfaceEast={0}
                  surfaceNorth={0}
                  color={color}
                  label={entry.wellName}
                />
              )}

              {/* 95% uncertainty ellipsoid at closest approach (only for selected pair D4) */}
              {showChrome && entry === entries?.[0] && !isHidden && (
                <React.Fragment>
                  <UncertaintyEllipsoid
                    position={new THREE.Vector3(
                      entry.result.closestA.east - (wellData.surfaceEast ?? 0),
                      -entry.result.closestA.tvd,
                      entry.result.closestA.north - (wellData.surfaceNorth ?? 0)
                    )}
                    axes={entry.result.ellipseA.axes as [number, number, number]}
                    color={WELL_COLORS[0]}
                    label="Principal — Elipsoide 95%"
                  />
                  <UncertaintyEllipsoid
                    position={new THREE.Vector3(
                      // closestB is from adjacent trajectory — already in local coords
                      entry.result.closestB.east,
                      -entry.result.closestB.tvd,
                      entry.result.closestB.north
                    )}
                    axes={entry.result.ellipseB.axes as [number, number, number]}
                    color={color}
                    label={entry.wellName + " — Elipsoide 95%"}
                  />
                  <ClosestApproachMarker
                    pointA={entry.result.closestA}
                    pointB={entry.result.closestB}
                    surfaceEast={wellData.surfaceEast ?? 0}
                    surfaceNorth={wellData.surfaceNorth ?? 0}
                  />
                </React.Fragment>
              )}
            </React.Fragment>
          );
        })}

        {/* Single active entry detail (fallback when not all entries shown) */}
        {showChrome && !entries && result && (
          <>
            <UncertaintyEllipsoid
              position={new THREE.Vector3(
                result.closestA.east - (wellData.surfaceEast ?? 0),
                -result.closestA.tvd,
                result.closestA.north - (wellData.surfaceNorth ?? 0)
              )}
              axes={result.ellipseA.axes as [number, number, number]}
              color="#00b4d8"
              label="Elipsoide Principal 95%"
            />
            <UncertaintyEllipsoid
              position={new THREE.Vector3(
                // closestB from adjacent trajectory — local coords, no subtraction
                result.closestB.east,
                -result.closestB.tvd,
                result.closestB.north
              )}
              axes={result.ellipseB.axes as [number, number, number]}
              color="#ff006e"
              label="Elipsoide Adyacente 95%"
            />
            <ClosestApproachMarker
              pointA={result.closestA}
              pointB={result.closestB}
              surfaceEast={wellData.surfaceEast ?? 0}
              surfaceNorth={wellData.surfaceNorth ?? 0}
            />
          </>
        )}

        <Html position={[bounds.maxE + 200, 0, 0]} center style={{ pointerEvents: "none" }}>
          <div style={{ color: "#fff", fontWeight: 900, fontSize: "16px", textShadow: "0 0 8px #000, 0 0 16px #000, 0 0 24px #ff3e3e", background: "rgba(0,0,0,0.7)", padding: "4px 10px", borderRadius: "6px", border: "2px solid #ff3e3e", whiteSpace: "nowrap" }}>East (E) [ft]</div>
        </Html>
        <Html position={[0, bounds.minTVD - 200, 0]} center style={{ pointerEvents: "none" }}>
          <div style={{ color: "#fff", fontWeight: 900, fontSize: "16px", textShadow: "0 0 8px #000, 0 0 16px #000, 0 0 24px #00ff00", background: "rgba(0,0,0,0.7)", padding: "4px 10px", borderRadius: "6px", border: "2px solid #00ff00", whiteSpace: "nowrap" }}>Depth (TVD) [ft]</div>
        </Html>
        <Html position={[0, 0, bounds.maxN + 200]} center style={{ pointerEvents: "none" }}>
          <div style={{ color: "#fff", fontWeight: 900, fontSize: "16px", textShadow: "0 0 8px #000, 0 0 16px #000, 0 0 24px #00b4d8", background: "rgba(0,0,0,0.7)", padding: "4px 10px", borderRadius: "6px", border: "2px solid #00b4d8", whiteSpace: "nowrap" }}>North (N) [ft]</div>
        </Html>
        </React.Fragment>
      </Canvas>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};