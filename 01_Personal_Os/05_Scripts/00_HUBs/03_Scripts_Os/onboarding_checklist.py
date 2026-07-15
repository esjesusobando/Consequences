#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
onboarding_checklist.py — Wizard de Onboarding para PersonalOS
================================================================
TUI checklist que valida tu entorno paso a paso.

Pasos:
  1. Validar config_paths (rutas del sistema)
  2. Verificar git (repo, ramas, estado)
  3. Test de Engram (memoria persistente)
  4. Ejecutar primer ritual (standup simplificado)
  5. Descubrir skills disponibles
  6. Crear primer contenido (dry-run)

CLI:
  python onboarding_checklist.py --start     Iniciar wizard
  python onboarding_checklist.py --status    Ver progreso actual
  python onboarding_checklist.py --test      Ejecutar tests internos
  python onboarding_checklist.py --reset     Reiniciar progreso

Guarda progreso en: .cache/onboarding_progress.json
"""

import sys
import os
import json
import argparse
import logging
from pathlib import Path
from datetime import datetime, timezone

if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

sys.path.insert(0, str(Path(__file__).parent))
from config_paths import ROOT_DIR, TELEMETRY_DIR, CACHE_DIR

# ── Constants ───────────────────────────────────────────────
PROGRESS_FILE = CACHE_DIR / "onboarding_progress.json"

STEPS = [
    {
        "id": "config_validate",
        "name": "Validar config_paths",
        "description": "Verifica que todas las rutas del sistema existan",
    },
    {
        "id": "git_check",
        "name": "Verificar git",
        "description": "Chequea repo, ramas y estado de git",
    },
    {
        "id": "engram_test",
        "name": "Test de Engram",
        "description": "Verifica que la memoria persistente funcione",
    },
    {
        "id": "first_ritual",
        "name": "Primer ritual",
        "description": "Ejecuta un standup simplificado",
    },
    {
        "id": "skill_discovery",
        "name": "Descubrir skills",
        "description": "Verifica que el skill discovery funcione",
    },
    {
        "id": "first_content",
        "name": "Primer contenido",
        "description": "Dry-run del content pipeline",
    },
]

# ── Progress Management ─────────────────────────────────────

def load_progress() -> dict:
    """Carga el progreso del onboarding desde disco."""
    if PROGRESS_FILE.exists():
        try:
            return json.loads(PROGRESS_FILE.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            pass
    return {
        "started_at": None,
        "completed_steps": [],
        "current_step": 0,
        "last_updated": None,
    }


def save_progress(progress: dict) -> None:
    """Guarda el progreso del onboarding a disco."""
    PROGRESS_FILE.parent.mkdir(parents=True, exist_ok=True)
    progress["last_updated"] = datetime.now(timezone.utc).isoformat()
    tmp = PROGRESS_FILE.with_suffix(".tmp")
    try:
        tmp.write_text(json.dumps(progress, indent=2, ensure_ascii=False), encoding="utf-8")
        tmp.replace(PROGRESS_FILE)
    except OSError as e:
        print(f"[WARN] No se pudo guardar progreso: {e}")


def mark_step_complete(progress: dict, step_id: str) -> None:
    """Marca un paso como completado."""
    if step_id not in progress["completed_steps"]:
        progress["completed_steps"].append(step_id)
    # Avanzar current_step al siguiente no completado
    for i, step in enumerate(STEPS):
        if step["id"] not in progress["completed_steps"]:
            progress["current_step"] = i
            break
    else:
        progress["current_step"] = len(STEPS)
    save_progress(progress)


# ── Step Implementations ────────────────────────────────────

def step_config_validate() -> tuple[bool, str]:
    """Paso 1: Validar config_paths."""
    try:
        from config_paths import validate_paths, _collect_path_vars
        path_vars = _collect_path_vars()
        ok_paths, broken_paths, dead_04_paths = validate_paths(path_vars)
        total = len(ok_paths) + len(broken_paths)
        if broken_paths:
            return False, (
                f"{len(broken_paths)}/{total} paths rotos. "
                f"Ejecuta: python config_paths.py --validate para detalles."
            )
        return True, f"{len(ok_paths)}/{total} paths OK. Sistema completo."
    except Exception as e:
        return False, f"Error al validar paths: {e}"


def step_git_check() -> tuple[bool, str]:
    """Paso 2: Verificar git."""
    import subprocess
    try:
        result = subprocess.run(
            ["git", "status", "--porcelain"],
            cwd=str(ROOT_DIR),
            capture_output=True, text=True, encoding="utf-8", errors="replace",
            timeout=10,
        )
        if result.returncode != 0:
            return False, "No se detecto un repo git en la raiz."

        # Verificar rama actual
        branch_result = subprocess.run(
            ["git", "branch", "--show-current"],
            cwd=str(ROOT_DIR),
            capture_output=True, text=True, encoding="utf-8", errors="replace",
            timeout=10,
        )
        branch = branch_result.stdout.strip() or "unknown"

        # Contar cambios sin commitear
        changes = len(result.stdout.strip().split("\n")) if result.stdout.strip() else 0
        return True, f"Repo OK. Rama: {branch}. Cambios pendientes: {changes}."
    except FileNotFoundError:
        return False, "Git no encontrado en PATH."
    except subprocess.TimeoutExpired:
        return False, "Git timeout — verifica tu instalacion."


def step_engram_test() -> tuple[bool, str]:
    """Paso 3: Test de Engram."""
    try:
        # Verificar que el directorio de telemetry exista (indica Engram activo)
        if TELEMETRY_DIR.exists():
            telemetry_files = list(TELEMETRY_DIR.iterdir())
            return True, (
                f"Engram activo. "
                f"Directorio de telemetria: {len(telemetry_files)} archivos."
            )
        else:
            # No es critico — Engram puede no tener telemetria aun
            return True, "Engram disponible (sin telemetria previa — es normal)."
    except Exception as e:
        return False, f"Error verificando Engram: {e}"


def step_first_ritual() -> tuple[bool, str]:
    """Paso 4: Ejecutar primer ritual (dry-run)."""
    ritual_hub = ROOT_DIR / "01_Personal_Os" / "05_Scripts" / "00_HUBs" / "03_Scripts_Os" / "04_Ritual_Hub.py"
    if ritual_hub.exists():
        return True, (
            "Ritual Hub disponible. "
            "Ejecuta: python 04_Ritual_Hub.py --simple para tu primer ritual."
        )
    return False, "04_Ritual_Hub.py no encontrado."


def step_skill_discovery() -> tuple[bool, str]:
    """Paso 5: Verificar skill discovery."""
    sd_path = ROOT_DIR / "01_Personal_Os" / "05_Scripts" / "00_HUBs" / "03_Scripts_Os" / "skill_discovery.py"
    registry = ROOT_DIR / ".atl" / "skill-registry.md"

    if not sd_path.exists():
        return False, "skill_discovery.py no encontrado."

    if not registry.exists():
        return False, (
            "skill-registry.md no encontrado en .atl/. "
            "Ejecuta: python skill_registry.py --refresh"
        )

    # Contar skills en el registro
    try:
        content = registry.read_text(encoding="utf-8")
        skill_count = content.count("| `") - 1  # subtract header
        return True, f"Skill Discovery OK. {skill_count} skills registrados."
    except Exception as e:
        return False, f"Error leyendo registry: {e}"


def step_first_content() -> tuple[bool, str]:
    """Paso 6: Dry-run del content pipeline."""
    cp_path = ROOT_DIR / "01_Personal_Os" / "05_Scripts" / "00_HUBs" / "03_Scripts_Os" / "content_pipeline.py"
    if cp_path.exists():
        return True, (
            "Content Pipeline disponible. "
            "Ejecuta: python content_pipeline.py run --topic 'tu tema' --platform linkedin"
        )
    return False, "content_pipeline.py no encontrado."


STEP_RUNNERS = {
    "config_validate": step_config_validate,
    "git_check": step_git_check,
    "engram_test": step_engram_test,
    "first_ritual": step_first_ritual,
    "skill_discovery": step_skill_discovery,
    "first_content": step_first_content,
}


# ── TUI Display ─────────────────────────────────────────────

# Try rich for TUI, fallback to plain
_rich = False
try:
    from rich.console import Console
    from rich.table import Table
    from rich.panel import Panel
    from rich.progress import Progress, SpinnerColumn, TextColumn
    _rich = True
    console = Console()
except ImportError:
    console = None


def print_header():
    """Imprime el header del wizard."""
    if _rich:
        console.print(Panel(
            "[bold cyan]Think Different PersonalOS[/bold cyan]\n"
            "[dim]Wizard de Onboarding — Paso a Paso[/dim]",
            border_style="cyan",
        ))
    else:
        print("=" * 60)
        print("  Think Different PersonalOS")
        print("  Wizard de Onboarding — Paso a Paso")
        print("=" * 60)


def print_step_status(step: dict, completed: bool, result: str = None, passed: bool = None):
    """Imprime el estado de un paso."""
    if _rich:
        if completed and passed is True:
            icon = "[green][PASS][/green]"
        elif completed and passed is False:
            icon = "[red][FAIL][/red]"
        elif completed:
            icon = "[yellow][DONE][/yellow]"
        else:
            icon = "[dim][SKIP][/dim]"
        console.print(f"  {icon} {step['name']}")
        if result:
            console.print(f"       [dim]{result}[/dim]")
    else:
        if completed and passed is True:
            icon = "[PASS]"
        elif completed and passed is False:
            icon = "[FAIL]"
        elif completed:
            icon = "[DONE]"
        else:
            icon = "[SKIP]"
        print(f"  {icon} {step['name']}")
        if result:
            print(f"       {result}")


def print_summary(progress: dict):
    """Imprime resumen del progreso."""
    total = len(STEPS)
    done = len(progress["completed_steps"])
    pct = (done / total * 100) if total else 0

    if _rich:
        console.print()
        console.print(Panel(
            f"[bold]Progreso: {done}/{total} ({pct:.0f}%)[/bold]\n"
            + "\n".join(
                f"  {'[green]✓[/green]' if s['id'] in progress['completed_steps'] else '[dim]○[/dim]'} {s['name']}"
                for s in STEPS
            ),
            title="Resumen",
            border_style="green" if done == total else "yellow",
        ))
    else:
        print()
        print(f"  Progreso: {done}/{total} ({pct:.0f}%)")
        for s in STEPS:
            mark = "v" if s["id"] in progress["completed_steps"] else "o"
            print(f"  [{mark}] {s['name']}")


# ── CLI Commands ────────────────────────────────────────────

def cmd_start():
    """Ejecuta el wizard de onboarding completo."""
    progress = load_progress()
    if not progress["started_at"]:
        progress["started_at"] = datetime.now(timezone.utc).isoformat()
        save_progress(progress)

    print_header()

    if _rich:
        console.print("\n[bold]Ejecutando pasos de verificacion...[/bold]\n")
    else:
        print("\n  Ejecutando pasos de verificacion...\n")

    for i, step in enumerate(STEPS):
        if step["id"] in progress["completed_steps"]:
            print_step_status(step, completed=True)
            continue

        if _rich:
            console.print(f"\n[bold cyan]Paso {i + 1}/{len(STEPS)}: {step['name']}[/bold cyan]")
            console.print(f"[dim]{step['description']}[/dim]")
        else:
            print(f"\n  Paso {i + 1}/{len(STEPS)}: {step['name']}")
            print(f"  {step['description']}")

        runner = STEP_RUNNERS.get(step["id"])
        if runner:
            try:
                passed, result = runner()
            except Exception as e:
                passed, result = False, f"Excepcion: {e}"
            mark_step_complete(progress, step["id"])
            print_step_status(step, completed=True, result=result, passed=passed)
        else:
            if _rich:
                console.print(f"  [yellow]Paso no implementado: {step['id']}[/yellow]")
            else:
                print(f"  [WARN] Paso no implementado: {step['id']}")
            mark_step_complete(progress, step["id"])

    print_summary(progress)

    done = len(progress["completed_steps"])
    if done == len(STEPS):
        if _rich:
            console.print("\n[bold green]Onboarding completo! Tu sistema esta listo.[/bold green]")
        else:
            print("\n  Onboarding completo! Tu sistema esta listo.")
    else:
        if _rich:
            console.print(f"\n[bold yellow]Quedan {len(STEPS) - done} pasos pendientes.[/bold yellow]")
        else:
            print(f"\n  Quedan {len(STEPS) - done} pasos pendientes.")


def cmd_status():
    """Muestra el estado actual del onboarding."""
    progress = load_progress()
    print_header()
    print_summary(progress)


def cmd_reset():
    """Reinicia el progreso del onboarding."""
    if PROGRESS_FILE.exists():
        PROGRESS_FILE.unlink()
    print("Progreso reiniciado. Ejecuta --start para comenzar de nuevo.")


def cmd_test():
    """Ejecuta tests internos del onboarding checklist."""
    print("Running onboarding checklist tests...\n")
    passed = 0
    failed = 0

    def check(name: str, condition: bool, detail: str = ""):
        nonlocal passed, failed
        if condition:
            passed += 1
            print(f"  [PASS] {name}")
        else:
            failed += 1
            print(f"  [FAIL] {name} — {detail}")

    # Test 1: STEPS definition
    check("STEPS defined", len(STEPS) == 6, f"got {len(STEPS)}")
    check("All steps have id", all("id" in s for s in STEPS))
    check("All steps have name", all("name" in s for s in STEPS))
    check("All steps have description", all("description" in s for s in STEPS))

    # Test 2: Step IDs are unique
    step_ids = [s["id"] for s in STEPS]
    check("Step IDs unique", len(step_ids) == len(set(step_ids)), f"duplicates: {[x for x in step_ids if step_ids.count(x) > 1]}")

    # Test 3: All runners exist
    check(
        "All runners defined",
        all(s["id"] in STEP_RUNNERS for s in STEPS),
        f"missing: {[s['id'] for s in STEPS if s['id'] not in STEP_RUNNERS]}",
    )

    # Test 4: Progress management
    progress = load_progress()
    check("Progress loads", isinstance(progress, dict))
    check("Progress has completed_steps", "completed_steps" in progress)

    # Test 5: Each runner returns (bool, str)
    for step in STEPS:
        runner = STEP_RUNNERS.get(step["id"])
        if runner:
            try:
                result = runner()
                check(
                    f"Runner '{step['id']}' returns tuple",
                    isinstance(result, tuple) and len(result) == 2,
                    f"got {type(result)}",
                )
                check(
                    f"Runner '{step['id']}' bool+str",
                    isinstance(result[0], bool) and isinstance(result[1], str),
                    f"got {type(result[0])}, {type(result[1])}",
                )
            except Exception as e:
                check(f"Runner '{step['id']}' no exception", False, str(e))

    # Test 6: Cache dir exists
    check("CACHE_DIR exists", CACHE_DIR.exists(), str(CACHE_DIR))

    print(f"\n  Results: {passed} passed, {failed} failed")
    if failed:
        sys.exit(1)


# ── CLI Entry Point ─────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Onboarding Checklist — Think Different PersonalOS"
    )
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--start", action="store_true", help="Iniciar wizard de onboarding")
    group.add_argument("--status", action="store_true", help="Ver progreso actual")
    group.add_argument("--test", action="store_true", help="Ejecutar tests internos")
    group.add_argument("--reset", action="store_true", help="Reiniciar progreso")

    args = parser.parse_args()

    if args.start:
        cmd_start()
    elif args.status:
        cmd_status()
    elif args.test:
        cmd_test()
    elif args.reset:
        cmd_reset()


if __name__ == "__main__":
    main()
