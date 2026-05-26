# ============================================================
# Drilling Engine — PDF Generator
# ReportLab + Matplotlib integration
# PersonalOS · Oil & Gas Side Project
# ============================================================

"""Professional drilling report generator.

Generates multi-page PDF reports with:
- Well data summary
- Calculation results (Volumetrics, Hydraulics, etc.)
- Trajectory plots (embedded from matplotlib)
- Branding and professional layout
"""

from __future__ import annotations

import io
from dataclasses import asdict
from datetime import datetime
from pathlib import Path

import matplotlib.pyplot as plt
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Image,
    PageBreak,
)

from drilling.types import (
    DrillingResults,
    WellData,
    MudData,
    PumpData,
)
from drilling.directional import plot_trajectory, SurveyResult

# ─── Constants ────────────────────────────────────────────────

BRAND_COLOR = colors.HexColor("#0070F3")  # Vercel Blue
ACCENT_COLOR = colors.HexColor("#79FFE1")  # Vercel Cyan


class PDFReportGenerator:
    """Generates professional PDF reports for drilling analysis."""

    def __init__(self, filename: str | Path):
        self.filename = str(filename)
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
        self.elements: list[object] = []

    def _setup_custom_styles(self) -> None:
        """Define custom paragraph styles matching the design system."""
        self.styles.add(
            ParagraphStyle(
                name="ReportTitle",
                parent=self.styles["Heading1"],
                fontSize=24,
                leading=28,
                textColor=BRAND_COLOR,
                spaceAfter=20,
            )
        )
        self.styles.add(
            ParagraphStyle(
                name="SectionHeader",
                parent=self.styles["Heading2"],
                fontSize=16,
                leading=20,
                textColor=colors.black,
                spaceBefore=15,
                spaceAfter=10,
                borderPadding=5,
                borderColor=BRAND_COLOR,
                borderWidth=0,
                borderBottomWidth=1,
            )
        )
        self.styles.add(
            ParagraphStyle(
                name="MetricLabel",
                parent=self.styles["Normal"],
                fontSize=10,
                textColor=colors.gray,
            )
        )
        self.styles.add(
            ParagraphStyle(
                name="MetricValue",
                parent=self.styles["Normal"],
                fontSize=12,
                fontName="Helvetica-Bold",
            )
        )

    def generate(
        self,
        well: WellData,
        mud: MudData,
        pump: PumpData,
        results: DrillingResults,
        surveys: list[SurveyResult] | None = None,
    ) -> None:
        """Build and save the PDF report."""
        doc = SimpleDocTemplate(
            self.filename,
            pagesize=A4,
            rightMargin=50,
            leftMargin=50,
            topMargin=50,
            bottomMargin=50,
        )

        # 1. Header & Title
        self._add_header()

        # 2. Input Summary
        self._add_section_header("Drilling Parameters")
        self._add_inputs_table(well, mud, pump)

        # 3. Volumetrics
        self._add_section_header("Volumetrics")
        self._add_volumetrics_table(results.volumetrics)

        # 4. Hydraulics & Pressures
        self._add_section_header("Hydraulics & Pressures")
        self._add_hydraulics_table(results.hydraulics, results.pressures)

        # 5. Alerts
        if results.alerts:
            self._add_section_header("Analysis Alerts")
            self._add_alerts_table(results.alerts)

        # 6. Trajectory Plot (if surveys provided)
        if surveys:
            self.elements.append(PageBreak())
            self._add_section_header("Well Trajectory")
            self._add_trajectory_plot(surveys)

        # Build PDF
        doc.build(self.elements)

    def _add_header(self) -> None:
        """Add report header with title and date."""
        title = Paragraph("Drilling Engineering Report", self.styles["ReportTitle"])
        date = Paragraph(
            f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}",
            self.styles["Normal"],
        )
        self.elements.append(title)
        self.elements.append(date)
        self.elements.append(Spacer(1, 20))

    def _add_section_header(self, text: str) -> None:
        """Add a styled section header."""
        header = Paragraph(text, self.styles["SectionHeader"])
        self.elements.append(header)

    def _add_inputs_table(
        self, well: WellData, mud: MudData, pump: PumpData
    ) -> None:
        """Create a table summarizing key inputs."""
        data = [
            ["Parameter", "Value", "Unit"],
            ["Total Depth (MD)", f"{well.total_depth:,.0f}", "ft"],
            ["TVD", f"{well.tvd:,.0f}", "ft"],
            ["Mud Weight", f"{mud.mud_weight:.1f}", "ppg"],
            ["Plastic Viscosity", f"{mud.theta600 - mud.theta300:.0f}", "cP"],
            ["Pump Flow Rate", f"{pump.strokes_per_minute * pump.number_of_pumps:.0f}", "SPM"],
            ["Bit Size", f"{well.bit_size}", "in"],
        ]
        self._add_styled_table(data)

    def _add_volumetrics_table(self, vol: object) -> None:
        """Create volumetrics results table."""
        # Access attributes dynamically
        data = [
            ["Metric", "Value", "Unit"],
            ["Total System Volume", f"{vol.total_system_volume:,.1f}", "bbl"],
            ["Hole Capacity", f"{vol.hole_capacity:.4f}", "bbl/ft"],
            ["Annular Volume (DP)", f"{vol.volume_annular_dp:,.1f}", "bbl"],
            ["String Displacement", f"{vol.displacement_dp:.4f}", "bbl/ft"],
        ]
        self._add_styled_table(data)

    def _add_hydraulics_table(self, hyd: object, press: object) -> None:
        """Create hydraulics mixed table."""
        data = [
            ["Metric", "Value", "Unit"],
            ["Hydrostatic Pressure", f"{press.hydrostatic_pressure:,.0f}", "psi"],
            ["Bottom Hole Pressure", f"{hyd.bottom_hole_pressure:,.0f}", "psi"],
            ["ECD", f"{hyd.ecd:.2f}", "ppg"],
            ["Annular Velocity", f"{hyd.annular_velocity:.0f}", "ft/min"],
            ["Bit HHP", f"{hyd.bit_hhp:.1f}", "HP"],
            ["Impact Force", f"{hyd.impact_force:,.0f}", "lbf"],
        ]
        self._add_styled_table(data)

    def _add_alerts_table(self, alerts: list[object]) -> None:
        """Create a table for alerts."""
        data = [["Level", "Message", "Detail"]]
        for alert in alerts:
            # Color code level text manually via Paragraph if needed,
            # but for now just text.
            data.append([
                alert.level.value.upper(),
                alert.message,
                alert.detail,
            ])

        # Custom style for alerts
        t = Table(data, colWidths=[1.0 * inch, 2.5 * inch, 3.0 * inch])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.whitesmoke),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ]))
        self.elements.append(t)
        self.elements.append(Spacer(1, 15))

    def _add_styled_table(self, data: list[list[str]]) -> None:
        """Render a standard styled table."""
        t = Table(data, colWidths=[2.5 * inch, 2.0 * inch, 1.5 * inch])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), BRAND_COLOR),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
            ('BACKGROUND', (0, 1), (-1, -1), colors.whitesmoke),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
            ('ALIGN', (1, 1), (-1, -1), 'RIGHT'),  # Values aligned right
        ]))
        self.elements.append(t)
        self.elements.append(Spacer(1, 15))

    def _add_trajectory_plot(self, surveys: list[SurveyResult]) -> None:
        """Generate and embed a trajectory plot."""
        fig = plot_trajectory(surveys)

        # Save plot to memory buffer
        buf = io.BytesIO()
        # Matplotlib Figure to image
        fig.savefig(buf, format='png', dpi=100, bbox_inches='tight')
        buf.seek(0)
        plt.close(fig)

        # Embed in ReportLab
        img = Image(buf, width=6 * inch, height=4.5 * inch)
        self.elements.append(img)
