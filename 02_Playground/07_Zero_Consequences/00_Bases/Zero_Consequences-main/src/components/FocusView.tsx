import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Mic, 
  MicOff, 
  BookOpen, 
  Plus, 
  Trash2, 
  Share2, 
  Check, 
  Loader2, 
  Lightbulb, 
  Sparkles,
  Settings,
  X,
  FileText,
  AlertCircle,
  Sun,
  Moon
} from "lucide-react";
import { CalendarEvent } from "../types";
import { translations } from "../lib/translations";

const formatEventDay = (dateStr?: string, lang: 'es' | 'en' = 'es') => {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'short' 
    });
  } catch (e) {
    return dateStr;
  }
};

const formatTimeRange = (start?: string, end?: string, lang: 'es' | 'en' = 'es') => {
  if (!start) return "-";
  try {
    const s = new Date(start);
    const startStr = s.toLocaleTimeString(lang === 'es' ? 'es-ES' : 'en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: lang === 'en'
    });
    
    if (!end) return startStr;
    const e = new Date(end);
    const endStr = e.toLocaleTimeString(lang === 'es' ? 'es-ES' : 'en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: lang === 'en'
    });
    return `${startStr} - ${endStr}`;
  } catch (e) {
    return start;
  }
};

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  type: 'voice' | 'manual';
}

interface FocusViewProps {
  nextEvent: CalendarEvent | null;
  timeRemaining: string;
  language?: 'es' | 'en';
  themeMode?: 'craft' | 'cyber';
}

export default function FocusView({ nextEvent, timeRemaining, language = 'es', themeMode: propThemeMode = 'craft' }: FocusViewProps) {
  const t = translations[language];

  // Theme support: default to local storage or fallback to propThemeMode
  const [themeMode, setThemeMode] = useState<'craft' | 'cyber'>(() => {
    return (localStorage.getItem("CONSEQUENCES_FOCUS_THEME") as 'craft' | 'cyber') || propThemeMode;
  });

  useEffect(() => {
    if (propThemeMode) {
      setThemeMode(propThemeMode);
    }
  }, [propThemeMode]);

  const toggleThemeMode = () => {
    const next = themeMode === 'craft' ? 'cyber' : 'craft';
    setThemeMode(next);
    localStorage.setItem("CONSEQUENCES_FOCUS_THEME", next);
  };

  const isLight = themeMode === 'craft';

  // Timer States
  const [duration, setDuration] = useState(25 * 60); // 25 minutes default
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [timerPreset, setTimerPreset] = useState<'deep' | 'light' | 'rest' | 'custom'>('deep');
  const [customMinutes, setCustomMinutes] = useState("25");

  // Notes States
  const [notes, setNotes] = useState<Note[]>(() => {
    const cached = localStorage.getItem("CONSEQUENCES_FOCUS_NOTES");
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { return []; }
    }
    return [
      {
        id: "note_1",
        title: "Puntos clave de Enfoque",
        content: "Enfoque profundo activado. Reduciendo distracciones y optimizando el flujo de trabajo.",
        createdAt: new Date().toISOString(),
        type: 'manual'
      }
    ];
  });
  
  const [titleInput, setTitleInput] = useState("");
  const [contentInput, setContentInput] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // Speech Recognition States
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  
  const recognitionRef = useRef<any>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Gemini & API Integrations States
  const [isRefining, setIsRefining] = useState(false);
  const [isExportingNotion, setIsExportingNotion] = useState(false);
  const [isExportingTodoist, setIsExportingTodoist] = useState(false);
  const [exportMessage, setExportMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' | null }>({ text: "", type: null });

  // Notion & Todoist Keys
  const [notionToken, setNotionToken] = useState(() => localStorage.getItem("CONSEQUENCES_NOTION_TOKEN") || "");
  const [notionDatabaseId, setNotionDatabaseId] = useState(() => localStorage.getItem("CONSEQUENCES_NOTION_DB_ID") || "");
  const [todoistToken, setTodoistToken] = useState(() => localStorage.getItem("CONSEQUENCES_TODOIST_TOKEN") || "");
  const [showConfig, setShowConfig] = useState(false);

  // Timer Tick Side Effect
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      // Play a completed signal via Browser audio synth
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
      } catch (e) {}
      setExportMessage({ text: language === 'es' ? "✓ SESIÓN COMPLETADA. Ciclo finalizado exitosamente." : "✓ FOCUS SESSION COMPLETED. Timer finished successfully.", type: 'success' });
    }
    return () => clearInterval(timerId);
  }, [timerActive, timeLeft, language]);

  // Sync cache
  useEffect(() => {
    localStorage.setItem("CONSEQUENCES_FOCUS_NOTES", JSON.stringify(notes));
  }, [notes]);

  // Keep API tokens saved
  const saveTokens = () => {
    localStorage.setItem("CONSEQUENCES_NOTION_TOKEN", notionToken);
    localStorage.setItem("CONSEQUENCES_NOTION_DB_ID", notionDatabaseId);
    localStorage.setItem("CONSEQUENCES_TODOIST_TOKEN", todoistToken);
    setExportMessage({ text: language === 'es' ? "✓ Llaves guardadas localmente." : "✓ Keys saved locally.", type: 'success' });
    setTimeout(() => setExportMessage({ text: "", type: null }), 3000);
  };

  // Inspect Browser Speech Recognition
  useEffect(() => {
    const SpeechLib = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechLib) {
      setSpeechSupported(true);
      const rec = new SpeechLib();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = language === 'es' ? "es-ES" : "en-US";

      rec.onstart = () => {
        setIsRecording(true);
        setInterimTranscript("");
        setRecordingSeconds(0);
        recordingTimerRef.current = setInterval(() => {
          setRecordingSeconds((prev) => prev + 1);
        }, 1000);
      };

      rec.onresult = (event: any) => {
        let finalTrans = "";
        let interimTrans = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTrans += event.results[i][0].transcript;
          } else {
            interimTrans += event.results[i][0].transcript;
          }
        }
        if (finalTrans) {
          setContentInput((prev) => prev + (prev ? " " : "") + finalTrans);
        }
        setInterimTranscript(interimTrans);
      };

      rec.onerror = (err: any) => {
        console.error("Speech error", err);
        setIsRecording(false);
        if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      };

      rec.onend = () => {
        setIsRecording(false);
        if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      };

      recognitionRef.current = rec;
    }
  }, [language]);

  const handleToggleRecord = () => {
    if (!speechSupported) {
      setExportMessage({ 
        text: language === 'es' 
          ? "El navegador no soporta transcripción por voz. Se ha añadido un dictado de ejemplo."
          : "Voice recognition is not supported in this environment. Added sample dictation text.", 
        type: 'info' 
      });
      setIsRecording(true);
      setRecordingSeconds(0);
      setTimeout(() => {
        setIsRecording(false);
        const sampleText = language === 'es'
          ? "Preparando puntos clave: revisar la agenda de mañana y refinar tareas de integración."
          : "Drafting key items: review tomorrow's agenda and refine integration tasks.";
        setContentInput((prev) => prev + (prev ? " " : "") + sampleText);
        if (!titleInput) setTitleInput(language === 'es' ? "Dictado de voz de Enfoque" : "Voice Dictation Note");
      }, 2000);
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      try {
        if (!titleInput) {
          setTitleInput(language === 'es' ? "Nota de Voz Enfoque" : "Voice Note Focus");
        }
        recognitionRef.current.start();
      } catch (err) {
        console.warn("Speech start err", err);
        setIsRecording(true);
        setTimeout(() => {
          setIsRecording(false);
          setContentInput((prev) => prev + (prev ? " " : "") + (language === 'es' ? "Nota añadida mediante el transcriptor." : "Note added through dictation."));
        }, 2000);
      }
    }
  };

  // Focus preset buttons
  const applyPreset = (preset: 'deep' | 'light' | 'rest') => {
    setTimerPreset(preset);
    if (preset === 'deep') {
      setDuration(25 * 60);
      setTimeLeft(25 * 60);
    } else if (preset === 'light') {
      setDuration(15 * 60);
      setTimeLeft(15 * 60);
    } else {
      setDuration(5 * 60);
      setTimeLeft(5 * 60);
    }
    setTimerActive(false);
  };

  const handleCustomTime = () => {
    const mins = parseInt(customMinutes, 10);
    if (!isNaN(mins) && mins > 0) {
      setTimerPreset('custom');
      setDuration(mins * 60);
      setTimeLeft(mins * 60);
      setTimerActive(false);
    }
  };

  // Notes actions
  const handleSaveNote = () => {
    const title = titleInput.trim() || (language === 'es' ? `Nota manual #${notes.length + 1}` : `Manual Note #${notes.length + 1}`);
    const content = contentInput.trim();
    if (!content) return;

    if (selectedNote) {
      // Updating
      const updated = notes.map((n) => n.id === selectedNote.id ? { ...n, title, content } : n);
      setNotes(updated);
      setSelectedNote(null);
    } else {
      // Create new
      const newNote: Note = {
        id: `note_${Date.now()}`,
        title,
        content,
        createdAt: new Date().toISOString(),
        type: isRecording ? 'voice' : 'manual'
      };
      setNotes([newNote, ...notes]);
    }

    setTitleInput("");
    setContentInput("");
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
      setTitleInput("");
      setContentInput("");
    }
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setTitleInput(note.title);
    setContentInput(note.content);
  };

  // Refine transcript with Gemini API PROXY endpoint
  const handleSmartRefine = async () => {
    const valueToRefine = contentInput.trim();
    if (!valueToRefine) return;

    setIsRefining(true);
    setExportMessage({ text: language === 'es' ? "Optimizando texto con Gemini..." : "Optimizing text with Gemini...", type: 'info' });

    try {
      const response = await fetch("/api/focus/gemini-refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: valueToRefine })
      });
      const data = await response.json();
      if (data.text) {
        setContentInput(data.text);
        if (!titleInput || titleInput.startsWith("Dictado") || titleInput.startsWith("Nota de Voz")) {
          setTitleInput(language === 'es' ? "Nota pulida por Gemini" : "Gemini Refined Note");
        }
        setExportMessage({ text: language === 'es' ? "✓ Corregido por Gemini exitosamente." : "✓ Successfully refined by Gemini.", type: 'success' });
      } else {
        setExportMessage({ text: language === 'es' ? "No se recibió respuesta de IA." : "No AI response received.", type: 'error' });
      }
    } catch (e: any) {
      setExportMessage({ text: `Error: ${e?.message || e}`, type: 'error' });
    } finally {
      setIsRefining(false);
      setTimeout(() => setExportMessage({ text: "", type: null }), 4000);
    }
  };

  // Push to Notion
  const handleExportToNotion = async (note: Note) => {
    if (!notionToken || !notionDatabaseId) {
      setExportMessage({ text: language === 'es' ? "Ingresa tu Token de Notion y Database ID en el panel de contraseñas." : "Please configure your Notion Integration Token and Database ID.", type: 'error' });
      setShowConfig(true);
      return;
    }

    setIsExportingNotion(true);
    setExportMessage({ text: language === 'es' ? "Exportando nota a Notion..." : "Exporting note to Notion...", type: 'info' });

    try {
      const res = await fetch("/api/focus/export/notion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: notionToken,
          databaseId: notionDatabaseId,
          title: note.title,
          content: note.content
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setExportMessage({ text: language === 'es' ? "✓ Exportado a Notion perfectamente." : "✓ Successfully exported to Notion.", type: 'success' });
      } else {
        setExportMessage({ text: `Notion Error: ${data.error || "Verifique sus tokens."}`, type: 'error' });
      }
    } catch (err: any) {
      setExportMessage({ text: `Network Error: ${err?.message || err}`, type: 'error' });
    } finally {
      setIsExportingNotion(false);
    }
  };

  // Push to Todoist
  const handleExportToTodoist = async (note: Note) => {
    if (!todoistToken) {
      setExportMessage({ text: language === 'es' ? "Ingresa tu API Token de Todoist." : "Please configure your Todoist Token.", type: 'error' });
      setShowConfig(true);
      return;
    }

    setIsExportingTodoist(true);
    setExportMessage({ text: language === 'es' ? "Exportando tarea a Todoist..." : "Exporting note to Todoist...", type: 'info' });

    try {
      const res = await fetch("/api/focus/export/todoist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: todoistToken,
          title: note.title,
          content: note.content
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setExportMessage({ text: language === 'es' ? "✓ Tarea enviada a Todoist." : "✓ Exported task to Todoist.", type: 'success' });
      } else {
        setExportMessage({ text: `Todoist Error: ${data.error || "Verifique su token."}`, type: 'error' });
      }
    } catch (err: any) {
      setExportMessage({ text: `Network Error: ${err?.message || err}`, type: 'error' });
    } finally {
      setIsExportingTodoist(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatDate = (isoStr: string) => {
    const d = new Date(isoStr);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const progressRatio = timeLeft / duration;

  return (
    <div className={`flex-grow flex flex-col gap-6 pb-12 font-sans antialiased select-none animate-fadeIn transition-colors duration-200 ${
      isLight ? 'text-zinc-800' : 'text-bone'
    }`}>
      
      {/* Top Header Banner stylized like Craft / Obsidian minimal toolbar */}
      <section className={`relative border p-6 rounded-2xl overflow-hidden transition-all duration-300 ${
        isLight 
          ? 'border-zinc-200 bg-white shadow-xs' 
          : 'border-graphite bg-[#0B0F18]/50 shadow-none'
      }`}>
        {!isLight && (
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1E2435_1px,transparent_1px),linear-gradient(to_bottom,#1E2435_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-5 pointer-events-none"></div>
        )}
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex flex-col gap-1.5 md:max-w-xl">
            <div className={`inline-flex self-start items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium leading-none uppercase tracking-wider ${
              isLight 
                ? 'bg-[#0052FF]/5 text-[#0052FF] border border-[#0052FF]/15' 
                : 'bg-[#00F0FF]/5 border border-[#00F0FF]/15 text-[#00F0FF]'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isLight ? 'bg-[#0052FF] animate-pulse' : 'bg-[#00F0FF] animate-pulse'}`}></span>
              {isLight ? (language === 'es' ? "Estilo Craft Light" : "Craft Light Design") : t.focus.protocol_active}
            </div>
            <h1 className={`text-xl font-display font-bold tracking-tight ${isLight ? 'text-zinc-900' : 'text-white'}`}>
              {language === 'es' ? "Enfoque y Notas de Reunión" : "Focus & Meeting Notepad"}
            </h1>
            <p className={`text-xs font-light leading-relaxed ${isLight ? 'text-zinc-500' : 'text-[#7A839E]'}`}>
              {language === 'es' 
                ? "Mantén la concentración de forma limpia y productiva. Organiza pomodoros de flujo de trabajo, dicta o escribe de manera directa y expórtalas de manera integrada."
                : "Organize workflows, capture quick thoughts or structured transcripts and export them right into your productivity toolkit."
              }
            </p>
          </div>

          {/* Interactive High-contrast aesthetics switcher */}
          <div className="flex items-center gap-3 self-start md:self-auto border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 border-zinc-200/80 dark:border-graphite/60">
            <button 
              onClick={toggleThemeMode} 
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all duration-300 active:scale-95 cursor-pointer shadow-xs ${
                isLight 
                  ? 'bg-gradient-to-r from-[#0052FF] to-[#8FEF10] border-transparent text-white hover:opacity-95 shadow-[0_4px_12px_rgba(0,82,255,0.15)]' 
                  : 'bg-[#1E2435] border border-[#2A3148] text-white hover:border-[#00F0FF] hover:bg-[#202739]'
              }`}
            >
              {isLight ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-orange-200 fill-orange-200" />
                  <span>{language === 'es' ? "Cambiar a Cyber Dark" : "Theme: Cyber Dark"}</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#C6FF3D] fill-[#C6FF3D]" />
                  <span>{language === 'es' ? "Cambiar a Craft Light" : "Theme: Craft Light"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Notifications system bar */}
      {exportMessage.text && (
        <div className={`p-4 rounded-xl font-mono text-xs flex items-center gap-3 border animate-fadeIn transition-all duration-300 ${
          isLight
            ? 'bg-zinc-50 border-zinc-200 text-zinc-800'
            : exportMessage.type === 'success' 
              ? 'bg-[#C6FF3D]/5 border-[#C6FF3D]/30 text-[#C6FF3D]'
              : exportMessage.type === 'error' 
                ? 'bg-[#FF2E9A]/5 border-[#FF2E9A]/30 text-[#FF2E9A]'
                : 'bg-[#00F0FF]/5 border-[#00F0FF]/30 text-[#00F0FF]'
        }`}>
          <AlertCircle className="w-4 h-4 text-zinc-500 flex-shrink-0" />
          <span className="flex-grow font-light leading-snug">{exportMessage.text}</span>
          <button 
            onClick={() => setExportMessage({ text: "", type: null })}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Focus Views grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
        
        {/* COLUMN 1: Huge Visible Clean Pomodoro Timer (Col 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6" id="pomodoro_timer_pillar">
          <div className={`border p-6 sm:p-8 rounded-2xl flex flex-col items-center justify-center relative min-h-[440px] transition-all duration-300 ${
            isLight 
              ? 'border-zinc-200 bg-white shadow-sm' 
              : 'border-graphite bg-[#060910]/95 shadow-none'
          }`}>
            
            <div className="absolute top-4 left-5 font-mono text-[9px] text-zinc-400 font-semibold tracking-widest uppercase">
              {language === 'es' ? "TEMPORIZADOR" : "WORK INTERVAL"}
            </div>
            
            <div className="absolute top-4 right-5 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${timerActive ? 'bg-amber-500 animate-pulse' : 'bg-zinc-300'}`}></span>
              <span className="font-mono text-[8px] text-zinc-400 font-bold uppercase tracking-wider">
                {timerActive ? 'ACTIVE' : 'STANDBY'}
              </span>
            </div>

            {/* Custom high-contrast minimalist timer ring */}
            <div className="relative w-56 h-56 flex items-center justify-center my-6 select-none max-w-full">
              
              <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 208 208">
                {/* Defs for NeoCraft Gradients */}
                <defs>
                  <linearGradient id="focusProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0052FF" />
                    <stop offset="50%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8FEF10" />
                  </linearGradient>
                </defs>
                {/* Background Ring */}
                <circle 
                  cx="104" 
                  cy="104" 
                  r="94" 
                  stroke={isLight ? "#F1F1F4" : "#1E2435"} 
                  strokeWidth="6" 
                  fill="transparent"
                />
                
                {/* Progress Ring */}
                <circle 
                  cx="104" 
                  cy="104" 
                  r="94" 
                  stroke={isLight ? "url(#focusProgressGradient)" : (timeLeft < 60 ? "#FF2E9A" : "#00F0FF")} 
                  strokeWidth="6" 
                  fill="transparent"
                  strokeDasharray="590.6"
                  strokeDashoffset={590.6 * (1 - progressRatio)}
                  strokeLinecap="round"
                  style={isLight ? { filter: "drop-shadow(0 2px 8px rgba(0, 82, 255, 0.18))" } : { filter: timeLeft < 60 ? "drop-shadow(0 0 5px #FF2E9A)" : "drop-shadow(0 0 5px #00F0FF)" }}
                  className="transition-all duration-1000 ease-linear origin-center"
                />
              </svg>

              {/* Perfectly Visible readout display centering */}
              <div className="text-center z-10 flex flex-col items-center justify-center pointer-events-none">
                <div className={`font-mono text-5xl md:text-6xl font-bold tracking-tight select-all tabular-nums filter ${
                  isLight ? 'bg-gradient-to-r from-[#0052FF] to-[#3B82F6] bg-clip-text text-transparent font-bold' : 'text-white'
                }`}>
                  {formatTime(timeLeft)}
                </div>
                
                <span className={`font-mono text-[9px] uppercase font-bold tracking-widest mt-2.5 px-2.5 py-0.5 rounded-full border ${
                  isLight 
                    ? "text-[#0052FF] bg-[#0052FF]/5 border-[#0052FF]/15 font-sans" 
                    : (timeLeft < 60 
                        ? "text-[#FF2E9A] bg-[#FF2E9A]/10 border-[#FF2E9A]/25" 
                        : "text-[#00F0FF] bg-[#00F0FF]/5 border-[#00F0FF]/15")
                }`}>
                  {timerPreset === 'deep' 
                    ? (language === 'es' ? 'BLOQUE DE ENFOQUEProfundo' : 'DEEP FOCUS WORK') 
                    : timerPreset === 'light' 
                    ? (language === 'es' ? 'TRABAJO LIGERO' : 'LIGHT INTERVAL') 
                    : timerPreset === 'rest' 
                    ? (language === 'es' ? 'DESCANSO REPARADOR' : 'REST INTERVAL') 
                    : (language === 'es' ? 'TIEMPO MANUAL' : 'CUSTOM INTERVAL')}
                </span>
              </div>

            </div>

            {/* Timer Play / Pause Controls */}
            <div className="flex gap-3 mb-6 w-full justify-center">
              <button 
                onClick={() => setTimerActive(!timerActive)}
                className={`py-2 px-6 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${
                  isLight
                    ? (timerActive 
                        ? "bg-zinc-100 border border-zinc-300 text-zinc-800 hover:bg-zinc-200" 
                        : "bg-gradient-to-r from-[#0052FF] to-[#8FEF10] border-transparent text-white hover:opacity-95 shadow-[0_4px_12px_rgba(0,82,255,0.15)]")
                    : (timerActive 
                        ? "bg-transparent border border-[#FF2E9A] text-[#FF2E9A] hover:bg-[#FF2E9A]/5 shadow-[0_0_8px_rgba(255,46,154,0.1)]" 
                        : "bg-[#C6FF3D] text-[#04060A] hover:opacity-90 hover:shadow-[0_0_12px_rgba(198,255,61,0.3)]")
                }`}
              >
                {timerActive ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" /> {language === 'es' ? 'PAUSAR' : 'PAUSE'}
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" /> {language === 'es' ? 'EMPEZAR' : 'START'}
                  </>
                )}
              </button>

              <button 
                onClick={() => { setTimeLeft(duration); setTimerActive(false); }}
                className={`border px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  isLight 
                    ? 'border-zinc-200 text-zinc-500 bg-white hover:bg-zinc-50 hover:text-zinc-800 hover:border-zinc-300' 
                    : 'border-[#1E2435] text-[#7A839E] hover:border-[#7A839E] hover:text-white'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" /> {language === 'es' ? 'REINICIAR' : 'RESET'}
              </button>
            </div>

            {/* Presets Grid Switcher */}
            <div className={`w-full border-t pt-4 font-mono ${isLight ? 'border-zinc-200' : 'border-[#1E2435]'}`}>
              <span className={`block text-[9px] uppercase tracking-widest mb-3 text-center font-semibold ${isLight ? 'text-zinc-400' : 'text-[#4A5273]'}`}>
                {language === 'es' ? "INTERVALOS DISPONIBLES" : "SELECT TIMER PRESET"}
              </span>
              
              <div className="grid grid-cols-3 gap-2">
                {(['deep', 'light', 'rest'] as const).map((presetKey) => {
                  const label = presetKey === 'deep' ? 'DEEP (25m)' : presetKey === 'light' ? 'LIGHT (15m)' : 'REST (5m)';
                  const isPresetActive = timerPreset === presetKey;
                  return (
                    <button
                      key={presetKey}
                      onClick={() => applyPreset(presetKey)}
                      className={`py-2 px-1 rounded-lg text-[9px] tracking-wider uppercase transition-all duration-150 font-bold cursor-pointer text-center ${
                        isLight 
                          ? (isPresetActive 
                              ? 'bg-gradient-to-r from-[#0052FF] to-[#3B82F6] text-white border-transparent shadow-[0_2px_8px_rgba(30,50,230,0.15)]' 
                              : 'bg-white border border-zinc-200 text-zinc-500 hover:border-zinc-350 hover:text-zinc-800')
                          : (isPresetActive
                              ? (presetKey === 'deep' ? 'bg-[#FF2E9A]/10 border border-[#FF2E9A]/30 text-[#FF2E9A]' : presetKey === 'light' ? 'bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF]' : 'bg-[#C6FF3D]/10 border border-[#C6FF3D]/30 text-[#C6FF3D]')
                              : 'bg-transparent border border-[#1E2435] text-[#7A839E] hover:border-[#7A839E]')
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Custom Time Option row */}
              <div className={`mt-4 flex items-center gap-2 p-1 rounded-xl border ${
                isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#131826]/40 border-[#1E2435]'
              }`}>
                <input 
                  type="number"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  className={`bg-transparent text-xs w-14 pl-2.5 pr-1 focus:outline-none font-bold ${isLight ? 'text-zinc-800' : 'text-white'}`}
                  placeholder="25"
                  min="1"
                />
                <span className={`text-[8.5px] uppercase tracking-wider font-semibold ${isLight ? 'text-zinc-400' : 'text-slate'}`}>{language === 'es' ? 'MINUTOS' : 'MINS'}</span>
                
                <button 
                  onClick={handleCustomTime}
                  className={`ml-auto font-mono tracking-wider uppercase py-1.5 px-3.5 rounded-lg cursor-pointer transition-colors text-[9px] font-bold ${
                    isLight 
                      ? 'bg-white border border-zinc-200 hover:border-zinc-400 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50' 
                      : 'bg-transparent border border-[#1E2435] hover:border-[#00F0FF] text-[#7A839E] hover:text-[#00F0FF]'
                  }`}
                >
                  {language === 'es' ? 'APLICAR' : 'APPLY'}
                </button>
              </div>

            </div>

          </div>

          {/* Quick Guidance Box */}
          <div className={`border p-5 rounded-2xl transition-all duration-300 ${
            isLight ? 'border-zinc-200 bg-zinc-50' : 'border-[#1E2435] bg-[#131826]/15'
          }`}>
            <span className="text-[10px] text-zinc-500 font-bold mb-2.5 flex items-center gap-2">
              <Lightbulb className={`w-4 h-4 ${isLight ? 'text-zinc-600' : 'text-[#C6FF3D]'}`} /> 
              {language === 'es' ? 'TIPS DE CONCENTRACIÓN' : 'FOCUS TRICKS'}
            </span>
            <p className={`text-[11px] leading-relaxed font-light ${isLight ? 'text-zinc-500' : 'text-[#7A839E]'}`}>
              {language === 'es' 
                ? 'Consigue fluidez bloqueando distracciones. El tono te notificará cuando acabe tu ciclo. Escribe ordenadamente tus conclusiones al terminar.' 
                : 'Protect your focus time windows. A soft harmonic cue is triggered automatically when a cycle completes successfully. Log ideas directly.'}
            </p>
          </div>
        </div>

        {/* COLUMN 2: Audio Dictation & Beautiful Clean Notepad (Col 5) */}
        <div className="lg:col-span-5 flex flex-col gap-6" id="audio_notepad_pillar">
          
          <div className={`border p-6 sm:p-7 rounded-2xl flex flex-col gap-5 transition-all duration-300 ${
            isLight ? 'border-zinc-200 bg-white shadow-sm' : 'border-graphite bg-[#060910]/95 shadow-none'
          }`}>
            
            <div className="flex justify-between items-center pb-3 border-b border-zinc-100 dark:border-[#1E2435]">
              <span className={`text-[10px] font-semibold tracking-wider uppercase block ${isLight ? 'text-zinc-800' : 'text-[#00F0FF]'}`}>
                {selectedNote 
                  ? (language === 'es' ? "MODIFICANDO NOTA SELECCIONADA" : "EDIT NOTE SUMMARY") 
                  : (language === 'es' ? "BLOC DE NOTAS" : "WORKSPACE NOTEPAD")
                }
              </span>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowConfig(!showConfig)}
                  className={`bg-transparent border px-2.5 py-1 rounded-lg font-mono text-[9px] uppercase tracking-wider cursor-pointer flex items-center gap-1 transition-all ${
                    isLight 
                      ? "border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-350" 
                      : (showConfig ? "border-[#00F0FF] text-[#00F0FF]" : "border-[#1E2435] text-[#7A839E] hover:text-white")
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" /> API KEYS
                </button>

                {selectedNote && (
                  <button
                    onClick={() => { setSelectedNote(null); setTitleInput(""); setContentInput(""); }}
                    className="bg-transparent border border-zinc-300 hover:bg-zinc-50 text-zinc-700 px-2.5 py-1 rounded-lg font-mono text-[9px] uppercase cursor-pointer transition-all"
                  >
                    {language === 'es' ? 'NUEVA NOTA' : 'NEW NOTE'}
                  </button>
                )}
              </div>
            </div>

            {/* Config Box Credentials */}
            {showConfig && (
              <div className={`border p-4 rounded-xl space-y-4 animate-fadeIn ${
                isLight ? 'border-zinc-200 bg-zinc-50/60' : 'border-[#1E2435] bg-[#131826]/70'
              }`}>
                <div className="flex justify-between items-center pb-1.5 border-b border-zinc-200/80 dark:border-[#1E2435]">
                  <span className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-wider">NOTION / TODOIST TOKENS</span>
                  <button onClick={() => setShowConfig(false)} className="text-zinc-400 hover:text-zinc-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-3.5">
                  <div className="space-y-1.5">
                    <span className="block font-mono text-[8px] text-zinc-400 uppercase font-bold">Notion Integration Token</span>
                    <input 
                      type="password"
                      value={notionToken}
                      onChange={(e) => setNotionToken(e.target.value)}
                      placeholder="secret_NotionIntegrationToken..."
                      className={`w-full border rounded-lg px-3.5 py-2 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-zinc-400/20 ${
                        isLight ? 'bg-white border-zinc-200 text-zinc-800' : 'bg-[#04060A] border-[#1E2435] text-white'
                      }`}
                    />
                    <input 
                      type="text"
                      value={notionDatabaseId}
                      onChange={(e) => setNotionDatabaseId(e.target.value)}
                      placeholder="Notion Database ID..."
                      className={`w-full border rounded-lg px-3.5 py-2 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-zinc-400/20 ${
                        isLight ? 'bg-white border-zinc-200 text-zinc-800' : 'bg-[#04060A] border-[#1E2435] text-white'
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5 border-t border-zinc-200/60 dark:border-[#1E2435] pt-2.5">
                    <span className="block font-mono text-[8px] text-zinc-400 uppercase font-bold">Todoist API Token</span>
                    <input 
                      type="password"
                      value={todoistToken}
                      onChange={(e) => setTodoistToken(e.target.value)}
                      placeholder="Todoist Personal API Token..."
                      className={`w-full border rounded-lg px-3.5 py-2 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-zinc-400/20 ${
                        isLight ? 'bg-white border-zinc-200 text-zinc-800' : 'bg-[#04060A] border-[#1E2435] text-white'
                      }`}
                    />
                  </div>
                </div>

                <button 
                  onClick={saveTokens}
                  className={`w-full ${isLight ? 'bg-gradient-to-r from-[#0052FF] to-[#3B82F6] hover:opacity-95 shadow-[0_4px_10px_rgba(0,82,255,0.15)]' : 'bg-zinc-900 hover:bg-zinc-800 shadow-sm shadow-zinc-950/10'} text-white font-mono font-bold text-[10px] py-2.5 rounded-lg cursor-pointer transition-all text-center`}
                >
                  {language === 'es' ? 'GUARDAR ACCESOS' : 'SAVE ACCESS TOKENS'}
                </button>
              </div>
            )}

            {/* Notepad form fields */}
            <div className="space-y-3.5">
              <input 
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder={t.focus.note_title_placeholder}
                className={`w-full border focus:outline-none focus:ring-1 rounded-xl px-4 py-3 text-xs font-semibold tracking-wide transition-colors ${
                  isLight 
                    ? 'bg-zinc-50 hover:bg-zinc-100/30 focus:bg-white border-zinc-200 focus:border-zinc-400 focus:ring-zinc-200/50 text-zinc-800 placeholder-zinc-400' 
                    : 'bg-[#131826]/40 border-[#1E2435] focus:border-[#00F0FF] text-white placeholder-zinc-500'
                }`}
              />

              <div className="relative">
                <textarea 
                  value={contentInput}
                  onChange={(e) => setContentInput(e.target.value)}
                  placeholder={t.focus.note_content_placeholder}
                  className={`w-full border focus:outline-none focus:ring-1 rounded-xl px-4 py-3 text-xs font-light min-h-[160px] leading-relaxed resize-y scrollbar-thin transition-colors ${
                    isLight 
                      ? 'bg-zinc-50 hover:bg-zinc-100/30 focus:bg-white border-zinc-200 focus:border-zinc-400 focus:ring-zinc-200/50 text-zinc-700 placeholder-zinc-400' 
                      : 'bg-[#131826]/40 border-[#1E2435] focus:border-[#00F0FF] text-stone-200'
                  }`}
                />

                {/* Speech recording status notification bar */}
                {isRecording && (
                  <div className={`absolute inset-x-0 bottom-1 py-3 px-4 flex items-center justify-between border-t rounded-b-xl select-none z-10 transition-colors ${
                    isLight ? 'bg-white border-zinc-200 text-zinc-800 shadow-md' : 'bg-[#04060A]/95 border-[#1E2435]'
                  }`}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping flex-shrink-0"></span>
                      <span className="font-mono text-[9px] text-rose-500 uppercase tracking-widest font-extrabold flex-shrink-0">
                        REC • {recordingSeconds}S
                      </span>
                      <span className="text-[10px] text-zinc-500 italic truncate italic max-w-xs block">
                        {interimTranscript || t.focus.listening}
                      </span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => recognitionRef.current?.stop()}
                      className="font-mono text-[8px] bg-rose-500 hover:bg-rose-600 text-white font-bold px-3 py-1 rounded-full cursor-pointer flex-shrink-0"
                    >
                      STOP
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4 border-zinc-100 dark:border-[#1E2435]">
              <div className="flex gap-2">
                
                {/* Voice integration button */}
                <button
                  type="button"
                  onClick={handleToggleRecord}
                  className={`px-4 py-2 border rounded-full font-mono text-[10px] tracking-wider uppercase flex items-center gap-2 cursor-pointer transition-all ${
                    isLight 
                      ? (isRecording 
                          ? 'border-rose-300 text-rose-600 bg-rose-50 font-semibold' 
                          : 'border-zinc-200 text-zinc-600 bg-white hover:bg-zinc-50 hover:border-zinc-300')
                      : (isRecording 
                          ? "border-[#FF2E9A] text-white bg-[#FF2E9A]/15 font-bold" 
                          : "border-[#1E2435] text-[#7A839E] hover:border-[#FF2E9A] hover:text-white")
                  }`}
                >
                  {isRecording ? <MicOff className="w-3.5 h-3.5 text-rose-500" /> : <Mic className={`w-3.5 h-3.5 ${isLight ? 'text-zinc-500' : 'text-[#FF2E9A]'}`} />}
                  {isRecording ? (language === 'es' ? "DETENER" : "STOP RECORD") : (language === 'es' ? "DICTAR NOTA" : "VOICE RECORD")}
                </button>

                {/* Optimization AI Button */}
                <button
                  type="button"
                  onClick={handleSmartRefine}
                  disabled={isRefining || !contentInput.trim()}
                  className={`px-4 py-2 border rounded-full font-mono text-[10px] tracking-wider uppercase flex items-center gap-2 cursor-pointer transition-all disabled:opacity-40 ${
                    isLight 
                      ? 'border-zinc-300 text-zinc-600 bg-white hover:bg-zinc-50 hover:text-zinc-900 hover:border-zinc-400' 
                      : 'border-[#1E2435] text-[#7A839E] hover:border-[#00F0FF] hover:text-white'
                  }`}
                  title={t.focus.refine_ai}
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isLight ? 'text-zinc-600' : 'text-[#00F0FF]'}`} />
                  {language === 'es' ? "OPTIMIZAR IA" : "CORRECT AI"}
                </button>
              </div>

              <button
                type="button"
                onClick={handleSaveNote}
                disabled={!contentInput.trim()}
                className={`font-display text-[11px] font-bold tracking-widest uppercase px-5 py-2.5 rounded-full cursor-pointer flex items-center gap-2 transition-all w-full sm:w-auto justify-center disabled:opacity-40 hover:scale-[1.02] active:scale-95 ${
                  isLight 
                    ? 'bg-gradient-to-r from-[#0052FF] via-[#3B82F6] to-[#8FEF10] text-white shadow-[0_4px_12px_rgba(0,130,255,0.2)]' 
                    : 'bg-[#C6FF3D] hover:opacity-95 text-[#04060A]'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                {selectedNote ? (language === 'es' ? 'ACTUALIZAR' : 'UPDATE') : (language === 'es' ? 'GUARDAR' : 'SAVE')}
              </button>
            </div>

          </div>

          {/* Database List segment */}
          <div className="flex flex-col gap-3 font-sans">
            <span className={`font-mono text-[10px] uppercase tracking-widest font-bold ${isLight ? 'text-zinc-400' : 'text-[#4A5273]'}`}>
              {language === 'es' ? `HISTORIAL DE NOTAS (${notes.length})` : `SAVED NOTES LOG (${notes.length})`}
            </span>

            {notes.length === 0 ? (
              <div className={`border border-dashed p-8 rounded-2xl text-center ${isLight ? 'border-zinc-200' : 'border-[#1E2435]'}`}>
                <BookOpen className="w-6 h-6 mx-auto text-zinc-400 mb-2" />
                <p className="text-[11px] text-zinc-400">{t.focus.no_notes}</p>
              </div>
            ) : (
              <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
                {notes.map((note) => (
                  <div 
                    key={note.id}
                    className={`border rounded-2xl transition-all overflow-hidden ${
                      isLight 
                        ? (selectedNote?.id === note.id ? 'border-zinc-400 bg-zinc-50' : 'border-zinc-200 hover:border-zinc-350 bg-white')
                        : (selectedNote?.id === note.id ? 'border-[#00F0FF] bg-[#131826]/60' : 'border-[#1E2435] bg-[#131826]/20 hover:border-[#7A839E]')
                    }`}
                  >
                    
                    {/* Header item bar */}
                    <div className={`px-4 py-3 flex items-center justify-between gap-4 border-b ${
                      isLight ? 'bg-zinc-50/50 border-zinc-100 text-zinc-800' : 'bg-[#181D2D]/60 border-[#1E2435] text-white'
                    }`}>
                      
                      <div 
                        onClick={() => handleSelectNote(note)}
                        className="flex-grow cursor-pointer min-w-0"
                      >
                        <h4 className="font-display text-[12px] font-bold truncate max-w-[170px] uppercase tracking-wide">
                          {note.title}
                        </h4>
                        <span className="font-mono text-[8px] text-zinc-400 block mt-0.5 uppercase tracking-wider">
                          {note.type === 'voice' ? '🎙️ dictado' : '⌨️ manual'} &bull; {formatDate(note.createdAt)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {/* Notion export option */}
                        <button
                          onClick={() => handleExportToNotion(note)}
                          disabled={isExportingNotion}
                          className={`px-2.5 py-1 border rounded-lg font-mono text-[8.5px] uppercase tracking-wider cursor-pointer disabled:opacity-30 flex items-center gap-1 transition-all ${
                            isLight 
                              ? 'border-zinc-200 text-zinc-600 bg-white hover:border-zinc-400 hover:text-zinc-900' 
                              : 'border-[#1E2435] text-[#7A839E] bg-[#04060A]/40'
                          }`}
                        >
                          <Share2 className={`w-3 h-3 ${isLight ? 'text-zinc-600' : 'text-[#00F0FF]'}`} /> NOTION
                        </button>

                        {/* Todoist export option */}
                        <button
                          onClick={() => handleExportToTodoist(note)}
                          disabled={isExportingTodoist}
                          className={`px-2.5 py-1 border rounded-lg font-mono text-[8.5px] uppercase tracking-wider cursor-pointer disabled:opacity-30 flex items-center gap-1 transition-all ${
                            isLight 
                              ? 'border-zinc-200 text-zinc-600 bg-white hover:border-zinc-400 hover:text-zinc-900' 
                              : 'border-[#1E2435] text-[#7A839E] bg-[#04060A]/40'
                          }`}
                        >
                          <FileText className={`w-3 h-3 ${isLight ? 'text-zinc-500' : 'text-[#FF2E9A]'}`} /> TODOIST
                        </button>

                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className={`p-1 text-zinc-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer`}
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>

                    {/* Content block body */}
                    <div className="p-4">
                      <p className={`text-[11.5px] font-sans font-light leading-relaxed whitespace-pre-wrap select-all ${
                        isLight ? 'text-zinc-600' : 'text-stone-300'
                      }`}>
                        {note.content}
                      </p>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* COLUMN 3: Upcoming Meeting & Real-Time Connection Dock (Col 3) */}
        <div className="lg:col-span-3 flex flex-col gap-6" id="tactical_meeting_dock_pillar">
          <div className={`border p-5 rounded-2xl flex flex-col relative min-h-[440px] transition-all duration-300 ${
            isLight 
              ? 'border-zinc-200 bg-white shadow-sm' 
              : 'border-[#FF2E9A]/30 bg-[#0A0F18]/95 shadow-[inset_0_0_12px_rgba(255,46,154,0.03)]'
          }`}>
            
            <div className="absolute top-4 right-5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </div>
            
            <span className={`font-mono text-[9px] tracking-widest uppercase font-bold mb-4.5 ${isLight ? 'text-zinc-400' : 'text-[#7A839E]'}`}>
              {t.focus.meeting_dock}
            </span>

            {nextEvent ? (
              <div className="space-y-4 font-mono text-[10px] flex-grow flex flex-col justify-between">
                
                {/* Event summary header */}
                <div className="space-y-1">
                  <div className={`text-[8px] uppercase tracking-widest font-extrabold ${isLight ? 'text-zinc-400' : 'text-[#FF2E9A]'}`}>// SYNCED EVENT</div>
                  <div className={`font-display text-[13px] font-semibold leading-tight tracking-tight truncate max-w-[210px] sm:max-w-none select-all ${
                    isLight ? 'text-zinc-900' : 'text-white'
                  }`} title={nextEvent.summary}>
                    {nextEvent.summary}
                  </div>
                </div>

                {/* Highly viewable clean countdown badge display block */}
                <div className={`border px-4 py-4 rounded-xl flex flex-col items-center justify-center my-1.5 text-center transition-colors ${
                  isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#131826]/30 border-[#1E2435]'
                }`}>
                  <span className="text-[8px] text-zinc-400 uppercase tracking-widest font-bold block mb-1">{t.focus.start_in.toUpperCase()}</span>
                  <span className={`text-base font-bold tracking-wider font-mono whitespace-nowrap overflow-ellipsis ${
                    isLight ? 'text-zinc-800' : 'text-[#00F0FF]'
                  }`}>
                    {timeRemaining}
                  </span>
                </div>

                {/* Meeting descriptive metadata blocks */}
                <div className="space-y-2 border-t border-zinc-100 dark:border-[#1E2435] pt-3.5 flex-grow text-zinc-500">
                  
                  {/* Day row */}
                  <div className={`flex justify-between items-center px-3 py-2 rounded-xl border min-w-0 ${
                    isLight ? 'bg-zinc-50/40 border-zinc-200' : 'bg-[#131826]/20 border-[#1E2435]/40 text-white'
                  }`}>
                    <span className="uppercase text-[8px] font-bold text-zinc-400">{t.focus.day.toUpperCase()}</span>
                    <span className={`font-medium text-[9px] text-right truncate pl-2 max-w-[145px] ${isLight ? 'text-zinc-700' : 'text-white'}`}>
                      {formatEventDay(nextEvent.start?.dateTime || nextEvent.start?.date, language)}
                    </span>
                  </div>

                  {/* Time interval range */}
                  <div className={`flex justify-between items-center px-3 py-2 rounded-xl border min-w-0 ${
                    isLight ? 'bg-zinc-50/40 border-zinc-200' : 'bg-[#131826]/20 border-[#1E2435]/40 text-white'
                  }`}>
                    <span className="uppercase text-[8px] font-bold text-zinc-400">{t.focus.time.toUpperCase()}</span>
                    <span className={`font-medium text-[9px] text-right whitespace-nowrap pl-2 ${isLight ? 'text-zinc-700' : 'text-white'}`}>
                      {formatTimeRange(nextEvent.start?.dateTime, nextEvent.end?.dateTime, language)}
                    </span>
                  </div>

                  {/* Location Coordinate */}
                  <div className={`flex flex-col gap-1.5 p-3 rounded-xl border min-w-0 text-left ${
                    isLight ? 'bg-zinc-50/40 border-zinc-200' : 'bg-[#131826]/20 border-[#1E2435]/40 text-white'
                  }`}>
                    <span className="uppercase text-[8px] font-bold text-zinc-400 block">{t.focus.location.toUpperCase()}</span>
                    <span className={`text-[9px] truncate max-w-full leading-normal break-all block ${isLight ? 'text-zinc-700' : 'text-stone-300'}`} title={nextEvent.location || t.focus.no_location}>
                      {nextEvent.location || t.focus.no_location}
                    </span>
                  </div>

                  {/* Operational meeting details summary */}
                  <div className="flex flex-col gap-1.5 pt-2">
                    <span className={`text-[8.5px] uppercase tracking-widest font-extrabold block ${isLight ? 'text-zinc-400' : 'text-[#FF2E9A]'}`}>{t.focus.note.toUpperCase()}</span>
                    <div className={`italic p-3 rounded-xl border text-[9.5px] leading-relaxed font-sans font-light max-h-[140px] overflow-y-auto scrollbar-thin select-all ${
                      isLight 
                        ? 'bg-zinc-50 border-zinc-200 text-zinc-600' 
                        : 'bg-[#04060A]/80 border-[#1E2435] text-stone-300'
                    }`}>
                      {nextEvent.note || nextEvent.description?.slice(0, 160) || t.focus.no_note}
                    </div>
                  </div>

                </div>

                {/* Event Web Link anchor button if defined */}
                {nextEvent.htmlLink && (
                  <a 
                    href={nextEvent.htmlLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full text-center py-2 text-[9px] tracking-widest uppercase font-bold rounded-xl transition-all block cursor-pointer border ${
                      isLight 
                        ? 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-400 text-zinc-700 hover:text-zinc-900' 
                        : 'border-[#FF2E9A]/20 hover:border-[#FF2E9A] text-[#7A839E] hover:text-white bg-[#FF2E9A]/5'
                    }`}
                  >
                    {language === 'es' ? 'CONECTAR A LA REUNIÓN ↗' : 'JOIN MEET STREAM ↗'}
                  </a>
                )}

              </div>
            ) : (
              <div className="h-full flex-grow flex flex-col items-center justify-center text-center py-10">
                <span className="font-mono text-[8px] text-[#4A5273] uppercase tracking-widest block mb-2.5 font-bold">
                  // STANDBY
                </span>
                <span className="font-sans text-[11px] text-zinc-400 leading-relaxed max-w-[170px] mx-auto font-light">
                  {t.focus.no_meetings}
                </span>
              </div>
            )}
          </div>

          {/* Sizing alignment stats info box */}
          <div className={`border px-4 py-3.5 rounded-2xl font-mono text-[9.5px] flex items-center justify-between gap-4 transition-all duration-300 ${
            isLight ? 'border-zinc-200 bg-white text-zinc-500' : 'border-[#1E2435] bg-[#131826]/10 text-[#7A839E]'
          }`}>
            <span className="flex items-center gap-1.5 uppercase font-medium">
              <span className={`w-1.5 h-1.5 rounded-full ${isLight ? 'bg-zinc-400' : 'bg-[#00F0FF]'}`}></span>
              {language === 'es' ? "INTEGRACIÓN" : "SYSTEM SYNCS"}:
            </span>
            <span className={`font-bold tracking-wider ${isLight ? 'text-zinc-800' : 'text-white'}`}>Active Handshake</span>
          </div>

        </div>

      </div>

    </div>
  );
}
