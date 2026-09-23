// ============================================================
// T-21 (Q-3): Volumetrics engine regression suite
// Locks F8 (capacity = ID^2/1029.4) + volume conservation
// ============================================================

import { describe, expect, it } from "vitest";
import { calculateVolumes } from "./volumetrics";
import type { WellData } from "../store/drilling-types";

const CAP = 1029.4; // bbl/ft constant

function makeWell(overrides: Partial<WellData> = {}): WellData {
  return {
    totalDepth: 10000,
    tvd: 9500,
    holeSize: 12.25,
    drillPipeOD: 5,
    drillPipeID: 4,
    drillPipeLength: 8000,
    hwdpOD: 5,
    hwdpID: 3,
    hwdpLength: 1500,
    dcOD: 8,
    dcID: 3,
    dcLength: 500,
    bitSize: 12.25,
    bitNozzles: [13, 13, 13],
    ...overrides,
  };
}

describe("volumetrics engine", () => {
  it("F8: hole/pipe capacities = ID^2 / 1029.4 (bbl/ft)", () => {
    const res = calculateVolumes(makeWell());
    expect(res.holeCapacity).toBeCloseTo(12.25 ** 2 / CAP, 5);
    expect(res.drillPipeCapacity).toBeCloseTo(4 ** 2 / CAP, 5);
    expect(res.hwdpCapacity).toBeCloseTo(3 ** 2 / CAP, 5);
    expect(res.dcCapacity).toBeCloseTo(3 ** 2 / CAP, 5);
  });

  it("F8: annular capacities = (holeSize^2 - OD^2) / 1029.4", () => {
    const res = calculateVolumes(makeWell());
    expect(res.annularDP).toBeCloseTo((12.25 ** 2 - 5 ** 2) / CAP, 5);
    expect(res.annularHWDP).toBeCloseTo((12.25 ** 2 - 5 ** 2) / CAP, 5);
    expect(res.annularDC).toBeCloseTo((12.25 ** 2 - 8 ** 2) / CAP, 5);
  });

  it("F8: displacements = (OD^2 - ID^2) / 1029.4", () => {
    const res = calculateVolumes(makeWell());
    expect(res.displacementDP).toBeCloseTo((5 ** 2 - 4 ** 2) / CAP, 5);
    expect(res.displacementHWDP).toBeCloseTo((5 ** 2 - 3 ** 2) / CAP, 5);
    expect(res.displacementDC).toBeCloseTo((8 ** 2 - 3 ** 2) / CAP, 5);
  });

  it("Volume conservation: totalSystem = totalInside + totalAnnular", () => {
    const res = calculateVolumes(makeWell());
    expect(res.totalSystemVolume).toBeCloseTo(res.totalInsideVolume + res.totalAnnularVolume, 5);
  });

  it("Inside volumes = length * capacity for each string section", () => {
    const res = calculateVolumes(makeWell());
    expect(res.volumeInsideDP).toBeCloseTo(8000 * (16 / CAP), 3);
    expect(res.volumeInsideHWDP).toBeCloseTo(1500 * (9 / CAP), 3);
    expect(res.volumeInsideDC).toBeCloseTo(500 * (9 / CAP), 3);
    expect(res.totalInsideVolume).toBeCloseTo(res.volumeInsideDP + res.volumeInsideHWDP + res.volumeInsideDC, 5);
  });

  it("Annular volumes = length * annular capacity per section", () => {
    const res = calculateVolumes(makeWell());
    expect(res.volumeAnnularDP).toBeCloseTo(8000 * ((12.25 ** 2 - 5 ** 2) / CAP), 3);
    expect(res.volumeAnnularDC).toBeCloseTo(500 * ((12.25 ** 2 - 8 ** 2) / CAP), 3);
    expect(res.totalAnnularVolume).toBeCloseTo(
      res.volumeAnnularDP + res.volumeAnnularHWDP + res.volumeAnnularDC,
      5,
    );
  });

  it("F8 triangulation: hole capacity : DP capacity = holeSize^2 : ID^2", () => {
    const res = calculateVolumes(makeWell());
    expect(res.holeCapacity / res.drillPipeCapacity).toBeCloseTo(12.25 ** 2 / 4 ** 2, 5);
  });

  it("Open hole: only the depth beyond the string length counts", () => {
    // string = 8000 + 1500 + 500 = 10000 -> no open hole
    expect(calculateVolumes(makeWell()).openHoleVolume).toBeCloseTo(0, 5);
    // totalDepth 12000 -> 2000 ft of open hole below the string
    const open = calculateVolumes(makeWell({ totalDepth: 12000 }));
    expect(open.openHoleVolume).toBeCloseTo(2000 * (12.25 ** 2 / CAP), 3);
  });

  it("Circulation time fields start zeroed (owned by circulation engine)", () => {
    const res = calculateVolumes(makeWell());
    expect(res.surfaceToBitTime).toBe(0);
    expect(res.bottomsUpTime).toBe(0);
    expect(res.totalCirculationTime).toBe(0);
  });
});
