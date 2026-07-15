#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Nombre: CurationFilter — Signal Classification, Dedup & Routing
Ubicacion: 01_Personal_Os/05_Scripts/00_HUBs/03_Scripts_Os/
Proposito: Reads raw signal JSONs from a capture inbox, classifies them
(actionable / reference / noise) against keyword rules, deduplicates
within a configurable TTL window, and routes each signal to the correct
destination (daily inbox, brain folder, or archive).
"""
import sys, os, json, argparse, logging, hashlib
from pathlib import Path
from datetime import datetime, timezone, timedelta

sys.path.insert(0, str(Path(__file__).parent))
from config_paths import ROOT_DIR, TELEMETRY_DIR, CACHE_DIR

def _fix_encoding():
    """Fix Windows console encoding (call only in __main__)."""
    if sys.platform == "win32":
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

logging.basicConfig(level=logging.INFO, format='%(asctime)s | %(levelname)-8s | %(name)s | %(message)s', datefmt='%H:%M:%S')
logger = logging.getLogger(__name__)

# =============================================================================
# PATH CONSTANTS
# =============================================================================

SIGNALS_DIR = ROOT_DIR / "01_Personal_Os" / "03_Learning" / "04_Telemetry"
CAPTURE_INBOX_DIR = SIGNALS_DIR / "capture_inbox"
CONFIG_DIR = ROOT_DIR / "01_Personal_Os" / "02_Knowledge" / "04_Config"
DEFAULT_RULES_PATH = CONFIG_DIR / "curation_rules.yaml"
DEDUP_CACHE_FILE = CACHE_DIR / "dedup_cache.json"
TASKS_DIR = ROOT_DIR / "01_Personal_Os" / "04_Tasks"
MEMORY_CTX_DIR = ROOT_DIR / "01_Personal_Os" / "01_Memory" / "00_Context_LLM"
ARCHIVE_DIR = ROOT_DIR / "01_Personal_Os" / "07_Archive"
BRAIN_DIR = MEMORY_CTX_DIR / "02_Knowledge_Brain"
ARCHIVE_SIGNALS_DIR = ARCHIVE_DIR / "05_Signals_Archive"


# =============================================================================
# ATOMIC JSON WRITE
# =============================================================================

def safe_json_write(data, path):
    """Atomic JSON write — writes to temp file then renames."""
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = path.with_suffix(".tmp")
    try:
        with open(tmp_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write("\n")
        tmp_path.replace(path)
        logger.debug(f"Wrote {path}")
    except OSError as e:
        logger.error(f"Failed to write {path}: {e}")
        raise


def safe_json_read(path):
    """Read JSON file, return empty dict on failure."""
    if not path.exists():
        return {}
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError) as e:
        logger.warning(f"Failed to read {path}: {e}")
        return {}


# =============================================================================
# CURATION FILTER
# =============================================================================

class CurationFilter:
    """Classifies, deduplicates, and routes signals from a capture inbox."""

    def __init__(self, rules_path=None, dry_run=False):
        self.rules_path = Path(rules_path) if rules_path else DEFAULT_RULES_PATH
        self.dry_run = dry_run
        self.rules = self._load_rules()
        self.dedup_cache = self._load_dedup_cache()

    def _load_rules(self):
        """Load classification rules from YAML file."""
        if not self.rules_path.exists():
            logger.error(f"Rules file not found: {self.rules_path}")
            sys.exit(2)

        try:
            import yaml
            with open(self.rules_path, "r", encoding="utf-8") as f:
                rules = yaml.safe_load(f) or {}
        except ImportError:
            logger.warning("PyYAML not installed — attempting JSON fallback")
            try:
                with open(self.rules_path, "r", encoding="utf-8") as f:
                    rules = json.load(f)
            except Exception:
                logger.error("Could not parse rules file")
                sys.exit(2)
        except Exception as e:
            logger.error(f"Rules load error: {e}")
            sys.exit(2)

        # Validate required keys
        required = ["classification", "deduplication"]
        for key in required:
            if key not in rules:
                logger.error(f"Missing required key: {key}")
                sys.exit(2)

        return rules

    def _load_dedup_cache(self):
        """Load dedup cache, pruning stale entries."""
        cache = safe_json_read(DEDUP_CACHE_FILE)
        if not cache:
            return {}

        window_hours = self.rules.get("deduplication", {}).get("window_hours", 24)
        cutoff = datetime.now(timezone.utc) - timedelta(hours=window_hours)
        pruned = {}
        for fp, ts_str in cache.items():
            try:
                ts = datetime.fromisoformat(ts_str)
                if ts.tzinfo is None:
                    ts = ts.replace(tzinfo=timezone.utc)
                if ts > cutoff:
                    pruned[fp] = ts_str
            except (ValueError, TypeError):
                continue
        return pruned

    def _save_dedup_cache(self):
        """Persist dedup cache atomically."""
        if not self.dry_run:
            safe_json_write(self.dedup_cache, DEDUP_CACHE_FILE)

    def _fingerprint(self, content):
        """SHA-256 fingerprint of first 200 chars of content."""
        raw = content[:200].encode("utf-8", errors="replace")
        return hashlib.sha256(raw).hexdigest()[:16]

    def _is_duplicate(self, fp):
        """Check if fingerprint exists in dedup cache within TTL."""
        return fp in self.dedup_cache

    def _cache_fingerprint(self, fp):
        """Store fingerprint with current timestamp."""
        self.dedup_cache[fp] = datetime.now(timezone.utc).isoformat()

    def _signal_to_text(self, signal):
        """Flatten signal dict to searchable text string."""
        parts = []
        for key, value in signal.items():
            if isinstance(value, str):
                parts.append(value.lower())
            elif isinstance(value, (int, float)):
                parts.append(str(value))
            elif isinstance(value, dict):
                for v in value.values():
                    if isinstance(v, str):
                        parts.append(v.lower())
        return " ".join(parts)

    def classify(self, signal):
        """Classify signal as actionable / reference / noise.

        Priority: actionable > reference > noise.
        Returns classification string.
        """
        text = self._signal_to_text(signal)
        classification_cfg = self.rules.get("classification", {})

        # Check each category
        actionable_hits = any(
            kw.lower() in text
            for kw in classification_cfg.get("actionable_keywords", [])
        )
        reference_hits = any(
            kw.lower() in text
            for kw in classification_cfg.get("reference_keywords", [])
        )
        noise_hits = any(
            pat.lower() in text
            for pat in classification_cfg.get("noise_patterns", [])
        )

        # Priority resolution: actionable > reference > noise
        if actionable_hits:
            return "actionable"
        if reference_hits:
            return "reference"
        if noise_hits:
            return "noise"
        return "noise"  # default — no keyword match = noise

    def _resolve_route(self, classification):
        """Map classification to a filesystem destination Path."""
        routes = self.rules.get("routes", {})
        route_key = routes.get(classification, "brain_folder")

        route_map = {
            "daily_inbox": TASKS_DIR,
            "brain_folder": BRAIN_DIR,
            "archive": ARCHIVE_SIGNALS_DIR,
        }
        return route_map.get(route_key, BRAIN_DIR)

    def route(self, classified_signal, signal):
        """Write classified signal to its destination."""
        classification = classified_signal["classification"]
        dest_dir = self._resolve_route(classification)

        if self.dry_run:
            logger.info(f"[DRY RUN] Would route to {dest_dir}")
            return

        if classification == "actionable":
            date_str = datetime.now().strftime("%Y-%m-%d")
            dest_file = dest_dir / f"actionable_{date_str}.json"
            existing = safe_json_read(dest_file)
            signals_list = existing.get("signals", [])
            signals_list.append(classified_signal)
            payload = {
                "date": date_str,
                "signals": signals_list,
                "count": len(signals_list),
            }
            safe_json_write(payload, dest_file)
            classified_signal["routed_to"] = str(dest_file)

        elif classification == "reference":
            dest_file = dest_dir / "reference_signals.json"
            existing = safe_json_read(dest_file)
            signals_list = existing.get("signals", [])
            signals_list.append(classified_signal)
            payload = {
                "signals": signals_list,
                "count": len(signals_list),
            }
            safe_json_write(payload, dest_file)
            classified_signal["routed_to"] = str(dest_file)

        elif classification == "noise":
            dest_file = dest_dir / "noise_log.json"
            existing = safe_json_read(dest_file)
            signals_list = existing.get("signals", [])
            signals_list.append(classified_signal)
            payload = {
                "signals": signals_list,
                "count": len(signals_list),
            }
            safe_json_write(payload, dest_file)
            classified_signal["routed_to"] = str(dest_file)

        logger.debug(f"Routed [{classification}] to {dest_dir}")

    def process_inbox(self, inbox_dir):
        """Main loop: read inbox, classify, dedup, route. Returns stats."""
        inbox = Path(inbox_dir)
        if not inbox.exists():
            logger.info(f"Inbox directory not found: {inbox}")
            return {
                "processed": 0, "actionable": 0, "reference": 0,
                "noise": 0, "duplicates_skipped": 0, "duration_sec": 0.0,
            }

        start_time = datetime.now()
        stats = {
            "processed": 0, "actionable": 0, "reference": 0,
            "noise": 0, "duplicates_skipped": 0,
        }

        json_files = sorted(inbox.glob("*.json"))
        if not json_files:
            behavior = self.rules.get("empty_inbox", {}).get("behavior", "silent_exit")
            if behavior == "silent_exit":
                logger.debug("Empty inbox — silent exit")
            return {
                "processed": 0, "actionable": 0, "reference": 0,
                "noise": 0, "duplicates_skipped": 0, "duration_sec": 0.0,
            }

        for file_path in json_files:
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
            except (json.JSONDecodeError, OSError) as e:
                logger.warning(f"Skipped: {file_path.name} — invalid JSON ({e})")
                continue

            # Handle both single signal and batch formats
            signals = []
            if isinstance(data, dict):
                if "signals" in data:
                    signals = data["signals"]
                else:
                    signals = [data]
            elif isinstance(data, list):
                signals = data
            else:
                logger.warning(f"Skipped: {file_path.name} — unexpected format")
                continue

            for sig in signals:
                text = self._signal_to_text(sig)
                fp = self._fingerprint(text)

                if self._is_duplicate(fp):
                    stats["duplicates_skipped"] += 1
                    logger.debug(f"Duplicate skipped: {fp}")
                    continue

                classification = self.classify(sig)
                classified = dict(sig)
                classified["classification"] = classification
                classified["fingerprint"] = fp

                self.route(classified, sig)
                self._cache_fingerprint(fp)

                stats[classification] += 1
                stats["processed"] += 1

        self._save_dedup_cache()

        duration = (datetime.now() - start_time).total_seconds()
        stats["duration_sec"] = round(duration, 3)
        return stats


# =============================================================================
# CLI
# =============================================================================

def main():
    parser = argparse.ArgumentParser(
        prog="curation_filter",
        description="Capture + Signal Pipeline — Curation Filter (PersonalOS v5.0)",
    )
    parser.add_argument(
        "--inbox-dir", type=str, default=str(CAPTURE_INBOX_DIR),
        help="Path to capture inbox directory",
    )
    parser.add_argument(
        "--rules", type=str, default=str(DEFAULT_RULES_PATH),
        help="Path to curation_rules.yaml",
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Classify and log but don't write output files",
    )
    parser.add_argument(
        "--verbose", "-v", action="store_true",
        help="Enable debug logging",
    )
    parser.add_argument(
        "--test", action="store_true",
        help="Run built-in smoke test and exit",
    )
    args = parser.parse_args()

    if args.verbose:
        logger.setLevel(logging.DEBUG)

    if args.test:
        return _run_smoke_test()

    cfilter = CurationFilter(rules_path=args.rules, dry_run=args.dry_run)
    stats = cfilter.process_inbox(args.inbox_dir)

    print(json.dumps(stats, indent=2, ensure_ascii=False))
    return 0


def _run_smoke_test():
    """Built-in smoke test — verifies classification logic."""
    logger.info("Running smoke test...")

    rules = CurationFilter()._load_rules()
    cf = CurationFilter.__new__(CurationFilter)
    cf.rules = rules
    cf.dry_run = True
    cf.dedup_cache = {}

    # Test 1: actionable classification
    sig = {"source": "test", "metric": "task", "text": "Action required: deploy fix"}
    assert cf.classify(sig) == "actionable", f"Expected actionable, got {cf.classify(sig)}"
    logger.info("[PASS] classify → actionable")

    # Test 2: reference classification
    sig = {"source": "test", "metric": "info", "text": "FYI — new API docs"}
    assert cf.classify(sig) == "reference", f"Expected reference, got {cf.classify(sig)}"
    logger.info("[PASS] classify → reference")

    # Test 3: noise classification
    sig = {"source": "test", "metric": "promo", "text": "Unsubscribe from newsletter"}
    assert cf.classify(sig) == "noise", f"Expected noise, got {cf.classify(sig)}"
    logger.info("[PASS] classify → noise")

    # Test 4: priority — actionable beats noise
    sig = {"source": "test", "metric": "mixed", "text": "URGENT — unsubscribe from this newsletter"}
    assert cf.classify(sig) == "actionable", f"Expected actionable (priority), got {cf.classify(sig)}"
    logger.info("[PASS] classify → actionable beats noise (priority)")

    # Test 5: fingerprint determinism
    fp1 = cf._fingerprint("hello world test content here")
    fp2 = cf._fingerprint("hello world test content here")
    assert fp1 == fp2, "Fingerprint not deterministic"
    logger.info("[PASS] fingerprint deterministic")

    # Test 6: dedup detection
    cf._cache_fingerprint("test_fp_123")
    assert cf._is_duplicate("test_fp_123"), "Duplicate not detected"
    assert not cf._is_duplicate("unique_fp_999"), "False positive dedup"
    logger.info("[PASS] dedup detection")

    logger.info("All smoke tests passed!")
    return 0


if __name__ == "__main__":
    try:
        _fix_encoding()
        sys.exit(main())
    except KeyboardInterrupt:
        logger.warning("Interrupted by user")
        sys.exit(130)
    except Exception as e:
        logger.exception(f"Fatal error: {e}")
        sys.exit(1)
