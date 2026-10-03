# Reference Integrity Specification

## Purpose

Ensures all path references, symlinks, and configuration files point to valid locations after reorganization. Detects and prevents stale `.agents/` references.

## Requirements

### Requirement: Symlinks Point to Canonical .agent

All symlinks under `.claude/skills/` SHALL point to directories under `.agent/`, not `.agents/`. No symlink SHALL reference a path that no longer exists after cleanup.

#### Scenario: Symlink validation post-cleanup

- GIVEN the reorganization is complete
- WHEN `find .claude/skills/ -type l` is executed
- THEN every symlink resolves to a valid target under `.agent/`
- AND zero symlinks reference `.agents/`

#### Scenario: Broken symlink detection

- GIVEN a symlink under `.claude/skills/` previously pointed to `.agents/skills/X`
- WHEN `config_paths.py --validate` runs
- THEN validation fails and reports the broken symlink path

### Requirement: config_paths.py Validation

`config_paths.py --validate` SHALL exit with code 0 after reorganization. All path constants in the file SHALL reference directories that exist.

#### Scenario: Clean validation

- GIVEN the reorganization is complete
- WHEN `python config_paths.py --validate` is executed
- THEN exit code is 0
- AND no ERROR lines appear in stdout

#### Scenario: Stale path detection

- GIVEN `config_paths.py` still contains a reference to `.agents/`
- WHEN `config_paths.py --validate` runs
- THEN exit code is non-zero
- AND the offending path is printed to stderr

### Requirement: Zero Stale .agents References in Config

`CLAUDE.md` and `opencode.json` SHALL contain zero occurrences of the string `.agents/` after reorganization. All such references SHALL be updated to `.agent/`.

#### Scenario: CLAUDE.md clean

- GIVEN the reorganization is complete
- WHEN `grep -r "\.agents/" CLAUDE.md` is executed
- THEN zero matches are found

#### Scenario: opencode.json clean

- GIVEN the reorganization is complete
- WHEN `grep -r "\.agents/" opencode.json` is executed
- THEN zero matches are found

### Requirement: Skill Registry Path Accuracy

`.atl/skill-registry.md` SHALL reference `.agent/` paths exclusively. All skill entry paths SHALL resolve to actual files.

#### Scenario: Registry references canonical paths

- GIVEN the reorganization is complete
- WHEN `.atl/skill-registry.md` is parsed for skill paths
- THEN every path starts with `.agent/` not `.agents/`
- AND every referenced `SKILL.md` file exists on disk
