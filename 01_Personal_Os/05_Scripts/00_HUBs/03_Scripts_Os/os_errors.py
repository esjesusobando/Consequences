#!/usr/bin/env python3
"""
os_errors.py — PersonalOS Error Taxonomy v1.0

Jerarquía de excepciones tipadas para todo el OS.
Reemplaza RuntimeError, ValueError, AssertionError, StopIteration
con excepciones semánticas que incluyen path y hint contextual.
"""

from pathlib import Path
from typing import Any, Callable, Optional


class PersonalOSError(Exception):
    """Base exception for all PersonalOS errors."""

    def __init__(
        self,
        message: str,
        path: Optional[Path] = None,
        hint: Optional[str] = None,
    ):
        self.message = message
        self.path = path
        self.hint = hint
        parts = [message]
        if path:
            parts.append(f"at {path}")
        if hint:
            parts.append(f"[hint: {hint}]")
        super().__init__(" — ".join(parts))

    def __str__(self) -> str:
        return super().__str__()


class OSPathError(PersonalOSError):
    """Path resolution failure — directorio o archivo no encontrado."""


class OSConfigError(PersonalOSError):
    """Configuration error — variable faltante, formato inválido."""


class OSSyncError(PersonalOSError):
    """Synchronisation error — drift, copy mismatch, backup failure."""


class OSSecurityError(PersonalOSError):
    """Security violation — secret detected, permissions issue."""


class OSStateError(PersonalOSError):
    """Invalid state transition — precondition not met."""


# ── Helpers ──────────────────────────────────────────────


def safe_find(
    iterable: list[Any],
    predicate: Callable[[Any], bool],
    name: str = "item",
) -> Any:
    """Find first matching item or raise ``OSPathError``.

    Replaces the ``next(x for x in ... if cond)`` pattern that crashes
    with ``StopIteration`` when no match is found.

    Args:
        iterable: Sequence to search.
        predicate: Truthy test to apply to each element.
        name: Human-readable label for the searched item (used in error).

    Returns:
        The first element for which ``predicate`` returns True.

    Raises:
        OSPathError: If no element matches.
    """
    items = list(iterable)
    for item in items:
        if predicate(item):
            return item
    raise OSPathError(
        message=f"Could not find {name} in iterable",
        hint=f"Searched through {len(items)} candidate(s). "
             "Verify the item exists and the predicate is correct.",
    )


def ensure_path(
    path: Path,
    purpose: str = "path",
) -> Path:
    """Ensure *path* exists on disk or raise ``OSPathError``.

    Args:
        path: Filesystem path to validate.
        purpose: Short description of what this path is for.

    Returns:
        The same *path* if it exists.

    Raises:
        OSPathError: If *path* does not exist.
    """
    if path.exists():
        return path
    raise OSPathError(
        message=f"{purpose} not found: {path}",
        path=path,
        hint=f"Create the directory or check that the path is correct. "
             f"If this is a new OS setup, run `python config_paths.py --validate`.",
    )
