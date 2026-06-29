---
description: 17_Testing_Coverage
globs: **/*
alwaysApply: true
sota_upgraded: true
---

# Skill: gga-testing-coverage

## Purpose
Ensure test coverage for all behavior changes in GGA.

## When to Use
When implementing behavior changes in any script (`bin/gga`, `lib/*.sh`).

## Framework
ShellSpec — https://shellspec.info/

## Test Structure

```
spec/
├── unit/           # Isolated function tests (no external calls)
│   ├── cache_spec.sh
│   └── providers_spec.sh
├── integration/    # Full command + hook + CI mode tests
│   └── commands_spec.sh
├── support/        # Shared helpers, fixtures
└── spec_helper.sh  # Global setup
```

**Unit tests** → test functions in `lib/cache.sh`, `lib/providers.sh` in isolation.
**Integration tests** → test `gga` CLI commands, hook injection, CI mode end-to-end.

## Running Tests

| Command                                                                    | What It Does                                           |
|---------------------------------------------------------------------------|-------------------------------------------------------|
| `make test`                                                                | Run all tests                                          |
| `shellspec spec/unit`                                                      | Unit tests only                                        |
| `shellspec spec/integration/commands_spec.sh`                              | Integration tests only                                 |
| `shellspec spec/unit/cache_spec.sh:65`                                     | Single test at line 65                                 |
| `shellspec --format documentation`                                         | Verbose output with names                              |

## Critical Rules
- Every feature or bug fix MUST include tests — no exceptions
- Use `setup`/`cleanup` blocks with temp dirs for test isolation
- Mock external commands (providers, git) in unit tests — never call real providers
- Ollama tests skip automatically when no server is running (use `skip_if_no_ollama`)
- Run `make test` before every push

## ShellSpec Patterns

```bash
# Basic structure
Describe 'function_name'
  setup() { ... }
  cleanup() { ... }

  It 'does something'
    When call function_name arg
    The status should be success
    The output should include "expected"
  End
End

# Custom assertion (use Assert for comparisons, not bare The status)
It 'returns a count less than 10'
  When call get_count
  The output should be present
  Assert [ "$(get_count)" -lt 10 ]
End

# Skip conditionally
skip_if_no_ollama() {
  ! curl -s http://localhost:11434/api/tags >/dev/null 2>&1 && \
    skip "Ollama not running"
}
```

## Gotchas
- `The status should be success` ONLY works after `When run` or `When call`
- Use `Assert [ "$a" -lt "$b" ]` for numeric comparisons, not `The value`
- Temp dirs must be created in `setup` and removed in `cleanup`
- Source scripts with absolute paths or via `$SHELLSPEC_ROOT`

## Cookbook

| If...                                                  | Then...                                                                     |
|-------------------------------------------------------|----------------------------------------------------------------------------|
| Adding a new lib function                              | Add unit test in `spec/unit/`                                               |
| Adding a new CLI flag                                  | Add integration test in `spec/integration/`                                 |
| Fixing a cache bug                                     | Add regression test at the failing case                                     |
| Changing hook behavior                                 | Add/update integration test for hook injection                              |
| Adding a provider                                      | Add unit mock test + integration skip test                                  |


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
