# Core Indexing Specification

## Purpose

Automatic scanning, indexing, and registration of Python scripts into `pattern_index.db` with metadata, embeddings, and tags. Covers initial build, incremental updates, and new script registration.

## Requirements

### Requirement: Script Scanning and Indexing (FR-01)

The system MUST scan all Python scripts across configured OS paths, extract metadata, generate embeddings, and persist them to `pattern_index.db`.

#### Scenario: Full scan completes within time budget

- GIVEN 120 Python scripts exist across the configured search paths
- WHEN `python -m pattern_indexer --scan` is invoked
- THEN `pattern_index.db` is created with `scripts`, `embeddings`, and `tags` tables populated
- AND the operation completes in under 60 seconds

#### Scenario: Full scan is idempotent

- GIVEN `pattern_index.db` already exists from a previous scan
- WHEN `--scan` is invoked again with no file changes
- THEN no duplicate rows are inserted
- AND the resulting DB content is identical to the first scan

#### Scenario: Non-Python files are ignored

- GIVEN a directory with `.py`, `.md`, `.sh`, and `.yaml` files
- WHEN the scanner runs
- THEN only `.py` files are indexed
- AND non-Python files are silently skipped

### Requirement: Incremental Index Update (FR-05)

The system SHOULD detect and re-index only scripts that changed since the last scan, using file hash and last-modified timestamp.

#### Scenario: No changes detected

- GIVEN all scripts are unchanged since the last index
- WHEN `python -m pattern_indexer --update` is invoked
- THEN the system logs "Index up to date, no rebuild needed"
- AND no re-indexing occurs

#### Scenario: Modified script re-indexed

- GIVEN one script was modified (new hash, new timestamp)
- WHEN `--update` is invoked
- THEN only that single script is re-embedded and updated in the DB
- AND the operation completes in under 5 seconds

#### Scenario: Force rebuild

- GIVEN `pattern_index.db` exists with stale or corrupted data
- WHEN `--force-rebuild` is passed to `--scan`
- THEN the full index is rebuilt from scratch
- AND all scripts are re-processed regardless of timestamps

### Requirement: Script Registration (FR-06)

The system MUST support registering individual new scripts via CLI, with automatic description generation and tag assignment.

#### Scenario: Register new script

- GIVEN a new Python script at `path/to/new_script.py` with a valid docstring
- WHEN `python -m pattern_indexer --register path/to/new_script.py` is invoked
- THEN the script is added to the index
- AND its description is auto-generated from the docstring
- AND tags are auto-assigned based on its path (e.g., `skills/06_Tools/` → tag `tools`)
- AND the system returns "Registered new_script.py with id: N"

#### Scenario: Register duplicate script

- GIVEN the script is already registered in the index
- WHEN `--register path/to/existing_script.py` is invoked
- THEN the system returns an error: script already registered
- AND no duplicate entry is created

#### Scenario: Register non-existent script

- GIVEN a path that does not point to an existing file
- WHEN `--register path/to/missing.py` is invoked
- THEN the system returns an error: file not found
- AND the index is unchanged

#### Scenario: Register with empty docstring

- GIVEN a script with no docstring (under 10 lines of code)
- WHEN `--register` is invoked
- THEN the script is marked with tag `utility`
- AND the description uses the cleaned filename only
