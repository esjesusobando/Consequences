import { describe, expect, it, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDrillingStore } from "../store/drilling-store";
import { useDemoSeed, __resetDemoSeedGuard } from "./useDemoSeed";
import { MOCK_PRIMARY } from "../engine/mock-wells";

/** The 3-point vertical/45° demo stub seeded by store boot (the bug signal). */
const DEMO_STUB = [
  { md: 0, inc: 0, azi: 0 },
  { md: 1000, inc: 0, azi: 0 },
  { md: 2000, inc: 10.5, azi: 90 },
];

describe("useDemoSeed (RC-1 fix)", () => {
  beforeEach(() => {
    __resetDemoSeedGuard();
    // Reproducible cold-boot stub: reset store + recalc the 3-point demo.
    const s = useDrillingStore.getState();
    s.setSurveys(DEMO_STUB);
  });

  it("cold boot stub is a degenerate 3-point trajectory (bug signal)", () => {
    const stub = useDrillingStore.getState().results.directional.trajectory;
    expect(stub).toHaveLength(3);
  });

  it("after hook runs: trajectory promoted to the full 26-station MOCK_PRIMARY", () => {
    const { unmount } = renderHook(() => useDemoSeed());
    const promoted = useDrillingStore.getState().results.directional.trajectory;
    expect(promoted.length).toBe(MOCK_PRIMARY.surveys.length);
    expect(promoted.length).toBe(26);
    unmount();
  });

  it("does NOT re-seed when a real trajectory (>= 10 pts) exists", () => {
    // simulate a real user trajectory already present
    useDrillingStore.setState((prev) => ({
      ...prev,
      results: {
        ...prev.results,
        directional: {
          ...prev.results.directional,
          trajectory: Array.from({ length: 12 }, (_, i) => ({
            md: i * 100, east: i, north: i, tvd: i, inc: 0, azi: 0,
            buildRate: 0, turnRate: 0, dls: 0, cl: 0,
          })),
        },
      },
    }));
    renderHook(() => useDemoSeed());
    const unaffected = useDrillingStore.getState().results.directional.trajectory;
    expect(unaffected).toHaveLength(12);
  });
});
