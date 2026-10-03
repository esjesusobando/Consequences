---
type: entity
name: Neo4j
aliases: []
sources: "[[03  -  Resources/03_Custom_URLs/wiki/sources/web-inside-neo4js-agent-memory]]", "[[03  -  Resources/03_Custom_URLs/wiki/sources/web-building-agentic-graphrag-systems]]"]
related: "[[03  -  Resources/03_Custom_URLs/wiki/concepts/agent-memory]]", "[[03  -  Resources/03_Custom_URLs/wiki/concepts/graphrag]]", "[[03  -  Resources/03_Custom_URLs/wiki/concepts/knowledge-graph]]", "[[03  -  Resources/03_Custom_URLs/wiki/concepts/ontology]]", "[[03  -  Resources/03_Custom_URLs/wiki/entities/mcp]]", "[[03  -  Resources/03_Custom_URLs/wiki/entities/claude-code]]"]
created: 2026-06-13T09:55:39Z
last_updated: 2026-06-13T09:55:39Z
source_count: 2
mention_count: 14
confidence: medium
---

# Neo4j

> A labeled-property-graph database used as the single substrate for agent memory and GraphRAG knowledge graphs — but recommended only when deep traversal or graph algorithms are genuinely core.

## Definition

Neo4j is a graph database that, in Paul Iusztin's articles, serves as the storage layer for agent memory and GraphRAG systems. In the `neo4j-labs/agent-memory` reference architecture it holds one graph spanning three memory tiers (short-term `:Message`/`:Conversation` chains, long-term typed `:Entity` nodes, per-run `:ReasoningTrace` trees), with open subtypes materialized as multi-tier labels like `:Entity:Person:Individual` ([[03  -  Resources/03_Custom_URLs/wiki/sources/web-inside-neo4js-agent-memory]]).

Notably, Neo4j is presented with a deliberately conservative recommendation: it is not the default store, but a tool reserved for large scale, deep traversals, or graph algorithms ([[03  -  Resources/03_Custom_URLs/wiki/sources/web-building-agentic-graphrag-systems]]).

## Key claims

- All three memory tiers live on a single Neo4j graph, stitched by `:MENTIONS`, `:INITIATED_BY`, and `:TOUCHED` edges so cross-tier provenance is a one-hop query. [[03  -  Resources/03_Custom_URLs/wiki/sources/web-inside-neo4js-agent-memory]]
- Open entity subtypes are materialized as multi-tier Neo4j labels (e.g. `:Entity:Person:Individual`) under the closed POLE+O ontology. [[03  -  Resources/03_Custom_URLs/wiki/sources/web-inside-neo4js-agent-memory]]
- For small-to-medium scale (thousands of nodes, short hops), Paul would build on Postgres or MongoDB; Neo4j is reserved for large scale/complexity or internal data-mining tools. [[03  -  Resources/03_Custom_URLs/wiki/sources/web-inside-neo4js-agent-memory]]
- Agent stacks use labeled property graphs (Neo4j's model) over RDF. [[03  -  Resources/03_Custom_URLs/wiki/sources/web-building-agentic-graphrag-systems]]
- Use Postgres/MongoDB for 2–3 hop traversals; reach for Neo4j only when deep traversals or graph algorithms are core — "do not design for Google scale." [[03  -  Resources/03_Custom_URLs/wiki/sources/web-building-agentic-graphrag-systems]]

## Notable quotes

> "A vector index gives you fuzzy semantic recall but no merge, no identity, and no way to know if this is the same Karpathy you knew yesterday."
> — [[03  -  Resources/03_Custom_URLs/wiki/sources/web-inside-neo4js-agent-memory]]

> "Five documents produced 17 node types and 34 relationship types. This included part_of, Part Of, and part of as three separate types."
> — [[03  -  Resources/03_Custom_URLs/wiki/sources/web-building-agentic-graphrag-systems]]

## Relationships

- **Agent memory**: Neo4j is the graph substrate for the three-tier agent-memory architecture. [[03  -  Resources/03_Custom_URLs/wiki/concepts/agent-memory]]
- **GraphRAG**: Neo4j is one candidate store for the knowledge graph at the center of a GraphRAG pipeline. [[03  -  Resources/03_Custom_URLs/wiki/sources/web-building-agentic-graphrag-systems]]
- **Knowledge graph**: Neo4j realizes the knowledge graph as a labeled property graph rather than RDF. [[03  -  Resources/03_Custom_URLs/wiki/concepts/knowledge-graph]]
- **Ontology**: the POLE+O ontology is enforced via multi-tier Neo4j node labels. [[03  -  Resources/03_Custom_URLs/wiki/concepts/ontology]]
- **MCP**: the Neo4j graph is exposed to agents through a FastMCP server (`search_memory`/`write_memory`, 15 tools in agent-memory). [[03  -  Resources/03_Custom_URLs/wiki/entities/mcp]]
- **Claude Code**: agents like Claude Code reach the Neo4j-backed memory through that MCP server. [[03  -  Resources/03_Custom_URLs/wiki/entities/claude-code]]

## Tensions

- Neo4j's positioning differs in emphasis across the two sources, though they agree in substance: both recommend Postgres/MongoDB by default and reserve Neo4j for deep-traversal/graph-algorithm cases, yet the agent-memory article still builds its full reference architecture on Neo4j. [[03  -  Resources/03_Custom_URLs/wiki/sources/web-inside-neo4js-agent-memory]] [[03  -  Resources/03_Custom_URLs/wiki/sources/web-building-agentic-graphrag-systems]]

## Open questions

- At what concrete scale (node count, hop depth) does Neo4j become worth the operational cost over Postgres/MongoDB? Both sources gesture at thresholds without a sharp boundary. [[03  -  Resources/03_Custom_URLs/wiki/sources/web-building-agentic-graphrag-systems]]

> Synthesis: Across both articles Neo4j is treated less as a default and more as a capability ceiling — the store you adopt when identity, deep multi-hop traversal, or graph algorithms genuinely matter, as in the `neo4j-labs/agent-memory` blueprint. Its property-graph model is what lets the POLE+O ontology, three memory tiers, and provenance edges coexist on one queryable graph; everything the agent does flows through it via an MCP server. The recurring caveat ("do not design for Google scale") makes Neo4j the high-complexity end of a spectrum whose low end is plain Postgres/MongoDB.
