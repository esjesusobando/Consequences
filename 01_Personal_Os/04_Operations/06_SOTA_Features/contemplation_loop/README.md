# Contemplation Loop (Dreaming)

Between-session improvement engine. Reviews memories, extracts patterns, cleans stale entries.

## Features

- **Memory analysis** — Scans recent memories for patterns
- **Pattern extraction** — Identifies actionable insights
- **Stale cleanup** — Removes entries >90 days old with no updates
- **Scheduled runs** — Configure via cron in config.yaml

## Inspiration

- Claude Managed Agents "Dreaming" (May 2026)
- ArgentOS contemplation loop

## Usage

```python
from engine import ContemplationLoopEngine

engine = ContemplationLoopEngine()
result = engine.execute()
# Returns: patterns found, cleanup stats, timestamp
```

## Schedule

Default: `0 3 * * *` (3am daily) — configure in config.yaml
