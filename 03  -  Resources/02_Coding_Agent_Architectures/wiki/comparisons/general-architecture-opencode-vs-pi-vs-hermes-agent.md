---
type: comparison
name: General architecture — opencode vs. pi vs. hermes-agent
subjects:
  - "[[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/opencode]]"
  - "[[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/pi]]"
  - "[[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]]"
dimension: general-architecture
shared_sources: []
created: 2026-06-12T18:00:00
last_updated: 2026-06-12T18:00:00
prompt: Compare the general architecture of the three harnesses.
---

# General architecture: opencode vs. pi vs. hermes-agent

> Three coding-agent harnesses, three irreconcilable answers to the same question: where should the harness boundary sit — behind a server API, inside a library, or around one big object?

## At a glance

| | [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/opencode|opencode]] | [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/pi|pi]] | [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent|hermes-agent]] |
|---|---|---|---|
| **What it is** | Client/server engine; every UI is a client | Four-package library stack; CLI is one consumer | Python monolith; one class behind many surfaces |
| **Language / runtime** | TypeScript on Bun, Effect framework | TypeScript on Node ≥ 22, minimal deps | Python, synchronous core |
| **Process model** | Server (worker-thread or headless) + HTTP/SSE clients | Single process; subagents = child OS processes | One process family; subagents = worker threads |
| **Loop style** | Effect fibers, streaming, resumable | Pure ~740-line function, zero I/O, DI config | Sync while-loop, max 90 iterations |
| **Extensibility surface** | Plugins, skills, markdown agents, MCP, ACP | TypeScript extensions (~30 hooks) — *the* product | Plugins, self-improving skills, MCP both ways |
| **Strength** | Multi-client by construction; one agent impl | Auditable core; everything else is user space | Lives everywhere (20+ messaging platforms, cron) |
| **Weakness** | Heaviest machinery; mid v1→v2 rewrite | Nothing built in; you assemble your own harness | 12k-LOC god object; no process boundary |

## Three system shapes

```mermaid
flowchart TB
    subgraph OC["opencode — client/server"]
        C1["TUI · desktop · web · IDE (ACP)"] -->|HTTP + SSE| E1["engine: HTTP API + event bus"]
        E1 --> L1["shared Effect loop"]
        L1 --> S1[("SQLite opencode.db")]
    end
    subgraph PI["pi — library stack"]
        CLI2["pi CLI (4 modes)"] --> A2["pi-agent-core: pure agentLoop"]
        A2 --> AI2["pi-ai provider registry"]
        X2["TS extensions"] -.->|tool_call gate| CLI2
        CLI2 --> J2[("JSONL session trees")]
    end
    subgraph HM["hermes-agent — monolith"]
        S3["CLI · TUI · gateway · ACP · cron"] --> A3["AIAgent (one class)"]
        A3 --> T3["ToolRegistry + toolsets"]
        A3 --> D3[("state.db SQLite")]
    end
```

## Definitional contrast

- [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/opencode]] is a **server-first harness**: a Bun/Effect engine exposing an OpenAPI HTTP API plus SSE events, where the TUI runs the server in a worker thread and every other surface — desktop, web, IDE via [[03  -  Resources/02_Coding_Agent_Architectures/wiki/concepts/acp]] — is an interchangeable client of one agent implementation [[03  -  Resources/02_Coding_Agent_Architectures/wiki/repos/opencode/ARCHITECTURE#1. Bird's-eye view|cite]] [[03  -  Resources/02_Coding_Agent_Architectures/wiki/repos/opencode/ARCHITECTURE#5. Client/server split & the event bus|cite]].
- [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/pi]] is a **runtime-as-library**: four lock-stepped, acyclic npm packages (TUI lib, provider API, pure agent core, CLI assembler) whose subtractive philosophy — no [[03  -  Resources/02_Coding_Agent_Architectures/wiki/concepts/mcp]], no built-in [[03  -  Resources/02_Coding_Agent_Architectures/wiki/concepts/subagent-delegation|subagents]], no [[03  -  Resources/02_Coding_Agent_Architectures/wiki/concepts/permission-gating|permission popups]] — pushes every policy into a jiti-loaded TypeScript extension system [[03  -  Resources/02_Coding_Agent_Architectures/wiki/repos/pi/ARCHITECTURE#1. Bird's-eye view|cite]] [[03  -  Resources/02_Coding_Agent_Architectures/wiki/repos/pi/ARCHITECTURE#3. Monorepo & package stack|cite]].
- [[03  -  Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]] is a **monolith with many faces**: one synchronous `AIAgent` class constructed directly by every surface — CLI, Ink TUI, Electron app, a ~20-platform messaging gateway, ACP, cron — with "no daemon/server split; the narrow waist is a Python object, not an RPC boundary" [[03  -  Resources/02_Coding_Agent_Architectures/wiki/repos/hermes-agent/ARCHITECTURE#1. Bird's-eye view|cite]].

## Mechanism / how they differ

**Where the boundary lives.** opencode draws it at an RPC seam: clients POST, the engine publishes typed bus events, UIs re-render from the stream — which is what lets *any* attached client answer a permission ask [[03  -  Resources/02_Coding_Agent_Architectures/wiki/repos/opencode/ARCHITECTURE#5. Client/server split & the event bus|cite]]. pi draws it at the package edge: `pi-agent-core`'s [[03  -  Resources/02_Coding_Agent_Architectures/wiki/concepts/agent-loop|loop]] is a pure function with all side effects injected through `AgentLoopConfig`, so the CLI, RPC embedders, and child processes all consume the same runtime [[03  -  Resources/02_Coding_Agent_Architectures/wiki/repos/pi/ARCHITECTURE#1. Bird's-eye view|cite]] [[03  -  Resources/02_Coding_Agent_Architectures/wiki/repos/pi/ARCHITECTURE#12. Operating modes & the TUI|cite]]. Hermes draws no boundary at all — surfaces construct the object in-process; only the TUI/desktop talk JSON-RPC over stdio to a thin gateway [[03  -  Resources/02_Coding_Agent_Architectures/wiki/repos/hermes-agent/ARCHITECTURE#11. Interactive surfaces — CLI, TUI, desktop, dashboard|cite]].

**Layering discipline.** opencode layers via Effect services (every subsystem a `Layer`), with agents as pure config interpreted by one shared loop [[03  -  Resources/02_Coding_Agent_Architectures/wiki/repos/opencode/ARCHITECTURE#7. Agents & subagents|cite]]. pi layers via a strict acyclic dependency stack, each package independently publishable [[03  -  Resources/02_Coding_Agent_Architectures/wiki/repos/pi/ARCHITECTURE#3. Monorepo & package stack|cite]]. Hermes layers via doctrine instead of structure: the "Footprint Ladder" routes new capability into skills/plugins/MCP rather than core tools, and a strict one-way import chain disciplines the [[03  -  Resources/02_Coding_Agent_Architectures/wiki/concepts/tool-registry]] [[03  -  Resources/02_Coding_Agent_Architectures/wiki/repos/hermes-agent/ARCHITECTURE#6. Tool registry, toolsets & the footprint ladder|cite]].

**Persistence shape follows process shape.** Server-shaped opencode is database-shaped — SQLite with an event-sourced v2 engine in flight [[03  -  Resources/02_Coding_Agent_Architectures/wiki/repos/opencode/ARCHITECTURE#14. The v1 → v2 engine rewrite|cite]]; library-shaped pi keeps [[03  -  Resources/02_Coding_Agent_Architectures/wiki/concepts/session-persistence|sessions]] as append-only JSONL trees per cwd [[03  -  Resources/02_Coding_Agent_Architectures/wiki/repos/pi/ARCHITECTURE#10. Sessions, memory & compaction|cite]]; monolith Hermes shares one `state.db` (WAL + FTS5) across every surface, constrained by its prompt-cache invariant [[03  -  Resources/02_Coding_Agent_Architectures/wiki/repos/hermes-agent/ARCHITECTURE#9. Memory & state|cite]]. All three converge on [[03  -  Resources/02_Coding_Agent_Architectures/wiki/concepts/instruction-files]] (`AGENTS.md`/`CLAUDE.md`) and [[03  -  Resources/02_Coding_Agent_Architectures/wiki/concepts/context-compaction]]; none uses a vector store.

## Trade-offs

| Dimension | Favors opencode | Favors pi | Favors hermes-agent | Context-dependent |
|---|---|---|---|---|
| Multi-client / IDE / remote UIs | x — free via HTTP+SSE+ACP [[03  -  Resources/02_Coding_Agent_Architectures/wiki/repos/opencode/ARCHITECTURE#13. External protocol bridges: ACP, MCP, SDK|cite]] | | | |
| Core auditability & embedding | | x — pure loop, 7 tools, DI seams [[03  -  Resources/02_Coding_Agent_Architectures/wiki/repos/pi/ARCHITECTURE#7. Built-in tool surface|cite]] | | |
| Ambient reach (messaging, cron, fleets) | | | x — gateway + cron + kanban [[03  -  Resources/02_Coding_Agent_Architectures/wiki/repos/hermes-agent/ARCHITECTURE#12. Messaging gateway|cite]] | |
| Subagent isolation strength | | x — process isolation [[03  -  Resources/02_Coding_Agent_Architectures/wiki/repos/pi/ARCHITECTURE#11. Subagents & multi-agent|cite]] | | opencode: permission-based; hermes: threads [[03  -  Resources/02_Coding_Agent_Architectures/wiki/repos/hermes-agent/ARCHITECTURE#10. Subagents & delegation|cite]] |
| Out-of-box completeness | x | | x | pi requires assembling extensions |
| Conceptual complexity to fork/study | | x | | opencode mid-rewrite [[03  -  Resources/02_Coding_Agent_Architectures/wiki/repos/opencode/ARCHITECTURE#14. The v1 → v2 engine rewrite|cite]]; hermes 12k-LOC core [[03  -  Resources/02_Coding_Agent_Architectures/wiki/repos/hermes-agent/ARCHITECTURE#4. Core agent loop|cite]] |
| Security boundary honesty | | x — defers to OS [[03  -  Resources/02_Coding_Agent_Architectures/wiki/concepts/sandboxing|sandboxing]] [[03  -  Resources/02_Coding_Agent_Architectures/wiki/repos/pi/ARCHITECTURE#9. Permission & trust model|cite]] | | hermes: sandbox bypasses approvals [[03  -  Resources/02_Coding_Agent_Architectures/wiki/repos/hermes-agent/ARCHITECTURE#7. Execution environments (terminal backends)|cite]] |

## When to study / adopt each

- **opencode** — study it for how a server-first harness buys multi-client permission answering, live subagent inspection, and IDE bridging with exactly one agent implementation; adopt it if you need many surfaces over one engine [[03  -  Resources/02_Coding_Agent_Architectures/wiki/repos/opencode/ARCHITECTURE#1. Bird's-eye view|cite]]. Its markdown agents and skills mirror [[03  -  Resources/03_Custom_URLs/wiki/entities/claude-code]] conventions [[03  -  Resources/02_Coding_Agent_Architectures/wiki/repos/opencode/ARCHITECTURE#7. Agents & subagents|cite]].
- **pi** — study it as the cleanest reference for what a harness *minimally is*: a pure loop, a provider seam keyed by API shape, and chokepoints instead of policies; adopt it to embed an agent runtime or build your own opinionated harness in user space [[03  -  Resources/02_Coding_Agent_Architectures/wiki/repos/pi/ARCHITECTURE#8. Extension system|cite]].
- **hermes-agent** — study it for invariant-driven monolith design (byte-stable prompts for cache warmth, narrow-waist doctrine) and for the richest interop story — MCP client *and* server, plus ACP [[03  -  Resources/02_Coding_Agent_Architectures/wiki/repos/hermes-agent/ARCHITECTURE#14. Protocol bridges — MCP & ACP|cite]]; adopt it for an always-on assistant that lives in your chat apps, not just your terminal [[03  -  Resources/02_Coding_Agent_Architectures/wiki/repos/hermes-agent/ARCHITECTURE#12. Messaging gateway|cite]].

> Synthesis: The three harnesses are not rivals on one axis but three coherent local optima: opencode optimizes for *surfaces* (client/server, one loop, everything an event), pi for *composability* (library core, user-space policy), hermes for *presence* (one object reachable from anywhere, disciplined by invariants instead of boundaries). For this research topic — extracting architectural patterns for building coding agents — pi is the best first read because its subtractive core makes the essential harness anatomy visible, opencode is the best blueprint if multiple clients or an IDE protocol surface is a requirement, and hermes-agent is the best vocabulary mine for operational concerns (cache-stable prompts, footprint ladders, approval queues) that the other two barely name. Verdict: context-dependent — the right default depends on whether your scarce resource is surfaces, simplicity, or reach.
