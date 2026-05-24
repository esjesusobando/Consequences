# Ambient Intelligence

Screenpipe integration for automatic context capture.

## Features

- **Activity capture** — Screen, audio, window, keystroke logging
- **Context cache** — Hourly aggregated activity summaries
- **Recent context** — Get last N hours of activities
- **Context injection** — Build natural language summary for AI

## Requirements

Requires Screenpipe MCP or equivalent screen recording system.

## Usage

```python
from engine import AmbientIntelligenceEngine

engine = AmbientIntelligenceEngine()

# Capture an activity
engine.execute(action='capture',
               activity_type='screen',
               content='Working on SOTA module',
               metadata={'window': 'Claude Code'})

# Get recent context
context = engine.execute(action='context', hours=2)

# Build summary
summary = context['summary']
```

## Activity Types

- `screen` — Screen capture text
- `audio` — Audio transcription
- `window` — Active window change
- `keystroke` — Key pattern (if enabled)

Inspired by: ArgentOS + agentic-cortex ambient intelligence
