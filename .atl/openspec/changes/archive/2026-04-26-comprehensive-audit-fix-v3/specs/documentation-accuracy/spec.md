# Delta for documentation-accuracy

## ADDED Requirements

### Requirement: Version Consistency

The system MUST maintain consistent version numbers across ALL documentation files.

All core documentation files (AGENTS.md, CLAUDE.md, README.md, skill-registry.md) MUST say "v3.0 Consequences" with the same date.

#### Scenario: Check version consistency

- GIVEN multiple documentation files in the project
- WHEN reading version from each file
- THEN all SHOULD say "v3.0 Consequences" (2026-04-26)

### Requirement: Count Accuracy

The system MUST verify and document accurate counts for skills, MCPs, agents, and HUBs.

The counts in documentation SHOULD match actual directory scans.

#### Scenario: Skills count verification

- GIVEN documentation claims 297 skills
- WHEN scanning `01_Personal_Os/01_Core/02_Tools/02_Skills/` directory
- THEN actual count SHOULD be documented with "verified" note

### Requirement: Path Correctness

The system MUST use correct absolute paths in documentation.

file:/// URLs MUST include the full path: `01_Personal_Os/01_Core/...`

#### Scenario: File URL validation

- GIVEN documentation contains file:/// URL
- WHEN checking the path
- THEN it SHOULD include `01_Personal_Os/` prefix