import { describe, it, expect } from "vitest";
import {
  calculateSurgeSwab,
  type SurgeSwabParams,
  type SurgeSwabResult,
} from "./surge-swab";

const BASE_PARAMS: SurgeSwabParams = {
  mudWeight: 10.5, // ppg
  plasticViscosity: 23, // cP
  yieldPoint: 19, // lb/100ft^2
  holeDiameter: 12.25, // in
  pipeDiameter: 5.0, // in
  pipeVelocity: 90, // ft/min
  pipeLength: 7200, // ft
};

const NUMERIC_FIELDS: (keyof SurgeSwabResult)[] = [
  "surgePressure",
  "swabPressure",
  "ecdSurge",
  "ecdSwab",
  "effectiveAnnularVelocity",
  "pipeSpeed",
];

describe("surge-swab engine", () => {
  it("S-1: accepts exactly one object parameter", () => {
    const result = calculateSurgeSwab(BASE_PARAMS);
    expect(result).toBeDefined();
  });

  it("S-2: returns all 8 fields populated and finite", () => {
    const result = calculateSurgeSwab({ ...BASE_PARAMS });

    for (const field of NUMERIC_FIELDS) {
      expect(result[field]).toBeDefined();
      expect(Number.isFinite(result[field])).toBe(true);
    }

    expect(result.modelUsed).toBeDefined();
    expect(result.modelUsed.length).toBeGreaterThan(0);
    expect(["Laminar", "Turbulent", "Transition"]).toContain(
      result.flowRegimeSurge,
    );

    // Ordering: surge adds ECD, swab reduces it
    expect(result.ecdSurge).toBeGreaterThanOrEqual(BASE_PARAMS.mudWeight);
    expect(result.ecdSwab).toBeLessThanOrEqual(BASE_PARAMS.mudWeight);
    expect(result.surgePressure).toBeGreaterThanOrEqual(0);
    expect(result.swabPressure).toBeLessThanOrEqual(0);
    expect(result.pipeSpeed).toBe(BASE_PARAMS.pipeVelocity);
  });

  it("S-1: swab pressure sign contract — surge >= 0, swab <= 0, ECDs bracket mud weight", () => {
    const result = calculateSurgeSwab({ ...BASE_PARAMS });

    expect(result.surgePressure).toBeGreaterThanOrEqual(0);
    expect(result.swabPressure).toBeLessThanOrEqual(0);
    expect(result.ecdSurge).toBeGreaterThan(BASE_PARAMS.mudWeight);
    expect(result.ecdSwab).toBeLessThan(BASE_PARAMS.mudWeight);
    expect(result.ecdSurge - result.ecdSwab).toBeGreaterThan(0);
  });

  it("F10: surge and swab magnitudes are symmetric (same magnitude, opposite sign)", () => {
    const result = calculateSurgeSwab({ ...BASE_PARAMS });
    expect(result.surgePressure).toBeCloseTo(-result.swabPressure, 5);
  });

  it("F11: ECDs are symmetric about mudWeight", () => {
    const result = calculateSurgeSwab({ ...BASE_PARAMS });
    expect(result.ecdSurge - BASE_PARAMS.mudWeight).toBeCloseTo(
      BASE_PARAMS.mudWeight - result.ecdSwab,
      4,
    );
  });

  it("F12: effective annular velocity follows Burkhardt v_ann = v·Dp²/(Dh²−Dp²)", () => {
    const result = calculateSurgeSwab({ ...BASE_PARAMS });
    const expected =
      (BASE_PARAMS.pipeVelocity * BASE_PARAMS.pipeDiameter ** 2) /
      (BASE_PARAMS.holeDiameter ** 2 - BASE_PARAMS.pipeDiameter ** 2);
    expect(result.effectiveAnnularVelocity).toBeCloseTo(expected, 2);
  });

  it("S-5: surge pressure and ecdSurge increase monotonically with pipeVelocity", () => {
    const slow = calculateSurgeSwab({ ...BASE_PARAMS, pipeVelocity: 60 });
    const fast = calculateSurgeSwab({ ...BASE_PARAMS, pipeVelocity: 120 });

    expect(fast.surgePressure).toBeGreaterThan(slow.surgePressure);
    expect(fast.swabPressure).toBeLessThan(slow.swabPressure);
    expect(fast.ecdSurge).toBeGreaterThan(slow.ecdSurge);
    expect(fast.ecdSwab).toBeLessThan(slow.ecdSwab);
  });

  it("S-5: zero-velocity equilibrium — no dynamic pressure, ECDs equal mud weight", () => {
    const result = calculateSurgeSwab({ ...BASE_PARAMS, pipeVelocity: 0 });

    expect(result.surgePressure).toBe(0);
    expect(result.swabPressure).toBe(0);
    expect(result.ecdSurge).toBe(BASE_PARAMS.mudWeight);
    expect(result.ecdSwab).toBe(BASE_PARAMS.mudWeight);
    expect(result.effectiveAnnularVelocity).toBe(0);
  });

  it("S-6: annulus collapse (Dh <= Dp) is clamped — all fields finite, ordering holds", () => {
    const result = calculateSurgeSwab({
      ...BASE_PARAMS,
      holeDiameter: 5,
      pipeDiameter: 8,
    });

    for (const field of NUMERIC_FIELDS) {
      expect(Number.isFinite(result[field])).toBe(true);
    }
    expect(["Laminar", "Turbulent", "Transition"]).toContain(
      result.flowRegimeSurge,
    );
    expect(result.effectiveAnnularVelocity).toBeGreaterThanOrEqual(0);
    expect(result.ecdSurge).toBeGreaterThanOrEqual(BASE_PARAMS.mudWeight);
    expect(result.ecdSwab).toBeLessThanOrEqual(BASE_PARAMS.mudWeight);
  });

  it("S-6: zero PV / zero YP / zero pipeLength emit no NaN or Infinity", () => {
    const result = calculateSurgeSwab({
      ...BASE_PARAMS,
      plasticViscosity: 0,
      yieldPoint: 0,
      pipeLength: 0,
    });

    for (const field of NUMERIC_FIELDS) {
      expect(Number.isFinite(result[field])).toBe(true);
    }
  });

  it("F7: flow regime is Laminar for high viscosity and low speed", () => {
    const result = calculateSurgeSwab({
      ...BASE_PARAMS,
      plasticViscosity: 200,
      yieldPoint: 200,
      pipeVelocity: 10,
    });
    expect(result.flowRegimeSurge).toBe("Laminar");
  });

  it("F7: flow regime is Turbulent for default parameters", () => {
    const result = calculateSurgeSwab({ ...BASE_PARAMS });
    expect(result.flowRegimeSurge).toBe("Turbulent");
  });
});
