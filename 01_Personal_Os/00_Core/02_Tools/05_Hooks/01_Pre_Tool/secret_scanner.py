#!/usr/bin/env python3
"""
secret_scanner.py v2.0 — Pre-commit hook + full-repo secret scanner.

Patrones detectados:
  - API keys: Anthropic, OpenAI, Notion, Linear, Supabase, Stripe, GitHub, Google, AWS, Firecrawl, Exa
  - Tokens: Slack bot/app, generic Bearer
  - Files: .env, .env.* (excepto .env.example), credentials.*
  - Private keys (PEM)

Modos:
   (default)    — escanea staged files (pre-commit hook)
   --file PATH  — escanea un archivo
   --all        — escanea todo el repo (respeta .gitignore)
   --full-scan  — como --all pero produce JSON report machine-parseable
   --diff       — muestra qué reemplazaría sin modificar archivos
   --fix        — reemplaza matches con ``${VAR_NAME}`` placeholders
                  SOLO opera sobre config.json, mcp.json, opencode.json

Exit codes:
   0 — clean
   1 — secrets detected (bloquea commit)
"""

import argparse
import fnmatch
import io
import json
import re
import subprocess
import sys
from pathlib import Path

if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

_MATCH_TRUNCATE = 60


SECRET_PATTERNS: list[tuple[str, str]] = [
    # ── LLM provider keys ─────────────────────────────────────────────
    (r"sk-ant-api[0-9]{2}-[a-zA-Z0-9_-]{80,}", "Anthropic API key"),
    (r"sk-ant-[a-zA-Z0-9]{40,}", "Anthropic API key (short format)"),
    (r"sk-(?:proj-)?[a-zA-Z0-9]{20,}", "OpenAI/Generic API key (sk-...)"),

    # ── Personal OS real tokens ───────────────────────────────────────
    (r"napi_[a-zA-Z0-9]{32,}", "Notion API token (napi_)"),
    (r"lin_api_[a-zA-Z0-9]{40,}", "Linear API token"),
    (r"sb_[a-zA-Z0-9_-]{30,}", "Supabase token (sb_)"),
    (r"fir_[a-zA-Z0-9]{32,}", "Firecrawl API key (fir_)"),
    (r"exa_[a-zA-Z0-9]{32,}", "Exa API key (exa_)"),

    # ── Platform tokens ───────────────────────────────────────────────
    (r"ghp_[a-zA-Z0-9]{36}", "GitHub Personal Access Token (ghp_)"),
    (r"ghs_[a-zA-Z0-9]{36}", "GitHub Server Token (ghs_)"),
    (r"gho_[a-zA-Z0-9]{36}", "GitHub OAuth Token (gho_)"),
    (r"ghu_[a-zA-Z0-9]{36}", "GitHub App Token (ghu_)"),
    (r"xox[baprs]-[0-9]+-[0-9]+-[a-zA-Z0-9]+", "Slack bot/user token"),
    (r"xapp-[0-9]-[A-Z0-9-]+", "Slack app token"),
    (r"AIza[0-9A-Za-z_-]{35}", "Google API key"),
    (r"AKIA[0-9A-Z]{16}", "AWS Access Key ID"),
    (r"sk_live_[a-zA-Z0-9]{24,}", "Stripe LIVE key"),
    (r"sk_test_[a-zA-Z0-9]{24,}", "Stripe TEST key"),

    # ── Generic ────────────────────────────────────────────────────────
    (r"-----BEGIN (RSA |OPENSSH |EC |DSA )?PRIVATE KEY-----", "Private key (PEM)"),
    (r"(?i)password\s*[:=]\s*['\"]?[^'\"\s]{8,}", "Hardcoded password"),
    (r"(?i)secret_?key\s*[:=]\s*['\"]?[a-zA-Z0-9]{16,}", "Generic secret key"),
]

# Files that MUST never be committed
FORBIDDEN_FILES: set[str] = {
    ".env", ".env.local", ".env.production", ".env.staging",
    "credentials.json", "credentials.yaml", "secrets.json",
    "id_rsa", "id_dsa", "id_ed25519",
}

# Binary / non-scanable extensions
SKIP_EXTENSIONS: set[str] = {
    ".png", ".jpg", ".jpeg", ".gif", ".webp", ".pdf",
    ".zip", ".tar", ".gz", ".exe", ".dll", ".so", ".dylib",
    ".mp3", ".mp4", ".mov", ".woff", ".woff2", ".ttf", ".ico",
}

# Files that --fix is allowed to mutate
_FIXABLE_FILES = {"config.json", "mcp.json", "opencode.json"}

_VARNAME_MAP = {
    "napi_": "NOTION_API_TOKEN",
    "lin_api_": "LINEAR_API_KEY",
    "sb_": "SUPABASE_KEY",
    "sk-ant-": "ANTHROPIC_API_KEY",
    "sk-": "OPENAI_API_KEY",
    "sk_": "STRIPE_SECRET_KEY",
    "ghp_": "GITHUB_TOKEN",
    "xox": "SLACK_TOKEN",
    "xapp-": "SLACK_APP_TOKEN",
    "fir_": "FIRECRAWL_API_KEY",
    "exa_": "EXA_API_KEY",
    "AIza": "GOOGLE_API_KEY",
    "AKIA": "AWS_ACCESS_KEY_ID",
}


def get_staged_files() -> list[Path]:
    """Return list of staged file paths (git diff --cached --name-only)."""
    try:
        result = subprocess.run(
            ["git", "diff", "--cached", "--name-only", "--diff-filter=ACM"],
            capture_output=True, text=True, encoding="utf-8", errors="replace",
            timeout=15,
        )
        if result.returncode != 0:
            print(f"[WARN] git diff returned {result.returncode}: {result.stderr.strip()}")
            return []
        return [Path(f.strip()) for f in result.stdout.splitlines() if f.strip()]
    except subprocess.TimeoutExpired:
        print("[WARN] git diff timed out")
        return []
    except FileNotFoundError:
        print("[WARN] git not found -- are you in a git repo?")
        return []
    except Exception as e:
        print(f"[WARN] git diff failed: {e}")
        return []


def find_project_root(sentinel: str = ".git") -> Path:
    """Walk up from script location until *sentinel* is found."""
    current = Path(__file__).resolve().parent
    for _ in range(20):
        if (current / sentinel).exists():
            return current
        parent = current.parent
        if parent == current:
            break
        current = parent
    return _find_repo_root()


def _find_repo_root() -> Path:
    """Find repo root by walking up until sentinel '00_Winter_is_Coming' is found."""
    for parent in Path(__file__).resolve().parents:
        if (parent / "00_Winter_is_Coming").exists():
            return parent
    raise RuntimeError("Could not find repo root — sentinel '00_Winter_is_Coming' not found")


def _infer_var_name(match_text: str) -> str:
    """Infer an env-var name from the secret prefix."""
    for prefix, var in _VARNAME_MAP.items():
        if match_text.startswith(prefix):
            return var
    return "SECRET_VALUE"


def _load_gitignore_patterns(root: Path) -> list[str]:
    """Load .gitignore patterns, extended with safe defaults."""
    patterns: list[str] = []
    gitignore_path = root / ".gitignore"
    if gitignore_path.exists():
        try:
            with open(gitignore_path, encoding="utf-8", errors="replace") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#"):
                        patterns.append(line)
        except Exception as e:
            print(f"[WARN] Could not read .gitignore: {e}")
    patterns.extend([
        ".git/", "node_modules/", "__pycache__/", ".venv/", ".pytest_cache/",
        ".eggs/", "*.pyc", ".DS_Store", "Thumbs.db", ".backup/",
    ])
    return patterns


def _is_ignored(path: Path, root: Path, patterns: list[str]) -> bool:
    """Check if a path matches any gitignore pattern."""
    try:
        rel = path.relative_to(root).as_posix()
    except ValueError:
        return True
    for pattern in patterns:
        if pattern.endswith("/"):
            if fnmatch.fnmatch(rel, pattern) or rel.startswith(pattern):
                return True
        elif fnmatch.fnmatch(rel, pattern):
            return True
        if "/" + rel in pattern or rel == pattern:
            return True
    return False


# ── Scan engine ──────────────────────────────────────────

Finding = dict[str, str | int]


def scan_file(filepath: Path, root: Path) -> list[Finding]:
    """Scan a single file for secret patterns. Returns list of findings."""
    findings: list[Finding] = []
    full_path = root / filepath if not filepath.is_absolute() else filepath
    if not full_path.exists():
        return findings

    # Forbidden filename check
    fp_str = str(filepath)
    path_name = full_path.name
    if path_name in FORBIDDEN_FILES or (path_name.startswith(".env.") and path_name != ".env.example"):
        findings.append({
            "file": fp_str,
            "line": 0,
            "type": "FORBIDDEN_FILE",
            "match": path_name,
        })

    if full_path.suffix.lower() in SKIP_EXTENSIONS:
        return findings

    try:
        with open(full_path, encoding="utf-8", errors="replace") as f:
            for lineno, line in enumerate(f, 1):
                if len(line) > 5000:
                    continue
                for pattern, label in SECRET_PATTERNS:
                    match = re.search(pattern, line)
                    if match:
                        m = match.group(0)
                        findings.append({
                            "file": fp_str,
                            "line": lineno,
                            "type": label,
                            "match": m[:_MATCH_TRUNCATE] + ("..." if len(m) > _MATCH_TRUNCATE else ""),
                        })
    except Exception as e:
        print(f"[WARN] Failed to read {full_path}: {e}")

    return findings


# ── Full-scan ────────────────────────────────────────────

def full_scan(root: Path) -> tuple[list[Finding], list[Path]]:
    """Scan every non-ignored file in the repo. Returns (findings, files_scanned)."""
    patterns = _load_gitignore_patterns(root)
    files: list[Path] = []
    for p in root.rglob("*"):
        if not p.is_file():
            continue
        if _is_ignored(p, root, patterns):
            continue
        try:
            rel = p.relative_to(root)
        except ValueError:
            continue
        files.append(rel)

    all_findings: list[Finding] = []
    for f in files:
        all_findings.extend(scan_file(f, root))
    return all_findings, files


# ── Diff mode ────────────────────────────────────────────

def diff_mode(root: Path) -> int:
    """Show what --fix would change without touching files."""
    patterns = _load_gitignore_patterns(root)
    changed = 0
    for p in root.rglob("*"):
        if not p.is_file() or p.suffix != ".json":
            continue
        if p.name not in _FIXABLE_FILES:
            continue
        if _is_ignored(p, root, patterns):
            continue
        try:
            content = p.read_text(encoding="utf-8", errors="replace")
        except Exception:
            continue
        # Collect matches from original content (same algorithm as fix_mode)
        all_matches: list[re.Match] = []
        for pattern, _ in SECRET_PATTERNS:
            for m in re.finditer(pattern, content):
                all_matches.append(m)
        all_matches.sort(key=lambda m: m.start(), reverse=True)
        new_content = content
        for m in all_matches:
            var = _infer_var_name(m.group(0))
            new_content = new_content[:m.start()] + f'"${{{var}}}"' + new_content[m.end():]
        if new_content != content:
            changed += 1
            try:
                rel = p.relative_to(root)
            except ValueError:
                rel = p
            print(f"[DIFF] {rel} -- would replace secrets with env vars")

    if changed == 0:
        print("[OK] No fixable secrets found (dry-run)")
    return 0


# ── Fix mode ─────────────────────────────────────────────

def fix_mode(root: Path, auto_yes: bool = False) -> int:
    """Replace detected secrets with ``${{VAR_NAME}}`` in fixable files."""
    patterns = _load_gitignore_patterns(root)
    fixed = 0
    for p in root.rglob("*"):
        if not p.is_file() or p.suffix != ".json":
            continue
        if p.name not in _FIXABLE_FILES:
            continue
        if _is_ignored(p, root, patterns):
            continue
        try:
            content = p.read_text(encoding="utf-8", errors="replace")
        except Exception:
            continue
        # Collect all matches from ORIGINAL content to avoid sequential corruption
        all_matches: list[re.Match] = []
        for pattern, _ in SECRET_PATTERNS:
            for m in re.finditer(pattern, content):
                all_matches.append(m)
        # Sort by start position descending to apply from end to start
        all_matches.sort(key=lambda m: m.start(), reverse=True)
        new_content = content
        replacements = 0
        for m in all_matches:
            var = _infer_var_name(m.group(0))
            new_content = new_content[:m.start()] + f"${{{var}}}" + new_content[m.end():]
            replacements += 1

        if new_content != content:
            try:
                rel = p.relative_to(root)
            except ValueError:
                rel = p
            print(f"[FIX] {rel}: {replacements} secret(s) replaced with env var placeholders")
            try:
                p.write_text(new_content, encoding="utf-8")
                fixed += 1
            except Exception as e:
                print(f"[ERROR] Could not write {p}: {e}")

    if fixed == 0:
        print("[OK] No fixable secrets found")
    else:
        print(f"[OK] {fixed} file(s) fixed")
    return 0


# ── Report / display helpers ─────────────────────────────

def format_findings_human(findings: list[Finding]) -> int:
    """Print findings in human-readable format. Returns 0 if clean, 1 if dirty."""
    if not findings:
        print("[OK] Clean -- no secrets detected")
        return 0

    print(f"\n[SECRETS] {len(findings)} finding(s):\n")
    for f in findings:
        loc = f"{f['file']}:{f['line']}" if f["line"] else f"{f['file']}"
        print(f"  {loc}")
        print(f"     Type:  {f['type']}")
        print(f"     Match: {f['match']}")
        print()
    return 1


def format_findings_json(findings: list[Finding], meta: dict | None = None) -> None:
    """Print findings as JSON."""
    report: dict = {"findings": findings}
    if meta:
        report["meta"] = meta
    print(json.dumps(report, indent=2, ensure_ascii=False))


# ── CLI ──────────────────────────────────────────────────

def main() -> int:
    parser = argparse.ArgumentParser(
        description="PersonalOS Secret Scanner v2.0",
    )
    parser.add_argument("--file", type=str, help="Scan a single file")
    parser.add_argument("--all", action="store_true", help="Scan entire repo")
    parser.add_argument("--full-scan", action="store_true",
                        help="Full repo scan + JSON report to stdout")
    parser.add_argument("--diff", action="store_true",
                        help="Show what --fix would change (dry-run)")
    parser.add_argument("--fix", action="store_true",
                        help="Replace secrets with env-var placeholders in config.json / mcp.json")
    parser.add_argument("--json", action="store_true",
                        help="Output findings as JSON (use with --full-scan)")
    parser.add_argument("--yes", action="store_true",
                        help="Skip confirmation prompt in --fix mode")

    args = parser.parse_args()
    root = find_project_root()

    # ── Route to mode ─────────────────────────────────────────────────────
    if args.diff:
        return diff_mode(root)

    if args.fix:
        return fix_mode(root, auto_yes=args.yes)

    # ── File collection ───────────────────────────────────────────────────
    if args.file:
        files = [Path(args.file)]
    elif args.full_scan or args.all:
        patterns = _load_gitignore_patterns(root)
        files = []
        for p in root.rglob("*"):
            if not p.is_file():
                continue
            try:
                rel = p.relative_to(root)
            except ValueError:
                continue
            if _is_ignored(p, root, patterns):
                continue
            files.append(rel)
    else:
        files = get_staged_files()

    if not files:
        print("[OK] No files to scan")
        return 0

    # ── Scan ──────────────────────────────────────────────────────────────
    print(f"[INFO] Scanning {len(files)} file(s)...", file=sys.stderr)
    all_findings: list[Finding] = []
    for f in files:
        all_findings.extend(scan_file(f, root))

    # ── Output ────────────────────────────────────────────────────────────
    if args.full_scan and args.json:
        meta = {
            "files_scanned": len(files),
            "total_findings": len(all_findings),
            "scanner": "secret_scanner.py v2.0",
        }
        format_findings_json(all_findings, meta)
    elif args.json:
        format_findings_json(all_findings)
    else:
        return format_findings_human(all_findings)

    return 0


if __name__ == "__main__":
    sys.exit(main())
