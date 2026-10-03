---
name: english-learning
description: Daily 15-minute English practice system — writing, reading, speaking, and vocabulary compounding.
triggers:
  - "english learning"
  - "practice english"
  - "aprender ingles"
  - "practicar ingles"
  - "daily english"
  - "english session"
  - "english streak"
---

# English Learning System

## Purpose
Automated daily English practice that compounds vocabulary and fluency through structured 15-minute sessions.

## Triggers
- Auto-activates at session start if no practice recorded today
- User says "practice english" / "aprender ingles" / "english session"
- Ritual de apertura detects missing daily streak

## Workflow

### 1. Daily Check (Auto)
```bash
python .agent/02_Skills/00_Personal_Os/20_English_Learning/english_metrics.py --check
```
If no session today → notify user → start workflow

### 2. Session Flow (15 min)

**Phase 1: Vocabulary (3 min)**
- Review 5 words from spaced repetition deck
- Create 1 new sentence per word

**Phase 2: Writing (5 min)**
- Write a short paragraph on a given topic (2-3 sentences)
- AI reviews grammar and suggests improvements

**Phase 3: Reading (4 min)**
- Read a short article or excerpt
- Answer 2-3 comprehension questions

**Phase 4: Speaking Prep (3 min)**
- Choose a conversation scenario
- Prepare key phrases for the scenario

### 3. Metrics Tracking
```bash
python .agent/02_Skills/00_Personal_Os/20_English_Learning/english_metrics.py --log \
  --words-new 5 \
  --words-reviewed 5 \
  --writing-min 5 \
  --reading-min 4 \
  --streak-day 1
```

### 4. Compounding
- Save new vocabulary to `01_Memory/00_Context_LLM/04_Vocabulary/`
- Add to spaced repetition deck
- Update streak counter

## Metrics Persisted
- `03_Learning/04_Telemetry/english_metrics.json`
  - words_today, words_total
  - streak_days, longest_streak
  - minutes_today, minutes_total
  - sessions_completed

## Integration
- **Learning Always**: vocabulary compounds daily
- **Hillary**: quick capture → vocabulary add
- **Ritual Apertura**: auto-check streak → prompt practice

## Scripts
| Script | Purpose |
|--------|---------|
| `english_metrics.py` | Log metrics, check streak, generate reports |
| `vocabulary.py` | Spaced repetition deck management |
| `prompts.py` | Daily writing/reading prompts generator |

---

*Think Different PersonalOS v5.0 — English Learning System*
