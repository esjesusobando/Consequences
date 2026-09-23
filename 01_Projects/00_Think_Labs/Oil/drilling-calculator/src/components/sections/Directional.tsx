import React, { useState } from "react";
import { Compass, Map, Table, Plus, Trash2 } from "lucide-react";
import { useDrillingStore } from "../../store/drilling-store";
import Trajectory3D from "../visuals/Trajectory3D";
import "./Directional.css";

export const Directional: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"survey" | "visual">("survey");
  const { surveys, setSurveys, results, wellData, setWellData } =
    useDrillingStore();

  const handleUTMChange = (field: keyof typeof wellData, value: string) => {
    setWellData({ [field]: parseFloat(value) || 0 });
  };

  const handleSurveyChange = (index: number, field: string, value: string) => {
    const newSurveys = [...surveys];
    newSurveys[index] = {
      ...newSurveys[index],
      [field]: value === "" ? 0 : parseFloat(value),
    };
    setSurveys(newSurveys);
  };

  const addStation = () => {
    const lastSurvey = surveys[surveys.length - 1];
    setSurveys([
      ...surveys,
      {
        md: (lastSurvey?.md || 0) + 100,
        inc: lastSurvey?.inc || 0,
        azi: lastSurvey?.azi || 0,
      },
    ]);
  };

  const removeStation = (index: number) => {
    if (surveys.length <= 1) return;
    const newSurveys = surveys.filter((_, i) => i !== index);
    setSurveys(newSurveys);
  };

  const trajectory = results.directional.trajectory;

  return (
    <div className="directional-section">
      <div className="section-header">
        <div className="title-group">
          <Compass className="section-icon" size={20} />
          <h2>Perforación Direccional (MCM)</h2>
        </div>
        <div className="view-selector">
          <button
            className={`view-btn ${activeTab === "survey" ? "active" : ""}`}
            onClick={() => setActiveTab("survey")}
          >
            <Table size={14} /> Survey
          </button>
          <button
            className={`view-btn ${activeTab === "visual" ? "active" : ""}`}
            onClick={() => setActiveTab("visual")}
          >
            <Map size={14} /> Trayectoria 3D
          </button>
        </div>
      </div>

      <div className="directional-content">
        {activeTab === "survey" ? (
          <div className="survey-editor card-panel">
            <div className="card-header">
              <h3>Ingreso de Surveys (Planificado vs Real)</h3>
            </div>

            <div
              className="utm-inputs-row"
              style={{
                display: "flex",
                gap: "1rem",
                padding: "1rem",
                background: "rgba(255,255,255,0.02)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div className="input-group">
                <label>Norte de Sup. (N)</label>
                <input
                  type="number"
                  value={wellData.surfaceNorth || 0}
                  onChange={(e) =>
                    handleUTMChange("surfaceNorth", e.target.value)
                  }
                />
              </div>
              <div className="input-group">
                <label>Este de Sup. (E)</label>
                <input
                  type="number"
                  value={wellData.surfaceEast || 0}
                  onChange={(e) =>
                    handleUTMChange("surfaceEast", e.target.value)
                  }
                />
              </div>
              <div className="input-group">
                <label>Conv. Cuadrícula (°)</label>
                <input
                  type="number"
                  value={wellData.gridConvergence || 0}
                  onChange={(e) =>
                    handleUTMChange("gridConvergence", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="survey-table-wrapper">
              <table className="survey-table">
                <thead>
                  <tr>
                    <th>MD (ft)</th>
                    <th>INC (deg)</th>
                    <th>AZI (deg)</th>
                    <th>TVD (ft)</th>
                    <th>N/S (ft)</th>
                    <th>E/W (ft)</th>
                    <th>DLS (deg/100)</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {surveys.map((s, idx) => {
                    const tPoint = trajectory[idx];
                    return (
                      <tr key={idx} className="row-editable">
                        <td>
                          <input
                            type="number"
                            value={s.md === 0 ? "" : s.md}
                            placeholder="0"
                            onChange={(e) =>
                              handleSurveyChange(idx, "md", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={s.inc === 0 ? "" : s.inc}
                            placeholder="0"
                            onChange={(e) =>
                              handleSurveyChange(idx, "inc", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={s.azi === 0 ? "" : s.azi}
                            placeholder="0"
                            onChange={(e) =>
                              handleSurveyChange(idx, "azi", e.target.value)
                            }
                          />
                        </td>
                        <td className="read-only">
                          {tPoint ? tPoint.tvd.toFixed(2) : "-"}
                        </td>
                        <td className="read-only">
                          {tPoint ? tPoint.north.toFixed(2) : "-"}
                        </td>
                        <td className="read-only">
                          {tPoint ? tPoint.east.toFixed(2) : "-"}
                        </td>
                        <td className="read-only">
                          {tPoint ? tPoint.dls.toFixed(2) : "-"}
                        </td>
                        <td>
                          <button
                            className="delete-row-btn"
                            onClick={() => removeStation(idx)}
                            disabled={surveys.length <= 1}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <button className="add-survey-btn" onClick={addStation}>
                <Plus size={14} /> Agregar Estación
              </button>
            </div>
          </div>
        ) : (
          <div className="directional-viz card-panel">
            <Trajectory3D />
          </div>
        )}
      </div>
    </div>
  );
};
