# 🧪 Go Testing — References

Reference materials for Go testing in Bubbletea TUI applications.

## Official Documentation

| Resource              | Link                                 |
| --------------------- | ------------------------------------ |
| Go Testing Package    | https://pkg.go.dev/testing           |
| Go Table-Driven Tests | https://go.dev/wiki/TableDrivenTests |
| Go Coverage           | https://go.dev/blog/cover            |
| Testify               | https://github.com/stretchr/testify  |
| Go Mock               | https://github.com/uber-go/mock      |

## Bubbletea Testing

| Resource        | Link                                                           |
| --------------- | -------------------------------------------------------------- |
| Teatest package | https://github.com/charmbracelet/bubbletea/tree/master/teatest |
| Bubbletea docs  | https://github.com/charmbracelet/bubbletea                     |
| Lipgloss        | https://github.com/charmbracelet/lipgloss                      |

## Common Testing Commands

```bash
go test ./...                           # Run all tests
go test -v ./internal/tui/...          # Verbose output for TUI tests
go test -run TestNavigation            # Run specific test by name pattern
go test -cover ./...                   # Run with coverage report
go test -coverprofile=coverage.out     # Save coverage to file
go tool cover -html=coverage.out       # View coverage in browser
go test -update ./...                  # Update golden files (custom flag)
go test -short ./...                   # Skip integration tests
go test -count=1 ./...                 # Disable test caching (force re-run)
```

## Golden File Pattern

Golden files are stored in `testdata/` directories alongside tests:

```
internal/tui/
├── model_test.go
├── testdata/
│   ├── TestOSSelectGolden.golden
│   └── TestViewGolden.golden
```

**Workflow:**
1. Run `go test -update` to regenerate golden files
2. Review the diff to confirm changes are intentional
3. Commit updated golden files with the source changes

## Mock Interfaces Pattern

For system dependencies (os/exec, filesystem, etc.), define interfaces:

```go
type SystemExecutor interface {
    ExecuteCommand(name string, args ...string) (string, error)
}
```

Then use `t.TempDir()` in tests for filesystem isolation and mock the executor for command tests.

## Windows Compatibility Notes

- `t.TempDir()` returns `\` path separators on Windows
- Use `filepath.ToSlash()` for comparisons with expected forward-slash paths
- Use `filepath.Join()` instead of string concatenation for path construction
- Golden file comparisons may fail on Windows if paths differ