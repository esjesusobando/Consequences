# Security Find-and-Fix Loop — Anthropic Methodology

> **Source:** [Claude Security](https://www.anthropic.com/product/security) + [Building AI for Cyber Defenders](https://www.anthropic.com/research/building-ai-cyber-defenders)
> **Reference implementation:** https://github.com/anthropics/defending-code-reference-harness
> **Published:** May 27, 2026 (security guide)

---

## Overview

Anthropic's **6-step find-and-fix loop** is a structured methodology for using Claude to discover, validate, and patch security vulnerabilities in codebases. It closes the loop from finding to shipped fix, so vulnerabilities get resolved instead of sitting in a queue.

The core insight: **discovery is easy to parallelize, the bottleneck is verification/triage/patching.**

---

## The 6-Step Loop

### Step 1: Threat Model — Define What Counts as a Vulnerability

Before scanning, define the security scope:

- **Trust boundaries**: Where does untrusted input enter the system?
- **Data classification**: What data needs protection, and at what level?
- **Attack surface**: What components are in scope? What's out of scope?
- **Severity rubric**: What makes a finding Critical vs. High vs. Medium vs. Low?

**Output:** A `THREAT_MODEL.md` document that every subsequent step references.

**How Claude does it:** A bootstrap-then-interview process. Claude starts with an initial threat model based on the codebase structure, then asks the application owner questions to refine likelihood and impact assessments.

---

### Step 2: Sandbox — Build Isolated Environment

Create a safe environment for proving exploits:

- Isolated, read-only sandbox (no production access)
- Compile/build tools available for the target codebase
- No network egress for exploit code
- Authorized scope documented (who approved, what's covered, disclosure plan)

**For open-source work:** This is the fork/checkout you'll be scanning. For enterprise work: a dedicated scanning environment.

---

### Step 3: Discovery — Parallel Scanning with Rich Context

Discovery is the **most parallelizable** step. Claude reads and reasons about code the way a security researcher would:

- Follows variables across files
- Traces how data moves through the application
- Catches business logic flaws, broken access control, unsafe data flows
- Goes beyond what pattern-matching scanners (SAST) can find

**Key advantage over SAST tools:**
- Traditional scanners match code against known vulnerability patterns (high false positives)
- Claude reasons about how code actually behaves, understanding which inputs can cross trust boundaries

**Output:** Raw findings with file references, reasoning, and initial severity estimates.

---

### Step 4: Verification — Adversarial Verification to Filter False Positives

Every finding goes through **multi-stage verification** before it reaches a human:

1. Claude re-examines each result to **prove or disprove** it
2. **Adversarial check**: "If I were an attacker, could I actually exploit this?"
3. **Cross-file context check**: Is the vulnerable path actually reachable from user input?
4. **Confidence rating**: Each finding gets a severity + confidence score

**Why this matters:** The verification step is the **primary bottleneck**. Discovery is fast and parallel, but verification requires deep reasoning and cannot be fully parallelized (each finding depends on the full codebase context).

**Output:** A filtered, ranked list of verified findings with severity ratings.

---

### Step 5: Triage — Deduplicate by Root Cause, Rank by Severity

Triage is the second bottleneck. A fresh analysis pass:

1. **Deduplicates**: Collapses findings sharing the same root cause (one fix can resolve multiple findings)
2. **Re-derives severity**: Independent severity assessment (not inherited from the discovery agent)
3. **Determines reachability**: Across the trust boundaries defined in the threat model

**Key principle:** The triage agent deliberately does NOT inherit the discovery agent's severity scores. Re-deriving them independently is a cheap way to catch overconfidence.

**Output:** A short, ranked list of actionable findings, grouped by root cause.

---

### Step 6: Patching — TDD Approach with Adversarial Check

For each validated, triaged finding:

1. **Generate a targeted patch** — surgical change that removes the vulnerability
2. **Verify the fix**: Can the original bug still be triggered after the patch?
3. **Regression check**: Does the test suite still pass? Is intended functionality preserved?
4. **Adversarial review**: Another agent tries to break the fix
5. **Human review**: The patch opens in Claude Code for human approval — nothing ships without it

**Task verifiers** are the secret sauce: a trusted method of confirming whether the AI agent's output actually achieves its goal. Good task verifiers check two things:
- That the vulnerability has actually been removed
- That the program's intended functionality has been preserved

**Output:** A branch with a patch, ready for PR review.

---

## The Bottleneck Reality

This is the most important insight from Anthropic's research:

```
DISCOVERY:   ✅ Highly parallelizable — run N agents across N modules
VERIFICATION:⚠️  Serial bottleneck — each finding needs deep reasoning
TRIAGE:      ⚠️  Serial bottleneck — dedup requires understanding root causes
PATCHING:    ⚠️  Mixed — surgical fixes are fast, complex rewrites are slow
```

**Practical implication:** The discovery phase can scale horizontally (more agents = faster scanning), but verification and triage do NOT scale linearly. The limiting factor is human + AI capacity to validate and patch, not to find.

---

## How It Maps to This Project's Skill Auditor

This project's **Skill Auditor** (`01_Personal_Os/01_Core/02_Tools/02_Skills/00_Skill_Auditor/SKILL.md`) already audits skills against Anthropic SOTA v5.1 standards. The find-and-fix loop maps directly:

| Anthropic Step  | Skill Auditor Equivalent                                                                         |
|----------------|-------------------------------------------------------------------------------------------------|
| 1. Threat Model | Audit criteria (02_References/audit-criteria.md + anthropic-standards.md)                        |
| 2. Sandbox      | The skills directory IS the sandbox — read-only audit environment                                |
| 3. Discovery    | `audit-skills.py` — parallel analysis of all skills in a directory                               |
| 4. Verification | Cross-validate findings between `validate-essence.py` and audit report                           |
| 5. Triage       | `audit-loop.py` — deduplicate findings by root cause (missing frontmatter, missing gotchas, etc.)|
| 6. Patching     | `fix-missing.py` — auto-fix with verification before committing                                  |

**Integration opportunity:** The Skill Auditor can adopt the full 6-step protocol, adding adversarial verification (an agent that tries to prove audit findings wrong) and confidence scoring like Claude Security does.

---

## Real-World Impact

Anthropic has validated this methodology at scale:

- **500+ vulnerabilities** found in production open-source codebases using Claude Opus 4.6 — bugs that had survived decades of expert review
- **2,100+ patches** shipped by Claude Opus 4.7 in enterprise codebases in just 3 weeks (Claude Security public beta)
- **Project Glasswing:** Identified thousands of zero-day vulnerabilities across every major OS and browser, including a 16-year-old vulnerability in libxmp that automated tools had hit 5 million times without catching
- **Mozilla Firefox partnership:** Found and patched vulnerabilities using task verifiers (tools that automatically test whether the original bug can still be triggered after a proposed fix)

---

## References

- [Anthropic Security product page](https://www.anthropic.com/product/security)
- [Building AI for Cyber Defenders](https://www.anthropic.com/research/building-ai-cyber-defenders)
- [Claude Code Security research preview](https://www.anthropic.com/research/claude-code-security)
- [Mozilla Firefox partnership](https://www.anthropic.com/news/mozilla-firefox-security)
- [Project Glasswing](https://www.anthropic.com/glasswing)
- [Coordinated Vulnerability Disclosure policy](https://www.anthropic.com/coordinated-vulnerability-disclosure)
- [Claude Code Security Reviewer (GitHub Action)](https://github.com/anthropics/claude-code-security-review)
- [Defending Code Reference Harness](https://github.com/anthropics/defending-code-reference-harness)
- [Claude Cookbook: Vulnerability Detection Agent](https://github.com/anthropics/claude-cookbooks/blob/main/claude_agent_sdk/06_The_vulnerability_detection_agent.ipynb)
