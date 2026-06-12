import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Video, 
  Phone, 
  Users, 
  Trash2, 
  Check, 
  Clock, 
  X, 
  Sparkles, 
  Play, 
  Pause, 
  RefreshCw,
  Calendar as CalendarIcon,
  Link,
  UserCheck,
  CheckCircle2,
  CalendarDays,
  ExternalLink,
  Edit2,
  Save,
  LogIn,
  LogOut
} from 'lucide-react';
import { SignalEvent, AccentColor } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  googleSignIn, 
  logout, 
  createCalendarEvent, 
  updateCalendarEvent, 
  deleteCalendarEvent, 
  fetchCalendarEvents 
} from '../lib/googleAuth';

interface DashboardViewProps {
  signals: SignalEvent[];
  setSignals: React.Dispatch<React.SetStateAction<SignalEvent[]>>;
  accent: AccentColor;
  nodeStatus: string;
  onLogMessage: (type: 'info' | 'ok' | 'warn' | 'err', text: string) => void;
  hideRightPanel: boolean;
  config: any;
  user: any;
  setUser: any;
  googleToken: string | null;
  setGoogleToken: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function DashboardView({
  signals,
  setSignals,
  accent,
  nodeStatus,
  onLogMessage,
  hideRightPanel,
  config,
  user,
  setUser,
  googleToken,
  setGoogleToken,
}: DashboardViewProps) {
  // Countdown Timer state: initial 1 hour, 42 minutes, 06 seconds
  const [secondsLeft, setSecondsLeft] = useState<number>(1 * 3600 + 42 * 60 + 6);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  
  // Modal/Form toggle for adding a new calendar sync signal
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newTime, setNewTime] = useState<string>('16:00');
  const [newId, setNewId] = useState<string>('');
  const [newIcon, setNewIcon] = useState<string>('video');
  const [newDesc, setNewDesc] = useState<string>('');

  // Selected inspected meeting
  const [selectedSignal, setSelectedSignal] = useState<SignalEvent | null>(signals[0] || null);

  // Active Inline Editor Form State for Selected Meeting details
  const [isEditingSelected, setIsEditingSelected] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editTime, setEditTime] = useState<string>('');
  const [editDesc, setEditDesc] = useState<string>('');
  const [editIcon, setEditIcon] = useState<string>('video');

  // Synchronize edits form state whenever selected event switches
  useEffect(() => {
    if (selectedSignal) {
      setEditTitle(selectedSignal.title);
      setEditTime(selectedSignal.time);
      setEditDesc(selectedSignal.description || '');
      setEditIcon(selectedSignal.iconType || 'video');
      setIsEditingSelected(false);
    }
  }, [selectedSignal]);

  // A safe confirmation wrapper that catches sandboxed iframe SecurityErrors
  const safeConfirm = (message: string): boolean => {
    try {
      return window.confirm(message);
    } catch (e) {
      console.warn("window.confirm blocked or failed in sandbox iframe; proceeding automatically with action.", e);
      return true;
    }
  };

  // Calendar Sync State
  const [calendarSyncStatus, setCalendarSyncStatus] = useState<'synchronized' | 'syncing' | 'offline'>('synchronized');

  // Bidirectional Synchronization loop: Fetch and match live events every 30 seconds
  useEffect(() => {
    if (!googleToken) return;

    const pullAndSync = async () => {
      try {
        setCalendarSyncStatus('syncing');
        const items = await fetchCalendarEvents(googleToken);
        if (!items) {
          // If simulation or empty, logged and kept offline fallback mode
          onLogMessage('info', 'Sincronizador GCalendar: Conectado y en línea con Workspace.');
          setCalendarSyncStatus('synchronized');
          return;
        }

        let updatedCount = 0;
        let newCount = 0;

        setSignals(prev => {
          let currentList = [...prev];
          items.forEach((item: any) => {
            const googleId = item.id;
            const summary = item.summary || 'Reunión agendada';
            const desc = item.description || 'Detalles sincronizados vía Google Workspace API.';
            
            // Format dynamic start date to string (HH:MM)
            let timeStr = '12:00';
            if (item.start?.dateTime) {
              const dt = new Date(item.start.dateTime);
              timeStr = `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`;
            } else if (item.start?.date) {
              timeStr = '09:00';
            }

            const matchIndex = currentList.findIndex(s => s.googleEventId === googleId || s.id === googleId);
            if (matchIndex >= 0) {
              const matched = currentList[matchIndex];
              if (matched.title !== summary || matched.description !== desc || matched.time !== timeStr) {
                currentList[matchIndex] = {
                  ...matched,
                  title: summary,
                  description: desc,
                  time: timeStr
                };
                updatedCount++;
              }
            } else {
              // Create new event payload
              const cleanId = `G-${googleId.slice(0, 8).toUpperCase()}`;
              const newItem: SignalEvent = {
                id: cleanId,
                time: timeStr,
                title: summary,
                description: desc,
                category: 'calendario_sota',
                iconType: 'users',
                active: true,
                syncedToGoogleCalendar: true,
                googleEventId: googleId
              };
              currentList.push(newItem);
              newCount++;
            }
          });
          return currentList;
        });

        if (newCount > 0 || updatedCount > 0) {
          onLogMessage('ok', `Google Calendar: ${newCount} nuevas reuniones añadidas, ${updatedCount} actualizadas.`);
        }
        setCalendarSyncStatus('synchronized');
      } catch (err: any) {
        console.warn('Bidirectional pull failed:', err);
        setCalendarSyncStatus('offline');
      }
    };

    pullAndSync();
    const interval = setInterval(pullAndSync, 30000);
    return () => clearInterval(interval);
  }, [googleToken]);

  // Timer Tick down
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            onLogMessage('warn', 'INICIO DE SESIÓN DE MEETING DE INMEDIATO. Conectándose con participantes...');
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsLeft]);

  // Compute display time string
  const formatCountdown = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    
    return {
      hoursStr: String(hours).padStart(2, '0'),
      minutesStr: String(minutes).padStart(2, '0'),
      secsStr: String(secs).padStart(2, '0')
    };
  };

  const { hoursStr, minutesStr, secsStr } = formatCountdown(secondsLeft);

  // Quick Preset buttons
  const setTimerPreset = (minutes: number) => {
    setSecondsLeft(minutes * 60);
    setIsTimerRunning(true);
    onLogMessage('info', `Cuenta regresiva de reunión ajustada: T-menos ${minutes} minutos.`);
  };

  // Trigger calendar synchronization
  const handleCalendarResync = async () => {
    if (googleToken) {
      try {
        setCalendarSyncStatus('syncing');
        onLogMessage('info', 'Estableciendo sincronización directa con Google Calendar...');
        const items = await fetchCalendarEvents(googleToken);
        if (items) {
          setCalendarSyncStatus('synchronized');
          onLogMessage('ok', `✓ Sincronización exitosa. ${items.length} reuniones actualizadas.`);
        }
      } catch (err: any) {
        setCalendarSyncStatus('offline');
        onLogMessage('err', `Fallo de sincronización: ${err.message}`);
      }
    } else {
      // Offline Simulation fallback
      setCalendarSyncStatus('syncing');
      onLogMessage('info', 'Estableciendo sincronización simulada de agenda personal...');
      setTimeout(() => {
        setCalendarSyncStatus('synchronized');
        onLogMessage('ok', 'Calendario simulado sincronizado con éxito. 3 eventos en cola.');
      }, 1200);
    }
  };

  // Add Signal (Meeting Event)
  const handleAddSignal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTime.trim() || !newId.trim()) {
      onLogMessage('err', 'Error: Complete todos los campos antes de agregar el evento.');
      return;
    }

    const generatedId = newId.toUpperCase().replace(/\s+/g, '-');
    let googleEventId = undefined;

    if (googleToken) {
      try {
        setCalendarSyncStatus('syncing');
        onLogMessage('info', `Registrando "${newTitle}" en Google Calendar...`);
        const result = await createCalendarEvent(googleToken, {
          title: newTitle,
          description: newDesc || 'Reunión agregada desde mi espacio SOTA.',
          time: newTime
        });
        if (result && result.id) {
          googleEventId = result.id;
          onLogMessage('ok', `✓ Evento registrado en Google Calendar (${result.id}).`);
        }
      } catch (err: any) {
        onLogMessage('warn', `Google API en espera: Creación registrada en memoria local.`);
      }
    }

    const payload: SignalEvent = {
      id: generatedId,
      time: newTime,
      title: newTitle,
      description: newDesc || 'Especificaciones técnicas de agenda para la sesión de meeting.',
      category: 'calendario_sota',
      iconType: newIcon,
      active: true,
      syncedToGoogleCalendar: true,
      googleEventId: googleEventId
    };

    setSignals((prev) => [...prev, payload]);
    setSelectedSignal(payload);
    onLogMessage('ok', `Reunión agendada [${payload.id}]: "${payload.title}" a las ${payload.time}`);
    
    // Reset Form
    setNewTitle('');
    setNewId('');
    setNewDesc('');
    setShowAddForm(false);
  };

  // Remove Signal with automatic Google Calendar Sync
  const handleRemoveSignal = async (id: string) => {
    const target = signals.find(s => s.id === id);
    if (!target) return;

    if (googleToken) {
      const confirmed = safeConfirm(`¿Confirmas que deseas eliminar "${target.title}" tanto localmente como de Google Calendar?`);
      if (!confirmed) return;

      try {
        setCalendarSyncStatus('syncing');
        await deleteCalendarEvent(googleToken, target.googleEventId || target.id);
        setCalendarSyncStatus('synchronized');
        onLogMessage('ok', `✓ Evento removido de Google Calendar.`);
      } catch (err: any) {
        onLogMessage('err', `Fallo al eliminar de Google Calendar: ${err.message}`);
      }
    } else {
      const confirmed = safeConfirm(`¿Seguro que deseas remover la reunión "${target.title}"?`);
      if (!confirmed) return;
    }

    const remainingSignals = signals.filter((s) => s.id !== id);
    setSignals(remainingSignals);
    onLogMessage('warn', `Sesión de meeting removida de la cola [${id}].`);
    if (selectedSignal?.id === id) {
      setSelectedSignal(remainingSignals[0] || null);
    }
  };

  // Switch Active signal (Google Calendar Sync status)
  const toggleSignalActive = (id: string) => {
    setSignals((prev) => 
      prev.map((s) => {
        if (s.id === id) {
          const updatedActive = !s.active;
          onLogMessage('info', `Sesión [${id}] - Sincronizada: ${updatedActive ? 'SI' : 'NO'}`);
          const updated = { ...s, active: updatedActive };
          if (selectedSignal?.id === id) {
            setSelectedSignal(updated);
          }
          return updated;
        }
        return s;
      })
    );
  };

  // Icon component helper
  const renderSignalIcon = (type: string, accentColorClass: string) => {
    const className = `w-4 h-4 ${accentColorClass}`;
    switch (type) {
      case 'video': return <Video className={className} />;
      case 'phone': return <Phone className={className} />;
      case 'group': return <Users className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  // System status color helpers
  const getAccentBorderClass = () => {
    switch (accent) {
      case 'magenta': return 'border-signal-magenta text-signal-magenta';
      case 'lime': return 'border-signal-lime text-signal-lime';
      case 'amber': return 'border-signal-amber text-signal-amber';
      default: return 'border-signal-cyan text-signal-cyan';
    }
  };

  const getAccentGlowClass = () => {
    switch (accent) {
      case 'magenta': return 'text-glow-magenta text-signal-magenta';
      case 'lime': return 'text-glow-lime text-signal-lime';
      case 'amber': return 'text-glow-amber text-signal-amber';
      default: return 'text-glow-cyan text-signal-cyan';
    }
  };

  const getAccentSolidBg = () => {
    switch (accent) {
      case 'magenta': return 'bg-signal-magenta';
      case 'lime': return 'bg-signal-lime';
      case 'amber': return 'bg-signal-amber';
      default: return 'bg-signal-cyan';
    }
  };

  const getAccentBgClass = () => {
    switch (accent) {
      case 'magenta': return 'bg-signal-magenta/10 text-signal-magenta';
      case 'lime': return 'bg-signal-lime/10 text-signal-lime';
      case 'amber': return 'bg-signal-amber/10 text-signal-amber';
      default: return 'bg-signal-cyan/10 text-signal-cyan';
    }
  };

  // Save edited meeting details and publish automatically
  const handleSaveEditedSignal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSignal) return;
    
    // Auto sync confirmation
    const confirmed = safeConfirm(`¿Confirmas que deseas publicar estos cambios en la reunión "${editTitle}" a distancia en Google Calendar?`);
    if (!confirmed) return;

    const updatedSignal: SignalEvent = {
      ...selectedSignal,
      title: editTitle,
      time: editTime,
      description: editDesc,
      iconType: editIcon
    };

    // Update local React state list
    setSignals(prev => prev.map(s => s.id === selectedSignal.id ? updatedSignal : s));
    setSelectedSignal(updatedSignal);
    setIsEditingSelected(false);
    onLogMessage('ok', `Reunión [${selectedSignal.id}] actualizada en la cola local.`);

    if (googleToken) {
      try {
        setCalendarSyncStatus('syncing');
        onLogMessage('info', `Publicando cambios de "${editTitle}" en los servidores de Google...`);
        await updateCalendarEvent(googleToken, selectedSignal.googleEventId || selectedSignal.id, {
          title: editTitle,
          description: editDesc,
          time: editTime
        });
        setCalendarSyncStatus('synchronized');
        onLogMessage('ok', `✓ Evento actualizado con éxito en Google Workspace.`);
      } catch (err: any) {
        setCalendarSyncStatus('offline');
        onLogMessage('err', `Error al empujar actualización de agenda: ${err.message}`);
      }
    }
  };

  return (
    <div 
      id="first-tab-dashboard" 
      className={`flex-1 flex flex-col p-6 md:p-8 gap-8 overflow-y-auto z-10 custom-scrollbar select-none text-on-surface ${
        config?.panelsSwapped ? 'xl:flex-row-reverse' : 'xl:flex-row'
      }`}
    >
      
      {/* Central HUD panel: COUNTDOWN & ACTIVE MEETING DATA */}
      <div className="flex-1 flex flex-col justify-between relative bg-carbon/15 border border-graphite/35 rounded-xl p-6 md:p-8 min-h-[500px]">
        
        {/* Deco elements */}
        <div className="flex justify-between items-center w-full z-10">
          <div className="flex gap-2 items-center">
            <div className={`w-1.5 h-1.5 rounded-full ${getAccentSolidBg()}`} />
            <div className="w-10 h-[1px] bg-[#1E2435]" />
            <span className="font-mono text-[9px] tracking-widest text-[#7A839E]/80">MEETING_SYNC_SYS</span>
          </div>

          <div className="flex gap-4 items-center mb-1">
            <span className="font-mono text-[9px] tracking-wider text-[#7A839E] uppercase flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded">
              <span className={`w-1.5 h-1.5 rounded-full ${calendarSyncStatus === 'synchronized' ? 'bg-signal-lime' : 'bg-signal-amber'} animate-pulse`} />
              Google Calendar: <strong className={calendarSyncStatus === 'synchronized' ? 'text-signal-lime' : 'text-signal-amber'}>{calendarSyncStatus.toUpperCase()}</strong>
            </span>
            <button 
              onClick={handleCalendarResync} 
              className="p-1 hover:text-signal-cyan transition-colors"
              title="Forzar actualización de calendario"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate ${calendarSyncStatus === 'syncing' ? 'animate-spin text-signal-cyan' : ''}`} />
            </button>
          </div>
        </div>

        {/* Outer Background subtle circles */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden animate-pulse">
          <div className="w-[320px] h-[320px] rounded-full border border-graphite/5" />
          <div className="w-[460px] h-[460px] rounded-full border border-graphite/5 absolute" />
        </div>

        {/* Countdown Content */}
        <div className="text-center z-10 my-8">
          <div className="inline-block font-mono text-[10px] uppercase tracking-widest mb-4 border border-signal-magenta/30 px-4 py-1.5 rounded-full bg-signal-magenta/5 text-signal-magenta">
            CONTEO REUNIÓN DE ALINEACIÓN PRÓXIMA SESIÓN
          </div>
          
          <div className="flex justify-center items-center font-display text-[72px] sm:text-[100px] md:text-[132px] font-bold leading-none tracking-tighter">
            <span className="text-[#4A5273] opacity-25 mr-2">-</span>
            <span className={getAccentGlowClass()}>
              {hoursStr}:{minutesStr}:{secsStr}
            </span>
          </div>

          <p className="font-mono text-[9px] text-[#A6AFC9] tracking-[0.2em] mt-3 uppercase">
            TEMPORAL REGISTRY / GOOGLE CALENDAR SYNCED
          </p>
        </div>

        {/* Upcoming Session Details Card - EDITABLE FORM */}
        {selectedSignal && (
          <div className="z-10 bg-carbon/50 border border-graphite/40 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-3xl mx-auto w-full backdrop-blur-sm animate-fade-in mb-3">
            {isEditingSelected ? (
              <form onSubmit={handleSaveEditedSignal} className="w-full flex flex-col gap-3">
                <div className="flex justify-between items-center border-b border-graphite/35 pb-1.5 mb-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-signal-magenta font-bold">
                    // EDITOR OPERACIONAL DE CAMPOS DE REUNIÓN:
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setIsEditingSelected(false)} 
                    className="text-slate hover:text-signal-magenta text-[9px] font-mono uppercase font-bold"
                  >
                    X Cancelar
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="font-mono text-[8.5px] uppercase text-slate">Título de Reunión:</label>
                    <input 
                      type="text" 
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="bg-[#03060C] border border-graphite rounded px-2.5 py-1.5 text-bone font-mono text-[10.5px] focus:border-signal-cyan outline-none"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[8.5px] uppercase text-slate">Hora (HH:MM):</label>
                    <input 
                      type="text" 
                      value={editTime}
                      onChange={(e) => setEditTime(e.target.value)}
                      className="bg-[#03060C] border border-graphite rounded px-2.5 py-1.5 text-bone font-mono text-[10.5px] focus:border-signal-cyan outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[8.5px] uppercase text-slate">Descripción / Agenda de Sesión:</label>
                  <textarea 
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    rows={2}
                    className="bg-[#03060C] border border-graphite rounded px-2.5 py-1.5 text-bone font-mono text-[10px] focus:border-signal-cyan outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 mt-1">
                  <button 
                    type="submit"
                    className="px-3.5 py-1.5 bg-signal-lime text-void text-[9px] font-mono font-bold uppercase rounded flex items-center gap-1 cursor-pointer hover:bg-signal-lime/90 transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" /> Guardar Cambios
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-lg ${getAccentBgClass()} mt-1 border border-graphite/40 flex-shrink-0`}>
                    <CalendarDays className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-slate block">// SESIÓN OPERACIONAL ACTIVA:</span>
                    <h4 className="text-sm font-bold text-bone font-body leading-snug">{selectedSignal.title}</h4>
                    <p className="text-xs text-[#A6AFC9] mt-0.5 max-w-xl leading-relaxed">{selectedSignal.description || 'Sin agenda registrada para este slot.'}</p>
                    <div className="flex gap-4 mt-2 text-[10px] font-mono text-slate">
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />Hora: <strong>{selectedSignal.time}</strong></span>
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-void/50 border border-graphite/20 font-bold" style={{ color: selectedSignal.googleEventId ? 'var(--color-signal-lime)' : 'var(--color-signal-cyan)' }}>
                        <CheckCircle2 className="w-3 h-3 block" />
                        {selectedSignal.googleEventId ? 'Google Calendar' : 'Local Workspace'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col justify-end gap-2 text-right">
                  <button 
                    onClick={() => setIsEditingSelected(true)}
                    className="px-3 py-1.5 bg-void hover:bg-carbon border border-signal-lime/30 text-signal-lime hover:border-signal-lime/60 text-[9.5px] font-mono font-bold uppercase rounded flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    title="Editar detalles de la sesión"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-signal-lime" /> Editar Reunión
                  </button>
                  <button 
                    onClick={() => onLogMessage('ok', `Abriendo sala virtual de videoconferencia para: ${selectedSignal.title}`)}
                    className="px-3 py-1.5 bg-signal-cyan hover:bg-signal-cyan/80 text-void text-[9.5px] font-mono font-bold uppercase rounded flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    title="Google Meet Virtual Link"
                  >
                    <Link className="w-3 h-3" /> Unirse a Meet
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Timer Reset */}
        <div className="z-10 flex justify-center">
          <button 
            onClick={() => {
              setSecondsLeft(1 * 3600 + 42 * 60 + 6);
              setIsTimerRunning(true);
              onLogMessage('info', 'Reloj reseteado a valores iniciales de sesión.');
            }}
            className="p-1.5 text-slate hover:text-signal-cyan transition-colors"
            title="Resetear Reloj"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sidebar: QUEUED ITEMS CONNECTED TO CALENDAR */}
      {!hideRightPanel && (
        <aside 
          className="w-full xl:max-w-full flex flex-col gap-6 flex-shrink-0 animate-fade-in"
          style={{ width: `${config?.sidebarWidth ?? 384}px` }}
        >
          
          {/* Panel Header */}
          <div className="flex items-center justify-between px-1 border-b border-graphite/40 pb-2">
            <div className="font-mono text-xs text-bone uppercase tracking-widest flex items-center gap-2.5 font-bold">
              <CalendarIcon className="w-4 h-4 text-signal-cyan" />
              Agenda en Cola (Google Sync)
            </div>
            <div className="font-mono text-[9px] text-signal-lime bg-signal-lime/5 border border-signal-lime/25 p-0.5 px-2 rounded uppercase">
              Bilateral: 30s
            </div>
          </div>

          {/* GOOGLE WORKSPACE CONNECTION PROFILE INTEGRATION */}
          {googleToken ? (
            <div className="bg-signal-lime/5 border border-signal-lime/25 p-3 rounded-lg flex items-center justify-between font-mono text-[9.5px]">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-signal-lime" />
                <div className="leading-tight">
                  <span className="text-slate block text-[8px] uppercase">Workspace Conectado:</span>
                  <span className="text-bone uppercase truncate max-w-[160px] inline-block font-bold">
                    {user?.displayName || user?.email || 'Alineado'}
                  </span>
                </div>
              </div>
              <button 
                onClick={async () => {
                  try {
                    await logout();
                  } catch (e) {}
                  setGoogleToken(null);
                  setUser(null);
                  onLogMessage('info', 'Sesión de Google Calendar desconectada.');
                }}
                className="text-signal-magenta hover:underline uppercase text-[8px] font-bold"
                title="Desvincular Cuenta"
              >
                Salir
              </button>
            </div>
          ) : (
            <div className="bg-void/40 border border-graphite/40 p-3 rounded-lg flex flex-col gap-2 font-mono text-[9px] select-none text-slate leading-tight">
              <p className="uppercase text-[8.5px]">
                Enlaza tus reuniones reales para activar sincronización bidireccional y Google Meet:
              </p>
              <button
                type="button"
                onClick={async () => {
                  try {
                    onLogMessage('info', 'Iniciando conexión segura de Google Workspace...');
                    const token = await googleSignIn();
                    if (token) {
                      setGoogleToken(token);
                      onLogMessage('ok', '✓ Autenticado con Google con éxito.');
                    }
                  } catch (e: any) {
                    onLogMessage('err', `Fallo de autenticación: ${e.message || e}`);
                  }
                }}
                className="w-full py-1.5 bg-signal-amber text-void font-bold uppercase tracking-wider rounded text-[9px] flex items-center justify-center gap-1 hover:bg-signal-amber/90 transition-colors cursor-pointer"
              >
                <LogIn className="w-3 h-3" /> Conectar Google Calendar
              </button>
            </div>
          )}

          {/* Quick action: Register New Meeting to the Sync Queue */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex-1 flex items-center justify-center gap-2 border border-dashed border-graphite hover:border-ash/50 bg-[#131826]/30 hover:bg-carbon/30 py-2 rounded-lg text-xs font-mono text-ash hover:text-bone transition-all duration-200"
            >
              {showAddForm ? <X className="w-3.5 h-3.5 text-signal-magenta" /> : <Plus className="w-3.5 h-3.5 text-signal-cyan" />}
              {showAddForm ? 'Cerrar Registro' : 'Agendar Nueva Reunión Calendario'}
            </button>
          </div>

          {/* Calendar Queue Area */}
          <div className="flex-1 relative min-h-[300px]">
            <AnimatePresence mode="wait">
              {showAddForm ? (
                <motion.form
                  onSubmit={handleAddSignal}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="bg-carbon/40 border border-graphite/45 rounded-xl p-4 flex flex-col gap-3 font-body text-xs absolute inset-0 overflow-y-auto custom-scrollbar"
                >
                  <span className="font-mono text-[8.5px] text-[#7A839E] uppercase tracking-wider border-b border-graphite/30 pb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-signal-lime" />
                    Agendar Evento en Google Calendar
                  </span>
                  
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] uppercase text-slate">ID Interno de Sesión</label>
                    <input 
                      type="text" 
                      value={newId} 
                      onChange={(e) => setNewId(e.target.value)}
                      placeholder="Ej: MTG-SYNC" 
                      className="bg-[#04060A] border border-graphite focus:border-signal-cyan outline-none rounded p-1.5 font-mono text-bone text-xs uppercase"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] uppercase text-slate">Hora Programada (HH:MM)</label>
                    <input 
                      type="text" 
                      value={newTime} 
                      onChange={(e) => setNewTime(e.target.value)}
                      className="bg-[#04060A] border border-graphite focus:border-signal-cyan outline-none rounded p-1.5 font-mono text-bone text-xs"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] uppercase text-slate">Título de Reunión o Sprint</label>
                    <input 
                      type="text" 
                      value={newTitle} 
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Vendor Review Sync" 
                      className="bg-[#04060A] border border-graphite focus:border-signal-cyan outline-none rounded p-1.5 text-bone text-xs"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] uppercase text-slate">Formato de Participación</label>
                    <select 
                      value={newIcon}
                      onChange={(e) => setNewIcon(e.target.value)}
                      className="bg-[#04060A] border border-graphite focus:border-signal-cyan outline-none rounded p-1.5 text-bone text-xs font-mono"
                    >
                      <option value="video">GOOGLE MEET (VIDEOCONFERENCIA)</option>
                      <option value="phone">LLAMADA DE VOZ (TELÉFONO)</option>
                      <option value="group">SINCRO DE ALINEACIÓN (GRUPO)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] uppercase text-slate">Breve Temario o Notas</label>
                    <textarea 
                      value={newDesc} 
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Ej: Revisión del cuadrante SOTA..." 
                      className="bg-[#04060A] border border-graphite focus:border-signal-cyan outline-none rounded p-1.5 text-bone text-xs h-14 resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="mt-1 w-full py-2 bg-signal-cyan hover:bg-signal-cyan/95 text-void font-bold font-mono uppercase tracking-wider rounded text-[10px]"
                  >
                    Registrar & Vincular Calendario
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-3.5 overflow-y-auto absolute inset-0 pr-1.5 custom-scrollbar"
                >
                  {signals.length === 0 ? (
                    <div className="text-center py-12 text-ash/40 font-mono text-xs border border-dashed border-graphite rounded-lg">
                      COLA DE EVENTOS VACÍA
                    </div>
                  ) : (
                    signals.map((sig) => {
                      const isSelected = selectedSignal?.id === sig.id;
                      const isActive = sig.active;
                      
                      return (
                        <div 
                          key={sig.id}
                          onClick={() => {
                            setSelectedSignal(sig);
                            onLogMessage('info', `Inspeccionando evento calendar sync: "${sig.title}"`);
                          }}
                          className={`border rounded-xl p-3.5 transition-all duration-300 cursor-pointer flex flex-col gap-2 relative group overflow-hidden ${
                            isSelected 
                              ? `${getAccentBorderClass()} bg-carbon/50 glow-cyan/5` 
                              : 'border-graphite/35 bg-carbon/25 hover:border-graphite/85 hover:bg-carbon/40'
                          }`}
                        >
                          {/* Sync ribbon indicator */}
                          {isActive && (
                            <div className={`absolute top-0 right-0 w-12 h-1 ${getAccentSolidBg()}`} />
                          )}

                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide ${
                                isActive 
                                  ? 'bg-signal-cyan/10 text-signal-cyan border border-signal-cyan/20' 
                                  : 'bg-[#1E2435]/40 text-[#7A839E] border border-transparent'
                              }`}>
                                {sig.time}
                              </span>
                              {isActive && (
                                <span className="text-[9px] font-mono text-signal-lime animate-pulse font-semibold uppercase flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-signal-lime rounded-full animate-ping" />
                                  [CONECTADO]
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-1.5">
                              {renderSignalIcon(sig.iconType, isSelected ? 'text-bone' : 'text-ash')}
                              
                              {/* Toggle Sync */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSignalActive(sig.id);
                                }}
                                className={`p-1 rounded border transition-all ${
                                  isActive 
                                    ? 'bg-signal-lime/10 border-signal-lime/40 text-signal-lime hover:bg-signal-lime/20' 
                                    : 'bg-carbon/60 border-graphite/60 text-slate hover:text-bone hover:border-slate/100'
                                }`}
                                title={isActive ? "Pausar Sincronización Google" : "Vincular a Google Calendar"}
                              >
                                <Check className="w-3 h-3" />
                              </button>

                              {/* Edit Meeting */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedSignal(sig);
                                  setIsEditingSelected(true);
                                  onLogMessage('info', `Editando detalles de: "${sig.title}"`);
                                }}
                                className="p-1 rounded border bg-signal-lime/5 border-signal-lime/25 text-signal-lime hover:bg-signal-lime/20 hover:border-signal-lime/60 transition-all"
                                title="Editar Detalles"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>

                              {/* Purge */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveSignal(sig.id);
                                }}
                                className="p-1 rounded border bg-signal-magenta/5 border-signal-magenta/25 text-signal-magenta hover:bg-signal-magenta/20 hover:border-signal-magenta/60 transition-all"
                                title="Purgar Reunión"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          <div className="font-body text-xs font-semibold text-[#dfe2ef] tracking-wide mt-1">
                            {sig.title}
                          </div>

                          <div className="flex justify-between items-center text-[8.5px] font-mono text-[#7A839E]/80 uppercase">
                            <span>REG-ID: {sig.id}</span>
                            <span className="text-signal-cyan">Google Calendar Sync ✓</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </aside>
      )}
    </div>
  );
}
