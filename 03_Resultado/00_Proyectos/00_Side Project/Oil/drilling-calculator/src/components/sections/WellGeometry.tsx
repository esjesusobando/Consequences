import { Ruler } from "lucide-react";
import { Section } from "../ui/Section";
import { InputField } from "../ui/InputField";
import { useDrillingStore } from "../../store/drilling-store";
import "./WellGeometry.css";

export function WellGeometry() {
  const { wellData, setWellData, validationResults, setActiveFocus } =
    useDrillingStore();
  const validation = validationResults.wellGeometry;

  return (
    <Section
      id="well-geometry"
      title="GEOMETRÍA DEL POZO"
      icon={<Ruler size={18} />}
      validationV1={validation.inputGuard.status}
      validationV2={validation.outputGuard.status}
      onFocusTrigger={() => setActiveFocus("wellbore")}
    >
      <div className="section-content no-scroll-zone">
        <InputField
          label="Profundidad Medida (MD)"
          unit="ft"
          value={wellData.totalDepth}
          onChange={(val) => setWellData({ totalDepth: val })}
        />
        <InputField
          label="Profundidad Vertical (TVD)"
          unit="ft"
          value={wellData.tvd}
          onChange={(val) => setWellData({ tvd: val })}
        />
        <InputField
          label="Diámetro del Hoyo"
          unit="in"
          value={wellData.holeSize}
          onChange={(val) => setWellData({ holeSize: val })}
        />

        <div className="divider" />

        <InputField
          label="OD Tubería de Perforación"
          unit="in"
          value={wellData.drillPipeOD}
          onChange={(val) => setWellData({ drillPipeOD: val })}
        />
        <InputField
          label="ID Tubería de Perforación"
          unit="in"
          value={wellData.drillPipeID}
          onChange={(val) => setWellData({ drillPipeID: val })}
        />
        <InputField
          label="Longitud de Tubería"
          unit="ft"
          value={wellData.drillPipeLength}
          onChange={(val) => setWellData({ drillPipeLength: val })}
        />
      </div>
    </Section>
  );
}
