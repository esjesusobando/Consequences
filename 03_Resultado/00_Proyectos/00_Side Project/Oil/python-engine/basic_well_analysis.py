# ============================================================
# Drilling Engine — Basic Well Analysis Example
# PersonalOS · Oil & Gas Side Project
# ============================================================

"""Example of how to use the drilling engine to perform an analysis."""

from drilling.types import WellData, MudData, FormationData, PumpData
from drilling.orchestrator import run_drilling_calculations
from drilling.pdf_generator import PDFReportGenerator
import os

def main():
    print("🚀 Starting Drilling Analysis...")

    # 1. Define Well Configuration
    well = WellData(
        total_depth=12000,
        tvd=11500,
        hole_size=8.5,
        drill_pipe_od=5.0,
        drill_pipe_id=4.276,
        drill_pipe_length=11000,
        hwdp_od=5.0,
        hwdp_id=3.0,
        hwdp_length=500,
        dc_od=6.5,
        dc_id=2.75,
        dc_length=500,
        bit_size=8.5,
        bit_nozzles=[12, 12, 12]
    )

    # 2. Define Mud Properties
    mud = MudData(
        mud_weight=11.2,
        theta600=55,
        theta300=32,
        theta200=25,
        theta100=18,
        theta6=6,
        theta3=5,
        gel_10sec=5,
        gel_10min=12
    )

    # 3. Define Formation window
    formation = FormationData(
        pore_pressure_gradient=0.48, # 9.2 ppg
        fracture_gradient=0.72,      # 13.8 ppg
        normal_gradient=0.465
    )

    # 4. Define Pump Config
    pump = PumpData(
        pump_type="Triplex",
        liner_diameter=6.0,
        stroke_length=12.0,
        strokes_per_minute=90,
        efficiency=95,
        number_of_pumps=2,
        standpipe_pressure=3200
    )

    # 5. Run Orchestrator
    results = run_drilling_calculations(well, mud, formation, pump)

    print(f"📊 Results Generated:")
    print(f"   - Total Volume: {results.volumetrics.total_system_volume:,.1f} bbl")
    print(f"   - ECD: {results.hydraulics.ecd:.2f} ppg")
    print(f"   - Bottoms Up Time: {results.circulation.bottoms_up:,.1f} min")

    if results.alerts:
        print(f"⚠️  Alerts Detected: {len(results.alerts)}")

    # 6. Generate PDF Report
    report_file = "well_analysis_report.pdf"
    generator = PDFReportGenerator(report_file)
    generator.generate(well, mud, pump, results)

    print(f"✅ Report saved to: {os.path.abspath(report_file)}")

if __name__ == "__main__":
    main()
