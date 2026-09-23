import { Plus, Trash2, Settings, Zap } from "lucide-react";
import { useDrillingStore } from "../../store/drilling-store";
import { Section } from "../ui/Section";
import "./BitConfig.css";

export function BitConfig() {
  const {
    wellData,
    setWellData,
    setActiveNozzleIndex,
    validationResults,
    setActiveFocus,
    results,
  } = useDrillingStore();

  const nozzles = wellData.bitNozzles;
  const validation = validationResults.wellGeometry;

  const handleUpdateNozzle = (index: number, value: string) => {
    const numValue = value === "" ? 0 : parseInt(value);
    const newNozzles = [...nozzles];
    newNozzles[index] = numValue;
    setWellData({ bitNozzles: newNozzles });
  };

  const handleAddNozzle = () => {
    if (nozzles.length < 9) {
      setWellData({ bitNozzles: [...nozzles, 12] });
    }
  };

  const handleRemoveNozzle = (index: number) => {
    if (nozzles.length > 1) {
      const newNozzles = nozzles.filter((_, i) => i !== index);
      setWellData({ bitNozzles: newNozzles });
    }
  };

  const getRecommendedTFA = () => {
    return 'E.g. 3 x 12/32"';
  };

  return (
    <Section
      id="bit-config"
      title="Bit Optimizer & TFA"
      icon={<Settings size={18} />}
      validationV1={validation.inputGuard.status}
      validationV2={validation.outputGuard.status}
      onFocusTrigger={() => setActiveFocus("bit")}
    >
      <div className="bit-config-content">
        <div className="nozzle-recommendation-banner elite-tix-banner">
          <div className="recommendation-icon">
            <Zap size={16} className="tix-zap-icon" />
          </div>
          <div className="recommendation-text">
            <span className="elite-label">TIX ÉLITE</span>
            <p>
              Optimización sistémica: Para caudal de{" "}
              <strong>{Math.round(results?.pump?.flowRateGPM || 0)} GPM</strong>
              , intenta <strong>{getRecommendedTFA()}</strong> para maximizar el
              HSI.
            </p>
          </div>
        </div>

        <div className="nozzles-grid">
          {nozzles.map((size, index) => (
            <div
              key={index}
              className="nozzle-input-wrapper glass-input"
              onMouseEnter={() => setActiveNozzleIndex(index)}
              onMouseLeave={() => setActiveNozzleIndex(null)}
            >
              <div className="nozzle-label">Jet #{index + 1}</div>
              <div className="input-group">
                <input
                  type="number"
                  className="nozzle-input"
                  value={size === 0 ? "" : size}
                  placeholder="0"
                  onChange={(e) => handleUpdateNozzle(index, e.target.value)}
                  onFocus={() => setActiveNozzleIndex(index)}
                  onBlur={() => setActiveNozzleIndex(null)}
                  min="0"
                  max="32"
                />
                <span className="nozzle-unit">/32</span>
              </div>
              <button
                className="remove-nozzle-btn"
                onClick={() => handleRemoveNozzle(index)}
                disabled={nozzles.length <= 1}
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}

          {nozzles.length < 9 && (
            <button
              className="add-nozzle-btn glass-btn"
              onClick={handleAddNozzle}
            >
              <Plus size={16} />
              <span>Añadir Nozzle</span>
            </button>
          )}
        </div>

        <div className="bit-footer">
          <div className="tfa-summary">
            <div className="tfa-stat">
              <Zap size={14} className="tfa-icon" />
              <div className="tfa-info">
                <span className="label">Total Flow Area</span>
                <span className="value">
                  {results?.hydraulics?.totalFlowArea?.toFixed(2) ?? "0.00"} in²
                </span>
              </div>
            </div>
            <span className="hint">
              Optimización recomendada: 2.5 - 4.0 HSI
            </span>
          </div>
        </div>
      </div>
    </Section>
  );
}
