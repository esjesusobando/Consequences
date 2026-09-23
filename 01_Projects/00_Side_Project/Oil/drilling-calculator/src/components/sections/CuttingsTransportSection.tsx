// ============================================================
// Drilling Calculator - Cuttings Transport Section
// Renders cuttings-transport metrics with CCI/HCE status thresholds
// (C-1, C-2) - vanilla CSS tokens only, no Tailwind (C-3)
// ============================================================

import { Layers } from "lucide-react";
import { Section } from "../ui/Section";
import { DataCard } from "../ui/DataCard";
import { useDrillingStore } from "../../store/drilling-store";
import type {
  CuttingsTransportResult,
  ValidationStatus,
} from "../../store/drilling-types";
import "./CuttingsTransportSection.css";

// C-2: CCI >= 1.0 valid, 0.5 <= CCI < 1.0 warning, CCI < 0.5 error
function cciStatus(cci: number): ValidationStatus {
  if (cci >= 1.0) return "valid";
  if (cci >= 0.5) return "warning";
  return "error";
}

// C-2: HCE >= 80 valid, 60 <= HCE < 80 warning, HCE < 60 error
function hceStatus(hce: number): ValidationStatus {
  if (hce >= 80) return "valid";
  if (hce >= 60) return "warning";
  return "error";
}

// C-1: missing or zeroed cuttings render as empty (null, no throw)
function isCuttingsEmpty(cuttings: CuttingsTransportResult): boolean {
  return (
    cuttings.cuttingCarryingIndex === 0 &&
    cuttings.holeCleaningEfficiency === 0 &&
    cuttings.cuttingsConcentration === 0 &&
    cuttings.slipVelocity === 0 &&
    cuttings.transportRatio === 0
  );
}

export function CuttingsTransportSection() {
  const { results } = useDrillingStore();
  const cuttings = results?.cuttings;

  if (!cuttings || isCuttingsEmpty(cuttings)) return null;

  return (
    <Section
      id="cuttings"
      title="TRANSPORTE DE RECORTES"
      icon={<Layers size={18} />}
    >
      <div className="cuttings-grid">
        <DataCard
          label="CCI"
          value={cuttings.cuttingCarryingIndex}
          decimals={2}
          status={cciStatus(cuttings.cuttingCarryingIndex)}
        />
        <DataCard
          label="Eficiencia de Limpieza"
          value={cuttings.holeCleaningEfficiency}
          unit="%"
          decimals={1}
          status={hceStatus(cuttings.holeCleaningEfficiency)}
        />
        <DataCard
          label="Concentración de Recortes"
          value={cuttings.cuttingsConcentration}
          unit="%"
          decimals={1}
        />
        <DataCard
          label="Velocidad de Deslizamiento"
          value={cuttings.slipVelocity}
          unit="ft/min"
          decimals={1}
        />
        <DataCard
          label="Ratio de Transporte"
          value={cuttings.transportRatio}
          unit="%"
          decimals={1}
        />
      </div>

      <div className="cuttings-legend">
        <span className="cuttings-legend__item">
          <span className="cuttings-legend__dot cuttings-legend__dot--safe" />
          Adecuado
        </span>
        <span className="cuttings-legend__item">
          <span className="cuttings-legend__dot cuttings-legend__dot--warning" />
          Vigilar
        </span>
        <span className="cuttings-legend__item">
          <span className="cuttings-legend__dot cuttings-legend__dot--critical" />
          Riesgo
        </span>
      </div>
    </Section>
  );
}
