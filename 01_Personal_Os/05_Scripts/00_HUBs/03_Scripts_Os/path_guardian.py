#!/usr/bin/env python3
"""
path_guardian.py — Centralised Safe Path Resolution for PersonalOS v1.0

Eliminates the fragile ``next(p for p in ...parents if p.name == ...)``
pattern by providing typed, validated, consistent path-resolution functions.

Usage:
    from path_guardian import resolve_os_root, resolve_project_root, detect_copy_type

    root = resolve_os_root(Path(__file__).resolve().parent)
    project = resolve_project_root()
    copy = detect_copy_type()
"""

import logging
import sys
from pathlib import Path
from typing import Literal, Optional

from os_errors import OSPathError, ensure_path

logger = logging.getLogger(__name__)

# Sentinel markers
_OS_SENTINEL = "01_Personal_Os"
_PROJECT_SENTINEL = "00_Winter_is_Coming"
_COPY_A_MARKER = "08_Report"


def resolve_os_root(start_path: Optional[Path] = None) -> Path:
    """Walk up from *start_path* and return the nearest ``01_Personal_Os`` directory.

    Args:
        start_path: Directory to start the upward search from.
                    Defaults to the parent of ``__file__``.

    Returns:
        Absolute path to the ``01_Personal_Os`` directory.

    Raises:
        OSPathError: If ``01_Personal_Os`` cannot be found in the ancestor chain.
    """
    if start_path is None:
        start_path = Path(__file__).resolve().parent

    start = start_path.resolve()
    for candidate in [start, *start.parents]:
        if candidate.name == _OS_SENTINEL:
            logger.debug("resolve_os_root found at %s", candidate)
            return candidate

    raise OSPathError(
        message=f"Could not find {_OS_SENTINEL} directory",
        path=start,
        hint=f"Searched upward from {start}. Ensure the script runs within "
             f"a PersonalOS tree that contains a `{_OS_SENTINEL}/` directory.",
    )


def resolve_project_root(start_path: Optional[Path] = None) -> Path:
    """Walk up from *start_path* and return the project root.

    The project root is the directory that contains ``00_Winter_is_Coming/``.

    Args:
        start_path: Directory to start the upward search from.
                    Defaults to the parent of ``__file__``.

    Returns:
        Absolute path to the project root.

    Raises:
        OSPathError: If the project root cannot be found.
    """
    if start_path is None:
        start_path = Path(__file__).resolve().parent

    start = start_path.resolve()
    for candidate in [start, *start.parents]:
        if (candidate / _PROJECT_SENTINEL).exists():
            logger.debug("resolve_project_root found at %s", candidate)
            return candidate

    raise OSPathError(
        message=f"Could not find project root (no {_PROJECT_SENTINEL}/ found)",
        path=start,
        hint=f"Searched upward from {start}. Run from within a PersonalOS checkout.",
    )


def detect_copy_type(start_path: Optional[Path] = None) -> Literal["A", "B"]:
    """Detect which PersonalOS copy the script runs from.

    Uses the same marker convention as ``config_paths.find_project_root()``.

    - **Copy B** (canonical): ``01_Personal_Os`` sits alongside ``00_Winter_is_Coming/``
    - **Copy A** (mirror):    ``01_Personal_Os`` contains ``08_Report/``

    Args:
        start_path: Directory to start the upward search from.

    Returns:
        ``"B"`` for the canonical copy, ``"A"`` for the flat mirror copy.

    Raises:
        OSPathError: If the copy type cannot be determined.
    """
    personal_os = resolve_os_root(start_path)
    parent = personal_os.parent

    # Copy B: project root (parent) has the sentinel
    if (parent / _PROJECT_SENTINEL).exists():
        return "B"

    # Copy A: the OS root itself has the flat marker
    if (personal_os / _COPY_A_MARKER).is_dir():
        return "A"

    raise OSPathError(
        message="Cannot detect copy type — no marker found",
        path=personal_os,
        hint=f"Expected either {_PROJECT_SENTINEL}/ next to {_OS_SENTINEL}/ "
             f"(Copy B) or {_COPY_A_MARKER}/ inside {_OS_SENTINEL}/ (Copy A).",
    )


def resolve_core_path(start_path: Optional[Path] = None) -> Path:
    """Resolve ``00_Core`` directory relative to the OS root.

    Returns:
        Absolute path to ``01_Personal_Os/00_Core``.
    """
    os_root = resolve_os_root(start_path)
    core = os_root / "00_Core"
    return core


def resolve_engine_path(start_path: Optional[Path] = None) -> Path:
    """Resolve engine (scripts OS) directory.

    Returns:
        Absolute path to ``01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os``.
    """
    os_root = resolve_os_root(start_path)
    engine = os_root / "05_Scripts" / "00_HUBs" / "03_Scripts_Os"
    return engine


# ── CLI self‑test ───────────────────────────────────────

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Path Guardian — Self-Test")
    parser.add_argument("--validate", action="store_true", help="Run all checks and report")
    args = parser.parse_args()

    if args.validate:
        ok = True
        for name, func in [
            ("resolve_os_root", resolve_os_root),
            ("resolve_project_root", resolve_project_root),
            ("detect_copy_type", detect_copy_type),
            ("resolve_core_path", resolve_core_path),
            ("resolve_engine_path", resolve_engine_path),
        ]:
            try:
                result = func()
                print(f"[OK] {name} -> {result}")
            except OSPathError as e:
                print(f"[FAIL] {name}: {e}")
                ok = False

        print()
        if ok:
            print("All path guardian checks passed.")
            sys.exit(0)
        else:
            print("Some checks failed.", file=sys.stderr)
            sys.exit(1)
    else:
        print("Running without --validate uses default caller location:")
        print(f"  OS root:   {resolve_os_root()}")
        print(f"  Project:   {resolve_project_root()}")
        print(f"  Copy type: {detect_copy_type()}")
