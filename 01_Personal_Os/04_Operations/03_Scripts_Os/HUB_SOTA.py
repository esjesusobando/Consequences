#!/usr/bin/env python3
"""
HUB_SOTA.py — SOTA Features Orchestrator
PersonalOS v4.7 — JARVIS Integration
Auto-discovered by System_Mapper_Hub.py

Usage:
    python HUB_SOTA.py --status           # Show all feature states
    python HUB_SOTA.py --run <feature>     # Run specific feature
    python HUB_SOTA.py --run all           # Run all enabled features
    python HUB_SOTA.py --toggle <feature>  # Toggle feature on/off
"""
import sys
import json
import yaml
from pathlib import Path

# Add to path for imports
SOTA_DIR = Path(__file__).parent
SOTA_FEATURES_DIR = SOTA_DIR.parent / "06_SOTA_Features"
sys.path.insert(0, str(SOTA_DIR))
sys.path.insert(0, str(SOTA_FEATURES_DIR))

from config import load_config, is_feature_enabled
from contemplation_loop.engine import ContemplationLoopEngine
from voice_profile.engine import VoiceProfileEngine
from memory_versioning.engine import MemoryVersioningEngine
from feedback_loop.engine import FeedbackLoopEngine
from ambient_intelligence.engine import AmbientIntelligenceEngine


FEATURES = {
    '01_contemplation_loop': ContemplationLoopEngine,
    '02_voice_profile': VoiceProfileEngine,
    '03_memory_versioning': MemoryVersioningEngine,
    '04_feedback_loop': FeedbackLoopEngine,
    '05_ambient_intelligence': AmbientIntelligenceEngine
}


def show_status():
    """Show status of all SOTA features."""
    config = load_config()
    print("\n" + "="*60)
    print("SOTA FEATURES STATUS — PersonalOS v4.7")
    print("="*60)

    for feature_name in FEATURES.keys():
        enabled = is_feature_enabled(feature_name)
        status_icon = "[*]" if enabled else "[ ]"
        feature_config = config.get('sota_features', {}).get(feature_name, {})
        version = feature_config.get('version', 'unknown')

        print(f"  {status_icon} {feature_name:<25} v{version} {'[ENABLED]' if enabled else '[disabled]'}")

    print("="*60)

    # Show global settings
    global_config = config.get('global', {})
    print(f"\nGlobal: dry_run={global_config.get('dry_run', False)}, "
          f"log_level={global_config.get('log_level', 'INFO')}")
    print()


def run_feature(feature_name: str):
    """Run a specific feature."""
    if feature_name not in FEATURES:
        print(f"Unknown feature: {feature_name}")
        print(f"Available: {', '.join(FEATURES.keys())}")
        return

    if not is_feature_enabled(feature_name):
        print(f"[{feature_name}] is disabled. Enable in config.yaml first.")
        return

    engine_class = FEATURES[feature_name]
    engine = engine_class()
    result = engine.execute()

    print(json.dumps(result, indent=2, default=str))


def run_all():
    """Run all enabled features."""
    results = {}

    for feature_name, engine_class in FEATURES.items():
        if not is_feature_enabled(feature_name):
            continue

        print(f"Running {feature_name}...")
        engine = engine_class()
        result = engine.execute()
        results[feature_name] = result

    print("\n" + "="*60)
    print("ALL FEATURES COMPLETED")
    print("="*60)
    for name, result in results.items():
        status = result.get('status', 'unknown')
        print(f"  {name}: {status}")


def toggle_feature(feature_name: str):
    """Toggle a feature's enabled status in config."""
    config_file = SOTA_FEATURES_DIR / "config.yaml"
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
            print("Usage: --run <feature_name|all>")
            return
        feature = sys.argv[2]
        if feature == 'all':
            run_all()
        else:
            run_feature(feature)
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