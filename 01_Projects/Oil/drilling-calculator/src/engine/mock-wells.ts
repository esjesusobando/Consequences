import type { SurveyRecord } from "../store/drilling-types";
import type { AdjacentWellInput } from "./anti-collision";

export interface WellPreset {
  id: string;
  name: string;
  description: string;
  surveys: SurveyRecord[];
  wellheadNorth: number;
  wellheadEast: number;
  tool: "MWD" | "GYRO" | "SENSOR";
}

/**
 * Primary well preset — vertical build to 10,000 ft MD with a 15° build
 * trajectory from surface (MD 0-10000, ~27 survey points). Used as the
 * auto-seed when the store starts empty.
 */
export const MOCK_PRIMARY: WellPreset = {
  id: "primary",
  name: "Pozo Principal",
  description: "Trayectoria primaria vertical → 15° build a 10,000 ft",
  surveys: (() => {
    const pts: SurveyRecord[] = [];
    const totalMd = 10000;
    const step = 400;
    for (let md = 0; md <= totalMd; md += step) {
      const buildStartMd = 6000;
      const buildRate = 15; // degrees per 100 ft
      let inc = 0;
      if (md >= buildStartMd) {
        inc = ((md - buildStartMd) / 100) * buildRate;
        if (inc > 60) inc = 60;
      }
      pts.push({ md, inc, azi: 90 });
    }
    return pts;
  })(),
  wellheadNorth: 0,
  wellheadEast: 0,
  tool: "MWD",
};

export const MOCK_WELLS: WellPreset[] = [
  {
    id: "offset-north-300",
    name: "Pozo Adyacente Norte",
    description: "Offset de 300 ft al norte — escenario de prueba seguro",
    surveys: [
      { md: 0, inc: 0, azi: 0 },
      { md: 1000, inc: 8, azi: 90 },
      { md: 2000, inc: 18, azi: 95 },
      { md: 3500, inc: 30, azi: 100 },
      { md: 5000, inc: 40, azi: 105 },
      { md: 7500, inc: 55, azi: 110 },
    ],
    wellheadNorth: 300,
    wellheadEast: 0,
    tool: "MWD",
  },
  {
    id: "offset-crossing",
    name: "Pozo Cruzado Crítico",
    description: "Cruce diagonal que interseca el pozo principal — escenario CRÍTICO",
    surveys: [
      { md: 0, inc: 0, azi: 45 },
      { md: 1000, inc: 15, azi: 225 },
      { md: 2000, inc: 28, azi: 225 },
      { md: 3500, inc: 45, azi: 225 },
      { md: 5000, inc: 60, azi: 225 },
      { md: 7500, inc: 75, azi: 225 },
    ],
    wellheadNorth: 500,
    wellheadEast: 500,
    tool: "GYRO",
  },
  {
    id: "offset-south-250",
    name: "Pozo Sur Offset",
    description: "Offset de 250 ft al sur con azimuth contrario",
    surveys: [
      { md: 0, inc: 0, azi: 0 },
      { md: 1500, inc: 12, azi: 270 },
      { md: 3000, inc: 22, azi: 265 },
      { md: 5000, inc: 35, azi: 260 },
      { md: 7000, inc: 50, azi: 255 },
    ],
    wellheadNorth: -250,
    wellheadEast: 0,
    tool: "MWD",
  },
  {
    id: "offset-east-near",
    name: "Cerca Este (Monitor)",
    description: "Trayectoria cercana al este — banda de MONITOR",
    surveys: [
      { md: 0, inc: 0, azi: 0 },
      { md: 2000, inc: 25, azi: 300 },
      { md: 4000, inc: 35, azi: 310 },
      { md: 6000, inc: 45, azi: 320 },
      { md: 8000, inc: 65, azi: 330 },
    ],
    wellheadNorth: 0,
    wellheadEast: 1200,
    tool: "SENSOR",
  },
  {
    id: "deep-vertical",
    name: "Pozo Vertical Profundo",
    description: "Pozo vertical a gran profundidad — SAFE de referencia",
    surveys: [
      { md: 0, inc: 0, azi: 0 },
      { md: 5000, inc: 0, azi: 0 },
      { md: 10000, inc: 0, azi: 0 },
      { md: 15000, inc: 0, azi: 0 },
    ],
    wellheadNorth: 1000,
    wellheadEast: 800,
    tool: "MWD",
  },
  // Additional wells for expanded multi-well visualization (E4: palette extension)
  {
    id: "offset-west-200",
    name: "Pozo Oeste Cercano",
    description: "Offset de 200 ft al oeste — posición lateral opuesta",
    surveys: [
      { md: 0, inc: 0, azi: 0 },
      { md: 1000, inc: 10, azi: 270 },
      { md: 2000, inc: 20, azi: 265 },
      { md: 3500, inc: 35, azi: 250 },
      { md: 5000, inc: 50, azi: 240 },
    ],
    wellheadNorth: 0,
    wellheadEast: -200,
    tool: "MWD",
  },
  {
    id: "offset-northeast-600",
    name: "Pozo Noreste Distante",
    description: "Offset combinado noreste — amplia dispersión del pozo principal",
    surveys: [
      { md: 0, inc: 0, azi: 0 },
      { md: 1000, inc: 15, azi: 45 },
      { md: 2000, inc: 28, azi: 50 },
      { md: 3500, inc: 40, azi: 55 },
      { md: 5000, inc: 55, azi: 60 },
    ],
    wellheadNorth: 400,
    wellheadEast: 600,
    tool: "GYRO",
  },
  {
    id: "offset-northwest-400",
    name: "Pozo Noroeste Distante",
    description: "Offset combinado noroeste — dispersión simétrica opuesta",
    surveys: [
      { md: 0, inc: 0, azi: 0 },
      { md: 1000, inc: 12, azi: 315 },
      { md: 2000, inc: 25, azi: 320 },
      { md: 3500, inc: 38, azi: 325 },
      { md: 5000, inc: 52, azi: 330 },
    ],
    wellheadNorth: 400,
    wellheadEast: -400,
    tool: "MWD",
  },
  {
    id: "far-north-800",
    name: "Pozo Muy al Norte",
    description: "Gran offset norte — prueba de framing de cámara amplia",
    surveys: [
      { md: 0, inc: 0, azi: 0 },
      { md: 2000, inc: 20, azi: 90 },
      { md: 4000, inc: 35, azi: 95 },
      { md: 6000, inc: 50, azi: 100 },
      { md: 8000, inc: 65, azi: 105 },
    ],
    wellheadNorth: 800,
    wellheadEast: 0,
    tool: "MWD",
  },
  {
    id: "far-east-1500",
    name: "Pozo Muy al Este",
    description: "Gran offset este — testing horizontal dispersion",
    surveys: [
      { md: 0, inc: 0, azi: 0 },
      { md: 2000, inc: 15, azi: 300 },
      { md: 4000, inc: 28, azi: 310 },
      { md: 6000, inc: 45, azi: 320 },
      { md: 8000, inc: 60, azi: 330 },
    ],
    wellheadNorth: 0,
    wellheadEast: 1500,
    tool: "SENSOR",
  },
];

export const getPresetAsAdjacent = (preset: WellPreset): AdjacentWellInput => ({
  id: preset.id,
  name: preset.name,
  surveys: preset.surveys,
  wellheadNorth: preset.wellheadNorth,
  wellheadEast: preset.wellheadEast,
  tool: preset.tool,
});
