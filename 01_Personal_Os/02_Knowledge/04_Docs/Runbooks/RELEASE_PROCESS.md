# Release Process Runbook — PersonalOS

> **Owner:** Sebastian  
> **Last Updated:** 2026-07-14  
> **Audience:** Anyone shipping changes to PersonalOS

---

## Versioning (SemVer)

PersonalOS uses Semantic Versioning: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes to data structures, API contracts, or config format
- **MINOR**: New features, skills, or validators (backward-compatible)
- **PATCH**: Bug fixes, documentation, refactoring

Current version is tracked in `00_Winter_is_Coming/AGENTS.md` header.

---

## Changelog Format

Update the changelog in the relevant script or in `HUB_CATALOG.md`:

```markdown
## [1.2.0] - 2026-07-14

### Added
- certify_10_10.py — master certification validator
- 6 operational runbooks

### Fixed
- sync_copies drift detection for Windows paths

### Changed
- telemetry output format to JSON
```

---

## Tag Creation

```bash
# Create a lightweight tag
git tag v1.2.0

# Create an annotated tag (preferred)
git tag -a v1.2.0 -m "Sprint 5: Polish & Certification"

# Push tags
git push origin v1.2.0
```

---

## Deploy Steps

1. **Pre-flight**: Run full certification
   ```bash
   python certify_10_10.py --verbose
   # All critical validators must PASS
   ```

2. **Stage changes**
   ```bash
   git add -A
   git status  # review what's staged
   ```

3. **Commit with conventional format**
   ```bash
   git commit -m "feat: add certify_10_10.py and operational runbooks"
   ```

4. **Push**
   ```bash
   git push origin main
   ```

5. **Tag**
   ```bash
   git tag -a vX.Y.Z -m "Release description"
   git push origin vX.Y.Z
   ```

6. **Post-deploy verification**
   ```bash
   python session_init_test.py --verbose
   python config_paths.py --validate
   ```

---

## Rollback Procedure

```bash
# 1. Identify the commit to rollback to
git log --oneline -10

# 2. Revert (creates a new commit that undoes changes)
git revert <commit_hash>

# 3. Or reset (destructive — use only if revert is not possible)
git reset --hard <commit_hash>
git push --force-with-lease origin main

# 4. Re-tag if needed
git tag -d vX.Y.Z
git push origin :refs/tags/vX.Y.Z

# 5. Verify system health
python certify_10_10.py --verbose
```

---

## Checklist

- [ ] All validators pass (`certify_10_10.py --verbose`)
- [ ] Changelog updated
- [ ] Commit follows conventional format
- [ ] Tag created with description
- [ ] Post-deploy verification passes
