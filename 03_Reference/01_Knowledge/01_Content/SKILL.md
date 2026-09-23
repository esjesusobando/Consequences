---
source: 'C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\03_Learning\02_Learning_Always\07_English_Learning\SKILL.md'
name: english-learning
description: Daily 15-minute English practice system — writing, reading, speaking with vocabulary tracking and compound learning.
argument-hint: "[opcional: 'beginner', 'intermediate', 'advanced' — default: intermediate]"
---

# 07_English_Learning — Daily English Practice Skill

> **Version:** 1.0 | **Date:** 2026-07-27 | **Owner:** Think_Different OS

## Purpose

Build English fluency through consistent 15-min daily practice:

1. **Writing** (5 min) — Daily prompt response
2. **Reading** (5 min) — Content + vocabulary capture
3. **Speaking** (5 min) — Describe what you're doing aloud
4. **Compound** — Weekly review + metrics tracking

---

## Trigger

```
/english [beginner|intermediate|advanced]
/english-practice
```

## Flow

### Daily Routine (15 min)

```
START: /english
  │
  ├─ WRITING (5 min): Daily prompt
  │   → Write 3-5 sentences answering the prompt
  │   → Or describe your current task in English
  │
  ├─ READING (5 min): Vocabulary capture
  │   → Read a short text (news, doc, tweet)
  │   → Capture 1-3 new words to vocabulary.json
  │   → Write a sentence per new word
  │
  └─ SPEAKING (5 min): Think aloud
      → Describe what you're working on
      → Or summarize what you just read
      → Record errors for weekly review

END: Track metrics
  → python 38_English_Metrics.py track --time 15 --words N --score S
```

### Weekly Review (Sunday)

```markdown
## Weekly Review — [Date]

### Vocabulary
- New words this week: [N]
- Cumulative: [N]
- Words I keep forgetting: [list]

### Progress
- Days practiced: [N]/7
- Total time: [N] min
- Writing score avg: [N]/100

### Observations
- [What felt easier this week?]
- [What still needs work?]
- [Adjustments for next week]
```

---

## Vocabulary Tracking

The system auto-tracks vocabulary in:

```
07_English_Learning/metrics/
├── vocabulary.json       # All captured words
├── daily_stats.json      # Per-day stats
└── weekly.json           # Weekly aggregates
```

### Vocabulary Entry Format

```json
{
  "word": "notwithstanding",
  "source": "article about AI regulation",
  "sentence": "Notwithstanding the challenges, the team proceeded.",
  "category": "formal",
  "status": "learning",
  "added": "2026-07-27",
  "reviewed_count": 0
}
```

Statuses: `learning` → `reviewing` → `known`

---

## Progression Indicators

| Level | What you can do | Focus |
|-------|----------------|-------|
| **Beginner** | Simple sentences, basic vocabulary (0-500 words) | Present tense, daily objects, simple descriptions |
| **Intermediate** | Complex ideas, work topics (500-2000 words) | Past/future tenses, opinions, professional vocab |
| **Advanced** | Nuanced expression, idioms (2000+ words) | Subtext, cultural references, persuasive writing |

---

## Metrics

```bash
# Track a session
python 38_English_Metrics.py track --time 15 --words 3 --score 75

# View streak and stats
python 38_English_Metrics.py stats

# Add vocabulary
python 38_English_Metrics.py add-word --word "notwithstanding" --source "article"
```

---

## Cross-References

- **Workflow:** `01_Personal_Os/00_Core/00_Workflows/01_Personal_Os/14_English_Practice.md`
- **Script:** `01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/38_English_Metrics.py`
- **Learning Always:** `01_Personal_Os/03_Learning/00_Shared_Org/` — part of the Learning Always ecosystem


> 🔗 Zona: [[03_Reference/01_Knowledge/README]]
