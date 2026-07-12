import os
import sys

# Forzar encoding UTF-8 para consola Windows
if sys.platform == "win32":
    import io

    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

from pathlib import Path
import sys

def _find_repo_root() -> Path:
    """Find repo root by walking up until sentinel '00_Winter_is_Coming' is found."""
    for parent in Path(__file__).resolve().parents:
        if (parent / "00_Winter_is_Coming").exists():
            return parent
    raise RuntimeError("Could not find repo root — sentinel '00_Winter_is_Coming' not found")


_ext_root = _find_repo_root() / "01_Personal_Os" / "00_Core" / "02_Tools"

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
except Exception as e:
    print(f"[WARN] Could not load common utilities: {e}")


def speak(msg, priority="normal"):
    if _speak:
        _speak(msg, priority)
    else:
        print(msg)


def log_to_json(event, data):
    if _log_to_json:
        _log_to_json(event, data)
    else:
        print(f"[LOG] {event}: {data}")


def main():
    print("--- SUBAGENT STOP HOOK ---")

    # We could get performance metrics or task name here if provided by Claude
    msg = "Subagente ha completado su tarea correctamente."
    print(msg)

    # Voice notification
    speak(msg)

    # Log to JSON
    log_to_json("subagent_stop", {"event": "subagent_stop", "status": "success"})


if __name__ == "__main__":
    main()
