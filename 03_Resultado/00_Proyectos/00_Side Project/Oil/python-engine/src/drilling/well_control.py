# ============================================================
# Drilling Engine — Well Control
# Kill sheet, Driller's Method, Wait & Weight
# Reference: IWCF · IADC Well Control Manual
# ============================================================

"""Well control calculations for kick management.

Generates kill sheet data including KRP, ICP, FCP,
and step-down schedules for both Driller's Method
and Wait & Weight (Engineer's) Method.
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field


@dataclass
class KickData:
    """Kick parameters for well control calculations."""

    sidpp: float = 0.0       # Shut-in drill pipe pressure (psi)
    sicp: float = 0.0        # Shut-in casing pressure (psi)
    pit_gain: float = 0.0    # Pit gain (bbl)


@dataclass
class KillSheetResult:
    """Kill sheet calculation results."""

    kill_mud_weight: float = 0.0        # ppg
    krp: float = 0.0                    # Kill rate pressure (psi)
    icp: float = 0.0                    # Initial circulating pressure (psi)
    fcp: float = 0.0                    # Final circulating pressure (psi)
    strokes_to_bit: float = 0.0         # strokes
    strokes_surface_to_bit: float = 0.0
    total_strokes: float = 0.0
    pressure_increase_per_stroke: float = 0.0
    step_down_schedule: list[dict[str, float]] = field(default_factory=list)

    # MAASP (Maximum Allowable Annular Surface Pressure)
    maasp: float = 0.0                  # psi

    # Kick parameters
    kick_intensity: float = 0.0         # ppg
    influx_gradient: float = 0.0        # psi/ft
    influx_type: str = ""               # Gas, Liquid, Unknown


def calculate_kill_sheet(
    mud_weight: float,
    tvd: float,
    sidpp: float,
    sicp: float,
    pit_gain: float,
    kill_rate_pressure: float,
    strokes_to_bit: float,
    total_strokes: float,
    fracture_gradient: float,
    annular_capacity_at_shoe: float = 0.0,
    shoe_tvd: float = 0.0,
) -> KillSheetResult:
    """Calculate kill sheet for well control operations.

    Supports both Driller's Method and Wait & Weight Method.

    Args:
        mud_weight: Current mud weight (ppg).
        tvd: True vertical depth (ft).
        sidpp: Shut-in drill pipe pressure (psi).
        sicp: Shut-in casing pressure (psi).
        pit_gain: Pit gain volume (bbl).
        kill_rate_pressure: Circulating pressure at kill rate (psi).
        strokes_to_bit: Strokes from surface to bit.
        total_strokes: Total strokes for full circulation.
        fracture_gradient: Fracture gradient at shoe (psi/ft).
        annular_capacity_at_shoe: Annular capacity at casing shoe (bbl/ft).
        shoe_tvd: Casing shoe TVD (ft).

    Returns:
        KillSheetResult with all kill sheet parameters.
    """
    # ─── Kill Mud Weight ─────────────────────────────────────
    kill_mud_weight = (
        mud_weight + sidpp / (0.052 * tvd) if tvd > 0 else mud_weight
    )

    # ─── Initial & Final Circulating Pressures ───────────────
    icp = sidpp + kill_rate_pressure  # ICP = SIDPP + KRP
    fcp = (
        kill_rate_pressure * (kill_mud_weight / mud_weight)
        if mud_weight > 0
        else kill_rate_pressure
    )

    # ─── Step-Down Schedule (ICP → FCP over strokes to bit) ──
    step_down: list[dict[str, float]] = []
    n_steps = 10
    if strokes_to_bit > 0:
        pressure_drop_per_step = (icp - fcp) / n_steps
        stroke_interval = strokes_to_bit / n_steps
        for i in range(n_steps + 1):
            step_down.append({
                "strokes": round(i * stroke_interval),
                "pressure": round(icp - i * pressure_drop_per_step, 1),
            })

    # ─── MAASP ───────────────────────────────────────────────
    maasp = (
        (fracture_gradient - mud_weight * 0.052) * shoe_tvd
        if shoe_tvd > 0
        else 0.0
    )

    # ─── Kick Intensity ──────────────────────────────────────
    kick_intensity = sidpp / (0.052 * tvd) if tvd > 0 else 0.0

    # ─── Influx Gradient & Type Estimation ───────────────────
    # Hydrostatic at TD with current MW
    hydrostatic_td = mud_weight * 0.052 * tvd
    # Bottom hole pressure during kick
    bhp = hydrostatic_td + sidpp
    # Influx height estimate (approximate)
    influx_height = (
        pit_gain / annular_capacity_at_shoe
        if annular_capacity_at_shoe > 0
        else 0.0
    )
    # Influx gradient
    if influx_height > 0 and tvd > 0:
        influx_pressure = bhp - (sicp + mud_weight * 0.052 * (tvd - influx_height))
        influx_gradient = influx_pressure / influx_height if influx_height > 0 else 0.0
    else:
        influx_gradient = 0.0

    # Classify influx type
    if influx_gradient < 0.12:
        influx_type = "Gas"
    elif influx_gradient < 0.35:
        influx_type = "Gas/Liquid Mix"
    elif influx_gradient < 0.50:
        influx_type = "Salt Water"
    else:
        influx_type = "Unknown"

    return KillSheetResult(
        kill_mud_weight=kill_mud_weight,
        krp=kill_rate_pressure,
        icp=icp,
        fcp=fcp,
        strokes_to_bit=strokes_to_bit,
        strokes_surface_to_bit=strokes_to_bit,
        total_strokes=total_strokes,
        step_down_schedule=step_down,
        maasp=maasp,
        kick_intensity=kick_intensity,
        influx_gradient=influx_gradient,
        influx_type=influx_type,
    )
