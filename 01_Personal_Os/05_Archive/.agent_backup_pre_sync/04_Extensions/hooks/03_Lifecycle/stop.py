import sys
from pathlib import Path

if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

_ext_root = Path(__file__).parent.parent.parent

_log_to_json = None
try:
    import importlib.util
    _common_path = _ext_root / "02_Utils" / "common.py"
    if _common_path.exists():
        _spec = importlib.util.spec_from_file_location("_common", _common_path)
        _common = importlib.util.module_from_spec(_spec)
        _spec.loader.exec_module(_common)
        _log_to_json = _common.log_to_json
except Exception:
    pass


def beep():
    try:
        import winsound
        winsound.Beep(600, 200)
    except Exception:
        pass


def main():
    beep()
    if _log_to_json:
        _log_to_json("stop", {"event": "stop"})


if __name__ == "__main__":
    main()
