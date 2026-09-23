---
type: concept
name: GraphRAG
aliases: ["Agentic GraphRAG", "graph RAG"]
sources: [[wiki//sources/web-building-agentic-graphrag-systems]], [[wiki/sources/web-inside-neo4js-agent-memory]]]
related: [[wiki//concepts/ontology]], [[wiki/concepts/knowledge-graph]], [[wiki/concepts/agent-memory]], [[wiki/concepts/context-engineering]], [[wiki/entities/neo4j]], [[wiki/entities/mcp]], [[wiki/entities/claude-code]]]
created: 2026-06-13T09:56:23Z
last_updated: 2026-06-13T09:56:23Z
source_count: 2
mention_count: 13
confidence: medium
---

# GraphRAG

> Retrieval-augmented generation backed by a knowledge graph, framed primarily as a data-modeling problem rather than a retrieval algorithm.

## Definition

GraphRAG retrieves over a [[03_Reference/02_Research/03_Custom_URLs/wiki/concepts/knowledge-graph]] instead of (or alongside) a flat vector index, so an agent can reason over typed entities and the relationships between them rather than disconnected text chunks. Its defining thesis is that "GraphRAG isn't a retrieval algorithm, it's a data modeling problem" — the hard part is defining an [[03_Reference/02_Research/03_Custom_URLs/wiki/concepts/ontology]] before any extraction or retrieval is attempted [[03_Reference/02_Research/03_Custom_URLs/wiki/sources/web-building-agentic-graphrag-systems]]. It sits on the arc from RAG to agentic RAG to agent memory, addressing the limits of file logs (which "fragment and rot context") and vector indexes (which give fuzzy recall but "no merge, no identity") [[03_Reference/02_Research/03_Custom_URLs/wiki/sources/web-inside-neo4js-agent-memory]].

GraphRAG becomes *agentic* when the agent autonomously decides when to read and write the graph, exposed as memory tools over an [[03_Reference/02_Research/03_Custom_URLs/wiki/entities/mcp]] server wired into harnesses like [[03_Reference/02_Research/03_Custom_URLs/wiki/entities/claude-code]] [[03_Reference/02_Research/03_Custom_URLs/wiki/sources/web-building-agentic-graphrag-systems]].

## Key claims

- GraphRAG is a data-modeling problem, not a retrieval algorithm; it requires an ontology first. [[03_Reference/02_Research/03_Custom_URLs/wiki/sources/web-building-agentic-graphrag-systems]]
- It is justified by three forces: context rot, data fragmentation, and an agent's unified memory mapping naturally onto a knowledge graph. [[03_Reference/02_Research/03_Custom_URLs/wiki/sources/web-building-agentic-graphrag-systems]]
- Skipping the ontology is costly — LangChain's `MongoDBGraphStore` produced 17 node types and 34 relationship types from just five documents (`part_of`, `Part Of`, `part of` as three separate types). [[03_Reference/02_Research/03_Custom_URLs/wiki/sources/web-building-agentic-graphrag-systems]]
- Agent stacks favor labeled property graphs over RDF, with three extraction modes (structured, semi-structured, unstructured). [[03_Reference/02_Research/03_Custom_URLs/wiki/sources/web-building-agentic-graphrag-systems]]
- Hybrid retrieval is two-stage: text + semantic search fused via Reciprocal Rank Fusion for entry points, then 2–3 hop traversal over typed edges. [[03_Reference/02_Research/03_Custom_URLs/wiki/sources/web-building-agentic-graphrag-systems]]
- Durable AI memory requires a structured graph to track identity and relationships across time; file logs fragment context and vector indexes lack merge/identity. [[03_Reference/02_Research/03_Custom_URLs/wiki/sources/web-inside-neo4js-agent-memory]]
- Retrieval can compose vector similarity, multi-hop traversal, time-ordered conversation walks, and reasoning lookups in a single Cypher query, leaving final context compression to the caller. [[03_Reference/02_Research/03_Custom_URLs/wiki/sources/web-inside-neo4js-agent-memory]]

## Notable quotes

> "GraphRAG isn't a retrieval algorithm, it's a data modeling problem."
> — [[03_Reference/02_Research/03_Custom_URLs/wiki/sources/web-building-agentic-graphrag-systems]]

> "GraphRAG becomes agentic when an agent gets to write to and search the knowledge graph autonomously."
> — [[03_Reference/02_Research/03_Custom_URLs/wiki/sources/web-building-agentic-graphrag-systems]]

> "A vector index gives you fuzzy semantic recall but no merge, no identity, and no way to know if this is the same Karpathy you knew yesterday."
> — [[03_Reference/02_Research/03_Custom_URLs/wiki/sources/web-inside-neo4js-agent-memory]]

## Relationships

- **Ontology**: the prerequisite — GraphRAG starts from defining an ontology before extraction or retrieval. [[03_Reference/02_Research/03_Custom_URLs/wiki/concepts/ontology]]
- **Knowledge graph**: the substrate GraphRAG retrieves over, built as a labeled property graph. [[03_Reference/02_Research/03_Custom_URLs/wiki/concepts/knowledge-graph]]
- **Agent memory**: GraphRAG is the retrieval layer of an agent's unified memory; the two articles treat them as the same backbone. [[03_Reference/02_Research/03_Custom_URLs/wiki/concepts/agent-memory]]
- **Context engineering**: motivated by context rot / fragmentation, GraphRAG is a context-engineering strategy for durable, low-noise recall. [[03_Reference/02_Research/03_Custom_URLs/wiki/concepts/context-engineering]]
- **Neo4j**: a graph database option, reserved for deep traversals or graph algorithms; both articles default to Postgres/MongoDB for 2–3 hop scale. [[03_Reference/02_Research/03_Custom_URLs/wiki/entities/neo4j]]
- **MCP / Claude Code**: agentic GraphRAG is delivered as MCP memory tools (`search_memory`/`write_memory`) wired into agent harnesses. [[03_Reference/02_Research/03_Custom_URLs/wiki/entities/mcp]] · [[03_Reference/02_Research/03_Custom_URLs/wiki/entities/claude-code]]

## Tensions

- **Ontology rigor vs. extraction modes**: the GraphRAG article warns against schema-free extraction (label explosion) yet still admits an unstructured mode where the LLM invents labels — bounded to discovery only. [[03_Reference/02_Research/03_Custom_URLs/wiki/sources/web-building-agentic-graphrag-systems]]
- **Single store vs. graph DB**: both articles consistently advise Postgres/MongoDB for small-to-medium scale and Neo4j only when deep traversal or graph algorithms are core, tempering the "use a graph" framing. [[03_Reference/02_Research/03_Custom_URLs/wiki/sources/web-building-agentic-graphrag-systems]] · [[03_Reference/02_Research/03_Custom_URLs/wiki/sources/web-inside-neo4js-agent-memory]]

## Open questions

- Context compression after retrieval is explicitly left to the caller, with no prescribed strategy. [[03_Reference/02_Research/03_Custom_URLs/wiki/sources/web-inside-neo4js-agent-memory]]
- Where the line falls between deterministic and LLM-based extraction across modes/ladders is described but not formalized. [[03_Reference/02_Research/03_Custom_URLs/wiki/sources/web-building-agentic-graphrag-systems]] · [[03_Reference/02_Research/03_Custom_URLs/wiki/sources/web-inside-neo4js-agent-memory]]

> Synthesis: Across both sources GraphRAG is presented less as an algorithm and more as a discipline — get the ontology right, normalize entities to one canonical identity over time, retrieve with a cheap hybrid two-stage pass, and only then make it agentic by exposing read/write tools over MCP. The two articles agree strongly: the graph earns its keep through identity and relationships that vector indexes and file logs cannot maintain, but both deliberately deflate the hype, defaulting to relational/document stores and reaching for Neo4j only when deep traversal is genuinely core.
