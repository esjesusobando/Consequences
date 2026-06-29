"""
SOTA Features — Base Engine
PersonalOS v4.9 — SOTA Module
"""
import yaml
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Optional
import logging

# Path resolution
SOTA_FEATURES_DIR = Path(__file__).parent.parent
CONFIG_FILE = SOTA_FEATURES_DIR / "config.yaml"

logger = logging.getLogger(__name__)


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


class SOTAEngine(ABC):
    """
    Abstract base for all SOTA feature engines.
    Each feature inherits and implements the run() method.
    """

    def __init__(self, feature_name: str):
        self.feature_name = feature_name
        self.enabled = is_feature_enabled(feature_name)
        self.config = get_feature_config(feature_name)
        self._setup_logging()

    def _setup_logging(self):
        config = load_config()
        log_level = config.get('global', {}).get('log_level', 'INFO')
        logging.basicConfig(level=getattr(logging, log_level))
        self.logger = logging.getLogger(f"SOTA.{self.feature_name}")

    @abstractmethod
    def run(self, **kwargs):
        """Main execution method — implemented by each feature engine."""
        pass

    def execute(self, **kwargs):
        """Wrapper that checks if enabled before running."""
        if not self.enabled:
            self.logger.info(f"[{self.feature_name}] Feature is DISABLED in config.yaml")
            return {'status': 'disabled', 'feature': self.feature_name}

        if self._is_dry_run():
            self.logger.info(f"[{self.feature_name}] DRY RUN — no writes committed")
            return {'status': 'dry_run', 'feature': self.feature_name}

        self.logger.info(f"[{self.feature_name}] Starting execution...")
        try:
            result = self.run(**kwargs)
            self.logger.info(f"[{self.feature_name}] Completed successfully")
            return {'status': 'success', 'feature': self.feature_name, 'result': result}
        except Exception as e:
            self.logger.error(f"[{self.feature_name}] Error: {e}")
            return {'status': 'error', 'feature': self.feature_name, 'error': str(e)}

    def _is_dry_run(self) -> bool:
        config = load_config()
        return config.get('global', {}).get('dry_run', False)

    @property
    def feature_dir(self) -> Path:
        """Return this feature's directory."""
        return SOTA_FEATURES_DIR / f"0X_{self.feature_name.replace('_', '_')}"

    def log_metrics(self, metrics: dict):
        """Log metrics to the common metrics file."""
        import json
        metrics_file = SOTA_FEATURES_DIR / "metrics.json"

        existing = {}
        if metrics_file.exists():
            with open(metrics_file, 'r', encoding='utf-8') as f:
                existing = json.load(f)

        if self.feature_name not in existing:
            existing[self.feature_name] = []

        existing[self.feature_name].append({
            'feature': self.feature_name,
            **metrics
        })

        with open(metrics_file, 'w', encoding='utf-8') as f:
            json.dump(existing, f, indent=2, default=str)