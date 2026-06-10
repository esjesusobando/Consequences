import { useState, useEffect } from "react";
import { CalendarEvent, DriveFile, GmailMessage, GoogleTask } from "../types";
import { 
  Clock, 
  Calendar, 
  Mail, 
  FileCheck, 
  HardDrive, 
  ExternalLink,
  Pencil,
  X,
  Sparkles,
  Save
} from "lucide-react";
import { translations } from "../lib/translations";

interface DashboardViewProps {
  calendarEvents: CalendarEvent[];
  driveFiles: DriveFile[];
  gmailMessages: GmailMessage[];
  tasks: GoogleTask[];
  onViewChange: (view: 'dashboard' | 'mail' | 'tasks' | 'drive' | 'settings') => void;
  language?: 'es' | 'en';
  themeMode?: 'craft' | 'cyber';
  onUpdateCalendarEvent?: (id: string, data: any) => Promise<boolean>;
  isZenMode?: boolean;
  onToggleZenMode?: () => void;
}

export default function DashboardView({
  calendarEvents,
  driveFiles,
  gmailMessages,
  tasks,
  onViewChange,
  language = 'es',
  themeMode = 'craft',
  onUpdateCalendarEvent,
  isZenMode = false,
  onToggleZenMode
}: DashboardViewProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>("00h : 00m : 00s");
  const [nextEvent, setNextEvent] = useState<CalendarEvent | null>(null);

  // Editing state
  const [isEditingMeeting, setIsEditingMeeting] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [formData, setFormData] = useState({
    summary: "",
    description: "",
    location: "",
    note: "",
    startDateTime: "",
    endDateTime: ""
  });

  const t = translations[language];
  const d = t.dashboard;
  const isLight = themeMode === 'craft';

  // Open the edit panel populated with next event values
  const handleOpenEdit = () => {
    if (!nextEvent) return;
    
    const toLocalISOString = (isoStr?: string) => {
      if (!isoStr) return "";
      const date = new Date(isoStr);
      if (isNaN(date.getTime())) return "";
      const pad = (num: number) => String(num).padStart(2, "0");
      const year = date.getFullYear();
      const month = pad(date.getMonth() + 1);
      const day = pad(date.getDate());
      const hours = pad(date.getHours());
      const minutes = pad(date.getMinutes());
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    setFormData({
      summary: nextEvent.summary || "",
      description: nextEvent.description || "",
      location: nextEvent.location || "",
      note: nextEvent.note || "",
      startDateTime: toLocalISOString(nextEvent.start?.dateTime || nextEvent.start?.date),
      endDateTime: toLocalISOString(nextEvent.end?.dateTime || nextEvent.end?.date)
    });
    setIsEditingMeeting(true);
  };

  const handleSaveEdit = async () => {
    if (!nextEvent || !onUpdateCalendarEvent) return;
    setEditLoading(true);
    try {
      const startISO = formData.startDateTime ? new Date(formData.startDateTime).toISOString() : undefined;
      const endISO = formData.endDateTime ? new Date(formData.endDateTime).toISOString() : undefined;

      const success = await onUpdateCalendarEvent(nextEvent.id, {
        summary: formData.summary,
        description: formData.description,
        location: formData.location,
        note: formData.note,
        startDateTime: startISO,
        endDateTime: endISO
      });

      if (success) {
        setIsEditingMeeting(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEditLoading(false);
    }
  };

  // Find the next upcoming meeting
  useEffect(() => {
    const findNextEvent = () => {
      const now = new Date();
      const upcoming = calendarEvents
        .filter((event) => {
          const endStr = event.end?.dateTime || event.end?.date;
          if (!endStr) return false;
          return new Date(endStr) > now;
        })
        .sort((a, b) => {
          const aTime = new Date(a.start?.dateTime || a.start?.date || 0).getTime();
          const bTime = new Date(b.start?.dateTime || b.start?.date || 0).getTime();
          return aTime - bTime;
        });

      setNextEvent(upcoming[0] || null);
    };

    findNextEvent();
    const intervalIds = setInterval(findNextEvent, 5000);
    return () => clearInterval(intervalIds);
  }, [calendarEvents]);

  // Live countdown timer execution
  useEffect(() => {
    if (!nextEvent) {
      setTimeRemaining(language === 'es' ? "MODO REPOSO // SIN REUNIONES" : "STANDBY // NO MEETINGS");
      return;
    }

    const startStr = nextEvent.start?.dateTime || nextEvent.start?.date;
    if (!startStr) return;

    const eventTime = new Date(startStr).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = eventTime - now;

      if (diff <= 0) {
        setTimeRemaining(language === 'es' ? "REUNIÓN EN CURSO" : "MEETING IN PROGRESS");
        return;
      }

      const totalSecs = Math.floor(diff / 1000);
      const hours = Math.floor(totalSecs / 3600);
      const minutes = Math.floor((totalSecs % 3600) / 60);
      const seconds = totalSecs % 60;

      const pad = (n: number) => n.toString().padStart(2, "0");
      setTimeRemaining(
        `${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`
      );
    };

    updateTimer();
    const tick = setInterval(updateTimer, 1000);
    return () => clearInterval(tick);
  }, [nextEvent, language]);

  // Derived dashboard metrics
  const unreadMails = gmailMessages.filter((m) => m.unread).length;
  const pendingTasks = tasks.filter((t) => t.status === "needsAction").length;
  const driveCount = driveFiles.length;

  return (
    <div className="flex-grow flex flex-col gap-6 select-none">
      
      {/* Premium Elegant Card / Hub Banner Section */}
      <section className={`relative overflow-hidden transition-all duration-300 ${
        isLight 
          ? "bg-white border border-[#E5E7EB] shadow-sm rounded-[2rem] p-8 sm:p-10" 
          : "border border-[#1E2435] bg-[#0c101b]/60 rounded-lg p-8 sm:p-12 shadow-[0_0_20px_rgba(0,240,255,0.03)]"
      }`}>
        {/* Subtle grid backdrop for Cyberpunk theme, decorative details for light mode */}
        {!isLight ? (
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1E2435_1px,transparent_1px),linear-gradient(to_bottom,#1E2435_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>
        ) : (
          <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-bl from-blue-100/40 via-emerald-50/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        )}

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 w-full">
          <div className="flex flex-col text-center lg:text-left">
            <span className={`font-mono text-[9px] tracking-widest uppercase mb-2 flex items-center gap-2 justify-center lg:justify-start font-bold ${
              isLight ? "text-zinc-400" : "text-[#7A839E]"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full inline-block ${
                isLight ? "bg-emerald-500" : "bg-[#00f0ff] animate-pulse"
              }`}></span>
              {d.next_meeting_title}
            </span>
            
            <h1 className={`font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight py-2 transition-all ${
              isLight 
                ? "text-zinc-950 font-sans tracking-tight" 
                : "text-[#00f0ff] cyber-glow-text"
            }`} style={{ fontFeatureSettings: '"tnum"' }}>
              {timeRemaining}
            </h1>

            {/* Custom high-fidelity brand gradient progress bar purely for light craft mode */}
            {isLight && (
              <div className="mt-4 w-64 md:w-80">
                <div className="flex justify-between text-[10px] text-zinc-500 font-sans mb-1 font-semibold">
                  <span>{language === 'es' ? 'Sincronización de Canal de Datos' : 'Data Feed Synchrony'}</span>
                  <span className="text-[#0052FF] font-bold">100% VALIDATED</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#0052FF] via-[#3B82F6] to-[#A3E635] rounded-full w-[78%] animate-pulse"></div>
                </div>
                <div className="flex justify-between text-[9px] text-[#7A839E] font-mono mt-0.5">
                  <span>0.00ms latency</span>
                  <span>{language === 'es' ? 'ESTACIÓN SECRETA' : 'SECURE HUB'}</span>
                </div>
              </div>
            )}
            
            {nextEvent ? (
              <p className={`font-mono text-xs mt-1.5 ${isLight ? "text-zinc-500 font-sans" : "text-[#7A839E]"}`}>
                <span className={`font-bold mr-1.5 ${isLight ? "text-zinc-700" : "text-white/55"}`}>NODE:</span>
                <span className={`font-semibold ${isLight ? "text-zinc-800" : "text-[#dfe2ef]"}`}>{nextEvent.summary}</span>
              </p>
            ) : (
              <p className={`text-xs mt-1.5 ${isLight ? "text-zinc-500 font-sans" : "text-[#7A839E]/85 font-mono"}`}>
                {d.no_meetings}
              </p>
            )}
          </div>

          {/* Active event metadata description */}
          {nextEvent && (
            <div className={`p-5 rounded-[1.5rem] w-full lg:w-96 text-left transition-all relative group ${
              isLight 
                ? "bg-zinc-50/70 border border-zinc-200/80" 
                : "border border-[#1E2435] bg-[#0c101b]/90 shadow-lg"
            }`}>
              {/* Subtle Edit Icon */}
              <button
                onClick={handleOpenEdit}
                className={`absolute top-4 right-4 p-1.5 rounded-full transition-all border opacity-30 group-hover:opacity-100 hover:scale-105 cursor-pointer ${
                  isLight
                    ? "bg-white border-zinc-200 text-zinc-500 hover:text-zinc-900 shadow-xs"
                    : "bg-[#131826] border-[#1E2435] text-[#7A839E] hover:text-[#00f0ff]"
                }`}
                title={language === 'es' ? "Editar datos de reunión" : "Edit meeting details"}
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-start gap-3">
                <Calendar className={`w-4.5 h-4.5 mt-0.5 flex-shrink-0 ${isLight ? 'text-zinc-800' : 'text-[#00f0ff]'}`} />
                <div className="min-w-0 flex-1">
                  <div className={`font-mono text-[8.5px] uppercase tracking-wider mb-1 font-bold ${
                    isLight ? 'text-zinc-400' : 'text-[#7A839E]'
                  }`}>
                    {d.active_node}
                  </div>
                  <h4 className={`font-display text-sm font-semibold truncate mb-1 ${
                    isLight ? 'text-zinc-900 border-none' : 'text-white'
                  }`}>
                    {nextEvent.summary}
                  </h4>
                  <p className={`font-mono text-[10.5px] truncate ${isLight ? 'text-zinc-500' : 'text-[#7A839E]'}`}>
                    {nextEvent.start?.dateTime 
                      ? new Date(nextEvent.start.dateTime).toLocaleString(language === 'es' ? 'es-ES' : 'en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : d.all_day_event}
                  </p>
                  
                  {nextEvent.description && (
                    <p className={`text-[11px] mt-2.5 line-clamp-2 italic leading-relaxed font-sans font-light ${
                      isLight ? 'text-zinc-500' : 'text-[#7A839E]'
                    }`}>
                      &ldquo;{nextEvent.description}&rdquo;
                    </p>
                  )}

                  {nextEvent.location && (
                    <div className={`mt-3 font-mono text-[9px] px-2 py-0.5 rounded-md inline-block truncate max-w-full ${
                      isLight 
                        ? 'bg-zinc-200/60 border border-zinc-200 text-zinc-800 font-sans' 
                        : 'bg-[#131826]/70 border border-[#1E2435] text-[#dfe2ef]'
                    }`}>
                      LOC: {nextEvent.location}
                    </div>
                  )}

                  {nextEvent.htmlLink && (
                    <a
                      href={nextEvent.htmlLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-3.5 flex items-center gap-1 text-[10.5px] transition-colors font-mono cursor-pointer ${
                        isLight 
                          ? 'text-zinc-900 hover:text-blue-600 font-sans font-semibold underline' 
                          : 'text-[#00f0ff] hover:text-[#fffb4a]'
                      }`}
                    >
                      {d.view_details} <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3-Column Metrics Grid - Rounded to 3xl / brandkit style with pure white and shadows */}
      {!isZenMode && (
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Gmail Metrics Card */}
          <div 
            onClick={() => onViewChange("mail")}
            className={`group transition-all duration-300 cursor-pointer p-6 ${
              isLight 
                ? "bg-white border border-[#E5E7EB] hover:border-zinc-350 hover:shadow-md rounded-[2rem]" 
                : "bg-[#131826]/40 border border-[#1E2435] hover:border-neon-magenta/25 hover:bg-[#131826]/60 rounded-lg shadow-sm"
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <Mail className={`w-5 h-5 ${isLight ? 'text-zinc-800' : 'text-neon-magenta'}`} />
              <span className={`font-mono text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold ${
                isLight ? 'bg-zinc-100 text-zinc-600' : 'bg-[#1a2333]/80 text-[#7A839E]'
              }`}>GMAIL</span>
            </div>
            <div className={`font-display text-3xl font-bold tracking-tight mb-1 ${
              isLight ? "text-zinc-900 font-sans font-extrabold" : "text-white"
            }`}>
              {unreadMails}
            </div>
            <div className={`text-[10px] uppercase tracking-wider ${
              isLight ? "text-zinc-400 font-sans font-medium" : "font-mono text-[#7A839E]"
            }`}>
              {d.unread_mail}
            </div>
            {/* Accent decoration line with gradient based on Brandkit illustration */}
            {isLight && (
              <div className="w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full mt-4 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            )}
          </div>

          {/* Tasks Metrics Card */}
          <div 
            onClick={() => onViewChange("tasks")}
            className={`group transition-all duration-300 cursor-pointer p-6 ${
              isLight 
                ? "bg-white border border-[#E5E7EB] hover:border-zinc-350 hover:shadow-md rounded-[2rem]" 
                : "bg-[#131826]/40 border border-[#1E2435] hover:border-neon-cyan/25 hover:bg-[#131826]/60 rounded-lg shadow-sm"
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <FileCheck className={`w-5 h-5 ${isLight ? 'text-zinc-800' : 'text-neon-cyan'}`} />
              <span className={`font-mono text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold ${
                isLight ? 'bg-zinc-100 text-zinc-600' : 'bg-[#1a2333]/80 text-[#7A839E]'
              }`}>TASKS</span>
            </div>
            <div className={`font-display text-3xl font-bold tracking-tight mb-1 ${
              isLight ? "text-zinc-900 font-sans font-extrabold" : "text-white"
            }`}>
              {pendingTasks}
            </div>
            <div className={`text-[10px] uppercase tracking-wider ${
              isLight ? "text-zinc-400 font-sans font-medium" : "font-mono text-[#7A839E]"
            }`}>
              {d.pending_tasks}
            </div>
            {/* Accent decoration line with gradient based on Brandkit illustration */}
            {isLight && (
              <div className="w-full h-1 bg-gradient-to-r from-cyan-400 to-[#C6FF3D] rounded-full mt-4 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            )}
          </div>

          {/* Drive Metrics Card */}
          <div 
            onClick={() => onViewChange("drive")}
            className={`group transition-all duration-300 cursor-pointer p-6 ${
              isLight 
                ? "bg-white border border-[#E5E7EB] hover:border-zinc-350 hover:shadow-md rounded-[2rem]" 
                : "bg-[#131826]/40 border border-[#1E2435] hover:border-[#fffb4a]/25 hover:bg-[#131826]/60 rounded-lg shadow-sm"
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <HardDrive className={`w-5 h-5 ${isLight ? 'text-zinc-800' : 'text-[#fffb4a]'}`} />
              <span className={`font-mono text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold ${
                isLight ? 'bg-zinc-100 text-zinc-600' : 'bg-[#1a2333]/80 text-[#7A839E]'
              }`}>DRIVE</span>
            </div>
            <div className={`font-display text-3xl font-bold tracking-tight mb-1 ${
              isLight ? "text-zinc-900 font-sans font-extrabold" : "text-white"
            }`}>
              {driveCount}
            </div>
            <div className={`text-[10px] uppercase tracking-wider ${
              isLight ? "text-zinc-400 font-sans font-medium" : "font-mono text-[#7A839E]' font-sans"
            }`}>
              {d.stored_documents}
            </div>
            {/* Accent decoration line with gradient based on Brandkit illustration */}
            {isLight && (
              <div className="w-full h-1 bg-gradient-to-r from-[#C6FF3D] to-blue-600 rounded-full mt-4 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            )}
          </div>
        </section>
      )}

      {/* Elegant Upcoming Meetings List */}
      {!isZenMode && (
        <section className={`p-6 md:p-8 transition-all duration-300 ${
          isLight 
            ? "bg-white border border-[#E5E7EB] rounded-[2rem] shadow-sm" 
            : "border border-[#1E2435] bg-[#0c101b]/30 rounded-lg"
        }`}>
          <h3 className={`font-semibold mb-5 text-sm tracking-tight flex items-center gap-2 ${
            isLight ? "text-zinc-900 font-sans" : "font-mono text-[#00f0ff] uppercase font-bold text-[10px] tracking-wider"
          }`}>
            <Calendar className="w-4 h-4" />
            {d.upcoming_meetings}
          </h3>
          
          <div className="space-y-3">
            {calendarEvents.length === 0 ? (
              <p className="text-xs py-8 text-center font-light text-zinc-400">
                {d.no_meetings}
              </p>
            ) : (
              calendarEvents.slice(0, 4).map((event) => {
                const startStr = event.start?.dateTime || event.start?.date;
                const dateObj = startStr ? new Date(startStr) : null;
                const isFirst = nextEvent && nextEvent.id === event.id;

                return (
                  <div 
                    key={event.id}
                    className={`flex items-center justify-between p-4 border transition-all rounded-[1.25rem] ${
                      isFirst 
                        ? isLight 
                          ? 'border-zinc-300 bg-zinc-50 hover:bg-zinc-100/60' 
                          : 'border-[#00f0ff]/30 bg-[#00f0ff]/5 hover:border-[#00f0ff]/50'
                        : isLight 
                          ? 'border-zinc-100 bg-zinc-50/55 hover:bg-zinc-50' 
                          : 'border-[#1E2435] bg-[#131826]/10 hover:border-[#1E2435]/80 hover:bg-[#131826]/20'
                    }`}
                  >
                    <div className="min-w-0 pr-4">
                      <div className="flex items-center gap-2">
                        {isFirst && (
                          <span className={`font-mono text-[8.5px] px-2 py-0.5 rounded-full font-extrabold ${
                            isLight 
                              ? 'bg-[#A3E635] text-slate-950 font-sans border border-[#8FEF10]/40 shadow-xs' 
                              : 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20'
                          }`}>
                            {d.next}
                          </span>
                        )}
                        <span className={`text-sm font-semibold truncate ${
                          isLight ? 'text-zinc-800' : 'text-white'
                        }`}>
                          {event.summary}
                        </span>
                      </div>
                      {event.location && (
                        <span className={`text-[10px] mt-1 block ${
                          isLight ? 'text-zinc-500 font-sans' : 'font-mono text-[#7A839E]'
                        }`}>
                          LOC: {event.location}
                        </span>
                      )}
                    </div>
                    
                    <div className={`text-right flex-shrink-0 ${isLight ? 'font-sans text-xs' : 'font-mono text-xs'}`}>
                      {dateObj ? (
                        <>
                          <div className={`font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                            {dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                          <div className={`text-[9.5px] mt-0.5 ${isLight ? 'text-zinc-500' : 'text-[#7A839E]'}`}>
                            {dateObj.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {month: 'short', day: 'numeric'})}
                          </div>
                        </>
                      ) : (
                        <span className={`text-[10px] font-medium ${isLight ? 'text-zinc-700' : 'text-slate'}`}>{d.all_day_event}</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* High-Fidelity Calendar Event Edit Modal */}
      {isEditingMeeting && nextEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl transition-all ${
            isLight
              ? "bg-white border border-zinc-200 text-zinc-800"
              : "bg-[#0f131c] border border-[#1E2435] text-white"
          }`}>
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-zinc-500/10">
              <h3 className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-zinc-900 font-sans' : 'text-[#00f0ff] font-mono uppercase'}`}>
                <Pencil className="w-4 h-4" />
                {language === 'es' ? 'Editar Reunión Activa' : 'Edit Active Meeting'}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingMeeting(false)}
                className={`p-1 rounded-lg transition-colors cursor-pointer ${
                  isLight ? 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900' : 'hover:bg-[#131826] text-[#7A839E] hover:text-white'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Title Input */}
              <div className="text-left">
                <label className="block text-[10px] font-mono uppercase tracking-wider font-bold mb-1 opacity-70 text-[#7A839E]">
                  {language === 'es' ? 'Título / Resumen' : 'Title / Summary'}
                </label>
                <input
                  type="text"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className={`w-full text-xs px-3 py-2 rounded-lg border focus:outline-none transition-all ${
                    isLight
                      ? "bg-zinc-50 hover:bg-zinc-100/50 border-zinc-200 focus:bg-white text-zinc-900"
                      : "bg-[#131826] text-white border-[#1E2435] focus:border-[#00f0ff]"
                  }`}
                />
              </div>

              {/* Date & Time Settings Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-left">
                  <label className="block text-[10px] font-mono uppercase tracking-wider font-bold mb-1 opacity-70 text-[#7A839E]">
                    {language === 'es' ? 'Inicio' : 'Start Time'}
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startDateTime}
                    onChange={(e) => setFormData({ ...formData, startDateTime: e.target.value })}
                    className={`w-full text-xs px-3 py-2 rounded-lg border focus:outline-none transition-all ${
                      isLight
                        ? "bg-zinc-50 border-zinc-200 text-zinc-900"
                        : "bg-[#131826] text-white border-[#1E2435] focus:border-[#00f0ff]"
                    }`}
                  />
                </div>
                <div className="text-left">
                  <label className="block text-[10px] font-mono uppercase tracking-wider font-bold mb-1 opacity-70 text-[#7A839E]">
                    {language === 'es' ? 'Fin' : 'End Time'}
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endDateTime}
                    onChange={(e) => setFormData({ ...formData, endDateTime: e.target.value })}
                    className={`w-full text-xs px-3 py-2 rounded-lg border focus:outline-none transition-all ${
                      isLight
                        ? "bg-zinc-50 border-zinc-200 text-zinc-900"
                        : "bg-[#131826] text-white border-[#1E2435] focus:border-[#00f0ff]"
                    }`}
                  />
                </div>
              </div>

              {/* Location Input */}
              <div className="text-left">
                <label className="block text-[10px] font-mono uppercase tracking-wider font-bold mb-1 opacity-70 text-[#7A839E]">
                  {language === 'es' ? 'Ubicación' : 'Location'}
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className={`w-full text-xs px-3 py-2 rounded-lg border focus:outline-none transition-all ${
                    isLight
                      ? "bg-zinc-50 hover:bg-zinc-100/50 border-zinc-200 focus:bg-white text-zinc-900"
                      : "bg-[#131826] text-white border-[#1E2435] focus:border-[#00f0ff]"
                  }`}
                />
              </div>

              {/* Description TextArea */}
              <div className="text-left">
                <label className="block text-[10px] font-mono uppercase tracking-wider font-bold mb-1 opacity-70 text-[#7A839E]">
                  {language === 'es' ? 'Descripción' : 'Description'}
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full text-xs px-3 py-2 rounded-lg border focus:outline-none transition-all resize-none ${
                    isLight
                      ? "bg-zinc-50 hover:bg-zinc-100/50 border-zinc-200 focus:bg-white text-zinc-900"
                      : "bg-[#131826] text-white border-[#1E2435] focus:border-[#00f0ff]"
                  }`}
                />
              </div>

              {/* Spec Note TextArea (for special notes/prompts) */}
              <div className="text-left">
                <label className="block text-[10px] font-mono uppercase tracking-wider font-bold mb-1 opacity-70 text-[#7A839E]">
                  {language === 'es' ? 'Nota Especial' : 'Special Note'}
                </label>
                <textarea
                  rows={2}
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className={`w-full text-xs px-3 py-2 rounded-lg border focus:outline-none transition-all resize-none ${
                    isLight
                      ? "bg-zinc-50 hover:bg-zinc-100/50 border-zinc-200 focus:bg-white text-zinc-950"
                      : "bg-[#131826] text-white border-[#1E2435] focus:border-[#00f0ff]"
                  }`}
                />
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex justify-end gap-2.5 mt-6 pt-4 border-t border-zinc-500/10">
              <button
                type="button"
                onClick={() => setIsEditingMeeting(false)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                  isLight
                    ? "bg-zinc-150 hover:bg-zinc-200 text-zinc-700 font-sans"
                    : "bg-[#131826] hover:bg-[#1a2333] text-[#7A839E] hover:text-white"
                }`}
              >
                {language === 'es' ? 'Cancelar' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={editLoading}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-white ${
                  isLight
                    ? "bg-[#0052FF] hover:bg-blue-600 font-sans font-bold shadow-sm"
                    : "bg-[#00f0ff]/10 border border-[#00f0ff]/40 text-[#00f0ff] hover:bg-[#00f0ff]/200"
                }`}
              >
                {editLoading ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>{language === 'es' ? 'Guardar Cambios' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
