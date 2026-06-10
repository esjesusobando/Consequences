import React, { useState } from "react";
import { GoogleTask } from "../types";
import { CheckSquare, Square, Plus, Calendar, AlertCircle, Sparkles } from "lucide-react";
import { translations } from "../lib/translations";

interface TasksViewProps {
  tasks: GoogleTask[];
  onAddTask: (title: string) => void;
  onToggleTask: (id: string, currentStatus: 'needsAction' | 'completed') => void;
  searchQuery: string;
  language?: 'es' | 'en';
  themeMode?: 'craft' | 'cyber';
}

export default function TasksView({
  tasks,
  onAddTask,
  onToggleTask,
  searchQuery,
  language = 'es',
  themeMode = 'craft'
}: TasksViewProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const t = translations[language].tasks;
  const isLight = themeMode === 'craft';

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask(newTaskTitle);
    setNewTaskTitle("");
  };

  // Live filter based on search inputs
  const filteredTasks = tasks.filter(task => {
    if (!searchQuery) return true;
    return task.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const pendingCount = tasks.filter(t => t.status === 'needsAction').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="flex-grow flex flex-col gap-6">

      {/* Quick operational statistics counters */}
      <div className="grid grid-cols-2 gap-5">
        <div className={`p-5 transition-all duration-300 rounded-[1.75rem] border ${
          isLight ? 'bg-white border-zinc-200' : 'bg-[#131826]/70 border-[#1E2435]'
        }`}>
          <span className={`font-mono text-[9px] block uppercase font-bold ${isLight ? 'text-zinc-400' : 'text-[#7A839E]'}`}>{t.pending}</span>
          <span className={`text-xl font-extrabold ${isLight ? 'text-zinc-900 font-sans' : 'text-[#e10083] font-display'}`}>{pendingCount}</span>
        </div>
        
        <div className={`p-5 transition-all duration-300 rounded-[1.75rem] border ${
          isLight ? 'bg-white border-zinc-200 shadow-sm' : 'bg-[#131826]/70 border-[#1E2435]'
        }`}>
          <span className={`font-mono text-[9px] block uppercase font-bold ${isLight ? 'text-zinc-400' : 'text-[#7A839E]'}`}>{t.completed}</span>
          <span className={`text-xl font-extrabold ${isLight ? 'text-zinc-900 font-sans' : 'text-[#00f0ff] font-display'}`}>{completedCount}</span>
        </div>
      </div>

      {/* Primary operational tasks manager console */}
      <div className={`transition-all duration-300 border p-6 md:p-8 rounded-[2rem] ${
        isLight ? 'bg-white border-zinc-200 shadow-sm' : 'border border-[#1E2435] bg-[#0f131c]'
      }`}>
        <h3 className={`font-semibold mb-5 text-sm tracking-tight flex items-center gap-2 ${
          isLight ? 'text-zinc-900 font-sans' : 'font-mono text-[#00f0ff] uppercase text-xs tracking-wider font-bold'
        }`}>
          <Sparkles className={`w-4 h-4 ${isLight ? 'text-zinc-700' : 'text-neon-cyan animate-pulse'}`} />
          {t.registry}
        </h3>

        {/* Task Form to dispatch clearings */}
        <form onSubmit={handleCreateTask} className="flex gap-2 mb-6">
          <input
            type="text"
            required
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder={t.placeholder}
            className={`flex-grow font-mono text-xs px-4 py-3 focus:outline-none transition-all rounded-full ${
              isLight 
                ? 'bg-zinc-100 border border-zinc-200 text-zinc-900 focus:bg-white focus:border-zinc-400' 
                : 'bg-[#131826] border border-[#1E2435] text-white focus:border-[#00f0ff] rounded-xs'
            }`}
          />
          <button
            type="submit"
            className={`font-mono text-xs font-semibold px-5 rounded-full flex items-center gap-1 cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-95 ${
              isLight 
                ? 'bg-gradient-to-r from-[#0052FF] via-[#3B82F6] to-[#8FEF10] text-white hover:opacity-95 shadow-[0_4px_12px_rgba(0,82,255,0.15)]' 
                : 'bg-[#00f0ff] hover:bg-[#00dbe9] text-black rounded-xs shadow-[0_0_8px_rgba(0,240,255,0.2)]'
            }`}
          >
            <Plus className="w-4 h-4" /> {t.dispatch}
          </button>
        </form>

        {/* List nodes */}
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {filteredTasks.length === 0 ? (
            <div className={`text-center py-12 border rounded-2xl ${
              isLight ? 'bg-zinc-50/50 border-zinc-200' : 'bg-[#0a0e17] border-[#1E2435]'
            }`}>
              <AlertCircle className="w-8 h-8 text-[#7A839E] mx-auto mb-3 animate-pulse" />
              <p className="font-mono text-xs text-[#7A839E] uppercase">{t.all_clear}</p>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isCompleted = task.status === 'completed';
              return (
                <div 
                  key={task.id}
                  onClick={() => onToggleTask(task.id, task.status)}
                  className={`flex items-start justify-between p-4 border transition-all duration-150 cursor-pointer rounded-2xl ${
                    isCompleted 
                      ? isLight
                        ? 'border-zinc-100 bg-zinc-50/40 opacity-60'
                        : 'border-[#1E2435]/50 bg-[#131826]/10 opacity-70' 
                      : isLight
                        ? 'border-zinc-200 bg-white hover:bg-zinc-50/20 hover:border-zinc-350'
                        : 'border-[#1E2435] bg-[#131826]/30 hover:border-[#00f0ff]/40'
                  }`}
                >
                  <div className="flex gap-3.5 items-start min-w-0 pr-4">
                    <button className="hover:scale-110 active:scale-95 cursor-pointer mt-0.5">
                      {isCompleted ? (
                        <CheckSquare className={`w-5 h-5 ${isLight ? 'text-zinc-950' : 'text-[#00f0ff]'}`} />
                      ) : (
                        <Square className={`w-5 h-5 ${isLight ? 'text-zinc-400 hover:text-zinc-600' : 'text-[#7A839E] hover:text-[#00f0ff]'}`} />
                      )}
                    </button>
                    
                    <div className="min-w-0">
                      <span className={`font-medium text-xs transition-all ${
                        isCompleted 
                          ? 'line-through text-zinc-405 text-zinc-400' 
                          : isLight 
                            ? 'text-zinc-800 font-sans' 
                            : 'text-[#dfe2ef] font-mono'
                      }`}>
                        {task.title}
                      </span>
                      {task.notes && (
                        <p className={`text-[11px] mt-0.5 line-clamp-1 ${
                          isLight ? 'text-zinc-500 font-sans' : 'text-[#7A839E] font-mono'
                        }`}>{task.notes}</p>
                      )}
                    </div>
                  </div>

                  {task.due && (
                    <div className="flex items-center gap-1 font-mono text-[10px] text-[#7A839E] flex-shrink-0">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(task.due).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {month: 'short', day: 'numeric'})}
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
