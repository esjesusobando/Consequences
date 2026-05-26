import { Droplets } from "lucide-react";
import { Section } from "../ui/Section";
import { InputField } from "../ui/InputField";
import { useDrillingStore } from "../../store/drilling-store";
import "./MudProperties.css";

export function MudProperties() {
  const { mudData, setMudData, validationResults, setActiveFocus, results } =
    useDrillingStore();
  const validation = validationResults.mud;
  const rheology = results.rheology;

  return (
    <Section
      id="mud-properties"
      title="PROPIEDADES DEL LODO"
      icon={<Droplets size={18} />}
      validationV1={validation.inputGuard.status}
      validationV2={validation.outputGuard.status}
      onFocusTrigger={() => setActiveFocus("rheology")}
    >
      <div className="section-content">
        {/* ─── Top Config ─── */}
        <div className="mud-top-row">
          <InputField
            label="Densidad"
            unit="ppg"
            value={mudData.mudWeight}
            onChange={(val) => setMudData({ mudWeight: val })}
          />

          <div className="model-selector">
            <label className="input-label">Sistema / Modelo</label>
            <select
              className="rheology-model-select"
              value={mudData.rheologyModel}
              onChange={(e) =>
                setMudData({ rheologyModel: e.target.value as any })
              }
            >
              <option value="BINGHAM">Bingham (PV/YP)</option>
              <option value="POWER_LAW">Power Law (n/K)</option>
              <option value="HERSCHEL_BULKLEY">H-Bulkley (τ₀)</option>
            </select>
          </div>
        </div>

        {/* ─── Rheometer Readings Grid ─── */}
        <div className="rheology-instrument-panel">
          <div className="panel-header">Lecturas del Viscómetro (RPM)</div>
          <div className="readings-grid">
            <InputField
              label="θ600"
              value={mudData.theta600}
              onChange={(val) => setMudData({ theta600: val })}
            />
            <InputField
              label="θ300"
              value={mudData.theta300}
              onChange={(val) => setMudData({ theta300: val })}
            />
            <InputField
              label="θ200"
              value={mudData.theta200}
              onChange={(val) => setMudData({ theta200: val })}
            />
            <InputField
              label="θ100"
              value={mudData.theta100}
              onChange={(val) => setMudData({ theta100: val })}
            />
            <InputField
              label="θ6"
              value={mudData.theta6}
              onChange={(val) => setMudData({ theta6: val })}
            />
            <InputField
              label="θ3"
              value={mudData.theta3}
              onChange={(val) => setMudData({ theta3: val })}
            />
          </div>
        </div>

        {/* ─── Gel Strengths ─── */}
        <div className="rheology-instrument-panel gels">
          <div className="panel-header">Resistencia de Gel (lb/100ft²)</div>
          <div className="gels-grid">
            <InputField
              label="10 Seg"
              value={mudData.gel10sec}
              onChange={(val) => setMudData({ gel10sec: val })}
            />
            <InputField
              label="10 Min"
              value={mudData.gel10min}
              onChange={(val) => setMudData({ gel10min: val })}
            />
          </div>
        </div>

        {/* ─── Calculated System Outputs ─── */}
        <div className="rheology-dashboard-outputs">
          <div className="output-card">
            <span className="o-label">PV</span>
            <span className="o-value">{rheology.pv.toFixed(1)}</span>
            <span className="o-unit">cP</span>
          </div>
          <div className="output-card">
            <span className="o-label">YP</span>
            <span className="o-value">{rheology.yp.toFixed(1)}</span>
            <span className="o-unit">lb/100ft²</span>
          </div>

          <div className="output-card">
            <span className="o-label">
              n{" "}
              <small style={{ opacity: 0.6 }}>
                ({mudData.rheologyModel === "POWER_LAW" ? "PL" : "HB"})
              </small>
            </span>
            <span className="o-value">
              {(mudData.rheologyModel === "POWER_LAW"
                ? rheology.n_pl
                : rheology.n_hb
              ).toFixed(3)}
            </span>
          </div>

          <div className="output-card">
            <span className="o-label">
              K{" "}
              <small style={{ opacity: 0.6 }}>
                ({mudData.rheologyModel === "POWER_LAW" ? "PL" : "HB"})
              </small>
            </span>
            <span className="o-value">
              {(mudData.rheologyModel === "POWER_LAW"
                ? rheology.k_pl
                : rheology.k_hb
              ).toFixed(4)}
            </span>
          </div>

          <div
            className={`output-card ${mudData.rheologyModel === "HERSCHEL_BULKLEY" ? "highlight" : ""}`}
          >
            <span className="o-label">τ₀ (YS)</span>
            <span className="o-value">{rheology.tau0_hb.toFixed(2)}</span>
            <span className="o-unit">lb/100ft²</span>
          </div>
        </div>
      </div>
    </Section>
  );
}
