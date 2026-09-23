import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Stars,
  Text,
  Grid,
  Environment,
  Html,
} from "@react-three/drei";
import * as THREE from "three";
import { useDrillingStore } from "../../store/drilling-store";
import { Maximize2, Box, Play, Pause, Layers, Info, Focus } from "lucide-react";
import { useToolManager } from "../../hooks/useToolManager";
import { CursorManager } from "../ui/CursorManager";
import { ToolOverlay } from "../ui/ToolOverlay";
import { useSelectionRaycaster } from "../../utils/SelectionRaycaster";

const VIEWS = ["iso", "top", "side", "front", "bit"];

// Componente para detectar clics y cambiar la vista
const InteractionPlane = ({ trajectory, setViewIndex, cycleView, toolState }: any) => {
  const getIntersections = useSelectionRaycaster();

  const handleClick = (e: any) => {
    // Si estamos en modo de selección, no cambiar vista automáticamente
    if (toolState.mode === 'selection') return;
    
    const intersects = getIntersections(e.clientX, e.clientY);
    
    if (intersects.length > 0) {
      const point = intersects[0].point;
      // Lógica simple para determinar la vista basada en la posición del clic
      // Por ejemplo, si clickeamos cerca del bit (último punto), cambiamos a vista "bit"
      if (trajectory.length > 0) {
        const lastPoint = trajectory[trajectory.length - 1];
        const surfaceEast = trajectory[0].east;
        const surfaceNorth = trajectory[0].north;
        
        // Convertir coordenadas 3D a relativas
        const relX = point.x; // East
        const relZ = point.z; // North
        
        // Distancia al último punto (Bit)
        const distToBit = Math.sqrt(
          Math.pow(relX - (lastPoint.east - surfaceEast), 2) + 
          Math.pow(relZ - (lastPoint.north - surfaceNorth), 2)
        );

        if (distToBit < 100) { // Si está cerca del bit
          setViewIndex(VIEWS.indexOf('bit'));
        } else {
          // Cambiar vista cíclicamente si no es el bit
          cycleView();
        }
      }
    }
  };

  return (
    <mesh 
      position={[0, -500, 0]} 
      rotation={[-Math.PI / 2, 0, 0]} 
      onClick={handleClick}
      onPointerDown={handleClick}
    >
      <planeGeometry args={[10000, 10000]} />
      <meshBasicMaterial visible={false} />
    </mesh>
  );
};

// Componente para configurar OrbitControls dinámicamente
const ControlsConfig = ({ toolState }: { toolState: any }) => {
  const { controls } = useThree() as any;

  useEffect(() => {
    if (!controls) return;

    // Configuración basada en el modo de herramienta
    if (toolState.mode === 'selection') {
      controls.enableRotate = false;
      controls.enablePan = false;
    } else if (toolState.mode === 'hand') {
      controls.enableRotate = false;
      controls.enablePan = true;
    } else {
      // Modo rotate o default
      controls.enableRotate = true;
      controls.enablePan = false;
    }
  }, [toolState.mode, controls]);

  return null;
};

const CameraController = ({
  view,
  isRotating,
  trajectory,
  focusTrigger,
}: {
  view: string;
  isRotating: boolean;
  trajectory: any[];
  focusTrigger: number;
}) => {
  const { camera, controls } = useThree() as any;
  const rotationAngle = useRef(0);
  const prevFocusTrigger = useRef(focusTrigger);

  useEffect(() => {
    if (!controls || trajectory.length === 0) return;

    // Calcular el centro geométrico de la trayectoria
    let minE = Infinity,
      maxE = -Infinity;
    let minN = Infinity,
      maxN = -Infinity;
    let minTVD = Infinity,
      maxTVD = -Infinity;

    const surfaceEast = trajectory.length > 0 ? trajectory[0].east : 0;
    const surfaceNorth = trajectory.length > 0 ? trajectory[0].north : 0;

    trajectory.forEach((p) => {
      minE = Math.min(minE, p.east - surfaceEast);
      maxE = Math.max(maxE, p.east - surfaceEast);
      minN = Math.min(minN, p.north - surfaceNorth);
      maxN = Math.max(maxN, p.north - surfaceNorth);
      minTVD = Math.min(minTVD, -p.tvd);
      maxTVD = Math.max(maxTVD, -p.tvd);
    });

    const center = new THREE.Vector3(
      (minE + maxE) / 2 || 0,
      (minTVD + maxTVD) / 2 || -200,
      (minN + maxN) / 2 || 0,
    );

    // Calcular un "radio" o extensión para ajustar el zoom de la cámara
    const extE = maxE - minE || 1000;
    const extN = maxN - minN || 1000;
    const extTVD = maxTVD - minTVD || 1000;
    const maxExt = Math.max(extE, extN, extTVD);
    const cameraDistance = Math.max(maxExt * 1.5, 1000);

    const lastPoint = trajectory[trajectory.length - 1];

    // Diferenciar entre "cambio de vista" y "trigger de centrado"
    // Si es un trigger, mantenemos la rotación/ángulo relativo actual de la cámara, solo movemos target y radio.
    if (prevFocusTrigger.current !== focusTrigger) {
      prevFocusTrigger.current = focusTrigger;

      // Obtener dirección actual de la cámara respecto a su target real actual
      const currentDir = new THREE.Vector3()
        .subVectors(camera.position, controls.target)
        .normalize();

      // Evitar que la dirección sea cero
      if (currentDir.lengthSq() < 0.1) currentDir.set(1, 1, 1).normalize();

      // Mover target al centro
      controls.target.copy(center);

      // Alejar la cámara en la MISMA dirección
      const newPos = center
        .clone()
        .add(currentDir.multiplyScalar(cameraDistance));
      camera.position.copy(newPos);
    } else {
      // Cambio de vista rígido (Top, Side, Front, Iso, Bit)
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

      // Update camera up vector to avoid flipping
      if (view === "top") {
        camera.up.set(0, 0, -1);
      } else {
        camera.up.set(0, 1, 0);
      }
      camera.lookAt(controls.target);
    }

    controls.update();
  }, [view, camera, controls, trajectory, focusTrigger]);

  useFrame((_, delta) => {
    if (isRotating && controls && view !== "bit") {
      rotationAngle.current += delta * 0.2;
      const radius = 600;
      camera.position.x = Math.sin(rotationAngle.current) * radius;
      camera.position.z = Math.cos(rotationAngle.current) * radius;
      camera.position.y = -400 + Math.sin(rotationAngle.current * 0.5) * 100;
      controls.update();
    }
  });

  return null;
};

const WellborePath = ({
  segments,
  isFullscreen,
  useDLSHeatmap,
  neutralPoint,
}: {
  segments: any[];
  isFullscreen: boolean;
  useDLSHeatmap: boolean;
  neutralPoint?: number;
}) => {
  const getSectionColor = (
    type: string,
    dls?: number,
    useHeatmap?: boolean,
  ) => {
    if (useHeatmap && dls !== undefined) {
      // Escala de DLS: 0 (Verde) -> 2.5 (Amarillo) -> 5+ (Rojo)
      // Usamos HSL para una transición suave. 120 es verde, 0 es rojo.
      const hue = Math.max(0, Math.min(120, 120 - dls * 24));
      return `hsl(${hue}, 100%, 65%)`;
    }

    switch (type) {
      case "vertical":
        return "#8e9aaf";
      case "build":
        return "#cbff6a";
      case "drop":
        return "#ff006e";
      default:
        return "#00b4d8";
    }
  };

  const { points, sections, surfaceCoords } = useMemo(() => {
    const sEast = segments.length > 0 ? segments[0].east : 0;
    const sNorth = segments.length > 0 ? segments[0].north : 0;
    const pts = segments.map(
      (p) => new THREE.Vector3(p.east - sEast, -p.tvd, p.north - sNorth),
    );

    // Calcular secciones dinámicas y DLS
    const secs: {
      points: THREE.Vector3[];
      color: string;
      type: string;
      dls?: number;
    }[] = [];
    if (segments.length < 2) return { points: pts, sections: [] };

    let currentSecPoints: THREE.Vector3[] = [pts[0]];
    let lastType = "";

    for (let i = 1; i < segments.length; i++) {
      const p1 = segments[i - 1];
      const p2 = segments[i];

      // Cálculo de DLS simplified (Degrees per 100ft)
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
          dls: dLS, // Almacenamos el DLS del punto de cambio
        });
        currentSecPoints = [pts[i - 1]];
      }

      currentSecPoints.push(pts[i]);
      lastType = type;

      // Si estamos en modo Heatmap, cada segmento de tubería podría ser una sección pequeña
      // pero para optimizar WebGL, solo lo aplicaremos dinámicamente si es necesario
    }

    // Última sección
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
      surfaceCoords: { east: sEast, north: sNorth },
    };
  }, [segments]);

  const labels = useMemo(
    () => segments.filter((_, i) => i % 15 === 0 || i === segments.length - 1),
    [segments],
  );

  const { npPos } = useMemo(() => {
    let mPos = new THREE.Vector3(0, -100, 0);
    let neutralPos = null;

    if (sections.length > 0) {
      const buildSec = sections.find((s) => s.type === "build") || sections[0];
      mPos = buildSec.points[Math.floor(buildSec.points.length / 2)];
    }

    if (neutralPoint && segments.length > 0) {
      const last = segments[segments.length - 1];
      const targetMD = last.md - neutralPoint;

      // Encontrar el punto más cercano a esa MD en la trayectoria
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

    return { mantraPos: mPos, npPos: neutralPos };
  }, [sections, segments, neutralPoint, surfaceCoords]);

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

  return (
    <group>
      {/* Secciones de Tubería Segmentadas */}
      {sections.map((sec, idx) => {
        if (sec.points.length < 2) return null;

        // Usar el DLS almacenado en la sección
        let sectionColor = sec.color;
        if (useDLSHeatmap) {
          sectionColor = getSectionColor(sec.type, sec.dls || 0, true);
        }

        const curve = new THREE.CatmullRomCurve3(sec.points);
        return (
          <mesh key={idx} castShadow>
            <tubeGeometry
              args={[curve, Math.max(2, sec.points.length * 2), 1.8, 12, false]}
            />
            <meshPhysicalMaterial
              color={sectionColor}
              emissive={sectionColor}
              emissiveIntensity={0.15}
              metalness={0.8}
              roughness={0.2}
              clearcoat={1}
            />
          </mesh>
        );
      })}

      {/* Marcadores de Casing Shoes (Innovación Elite) */}
      {casingShoes.map((shoe, idx) => (
        <group
          key={`shoe-${idx}`}
          position={[
            shoe.east - (surfaceCoords?.east || 0),
            -shoe.tvd,
            shoe.north - (surfaceCoords?.north || 0),
          ]}
        >
          {/* Anillo de Luz Industrial */}
          <group rotation={[Math.PI / 2, 0, 0]}>
            <mesh>
              <torusGeometry args={[8, 0.4, 16, 48]} />
              <meshStandardMaterial
                color="#00b4d8"
                emissive="#00b4d8"
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

          {/* Etiqueta Billboard Pro */}
          <Text
            position={[18, 0, 0]}
            fontSize={isFullscreen ? 5 : 6}
            color="#ffffff"
            anchorX="left"
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
            fontWeight={800}
            maxWidth={100}
          >
            {`CASING SHOE @ ${shoe.md.toFixed(0)} ft`.toUpperCase()}
          </Text>
          <pointLight color="#00b4d8" intensity={1} distance={40} />
        </group>
      ))}

      {/* Marcadores de Encuesta (Survey Points) */}
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
              font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
            >
              {`${p.md.toFixed(0)} ft`.toUpperCase()}
            </Text>
          </group>
        );
      })}

      {/* Punto Neutro Dinámico (Innovación) */}
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
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
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

export const Trajectory3D: React.FC = () => {
  const [viewIndex, setViewIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHUD, setShowHUD] = useState(true);
  const [useDLSHeatmap, setUseDLSHeatmap] = useState(false);
  const [focusTrigger, setFocusTrigger] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const toolState = useToolManager();

  const results = useDrillingStore((state) => state.results);
  const trajectory = results.directional?.trajectory || [];
  const lastPoint =
    trajectory.length > 0 ? trajectory[trajectory.length - 1] : null;

  const cycleView = () => {
    setViewIndex((prev) => (prev + 1) % VIEWS.length);
    setIsRotating(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
        })
        .catch((err) => {
          console.warn("Fullscreen request failed", err);
          setIsFullscreen(!isFullscreen); // Toggle "fake" fullscreen fallback si se requiere
        });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const currentView = VIEWS[viewIndex];

  const btnStyle = (isActive: boolean) => ({
    background: isActive
      ? "rgba(203, 255, 106, 0.15)"
      : "rgba(255, 255, 255, 0.05)",
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
      <CursorManager toolState={toolState} />
      <ToolOverlay toolState={toolState} />
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          background: "rgba(15, 15, 25, 0.7)",
          backdropFilter: "blur(12px)",
          padding: "10px",
          borderRadius: "14px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}
      >
        {/* Play/Pause */}
        <button
          onClick={() => setIsRotating(!isRotating)}
          style={btnStyle(isRotating)}
          title={isRotating ? "Pausar Rotación" : "Activar Modo Automático"}
        >
          {isRotating ? (
            <Pause size={18} fill="currentColor" />
          ) : (
            <Play size={18} fill="currentColor" />
          )}
        </button>

        {/* Ciclo de Vistas */}
        <button
          onClick={cycleView}
          style={btnStyle(currentView !== "iso")}
          title={`Vista Actual: ${currentView.toUpperCase()} (Clic para cambiar)`}
        >
          <Box
            size={18}
            style={{
              transform: currentView === "top" ? "rotate(90deg)" : "none",
              transition: "all 0.4s ease",
            }}
          />
          {currentView !== "iso" && (
            <span
              style={{ fontSize: "8px", marginLeft: "4px", fontWeight: "bold" }}
            >
              {currentView === "bit" ? "MECHA" : currentView.toUpperCase()}
            </span>
          )}
        </button>

        {/* Toggle DLS Heatmap */}
        <button
          onClick={() => setUseDLSHeatmap(!useDLSHeatmap)}
          style={btnStyle(useDLSHeatmap)}
          title="Mapa de Calor de Curvatura (DLS)"
        >
          <Layers size={18} />
        </button>

        {/* Toggle HUD */}
        <button
          onClick={() => setShowHUD(!showHUD)}
          style={btnStyle(showHUD)}
          title="Mostrar/Ocultar Datos Técnicos"
        >
          <Info size={18} />
        </button>

        {/* Focus / Auto-Frame */}
        <button
          onClick={() => {
            setFocusTrigger((prev) => prev + 1);
            setIsRotating(false);
          }}
          style={btnStyle(false)}
          title="Centrar Vista Actual"
        >
          <Focus size={18} />
        </button>

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          style={btnStyle(isFullscreen)}
          title="Modo Inmersivo"
        >
          <Maximize2 size={18} />
        </button>
      </div>

      {/* Smart HUD (Innovación PersonalOS) */}
      {showHUD && lastPoint && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            zIndex: 10,
            background: "rgba(10, 10, 15, 0.8)",
            backdropFilter: "blur(20px)",
            padding: "15px",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "#fff",
            fontFamily: "Inter, sans-serif",
            minWidth: "180px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              opacity: 0.5,
              marginBottom: "8px",
              letterSpacing: "1px",
            }}
          >
            TÉRMICA DE POZO
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "11px", opacity: 0.7 }}>MD:</span>
              <span style={{ fontWeight: "bold", color: "var(--sh-lima)" }}>
                {lastPoint.md.toFixed(1)} ft
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "11px", opacity: 0.7 }}>TVD:</span>
              <span style={{ fontWeight: "bold" }}>
                {lastPoint.tvd.toFixed(1)} ft
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "11px", opacity: 0.7 }}>INC / AZI:</span>
              <span style={{ fontWeight: "bold" }}>
                {lastPoint.inc.toFixed(1)}° / {lastPoint.azi.toFixed(1)}°
              </span>
            </div>
            <div
              style={{
                height: "1px",
                background: "rgba(255,255,255,0.1)",
                margin: "4px 0",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "11px", opacity: 0.7 }}>N / E:</span>
              <span style={{ fontWeight: "bold", fontSize: "11px" }}>
                {lastPoint.north.toFixed(0)} / {lastPoint.east.toFixed(0)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Label de Vista Actual */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          color: "rgba(255,255,255,0.4)",
          fontSize: "10px",
          letterSpacing: "3px",
          fontWeight: "bold",
          pointerEvents: "none",
          textTransform: "uppercase",
        }}
      >
        {currentView} view
      </div>

      {isRotating && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            color: "var(--sh-lima)",
            fontWeight: "bold",
            fontSize: "10px",
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
          <div
            style={{
              width: "8px",
              height: "8px",
              background: "var(--sh-lima)",
              borderRadius: "50%",
              animation: "pulse 1.5s infinite",
            }}
          />
          MODO INSPECCIÓN AUTO
        </div>
      )}

      <Canvas shadows gl={{ antialias: true, logarithmicDepthBuffer: true }}>
        <PerspectiveCamera makeDefault fov={40} far={500000} />
        <OrbitControls enableDamping dampingFactor={0.05} makeDefault />
        <CameraController
          view={currentView}
          isRotating={isRotating}
          trajectory={trajectory}
          focusTrigger={focusTrigger}
        />
        <ControlsConfig toolState={toolState} />

        <ambientLight intensity={0.5} />
        <pointLight position={[1000, 1000, 1000]} intensity={1.5} />
        <spotLight
          position={[-500, 1000, 500]}
          angle={0.2}
          penumbra={1}
          intensity={2}
          castShadow
        />
        <Environment preset="night" />

        <Stars
          radius={300}
          depth={60}
          count={1500}
          factor={6}
          saturation={0}
          fade
          speed={1}
        />

        <Grid
          infiniteGrid
          fadeDistance={1200}
          sectionColor="#303045"
          cellColor="#151520"
          sectionSize={100}
          cellSize={10}
          rotation={[Math.PI / 2, 0, 0]}
        />

        <WellborePath
          segments={trajectory}
          isFullscreen={isFullscreen}
          useDLSHeatmap={useDLSHeatmap}
          neutralPoint={results.torqueDrag?.neutralPoint}
        />
        {/* Etiquetas 2D de Ejes Principales (Siempre legibles al hacer zoom) */}
        <Html position={[2000, 0, 0]} center style={{ pointerEvents: "none" }}>
          <div
            style={{
              color: "#ff3e3e",
              fontWeight: 900,
              fontSize: isFullscreen ? "16px" : "14px",
              textShadow: "0 0 4px #000, 0 0 8px #000",
              whiteSpace: "nowrap",
            }}
          >
            East (E) [ft]
          </div>
        </Html>
        <Html position={[0, -2000, 0]} center style={{ pointerEvents: "none" }}>
          <div
            style={{
              color: "#00ff00",
              fontWeight: 900,
              fontSize: isFullscreen ? "16px" : "14px",
              textShadow: "0 0 4px #000, 0 0 8px #000",
              whiteSpace: "nowrap",
            }}
          >
            Depth (TVD) [ft]
          </div>
        </Html>
        <Html position={[0, 0, 2000]} center style={{ pointerEvents: "none" }}>
          <div
            style={{
              color: "#00b4d8",
              fontWeight: 900,
              fontSize: isFullscreen ? "16px" : "14px",
              textShadow: "0 0 4px #000, 0 0 8px #000",
              whiteSpace: "nowrap",
            }}
          >
            North (N) [ft]
          </div>
        </Html>

        {/* Marcadores de Target */}
        {trajectory.length > 0 && (
          <>
            {/* Surface Target */}
            <group position={[0, 0, 0]}>
              <mesh>
                <boxGeometry args={[10, 1, 10]} />
                <meshBasicMaterial color="#ffffff" wireframe />
              </mesh>
              <Text position={[0, 15, 0]} fontSize={6} color="#ffffff">
                SURFACE TARGET
              </Text>
            </group>

            {/* TD Target (Innovación Elite) */}
            {(() => {
              const last = trajectory[trajectory.length - 1];
              const s0 = trajectory[0];
              return (
                <group
                  position={[
                    last.east - s0.east,
                    -last.tvd,
                    last.north - s0.north,
                  ]}
                >
                  {/* Prisma de Luz Objetivo */}
                  <mesh>
                    <boxGeometry args={[18, 18, 18]} />
                    <meshStandardMaterial
                      color="#cbff6a"
                      emissive="#cbff6a"
                      emissiveIntensity={1.5}
                      transparent
                      opacity={0.3}
                      metalness={1}
                      roughness={0}
                    />
                  </mesh>
                  <mesh>
                    <boxGeometry args={[20, 20, 20]} />
                    <meshBasicMaterial
                      color="#cbff6a"
                      wireframe
                      transparent
                      opacity={0.2}
                    />
                  </mesh>

                  {/* Etiqueta Técnica TD */}
                  <Text
                    position={[0, -40, 0]}
                    fontSize={isFullscreen ? 8 : 10}
                    color="#cbff6a"
                    fontWeight={950}
                    textAlign="center"
                    font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
                    outlineWidth={0.5}
                    outlineColor="#000000"
                  >
                    {`TD TARGET\n[ ${(last.north - s0.north).toFixed(0)}N, ${(last.east - s0.east).toFixed(0)}E ]`.toUpperCase()}
                  </Text>
                  <pointLight color="#cbff6a" intensity={2} distance={50} />
                </group>
              );
            })()}
          </>
        )}
        
        {/* Componente de Interacción para detectar clics en la gráfica */}
        <InteractionPlane 
          trajectory={trajectory} 
          setViewIndex={setViewIndex} 
          cycleView={cycleView}
          toolState={toolState}
        />
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

export default Trajectory3D;
