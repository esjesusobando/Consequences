import { useState } from "react";
import { 
  LayoutGrid, Mail, ListChecks, HardDrive, Settings, LogOut, 
  RefreshCw, Radio, Target, ChevronDown, UserPlus, 
  PlusCircle, EyeOff
} from "lucide-react";
import { GoogleUser, ConnectedAccount } from "../types";
import { translations } from "../lib/translations";
import Logo from "./Logo";

interface SidebarProps {
  currentView: 'dashboard' | 'mail' | 'tasks' | 'drive' | 'settings' | 'design_system' | 'focus';
  onViewChange: (view: 'dashboard' | 'mail' | 'tasks' | 'drive' | 'settings' | 'design_system' | 'focus') => void;
  user: GoogleUser | null;
  onSync: () => void;
  onLogout: () => void;
  isSyncing: boolean;
  accounts: ConnectedAccount[];
  onSwitchAccount: (email: string) => void;
  onAddAccount: () => void;
  sidebarState: 'expanded' | 'docked' | 'hidden';
  onSidebarStateChange: (state: 'expanded' | 'docked' | 'hidden') => void;
  language?: 'es' | 'en';
  themeMode?: 'craft' | 'cyber';
}

export default function Sidebar({
  currentView,
  onViewChange,
  user,
  onSync,
  onLogout,
  isSyncing,
  accounts = [],
  onSwitchAccount,
  onAddAccount,
  sidebarState = 'expanded',
  onSidebarStateChange,
  language = 'es',
  themeMode = 'craft'
}: SidebarProps) {
  const [showAccounts, setShowAccounts] = useState(false);

  const t = translations[language];

  const navItems = [
    { id: 'dashboard', label: t.sidebar.dashboard, icon: LayoutGrid },
    { id: 'focus', label: t.sidebar.focus, icon: Target },
    { id: 'mail', label: t.sidebar.mail, icon: Mail },
    { id: 'tasks', label: t.sidebar.tasks, icon: ListChecks },
    { id: 'drive', label: t.sidebar.drive, icon: HardDrive },
    { id: 'settings', label: t.sidebar.settings, icon: Settings },
  ] as const;

  // Cyberpunk mock accounts helper list for demo switches
  const mockCyberAccounts = [
    { email: "nexus-observer@consequences.local", name: "Nexus Observer", pic: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
    { email: "neural-echo@consequences.local", name: "Neural Echo", pic: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" }
  ];

  const handleAddMockAccount = () => {
    const randomProfile = mockCyberAccounts[Math.floor(Math.random() * mockCyberAccounts.length)];
    const uniqueEmail = `ops-${Math.floor(Math.random() * 1000)}_${randomProfile.email}`;
    const cleanName = `${randomProfile.name} #${Math.floor(Math.random() * 90 + 10)}`;
    
    // We can directly invoke local mock additions
    const cacheKey = "CONSEQUENCES_ACCOUNTS_METADATA";
    const oldCached = localStorage.getItem(cacheKey);
    let updated = [];
    try {
      updated = oldCached ? JSON.parse(oldCached) : [];
    } catch(e) {}

    const newAcc = {
      user: { email: uniqueEmail, name: cleanName, picture: randomProfile.pic },
      isDemo: true,
      accessToken: null
    };

    updated.push(newAcc);
    localStorage.setItem(cacheKey, JSON.stringify(updated));
    localStorage.setItem("CONSEQUENCES_ACTIVE_EMAIL", uniqueEmail);
    window.location.reload();
  };

  const isDocked = sidebarState === 'docked';
  const isHidden = sidebarState === 'hidden';
  const isLight = themeMode === 'craft';

  if (isHidden) return null;

  return (
    <nav className={`hidden md:flex flex-col h-screen pt-6 pb-6 flex-shrink-0 z-40 relative transition-all duration-300 ${
      isDocked ? 'w-18' : 'w-64'
    } ${
      isLight 
        ? 'bg-white border-r border-[#E5E7EB]' 
        : 'bg-night border-r border-[#1E2435]'
    }`}>
      {/* Absolutely-positioned Right Border Edge Panel Quick-Toggler */}
      <button
        onClick={() => {
          if (sidebarState === 'expanded') onSidebarStateChange('docked');
          else if (sidebarState === 'docked') onSidebarStateChange('hidden');
          else onSidebarStateChange('expanded');
        }}
        className={`absolute top-26 -right-3 z-50 h-6 w-6 rounded-full border flex items-center justify-center focus:outline-none transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer shadow-md ${
          isLight
            ? 'bg-gradient-to-r from-[#0052FF]/10 to-[#3B82F6]/10 hover:from-[#0052FF] hover:to-[#3B82F6] hover:text-white border-[#0052FF]/30 text-[#0052FF] shadow-[0_2px_8px_rgba(0,82,255,0.12)] bg-white'
            : 'bg-[#131826] border-neon-cyan/40 text-neon-cyan hover:border-neon-cyan hover:shadow-[0_0_8px_rgba(0,240,255,0.3)]'
        }`}
        title={language === 'es' ? 'Ajustar Vista de Panel' : 'Adjust Side Panel'}
      >
        {isDocked ? (
          <span className="text-[9px] font-extrabold select-none">»</span>
        ) : (
          <span className="text-[9px] font-extrabold select-none">«</span>
        )}
      </button>

      {/* Brand Logo & Operator Panel */}
      <div className={`px-4 mb-6 ${isDocked ? 'flex flex-col items-center' : 'px-6'}`}>
        <div className={`flex items-center ${isDocked ? 'justify-center mx-auto' : 'gap-3'} mb-6`}>
          {/* Brand Logo - The requested anterior logo details but with a beautiful built-in graphic C */}
          <Logo themeMode={themeMode} size={36} />
          
          {!isDocked && (
            <div>
              <div className={`font-display font-bold uppercase tracking-widest text-xs leading-none ${
                isLight ? 'text-zinc-900' : 'text-white'
              }`}>
                CONSEQUENCES
              </div>
              <div className={`text-[9px] font-mono mt-0.5 font-bold ${
                isLight ? 'text-zinc-400' : 'text-[#4A5273]'
              }`}>BRAND V2.0</div>
            </div>
          )}
        </div>
        
        {/* Operator Profile Frame */}
        <div className="relative">
          <button
            onClick={() => setShowAccounts(!showAccounts)}
            className={`border rounded-xl text-left relative overflow-hidden select-none group cursor-pointer transition-all ${
              isDocked 
                ? 'p-1.5 flex justify-center items-center h-10 w-10 mx-auto' 
                : 'w-full p-3'
            } ${
              isLight 
                ? 'border-zinc-200 bg-zinc-50 hover:bg-white hover:border-[#0052FF] hover:shadow-[0_4px_12px_rgba(0,82,255,0.08)] text-zinc-800' 
                : 'border-graphite bg-void/50 hover:bg-[#131826]/70 text-white'
            }`}
            title={isDocked && user ? `Operator: ${user.name} (${user.email})` : undefined}
          >
            {isDocked ? (
              user?.picture ? (
                <img 
                  src={user.picture} 
                  alt={user.name} 
                  className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-display font-bold text-[10px] select-none flex-shrink-0 ${
                  isLight ? 'bg-zinc-200 text-zinc-700' : 'bg-carbon text-neon-cyan border border-[#1E2435]'
                }`}>
                  {user?.name ? user.name[0].toUpperCase() : "G"}
                </div>
              )
            ) : (
              <>
                {!isLight && (
                  <>
                    <div className="absolute top-0 right-0 w-16 h-[1px] bg-gradient-to-r from-transparent to-neon-cyan opacity-40"></div>
                    <div className="absolute bottom-0 left-0 w-[1px] h-12 bg-gradient-to-t from-neon-cyan to-transparent opacity-40"></div>
                  </>
                )}
                
                <div className="flex items-center gap-2 mb-1.5 justify-between">
                  <span className={`font-mono text-[9px] tracking-wider uppercase font-bold ${
                    isLight ? 'text-zinc-400' : 'text-[#5c6480]'
                  }`}>{t.sidebar.operator}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isLight ? 'text-zinc-500' : 'text-[#7A839E]'
                  } ${showAccounts ? 'rotate-180 text-neon-cyan' : ''}`} />
                </div>

                <div className="flex items-center gap-2.5 min-w-0">
                  {user?.picture ? (
                    <img 
                      src={user.picture} 
                      alt={user.name} 
                      className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-display font-medium text-[10px] select-none flex-shrink-0 ${
                      isLight ? 'bg-zinc-200 text-zinc-700' : 'bg-carbon text-neon-cyan'
                    }`}>
                      {user?.name ? user.name[0].toUpperCase() : "G"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className={`font-mono text-xs truncate font-medium group-hover:text-neon-cyan transition-colors ${
                      isLight ? 'text-zinc-900 border-none' : 'text-white'
                    }`}>
                      {user ? user.name : t.sidebar.guest}
                    </div>
                    <div className={`font-mono text-[9px] truncate ${
                      isLight ? 'text-zinc-500' : 'text-slate'
                    }`}>
                      {user ? user.email : t.sidebar.connect_pending}
                    </div>
                  </div>
                </div>

                <div className={`font-mono text-[9px] mt-2 flex items-center gap-1.5 uppercase font-semibold ${
                  isLight ? 'text-zinc-500' : 'text-neon-cyan'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    user 
                      ? (isLight ? 'bg-emerald-500' : 'bg-neon-cyan animate-pulse') 
                      : (isLight ? 'bg-zinc-300' : 'bg-neon-magenta animate-pulse')
                  }`}></span>
                  {user ? (accounts.find(a => a.user.email === user.email)?.isDemo ? t.sidebar.sandbox : t.sidebar.live) : t.sidebar.connect_pending}
                </div>
              </>
            )}
          </button>

          {/* Accounts switch modal / panel */}
          {showAccounts && (
            <div className={`absolute border rounded-xl p-2.5 z-50 shadow-lg space-y-1 ${
              isDocked ? 'left-14 top-0 w-56' : 'left-0 right-0 mt-1'
            } ${
              isLight ? 'border-zinc-200 bg-white shadow-xl' : 'border-graphite bg-[#0c0f17]'
            }`}>
              <div className={`font-mono text-[8px] px-2 py-1 uppercase tracking-wider border-b mb-1.5 font-bold ${
                isLight ? 'border-zinc-100 text-zinc-400' : 'border-[#1E2435] text-[#4A5273]'
              }`}>
                Linked Operators ({accounts.length})
              </div>

              <div className="max-h-44 overflow-y-auto space-y-1 pr-0.5">
                {accounts.filter(a => a.user.email !== user?.email).map((acc) => (
                  <button
                    key={acc.user.email}
                    onClick={() => {
                      onSwitchAccount(acc.user.email);
                      setShowAccounts(false);
                    }}
                    className={`w-full text-left p-1.5 rounded-lg flex items-center gap-2 transition-all group cursor-pointer ${
                      isLight ? 'hover:bg-zinc-100/80 text-zinc-800' : 'bg-void/40 hover:bg-[#131826]'
                    }`}
                  >
                    {acc.user.picture ? (
                      <img 
                        src={acc.user.picture} 
                        alt={acc.user.name} 
                        className="w-5.5 h-5.5 rounded-full object-cover border border-transparent"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center font-display font-medium text-[8px] ${
                        isLight ? 'bg-zinc-200 text-zinc-700' : 'bg-carbon text-neon-cyan'
                      }`}>
                        {acc.user.name ? acc.user.name[0].toUpperCase() : "U"}
                      </div>
                    )}
                    <div className="min-w-0 flex-1 leading-none">
                      <div className={`font-mono text-[10px] truncate font-medium group-hover:text-neon-cyan leading-tight ${
                        isLight ? 'text-zinc-800' : 'text-white'
                      }`}>
                        {acc.user.name}
                      </div>
                      <div className="font-mono text-[8px] text-zinc-400 truncate mt-0.5">
                        {acc.user.email}
                      </div>
                    </div>
                  </button>
                ))}

                {accounts.filter(a => a.user.email !== user?.email).length === 0 && (
                  <div className="font-mono text-[9px] text-zinc-400 text-center py-2 italic">
                    No secondary profiles
                  </div>
                )}
              </div>

              {/* Action buttons inside switcher */}
              <div className={`border-t pt-1.5 mt-1 text-[9px] font-mono space-y-1 ${
                isLight ? 'border-zinc-100' : 'border-[#1E2435]'
              }`}>
                <button
                  onClick={() => {
                    onAddAccount();
                    setShowAccounts(false);
                  }}
                  className={`w-full text-left font-bold p-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                    isLight 
                      ? 'text-[#0052FF] hover:bg-[#0052FF]/5 hover:translate-x-1 shadow-xs font-sans' 
                      : 'text-neon-cyan hover:bg-neon-cyan/10'
                  }`}
                >
                  <UserPlus className="w-3 text-[#0052FF]" />
                  + LINK SECURE GOOGLE
                </button>

                <button
                  onClick={handleAddMockAccount}
                  className={`w-full text-left font-bold p-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                    isLight 
                      ? 'text-[#8FEF10] hover:bg-[#8FEF10]/10 hover:translate-x-1 shadow-xs font-sans' 
                      : 'text-neon-lime hover:bg-neon-lime/10'
                  }`}
                >
                  <PlusCircle className="w-3 text-[#8FEF10]" />
                  + LINK SANDBOX OPERATOR
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sync Trigger Action */}
        <button
          onClick={onSync}
          disabled={isSyncing}
          className={`mt-4 font-mono transition-all duration-300 active:scale-95 disabled:opacity-50 cursor-pointer rounded-xl flex items-center justify-center gap-2 ${
            isDocked ? 'h-10 w-10 mx-auto p-0' : 'w-full py-2.5 px-4 text-xs'
          } ${
            isLight 
              ? 'bg-gradient-to-r from-[#0052FF] via-[#3B82F6] to-[#8FEF10] text-white hover:opacity-95 hover:shadow-[0_4px_15px_rgba(0,130,255,0.25)] hover:scale-[1.02]' 
              : 'bg-[#1E2435] border border-[#1E2435] hover:border-neon-cyan hover:text-neon-cyan text-neon-cyan'
          }`}
          title={isDocked ? t.sidebar.sync : undefined}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          {!isDocked && (isSyncing ? t.sidebar.syncing : t.sidebar.sync)}
        </button>
      </div>

      {/* Navigation Option Items */}
      <div className="flex-grow overflow-y-auto space-y-1">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentView === item.id;
          return (
            <div key={item.id} className="px-2">
              <button
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center text-xs transition-all duration-300 cursor-pointer ${
                  isDocked 
                    ? "justify-center py-4 px-0 border-l-0 border-r-0 rounded-xl" 
                    : "gap-3 px-4 py-2.5 rounded-full text-left"
                } ${
                  isActive
                    ? isLight 
                      ? "bg-gradient-to-r from-[#0052FF] via-[#3B82F6] to-[#8FEF10] text-white font-bold shadow-[0_4px_12px_rgba(0,82,255,0.2)] scale-[1.01]"
                      : "bg-[#1E2435] text-[#00f0ff] border-l-4 border-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.15)] font-semibold"
                    : isLight
                      ? "text-zinc-600 hover:text-[#0052FF] hover:bg-[#0052FF]/5"
                      : "text-[#7A839E] hover:text-white hover:bg-[#131826]/60"
                }`}
                title={isDocked ? item.label : undefined}
              >
                <IconComponent className={`w-4 h-4 ${
                  isActive 
                    ? 'text-white' 
                    : isLight ? 'text-zinc-500' : 'text-[#7A839E]'
                }`} />
                {!isDocked && (
                  <span className={`text-[10px] tracking-wider uppercase ${isLight ? 'font-sans font-bold' : 'font-mono'}`}>
                    {item.label}
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Logout & Interface Settings Dock Toggler at the bottom */}
      <div className={`mt-auto pt-4 border-t ${
        isLight ? 'border-zinc-100' : 'border-[#1E2435]/40'
      }`}>
        <button
          onClick={() => onSidebarStateChange(isDocked ? 'expanded' : 'docked')}
          className={`hidden md:flex items-center transition-all duration-150 py-2.5 mb-1 cursor-pointer w-full ${
            isDocked ? 'justify-center px-0' : 'gap-3.5 px-6 text-left'
          } ${
            isLight ? 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50' : 'text-[#7A839E] hover:text-white hover:bg-[#131826]/40'
          }`}
          title={isDocked ? t.sidebar.desplegar : t.sidebar.acoplar}
        >
          <Radio className={`w-4 h-4 ${
            isLight ? 'text-zinc-500' : 'text-[#00f0ff] animate-pulse'
          }`} />
          {!isDocked && (
            <span className={`font-bold text-[10px] tracking-wider uppercase ${isLight ? 'font-sans' : 'font-mono'}`}>
              {isDocked ? t.sidebar.desplegar : t.sidebar.acoplar}
            </span>
          )}
        </button>

        <button
          onClick={() => onSidebarStateChange('hidden')}
          className={`hidden md:flex items-center transition-all duration-150 py-2.5 mb-1 cursor-pointer w-full ${
            isDocked ? 'justify-center px-0' : 'gap-3.5 px-6 text-left'
          } ${
            isLight ? 'text-zinc-500 hover:text-[#0052FF] hover:bg-[#0052FF]/5' : 'text-[#7A839E] hover:text-neon-cyan hover:bg-[#131826]/40'
          }`}
          title={language === 'es' ? "OCULTAR PANEL" : "HIDE PANEL"}
        >
          <EyeOff className={`w-4 h-4 ${isLight ? 'text-zinc-500 group-hover:text-[#0052FF]' : 'text-[#7D85A0]'}`} />
          {!isDocked && (
            <span className={`font-bold text-[10px] tracking-wider uppercase ${isLight ? 'font-sans' : 'font-mono'}`}>
              {language === 'es' ? "OCULTAR PANEL" : "HIDE PANEL"}
            </span>
          )}
        </button>

        <button
          onClick={onLogout}
          className={`w-full flex items-center transition-all duration-150 active:scale-95 cursor-pointer ${
            isDocked ? 'justify-center py-4 px-0' : 'gap-3.5 px-6 py-3.5 text-left'
          } ${
            isLight 
              ? 'text-zinc-500 hover:text-red-600 hover:bg-zinc-50' 
              : 'text-[#7A839E] hover:text-[#ffb4ab] hover:bg-[#1c2029]/40'
          }`}
          title={isDocked ? t.sidebar.disconnect : undefined}
        >
          <LogOut className="w-4.5 h-4.5" />
          {!isDocked && (
            <span className={isLight ? 'font-sans font-medium' : 'font-mono text-xs tracking-wider'}>
              {t.sidebar.disconnect}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
