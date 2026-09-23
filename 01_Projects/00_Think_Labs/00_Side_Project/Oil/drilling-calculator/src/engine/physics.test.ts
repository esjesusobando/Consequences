// ============================================================
// Physics constants & API RP 13D helpers regression suite
// Locks classifyFlowRegime boundaries (2100/4000) and the
// Bingham apparent-viscosity formula.
// ============================================================

import { describe, expect, it } from "vitest";
import {
  classifyFlowRegime,
  calcApparentViscosityBingham,
  RE_LAMINAR_MAX,
  RE_TURBULENT_MIN,
} from "./physics";

describe("classifyFlowRegime (API RP 13D F7 boundaries)", () => {
  it("is Laminar strictly below RE_LAMINAR_MAX", () => {
    expect(classifyFlowRegime(RE_LAMINAR_MAX - 0.01)).toBe("Laminar");
    expect(classifyFlowRegime(2099.99)).toBe("Laminar");
  });

  it("is Transition at exactly RE_LAMINAR_MAX (2100)", () => {
    expect(classifyFlowRegime(2100)).toBe("Transition");
  });

  it("is Transition at exactly RE_TURBULENT_MIN (4000)", () => {
    expect(classifyFlowRegime(4000)).toBe("Transition");
  });

  it("is Turbulent strictly above RE_TURBULENT_MIN", () => {
    expect(classifyFlowRegime(RE_TURBULENT_MIN + 0.01)).toBe("Turbulent");
    expect(classifyFlowRegime(4000.01)).toBe("Turbulent");
  });
});

describe("calcApparentViscosityBingham (API RP 13B-1)", () => {
  it("μ_app at 300 rpm = PV + YP (θ300 = PV + YP)", () => {
    const expected = 23 + 19;
    expect(calcApparentViscosityBingham(23, 19)).toBeCloseTo(expected, 9);
  });

  it("scales linearly with YP", () => {
    const ypDelta = 19;
    expect(calcApparentViscosityBingham(23, 19)).toBeCloseTo(
      23 + ypDelta,
      9,
    );
    expect(calcApparentViscosityBingham(23, 38)).toBeCloseTo(
      23 + 2 * ypDelta,
      9,
    );
  });

  it("matches the documented constants (2100 / 4000)", () => {
    expect(RE_LAMINAR_MAX).toBe(2100);
    expect(RE_TURBULENT_MIN).toBe(4000);
  });
});