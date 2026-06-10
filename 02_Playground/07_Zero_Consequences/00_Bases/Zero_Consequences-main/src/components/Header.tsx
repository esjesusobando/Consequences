import { useState } from "react";
import { Search, Radio, Menu, X, UserPlus, ChevronDown, Columns, Grid, EyeOff, Shield, Eye, Sparkles } from "lucide-react";
import { GoogleUser, ConnectedAccount, CalendarEvent } from "../types";
import { translations } from "../lib/translations";
import Logo from "./Logo";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentView: 'dashboard' | 'mail' | 'tasks' | 'drive' | 'settings' | 'design_system' | 'focus';
  user: GoogleUser | null;
  isLiveMode: boolean;
  onViewChange: (view: 'dashboard' | 'mail' | 'tasks' | 'drive' | 'settings' | 'design_system' | 'focus') => void;
  accounts: ConnectedAccount[];
  onSwitchAccount: (email: string) => void;
  onAddAccount: () => void;
  sidebarState: 'expanded' | 'docked' | 'hidden';
  onSidebarStateChange: (state: 'expanded' | 'docked' | 'hidden') => void;
  nextEvent: CalendarEvent | null;
  timeRemaining: string;
  language?: 'es' | 'en';
  onLanguageChange?: (lang: 'es' | 'en') => void;
  themeMode?: 'craft' | 'cyber';
  onThemeModeChange?: (theme: 'craft' | 'cyber') => void;
  isZenMode?: boolean;
  onToggleZenMode?: () => void;
}

export default function Header({
  searchQuery,
  onSearchChange,
  currentView,
  user,
  isLiveMode,
  onViewChange,
  accounts = [],
  onSwitchAccount,
  onAddAccount,
  sidebarState = 'expanded',
  onSidebarStateChange,
  nextEvent,
  timeRemaining,
  language = 'es',
  onLanguageChange,
  themeMode = 'craft',
  onThemeModeChange,
  isZenMode = false,
  onToggleZenMode
}: HeaderProps) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showControlMenu, setShowControlMenu] = useState(false);

  const t = translations[language];

  const navItems = [
    { id: 'dashboard', label: 'DASHBOARD' },
    { id: 'focus', label: 'FOCUS SPEED' },
    { id: 'mail', label: 'MAIL' },
    { id: 'tasks', label: 'TASKS' },
    { id: 'drive', label: 'DRIVE' },
    { id: 'settings', label: 'SETTINGS' },
  ] as const;

  const isLightTheme = themeMode === 'craft';

  return (
    <header className={`flex justify-between items-center px-4 md:px-6 w-full h-16 border-b flex-shrink-0 z-30 relative select-none transition-all duration-300 ${
      isLightTheme 
        ? 'border-zinc-200 bg-white text-zinc-800' 
        : 'border-[#1E2435] bg-[#0f131c]/90 text-white backdrop-blur-md'
    }`}>
      
      {/* Mobile Hamburger Burger Menu & Logo Link */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={() => setShowMobileNav(!showMobileNav)}
          className={`p-1.5 border rounded-xl transition-colors cursor-pointer ${
            isLightTheme 
              ? 'text-zinc-500 hover:text-zinc-900 border-zinc-200 bg-zinc-50' 
              : 'text-[#7A839E] hover:text-[#00f0ff] border-[#1E2435] bg-[#131826]/70'
          }`}
        >
          {showMobileNav ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
        </button>
        
        {/* Brand logo mini for mobile header and responsive touch */}
        <Logo themeMode={themeMode} size={26} />
        <span className={`font-display font-extrabold text-xs tracking-widest ${isLightTheme ? 'text-zinc-900' : 'text-white'}`}>
          CONSEQUENCES
        </span>
      </div>

      {/* Interactive Breadcrumbs (Desktop) */}
      <div className="hidden md:flex items-center gap-4 font-mono text-xs tracking-wider">
        {!isLightTheme ? (
          <>
            <span className="text-[#7A839E] hover:text-[#00f0ff] transition-colors cursor-default">SYSTEM_ACTIVE</span>
            <span className="text-[#1E2435]">/</span>
            <span className="text-[#a1a1aa] font-semibold">{t.sidebar[currentView]?.toUpperCase()}</span>
          </>
        ) : (
          <>
            <span className="text-zinc-400 cursor-default font-sans font-medium">Workspace</span>
            <span className="text-zinc-300">/</span>
            <span className="text-zinc-800 font-sans font-semibold text-sm tracking-tight">{t.sidebar[currentView]}</span>
          </>
        )}
      </div>

      {/* Global Countdown HUD Centerpiece */}
      {currentView !== 'dashboard' && (
        <div className={`flex items-center gap-1.5 md:gap-3 border md:px-4 py-1.5 px-2.5 rounded-full max-w-[160px] xs:max-w-xs md:max-w-sm flex-shrink-0 z-10 select-none ${
          isLightTheme ? 'bg-zinc-50 border-zinc-200' : 'bg-[#131826]/70 border-[#1E2435]'
        }`}>
          <div className="flex h-2 w-2 relative flex-shrink-0">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLightTheme ? 'bg-zinc-400' : 'bg-neon-magenta'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isLightTheme ? 'bg-zinc-500' : 'bg-neon-magenta'}`}></span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className={`font-mono text-[7px] md:text-[8px] tracking-widest uppercase font-bold leading-none mb-0.5 ${isLightTheme ? 'text-zinc-400' : 'text-[#7A839E]'}`}>
              {t.header.countdown}
            </span>
            <div className="flex items-center gap-1.5 md:gap-2 leading-none min-w-0">
              {nextEvent ? (
                <>
                  <span className={`font-mono text-[10px] md:text-xs font-bold tracking-wider whitespace-nowrap overflow-hidden text-ellipsis ${
                    isLightTheme ? 'text-zinc-800' : 'text-[#00f0ff]'
                  }`}>
                    {timeRemaining}
                  </span>
                  <span className={`hidden lg:inline text-[9px] truncate max-w-[120px] font-medium ${isLightTheme ? 'text-zinc-400' : 'text-slate'}`} title={nextEvent.summary}>
                    ({nextEvent.summary})
                  </span>
                </>
              ) : (
                <span className="font-mono text-[9px] md:text-[10px] text-zinc-400 tracking-wider uppercase font-medium">
                  {t.header.standby}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Auxiliary Utilities and Search Tunnels */}
      <div className="flex items-center gap-2 md:gap-4">
        
        {/* Search Index Filter Node */}
        <div className="relative w-36 sm:w-44 md:w-60 group">
          <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors ${
            isLightTheme ? 'text-zinc-400 group-focus-within:text-zinc-600' : 'text-[#7A839E] group-focus-within:text-[#00f0ff]'
          }`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full font-mono text-[10px] md:text-[11px] pl-8 pr-3 py-1.5 focus:ring-1 focus:outline-none transition-all duration-150 rounded-full ${
              isLightTheme 
                ? 'bg-zinc-100 focus:bg-white border border-zinc-200/85 focus:border-zinc-350 focus:ring-zinc-200 text-zinc-800' 
                : 'bg-[#131826] border border-[#1E2435] text-white focus:border-[#00f0ff] focus:ring-[#00f0ff]/20'
            }`}
            placeholder={t.header.search_placeholder}
          />
        </div>

        {/* Quick Side Panel Toggle (blue icon to show/hide/dock the panels) */}
        <button
          onClick={() => {
            if (sidebarState === 'expanded') onSidebarStateChange('docked');
            else if (sidebarState === 'docked') onSidebarStateChange('hidden');
            else onSidebarStateChange('expanded');
          }}
          className={`p-2 border rounded-xl transition-all duration-300 cursor-pointer focus:outline-none hover:scale-[1.05] hover:shadow-[0_4px_12px_rgba(0,82,255,0.12)] ${
            isLightTheme 
              ? sidebarState === 'hidden'
                ? 'bg-[#0052FF]/10 border-[#0052FF] text-[#0052FF] animate-bounce'
                : 'bg-gradient-to-r from-[#0052FF]/5 to-[#3B82F6]/5 border-[#0052FF]/20 text-[#0052FF] hover:border-[#0052FF]' 
              : sidebarState === 'hidden'
                ? 'bg-[#00f0ff]/25 border-[#00f0ff] text-[#00f0ff] animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.3)]'
                : 'bg-[#131826] border border-[#1E2435] text-white hover:border-[#00f0ff] hover:shadow-[0_0_10px_rgba(0,240,255,0.25)]'
          }`}
          title={
            language === 'es'
              ? `Ocultar/Mostrar Paneles de Iconos (Actual: ${
                  sidebarState === 'expanded'
                    ? 'Desplegado'
                    : sidebarState === 'docked'
                    ? 'Solo Iconos'
                    : 'Oculto'
                })`
              : `Show/Hide Icon Panels (Current: ${sidebarState})`
          }
        >
          <Columns className="w-4.5 h-4.5" />
        </button>

        {/* Subtle Zen Mode Toggle Button */}
        {onToggleZenMode && (
          <button
            onClick={onToggleZenMode}
            className={`p-2 border rounded-xl transition-all duration-300 cursor-pointer focus:outline-none hover:scale-[1.05] flex items-center justify-center gap-1.5 ${
              isZenMode
                ? isLightTheme
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                  : 'bg-neon-magenta/20 border-neon-magenta text-neon-magenta shadow-[0_0_12px_rgba(255,0,127,0.3)]'
                : isLightTheme
                  ? 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:bg-zinc-100'
                  : 'bg-[#131826] border border-[#1E2435] text-[#7A839E] hover:text-white hover:border-[#00f0ff]'
            }`}
            title={language === 'es' ? 'Modo Zen / Vista Limpia' : 'Zen View Mode'}
          >
            <Sparkles className={`w-4.5 h-4.5 ${isZenMode ? 'animate-pulse' : ''}`} />
            <span className="hidden lg:inline font-mono text-[9px] font-bold uppercase tracking-wider">
              {isZenMode ? (language === 'es' ? 'ZEN: ACTIVO' : 'ZEN_ON') : (language === 'es' ? 'MODO ZEN' : 'ZEN_OFF')}
            </span>
          </button>
        )}

        {/* Consolidated System Hamburger Settings Menu */}
        <div className="relative">
          <button
            onClick={() => setShowControlMenu(!showControlMenu)}
            className={`flex items-center gap-2 px-3 py-1.5 border rounded-xl transition-all duration-300 cursor-pointer focus:outline-none font-sans text-xs font-bold hover:scale-[1.03] hover:shadow-[0_4px_12px_rgba(0,82,255,0.12)] ${
              isLightTheme 
                ? 'bg-gradient-to-r from-[#0052FF]/5 to-[#8FEF10]/5 border-[#0052FF]/20 text-[#0052FF] hover:border-[#0052FF] hover:from-[#0052FF]/10 hover:to-[#8FEF10]/10' 
                : 'bg-[#131826] border border-[#1E2435] text-white hover:border-[#00f0ff] hover:shadow-[0_0_10px_rgba(0,240,255,0.25)]'
            }`}
            title="Panel de Configuración de Interfaz"
          >
            <Menu className={`w-4 h-4 ${isLightTheme ? 'text-[#0052FF]' : 'text-[#00f0ff]'}`} />
            <span className="hidden leading-none xs:inline font-sans select-none tracking-tight">
              {language === 'es' ? 'Ajustes' : 'Settings'}
            </span>
            <ChevronDown className="w-3 h-3 text-[#7A839E]" />
          </button>

          {/* Settings Hamburger Popover */}
          {showControlMenu && (
            <div className={`absolute right-0 mt-2 w-64 border rounded-2xl p-4 shadow-xl z-50 transition-all duration-200 select-none ${
              isLightTheme
                ? 'bg-white border-zinc-200 text-zinc-800 shadow-xl'
                : 'bg-[#0f131c] border-[#1E2435] text-white'
            }`}>
              {/* Header inside popover */}
              <div className="pb-3 border-b border-zinc-200/20 mb-3 flex items-center justify-between">
                <span className="font-sans font-bold text-xs uppercase tracking-wider text-[#7A839E]">
                  {language === 'es' ? 'CONSOLA DE CONTROL' : 'CONTROL CONSOLE'}
                </span>
                <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${
                  isLightTheme ? 'bg-zinc-100 text-zinc-500' : 'bg-void text-neon-cyan border border-[#1E2435]'
                }`}>
                  v2.0
                </span>
              </div>

              <div className="space-y-4">
                {/* 1. SECCIÓN: GESTIÓN DE PANELES */}
                <div>
                  <label className="text-[10px] font-mono text-[#7A839E] uppercase tracking-wider block font-bold mb-1.5 text-left">
                    {language === 'es' ? 'Gestión de Paneles' : 'Sidebar Layout'}
                  </label>
                  <div className={`grid grid-cols-3 gap-1 p-1 rounded-xl ${
                    isLightTheme ? 'bg-zinc-105' : 'bg-[#131826]'
                  }`}>
                    <button
                      onClick={() => onSidebarStateChange('expanded')}
                      className={`py-1.5 px-2 text-[9px] font-sans font-bold rounded-lg transition-all flex flex-col items-center gap-1 cursor-pointer ${
                        sidebarState === 'expanded'
                          ? isLightTheme
                            ? 'bg-gradient-to-r from-[#0052FF] to-[#8FEF10] text-white shadow-sm'
                            : 'bg-neon-cyan/20 border border-[#00f0ff]/30 text-neon-cyan shadow-[0_0_8px_rgba(0,240,255,0.2)]'
                          : isLightTheme
                            ? 'text-zinc-600 hover:text-[#0052FF] hover:bg-zinc-50/80'
                            : 'text-[#7A839E] hover:text-white hover:bg-[#1c2029]/40'
                      }`}
                      title={language === 'es' ? 'Desplegado' : 'Expanded'}
                    >
                      <Columns className="w-3.5 h-3.5" />
                      <span className="scale-90 font-sans tracking-tight block">
                        {language === 'es' ? 'Completo' : 'Expanded'}
                      </span>
                    </button>

                    <button
                      onClick={() => onSidebarStateChange('docked')}
                      className={`py-1.5 px-2 text-[9px] font-sans font-bold rounded-lg transition-all flex flex-col items-center gap-1 cursor-pointer ${
                        sidebarState === 'docked'
                          ? isLightTheme
                            ? 'bg-gradient-to-r from-[#0052FF] to-[#8FEF10] text-white shadow-sm'
                            : 'bg-neon-cyan/20 border border-[#00f0ff]/30 text-neon-cyan shadow-[0_0_8px_rgba(0,240,255,0.2)]'
                          : isLightTheme
                            ? 'text-zinc-600 hover:text-[#0052FF] hover:bg-zinc-50/80'
                            : 'text-[#7A839E] hover:text-white hover:bg-[#1c2029]/40'
                      }`}
                      title={language === 'es' ? 'Iconos' : 'Docked'}
                    >
                      <Grid className="w-3.5 h-3.5" />
                      <span className="scale-90 font-sans tracking-tight block">
                        {language === 'es' ? 'Iconos' : 'Docked'}
                      </span>
                    </button>

                    <button
                      onClick={() => onSidebarStateChange('hidden')}
                      className={`py-1.5 px-2 text-[9px] font-sans font-bold rounded-lg transition-all flex flex-col items-center gap-1 cursor-pointer ${
                        sidebarState === 'hidden'
                          ? 'bg-red-500 text-white shadow-sm'
                          : isLightTheme
                            ? 'text-zinc-600 hover:text-red-500 hover:bg-zinc-50/80'
                            : 'text-[#7A839E] hover:text-white hover:bg-[#1c2029]/40'
                      }`}
                      title={language === 'es' ? 'Ocultar' : 'Hidden'}
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      <span className="scale-90 font-sans tracking-tight block">
                        {language === 'es' ? 'Ocultar' : 'Hidden'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* 2. SECCIÓN: IDIOMA */}
                <div>
                  <label className="text-[10px] font-mono text-[#7A839E] uppercase tracking-wider block font-bold mb-1.5 text-left">
                    {language === 'es' ? 'Idioma del Sistema' : 'System Language'}
                  </label>
                  <div className={`grid grid-cols-2 gap-1 p-1 rounded-xl ${
                    isLightTheme ? 'bg-zinc-100' : 'bg-[#131826]'
                  }`}>
                    <button
                      onClick={() => onLanguageChange?.('es')}
                      className={`py-1.5 text-[10px] font-sans font-bold rounded-lg transition-all cursor-pointer ${
                        language === 'es'
                          ? isLightTheme
                            ? 'bg-gradient-to-r from-[#0052FF] to-[#8FEF10] text-white shadow-sm'
                            : 'bg-neon-cyan/20 border border-[#00f0ff]/30 text-neon-cyan'
                          : isLightTheme
                            ? 'text-zinc-600 hover:text-[#0052FF] hover:bg-zinc-50/80'
                            : 'text-[#7A839E] hover:text-white hover:bg-[#1c2029]/40'
                      }`}
                    >
                      Español
                    </button>
                    <button
                      onClick={() => onLanguageChange?.('en')}
                      className={`py-1.5 text-[10px] font-sans font-bold rounded-lg transition-all cursor-pointer ${
                        language === 'en'
                          ? isLightTheme
                            ? 'bg-gradient-to-r from-[#0052FF] to-[#8FEF10] text-white shadow-sm'
                            : 'bg-neon-cyan/20 border border-[#00f0ff]/30 text-neon-cyan'
                          : isLightTheme
                            ? 'text-zinc-600 hover:text-[#0052FF] hover:bg-zinc-50/80'
                            : 'text-[#7A839E] hover:text-white hover:bg-[#1c2029]/40'
                      }`}
                    >
                      English
                    </button>
                  </div>
                </div>

                {/* 3. SECCIÓN: TEMA / DARK & LIGHT */}
                <div>
                  <label className="text-[10px] font-mono text-[#7A839E] uppercase tracking-wider block font-bold mb-1.5 text-left">
                    {language === 'es' ? 'Tema de Interfaz' : 'App Theme Mode'}
                  </label>
                  <div className={`grid grid-cols-2 gap-1 p-1 rounded-xl ${
                    isLightTheme ? 'bg-zinc-100' : 'bg-[#131826]'
                  }`}>
                    <button
                      onClick={() => onThemeModeChange?.('craft')}
                      className={`py-1.5 text-[9px] font-sans font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        isLightTheme
                          ? 'bg-gradient-to-r from-[#0052FF] to-[#8FEF10] text-white shadow-gradient-sm shadow-sm'
                          : 'text-[#7A839E] hover:text-white hover:bg-[#1c2029]/40'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isLightTheme ? 'bg-white' : 'bg-blue-600'}`}></span>
                      <span>Light (Craft)</span>
                    </button>
                    <button
                      onClick={() => onThemeModeChange?.('cyber')}
                      className={`py-1.5 text-[9px] font-sans font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        !isLightTheme
                          ? 'bg-neon-cyan/20 border border-[#00f0ff]/30 text-neon-cyan shadow-[0_0_8px_rgba(0,240,255,0.25)]'
                          : 'text-zinc-600 hover:text-[#0052FF] hover:bg-zinc-50/80'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                      <span>Dark (Cyber)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer status block */}
              <div className="pt-2 border-t border-zinc-200/20 mt-3 flex items-center justify-between text-[8px] font-mono text-[#7A839E]">
                <span>{language === 'es' ? 'ESTADO: OPERACIONAL' : 'SYSTEM: ONLINE'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Mobile collapsing navigation drawer overlay */}
      {showMobileNav && (
        <div className={`absolute top-16 left-0 right-0 border-b p-4 flex flex-col gap-2 shadow-lg z-40 select-none ${
          isLightTheme ? 'bg-white border-zinc-200' : 'bg-[#0f131c] border-[#1E2435]'
        }`}>
          <div className="font-mono text-[9px] text-[#7A839E] uppercase tracking-widest border-b border-zinc-200/50 pb-1.5 mb-1.5">
            NAVIGATION PORTS
          </div>
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  setShowMobileNav(false);
                }}
                className={`py-2 px-3 border rounded-xl font-mono text-[10px] tracking-wider text-left transition-all ${
                  currentView === item.id 
                    ? isLightTheme 
                      ? "bg-gradient-to-r from-[#0052FF] to-[#8FEF10] text-white font-sans font-bold border-transparent shadow-[0_2px_8px_rgba(0,82,255,0.15)]"
                      : "bg-[#1E2435]/90 border-neon-cyan text-neon-cyan font-bold" 
                    : isLightTheme
                      ? "border-zinc-200 text-zinc-700 bg-zinc-50 hover:text-[#0052FF] hover:border-[#0052FF]/30 hover:bg-[#0052FF]/5"
                      : "border-graphite text-[#7A839E] bg-carbon hover:text-white hover:border-slate"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Quick inline switcher list on mobile */}
          <div className="border-t border-zinc-200/50 mt-3 pt-3">
            <div className="font-mono text-[9px] text-[#7A839E] mb-2 uppercase block tracking-widest font-bold">
              Operator Console ({accounts.length})
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-0.5">
              {accounts.map(acc => (
                <button
                  key={acc.user.email}
                  onClick={() => {
                    onSwitchAccount(acc.user.email);
                    setShowMobileNav(false);
                  }}
                  className={`w-full text-left p-1.5 border hover:border-zinc-300 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                    acc.user.email === user?.email 
                      ? isLightTheme ? "bg-zinc-50 border-zinc-950 font-bold" : "bg-[#1E2435]/30 border-neon-cyan/40" 
                      : isLightTheme ? "bg-white border-zinc-200" : "bg-void/40 border-graphite"
                  }`}
                >
                  {acc.user.picture ? (
                    <img
                      src={acc.user.picture}
                      alt={acc.user.name}
                      className="w-5.5 h-5.5 rounded-full object-cover border border-[#E5E7EB]"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center font-display font-medium text-[8px] ${
                      isLightTheme ? 'bg-zinc-200 text-zinc-700' : 'bg-carbon text-neon-cyan'
                    }`}>
                      {acc.user.name ? acc.user.name[0].toUpperCase() : "U"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className={`font-mono text-[9px] truncate font-medium ${isLightTheme ? 'text-zinc-900 border-none' : 'text-white'}`}>{acc.user.name}</div>
                    <div className="font-mono text-[8px] text-[#7A839E] truncate">{acc.user.email}</div>
                  </div>
                  {acc.user.email === user?.email && (
                    <span className={`w-1.5 h-1.5 rounded-full ${isLightTheme ? 'bg-zinc-950' : 'bg-neon-cyan'}`}></span>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                onAddAccount();
                setShowMobileNav(false);
              }}
              className={`w-full mt-3 border border-dashed text-center py-2 text-[9px] font-mono font-bold rounded-xl cursor-pointer transition-colors ${
                isLightTheme 
                  ? 'border-zinc-400 text-zinc-800 hover:bg-zinc-100' 
                  : 'border-neon-cyan/40 hover:border-neon-cyan text-neon-cyan hover:text-white'
              }`}
            >
              + ADD NEW GOOGLE ACCESS
            </button>
          </div>
        </div>
      )}

    </header>
  );
}
