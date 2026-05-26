# ============================================================
# Drilling Engine — Type Definitions
# Dataclasses mirroring TypeScript types.ts
# PersonalOS · Oil & Gas Side Project
# ============================================================

"""Data models for drilling engineering calculations.

All dataclasses have realistic default values to facilitate
testing and rapid prototyping. Units follow API/IADC standards.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Literal


# ─── Well Geometry ────────────────────────────────────────────


@dataclass
class WellData:
    """Well geometry and drill string dimensions."""

    total_depth: float = 10_000.0     # ft (MD)
    tvd: float = 9_800.0             # ft (TVD)
    hole_size: float = 8.5           # in

    drill_pipe_od: float = 5.0       # in
    drill_pipe_id: float = 4.276     # in
    drill_pipe_length: float = 9_400.0  # ft

    hwdp_od: float = 5.0             # in
    hwdp_id: float = 3.0             # in
    hwdp_length: float = 300.0       # ft

    dc_od: float = 6.75              # in
    dc_id: float = 2.8125            # in
    dc_length: float = 300.0         # ft

    bit_size: float = 8.5            # in
    bit_nozzles: list[float] = field(
        default_factory=lambda: [12.0, 12.0, 12.0]  # 32nds of inch
    )


# ─── Formation ────────────────────────────────────────────────


@dataclass
class FormationData:
    """Formation pressure gradients."""

    pore_pressure_gradient: float = 0.465   # psi/ft
    fracture_gradient: float = 0.735        # psi/ft
    normal_gradient: float = 0.465          # psi/ft


# ─── Mud Properties ───────────────────────────────────────────


@dataclass
class MudData:
    """Mud properties and Fann viscometer readings."""

    mud_weight: float = 10.0    # ppg

    theta600: float = 60.0
    theta300: float = 35.0
    theta200: float = 28.0
    theta100: float = 20.0
    theta6: float = 5.0
    theta3: float = 3.0

    gel_10sec: float = 8.0      # lb/100ft²
    gel_10min: float = 14.0     # lb/100ft²


# ─── Pump Configuration ───────────────────────────────────────


@dataclass
class PumpData:
    """Pump configuration and operating parameters."""

    pump_type: Literal["Triplex", "Duplex"] = "Triplex"
    liner_diameter: float = 6.5      # in
    stroke_length: float = 12.0      # in
    rod_diameter: float = 2.5        # in (Duplex only)
    strokes_per_minute: float = 60.0  # SPM
    efficiency: float = 95.0         # %
    number_of_pumps: int = 2
    standpipe_pressure: float = 3_000.0  # psi


# ─── Calculation Results ──────────────────────────────────────


@dataclass
class VolumetricsResult:
    """Well volumetrics calculation results."""

    hole_capacity: float = 0.0         # bbl/ft
    drill_pipe_capacity: float = 0.0
    hwdp_capacity: float = 0.0
    dc_capacity: float = 0.0

    annular_dp: float = 0.0           # bbl/ft
    annular_hwdp: float = 0.0
    annular_dc: float = 0.0

    displacement_dp: float = 0.0      # bbl/ft
    displacement_hwdp: float = 0.0
    displacement_dc: float = 0.0

    volume_inside_dp: float = 0.0     # bbl
    volume_inside_hwdp: float = 0.0
    volume_inside_dc: float = 0.0
    total_inside_volume: float = 0.0

    volume_annular_dp: float = 0.0    # bbl
    volume_annular_hwdp: float = 0.0
    volume_annular_dc: float = 0.0
    total_annular_volume: float = 0.0

    total_system_volume: float = 0.0
    open_hole_volume: float = 0.0


@dataclass
class RheologyResult:
    """Rheological properties from Fann viscometer readings."""

    plastic_viscosity: float = 0.0    # cP
    yield_point: float = 0.0         # lb/100ft²
    apparent_viscosity: float = 0.0   # cP
    gel_10sec: float = 0.0
    gel_10min: float = 0.0
    gel_progression: float = 0.0
    n: float = 0.0                   # Flow behavior index
    k: float = 0.0                   # Consistency index
    pv_yp_ratio: float = 0.0


@dataclass
class PumpResult:
    """Pump output calculations."""

    output_per_stroke: float = 0.0    # bbl/stroke
    flow_rate_gpm: float = 0.0       # gpm
    flow_rate_bbl_min: float = 0.0   # bbl/min
    hydraulic_hp: float = 0.0        # HP


@dataclass
class CirculationResult:
    """Circulation time calculations."""

    surface_to_bit: float = 0.0      # min
    bit_to_surface: float = 0.0      # min
    full_circulation: float = 0.0    # min
    bottoms_up: float = 0.0          # min
    lag_strokes: float = 0.0         # strokes
    lag_time: float = 0.0            # min


@dataclass
class PressureResult:
    """Formation and wellbore pressure calculations."""

    pore_pressure: float = 0.0       # psi
    fracture_pressure: float = 0.0   # psi
    hydrostatic_pressure: float = 0.0  # psi
    mud_gradient: float = 0.0        # psi/ft
    min_mud_weight: float = 0.0      # ppg
    max_mud_weight: float = 0.0      # ppg
    mud_window: float = 0.0          # ppg
    overbalance: float = 0.0         # psi
    overbalance_ppg: float = 0.0     # ppg


@dataclass
class HydraulicsResult:
    """Drilling hydraulics calculation results."""

    annular_velocity: float = 0.0    # ft/min
    pipe_velocity: float = 0.0      # ft/min
    total_flow_area: float = 0.0    # in²
    nozzle_velocity: float = 0.0    # ft/sec

    pressure_loss_dp: float = 0.0   # psi
    pressure_loss_hwdp: float = 0.0
    pressure_loss_dc: float = 0.0
    pressure_loss_bit: float = 0.0
    pressure_loss_annular: float = 0.0
    total_pressure_loss: float = 0.0

    ecd: float = 0.0               # ppg
    bottom_hole_pressure: float = 0.0  # psi

    bit_hhp: float = 0.0           # HP
    hhp_per_sq_in: float = 0.0     # HP/in²
    impact_force: float = 0.0      # lbs
    impact_per_sq_in: float = 0.0  # lbs/in²


# ─── Alerts ───────────────────────────────────────────────────


class AlertLevel(Enum):
    """Alert severity levels."""

    CRITICAL = "critical"
    WARNING = "warning"
    INFO = "info"


@dataclass
class DrillingAlert:
    """A drilling engineering alert or warning."""

    level: AlertLevel = AlertLevel.INFO
    message: str = ""
    detail: str = ""
    module: str = ""


# ─── Validation ───────────────────────────────────────────────


class ValidationStatus(Enum):
    """Validation result status."""

    VALID = "valid"
    WARNING = "warning"
    ERROR = "error"
    PENDING = "pending"
    NEUTRAL = "neutral"


@dataclass
class ValidationResult:
    """Single validation check result."""

    status: ValidationStatus = ValidationStatus.PENDING
    message: str = ""


# ─── Aggregated Results ──────────────────────────────────────


@dataclass
class DrillingResults:
    """Complete drilling calculation output."""

    volumetrics: VolumetricsResult = field(default_factory=VolumetricsResult)
    rheology: RheologyResult = field(default_factory=RheologyResult)
    pump: PumpResult = field(default_factory=PumpResult)
    circulation: CirculationResult = field(default_factory=CirculationResult)
    pressures: PressureResult = field(default_factory=PressureResult)
    hydraulics: HydraulicsResult = field(default_factory=HydraulicsResult)
    alerts: list[DrillingAlert] = field(default_factory=list)
