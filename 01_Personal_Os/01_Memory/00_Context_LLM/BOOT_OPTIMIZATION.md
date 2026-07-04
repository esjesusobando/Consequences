# BOOT_OPTIMIZATION.md — Adaptive Boot Methodology

> How conditional context loading reduces tokens and improves boot speed.

---

## How It Works

Traditional boot loads ALL context for every agent (~50K tokens).
Adaptive boot loads ONLY relevant context per agent type (~10-15K tokens).

**Savings: 60-70% token reduction per boot.**

---

## Agent Type Detection

The system detects agent type from:
1. Agent config file (if loaded)
2. Agent name (keywords: admin, finance, hr, marketing, content)
3. Task description (keywords: onboarding, reporting, etc.)

---

## Context Profiles

Defined in `01_Personal_Os/00_Core/01_Rules/context_profiles.yaml`

Each profile specifies:
- **required**: Always loaded for this agent type
- **optional**: Loaded on demand
- **excluded**: Never loaded for this agent type

---

## Usage

### From Command Line
```bash
# Get boot plan for admin agent
python 01_Personal_Os/01_Memory/00_Context_LLM/adaptive_boot.py --agent "Admin Agent"

# Get boot plan with task context
python 01_Personal_Os/01_Memory/00_Context_LLM/adaptive_boot.py --agent "Admin" --task "onboarding"

# JSON output (for programmatic use)
python 01_Personal_Os/01_Memory/00_Context_LLM/adaptive_boot.py --agent "Finance" --json
```

### In AGENTS.md Boot Protocol
```
# After step 2 (reading goals/backlog):
python 01_Personal_Os/01_Memory/00_Context_LLM/adaptive_boot.py --agent "$AGENT_NAME" --json
# Then load only the files in the JSON output's "required" and "boost" arrays
```

---

## Lazy Loading

Optional context is loaded on-demand via `lazy_loader.py`:

```python
from lazy_loader import load_file, load_context_batch, get_cache_stats

# Load single file (cached after first access)
result = load_file("01_Personal_Os/02_Knowledge/10_Shared_Org/playbooks/01-onboarding-nuevo-cliente.md")

# Load multiple files
results = load_context_batch(["file1.md", "file2.md"])

# Check cache stats
stats = get_cache_stats()
```

---

## Adding New Agent Types

1. Edit `01_Personal_Os/00_Core/01_Rules/context_profiles.yaml`
2. Add new entry under agent profiles
3. Specify required, optional, and excluded files
4. Test with `adaptive_boot.py --agent "New Agent"`

---

## Metrics

Boot metrics are logged to `01_Personal_Os/01_Memory/00_Context_LLM/boot_metrics.json`:
- Files loaded per boot
- Total size in bytes/KB
- Lazy-loaded count
- Timestamp

Review periodically to optimize profiles.

---

## Philosophy

> "Load only what you need, when you need it."

This reduces:
- Token waste (60-70% savings)
- Boot time (fewer files to read)
- Context pollution (only relevant info)

While maintaining:
- Full capability (optional files load on demand)
- Backward compatibility (fallback to full load if detection fails)
- Simple debugging (clear plan output)