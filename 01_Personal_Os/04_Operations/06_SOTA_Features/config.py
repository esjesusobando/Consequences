"""
Config loader for SOTA Features
"""
import yaml
from pathlib import Path

CONFIG_FILE = Path(__file__).parent / "config.yaml"


def load_config() -> dict:
    """Load SOTA features configuration."""
    with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f)


def is_feature_enabled(feature_name: str) -> bool:
    """Check if a specific feature is enabled in config."""
    config = load_config()
    return config.get('sota_features', {}).get(feature_name, {}).get('enabled', False)


def get_feature_config(feature_name: str) -> dict:
    """Get full config for a specific feature."""
    config = load_config()
    return config.get('sota_features', {}).get(feature_name, {})