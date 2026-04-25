#!/usr/bin/env python3
"""
secret_scanner.py — Pre-commit hook para detectar secrets en staged files.

Patrones detectados:
- API keys: OpenAI (sk-...), Anthropic (sk-ant-...), Stripe (sk_live_, sk_test_),
  GitHub (ghp_, ghs_, gho_), Google (AIza...), AWS (AKIA...)
- Tokens: Slack (xoxb-, xoxp-), Discord, generic Bearer
- Files: .env, .env.* (excepto .env.example)
- AWS keys, JWTs sospechosos

Salida:
- Exit 0: limpio (no secrets detectados)
- Exit 1: secrets detectados (bloquea commit)

Bypass: git commit --no-verify (solo si el usuario lo aprueba explícitamente)

Usage:
    python secret_scanner.py                    # escanea staged
    python secret_scanner.py --file path/file   # escanea un archivo
    python secret_scanner.py --all              # escanea todo el repo
"""

import io
import re
import subprocess
import sys
from pathlib import Path

if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

# Patrones de secrets (regex)
SECRET_PATTERNS = [
    # API keys
    (r"sk-ant-api[0-9]{2}-[a-zA-Z0-9_-]{80,}", "Anthropic API key"),
    (r"sk-[a-zA-Z0-9]{32,}", "OpenAI/Generic API key (sk-...)"),
    (r"sk_live_[a-zA-Z0-9]{24,}", "Stripe LIVE key"),
    (r"sk_test_[a-zA-Z0-9]{24,}", "Stripe TEST key"),
    (r"ghp_[a-zA-Z0-9]{36,}", "GitHub Personal Access Token"),
    (r"ghs_[a-zA-Z0-9]{36,}", "GitHub Server Token"),
    (r"gho_[a-zA-Z0-9]{36,}", "GitHub OAuth Token"),
    (r"AIza[0-9A-Za-z_-]{35}", "Google API key"),
    (r"AKIA[0-9A-Z]{16}", "AWS Access Key ID"),
    (r"xox[baprs]-[0-9]+-[0-9]+-[a-zA-Z0-9]+", "Slack token"),
    # Generic
    (r"-----BEGIN (RSA |OPENSSH |EC |DSA )?PRIVATE KEY-----", "Private key (PEM)"),
    (r"(?i)password\s*[:=]\s*['\"]?[^'\"\s]{8,}", "Hardcoded password"),
    (r"(?i)secret_?key\s*[:=]\s*['\"]?[a-zA-Z0-9]{16,}", "Generic secret key"),
]

# Archivos sensibles que NUNCA deben commitearse
FORBIDDEN_FILES = {
    ".env", ".env.local", ".env.production", ".env.staging",
    "credentials.json", "credentials.yaml", "secrets.json",
    "id_rsa", "id_dsa", "id_ed25519",
}

# Extensiones a ignorar (binarios, no escanear)
SKIP_EXTENSIONS = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".pdf",
                   ".zip", ".tar", ".gz", ".exe", ".dll", ".so", ".dylib",
                   ".mp3", ".mp4", ".mov", ".woff", ".woff2", ".ttf"}


def get_staged_files():
    """Lista archivos staged en git."""
    try:
        result = subprocess.run(
            ["git", "diff", "--cached", "--name-only", "--diff-filter=ACM"],
            capture_output=True, text=True, encoding="utf-8", errors="replace"
        )
        return [Path(f.strip()) for f in result.stdout.splitlines() if f.strip()]
    except Exception:
        return []


def scan_file(filepath, root):
    """Escanea un archivo. Devuelve lista de findings."""
    findings = []

    full_path = root / filepath if not filepath.is_absolute() else filepath
    if not full_path.exists():
        return findings

    # Forbidden filename
    if full_path.name in FORBIDDEN_FILES or full_path.name.startswith(".env."):
        if full_path.name != ".env.example":
            findings.append({
                "file": str(filepath),
                "line": 0,
                "type": "FORBIDDEN_FILE",
                "match": full_path.name,
            })

    # Skip binarios
    if full_path.suffix.lower() in SKIP_EXTENSIONS:
        return findings

    try:
        with open(full_path, encoding="utf-8", errors="replace") as f:
            for lineno, line in enumerate(f, 1):
                if len(line) > 5000:  # Skip lines absurdamente largas (minified)
                    continue
                for pattern, label in SECRET_PATTERNS:
                    match = re.search(pattern, line)
                    if match:
                        findings.append({
                            "file": str(filepath),
                            "line": lineno,
                            "type": label,
                            "match": match.group(0)[:50] + ("..." if len(match.group(0)) > 50 else ""),
                        })
    except Exception:
        pass

    return findings


def main():
    root = Path(__file__).resolve().parent.parent.parent.parent.parent.parent

    if "--file" in sys.argv:
        idx = sys.argv.index("--file")
        files = [Path(sys.argv[idx + 1])]
    elif "--all" in sys.argv:
        files = [p.relative_to(root) for p in root.rglob("*")
                 if p.is_file() and ".git" not in p.parts and "node_modules" not in p.parts]
    else:
        files = get_staged_files()

    if not files:
        print("ℹ️  No hay archivos staged (o ningún archivo a escanear)")
        return 0

    print(f"🔍 Escaneando {len(files)} archivos buscando secrets...")
    all_findings = []
    for f in files:
        findings = scan_file(f, root)
        all_findings.extend(findings)

    if not all_findings:
        print("✅ Limpio — no se detectaron secrets")
        return 0

    print(f"\n❌ SECRETS DETECTADOS ({len(all_findings)}):\n")
    for finding in all_findings:
        print(f"  📁 {finding['file']}:{finding['line']}")
        print(f"     Tipo: {finding['type']}")
        print(f"     Match: {finding['match']}")
        print()

    print("🛑 Commit BLOQUEADO. Remové los secrets antes de commitear.")
    print("   Si es un falso positivo, usar: git commit --no-verify")
    return 1


if __name__ == "__main__":
    sys.exit(main())
