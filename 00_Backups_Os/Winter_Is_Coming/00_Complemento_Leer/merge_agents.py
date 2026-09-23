#!/usr/bin/env python3
"""
Merge AGENTS.md — Think Different PersonalOS v1.0.0-consequences
Combines: 799-line (richest methodology) + 722-line (Engram/Persona/Projects) + updates
"""
import os

ROOT = r"C:\Users\sebas\Desktop\Think_Different"

# Read sources
with open(os.path.join(ROOT, "00_Winter_is_Coming", "AGENTS_799.md"), "r", encoding="utf-8") as f:
    base_799 = f.read()

with open(os.path.join(ROOT, "AGENTS.md"), "r", encoding="utf-8") as f:
    current_722 = f.read()

# Extract sections from 722 that are NOT in 799
def extract_section(text, start_marker, end_markers):
    """Extract section between start_marker and first matching end_marker."""
    idx = text.find(start_marker)
    if idx == -1:
        return ""
    # Find the next ## that ends this section
    remaining = text[idx + len(start_marker):]
    best_end = len(remaining)
    for em in end_markers:
        pos = remaining.find(em)
        if pos != -1 and pos < best_end:
            best_end = pos
    return text[idx:idx + len(start_marker) + best_end].rstrip()

# Get unique sections from 722
engram_section = extract_section(current_722, "## 📋 Engram Persistent Memory", ["## 🧑‍💻", "---\n\n## 🧑"])
persona_section = extract_section(current_722, "## 🧑‍💻 Persona Rules", ["## 🔗", "---\n\n## 🔗"])
projects_section = extract_section(current_722, "## 🔗 Active Projects", ["## 📝", "---\n\n## 📝"])
precommit_section = extract_section(current_722, "## 📝 Pre-Commit Doc", ["## 🔍", "---\n\n## 🔍"])
review_section = extract_section(current_722, "## 🔍 Review CLI Fallback", ["_Think Different", "---\n\n_Think"])

# Build the definitive AGENTS.md
# Strategy: Use 799 as base, insert missing sections from 722 before the footer

# Find the footer in 799
footer_marker = "_Think Different PersonalOS v1.0.0-consequences"
footer_idx = base_799.find(footer_marker)
if footer_idx == -1:
    footer_idx = base_799.rfind("---")

# Get the 799 content up to footer
main_content = base_799[:footer_idx].rstrip()

# Now build the additional sections from 722
additional = []

if engram_section:
    additional.append(engram_section)
if persona_section:
    additional.append(persona_section)
if projects_section:
    additional.append(projects_section)
if precommit_section:
    additional.append(precommit_section)
if review_section:
    additional.append(review_section)

# Assemble
parts = [main_content]
if additional:
    parts.append("\n\n---\n")
    parts.append("\n\n".join(additional))

# Add footer
parts.append(f"\n\n---\n\n_Think Different PersonalOS v1.0.0-consequences — Production Release (2026-09-20)_\n")

definitive = "\n".join(parts)

# Write to both locations
output_root = os.path.join(ROOT, "AGENTS.md")
output_winter = os.path.join(ROOT, "00_Winter_is_Coming", "AGENTS.md")

for path in [output_root, output_winter]:
    with open(path, "w", encoding="utf-8") as f:
        f.write(definitive)

print(f"OK Written: {len(definitive)} chars, {definitive.count(chr(10))} lines")
print(f"   -> {output_root}")
print(f"   -> {output_winter}")

# Cleanup temp file
temp = os.path.join(ROOT, "00_Winter_is_Coming", "AGENTS_799.md")
if os.path.exists(temp):
    os.remove(temp)
    print(f"OK Cleaned up AGENTS_799.md")
