# 🔍 SDD Verify — References

Reference materials for the SDD Verify phase.

## Related Documentation

| Resource | Purpose |
|----------|---------|
| [Go `testing` package](https://pkg.go.dev/testing) | Standard library for writing Go tests |
| [Go `testify`](https://github.com/stretchr/testify) | Popular assertion and mocking library |
| [pytest docs](https://docs.pytest.org/) | Python test framework |
| [Vitest docs](https://vitest.dev/) | Vite-native test framework for JS/TS |

## Spec Compliance Patterns

- **BDD-style scenarios**: Use Given/When/Then format in spec docs to make compliance mapping explicit.
- **Test naming convention**: Name tests to match spec scenarios (`TestReq01_FeatureX_HappyPath`).
- **Coverage thresholds**: Configure via `openspec/config.yaml → rules.verify.coverage_threshold`.

## Common Test Runners

| Project Type | Detection | Command |
|-------------|-----------|---------|
| Go | `go.mod` exists | `go test ./...` |
| Node.js | `package.json` has `scripts.test` | `npm test` / `yarn test` |
| Python | `pytest.ini` or `pyproject.toml` | `pytest` |
| Rust | `Cargo.toml` exists | `cargo test` |

## Build Commands

| Project Type | Detection | Command |
|-------------|-----------|---------|
| Go | `go.mod` exists | `go build ./...` |
| Node.js + TS | `tsconfig.json` exists | `tsc --noEmit` |
| Python | `pyproject.toml` | `python -m build` |
