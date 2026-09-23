---
source: 'C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\02_Docs\smoke-vs-unit-test-counts-2026-07-14.md'
sync_source: "C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\02_Docs\smoke-vs-unit-test-counts-2026-07-14.md"
sync_date: "2026-08-01T00:55:45.991697"
sync_updated: true
title: "Smoke vs Unit Test Count Documentation Mismatch"
---

# Smoke vs Unit Test Count Documentation Mismatch

## Problem

Documentation listed test counts that didn't match what `--test` output showed, because the docs conflated two different test suites: smoke tests (built-in quick checks) and unit tests (comprehensive separate files).

## Symptoms

- `skill_chain.py --test` showed "16/16 passed" but docs said "21/21"
- `curation_filter.py --test` showed "6 PASS" but docs said "11/11"
- `output_eval.py --test` showed "10/10" but docs said "26/26"
- Code reviewer flagged this as P0: "Factual claim is provably false"

## What Didn't Work

- Initial documentation listed only unit test counts (from `test_*.py` files) without clarifying they were separate from the `--test` flag output
- The `--test` flag runs built-in smoke tests, not the comprehensive unit test suite
- No distinction was made between the two test types in any README

## Solution

Added explicit "Smoke" and "Unit" columns to all test documentation tables:

```markdown
| Script | Smoke | Unit | Propósito |
|--------|-------|------|-----------|
| `skill_chain.py` | 16/16 | 21/21 | Chain execution engine |
```

Plus a legend explaining the difference:

```markdown
> **Smoke** = quick built-in tests (`python script.py --test`)
> **Unit** = comprehensive test suite (`python test_script.py`)
```

Updated totals to reflect both:

```markdown
> **Total: 40/40 smoke + 270/270 unit + 84/84 paths = 100% PASS**
```

## Why This Works

- Readers now see two complementary test suites, not one misleading number
- Smoke tests are what you get with `--test` (fast feedback)
- Unit tests are what you get with `test_*.py` (comprehensive coverage)
- Both are real, both pass, but they measure different things

## Prevention

1. **When documenting test counts, always specify the test runner**: `--test` vs `test_*.py` vs `pytest`
2. **When adding a new script with tests, document both smoke and unit counts**
3. **Code reviews should verify metrics against actual command output**
4. **Use the pattern**: `| Script | Smoke | Unit | Description |`

## Files Changed

- `01_Personal_Os/README.md` — added Smoke/Unit columns to AI Native table
- `01_Personal_Os/05_Scripts/README.md` — separated smoke and unit test commands
- `01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/README.md` — added Smoke/Unit columns to AI Native table

## Cross-References

- Related: `config_paths.py --validate` (84/84 paths — single test type, no ambiguity)
- Related: `certify_10_10.py --test` (43/43 meta-tests — single test type)
