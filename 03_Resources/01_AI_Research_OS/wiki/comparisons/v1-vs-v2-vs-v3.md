---
type: comparison
name: System Evolution V1 vs V2 vs V3
created: '2026-09-23'
---

# System Evolution: V1 vs V2 vs V3

The AI Research OS evolved through three versions, each addressing a limitation of the previous version. This comparison traces the progression from a simple static research tool to a living, compounding knowledge system.

## V1: Static Research MD

| Aspect | Details |
|---|---|
| **Target** | Public web only |
| **Input** | Topic + handpicked "golden links" |
| **Process** | Deep research algorithm: orchestrator agent generates queries, sub-agents fetch resources via Gemini/Google, rank and summarize |
| **Output** | Single static research MD file |
| **Use case** | Course lessons (35 generated quickly) |
| **Strength** | Fast, effective for one-off research |
| **Weakness** | Generic — requires manual golden link curation; static output goes stale |

V1 proved the deep research algorithm worked but revealed its limitations: the output was a flat file that had to be regenerated from scratch for any follow-up question, and it only targeted public web sources.

## V2: Second Brain Targeting

| Aspect | Details |
|---|---|
| **Target** | User's own second brain (Obsidian, Readwise, Notebook LM, GitHub) |
| **Input** | Topic only (golden links emerge organically from personal notes) |
| **Process** | Same deep research algorithm but plugged into personal sources instead of public web |
| **Output** | Still a single static research MD file |
| **Strength** | Personalized — no manual golden link curation needed |
| **Weakness** | Static output still goes stale; expensive to regenerate |

V2 solved the personalization problem — the system now drew from the user's own accumulated knowledge. But the fundamental limitation remained: the output was a static file that didn't evolve.

## V3: Deep Research + Wiki Layer

| Aspect | Details |
|---|---|
| **Target** | Second brain + public web + any source (YouTube, Google Drive, Notion, custom URLs) |
| **Input** | Topic or sources; any custom links can be ingested |
| **Process** | Deep research algorithm + wiki generation: raw files stored individually, index.yaml created, wiki derivatives generated |
| **Output** | Living wiki with concepts, entities, comparisons, and source summaries |
| **Strength** | Wiki evolves with every question; token-efficient retrieval; personal + scalable |
| **Weakness** | More setup required; still a builder workflow (no polished UI) |

V3 introduced the three-layer architecture and the living wiki. The system is no longer about producing a file — it's about building a knowledge base that grows with usage.

## Key Differences at a Glance

| Feature | V1 | V2 | V3 |
|---|---|---|---|
| **Output type** | Static MD file | Static MD file | Living wiki + raw + index |
| **Sources** | Public web | Second brain | Second brain + web + any |
| **Golden links** | Manual | Organic | Not needed |
| **Evolution** | None | None | Continuous |
| **Setup complexity** | Low | Medium | Higher |
| **Query capability** | Read file | Read file | Query wiki + index |
| **Token efficiency** | N/A | N/A | High (hierarchical retrieval) |

## The Trajectory

The evolution from V1 to V3 reflects a shift from "research as a one-time output" to "research as a living system." Each version added complexity only where it solved a real problem — the hallmark of the system's design philosophy.

## Related Pages

- [AI Research OS Overview]([[wiki/overview]])
- [Research OS]([[wiki/concepts/research-os]])
- [Sources]([[wiki/sources/youtube-convierte-10994-notas]])
