---
type: synthesis
name: AI Research OS — Executive Synthesis
created: '2026-09-23'
last_updated: '2026-09-23'
topic: AI Research OS
---

# Executive Synthesis

## The Core Problem

Researchers and engineers accumulate vast knowledge — 5,000+ notes, hundreds of videos, years of meeting recaps — but when they sit down to work, they cannot reliably recall what they have. Reading lists become graveyards. Context from previous sessions is lost. The bottleneck is not having information; it is *retrieving* and *compounding* it across sessions and projects. As Louis-François Bouchard puts it: "when you stop the conversation, it loses everything."

## Evolution from V1 to V3

The system's three versions reflect a deepening understanding of what research needs:

1. **V1 — Static Research MD**: A deep research algorithm targeting the public web, seeded with handpicked golden links, producing a single flat research file. Great for generating 35 course lessons quickly, but generic and static.
2. **V2 — Second Brain Targeting**: The same deep research loop, but aimed at the user's own sources (Obsidian, Readwise, GitHub, Notebook LM). Golden links emerge organically from personal notes. Still produced a static file — useful but stale-prone and expensive to regenerate.
3. **V3 — Deep Research + Wiki Layer**: Raw sources stored individually, an `index.yaml` catalog created, and a wiki of LLM-derived derivatives (concepts, entities, comparisons) generated on top. The wiki is alive — it evolves with every question, creating traces of what was asked and what was understood.

## The Four Pipeline Modes

The research skill supports four pipeline modes that determine how the system processes information:

- **init**: Sets up the research directory structure, index, and initial configuration.
- **append**: Ingests new sources (links, repositories, documents) into the raw layer without a full deep research round.
- **deep**: Runs the full deep research algorithm — multiple rounds of query generation, web/source retrieval, ranking, and synthesis — targeting either the public web or the user's second brain.
- **query**: Queries the existing wiki and index to answer questions, leveraging the reference hierarchy for token-efficient retrieval.

## Key Architectural Insights

- **No vector databases needed**: A simple reference-based index in YAML is sufficient for personal research at this scale.
- **Token efficiency through hierarchy**: The agent reads index summaries → source wiki executive summaries → raw sources only as a last resort.
- **The wiki is alive**: Every question leaves a trace. Concepts, entities, and comparisons are created on-the-fly. The wiki reflects not just ingested data but the *questions* asked.
- **PARA method integration**: Obsidian serves as an immutable snapshot; the wiki layers project-scoped research on top without touching personal notes.

## What's Missing

The system is intentionally rough — connectors for Google Drive, Notion, Slack, and better source provenance ranking are acknowledged gaps. The focus is on teaching memory and context management principles, not building a finished product.

## Further Reading

- [Three-Layer Architecture]([[wiki/concepts/three-layer-architecture]])
- [Research OS Concepts]([[wiki/concepts/research-os]])
- [Context Engineering]([[wiki/concepts/context-engineering]])
- [YouTube Source]([[wiki/sources/youtube-convierte-10994-notas]])
