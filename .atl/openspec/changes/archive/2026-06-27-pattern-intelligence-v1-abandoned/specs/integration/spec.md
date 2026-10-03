# Integration Specification

## Purpose

Integrates semantic fallback into `get_skill_script()` in `config_paths.py` without breaking existing exact-match behavior. Ensures backward compatibility and graceful operation.

## Requirements

### Requirement: Semantic Fallback in get_skill_script() (FR-04)

The system MUST integrate semantic search as a fallback in `get_skill_script()` such that exact MAP matches retain priority, and fallback activates only when both MAP miss and file-not-found conditions are met.

#### Scenario: Exact MAP match takes precedence

- GIVEN `"01_Auditor_Hub.py"` exists in `SCRIPT_LOCATION_MAP` pointing to a valid path
- WHEN `get_skill_script("01_Auditor_Hub.py")` is called
- THEN the mapped path is returned directly
- AND no semantic search is executed

#### Scenario: Semantic fallback on MAP miss + file not found

- GIVEN `"auditor_de_skills.py"` is NOT in `SCRIPT_LOCATION_MAP`
- AND no file at the expected legacy paths
- WHEN `get_skill_script("auditor_de_skills.py")` is called
- THEN a semantic search is triggered with the sanitized query
- AND if a match above threshold (0.60) is found, the best match path is returned
- AND a log line is written: "Fallback semantic search for 'auditor_de_skills.py' → found 'Auditor_Validate.py' (score: 0.87)"

#### Scenario: Semantic fallback skips if file exists at legacy path

- GIVEN `"auditor_de_skills.py"` is NOT in MAP
- BUT a file with that name exists at a legacy fallback path
- WHEN `get_skill_script("auditor_de_skills.py")` is called
- THEN the legacy path is returned
- AND semantic search is NOT executed

#### Scenario: Graceful degradation when DB is missing

- GIVEN `pattern_index.db` does not exist
- WHEN `get_skill_script("auditor_de_skills.py")` is called (MAP miss)
- THEN the function returns None (current behavior)
- AND no crash occurs
- AND a warning is logged: "Pattern index not found, skipping semantic fallback"

#### Scenario: Graceful degradation on search failure

- GIVEN `pattern_index.db` exists but a query fails (corruption, I/O error)
- WHEN `get_skill_script("auditor_de_skills.py")` triggers a fallback search
- THEN the error is caught
- AND a warning is logged
- AND None is returned (no crash)

#### Scenario: Query sanitization for get_skill_script fallback

- GIVEN `get_skill_script("01_Auditor_Hub.py")` triggers fallback
- WHEN the query is passed to semantic search
- THEN `.py` extension is stripped and underscores replaced with spaces: `"01 Auditor Hub"`
