# Dynamic Workflows — Claude Code (May 28, 2026)

> **Source:** [Introducing dynamic workflows in Claude Code](https://claude.com/blog/introducing-dynamic-workflows-in-claude-code)
> **Published:** May 28, 2026
> **Status:** Research Preview

---

## What Are Dynamic Workflows?

Dynamic workflows are a Claude Code feature where **Claude dynamically writes JavaScript orchestration scripts** that run tens to hundreds of parallel subagents in a single session. The plan lives in script variables (not Claude's context window), so only the final answer returns to your conversation.

**Key mechanics:**
- Claude generates a JS orchestration script on the fly based on your prompt
- A runtime executes the script in the background while your session stays responsive
- Subagents run in parallel, approaching the problem from independent angles
- Adversarial agents try to refute findings before they reach you
- The run iterates until answers converge, then returns a single coordinated result
- Progress is saved — interrupted runs can resume where they left off

**Hard limits:**
- Up to **16 concurrent agents**
- Up to **1,000 total agents per run**
- The workflow script itself cannot touch the filesystem or shell — only agents can

---

## Requirements

| Requirement        | Detail                                                  |
|-------------------|--------------------------------------------------------|
| Claude Code version| v2.1.154 or later                                       |
| Plans              | Max, Team, Enterprise (admin must enable for Enterprise)|
| API availability   | Claude API, Amazon Bedrock, Vertex AI, Microsoft Foundry|
| Default state      | On for Max/Team, Off for Enterprise                     |

---

## How to Start a Workflow

Two ways:

1. **Include the word "workflow"** anywhere in your prompt
2. **Turn on `ultracode`** — a Claude Code-specific setting accessible through the effort menu. It sets effort to `xhigh` and lets Claude decide automatically when to use a workflow

There's also a bundled `/deep-research` workflow built in.

---

## Key Use Cases

### Codebase-Wide Bug Hunts
Claude searches an entire service or repo in parallel, then runs independent verification on every finding. Same pattern works for:
- Auth checks across the entire codebase
- Input validation audits
- Unsafe pattern detection
- Profiler-guided optimization audits
- Security audits

### Large Migrations & Modernization
Framework swaps, API deprecations, and language ports that span thousands of files. The parallel approach lets Claude handle work that would normally take weeks or months in days.

### Critical Work Requiring Double-Checking
When the cost of a wrong answer is high, a workflow gives Claude:
- Independent attempts at the problem from multiple angles
- Adversarial agents working to break the result before you see it
- Convergence through iteration until answers stabilize

---

## The Bun Rewrite Case Study

**What happened:** Jarred Sumner (Bun creator) used Claude Code dynamic workflows to rewrite Bun from Zig to Rust.

**Scale:**
- ~750,000 lines of Rust ported from Zig
- Completed in ~6-11 days using dynamic workflows + adversarial review
- 99.8% of the existing test suite passed on Linux x64
- Shipped as Bun v1.3.14 with 1,009,257 lines added

**Methodology (4-phase loop):**
1. **Phase 1 — Parallel translation:** Claude was pointed at the Zig source tree and instructed to emit equivalent Rust modules in parallel. The prompt held file boundaries from Zig, preserved function signatures wherever possible.
2. **Phase 2 — Compile-error fixup:** The initial output had 16,000+ compiler errors. Errors were fed back in batches, regenerating affected modules until clean.
3. **Phase 3 — Test-suite bisection:** Claude ran the existing test suite, took failing tests, traced them back to the owning module, and patched. Pass rate climbed from ~70% to 99.8%.
4. **Phase 4 — Cleanup:** A companion PR removed ~600,000 lines of legacy Zig code.

**Key pattern Jarred shared:**
```
For each unit of work:
  1) Do the work (no git/cargo — slow commands banned to avoid stepping on parallel agents)
  2) Adversarial review (2 agents independently try to refute the fix)
  3) Apply changes
```

> "Each individual step within a workflow gets the same prompt with arguments, and then within those steps a different context window (or a fork). Workflows split up work more deterministically than subagents. It's closer to a bespoke build system for a project than chat."
> — Jarred Sumner

**Notable tradeoffs:**
- The new Rust codebase contained ~13,000+ `unsafe` blocks (vs. ~73 in a comparable Rust project like `uv`)
- This was a mechanical translation, not idiomatic Rust — file boundaries and function signatures were preserved
- Performance was neutral or slightly faster, binary size shrank 3-8 MB
- The 0.2% of failing tests were platform-specific (glibc version detection, Linux capability flags)

---

## Relationship to This Project's OS Conductor

This project's **OS Conductor** (`01_Personal_Os/00_Core/02_Tools/01_Agents/00_OS_Conductor/SKILL.md`) already implements a similar pattern at the skill-orchestration level:

| Aspect       | OS Conductor                             | Dynamic Workflows                          |
|-------------|-----------------------------------------|-------------------------------------------|
| Orchestration| Routes to 47 agents across 12 skill areas| Dynamically writes JS scripts for subagents|
| Parallelism  | Sequential pipeline (one skill at a time)| Tens to hundreds of parallel subagents     |
| Verification | Sprint Contract per flow step            | Adversarial verification agents            |
| Context      | Single context window                    | Script variables (outside context)         |
| Granularity  | Skill-level (high-level domains)         | Task-level (fine-grained subtasks)         |

**Integration potential:** The Conductor could use dynamic workflows as the execution layer for complex multi-skill flows — instead of running skills sequentially, it could dispatch parallel subagent fleets and synthesize results, especially for OS audits, large migrations, and multi-domain content campaigns.

---

## Cost Considerations

- Dynamic workflows consume **meaningfully more tokens** than a typical Claude Code session
- Each subagent has its own context window
- Recommended approach: start scoped, watch usage, verify outputs before trusting long runs
- Org admins can disable workflows through managed settings

---

## References

- [Anthropic blog: Introducing dynamic workflows](https://claude.com/blog/introducing-dynamic-workflows-in-claude-code)
- [Claude Code agents documentation](https://code.claude.com/docs/en/agents.md)
- [Subagents documentation](https://code.claude.com/docs/en/sub-agents.md)
- [Agent teams documentation](https://code.claude.com/docs/en/agent-teams)
- [MarkTechPost coverage](https://www.marktechpost.com/2026/05/28/anthropic-ships-claude-opus-4-8-alongside-dynamic-workflows-and-cheaper-fast-mode-with-workflows-capped-at-1000-subagents/)
- [Agentpedia guide](https://agentpedia.codes/blog/claude-opus-4-8-claude-code-workflows)
- [Bun rewrite — The Register](https://www.theregister.com/devops/2026/05/14/anthropics-bun-rust-rewrite-merged-at-speed-of-ai/)
- [Bun rewrite — byteiota analysis](https://byteiota.com/bun-rust-rewrite-merged-the-13000-unsafe-block-problem/)
