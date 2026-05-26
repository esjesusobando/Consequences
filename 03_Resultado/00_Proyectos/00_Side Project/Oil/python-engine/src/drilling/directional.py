# ============================================================
# Drilling Engine — Directional Drilling
# Minimum curvature method, survey calculations, 3D trajectory
# Reference: SPE · Bourgoyne et al.
# ============================================================

"""Directional drilling survey calculations.

Implements the minimum curvature method for converting survey
measurements (MD, inclination, azimuth) into 3D coordinates.
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field

import numpy as np


@dataclass
class SurveyStation:
    """A single directional survey station."""

    md: float = 0.0       # Measured depth (ft)
    inc: float = 0.0      # Inclination (degrees)
    azi: float = 0.0      # Azimuth (degrees)


@dataclass
class SurveyResult:
    """Calculated position for a survey station."""

    md: float = 0.0
    tvd: float = 0.0
    ns: float = 0.0        # North/South (+N, −S)
    ew: float = 0.0        # East/West (+E, −W)
    vs: float = 0.0        # Vertical section
    dls: float = 0.0       # Dogleg severity (°/100ft)
    build_rate: float = 0.0
    turn_rate: float = 0.0


def minimum_curvature(
    surveys: list[SurveyStation],
    vs_azimuth: float = 0.0,
) -> list[SurveyResult]:
    """Calculate 3D well path using minimum curvature method.

    Args:
        surveys: List of survey stations (MD, Inc, Azi).
        vs_azimuth: Vertical section azimuth reference (degrees).

    Returns:
        List of SurveyResult with TVD, N/S, E/W, VS, DLS for each station.
    """
    if not surveys:
        return []

    results: list[SurveyResult] = [
        SurveyResult(md=surveys[0].md, tvd=0.0, ns=0.0, ew=0.0, vs=0.0, dls=0.0)
    ]

    cumulative_tvd = 0.0
    cumulative_ns = 0.0
    cumulative_ew = 0.0

    for i in range(1, len(surveys)):
        upper = surveys[i - 1]
        lower = surveys[i]

        delta_md = lower.md - upper.md
        if delta_md <= 0:
            results.append(SurveyResult(
                md=lower.md, tvd=cumulative_tvd,
                ns=cumulative_ns, ew=cumulative_ew,
            ))
            continue

        # Convert to radians
        i1 = math.radians(upper.inc)
        i2 = math.radians(lower.inc)
        a1 = math.radians(upper.azi)
        a2 = math.radians(lower.azi)

        # Dogleg angle (β)
        cos_beta = (
            math.cos(i2 - i1)
            - math.sin(i1) * math.sin(i2) * (1 - math.cos(a2 - a1))
        )
        cos_beta = max(-1.0, min(1.0, cos_beta))
        beta = math.acos(cos_beta)

        # Ratio factor (RF)
        if beta > 1e-7:
            rf = (2.0 / beta) * math.tan(beta / 2.0)
        else:
            rf = 1.0

        # Increments
        delta_tvd = (delta_md / 2.0) * (math.cos(i1) + math.cos(i2)) * rf
        delta_ns = (delta_md / 2.0) * (
            math.sin(i1) * math.cos(a1) + math.sin(i2) * math.cos(a2)
        ) * rf
        delta_ew = (delta_md / 2.0) * (
            math.sin(i1) * math.sin(a1) + math.sin(i2) * math.sin(a2)
        ) * rf

        cumulative_tvd += delta_tvd
        cumulative_ns += delta_ns
        cumulative_ew += delta_ew

        # Vertical Section
        vs_rad = math.radians(vs_azimuth)
        vs = cumulative_ns * math.cos(vs_rad) + cumulative_ew * math.sin(vs_rad)

        # Dogleg Severity (°/100ft)
        dls = math.degrees(beta) * (100.0 / delta_md) if delta_md > 0 else 0.0

        # Build & Turn rates
        delta_inc = lower.inc - upper.inc
        delta_azi = lower.azi - upper.azi
        build_rate = (delta_inc / delta_md) * 100.0 if delta_md > 0 else 0.0
        turn_rate = (delta_azi / delta_md) * 100.0 if delta_md > 0 else 0.0

        results.append(SurveyResult(
            md=lower.md,
            tvd=cumulative_tvd,
            ns=cumulative_ns,
            ew=cumulative_ew,
            vs=vs,
            dls=dls,
            build_rate=build_rate,
            turn_rate=turn_rate,
        ))

    return results


def plot_trajectory(
    results: list[SurveyResult],
    output_path: str | None = None,
) -> object:
    """Plot 3D well trajectory using matplotlib.

    Args:
        results: List of SurveyResult from minimum_curvature().
        output_path: If provided, save figure to this path.

    Returns:
        matplotlib Figure object.
    """
    import matplotlib.pyplot as plt

    ns = [r.ns for r in results]
    ew = [r.ew for r in results]
    tvd = [-r.tvd for r in results]  # Negative for depth convention

    fig = plt.figure(figsize=(10, 8))
    ax = fig.add_subplot(111, projection="3d")

    ax.plot(ew, ns, tvd, "b-o", markersize=3, linewidth=1.5)
    ax.set_xlabel("East/West (ft)")
    ax.set_ylabel("North/South (ft)")
    ax.set_zlabel("TVD (ft)")
    ax.set_title("Well Trajectory — Minimum Curvature")
    ax.invert_zaxis()

    if output_path:
        fig.savefig(output_path, dpi=150, bbox_inches="tight")

    return fig
