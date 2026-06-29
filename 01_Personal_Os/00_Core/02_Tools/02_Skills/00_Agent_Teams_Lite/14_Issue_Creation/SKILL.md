---
name: issue-creation
description: >
  Issue creation workflow for Agent Teams Lite following the issue-first enforcement system.
  Trigger: When creating a GitHub issue, reporting a bug, or requesting a feature.
  Triggers on: issue creation, bug report, feature request, GitHub issue, triage, maintainer approval, needs-review
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
sota_upgraded: true
---

## Esencia Original

### Metaskill
What specific problem this skill phase solves: Standardizing GitHub issue creation through enforced templates (bug report or feature request), auto-labeling, and a maintainer approval workflow that gates PR readiness behind explicit `status:approved` labels.

### Propósito original
Why this phase exists: To eliminate blank, vague, or duplicate issues by forcing structure through templates, and to establish a clear triage pipeline where maintainers explicitly approve issues before any implementation work begins — preventing wasted effort on out-of-scope changes.

## When to Use

Use this skill when:
- Creating a GitHub issue (bug report or feature request)
- Helping a contributor file an issue
- Triaging or approving issues as a maintainer

## ⚠️ Gotchas

### Gotcha 1: Forgetting to search for duplicates before creating an issue
**Por qué**: Creating a duplicate issue fragments the discussion and confuses the triage process. The pre-flight checkboxes are self-reported and not enforced — contributors can check them without actually searching.
**Solución**: Always run `gh issue list --search "<keywords>"` BEFORE creating the issue. If a duplicate exists, link it and close the new one. Don't rely on the submitter's self-check.

### Gotcha 2: Using issues for questions instead of Discussions
**Por qué**: The repo explicitly routes questions to Discussions, but the GitHub UI makes it easy to file an issue instead. This pollutes the issue tracker with non-actionable items.
**Solución**: If a submission looks like a question ("how do I...", "is it possible to..."), apply the label `type:question` and redirect to Discussions with a link. Do not add `status:needs-review`.

### Gotcha 3: Approving an issue that is too vague to implement
**Por qué**: Adding `status:approved` to an issue with insufficient detail creates a problem downstream: the PR author has to guess at requirements, and the review will be contentious.
**Solución**: Before approving, ensure the issue has clear acceptance criteria: specific reproduction steps for bugs, or a concrete proposed solution for features. If not, ask for clarification first.

## 💾 State Persistence

This skill does NOT manage SDD artifact state. It provides an issue creation workflow only.

- **Issue state**: Managed by GitHub — labels (`status:needs-review`, `status:approved`, `type:*`, `priority:*`) and issue body are all GitHub state.
- **Template state**: Managed by GitHub — issue templates live in `.github/ISSUE_TEMPLATE/` and are version-controlled.
- **No engram/openspec integration**: This skill is purely about the GitHub issue workflow. SDD state management (if used after issue approval) is handled by the SDD skills.
- **Maintainer actions**: Approval (`status:approved`) and priority labels are set via `gh issue edit` and persist in GitHub.

---

## Critical Rules

1. **Blank issues are disabled** — MUST use a template (bug report or feature request)
2. **Every issue gets `status:needs-review` automatically** on creation
3. **A maintainer MUST add `status:approved`** before any PR can be opened
4. **Questions go to [Discussions](https://github.com/Gentleman-Programming/agent-teams-lite/discussions)**, not issues

---

## Workflow

```
1. Search existing issues for duplicates
2. Choose the correct template (Bug Report or Feature Request)
3. Fill in ALL required fields
4. Check pre-flight checkboxes
5. Submit → issue gets status:needs-review automatically
6. Wait for maintainer to add status:approved
7. Only then open a PR linking this issue
```

---

## Issue Templates

### Bug Report

Template: `.github/ISSUE_TEMPLATE/bug_report.yml`
Auto-labels: `bug`, `status:needs-review`

#### Required Fields

| Field                 | Description                                                                |
|----------------------|---------------------------------------------------------------------------|
| **Pre-flight Checks** | Checkboxes: no duplicate + understands approval workflow                   |
| **Bug Description**   | Clear description of the bug                                               |
| **Steps to Reproduce**| Numbered steps to reproduce                                                |
| **Expected Behavior** | What should have happened                                                  |
| **Actual Behavior**   | What happened instead (include errors/logs)                                |
| **Operating System**  | Dropdown: macOS, Linux variants, Windows, WSL                              |
| **Agent / Client**    | Dropdown: Claude Code, OpenCode, Gemini CLI, Cursor, Windsurf, Codex, Other|
| **Shell**             | Dropdown: bash, zsh, fish, Other                                           |

#### Optional Fields

| Field                 | Description                              |
|----------------------|-----------------------------------------|
| **Relevant Logs**     | Log output (auto-formatted as code block)|
| **Additional Context**| Screenshots, workarounds, extra info     |

#### Example — Bug Report via CLI

```bash
gh issue create --template "bug_report.yml" \
  --title "fix(scripts): setup.sh fails on zsh with glob error" \
  --body "
### Pre-flight Checks
- [x] I have searched existing issues and this is not a duplicate
- [x] I understand this issue needs status:approved before a PR can be opened

### Bug Description
Running setup.sh on zsh throws a glob error when no matching files exist.

### Steps to Reproduce
1. Clone the repo
2. Run \`./scripts/setup.sh\` in zsh
3. See error: \`zsh: no matches found: skills/*\`

### Expected Behavior
The script should handle missing glob matches gracefully.

### Actual Behavior
Script crashes with glob error.

### Operating System
macOS

### Agent / Client
Claude Code

### Shell
zsh

### Relevant Logs
\`\`\`
zsh: no matches found: skills/*
\`\`\`
"
```

---

### Feature Request

Template: `.github/ISSUE_TEMPLATE/feature_request.yml`
Auto-labels: `enhancement`, `status:needs-review`

#### Required Fields

| Field                  | Description                                                            |
|-----------------------|-----------------------------------------------------------------------|
| **Pre-flight Checks**  | Checkboxes: no duplicate + understands approval workflow               |
| **Problem Description**| The pain point this feature solves                                     |
| **Proposed Solution**  | How it should work from the user's perspective                         |
| **Affected Area**      | Dropdown: Scripts, Skills, Examples, Documentation, CI/Workflows, Other|

#### Optional Fields

| Field                      | Description                    |
|---------------------------|-------------------------------|
| **Alternatives Considered**| Other approaches or workarounds|
| **Additional Context**     | Mockups, examples, references  |

#### Example — Feature Request via CLI

```bash
gh issue create --template "feature_request.yml" \
  --title "feat(scripts): add Codex support to setup.sh" \
  --body "
### Pre-flight Checks
- [x] I have searched existing issues and this is not a duplicate
- [x] I understand this issue needs status:approved before a PR can be opened

### Problem Description
The setup script only configures Claude Code, Gemini CLI, and OpenCode. Codex users have to manually copy skills.

### Proposed Solution
Add a Codex option to setup.sh that links skills to the .codex/ directory.

Example:
\`\`\`bash
./scripts/setup.sh --agent codex
\`\`\`

### Affected Area
Scripts (setup, installation)

### Alternatives Considered
Manually symlinking, but that defeats the purpose of the setup script.
"
```

---

## Label System

### Applied Automatically on Issue Creation

| Template       | Labels added                        |
|---------------|------------------------------------|
| Bug Report     | `bug`, `status:needs-review`        |
| Feature Request| `enhancement`, `status:needs-review`|

### Applied by Maintainers

| Label            | When to apply                                            |
|-----------------|---------------------------------------------------------|
| `status:approved`| Issue accepted for implementation — PRs can now be opened|
| `priority:high`  | Critical bug or urgent feature                           |
| `priority:medium`| Important but not blocking                               |
| `priority:low`   | Nice to have                                             |

---

## Maintainer Approval Workflow

```
1. New issue arrives with status:needs-review
2. Review the issue — is it valid, clear, and in scope?
3. If YES → add status:approved label
4. If NO → comment with reason, close if needed
5. Contributor can now open a PR linking this issue
```

---

## Decision Tree

```
Is it a bug?                    → Use Bug Report template
Is it a new feature/improvement? → Use Feature Request template
Is it a question?               → Use Discussions, NOT issues
Is it a duplicate?              → Link to existing issue, close
```

---

## Commands

```bash
# Search existing issues before creating
gh issue list --search "keyword"

# Create bug report
gh issue create --template "bug_report.yml" --title "fix(scope): description"

# Create feature request
gh issue create --template "feature_request.yml" --title "feat(scope): description"

# Maintainer: approve an issue
gh issue edit <number> --add-label "status:approved"

# Maintainer: add priority
gh issue edit <number> --add-label "priority:high"
```


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
