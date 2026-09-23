import { calculateWellControl } from "./well-control";
import {
  validateWellInput,
  safeDivide,
  validateNumeric,
  sanitizeEngineInput,
} from "./utils/validation";
import { describe, it, expect } from "vitest";
import type {
  WellData,
  WellControlData,
  VolumetricsResult,
  PumpResult,
} from "../store/drilling-types";

describe("well-control engine", () => {
  it("should calculate correct values with valid input", () => {
    const well: Partial<WellData> = { tvd: 10000 };
    const wcData: Partial<WellControlData> = {
      sidpp: 500,
      sicp: 550,
      pitGain: 5,
      killRateGPM: 300,
      killRatePressure: 300,
      safetyMargin: 100,
      pipeSpeed: 60,
    };
    const mudWeight = 10;
    const volumetrics: Partial<VolumetricsResult> = {
      totalInsideVolume: 100,
      totalAnnularVolume: 500,
    };
    const pump: Partial<PumpResult> = { outputPerStroke: 0.1 };
    const fractureGradientAtShoe = 15;
    const shoeTVD = 8000;

    const result = calculateWellControl(
      well as WellData,
      wcData as WellControlData,
      mudWeight,
      volumetrics as VolumetricsResult,
      pump as PumpResult,
      fractureGradientAtShoe,
      shoeTVD
    );

    expect(result.kmw).toBeGreaterThan(mudWeight);
    expect(result.maasp).toBeGreaterThan(0);
  });

  it("should throw error if shoeTVD is invalid", () => {
    const well: Partial<WellData> = { tvd: 10000 };
    const wcData: Partial<WellControlData> = {
      sidpp: 500,
      killRatePressure: 300,
    };
    const mudWeight = 10;
    const volumetrics: Partial<VolumetricsResult> = {
      totalInsideVolume: 100,
      totalAnnularVolume: 500,
    };
    const pump: Partial<PumpResult> = { outputPerStroke: 0.1 };
    const fractureGradientAtShoe = 15;
    const shoeTVD = 0;

    expect(() =>
      calculateWellControl(
        well as WellData,
        wcData as WellControlData,
        mudWeight,
        volumetrics as VolumetricsResult,
        pump as PumpResult,
        fractureGradientAtShoe,
        shoeTVD
      )
    ).toThrow();
  });
});

// Edge Cases & Integration Tests
describe("Edge Cases & Integration", () => {
  it("should handle zero TVD safely", () => {
    const result = calculateWellControl(
      { tvd: 0 } as WellData,
      { sidpp: 500, killRatePressure: 300, safetyMargin: 100 } as WellControlData,
      10,
      { totalInsideVolume: 100, totalAnnularVolume: 500 } as VolumetricsResult,
      { outputPerStroke: 0.1 } as PumpResult,
      15,
      8000
    );
    expect(result.kmw).toBeGreaterThan(0);
  });

  it("should handle missing optional fields", () => {
    const result = calculateWellControl(
      { tvd: 10000 } as WellData,
      { sidpp: 500 } as WellControlData, // Missing killRatePressure, safetyMargin
      10,
      { totalInsideVolume: 100, totalAnnularVolume: 500 } as VolumetricsResult,
      { outputPerStroke: 0.1 } as PumpResult,
      15,
      8000
    );
    expect(result.icp).toBe(500);
  });
});

// Utilities & Helpers Tests
describe("Utilities & Helpers", () => {
  it("validateNumeric should handle valid values", () => {
    expect(validateNumeric(42)).toBe(42);
    expect(validateNumeric(undefined, 10)).toBe(10);
    expect(validateNumeric(null, 20)).toBe(20);
    expect(validateNumeric(NaN, 30)).toBe(30);
  });

  it("safeDivide should handle zero denominator", () => {
    expect(safeDivide(10, 2)).toBe(5);
    expect(safeDivide(10, 0, 999)).toBe(999);
    expect(safeDivide(10, 0)).toBe(0);
  });

  it("sanitizeEngineInput should handle edge cases", () => {
    expect(sanitizeEngineInput.diameter(0)).toBe(0.0001);
    expect(sanitizeEngineInput.fluidDensity(-10)).toBe(0.1);
    expect(sanitizeEngineInput.depth(-100)).toBe(0);
    expect(sanitizeEngineInput.rheology(-5)).toBe(0);
  });

  it("validateWellInput should collect multiple errors", () => {
    const result = validateWellInput({
      mudWeight: 0,
      sidpp: 500,
      shoeTVD: 0,
      fractureGradientAtShoe: 0,
      safetyMargin: 100,
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
  });
});
