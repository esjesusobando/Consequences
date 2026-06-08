# ============================================================
# Drilling Engine — Circulation
# Pure functions · Lag time, bottoms up, full circulation
# Reference: IADC Drilling Manual
# ============================================================

"""Circulation time calculations.

All times in minutes.
"""

from __future__ import annotations

from drilling.types import VolumetricsResult, PumpResult, CirculationResult


def calculate_circulation(
    vol: VolumetricsResult,
    pump: PumpResult,
    number_of_pumps: int,
) -> CirculationResult:
    """Calculate circulation times: surface-to-bit, bit-to-surface,
    full circulation, bottoms up, and lag strokes.

    Args:
        vol: Well volumetrics (inside and annular volumes).
        pump: Pump output results.
        number_of_pumps: Number of active pumps.

    Returns:
        CirculationResult with all circulation times.
    """
    if pump.flow_rate_bbl_min <= 0:
        return CirculationResult()

    # ─── Times (min) ─────────────────────────────────────────
    surface_to_bit = vol.total_inside_volume / pump.flow_rate_bbl_min
    bit_to_surface = vol.total_annular_volume / pump.flow_rate_bbl_min
    full_circulation = surface_to_bit + bit_to_surface
    bottoms_up = bit_to_surface

    # ─── Lag Strokes ─────────────────────────────────────────
    lag_strokes = (
        (vol.total_inside_volume / pump.output_per_stroke) * number_of_pumps
        if pump.output_per_stroke > 0
        else 0.0
    )
    lag_time = surface_to_bit

    return CirculationResult(
        surface_to_bit=surface_to_bit,
        bit_to_surface=bit_to_surface,
        full_circulation=full_circulation,
        bottoms_up=bottoms_up,
        lag_strokes=lag_strokes,
        lag_time=lag_time,
    )
