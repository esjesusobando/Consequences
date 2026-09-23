---
source: 'C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\02_Docs\runtime-errors\windows-stderr-encoding-closed-file-2026-07-15.md'
sync_source: "C:\Users\sebas\Desktop\Think_Different\01_Personal_Os\02_Knowledge\02_Docs\runtime-errors\windows-stderr-encoding-closed-file-2026-07-15.md"
sync_date: "2026-08-01T00:55:47.657031"
sync_updated: true
title: "Windows stderr encoding: I/O operation on closed file"
---

# Windows stderr encoding: I/O operation on closed file

## Problem

Python scripts that wrap `sys.stdout` and `sys.stderr` with `io.TextIOWrapper` at module level crash with `ValueError: I/O operation on closed file` during interpreter shutdown on Windows.

## Symptoms

```
object address  : 000001DAA25DE6E0
object refcount : 3
object type     : 00007FFACEE4CA80
object type name: ValueError
object repr     : ValueError('I/O operation on closed file.')
lost sys.stderr
```

The error occurs during Python's cleanup phase — after all user code has executed. It manifests when stderr or stdout wrapping uses the `io.TextIOWrapper(sys.stdout.buffer, ...)` pattern.

## What Didn't Work

### Attempt 1: try/except around the wrapping
```python
try:
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")
except (AttributeError, ValueError):
    pass
```
**Failed because**: The wrapping succeeds at import time. The error happens later during interpreter cleanup when Python closes the original file descriptors — long after the try/except block has passed.

### Attempt 2: Remove stderr wrapping only
Removing `sys.stderr` wrapping while keeping `sys.stdout` wrapping still produced the error on stdout.

**Failed because**: The root cause is the wrapping pattern itself, not which stream is wrapped.

## Solution

Replace `io.TextIOWrapper` wrapping with `sys.stdout.reconfigure()` (Python 3.7+):

**Before (broken on Windows):**
```python
import io, sys

if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")
```

**After (works on Windows):**
```python
import sys

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass
```

Key changes:
1. `sys.stdout.reconfigure()` modifies the existing stream in-place instead of wrapping it
2. Removed `sys.stderr` wrapping entirely (not needed for most scripts)
3. Added try/except for environments where `reconfigure` isn't available

## Why This Works

`io.TextIOWrapper(sys.stdout.buffer, ...)` creates a **new** wrapper object that holds a reference to the original buffer. When Python's interpreter shuts down, it closes the original `sys.stdout` (and its buffer). The wrapper object still exists but its underlying buffer is closed — any subsequent write fails with "I/O operation on closed file."

`sys.stdout.reconfigure()` modifies the **existing** stream object in-place. There's no separate wrapper to outlive the original. When Python closes stdout during cleanup, there's no dangling reference.

## Prevention

1. **Never use `io.TextIOWrapper(sys.stdout.buffer, ...)` in scripts** — use `reconfigure()` instead
2. **Don't wrap stderr unless truly needed** — most scripts only need stdout encoding fixed
3. **Test on Windows** — this issue is Windows-specific; Linux/macOS don't exhibit it
4. **If you must wrap**, do it inside `try/except` at function scope, not module level, and accept that cleanup errors are possible

## References

- Python docs: `io.TextIOWrapper` — https://docs.python.org/3/library/io.html#io.TextIOWrapper
- Python docs: `TextIOWrapper.reconfigure` — https://docs.python.org/3/library/io.html#io.TextIOWrapper.reconfigure
- Discovered while building English Learning System for Think Different PersonalOS
