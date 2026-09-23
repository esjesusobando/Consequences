---
type: overview
name: AI Research OS Overview
created: '2026-09-23'
last_updated: '2026-09-23'
topic: AI Research OS
---

# AI Research OS Overview

## What Is It?

AI Research OS is a personalized research operating system built by [Paul Iusztin]([[wiki/entities/paul-iusztin]]) and [Louis-François Bouchard]([[louis-francois-bouchard]]) that transforms a user's second brain into a living, queryable research memory. The system sits between AI agent harnesses (such as Codex Cloud and Claude Code) and a user's personal knowledge base, enabling agents to efficiently retrieve, synthesize, and compound research over time. It was introduced in the workshop video "[Convierte 10,994 notas en memoria]([[youtube-convierte-10994-notas]])" on the AI Engineer channel (2025).

## Why It Exists: The Three-Version Evolution

The system evolved through three versions driven by real-world usage problems. **V1** produced a single static research Markdown file by scraping a handpicked set of "golden links" from the public web — useful for a course but limited to generic, one-off research. **V2** flipped the approach: instead of targeting the public web, the deep research loop targeted the user's own second brain (Obsidian, Readwise, Notebook LM, GitHub), organically gathering golden links from personal notes. But V2 still output a static file that went stale and had to be regenerated from scratch. **V3** solved this by adding a wiki layer on top of the deep research algorithm — storing raw files individually, building a reference-based index (`index.yaml`), and generating an alive, evolving wiki that compounds with every question asked.

## The Three-Layer Architecture

The core architecture rests on three layers: **raw/** (immutable source data), **index** (`index.yaml` — a catalog of all sources with summaries and metadata), and **wiki/** (LLM-derived pages: concepts, entities, comparisons, and source executive summaries). The system avoids vector databases and knowledge graphs entirely, relying instead on plain Markdown files and hierarchical references for token-efficient querying. Every query flows from the index → source wiki pages → raw sources only when necessary, keeping context lean.

## Key Principles

The system is built on the conviction that the filesystem *is* long-term memory, RAM is short-term memory, and the context window is the engineering constraint that must be managed. By grounding everything in local files — with Obsidian as the local vault — the system stays personal, inspectable, and agent-native. As Louis-François Bouchard states, "the project is to teach AI engineering" — not to build a polished product, but to give engineers a composable, extensible foundation for their own workflows.
