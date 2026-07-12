#!/usr/bin/env python3
"""
pre_tool_use.py — Pre-Tool Use Hook (PersonalOS v2.0)

Checks before every LLM tool invocation:
  1. Battery level (Windows only) — blocks if < 15 %
  2. Destructive commands (rm -rf) — blocked
  3. .env file access — blocked
  4. Multi-agent support (Claude Code, OpenCode, Codex)

Exit codes:
    0 — allow
    1 — block
"""

import argparse
import io
import os
import subprocess
import sys
from pathlib import Path

if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

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


def speak(msg: str, priority: str = "normal") -> None:
    if _speak:
        _speak(msg, priority)
    else:
        print(msg)


def log_to_json(event: str, data: dict) -> None:
    if _log_to_json:
        _log_to_json(event, data)
    else:
        print(f"[LOG] {event}: {data}")


def check_battery() -> tuple[bool, int]:
    """Check battery level via PowerShell (CIM-compatible, PS 5+ / 7+).

    Returns (ok, level_percent). ok=False if battery < 15%.
    """
    if sys.platform != "win32":
        return True, 100

    try:
        # PowerShell 7+ uses Get-CimInstance; PS 5 falls back to Get-WmiObject
        ps_command = (
            "Get-CimInstance -ClassName Win32_Battery "
            "| Select-Object -ExpandProperty EstimatedChargeRemaining"
        )
        result = subprocess.run(
            ["powershell.exe", "-NoProfile", "-Command", ps_command],
            capture_output=True, text=True, timeout=8,
        )
        stdout = result.stdout.strip()

        # If Get-CimInstance failed (e.g. no CIM session), fall back to WMI
        if not stdout:
            ps_command_fallback = (
                "Get-WmiObject -Class Win32_Battery "
                "| Select-Object -ExpandProperty EstimatedChargeRemaining"
            )
            result = subprocess.run(
                ["powershell.exe", "-NoProfile", "-Command", ps_command_fallback],
                capture_output=True, text=True, timeout=8,
            )
            stdout = result.stdout.strip()

        if stdout:
            battery_level = int(stdout)
            if battery_level < 15:
                print(f"[WARN] Battery low: {battery_level}%")
                return False, battery_level
            return True, battery_level

        # No battery output = desktop / no battery
        print("[INFO] No battery detected")
        return True, 100
    except subprocess.TimeoutExpired:
        print("[INFO] Battery check timed out")
    except FileNotFoundError:
        print("[INFO] powershell.exe not found — skipping battery check")
    except (ValueError, OSError) as e:
        print(f"[INFO] Battery check skipped: {e}")
    return True, 100


def get_tool_input() -> str:
    """Read tool input from any supported agent environment variable."""
    for var in ("CLAUDE_TOOL_INPUT", "OPENCODE_TOOL_INPUT", "CODEX_TOOL_INPUT"):
        value = os.environ.get(var, "")
        if value:
            return value.lower()
    return os.environ.get("TOOL_INPUT", "").lower()


def main() -> int:
    parser = argparse.ArgumentParser(description="PersonalOS Pre-Tool Use Hook")
    parser.add_argument("--check", action="store_true", help="Run battery check only")
    args = parser.parse_args()

    print("[HOOK] Pre-Tool Use")

    # Battery check
    if os.environ.get("BYPASS_BATTERY_CHECK") != "1":
        bat_ok, level = check_battery()
        if not bat_ok:
            msg = f"Operation cancelled — battery low: {level}%"
            print(f"[ERR] {msg}")
            speak(msg)
            log_to_json("pre_tool_use", {"action": "cancel", "reason": "low_battery", "level": level})
            return 1

    if args.check:
        print("[OK] Battery check passed")
        return 0

    tool_input = get_tool_input()

    # Block destructive commands
    if "rm -rf" in tool_input:
        msg = "Destructive command 'rm -rf' blocked"
        print(f"[BLOCK] {msg}")
        log_to_json("pre_tool_use", {"action": "block", "command": tool_input, "reason": "destructive"})
        return 1

    # Protect .env files
    if ".env" in tool_input:
        msg = ".env file access blocked"
        print(f"[BLOCK] {msg}")
        log_to_json("pre_tool_use", {"action": "block", "command": tool_input, "reason": "security_file"})
        return 1

    log_to_json("pre_tool_use", {"action": "allow", "command": tool_input})
    print("[OK] Pre-tool check passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
