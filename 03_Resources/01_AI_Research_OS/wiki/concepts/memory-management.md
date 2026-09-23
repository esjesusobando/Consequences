---
type: concept
name: Memory Management
created: '2026-09-23'
---

# Memory Management

In the AI Research OS, memory management is the practice of ensuring that research compounds over time rather than decaying after each session. It is the difference between a static notebook and a living second brain.

## The Concept of Personal Research Memory

Paul Iusztin describes his own system: "I spent 18 months turning my second brain into my living research memory." With over 5,000 notes in Obsidian and another 5,000 in Readwise — growing 250 files per month — the challenge is not accumulating knowledge but *retrieving* it when needed.

A Research OS treats memory as a first-class concern:

- **Ingestion creates memory**: Every source added to `raw/` becomes part of the permanent record.
- **Queries create memory**: Every question asked leaves a trace in the wiki — new concepts, entities, and comparisons are generated.
- **The wiki evolves**: Unlike a static research MD file, the wiki grows richer with every interaction, reflecting not just ingested data but the *questions* that were asked.

## Compounding Over Time

The system is designed so that research compounds rather than resets:

1. **No context loss**: Because all data lives in files, nothing is lost when a conversation ends. The agent picks up exactly where it left off.
2. **Cross-project leverage**: Knowledge gained from one project (e.g., researching harness architectures) is available for the next project (e.g., building a new video). As Bouchard notes: "whenever I make a new video, I want the agent to understand the previous videos I made."
3. **Living wiki**: The wiki is "never frozen" — new custom links can be ingested, new deep research rounds run, and new questions asked at any time, all enriching the same knowledge base.

## Second Brain as Living Memory

The concept draws from Tiago Forte's PARA method (Projects, Areas, Resources, Archive) — a framework for organizing personal information. In the AI Research OS:

- **Obsidian** holds the immutable PARA-structured snapshot of the user's entire second brain.
- The **wiki layer** is scoped to specific projects, referencing the second brain through the deep research algorithm.
- **Raw sources** are piped directly to the Resources category, and only referenced into projects and areas as needed.

This separation means the LLM never touches personal notes directly — it works through the synthesized wiki layer, preserving the integrity of the original second brain while making it searchable and queryable.

## Why It Matters

Without memory management, every research session starts from zero. With it, every session builds on everything that came before. The AI Research OS transforms the second brain from a passive storage system into an active, compounding knowledge partner.

## Related Pages

- [Context Engineering]([[wiki/concepts/context-engineering]])
- [Research OS]([[wiki/concepts/research-os]])
- [Three-Layer Architecture]([[wiki/concepts/three-layer-architecture]])
