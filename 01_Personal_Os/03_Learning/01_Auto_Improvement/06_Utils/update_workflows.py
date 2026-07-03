#!/usr/bin/env python3
"""Update outdated paths in workflows"""

import re
from pathlib import Path

WORKFLOWS = Path(
    "C:/Users/sebas/Downloads/01 Revisar/09 Versiones/00 Respaldo PC Sebas/01 Github/personal-os/Think_Different/.agent/03_Workflows"
)

# Outdated paths to update
UPDATES = [
    # (old_pattern, new_pattern, count)
    ("05_Scripts", "05_Scripts", 3),
]

# Files to update
files_to_check = [
    "13_System_Health_Audit.md",
    "11_Ritual_Cierre_Protocol.md",
]

print("Updating outdated paths in workflows...\n")

for filename in files_to_check:
    filepath = WORKFLOWS / filename
    if not filepath.exists():
        print(f"[X] Not found: {filename}")
        continue

    content = filepath.read_text(encoding="utf-8")
    original = content

    # Replace 04_Operations with 04_Operations
    content = content.replace("05_Scripts", "05_Scripts")

    # Also update specific patterns that changed
    content = content.replace("01_Brain", "00_Core")
    content = content.replace("05_Scripts", "05_Scripts")

    if content != original:
        filepath.write_text(content, encoding="utf-8")
        changes = original.count("05_Scripts") - content.count("05_Scripts")
        print(f"[OK] Updated: {filename} ({changes} replacements)")
    else:
        print(f"[-] Skipped: {filename} (no changes)")

print("\nDone!")
