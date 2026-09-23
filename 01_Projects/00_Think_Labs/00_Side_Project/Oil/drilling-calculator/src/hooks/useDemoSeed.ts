// ============================================================
// useDemoSeed — shared demo-seed hook (RC-1 fix)
//
// Cold-boot fix for the Dashboard 3D view: Trajectory3D never seeded the
// store, so its cold trajectory was the 3-point vertical/45° demo stub
// produced by store boot (→ degenerate 2-segment tube, invisible).
//
// Anticolision.tsx seeded MOCK_PRIMARY inline (AC3D-7). This hook
// centralizes that SAME rule so every 3D view gets the full 26-station
// demo well on cold boot:
//   - seed when the current trajectory is the degenerate demo (< 10 pts)
//   - never touch a user/loaded trajectory (>= 10 pts)
// ============================================================
import { useEffect } from "react";
import { useDrillingStore } from "../store/drilling-store";
import { MOCK_PRIMARY } from "../engine/mock-wells";

// once-per-process guard (survives React strict-mode double-invoke)
let demoSeeded = false;

export function useDemoSeed(): void {
  const setSurveys = useDrillingStore((s) => s.setSurveys);
  // count = number of trajectory points currently rendered
  const trajectoryLength = useDrillingStore(
    (s) => s.results.directional.trajectory.length,
  );

  useEffect(() => {
    if (demoSeeded) return;
    // 3-point demo stub is the bug signal; 26-point MOCK_PRIMARY is the fix.
    if (trajectoryLength >= 10) return;
    demoSeeded = true;
    setSurveys(MOCK_PRIMARY.surveys);
  }, [trajectoryLength, setSurveys]);
}

/** Exposed for tests to reset the once-per-session guard. */
export function __resetDemoSeedGuard(): void {
  demoSeeded = false;
}
