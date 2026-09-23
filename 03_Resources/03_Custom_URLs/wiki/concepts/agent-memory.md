---
type: concept
name: Agent memory
aliases: []
sources: [[wiki//sources/web-inside-neo4js-agent-memory]], [[wiki/sources/web-building-agentic-graphrag-systems]]]
related: [[wiki//entities/neo4j]], [[wiki/entities/mcp]], [[wiki/entities/claude-code]], [[wiki/concepts/knowledge-graph]], [[wiki/concepts/ontology]], [[wiki/concepts/graphrag]], [[wiki/concepts/context-engineering]]]
created: 2026-06-13T09:56:14Z
last_updated: 2026-06-13T09:56:14Z
source_count: 2
mention_count: 13
confidence: medium
---

# Agent memory

> A durable, structured store that lets an AI agent compound intelligence across conversations by extracting and maintaining shared entities, facts, and preferences over time.

## Definition

Agent memory is the layer that gives an AI agent persistent, queryable recall beyond a single context window. It sits at the end of the arc from RAG to agentic RAG to agent memory, and its core problem is identity and merging: tracking that an entity, fact, or preference seen today is the same one seen yesterday, and consolidating them rather than fragmenting them. A pure file-based wiki cannot extract and maintain shared entities, preferences, and facts as the knowledge base scales — performance degrades past roughly 50 documents — because file logs "fragment and rot context" while vector indexes give only fuzzy recall with no merge and no identity [[03_Resources/03_Custom_URLs/wiki/sources/web-inside-neo4js-agent-memory]].

Both sources converge on a [[03_Resources/03_Custom_URLs/wiki/concepts/knowledge-graph]] as the substrate for durable memory: an agent's unified memory maps naturally to a graph that must track people, places, tasks, and how they relate over time, and that graph is reached by the agent through memory tools served over [[03_Resources/03_Custom_URLs/wiki/entities/mcp]] [[03_Resources/03_Custom_URLs/wiki/sources/web-building-agentic-graphrag-systems]].

## Key claims

- Durable AI memory requires a structured graph to track identity and relationships; file logs fragment context and vector indexes lack merge/identity. [[03_Resources/03_Custom_URLs/wiki/sources/web-inside-neo4js-agent-memory]]
- A reference architecture organizes memory into three tiers — short-term `:Message`/`:Conversation` chains, long-term typed `:Entity` nodes, and per-run `:ReasoningTrace` trees — all on a single [[03_Resources/03_Custom_URLs/wiki/entities/neo4j]] graph stitched by `:MENTIONS`, `:INITIATED_BY`, and `:TOUCHED` edges. [[03_Resources/03_Custom_URLs/wiki/sources/web-inside-neo4js-agent-memory]]
- Memory uses a closed five-type [[03_Resources/03_Custom_URLs/wiki/concepts/ontology]], POLE+O (Person, Object, Location, Event, Organization); `:Fact` nodes hold single-concept claims and `:Preference` nodes store user preferences via a `SUPERSEDED_BY` relationship. [[03_Resources/03_Custom_URLs/wiki/sources/web-inside-neo4js-agent-memory]]
- Reasoning memory — storing successful and failed thinking patterns at the database level — is the architecture's novelty, analogous to RL but without baking optimizations into weights. [[03_Resources/03_Custom_URLs/wiki/sources/web-inside-neo4js-agent-memory]]
- Deduplication is asymmetric: ≥0.95 auto-merges, <0.85 creates a new node, and 0.85–0.95 defers to a pending `:SAME_AS` review edge, because a false merge is silent and unrecoverable while a false split is recoverable. [[03_Resources/03_Custom_URLs/wiki/sources/web-inside-neo4js-agent-memory]]
- An agent's unified memory maps naturally to a knowledge graph; normalization (one canonical ID per entity over time) is the most important step of the memory pipeline. [[03_Resources/03_Custom_URLs/wiki/sources/web-building-agentic-graphrag-systems]]
- Memory becomes agentic when the agent autonomously decides when to read and write it, via `search_memory`/`write_memory` tools on a FastMCP-served [[03_Resources/03_Custom_URLs/wiki/entities/mcp]] server wired into harnesses like [[03_Resources/03_Custom_URLs/wiki/entities/claude-code]]. [[03_Resources/03_Custom_URLs/wiki/sources/web-building-agentic-graphrag-systems]]

## Notable quotes

> "A vector index gives you fuzzy semantic recall but no merge, no identity, and no way to know if this is the same Karpathy you knew yesterday."
> — [[03_Resources/03_Custom_URLs/wiki/sources/web-inside-neo4js-agent-memory]]

> "Reasoning memory is the novelty from this architecture... it's similar to Reinforcement Learning (RL), but instead of baking the optimizations into the weights, you do it at the database level."
> — [[03_Resources/03_Custom_URLs/wiki/sources/web-inside-neo4js-agent-memory]]

> "GraphRAG becomes agentic when an agent gets to write to and search the knowledge graph autonomously."
> — [[03_Resources/03_Custom_URLs/wiki/sources/web-building-agentic-graphrag-systems]]

## Relationships

- **Knowledge graph**: the structural substrate that gives memory identity, merging, and multi-hop recall. [[03_Resources/03_Custom_URLs/wiki/concepts/knowledge-graph]] [[03_Resources/03_Custom_URLs/wiki/sources/web-inside-neo4js-agent-memory]]
- **Ontology**: the closed type schema (POLE+O; Document/Person ontologies) that must be defined before memory extraction. [[03_Resources/03_Custom_URLs/wiki/concepts/ontology]] [[03_Resources/03_Custom_URLs/wiki/sources/web-building-agentic-graphrag-systems]]
- **GraphRAG**: agentic GraphRAG is the retrieval-and-write loop over the same unified memory graph. [[03_Resources/03_Custom_URLs/wiki/concepts/graphrag]] [[03_Resources/03_Custom_URLs/wiki/sources/web-building-agentic-graphrag-systems]]
- **MCP**: the protocol exposing memory as `search_memory`/`write_memory` tools (FastMCP, 15-tool server). [[03_Resources/03_Custom_URLs/wiki/entities/mcp]] [[03_Resources/03_Custom_URLs/wiki/sources/web-building-agentic-graphrag-systems]]
- **Neo4j**: the graph database backing the reference three-tier memory implementation. [[03_Resources/03_Custom_URLs/wiki/entities/neo4j]] [[03_Resources/03_Custom_URLs/wiki/sources/web-inside-neo4js-agent-memory]]
- **Claude Code**: an agent harness wired into the memory MCP server. [[03_Resources/03_Custom_URLs/wiki/entities/claude-code]] [[03_Resources/03_Custom_URLs/wiki/sources/web-building-agentic-graphrag-systems]]
- **Context engineering**: agent memory is a response to context rot and fragmentation in long-running agents. [[03_Resources/03_Custom_URLs/wiki/concepts/context-engineering]] [[03_Resources/03_Custom_URLs/wiki/sources/web-building-agentic-graphrag-systems]]

## Tensions

- **When to reach for Neo4j.** Both sources agree the graph is the right model, but counsel against defaulting to Neo4j: for small-to-medium scale (thousands of nodes, short 2–3 hop traversals) build on Postgres or MongoDB, reserving Neo4j for deep traversals, graph algorithms, or internal data-mining tools. [[03_Resources/03_Custom_URLs/wiki/sources/web-inside-neo4js-agent-memory]] [[03_Resources/03_Custom_URLs/wiki/sources/web-building-agentic-graphrag-systems]]

## Open questions

- Context compression of retrieved memory is left to the caller — the SDK composes vector, traversal, and reasoning lookups but does not decide what to keep. [[03_Resources/03_Custom_URLs/wiki/sources/web-inside-neo4js-agent-memory]]
- How the append-only-log versus single-mutable-collection trade-off (temporality/audit vs. operational simplicity) should be resolved for a given agent. [[03_Resources/03_Custom_URLs/wiki/sources/web-building-agentic-graphrag-systems]]

> Synthesis: Across both sources, agent memory is treated as the same object viewed from two angles — Neo4j's three-tier graph supplies the identity, ontology, dedup, and reasoning-memory mechanics, while the GraphRAG piece supplies the data-modeling discipline (ontology-first, normalization) and the agentic loop that lets a harness like Claude Code read and write memory autonomously over MCP. The consistent throughline is that memory is a structured, merge-aware graph problem, not a logging or vector-search problem, and that the database choice should follow traversal depth rather than ambition.
