# ============================================================
# Drilling Engine — Pump
# Pure functions · Flow rate & hydraulic HP
# Reference: IADC Drilling Manual
# ============================================================

"""Pump output and hydraulic horsepower calculations.

Triplex factor: 0.000243
Duplex factor:  0.000162
"""

from __future__ import annotations

from drilling.types import PumpData, PumpResult


def calculate_pump(pump: PumpData) -> PumpResult:
    """Calculate pump output, flow rate, and hydraulic horsepower.

    Args:
        pump: Pump configuration and operating parameters.

    Returns:
        PumpResult with output per stroke, flow rates, and HHP.
    """
    # ─── Output per stroke (bbl/stroke) ──────────────────────
    factor = 0.000243 if pump.pump_type == "Triplex" else 0.000162
    rod_area = pump.rod_diameter ** 2 if pump.pump_type == "Duplex" else 0.0

    output_per_stroke = (
        factor
        * (pump.liner_diameter ** 2 - rod_area)
        * pump.stroke_length
        * (pump.efficiency / 100.0)
    )

    # ─── Flow rate ───────────────────────────────────────────
    flow_rate_gpm = (
        output_per_stroke * pump.strokes_per_minute * pump.number_of_pumps
    )
    flow_rate_bbl_min = flow_rate_gpm / 42.0

    # ─── Hydraulic HP ────────────────────────────────────────
    hydraulic_hp = (pump.standpipe_pressure * flow_rate_gpm) / 1714.0

    return PumpResult(
        output_per_stroke=output_per_stroke,
        flow_rate_gpm=flow_rate_gpm,
        flow_rate_bbl_min=flow_rate_bbl_min,
        hydraulic_hp=hydraulic_hp,
    )
