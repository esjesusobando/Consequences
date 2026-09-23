/**
 * Edge Cases & Integration Tests for Well Control Engine
 * Tests production failures, happy paths, utilities, and helpers
 */

import { calculateWellControl } from "./well-control";
import { validateWellInput, safeDivide, validateNumeric, sanitizeEngineInput } from "./utils/validation";
import { describe, it, expect, beforeEach } from "vitest";

// ═════════════════════════════════════════════════════════════════
// Edge Cases: Division by Zero and Invalid Inputs
// ═════════════════════════════════════════════════════════════════

describe("Edge Cases: Division by Zero Protection", () => {
  it("should handle zero TVD gracefully (defaults to 1)", () => {
    const well = { tvd: 0 };
    const wcData = { sidpp: 500, killRatePressure: 300, safetyMargin: 100 };
    const result = calculateWellControl(
      well as any,
      wcData,
      10,
      { totalInsideVolume: 100, totalAnnularVolume: 500 } as any,
      { outputPerStroke: 0.1 } as any,
      15,
      8000
    );
    expect(result.kmw).toBeGreaterThan(0);
  });

  it("should handle zero mud weight (throws error)", () => {
    expect(() =>
      calculateWellControl(
        { tvd: 10000 } as any,
        { sidpp: 500, killRatePressure: 300 } as any,
        0, // Zero mud weight
        { totalInsideVolume: 100, totalAnnularVolume: 500 } as any,
        { outputPerStroke: 0.1 } as any,
        15,
        8000
      )
    ).toThrow("mudWeight must be positive");
  });

  it("should handle zero shoeTVD (throws error)", () => {
    expect(() =>
      calculateWellControl(
        { tvd: 10000 } as any,
        { sidpp: 500, killRatePressure: 300 } as any,
        10,
        { totalInsideVolume: 100, totalAnnularVolume: 500 } as any,
        { outputPerStroke: 0.1 } as any,
        15,
        0 // Zero shoeTVD
      )
    ).toThrow("shoeTVD must be positive");
  });

  it("should handle zero pump output (defaults to 0.1)", () => {
    const result = calculateWellControl(
      { tvd: 10000 } as any,
      { sidpp: 500, killRatePressure: 300 } as any,
      10,
      { totalInsideVolume: 100, totalAnnularVolume: 500 } as any,
      { outputPerStroke: 0 }, // Zero pump output
      15,
      8000
    );
    // Code defaults to 0.1 if outputPerStroke is 0
    // strokesToBit = 100 / 0.1 = 1000
    expect(result.strokesToBit).toBe(1000);
  });

  it("should handle zero fracture gradient (throws error)", () => {
    expect(() =>
      calculateWellControl(
        { tvd: 10000 } as any,
        { sidpp: 500, killRatePressure: 300 } as any,
        10,
        { totalInsideVolume: 100, totalAnnularVolume: 500 } as any,
        { outputPerStroke: 0.1 } as any,
        0, // Zero fracture gradient
        8000
      )
    ).toThrow("fractureGradientAtShoe must be positive");
  });
});

// ═════════════════════════════════════════════════════════════════
// Edge Cases: Production Failures (From Past Issues)
// ═════════════════════════════════════════════════════════════════

describe("Edge Cases: Production Failures", () => {
  it("should handle null/undefined well data gracefully", () => {
    const result = calculateWellControl(
      {} as any, // Empty well object
      { 
        sidpp: 500, 
        sicp: 550,
        pitGain: 5,
        killRateGPM: 300,
        killRatePressure: 300, 
        safetyMargin: 100,
        pipeSpeed: 60
      } as any,
      10,
      { totalInsideVolume: 100, totalAnnularVolume: 500 } as any,
      { outputPerStroke: 0.1, flowRateGPM: 300, flowRateBBLmin: 11.9, hydraulicHP: 100 } as any,
      15,
      8000
    );
    expect(result.kmw).toBeGreaterThan(0);
  });

  it("should handle missing optional fields in wcData", () => {
    const result = calculateWellControl(
      { tvd: 10000 } as any,
      { 
        sidpp: 500, 
        sicp: 550,
        pitGain: 5,
        killRateGPM: 300,
        killRatePressure: 0, // Zero killRatePressure
        safetyMargin: 0,
        pipeSpeed: 60
      } as any,
      10,
      { totalInsideVolume: 100, totalAnnularVolume: 500 } as any,
      { outputPerStroke: 0.1, flowRateGPM: 300, flowRateBBLmin: 11.9, hydraulicHP: 100 } as any,
      15,
      8000
    );
    expect(result.icp).toBe(500); // Only SIDPP
    expect(result.fcp).toBe(0); // No killRatePressure
  });

  it("should handle negative values safely", () => {
    const result = calculateWellControl(
      { tvd: 10000 } as any,
      { 
        sidpp: -500, 
        sicp: 550,
        pitGain: 5,
        killRateGPM: 300,
        killRatePressure: 300,
        safetyMargin: 100,
        pipeSpeed: 60
      } as any, // Negative SIDPP
      10,
      { totalInsideVolume: 100, totalAnnularVolume: 500 } as any,
      { outputPerStroke: 0.1, flowRateGPM: 300, flowRateBBLmin: 11.9, hydraulicHP: 100 } as any,
      15,
      8000
    );
    // Should handle negative values without crashing
    expect(result.kmw).toBeGreaterThan(0);
  });

  it("should handle very large numbers", () => {
    const result = calculateWellControl(
      { tvd: 100000 } as any, // Very deep well
      {
        sidpp: 5000,
        sicp: 5500,
        pitGain: 50,
        killRateGPM: 300,
        killRatePressure: 3000,
        safetyMargin: 100,
        pipeSpeed: 60
      } as any,
      15, // Mud weight ppg (realistic)
      { totalInsideVolume: 10000, totalAnnularVolume: 50000 } as any,
      { outputPerStroke: 0.5, flowRateGPM: 300, flowRateBBLmin: 11.9, hydraulicHP: 100 } as any,
      17.3, // Fracture gradient ~0.9 psi/ft converted to ppg equivalent (~17.3 ppg)
      80000
    );
    expect(result.kmw).toBeGreaterThan(0);
    expect(result.maasp).toBeGreaterThan(0);
  });
});

// ═════════════════════════════════════════════════════════════════
// Happy Paths: Simple Functions
// ═════════════════════════════════════════════════════════════════

describe("Happy Paths: Simple Functions", () => {
  describe("validateNumeric", () => {
    it("should return value when valid", () => {
      expect(validateNumeric(42)).toBe(42);
      expect(validateNumeric(0)).toBe(0);
      expect(validateNumeric(-5)).toBe(-5);
    });

    it("should return default when undefined", () => {
      expect(validateNumeric(undefined, 10)).toBe(10);
    });

    it("should return default when null", () => {
      expect(validateNumeric(null, 20)).toBe(20);
    });

    it("should return default when NaN", () => {
      expect(validateNumeric(NaN, 30)).toBe(30);
    });

    it("should return 0 as default when not specified", () => {
      expect(validateNumeric(undefined)).toBe(0);
    });
  });

  describe("safeDivide", () => {
    it("should divide normally", () => {
      expect(safeDivide(10, 2)).toBe(5);
    });

    it("should return fallback when dividing by zero", () => {
      expect(safeDivide(10, 0, 999)).toBe(999);
    });

    it("should return fallback when dividing by NaN", () => {
      expect(safeDivide(10, NaN, 999)).toBe(999);
    });

    it("should return 0 as default fallback", () => {
      expect(safeDivide(10, 0)).toBe(0);
    });
  });

  describe("sanitizeEngineInput", () => {
    it("should sanitize diameter values", () => {
      expect(sanitizeEngineInput.diameter(0)).toBe(0.0001);
      expect(sanitizeEngineInput.diameter(-5)).toBe(0.0001);
      expect(sanitizeEngineInput.diameter(10)).toBe(10);
      expect(sanitizeEngineInput.diameter(undefined as any)).toBe(0.0001);
    });

    it("should sanitize fluid density values", () => {
      expect(sanitizeEngineInput.fluidDensity(0)).toBe(0.1);
      expect(sanitizeEngineInput.fluidDensity(-10)).toBe(0.1);
      expect(sanitizeEngineInput.fluidDensity(10)).toBe(10);
    });

    it("should sanitize depth values", () => {
      expect(sanitizeEngineInput.depth(-100)).toBe(0);
      expect(sanitizeEngineInput.depth(0)).toBe(0);
      expect(sanitizeEngineInput.depth(1000)).toBe(1000);
    });

    it("should sanitize rheology values", () => {
      expect(sanitizeEngineInput.rheology(-5)).toBe(0);
      expect(sanitizeEngineInput.rheology(0)).toBe(0);
      expect(sanitizeEngineInput.rheology(50)).toBe(50);
    });
  });
});

// ═════════════════════════════════════════════════════════════════
// Integration Tests: Well Control Logic
// ═════════════════════════════════════════════════════════════════

describe("Integration: Well Control Logic", () => {
  let validWell: any;
  let validWcData: any;
  let validVolumetrics: any;
  let validPump: any;

  beforeEach(() => {
    validWell = { tvd: 10000 };
    validWcData = {
      sidpp: 500,
      sicp: 550,
      pitGain: 5,
      killRateGPM: 300,
      killRatePressure: 300,
      safetyMargin: 100,
      pipeSpeed: 60,
    };
    validVolumetrics = { totalInsideVolume: 100, totalAnnularVolume: 500 };
    validPump = { 
      outputPerStroke: 0.1,
      flowRateGPM: 300,
      flowRateBBLmin: 11.9,
      hydraulicHP: 100
    };
  });

  it("should calculate correct KMW (Kill Mud Weight)", () => {
    const result = calculateWellControl(
      validWell,
      validWcData,
      10,
      validVolumetrics,
      validPump,
      15,
      8000
    );
    // KMW = MW + SIDPP / (0.052 * TVD) + SafetyMargin / (0.052 * TVD)
    // = 10 + 500 / (0.052 * 10000) + 100 / (0.052 * 10000)
    expect(result.kmw).toBeGreaterThan(10);
    expect(result.kmw).toBeLessThan(12);
  });

  it("should calculate correct ICP (Initial Circulating Pressure)", () => {
    const result = calculateWellControl(
      validWell,
      validWcData,
      10,
      validVolumetrics,
      validPump,
      15,
      8000
    );
    // ICP = SIDPP + SCR
    expect(result.icp).toBe(800); // 500 + 300
  });

  it("should calculate correct FCP (Final Circulating Pressure)", () => {
    const result = calculateWellControl(
      validWell,
      validWcData,
      10,
      validVolumetrics,
      validPump,
      15,
      8000
    );
    // FCP = SCR * (KMW / MW)
    // KMW = 10 + (500 / (0.052 * 10000)) + (100 / (0.052 * 10000)) = 10 + 0.96 + 0.19 = 11.15
    // Code uses Math.ceil(KMW * 10) / 10 = ceil(11.15 * 10) / 10 = ceil(111.5) / 10 = 112 / 10 = 11.2
    // FCP = 300 * (11.2 / 10) = 336
    expect(result.fcp).toBeCloseTo(336, 0);
  });

  it("should calculate correct MAASP", () => {
    const result = calculateWellControl(
      validWell,
      validWcData,
      10,
      validVolumetrics,
      validPump,
      15,
      8000
    );
    // MAASP = (Fracture Gradient [psi/ft] - Mud Weight Gradient [psi/ft]) * Shoe TVD + SafetyMargin
    // Standard FG at shoe ≈ 0.7-0.8 psi/ft (≈13.5-15.5 ppg equivalent)
    // Using FG = 0.78 psi/ft (≈15 ppg equivalent), MW = 10 ppg (0.52 psi/ft)
    // MAASP = (0.78 - 0.52) * 8000 + 100 = 0.26 * 8000 + 100 = 2180
    expect(result.maasp).toBeCloseTo(2180, 0);
  });

  it("should generate step-down schedule", () => {
    const result = calculateWellControl(
      validWell,
      validWcData,
      10,
      validVolumetrics,
      validPump,
      15,
      8000
    );
    expect(result.stepDownSchedule).toHaveLength(11); // 0 to 10 inclusive
    expect(result.stepDownSchedule[0].pressure).toBeCloseTo(result.icp, 0);
    expect(result.stepDownSchedule[10].pressure).toBeGreaterThanOrEqual(result.fcp - 2);
  });

  it("should handle zero SIDPP (normal pressure well)", () => {
    const result = calculateWellControl(
      validWell,
      { ...validWcData, sidpp: 0 },
      10,
      validVolumetrics,
      validPump,
      15,
      8000
    );
    expect(result.icp).toBe(300); // Only SCR
    expect(result.kmw).toBeCloseTo(10.19, 1); // MW + safety margin only
  });
});

// ═════════════════════════════════════════════════════════════════
// Utilities & Helpers Tests
// ═════════════════════════════════════════════════════════════════

describe("Utilities & Helpers", () => {
  it("validateWellInput should pass valid input", () => {
    const result = validateWellInput({
      mudWeight: 10,
      sidpp: 500,
      shoeTVD: 8000,
      fractureGradientAtShoe: 15,
      safetyMargin: 100,
    });
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("validateWellInput should reject zero mudWeight", () => {
    const result = validateWellInput({
      mudWeight: 0,
      sidpp: 500,
      shoeTVD: 8000,
      fractureGradientAtShoe: 15,
      safetyMargin: 100,
    });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("mudWeight must be positive");
  });

  it("validateWellInput should reject zero shoeTVD", () => {
    const result = validateWellInput({
      mudWeight: 10,
      sidpp: 500,
      shoeTVD: 0,
      fractureGradientAtShoe: 15,
      safetyMargin: 100,
    });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("shoeTVD must be positive");
  });

  it("validateWellInput should reject zero fractureGradientAtShoe", () => {
    const result = validateWellInput({
      mudWeight: 10,
      sidpp: 500,
      shoeTVD: 8000,
      fractureGradientAtShoe: 0,
      safetyMargin: 100,
    });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("fractureGradientAtShoe must be positive");
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
