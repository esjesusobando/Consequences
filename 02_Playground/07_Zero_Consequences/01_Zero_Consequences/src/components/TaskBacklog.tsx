import React, { useState } from 'react';
import {
  Plus,
  Clock,
  Calendar,
  Play,
  Pause,
  CheckCircle2,
  Trash2,
  Edit2,
  Save,
  X,
  TrendingUp,
  Target,
  Zap,
  Sparkles,
  ListTodo,
  CalendarDays,
  Timer,
  Brain,
} from 'lucide-react';
import { BacklogTask, AccentColor, TimeLog } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface TaskBacklogProps {
  tasks: BacklogTask[];
  setTasks: React.Dispatch<React.SetStateAction<BacklogTask[]>>;
  accent: AccentColor;
  onLogMessage: (type: 'info' | 'ok' | 'warn' | 'err', text: string) => void;
  onStartFocus?: () => void;
}

export default function TaskBacklog({
  tasks,
  setTasks,
  accent,
  onLogMessage,
  onStartFocus,
}: TaskBacklogProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newEstimatedMinutes, setNewEstimatedMinutes] = useState(30);
  const [newScheduledDate, setNewScheduledDate] = useState('');
  const [newScheduledTime, setNewScheduledTime] = useState('');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editEstimatedMinutes, setEditEstimatedMinutes] = useState(30);

  const [activeTimer, setActiveTimer] = useState<{ taskId: string; startTime: Date } | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Filter tasks
  const backlogTasks = tasks.filter(t => t.status === 'backlog');
  const scheduledTasks = tasks.filter(t => t.status === 'scheduled');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  // Stats
  const totalEstimatedMinutes = tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);
  const totalActualMinutes = tasks.reduce((sum, t) => sum + (t.actualMinutes || 0), 0);
  const completedTasks = doneTasks.length;
  const accuracyRate = totalActualMinutes > 0 
    ? Math.round((totalEstimatedMinutes / totalActualMinutes) * 100)
    : 0;

  // Add task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const task: BacklogTask = {
      id: `TASK-${Date.now().toString(36).toUpperCase()}`,
      title: newTitle,
      description: newDescription,
      estimatedMinutes: newEstimatedMinutes,
      scheduledDate: newScheduledDate || undefined,
      scheduledTime: newScheduledTime || undefined,
      source: 'manual',
      status: newScheduledDate ? 'scheduled' : 'backlog',
      priority: newPriority,
      tags: [],
      createdAt: new Date().toISOString(),
    };

    setTasks(prev => [...prev, task]);
    onLogMessage('ok', `Tarea creada: "${task.title}" (${task.estimatedMinutes}min)`);

    // Reset form
    setNewTitle('');
    setNewDescription('');
    setNewEstimatedMinutes(30);
    setNewScheduledDate('');
    setNewScheduledTime('');
    setNewPriority('medium');
    setShowAddForm(false);
  };

  // Start timer
  const startTimer = (taskId: string) => {
    setActiveTimer({ taskId, startTime: new Date() });
    setElapsedSeconds(0);
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: 'in_progress' as const } : t
    ));
    onLogMessage('info', `Timer iniciado para tarea`);

    // Update elapsed time every second
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    // Store interval ID for cleanup
    (window as any).taskTimerInterval = interval;
  };

  // Stop timer
  const stopTimer = () => {
    if (!activeTimer) return;

    const actualMinutes = Math.round(elapsedSeconds / 60);
    
    setTasks(prev => prev.map(t => 
      t.id === activeTimer.taskId 
        ? { ...t, status: 'done' as const, actualMinutes, completedAt: new Date().toISOString() }
        : t
    ));

    onLogMessage('ok', `Tarea completada en ${actualMinutes}min`);
    setActiveTimer(null);
    setElapsedSeconds(0);

    if ((window as any).taskTimerInterval) {
      clearInterval((window as any).taskTimerInterval);
    }
  };

  // Delete task
  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    onLogMessage('warn', `Tarea eliminada`);
  };

  // Schedule task
  const scheduleTask = (taskId: string, date: string, time: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId 
        ? { ...t, scheduledDate: date, scheduledTime: time, status: 'scheduled' as const }
        : t
    ));
    onLogMessage('info', `Tarea programada para ${date} ${time}`);
  };

  // Get accent classes
  const getAccentClass = () => {
    switch (accent) {
      case 'magenta': return 'text-signal-magenta';
      case 'lime': return 'text-signal-lime';
      case 'amber': return 'text-signal-amber';
      default: return 'text-signal-cyan';
    }
  };

  const getAccentBgClass = () => {
    switch (accent) {
      case 'magenta': return 'bg-signal-magenta/10';
      case 'lime': return 'bg-signal-lime/10';
      case 'amber': return 'bg-signal-amber/10';
      default: return 'bg-signal-cyan/10';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-signal-magenta bg-signal-magenta/10';
      case 'medium': return 'text-signal-amber bg-signal-amber/10';
      case 'low': return 'text-signal-lime bg-signal-lime/10';
      default: return 'text-ash bg-carbon/40';
    }
  };

  // Format timer
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="flex h-full bg-void overflow-hidden">
      {/* Left: Backlog */}
      <div className="w-96 bg-carbon/20 border-r border-graphite/40 flex flex-col">
        <div className="p-4 border-b border-graphite/30">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-bone flex items-center gap-2">
              <ListTodo className="w-5 h-5" />
              Backlog
            </h2>
            <div className="flex items-center gap-2">
              {onStartFocus && (
                <button
                  onClick={onStartFocus}
                  className="px-3 py-1.5 bg-signal-cyan/10 text-signal-cyan hover:bg-signal-cyan/20 rounded-lg transition-all text-xs font-semibold flex items-center gap-1.5"
                  title="Start Focus Mode"
                >
                  <Brain className="w-3.5 h-3.5" />
                  Focus
                </button>
              )}
              <button
                onClick={() => setShowAddForm(true)}
                className={`p-2 rounded-lg ${getAccentBgClass()} ${getAccentClass()} hover:opacity-80 transition-all`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-carbon/40 rounded-lg">
              <div className="text-xs text-ash/60 font-mono">Total</div>
              <div className="text-lg font-bold text-bone">{tasks.length}</div>
            </div>
            <div className="p-2 bg-carbon/40 rounded-lg">
              <div className="text-xs text-ash/60 font-mono">Done</div>
              <div className="text-lg font-bold text-signal-lime">{completedTasks}</div>
            </div>
            <div className="p-2 bg-carbon/40 rounded-lg">
              <div className="text-xs text-ash/60 font-mono">Accuracy</div>
              <div className="text-lg font-bold text-signal-cyan">{accuracyRate}%</div>
            </div>
          </div>
        </div>

        {/* Task list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {backlogTasks.length === 0 ? (
            <div className="text-center py-12 text-ash/40">
              <ListTodo className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No hay tareas en backlog</p>
            </div>
          ) : (
            backlogTasks.map(task => (
              <div
                key={task.id}
                className="p-3 bg-carbon/30 border border-graphite/40 rounded-lg hover:border-graphite/60 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
                        {task.priority.toUpperCase()}
                      </span>
                      {task.source === 'email' && (
                        <span className="text-[9px] font-mono text-signal-cyan bg-signal-cyan/10 px-1.5 py-0.5 rounded">
                          EMAIL
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-bone">{task.title}</h3>
                    {task.description && (
                      <p className="text-xs text-ash/70 mt-1 line-clamp-2">{task.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 text-xs text-ash/60">
                    <Clock className="w-3 h-3" />
                    <span>{task.estimatedMinutes}min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startTimer(task.id)}
                      className="p-1.5 text-signal-lime hover:bg-signal-lime/10 rounded transition-all"
                      title="Iniciar timer"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 text-ash/60 hover:text-signal-magenta hover:bg-signal-magenta/10 rounded transition-all"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right: Scheduled + In Progress */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Active timer */}
        {activeTimer && (
          <div className="p-6 bg-signal-lime/5 border-b border-signal-lime/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-signal-lime uppercase mb-1">Timer Activo</div>
                <div className="text-lg font-bold text-bone">
                  {tasks.find(t => t.id === activeTimer.taskId)?.title}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-mono font-bold text-signal-lime">
                  {formatTimer(elapsedSeconds)}
                </div>
                <button
                  onClick={stopTimer}
                  className="p-3 bg-signal-magenta hover:bg-signal-magenta/80 text-white rounded-lg transition-all"
                >
                  <Pause className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Scheduled tasks */}
        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-lg font-bold text-bone mb-4 flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Programadas
          </h3>

          {scheduledTasks.length === 0 ? (
            <div className="text-center py-12 text-ash/40">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No hay tareas programadas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {scheduledTasks.map(task => (
                <div
                  key={task.id}
                  className="p-4 bg-carbon/30 border border-graphite/40 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-bone">{task.title}</h4>
                      <div className="flex items-center gap-3 mt-2 text-xs text-ash/60">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {task.scheduledDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.scheduledTime}
                        </span>
                        <span>{task.estimatedMinutes}min</span>
                      </div>
                    </div>
                    <button
                      onClick={() => startTimer(task.id)}
                      className="p-2 text-signal-lime hover:bg-signal-lime/10 rounded-lg transition-all"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Completed tasks */}
          {doneTasks.length > 0 && (
            <>
              <h3 className="text-lg font-bold text-bone mt-8 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-signal-lime" />
                Completadas
              </h3>
              <div className="space-y-2">
                {doneTasks.slice(0, 10).map(task => (
                  <div
                    key={task.id}
                    className="p-3 bg-carbon/20 border border-graphite/30 rounded-lg opacity-60"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-bone line-through">{task.title}</h4>
                        <div className="flex items-center gap-3 mt-1 text-xs text-ash/60">
                          <span>Estimado: {task.estimatedMinutes}min</span>
                          <span>Real: {task.actualMinutes}min</span>
                        </div>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-signal-lime" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add task modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-carbon border border-graphite/60 rounded-xl p-6 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-lg font-bold text-bone mb-4">Nueva Tarea</h3>
              <form onSubmit={handleAddTask} className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-ash uppercase mb-1 block">Título</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-void border border-graphite/50 rounded-lg text-bone focus:outline-none focus:border-signal-cyan/60"
                    placeholder="¿Qué necesitas hacer?"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-ash uppercase mb-1 block">Descripción</label>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-void border border-graphite/50 rounded-lg text-bone focus:outline-none focus:border-signal-cyan/60 resize-none"
                    rows={3}
                    placeholder="Detalles opcionales..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono text-ash uppercase mb-1 block">Tiempo (min)</label>
                    <input
                      type="number"
                      value={newEstimatedMinutes}
                      onChange={(e) => setNewEstimatedMinutes(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-void border border-graphite/50 rounded-lg text-bone focus:outline-none focus:border-signal-cyan/60"
                      min={5}
                      step={5}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-ash uppercase mb-1 block">Prioridad</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as any)}
                      className="w-full px-3 py-2 bg-void border border-graphite/50 rounded-lg text-bone focus:outline-none focus:border-signal-cyan/60"
                    >
                      <option value="high">Alta</option>
                      <option value="medium">Media</option>
                      <option value="low">Baja</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono text-ash uppercase mb-1 block">Fecha (opcional)</label>
                    <input
                      type="date"
                      value={newScheduledDate}
                      onChange={(e) => setNewScheduledDate(e.target.value)}
                      className="w-full px-3 py-2 bg-void border border-graphite/50 rounded-lg text-bone focus:outline-none focus:border-signal-cyan/60"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-ash uppercase mb-1 block">Hora (opcional)</label>
                    <input
                      type="time"
                      value={newScheduledTime}
                      onChange={(e) => setNewScheduledTime(e.target.value)}
                      className="w-full px-3 py-2 bg-void border border-graphite/50 rounded-lg text-bone focus:outline-none focus:border-signal-cyan/60"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-signal-cyan text-void font-semibold rounded-lg hover:bg-signal-cyan/90 transition-all"
                  >
                    Crear Tarea
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2.5 bg-carbon border border-graphite/50 text-ash rounded-lg hover:text-bone transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
