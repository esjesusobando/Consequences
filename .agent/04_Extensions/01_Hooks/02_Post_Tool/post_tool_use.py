import os
import sys
import subprocess
import shutil
from datetime import datetime
from pathlib import Path

if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

_ext_root = Path(__file__).parent.parent.parent
PROJECT_ROOT = _ext_root.parent.parent

BACKUP_EXTENSIONS = {".py", ".json", ".yaml", ".toml", ".md"}
BACKUP_MAX_MB = 1.0

_speak = None
_log_to_json = None

try:
    import importlib.util
    _common_path = _ext_root / "02_Utils" / "common.py"
    if _common_path.exists():
        _spec = importlib.util.spec_from_file_location("_common", _common_path)
        _common = importlib.util.module_from_spec(_spec)
        _spec.loader.exec_module(_common)
        _speak = _common.speak
        _log_to_json = _common.log_to_json
except Exception:
    pass


def speak(msg, priority="normal"):
    if _speak:
        _speak(msg, priority)


def log_to_json(event, data):
    if _log_to_json:
        _log_to_json(event, data)


def beep():
    try:
        import winsound
        winsound.Beep(800, 100)
    except Exception:
        pass


def create_backup(file_path):
    path = Path(file_path)
    if not path.exists():
        return
    if path.suffix not in BACKUP_EXTENSIONS:
        return
    if path.stat().st_size > BACKUP_MAX_MB * 1024 * 1024:
        return

    backup_dir = PROJECT_ROOT / ".claude" / "backups"
    backup_dir.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = backup_dir / f"{path.name}_{timestamp}.bak"
    shutil.copy(file_path, backup_path)


def run_linter(file_path):
    if file_path.endswith(".py"):
        try:
            subprocess.run(
                ["ruff", "check", "--fix", file_path],
                capture_output=True, text=True, timeout=10
            )
        except (FileNotFoundError, subprocess.TimeoutExpired):
            pass
    elif file_path.endswith((".js", ".ts", ".jsx", ".tsx")):
        try:
            subprocess.run(
                ["prettier", "--write", file_path],
                capture_output=True, text=True, timeout=10
            )
        except (FileNotFoundError, subprocess.TimeoutExpired):
            pass


def main():
    import json as _json
    tool_name = os.environ.get("CLAUDE_TOOL_NAME", "")
    tool_input_raw = os.environ.get("CLAUDE_TOOL_INPUT_JSON", "{}")
    try:
        tool_input = _json.loads(tool_input_raw)
    except _json.JSONDecodeError:
        tool_input = {}

    target_file = (
        tool_input.get("file_path") or
        tool_input.get("path") or
        tool_input.get("target_file") or
        ""
    )

    if target_file and os.path.exists(target_file):
        create_backup(target_file)
        run_linter(target_file)

    beep()
    log_to_json("post_tool_use", {"tool": tool_name, "target_file": target_file})


if __name__ == "__main__":
    main()
