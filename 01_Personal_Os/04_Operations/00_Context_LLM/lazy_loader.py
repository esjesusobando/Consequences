#!/usr/bin/env python3
"""
Lazy Loader for Adaptive Boot
Loads context files on-demand and caches them for session duration.
"""

import json
from pathlib import Path
from datetime import datetime

PROJECT_ROOT = Path(__file__).parent.parent.parent.parent
CACHE_DIR = PROJECT_ROOT / "01_Personal_Os" / "04_Operations" / "00_Context_LLM" / ".lazy_cache"
METRICS_FILE = PROJECT_ROOT / "01_Personal_Os" / "04_Operations" / "00_Context_LLM" / "boot_metrics.json"


def _ensure_cache_dir():
    """Ensure cache directory exists"""
    CACHE_DIR.mkdir(parents=True, exist_ok=True)


def _cache_path(key: str) -> Path:
    """Get cache file path for a key"""
    safe_key = key.replace("/", "_").replace("\\", "_").replace(":", "_")
    return CACHE_DIR / f"{safe_key}.json"


def load_file(file_path: str, force: bool = False) -> dict:
    """
    Load a file with lazy caching.
    Returns dict with: path, content, loaded_from, size, cached
    """
    path = Path(file_path) if Path(file_path).is_absolute() else PROJECT_ROOT / file_path

    if not path.exists():
        return {"path": str(path), "content": None, "error": "File not found"}

    cache_key = str(path.relative_to(PROJECT_ROOT))
    cache_file = _cache_path(cache_key)

    # Check cache
    if not force and cache_file.exists():
        try:
            cached = json.loads(cache_file.read_text(encoding="utf-8"))
            cached["cached"] = True
            cached["loaded_from"] = "cache"
            return cached
        except Exception:
            pass  # Cache corrupted, reload

    # Load fresh
    _ensure_cache_dir()
    content = path.read_text(encoding="utf-8")
    result = {
        "path": str(path),
        "relative_path": cache_key,
        "content": content,
        "size": len(content),
        "loaded_from": "disk",
        "cached": False,
        "loaded_at": datetime.now().isoformat()
    }

    # Cache it
    try:
        cache_file.write_text(json.dumps(result, ensure_ascii=False), encoding="utf-8")
    except Exception:
        pass  # Cache write failed, not critical

    return result


def load_context_batch(file_paths: list) -> list:
    """Load multiple files efficiently"""
    results = []
    for fp in file_paths:
        result = load_file(fp)
        results.append(result)
    return results


def get_cache_stats() -> dict:
    """Get cache statistics"""
    _ensure_cache_dir()
    cache_files = list(CACHE_DIR.glob("*.json"))
    total_size = sum(f.stat().st_size for f in cache_files)
    return {
        "cached_files": len(cache_files),
        "total_size_bytes": total_size,
        "total_size_kb": round(total_size / 1024, 1)
    }


def clear_cache():
    """Clear all cached files"""
    import shutil
    if CACHE_DIR.exists():
        shutil.rmtree(CACHE_DIR)
        _ensure_cache_dir()
    return {"cleared": True}


def log_boot_metrics(agent_type: str, files_loaded: int, total_size: int, lazy_loaded: int):
    """Log boot metrics for analysis"""
    metrics = {}
    if METRICS_FILE.exists():
        try:
            metrics = json.loads(METRICS_FILE.read_text(encoding="utf-8"))
        except Exception:
            pass

    if "boots" not in metrics:
        metrics["boots"] = []

    metrics["boots"].append({
        "timestamp": datetime.now().isoformat(),
        "agent_type": agent_type,
        "files_loaded": files_loaded,
        "total_size_bytes": total_size,
        "lazy_loaded": lazy_loaded
    })

    # Keep last 100 boots
    metrics["boots"] = metrics["boots"][-100:]

    # Summary
    metrics["summary"] = {
        "total_boots": len(metrics["boots"]),
        "avg_files_loaded": round(sum(b["files_loaded"] for b in metrics["boots"]) / len(metrics["boots"]), 1),
        "avg_size_kb": round(sum(b["total_size_bytes"] for b in metrics["boots"]) / len(metrics["boots"]) / 1024, 1)
    }

    METRICS_FILE.parent.mkdir(parents=True, exist_ok=True)
    METRICS_FILE.write_text(json.dumps(metrics, indent=2, ensure_ascii=False), encoding="utf-8")
    return metrics["summary"]


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        result = load_file(sys.argv[1])
        if result.get("error"):
            print(f"Error: {result['error']}")
        else:
            print(f"Loaded: {result['path']}")
            print(f"Size: {result['size']} bytes")
            print(f"Cached: {result['cached']}")
    else:
        print("Usage: python lazy_loader.py <file_path>")
        print(f"Cache stats: {get_cache_stats()}")