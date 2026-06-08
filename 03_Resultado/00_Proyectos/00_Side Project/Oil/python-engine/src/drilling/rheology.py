# ============================================================
# Drilling Engine — Rheology
# Bingham Plastic, Power Law, Herschel-Bulkley, Robertson-Stiff
# Reference: API RP 13B-1 (Water-based muds)
# ============================================================

"""Mud rheological property calculations.

Models:
- Bingham Plastic: PV = θ600 − θ300, YP = θ300 − PV
- Power Law: n = 3.32 × log(θ600/θ300), K = 5.11×θ300 / 511^n
- Herschel-Bulkley (Advanced): τ = τ₀ + K·γ̇ⁿ (scipy curve_fit)
- Robertson-Stiff (Advanced): τ = A·(γ̇ + C)^B
"""

from __future__ import annotations

import math
from typing import TYPE_CHECKING

import numpy as np

from drilling.types import MudData, RheologyResult

if TYPE_CHECKING:
    from numpy.typing import NDArray


def calculate_rheology(mud: MudData) -> RheologyResult:
    """Calculate mud rheological properties from Fann viscometer readings.

    Args:
        mud: Mud properties with viscometer readings.

    Returns:
        RheologyResult with Bingham Plastic and Power Law parameters.
    """
    # ─── Bingham Plastic Model ───────────────────────────────
    plastic_viscosity = mud.theta600 - mud.theta300  # cP
    yield_point = mud.theta300 - plastic_viscosity    # lb/100ft²
    apparent_viscosity = mud.theta600 / 2.0           # cP

    # ─── Gel Strengths ───────────────────────────────────────
    gel_10sec = mud.gel_10sec
    gel_10min = mud.gel_10min
    gel_progression = mud.gel_10min / mud.gel_10sec if mud.gel_10sec > 0 else 0.0

    # ─── Power Law Model ─────────────────────────────────────
    ratio = mud.theta600 / mud.theta300 if mud.theta300 > 0 else 1.0
    n = 3.32 * math.log10(ratio) if ratio > 0 else 0.0  # Flow behavior index
    k = (5.11 * mud.theta300) / (511.0 ** n) if n != 0 else 0.0  # Consistency index

    # ─── Ratios ──────────────────────────────────────────────
    pv_yp_ratio = plastic_viscosity / yield_point if yield_point > 0 else 0.0

    return RheologyResult(
        plastic_viscosity=plastic_viscosity,
        yield_point=yield_point,
        apparent_viscosity=apparent_viscosity,
        gel_10sec=gel_10sec,
        gel_10min=gel_10min,
        gel_progression=gel_progression,
        n=n,
        k=k,
        pv_yp_ratio=pv_yp_ratio,
    )


def fit_herschel_bulkley(
    mud: MudData,
) -> dict[str, float]:
    """Fit Herschel-Bulkley model: τ = τ₀ + K·γ̇ⁿ

    Uses scipy curve_fit for nonlinear regression on Fann readings.

    Args:
        mud: Mud data with viscometer readings.

    Returns:
        Dict with keys: tau0 (yield stress), K, n, r_squared.
    """
    from scipy.optimize import curve_fit

    # Fann shear rates (1/s) = RPM × 1.7023
    shear_rates = np.array([1021.38, 510.69, 340.46, 170.23, 10.21, 5.11])
    # Shear stress (lb/100ft²) = dial reading × 1.0678
    shear_stresses = np.array([
        mud.theta600 * 1.0678,
        mud.theta300 * 1.0678,
        mud.theta200 * 1.0678,
        mud.theta100 * 1.0678,
        mud.theta6 * 1.0678,
        mud.theta3 * 1.0678,
    ])

    def hb_model(
        gamma_dot: NDArray[np.float64],
        tau0: float,
        k_param: float,
        n_param: float,
    ) -> NDArray[np.float64]:
        return tau0 + k_param * np.power(gamma_dot, n_param)

    try:
        popt, _ = curve_fit(
            hb_model,
            shear_rates,
            shear_stresses,
            p0=[1.0, 0.5, 0.5],
            bounds=([0, 0, 0], [100, 100, 2]),
            maxfev=5000,
        )
        tau0, k_fit, n_fit = popt

        # R² calculation
        predicted = hb_model(shear_rates, tau0, k_fit, n_fit)
        ss_res = float(np.sum((shear_stresses - predicted) ** 2))
        ss_tot = float(np.sum((shear_stresses - np.mean(shear_stresses)) ** 2))
        r_squared = 1.0 - (ss_res / ss_tot) if ss_tot > 0 else 0.0

        return {
            "tau0": float(tau0),
            "K": float(k_fit),
            "n": float(n_fit),
            "r_squared": r_squared,
        }
    except (RuntimeError, ValueError):
        return {"tau0": 0.0, "K": 0.0, "n": 0.0, "r_squared": 0.0}


def fit_robertson_stiff(
    mud: MudData,
) -> dict[str, float]:
    """Fit Robertson-Stiff model: τ = A·(γ̇ + C)^B

    Args:
        mud: Mud data with viscometer readings.

    Returns:
        Dict with keys: A, B, C, r_squared.
    """
    from scipy.optimize import curve_fit

    shear_rates = np.array([1021.38, 510.69, 340.46, 170.23, 10.21, 5.11])
    shear_stresses = np.array([
        mud.theta600 * 1.0678,
        mud.theta300 * 1.0678,
        mud.theta200 * 1.0678,
        mud.theta100 * 1.0678,
        mud.theta6 * 1.0678,
        mud.theta3 * 1.0678,
    ])

    def rs_model(
        gamma_dot: NDArray[np.float64],
        a_param: float,
        b_param: float,
        c_param: float,
    ) -> NDArray[np.float64]:
        return a_param * np.power(gamma_dot + c_param, b_param)

    try:
        popt, _ = curve_fit(
            rs_model,
            shear_rates,
            shear_stresses,
            p0=[1.0, 0.5, 10.0],
            bounds=([0, 0, 0], [1000, 2, 500]),
            maxfev=5000,
        )
        a_fit, b_fit, c_fit = popt

        predicted = rs_model(shear_rates, a_fit, b_fit, c_fit)
        ss_res = float(np.sum((shear_stresses - predicted) ** 2))
        ss_tot = float(np.sum((shear_stresses - np.mean(shear_stresses)) ** 2))
        r_squared = 1.0 - (ss_res / ss_tot) if ss_tot > 0 else 0.0

        return {
            "A": float(a_fit),
            "B": float(b_fit),
            "C": float(c_fit),
            "r_squared": r_squared,
        }
    except (RuntimeError, ValueError):
        return {"A": 0.0, "B": 0.0, "C": 0.0, "r_squared": 0.0}
