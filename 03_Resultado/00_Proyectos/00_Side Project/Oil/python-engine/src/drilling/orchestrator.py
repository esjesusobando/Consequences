# ============================================================
# Drilling Engine — Orchestrator
# Coordinates all engines, mirrors orchestrator.ts
# PersonalOS · Oil & Gas Side Project
# ============================================================

"""Central orchestrator for drilling calculations.

Runs all calculation modules in sequence respecting dependencies,
then aggregates results into a single DrillingResults object.
"""

from __future__ import annotations

from drilling.types import (
    WellData,
    MudData,
    FormationData,
    PumpData,
    DrillingResults,
    DrillingAlert,
    AlertLevel,
)

from drilling.volumetrics import calculate_volumetrics
from drilling.rheology import calculate_rheology
from drilling.pump import calculate_pump
from drilling.pressures import calculate_pressures
from drilling.circulation import calculate_circulation
from drilling.hydraulics import calculate_hydraulics


def _generate_alerts(
    mud: MudData,
    pressures: object,
    hydraulics: object,
    rheology: object,
) -> list[DrillingAlert]:
    """Generate drilling alerts from calculation results.

    Mirrors the alert-engine.ts logic.
    """
    alerts: list[DrillingAlert] = []
    p = pressures  # type: ignore[assignment]
    h = hydraulics  # type: ignore[assignment]
    r = rheology  # type: ignore[assignment]

    # ─── Pressure Alerts ─────────────────────────────────────
    if p.overbalance < 0:
        alerts.append(DrillingAlert(
            level=AlertLevel.CRITICAL,
            message="Underbalanced Condition",
            detail=f"Overbalance: {p.overbalance:.0f} psi — risk of kick",
            module="pressures",
        ))
    elif p.overbalance < 200:
        alerts.append(DrillingAlert(
            level=AlertLevel.WARNING,
            message="Low Overbalance",
            detail=f"Overbalance: {p.overbalance:.0f} psi — monitor closely",
            module="pressures",
        ))

    # ─── ECD Alert ───────────────────────────────────────────
    if p.max_mud_weight > 0 and h.ecd > p.max_mud_weight:
        alerts.append(DrillingAlert(
            level=AlertLevel.CRITICAL,
            message="ECD Exceeds Fracture Gradient",
            detail=f"ECD: {h.ecd:.2f} ppg > Max MW: {p.max_mud_weight:.2f} ppg",
            module="hydraulics",
        ))
    elif p.max_mud_weight > 0 and h.ecd > (p.max_mud_weight * 0.95):
        alerts.append(DrillingAlert(
            level=AlertLevel.WARNING,
            message="ECD Near Fracture Limit",
            detail=f"ECD: {h.ecd:.2f} ppg (95%+ of max {p.max_mud_weight:.2f} ppg)",
            module="hydraulics",
        ))

    # ─── Rheology Alerts ─────────────────────────────────────
    if r.plastic_viscosity > 40:
        alerts.append(DrillingAlert(
            level=AlertLevel.WARNING,
            message="High Plastic Viscosity",
            detail=f"PV: {r.plastic_viscosity:.0f} cP — consider dilution",
            module="rheology",
        ))

    if r.gel_progression > 3.0:
        alerts.append(DrillingAlert(
            level=AlertLevel.WARNING,
            message="Progressive Gel Strength",
            detail=f"Gel ratio: {r.gel_progression:.1f}x — risk of stuck pipe",
            module="rheology",
        ))

    # ─── Mud Weight Alerts ───────────────────────────────────
    if mud.mud_weight < p.min_mud_weight:
        alerts.append(DrillingAlert(
            level=AlertLevel.CRITICAL,
            message="Mud Weight Below Pore Pressure",
            detail=(
                f"MW: {mud.mud_weight:.2f} ppg < Min: {p.min_mud_weight:.2f} ppg"
            ),
            module="pressures",
        ))

    return alerts


def run_drilling_calculations(
    well: WellData,
    mud: MudData,
    formation: FormationData,
    pump_data: PumpData,
) -> DrillingResults:
    """Run all drilling calculations in dependency order.

    Execution order:
    1. Volumetrics (independent)
    2. Rheology (independent)
    3. Pump (independent)
    4. Pressures (depends on well, formation, mud)
    5. Circulation (depends on volumetrics, pump)
    6. Hydraulics (depends on everything)

    Args:
        well: Well geometry data.
        mud: Mud properties.
        formation: Formation pressure data.
        pump_data: Pump configuration.

    Returns:
        DrillingResults with all calculation outputs and alerts.
    """
    # 1. Independent calculations
    volumetrics = calculate_volumetrics(well)
    rheology = calculate_rheology(mud)
    pump_result = calculate_pump(pump_data)

    # 2. Dependent calculations
    pressures = calculate_pressures(formation, mud, well)
    circulation = calculate_circulation(
        volumetrics, pump_result, pump_data.number_of_pumps
    )
    hydraulics = calculate_hydraulics(well, mud, rheology, pump_result, pressures)

    # 3. Alert generation
    alerts = _generate_alerts(mud, pressures, hydraulics, rheology)

    return DrillingResults(
        volumetrics=volumetrics,
        rheology=rheology,
        pump=pump_result,
        circulation=circulation,
        pressures=pressures,
        hydraulics=hydraulics,
        alerts=alerts,
    )
