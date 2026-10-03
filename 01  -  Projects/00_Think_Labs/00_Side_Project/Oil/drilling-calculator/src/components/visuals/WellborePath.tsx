// ============================================================
// WellborePath — shared, single-source-of-truth wellbore renderer
// (extracted from Trajectory3D.tsx + AntiCollision3D.tsx to kill duplication)
//
// Fixes (RC-2): default tube radius 1.8 -> 3 ft, radial segments 12 -> 16,
// and `vertical` color #8e9af (invisible on #0a0a0f) -> #00b4d8.
// Pure helpers (luminance / getSectionColor / buildTrajectoryPoints) are
// exported for headless testing.
// ============================================================
import React, { useMemo } from "react";
import * as THREE from "three";
import { Text, Edges, Html } from "@react-three/drei";
import type { TrajectoryPoint } from "../../store/drilling-types";

// ── Color palette (legible on dark canvas; luminance >= 0.4) ──
export const WELLBORE_COLORS = {
  vertical: "#00d2ff", // vivid cyan — luminance 0.53 vs #8e9af 0.60 (invisible chroma)
  build: "#cbff6a", // lime
  drop: "#ff006e", // magenta
  tangent: "#00b4d8", // cyan
};

const DEFAULT_COLOR = "#ff006e"; // primary well color (Phase 1)
const DEFAULT_EMISSIVE = "#00b4d8";

export const DEFAULT_TUBE_RADIUS = 3; // feet (was 1.8)
export const DEFAULT_RADIAL_SEGMENTS = 16; // (was 12)

/** BT.709 relative luminance of a hex color (#rgb or #rrggbb), 0..1. */
export function luminance(hex: string): number {
  let s = hex.replace("#", "");
  if (s.length === 3) s = s.split("").map((c) => c + c).join("");
  const n = parseInt(s, 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  const [rs, gs, bs] = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/** Mirror of the inline color table; pure (no three.js). */
export function getSectionColor(
  type: string,
  dls?: number,
  useHeatmap?: boolean,
): string {
  if (useHeatmap && dls !== undefined) {
    // DLS hue: 0 (green) -> 2.5 (yellow) -> 5+ (red), 120 is green, 0 is red
    const hue = Math.max(0, Math.min(120, 120 - dls * 24));
    return `hsl(${hue}, 100%, 65%)`;
  }
  switch (type) {
    case "vertical":
      return WELLBORE_COLORS.vertical;
    case "build":
      return WELLBORE_COLORS.build;
    case "drop":
      return WELLBORE_COLORS.drop;
    default:
      return WELLBORE_COLORS.tangent;
  }
}

interface BuildPointsOpts {
  surfaceEast: number;
  surfaceNorth: number;
}

/** Pure: map TrajectoryPoint[] -> THREE.Vector3[] in common NE-TVD frame. */
export function buildTrajectoryPoints(
  segments: TrajectoryPoint[],
  opts: BuildPointsOpts,
): THREE.Vector3[] {
  const { surfaceEast = 0, surfaceNorth = 0 } = opts;
  return segments.map(
    (p) => new THREE.Vector3(p.east - surfaceEast, -p.tvd, p.north - surfaceNorth),
  );
}

// ── Component ──
export interface WellborePathProps {
  segments: TrajectoryPoint[];
  color?: string;
  emissiveColor?: string;
  opacity?: number;
  label?: string;
  surfaceEast?: number;
  surfaceNorth?: number;
  tubeRadius?: number;
  radialSegments?: number;
  useDLSHeatmap?: boolean;
  neutralPoint?: number;
  isFullscreen?: boolean;
  useSectionColors?: boolean;
}

export const WellborePath: React.FC<WellborePathProps> = ({
  segments,
  color = DEFAULT_COLOR,
  emissiveColor = DEFAULT_EMISSIVE,
  opacity = 1,
  label,
  surfaceEast = 0,
  surfaceNorth = 0,
  tubeRadius = DEFAULT_TUBE_RADIUS,
  radialSegments = DEFAULT_RADIAL_SEGMENTS,
  useDLSHeatmap = false,
  neutralPoint,
  isFullscreen = false,
  useSectionColors = false,
}) => {
  const { points, sections, surfaceCoords } = useMemo(() => {
    const pts = buildTrajectoryPoints(segments, { surfaceEast, surfaceNorth });

    const secs: {
      points: THREE.Vector3[];
      color: string;
      type: string;
      dls?: number;
    }[] = [];
    if (segments.length < 2) return { points: pts, sections: secs, surfaceCoords: { east: surfaceEast, north: surfaceNorth } };

    let currentSecPoints: THREE.Vector3[] = [pts[0]];
    let lastType = "";

    for (let i = 1; i < segments.length; i++) {
      const p1 = segments[i - 1];
      const p2 = segments[i];

      const dLS =
        p2.md - p1.md > 0
          ? (Math.sqrt(
              Math.pow(p2.inc - p1.inc, 2) +
                Math.pow(
                  Math.sin((p1.inc * Math.PI) / 180) * (p2.azi - p1.azi),
                  2,
                ),
            ) /
              (p2.md - p1.md)) *
            100
          : 0;

      const deltaInc = p2.inc - p1.inc;
      let type = "tangent";
      if (p2.inc < 1.0) {
        type = "vertical";
      } else if (deltaInc > 0.3) {
        type = "build";
      } else if (deltaInc < -0.3) {
        type = "drop";
      }

      if (i === 1) lastType = type;

      if (type !== lastType && currentSecPoints.length > 1) {
        secs.push({
          points: [...currentSecPoints],
          color: getSectionColor(lastType),
          type: lastType,
          dls: dLS,
        });
        currentSecPoints = [pts[i - 1]];
      }

      currentSecPoints.push(pts[i]);
      lastType = type;
    }

    if (currentSecPoints.length > 0) {
      secs.push({
        points: currentSecPoints,
        color: getSectionColor(lastType),
        type: lastType,
      });
    }

    return {
      points: pts,
      sections: secs,
      surfaceCoords: { east: surfaceEast, north: surfaceNorth },
    };
  }, [segments, surfaceEast, surfaceNorth]);

  const labels = useMemo(
    () =>
      segments.filter((_, i) => i % 15 === 0 || i === segments.length - 1),
    [segments],
  );

  const { npPos } = useMemo(() => {
    let neutralPos: THREE.Vector3 | null = null;

    if (neutralPoint && segments.length > 0) {
      const last = segments[segments.length - 1];
      const targetMD = last.md - neutralPoint;
      const point = segments.reduce((prev, curr) =>
        Math.abs(curr.md - targetMD) < Math.abs(prev.md - targetMD)
          ? curr
          : prev,
      );
      neutralPos = new THREE.Vector3(
        point.east - (surfaceCoords?.east || 0),
        -point.tvd,
        point.north - (surfaceCoords?.north || 0),
      );
    }

    return { npPos: neutralPos };
  }, [segments, neutralPoint, surfaceCoords]);

  const casingShoes = useMemo(() => {
    const shoeMDs = [1200, 3500, 6800];
    return shoeMDs
      .map((md) => {
        const point = segments.reduce((prev, curr) =>
          Math.abs(curr.md - md) < Math.abs(prev.md - md) ? curr : prev,
        );
        return point;
      })
      .filter((p) => p.md > 0);
  }, [segments]);

  if (points.length < 2) return null;

  const lastPoint = points[points.length - 1];

  const clampedRadius = Math.max(1.5, tubeRadius);

  return (
    <group>
      {/* Segmented wellbore tubes (single source of truth vs legacy inline copies) */}
      {sections.map((sec, idx) => {
        if (sec.points.length < 2) return null;

        const sectionColor = useDLSHeatmap
          ? getSectionColor(sec.type, sec.dls || 0, true)
          : useSectionColors
            ? sec.color
            : color;

        const sectionEmissive = useDLSHeatmap
          ? getSectionColor(sec.type, sec.dls || 0, true)
          : useSectionColors
            ? sec.color
            : emissiveColor;

        const curve = new THREE.CatmullRomCurve3(sec.points);
        return (
          <mesh key={idx} castShadow>
            <tubeGeometry
              args={[
                curve,
                Math.max(2, sec.points.length * 2),
                clampedRadius,
                radialSegments,
                false,
              ]}
            />
            <meshPhysicalMaterial
              color={sectionColor}
              emissive={sectionEmissive}
              emissiveIntensity={0.6}
              metalness={0.9}
              roughness={0.15}
              clearcoat={1}
              toneMapped={false}
              transparent={opacity < 1}
              opacity={opacity}
            />
            {/* Neon outline (competitive edge over Petrel/Compass plain tubes) */}
            <Edges transparent opacity={0.55} lineWidth={1.5}>
              <lineBasicMaterial color={sectionColor} />
            </Edges>
          </mesh>
        );
      })}

      {/* Label at trajectory start */}
      {label && points.length > 0 && (
        <Html position={points[0].clone().add(new THREE.Vector3(0, 40, 0))} center style={{ pointerEvents: "none" }}>
          <div style={{ color: "#fff", fontWeight: 900, fontSize: "14px", textShadow: "0 0 8px #000, 0 0 16px #000, 0 0 24px currentColor", background: "rgba(0,0,0,0.85)", padding: "4px 10px", borderRadius: "6px", border: "2px solid currentColor", whiteSpace: "nowrap" }}>
            {label}
          </div>
        </Html>
      )}

      {/* Casing Shoes */}
      {casingShoes.map((shoe, idx) => (
        <group
          key={`shoe-${idx}`}
          position={[
            shoe.east - (surfaceCoords?.east || 0),
            -shoe.tvd,
            shoe.north - (surfaceCoords?.north || 0),
          ]}
        >
          <group rotation={[Math.PI / 2, 0, 0]}>
            <mesh>
              <torusGeometry args={[8, 0.4, 16, 48]} />
              <meshStandardMaterial
                color="#ff006e"
                emissive="#ff006e"
                emissiveIntensity={2}
                transparent
                opacity={0.6}
              />
            </mesh>
            <mesh>
              <torusGeometry args={[8.5, 0.1, 8, 32]} />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={0.3}
                wireframe
              />
            </mesh>
          </group>

          <Text
            position={[18, 0, 0]}
            fontSize={isFullscreen ? 5 : 6}
            color="#ffffff"
            anchorX="left"
            fontWeight={800}
            maxWidth={100}
          >
            {`CASING SHOE @ ${shoe.md.toFixed(0)} ft`.toUpperCase()}
          </Text>
          <pointLight color="#ff006e" intensity={1} distance={40} />
        </group>
      ))}

      {/* Survey Point labels */}
      {labels.map((p, i) => {
        const pos = new THREE.Vector3(
          p.east - (surfaceCoords?.east || 0),
          -p.tvd,
          p.north - (surfaceCoords?.north || 0),
        );
        return (
          <group key={i} position={pos}>
            <mesh>
              <sphereGeometry args={[2, 16, 16]} />
              <meshStandardMaterial
                color="#cbff6a"
                emissive="#cbff6a"
                emissiveIntensity={0.8}
              />
            </mesh>
            <Text
              position={[-10, 0, 0]}
              fontSize={isFullscreen ? 4 : 5}
              color="#cbff6a"
              anchorX="right"
              fontWeight={900}
            >
              {`${p.md.toFixed(0)} ft`.toUpperCase()}
            </Text>
          </group>
        );
      })}

      {/* Dynamic Neutral Point */}
      {npPos && (
        <group position={npPos}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[6, 0.8, 16, 32]} />
            <meshStandardMaterial
              color="#ffcc00"
              emissive="#ffcc00"
              emissiveIntensity={1}
              transparent
              opacity={0.8}
            />
          </mesh>
          <Text
            position={[15, 0, 0]}
            fontSize={isFullscreen ? 6 : 8}
            color="#ffcc00"
            anchorX="left"
            outlineWidth={0.2}
            outlineColor="#000000"
          >
            {`PUNTO NEUTRO @ ${neutralPoint?.toFixed(0) || 0} ft MD`}
          </Text>
          <pointLight color="#ffcc00" intensity={2} distance={30} />
        </group>
      )}

      {/* BHA / Mecha */}
      <group position={lastPoint}>
        <mesh rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[6, 18, 4]} />
          <meshStandardMaterial
            color="#FFD700"
            metalness={1}
            roughness={0.1}
            emissive="#FFD700"
            emissiveIntensity={0.2}
          />
        </mesh>
        <pointLight color="#FFD700" intensity={3} distance={60} />
      </group>
    </group>
  );
};
