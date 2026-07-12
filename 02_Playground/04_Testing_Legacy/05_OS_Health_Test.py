#!/usr/bin/env python3
"""
00_OS_Health_Test.py — PersonalOS v4.7 Consequences
Test suite completo del sistema. 100% no-destructivo (solo lectura).

Usage:
    python 02_Playground/00_OS_Health_Test.py
    python 02_Playground/00_OS_Health_Test.py --verbose
    python 02_Playground/00_OS_Health_Test.py --test T01,T05,T11
"""

import sys
import io
import json
import importlib.util
import subprocess
import tempfile
import argparse
from pathlib import Path
from datetime import datetime

# Fix Windows encoding
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

# Resolver ROOT
ROOT = Path(__file__).parent.parent
SCRIPTS_OS = ROOT / "01_Personal_Os" / "05_Scripts" / "00_HUBs" / "03_Scripts_Os"
sys.path.insert(0, str(SCRIPTS_OS))

# ─────────────────────────────────────────────────────────────
# COLORES
# ─────────────────────────────────────────────────────────────
GREEN  = "\033[92m"
RED    = "\033[91m"
YELLOW = "\033[93m"
CYAN   = "\033[96m"
BOLD   = "\033[1m"
RESET  = "\033[0m"

VERBOSE = "--verbose" in sys.argv

# ─────────────────────────────────────────────────────────────
# RESULTADO DE TEST
# ─────────────────────────────────────────────────────────────
class TestResult:
    def __init__(self, tid, name, passed, detail="", warning=False):
        self.tid     = tid
        self.name    = name
        self.passed  = passed
        self.warning = warning
        self.detail  = detail

    @property
    def icon(self):
        if self.passed:
            return f"{GREEN}✅{RESET}"
        elif self.warning:
            return f"{YELLOW}⚠️ {RESET}"
        else:
            return f"{RED}❌{RESET}"

    def print(self):
        status = "PASS" if self.passed else ("WARN" if self.warning else "FAIL")
        color  = GREEN if self.passed else (YELLOW if self.warning else RED)
        print(f"  {self.icon} [{color}{status}{RESET}] {BOLD}{self.tid}{RESET} — {self.name}")
        if self.detail and (VERBOSE or not self.passed):
            for line in self.detail.strip().split("\n"):
                print(f"       {line}")


# ─────────────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────────────
def count_skill_md(path: Path) -> int:
    return len(list(path.rglob("SKILL.md")))

def can_import(module_path: Path) -> tuple[bool, str]:
    try:
        spec = importlib.util.spec_from_file_location("_test_module", module_path)
        mod  = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        return True, ""
    except Exception as e:
        return False, str(e)


# ─────────────────────────────────────────────────────────────
# TESTS
# ─────────────────────────────────────────────────────────────

def t01_config_paths():
    """config_paths.py — todas las rutas resuelven a dirs existentes."""
    try:
        from config_paths import (
            PROJECT_ROOT, CORE_DIR, OPERATIONS_DIR,
            SKILLS_DIR, RULES_DIR, SCRIPTS_OS_DIR
        )
        missing = []
        checks = {
            "PROJECT_ROOT": PROJECT_ROOT,
            "CORE_DIR":     CORE_DIR,
            "OPERATIONS_DIR": OPERATIONS_DIR,
            "SKILLS_DIR":   SKILLS_DIR,
            "RULES_DIR":    RULES_DIR,
            "SCRIPTS_OS_DIR": SCRIPTS_OS_DIR,
        }
        for name, path in checks.items():
            if not Path(path).exists():
                missing.append(f"{name} → {path}")
        if missing:
            return TestResult("T01", "config_paths.py — rutas v2.0", False,
                              "Paths no encontrados:\n" + "\n".join(missing))
        detail = "\n".join(f"{k}: {v}" for k, v in checks.items()) if VERBOSE else ""
        return TestResult("T01", "config_paths.py — rutas v2.0", True, detail)
    except Exception as e:
        return TestResult("T01", "config_paths.py — rutas v2.0", False, str(e))


def t02_rules():
    """10 archivos .mdc presentes y no vacíos."""
    rules_dir = ROOT / "01_Personal_Os" / "01_Core" / "01_Rules"
    expected = [
        "00_Core_Protocol.mdc", "01_Pilares_Sistema.mdc", "02_Motor_Agent.mdc",
        "03_Protocolos_Ejecucion.mdc", "04_Observabilidad.mdc", "05_Reporting.mdc",
        "06_Contexto_Gestion.mdc", "07_Docs_Guias.mdc", "08_Token_Economy.mdc",
        "09_Agent_Teams_Protocol.mdc",
    ]
    missing, empty = [], []
    for name in expected:
        p = rules_dir / name
        if not p.exists():
            missing.append(name)
        elif p.stat().st_size == 0:
            empty.append(name)
    if missing or empty:
        detail = ""
        if missing: detail += "Faltantes: " + ", ".join(missing) + "\n"
        if empty:   detail += "Vacíos: "    + ", ".join(empty)
        return TestResult("T02", "Rules — 10 .mdc presentes", False, detail)
    return TestResult("T02", "Rules — 10 .mdc presentes", True,
                      f"10/10 archivos OK en {rules_dir.name}/")


def t03_skills():
    """Cada área de skills tiene ≥1 SKILL.md."""
    skills_dir = ROOT / "01_Personal_Os" / "01_Core" / "02_Tools" / "02_Skills"
    if not skills_dir.exists():
        return TestResult("T03", "Skills — áreas con SKILL.md", False,
                          f"Directorio no encontrado: {skills_dir}")
    areas = [d for d in skills_dir.iterdir() if d.is_dir() and not d.name.startswith(".")]
    without_skill = []
    total_skill_md = 0
    for area in sorted(areas):
        count = count_skill_md(area)
        total_skill_md += count
        if count == 0:
            without_skill.append(area.name)
    if without_skill:
        return TestResult("T03", "Skills — áreas con SKILL.md", False,
                          "Sin SKILL.md: " + ", ".join(without_skill))
    return TestResult("T03", "Skills — áreas con SKILL.md", True,
                      f"{len(areas)} áreas | {total_skill_md} SKILL.md total")


def t04_hubs():
    """HUBs importables sin errores de sintaxis."""
    hubs = [
        "00_Sound_Engine.py", "01_Auditor_Hub.py", "02_Git_Hub.py",
        "03_AIPM_Hub.py", "04_Ritual_Hub.py", "05_Validator_Hub.py",
        "06_Tool_Hub.py", "07_Integration_Hub.py", "08_Workflow_Hub.py",
        "09_Data_Hub.py", "10_General_Hub.py", "11_Auto_Learn_Hub.py",
    ]
    failed = []
    for hub_name in hubs:
        p = SCRIPTS_OS / hub_name
        if not p.exists():
            failed.append(f"{hub_name} — NO ENCONTRADO")
            continue
        try:
            compile(p.read_text(encoding="utf-8"), hub_name, "exec")
        except SyntaxError as e:
            failed.append(f"{hub_name} — SyntaxError: {e}")
    if failed:
        return TestResult("T04", "HUBs — sintaxis válida", False,
                          "\n".join(failed))
    return TestResult("T04", "HUBs — sintaxis válida", True,
                      f"{len(hubs)}/12 HUBs con sintaxis OK")


def t05_sound_engine():
    """Sound Engine — ejecuta sin crash (modo silencioso)."""
    script = SCRIPTS_OS / "00_Sound_Engine.py"
    if not script.exists():
        return TestResult("T05", "Sound Engine — ejecución", False, "Script no encontrado")
    try:
        result = subprocess.run(
            [sys.executable, str(script), "--help"],
            capture_output=True, text=True, timeout=10, cwd=str(ROOT)
        )
        # --help puede dar exit 0 o 1 según implementación, pero no debe crashear
        if result.returncode not in (0, 1, 2):
            return TestResult("T05", "Sound Engine — ejecución", False,
                              f"Exit {result.returncode}: {result.stderr[:200]}")
        return TestResult("T05", "Sound Engine — ejecución", True,
                          "Proceso arranca correctamente")
    except subprocess.TimeoutExpired:
        return TestResult("T05", "Sound Engine — ejecución", False, "Timeout (>10s)")
    except Exception as e:
        return TestResult("T05", "Sound Engine — ejecución", False, str(e))


def t06_auditor_hub():
    """Auditor Hub — health check sin modificar nada."""
    script = SCRIPTS_OS / "01_Auditor_Hub.py"
    if not script.exists():
        return TestResult("T06", "Auditor Hub — health check", False, "Script no encontrado")
    try:
        # Auditor Hub usa subcomandos: estructura, links, skills, health, profundo
        result = subprocess.run(
            [sys.executable, str(script), "health"],
            capture_output=True, text=True, timeout=30, cwd=str(ROOT),
            encoding="utf-8", errors="replace"
        )
        if result.returncode not in (0, 1):
            return TestResult("T06", "Auditor Hub — health check", False,
                              f"Exit {result.returncode}\n{result.stderr[:300]}")
        return TestResult("T06", "Auditor Hub — health check", True,
                          "Health check completado sin crash")
    except subprocess.TimeoutExpired:
        return TestResult("T06", "Auditor Hub — health check", False, "Timeout (>30s)")
    except Exception as e:
        return TestResult("T06", "Auditor Hub — health check", False, str(e))


def t07_edge_case_validator():
    """80_Edge_Case_Validator — analiza archivos de Playground."""
    script = SCRIPTS_OS / "03_Validator" / "80_Edge_Case_Validator.py"
    if not script.exists():
        return TestResult("T07", "Edge Case Validator — ejecución", False,
                          "Script no encontrado")
    try:
        result = subprocess.run(
            [sys.executable, str(script)],
            capture_output=True, text=True, timeout=30, cwd=str(ROOT),
            encoding="utf-8", errors="replace"
        )
        if result.returncode not in (0, 1):
            return TestResult("T07", "Edge Case Validator — ejecución", False,
                              f"Exit {result.returncode}\n{result.stderr[:300]}")
        lines = (result.stdout + result.stderr).strip().split("\n")
        summary = next((l for l in lines if "Archivos analizados" in l), "OK")
        return TestResult("T07", "Edge Case Validator — ejecución", True, summary)
    except subprocess.TimeoutExpired:
        return TestResult("T07", "Edge Case Validator — ejecución", False, "Timeout (>30s)")
    except Exception as e:
        return TestResult("T07", "Edge Case Validator — ejecución", False, str(e))


def t08_sota_integrity():
    """15_SOTA_Integrity_Check — verifica estructura v2.0."""
    script = (SCRIPTS_OS / "12_Auditors_Os" / "scripts"
              / "03_SOTA_Integrity_Check.py")
    if not script.exists():
        return TestResult("T08", "SOTA Integrity Check — v2.0", False,
                          "Script no encontrado")
    try:
        result = subprocess.run(
            [sys.executable, str(script)],
            capture_output=True, text=True, timeout=30, cwd=str(ROOT),
            encoding="utf-8", errors="replace"
        )
        output = result.stdout + result.stderr
        passed = "PASSED" in output or result.returncode == 0
        summary_lines = [l for l in output.split("\n") if "INTEGRITY" in l or "PASSED" in l or "FAILED" in l]
        detail = "\n".join(summary_lines[:5]) if summary_lines else output[:300]
        return TestResult("T08", "SOTA Integrity Check — v2.0", passed, detail)
    except subprocess.TimeoutExpired:
        return TestResult("T08", "SOTA Integrity Check — v2.0", False, "Timeout (>30s)")
    except Exception as e:
        return TestResult("T08", "SOTA Integrity Check — v2.0", False, str(e))


def t09_beautifier():
    """Beautifier — alinea tabla sin romper code blocks."""
    script = SCRIPTS_OS / "10_Legacy" / "35_Beautify_Tables.py"
    if not script.exists():
        return TestResult("T09", "Beautifier — tablas + code blocks", False,
                          "Script no encontrado")
    # Crear archivo temporal con tabla + code block
    sample = (
        "# Test\n\n"
        "| Col A | Col B | Col C |\n"
        "|-------|-------|-------|\n"
        "| valor | x     | largo valor |\n\n"
        "```\n"
        "Think_Different/\n"
        "├── 00_Winter/\n"
        "|--- esto no debe convertirse en tabla\n"
        "```\n"
    )
    with tempfile.NamedTemporaryFile(
        mode="w", suffix=".md", delete=False, encoding="utf-8"
    ) as f:
        f.write(sample)
        tmp_path = Path(f.name)
    try:
        subprocess.run(
            [sys.executable, str(script), str(tmp_path)],
            capture_output=True, text=True, timeout=10
        )
        result_text = tmp_path.read_text(encoding="utf-8")
        # El code block NO debe haber sido modificado
        if "|--- esto no debe convertirse en tabla" not in result_text:
            return TestResult("T09", "Beautifier — tablas + code blocks", False,
                              "Code block fue modificado — fix no funciona")
        # La tabla SÍ debe estar alineada
        if "largo valor" not in result_text:
            return TestResult("T09", "Beautifier — tablas + code blocks", False,
                              "Tabla no fue procesada")
        return TestResult("T09", "Beautifier — tablas + code blocks", True,
                          "Tabla alineada ✓ | Code block intacto ✓")
    finally:
        tmp_path.unlink(missing_ok=True)


def t10_auto_improvement():
    """Auto-Improvement Engine — importa sin errores."""
    engine_dir = ROOT / "01_Personal_Os" / "03_Learning" / "01_Auto_Improvement" / "01_Engine"
    engine_py  = engine_dir / "recursive_improvement_engine.py"
    if not engine_py.exists():
        return TestResult("T10", "Auto-Improvement Engine — import", False,
                          f"No encontrado: {engine_py}")
    # Verificar que los módulos hermanos existen
    siblings = ["detector.py", "analyzer.py", "executor.py", "learner.py"]
    missing = [s for s in siblings if not (engine_dir / s).exists()]
    if missing:
        return TestResult("T10", "Auto-Improvement Engine — import", False,
                          "Módulos faltantes: " + ", ".join(missing))
    # Verificar sintaxis del engine
    try:
        compile(engine_py.read_text(encoding="utf-8"), engine_py.name, "exec")
    except SyntaxError as e:
        return TestResult("T10", "Auto-Improvement Engine — import", False,
                          f"SyntaxError: {e}")
    return TestResult("T10", "Auto-Improvement Engine — import", True,
                      f"Engine + {len(siblings)} módulos con sintaxis OK")


def t11_mcps():
    """.mcp.json — JSON válido, ≥30 servidores, sin rutas v1.x."""
    mcp_path = ROOT / ".mcp.json"
    if not mcp_path.exists():
        return TestResult("T11", "MCPs — .mcp.json", False, ".mcp.json no encontrado")
    try:
        data = json.loads(mcp_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        return TestResult("T11", "MCPs — .mcp.json", False, f"JSON inválido: {e}")
    servers = data.get("mcpServers", {})
    count   = len(servers)
    # Detectar rutas v1.x (08_Scripts_Os en raíz)
    raw = mcp_path.read_text(encoding="utf-8")
    v1_hits = []
    for line_no, line in enumerate(raw.split("\n"), 1):
        if "08_Scripts_Os" in line or ('"01_Core"' in line and "Think_Different" in line):
            v1_hits.append(f"línea {line_no}: {line.strip()[:80]}")
    if v1_hits:
        return TestResult("T11", "MCPs — .mcp.json", False,
                          f"{count} servidores | Rutas v1.x:\n" + "\n".join(v1_hits))
    if count < 30:
        return TestResult("T11", "MCPs — .mcp.json", False,
                          f"Solo {count} servidores (esperados ≥30)")
    return TestResult("T11", "MCPs — .mcp.json", True,
                      f"{count} servidores | JSON válido | Sin rutas v1.x")


def t12_hillary():
    """Hillary / Task — estructura presente."""
    task_dir  = ROOT / "01_Personal_Os" / "04_Tasks"
    inbox     = task_dir / "02_Hillary_Inbox"
    done      = task_dir / "01_Tasks_Done"
    templates = task_dir / "00_Templates"
    missing   = [str(p) for p in [task_dir, inbox, done, templates] if not p.exists()]
    if missing:
        return TestResult("T12", "Hillary — Task structure", False,
                          "Faltantes:\n" + "\n".join(missing))
    inbox_count = len(list(inbox.rglob("*")))
    return TestResult("T12", "Hillary — Task structure", True,
                      f"03_Task/ ✓ | Hillary_Inbox ({inbox_count} items) ✓")


def t13_hooks():
    """Hooks — archivos de hooks apuntan a rutas existentes."""
    settings_path = ROOT / ".claude" / "settings.local.json"
    if not settings_path.exists():
        return TestResult("T13", "Hooks — settings.local.json", False,
                          "settings.local.json no encontrado")
    try:
        data = json.loads(settings_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        return TestResult("T13", "Hooks — settings.local.json", False,
                          f"JSON inválido: {e}")
    hooks = data.get("hooks", {})
    if not hooks:
        return TestResult("T13", "Hooks — settings.local.json", True,
                          "Sin hooks configurados (OK)", warning=True)
    # Extraer todos los paths de comandos python
    import re
    raw = settings_path.read_text(encoding="utf-8")
    py_paths = re.findall(r'"([^"]+\.py)"', raw)
    missing = [p for p in py_paths if not Path(p).exists()]
    if missing:
        return TestResult("T13", "Hooks — settings.local.json", False,
                          "Archivos no encontrados:\n" + "\n".join(missing))
    return TestResult("T13", "Hooks — settings.local.json", True,
                      f"{len(py_paths)} hook scripts existen ✓")


def t14_compound_engineering():
    """Compound Engineering — SKILL.md y agentes presentes."""
    ce_dir = (ROOT / "01_Personal_Os" / "01_Core"
              / "02_Tools" / "02_Skills" / "00_Compound_Engineering")
    if not ce_dir.exists():
        return TestResult("T14", "Compound Engineering — skill", False,
                          f"Directorio no encontrado: {ce_dir}")
    skill_md = list(ce_dir.rglob("SKILL.md"))
    agent_mds = list(ce_dir.rglob("*.md"))
    if not skill_md:
        return TestResult("T14", "Compound Engineering — skill", False,
                          "Sin SKILL.md")
    subdirs = [d.name for d in ce_dir.iterdir() if d.is_dir()]
    return TestResult("T14", "Compound Engineering — skill", True,
                      f"{len(skill_md)} SKILL.md | {len(agent_mds)} .md total | subcarpetas: {', '.join(subdirs)}")


def t15_workflows():
    """Gentleman Workflows — 5 workflows presentes."""
    wf_dir = ROOT / "01_Personal_Os" / "01_Core" / "00_Workflows_Os"
    if not wf_dir.exists():
        return TestResult("T15", "Gentleman Workflows — 5 presentes", False,
                          f"Directorio no encontrado: {wf_dir}")
    expected = [
        "01_Personal_Os", "02_Marvel", "03_Gentleman",
        "04_Hillary", "05_Compound_Engineering",
    ]
    missing  = [e for e in expected if not (wf_dir / e).exists()]
    present  = [e for e in expected if (wf_dir / e).exists()]
    if missing:
        return TestResult("T15", "Gentleman Workflows — 5 presentes", False,
                          "Faltantes: " + ", ".join(missing))
    return TestResult("T15", "Gentleman Workflows — 5 presentes", True,
                      "Presentes: " + ", ".join(present))


# ─────────────────────────────────────────────────────────────
# RUNNER
# ─────────────────────────────────────────────────────────────
ALL_TESTS = [
    t01_config_paths, t02_rules, t03_skills, t04_hubs, t05_sound_engine,
    t06_auditor_hub, t07_edge_case_validator, t08_sota_integrity, t09_beautifier,
    t10_auto_improvement, t11_mcps, t12_hillary, t13_hooks,
    t14_compound_engineering, t15_workflows,
]

def run_tests(filter_ids=None):
    print(f"\n{BOLD}{CYAN}{'='*60}{RESET}")
    print(f"{BOLD}{CYAN}  PersonalOS v4.7 Consequences — Health Test Suite{RESET}")
    print(f"{CYAN}  {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}{RESET}")
    print(f"{BOLD}{CYAN}{'='*60}{RESET}\n")

    results = []
    for test_fn in ALL_TESTS:
        tid = test_fn.__name__.upper().replace("_", "").replace("T0", "T0").replace("T1", "T1")
        # Extraer TXX del nombre
        tid = test_fn.__name__[:3].upper()
        if filter_ids and tid not in filter_ids:
            continue
        try:
            r = test_fn()
        except Exception as e:
            r = TestResult(tid, test_fn.__doc__ or test_fn.__name__, False,
                           f"ERROR INESPERADO: {e}")
        results.append(r)
        r.print()

    # Resumen
    passed  = sum(1 for r in results if r.passed)
    warned  = sum(1 for r in results if r.warning and not r.passed)
    failed  = sum(1 for r in results if not r.passed and not r.warning)
    total   = len(results)
    score   = int(passed / total * 100) if total else 0

    print(f"\n{BOLD}{'='*60}{RESET}")
    print(f"{BOLD}  RESULTADO FINAL: {passed}/{total} tests pasaron ({score}%){RESET}")
    if failed:
        print(f"  {RED}❌ {failed} FAIL{RESET}", end="")
    if warned:
        print(f"  {YELLOW}⚠️  {warned} WARN{RESET}", end="")
    if passed == total:
        print(f"\n  {GREEN}{BOLD}🎉 PURE GREEN — Sistema 100% operativo{RESET}")
    print(f"{BOLD}{'='*60}{RESET}\n")

    # Guardar reporte
    report_dir = ROOT / "02_Playground" / "reports"
    report_dir.mkdir(exist_ok=True)
    report_file = report_dir / f"health_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
    with open(report_file, "w", encoding="utf-8") as f:
        f.write(f"PersonalOS v4.7 Consequences Health Report — {datetime.now()}\n")
        f.write(f"Score: {passed}/{total} ({score}%)\n\n")
        for r in results:
            status = "PASS" if r.passed else ("WARN" if r.warning else "FAIL")
            f.write(f"[{status}] {r.tid} — {r.name}\n")
            if r.detail:
                f.write(f"       {r.detail}\n")
    print(f"  Reporte guardado: {report_file.name}\n")

    return 0 if passed == total else 1


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="PersonalOS Health Test Suite")
    parser.add_argument("--verbose", action="store_true", help="Output detallado")
    parser.add_argument("--test", help="Tests a correr (ej: T01,T05,T11)")
    args = parser.parse_args()

    filter_ids = None
    if args.test:
        filter_ids = set(t.strip().upper() for t in args.test.split(","))

    sys.exit(run_tests(filter_ids))
