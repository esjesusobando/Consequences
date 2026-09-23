- --
title: "Anti-Collision Professional Features — Risk Levels, ISCWSA Thresholds, and Dashboard Patterns"
date: 2026-08-28
category: best-practices
module: anti-collision
problem_type: best_practice
component: tooling
severity: medium
applies_when:
  - "Implementing or consuming anti-collision risk levels across engine and UI boundaries"
  - "Using ISCWSA Separation Factor thresholds in collision avoidance systems"
  - "Building professional drilling fleet management dashboards or risk matrix panels"
tags:
  - anti-collision
  - risk-levels
  - ISCWSA
  - safety-factor
  - ui-patterns
  - drilling-engine
- --

# Anti-Collision Professional Features — Risk Levels, ISCWSA Thresholds, and Dashboard Patterns

## Context

Three cross-cutting lessons emerged from building the AntiCollision3D professional features: a runtime mismatch between engine and UI risk-level enums, the correct ISCWSA Separation Factor thresholds that must not be invented, and the UI patterns essential for fleet-level anti-collision management.

## Guidance

### 1. Risk Level String Mismatch — Verify Enums at the Consumption Boundary

The anti-collision engine (`src/engine/anti-collision.ts`) produces risk levels as the string union `"SAFE" | "MONITOR" | "CAUTION" | "CRITICAL"`. The UI layer previously used its own set: `HIGH`, `MEDIUM`, `LOW`, `NONE`. This caused silent failures — risk colors never rendered, risk labels showed blank, and the risk matrix panel appeared empty despite valid engine output.

* *Root cause:** The engine and UI were developed independently without a shared type contract. Each side defined its own risk-level vocabulary, and there was no compile-time enforcement that they matched.

* *Rule:** Always derive UI enums directly from the engine's exported type. In TypeScript:

```typescript
// anti-collision.ts — engine defines the source of truth
export type RiskLevel = "SAFE" | "MONITOR" | "CAUTION" | "CRITICAL";

// UI consumes it — no redefinition
import type { RiskLevel } from "../../engine/anti-collision";

const RISK_COLORS: Record<RiskLevel, string> = {
  SAFE: "#22c55e",
  MONITOR: "#eab308",
  CAUTION: "#f97316",
  CRITICAL: "#ef4444",
};
```

Never create a parallel enum in the UI layer. If the engine adds a new risk level, the compiler will force every consumer to handle it.

### 2. ISCWSA Separation Factor Thresholds — Use the Standard, Don't Invent

The ISCWSA R-Type Separation Factor (SF) bands are defined by industry consensus (ISCWSA Collision Avoidance Work Group, Oct 2017). The thresholds in `anti-collision.ts:301-305`:

```typescript
// ISCWSA R-type rule bands
const riskLevel =
  sf >= 4.0 ? "SAFE"       // Report threshold — continue monitoring
  : sf >= 1.5 ? "MONITOR"  // Adjust plans before drilling deeper
  : sf >= 1.0 ? "CAUTION"  // Never plan below this
  : "CRITICAL";             // Stop drilling, redesign
```

| SF Range       | Risk Level  | ISCWSA Rule                                          |
|---------------|------------|-----------------------------------------------------|
| SF >= 4.0      | SAFE        | Separation sufficient. Continue monitoring.          |
| 1.5 <= SF < 4.0| MONITOR     | Below report threshold. Control while advancing.     |
| 1.0 <= SF < 1.5| CAUTION     | Adjustment band. Correct plan before drilling deeper.|
| SF < 1.0       | CRITICAL    | Trajectories too close. Redesign required.           |

* *Rule:** Never invent custom thresholds. The ISCWSA standard is the single source of truth. If a stakeholder asks for different bands, document why the standard doesn't fit their scenario before overriding.

### 3. Professional Anti-Collision Features — Risk Matrix + Dashboard Stats

Two UI patterns are essential for fleet-level collision management:

* *Risk Matrix Panel** — A tabular view showing well-pair risk levels at a glance. Each cell maps a primary well against adjacent wells, color-coded by risk level. This is the primary tool for drillers to assess fleet-wide collision exposure before making plan changes.

* *Dashboard Stats** — Summary counters (total wells, critical count, monitor count, clear count) that give instant situational awareness. These belong at the top of the anti-collision section, above the 3D visualization.

* *Pattern reference:** Landmark Compass-style UI — a compact, dense information display where color carries meaning and layout is grid-based. The risk matrix follows this pattern: minimal chrome, maximum data density, color as the primary signal.

```tsx
// Dashboard stats — summary counters at section top
<div className="dashboard-stats">
  <StatCard label="Total Wells" value={wells.length} />
  <StatCard label="Critical" value={criticalCount} color="critical" />
  <StatCard label="Monitor" value={monitorCount} color="monitor" />
  <StatCard label="Clear" value={clearCount} color="safe" />
</div>

// Risk Matrix — grid of well-pair risk levels
<div className="risk-matrix">
  {matrix.map((row, i) => (
    <div key={i} className="risk-matrix-row">
      {row.map((cell, j) => (
        <RiskCell key={j} level={cell.riskLevel} sf={cell.sf} />
      ))}
    </div>
  ))}
</div>
```

These two panels are not optional polish — they are the interface that makes the engine output actionable for fleet management.

## Why This Matters

- **Enum mismatches** cause silent failures that are extremely hard to debug — the engine computes correct values but the UI never renders them. Catching these at compile time via shared types eliminates an entire class of bugs.
- **Invented thresholds** create liability. If an anti-collision system uses non-standard SF bands and a collision occurs, the custom thresholds become evidence of negligence. The ISCWSA standard is the legal safe harbor.
- **Professional UI patterns** (Risk Matrix + Dashboard Stats) transform raw SF numbers into fleet-level situational awareness. Without them, drillers must mentally cross-reference dozens of well pairs — an error-prone process that the 3D view alone doesn't solve.

## When to Apply

- Any time a new risk level or SF band is added to the engine, verify all UI consumers handle it
- When building or modifying anti-collision dashboard views
- When reviewing code that defines risk-related enums or thresholds outside the engine
- When onboarding new team members to the anti-collision module

## Related

- `src/engine/anti-collision.ts` — ISCWSA R-Type engine with SF calculation and risk classification
- `src/components/sections/AntiCollision3D.tsx` — 3D visualization with Risk Matrix panel and Dashboard Stats
- `src/components/sections/Anticolision.tsx` — Multi-well collision matrix view
