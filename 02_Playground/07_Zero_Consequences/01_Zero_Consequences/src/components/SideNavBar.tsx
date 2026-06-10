import React from 'react';
import { 
  LayoutGrid, 
  Code, 
  Sliders, 
  LogOut, 
  Monitor, 
  FolderKanban, 
  Boxes, 
  TrendingUp, 
  CalendarDays 
} from 'lucide-react';
import { AccentColor } from '../types';

interface SideNavBarProps {
  activeTab: 'dashboard' | 'personal_os' | 'linear' | 'operations' | 'analytics' | 'specs' | 'terminal';
  setActiveTab: (tab: 'dashboard' | 'personal_os' | 'linear' | 'operations' | 'analytics' | 'specs' | 'terminal') => void;
  accent: AccentColor;
  onSystemReset: () => void;
  hideLeftPanel: boolean;
}

export default function SideNavBar({
  activeTab,
  setActiveTab,
  accent,
  onSystemReset,
  hideLeftPanel,
}: SideNavBarProps) {
  
  const getAccentBgClass = () => {
    switch (accent) {
      case 'magenta': return 'text-signal-magenta bg-signal-magenta/10';
      case 'lime': return 'text-signal-lime bg-signal-lime/10';
      case 'amber': return 'text-signal-amber bg-signal-amber/10';
      default: return 'text-signal-cyan bg-signal-cyan/10';
    }
  };

  const menuItems = [
    { id: 'dashboard' as const, label: 'Sesión Reunión', icon: CalendarDays, desc: 'Próxima Reunión & Conteo' },
    { id: 'personal_os' as const, label: 'Personal OS', icon: Monitor, desc: 'Espacio Personal (Supernative, OCR, Codex)' },
    { id: 'linear' as const, label: 'Linear Team', icon: FolderKanban, desc: 'Varios Proyectos & Criterios SOTA' },
    { id: 'operations' as const, label: 'Operaciones', icon: Boxes, desc: 'SKU, Variantes, Bodegas, Compras' },
    { id: 'analytics' as const, label: 'Analíticas', icon: TrendingUp, desc: 'Balance Valuación, QR, Reportes CSV/PDF' },
    { id: 'specs' as const, label: 'Design Guide', icon: Code, desc: 'Guía de Estilo & Color Specs' },
    { id: 'terminal' as const, label: 'CLI Terminal', icon: Sliders, desc: 'Comandos del Sistema' },
  ];

  return (
    <nav className={`bg-void border-r border-graphite/45 h-screen w-14 left-0 fixed top-0 flex flex-col pt-14 z-40 items-center justify-between pb-6 select-none transition-transform duration-300 ${hideLeftPanel ? '-translate-x-full font-sans' : 'translate-x-0'}`}>
      <div className="flex flex-col gap-3.5 mt-6 w-full px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex justify-center py-2.5 rounded-lg cursor-pointer transition-all duration-200 group relative ${
                active
                  ? getAccentBgClass()
                  : 'text-ash hover:text-bone hover:bg-carbon/30'
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
              <span className="absolute left-16 bg-[#131826]/95 border border-graphite/80 px-2.5 py-1 rounded text-[10px] text-bone uppercase tracking-widest opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150 z-50 whitespace-nowrap shadow-xl">
                {item.desc}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 w-full px-2 mb-4">
        <button
          onClick={onSystemReset}
          className="text-ash hover:text-signal-magenta hover:bg-signal-magenta/10 rounded-lg flex justify-center py-2.5 cursor-pointer transition-all relative group"
          title="Resetear Memoria OS"
        >
          <LogOut className="w-5 h-5 rotate-180" />
          <span className="absolute left-16 bg-carbon border border-graphite px-2.5 py-1 rounded text-[10px] text-signal-magenta bg-signal-magenta/5 uppercase tracking-widest opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150 z-50 whitespace-nowrap">
            Reiniciar Almacenamiento
          </span>
        </button>
      </div>
    </nav>
  );
}
