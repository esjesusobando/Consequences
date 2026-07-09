"""
config_paths.py - Rutas Centralizadas para PersonalOS v5.0
==========================================================
Este módulo proporciona rutas absolutas a todos los directorios del sistema.
Úsalo en lugar de hardcodear paths relativos.

Uso:
    from config_paths import ROOT_DIR, ENGINE_DIR, KNOWLEDGE_DIR

Versión corregida v5.0:
  - ROOT_DIR apunta al project root (Think_Different/) donde está 00_Winter_is_Coming/
  - OPERATIONS_DIR ya no apunta a 04_Operations (no existe) sino a 05_Scripts/
  - ENGINE_DIR apunta a 05_Scripts/00_HUBs/03_Scripts_Os (donde están los scripts reales)
  - MEMORY_CTX_DIR apunta a 01_Memory/00_Context_LLM (estructura real v5)
  - find_project_root() busca 00_Winter_is_Coming (más robusto que .agent/CLAUDE.md)
"""

from pathlib import Path
import os
import argparse
import json


# =============================================================================
# AUTO-DETECCIÓN DE RAÍZ
# =============================================================================


def find_project_root():
    """Detecta automáticamente la raíz buscando 00_Winter_is_Coming, ascendiendo desde __file__.
    
    En la estructura v5.0, 00_Winter_is_Coming está en el project root (Think_Different/).
    Esto es más robusto que buscar .agent/CLAUDE.md porque 00_Winter_is_Coming es un directorio
    visible incluso si .agent/ está oculto.
    """
    current = Path(__file__).resolve().parent
    for candidate in [current, *current.parents]:
        if (candidate / "00_Winter_is_Coming").exists():
            return candidate
    return None


# Intentar con env var primero
root_env = os.environ.get("PERSONAL_OS_ROOT")
if root_env and (Path(root_env) / "00_Winter_is_Coming").exists():
    ROOT_DIR = Path(root_env).resolve()
else:
    ROOT_DIR = find_project_root()

if not ROOT_DIR or not ROOT_DIR.exists():
    raise RuntimeError(
        "No se pudo detectar la raíz del proyecto. "
        "Define la variable 'PERSONAL_OS_ROOT' (ej: C:/Users/sebas/Desktop/Think_Different) "
        "o asegúrate de que existe 00_Winter_is_Coming en la raíz."
    )

# Nota: PERSONAL_OS_ROOT debe apuntar al project root (Think_Different/), NO a 01_Personal_Os/.
# El directorio 00_Winter_is_Coming está en Think_Different/00_Winter_is_Coming/.
# Todas las rutas se calculan como ROOT_DIR / "01_Personal_Os" / {subdir}.
# Esto es intencional — ROOT_DIR es el project root, no el OS root.

# =============================================================================
# 4 CARPETAS RAÍZ DEL OS (estructura v5.0)
# =============================================================================

CORE_DIR       = ROOT_DIR / "01_Personal_Os" / "00_Core"
OPERATIONS_DIR = ROOT_DIR / "01_Personal_Os" / "05_Scripts"
KNOWLEDGE_DIR  = ROOT_DIR / "01_Personal_Os" / "02_Knowledge"
ENGINE_DIR     = ROOT_DIR / "01_Personal_Os" / "05_Scripts" / "00_HUBs" / "03_Scripts_Os"
MEMORY_CTX_DIR = ROOT_DIR / "01_Personal_Os" / "01_Memory" / "00_Context_LLM"

# Aliases legacy — usar los canónicos de arriba
BRAIN_DIR  = OPERATIONS_DIR   # alias legacy → OPERATIONS_DIR
SYSTEM_DIR = CORE_DIR         # alias legacy → CORE_DIR
ARCHIVE_DIR = ROOT_DIR / "01_Personal_Os" / "07_Archive"
PROJECTS_DIR = ROOT_DIR / "01_Personal_Os" / "06_Projects"
PLAYGROUND_DIR = ROOT_DIR / "02_Playground"
HOOKS_DIR = ROOT_DIR / ".agent" / "04_Extensions" / "hooks"
SOUND_DIR = CORE_DIR / "02_Tools" / "05_Hooks" / "04_Sound"
MCP_CONFIG_FILE = ROOT_DIR / ".mcp.json"

# =============================================================================
# SUBDIRECTORIOS BRAIN/OPERATIONS
# =============================================================================

BRAIN_MEMORY_DIR    = MEMORY_CTX_DIR / "00_Context_Memory"
BRAIN_KNOWLEDGE_DIR = MEMORY_CTX_DIR / "02_Knowledge_Brain"
BRAIN_NOTES_DIR     = MEMORY_CTX_DIR / "01_Process_Notes"
BRAIN_RULES_DIR     = MEMORY_CTX_DIR / "03_Memory_Brain"

# =============================================================================
# SUBDIRECTORIOS OPERATIONS
# =============================================================================

OPERATIONS_TASKS_DIR  = ROOT_DIR / "01_Personal_Os" / "04_Tasks"
OPERATIONS_EVALS_DIR  = CORE_DIR / "02_Tools" / "08_Evals"
MODEL_EVALS_DIR       = ROOT_DIR / "01_Personal_Os" / "01_Memory" / "00_Context_LLM" / "08_Model_Evals"

# Model Eval Module paths
MODEL_REGISTRY_FILE = MODEL_EVALS_DIR / "model_registry.json"
EVAL_RUBRICS_FILE   = MODEL_EVALS_DIR / "eval_rubrics.json"
ROUTING_POLICY_FILE = MODEL_EVALS_DIR / "routing_policy.yaml"
PARETO_FILE         = MODEL_EVALS_DIR / "pareto_frontiers.json"
GOLD_STANDARDS_DIR  = MODEL_EVALS_DIR / "gold_standards"
EVAL_RUNS_DIR       = MODEL_EVALS_DIR / "runs"
RUN_HISTORY_DIR     = EVAL_RUNS_DIR
DRIFT_REPORTS_DIR   = MODEL_EVALS_DIR
CALIBRATION_FILE    = MODEL_EVALS_DIR / "calibration_state.json"
EVAL_ENGINE_DIR     = ENGINE_DIR / "26_Model_Eval_Engine"
ROUTER_ENGINE_DIR   = ENGINE_DIR / "28_Model_Router_Engine"

try:
    EVAL_RUNS_DIR.mkdir(parents=True, exist_ok=True)
except OSError as e:
    print(f"[WARN] Could not create EVAL_RUNS_DIR {EVAL_RUNS_DIR}: {e}")

OPERATIONS_ANALYTICS_DIR = MEMORY_CTX_DIR / "01_Process_Notes"
AUTO_IMPROVEMENT_DIR = ROOT_DIR / "01_Personal_Os" / "03_Learning" / "01_Auto_Improvement"

# =============================================================================
# SUBDIRECTORIOS ENGINE/SCRIPTS
# =============================================================================

ENGINE_SCRIPTS_DIR = ENGINE_DIR
ENGINE_TESTS_DIR   = ENGINE_DIR / "13_Legacy"
ENGINE_COMPOUND_DIR = CORE_DIR / "02_Tools" / "02_Skills" / "00_Compound_Engineering"

# =============================================================================
# SUBDIRECTORIOS KNOWLEDGE
# =============================================================================

KNOWLEDGE_RESEARCH_DIR    = KNOWLEDGE_DIR / "01_Research"
KNOWLEDGE_NOTES_DIR       = MEMORY_CTX_DIR / "02_Knowledge_Brain"
KNOWLEDGE_RESOURCES_DIR   = KNOWLEDGE_DIR / "02_Docs"
KNOWLEDGE_EXAMPLES_DIR    = KNOWLEDGE_DIR / "00_Examples_Personal_Os"
KNOWLEDGE_PLANS_DIR       = MEMORY_CTX_DIR / "05_Plans"
PLANS_DIR                 = KNOWLEDGE_PLANS_DIR

# =============================================================================
# DIRECTORIOS ADICIONALES
# =============================================================================

BRAINSTORMS_DIR     = MEMORY_CTX_DIR / "02_Knowledge_Brain"
COMPOUND_ENGINE_DIR = ENGINE_COMPOUND_DIR
COMPOUND_ENGINE_HOME_DIR = (
    Path.home() / ".config" / "opencode" / "skills" / "gentleman" / "04_Compound"
)

# =============================================================================
# ALIAS PARA COMPATIBILIDAD
# =============================================================================

BASE_DIR = ROOT_DIR
PROJECT_ROOT = ROOT_DIR
SCRIPTS_OS_DIR = ENGINE_DIR

# =============================================================================
# RUTAS REALES DEL SISTEMA
# =============================================================================

MATRIX_DIR = ROOT_DIR / "00_Winter_is_Coming"
TASKS_DIR  = ROOT_DIR / "01_Personal_Os" / "04_Tasks"
EVALS_DIR  = CORE_DIR / "02_Tools" / "08_Evals"

SKILLS_DIR        = CORE_DIR / "02_Tools" / "02_Skills"
RULES_DIR         = CORE_DIR / "01_Rules"
MCP_DIR           = CORE_DIR / "02_Tools" / "03_Mcp"
AGENTS_DIR        = CORE_DIR / "02_Tools" / "01_Agents"
INVENTORY_FILE    = CORE_DIR / "01_Inventario_Core.md"
BRAIN_TEMPLATE_DIR = ROOT_DIR / "01_Personal_Os" / "04_Tasks" / "00_Templates"

WORKFLOWS_DIR              = CORE_DIR / "00_Workflows"
WORKFLOWS_PERSONAL_DIR     = WORKFLOWS_DIR / "01_Personal_Os"
WORKFLOWS_MARVEL_DIR       = WORKFLOWS_DIR / "02_Marvel"
WORKFLOWS_GENTLEMAN_DIR    = WORKFLOWS_DIR / "03_Gentleman"
WORKFLOWS_HILLARY_DIR      = WORKFLOWS_DIR / "04_Hillary"
WORKFLOWS_COMPOUND_DIR     = WORKFLOWS_DIR / "05_Compound_Engineering"

AUDITOR_DIR = MEMORY_CTX_DIR / "07_Auditorias"
UNICORN_DIR = KNOWLEDGE_DIR
SERVER_DIR  = CORE_DIR / "02_Tools" / "07_Server"
AIPM_ROOT   = SERVER_DIR / "AIPM"

# =============================================================================
# JARVIS v4.9 — Manifest + HUBs
# =============================================================================

MANIFEST_DIR       = ROOT_DIR / "01_Personal_Os" / "05_Scripts" / "02_Agent_Teams_Lite" / "00_Manifest"
TELEMETRY_DIR      = ROOT_DIR / "01_Personal_Os" / "01_Memory" / "00_Context_LLM" / "10_Telemetry"
OS_DIRECTORY_FILE  = ROOT_DIR / "OS_DIRECTORY.md"

HUB_AUDITOR        = ENGINE_DIR / "01_Auditor_Hub.py"
HUB_GIT            = ENGINE_DIR / "02_Git_Hub.py"
HUB_VALIDATOR      = ENGINE_DIR / "05_Validator_Hub.py"
HUB_AUTO_LEARN     = ENGINE_DIR / "11_Auto_Learn_Hub.py"
HUB_HEALTH_METRICS = ENGINE_DIR / "14_Health_Metrics_Hub.py"
HUB_MCP_SYNC       = ENGINE_DIR / "15_MCP_Sync_Hub.py"
HUB_SYSTEM_MAPPER  = ENGINE_DIR / "20_System_Mapper_Hub.py"
HUB_WATCHDOG       = ENGINE_DIR / "17_Watchdog_Hub.py"
HUB_TELEMETRY      = ENGINE_DIR / "18_Telemetry_Hub.py"
HUB_VALIDATE_FM    = ENGINE_DIR / "22_Validate_Skill_Frontmatter.py"

BACKLOG_FILE = MATRIX_DIR / "BACKLOG.md"
MANAGER_AI_BASE_DIR = ROOT_DIR

# =============================================================================
# VALIDACI\u00d3N DE RUTAS (v1.0)
# =============================================================================


def _is_dead_04_path(path: Path) -> bool:
    """Check if a path references the dead 04_Operations directory."""
    return "04_Operations" in str(path)


def _collect_path_vars() -> dict[str, Path]:
    """Collect all Path globals excluding ROOT_DIR, Path, and non-Path objects."""
    path_vars = {}
    for name, val in globals().items():
        if isinstance(val, Path) and name not in ("ROOT_DIR", "Path"):
            path_vars[name] = val
    return path_vars


def validate_paths(path_vars: dict[str, Path]) -> tuple[list[dict], list[dict], list[dict]]:
    """Check all path variables exist on disk.

    Returns (ok_paths, broken_paths, dead_04_paths).
    Each entry: {"name": str, "path": str, "exists": bool, "is_dead_04": bool}
    """
    ok_paths: list[dict] = []
    broken_paths: list[dict] = []
    dead_04_paths: list[dict] = []

    for name, p in sorted(path_vars.items()):
        entry = {
            "name": name,
            "path": str(p),
            "exists": p.exists(),
            "is_dead_04": _is_dead_04_path(p),
        }
        if entry["exists"]:
            ok_paths.append(entry)
        else:
            broken_paths.append(entry)
        if entry["is_dead_04"]:
            dead_04_paths.append(entry)

    return ok_paths, broken_paths, dead_04_paths


def format_human(ok_paths: list[dict], broken_paths: list[dict], dead_04_paths: list[dict]) -> None:
    """Print human-readable validation report (ASCII-safe)."""
    total = len(ok_paths) + len(broken_paths)
    print(f"Validating PersonalOS paths...")
    print(f"[OK] {len(ok_paths)}/{total} paths OK")
    if broken_paths:
        print(f"[BROKEN] {len(broken_paths)} paths BROKEN:")
        for p in broken_paths:
            print(f"     - {p['name']} -> {p['path']} (does not exist)")
    print(f"[WARN] {len(dead_04_paths)} paths reference dead 04_Operations/")


def format_json(ok_paths: list[dict], broken_paths: list[dict], dead_04_paths: list[dict]) -> None:
    """Print JSON validation report."""
    total = len(ok_paths) + len(broken_paths)
    status = "ok" if not broken_paths and not dead_04_paths else "degraded"
    result = {
        "status": status,
        "total": total,
        "ok": len(ok_paths),
        "broken": len(broken_paths),
        "dead_04": len(dead_04_paths),
        "paths": sorted(ok_paths + broken_paths, key=lambda x: x["name"]),
    }
    print(json.dumps(result, indent=2, ensure_ascii=False))


# =============================================================================
# CLI \u2014 VERIFICACI\u00d3N Y VALIDACI\u00d3N
# =============================================================================

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="PersonalOS Path Validator")
    parser.add_argument("--validate", action="store_true", help="Validate all paths exist on disk")
    parser.add_argument("--json", action="store_true", help="Output in JSON format")
    args = parser.parse_args()

    if args.validate:
        path_vars = _collect_path_vars()
        ok_paths, broken_paths, dead_04_paths = validate_paths(path_vars)

        if args.json:
            format_json(ok_paths, broken_paths, dead_04_paths)
        else:
            format_human(ok_paths, broken_paths, dead_04_paths)

        exit(1 if broken_paths or dead_04_paths else 0)

    # Original debug block \u2014 runs when called with no args
    print("=== PersonalOS v5.0 - Rutas Configuradas ===")
    print(f"PERSONAL_OS_ROOT={os.environ.get('PERSONAL_OS_ROOT')}")
    print(f"ROOT_DIR: {ROOT_DIR}")
    print()
    print("Rutas del Sistema:")
    for name, val in [
        ("CORE_DIR", CORE_DIR),
        ("OPERATIONS_DIR", OPERATIONS_DIR),
        ("KNOWLEDGE_DIR", KNOWLEDGE_DIR),
        ("ENGINE_DIR", ENGINE_DIR),
        ("MEMORY_CTX_DIR", MEMORY_CTX_DIR),
        ("TASKS_DIR", TASKS_DIR),
        ("MATRIX_DIR", MATRIX_DIR),
    ]:
        print(f"  {name:20s} {'[OK]' if val.exists() else '[--]'}  {val}")
    print()
    print("Verificando existencia de directorios...")
    for name, dir_path in [
        ("ROOT", ROOT_DIR),
        ("CORE", CORE_DIR),
        ("OPERATIONS", OPERATIONS_DIR),
        ("KNOWLEDGE", KNOWLEDGE_DIR),
        ("ENGINE", ENGINE_DIR),
        ("TASKS", TASKS_DIR),
        ("MATRIX", MATRIX_DIR),
    ]:
        status_str = "[OK]" if dir_path.exists() else "[FAIL]"
        print(f"  {status_str} {name}: {dir_path}")


# =============================================================================
# SCRIPT LOCATOR v1.0 - get_skill_script()
# =============================================================================

SCRIPT_LOCATION_MAP = {
    "00_Parallel_Audit_Pro.py": ENGINE_DIR / "05_Validator",
    "01_Skill_Auditor.py": ENGINE_DIR / "05_Validator",
    "33_Parallel_Audit_Pro.py": ENGINE_DIR / "05_Validator",
    "34_Skill_Auditor.py": ENGINE_DIR / "05_Validator",
    "37_Linter_Autofix.py": ENGINE_DIR / "05_Validator",
    "40_Validate_Rules.py": ENGINE_DIR / "05_Validator",
    "80_Edge_Case_Validator.py": ENGINE_DIR / "05_Validator",
    "skill_validator.py": ENGINE_DIR / "05_Validator",
    "skill_security_scan.py": ENGINE_DIR / "05_Validator",
    "01_Auditor_Hub.py": ENGINE_DIR / "01_Auditor_Hub.py",
    "05_Validator_Hub.py": ENGINE_DIR / "05_Validator_Hub.py",
    "01_Spider_Brainstorm.py": SKILLS_DIR / "00_Compound_Engineering" / "scripts",
    "02_Professor_X_Plan.py": SKILLS_DIR / "05_Workflows" / "01_Agent_Teams_Lite" / "scripts",
    "08_Ritual_Cierre.py": ENGINE_DIR / "13_Legacy",
    "14_Morning_Standup.py": ENGINE_DIR / "13_Legacy",
    "15_Weekly_Review.py": ENGINE_DIR / "13_Legacy",
    "09_Backlog_Triage.py": ENGINE_DIR / "13_Legacy",
    "11_Sync_Notes.py": ENGINE_DIR / "13_Legacy",
    "16_Clean_System.py": ENGINE_DIR / "13_Legacy",
    "00_Notifier.py": ENGINE_DIR / "13_Legacy",
    "17_Ritual_Dominical.py": ENGINE_DIR / "13_Legacy",
    "06_AntMan_Lfg_Lite.py": ENGINE_DIR / "13_Legacy",
    "18_Generacion_Contenido.py": ENGINE_DIR / "13_Legacy",
    "19_Generate_Progress.py": ENGINE_DIR / "13_Legacy",
    "10_AI_Task_Planner.py": ENGINE_DIR / "13_Legacy",
    "12_Update_Links.py": ENGINE_DIR / "13_Legacy",
    "28_System_Health_Monitor.py": ENGINE_DIR / "28_System_Health_Monitor.py",
    "50_System_Health_Monitor.py": ENGINE_DIR / "28_System_Health_Monitor.py",
    "03_Thor_Work.py": ENGINE_DIR / "13_Legacy",
    "04_Vision_Review.py": ENGINE_DIR / "13_Legacy",
    "05_Hulk_Compound.py": ENGINE_DIR / "13_Legacy",
    "56_Organize_Solutions.py": ENGINE_DIR / "13_Legacy",
    "87_Iron_Man_Gen.py": ENGINE_DIR / "12_Auditors_Os" / "scripts",
    "13_Beautify_Tables.py": ENGINE_DIR / "12_Auditors_Os" / "scripts",
    "14_Beauty_Doc.py": ENGINE_DIR / "12_Auditors_Os" / "scripts",
    "15_SOTA_Integrity_Check.py": ENGINE_DIR / "12_Auditors_Os" / "scripts",
    "16_Carousel_Engine.py": ENGINE_DIR / "12_Auditors_Os" / "scripts",
    "12_Context_Usage_Bar.py": ENGINE_DIR / "12_Auditors_Os" / "scripts",
    "01_Beautify_Tables.py": ENGINE_DIR / "12_Auditors_Os" / "scripts",
    "02_Beauty_Doc.py": ENGINE_DIR / "12_Auditors_Os" / "scripts",
    "03_SOTA_Integrity_Check.py": ENGINE_DIR / "12_Auditors_Os" / "scripts",
    "04_Carousel_Engine.py": ENGINE_DIR / "12_Auditors_Os" / "scripts",
    "00_Context_Usage_Bar.py": ENGINE_DIR / "12_Auditors_Os" / "scripts",
    "39_Repair_Corruption.py": SKILLS_DIR / "06_Tools" / "21_System_Master",
    "62_Tool_Shed.py": SKILLS_DIR / "06_Tools" / "04_DevOps" / "scripts",
    "60_Fast_Vision.py": ENGINE_DIR / "09_Auxiliary" / "60_Fast_Vision.py",
    "61_MCP_Health_Check.py": ENGINE_DIR / "09_Auxiliary" / "61_MCP_Health_Check.py",
    "63_Skill_Harmonizer.py": ENGINE_DIR / "09_Auxiliary" / "63_Skill_Harmonizer.py",
    "02_Fast_Vision.py": ENGINE_DIR / "09_Auxiliary" / "02_Fast_Vision.py",
    "03_MCP_Health_Check.py": ENGINE_DIR / "09_Auxiliary" / "03_MCP_Health_Check.py",
    "04_Skill_Harmonizer.py": ENGINE_DIR / "09_Auxiliary" / "04_Skill_Harmonizer.py",
}


def get_skill_script(script_name):
    """Resuelve la ruta de un script en su skill destino."""
    if not script_name or not script_name.strip() or not script_name.endswith(".py"):
        return None

    if script_name in SCRIPT_LOCATION_MAP:
        script_dir = SCRIPT_LOCATION_MAP[script_name]
        if script_dir.is_file():
            script_path = script_dir
        else:
            script_path = script_dir / script_name
        if script_path.exists():
            return script_path

    legacy_paths = [
        ENGINE_DIR / "09_Auxiliary" / script_name,
        ENGINE_DIR / "01_Ritual" / script_name,
        ENGINE_DIR / "02_Git" / script_name,
        ENGINE_DIR / "12_Auditors_Os" / "scripts" / script_name,
        ENGINE_DIR / ".backup" / "10_Legacy_backup_20260420" / script_name,
        ENGINE_DIR / script_name,
    ]
    for legacy_path in legacy_paths:
        if legacy_path.exists():
            return legacy_path

    for skill_dir in SKILLS_DIR.iterdir():
        if skill_dir.is_dir():
            for scripts_subdir in ["scripts", "01_Scripts", "02_Scripts", "03_Scripts"]:
                scripts_dir = skill_dir / scripts_subdir
                if scripts_dir.exists():
                    script_path = scripts_dir / script_name
                    if script_path.exists():
                        return script_path

    return None
