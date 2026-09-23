# ============================================================
# Drilling Engine — Test Fixtures
# Pytest configuration and shared data
# PersonalOS · Oil & Gas Side Project
# ============================================================

import pytest
from drilling.types import (
    WellData,
    MudData,
    FormationData,
    PumpData,
)


@pytest.fixture
def standard_well():
    """Returns a standard vertical well configuration."""
    return WellData(
        total_depth=10000.0,
        tvd=10000.0,
        hole_size=8.5,
        drill_pipe_od=5.0,
        drill_pipe_id=4.276,
        drill_pipe_length=9000.0,
        hwdp_od=5.0,
        hwdp_id=3.0,
        hwdp_length=500.0,
        dc_od=6.5,
        dc_id=2.75,
        dc_length=500.0,
        bit_size=8.5,
        bit_nozzles=[12.0, 12.0, 12.0],
    )


@pytest.fixture
def heavy_mud():
    """Returns a heavy mud configuration."""
    return MudData(
        mud_weight=12.5,
        theta600=70,
        theta300=40,
        theta200=30,
        theta100=20,
        theta6=6,
        theta3=4,
        gel_10sec=10,
        gel_10min=20,
    )


@pytest.fixture
def standard_formation():
    """Returns standard formation pressures."""
    return FormationData(
        pore_pressure_gradient=0.465,  # 8.94 ppg
        fracture_gradient=0.75,       # 14.42 ppg
        normal_gradient=0.465,
    )


@pytest.fixture
def triplex_pump():
    """Returns a standard triplex pump configuration."""
    return PumpData(
        pump_type="Triplex",
        liner_diameter=6.0,
        stroke_length=12.0,
        strokes_per_minute=80,
        efficiency=95,
        number_of_pumps=2,
        standpipe_pressure=3000,
    )
