"""
HUB_SOTA.py — SOTA Features Orchestrator
PersonalOS v4.9 — JARVIS Integration
Auto-discovered by System_Mapper_Hub.py

Usage:
    python HUB_SOTA.py --status           # Show all feature states
    python HUB_SOTA.py --run <feature>     # Run specific feature
    python HUB_SOTA.py --run all           # Run all enabled features
    python HUB_SOTA.py --toggle <feature>  # Toggle feature on/off
"""
import sys
import json
from pathlib import Path

SOTA_DIR = Path(__file__).parent
sys.path.insert(0, str(SOTA_DIR))

# ENGINE_DIR — para acceder a los hub scripts de Model Eval y Router
_ENGINE_DIR = Path(__file__).resolve().parent.parent.parent.parent / "05_Scripts" / "00_HUBs" / "03_Scripts_Os"
if _ENGINE_DIR.exists():
    sys.path.insert(0, str(_ENGINE_DIR))

# =============================================================================
# Config stub — si no existe config.py, usa defaults locales
# =============================================================================
try:
    from config import load_config, is_feature_enabled
except ImportError:
    def load_config():
        cfg = SOTA_DIR / "config.yaml"
        if cfg.exists():
            import yaml
            return yaml.safe_load(cfg.read_text()) or {}
        return {"sota_features": {}, "global": {"dry_run": False, "log_level": "INFO"}}
    def is_feature_enabled(name):
        cfg = load_config()
        return cfg.get("sota_features", {}).get(name, {}).get("enabled", False)

# =============================================================================
# SOTA Engine imports with graceful fallback
# =============================================================================
class _EngineStub:
    """Stub para SOTA engines no instalados."""
    def execute(self):
        return {"status": "unavailable", "reason": "Engine module not installed"}

def _try_import(module_path, class_name):
    try:
        mod = __import__(module_path, fromlist=[class_name])
        return getattr(mod, class_name)
    except (ImportError, AttributeError):
        return _EngineStub

FEATURE_ENGINES = {
    '01_contemplation_loop':  ("contemplation_loop.engine", "ContemplationLoopEngine"),
    '02_voice_profile':       ("voice_profile.engine", "VoiceProfileEngine"),
    '03_memory_versioning':   ("memory_versioning.engine", "MemoryVersioningEngine"),
    '04_feedback_loop':       ("feedback_loop.engine", "FeedbackLoopEngine"),
    '05_ambient_intelligence':("ambient_intelligence.engine", "AmbientIntelligenceEngine"),
}

FEATURES = {}
for key, (mod_path, cls_name) in FEATURE_ENGINES.items():
    engine_cls = _try_import(mod_path, cls_name)
    FEATURES[key] = engine_cls

# =============================================================================
# HUB Scripts — CLI-based features (ejecutados como subprocess)
# =============================================================================
HUB_SCRIPTS = {
    '06_model_eval_hub':    _ENGINE_DIR / "26_Model_Eval_Hub.py",
    '07_model_router_hub':  _ENGINE_DIR / "28_Model_Router_Hub.py",
    '08_drift_detector':    _ENGINE_DIR / "26_Model_Eval_Engine" / "drift_detector.py",
    '09_pareto_frontier':   _ENGINE_DIR / "26_Model_Eval_Engine" / "pareto_frontier.py",
    '10_calibration_loop':  _ENGINE_DIR / "26_Model_Eval_Engine" / "calibration_loop.py",
}

def _hub_is_available(name):
    """Check if a hub script exists."""
    path = HUB_SCRIPTS.get(name)
    return path is not None and path.exists()

def _run_hub_script(name, args=None):
    """Run a hub script via subprocess."""
    import subprocess
    script = HUB_SCRIPTS[name]
    cmd = [sys.executable, str(script)]
    if args:
        cmd.extend(args)
    result = subprocess.run(cmd, capture_output=True, text=True)
    print(result.stdout)
    if result.stderr:
        print(f"[STDERR] {result.stderr}")
    return {"status": "ok" if result.returncode == 0 else "error", "returncode": result.returncode}


def show_status():
    """Show status of all SOTA features and hub scripts."""
    config = load_config()
    print("\n" + "="*60)
    print("SOTA FEATURES STATUS — PersonalOS v5.0")
    print("="*60)
    print("\n  --- Engine Features ---")
    for feature_name in FEATURES.keys():
        enabled = is_feature_enabled(feature_name)
        status_icon = "[*]" if enabled else "[ ]"
        feature_config = config.get('sota_features', {}).get(feature_name, {})
        version = feature_config.get('version', 'unknown')
        print(f"  {status_icon} {feature_name:<25} v{version} {'[ENABLED]' if enabled else '[disabled]'}")

    print("\n  --- Hub Scripts ---")
    for hub_name in HUB_SCRIPTS:
        available = _hub_is_available(hub_name)
        icon = "[OK]" if available else "[--]"
        print(f"  {icon} {hub_name:<25}")

    print("="*60)
    global_config = config.get('global', {})
    print(f"\nGlobal: dry_run={global_config.get('dry_run', False)}, "
          f"log_level={global_config.get('log_level', 'INFO')}")
    print()


def run_feature(feature_name: str, extra_args: list[str] = None):
    """Run a specific feature or hub script."""
    # Hub scripts (no require config toggle)
    if feature_name in HUB_SCRIPTS:
        if not _hub_is_available(feature_name):
            print(f"[{feature_name}] script not found at {HUB_SCRIPTS[feature_name]}")
            return
        _run_hub_script(feature_name, extra_args)
        return

    # Engine features (require config toggle)
    if feature_name not in FEATURES:
        print(f"Unknown feature: {feature_name}")
        all_features = list(FEATURES.keys()) + list(HUB_SCRIPTS.keys())
        print(f"Available: {', '.join(all_features)}")
        return

    if not is_feature_enabled(feature_name):
        print(f"[{feature_name}] is disabled. Enable in config.yaml first.")
        return

    engine_class = FEATURES[feature_name]
    engine = engine_class()
    result = engine.execute()

    print(json.dumps(result, indent=2, default=str))


def run_all():
    """Run all enabled features and available hub scripts."""
    results = {}

    # Engine features
    for feature_name, engine_class in FEATURES.items():
        if not is_feature_enabled(feature_name):
            continue
        print(f"Running {feature_name}...")
        engine = engine_class()
        result = engine.execute()
        results[feature_name] = result

    # Hub scripts (status-only)
    for hub_name in HUB_SCRIPTS:
        if _hub_is_available(hub_name):
            print(f"Running {hub_name}...")
            result = _run_hub_script(hub_name, ["--status"])
            results[hub_name] = result

    print("\n" + "="*60)
    print("ALL FEATURES COMPLETED")
    print("="*60)
    for name, result in results.items():
        status = result.get('status', 'unknown')
        print(f"  {name}: {status}")


def toggle_feature(feature_name: str):
    """Toggle a feature's enabled status in config."""
    import yaml

    config_file = SOTA_DIR / "config.yaml"
    with open(config_file, 'r') as f:
        config = yaml.safe_load(f)

    current = config.get('sota_features', {}).get(feature_name, {}).get('enabled', False)
    config['sota_features'][feature_name]['enabled'] = not current

    with open(config_file, 'w') as f:
        yaml.dump(config, f, default_flow_style=False)

    print(f"[{feature_name}] {'ENABLED' if not current else 'DISABLED'}")


def main():
    if len(sys.argv) == 1:
        show_status()
        return

    cmd = sys.argv[1]

    if cmd == '--status':
        show_status()
    elif cmd == '--run':
        if len(sys.argv) < 3:
            print("Usage: --run <feature_name|all> [-- <hub_args...>]")
            return
        feature = sys.argv[2]
        if feature == 'all':
            run_all()
        else:
            extra_args = sys.argv[4:] if len(sys.argv) > 3 and sys.argv[3] == '--' else None
            run_feature(feature, extra_args)
    elif cmd == '--toggle':
        if len(sys.argv) < 3:
            print("Usage: --toggle <feature_name>")
            return
        toggle_feature(sys.argv[2])
    else:
        print(f"Unknown command: {cmd}")
        print("Usage: HUB_SOTA.py [--status|--run <feature>|--toggle <feature>]")


if __name__ == '__main__':
    main()