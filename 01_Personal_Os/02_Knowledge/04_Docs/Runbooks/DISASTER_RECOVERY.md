# Disaster Recovery Runbook — PersonalOS Engram

> **Owner:** Sebastian
> **Last Updated:** 2026-07-14
> **Severity:** CRITICAL — Data loss scenario
> **Estimated Recovery Time:** 10-30 minutes

---

## Prerequisites

- Python 3.10+ with `sqlite3` module (stdlib)
- Access to `~/.engram/engram.db`
- Access to snapshot files in `07_Archive/04_Engram_Snapshots/`
- Engram binary at `~/go/bin/engram.exe`

## Contacts

| Role | Name | Channel |
|------|------|---------|
| System Owner | Sebastian | Direct |

---

## Scenario A: Restore from Snapshot

**When to use:** Engram database is corrupted, lost, or needs to be restored to a previous state.

### Step 1: Assess Damage

```bash
# Check if DB is readable
python -c "import sqlite3; c=sqlite3.connect('$HOME/.engram/engram.db'); print(c.execute('SELECT COUNT(*) FROM observations').fetchone()[0])"

# If this fails → proceed to Step 2
```

### Step 2: Find Latest Valid Snapshot

```bash
ls -lt 01_Personal_Os/07_Archive/04_Engram_Snapshots/snapshot_*.json.gz
```

### Step 3: Verify Snapshot Integrity

```bash
python engram_verify.py --snapshot 01_Personal_Os/07_Archive/04_Engram_Snapshots/<latest>.json.gz --verbose
```

**Expected:** `valid: true, checksum_ok: true`

### Step 4: Restore (Merge Strategy)

```bash
# Dry run first
python engram_restore.py --snapshot <file> --strategy merge --dry-run --verbose

# Actual restore (creates backup automatically)
python engram_restore.py --snapshot <file> --strategy merge --verbose
```

### Step 5: Post-Restore Verification

```bash
python session_init_test.py --verbose
```

**Expected:** All CRITICAL tests pass.

---

## Scenario B: Full Database Rebuild

**When to use:** Complete data loss — restore from the most recent snapshot, overwriting everything.

```bash
# Same as Scenario A, Step 4, but with replace strategy
python engram_restore.py --snapshot <file> --strategy replace --verbose
```

> ⚠️ **Warning:** Replace strategy deletes all existing data before restoring.

---

## Scenario C: Export Fresh Snapshot

**When to use:** Proactive backup, before major changes, or as part of maintenance.

```bash
python engram_snapshot.py --verbose
```

**Output:** `07_Archive/04_Engram_Snapshots/snapshot_YYYY-MM-DD_HHMMSS.json.gz`

---

## Verification Checklist

After any recovery:

- [ ] `engram_verify.py` returns `valid: true`
- [ ] `session_init_test.py --verbose` — all CRITICAL tests pass
- [ ] `engram_search test --limit 3` returns expected results
- [ ] `engram stats` shows correct observation count

---

## Data Locations

| Artifact | Path |
|----------|------|
| Engram DB | `~/.engram/engram.db` |
| Snapshots | `01_Personal_Os/07_Archive/04_Engram_Snapshots/` |
| Snapshot State | `01_Personal_Os/07_Archive/04_Engram_Snapshots/engram_snapshot_state.json` |
| Benchmark Baselines | `01_Personal_Os/03_Learning/04_Telemetry/benchmark_baseline.json` |
| Scripts | `01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/` |
