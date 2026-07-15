# Performance Tuning Runbook — PersonalOS

> **Owner:** Sebastian  
> **Last Updated:** 2026-07-14  
> **Audience:** Anyone optimizing system performance

---

## How to Read the Perf Report

Run the benchmark baseline:

```bash
python benchmark_baseline.py --verbose
```

The report outputs metrics for:
- **Path validation time** — how fast config_paths resolves all paths
- **Validator execution time** — total time for all validators
- **Subprocess overhead** — time spent spawning processes
- **Disk I/O** — read/write latency for key directories

### Reading the Numbers

| Metric | Good | Acceptable | Action Needed |
|--------|------|------------|---------------|
| Path validation | < 1s | 1-3s | > 3s: check disk or antivirus |
| Total certification | < 30s | 30-60s | > 60s: check individual validators |
| Subprocess overhead | < 5s | 5-15s | > 15s: reduce subprocess count |

---

## Top 5 Common Optimizations

### 1. Cache Path Resolution

```python
# Instead of recalculating paths every call:
from config_paths import ROOT_DIR  # cached at import time
```

`config_paths.py` caches all paths at module load. Don't re-resolve.

### 2. Skip Non-Critical Validators

In `certify_10_10.py`, mark slow non-critical validators:

```python
{"name": "telemetry", "critical": False}  # won't block certification
```

### 3. Reduce Subprocess Spawning

Batch operations where possible. The `parallel_audit` script already handles this internally.

### 4. Limit Filesystem Scans

Use `Path.glob()` with specific patterns instead of `os.walk()`:

```python
# Slow
for root, dirs, files in os.walk(path): ...

# Fast
for p in path.glob("*.py"): ...
```

### 5. Use JSON Over Text Parsing

When passing data between scripts, use JSON files in `CACHE_DIR`:

```python
from config_paths import CACHE_DIR
cache_file = CACHE_DIR / "validator_cache.json"
```

---

## Token Economy Rules

- Keep prompts under 2000 tokens for routine operations
- Use `--json` output for machine parsing, not `--verbose`
- Cache repeated API responses in TELEMETRY_DIR
- Compress large reports with gzip before storing

---

## Cache Management

```bash
# View cache size
du -sh .cache/

# Clear expired cache (> 7 days)
find .cache/ -name "*.tmp" -mtime +7 -delete

# Clear all cache (safe — will be regenerated)
rm -rf .cache/*
```

Cache is stored in `ROOT_DIR/.cache/`. It's safe to delete — validators regenerate on next run.

---

## Quick Diagnostic

```bash
# One-shot health check
python session_init_test.py --verbose && python config_paths.py --validate && echo "System healthy"
```
