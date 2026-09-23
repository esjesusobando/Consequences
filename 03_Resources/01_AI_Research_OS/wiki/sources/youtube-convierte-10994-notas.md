---
type: source
name: YouTube - Convierte 10,994 notas en memoria
created: '2026-09-23'
origin: youtube
source_url: https://www.youtube.com/watch?v=ZRM_TfEZcIo
relevance_score: 1.0
tags: [second-brain, research-os, wiki, memory, workshop]
---

# YouTube: Convierte 10,994 notas en memoria

## Source Information

- **Video**: "Turn 10,994 Notes Into Memory"
- **Channel**: AI Engineer
- **Speakers**: [Paul Iusztin]([[wiki/entities/paul-iusztin]]) & [Louis-François Bouchard]([[wiki/entities/louis-francois-bouchard]])
- **Published**: 2025 (transcript generated 2026-07-31)
- **Video ID**: ZRM_TfEZcIo

## Summary

This workshop video introduces the AI Research OS — a personalized system that turns a user's second brain into a living research memory. The speakers demonstrate how to build a three-layer architecture (raw, index, wiki) using plain Markdown files, Obsidian as a local vault, and AI agent harnesses (Codex Cloud, Claude Code) to automate deep research, ingestion, and query workflows.

## Key Points

### The Problem

- Researchers accumulate thousands of notes across Obsidian, Readwise, Notion, and Google Drive — growing ~250 files/month.
- When starting a new project, they cannot recall what they have or spend excessive time finding meaningful notes.
- Reading lists become "graveyards" — saved but never retrieved.
- Existing tools like NotebookLM lack ownership, personalization, agent-native design, and coding support.

### The Solution: AI Research OS

- A system built on **plain files** (Markdown) that sits between AI harnesses and the second brain.
- Uses a **three-layer architecture**: raw/ (immutable data), index.yaml (catalog with summaries), wiki/ (LLM-derived derivatives).
- Avoids vector databases, knowledge graphs, and semantic search — keeping things simple and inspectable.
- Supports four pipeline modes: init, append, deep, and query.

### Three-Version Evolution

1. **V1**: Deep research on public web → static research MD. Great for course lessons (35 generated quickly).
2. **V2**: Deep research targeting second brain sources → still static MD but organically sourced.
3. **V3**: Deep research + wiki layer → raw files + index.yaml + living wiki with concepts, entities, comparisons.

### Context Engineering Principles

- Filesystem = long-term memory; RAM = short-term memory; context window = the engineering constraint.
- Token efficiency achieved through hierarchical referencing: index → wiki summaries → raw sources (only when needed).
- Every question leaves a trace in the wiki; the wiki evolves as you talk to it.

### Three Demo Examples

1. **Deep research** on a previous article about agentic AI engineering using the research skill.
2. **Ingestion** of three GitHub repositories (OpenCode, Pi, Hermes) to explore harness architectures.
3. **Simple link ingestion** of three custom URLs — works without any external setup beyond Git and curl.

## Key Quotes

> "I spent 18 months turning my second brain into my living research memory." — Paul Iusztin

> "The problem is not that you don't have context. The problem is how you leverage it in the future." — Louis-François Bouchard

> "This wiki doesn't sit on top of your entire second brain. It's scoped to your project." — Louis-François Bouchard

> "Our goal is to teach AI engineering. It's not to build the next best product." — Louis-François Bouchard

## Related Pages

- [AI Research OS Overview]([[wiki/overview]])
- [Three-Layer Architecture]([[wiki/concepts/three-layer-architecture]])
- [Research OS]([[wiki/concepts/research-os]])
- [Context Engineering]([[wiki/concepts/context-engineering]])
