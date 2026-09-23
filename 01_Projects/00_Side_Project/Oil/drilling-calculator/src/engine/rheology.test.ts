// ============================================================
// T-16 (Q-3): Rheology engine regression suite
// Locks F2/F3/F4/F5 + AV + zero-theta guards (Bourgoyne §4)
// ============================================================

import { describe, expect, it } from "vitest";
import { calculateRheology } from "./rheology";
import type { MudData } from "../store/drilling-types";

function makeMud(overrides: Partial<MudData> = {}): MudData {
  return {
    mudWeight: 10.5,
    theta600: 40,
    theta300: 25,
    theta200: 20,
    theta100: 15,
    theta6: 6,
    theta3: 4,
    plasticViscosity: 15,
    yieldPoint: 10,
    gel10sec: 8,
    gel10min: 12,
    rheologyModel: "POWER_LAW",
    ...overrides,
  };
}

describe("rheology engine", () => {
  it("F2: PV = theta600 - theta300 and YP = theta300 - PV (40/25 -> 15/10)", () => {
    const res = calculateRheology(makeMud());
    expect(res.pv).toBe(15);
    expect(res.yp).toBe(10);
  });

  it("F3: n = 3.322 * log10(theta600/theta300) is ~0.678 for 40/25", () => {
    const res = calculateRheology(makeMud());
    expect(res.n_pl).toBeCloseTo(0.678, 2);
  });

  it("F4: K = theta300 / 511^n is finite and > 0 for valid inputs", () => {
    const res = calculateRheology(makeMud());
    expect(Number.isFinite(res.k_pl)).toBe(true);
    expect(res.k_pl).toBeGreaterThan(0);
    expect(res.k_pl).toBeCloseTo(25 / Math.pow(511, res.n_pl), 5);
  });

  it("F5: tau0 = 2*theta3 - theta6 and mu_eff > PV when YP > 0", () => {
    const res = calculateRheology(makeMud());
    expect(res.tau0_hb).toBe(2); // 2*4 - 6
    expect(res.mu_eff).toBeGreaterThan(res.pv);
    expect(res.mu_eff).toBeCloseTo(res.pv + res.yp, 5);
  });

  it("AV: apparent viscosity = theta600 / 2", () => {
    const res = calculateRheology(makeMud());
    expect(res.av).toBe(20);
  });

  it("Triangulation: 60/30 gives PV=30, YP=0, n ~ 1.0", () => {
    const res = calculateRheology(makeMud({ theta600: 60, theta300: 30 }));
    expect(res.pv).toBe(30);
    expect(res.yp).toBe(0);
    expect(res.n_pl).toBeCloseTo(3.322 * Math.log10(2), 2);
  });

  it("Zero-theta guard: theta600=0, theta300=0 emits no NaN (pv clamps >=1, yp=0)", () => {
    const res = calculateRheology(
      makeMud({ theta600: 0, theta300: 0, theta6: 0, theta3: 0 }),
    );
    expect(res.pv).toBe(1);
    expect(res.yp).toBe(0);
    expect(Number.isFinite(res.n_pl)).toBe(true);
    expect(Number.isFinite(res.k_pl)).toBe(true);
    expect(Number.isFinite(res.n_hb)).toBe(true);
    expect(Number.isFinite(res.k_hb)).toBe(true);
    expect(Number.isFinite(res.mu_eff)).toBe(true);
    expect(res.av).toBe(0);
  });

  it("Zero-theta guard triangulation: theta300=0 with theta600>0 stays finite", () => {
    const res = calculateRheology(
      makeMud({ theta600: 20, theta300: 0, theta6: 0, theta3: 0 }),
    );
    expect(Number.isFinite(res.n_pl)).toBe(true);
    expect(Number.isFinite(res.k_pl)).toBe(true);
  });
});
