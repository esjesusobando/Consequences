# ⚖️ Judgment Day — References

Reference materials for the Judgment Day dual-review protocol.

## Core Concepts

- **Blind review**: Two independent reviewers who don't know about each other. Eliminates bandwagon bias and groupthink.
- **Adversarial posture**: Each judge is told to find problems, not to approve. This is the opposite of a standard code review.
- **Convergence**: The protocol converges when both judges independently agree the target is clean. Disagreement means more work is needed.

## Verdict Categories

| Category         | Meaning                      | Action                                    |
|-----------------|-----------------------------|------------------------------------------|
| **Confirmed**    | Found by BOTH judges         | Fix immediately with Fix Agent            |
| **Suspect**      | Found by ONLY ONE judge      | Report but do NOT auto-fix — triage needed|
| **Contradiction**| Judges DISAGREE on same thing| Flag for human decision                   |
| **Clean**        | Neither judge found anything | ✅ Approved                                |

## Escalation Criteria

Escalate to human after 2 fix iterations:
1. Round 1: Judges find issues → Fix Agent → Round 2
2. Round 2: Still issues → Fix Agent → Round 3
3. Round 3: Still issues → **ESCALATED** (full history provided)

## Related Skills Integration

| Skill           | Integration Point                                                         |
|----------------|--------------------------------------------------------------------------|
| `sdd-verify`    | Judgment Day output can feed into the verify-report as additional evidence|
| `ce-code-review`| Alternative single-reviewer approach (less thorough but faster)           |
| `sdd-apply`     | Judgment Day is typically triggered after apply completes                 |
| `skill-registry`| Pattern 0 resolves project-specific standards for judges                  |

## Common Review Criteria Sources

- **Project standards**: From `.atl/skill-registry.md` compact rules
- **Language-specific**: TypeScript strict mode, Go vet/lint, Rust clippy
- **Security**: OWASP Top 10, injection patterns, auth bypasses
- **Performance**: N+1 queries, unnecessary allocations, goroutine leaks
