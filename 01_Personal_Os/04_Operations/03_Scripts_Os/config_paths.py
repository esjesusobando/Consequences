"""
config_paths.py - Rutas Centralizadas para PersonalOS
====================================================
Este módulo proporciona rutas absolutas a todos los directorios del sistema.
Úsalo en lugar de hardcodear paths relativos.

Uso:
    from config_paths import ROOT_DIR, BRAIN_DIR, ENGINE_DIR
"""

from pathlib import Path
import os


# =============================================================================
# AUTO-DETECCIÓN DE RAÍZ (7 Dimensiones)
# =============================================================================


def find_project_root():
    """Detecta automáticamente la raíz buscando 00_Winter_is_Coming, ascendiendo desde __file__."""
    current = Path(__file__).resolve().parent
    for candidate in [current, *current.parents]:
        if (candidate / "00_Winter_is_Coming").exists():
            return candidate
    return None


# Intentar con env var primero
root_env = os.environ.get("PERSONAL_OS_ROOT")
if root_env:
    ROOT_DIR = Path(root_env).resolve()
else:
    # Auto-detectar
    ROOT_DIR = find_project_root()

if not ROOT_DIR or not ROOT_DIR.exists():
    raise RuntimeError(
        "No se pudo detectar la raíz del proyecto. "
        "Define la variable 'PERSONAL_OS_ROOT' o asegúrate de que existe 00_Winter_is_Coming."
    )

# 4 Carpetas raíz del OS (estructura v4.0 Consequences)
CORE_DIR       = ROOT_DIR / "01_Personal_Os" / "01_Core"
OPERATIONS_DIR = ROOT_DIR / "01_Personal_Os" / "04_Operations"
KNOWLEDGE_DIR  = ROOT_DIR / "01_Personal_Os" / "02_Knowledge"
ENGINE_DIR     = ROOT_DIR / "01_Personal_Os" / "04_Operations" / "03_Scripts_Os"

# Aliases legacy — usar los canónicos de arriba
BRAIN_DIR  = OPERATIONS_DIR   # alias legacy → OPERATIONS_DIR
SYSTEM_DIR = CORE_DIR         # alias legacy → CORE_DIR
ARCHIVE_DIR = ROOT_DIR / "01_Personal_Os" / "05_Archive"
PROJECTS_DIR = ROOT_DIR / "01_Personal_Os" / "04_Operations" / "05_Projects"
PLAYGROUND_DIR = ROOT_DIR / "02_Playground"
HOOKS_DIR = ROOT_DIR / ".agent" / "04_Extensions" / "hooks"
SOUND_DIR = CORE_DIR / "02_Tools" / "05_Hooks" / "04_Sound"   # fuente canónica
MCP_CONFIG_FILE = ROOT_DIR / ".mcp.json"           # config activa v2.0

# =============================================================================
# SUBDIRECTORIOS BRAIN/OPERATIONS (v2.0 Consequences)
# =============================================================================

BRAIN_MEMORY_DIR = OPERATIONS_DIR / "00_Context_LLM" / "00_Context_Memory"
BRAIN_KNOWLEDGE_DIR = OPERATIONS_DIR / "00_Context_LLM" / "02_Knowledge_Brain"
BRAIN_NOTES_DIR = OPERATIONS_DIR / "00_Context_LLM" / "01_Process_Notes"
BRAIN_RULES_DIR = OPERATIONS_DIR / "00_Context_LLM" / "03_Memory_Brain"

# =============================================================================
# SUBDIRECTORIOS OPERATIONS (v2.0)
# =============================================================================

OPERATIONS_TASKS_DIR = ROOT_DIR / "01_Personal_Os" / "03_Task"
OPERATIONS_EVALS_DIR = CORE_DIR / "02_Tools" / "08_Evals"
OPERATIONS_ANALYTICS_DIR = OPERATIONS_DIR / "00_Context_LLM" / "01_Process_Notes"
AUTO_IMPROVEMENT_DIR = OPERATIONS_DIR / "01_Auto_Improvement"

# =============================================================================
# SUBDIRECTORIOS ENGINE/SCRIPTS (v2.0)
# =============================================================================

ENGINE_SCRIPTS_DIR = ENGINE_DIR  # Ya está en 03_Scripts_Os
ENGINE_TESTS_DIR = ENGINE_DIR / "10_Legacy"
ENGINE_COMPOUND_DIR = CORE_DIR / "02_Tools" / "02_Skills" / "00_Compound_Engineering"

# =============================================================================
# SUBDIRECTORIOS KNOWLEDGE (v2.0)
# =============================================================================

KNOWLEDGE_RESEARCH_DIR = KNOWLEDGE_DIR / "01_Research_Os"
KNOWLEDGE_NOTES_DIR = OPERATIONS_DIR / "00_Context_LLM" / "02_Knowledge_Brain"
KNOWLEDGE_RESOURCES_DIR = KNOWLEDGE_DIR / "03_Writing_Content"
KNOWLEDGE_EXAMPLES_DIR = KNOWLEDGE_DIR / "00_Examples_Personal_Os"
KNOWLEDGE_PLANS_DIR = OPERATIONS_DIR / "00_Context_LLM" / "05_Plans"

# Alias para scripts que usan PLANS_DIR
PLANS_DIR = KNOWLEDGE_PLANS_DIR

# =============================================================================
# DIRECTORIOS ADICIONALES (usados por scripts específicos)
# =============================================================================

# Brainstorms (deprecated - ahora en 02_Knowledge_Brain si existe)
BRAINSTORMS_DIR = BRAIN_DIR / "02_Knowledge_Brain"

# Compound Engine - ubicacion principal en Every_Sync_Zone
COMPOUND_ENGINE_DIR = (
    PROJECTS_DIR
    / "01_Projects_Lab"
    / "Every_Sync_Zone"
    / "plugins"
    / "compound-engineering"
)

# Ubicacion alternativa en home (skills gentleman)
COMPOUND_ENGINE_HOME_DIR = (
    Path.home() / ".config" / "opencode" / "skills" / "gentleman" / "04_Compound"
)

# =============================================================================
# ALIAS PARA COMPATIBILIDAD (scripts legacy)
# =============================================================================

BASE_DIR = ROOT_DIR  # Alias para scripts que usan BASE_DIR
PROJECT_ROOT = ROOT_DIR  # Alias para scripts que usan PROJECT_ROOT
SCRIPTS_OS_DIR = ENGINE_DIR  # Alias de compatibilidad para recursive_improvement_engine

# =============================================================================
# RUTAS REALES DEL SISTEMA (estructura v2.0 Consequences)
# =============================================================================

# Matrix: Goals, Backlog, Agentes (ubicación central)
MATRIX_DIR = ROOT_DIR / "00_Winter_is_Coming"

# Tareas activas (directorio real)
TASKS_DIR = ROOT_DIR / "01_Personal_Os" / "03_Task"

# Evaluaciones (directorio real)
EVALS_DIR = CORE_DIR / "02_Tools" / "08_Evals"

# Skills y Reglas (Sistema central)
SKILLS_DIR = CORE_DIR / "02_Tools" / "02_Skills"
RULES_DIR = CORE_DIR / "01_Rules"
MCP_DIR = CORE_DIR / "02_Tools" / "03_Mcp"
AGENTS_DIR = CORE_DIR / "02_Tools" / "01_Agents"
INVENTORY_FILE = CORE_DIR / "01_Inventario_Total.md"
BRAIN_TEMPLATE_DIR = ROOT_DIR / "01_Personal_Os" / "03_Task" / "00_Templates"

# Workflows (Estructura Jerárquica v2.0)
WORKFLOWS_DIR = CORE_DIR / "00_Workflows_Os"
WORKFLOWS_PERSONAL_DIR = WORKFLOWS_DIR / "01_Personal_Os"
WORKFLOWS_MARVEL_DIR = WORKFLOWS_DIR / "02_Marvel"
WORKFLOWS_GENTLEMAN_DIR = WORKFLOWS_DIR / "03_Gentleman"
WORKFLOWS_HILLARY_DIR = WORKFLOWS_DIR / "04_Hillary"
WORKFLOWS_COMPOUND_DIR = WORKFLOWS_DIR / "05_Compound_Engineering"


# Auditoría y Conocimiento (Unicorn)
AUDITOR_DIR = ENGINE_DIR / "06_Auditor"
UNICORN_DIR = KNOWLEDGE_DIR

# Server MCP
SERVER_DIR = CORE_DIR / "02_Tools" / "07_Server"
AIPM_ROOT = SERVER_DIR / "AIPM"

# =============================================================================
# JARVIS v4.0 — Manifest + HUBs (Consequences 4.0)
# =============================================================================

MANIFEST_DIR       = OPERATIONS_DIR / "02_Agent_Teams_Lite" / "00_Manifest"
TELEMETRY_DIR      = OPERATIONS_DIR / "00_Context_LLM" / "12_Telemetry"
OS_DIRECTORY_FILE  = ROOT_DIR / "OS_DIRECTORY.md"

# HUB scripts (paths dinámicos vía ENGINE_DIR)
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

# Archivos específicos
BACKLOG_FILE = MATRIX_DIR / "BACKLOG.md"

# Alias para compatibilidad con Server.py legacy
MANAGER_AI_BASE_DIR = ROOT_DIR  # Compatibilidad con Server.py

# =============================================================================
# VERIFICACIÓN (para debugging)
# =============================================================================

if __name__ == "__main__":
    print("=== PersonalOS - Rutas Configuradas ===")
    print(f"Validando entorno: PERSONAL_OS_ROOT={os.environ.get('PERSONAL_OS_ROOT')}")
    print(f"ROOT_DIR: {ROOT_DIR}")
    print()
    print("Rutas del Sistema:")
    print(f"  TASKS_DIR: {TASKS_DIR}")
    print(f"  EVALS_DIR: {EVALS_DIR}")
    print(f"  SERVER_DIR: {SERVER_DIR}")
    print(f"  MATRIX_DIR: {MATRIX_DIR}")
    print()
    print("Verificando existencia de directorios...")
    for name, dir_path in [
        ("ROOT", ROOT_DIR),
        ("TASKS", TASKS_DIR),
        ("EVALS", EVALS_DIR),
        ("SERVER", SERVER_DIR),
        ("MATRIX", MATRIX_DIR),
    ]:
        status_str = "[OK]" if dir_path.exists() else "[FAIL]"
        print(f"  {status_str} {name}: {dir_path}")


# =============================================================================
# SCRIPT LOCATOR v1.0 - get_skill_script()
# Resuelve dinámicamente rutas de scripts en skills
# =============================================================================

SCRIPT_LOCATION_MAP = {
    # === v6.2 AUDITORS Y VALIDATORS ===
    # directorio — get_skill_script agrega el nombre del script al final
    "33_Parallel_Audit_Pro.py": ENGINE_DIR / "03_Validator",
    "34_Skill_Auditor.py": ENGINE_DIR / "03_Validator",
    "37_Linter_Autofix.py": ENGINE_DIR / "03_Validator",
    "40_Validate_Rules.py": ENGINE_DIR / "03_Validator",
    "80_Edge_Case_Validator.py": ENGINE_DIR / "03_Validator",
    "skill_validator.py": ENGINE_DIR / "03_Validator",
    "skill_security_scan.py": ENGINE_DIR / "03_Validator",
    # HUBS
    "01_Auditor_Hub.py": ENGINE_DIR / "01_Auditor_Hub.py",
    "05_Validator_Hub.py": ENGINE_DIR / "05_Validator_Hub.py",
    # Batch 3: Workflows
    "01_Spider_Brainstorm.py": SKILLS_DIR / "00_Compound_Engineering" / "scripts",
    "02_Professor_X_Plan.py": SKILLS_DIR / "05_Workflows" / "01_Agent_Teams_Lite" / "scripts",
    # Batch 1: Auditor (en ENGINE_DIR/03_Validator - ubicación real)
    # === Workflow Scripts ===
    "08_Ritual_Cierre.py": ENGINE_DIR / "10_Legacy",
    "14_Morning_Standup.py": ENGINE_DIR / "10_Legacy",
    "15_Weekly_Review.py": ENGINE_DIR / "10_Legacy",
    "09_Backlog_Triage.py": ENGINE_DIR / "10_Legacy",
    "11_Sync_Notes.py": ENGINE_DIR / "10_Legacy",
    "16_Clean_System.py": ENGINE_DIR / "10_Legacy",
    "00_Notifier.py": ENGINE_DIR / "10_Legacy",
    "17_Ritual_Dominical.py": ENGINE_DIR / "10_Legacy",
    # === Compound Engineering Scripts ===
    "06_AntMan_Lfg_Lite.py": ENGINE_DIR / "10_Legacy",
    "18_Generacion_Contenido.py": ENGINE_DIR / "10_Legacy",
    "19_Generate_Progress.py": ENGINE_DIR / "10_Legacy",
    # === v6.2 Legacy Scripts (10_Legacy) ===
    "10_AI_Task_Planner.py": ENGINE_DIR / "10_Legacy",
    "12_Update_Links.py": ENGINE_DIR / "10_Legacy",
    "50_System_Health_Monitor.py": ENGINE_DIR / "50_System_Health_Monitor.py",
    # === Avengers Workflow Scripts ===
    "03_Thor_Work.py": ENGINE_DIR / "10_Legacy",
    "04_Vision_Review.py": ENGINE_DIR / "10_Legacy",
    "05_Hulk_Compound.py": ENGINE_DIR / "10_Legacy",
    # === Others ===
    "56_Organize_Solutions.py": ENGINE_DIR / "10_Legacy",
    "87_Iron_Man_Gen.py": ENGINE_DIR / "13_Auditors_Os" / "scripts",
    # === Batch 4: Utilities (13_Auditors_Os) ===
    "13_Beautify_Tables.py": ENGINE_DIR / "13_Auditors_Os" / "scripts",
    "14_Beauty_Doc.py": ENGINE_DIR / "13_Auditors_Os" / "scripts",
    "15_SOTA_Integrity_Check.py": ENGINE_DIR / "13_Auditors_Os" / "scripts",
    "16_Carousel_Engine.py": ENGINE_DIR / "13_Auditors_Os" / "scripts",
    "12_Context_Usage_Bar.py": ENGINE_DIR / "13_Auditors_Os" / "scripts",
    # === Scripts migrados a skills/scripts/ ===
    "39_Repair_Corruption.py": SKILLS_DIR / "06_Tools" / "21_System_Master",
    "62_Tool_Shed.py": SKILLS_DIR / "06_Tools" / "04_DevOps" / "scripts",
    # === Scripts Medio Valor → 14_Otros ===
    "60_Fast_Vision.py": ENGINE_DIR / "14_Otros" / "60_Fast_Vision.py",
    "61_MCP_Health_Check.py": ENGINE_DIR / "14_Otros" / "61_MCP_Health_Check.py",
    "63_Skill_Harmonizer.py": ENGINE_DIR / "14_Otros" / "63_Skill_Harmonizer.py",
}


def get_skill_script(script_name):
    """Resuelve la ruta de un script en su skill destino.
    
    Uso:
        from config_paths import get_skill_script
        script_path = get_skill_script("01_Spider_Brainstorm.py")
    
    Retorna: Path al script o None si no se encuentra
    """
    # Edge case: empty or invalid name
    if not script_name or not script_name.strip() or not script_name.endswith(".py"):
        return None

    if script_name in SCRIPT_LOCATION_MAP:
        script_dir = SCRIPT_LOCATION_MAP[script_name]
        # Si es archivo directo, usar ese; si es directorio, agregar script_name
        if script_dir.is_file():
            script_path = script_dir
        else:
            script_path = script_dir / script_name
        if script_path.exists():
            return script_path

    # Fallback: buscar en ubicaciones legacy + 14_Otros
    legacy_paths = [
        ENGINE_DIR / "14_Otros" / script_name,
        ENGINE_DIR / "04_Workflow" / script_name,
        ENGINE_DIR / "06_Auditor" / script_name,
        ENGINE_DIR / "01_Ritual" / script_name,
        ENGINE_DIR / "02_Tool" / script_name,
        ENGINE_DIR / ".backup" / "10_Legacy_backup_20260420" / script_name,
    ]
    for legacy_path in legacy_paths:
        if legacy_path.exists():
            return legacy_path

    # Fallback: buscar en skills folders directamente
    for skill_dir in SKILLS_DIR.iterdir():
        if skill_dir.is_dir():
            scripts_dir = skill_dir / "scripts"
            if scripts_dir.exists():
                script_path = scripts_dir / script_name
                if script_path.exists():
                    return script_path

    return None
