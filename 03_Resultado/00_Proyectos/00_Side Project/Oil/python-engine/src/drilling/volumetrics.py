# ============================================================
# Drilling Engine — Volumetrics
# Pure functions · Capacities, annular volumes, displacements
# Reference: API RP 13B · Oilfield barrel = 42 US gallons
# ============================================================

"""Well volumetrics calculations.

Capacity formula: ID² / 1029.4 (bbl/ft)
Annular capacity: (Hole² − Pipe²) / 1029.4 (bbl/ft)
"""

from __future__ import annotations

import math

from drilling.types import WellData, VolumetricsResult


def calculate_volumetrics(well: WellData) -> VolumetricsResult:
    """Calculate well volumetrics: capacities, annular volumes,
    displacements, and total system volume.

    Args:
        well: Well geometry and drill string dimensions.

    Returns:
        VolumetricsResult with all calculated volumes.
    """
    # ─── Capacities (bbl/ft) ─────────────────────────────────
    hole_capacity = well.hole_size ** 2 / 1029.4
    drill_pipe_capacity = well.drill_pipe_id ** 2 / 1029.4
    hwdp_capacity = well.hwdp_id ** 2 / 1029.4
    dc_capacity = well.dc_id ** 2 / 1029.4

    # ─── Annular Capacities (bbl/ft) ─────────────────────────
    annular_dp = (well.hole_size ** 2 - well.drill_pipe_od ** 2) / 1029.4
    annular_hwdp = (well.hole_size ** 2 - well.hwdp_od ** 2) / 1029.4
    annular_dc = (well.hole_size ** 2 - well.dc_od ** 2) / 1029.4

    # ─── Displacements (bbl/ft) ──────────────────────────────
    displacement_dp = (well.drill_pipe_od ** 2 - well.drill_pipe_id ** 2) / 1029.4
    displacement_hwdp = (well.hwdp_od ** 2 - well.hwdp_id ** 2) / 1029.4
    displacement_dc = (well.dc_od ** 2 - well.dc_id ** 2) / 1029.4

    # ─── Inside Volumes (bbl) ────────────────────────────────
    volume_inside_dp = drill_pipe_capacity * well.drill_pipe_length
    volume_inside_hwdp = hwdp_capacity * well.hwdp_length
    volume_inside_dc = dc_capacity * well.dc_length
    total_inside_volume = volume_inside_dp + volume_inside_hwdp + volume_inside_dc

    # ─── Annular Volumes (bbl) ───────────────────────────────
    volume_annular_dp = annular_dp * well.drill_pipe_length
    volume_annular_hwdp = annular_hwdp * well.hwdp_length
    volume_annular_dc = annular_dc * well.dc_length
    total_annular_volume = (
        volume_annular_dp + volume_annular_hwdp + volume_annular_dc
    )

    # ─── Total System ────────────────────────────────────────
    total_system_volume = total_inside_volume + total_annular_volume

    # ─── Open Hole Volume ────────────────────────────────────
    string_length = well.drill_pipe_length + well.hwdp_length + well.dc_length
    open_hole_length = well.total_depth - string_length
    open_hole_volume = hole_capacity * max(0.0, open_hole_length)

    return VolumetricsResult(
        hole_capacity=hole_capacity,
        drill_pipe_capacity=drill_pipe_capacity,
        hwdp_capacity=hwdp_capacity,
        dc_capacity=dc_capacity,
        annular_dp=annular_dp,
        annular_hwdp=annular_hwdp,
        annular_dc=annular_dc,
        displacement_dp=displacement_dp,
        displacement_hwdp=displacement_hwdp,
        displacement_dc=displacement_dc,
        volume_inside_dp=volume_inside_dp,
        volume_inside_hwdp=volume_inside_hwdp,
        volume_inside_dc=volume_inside_dc,
        total_inside_volume=total_inside_volume,
        volume_annular_dp=volume_annular_dp,
        volume_annular_hwdp=volume_annular_hwdp,
        volume_annular_dc=volume_annular_dc,
        total_annular_volume=total_annular_volume,
        total_system_volume=total_system_volume,
        open_hole_volume=open_hole_volume,
    )


def calculate_volumetrics_batch(
    well: WellData,
    casing_sections: list[dict[str, float]],
) -> list[VolumetricsResult]:
    """Batch calculate volumetrics for multiple casing sections.

    Each section dict should have: hole_size, od, id, length.
    This is a Python-exclusive feature not available in the TS engine.

    Args:
        well: Base well data (used for total_depth reference).
        casing_sections: List of casing section parameters.

    Returns:
        List of VolumetricsResult, one per section.
    """
    results: list[VolumetricsResult] = []
    for section in casing_sections:
        section_well = WellData(
            total_depth=well.total_depth,
            tvd=well.tvd,
            hole_size=section.get("hole_size", well.hole_size),
            drill_pipe_od=section.get("od", well.drill_pipe_od),
            drill_pipe_id=section.get("id", well.drill_pipe_id),
            drill_pipe_length=section.get("length", well.drill_pipe_length),
            hwdp_od=well.hwdp_od,
            hwdp_id=well.hwdp_id,
            hwdp_length=0.0,
            dc_od=well.dc_od,
            dc_id=well.dc_id,
            dc_length=0.0,
            bit_size=well.bit_size,
            bit_nozzles=well.bit_nozzles,
        )
        results.append(calculate_volumetrics(section_well))
    return results
