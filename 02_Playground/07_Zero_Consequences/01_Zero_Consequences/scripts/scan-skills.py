"""
Scan all installed skills and produce a searchable catalog.
Reports: directory tree, trigger keywords, description, and SKILL.md locations.

Safe: read-only, never modifies or copies.
"""
import os, json, datetime

SKILL_DIRS = [
    ("opencode_config", os.path.expanduser("~/.config/opencode/skills")),
    ("ce_plugin",       os.path.expanduser("~/.cache/opencode/packages")),
    ("agents",          os.path.expanduser("~/.agents/skills")),
    ("opencode_local",  os.path.expanduser("~/.opencode/skills")),
    ("claude",          os.path.expanduser("~/.claude/skills")),
]


def parse_frontmatter(text: str):
    lines = text.split("\n")
    fm = {}
    content_start = 0
    if lines and lines[0].strip() == "---":
        end_idx = None
        for i in range(1, len(lines)):
            if lines[i].strip() == "---":
                end_idx = i
                break
        if end_idx:
            for line in lines[1:end_idx]:
                line = line.strip()
                if ":" in line:
                    key, _, val = line.partition(":")
                    fm[key.strip()] = val.strip()
            content_start = end_idx + 1
    return fm


def main():
    catalog = []
    total_skills = 0

    for source_name, source_dir in SKILL_DIRS:
        if not os.path.isdir(source_dir):
            print(f"  SKIP (not found): {source_name} -> {source_dir}")
            continue

        for root, dirs, files in os.walk(source_dir):
            if "SKILL.md" not in files:
                continue
            total_skills += 1
            src_path = os.path.join(root, "SKILL.md")
            rel_path = os.path.relpath(src_path, source_dir)

            fm = {}
            try:
                with open(src_path, "r", encoding="utf-8") as f:
                    text = f.read()
                fm = parse_frontmatter(text)
            except Exception as e:
                print(f"  FAIL read: {src_path} → {e}")

            name = fm.get("name", "") or os.path.basename(root)
            description = fm.get("description", "")
            trigger = fm.get("trigger", fm.get("triggers", ""))

            catalog.append({
                "source": source_name,
                "rel_path": rel_path,
                "name": name,
                "description": description,
                "trigger": trigger,
                "dir": os.path.dirname(rel_path),
            })

            print(f"  [{source_name:15s}] {name:40s}  {description[:80]}")

    # Summary
    print(f"\n{'='*60}")
    print(f"  SCAN COMPLETE: {datetime.datetime.now().isoformat(timespec='seconds')}")
    print(f"  Total skills found: {total_skills}")
    print(f"{'='*60}")

    sources = {}
    for s in catalog:
        sources.setdefault(s["source"], 0)
        sources[s["source"]] += 1

    for src, count in sorted(sources.items()):
        print(f"  {src:20s} → {count:4d} skills")
    print(f"{'='*60}")

    # Optional: export JSON catalog
    catalog_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "backup", "skills-catalog.json"
    )
    os.makedirs(os.path.dirname(catalog_path), exist_ok=True)
    with open(catalog_path, "w", encoding="utf-8") as f:
        json.dump({
            "scan_timestamp": datetime.datetime.now().isoformat(timespec="seconds"),
            "total_skills": total_skills,
            "skills": catalog,
        }, f, indent=2, ensure_ascii=False)
    print(f"  Catalog JSON: {catalog_path}")


if __name__ == "__main__":
    main()
