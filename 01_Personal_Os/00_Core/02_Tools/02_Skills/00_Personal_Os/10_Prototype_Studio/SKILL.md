---
name: prototype-studio
description: "AI Native prototype creation — from idea to tested prototype in minutes"
triggers:
  - "crear prototipo"
  - "build prototype"
  - "demo feature"
  - "labs page"
  - "test idea"
  - "validar idea"
  - "prototype studio"
  - "labs page feedback"
scope: user
globs: ["**/*.py", "**/*.md", "**/*.html"]
sota_upgraded: true
---

# 🧪 PROTOTYPE STUDIO — AI Native Prototype Creation

## Essence

Prototype Studio is the AI Native prototyping pipeline for Think Different PersonalOS. Modeled after Theo Taba's Labs Page model (LCA), it compresses the traditional weeks-long prototype cycle into minutes. Idea → Hypothesis → Build → Test → Synthesize → V2 Plan — one command, full pipeline.

**This is NOT a mockup generator.** It produces functional, interactive HTML prototypes that real users can test and provide feedback on.

**Pipeline Home:** `01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/prototype_studio.py`
**Skill Home:** `01_Personal_Os/00_Core/02_Tools/02_Skills/00_Personal_Os/21_Prototype_Studio/`

---

## The Labs Page Model (Theo Taba / LCA)

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│  HYPOTHESIS  │────▶│ BUILD PROTOTYPE  │────▶│ USABILITY    │
│  (What & Why)│     │ (Interactive HTML)│     │ TEST         │
└──────────────┘     └──────────────────┘     └──────────────┘
                                                      │
                              ┌────────────────────────┘
                              ▼
                     ┌──────────────────┐     ┌──────────────┐
                     │ FEEDBACK         │────▶│ V2 PLAN      │
                     │ SYNTHESIS        │     │ (Next iter)  │
                     └──────────────────┘     └──────────────┘
```

**Core Principle:** Every idea deserves a hypothesis, a build, and real user feedback before more than 30 minutes of work.

---

## The 5-Step Skill Chain

### Step 1: Hypothesis Generator
Transforms a raw idea into a structured hypothesis with:
- Problem statement (one sentence)
- Target user persona
- Success metrics (how we know it works)
- Assumptions to validate
- Acceptance criteria (pass/fail)

### Step 2: Prototype Builder
Builds a functional, self-contained HTML prototype:
- Interactive (not a screenshot — buttons work, forms submit)
- Brand-calibrated (Spotify, custom, or generic design system)
- Mobile-responsive
- Zero external dependencies (self-contained HTML/CSS/JS)

### Step 3: Usability Test Generator
Creates a structured test from the prototype:
- 5-8 questions (mix of task-based + satisfaction)
- Task scenarios ("Can you complete X?")
- NPS-style satisfaction scoring
- Open-ended feedback fields
- Output: interactive HTML test page

### Step 4: Feedback Collector & Synthesizer
Collects responses, then synthesizes:
- Groups feedback by theme (usability, design, content, features)
- Calculates satisfaction scores
- Identifies top 3 strengths + top 3 weaknesses
- Generates lessons learned

### Step 5: V2 Planner
Takes synthesis and generates actionable next steps:
- Prioritized fixes (must-have / should-have / nice-to-have)
- New feature ideas from feedback
- Design improvements
- Output: V2 plan markdown

---

## CLI Reference

### Full Pipeline (Skill Chain)
```bash
python prototype_studio.py run --idea "daily playlist for Spotify" --brand spotify --style minimalist
```

### Individual Steps
```bash
python prototype_studio.py hypothesis --idea "daily playlist"
python prototype_studio.py build --hypothesis-id "hyp_xxx" --brand spotify
python prototype_studio.py test --prototype-id "proto_xxx"
python prototype_studio.py synthesize --prototype-id "proto_xxx"
python prototype_studio.py v2 --prototype-id "proto_xxx"
```

### Labs Page (Feedback Collection)
```bash
python prototype_studio.py labs --prototype-id "proto_xxx"
python prototype_studio.py collect --prototype-id "proto_xxx" --min-responses 5
python prototype_studio.py report --prototype-id "proto_xxx"
```

### Utilities
```bash
python prototype_studio.py list
python prototype_studio.py --test
python prototype_studio.py --verify-cycle
```

---

## Design Systems

| System        | Colors              | Font        | Usage                  |
|---------------|---------------------|-------------|------------------------|
| `spotify`     | Green #1DB954/Black | Circular    | Spotify-style dark UI  |
| `minimalist`  | White/Gray/Black    | System      | Clean, no distractions |
| `corporate`   | Blue/White/Gray     | Inter       | Professional B2B       |
| `playful`     | Rainbow accent      | Nunito      | Consumer/fun apps      |

---

## State Persistence

| Component       | Location                                               |
|----------------|--------------------------------------------------------|
| Pipeline state  | `03_Learning/04_Telemetry/prototype_studio_state.json` |
| Prototype files | `.cache/prototypes/prototype_{id}.html`                |
| Hypotheses      | `.cache/prototypes/hypothesis_{id}.json`               |
| Test pages      | `.cache/prototypes/test_{id}.html`                     |
| Feedback        | `03_Learning/04_Telemetry/prototype_feedback_{id}.json`|
| Synthesis       | `.cache/prototypes/synthesis_{id}.json` + `.md`        |
| V2 Plans        | `.cache/prototypes/v2_plan_{id}.md`                    |

---

## ID Format

All IDs use nanoid format: `{name}_{timestamp}_{random8}`
Example: `hyp_20260714_a1b2c3d4`

---

## Pre-built Chains

Default chain YAML is in `prototype_chains/prototype_chain_default.yaml`.
Load custom chains with `--chain <path>`.

---

## ⚠️ Gotchas

### HTML prototypes must be self-contained
> Generated HTML never loads external CSS/JS. Everything is inline.
> This is intentional — prototypes must work offline and shareable as single files.

### Feedback synthesis requires minimum responses
> With fewer than 5 responses, synthesis is unreliable.
> Use `--min-responses 5` as the default threshold.

### State file is append-only during pipeline runs
> Pipeline state accumulates. Use `prototype_studio.py list` to see all prototypes.
> Old prototypes are never auto-deleted.

---

## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

1. **Plan-First (CoT):** Before generating code or responses, explain your logic step by step.
2. **No Data Loss:** Never delete existing prototype data when creating new ones.
3. **Strict Validation:** Verify all JSON outputs parse correctly before writing.
4. **Context Awareness:** Maintain coherence with hypothesis → prototype → test → feedback chain.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-07-14*
