import React, { useState } from "react";
import {
  Zap,
  X,
  Bookmark,
  Plus,
  Check,
  Save,
  Trash2,
  Clock,
  Layout,
  PanelLeft,
  PanelRight,
  Eye,
  EyeOff,
  LineChart,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { useDrillingStore } from "../../store/drilling-store";
import "./AIPMMenu.css";

interface AIPMMenuProps {}

export const AIPMMenu: React.FC<AIPMMenuProps> = () => {
  const {
    notes,
    addNote,
    toggleNote,
    removeNote,
    snapshots,
    saveSnapshot,
    removeSnapshot,
    showLeftPanel,
    showRightPanel,
    toggleLeftPanel,
    toggleRightPanel,
    zenMode,
    setZenMode,
    showGraphs,
    setShowGraphs,
  } = useDrillingStore();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);
  const [activeSection, setActiveSection] = useState<"menu" | "notes">("menu");
  const [noteInput, setNoteInput] = useState("");

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    addNote(noteInput);
    setNoteInput("");
  };

  return (
    <div
      ref={menuRef}
      className={`aipm-menu-container ${isOpen ? "is-open" : ""}`}
    >
      <button
        className="aipm-trigger"
        onClick={() => {
          setIsOpen(!isOpen);
          setActiveSection("menu");
        }}
        title="Menú Control (AIPM)"
      >
        <div className="aipm-trigger-inner">
          <Zap
            size={20}
            className="aipm-zap-icon"
            strokeWidth={1.5}
            fill={isOpen ? "var(--sh-blue-500)" : "none"}
          />
          {(notes.length > 0 || snapshots.length > 0) && (
            <span className="aipm-badge">
              {notes.length + snapshots.length}
            </span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="aipm-dropdown">
          {activeSection === "menu" ? (
            <div className="aipm-main-menu">
              <div className="aipm-header">
                <h4>AIPM Control</h4>
                <button onClick={() => setIsOpen(false)}>
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>

              <div className="aipm-options">
                <button
                  className="aipm-option"
                  onClick={() => setActiveSection("notes")}
                >
                  <Bookmark size={18} strokeWidth={1.5} />
                  <span>Notas y Parámetros</span>
                  <span className="option-count">
                    {notes.length + snapshots.length}
                  </span>
                </button>

                <button
                  className={`aipm-option ${!showLeftPanel ? "active" : ""}`}
                  onClick={toggleLeftPanel}
                >
                  <PanelLeft size={18} strokeWidth={1.5} />
                  <span>
                    {showLeftPanel ? "Ocultar Entradas" : "Mostrar Entradas"}
                  </span>
                </button>

                <button
                  className={`aipm-option ${!showRightPanel ? "active" : ""}`}
                  onClick={toggleRightPanel}
                >
                  <PanelRight size={18} strokeWidth={1.5} />
                  <span>
                    {showRightPanel ? "Ocultar Alertas" : "Mostrar Alertas"}
                  </span>
                </button>

                <div className="aipm-divider" />

                <button
                  className="aipm-option"
                  onClick={() => {
                    toggleLeftPanel();
                    toggleRightPanel();
                  }}
                >
                  <Layout size={18} strokeWidth={1.5} />
                  <span>Alternar Todo</span>
                  <kbd>Tab</kbd>
                </button>

                <button
                  className={`aipm-option ${!showGraphs ? "active" : ""}`}
                  onClick={() => setShowGraphs(!showGraphs)}
                >
                  <LineChart size={18} strokeWidth={1.5} />
                  <span>
                    {showGraphs ? "Ocultar Gráficas" : "Mostrar Gráficas"}
                  </span>
                </button>

                <button
                  className={`aipm-option ${zenMode ? "active" : ""}`}
                  onClick={() => setZenMode(!zenMode)}
                >
                  {zenMode ? (
                    <Eye size={18} strokeWidth={1.5} />
                  ) : (
                    <EyeOff size={18} strokeWidth={1.5} />
                  )}
                  <span>{zenMode ? "Jetro Zen: ON" : "Jetro Zen: OFF"}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="aipm-notes-section">
              <div className="aipm-header">
                <button
                  className="back-btn"
                  onClick={() => setActiveSection("menu")}
                >
                  ← Volver
                </button>
                <h4>Notas AIPM</h4>
                <button onClick={() => setIsOpen(false)}>
                  <X size={14} strokeWidth={1.5} />
                </button>
              </div>

              <form onSubmit={handleAddNote} className="aipm-note-form">
                <input
                  type="text"
                  placeholder="Escribe una nota..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  autoFocus
                />
                <button type="submit">
                  <Plus size={18} strokeWidth={1.5} />
                </button>
              </form>

              <div className="aipm-scroll-area">
                <div className="section-label">Notas de Campo</div>
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className={`aipm-note-item ${note.completed ? "done" : ""}`}
                  >
                    <button
                      className="check-btn"
                      onClick={() => toggleNote(note.id)}
                    >
                      <Check size={12} strokeWidth={1.5} />
                    </button>
                    <span className="note-text">{note.content}</span>
                    <button
                      className="del-btn"
                      onClick={() => removeNote(note.id)}
                    >
                      <X size={12} strokeWidth={1.5} />
                    </button>
                  </div>
                ))}

                <div className="section-label snapshots">
                  <span>Capturas</span>
                  <button
                    className="save-btn"
                    onClick={() =>
                      saveSnapshot(`Escenario ${snapshots.length + 1}`)
                    }
                  >
                    <Save size={12} strokeWidth={1.5} /> Guardar
                  </button>
                </div>
                {snapshots.map((snap) => (
                  <div key={snap.id} className="aipm-snap-item">
                    <div className="snap-info">
                      <span className="snap-name">{snap.label}</span>
                      <span className="snap-date">
                        <Clock size={12} strokeWidth={1.5} /> {snap.timestamp}
                      </span>
                    </div>
                    <button
                      className="del-btn"
                      onClick={() => removeSnapshot(snap.id)}
                    >
                      <Trash2 size={12} strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
