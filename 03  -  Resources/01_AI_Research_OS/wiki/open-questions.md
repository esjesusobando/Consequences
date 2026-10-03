---
type: open-questions
created: '2026-09-23'
---

# Open Questions

This page catalogs open questions and acknowledged gaps raised by the AI Research OS research. These represent areas for future work, extension, or deeper investigation.

## Missing Connectors

The system currently supports Obsidian, Readwise, Notebook LM, GitHub, YouTube, Google Drive, and Notion. However, the following connectors are identified as missing:

- **Slack** — team communication channels contain valuable research discussions
- **Additional productivity tools** — more source types could be integrated
- **Custom connectors** — any service with an API could potentially be plugged in

The speakers note these weren't added because they don't serve the core workflow of either Paul or Louis-François, and the focus is on teaching principles rather than building a complete product.

## Source Quality and Provenance

- **How to detect outdated or weak sources?** The system currently ingests everything equally — there's no mechanism to automatically flag stale or low-quality sources.
- **Better source ranking** — the current ranking algorithm compares sources against the topic, but more sophisticated provenance tracking could improve trustworthiness.
- **Reuse tracking** — how to know which sources have already been leveraged efficiently?

## Memory Compaction

- **Compaction is a known hard problem** — Louis-François acknowledges that "memory compaction is a big issue and very complicated in general to manage correctly."
- **State of the art is progressing rapidly** — what works today may become obsolete quickly.
- **How to compress long-term memory without losing fidelity?**

## Scalability Beyond Personal Use

- **Can this work for teams, not just individuals?** The system is currently designed for personal second brains.
- **How to handle conflicting knowledge across team members?**
- **What's the scaling limit before vector databases or more sophisticated infrastructure become necessary?**

## UX and Productization

- **The system is a builder workflow** — used through Codex/Claude Code in the terminal, not a polished UI.
- **How to make it accessible to non-technical users?**
- **Is there a middle ground between "bare terminal" and "polished product"?**

## Wiki Evolution and Trust

- **How to verify wiki accuracy?** LLM-generated wiki pages could contain hallucinations.
- **How to track what the LLM added vs. what was originally ingested?**
- **Can the wiki become a trust graph — ranking sources by reliability over time?**

## Further Research Directions

- **Stronger linting** for wiki pages
- **Better memory compaction** techniques
- **Source provenance** and ranking systems
- **The Agent Engineering course** ([Towards AI Academy](https://towards.ai/academy)) builds a similar deep research system with a writing and research agent — potentially addressing some of these gaps

## Related Pages

- [[03  -  Resources/01_AI_Research_OS/wiki/overview|AI Research OS Overview]]
- [[03  -  Resources/01_AI_Research_OS/wiki/concepts/research-os|Research OS]]
- [[03  -  Resources/01_AI_Research_OS/wiki/sources/youtube-convierte-10994-notas|Sources]]
