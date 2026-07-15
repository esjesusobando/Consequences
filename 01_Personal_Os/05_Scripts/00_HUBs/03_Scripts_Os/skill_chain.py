#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
skill_chain.py - Skill Chain Engine for PersonalOS v5.0
========================================================
Executes a sequence of skills defined in YAML chain definitions.
Each step runs as a subprocess, with state persistence for resumability.

Architecture:
    User: "Crear propuesta para cliente X"
        -> skill_chain.py
        -> Parse chain definition (YAML)
        -> Step 1: market-proposal -> output.json
        -> Step 2: humanizador -> output_humanized.json
        -> Step 3: verificador-datos -> output_verified.json
        -> Step 4: deploy -> proposal_url
        -> Returns: {chain_id, steps_completed, output_url, duration}

Usage:
    python skill_chain.py run proposal_chain --client "Spotify" --context "retention sprint"
    python skill_chain.py run content_chain --topic "AI trends"
    python skill_chain.py list
    python skill_chain.py validate proposal_chain
    python skill_chain.py --test
    python skill_chain.py --verify-cycle

Ubication: 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/
"""

import sys
import os
import io
import json
import time
import uuid
import yaml
import shutil
import logging
import hashlib
import argparse
import subprocess
from pathlib import Path
from datetime import datetime, timezone
from typing import Any, Optional

sys.path.insert(0, str(Path(__file__).parent))
from config_paths import ROOT_DIR, TELEMETRY_DIR, CACHE_DIR


# =============================================================================
# WINDOWS UTF-8 FIX
# =============================================================================


def _fix_encoding():
    """Fix Windows console encoding (call only in __main__)."""
    if sys.platform == "win32":
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8")


# =============================================================================
# LOGGING
# =============================================================================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("skill_chain")


# =============================================================================
# PATHS
# =============================================================================

CHAIN_DEFS_DIR = (
    ROOT_DIR
    / "01_Personal_Os"
    / "00_Core"
    / "02_Tools"
    / "02_Skills"
    / "00_System_Core"
    / "05_Skill_Chains"
)
CHAIN_STATE_DIR = CACHE_DIR / "chain_states"
CHAIN_OUTPUT_DIR = CACHE_DIR / "chain_outputs"


# =============================================================================
# SAFE JSON WRITE (atomic)
# =============================================================================


def safe_json_write(data: Any, path: Path) -> None:
    """Atomic JSON write -- writes to temp file then renames."""
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = path.with_suffix(".tmp")
    try:
        with open(tmp_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write("\n")
        tmp_path.replace(path)
    except OSError as e:
        logger.error("Failed to write %s: %s", path, e)
        raise


def safe_json_read(path: Path) -> Optional[dict]:
    """Read JSON file safely, returning None on failure."""
    if not path.exists():
        return None
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError) as e:
        logger.error("Failed to read %s: %s", path, e)
        return None


# =============================================================================
# CHAIN DEFINITION PARSER
# =============================================================================


def load_chain(chain_name: str) -> Optional[dict]:
    """Load a chain definition YAML file by name (without .yaml extension)."""
    yaml_path = CHAIN_DEFS_DIR / f"{chain_name}.yaml"
    if not yaml_path.exists():
        logger.error("Chain definition not found: %s", yaml_path)
        return None
    try:
        with open(yaml_path, "r", encoding="utf-8") as f:
            chain_def = yaml.safe_load(f)
        if not isinstance(chain_def, dict):
            logger.error("Invalid chain definition format in %s", yaml_path)
            return None
        required_keys = ["name", "steps"]
        for key in required_keys:
            if key not in chain_def:
                logger.error("Missing required key '%s' in %s", key, yaml_path)
                return None
        if not isinstance(chain_def["steps"], list) or len(chain_def["steps"]) == 0:
            logger.error("Chain must have at least one step: %s", yaml_path)
            return None
        for i, step in enumerate(chain_def["steps"]):
            if "name" not in step:
                logger.error("Step %d missing 'name' in %s", i, yaml_path)
                return None
            if "command" not in step:
                logger.error("Step %d missing 'command' in %s", i, yaml_path)
                return None
        return chain_def
    except yaml.YAMLError as e:
        logger.error("YAML parse error in %s: %s", yaml_path, e)
        return None


def list_chains() -> list[dict]:
    """List all available chain definitions."""
    chains = []
    if not CHAIN_DEFS_DIR.exists():
        return chains
    for yaml_file in sorted(CHAIN_DEFS_DIR.glob("*.yaml")):
        chain = load_chain(yaml_file.stem)
        if chain:
            chains.append({
                "file": yaml_file.name,
                "name": chain.get("name", yaml_file.stem),
                "description": chain.get("description", ""),
                "trigger": chain.get("trigger", ""),
                "steps": len(chain.get("steps", [])),
            })
    return chains


# =============================================================================
# CHAIN STATE MANAGEMENT
# =============================================================================


def _make_chain_id(chain_name: str) -> str:
    """Generate a unique chain execution ID."""
    ts = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    short_hash = hashlib.md5(uuid.uuid4().bytes).hexdigest()[:7]
    return f"{chain_name}_{ts}_{short_hash}"


def _state_file(chain_id: str) -> Path:
    """Path to the state file for a chain execution."""
    return CHAIN_STATE_DIR / f"chain_state_{chain_id}.json"


def init_state(chain_id: str, chain_name: str, chain_def: dict) -> dict:
    """Initialize a new chain execution state."""
    steps = []
    for step_def in chain_def.get("steps", []):
        steps.append({
            "name": step_def["name"],
            "command": step_def.get("command", ""),
            "required": step_def.get("required", True),
            "timeout": step_def.get("timeout", chain_def.get("timeout_per_step", 60)),
            "status": "pending",
            "output": None,
            "duration_sec": None,
            "error": None,
            "retries": 0,
        })
    state = {
        "chain_id": chain_id,
        "chain_name": chain_name,
        "status": "running",
        "current_step": 0,
        "total_steps": len(steps),
        "steps": steps,
        "start_time": datetime.now(timezone.utc).isoformat(),
        "end_time": None,
        "error": None,
        "context": {},
    }
    safe_json_write(state, _state_file(chain_id))
    return state


def save_state(state: dict) -> None:
    """Persist chain state to disk (atomic write)."""
    safe_json_write(state, _state_file(state["chain_id"]))


def load_state(chain_id: str) -> Optional[dict]:
    """Load chain state from disk."""
    return safe_json_read(_state_file(chain_id))


def find_resumable_state(chain_name: str) -> Optional[dict]:
    """Find the latest incomplete state for a given chain name."""
    if not CHAIN_STATE_DIR.exists():
        return None
    candidates = []
    for state_file in CHAIN_STATE_DIR.glob(f"chain_state_{chain_name}_*.json"):
        state = safe_json_read(state_file)
        if state and state.get("status") in ("running", "paused"):
            candidates.append(state)
    if not candidates:
        return None
    candidates.sort(key=lambda s: s.get("start_time", ""), reverse=True)
    return candidates[0]


# =============================================================================
# VARIABLE RESOLUTION
# =============================================================================


def resolve_variables(
    command: str, variables: dict, prev_output: Optional[str] = None
) -> str:
    """Replace {variable} placeholders in a command string."""
    resolved = command
    if prev_output:
        resolved = resolved.replace("{prev_output}", prev_output)
    for key, value in variables.items():
        placeholder = "{" + key + "}"
        resolved = resolved.replace(placeholder, str(value))
    unresolved = [
        token[1:-1]
        for token in resolved.split()
        if token.startswith("{") and token.endswith("}") and token != "{prev_output}"
    ]
    if unresolved:
        logger.warning("Unresolved variables in command: %s", unresolved)
    return resolved


# =============================================================================
# STEP EXECUTION
# =============================================================================


def execute_step(
    step: dict,
    variables: dict,
    prev_output: Optional[str] = None,
    dry_run: bool = False,
    verbose: bool = False,
    eval_output: bool = False,
) -> dict:
    """
    Execute a single chain step via subprocess.

    Returns:
        dict with keys: status, output, duration_sec, error
    """
    command = resolve_variables(step["command"], variables, prev_output)
    timeout = step.get("timeout", 60)

    logger.info("  [STEP] %s: %s", step["name"], command)

    if dry_run:
        logger.info("  [DRY-RUN] Would execute: %s", command)
        return {
            "status": "completed",
            "output": None,
            "duration_sec": 0,
            "error": None,
        }

    start = time.monotonic()
    try:
        result = subprocess.run(
            command,
            shell=True,
            capture_output=True,
            text=True,
            timeout=timeout,
            encoding="utf-8",
            errors="replace",
            cwd=str(ENGINE_DIR),
        )
        duration = round(time.monotonic() - start, 2)

        if result.returncode == 0:
            stdout = result.stdout.strip()
            # Try to extract output file path from stdout
            output_path = _extract_output_from_stdout(stdout)
            if verbose and stdout:
                for line in stdout.split("\n"):
                    logger.info("    %s", line)

            # Evaluate output quality if --eval is enabled
            step_result = {
                "status": "completed",
                "output": output_path,
                "duration_sec": duration,
                "error": None,
            }
            if eval_output and stdout:
                try:
                    from output_eval import OutputEvaluator
                    evaluator = OutputEvaluator(eval_type="content")
                    eval_result = evaluator.evaluate(stdout)
                    step_result["eval"] = eval_result
                    if eval_result["score"] < 70:
                        logger.warning(
                            "Step %s score %d/100 — suggestions: %s",
                            step["name"], eval_result["score"],
                            [s["text"] for s in eval_result["suggestions"][:3]],
                        )
                except Exception as e:
                    logger.warning("Eval failed for step %s: %s", step["name"], e)

            return step_result
        else:
            stderr = result.stderr.strip() if result.stderr else ""
            stdout = result.stdout.strip() if result.stdout else ""
            error_msg = stderr or stdout or f"Exit code {result.returncode}"
            logger.error(
                "  [FAIL] %s failed (exit %d): %s",
                step["name"],
                result.returncode,
                error_msg[:200],
            )
            return {
                "status": "failed",
                "output": None,
                "duration_sec": duration,
                "error": error_msg[:500],
            }
    except subprocess.TimeoutExpired:
        duration = round(time.monotonic() - start, 2)
        logger.error("  [TIMEOUT] %s exceeded %ds", step["name"], timeout)
        return {
            "status": "timeout",
            "output": None,
            "duration_sec": duration,
            "error": f"Step timed out after {timeout}s",
        }
    except Exception as e:
        duration = round(time.monotonic() - start, 2)
        logger.error("  [ERROR] %s: %s", step["name"], str(e))
        return {
            "status": "error",
            "output": None,
            "duration_sec": duration,
            "error": str(e),
        }


def _extract_output_from_stdout(stdout: str) -> Optional[str]:
    """Try to extract an output file path from step stdout."""
    if not stdout:
        return None
    for line in reversed(stdout.strip().split("\n")):
        line = line.strip()
        # Check for common output patterns
        if line.endswith(".json") or line.endswith(".md") or line.endswith(".html"):
            if os.path.exists(line) or "/" in line or "\\" in line:
                return line
        if "output:" in line.lower():
            parts = line.split(":", 1)
            if len(parts) > 1:
                candidate = parts[1].strip().strip('"').strip("'")
                if candidate:
                    return candidate
    return None


# =============================================================================
# CHAIN EXECUTION ENGINE
# =============================================================================


def run_chain(
    chain_name: str,
    variables: dict,
    dry_run: bool = False,
    verbose: bool = False,
    resume: bool = False,
    eval_output: bool = False,
) -> dict:
    """
    Execute a full skill chain.

    Args:
        chain_name: Name of the chain definition (without .yaml)
        variables: Key-value pairs for variable substitution
        dry_run: If True, validate without executing
        verbose: If True, print detailed output
        resume: If True, attempt to resume from last state

    Returns:
        dict with chain execution result
    """
    # Load chain definition
    chain_def = load_chain(chain_name)
    if not chain_def:
        return {"error": f"Chain '{chain_name}' not found", "status": "failed"}

    # Resume or init
    state = None
    if resume:
        state = find_resumable_state(chain_name)
        if state:
            logger.info("[RESUME] Found resumable state: %s", state["chain_id"])
        else:
            logger.info("[RESUME] No resumable state found, starting fresh")

    if not state:
        chain_id = _make_chain_id(chain_name)
        state = init_state(chain_id, chain_name, chain_def)

    chain_id = state["chain_id"]
    prev_output = None

    logger.info(
        "=== CHAIN: %s [%s] — %d steps ===",
        chain_def.get("name", chain_name),
        chain_id,
        state["total_steps"],
    )

    # Ensure output dir exists
    CHAIN_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Execute steps
    for i, step in enumerate(state["steps"]):
        if step["status"] == "completed":
            logger.info(
                "  [SKIP] Step %d/%d: %s (already completed)",
                i + 1,
                state["total_steps"],
                step["name"],
            )
            prev_output = step.get("output") or prev_output
            continue

        if step["status"] in ("timeout", "failed", "error") and not step.get("required", True):
            logger.info(
                "  [SKIP] Step %d/%d: %s (non-required, previous failure)",
                i + 1,
                state["total_steps"],
                step["name"],
            )
            step["status"] = "skipped"
            save_state(state)
            continue

        logger.info(
            "  [RUN] Step %d/%d: %s",
            i + 1,
            state["total_steps"],
            step["name"],
        )
        state["current_step"] = i
        step["status"] = "running"
        save_state(state)

        result = execute_step(step, variables, prev_output, dry_run, verbose, eval_output)

        step["status"] = result["status"]
        step["output"] = result["output"]
        step["duration_sec"] = result["duration_sec"]
        step["error"] = result["error"]

        if result["output"]:
            prev_output = result["output"]

        save_state(state)

        # Handle failures
        if result["status"] in ("failed", "timeout", "error"):
            if step.get("required", True):
                state["status"] = "failed"
                state["error"] = f"Required step '{step['name']}' failed: {result['error']}"
                state["end_time"] = datetime.now(timezone.utc).isoformat()
                save_state(state)
                logger.error(
                    "[ABORT] Chain failed at step %d/%d: %s",
                    i + 1,
                    state["total_steps"],
                    step["name"],
                )
                return _build_result(state)
            else:
                logger.warning(
                    "  [WARN] Non-required step failed, continuing: %s",
                    step["name"],
                )
                step["status"] = "skipped"

    # All steps done
    completed_count = sum(
        1 for s in state["steps"] if s["status"] in ("completed", "skipped")
    )
    state["status"] = "completed" if completed_count == state["total_steps"] else "completed_with_skips"
    state["current_step"] = state["total_steps"]
    state["end_time"] = datetime.now(timezone.utc).isoformat()
    save_state(state)

    logger.info(
        "=== CHAIN COMPLETE: %s — %d/%d steps ===",
        chain_id,
        completed_count,
        state["total_steps"],
    )

    return _build_result(state)


def _build_result(state: dict) -> dict:
    """Build a clean result dict from chain state."""
    completed = sum(
        1 for s in state["steps"] if s["status"] in ("completed", "skipped")
    )
    total_duration = sum(
        s.get("duration_sec", 0) or 0 for s in state["steps"]
    )
    last_output = None
    for s in reversed(state["steps"]):
        if s.get("output"):
            last_output = s["output"]
            break

    return {
        "chain_id": state["chain_id"],
        "chain_name": state["chain_name"],
        "status": state["status"],
        "steps_completed": completed,
        "total_steps": state["total_steps"],
        "output": last_output,
        "duration_sec": round(total_duration, 2),
        "error": state.get("error"),
        "start_time": state.get("start_time"),
        "end_time": state.get("end_time"),
        "steps": [
            {
                "name": s["name"],
                "status": s["status"],
                "output": s.get("output"),
                "duration_sec": s.get("duration_sec"),
                "error": s.get("error"),
            }
            for s in state["steps"]
        ],
    }


# =============================================================================
# VALIDATE (dry-run)
# =============================================================================


def validate_chain(chain_name: str, verbose: bool = False) -> dict:
    """Validate a chain definition without executing it."""
    chain_def = load_chain(chain_name)
    if not chain_def:
        return {"valid": False, "error": f"Chain '{chain_name}' not found"}

    issues = []
    steps = chain_def.get("steps", [])

    for i, step in enumerate(steps):
        step_name = step.get("name", f"step_{i}")
        command = step.get("command", "")

        # Check for {variables} — these are runtime-injected via CLI args,
        # so we only flag variables that look malformed (e.g. nested braces).
        import re
        bad_vars = re.findall(r"\{[^}]*\{", command)
        if bad_vars:
            issues.append(
                f"Step '{step_name}' has malformed variables: {bad_vars}"
            )

        timeout = step.get("timeout", chain_def.get("timeout_per_step", 60))
        if timeout <= 0:
            issues.append(f"Step '{step_name}' has invalid timeout: {timeout}")

        if verbose:
            logger.info("  [VALIDATE] Step %d: %s — timeout=%ds, required=%s",
                        i + 1, step_name, timeout, step.get("required", True))

    return {
        "valid": len(issues) == 0,
        "chain": chain_def.get("name"),
        "steps": len(steps),
        "issues": issues,
    }


# =============================================================================
# VERIFY CYCLE (smoke test)
# =============================================================================


def verify_cycle() -> dict:
    """Full verification cycle: load all chains, validate, report."""
    results = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "chains_found": 0,
        "chains_valid": 0,
        "chains_invalid": 0,
        "details": [],
    }

    chains = list_chains()
    results["chains_found"] = len(chains)

    for chain_info in chains:
        chain_name = Path(chain_info["file"]).stem
        validation = validate_chain(chain_name, verbose=False)
        detail = {
            "name": chain_name,
            "file": chain_info["file"],
            "steps": chain_info["steps"],
            "valid": validation.get("valid", False),
            "issues": validation.get("issues", []),
        }
        results["details"].append(detail)
        if validation.get("valid"):
            results["chains_valid"] += 1
        else:
            results["chains_invalid"] += 1

    results["status"] = "pass" if results["chains_invalid"] == 0 else "fail"
    return results


# =============================================================================
# SMOKE TEST
# =============================================================================


def run_smoke_test() -> dict:
    """Run smoke tests to verify the engine works end-to-end."""
    logger.info("=== SMOKE TEST ===")
    results = {"tests": [], "passed": 0, "failed": 0}

    # Test 1: List chains
    try:
        chains = list_chains()
        ok = len(chains) >= 4
        results["tests"].append({
            "name": "list_chains",
            "passed": ok,
            "detail": f"Found {len(chains)} chains",
        })
        if ok:
            results["passed"] += 1
        else:
            results["failed"] += 1
    except Exception as e:
        results["tests"].append({"name": "list_chains", "passed": False, "detail": str(e)})
        results["failed"] += 1

    # Test 2: Load each chain
    for chain_info in chains:
        name = Path(chain_info["file"]).stem
        try:
            chain_def = load_chain(name)
            ok = chain_def is not None and "steps" in chain_def
            results["tests"].append({
                "name": f"load_chain:{name}",
                "passed": ok,
                "detail": f"{chain_def['steps'] if chain_def else 0} steps",
            })
            if ok:
                results["passed"] += 1
            else:
                results["failed"] += 1
        except Exception as e:
            results["tests"].append({
                "name": f"load_chain:{name}",
                "passed": False,
                "detail": str(e),
            })
            results["failed"] += 1

    # Test 3: Validate chains
    for chain_info in chains:
        name = Path(chain_info["file"]).stem
        try:
            validation = validate_chain(name)
            results["tests"].append({
                "name": f"validate:{name}",
                "passed": validation.get("valid", False),
                "detail": validation.get("issues", []),
            })
            if validation.get("valid"):
                results["passed"] += 1
            else:
                results["failed"] += 1
        except Exception as e:
            results["tests"].append({
                "name": f"validate:{name}",
                "passed": False,
                "detail": str(e),
            })
            results["failed"] += 1

    # Test 4: Init + save + load state
    try:
        test_chain = chains[0] if chains else None
        if test_chain:
            chain_name = Path(test_chain["file"]).stem
            chain_def = load_chain(chain_name)
            chain_id = _make_chain_id(chain_name)
            state = init_state(chain_id, chain_name, chain_def)
            loaded = load_state(chain_id)
            ok = loaded is not None and loaded["chain_id"] == chain_id
            results["tests"].append({
                "name": "state_persistence",
                "passed": ok,
                "detail": f"chain_id={chain_id}",
            })
            if ok:
                results["passed"] += 1
            else:
                results["failed"] += 1
            # Cleanup
            sf = _state_file(chain_id)
            if sf.exists():
                sf.unlink()
        else:
            results["tests"].append({
                "name": "state_persistence",
                "passed": False,
                "detail": "No chains found to test",
            })
            results["failed"] += 1
    except Exception as e:
        results["tests"].append({
            "name": "state_persistence",
            "passed": False,
            "detail": str(e),
        })
        results["failed"] += 1

    # Test 5: Variable resolution
    try:
        cmd = "tool --client {client} --input {prev_output}"
        resolved = resolve_variables(cmd, {"client": "TestCorp"}, "prev.json")
        ok = "TestCorp" in resolved and "prev.json" in resolved
        results["tests"].append({
            "name": "variable_resolution",
            "passed": ok,
            "detail": resolved,
        })
        if ok:
            results["passed"] += 1
        else:
            results["failed"] += 1
    except Exception as e:
        results["tests"].append({
            "name": "variable_resolution",
            "passed": False,
            "detail": str(e),
        })
        results["failed"] += 1

    # Test 6: Dry-run execution
    try:
        if chains:
            chain_name = Path(chains[0]["file"]).stem
            result = run_chain(chain_name, {"client": "Test"}, dry_run=True)
            ok = result.get("status", "").startswith("completed")
            results["tests"].append({
                "name": "dry_run",
                "passed": ok,
                "detail": result.get("status"),
            })
            if ok:
                results["passed"] += 1
            else:
                results["failed"] += 1
        else:
            results["tests"].append({"name": "dry_run", "passed": False, "detail": "No chains"})
            results["failed"] += 1
    except Exception as e:
        results["tests"].append({"name": "dry_run", "passed": False, "detail": str(e)})
        results["failed"] += 1

    # Test 7: Load invalid chain
    try:
        result = load_chain("nonexistent_chain_xyz")
        ok = result is None
        results["tests"].append({
            "name": "load_invalid_chain",
            "passed": ok,
            "detail": "Returns None for missing chain",
        })
        if ok:
            results["passed"] += 1
        else:
            results["failed"] += 1
    except Exception as e:
        results["tests"].append({
            "name": "load_invalid_chain",
            "passed": False,
            "detail": str(e),
        })
        results["failed"] += 1

    # Test 8: Verify cycle
    try:
        vr = verify_cycle()
        ok = vr.get("chains_found", 0) >= 4
        results["tests"].append({
            "name": "verify_cycle",
            "passed": ok,
            "detail": f"{vr['chains_valid']}/{vr['chains_found']} valid",
        })
        if ok:
            results["passed"] += 1
        else:
            results["failed"] += 1
    except Exception as e:
        results["tests"].append({"name": "verify_cycle", "passed": False, "detail": str(e)})
        results["failed"] += 1

    # Test 9: safe_json_write + read roundtrip
    try:
        test_data = {"test": True, "nested": {"a": 1}}
        test_path = CHAIN_STATE_DIR / "_roundtrip_test.json"
        safe_json_write(test_data, test_path)
        loaded_data = safe_json_read(test_path)
        ok = loaded_data == test_data
        test_path.unlink(missing_ok=True)
        results["tests"].append({
            "name": "json_roundtrip",
            "passed": ok,
            "detail": "write + read match",
        })
        if ok:
            results["passed"] += 1
        else:
            results["failed"] += 1
    except Exception as e:
        results["tests"].append({"name": "json_roundtrip", "passed": False, "detail": str(e)})
        results["failed"] += 1

    # Test 10: Step execution with invalid command (dry-run = skip)
    try:
        bad_step = {"name": "bad", "command": "exit 1", "required": False, "timeout": 5}
        result = execute_step(bad_step, {}, dry_run=True)
        ok = result["status"] == "completed"  # dry-run always completes
        results["tests"].append({
            "name": "dry_run_skips_execution",
            "passed": ok,
            "detail": result["status"],
        })
        if ok:
            results["passed"] += 1
        else:
            results["failed"] += 1
    except Exception as e:
        results["tests"].append({
            "name": "dry_run_skips_execution",
            "passed": False,
            "detail": str(e),
        })
        results["failed"] += 1

    results["status"] = "pass" if results["failed"] == 0 else "fail"
    logger.info(
        "=== SMOKE TEST: %d/%d passed [%s] ===",
        results["passed"],
        results["passed"] + results["failed"],
        results["status"].upper(),
    )
    return results


# =============================================================================
# CLI
# =============================================================================


ENGINE_DIR = (
    ROOT_DIR
    / "01_Personal_Os"
    / "05_Scripts"
    / "00_HUBs"
    / "03_Scripts_Os"
)


def main():
    parser = argparse.ArgumentParser(
        description="Skill Chain Engine — execute multi-skill workflows automatically"
    )
    parser.add_argument(
        "--test", action="store_true", help="Run smoke tests"
    )
    parser.add_argument(
        "--verify-cycle", action="store_true", help="Validate all chain definitions"
    )
    parser.add_argument(
        "--verbose", "-v", action="store_true", help="Verbose output"
    )
    parser.add_argument(
        "--dry-run", action="store_true", help="Validate without executing"
    )
    parser.add_argument(
        "--eval", action="store_true", help="Evaluate step outputs with OutputEvaluator"
    )

    subparsers = parser.add_subparsers(dest="command")

    # run
    run_parser = subparsers.add_parser("run", help="Execute a skill chain")
    run_parser.add_argument("chain_name", help="Name of the chain to execute")
    run_parser.add_argument("--client", default="", help="Client name")
    run_parser.add_argument("--context", default="", help="Context description")
    run_parser.add_argument("--topic", default="", help="Topic for content chains")
    run_parser.add_argument("--platform", default="linkedin", help="Platform for content")
    run_parser.add_argument("--idea", default="", help="Idea for prototype chains")
    run_parser.add_argument("--brand", default="", help="Brand for prototype chains")
    run_parser.add_argument("--resume", action="store_true", help="Resume from last state")
    run_parser.add_argument("--output-json", action="store_true", help="Output result as JSON")

    # list
    subparsers.add_parser("list", help="List all available chains")

    # validate
    val_parser = subparsers.add_parser("validate", help="Validate a chain definition (dry-run)")
    val_parser.add_argument("chain_name", help="Name of the chain to validate")

    args = parser.parse_args()

    if sys.platform == "win32":
        _fix_encoding()

    if args.test:
        results = run_smoke_test()
        print(json.dumps(results, indent=2, ensure_ascii=False))
        sys.exit(0 if results["status"] == "pass" else 1)

    if args.verify_cycle:
        results = verify_cycle()
        print(json.dumps(results, indent=2, ensure_ascii=False))
        sys.exit(0 if results["status"] == "pass" else 1)

    if args.command == "list":
        chains = list_chains()
        if not chains:
            print("No chains found in:", CHAIN_DEFS_DIR)
            sys.exit(1)
        print(f"\nAvailable Skill Chains ({len(chains)}):\n")
        print(f"  {'Name':<25} {'Steps':<8} {'Trigger'}")
        print(f"  {'-'*25} {'-'*8} {'-'*40}")
        for c in chains:
            print(f"  {c['name']:<25} {c['steps']:<8} {c['trigger']}")
        print()
        sys.exit(0)

    if args.command == "validate":
        result = validate_chain(args.chain_name, verbose=args.verbose)
        print(json.dumps(result, indent=2, ensure_ascii=False))
        sys.exit(0 if result.get("valid") else 1)

    if args.command == "run":
        variables = {}
        if args.client:
            variables["client"] = args.client
        if args.context:
            variables["context"] = args.context
        if args.topic:
            variables["topic"] = args.topic
        if args.platform:
            variables["platform"] = args.platform
        if args.idea:
            variables["idea"] = args.idea
        if args.brand:
            variables["brand"] = args.brand

        result = run_chain(
            args.chain_name,
            variables,
            dry_run=args.dry_run,
            verbose=args.verbose,
            resume=args.resume,
            eval_output=args.eval,
        )

        if args.output_json or args.dry_run:
            print(json.dumps(result, indent=2, ensure_ascii=False))
        else:
            # Human-friendly output
            print()
            status_icon = {"completed": "OK", "failed": "FAIL", "completed_with_skips": "OK~"}
            icon = status_icon.get(result.get("status", ""), "??")
            print(f"[{icon}] Chain: {result.get('chain_name', 'unknown')}")
            print(f"     ID: {result.get('chain_id', 'unknown')}")
            print(f"     Status: {result.get('status', 'unknown')}")
            print(
                f"     Steps: {result.get('steps_completed', 0)}/{result.get('total_steps', 0)}"
            )
            if result.get("output"):
                print(f"     Output: {result['output']}")
            print(f"     Duration: {result.get('duration_sec', 0)}s")
            if result.get("error"):
                print(f"     Error: {result['error']}")
            print()

        sys.exit(0 if result.get("status", "").startswith("completed") else 1)

    parser.print_help()


if __name__ == "__main__":
    main()
