# Output Evaluation Specification

## Purpose

Weighted quality scoring system for PersonalOS agent outputs (proposals, content, reports). Produces deterministic 0–100 scores with per-criterion breakdowns and improvement suggestions. Integrates with skill_chain.py via optional --eval flag.

## Requirements

### Requirement: Weighted Criterion Scoring

The system MUST evaluate output text against 5 weighted criteria, producing a composite score 0–100.

| Criterion    | Weight | Check Function            |
|-------------|--------|---------------------------|
| completeness | 0.30   | required fields present   |
| accuracy     | 0.25   | numbers/sources present   |
| tone         | 0.20   | brand voice match         |
| clarity      | 0.15   | readability metrics       |
| actionability| 0.10   | next steps / CTA present  |

#### Scenario: Full score on well-structured output

- GIVEN a proposal text containing all required fields, numbers, sources, clean prose, and next steps
- WHEN the system evaluates it with type "proposal"
- THEN the composite score MUST be >= 80
- AND the criteria breakdown includes all 5 criteria with individual scores 0–100

#### Scenario: Partial score on incomplete output

- GIVEN a content text missing the CTA field
- WHEN the system evaluates it with type "content"
- THEN the completeness score MUST be less than 100
- AND the composite score reflects the weighted penalty
- AND a suggestion mentions the missing CTA

### Requirement: Output Type Definitions

The system MUST support exactly 3 output types, each with hardcoded required fields.

| Type     | Required Fields                                  |
|----------|--------------------------------------------------|
| proposal | problem, solution, timeline, budget, team         |
| content  | headline, body, cta, target_audience              |
| report   | summary, findings, recommendations, next_steps    |

#### Scenario: Unknown type rejected

- GIVEN the user passes type "email" (not one of the 3 supported types)
- WHEN the system validates the type parameter
- THEN it MUST return an error listing available types: proposal, content, report

#### Scenario: Correct required fields per type

- GIVEN a proposal text with sections for problem and solution but missing timeline, budget, team
- WHEN evaluated with type "proposal"
- THEN completeness detects 3 missing fields
- AND suggestions list each missing field specifically

### Requirement: Completeness Check

The system MUST check that all required fields for the given type are present in the text. Fields are detected by the presence of the field keyword (case-insensitive) or a section header containing it.

#### Scenario: Field detected by keyword

- GIVEN text containing "## Budget\nThe estimated cost is $50,000"
- WHEN evaluated with type "proposal"
- THEN the "budget" field is marked present

#### Scenario: Field absent

- GIVEN proposal text with no mention of "timeline" or "schedule" or "milestone"
- WHEN evaluated with type "proposal"
- THEN the "timeline" field is marked absent

### Requirement: Accuracy Check (Presence-Based)

The system MUST check for the presence of quantitative data (numbers, percentages, dollar amounts) and source references (citations, URLs, "source:", "according to"). Accuracy does NOT validate factual correctness — only presence.

#### Scenario: Numbers and sources present

- GIVEN text containing "42% growth" and "Source: Gartner 2024"
- WHEN accuracy is checked
- THEN accuracy score MUST be high (>= 80)

#### Scenario: No numbers or sources

- GIVEN text with only qualitative claims and no numbers or citations
- WHEN accuracy is checked
- THEN accuracy score MUST be low (<= 30)

### Requirement: Clarity Check

The system MUST evaluate readability using: average sentence length (< 25 words), paragraph length (< 150 words), and jargon density (< 10% of words matching corporate jargon patterns).

#### Scenario: Clear, readable text

- GIVEN text with average sentence length of 15 words, short paragraphs, no jargon
- WHEN clarity is checked
- THEN clarity score MUST be >= 90

#### Scenario: Dense, jargon-heavy text

- GIVEN text with average sentence length of 40 words, paragraphs over 200 words, heavy jargon
- WHEN clarity is checked
- THEN clarity score MUST be < 50

### Requirement: Actionability Check

The system MUST check for presence of "next steps" or "action items" or "recommendations" section, specific owners or deadlines, and clear CTAs.

#### Scenario: Actionable output

- GIVEN text with "## Next Steps", "Alice will deliver by Friday", "Contact us at..."
- WHEN actionability is checked
- THEN actionability score MUST be >= 90

#### Scenario: Non-actionable output

- GIVEN text with no next steps, no owners, no deadlines, no CTA
- WHEN actionability is checked
- THEN actionability score MUST be < 40

### Requirement: Suggestion Generation

The system MUST generate actionable improvement suggestions for any criterion scoring below 70.

#### Scenario: Suggestions for low-scoring criteria

- GIVEN a report with completeness score 40 and tone score 55
- WHEN suggestions are generated
- THEN at least 2 suggestions appear, one per low-scoring criterion
- AND each suggestion names the specific missing element or issue

### Requirement: Determinism

The system MUST produce identical scores for identical inputs. No randomness, no API calls, no time-dependent values.

#### Scenario: Same input, same output

- GIVEN text "Problem: X. Solution: Y. Timeline: Q3. Budget: $10k. Team: 3 people."
- WHEN evaluated twice with type "proposal"
- THEN both runs produce identical composite scores and criterion breakdowns

### Requirement: Input Flexibility

The system MUST accept raw text, a file path, or JSON with a text/content field.

#### Scenario: File path input

- GIVEN a file at /tmp/draft.md containing proposal text
- WHEN evaluated with --input /tmp/draft.md --type proposal
- THEN the file contents are read and evaluated

#### Scenario: JSON input

- GIVEN a JSON string '{"text": "Problem: X. Solution: Y..."}'
- WHEN evaluated with --input '<json>' --type proposal
- THEN the text field is extracted and evaluated

### Requirement: Batch Evaluation

The system MUST evaluate all text/markdown files in a directory.

#### Scenario: Batch run

- GIVEN a directory with 5 .md files
- WHEN evaluated with --input-dir /path --type content
- THEN all 5 files are evaluated
- AND a summary with average score is returned

### Requirement: Telemetry Persistence

The system MUST write eval results as atomic JSON to eval_results/ directory. Records MUST contain score, criteria breakdown, suggestions, and timestamp. Full output text MUST NOT be stored.

#### Scenario: Telemetry file written

- GIVEN a successful evaluation
- WHEN the evaluation completes
- THEN a JSON file is written to eval_results/ with the result
- AND the file does NOT contain the input text

### Requirement: Skill Chain Integration

The system MUST provide a hook for skill_chain.py via an --eval flag. After each step completes, if --eval is active, the step output is evaluated. Scores below 70 emit a WARNING log. V1 does NOT abort on low scores.

#### Scenario: --eval flag active

- GIVEN skill_chain.py run with --eval flag
- WHEN a chain step completes
- THEN the step output is evaluated
- AND the score is stored in chain_state_{id}.json
- AND a warning is logged if score < 70

#### Scenario: --eval flag absent (default)

- GIVEN skill_chain.py run without --eval flag
- WHEN a chain step completes
- THEN no evaluation runs
- AND chain execution is unchanged
