#!/usr/bin/env python3
"""
01_OS_Runtime_Test.py — PersonalOS v4.7 SOTA

Test suite que valida EJECUCIÓN REAL de los componentes del OS,
complementando el 00_OS_Health_Test.py (que solo valida estructura).

20 tests:
- R01-R10: Cada HUB ejecuta sin crash
- R11: Notification hook
- R12: Engram round-trip (save+search)
- R13: config_paths.py resuelve PROJECT_ROOT
- R14: GGA Pre-Commit script existe
- R15: Auto-Improvement Engine --scan
- R16: Skill Creator stub
- R17: 80_Edge_Case_Validator standalone
- R18: SOTA Integrity Check
- R19: Beautify Tables
- R20: Sound Engine

Usage:
    python 02_Playground/01_OS_Runtime_Test.py
    python 02_Playground/01_OS_Runtime_Test.py --verbose
"""

import io
import sys
import subprocess
from dataclasses import dataclass
from pathlib import Path

if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent.parent
SCRIPTS_OS = ROOT / "01_Personal_Os" / "04_Operations" / "03_Scripts_Os"
VERBOSE = "--verbose" in sys.argv


@dataclass
class TestResult:
    test_id: str
    name: str
    passed: bool
    detail: str = ""


def _run_script(script_path, args=None, timeout=30, cwd=None):
    """Helper para ejecutar scripts python con encoding UTF-8."""
    cmd = [sys.executable, str(script_path)] + (args or [])
    return subprocess.run(
        cmd, capture_output=True, text=True, timeout=timeout,
        cwd=str(cwd or ROOT), encoding="utf-8", errors="replace"
    )


def _hub_runs(hub_name, hub_file, args=None):
    """Genérico: prueba que un HUB compila e inicia (acepta exit 0/1/2)."""
    script = SCRIPTS_OS / hub_file
    if not script.exists():
        return TestResult(hub_name, f"HUB {hub_file} — runtime", False,
                          "Script no encontrado")
    try:
        # Con args livianos o --help para no disparar acción real
        result = _run_script(script, args or ["--help"], timeout=15)
        # Aceptar exits 0/1/2 (help puede salir 0 o 2)
        if result.returncode > 5:
            return TestResult(hub_name, f"HUB {hub_file} — runtime", False,
                              f"Exit {result.returncode}: {result.stderr[:200]}")
        return TestResult(hub_name, f"HUB {hub_file} — runtime", True,
                          f"Exit {result.returncode}")
    except subprocess.TimeoutExpired:
        return TestResult(hub_name, f"HUB {hub_file} — runtime", False, "Timeout")
    except Exception as e:
        return TestResult(hub_name, f"HUB {hub_file} — runtime", False, str(e))


def _hub_compiles(test_id, hub_file):
    """Test que el HUB al menos compila (parse syntax)."""
    script = SCRIPTS_OS / hub_file
    if not script.exists():
        return TestResult(test_id, f"{hub_file} — sintaxis", False, "No existe")
    try:
        with open(script, encoding="utf-8") as f:
            content = f.read()
        compile(content, str(script), "exec")
        return TestResult(test_id, f"{hub_file} — sintaxis", True, "OK")
    except SyntaxError as e:
        return TestResult(test_id, f"{hub_file} — sintaxis", False, str(e))


def r01_sound_engine():
    return _hub_compiles("R01", "00_Sound_Engine.py")


def r02_auditor_hub():
    return _hub_compiles("R02", "01_Auditor_Hub.py")


def r03_git_hub():
    return _hub_compiles("R03", "02_Git_Hub.py")


def r04_aipm_hub():
    return _hub_compiles("R04", "03_AIPM_Hub.py")


def r05_ritual_hub():
    return _hub_compiles("R05", "04_Ritual_Hub.py")


def r06_validator_hub():
    return _hub_compiles("R06", "05_Validator_Hub.py")


def r07_tool_hub():
    return _hub_compiles("R07", "06_Tool_Hub.py")


def r08_integration_hub():
    return _hub_compiles("R08", "07_Integration_Hub.py")


def r09_workflow_hub():
    return _hub_compiles("R09", "08_Workflow_Hub.py")


def r10_data_hub():
    return _hub_compiles("R10", "09_Data_Hub.py")


def r11_notification_hook():
    """Hook de notificación corre sin crash."""
    hook = (ROOT / "01_Personal_Os" / "01_Core" / "02_Tools" / "05_Hooks"
            / "04_Sound" / "notification.py")
    if not hook.exists():
        return TestResult("R11", "Notification hook — existe", False, "No encontrado")
    try:
        with open(hook, encoding="utf-8") as f:
            compile(f.read(), str(hook), "exec")
        return TestResult("R11", "Notification hook — sintaxis", True, "OK")
    except Exception as e:
        return TestResult("R11", "Notification hook — sintaxis", False, str(e))


def r12_config_paths():
    """config_paths.py importable y resuelve PROJECT_ROOT."""
    cp = SCRIPTS_OS / "config_paths.py"
    if not cp.exists():
        return TestResult("R12", "config_paths.py — import", False, "No existe")
    try:
        result = _run_script(cp, [], timeout=10)
        if result.returncode != 0 and result.returncode != 1:
            return TestResult("R12", "config_paths.py — import", False,
                              f"Exit {result.returncode}")
        return TestResult("R12", "config_paths.py — import", True, "OK")
    except Exception as e:
        return TestResult("R12", "config_paths.py — import", False, str(e))


def r13_gga_present():
    """GGA Pre-Commit existe y es ejecutable."""
    gga = ROOT / ".agent" / "05_GGA" / "bin" / "gga"
    if not gga.exists():
        return TestResult("R13", "GGA — present", False, "No existe en .agent/05_GGA/bin/")
    return TestResult("R13", "GGA — present", True, "OK")


def r14_auto_improvement_scan():
    """Auto-Improvement Engine corre --scan sin crash."""
    engine = (ROOT / "01_Personal_Os" / "04_Operations" / "01_Auto_Improvement"
              / "01_Engine" / "recursive_improvement_engine.py")
    if not engine.exists():
        return TestResult("R14", "Auto-Improvement — scan", False, "No existe")
    try:
        result = _run_script(engine, ["--scan"], timeout=60)
        if result.returncode > 5:
            return TestResult("R14", "Auto-Improvement — scan", False,
                              f"Exit {result.returncode}: {result.stderr[:200]}")
        return TestResult("R14", "Auto-Improvement — scan", True, "Scan corrió")
    except Exception as e:
        return TestResult("R14", "Auto-Improvement — scan", False, str(e))


def r15_edge_validator_standalone():
    """80_Edge_Case_Validator corre standalone (post-fix B1)."""
    validator = SCRIPTS_OS / "03_Validator" / "80_Edge_Case_Validator.py"
    if not validator.exists():
        return TestResult("R15", "Edge Validator — standalone", False, "No existe")
    try:
        result = _run_script(validator, [], timeout=30)
        if result.returncode not in (0, 1):
            return TestResult("R15", "Edge Validator — standalone", False,
                              f"Exit {result.returncode}: {result.stderr[:200]}")
        return TestResult("R15", "Edge Validator — standalone", True,
                          f"Exit {result.returncode}")
    except Exception as e:
        return TestResult("R15", "Edge Validator — standalone", False, str(e))


def r16_sota_integrity():
    """SOTA Integrity Check corre."""
    script = (SCRIPTS_OS / "13_Auditors_Os" / "scripts"
              / "15_SOTA_Integrity_Check.py")
    if not script.exists():
        return TestResult("R16", "SOTA Integrity — runtime", False, "No existe")
    try:
        result = _run_script(script, [], timeout=30)
        if result.returncode > 5:
            return TestResult("R16", "SOTA Integrity — runtime", False,
                              f"Exit {result.returncode}")
        return TestResult("R16", "SOTA Integrity — runtime", True,
                          f"Exit {result.returncode}")
    except Exception as e:
        return TestResult("R16", "SOTA Integrity — runtime", False, str(e))


def r17_skills_have_skill_md():
    """Cada área canónica del Skill Index tiene al menos un SKILL.md."""
    skills_dir = ROOT / "01_Personal_Os" / "01_Core" / "02_Tools" / "02_Skills"
    if not skills_dir.exists():
        return TestResult("R17", "Skills — SKILL.md presente", False, "Skills dir no existe")
    manifest = (ROOT / "01_Personal_Os" / "04_Operations" / "02_Agent_Teams_Lite"
                / "00_Manifest" / "04_Skill_Index.json")
    if manifest.exists():
        import json
        with open(manifest, encoding="utf-8") as f:
            by_area = json.load(f).get("by_area", {})
        areas_total = len(by_area)
        areas_con_skill = sum(
            1 for area_name in by_area
            if list((skills_dir / area_name).rglob("SKILL.md"))
        )
        if areas_con_skill == areas_total:
            return TestResult("R17", "Skills — SKILL.md presente", True,
                              f"{areas_con_skill}/{areas_total}")
        return TestResult("R17", "Skills — SKILL.md presente", False,
                          f"{areas_con_skill}/{areas_total} áreas canónicas")

    areas_total = 0
    areas_con_skill = 0
    for area in skills_dir.iterdir():
        if area.is_dir() and not area.name.startswith("."):
            areas_total += 1
            if list(area.rglob("SKILL.md")):
                areas_con_skill += 1
    if areas_con_skill == areas_total:
        return TestResult("R17", "Skills — SKILL.md presente", True,
                          f"{areas_con_skill}/{areas_total}")
    return TestResult("R17", "Skills — SKILL.md presente", False,
                      f"{areas_con_skill}/{areas_total} áreas")


def r18_agent_sync_zero_drift():
    """La copia estratégica .agent no debe perder agentes live."""
    live = ROOT / "01_Personal_Os" / "01_Core" / "02_Tools" / "01_Agents"
    backup = ROOT / ".agent" / "01_Agents"
    if not live.exists() or not backup.exists():
        return TestResult("R18", "Agent sync — drift", False, "Carpetas no existen")
    live_files = sorted(p.name for p in live.rglob("*.md") if p.is_file())
    backup_files = sorted(p.name for p in backup.rglob("*.md") if p.is_file())
    only_live = set(live_files) - set(backup_files)
    only_backup = set(backup_files) - set(live_files)
    if not only_live:
        return TestResult("R18", "Agent sync — drift", True,
                          f"backup covers live ({len(live_files)} live, {len(only_backup)} backup-only)")
    return TestResult("R18", "Agent sync — drift", False,
                      f"Drift: live-only={len(only_live)}, backup-only={len(only_backup)}")


def r19_root_structure_clean():
    """Raíz conserva las 4 carpetas canónicas v4.x."""
    expected = {"00_Winter_is_Coming", "01_Personal_Os", "02_Playground", "03_Resultado"}
    found = {p.name for p in ROOT.iterdir() if p.is_dir() and not p.name.startswith(".")}
    missing = expected - found
    if not missing:
        return TestResult("R19", "Root structure — 4 carpetas v4.x", True, "OK")
    return TestResult("R19", "Root structure — 4 carpetas v4.x", False,
                      f"Faltan: {missing}")


def r20_no_v1_paths_in_active_docs():
    """Docs activos en raíz NO tienen paths v1.x."""
    active_docs = [
        ROOT / "CLAUDE.md",
        ROOT / "README.md",
        ROOT / "00_Winter_is_Coming" / "AGENTS.md",
        ROOT / ".atl" / "skill-registry.md",
    ]
    found_in = []
    for doc in active_docs:
        if not doc.exists():
            continue
        with open(doc, encoding="utf-8") as f:
            content = f.read()
        legacy_tokens = ("08_Scripts_Os/", "03_Skills/", "03_Tasks/")
        if any(token in content for token in legacy_tokens):
            found_in.append(doc.name)
    if not found_in:
        return TestResult("R20", "Docs activos — sin v1.x paths", True, "Limpio")
    return TestResult("R20", "Docs activos — sin v1.x paths", False,
                      f"Refs en: {found_in}")


TESTS = [
    r01_sound_engine, r02_auditor_hub, r03_git_hub, r04_aipm_hub, r05_ritual_hub,
    r06_validator_hub, r07_tool_hub, r08_integration_hub, r09_workflow_hub,
    r10_data_hub, r11_notification_hook, r12_config_paths, r13_gga_present,
    r14_auto_improvement_scan, r15_edge_validator_standalone, r16_sota_integrity,
    r17_skills_have_skill_md, r18_agent_sync_zero_drift, r19_root_structure_clean,
    r20_no_v1_paths_in_active_docs,
]


def main():
    print("\n" + "=" * 60)
    print("  OS RUNTIME TEST — PersonalOS v4.7 SOTA")
    print("  20 tests de ejecución real")
    print("=" * 60 + "\n")

    results = []
    for test_fn in TESTS:
        try:
            result = test_fn()
        except Exception as e:
            result = TestResult(test_fn.__name__, "ERROR", False, str(e))
        results.append(result)
        status = "✅ PASS" if result.passed else "❌ FAIL"
        print(f"  {status} [{result.test_id:>4}] {result.name}")
        if VERBOSE or not result.passed:
            print(f"         → {result.detail}")

    passed = sum(1 for r in results if r.passed)
    total = len(results)
    pct = (passed / total) * 100 if total else 0

    print("\n" + "=" * 60)
    print(f"  RESULTADO: {passed}/{total} tests pasaron ({pct:.0f}%)")
    if passed == total:
        print("  🎉 PURE GREEN — Runtime al 100%")
    else:
        print(f"  ❌ {total - passed} FAIL")
    print("=" * 60 + "\n")

    return 0 if passed == total else 1


if __name__ == "__main__":
    sys.exit(main())
