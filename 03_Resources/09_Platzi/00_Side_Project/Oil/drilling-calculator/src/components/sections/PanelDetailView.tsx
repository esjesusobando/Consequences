// ============================================================
// PanelDetailView — Multi-well detail panel for Anti-Collision
// Shows all wells with expandable detail, syncs with 3D view selection
// Brand-kit compliant, responsive, accessible
// ============================================================

import React, { useState, useMemo } from "react";
import {
  AlertTriangle,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Crosshair,
} from "lucide-react";
import { DataCard } from "../ui/DataCard";
import { fmtSf, riskMeta, riskNarrative } from "./Anticolision";
import type {
  CollisionResult,
  SurveyRecord,
  SurveyTool,
  DrillingResults,
  TrajectoryPoint,
} from "../../store/drilling-types";
import type { AdjacentWellInput, CollisionEntry } from "../../engine/anti-collision";
import { PRIMARY_WELL_ID, wellColor } from "../../engine/scene";
import "./PanelDetailView.css";

interface PanelDetailViewProps {
  matrix: CollisionEntry[];
  primaryTrajectory: TrajectoryPoint[];
  activeWellId: string | null;
  setActiveWellId: ((id: string) => void);
  effectiveSelectedWellId: string | null;
  setEffectiveSelectedWellId: ((id: string | null) => void);
  effectiveSelectedEntry: CollisionEntry | null;
  primaryTrajectoryToAnalyze: TrajectoryPoint[];
  activeResult: CollisionResult | null;
  activeAdjacentTraj: TrajectoryPoint[];
  meta: ReturnType<typeof riskMeta> | null;
  toolPrimary: SurveyTool;
  sfK: number;
  effectiveWellColors: Record<string, string>;
  hiddenWellIds: Set<string>;
  toggleWellVisibility: ((wellId: string) => void);
  onSelectWell: ((id: string) => void);
  onViewChange: ((view: "matrix" | "panel" | "3d") => void);
  onClose: (() => void);
  // User-editable adjacent wells state
  adjacentWells: AdjacentWellInput[];
  setAdjacentWells: React.Dispatch<React.SetStateAction<AdjacentWellInput[]>>;
  results: DrillingResults;
}

export const PanelDetailView: React.FC<PanelDetailViewProps> = ({
  matrix,
  primaryTrajectory,
  activeWellId,
  setActiveWellId,
  effectiveSelectedWellId,
  setEffectiveSelectedWellId,
  primaryTrajectoryToAnalyze,
  activeResult,
  activeAdjacentTraj,
  meta,
  toolPrimary,
  sfK,
  effectiveWellColors,
  hiddenWellIds,
  toggleWellVisibility,
  onViewChange,
  onClose,
  adjacentWells,
  setAdjacentWells,
  results,
}) => {
  const [expandedWells, setExpandedWells] = useState<Set<string>>(new Set());

  const legendEntries = useMemo(() => {
    const ids = [PRIMARY_WELL_ID, ...matrix.map((e) => e.wellId)];
    const names: Record<string, string> = {
      [PRIMARY_WELL_ID]: "Pozo Principal",
      ...Object.fromEntries(matrix.map((e) => [e.wellId, e.wellName])),
    };
    return ids.map((id) => ({
      id,
      name: names[id] ?? id,
      color: effectiveWellColors[id] ?? wellColor(id, Object.keys(effectiveWellColors)),
      visible: !hiddenWellIds.has(id),
    }));
  }, [matrix, hiddenWellIds, effectiveWellColors]);

  const updateWellField = (
    wellId: string,
    field: "wellheadNorth" | "wellheadEast" | "tool",
    value: number | SurveyTool,
  ) => {
    setAdjacentWells(
      adjacentWells.map((w) => (w.id === wellId ? { ...w, [field]: value } : w)),
    );
  };

  const handleSurveyChange = (
    wellId: string,
    index: number,
    field: keyof SurveyRecord,
    value: string,
  ) => {
    setAdjacentWells(
      adjacentWells.map((w) => {
        if (w.id !== wellId) return w;
        const surveys = [...(w.surveys || [])];
        surveys[index] = { ...surveys[index], [field]: parseFloat(value) || 0 };
        return { ...w, surveys };
      }),
    );
  };

  const addStation = (wellId: string) => {
    const well = adjacentWells.find((w) => w.id === wellId);
    if (!well?.surveys) return;
    const last = well.surveys[well.surveys.length - 1];
    const newSurveys = [...well.surveys, {
      md: (last?.md || 0) + 100,
      inc: last?.inc || 0,
      azi: last?.azi || 0,
    }];
    setAdjacentWells(
      adjacentWells.map((w) =>
        w.id === wellId ? { ...w, surveys: newSurveys } : w,
      ),
    );
  };

  const removeStation = (wellId: string, index: number) => {
    const well = adjacentWells.find((w) => w.id === wellId);
    if (!well?.surveys || well.surveys.length <= 2) return;
    const newSurveys = well.surveys.filter((_, i) => i !== index);
    setAdjacentWells(
      adjacentWells.map((w) =>
        w.id === wellId ? { ...w, surveys: newSurveys } : w,
      ),
    );
  };

  const copyPrimarySurveys = (wellId: string) => {
    setAdjacentWells(
      adjacentWells.map((w) =>
        w.id === wellId
          ? {
              ...w,
              surveys:
                results.directional.surveys.length > 0
                  ? results.directional.surveys
                  : [] as SurveyRecord[],
            }
          : w,
      ),
    );
  };

  const removeWell = (id: string) => {
    const remaining = adjacentWells.filter((w) => w.id !== id);
    if (remaining.length === 0) return;
    setAdjacentWells(remaining);
    if (activeWellId === id) {
      setActiveWellId(remaining[0].id);
    }
  };

  

  return (
    <div className="panel-detail-view">
      {/* Header */}
      <div className="panel-detail-header">
        <div className="panel-detail-title">
          <h3>Detalle de Pozos ({matrix.length + 1})</h3>
        </div>
        <div className="panel-detail-actions">
          <button
            className="view-btn"
            onClick={() => onViewChange("3d")}
            title="Ver en 3D completo"
          >
            🌀 3D
          </button>
          <button
            className="view-btn"
            onClick={() => onViewChange("matrix")}
            title="Volver a Matriz"
          >
            ← Matriz
          </button>
          <button
            className="view-btn small"
            onClick={onClose}
            title="Cerrar"
          >
            ×
          </button>
        </div>
      </div>

      {/* Well Legend / Selector */}
      <div className="panel-detail-legend">
        {legendEntries.map((well) => (
          <div
            key={well.id}
            className={`panel-legend-item ${well.id === effectiveSelectedWellId ? "selected" : ""} ${well.visible ? "" : "hidden"}`}
            onClick={() => {
              setEffectiveSelectedWellId(well.id);
              setActiveWellId(well.id);
              if (well.id !== PRIMARY_WELL_ID) {
                const entry = matrix.find((e) => e.wellId === well.id);
                if (entry) {
                  setActiveWellId(well.id);
                }
              }
            }}
            style={{ cursor: "pointer" }}
          >
            <div
              className="panel-legend-color"
              style={{ backgroundColor: well.color }}
            />
            <span className="panel-legend-name">{well.name}</span>
            {well.id !== PRIMARY_WELL_ID && (
              <button
                className="panel-legend-eye"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWellVisibility(well.id);
                }}
                aria-label={well.visible ? "Ocultar" : "Mostrar"}
                title={well.visible ? "Ocultar" : "Mostrar"}
              >
                {well.visible ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
            )}
            <button
              className={`panel-legend-expand ${expandedWells.has(well.id) ? "expanded" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                const next = new Set(expandedWells);
                if (next.has(well.id)) next.delete(well.id);
                else next.add(well.id);
                setExpandedWells(next);
              }}
              aria-label={expandedWells.has(well.id) ? "Colapsar" : "Expandir"}
            >
              {expandedWells.has(well.id) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        ))}
      </div>

      {/* Expanded Detail Panels */}
      <div className="panel-detail-content">
        {legendEntries.map((well) => {
          const entry = matrix.find((e) => e.wellId === well.id);
          const isPrimary = well.id === PRIMARY_WELL_ID;
          const isExpanded = expandedWells.has(well.id);

          if (!isExpanded && well.id !== PRIMARY_WELL_ID && !entry) return null;

          return (
            <div
              key={well.id}
              className={`panel-well-detail ${isExpanded ? "expanded" : ""}`}
              style={{
                display: isExpanded ? "flex" : "none",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <div className="panel-well-header">
                <div className="panel-well-info">
                  <div
                    className="panel-well-color"
                    style={{ backgroundColor: well.color }}
                  />
                  <div>
                    <h4 className="panel-well-name">{well.name}</h4>
                    <span className="panel-well-id">{well.id}</span>
                  </div>
                </div>
                {well.id !== PRIMARY_WELL_ID && (
                  <button
                    className="panel-well-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeWell(well.id);
                    }}
                    title="Eliminar pozo"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

{(() => {
                if (isPrimary) {
                  return (
                    <div className="panel-primary-info">
                      <p>Pozo de referencia — no editable desde aquí</p>
                      <p>
                        <strong>MD Total:</strong> {primaryTrajectory[primaryTrajectory.length - 1]?.md.toFixed(0) || 0} ft
                      </p>
                      <p>
                        <strong>TVD Final:</strong> {primaryTrajectory[primaryTrajectory.length - 1]?.tvd.toFixed(0) || 0} ft
                      </p>
                    </div>
                  );
                }
                if (entry && activeResult) {
                  return (
                    <div className="panel-well-detail">
                  {/* Risk Banner */}
                  <div className={`risk-banner ${meta?.className || ""}`}>
                    <div className="risk-banner-title">
                      <span className={`risk-banner-level ${meta?.className || ""}`}>
                        {meta?.label || "—"}
                      </span>
                      <span className="risk-banner-sf">
                        SF = {entry.result.sf !== undefined ? (Number.isFinite(entry.result.sf) ? entry.result.sf.toFixed(4) : "∞") : "—"}
                      </span>
                    </div>
                    <p className="risk-banner-sub">
                      Separación mínima:{' '}
                      <strong>{entry.result.minDistance.toFixed(4)} ft</strong> entre pozo principal (est.{' '}
                      #{entry.result.stationA}) y adyacente (est. #{entry.result.stationB}).
                    </p>
                  </div>

                  {/* Key Metrics */}
                  <div className="result-cards">
                    <DataCard label="Distancia Mínima" value={entry.result.minDistance} unit="ft" decimals={2} />
                    <DataCard
                      label="Separation Factor (SF)"
                      value={Number.isFinite(entry.result.sf) ? entry.result.sf : "∞"}
                      decimals={2}
                    />
                    <DataCard label="σs proyectado" value={entry.result.sepSigma} unit="ft" decimals={3} />
                  </div>

                  {/* Risk Narrative */}
                  <div className="narrative-card">
                    <h4>Narrativa de Riesgo</h4>
                    <p>{riskNarrative(entry, { sfK, toolPrimary })}</p>
                  </div>

                  {/* Critical Table */}
                  <div className="critical-panel card-panel">
                    <div className="card-header">
                      <h3>Punto de Máximo Acercamiento</h3>
                      <span className={`critical-panel-tag ${meta?.className || ""}`}>
                        {meta?.label || "—"}
                      </span>
                    </div>
                    <table className="critical-table">
                      <thead>
                        <tr>
                          <th>Pozo</th>
                          <th>Est.</th>
                          <th>MD (ft)</th>
                          <th>Norte (ft)</th>
                          <th>Este (ft)</th>
                          <th>TVD (ft)</th>
                          <th>Elipsoide 95% (ft)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="critical-table-well">Principal</td>
                          <td>#{activeResult?.stationA || 0}</td>
                          <td>{primaryTrajectoryToAnalyze[activeResult?.stationA || 0]?.md.toFixed(0) || 0}</td>
                          <td>{activeResult?.closestA?.north.toFixed(4) || 0}</td>
                          <td>{activeResult?.closestA?.east.toFixed(4) || 0}</td>
                          <td>{activeResult?.closestA?.tvd.toFixed(4) || 0}</td>
                          <td className="critical-table-axes">
                            {activeResult?.ellipseA?.axes.map((a: number) => a.toFixed(4)).join(" × ") || "—"}
                          </td>
                        </tr>
                        <tr>
                          <td className="critical-table-well">Adyacente</td>
                          <td>#{activeResult?.stationB || 0}</td>
                          <td>{activeAdjacentTraj[activeResult?.stationB || 0]?.md.toFixed(0) || 0}</td>
                          <td>{activeResult?.closestB?.north.toFixed(4) || 0}</td>
                          <td>{activeResult?.closestB?.east.toFixed(4) || 0}</td>
                          <td>{activeResult?.closestB?.tvd.toFixed(4) || 0}</td>
                          <td className="critical-table-axes">
                            {activeResult?.ellipseB?.axes.map((a: number) => a.toFixed(4)).join(" × ") || "—"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Survey Editor */}
                  <div className="panel-survey-editor">
                    <h4>Surveys — {entry.source.name}</h4>
                    <div className="toolbar-row">
                      <div className="input-group">
                        <label>Herramienta</label>
                        <select
                          value={entry.source.tool ?? "MWD"}
                          onChange={(e) =>
                            updateWellField(
                              entry.wellId,
                              "tool",
                              e.target.value as SurveyTool,
                            )
                          }
                        >
                          {["MWD", "GYRO", "SENSOR"].map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      <div className="input-group">
                        <label>Offset Norte (ft)</label>
                        <input
                          type="number"
                          value={entry.source.wellheadNorth ?? 0}
                          onChange={(e) =>
                            updateWellField(
                              entry.wellId,
                              "wellheadNorth",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                        />
                      </div>
                      <div className="input-group">
                        <label>Offset Este (ft)</label>
                        <input
                          type="number"
                          value={entry.source.wellheadEast ?? 0}
                          onChange={(e) =>
                            updateWellField(
                              entry.wellId,
                              "wellheadEast",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                        />
                      </div>
                    </div>

                    <table className="survey-table">
                      <thead>
                        <tr>
                          <th>MD (ft)</th>
                          <th>INC (deg)</th>
                          <th>AZI (deg)</th>
                          <th>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(entry.source.surveys || []).map((s: SurveyRecord, idx: number) => (
                          <tr key={idx}>
                            <td>
                              <input
                                type="number"
                                value={s.md === 0 ? "" : s.md}
                                placeholder="0"
                                onChange={(e) =>
                                  handleSurveyChange(entry.wellId, idx, "md", e.target.value)
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={s.inc === 0 ? "" : s.inc}
                                placeholder="0"
                                onChange={(e) =>
                                  handleSurveyChange(entry.wellId, idx, "inc", e.target.value)
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={s.azi === 0 ? "" : s.azi}
                                placeholder="0"
                                onChange={(e) =>
                                  handleSurveyChange(entry.wellId, idx, "azi", e.target.value)
                                }
                              />
                            </td>
                            <td>
                              <button
                                className="delete-row-btn"
                                onClick={() => removeStation(entry.wellId, idx)}
                                disabled={(entry.source.surveys?.length ?? 0) <= 2}
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="survey-actions">
                      <button className="copy-btn full-width" onClick={() => copyPrimarySurveys(entry.wellId)}>
                        <Crosshair size={14} /> Copiar surveys del principal
                      </button>
                      <button className="copy-btn full-width" onClick={() => addStation(entry.wellId)}>
                        <Plus size={14} /> Agregar estación
                      </button>
                    </div>
                  </div>
                </div>
            );
          }
        })()}
            </div>
          );
        })}
      </div>

      {/* Compact Matrix View */}
      <div className="panel-detail-matrix">
        <table className="collision-matrix compact">
          <thead>
            <tr>
              <th>Pozo</th>
              <th>SF</th>
              <th>Riesgo</th>
            </tr>
          </thead>
          <tbody>
            {matrix.map((entry) => {
              const m = riskMeta(entry.result.riskLevel);
              return (
                <tr
                  key={entry.wellId}
                  className={m.className}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setActiveWellId(entry.wellId);
                    setEffectiveSelectedWellId(entry.wellId);
                  }}
                >
                  <td>{entry.wellName}</td>
                  <td>{fmtSf(entry.result.sf)}</td>
                  <td>
                    <span className={`risk-pill ${m.className} small`}>
                      <AlertTriangle size={10} /> {m.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

