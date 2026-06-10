import React, { useEffect, useState } from 'react';
import { Terminal as TerminalIcon, Menu, PanelLeft, PanelRight } from 'lucide-react';
import { AccentColor } from '../types';
import Logo from './Logo';

interface TopNavBarProps {
  activeTab: 'dashboard' | 'personal_os' | 'linear' | 'operations' | 'analytics' | 'specs' | 'terminal';
  setActiveTab: (tab: 'dashboard' | 'personal_os' | 'linear' | 'operations' | 'analytics' | 'specs' | 'terminal') => void;
  accent: AccentColor;
  onAccentChange: (accent: AccentColor) => void;
  speedMbps: number;
  onOpenSettings: () => void;
  hideLeftPanel: boolean;
  hideRightPanel: boolean;
  onToggleLeftPanel: () => void;
  onToggleRightPanel: () => void;
}

export default function TopNavBar({
  activeTab,
  setActiveTab,
  accent,
  onAccentChange,
  speedMbps,
  onOpenSettings,
  hideLeftPanel,
  hideRightPanel,
  onToggleLeftPanel,
  onToggleRightPanel,
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
      const secs = String(now.getSeconds()).padStart(2, '0');
      
      setClockText(`${dayName}, ${dayNum} ${monthName} ${yearNum} — ${hrs}:${mins}:${secs}`);
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
      <div className="flex items-center gap-6">
        <div 
          onClick={() => setActiveTab('personal_os')}
          className="cursor-pointer transition-all duration-300 flex items-center"
        >
          <Logo size={24} />
        </div>

        {/* Dynamic Horizontal Header Navigator list - only visible when left menu/sidebar is hidden */}
        {hideLeftPanel && (
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
        )}
      </div>

      <div className="flex items-center gap-4 text-ash">
        
        {/* Active tab short description for smaller screens */}
        <span className="xl:hidden font-mono text-[10px] bg-carbon p-1 px-2.5 rounded border border-graphite text-bone uppercase tracking-widest">
          {activeTab.replace('_', ' ')}
        </span>

        {/* Controls to show/hide side bars (Left rail, Right detail bar) and localized clock */}
        <div className="flex items-center border border-graphite/40 bg-[#0c101a]/80 rounded-lg p-1 gap-3 px-3">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onToggleLeftPanel}
              className={`p-1 rounded transition-all duration-200 cursor-pointer ${
                hideLeftPanel 
                  ? 'text-signal-magenta bg-signal-magenta/10 border border-signal-magenta/20' 
                  : 'text-slate hover:text-bone hover:bg-carbon border border-transparent'
              }`}
              title="Ocultar/Mostrar panel izquierdo (Atajo: Ctrl+Tab)"
            >
              <PanelLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onToggleRightPanel}
              className={`p-1 rounded transition-all duration-200 cursor-pointer ${
                hideRightPanel 
                  ? 'text-signal-magenta bg-signal-magenta/10 border border-signal-magenta/20' 
                  : 'text-slate hover:text-bone hover:bg-carbon border border-transparent'
              }`}
              title="Ocultar/Mostrar panel derecho (Atajo: Tab)"
            >
              <PanelRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="w-[1px] h-3.5 bg-graphite/35" />

          {/* Clock: Day, Date, and Hour */}
          <div className="flex items-center text-[10px] font-mono text-bone tracking-wider">
            <span>{clockText}</span>
          </div>
        </div>

        {/* Consolidated hamburger icon button ONLY (no text) to open personalization draw */}
        <button 
          onClick={onOpenSettings}
          className="p-2 bg-[#131826]/70 hover:bg-[#1E2435] border border-graphite/60 hover:border-signal-cyan/50 text-[#C7CCD8] hover:text-signal-cyan rounded-lg cursor-pointer transition-all"
          title="Abrir Menú de Personalización"
        >
          <Menu className="w-4 h-4 text-signal-cyan" />
        </button>

        <button 
          onClick={() => setActiveTab('terminal')}
          className="p-2 hover:bg-[#131826]/70 hover:text-signal-cyan rounded-lg border border-transparent hover:border-graphite/40 transition-colors"
          title="Terminal de Comandos"
        >
          <TerminalIcon className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
