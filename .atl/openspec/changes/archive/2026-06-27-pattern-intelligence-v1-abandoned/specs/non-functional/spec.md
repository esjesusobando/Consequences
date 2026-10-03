# Non-Functional Specification

## Purpose

Defines operational constraints: offline capability, performance budgets, storage footprint, and graceful degradation guarantees for the Pattern Intelligence Engine.

## Requirements

### Requirement: Offline Operation (NFR-01)

The system MUST operate fully offline with no external API dependencies.

#### Scenario: Embedding model loads locally

- GIVEN no internet connection
- WHEN the embedding model (`all-MiniLM-L6-v2`) is loaded
- THEN it loads from local cache without any network requests
- AND all inference runs locally via sentence-transformers

#### Scenario: No external API calls during search

- GIVEN a search query
- WHEN `find_similar_scripts()` is called
- THEN no HTTP requests are made
- AND no rate limits are encountered

### Requirement: Performance (NFR-02)

The system MUST meet latency and memory budgets for interactive use.

#### Scenario: Semantic search under 500ms

- GIVEN 120 indexed scripts
- WHEN a semantic search query is executed
- THEN the round-trip (embed query + similarity search) completes in under 500 milliseconds

#### Scenario: Full rebuild under 60 seconds

- GIVEN 120 Python scripts
- WHEN a full `--scan` (rebuild) is executed
- THEN indexing completes in under 60 seconds

#### Scenario: Single script update under 5 seconds

- GIVEN one modified script
- WHEN `--update` is invoked
- THEN re-indexing of that single script completes in under 5 seconds

#### Scenario: Memory under 500MB

- GIVEN the embedding model is loaded and the index is queried
- WHEN monitoring peak memory
- THEN total memory consumption stays under 500MB RAM

### Requirement: Storage Footprint (NFR-03)

The system SHOULD keep disk usage within reasonable bounds.

#### Scenario: Database under 15MB

- GIVEN 120 scripts are indexed with 128-dimensional embeddings
- WHEN measuring `pattern_index.db` size
- THEN the file is under 15 megabytes

#### Scenario: Model cache footprint

- GIVEN sentence-transformers model is cached
- THEN the model cache is expected at approximately 500MB on first download
- AND subsequent runs do not increase cache size

### Requirement: Graceful Degradation (NFR-04)

The system MUST degrade gracefully when components are unavailable, never crashing the caller.

#### Scenario: Missing database

- GIVEN `pattern_index.db` does not exist
- WHEN any search or indexing operation is attempted
- THEN the operation logs a warning
- AND returns a safe default (empty list for search, error message for indexing)
- AND the calling code continues without exception

#### Scenario: Corrupt database

- GIVEN `pattern_index.db` has corrupt data (fails `PRAGMA integrity_check`)
- WHEN a search query is attempted
- THEN the operation logs the corruption warning
- AND falls back to returning empty results
- AND does not crash

#### Scenario: Embedding model fails to load

- GIVEN the sentence-transformers model cannot be loaded (corrupt cache, OOM)
- WHEN indexing is attempted
- THEN the system logs an error
- AND falls back to keyword-only search (TfidfVectorizer) or returns empty results
- AND does not crash
