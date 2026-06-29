#!/usr/bin/env python3
"""
pre_release_check.py — Release Agent
Valida condiciones críticas antes de un release.
Combina principios Anthropic (seguridad proporcional) + Google (shift left).

Uso:
    python scripts/pre_release_check.py --env staging
    python scripts/pre_release_check.py --env production --strict
"""

import argparse
import subprocess
import sys
import json
import io
from pathlib import Path
from datetime import datetime

# Fix Windows console encoding
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

# ─────────────────────────────────────────────
# Colores para terminal
# ─────────────────────────────────────────────
RED = "\033[91m"
YELLOW = "\033[93m"
GREEN = "\033[92m"
CYAN = "\033[96m"
RESET = "\033[0m"
BOLD = "\033[1m"


def log_section(title: str):
    print(f"\n{BOLD}{CYAN}{'─'*50}{RESET}")
    print(f"{BOLD}{CYAN}  {title}{RESET}")
    print(f"{BOLD}{CYAN}{'─'*50}{RESET}")


def log_ok(msg: str):
    print(f"  {GREEN}✓{RESET} {msg}")


def log_warn(msg: str):
    print(f"  {YELLOW}⚠{RESET} {msg}")


def log_fail(msg: str):
    print(f"  {RED}✗{RESET} {msg}")


# ─────────────────────────────────────────────
# Checks
# ─────────────────────────────────────────────

def check_git_status() -> dict:
    """Verifica que no hay cambios sin commitear."""
    result = subprocess.run(
        ["git", "status", "--porcelain"],
        capture_output=True, text=True
    )
    is_clean = result.stdout.strip() == ""
    return {
        "name": "Git working tree limpio",
        "passed": is_clean,
        "critical": True,
        "detail": "Hay cambios sin commitear" if not is_clean else "OK"
    }


def check_on_main_branch() -> dict:
    """Verifica que estamos en la rama main."""
    result = subprocess.run(
        ["git", "branch", "--show-current"],
        capture_output=True, text=True
    )
    branch = result.stdout.strip()
    on_main = branch in ["main", "master"]
    return {
        "name": f"Rama correcta (actual: {branch})",
        "passed": on_main,
        "critical": True,
        "detail": f"Debes estar en main/master, estás en '{branch}'" if not on_main else "OK"
    }


def check_tests_exist() -> dict:
    """Verifica que existe un directorio de tests."""
    test_dirs = ["tests", "test", "__tests__", "spec"]
    found = any(Path(d).exists() for d in test_dirs)
    return {
        "name": "Directorio de tests existe",
        "passed": found,
        "critical": True,
        "detail": "No se encontró directorio de tests" if not found else "OK"
    }


def check_critical_tests(strict: bool = False) -> dict:
    """Ejecuta tests críticos si pytest está disponible."""
    critical_paths = ["tests/critical", "tests/auth", "tests/integration"]
    existing = [p for p in critical_paths if Path(p).exists()]

    if not existing:
        return {
            "name": "Tests críticos",
            "passed": not strict,
            "critical": True,
            "detail": "No se encontró carpeta tests/critical. Crea tests para autenticación, lógica de negocio e integración."
        }

    result = subprocess.run(
        ["python", "-m", "pytest"] + existing + ["-v", "--tb=short"],
        capture_output=True, text=True
    )
    passed = result.returncode == 0
    return {
        "name": "Tests críticos",
        "passed": passed,
        "critical": True,
        "detail": result.stdout[-500:] if not passed else "Todos los tests críticos pasaron"
    }


def check_no_debug_code() -> dict:
    """Busca código de debug que no debe ir a producción."""
    patterns = ["console.log(", "print(", "debugger;", "pdb.set_trace()", "breakpoint()"]
    found_issues = []

    for pattern in patterns:
        result = subprocess.run(
            ["grep", "-r", "--include=*.py", "--include=*.js", "--include=*.ts",
             "-l", pattern, ".", "--exclude-dir=.git", "--exclude-dir=node_modules",
             "--exclude-dir=tests", "--exclude-dir=__pycache__"],
            capture_output=True, text=True
        )
        if result.stdout.strip():
            files = result.stdout.strip().split("\n")
            found_issues.append(f"'{pattern}' en: {', '.join(files[:3])}")

    return {
        "name": "Sin código de debug en producción",
        "passed": len(found_issues) == 0,
        "critical": False,
        "detail": "\n    ".join(found_issues) if found_issues else "OK"
    }


def check_env_vars() -> dict:
    """Verifica que existe .env.example o documentación de variables."""
    has_example = Path(".env.example").exists() or Path(".env.template").exists()
    has_readme = Path("README.md").exists()
    return {
        "name": "Variables de entorno documentadas",
        "passed": has_example or has_readme,
        "critical": False,
        "detail": "Agrega .env.example con las variables requeridas" if not (has_example or has_readme) else "OK"
    }


def check_dockerfile_or_requirements() -> dict:
    """Verifica que existe definición de dependencias."""
    options = ["Dockerfile", "requirements.txt", "package.json", "pyproject.toml", "Pipfile"]
    found = [f for f in options if Path(f).exists()]
    return {
        "name": "Dependencias definidas",
        "passed": len(found) > 0,
        "critical": True,
        "detail": f"Encontrado: {', '.join(found)}" if found else "No se encontró definición de dependencias"
    }


# ─────────────────────────────────────────────
# Checks específicos para código con IA
# ─────────────────────────────────────────────

def check_ai_generated_code_markers() -> dict:
    """
    Detecta marcadores de código generado por IA sin revisión.
    Convención: comentario # AI-GENERATED: REVIEWED o # AI-GENERATED: PENDING
    """
    result = subprocess.run(
        ["grep", "-r", "--include=*.py", "--include=*.js", "--include=*.ts",
         "-l", "AI-GENERATED: PENDING", ".",
         "--exclude-dir=.git", "--exclude-dir=node_modules"],
        capture_output=True, text=True
    )
    pending_files = result.stdout.strip().split("\n") if result.stdout.strip() else []

    return {
        "name": "Código IA sin revisar",
        "passed": len(pending_files) == 0,
        "critical": False,
        "detail": f"Archivos con código IA pendiente de revisión: {', '.join(pending_files)}" if pending_files else "OK (ningún archivo marcado como AI-GENERATED: PENDING)"
    }


# ─────────────────────────────────────────────
# Runner principal
# ─────────────────────────────────────────────

def run_checks(env: str, strict: bool) -> bool:
    print(f"\n{BOLD}Release Agent — Pre-Release Check{RESET}")
    print(f"Entorno: {CYAN}{env}{RESET} | Modo: {'strict' if strict else 'normal'} | {datetime.now().strftime('%Y-%m-%d %H:%M')}")

    checks = [
        check_git_status(),
        check_on_main_branch(),
        check_tests_exist(),
        check_critical_tests(strict),
        check_no_debug_code(),
        check_env_vars(),
        check_dockerfile_or_requirements(),
        check_ai_generated_code_markers(),
    ]

    # ── Resultados por categoría ──
    log_section("Checks Críticos")
    critical_failures = 0
    for check in [c for c in checks if c["critical"]]:
        if check["passed"]:
            log_ok(check["name"])
        else:
            log_fail(f"{check['name']} — {check['detail']}")
            critical_failures += 1

    log_section("Checks Importantes")
    warnings = 0
    for check in [c for c in checks if not c["critical"]]:
        if check["passed"]:
            log_ok(check["name"])
        else:
            log_warn(f"{check['name']} — {check['detail']}")
            warnings += 1

    # ── Resumen ──
    print(f"\n{'─'*50}")
    total = len(checks)
    passed = sum(1 for c in checks if c["passed"])
    print(f"{BOLD}Resultado: {passed}/{total} checks pasados{RESET}")

    if critical_failures > 0:
        print(f"{RED}{BOLD}✗ RELEASE BLOQUEADO — {critical_failures} check(s) crítico(s) fallaron{RESET}")
        return False
    elif warnings > 0:
        print(f"{YELLOW}⚠ Release permitido con {warnings} advertencia(s) — revisa antes de proceder{RESET}")
        return True
    else:
        print(f"{GREEN}{BOLD}✓ Listo para release en {env}{RESET}")
        return True


def main():
    parser = argparse.ArgumentParser(
        description="Pre-release check — Release Agent (Anthropic + Google)"
    )
    parser.add_argument(
        "--env",
        choices=["staging", "production"],
        default="staging",
        help="Entorno de destino"
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Modo estricto: falla si no hay tests críticos definidos"
    )
    args = parser.parse_args()

    success = run_checks(args.env, args.strict)
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
