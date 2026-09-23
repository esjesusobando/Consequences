---
source: 'C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\01_Research\token-optimization.md'
---
# Token Optimization Guide — Think Different OS

**Version:** 1.0 | **Last updated:** 2026-07-27

---

## Overview

Strategies to minimize token consumption across all OS interactions,
sessions, and automation workflows.

---

## 1. Phase Gates That Save Tokens

### Social Media Approval Gate (Phase 3.5 — Learning Always v1.2)
- Posts are NOT generated automatically
- Saves **3,000—5,000 tokens** per workflow run when not publishing
- Templates stored in `.claude/skills/04_Automatizacion/20_Gamma_Presentations/templates/social/` for reuse

### Phase 0 Classification Gate
- Classify content as `RAPIDO` or `COMPLETO` before processing
- `RAPIDO` mode: skip deep analysis, use templates
- `COMPLETO` mode: full 8-deliverable pipeline

---

## 2. Skill Design Principles (Token-Aware)

| Principle | Token Savings |
|-----------|---------------|
| Skills use `description` frontmatter for quick routing | Avoids loading full SKILL.md for non-matching triggers |
| Short triggers (`/transcribe` not `/learn-and-transcode-audio-file`) | Faster matching, less context |
| Skills reference existing OS components (no duplication) | No redundant knowledge loaded |
| Consolidated skills (e.g. `improve-skill` covers auditing + tagging) | Fewer skills to load = fewer tokens |

---

## 3. Workflow Token Budgets

| Workflow | Estimated Tokens | Optimization |
|----------|-----------------|--------------|
| Learning Always RAPIDO | ~500 | Phase 0 gate skips if not relevant |
| Learning Always COMPLETO | ~8,000 | Phase 3.5 gate saves ~4,000 if not publishing |
| OS Self-Improvement pass | ~2,000 | Only runs on significant new learnings |
| Competitor Price Check | ~300 | Single fetch + diff, no deep analysis |
| Interview Synthesizer | ~1,500 | Batch mode: ~100 per interview |
| Whisper Transcription | ~400 per file | Model `base` for speed, `large` only if accuracy critical |
| Gamma Presentation | ~600 per deck | Minimal template, no style bloat |

---

## 4. Registry Token Savings

The skill registry (`.atl/skill-registry.md`) uses a compact index format:
- Each skill gets one row (skill name, trigger, scope, path)
- Sub-agents read the registry to select relevant skills, then load only those SKILL.md files
- This avoids loading all 400+ skills into context

### How to stay token-efficient:
1. Update registry with `gentle-ai skill-registry refresh` when adding skills
2. Pass exact SKILL.md paths to sub-agents, not the full registry
3. Cache skill index in session — don't re-read registry every turn

---

## 5. Quick Savings Tips

- **Don't load skills that don't match the trigger** — the registry handles routing
- **Use `RAPIDO` mode** for simple tasks (single deliverable, no deep analysis)
- **Batch operations** — synthesize 5 interviews in one pass, not 5 separate ones
- **Skip social media generation** unless explicitly asked (Phase 3.5 gate)
- **Re-use templates** — don't regenerate from scratch when a template exists
- **Compact skills** — audit-tagging workflow updates all skills in one pass, not 406 individual writes

---

## 6. New Skills Added (2026-07-27)

All 7 gap-closing skills follow token-conscious design:

| Skill | Token Impact |
|-------|-------------|
| `claude-code-installer` | ~200 (one-shot setup) |
| `whisper-transcriber` | ~400 per file |
| `gamma-presentations` | ~600 per deck |
| `competitor-pricing-watcher` | ~300 per check (scheduled, not on-demand) |
| `customer-interview-synthesizer` | ~1,500 per batch |
| `os-self-improvement` (meta) | ~2,000 per audit pass |
| `skill-audit-tag` (workflow) | ~1,000 (one-pass across all skills) |

---

*Think Different OS v5.1 — Token Optimization Reference*


> 🔗 Zona: [[03_Resources/06_From_Think_Different/README]]
