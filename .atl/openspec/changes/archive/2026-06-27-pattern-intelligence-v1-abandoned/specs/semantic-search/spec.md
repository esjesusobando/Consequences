# Semantic Search Specification

## Purpose

Provides semantic and hybrid search over indexed scripts, returning ranked results with similarity scores. Enables discovery of scripts by intent rather than by exact name.

## Requirements

### Requirement: Semantic Search (FR-02)

The system MUST support natural language semantic search over indexed scripts, returning the top-k matches with similarity scores above a configurable threshold.

#### Scenario: Query returns relevant matches

- GIVEN the index contains 120 scripts including auditor-related scripts
- WHEN `find_similar_scripts("auditoria de skills", top_k=3)` is called
- THEN up to 3 results are returned as `(Path, float, str)` tuples
- AND each result has `similarity_score > 0.65`
- AND the top result is semantically related to auditing skills

#### Scenario: Query completes within latency budget

- GIVEN the index contains 120 scripts
- WHEN a semantic search is executed
- THEN the response time is under 500 milliseconds

#### Scenario: Low-relevance query returns empty

- GIVEN the indexed scripts cover OS operations and skill management
- WHEN `find_similar_scripts("xyzqwerty123", threshold=0.9)` is called
- THEN an empty list is returned
- AND no error is raised

#### Scenario: Empty query returns empty

- GIVEN any index state
- WHEN `find_similar_scripts("")` is called
- THEN an empty list is returned
- AND no error is raised

### Requirement: Hybrid Search (FR-03)

The system SHOULD support combining semantic search with tag/keyword pre-filtering, ranking only within the filtered subset.

#### Scenario: Tag filter narrows results

- GIVEN scripts tagged with `01_Auditor` and `02_Tools` exist in the index
- WHEN `find_similar_scripts("auditoria", tags=["01_Auditor"])` is called
- THEN only scripts tagged `01_Auditor` are considered for ranking
- AND results are sorted by semantic similarity within that subset

#### Scenario: Hybrid search falls back to pure semantic when no tags provided

- GIVEN no `tags` parameter is passed
- WHEN `find_similar_scripts("auditoria")` is called
- THEN all scripts are searched semantically (pure semantic mode)
