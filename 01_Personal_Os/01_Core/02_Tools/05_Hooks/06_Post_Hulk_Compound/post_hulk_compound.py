import sys
import subprocess
from pathlib import Path

if sys.platform == "win32":
    import io

    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

_ext_root = Path(__file__).parent.parent.parent
project_root = _ext_root.parent.parent  # 05_Hooks/ → 02_Tools/ → 01_Core/ → 01_Personal_Os/ → Think_Different

_speak = None
_log_to_json = None

try:
    import importlib.util

    _common_path = _ext_root / "02_Utils" / "common.py"
    if _common_path.exists():
        _spec = importlib.util.spec_from_file_location("_common", _common_path)
        if _spec and _spec.loader:
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
    print("--- POST-HULK-COMPOUND HOOK ---")

    # Use skill script resolution
    sys.path.insert(0, str(project_root / "04_Operations" / "03_Scripts_Os"))
    try:
        from config_paths import get_skill_script
        organize_path = get_skill_script("56_Organize_Solutions.py")
    except ImportError:
        organize_path = None
    
    if not organize_path or not organize_path.exists():
        organize_path = project_root / "04_Operations" / "03_Scripts_Os" / "10_Legacy" / "56_Organize_Solutions.py"
    
    if not organize_path.exists():
        print("[!] 56_Organize_Solutions.py not found. Skipping.")
        return

    print("[*] Running solution organizer...")

    try:
        result = subprocess.run(
            [sys.executable, str(organize_path), "--apply"],
            cwd=str(project_root),
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
        )

        if result.returncode == 0:
            print("[+] Solution organization completed successfully.")
            speak("Solutions organizados correctamente", priority="low")
        else:
            print(f"[!] Organizer returned code: {result.returncode}")
            if result.stderr:
                print(f"    stderr: {result.stderr[:200]}")

    except Exception as e:
        print(f"[ERROR] Failed to run organizer: {e}")

    log_to_json("post_hulk_compound", {"status": "completed"})
    print("--- POST-HULK-COMPOUND DONE ---")


if __name__ == "__main__":
    main()
