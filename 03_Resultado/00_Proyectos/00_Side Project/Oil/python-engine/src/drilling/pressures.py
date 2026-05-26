# ============================================================
# Drilling Engine — Pressures
# Pore, fracture, hydrostatic, mud window, Monte Carlo
# Reference: Well Control Institute · IADC
# ============================================================

"""Formation and wellbore pressure calculations.

Key formula: P_hydrostatic = MW × 0.052 × TVD
Monte Carlo: Uncertainty analysis via numpy.random
"""

from __future__ import annotations

import numpy as np

from drilling.types import FormationData, MudData, WellData, PressureResult


def calculate_pressures(
    formation: FormationData,
    mud: MudData,
    well: WellData,
) -> PressureResult:
    """Calculate formation pressures, hydrostatic pressure,
    mud window, and overbalance.

    Args:
        formation: Formation pressure gradients.
        mud: Mud properties.
        well: Well geometry.

    Returns:
        PressureResult with all calculated pressures.
    """
    # ─── Formation Pressures ─────────────────────────────────
    pore_pressure = formation.pore_pressure_gradient * well.tvd
    fracture_pressure = formation.fracture_gradient * well.tvd

    # ─── Hydrostatic ─────────────────────────────────────────
    mud_gradient = mud.mud_weight * 0.052
    hydrostatic_pressure = mud_gradient * well.tvd

    # ─── Mud Window ──────────────────────────────────────────
    min_mud_weight = formation.pore_pressure_gradient / 0.052
    max_mud_weight = formation.fracture_gradient / 0.052
    mud_window = max_mud_weight - min_mud_weight

    # ─── Overbalance ─────────────────────────────────────────
    overbalance = hydrostatic_pressure - pore_pressure
    overbalance_ppg = (
        overbalance / (0.052 * well.tvd) if well.tvd > 0 else 0.0
    )

    return PressureResult(
        pore_pressure=pore_pressure,
        fracture_pressure=fracture_pressure,
        hydrostatic_pressure=hydrostatic_pressure,
        mud_gradient=mud_gradient,
        min_mud_weight=min_mud_weight,
        max_mud_weight=max_mud_weight,
        mud_window=mud_window,
        overbalance=overbalance,
        overbalance_ppg=overbalance_ppg,
    )


def monte_carlo_mud_window(
    formation: FormationData,
    well: WellData,
    n_simulations: int = 10_000,
    pore_std: float = 0.01,
    fracture_std: float = 0.02,
    seed: int | None = None,
) -> dict[str, float]:
    """Monte Carlo uncertainty analysis for mud window.

    Varies pore pressure and fracture gradients with normal distribution
    to estimate confidence intervals for the mud window.

    Args:
        formation: Base formation data.
        well: Well geometry (TVD).
        n_simulations: Number of Monte Carlo iterations.
        pore_std: Standard deviation for pore gradient (psi/ft).
        fracture_std: Standard deviation for fracture gradient (psi/ft).
        seed: Random seed for reproducibility.

    Returns:
        Dict with: mean, std, p10, p50, p90, min, max (all in ppg).
    """
    rng = np.random.default_rng(seed)

    pore_samples = rng.normal(
        formation.pore_pressure_gradient, pore_std, n_simulations
    )
    fracture_samples = rng.normal(
        formation.fracture_gradient, fracture_std, n_simulations
    )

    min_mw = pore_samples / 0.052
    max_mw = fracture_samples / 0.052
    windows = max_mw - min_mw

    return {
        "mean": float(np.mean(windows)),
        "std": float(np.std(windows)),
        "p10": float(np.percentile(windows, 10)),
        "p50": float(np.percentile(windows, 50)),
        "p90": float(np.percentile(windows, 90)),
        "min": float(np.min(windows)),
        "max": float(np.max(windows)),
    }
