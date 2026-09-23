import { Activity } from "lucide-react";
import { Section } from "../ui/Section";
import { InputField } from "../ui/InputField";
import { useDrillingStore } from "../../store/drilling-store";
import "./PumpConfig.css";

export function PumpConfig() {
  const { pumpData, setPumpData, validationResults, setActiveFocus, results } =
    useDrillingStore();
  const validation = validationResults.pump;

  return (
    <Section
      id="pump-config"
      title="Configuración de Bombas"
      icon={<Activity size={18} />}
      validationV1={validation.inputGuard.status}
      validationV2={validation.outputGuard.status}
      onFocusTrigger={() => setActiveFocus("hydraulics")}
    >
      <div className="section-content">
        <div className="pump-type-switch">
          <button
            className={`pump-type-btn ${pumpData.pumpType === "Triplex" ? "active" : ""}`}
            onClick={() => setPumpData({ pumpType: "Triplex" })}
          >
            TRIPLEX
          </button>
          <button
            className={`pump-type-btn ${pumpData.pumpType === "Duplex" ? "active" : ""}`}
            onClick={() => setPumpData({ pumpType: "Duplex" })}
          >
            DUPLEX
          </button>
        </div>

        <div className="pump-inputs-grid">
          <InputField
            label="Diámetro de Camisa (Liner)"
            unit="in"
            value={pumpData.linerDiameter}
            onChange={(val) => setPumpData({ linerDiameter: val })}
          />
          <InputField
            label="Longitud de Carrera"
            unit="in"
            value={pumpData.strokeLength}
            onChange={(val) => setPumpData({ strokeLength: val })}
          />
          {pumpData.pumpType === "Duplex" && (
            <InputField
              label="Diámetro del Vástago (Rod)"
              unit="in"
              value={pumpData.rodDiameter}
              onChange={(val) => setPumpData({ rodDiameter: val })}
            />
          )}
          <InputField
            label="Emboladas (SPM)"
            unit="spm"
            value={pumpData.strokesPerMinute}
            onChange={(val) => setPumpData({ strokesPerMinute: val })}
          />
          <InputField
            label="Eficiencia"
            unit="%"
            value={pumpData.efficiency}
            onChange={(val) => setPumpData({ efficiency: val })}
          />
        </div>

        <div className="pump-live-results">
          <div className="live-stat">
            <span className="live-label">Caudal (GPM)</span>
            <span className="live-value">
              {results.pump.flowRateGPM.toFixed(1)}
            </span>
          </div>
          <div className="live-stat">
            <span className="live-label">ECD Estimado</span>
            <span className="live-value">
              {useDrillingStore.getState().results.hydraulics.ecd.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Section>
  );
}
