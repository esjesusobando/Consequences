"""
Full backup of all system skills — preserves every SKILL.md with metadata.
Safe: copies only, never deletes or modifies.

Backup locations (both):
  1. backup/skills/ — full tree copy (exact paths)
  2. backup/skills-flat/ — single-file JSON with all metadata + content
  3. Console manifest (stdout)
"""
import os, json, sys, shutil, hashlib, datetime, platform

SKILL_DIRS = [
    ("opencode_config", os.path.expanduser("~/.config/opencode/skills")),
    ("ce_plugin",       os.path.expanduser("~/.cache/opencode/packages")),
    ("agents",          os.path.expanduser("~/.agents/skills")),
    ("opencode_local",  os.path.expanduser("~/.opencode/skills")),
    ("claude",          os.path.expanduser("~/.claude/skills")),
]

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKUP_DIR = os.path.join(BASE, "backup", "skills")
FLAT_JSON = os.path.join(BASE, "backup", "skills-all.json")
TIMESTAMP = datetime.datetime.now().isoformat(timespec="seconds")

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
    content = "\n".join(lines[content_start:]).strip()
    return fm, content

def main():
    manifest = []
    seen_files = set()

    for source_name, source_dir in SKILL_DIRS:
        if not os.path.isdir(source_dir):
            print(f"  SKIP (not found): {source_name} -> {source_dir}")
            continue

        for root, dirs, files in os.walk(source_dir):
            if "SKILL.md" not in files:
                continue
            src_path = os.path.join(root, "SKILL.md")

            # Avoid dupes
            if src_path in seen_files:
                continue
            seen_files.add(src_path)

            rel_path = os.path.relpath(src_path, source_dir)
            dst_path = os.path.join(BACKUP_DIR, source_name, rel_path)

            try:
                with open(src_path, "r", encoding="utf-8") as f:
                    text = f.read()
            except Exception as e:
                print(f"  FAIL read: {src_path} → {e}")
                continue

            fm, content = parse_frontmatter(text)
            name = fm.get("name", "") or os.path.basename(root)

            # Tree backup
            os.makedirs(os.path.dirname(dst_path), exist_ok=True)
            copy_ok = False
            try:
                src = src_path
                if platform.system() == "Windows" and len(src_path) > 200:
                    src = "\\\\?\\" + os.path.abspath(src_path)
                shutil.copy2(src, dst_path)
                if os.path.exists(dst_path):
                    copy_ok = True
                else:
                    print(f"  FAIL verify: {dst_path} does not exist after copy")
            except Exception as e:
                print(f"  FAIL copy: {src_path} → {dst_path}: {e}")

            if copy_ok:
                size = os.path.getsize(src_path)
                mtime = datetime.datetime.fromtimestamp(os.path.getmtime(src_path)).isoformat(timespec="seconds")
                checksum = hashlib.md5(text.encode()).hexdigest()

                manifest.append({
                    "source": source_name,
                    "rel_path": rel_path,
                    "full_path": src_path,
                    "name": name,
                    "description": fm.get("description", ""),
                    "size_bytes": size,
                    "modified": mtime,
                    "checksum_md5": checksum,
                    "content_length": len(content),
                    "copied_ok": True,
                })
            else:
                print(f"  SKIP manifest: {src_path} (copy failed)")

    # Sort manifest
    manifest.sort(key=lambda m: (m["source"], m["rel_path"]))

    # Flat JSON backup
    os.makedirs(os.path.dirname(FLAT_JSON), exist_ok=True)
    with open(FLAT_JSON, "w", encoding="utf-8") as f:
        json.dump({
            "backup_timestamp": TIMESTAMP,
            "total_skills": len(manifest),
            "skills": manifest,
        }, f, indent=2, ensure_ascii=False)

    # Summary
    sources = {}
    for m in manifest:
        sources.setdefault(m["source"], 0)
        sources[m["source"]] += 1

    print(f"\n{'='*60}")
    print(f"  BACKUP COMPLETE: {TIMESTAMP}")
    print(f"  Total skills: {len(manifest)}")
    print(f"  Tree backup:  {BACKUP_DIR}")
    print(f"  JSON backup:  {FLAT_JSON}")
    print(f"{'='*60}")
    for src, count in sorted(sources.items()):
        print(f"  {src:20s} → {count:4d} skills")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
