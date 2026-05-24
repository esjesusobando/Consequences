# Voice Profile

Extracts and maintains user writing style fingerprint.

## Features

- **Sentence analysis** — Length, structure, complexity
- **Punctuation patterns** — Usage habits for .,;:!? etc.
- **Hedging detection** — maybe, might, probably, seems
- **Register detection** — Formal vs informal, first-person usage
- **Sample library** — Stores raw samples for analysis

## Output

Generates `me/VOICE_PROFILE.md` with:

- Average sentence/word length
- Punctuation habits
- Hedging ratio
- First-person usage patterns

## Usage

```python
from engine import VoiceProfileEngine

engine = VoiceProfileEngine()

# Add a writing sample
engine.execute(action='add_sample',
              text='Your writing content here...',
              label='email')

# Build profile from all samples
result = engine.execute(action='build')
```

Inspired by: agentic-cortex Voice Profile (Chapter 6)
