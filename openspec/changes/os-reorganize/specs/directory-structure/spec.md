# Directory Structure Specification

## Purpose

Defines the expected directory hierarchy of PersonalOS v5.0 after structural reorganization. Purely positional — where items live, not what they do.

## Requirements

### Requirement: Canonical Skill Location

All skill directories containing a `SKILL.md` file SHALL reside exclusively under `.agent/02_Skills/`. No other directory in the project tree SHALL contain a `SKILL.md` that acts as a discoverable skill entry point.

#### Scenario: All skills present in canonical location

- GIVEN the reorganization is complete
- WHEN an audit counts `SKILL.md` files under `.agent/02_Skills/`
- THEN exactly 429 `SKILL.md` files exist
- AND no `SKILL.md` exists under `.agents/`, `05_Claude_Ads/`, or any `03_Scripts_Os/` subdirectory

#### Scenario: RealEstate skills in canonical location

- GIVEN skills from `09_RealEstate/` are part of the OS skill corpus
- WHEN `.agent/02_Skills/` is enumerated
- THEN a `09_RealEstate/` subdirectory exists with its skill files

### Requirement: No Legacy .agents Directory

The `.agents/` directory SHALL NOT exist at the project root after reorganization. All content must have been migrated to `.agent/` prior to removal.

#### Scenario: .agents removal verified

- GIVEN the reorganization is complete
- WHEN `ls -la` is run at the project root
- THEN `.agents/` does not appear in the directory listing
- AND `.agent/` exists and contains `02_Skills/`

### Requirement: Claude_Ads Project Placement

`05_Claude_Ads/` SHALL exist only under `01_Personal_Os/06_Projects/`. It SHALL NOT appear under `02_Skills/` or any other top-level numbered directory.

#### Scenario: No Claude_Ads in Skills

- GIVEN the reorganization is complete
- WHEN searching for `05_Claude_Ads` across the project
- THEN the only match is under `01_Personal_Os/06_Projects/05_Claude_Ads/`

### Requirement: Single Resultado Location

`03_Resultado/` SHALL exist only at the project root. Any copy under `01_Personal_Os/` SHALL be removed.

#### Scenario: Root Resultado is the only copy

- GIVEN the reorganization is complete
- WHEN searching for directories named `03_Resultado`
- THEN exactly one exists at the project root
- AND `01_Personal_Os/03_Resultado/` does not exist

### Requirement: Workflows Name Collision Resolved

The `00_Workflows/` directory inside the Skills area SHALL be renamed to avoid collision with `00_Core/00_Workflows/`. The new name SHALL be unique across the project tree.

#### Scenario: No duplicate Workflows names

- GIVEN the reorganization is complete
- WHEN listing all top-level directories containing "Workflows"
- THEN each has a unique name
- AND `00_Core/00_Workflows/` retains its original name
