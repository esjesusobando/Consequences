# Memory Versioning

Creates immutable versions of memory saves with full audit trail.

## Features

- **Immutable versions** — Each save creates a versioned snapshot
- **Audit trail** — Every version tracks: timestamp, content hash, metadata
- **Rollback** — Recover any previous version instantly
- **List & filter** — Query versions by topic_key or date

## Usage

```python
from engine import MemoryVersioningEngine

engine = MemoryVersioningEngine()

# Save with versioning
result = engine.execute(action='save',
                       topic_key='project/architecture',
                       content='# Architecture decisions...',
                       project='Think_Different')

# List versions
versions = engine.execute(action='list', topic_key='project/architecture')

# Rollback to previous version
content = engine.execute(action='rollback', version_id='ver_2026-05-31...')
```

## CLI

```bash
python engine.py list      # List all versions
python engine.py status   # Show version count
```

## Architecture

```
03_Memory_Versioning/
├── engine.py              # Main engine
├── versions/              # Versioned snapshots (*.json)
│   └── manifest.json      # Version index
└── README.md
```

Inspired by: Claude Memory Stores + MemMachine versioning
