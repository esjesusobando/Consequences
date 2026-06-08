---
name: branch-pr
description: >
  PR creation workflow for Agent Teams Lite following the issue-first enforcement system.
  Trigger: When creating a pull request, opening a PR, or preparing changes for review.
  Triggers on: pull request, PR creation, branch preparation, code review, GitHub PR, opening PR, PR template
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "2.0"
---

## Esencia Original

### Metaskill
What specific problem this skill phase solves: Enforcing a strict issue-first PR workflow where every pull request is traceable to an approved issue, follows conventional commit conventions, passes automated checks, and meets the project's branch naming and labeling standards.

### Propósito original
Why this phase exists: To prevent untracked, unapproved changes from entering the codebase by making the PR process a mechanical enforcement of the issue-first policy — branch naming, label requirements, shellcheck, and template compliance are all checked automatically.

## When to Use

Use this skill when:
- Creating a pull request for any change
- Preparing a branch for submission
- Helping a contributor open a PR

## ⚠️ Gotchas

### Gotcha 1: Opening a PR without an approved issue
**Por qué**: The issue-first enforcement system blocks PRs that don't link a `status:approved` issue. If you skip this check and create the PR anyway, the GitHub Actions workflow will reject it.
**Solución**: Always verify the issue has `status:approved` BEFORE creating the branch. Run `gh issue view <number> --json labels` to confirm before any work starts.

### Gotcha 2: Mismatch between conventional commit type and PR label
**Por qué**: The commit type (e.g., `feat`) must map to the correct PR label (e.g., `type:feature`). A `docs:` commit with a `type:feature` label will fail the automated check.
**Solución**: Use the type-to-label mapping table in the skill to ensure consistency. The commit type AND the PR label must match the same category.

### Gotcha 3: Shellcheck passes locally but fails in CI due to different shell version
**Por qué**: The local shellcheck version might be older or have different default rules. A script that passes locally may reveal warnings on the CI runner's shellcheck version.
**Solución**: Use `shellcheck --norc` to avoid local config interference. Better yet, run shellcheck via the same Docker image used in CI or check the CI's shellcheck version in the workflow file.

## 💾 State Persistence

This skill does NOT manage SDD artifact state. It provides a PR creation workflow only.

- **Branch state**: Managed by git — the branch name encodes the type and scope.
- **PR state**: Managed by GitHub — the PR body, labels, and linked issue are all GitHub state.
- **Check state**: Managed by GitHub Actions — automated checks run on push/PR open.
- **No engram/openspec integration**: This skill is purely about the GitHub PR workflow. SDD state management (if used before branching) is handled by the SDD skills.

---

## Critical Rules

1. **Every PR MUST link an approved issue** — no exceptions
2. **Every PR MUST have exactly one `type:*` label**
3. **Automated checks must pass** before merge is possible
4. **Blank PRs without issue linkage will be blocked** by GitHub Actions

---

## Workflow

```
1. Verify issue has `status:approved` label
2. Create branch: type/description (see Branch Naming below)
3. Implement changes with conventional commits
4. Run shellcheck on modified scripts
5. Open PR using the template
6. Add exactly one type:* label
7. Wait for automated checks to pass
```

---

## Branch Naming

Branch names MUST match this regex:

```
^(feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert)\/[a-z0-9._-]+$
```

**Format:** `type/description` — lowercase, no spaces, only `a-z0-9._-` in description.

| Type       | Branch pattern          | Example                        |
|-----------|------------------------|-------------------------------|
| Feature    | `feat/<description>`    | `feat/user-login`              |
| Bug fix    | `fix/<description>`     | `fix/zsh-glob-error`           |
| Chore      | `chore/<description>`   | `chore/update-ci-actions`      |
| Docs       | `docs/<description>`    | `docs/installation-guide`      |
| Style      | `style/<description>`   | `style/format-scripts`         |
| Refactor   | `refactor/<description>`| `refactor/extract-shared-logic`|
| Performance| `perf/<description>`    | `perf/reduce-startup-time`     |
| Test       | `test/<description>`    | `test/add-setup-coverage`      |
| Build      | `build/<description>`   | `build/update-shellcheck`      |
| CI         | `ci/<description>`      | `ci/add-branch-validation`     |
| Revert     | `revert/<description>`  | `revert/broken-setup-change`   |

---

## PR Body Format

The PR template is at `.github/PULL_REQUEST_TEMPLATE.md`. Every PR body MUST contain:

### 1. Linked Issue (REQUIRED)

```markdown
Closes #<issue-number>
```

Valid keywords: `Closes #N`, `Fixes #N`, `Resolves #N` (case insensitive).
The linked issue MUST have the `status:approved` label.

### 2. PR Type (REQUIRED)

Check exactly ONE in the template and add the matching label:

| Checkbox           | Label to add          |
|-------------------|----------------------|
| Bug fix            | `type:bug`            |
| New feature        | `type:feature`        |
| Documentation only | `type:docs`           |
| Code refactoring   | `type:refactor`       |
| Maintenance/tooling| `type:chore`          |
| Breaking change    | `type:breaking-change`|

### 3. Summary

1-3 bullet points of what the PR does.

### 4. Changes Table

```markdown
| File          | Change      |
|--------------|------------|
| `path/to/file`| What changed|
```

### 5. Test Plan

```markdown
- [x] Scripts run without errors: `shellcheck scripts/*.sh`
- [x] Manually tested the affected functionality
- [x] Skills load correctly in target agent
```

### 6. Contributor Checklist

All boxes must be checked:
- Linked an approved issue
- Added exactly one `type:*` label
- Ran shellcheck on modified scripts
- Skills tested in at least one agent
- Docs updated if behavior changed
- Conventional commit format
- No `Co-Authored-By` trailers

---

## Automated Checks (all must pass)

| Check        | Job name                         | What it verifies                        |
|-------------|---------------------------------|----------------------------------------|
| PR Validation| `Check Issue Reference`          | Body contains `Closes/Fixes/Resolves #N`|
| PR Validation| `Check Issue Has status:approved`| Linked issue has `status:approved`      |
| PR Validation| `Check PR Has type:* Label`      | PR has exactly one `type:*` label       |
| CI           | `Shellcheck`                     | Shell scripts pass `shellcheck`         |

---

## Conventional Commits

Commit messages MUST match this regex:

```
^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\([a-z0-9\._-]+\))?!?: .+
```

**Format:** `type(scope): description` or `type: description`

- `type` — required, one of: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`
- `(scope)` — optional, lowercase with `a-z0-9._-`
- `!` — optional, indicates breaking change
- `description` — required, starts after `: `

Type-to-label mapping:

| Commit type     | PR label              |
|----------------|----------------------|
| `feat`          | `type:feature`        |
| `fix`           | `type:bug`            |
| `docs`          | `type:docs`           |
| `refactor`      | `type:refactor`       |
| `chore`         | `type:chore`          |
| `style`         | `type:chore`          |
| `perf`          | `type:feature`        |
| `test`          | `type:chore`          |
| `build`         | `type:chore`          |
| `ci`            | `type:chore`          |
| `revert`        | `type:bug`            |
| `feat!` / `fix!`| `type:breaking-change`|

Examples:
```
feat(scripts): add Codex support to setup.sh
fix(skills): correct topic key format in sdd-apply
docs(readme): update multi-model configuration guide
refactor(skills): extract shared persistence logic
chore(ci): add shellcheck to PR validation workflow
perf(scripts): reduce setup.sh execution time
style(skills): fix markdown formatting
test(scripts): add setup.sh integration tests
ci(workflows): add branch name validation
revert: undo broken setup change
feat!: redesign skill loading system
```

---

## Commands

```bash
# Create branch
git checkout -b feat/my-feature main

# Run shellcheck before pushing
shellcheck scripts/*.sh

# Push and create PR
git push -u origin feat/my-feature
gh pr create --title "feat(scope): description" --body "Closes #N"

# Add type label to PR
gh pr edit <pr-number> --add-label "type:feature"
```
