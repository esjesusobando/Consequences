---
marp: true
theme: default
paginate: true
backgroundColor: white
sources:
  - wiki/overview.md
  - wiki/synthesis.md
  - wiki/sources/youtube-convierte-10994-notas.md
  - wiki/concepts/three-layer-architecture.md
  - wiki/concepts/research-os.md
  - wiki/concepts/context-engineering.md
  - wiki/concepts/memory-management.md
  - wiki/entities/paul-iusztin.md
  - wiki/entities/louis-francois-bouchard.md
  - wiki/entities/obsidian.md
  - wiki/comparisons/v1-vs-v2-vs-v3.md
prompt: "AI Research OS — Workshop summary of the three-layer system by Paul Iusztin and Louis-François Bouchard"
created: '2026-09-23'
---

# AI Research OS

### Personal research operating system

Built by Paul Iusztin (Decoding AI) & Louis-François Bouchard (Towards AI)

Workshop: [Convierte 10,994 notas en memoria](https://www.youtube.com/watch?v=ZRM_TfEZcIo)

---

## The Problem

> I'm always losing my research. My reading list is a graveyard.
> — Paul Iusztin

- 5,000+ notes in Obsidian, 5,000+ in Readwise
- 250 new files per month
- Context lost between sessions
- Static research files go stale
- No personal grounding in AI tools

---

## Three-Layer Architecture

**raw/** → Immutable source data
**index** → Reference-based catalog (`index.yaml`)
**wiki/** → LLM-derived synthesis pages

No databases. No vector stores. Just Markdown files.

---

## The Evolution: V1 → V2 → V3

**V1** — Static research MD from scraping golden links
**V2** — Deep research targeting own second brain
**V3** — Deep research + wiki layer that compounds

The wiki layer is what makes research alive and queryable.

---

## Four Pipeline Modes

| Mode | When | Cost |
|------|------|------|
| **query** | Answer questions from existing wiki | Seconds |
| **append** | Add new sources without deep research | 1-10 min |
| **deep** | Full discovery (fast/light/deep presets) | 5-40+ min |
| **init** | Bootstrap a new research topic | 1-40+ min |

---

## Context Engineering

> Filesystem = long-term memory
> RAM = short-term memory
> Context window = engineering constraint

The system must manage the relationship:
**Filesystem → RAM → Context Window → LLM**

---

## Key Entities

- **Paul Iusztin** — Founder & CEO, Decoding AI
- **Louis-François Bouchard** — Co-founder & CTO, Towards AI
- **Obsidian** — Local vault as immutable second brain
- **NotebookLM, Readwise, GitHub** — Connected knowledge sources

---

## Why Files, Not Databases?

> You don't need vector databases or knowledge graphs for personal wikis.
> — Louis-François Bouchard

Plain Markdown files, hierarchical references, token-efficient querying.

---

## Open Questions

1. How to scale beyond personal use?
2. Missing connectors (Google Drive, Notion, Slack)
3. Source provenance and memory compaction
4. How to make the system fully agent-native?

---

## The Vision

> The project is the work, and your second brain is the research.
> — Louis-François Bouchard

**A Research OS shifts the paradigm from "search and forget" to "research and compound."**

Every interaction enriches the wiki. Every question creates traces.

---

> Sources: [YouTube Workshop](https://www.youtube.com/watch?v=ZRM_TfEZcIo)
> Built with AI Research OS methodology | 2026-09-23
