# Purpose

Execute a raw CLI command.

## Instructions

- Before executing the command, run `<command> --help` to understand the command and its options.
- Validate that the command is safe and appropriate for the user's request.

## Workflow

1. Understand the user's requested CLI command
2. Optionally run `<command> --help` to verify command syntax
3. Construct the full command string
4. Execute: `python 01_Personal_Os/01_Core/02_Tools/02_Skills/07_Personal_Os/02_Personal_Os/08_Personal_Os/01_Fork_Terminal/tools/fork_terminal.py "<FULL_COMMAND>"`

## Examples

### Simple command

```bash
python 01_Personal_Os/01_Core/02_Tools/02_Skills/07_Personal_Os/02_Personal_Os/08_Personal_Os/01_Fork_Terminal/tools/fork_terminal.py "dir /s"
```

### Multiple commands

```bash
python 01_Personal_Os/01_Core/02_Tools/02_Skills/07_Personal_Os/02_Personal_Os/08_Personal_Os/01_Fork_Terminal/tools/fork_terminal.py "cd src && npm run build"
```

### Long-running process

```bash
python 01_Personal_Os/01_Core/02_Tools/02_Skills/07_Personal_Os/02_Personal_Os/08_Personal_Os/01_Fork_Terminal/tools/fork_terminal.py "npm run dev"
```
