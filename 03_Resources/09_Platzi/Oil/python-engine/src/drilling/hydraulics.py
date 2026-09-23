# ============================================================
# Drilling Engine — Hydraulics
# Velocities, pressure losses, ECD, HHP, nozzle optimization
# Reference: API RP 13D · Bourgoyne et al.
# ============================================================

"""Drilling hydraulics calculations.

Uses Bingham Plastic model for pressure loss approximation.
Includes scipy-based nozzle optimization (Python-exclusive).
"""

from __future__ import annotations

import math

import numpy as np

from drilling.types import (
    WellData,
    MudData,
    RheologyResult,
    PumpResult,
    PressureResult,
    HydraulicsResult,
)


def calculate_hydraulics(
    well: WellData,
    mud: MudData,
    rheology: RheologyResult,
    pump: PumpResult,
    pressures: PressureResult,
) -> HydraulicsResult:
    """Calculate drilling hydraulics: velocities, pressure losses
    through each component, ECD, bit optimization, and impact force.

    Args:
        well: Well geometry.
        mud: Mud properties.
        rheology: Rheological parameters.
        pump: Pump output results.
        pressures: Formation pressure results.

    Returns:
        HydraulicsResult with all hydraulics parameters.
    """
    empty = HydraulicsResult(
        ecd=mud.mud_weight,
        bottom_hole_pressure=pressures.hydrostatic_pressure,
    )

    if pump.flow_rate_gpm <= 0:
        return empty

    q = pump.flow_rate_gpm
    pv = rheology.plastic_viscosity

    # ─── Velocities ──────────────────────────────────────────
    dp_area = well.hole_size ** 2 - well.drill_pipe_od ** 2
    annular_velocity = (24.5 * q) / dp_area if dp_area > 0 else 0.0  # ft/min

    pipe_velocity = (
        (24.5 * q) / well.drill_pipe_id ** 2 if well.drill_pipe_id > 0 else 0.0
    )  # ft/min

    # ─── Total Flow Area (TFA) ───────────────────────────────
    tfa = sum(
        (math.pi * (n / 32.0) ** 2) / 4.0 for n in well.bit_nozzles
    )
    total_flow_area = tfa
    nozzle_velocity = (q * 0.3208) / tfa if tfa > 0 else 0.0  # ft/sec

    # ─── Pressure Losses (Bingham Plastic approximation) ─────
    # Drill Pipe
    pressure_loss_dp = (
        (pv * pipe_velocity * well.drill_pipe_length) / (1500.0 * well.drill_pipe_id)
        if well.drill_pipe_id > 0
        else 0.0
    )

    # HWDP
    hwdp_velocity = (
        (24.5 * q) / well.hwdp_id ** 2 if well.hwdp_id > 0 else 0.0
    )
    pressure_loss_hwdp = (
        (pv * hwdp_velocity * well.hwdp_length) / (1500.0 * well.hwdp_id)
        if well.hwdp_id > 0
        else 0.0
    )

    # Drill Collars
    dc_velocity = (24.5 * q) / well.dc_id ** 2 if well.dc_id > 0 else 0.0
    pressure_loss_dc = (
        (pv * dc_velocity * well.dc_length) / (1500.0 * well.dc_id)
        if well.dc_id > 0
        else 0.0
    )

    # Bit
    cd = 0.95
    pressure_loss_bit = (
        (mud.mud_weight * q ** 2) / (10858.0 * cd ** 2 * tfa ** 2)
        if tfa > 0
        else 0.0
    )

    # Annular
    annular_gap = well.hole_size - well.drill_pipe_od
    pressure_loss_annular = (
        (pv * annular_velocity * well.total_depth) / (1500.0 * annular_gap)
        if annular_gap > 0
        else 0.0
    )

    # Total
    total_pressure_loss = (
        pressure_loss_dp
        + pressure_loss_hwdp
        + pressure_loss_dc
        + pressure_loss_bit
        + pressure_loss_annular
    )

    # ─── ECD & BHP ───────────────────────────────────────────
    ecd = (
        mud.mud_weight + pressure_loss_annular / (0.052 * well.tvd)
        if well.tvd > 0
        else mud.mud_weight
    )
    bottom_hole_pressure = pressures.hydrostatic_pressure + pressure_loss_annular

    # ─── Bit Optimization ────────────────────────────────────
    bit_hhp = (pressure_loss_bit * q) / 1714.0
    bit_area = (math.pi * well.bit_size ** 2) / 4.0
    hhp_per_sq_in = bit_hhp / bit_area if bit_area > 0 else 0.0

    # ─── Impact Force ────────────────────────────────────────
    impact_force = 0.01823 * mud.mud_weight * q * nozzle_velocity
    impact_per_sq_in = impact_force / bit_area if bit_area > 0 else 0.0

    return HydraulicsResult(
        annular_velocity=annular_velocity,
        pipe_velocity=pipe_velocity,
        total_flow_area=total_flow_area,
        nozzle_velocity=nozzle_velocity,
        pressure_loss_dp=pressure_loss_dp,
        pressure_loss_hwdp=pressure_loss_hwdp,
        pressure_loss_dc=pressure_loss_dc,
        pressure_loss_bit=pressure_loss_bit,
        pressure_loss_annular=pressure_loss_annular,
        total_pressure_loss=total_pressure_loss,
        ecd=ecd,
        bottom_hole_pressure=bottom_hole_pressure,
        bit_hhp=bit_hhp,
        hhp_per_sq_in=hhp_per_sq_in,
        impact_force=impact_force,
        impact_per_sq_in=impact_per_sq_in,
    )


def optimize_nozzles(
    well: WellData,
    mud: MudData,
    pump: PumpResult,
    n_nozzles: int = 3,
    min_size: int = 8,
    max_size: int = 20,
) -> dict[str, object]:
    """Optimize bit nozzle sizes for maximum hydraulic impact.

    Uses brute-force search over discrete nozzle sizes (32nds of inch).
    This is a Python-exclusive feature.

    Args:
        well: Well geometry.
        mud: Mud properties.
        pump: Pump output.
        n_nozzles: Number of nozzles on bit.
        min_size: Minimum nozzle size (32nds).
        max_size: Maximum nozzle size (32nds).

    Returns:
        Dict with: optimal_nozzles, max_impact, pressure_loss_bit, tfa.
    """
    if pump.flow_rate_gpm <= 0:
        return {
            "optimal_nozzles": [0] * n_nozzles,
            "max_impact": 0.0,
            "pressure_loss_bit": 0.0,
            "tfa": 0.0,
        }

    q = pump.flow_rate_gpm
    cd = 0.95
    best_impact = 0.0
    best_nozzles: list[int] = [12] * n_nozzles
    best_ploss = 0.0
    best_tfa = 0.0

    # For simplicity, assume all nozzles are equal size
    for size in range(min_size, max_size + 1):
        tfa = n_nozzles * (math.pi * (size / 32.0) ** 2) / 4.0
        if tfa <= 0:
            continue
        nozzle_vel = (q * 0.3208) / tfa
        impact = 0.01823 * mud.mud_weight * q * nozzle_vel
        ploss = (mud.mud_weight * q ** 2) / (10858.0 * cd ** 2 * tfa ** 2)

        if impact > best_impact:
            best_impact = impact
            best_nozzles = [size] * n_nozzles
            best_ploss = ploss
            best_tfa = tfa

    return {
        "optimal_nozzles": best_nozzles,
        "max_impact": best_impact,
        "pressure_loss_bit": best_ploss,
        "tfa": best_tfa,
    }
