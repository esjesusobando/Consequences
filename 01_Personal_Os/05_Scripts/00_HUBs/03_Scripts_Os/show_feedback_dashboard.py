#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
show_feedback_dashboard.py — External Feedback Loop: ASCII Dashboard
====================================================================
PersonalOS v5.0 — Gap 3: External Feedback Loop

Displays normalized external signals in a human-readable ASCII table
with trend indicators and suggested actions.

Usage:
    python show_feedback_dashboard.py
    python show_feedback_dashboard.py --format ascii --days 7
    python show_feedback_dashboard.py --test

Input:  01_Personal_Os/03_Learning/04_Telemetry/signals_normalized.json

Version: 1.0.0
"""

# ── Windows UTF-8 Fix ──────────────────────────────────────
import sys
import io
if sys.platform == "win32" and hasattr(sys.stdout, "buffer") and not sys.stdout.closed:
    try:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
    except (AttributeError, ValueError):
        pass
    try:
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8")
    except (AttributeError, ValueError):
        pass

import argparse
import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

# ── Path Resolution ────────────────────────────────────────
_current = Path(__file__).resolve()
_root = next((p for p in _current.parents if (p / "00_Winter_is_Coming").exists()), None)
if _root:
    sys.path.insert(0, str(_root / "01_Personal_Os" / "05_Scripts" / "00_HUBs" / "03_Scripts_Os"))

from config_paths import ROOT_DIR, SIGNALS_DIR

# ── Logging ────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="[%(levelname)s] %(message)s",
    datefmt="%H:%M:%s",
)
logger = logging.getLogger("feedback_dashboard")

# ── Constants ──────────────────────────────────────────────
NORMALIZED_FILE = SIGNALS_DIR / "signals_normalized.json"

TREND_ICONS = {
    "up": "📈",
    "down": "📉",
    "flat": "➡️ ",
}

# Action suggestions based on metric + trend combinations
ACTION_RULES = {
    ("engagement_rate", "down"): "Revisar estrategia de contenido",
    ("engagement_rate", "up"): "Mantener formato actual",
    ("followers", "down"): "Evaluar frecuencia de publicación",
    ("followers", "up"): "Continuar crecimiento orgánico",
    ("sentiment_score", "down"): "Monitorear feedback negativo",
    ("sentiment_score", "up"): "Capitalizar momento positivo",
    ("open_rate", "down"): "Revisar asuntos de emails",
    ("open_rate", "up"): "Optimizar horarios de envío",
    ("click_rate", "down"): "Mejorar CTAs y copy",
    ("click_rate", "up"): "A/B test con variaciones",
    ("bounce_rate", "down"): "Contenido más relevante",
    ("bounce_rate", "up"): "Revisar landing pages",
    ("growth_rate", "down"): "Revisar canales de adquisición",
    ("growth_rate", "up"): "Escalar canales funcionales",
    ("conversion_rate", "down"): "Auditar funnel de conversión",
    ("conversion_rate", "up"): "Documentar qué funciona",
}

DEFAULT_ACTIONS = {
    "up": "Monitorear — mantener tendencia",
    "down": "Investigar causa raíz",
    "flat": "No requiere acción inmediata",
}


# ── Data Loading ───────────────────────────────────────────

def load_normalized_signals(path: Path) -> Optional[Dict[str, Any]]:
    """Load normalized signals from JSON file."""
    if not path.exists():
        return None
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError) as e:
        logger.error(f"Failed to read {path}: {e}")
        return None


# ── Action Recommender ─────────────────────────────────────

def suggest_action(metric: str, trend: str, normalized_value: float) -> str:
    """Suggest an action based on metric, trend, and normalized value.

    Priority:
        1. Specific rule match (metric + trend)
        2. Value-based override (< 20 or > 80)
        3. Default action for trend direction
    """
    # Check specific rule
    key = (metric, trend)
    if key in ACTION_RULES:
        return ACTION_RULES[key]

    # Value-based overrides
    if normalized_value < 20:
        return "⚠️  Crítico — acción urgente requerida"
    elif normalized_value > 80:
        return "✅ Excelente — mantener nivel"

    return DEFAULT_ACTIONS.get(trend, "Revisar manualmente")


# ── Dashboard Renderer ─────────────────────────────────────

def render_ascii_dashboard(
    signals: List[Dict[str, Any]],
    metadata: Dict[str, Any],
    days: int = 7,
) -> str:
    """Render the ASCII dashboard table.

    Args:
        signals: List of normalized signal dicts.
        metadata: Metadata from the normalized signals file.
        days: Trend window display.

    Returns:
        Formatted ASCII table string.
    """
    if not signals:
        return (
            "╔══════════════════════════════════════════════════════════════╗\n"
            "║     EXTERNAL FEEDBACK LOOP — DASHBOARD                    ║\n"
            "╠══════════════════════════════════════════════════════════════╣\n"
            "║                                                            ║\n"
            "║  No signals captured yet.                                  ║\n"
            "║  Run capture_external_signals.py first.                    ║\n"
            "║                                                            ║\n"
            "╚══════════════════════════════════════════════════════════════╝"
        )

    # Sort by source, then metric
    sorted_signals = sorted(signals, key=lambda s: (s.get("source", ""), s.get("metric", "")))

    lines = []
    lines.append("╔══════════════════════════════════════════════════════════════════════════════════╗")
    lines.append("║                EXTERNAL FEEDBACK LOOP — DASHBOARD                              ║")
    lines.append("╠══════════════════════════════════════════════════════════════════════════════════╣")

    # Metadata
    captured = metadata.get("captured_at", "N/A")
    trend_window = metadata.get("trend_window_days", days)
    lines.append(f"║  Señales: {len(signals):<4}  |  Última captura: {captured[:19]:<20}  |  Ventana: {trend_window}d ║")
    lines.append("╠══════════════════════════════════════════════════════════════════════════════════╣")

    # Column headers
    lines.append("║  Fuente      │ Métrica              │ Valor │ Norm  │ Tendencia │ Acción       ║")
    lines.append("║──────────────┼──────────────────────┼───────┼───────┼───────────┼──────────────║")

    # Data rows
    for sig in sorted_signals:
        source = sig.get("source", "?")[:12]
        metric = sig.get("metric", "?")[:20]
        raw_val = sig.get("raw_value", sig.get("value", 0))
        norm_val = sig.get("normalized_value", 0)
        trend = sig.get("trend", "flat")
        trend_icon = TREND_ICONS.get(trend, "➡️ ")

        # Format raw value intelligently
        if isinstance(raw_val, float):
            raw_str = f"{raw_val:>6.1f}"
        else:
            raw_str = f"{raw_val:>6}"

        action = suggest_action(metric, trend, norm_val)

        lines.append(
            f"║  {source:<12} │ {metric:<20} │ {raw_str} │ {norm_val:>5.1f} │   {trend_icon}  │ {action[:12]:<12} ║"
        )

    lines.append("╠══════════════════════════════════════════════════════════════════════════════════╣")

    # Summary stats
    up_count = sum(1 for s in signals if s.get("trend") == "up")
    down_count = sum(1 for s in signals if s.get("trend") == "down")
    flat_count = sum(1 for s in signals if s.get("trend") == "flat")
    avg_norm = sum(s.get("normalized_value", 0) for s in signals) / len(signals) if signals else 0

    lines.append(
        f"║  📈 Subiendo: {up_count:<3}  |  📉 Bajando: {down_count:<3}  |  "
        f"➡️  Estable: {flat_count:<3}  |  Promedio: {avg_norm:.1f}  ║"
    )
    lines.append("╠══════════════════════════════════════════════════════════════════════════════════╣")

    # Top 5 and bottom 5
    by_score = sorted(signals, key=lambda s: s.get("normalized_value", 0), reverse=True)

    lines.append("║  TOP 5 señales:                                                                 ║")
    for sig in by_score[:5]:
        src = sig.get("source", "?")
        met = sig.get("metric", "?")
        val = sig.get("normalized_value", 0)
        trend = TREND_ICONS.get(sig.get("trend", "flat"), "➡️ ")
        lines.append(f"║    {trend} {src:>10} / {met:<20} → {val:>5.1f}                              ║")

    lines.append("║──────────────────────────────────────────────────────────────────────────────────║")
    lines.append("║  BOTTOM 5 señales:                                                              ║")
    for sig in by_score[-5:]:
        src = sig.get("source", "?")
        met = sig.get("metric", "?")
        val = sig.get("normalized_value", 0)
        trend = TREND_ICONS.get(sig.get("trend", "flat"), "➡️ ")
        lines.append(f"║    {trend} {src:>10} / {met:<20} → {val:>5.1f}                              ║")

    lines.append("╚══════════════════════════════════════════════════════════════════════════════════╝")

    return "\n".join(lines)


# ── CLI ────────────────────────────────────────────────────

def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="show_feedback_dashboard",
        description="External Feedback Loop — ASCII Dashboard (PersonalOS v5.0)",
    )
    parser.add_argument(
        "--input", "-i",
        type=str,
        default=str(NORMALIZED_FILE),
        help="Input normalized signals JSON file",
    )
    parser.add_argument(
        "--format", "-f",
        type=str,
        default="ascii",
        choices=["ascii"],
        help="Output format (default: ascii)",
    )
    parser.add_argument(
        "--days", "-d",
        type=int,
        default=7,
        help="Trend window in days (default: 7)",
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Enable debug logging",
    )
    parser.add_argument(
        "--test",
        action="store_true",
        help="Run built-in smoke test and exit",
    )
    return parser


def run_smoke_test() -> int:
    """Built-in smoke test — verifies rendering with mock data."""
    logger.info("Running smoke test...")

    mock_signals = [
        {"source": "linkedin", "metric": "followers", "value": 1250, "raw_value": 1250,
         "normalized_value": 75.0, "trend": "up", "trend_pct": 5.0},
        {"source": "twitter", "metric": "engagement_rate", "value": 2.1, "raw_value": 2.1,
         "normalized_value": 45.0, "trend": "down", "trend_pct": -3.0},
        {"source": "youtube", "metric": "subscribers", "value": 320, "raw_value": 320,
         "normalized_value": 60.0, "trend": "flat", "trend_pct": 0.0},
    ]
    mock_metadata = {
        "captured_at": datetime.now().isoformat(),
        "trend_window_days": 7,
        "count": 3,
    }

    dashboard = render_ascii_dashboard(mock_signals, mock_metadata)
    assert "EXTERNAL FEEDBACK LOOP" in dashboard
    assert "linkedin" in dashboard
    assert "followers" in dashboard
    logger.info("[PASS] Dashboard renders with mock data")

    # Test empty signals
    empty_dashboard = render_ascii_dashboard([], {})
    assert "No signals captured yet" in empty_dashboard
    logger.info("[PASS] Empty dashboard message")

    # Test action suggestions
    action = suggest_action("engagement_rate", "down", 30.0)
    assert "Revisar" in action
    action = suggest_action("unknown_metric", "flat", 50.0)
    assert "no requiere" in action.lower()
    action = suggest_action("any", "up", 15.0)
    assert "Crítico" in action
    logger.info("[PASS] Action suggestions")

    logger.info("All smoke tests passed!")
    return 0


def main():
    parser = build_parser()
    args = parser.parse_args()

    if args.verbose:
        logger.setLevel(logging.DEBUG)

    if args.test:
        sys.exit(run_smoke_test())

    input_path = Path(args.input)

    # Load data
    data = load_normalized_signals(input_path)
    if data is None:
        print(
            "\n╔══════════════════════════════════════════════════════════════╗\n"
            "║     EXTERNAL FEEDBACK LOOP — DASHBOARD                    ║\n"
            "╠══════════════════════════════════════════════════════════════╣\n"
            "║                                                            ║\n"
            "║  No signals captured yet.                                  ║\n"
            "║  Run capture_external_signals.py first.                    ║\n"
            "║                                                            ║\n"
            "╚══════════════════════════════════════════════════════════════╝"
        )
        sys.exit(0)

    signals = data.get("signals", [])
    metadata = {
        "captured_at": data.get("captured_at", "N/A"),
        "trend_window_days": data.get("trend_window_days", args.days),
        "count": data.get("count", len(signals)),
    }

    dashboard = render_ascii_dashboard(signals, metadata, days=args.days)
    print(dashboard)


if __name__ == "__main__":
    main()
