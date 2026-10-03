---
type: concept
name: Agent loop
aliases: [core loop, runLoop, run_conversation]
sources: "[[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/opencode]]", "[[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/pi]]", "[[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]]"]
related: "[[03  -  Resources/02_Coding_Agent_Architectures/wiki/concepts/tool-registry]]", "[[03  -  Resources/02_Coding_Agent_Architectures/wiki/concepts/permission-gating]]", "[[03  -  Resources/02_Coding_Agent_Architectures/wiki/concepts/context-compaction]]", "[[03  -  Resources/02_Coding_Agent_Architectures/wiki/concepts/subagent-delegation]]", "[[03  -  Resources/02_Coding_Agent_Architectures/wiki/concepts/session-persistence]]"]
created: 2026-06-12T17:45:00
last_updated: 2026-06-12T17:45:00
source_count: 3
mention_count: 16
confidence: high
---

# Agent loop

> The core iteration cycle of a coding-agent harness: send conversation state to the LLM, stream the response, execute requested tool calls, append results, and decide whether to continue or stop.

## Definition

The agent loop is the single engine at the heart of each harness, and all three repos converge on having exactly one of them: opencode's `SessionPrompt.runLoop` interprets agent-config records through one shared loop [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/opencode]]; pi's `runLoop` is a pure ~740-line orchestration function consumed by stateful wrappers [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/pi]]; hermes-agent's `AIAgent.run_conversation()` is the synchronous core every surface funnels through [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]]. Where they diverge sharply is in the loop's *character*: history-driven and resumable, pure and dependency-injected, or synchronous and resilience-dominated.

## Key claims

- All three harnesses route everything through one loop implementation: opencode has "exactly one loop in the codebase" — even internal utilities like compaction and title generation are hidden agents through the same machinery; hermes drives CLI, TUI, desktop, ~20 messaging platforms, ACP, and cron through one `AIAgent` class; pi exposes `runLoop` as a library, with `Agent` and the newer `AgentHarness` as wrappers. [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/opencode]], [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]], [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/pi]]
- opencode's loop is history-driven and resumable: each iteration re-derives intent from persisted messages, so crash recovery and "continue" are the same code path; the loop is stateless between iterations, with control flow (queued subtask/compaction work) encoded in the persisted message data model. [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/opencode]]
- opencode splits the loop into three layers — `SessionPrompt` (step orchestration), `SessionProcessor` (stream-event materialization, retry, doom-loop detection), `LLM` (dual runtime normalized to one event stream) — and tools execute *inside* the provider stream, not in a harness-side dispatch loop. [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/opencode]]
- pi's `runLoop` is a pure function with zero I/O: all side effects (auth, context transforms, steering/follow-up queues, tool hooks) are injected via `AgentLoopConfig`; it runs two nested loops (inner: turns while tool calls/steering remain; outer: restart on follow-up messages). [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/pi]]
- pi makes mid-run mutation first-class: steering (mid-run injection) and follow-up (queue after stop) are queue concepts, and `prepareNextTurn` can swap context or model mid-run — which is how compaction and model switches apply without restarting the loop. [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/pi]]
- hermes' loop is fully synchronous and bounded: up to 90 API calls plus a shared `IterationBudget` with a one-turn grace call, dispatching tool batches through a thread pool between calls, with messages in OpenAI chat-completions format end-to-end. [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]]
- hermes' loop is resilience-dominated: ~80% of `conversation_loop.py`'s 4,245 lines is recovery machinery (retry/fallback chains, credential rotation, stale-stream watchdogs, steer draining); the happy path is ~30 lines. [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]]
- Runaway protection differs in kind: opencode uses doom-loop detection inside `SessionProcessor`, hermes uses a hard iteration cap plus budget. [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/opencode]], [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]]

## Notable quotes

> "Roughly 80% of `conversation_loop.py`'s 4,245 lines is recovery machinery: retry/fallback chains, credential rotation, truncated-tool-call repair, empty-response prefill recovery, steer draining, stale-stream watchdogs."
> — [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]]

## Relationships

- **Tool registry**: the loop's per-iteration work is tool dispatch, but execution location differs — inside the provider stream (opencode), through a prepare → hook → execute → finalize pipeline (pi), or thread-pool batches between API calls (hermes). [[tool-registry]] [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/opencode]], [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/pi]], [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]]
- **Permission gating**: gates fire from inside loop tool execution — opencode parks the tool's fiber on `ctx.ask`; pi runs its first-block-wins `tool_call` hook chain during sequential preparation; hermes routes command content through approval gates at dispatch. [[permission-gating]] [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/opencode]], [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/pi]], [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]]
- **Context compaction**: the loop hosts compaction — opencode queues it through the persisted message model; pi applies it mid-run via `prepareNextTurn`; hermes' compactor splits the session as its one sanctioned prompt-cache break. [[context-compaction]] [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/opencode]], [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/pi]], [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]]
- **Subagent delegation**: a subagent is the same loop re-instantiated at a different boundary — child session (opencode `task`), child OS process (pi's reference extension), child `AIAgent` on a worker thread (hermes `delegate_task`). [[subagent-delegation]] [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/opencode]], [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/pi]], [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]]
- **Session persistence**: loop input state is derived from the persisted transcript — opencode re-derives each iteration from persisted messages; pi replays the JSONL tree root-to-leaf through the latest compaction entry. [[session-persistence]] [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/opencode]], [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/pi]]

## Tensions

- **Purity vs. embedded resilience**: pi keeps the loop pure with zero I/O, pushing all side effects out through injected config; hermes embeds retry, fallback, and watchdog machinery directly in the loop body (80% of the file). Opposite answers to where robustness should live. [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/pi]] vs. [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]]
- **Tool execution locus**: opencode executes tools inside the provider stream (`streamText`), explicitly *not* a harness-side dispatch loop; pi and hermes both dispatch harness-side. [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/opencode]] vs. [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/pi]], [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]]
- **Where loop state lives**: opencode's loop is stateless between iterations, persisting control flow in the message data model; hermes keeps state in one mutable in-memory Python object with no daemon/server split; pi splits the difference — a stateless pure function under stateful wrappers. [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/opencode]] vs. [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]] vs. [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/pi]]

## Open questions

- How does opencode's v1 → v2 event-sourced engine rewrite change the loop itself? Sources detail its permission/store implications but not loop-level consequences. [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/opencode]]
- pi carries two stateful wrappers (`Agent`, used by the CLI, and the newer session-tree-aware `AgentHarness`) — which becomes canonical, and does session-tree awareness migrate into `runLoop`? [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/pi]]
- pi's steering/follow-up queues and hermes' steer draining suggest convergence on mid-run injection as a first-class loop concept; opencode's equivalent mechanism is not described in the sources. [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/pi]], [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]]

> Synthesis: The agent loop is the cleanest single lens on the three harnesses' design spectrum. All three agree on the macro shape — one loop, one chokepoint, everything (subagents, compaction, internal utilities) expressed through it — which suggests the loop-as-narrow-waist is settled convergent design in coding agents. The divergence is entirely in posture: opencode externalizes loop state into a database so the loop is replayable, pi externalizes side effects into config so the loop is a library primitive, and hermes internalizes failure handling so the loop is an armored monolith. For the comparative study, the loop is therefore less a feature to compare than the index against which every other dimension (permissions, memory, delegation) can be located.
