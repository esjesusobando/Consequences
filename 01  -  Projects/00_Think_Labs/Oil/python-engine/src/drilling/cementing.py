# ============================================================
# Drilling Engine — Cementing
# Slurry yield, displacement, top of cement
# Reference: API RP 10B · Halliburton Cementing Tables
# ============================================================

"""Cementing design calculations.

Covers slurry yield, excess percentage, displacement volumes,
and top of cement estimation.
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field


@dataclass
class SlurryDesign:
    """Cement slurry design parameters."""

    cement_density: float = 15.8     # ppg (Class H typical)
    slurry_yield: float = 1.18       # ft³/sack
    water_requirement: float = 5.2   # gal/sack
    sack_weight: float = 94.0        # lb/sack (1 sack Portland)
    excess_percent: float = 50.0     # % excess for open hole


@dataclass
class CementingResult:
    """Cementing calculation results."""

    annular_volume: float = 0.0         # bbl
    annular_volume_with_excess: float = 0.0  # bbl
    annular_volume_ft3: float = 0.0     # ft³
    sacks_required: float = 0.0         # sacks
    mix_water: float = 0.0             # gal
    mix_water_bbl: float = 0.0         # bbl
    displacement_volume: float = 0.0    # bbl
    displacement_strokes: float = 0.0   # strokes
    top_of_cement: float = 0.0         # ft (from surface)
    cement_column: float = 0.0         # ft


def calculate_cementing(
    hole_size: float,
    casing_od: float,
    casing_id: float,
    shoe_depth: float,
    toc_depth: float = 0.0,
    slurry: SlurryDesign | None = None,
    pump_output: float = 0.1,
) -> CementingResult:
    """Calculate cementing job parameters.

    Args:
        hole_size: Open hole diameter (in).
        casing_od: Casing outer diameter (in).
        casing_id: Casing inner diameter (in).
        shoe_depth: Casing shoe depth MD (ft).
        toc_depth: Desired top of cement from surface (ft). 0 = surface.
        slurry: Cement slurry design. None = defaults.
        pump_output: Pump output (bbl/stroke) for displacement strokes.

    Returns:
        CementingResult with volumes, sacks, displacement.
    """
    if slurry is None:
        slurry = SlurryDesign()

    # ─── Annular Volume ──────────────────────────────────────
    cement_column = shoe_depth - toc_depth
    annular_capacity = (hole_size ** 2 - casing_od ** 2) / 1029.4  # bbl/ft
    annular_volume = annular_capacity * cement_column
    annular_volume_with_excess = annular_volume * (1.0 + slurry.excess_percent / 100.0)

    # Convert to ft³ (1 bbl = 5.6146 ft³)
    annular_volume_ft3 = annular_volume_with_excess * 5.6146

    # ─── Sacks Required ──────────────────────────────────────
    sacks_required = (
        annular_volume_ft3 / slurry.slurry_yield if slurry.slurry_yield > 0 else 0.0
    )

    # ─── Mix Water ───────────────────────────────────────────
    mix_water = sacks_required * slurry.water_requirement  # gal
    mix_water_bbl = mix_water / 42.0

    # ─── Displacement Volume ─────────────────────────────────
    casing_capacity = casing_id ** 2 / 1029.4  # bbl/ft
    # Displacement = casing volume from surface to shoe minus shoe track
    shoe_track = 60.0  # ft (typical float collar to shoe)
    displacement_volume = casing_capacity * max(0.0, shoe_depth - shoe_track)

    # ─── Displacement Strokes ────────────────────────────────
    displacement_strokes = (
        displacement_volume / pump_output if pump_output > 0 else 0.0
    )

    # ─── Top of Cement ───────────────────────────────────────
    top_of_cement = toc_depth

    return CementingResult(
        annular_volume=annular_volume,
        annular_volume_with_excess=annular_volume_with_excess,
        annular_volume_ft3=annular_volume_ft3,
        sacks_required=sacks_required,
        mix_water=mix_water,
        mix_water_bbl=mix_water_bbl,
        displacement_volume=displacement_volume,
        displacement_strokes=displacement_strokes,
        top_of_cement=top_of_cement,
        cement_column=cement_column,
    )
