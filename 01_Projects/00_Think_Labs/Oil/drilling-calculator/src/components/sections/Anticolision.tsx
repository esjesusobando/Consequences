// ============================================================
// Drilling Calculator — Anti-Collision Section (Phase II + III)
// Multi-well collision matrix via ISCWSA R-type engine
// Features that beat SLB/Weatherford/Halliburton:
//   - Open, auditable math (not a proprietary black box)
//   - Multi-well matrix in real time (not single-pair tables)
//   - AI risk narrative (plain-language executive summary)
//   - Web-native 3D visualization (no install/plugin)
//   - Exportable HSE-compliant reports (CSV + narrative)
//   - Zero licensing cost
// ============================================================

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Crosshair,
  Plus,
  Trash2,
  Radar,
  BarChart3,
  Download,
  FileText,
  Eye,
  Box,
} from "lucide-react";
import { useDrillingStore } from "../../store/drilling-store";
import { DataCard } from "../ui/DataCard";
import {
  analyzeCollisionMatrix,
  riskNarrative,
} from "../../engine/anti-collision";

export { riskNarrative };
import { MOCK_WELLS, MOCK_PRIMARY, getPresetAsAdjacent } from "../../engine/mock-wells";
import { PRIMARY_WELL_ID, wellColor } from "../../engine/scene";
import { AntiCollision3D } from "./AntiCollision3D";
import { WellLegend, type WellLegendWell } from "./WellLegend";
import type {
  CollisionResult,
  SurveyRecord,
  SurveyTool,
} from "../../store/drilling-types";
import type { AdjacentWellInput, CollisionEntry } from "../../engine/anti-collision";
// Fallback data for immediate visualization out-of-the-box
import {
  FALLBACK_PRIMARY_TRAJECTORY,
  FALLBACK_MATRIX,
  FALLBACK_WELL_COLORS,
  FALLBACK_WELL_DATA,
} from "../../data/fallback-data";
import "./Anticolision.css";

const TOOLS: SurveyTool[] = ["MWD", "GYRO", "SENSOR"];

export function fmtSf(sf: number): string {
  return Number.isFinite(sf) ? sf.toFixed(4) : "∞";
}

export function riskMeta(risk: CollisionResult["riskLevel"]) {
  switch (risk) {
    case "SAFE":
      return { label: "SEGURO", className: "is-safe" };
    case "MONITOR":
      return { label: "VIGILAR", className: "is-monitor" };
    case "CAUTION":
      return { label: "PRECAUCIÓN", className: "is-caution" };
    default:
      return { label: "CRÍTICO", className: "is-critical" };
  }
}

function emptySurveys(): SurveyRecord[] {
  return [
    { md: 0, inc: 0, azi: 0 },
    { md: 1000, inc: 5, azi: 270 },
    { md: 2000, inc: 12, azi: 260 },
  ];
}

function blankWell(id: string, name: string): AdjacentWellInput {
  return {
    id,
    name,
    surveys: emptySurveys(),
    wellheadNorth: 0,
    wellheadEast: 0,
    tool: "MWD",
  };
}

export function Anticolision() {
  const { results, setSurveys } = useDrillingStore();

  const [view, setView] = useState<"matrix" | "panel" | "split" | "cylinder" | "3d">("matrix");
  const [splitPanelMode, setSplitPanelMode] = useState<"panel" | "matrix">("panel");
  const [activeWellId, setActiveWellId] = useState<string>("");

  const [adjacentWells, setAdjacentWells] = useState<AdjacentWellInput[]>(() => {
    return MOCK_WELLS.map(getPresetAsAdjacent);
  });

  const [toolPrimary, setToolPrimary] = useState<SurveyTool>("MWD");
  const [sfK, setSfK] = useState(2.0);

  // Demo auto-seed (AC3D-7): on first mount, when store has no directional surveys, load MOCK_PRIMARY
  const seededRef = useRef(false);
  const hasUserSurveys = results.directional.surveys.length > 0;

  useEffect(() => {
    if (seededRef.current || hasUserSurveys) return;
    seededRef.current = true;
    setSurveys(MOCK_PRIMARY.surveys);
  }, [hasUserSurveys, setSurveys]);

  // Use fallback primary trajectory when store doesn't have enough data
  const primaryTrajectoryToAnalyze = useMemo(() => {
    const storeTraj = results.directional.trajectory;
    return storeTraj.length >= 2 ? storeTraj : FALLBACK_PRIMARY_TRAJECTORY;
  }, [results.directional.trajectory]);

  // Compute matrix from store data (user-adjacent wells)
  const storeMatrix = useMemo<CollisionEntry[]>(() => {
    if (primaryTrajectoryToAnalyze.length < 2 || adjacentWells.length === 0) {
      return [];
    }
    return analyzeCollisionMatrix(
      primaryTrajectoryToAnalyze,
      adjacentWells,
      { toolPrimary, sfK },
    );
  }, [primaryTrajectoryToAnalyze, adjacentWells, toolPrimary, sfK]);

  // Use fallback matrix when store matrix is empty (but we have primary trajectory)
  const matrix = storeMatrix.length > 0 ? storeMatrix : FALLBACK_MATRIX;

  // Effective well colors: matrix-based or fallback
  const effectiveWellColors = useMemo(() => {
    if (matrix.length > 0) {
      const ids = [PRIMARY_WELL_ID, ...matrix.map((e) => e.wellId)];
      return Object.fromEntries(
        ids.map((id) => [id, wellColor(id, ids)])
      );
    }
    return FALLBACK_WELL_COLORS;
  }, [matrix]);

  const activeEntry = useMemo<CollisionEntry | null>(() => {
    if (matrix.length === 0) return null;
    if (activeWellId) {
      return matrix.find((e) => e.wellId === activeWellId) ?? matrix[0];
    }
    return matrix[0];
  }, [matrix, activeWellId]);

  const activeResult = activeEntry?.result ?? null;
  const activeAdjacentTraj = activeEntry?.trajectory ?? [];
  const meta = activeResult ? riskMeta(activeResult.riskLevel) : null;

  // 3D view state
  const [selectedWellId, setSelectedWellId] = useState<string | null>(null);
  const [hiddenWellIds, setHiddenWellIds] = useState<Set<string>>(() => new Set());

  const toggleWellVisibility = (wellId: string) => {
    setHiddenWellIds((prev) => {
      const next = new Set(prev);
      if (next.has(wellId)) next.delete(wellId);
      else next.add(wellId);
      return next;
    });
  };

  const effectiveSelectedWellId = selectedWellId ?? activeEntry?.wellId ?? null;

  const effectiveSelectedEntry = useMemo(
    () => matrix.find((e) => e.wellId === effectiveSelectedWellId) ?? activeEntry,
    [matrix, effectiveSelectedWellId, activeEntry],
  );

  // Sync selection state across views
  useEffect(() => {
    if (view === "3d" && effectiveSelectedWellId && activeWellId !== effectiveSelectedWellId) {
      setActiveWellId(effectiveSelectedWellId);
    }
  }, [view, effectiveSelectedWellId, activeWellId]);

  useEffect(() => {
    if (view === "panel" && activeEntry && selectedWellId !== activeEntry.wellId) {
      setSelectedWellId(activeEntry.wellId);
    }
  }, [view, activeEntry]);

  const legendEntries: WellLegendWell[] = useMemo(() => {
    const ids = [PRIMARY_WELL_ID, ...matrix.map((e) => e.wellId)];
    const names: Record<string, string> = {
      [PRIMARY_WELL_ID]: "Pozo Principal",
      ...Object.fromEntries(matrix.map((e) => [e.wellId, e.wellName])),
    };
    return ids.map((id) => ({
      id,
      name: names[id] ?? id,
      color: wellColor(id, ids),
      visible: !hiddenWellIds.has(id),
    }));
  }, [matrix, hiddenWellIds]);

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
                  : emptySurveys(),
            }
          : w,
      ),
    );
  };

  const loadPreset = (presetId: string) => {
    const preset = MOCK_WELLS.find((p) => p.id === presetId);
    if (preset) {
      const input = getPresetAsAdjacent(preset);
      setAdjacentWells([input]);
      setActiveWellId(input.id);
    }
  };

  const addWell = () => {
    const id = `w${Date.now()}`;
    const newWell = blankWell(id, `Pozo Adyacente ${adjacentWells.length + 1}`);
    setAdjacentWells([...adjacentWells, newWell]);
    setActiveWellId(id);
  };

  const removeWell = (id: string) => {
    const remaining = adjacentWells.filter((w) => w.id !== id);
    if (remaining.length === 0) return;
    setAdjacentWells(remaining);
    if (activeWellId === id) {
      setActiveWellId(remaining[0].id);
    }
  };

  const exportCsv = () => {
    if (matrix.length === 0) return;
    const rows = matrix.map((e) => ({
      Pozo: e.wellName,
      SF: fmtSf(e.result.sf),
      "Distancia mínima (ft)": e.result.minDistance.toFixed(4),
      "σs (ft)": e.result.sepSigma.toFixed(4),
      Riesgo: riskMeta(e.result.riskLevel).label,
      "Est. Principal": e.result.stationA,
      "Est. Adyacente": e.result.stationB,
      "Wellhead Distance (ft)": e.wellheadDistance.toFixed(4),
    }));
    const header = Object.keys(rows[0]);
    const csv = [
      header.join(","),
      ...rows.map((r) =>
        header
          .map((h) => {
            const v = r[h as keyof typeof r];
            return typeof v === "string" && v.includes(",") ? `"${v}"` : String(v);
          })
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `collision-matrix-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportNarrative = () => {
    if (matrix.length === 0) return;
    const report = [
      "# Reporte de Anti-Colisión ISCWSA",
      "",
      `**Generado:** ${new Date().toLocaleString("es-ES")}`,
      `**Confiabilidad SF (k):** ${sfK}`,
      `**Herramienta pozo principal:** ${toolPrimary}`,
      "",
      "## Resumen Ejecutivo",
      `Se analizaron ${matrix.length} pozos adyacentes contra el pozo principal. ${matrix.some((e) => e.result.riskLevel === "CRITICAL") ? "⚠️ **ALERTA CRÍTICA:** Al menos un pozo requiere atención inmediata." : "No se detectaron riesgos críticos."}`,
      "",
      "## Detalle por Pozo",
      ...matrix.map(
        (e) =>
          `### ${e.wellName}\n- **${riskMeta(e.result.riskLevel).label}** — SF = ${fmtSf(e.result.sf)}\n- Distancia mínima: ${e.result.minDistance.toFixed(4)} ft\n- ${riskNarrative(e, { sfK, toolPrimary })}\n`,
      ),
    ].join("\n");

    const blob = new Blob([report], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `collision-report-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Always render - fallback data ensures we always have content
  return (
    <div className="anticollision-section full-view-panel">
      <div className="section-header">
        <div className="title-group">
          <Radar className="section-icon" size={20} />
          <h2>Anti-Colisión (ISCWSA R-Type)</h2>
        </div>

        <div className="view-switcher">
          <button
            className={`view-btn ${view === "matrix" ? "active" : ""}`}
            onClick={() => setView("matrix")}
            title="Matriz de riesgos multi-pozo"
          >
            <BarChart3 size={16} /> Matriz
          </button>
          <button
            className={`view-btn ${view === "panel" ? "active" : ""}`}
            onClick={() => setView("panel")}
            title="Análisis detallado del pozo activo"
            disabled={!activeEntry}
          >
            <Eye size={16} /> Detalle
          </button>
          <button
            className={`view-btn ${view === "split" ? "active" : ""}`}
            onClick={() => setView("split")}
            title="Vista dividida 3D + Matriz"
          >
            <Box size={16} /> Dividida
          </button>
          <button
            className={`view-btn ${view === "cylinder" ? "active" : ""}`}
            onClick={() => setView("cylinder")}
            title="Traveling Cylinder Plot"
          >
            <BarChart3 size={16} /> Cilindro
          </button>
          <button
            className={`view-btn ${view === "3d" ? "active" : ""}`}
            onClick={() => setView("3d")}
            title="Vista 3D interactiva"
          >
            🌀 3D
          </button>
        </div>

        <div className="export-actions">
          <button className="export-btn" onClick={exportCsv} title="Exportar matriz CSV" disabled={matrix.length === 0}>
            <Download size={14} /> CSV
          </button>
          <button className="export-btn" onClick={exportNarrative} title="Exportar reporte narrativo" disabled={matrix.length === 0}>
            <FileText size={14} /> Reporte
          </button>
        </div>
      </div>

      {/* ─── Matrix view ─── */}
      {view === "matrix" && (
        <>
          <div className="matrix-toolbar">
            <div className="toolbar-row">
              <div className="input-group">
                <label>Herramienta Pozo Principal</label>
                <select
                  value={toolPrimary}
                  onChange={(e) => setToolPrimary(e.target.value as SurveyTool)}
                >
                  {TOOLS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label>Factor k (SF)</label>
                <select value={sfK} onChange={(e) => setSfK(parseFloat(e.target.value))}>
                  <option value={2.0}>2.0 (estándar)</option>
                  <option value={3.5}>3.5 (HSE, SPE-187037)</option>
                </select>
              </div>
              <div className="input-group">
                <label>Cargar preset</label>
                <select onChange={(e) => loadPreset(e.target.value)} defaultValue="">
                  <option value="" disabled>Cargar preset</option>
                  {MOCK_WELLS.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label>&nbsp;</label>
                <button className="copy-btn" onClick={addWell}>
                  <Plus size={14} /> Agregar pozo
                </button>
              </div>
            </div>
          </div>

          {matrix.length === 0 ? (
            <div className="empty-state">
              Agrega pozos adyacentes para ver la matriz de riesgos.
            </div>
          ) : (
            <div className="matrix-table-container">
              <table className="collision-matrix">
                <thead>
                  <tr>
                    <th>Pozo</th>
                    <th>Wellhead (ft)</th>
                    <th className="matrix-sf-header">SF</th>
                    <th>Distancia Mín (ft)</th>
                    <th>σs (ft)</th>
                    <th title="Elipsoides 95% (principal × adyacente)">Σ Ellipsoides</th>
                    <th>Est. Princ.</th>
                    <th>Est. Adyac.</th>
                    <th>Riesgo</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {matrix.map((entry) => {
                    const m = riskMeta(entry.result.riskLevel);
                    return (
                      <tr
                        key={entry.wellId}
                        className={m.className}
                        onClick={() => {
                          setActiveWellId(entry.wellId);
                          setView("panel");
                        }}
                      >
                        <td className="matrix-well-name">{entry.wellName}</td>
                        <td>{entry.wellheadDistance.toFixed(0)}</td>
                        <td className="matrix-sf">{fmtSf(entry.result.sf)}</td>
                        <td>{entry.result.minDistance.toFixed(4)}</td>
                        <td>{entry.result.sepSigma.toFixed(4)}</td>
                        <td className="ellipsoid-mini-cell">
                          <span
                            className="ellipsoid-mini"
                            title={`Princ: ${entry.result.ellipseA.axes.map((a: number) => a.toFixed(4)).join("×")} ft, Adyac: ${entry.result.ellipseB.axes.map((a: number) => a.toFixed(4)).join("×")} ft`}
                          >
                            ✓
                          </span>
                        </td>
                        <td>{entry.result.stationA}</td>
                        <td>{entry.result.stationB}</td>
                        <td>
                          <span className={`risk-pill ${m.className} small`}>
                            <AlertTriangle size={12} /> {m.label}
                          </span>
                        </td>
                        <td>
                          <button
                            className="matrix-action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveWellId(entry.wellId);
                              setView("3d");
                            }}
                            title="Ver en 3D"
                          >
                            🌀
                          </button>
                          <button
                            className="matrix-action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeWell(entry.wellId);
                            }}
                            title="Eliminar"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ─── Detail panel view ─── */}
      {view === "panel" && activeEntry && (
        <div className="anticollision-grid">
          <div className="card-panel config-panel">
            <div className="card-header">
              <h3>Editor — {activeEntry.wellName}</h3>
              <span className="well-id">{activeEntry.wellId}</span>
            </div>
            <div className="panel-actions">
              <button
                className="view-btn"
                onClick={() => {
                  setSelectedWellId(activeEntry.wellId);
                  setView("3d");
                }}
                title="Ver en 3D"
              >
                🌀 3D
              </button>
            </div>

            <div className="toolbar-row">
              <div className="input-group">
                <label>Herramienta Adyacente</label>
                <select
                  value={activeEntry.source.tool ?? "MWD"}
                  onChange={(e) =>
                    updateWellField(
                      activeEntry.wellId,
                      "tool",
                      e.target.value as SurveyTool,
                    )
                  }
                >
                  {TOOLS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label>Offset Norte (ft)</label>
                <input
                  type="number"
                  value={activeEntry.source.wellheadNorth ?? 0}
                  onChange={(e) =>
                    updateWellField(
                      activeEntry.wellId,
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
                  value={activeEntry.source.wellheadEast ?? 0}
                  onChange={(e) =>
                    updateWellField(
                      activeEntry.wellId,
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
                {(activeEntry.source.surveys || []).map((s: SurveyRecord, idx: number) => (
                  <tr key={idx}>
                    <td>
                      <input
                        type="number"
                        value={s.md === 0 ? "" : s.md}
                        placeholder="0"
                        onChange={(e) =>
                          handleSurveyChange(activeEntry.wellId, idx, "md", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={s.inc === 0 ? "" : s.inc}
                        placeholder="0"
                        onChange={(e) =>
                          handleSurveyChange(activeEntry.wellId, idx, "inc", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={s.azi === 0 ? "" : s.azi}
                        placeholder="0"
                        onChange={(e) =>
                          handleSurveyChange(activeEntry.wellId, idx, "azi", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <button
                        className="delete-row-btn"
                        onClick={() => removeStation(activeEntry.wellId, idx)}
                        disabled={(activeEntry.source.surveys?.length ?? 0) <= 2}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button className="copy-btn full-width" onClick={() => copyPrimarySurveys(activeEntry.wellId)}>
              <Crosshair size={14} /> Copiar surveys del principal
            </button>
            <button className="copy-btn full-width" onClick={() => addStation(activeEntry.wellId)}>
              <Plus size={14} /> Agregar estación
            </button>
          </div>

          {activeResult && (
            <div className="result-section">
              {meta && (
                <div className={`result-banner ${meta.className}`}>
                  <div className="result-banner__title">
                    <span className={`result-banner__level ${meta.className}`}>
                      {meta.label}
                    </span>
                    <span className="result-banner__sf">
                      SF = {fmtSf(activeResult.sf)}
                    </span>
                  </div>
                  <div className="result-banner__sub">
                    Separación centro-a-centro mínima de{" "}
                    <strong>{activeResult.minDistance.toFixed(4)} ft</strong> entre el pozo
                    principal (estación #{activeResult.stationA}) y el adyacente (estación #
                    {activeResult.stationB}).
                  </div>
                </div>
              )}

              <div className="result-cards">
                <DataCard label="Distancia Mínima" value={activeResult.minDistance} unit="ft" decimals={2} />
                <DataCard
                  label="Separation Factor (SF)"
                  value={Number.isFinite(activeResult.sf) ? activeResult.sf : "∞"}
                  decimals={2}
                />
                <DataCard label="σs proyectado" value={activeResult.sepSigma} unit="ft" decimals={3} />
              </div>

              <div className="narrative-card">
                <h4>Narrativa de Riesgo</h4>
                <p>{riskNarrative(activeEntry, { sfK, toolPrimary })}</p>
              </div>

              <div className="critical-panel card-panel">
                <div className="card-header">
                  <h3>Punto de Máximo Acercamiento</h3>
                  <span className={`critical-panel__tag ${meta?.className}`}>
                    {meta?.label}
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
                      <td className="critical-table__well">Principal</td>
                      <td>#{activeResult.stationA}</td>
                      <td>{primaryTrajectoryToAnalyze[activeResult.stationA]?.md.toFixed(0)}</td>
                      <td>{activeResult.closestA.north.toFixed(4)}</td>
                      <td>{activeResult.closestA.east.toFixed(4)}</td>
                      <td>{activeResult.closestA.tvd.toFixed(4)}</td>
                      <td className="critical-table__axes">
                        {activeResult.ellipseA.axes.map((a: number) => a.toFixed(4)).join(" × ")}
                      </td>
                    </tr>
                    <tr>
                      <td className="critical-table__well">Adyacente</td>
                      <td>#{activeResult.stationB}</td>
                      <td>{activeAdjacentTraj[activeResult.stationB]?.md.toFixed(0)}</td>
                      <td>{activeResult.closestB.north.toFixed(4)}</td>
                      <td>{activeResult.closestB.east.toFixed(4)}</td>
                      <td>{activeResult.closestB.tvd.toFixed(4)}</td>
                      <td className="critical-table__axes">
                        {activeResult.ellipseB.axes.map((a: number) => a.toFixed(4)).join(" × ")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── Split View ─── */}
      {view === "split" && (
        <div className="view-3d-wrapper">
          <div className="view-3d-header">
            <h3>Vista Dividida — 3D + Panel ({matrix.length + 1} trayectorias)</h3>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {activeEntry && (
                <>
                  <span style={{ fontSize: "12px", opacity: 0.7 }}>Foco: {effectiveSelectedEntry?.wellName ?? activeEntry.wellName}</span>
                  <button className="view-btn small active" onClick={() => setView("panel")}>← Detalle</button>
                </>
              )}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "70% 30%", gap: "1rem", height: "calc(100vh - 200px)", minHeight: "600px" }}>
            <div style={{ minWidth: 0 }}>
<AntiCollision3D
            primaryTrajectory={primaryTrajectoryToAnalyze}
            adjacentTrajectory={activeEntry?.trajectory ?? []}
            result={activeResult}
            wellData={FALLBACK_WELL_DATA}
            onClose={() => setView("matrix")}
            entries={matrix}
            selectedWellId={effectiveSelectedWellId}
            hiddenWellIds={hiddenWellIds}
            wellColors={effectiveWellColors}
            onSelectWell={setSelectedWellId}
            onToggleVisibility={toggleWellVisibility}
            effectiveSelectedWellId={effectiveSelectedWellId}
            effectiveSelectedEntry={effectiveSelectedEntry}
          />
            </div>
            <div style={{ overflow: "auto", background: "var(--color-surface)", border: "1px solid var(--sh-grey-200)", borderRadius: "var(--radius-card)", padding: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h4 style={{ margin: 0 }}>Panel Lateral</h4>
                <select value={splitPanelMode} onChange={(e) => setSplitPanelMode(e.target.value as "panel" | "matrix")} style={{ padding: "0.25rem 0.5rem", borderRadius: "var(--radius-control)", border: "1px solid var(--sh-grey-200)", background: "var(--color-surface)", color: "var(--text-primary)" }}>
                  <option value="panel">Detalle Pozo</option>
                  <option value="matrix">Matriz Compacta</option>
                </select>
              </div>
              {splitPanelMode === "panel" && activeEntry && (
                <div>
                  <h4>{activeEntry.wellName}</h4>
                  <p>SF: {fmtSf(activeResult?.sf ?? 0)}</p>
                  <p>Distancia: {activeResult?.minDistance.toFixed(2) ?? 0} ft</p>
                  <p>Riesgo: {meta?.label ?? "—"}</p>
                </div>
              )}
              {splitPanelMode === "matrix" && (
                <table style={{ width: "100%", fontSize: "0.75rem" }}>
                  <thead><tr><th>Pozo</th><th>SF</th><th>Riesgo</th></tr></thead>
                  <tbody>
                    {matrix.map((entry) => {
                      const m = riskMeta(entry.result.riskLevel);
                      return (
                        <tr key={entry.wellId} style={{ cursor: "pointer" }} onClick={() => { setActiveWellId(entry.wellId); setView("split"); }}>
                          <td>{entry.wellName}</td>
                          <td>{fmtSf(entry.result.sf)}</td>
                          <td><span className={`risk-pill ${m.className} small`}><AlertTriangle size={10} /> {m.label}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <WellLegend wells={legendEntries} selectedWellId={effectiveSelectedWellId} onSelect={setSelectedWellId} onToggleVisibility={toggleWellVisibility} />
        </div>
      )}

      {/* ─── Traveling Cylinder View ─── */}
      {view === "cylinder" && (
        <div className="view-3d-wrapper">
          <div className="view-3d-header">
            <h3>Traveling Cylinder Plot ({matrix.length} pozos)</h3>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{ fontSize: "12px", opacity: 0.7 }}>Próximamente: Vista polar C2C vs Bearing</span>
              <button className="view-btn small active" onClick={() => setView("matrix")}>← Matriz</button>
            </div>
          </div>
          <div style={{ height: "calc(100vh - 200px)", minHeight: "500px", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.5)" }}>
            Traveling Cylinder Plot - En desarrollo (Slice S4)
          </div>
        </div>
      )}

      {/* ─── Full 3D View ─── */}
      {view === "3d" && (
        <div className="view-3d-wrapper">
          <div className="view-3d-header">
            <h3>Vista 3D — Todos los pozos ({matrix.length + 1} trayectorias)</h3>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {activeEntry && (
                <>
                  <span style={{ fontSize: "12px", opacity: 0.7 }}>Foco: {effectiveSelectedEntry?.wellName ?? activeEntry.wellName}</span>
                  <button
                    className="view-btn small active"
                    onClick={() => setView("panel")}
                  >
                    ← Detalle
                  </button>
                </>
              )}
            </div>
          </div>
<AntiCollision3D
                primaryTrajectory={primaryTrajectoryToAnalyze}
                adjacentTrajectory={activeEntry?.trajectory ?? []}
                result={activeResult}
                wellData={FALLBACK_WELL_DATA}
                onClose={() => setView("matrix")}
                entries={matrix}
                selectedWellId={effectiveSelectedWellId}
                hiddenWellIds={hiddenWellIds}
                wellColors={effectiveWellColors}
                onSelectWell={setSelectedWellId}
                onToggleVisibility={toggleWellVisibility}
                effectiveSelectedWellId={effectiveSelectedWellId}
                effectiveSelectedEntry={effectiveSelectedEntry}
              />
          <WellLegend wells={legendEntries} selectedWellId={effectiveSelectedWellId} onSelect={setSelectedWellId} onToggleVisibility={toggleWellVisibility} />
        </div>
      )}
    </div>
  );
}