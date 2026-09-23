// ============================================================
// T-WL: WellLegend component (AC3D-3)
// Locks the HTML legend contract: primary + adjacent rows with
// color swatches, click-to-select, eye visibility toggle with
// hover tooltip ("Ocultar este pozo" / "Mostrar"), selected
// highlight, and a primary well that can never be hidden.
// Pure HTML — jsdom-only, no three/R3F imports.
// ============================================================

import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { WellLegend, type WellLegendWell } from "./WellLegend";

const primary: WellLegendWell = {
  id: "primary-demo",
  name: "POZO PRINCIPAL",
  color: "#00b4d8",
  visible: true,
};

const adjNorth: WellLegendWell = {
  id: "offset-north-300",
  name: "Pozo Adyacente Norte",
  color: "#ff006e",
  visible: true,
};

const adjCross: WellLegendWell = {
  id: "offset-crossing",
  name: "Pozo Cruzado Crítico",
  color: "#ffcc00",
  visible: true,
};

const defaultWells = [primary, adjNorth, adjCross];

function renderLegend(overrides: {
  wells?: WellLegendWell[];
  selectedWellId?: string | null;
  onSelect?: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
} = {}) {
  const onSelect = overrides.onSelect ?? vi.fn();
  const onToggleVisibility = overrides.onToggleVisibility ?? vi.fn();
  const utils = render(
    <WellLegend
      wells={overrides.wells ?? defaultWells}
      selectedWellId={overrides.selectedWellId ?? null}
      onSelect={onSelect}
      onToggleVisibility={onToggleVisibility}
    />,
  );
  return { ...utils, onSelect, onToggleVisibility };
}

/** The <li> row that contains the given well name. */
function rowOf(name: string): HTMLElement {
  const row = screen.getByText(name).closest("li");
  expect(row).not.toBeNull();
  return row as HTMLElement;
}

describe("WellLegend", () => {
  it("renders the primary well with its name and color swatch", () => {
    renderLegend();
    expect(screen.getByText("POZO PRINCIPAL")).toBeInTheDocument();

    const swatch = rowOf("POZO PRINCIPAL").querySelector(".well-legend__swatch");
    expect(swatch).not.toBeNull();
    expect((swatch as HTMLElement).style.backgroundColor).toBe("rgb(0, 180, 216)");
  });

  it("renders every adjacent well with its name and color swatch", () => {
    renderLegend();
    expect(screen.getByText("Pozo Adyacente Norte")).toBeInTheDocument();
    expect(screen.getByText("Pozo Cruzado Crítico")).toBeInTheDocument();

    const swatch = rowOf("Pozo Adyacente Norte").querySelector(
      ".well-legend__swatch",
    );
    expect(swatch).not.toBeNull();
    expect((swatch as HTMLElement).style.backgroundColor).toBe("rgb(255, 0, 110)");
  });

  it("calls onSelect with the well id when a row is clicked", () => {
    const { onSelect } = renderLegend();
    fireEvent.click(screen.getByText("Pozo Adyacente Norte"));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith("offset-north-300");
  });

  it("selects the primary well when its row is clicked", () => {
    const { onSelect } = renderLegend();
    fireEvent.click(screen.getByText("POZO PRINCIPAL"));
    expect(onSelect).toHaveBeenCalledWith("primary-demo");
  });

  it("calls onToggleVisibility with the well id when its eye is clicked", () => {
    const { onToggleVisibility } = renderLegend();
    const eye = within(rowOf("Pozo Adyacente Norte")).getByRole("button", {
      name: "Ocultar este pozo",
    });
    fireEvent.click(eye);
    expect(onToggleVisibility).toHaveBeenCalledTimes(1);
    expect(onToggleVisibility).toHaveBeenCalledWith("offset-north-300");
  });

  it("flips the eye to the hidden state (Mostrar + is-hidden) when visible=false", () => {
    const { rerender } = renderLegend();

    const eyeBefore = within(rowOf("Pozo Adyacente Norte")).getByRole("button", {
      name: "Ocultar este pozo",
    });
    expect(eyeBefore).not.toHaveClass("is-hidden");

    rerender(
      <WellLegend
        wells={[primary, { ...adjNorth, visible: false }, adjCross]}
        selectedWellId={null}
        onSelect={vi.fn()}
        onToggleVisibility={vi.fn()}
      />,
    );

    const eyeAfter = within(rowOf("Pozo Adyacente Norte")).getByRole("button", {
      name: "Mostrar",
    });
    expect(eyeAfter).toHaveClass("is-hidden");
  });

  it("highlights the selected well row with the selected class", () => {
    renderLegend({ selectedWellId: "offset-crossing" });
    expect(rowOf("Pozo Cruzado Crítico")).toHaveClass("selected");
    expect(rowOf("POZO PRINCIPAL")).not.toHaveClass("selected");
  });

  it("marks the primary row as selected when its id matches", () => {
    renderLegend({ selectedWellId: "primary-demo" });
    expect(rowOf("POZO PRINCIPAL")).toHaveClass("selected");
  });

  it("renders no eye toggle for the primary well", () => {
    renderLegend();

    const primaryRow = rowOf("POZO PRINCIPAL");
    expect(
      within(primaryRow).queryByRole("button", { name: /ocultar|mostrar/i }),
    ).toBeNull();

    // Adjacent wells keep their eye toggles (primary + 2 adjacent -> 2 eyes).
    expect(
      screen.getAllByRole("button", { name: /ocultar|mostrar/i }),
    ).toHaveLength(2);
  });

  it("renders no rows when the wells array is empty", () => {
    const { container } = renderLegend({ wells: [] });
    expect(container.querySelectorAll(".well-legend__row")).toHaveLength(0);
  });
});
