- --
title: "Vitest forks pool timeout on heavy jsdom suites (worker-start failure)"
category: test-failures
date: 2026-08-08
tags: [vitest, jsdom, worker-pool, flaky-ci, threads-pool]
severity: medium
status: resolved
component: testing_framework
related_files:
  - src/components/sections/CuttingsTransportSection.test.tsx
  - src/components/visuals/DynamicTwinWindow.test.tsx
  - src/hooks/useToolManager.test.ts
related_docs:
  - ../todos/001-pending-p2-missing-automated-tests.md
prevention_rules:
  - "Use --pool=threads for suites with heavy jsdom/UI setup; reserve forks for pure-node engine suites."
  - "If a single file hangs, isolate it into its own CI job rather than tuning global worker settings."
- --

# Vitest forks pool timeout on heavy jsdom suites

## Problem

`npm test` (Vitest 4.1, default `forks` pool) reports **unhandled errors / worker-start timeouts** for 3 heavy UI suites while every individual assertion passes:

```
Error: [vitest-pool]: Failed to start forks worker for test files .../CuttingsTransportSection.test.tsx
Error: [vitest-pool-runner]: Timeout waiting for worker to respond
```

- 17 files / 139 tests "passed" then the run stalls; CI gate **FAIL** (non-zero exit).
- `tsc -b`, `eslint`, `build` stay **PASS** → not a code defect.
- Re-running the same command sometimes hangs on a different subset; classic flaky-CI behavior.

## Symptoms

- Worker bootstrap (jsdom + component graph) takes **~36 s setup / ~106 s environment** per file.
- Forks pool forks an **OS process per test file**; under memory/CPU pressure the fork worker does not post its ready IPC within the default timeout.
- The hung files are always the **heaviest jsdom mounts**: `CuttingsTransportSection`, `DynamicTwinWindow`, `useToolManager` (all render `three` / R3F canvases or deep component trees).
- Engine test suites (pure TS, no DOM) never time out → isolates to the jsdom + forks combination.

## Root cause

`--pool=forks` (default) spawns a child Node process for each file. For jsdom-heavy UI tests the per-process bootstrap cost (Vite SSR transform + jsdom + R3F init) exceeds the pool's worker-startup timeout under load. The assertions are fine; the **runner infrastructure** fails before any test executes. This is environmental, not a regression — the same 5800 lines of `src/` were already committed green.

## Solution

Run heavy/UI suites with the **threads pool** (in-process worker threads share one bootstrap):

```bash
npx vitest run --pool=threads --no-file-parallelism
```

Result: **20 files / 153 tests, exit 0**, no timeouts.

- `--pool=threads`: single worker process, threads isolate suites → no repeated fork+setup.
- `--no-file-parallelism`: serializes the heavy jsdom mounts so thread contention (not pool pressure) is the only throttle.

### Why this works

- Forks pool: bootstrap cost is paid per file (N processes).
- Threads pool: bootstrap paid **once**, reused across files.
- The CPU/memory contention from three simultaneous three.js canvases is the trigger — single-file parallelism removes the spike that trips the 60 s worker watchdog.

## Prevention

1. **Default UI suites to threads.** In `vitest.config.ts`, set `pool: 'threads'` for the `include: src/components/**` glob, keep `forks` for `src/engine/**` (pure-node).
2. **Isolate the nastiest files.** If CI still flakes, move the three heavy UI suites into their own `vitest.config.ui.ts` job (`threads`, `--no-file-parallelism`) so a timeout in one file can't kill engine tests.
3. **Raise the worker timeout only as a last resort** (`testTimeout`/`hookTimeout`), not globally — it masks real bootstrap stalls.
4. **Memory guardrail.** `useToolManager` pulls the whole store; cap `maxWorkers` in CI (`--maxWorkers=2`) to prevent fork storms on low-RAM runners.

## Test cases / verification

- `npx vitest run` (forks) → FAIL with timeouts (reproducible on low-spec runner).
- `npx vitest run --pool=threads --no-file-parallelism` → 20 files / 153 tests PASS, exit 0.

## Related decisions

- Q-4 (≥80% engine coverage gate) was already deferred (see `tasks.md` archive). This flakiness is in the **UI test harness**, orthogonal to engine coverage — the coverage threshold still reports `0` in `openspec/config.yaml` and is not enabled, so it does not interact with this fix.
