---
name: reverse-engineering
description: Analyze how things are built to extract transferable patterns. Use on open source repos, frameworks, tools to understand architecture and decisions. Trigger: /reverse-engineering [target]
---

# Reverse Engineering

Analyze how things are built to extract transferable patterns, architectural decisions, and implementation insights.

---

## Esencia Original

Analyzes how tools, frameworks, repos, and APIs are built to extract transferable patterns, architectural decisions, and implementation insights. Outputs structured analysis with adoption recommendations for the OS. Feeds into deliverable #8 (Ingeniería Inversa) of the Learning Always pipeline.

---

## Quick Start

```
/reverse-engineering [target]
```

Targets can be:
- GitHub repository
- Open source tool
- Framework source code
- API structure
- Design system

---

## What to Analyze

### 1. Architecture Patterns
- How is the project structured?
- What patterns are used (MVC, clean architecture, etc)?
- How are components organized?

### 2. Implementation Patterns
- Coding styles and conventions
- Data handling approaches
- Error handling strategies
- Testing approaches

### 3. Decision Points
- Why certain tools were chosen
- Trade-offs made
- Scaling strategies
- Performance optimizations

### 4. Transferable Insights
- What can be applied to our OS?
- What patterns to adopt?
- What to avoid?

---

## Analysis Process

### Step 1: Structure Analysis
```
Target: [GitHub repo or URL]
├── File organization
├── Module boundaries
├── Dependency management
└── Build system
```

### Step 2: Code Pattern Extraction
```
Coding patterns found:
├── [Pattern 1]
├── [Pattern 2]
└── [Pattern 3]
```

### Step 3: Decision Analysis
```
Architectural decisions:
├── [Decision 1]: [Rationale]
├── [Decision 2]: [Rationale]
└── [Decision 3]: [Rationale]
```

### Step 4: Transfer Recommendations
```
For our OS:
├── Adopt: [Patterns to use]
├── Adapt: [Patterns to modify]
└── Avoid: [Patterns to not follow]
```

---

## Output Structure

```markdown
# Reverse Engineering - [Target Name]

## Target Information
- URL: [repo/tool URL]
- Type: [repo|tool|framework|api]
- Purpose: [what it does]

## Architecture Overview

### Structure
[How it's organized]

### Key Components
- [Component 1]: [Purpose]
- [Component 2]: [Purpose]

### Dependencies
[Key dependencies and why]

## Implementation Patterns

### Pattern 1: [Name]
**What**: [Description]
**Why**: [Rationale]
**Our应用**: [How to apply]

### Pattern 2: [Name]
...

## Architectural Decisions

| Decision  | Rationale   | Transferability   |
|----------|------------|------------------|
| [D1]      | [Why]       | [High/Medium/Low] |
| [D2]      | [Why]       | [High/Medium/Low] |

## Lessons Learned

### Adopt These
- [Pattern/concept to adopt]

### Adapt These
- [Pattern/concept to modify]

### Avoid These
- [Pattern/concept to not follow]

## Action Items
- [ ] Create skill based on pattern
- [ ] Update existing skill with insight
- [ ] Document pattern for future reference
```

---

## Connection to Learning Always

This skill feeds into deliverable #8 (Ingenieria Inversa) of the Learning Always pipeline.

Also connects to:
- **os-self-improvement**: Findings become OS improvements
- **compound-knowledge**: Patterns connect to existing knowledge

---

## ⚠️ Gotchas

### Gotcha 1: Superficial analysis from small repos
- **Por qué**: Small or early-stage repos may not have established architecture patterns worth extracting. The skill may over-analyze and generate false patterns from limited code.
- **Solución**: Set a minimum threshold: if the repo has fewer than 5 files or less than 1000 lines of meaningful code, flag it as "limited sample" and reduce the depth of analysis. Focus on tools/frameworks with proven adoption.

### Gotcha 2: Transferability overestimation
- **Por qué**: A pattern that works in a full-time team context may not transfer to a single-operator OS. The skill tends to recommend adoption without considering the operational context difference.
- **Solución**: Always filter recommendations through the "single operator" lens. Before marking something as "Adopt", ask: "Does this add complexity? Is it worth the maintenance cost?" Prefer simpler patterns that reduce cognitive load.

### Gotcha 3: Language-specific patterns get generalized incorrectly
- **Por qué**: A pattern discovered in a TypeScript codebase (e.g., dependency injection with decorators) may not transfer to Go or Python. The skill may present it as a universal pattern when it's language-specific.
- **Solución**: Always note the language and ecosystem context for each pattern. If the pattern requires a specific language feature, flag it as "language-dependent" and suggest equivalent patterns for other languages.

### Gotcha 4: Outdated repos mislead pattern extraction
- **Por qué**: The skill analyzes a repo at a single point in time. If the repo hasn't been maintained for 2+ years, the patterns extracted may be obsolete or based on deprecated practices.
- **Solución**: Check the repo's last commit date before analysis. If >12 months without recent activity, prefix the output with a "staleness warning". Cross-reference patterns with current best practices when possible.

---

## 💾 State Persistence

No persistent state between runs. Each analysis is stateless and generates a fresh output file. The skill:
- **Analyzes repos/tools at execution time** — relies on live data
- **Outputs structured markdown** with adoption recommendations
- **Saves findings to Engram** using `topic_key: learning/{pattern}` when patterns are extracted
- **No caching**: re-running with the same target generates a fresh analysis

For recurring analysis of the same target, save the output to Engram to track evolution over time.

---

## Related Skills

- **learning-url-to-knowledge**: Contains reverse engineering deliverable
- **os-self-improvement**: Apply lessons learned
- **compound-knowledge**: Connect patterns to existing

---

## Changelog

| Version  | Date      | Changes      |
|---------|----------|-------------|
| v1.0     | 2026-05-22| Initial skill|

---

**Status**: Ready to use

*Generated by Think Different PersonalOS v6.1 | Pure Green State*
