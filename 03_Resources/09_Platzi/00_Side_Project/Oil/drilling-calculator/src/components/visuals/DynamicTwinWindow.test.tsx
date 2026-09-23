/**
 * T-14 (RED, D-2): DynamicTwinWindow render contract.
 *
 * The twin shows the simulated ECD (finite, unit "ppg"), a signed VAR ECD
 * delta against the baseline `results.hydraulics.ecd`, and fracture-gradient
 * status: `error` when simulated ECD > fractureGradient, else `valid`.
 * It returns null (no throw) when `results` are absent.
 *
 * Status is asserted on the DataCard indicator inline style (DataCard.tsx maps
 * valid -> #00b4d8, error -> #ff006e) - the status dot the user sees. The delta
 * is asserted on its text content (signed number), not on CSS classes.
 */

import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { useDrillingStore } from "../../store/drilling-store";
import type { DrillingResults } from "../../store/drilling-types";
import { DynamicTwinWindow } from "./DynamicTwinWindow";

const TVD = 7800;

function setupBaseline(fractureGradient: number) {
  const init = useDrillingStore.getInitialState();
  useDrillingStore.setState({
    ...init,
    wellData: { ...init.wellData, tvd: TVD, totalDepth: 9000 },
    mudData: { ...init.mudData, mudWeight: 10.5 },
    formationData: { ...init.formationData, fractureGradient },
  });
  useDrillingStore.getState().calculateAll();
}

function getSimulatedEcdCard() {
  const label = screen.getByText("Simulated ECD");
  const card = label.closest(".data-card") as HTMLElement;
  return {
    card,
    indicator: card.querySelector(
      ".data-card__indicator",
    ) as HTMLElement,
  };
}

describe("DynamicTwinWindow (D-2)", () => {
  beforeEach(() => {
    useDrillingStore.setState(useDrillingStore.getInitialState());
  });

  it("shows a finite Simulated ECD with ppg unit and valid status below the fracture gradient", () => {
    setupBaseline(0.85);
    render(<DynamicTwinWindow />);

    const { card, indicator } = getSimulatedEcdCard();
    const value = Number.parseFloat(
      within(card).getByText(/\d+\.\d{2}/).textContent ?? "NaN",
    );

    expect(Number.isFinite(value)).toBe(true);
    expect(value).toBeGreaterThan(0);
    expect(within(card).getByText("ppg")).toBeInTheDocument();
    expect(indicator).toHaveStyle({ backgroundColor: "#00b4d8" });
  });

  it("marks the simulated ECD as error when it exceeds the fracture gradient", () => {
    setupBaseline(0.3);
    render(<DynamicTwinWindow />);

    const { indicator } = getSimulatedEcdCard();
    expect(indicator).toHaveStyle({ backgroundColor: "#ff006e" });
  });

  it("crosses valid→error as simulated MW pushes ECD psi/ft past fracture gradient", () => {
    setupBaseline(0.6);
    render(<DynamicTwinWindow />);

    const { indicator: initial, card } = getSimulatedEcdCard();

    // Anchor the initial-valid leg: simulated ECD must be finite and inside a
    // realistic ppg band BEFORE relying on status text.
    const initialEcd = Number.parseFloat(
      within(card).getByText(/\d+\.\d{4}/).textContent ?? "NaN",
    );
    expect(Number.isFinite(initialEcd)).toBe(true);
    expect(initialEcd).toBeGreaterThanOrEqual(10);
    expect(initialEcd).toBeLessThanOrEqual(13);
    expect(initial).toHaveStyle({ backgroundColor: "#00b4d8" });

    const slider = screen.getByRole("slider") as HTMLInputElement;
    fireEvent.change(slider, { target: { value: "12.5" } });
    const { indicator: after } = getSimulatedEcdCard();
    expect(after).toHaveStyle({ backgroundColor: "#ff006e" });
  });

  it("shows a signed VAR ECD delta that flips sign with the mud-weight slider", () => {
    setupBaseline(0.85);
    render(<DynamicTwinWindow />);

    const slider = screen.getByRole("slider") as HTMLInputElement;
    const deltaText = () =>
      (document.querySelector(".delta-val") as HTMLElement).textContent ?? "";

    fireEvent.change(slider, { target: { value: "12.5" } });
    const deltaHigh = deltaText();
    expect(deltaHigh).toMatch(/^\+\d+\.\d{4}$/);

    fireEvent.change(slider, { target: { value: "8.5" } });
    const deltaLow = deltaText();
    expect(deltaLow).toMatch(/^-\d+\.\d{4}$/);

    expect(deltaHigh).not.toBe(deltaLow);
  });

  it("renders null without throwing when results are absent", () => {
    useDrillingStore.setState({
      results: null as unknown as DrillingResults,
    });
    const { container } = render(<DynamicTwinWindow />);
    expect(container.firstChild).toBeNull();
  });
});
