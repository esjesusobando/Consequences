---
type: concept
name: Context Engineering
created: '2026-09-23'
---

# Context Engineering

Context engineering is the discipline of managing what an AI agent can "see" and "remember" during a conversation. In the AI Research OS, it is the foundational principle that determines whether a system works or fails.

## The Memory Hierarchy

The system maps classical computing memory concepts to the AI agent workflow:

| Computing Concept | AI Agent Equivalent | Role |
|---|---|---|
| **Filesystem** | Long-term memory | Persistent storage of all research data — Obsidian vault, raw files, wiki |
| **RAM** | Short-term memory | Active working context during a session |
| **Context Window** | The engineering constraint | Limited token budget that must be managed carefully |

## Why Context Is Everything

As Louis-François Bouchard states: "with an agent, the context window becomes everything — the database, the file system, the memory, the reasoning space. It has to do it all, and when you stop the conversation, it loses everything."

The bottleneck is not the amount of information available but **how efficiently it can be leveraged across sessions**. Giving an agent more and more context is not the solution — proper memory management is.

## How the System Manages Context

1. **Filesystem as long-term memory**: All research lives as plain Markdown files in the local filesystem. This is durable, inspectable, and owned by the user. Obsidian serves as the primary vault.
2. **Index as the memory catalog**: `index.yaml` acts as a lightweight catalog — summaries and metadata that let the agent reason about what exists without reading everything.
3. **Wiki as working memory derivatives**: LLM-generated wiki pages (concepts, entities, comparisons) serve as pre-synthesized context that the agent can query before diving into raw sources.
4. **Hierarchical retrieval**: The agent reads index → wiki summaries → raw sources only when necessary. This minimizes the context window footprint per query.

## The Engineering Insight

The system deliberately avoids vector databases, knowledge graphs, and semantic search — not because they are bad, but because they add infrastructure complexity that obscures the core principle: **files are the database**. A simple reference-based index on a filesystem is sufficient for personal research at this scale, and it keeps the system inspectable and editable by hand.

## Key Quotes

> "You don't need necessarily to provide more and more context for better research. You need a proper memory and context management." — Louis-François Bouchard

> "The information you give to the model is not the bottleneck. The bottleneck is how you leverage it in the future." — Louis-François Bouchard

## Related Pages

- [Three-Layer Architecture]([[concepts/three-layer-architecture]])
- [Memory Management]([[concepts/memory-management]])
- [Research OS]([[concepts/research-os]])
