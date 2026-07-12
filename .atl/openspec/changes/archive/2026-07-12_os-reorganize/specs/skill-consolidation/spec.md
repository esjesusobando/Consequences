# Skill Consolidation Specification

## Purpose

Defines the rules for merging `.agents/skills/` content into `.agent/skills/` and maintaining a single source of truth for the skill corpus.

## Requirements

### Requirement: Merge All .agents Skills Into .agent

All 21 skill directories under `.agents/skills/` SHALL be merged into `.agent/skills/`. If a skill name conflicts, the `.agent/` version takes precedence and the `.agents/` version SHALL NOT overwrite it.

#### Scenario: Full merge with no conflicts

- GIVEN `.agents/skills/` contains 21 skill directories
- WHEN the merge completes
- THEN `.agent/skills/` contains all 21 skills from `.agents/skills/`
- AND no data from `.agent/` originals was lost

#### Scenario: Name conflict preserves canonical

- GIVEN both `.agents/skills/foo/` and `.agent/skills/foo/` exist
- WHEN the merge runs
- THEN `.agent/skills/foo/` retains its original content
- AND the `.agents/skills/foo/` content is discarded (logged as conflict)

### Requirement: Canonical Skill Count Integrity

`.agent/02_Skills/` SHALL contain exactly 429 `SKILL.md` files after consolidation, matching the canonical skill index.

#### Scenario: Count matches index

- GIVEN the consolidation is complete
- WHEN `find .agent/02_Skills/ -name "SKILL.md" | wc -l` is executed
- THEN the result is 429

#### Scenario: Index drift detection

- GIVEN a new skill was added to `.agent/02_Skills/` without updating the index
- WHEN `config_paths.py --validate` runs
- THEN a WARNING is emitted about mismatched counts

### Requirement: No Bidirectional Drift

After consolidation, `.agents/skills/` SHALL NOT exist. Runtime skill discovery SHALL read exclusively from `.agent/`. If a tool or script still references `.agents/skills/`, it SHALL fail loudly rather than silently serve stale data.

#### Scenario: Runtime reads from .agent only

- GIVEN the consolidation is complete
- WHEN a skill discovery tool scans for skills
- THEN it finds skills under `.agent/` not `.agents/`
- AND results match the canonical 429 count

#### Scenario: Stale reference fails loud

- GIVEN a script still hardcodes `.agents/skills/` as its search path
- WHEN the script executes
- THEN it exits with a clear error (directory not found)
- AND does not fall back to `.agent/` silently

### Requirement: RealEstate Skills Present

The `09_RealEstate/` skill area SHALL exist under `.agent/02_Skills/` with all its skill files consolidated from either source location.

#### Scenario: RealEstate consolidation

- GIVEN RealEstate skills exist in the canonical skill set
- WHEN `.agent/02_Skills/09_RealEstate/` is listed
- THEN all expected skill files are present
- AND no duplicate exists under `.agents/skills/`
