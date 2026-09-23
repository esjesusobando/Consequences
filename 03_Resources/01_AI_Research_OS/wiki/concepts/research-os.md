---
type: concept
name: Research OS
created: '2026-09-23'
---

# Research OS

A Research OS is a personalized system that manages the entire lifecycle of research — from ingestion through synthesis to query — tailored to an individual's existing knowledge base. It exists because off-the-shelf tools (Google, ChatGPT, NotebookLM) are either too generic, lack ownership, or cannot compound knowledge over time.

## The Problem It Solves

1. **Context loss between sessions**: When you give an agent links or files, it builds context on the fly. When the conversation ends, that context is gone. The next session starts from scratch.
2. **Static research artifacts**: A single research Markdown file goes stale the moment new information appears. Regenerating it from scratch is expensive and slow.
3. **No personal grounding**: Generic AI tools don't know your personal notes, values, or prior work. A Research OS anchors to your second brain.
4. **Fragmented knowledge**: Notes scattered across Obsidian, Readwise, Notion, and Google Drive cannot be queried together.

## The Four Pipeline Modes

The Research OS supports four modes of operation, each serving a different purpose:

- **init**: Sets up the directory structure, creates the `index.yaml`, and configures connections to sources (Obsidian, Readwise, etc.). This is the one-time bootstrap step.
- **append**: Ingests new sources into the raw layer without triggering a full deep research round. Use when you want to add a repository, link, or document to the system.
- **deep**: Runs the full deep research algorithm — multiple rounds of query generation, source retrieval, ranking, and synthesis. Can target the public web or the user's second brain. Produces raw files, updates the index, and generates wiki derivatives.
- **query**: Searches the existing wiki and index to answer questions. Leverages the hierarchical reference structure for token-efficient retrieval — reads summaries before raw sources.

## Why It Matters

The Research OS shifts the paradigm from "search and forget" to "research and compound." Every interaction enriches the wiki. Every question creates traces. The system becomes more useful over time because it reflects not just what you *know* but what you *wonder about*.

## Key Insight

As Louis-François Bouchard explains: "The project is the work, and your second brain is the research." The Research OS bridges these two domains — turning accumulated research into active project work.

## Related Pages

- [Three-Layer Architecture]([[wiki/concepts/three-layer-architecture]])
- [Context Engineering]([[wiki/concepts/context-engineering]])
- [Memory Management]([[wiki/concepts/memory-management]])
