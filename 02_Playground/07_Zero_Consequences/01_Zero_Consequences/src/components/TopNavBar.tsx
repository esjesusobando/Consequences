import React, { useEffect, useState } from 'react';
import { Terminal as TerminalIcon, Menu, Eye, EyeOff } from 'lucide-react';
import { AccentColor } from '../types';
import Logo from './Logo';

interface TopNavBarProps {
  activeTab: 'dashboard' | 'personal_os' | 'linear' | 'operations' | 'analytics' | 'specs' | 'terminal';
  setActiveTab: (tab: 'dashboard' | 'personal_os' | 'linear' | 'operations' | 'analytics' | 'specs' | 'terminal') => void;
  accent: AccentColor;
  onAccentChange: (accent: AccentColor) => void;
  speedMbps: number;
  onOpenSettings: () => void;
  focusMode: boolean;
  onToggleFocus: () => void;
}

export default function TopNavBar({
  activeTab,
  setActiveTab,
  accent,
  onAccentChange,
  speedMbps,
  onOpenSettings,
  focusMode,
  onToggleFocus,
}: TopNavBarProps) {
  const [clockText, setClockText] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const days = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
      const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
      
      const dayName = days[now.getDay()];
      const dayNum = now.getDate();
      const monthName = months[now.getMonth()];
      const yearNum = now.getFullYear();
      
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      
      setClockText(`${dayName}, ${dayNum} ${monthName} ${yearNum} — ${hrs}:${mins}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getAccentTextClass = () => {
    switch (accent) {
      case 'magenta': return 'text-signal-magenta';
      case 'lime': return 'text-signal-lime';
      case 'amber': return 'text-signal-amber';
      default: return 'text-signal-cyan';
    }
  };

  const getAccentBorderClass = () => {
    switch (accent) {
      case 'magenta': return 'border-signal-magenta';
      case 'lime': return 'border-signal-lime';
      case 'amber': return 'border-signal-amber';
      default: return 'border-signal-cyan';
    }
  };

  const navLinks = [
    { id: 'dashboard' as const, label: 'PRÓXIMA SESIÓN' },
    { id: 'personal_os' as const, label: 'PERSONAL OS' },
    { id: 'linear' as const, label: 'TEAM LINEAR' },
    { id: 'operations' as const, label: 'OPERACIONES' },
    { id: 'analytics' as const, label: 'REPORTES & QR' },
    { id: 'specs' as const, label: 'ESTILOS' },
    { id: 'terminal' as const, label: 'TERMINAL' },
  ];

  return (
    <header className="bg-void/85 backdrop-blur-md border-b border-graphite/40 w-full top-0 flex justify-between items-center px-6 h-14 z-50 fixed select-none text-on-surface">
      {/* LEFT: Logo + Clock + Nav links */}
      <div className="flex items-center gap-5">
        <div 
          onClick={() => setActiveTab('personal_os')}
          className="cursor-pointer transition-all duration-300 flex items-center"
        >
          <Logo size={24} />
        </div>

        {/* Clock — next to logo */}
        <div className="flex items-center text-[10px] font-mono text-bone/70 tracking-wider">
          <span>{clockText}</span>
        </div>

        {/* Divider */}
        <div className="w-[1px] h-4 bg-graphite/30" />

        {/* Nav links — horizontal on xl+ */}
        <div className="hidden xl:flex gap-4 items-center animate-fade-in">
          {navLinks.map((link) => {
            const active = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`font-mono text-[10px] tracking-wider transition-all duration-200 pb-1 cursor-pointer border-b ${
                  active 
                    ? `${getAccentTextClass()} ${getAccentBorderClass()} font-bold` 
                    : 'text-ash border-transparent hover:text-bone hover:border-gray-700'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT: Hamburger + Eye + Terminal — same size, aligned */}
      <div className="flex items-center gap-1.5">
        {/* Active tab label — small screens only */}
        <span className="xl:hidden font-mono text-[9px] bg-carbon p-1 px-2 rounded border border-graphite text-bone uppercase tracking-widest mr-2">
          {activeTab.replace('_', ' ')}
        </span>

        {/* Hamburger — settings */}
        <button 
          onClick={onOpenSettings}
          className="w-8 h-8 flex items-center justify-center bg-[#131826]/70 hover:bg-[#1E2435] border border-graphite/60 hover:border-signal-cyan/50 text-[#C7CCD8] hover:text-signal-cyan rounded-lg cursor-pointer transition-all"
          title="Personalización"
        >
          <Menu className="w-3.5 h-3.5" />
        </button>

        {/* Eye — Focus Mode */}
        <button 
          onClick={onToggleFocus}
          className={`w-8 h-8 flex items-center justify-center rounded-lg border cursor-pointer transition-all ${
            focusMode
              ? 'bg-signal-lime/15 border-signal-lime/40 text-signal-lime'
              : 'bg-[#131826]/70 hover:bg-[#1E2435] border-graphite/60 hover:border-signal-lime/40 text-[#C7CCD8] hover:text-signal-lime'
          }`}
          title={focusMode ? "Salir de Focus Mode" : "Focus Mode"}
        >
          {focusMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>

        {/* Terminal */}
        <button 
          onClick={() => setActiveTab('terminal')}
          className="w-8 h-8 flex items-center justify-center bg-[#131826]/70 hover:bg-[#1E2435] border border-graphite/60 hover:border-signal-cyan/50 text-[#C7CCD8] hover:text-signal-cyan rounded-lg cursor-pointer transition-all"
          title="Terminal"
        >
          <TerminalIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}
