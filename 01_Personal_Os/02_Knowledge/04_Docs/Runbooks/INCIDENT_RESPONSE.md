# Incident Response Runbook — PersonalOS

> **Owner:** Sebastian  
> **Last Updated:** 2026-07-14  
> **Severity:** Use for system failures and outages  
> **Estimated Response Time:** 5-30 minutes per scenario

---

## Scenario 1: Engram Down

**Symptoms:** `engram stats` fails, memory operations timeout, `mem_search` returns errors.

### Steps

```bash
# 1. Check if the DB exists and is readable
python -c "import sqlite3; c=sqlite3.connect('$HOME/.engram/engram.db'); print(c.execute('SELECT COUNT(*) FROM observations').fetchone()[0])"

# 2. If DB is corrupted → restore from snapshot
python engram_restore.py --snapshot <latest_snapshot> --strategy merge --verbose

# 3. If DB is missing → full rebuild
python engram_restore.py --snapshot <latest_snapshot> --strategy replace --verbose

# 4. Verify recovery
python engram_verify.py --verbose
python session_init_test.py --verbose
```

### Escalation

If restore fails: check `~/.engram/` permissions, verify disk space, review Engram logs.

---

## Scenario 2: Validators Broken

**Symptoms:** `python certify_10_10.py --verbose` shows FAIL for one or more validators.

### Steps

1. Run with `--verbose` to identify the failing validator
2. Run the failing validator manually to get full error output:
   ```bash
   cd 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os
   python <failing_script>.py --verbose  # or --test
   ```
3. Common causes:
   - **config_paths FAIL**: Check `PERSONAL_OS_ROOT` env var, verify `00_Winter_is_Coming` exists
   - **sync_copies FAIL**: Run `python sync_copies.py --apply` to resync
   - **timeout FAIL**: System under load; increase timeout or retry
4. Fix the root cause, re-run certification

---

## Scenario 3: Git Corrupt

**Symptoms:** `git status` errors, pack file corruption, unable to commit.

### Steps

```bash
# 1. Check status
git status

# 2. Attempt auto-repair
git fsck --full
git gc --aggressive

# 3. If pack file is corrupt
git fetch origin
git reset --hard origin/main

# 4. Nuclear option — reclone
# BACKUP YOUR WORK FIRST
git clone <repo_url> Think_Different_fresh
```

---

## Scenario 4: Disk Full

**Symptoms:** `No space left on device` errors, cannot write files.

### Steps

```bash
# 1. Identify large files
du -sh 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/__pycache__/*
du -sh .cache/
du -sh 01_Personal_Os/07_Archive/04_Engram_Snapshots/

# 2. Clean caches
rm -rf 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/__pycache__/
rm -rf .cache/*.tmp

# 3. Prune old snapshots (keep last 5)
ls -lt 01_Personal_Os/07_Archive/04_Engram_Snapshots/snapshot_*.json.gz | tail -n +6 | xargs rm

# 4. Check disk space
df -h .
```

---

## Scenario 5: API Keys Rotated

**Symptoms:** Authentication failures in API calls, 401/403 errors.

### Steps

1. Identify which keys were rotated (check `.env` or environment)
2. Update the rotated key in the appropriate location:
   - `.env` file in project root
   - System environment variables
   - MCP config if applicable
3. Test the key:
   ```bash
   python 18_Telemetry_Hub.py --morning  # exercises API connections
   ```
4. Verify no secrets were committed to git:
   ```bash
   git log --oneline --all -20  # check recent commits
   ```

---

## Contacts

| Role | When to Reach Out |
|------|-------------------|
| System Owner | All scenarios — report and escalate |

---

## Post-Incident

After resolving any incident:
1. Run `python certify_10_10.py --verbose` to confirm system health
2. Create a snapshot: `python engram_snapshot.py --verbose`
3. Document what happened in the session notes
