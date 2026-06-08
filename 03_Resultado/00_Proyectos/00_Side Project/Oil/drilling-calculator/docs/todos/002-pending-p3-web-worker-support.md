---
status: pending
priority: p3
issue_id: 002
tags: ["code-review", "performance", "optimization"]
dependencies: []
---

# Problem Statement

Engineering calculations run on the main UI thread during every `useEffect` trigger in `App.tsx`. While current performance is acceptable for basic calculations, future "Phase 2" features (Monte Carlo simulations, trajectory planning) will block the UI.

# Findings

- `orchestrator.ts` executes synchronous math.
- Complex loops (e.g., iterative solvers) will freeze the UI.

# Proposed Solutions

## Option 1: Web Workers (Recommended)

- Offload `orchestrator.ts` execution to a Web Worker.
- Use `comlink` or `worker-loader`.
- **Pros**: Non-blocking UI.
- **Cons**: Complexity in state synchronization.
- **Effort**: Medium.

## Option 2: Time Slicing (Current default)

- Use `requestIdleCallback` or breaking up loops.
- **Pros**: Simpler.
- **Cons**: Still main thread.

# Recommended Action

Implement Option 1 (Web Workers) when Phase 2 starts.

# Technical Details

- Extract logic into `worker.ts`.
- Use `postMessage` for communication.

# Acceptance Criteria

- [ ] Heavy calculations do not drop frames.
- [ ] UI remains responsive during simulation.

# Work Log

- 2026-02-10: Identified for future scaling.
