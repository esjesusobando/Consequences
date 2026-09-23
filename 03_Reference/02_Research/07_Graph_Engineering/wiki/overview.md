---
type: overview
name: Graph Engineering Research Overview
created: 2026-08-01
last_updated: 2026-08-01
topic: Graph Engineering
source_count: 1
---

# Graph Engineering — Research Overview

## What This Is About

Graph engineering is the methodology of structuring AI agent workflows as directed graphs rather than sequential loops. Each node in the graph is an independent agent running in its own context window, and edges define how data flows between them. This enables parallel execution — multiple agents working simultaneously on different parts of a task — but introduces verification challenges: errors in one node propagate silently through the graph.

## Core Thesis

The key insight from the AI Labs transcript is that **verification is the critical path in graph engineering**. Without proper per-node verification, parallel execution amplifies errors rather than reducing them. Anthropic's solution is a layered verification system:

1. Built-in skills (verify, code review, simplify)
2. Self-built skills via Skill Creator
3. Second opinion pattern (separate Opus session)
4. Orchestrator skill (meta-skill running all reviews in parallel)

## Key Takeaways

1. **Graphs > Loops for parallel work** — but cost more tokens overall
2. **Verification must be per-node** — each agent reviewing its own output is unreliable
3. **Second opinion is essential** — the building agent is the worst reviewer
4. **Model choice for review matters** — Opus produces better reasoning than Haiku for review tasks
5. **Orchestrator pattern** — one meta-skill above all others that fans out review work and consolidates findings

## Source Quality

Single source (AI Labs transcript) — comprehensive but opinionated. No independent verification of claims about Anthropic's built-in skills. The methodology described aligns with known Claude Code capabilities.

## Open Questions

- How does the orchestrator skill handle conflicting findings from different review skills?
- What is the token cost overhead of running verification at each node?
- Are there examples of production graph architectures using this methodology?
- How does this integrate with SDD/TDD pipelines?

---

> Synthesis: Graph engineering is a natural evolution of loop engineering for AI agents. The core value proposition is parallel execution speed, but the critical enabler is robust per-node verification. The second opinion pattern (separate Opus session) is the single most important practice for maintaining graph integrity.
