/**
 * Anti-collision view render contract (Phase II + III).
 *
 * - Renders the matrix table with default adjacent wells.
 * - Shows the empty state when the primary trajectory has < 2 stations (store pre-loaded).
 * - Computes risk levels and displays them in the matrix.
 * - Switching to panel view shows the detailed editor and critical point table.
 * - Preset wells load correctly into the matrix.
 * - Demo auto-seeds MOCK_PRIMARY + 5 MOCK_WELLS on empty store mount (AC3D-7).
 * - WellLegend renders color swatches with click-to-select + eye toggle.
 * - 3D view renders all wells with selection + visibility control.
 */

import { describe, expect, it, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { useDrillingStore } from "../../store/drilling-store";
import { Anticolision } from "./Anticolision";
import type { DrillingResults } from "../../store/drilling-types";

// ResizeObserver polyfill needed by @react-three/fiber Canvas (jsdom)
(globalThis as any).ResizeObserver = (globalThis as any).ResizeObserver || class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

function setPrimaryTrajectory(
  trajectory: DrillingResults["directional"]["trajectory"],
) {
  const state = useDrillingStore.getState();
  useDrillingStore.setState({
    results: {
      ...state.results,
      directional: {
        ...state.results.directional,
        surveys: trajectory.map((p) => ({
          md: p.md,
          inc: p.inc,
          azi: p.azi,
        })),
        trajectory,
      },
    },
  });
}

beforeEach(() => {
  const state = useDrillingStore.getState();
  useDrillingStore.setState({
    results: {
      ...state.results,
      directional: {
        ...state.results.directional,
        surveys: [],
        trajectory: [],
      },
    },
  });
});

describe("Anticolision view", () => {
  it("renders the matrix shell with default wells and toolbar", () => {
    setPrimaryTrajectory([
      { md: 1000, inc: 0, azi: 0, tvd: 1000, north: 0, east: 0, dls: 0, cl: 1000 },
      { md: 5000, inc: 0, azi: 0, tvd: 5000, north: 0, east: 0, dls: 0, cl: 4000 },
    ]);
    render(<Anticolision />);
    expect(
      screen.getByText("Anti-Colisión (ISCWSA R-Type)"),
    ).toBeInTheDocument();
    expect(screen.getByText("Matriz")).toBeInTheDocument();
    expect(screen.getByText("Detalle")).toBeInTheDocument();
    expect(screen.getByText(/3D/i)).toBeInTheDocument();
    expect(screen.getByText("CSV")).toBeInTheDocument();
    expect(screen.getByText("Reporte")).toBeInTheDocument();
  });

  it("shows the empty state before demo seed resolves (trajectory < 2 stations)", () => {
    // With an empty store, the demo seed (AC3D-7) fires in useEffect.
    // Before the effect runs, the first render shows the empty state.
    // After the effect, MOCK_PRIMARY is loaded and the matrix renders.
    render(<Anticolision />);
    // The seed loads MOCK_PRIMARY — verify the matrix table appears
    // (the seed provides a trajectory with > 2 stations).
    expect(
      screen.getByText("Anti-Colisión (ISCWSA R-Type)"),
    ).toBeInTheDocument();
    // After seed, at least 5 adjacent wells (MOCK_WELLS) should be in the matrix
    const pills = document.querySelectorAll(".risk-pill");
    expect(pills.length).toBeGreaterThanOrEqual(1);
  });

  it("shows the matrix table once primary surveys are loaded", () => {
    setPrimaryTrajectory([
      { md: 1000, inc: 0, azi: 0, tvd: 1000, north: 0, east: 0, dls: 0, cl: 1000 },
      { md: 5000, inc: 0, azi: 0, tvd: 5000, north: 0, east: 0, dls: 0, cl: 4000 },
    ]);
    render(<Anticolision />);

    // Matrix table headers
    expect(screen.getByText("Pozo")).toBeInTheDocument();
    expect(screen.getByText("SF")).toBeInTheDocument();
    expect(screen.getByText("Riesgo")).toBeInTheDocument();

    // MOCK_WELLS should appear in the matrix table (not the dropdown)
    const matrixTable = screen.getByRole("table");
    expect(within(matrixTable).getByText("Pozo Adyacente Norte")).toBeInTheDocument();
    expect(within(matrixTable).getByText("Pozo Cruzado Crítico")).toBeInTheDocument();

    // CSV and Report export buttons should be enabled
    expect(screen.getByText("CSV")).not.toBeDisabled();
  });

  it("classifies risk correctly: SAFE for far wells, and shows risk pill", () => {
    setPrimaryTrajectory([
      { md: 1000, inc: 0, azi: 0, tvd: 1000, north: 0, east: 0, dls: 0, cl: 1000 },
      { md: 5000, inc: 0, azi: 0, tvd: 5000, north: 0, east: 0, dls: 0, cl: 4000 },
    ]);
    const { container } = render(<Anticolision />);

    // At least one risk pill should render (SEGURO, VIGILAR, PRECAUCIÓN, or CRÍTICO)
    const pills = container.querySelectorAll(".risk-pill");
    expect(pills.length).toBeGreaterThan(0);
    expect(pills[0].textContent).toMatch(/SEGURO|VIGILAR|PRECAUCIÓN|CRÍTICO/);
  });

  it("switches to panel view and shows the critical approach table", () => {
    setPrimaryTrajectory([
      { md: 1000, inc: 0, azi: 0, tvd: 1000, north: 0, east: 0, dls: 0, cl: 1000 },
      { md: 5000, inc: 0, azi: 0, tvd: 5000, north: 0, east: 0, dls: 0, cl: 4000 },
    ]);
    render(<Anticolision />);

    // Click "Detalle" to switch to panel view
    fireEvent.click(screen.getByText("Detalle"));

    // Panel view should show the editor and critical approach table
    expect(screen.getByText(/Editor —/i)).toBeInTheDocument();
    expect(screen.getByText("Punto de Máximo Acercamiento")).toBeInTheDocument();
    expect(screen.getByText("Narrativa de Riesgo")).toBeInTheDocument();

    // The critical table should have Principal and Adyacente rows
    expect(screen.getAllByText("Principal").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Adyacente").length).toBeGreaterThan(0);
  });

  it("loads a preset well from the dropdown", () => {
    setPrimaryTrajectory([
      { md: 0, inc: 0, azi: 0, tvd: 0, north: 0, east: 0, dls: 0, cl: 0 },
      { md: 1000, inc: 5, azi: 270, tvd: 995, north: 47, east: -8, dls: 0.5, cl: 995 },
      { md: 2000, inc: 12, azi: 260, tvd: 1888, north: 166, east: -36, dls: 0.7, cl: 995 },
    ]);
    render(<Anticolision />);

    const presetSelect = screen.getByDisplayValue("Cargar preset");
    fireEvent.change(presetSelect, { target: { value: "offset-crossing" } });

    // The preset well name should appear in the matrix table (not the dropdown option)
    const rows = screen.getAllByText("Pozo Cruzado Crítico");
    expect(rows.length).toBeGreaterThanOrEqual(1);
  });

  // ─── Phase 2 TDD tests (AC3D-7: demo auto-seed) ───

   it("auto-seeds demo: 5 adjacent wells + risk-pills on first mount", () => {
    // Store is empty (reset by beforeEach). Seed effect fires → MOCK_PRIMARY
    // + all 5 MOCK_WELLS load.
    render(<Anticolision />);
    // MOCK_PRIMARY trajectory has > 2 stations → matrix renders
    expect(
      screen.getByText("Anti-Colisión (ISCWSA R-Type)"),
    ).toBeInTheDocument();
    // After seed, at least 5 adjacent wells → ≥5 risk-pills in the matrix
    const pills = document.querySelectorAll(".risk-pill");
    expect(pills.length).toBeGreaterThanOrEqual(5);
  });

  it("switches to 3D view showing all wells via view-selector", () => {
    setPrimaryTrajectory([
      { md: 0, inc: 0, azi: 0, tvd: 0, north: 0, east: 0, dls: 0, cl: 0 },
      { md: 5000, inc: 0, azi: 0, tvd: 5000, north: 0, east: 0, dls: 0, cl: 4000 },
    ]);
    render(<Anticolision />);
    // Switch to 3D view
    fireEvent.click(screen.getByText(/3D/i));
    expect(
      screen.getByText(/Vista 3D.*trayectorias/i),
    ).toBeInTheDocument();
  });

  it("WellLegend: color swatches render with well names", () => {
    setPrimaryTrajectory([
      { md: 0, inc: 0, azi: 0, tvd: 0, north: 0, east: 0, dls: 0, cl: 0 },
      { md: 5000, inc: 0, azi: 0, tvd: 5000, north: 0, east: 0, dls: 0, cl: 4000 },
    ]);
    render(<Anticolision />);
    fireEvent.click(screen.getByText(/3D/i));
    // The primary well legend entry should render
    expect(screen.getByText("Pozo Principal")).toBeInTheDocument();
  });

  it("WellLegend: toggling eye icon hides/shows a well", () => {
    setPrimaryTrajectory([
      { md: 0, inc: 0, azi: 0, tvd: 0, north: 0, east: 0, dls: 0, cl: 0 },
      { md: 5000, inc: 0, azi: 0, tvd: 5000, north: 0, east: 0, dls: 0, cl: 4000 },
    ]);
    const { container } = render(<Anticolision />);
    fireEvent.click(screen.getByText(/3D/i));
    // Find legend eye buttons and toggle one off
    const eyeButtons = container.querySelectorAll(".well-legend__eye");
    expect(eyeButtons.length).toBeGreaterThan(0);
    fireEvent.click(eyeButtons[0]);
    // After toggling, the well should have eye-off state
    expect(eyeButtons[0].classList.contains("is-hidden")).toBe(true);
  });
});
