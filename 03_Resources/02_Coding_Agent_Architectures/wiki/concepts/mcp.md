---
type: concept
name: MCP (Model Context Protocol)
aliases: [Model Context Protocol]
sources: [[03_Resources/02_Coding_Agent_Architectures/wiki/sources/opencode]], [[03_Resources/02_Coding_Agent_Architectures/wiki/sources/pi]], [[03_Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]]]
related: [[03_Resources/02_Coding_Agent_Architectures/wiki/concepts/tool-registry]], [[03_Resources/02_Coding_Agent_Architectures/wiki/concepts/acp]], [[03_Resources/02_Coding_Agent_Architectures/wiki/concepts/instruction-files]], [[03_Resources/02_Coding_Agent_Architectures/wiki/concepts/permission-gating]]]
created: 2026-06-12T17:45:00
last_updated: 2026-06-12T17:45:00
source_count: 3
mention_count: 7
confidence: medium
---

# MCP (Model Context Protocol)

> A protocol for plugging external tool/context servers into an agent harness — and the sharpest adopt/reject/extend fault line among the three harnesses studied.

## Definition

MCP is the standard protocol by which a coding-agent harness connects to external servers that provide additional tools and context, instead of baking every capability into the core. None of the three source pages defines the protocol mechanics in depth; what they document is each harness's *stance* toward it, and those stances span the full spectrum. opencode treats MCP as one of three first-class tool sources feeding its shared tool registry [[03_Resources/02_Coding_Agent_Architectures/wiki/sources/opencode]]; pi excludes it entirely as part of a subtractive philosophy [[03_Resources/02_Coding_Agent_Architectures/wiki/sources/pi]]; hermes-agent embraces it on both sides, acting as MCP client and MCP server simultaneously [[03_Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]].

## Key claims

- In opencode, the tool registry draws from three sources — built-in tools, MCP servers, and plugins — and all of them flow through the same shared agent loop and `ctx.ask` permission service. [[03_Resources/02_Coding_Agent_Architectures/wiki/sources/opencode]]
- pi ships **no MCP support** by deliberate design; like its other "missing" features (subagents, permission popups, plan mode), MCP-style capability extension is expected to be rebuilt in user space via its TypeScript extension system. [[03_Resources/02_Coding_Agent_Architectures/wiki/sources/pi]]
- pi's skills — Claude Code-compatible markdown with frontmatter, listed as name+description and lazily read on demand — are explicitly framed as "progressive disclosure as the no-MCP alternative." [[03_Resources/02_Coding_Agent_Architectures/wiki/sources/pi]]
- hermes-agent sits on **both sides of MCP**: client via `tools/mcp_tool.py`, and server via `mcp_serve.py`, which exposes conversations and even a `permissions_respond` endpoint over the protocol. [[03_Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]]
- In hermes-agent's "Footprint Ladder" doctrine, MCP servers are a sanctioned landing place for new capability — alongside skills and plugins, and almost never as new core tools — preserving the narrow-waist core. [[03_Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]]
- hermes-agent openly credits OpenClaw as the influence for its MCP bridge surface. [[03_Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]]

## Notable quotes

> "Its identity is a *subtractive* philosophy: no MCP, no built-in subagents, no permission popups, no plan mode, no to-dos, no background bash"
> — [[03_Resources/02_Coding_Agent_Architectures/wiki/sources/pi]]

> "Hermes sits on both sides of MCP (client via `tools/mcp_tool.py`, server via `mcp_serve.py` exposing conversations and even `permissions_respond`)"
> — [[03_Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]]

## Relationships

- **Tool registry**: MCP is an external feeder of the registry in adopting harnesses — opencode lists it alongside built-ins and plugins as a registry source. [[03_Resources/02_Coding_Agent_Architectures/wiki/concepts/tool-registry]]
- **ACP**: sibling protocol bridge — hermes-agent speaks both, using MCP for tools/context and ACP toward editors (and even to spawn foreign harnesses as subagents). [[03_Resources/02_Coding_Agent_Architectures/wiki/concepts/acp]]
- **Instruction files**: pi positions lazily-read skill/instruction markdown as its substitute for MCP-based capability extension. [[03_Resources/02_Coding_Agent_Architectures/wiki/concepts/instruction-files]]
- **Permission gating**: the protocol intersects the safety layer at both adopters — opencode routes MCP-sourced tools through the same `ctx.ask` gate as built-ins, and hermes-agent's MCP server exposes `permissions_respond`, letting approval decisions arrive over MCP. [[03_Resources/02_Coding_Agent_Architectures/wiki/concepts/permission-gating]]

## Tensions

- **Adopt vs. reject vs. double down.** The three harnesses take mutually exclusive stances on the same protocol: opencode integrates MCP as a core tool source [[03_Resources/02_Coding_Agent_Architectures/wiki/sources/opencode]]; pi rejects it outright, treating it as a policy that belongs in user space if anywhere [[03_Resources/02_Coding_Agent_Architectures/wiki/sources/pi]]; hermes-agent makes it a load-bearing growth mechanism in both directions, client and server [[03_Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]]. This is a design-philosophy clash, not a factual contradiction — but it is the single clearest fork in the comparison.
- **Same goal, opposite mechanism.** pi and hermes-agent both want a small core, yet pi's answer to capability growth is local TypeScript extensions and lazily-read skills ("the no-MCP alternative") [[03_Resources/02_Coding_Agent_Architectures/wiki/sources/pi]], while hermes-agent's Footprint Ladder names MCP servers as a *preferred* landing place for new capability [[03_Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]].

## Open questions

- How opencode's MCP integration actually works beyond the registry diagram — discovery, configuration, and how MCP tool identities map onto its (capability, pattern) permission rules — is not covered by the source pages. [[03_Resources/02_Coding_Agent_Architectures/wiki/sources/opencode]]
- Whether hermes-agent's MCP-exposed `permissions_respond` widens the attack/approval surface (remote parties answering permission asks) is not addressed. [[03_Resources/02_Coding_Agent_Architectures/wiki/sources/hermes-agent]]
- Whether pi users actually rebuild MCP support as a userland extension in practice — the sources document the seam, not its uptake. [[03_Resources/02_Coding_Agent_Architectures/wiki/sources/pi]]

> Synthesis: MCP functions in this study less as shared infrastructure and more as a litmus test for each harness's core-vs-edge philosophy. Where a harness draws its extensibility boundary — opencode pulling MCP inside the permission-gated registry, pi pushing it out to user space entirely, hermes-agent turning the agent itself into an MCP peer — predicts its posture on nearly every other dimension (subagents, permissions, memory). The protocol's presence or absence is thus one of the fastest signals for placing a coding-agent harness on the minimalist-to-maximalist spectrum.
