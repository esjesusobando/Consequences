/**
 * T-10 (RED, C-1/C-2): CuttingsTransportSection render contract.
 *
 * C-1: reads `results.cuttings` from the store and renders five DataCards -
 * CCI, hole-cleaning efficiency (%), cuttings concentration (%), slip
 * velocity (ft/min), transport ratio (%). The CCI card shows `1.20` and the
 * HCE card shows `85.0 %`. Returns null (no throw) when cuttings are zeroed
 * or results are absent.
 *
 * C-2: threshold statuses - CCI >= 1.0 valid, 0.5 <= CCI < 1.0 warning,
 * CCI < 0.5 error; HCE >= 80 valid, 60 <= HCE < 80 warning, HCE < 60 error.
 * Status is asserted on the DataCard indicator inline style (valid -> #00b4d8,
 * warning -> #ffcc00, error -> #ff006e), the status dot the user sees.
 */

import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { useDrillingStore } from "../../store/drilling-store";
import type {
  CuttingsTransportResult,
  DrillingResults,
} from "../../store/drilling-types";
import { CuttingsTransportSection } from "./CuttingsTransportSection";

const CARD_LABELS = [
  "CCI",
  "Eficiencia de Limpieza",
  "Concentración de Recortes",
  "Velocidad de Deslizamiento",
  "Ratio de Transporte",
] as const;

function setupCuttings(partial: Partial<CuttingsTransportResult>) {
  const state = useDrillingStore.getState();
  useDrillingStore.setState({
    results: {
      ...state.results,
      cuttings: { ...state.results.cuttings, ...partial },
    },
  });
}

function getCard(label: string): HTMLElement {
  const labelEl = screen.getByText(label);
  return labelEl.closest(".data-card") as HTMLElement;
}

function getIndicator(card: HTMLElement): HTMLElement {
  return card.querySelector(".data-card__indicator") as HTMLElement;
}

describe("CuttingsTransportSection (C-1)", () => {
  beforeEach(() => {
    useDrillingStore.setState(useDrillingStore.getInitialState());
  });

  it("renders five metric cards with CCI 1.20 and HCE 85.0 % from populated results", () => {
    setupCuttings({
      cuttingCarryingIndex: 1.2,
      holeCleaningEfficiency: 85,
      cuttingsConcentration: 3.5,
      slipVelocity: 38,
      transportRatio: 92,
    });

    render(<CuttingsTransportSection />);

    for (const label of CARD_LABELS) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }

    const cciCard = getCard("CCI");
    expect(within(cciCard).getByText("1.20")).toBeInTheDocument();

    const hceCard = getCard("Eficiencia de Limpieza");
    expect(within(hceCard).getByText("85.0")).toBeInTheDocument();
    expect(within(hceCard).getByText("%")).toBeInTheDocument();
  });

  it("returns null without throwing when cuttings are zeroed", () => {
    const { container } = render(<CuttingsTransportSection />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null without throwing when results are absent", () => {
    useDrillingStore.setState({
      results: null as unknown as DrillingResults,
    });
    const { container } = render(<CuttingsTransportSection />);
    expect(container.firstChild).toBeNull();
  });
});

describe("CuttingsTransportSection (C-2)", () => {
  beforeEach(() => {
    useDrillingStore.setState(useDrillingStore.getInitialState());
  });

  it("marks CCI and HCE as error for poor hole cleaning (CCI 0.4, HCE 55)", () => {
    setupCuttings({
      cuttingCarryingIndex: 0.4,
      holeCleaningEfficiency: 55,
      cuttingsConcentration: 6.2,
      slipVelocity: 18,
      transportRatio: 40,
    });

    render(<CuttingsTransportSection />);

    expect(getIndicator(getCard("CCI"))).toHaveStyle({
      backgroundColor: "#ff006e",
    });
    expect(getIndicator(getCard("Eficiencia de Limpieza"))).toHaveStyle({
      backgroundColor: "#ff006e",
    });
  });

  it("marks CCI and HCE as warning in the watch zone (CCI 0.7, HCE 70)", () => {
    setupCuttings({
      cuttingCarryingIndex: 0.7,
      holeCleaningEfficiency: 70,
      cuttingsConcentration: 4.8,
      slipVelocity: 26,
      transportRatio: 65,
    });

    render(<CuttingsTransportSection />);

    expect(getIndicator(getCard("CCI"))).toHaveStyle({
      backgroundColor: "#ffcc00",
    });
    expect(getIndicator(getCard("Eficiencia de Limpieza"))).toHaveStyle({
      backgroundColor: "#ffcc00",
    });
  });

  it("marks CCI and HCE as valid for acceptable cleaning (CCI 1.1, HCE 90)", () => {
    setupCuttings({
      cuttingCarryingIndex: 1.1,
      holeCleaningEfficiency: 90,
      cuttingsConcentration: 2.4,
      slipVelocity: 42,
      transportRatio: 95,
    });

    render(<CuttingsTransportSection />);

    expect(getIndicator(getCard("CCI"))).toHaveStyle({
      backgroundColor: "#00b4d8",
    });
    expect(getIndicator(getCard("Eficiencia de Limpieza"))).toHaveStyle({
      backgroundColor: "#00b4d8",
    });
  });
});
