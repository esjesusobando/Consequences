# Feedback Loop

User corrections become persistent behavioral rules.

## How It Works

1. User corrects AI behavior (in conversation or via GGA)
2. Correction saved with: what was wrong, what's correct, why
3. Rule stored with scope (global/project/file/agent)
4. AI reads rules at session start and applies them

## Usage

```python
from engine import FeedbackLoopEngine

engine = FeedbackLoopEngine()

# Add a feedback rule
result = engine.execute(action='add',
                       correction="Don't use headers mid-sentence",
                       rule="Use inline code for technical terms",
                       rationale="Breaks reading flow in conversational text",
                       scope="writing")

# Get applicable rules
rules = engine.execute(action='get', scope='global')
```

## Rule Structure

```json
{
  "id": "rule_2026-05-31...",
  "correction": "What was wrong",
  "rule": "What to do instead",
  "rationale": "Why this is correct",
  "scope": "global|project|file|agent",
  "confidence": "high|medium|low",
  "times_applied": 0
}
```

Inspired by: agentic-cortex Chapter 8
