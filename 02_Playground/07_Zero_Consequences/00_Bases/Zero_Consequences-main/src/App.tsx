import { useState, useEffect } from "react";
import { GoogleUser, CalendarEvent, DriveFile, GmailMessage, GoogleTask, ConnectedAccount } from "./types";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardView from "./components/DashboardView";
import DriveView from "./components/DriveView";
import MailView from "./components/MailView";
import TasksView from "./components/TasksView";
import SettingsView from "./components/SettingsView";
import DesignSystemView from "./components/DesignSystemView";
import FocusView from "./components/FocusView";
import { Laptop, AlertCircle, RefreshCw, Key, ShieldCheck, HelpCircle } from "lucide-react";
import consequencesLogo from "./assets/images/consequences_logo_1780786995541.png";
import { translations } from "./lib/translations";
import Logo from "./components/Logo";

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'mail' | 'tasks' | 'drive' | 'settings' | 'design_system' | 'focus'>('dashboard');
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [systemNotification, setSystemNotification] = useState<{ title: string; message: string; type?: 'info' | 'error' | 'success' } | null>(null);

  const [sidebarState, setSidebarState] = useState<'expanded' | 'docked' | 'hidden'>(() => {
    return (localStorage.getItem("CONSEQUENCES_SIDEBAR_STATE") as "expanded" | "docked" | "hidden") || 'expanded';
  });

  const handleSidebarStateChange = (state: 'expanded' | 'docked' | 'hidden') => {
    setSidebarState(state);
    localStorage.setItem("CONSEQUENCES_SIDEBAR_STATE", state);
  };

  const [language, setLanguage] = useState<'es' | 'en'>(() => {
    return (localStorage.getItem("CONSEQUENCES_LANG") as 'es' | 'en') || 'es';
  });

  const handleLanguageChange = (lang: 'es' | 'en') => {
    setLanguage(lang);
    localStorage.setItem("CONSEQUENCES_LANG", lang);
  };

  const [themeMode, setThemeMode] = useState<'craft' | 'cyber'>(() => {
    return (localStorage.getItem("CONSEQUENCES_FOCUS_THEME") as 'craft' | 'cyber') || 'craft';
  });

  const [isZenMode, setIsZenMode] = useState<boolean>(() => {
    return localStorage.getItem("CONSEQUENCES_ZEN_MODE") === "true";
  });

  const handleToggleZenMode = () => {
    const nextVal = !isZenMode;
    setIsZenMode(nextVal);
    localStorage.setItem("CONSEQUENCES_ZEN_MODE", String(nextVal));
  };

  const handleUpdateCalendarEvent = async (
    id: string,
    updatedData: {
      summary?: string;
      description?: string;
      location?: string;
      note?: string;
      startDateTime?: string;
      endDateTime?: string;
    }
  ) => {
    try {
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }
      const response = await fetch("/api/calendar/update", {
        method: "POST",
        headers,
        body: JSON.stringify({ id, ...updatedData })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.item) {
          // Sync immediately in local state
          setCalendarEvents(prev =>
            prev.map(evt => evt.id === id ? { ...evt, ...data.item } : evt)
          );
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error("Calendar update fetch fail:", err);
      return false;
    }
  };

  useEffect(() => {
    const handleStorage = () => {
      const mode = (localStorage.getItem("CONSEQUENCES_FOCUS_THEME") as 'craft' | 'cyber') || 'craft';
      setThemeMode(mode);
    };
    window.addEventListener('storage', handleStorage);
    const intervalId = setInterval(handleStorage, 800);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(intervalId);
    };
  }, []);

  const [accounts, setAccounts] = useState<ConnectedAccount[]>(() => {
    const cached = localStorage.getItem("CONSEQUENCES_ACCOUNTS_METADATA");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const [activeEmail, setActiveEmail] = useState<string | null>(() => {
    return localStorage.getItem("CONSEQUENCES_ACTIVE_EMAIL") || null;
  });

  // Sync core states whenever activeAccount target resolves
  useEffect(() => {
    if (activeEmail && accounts.length > 0) {
      const active = accounts.find(acc => acc.user.email === activeEmail);
      if (active) {
        setUser(active.user);
        setAccessToken(active.accessToken);
        setIsDemoMode(active.isDemo);
      }
    } else {
      setUser(null);
      setAccessToken(null);
      setIsDemoMode(false);
    }
  }, [activeEmail, accounts]);

  // Persist secure meta (including memory tokens for session hot-reloads)
  useEffect(() => {
    const secureMeta = accounts.map(acc => ({
      user: acc.user,
      isDemo: acc.isDemo,
      accessToken: acc.accessToken
    }));
    localStorage.setItem("CONSEQUENCES_ACCOUNTS_METADATA", JSON.stringify(secureMeta));
  }, [accounts]);

  useEffect(() => {
    if (activeEmail) {
      localStorage.setItem("CONSEQUENCES_ACTIVE_EMAIL", activeEmail);
    } else {
      localStorage.removeItem("CONSEQUENCES_ACTIVE_EMAIL");
    }
  }, [activeEmail]);

  // Data State Arrays
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [gmailMessages, setGmailMessages] = useState<GmailMessage[]>([]);
  const [tasks, setTasks] = useState<GoogleTask[]>([]);

  // Global Countdown States for Next Calendar Meeting
  const [globalNextEvent, setGlobalNextEvent] = useState<CalendarEvent | null>(null);
  const [globalTimeRemaining, setGlobalTimeRemaining] = useState<string>("00H : 00M : 00S");

  // Track next event
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

      setGlobalNextEvent(upcoming[0] || null);
    };

    findNextEvent();
    const intervalIds = setInterval(findNextEvent, 5000);
    return () => clearInterval(intervalIds);
  }, [calendarEvents]);

  // Global live countdown trigger
  useEffect(() => {
    if (!globalNextEvent) {
      setGlobalTimeRemaining("STANDBY // NO_ACTIVE_SYNC");
      return;
    }

    const startStr = globalNextEvent.start?.dateTime || globalNextEvent.start?.date;
    if (!startStr) return;

    const eventTime = new Date(startStr).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = eventTime - now;

      if (diff <= 0) {
        setGlobalTimeRemaining("CORE_SYNC_IN_PROGRESS");
        return;
      }

      const totalSecs = Math.floor(diff / 1000);
      const hours = Math.floor(totalSecs / 3600);
      const minutes = Math.floor((totalSecs % 3600) / 60);
      const seconds = totalSecs % 60;

      const pad = (n: number) => n.toString().padStart(2, "0");
      setGlobalTimeRemaining(`${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`);
    };

    updateTimer();
    const timerId = setInterval(updateTimer, 1000);
    return () => clearInterval(timerId);
  }, [globalNextEvent]);

  // Fetch all endpoints from server based on auth status
  const syncWorkspaceData = async (token: string | null) => {
    setIsSyncing(true);
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      // 1. Fetch Calendar Events
      const calRes = await fetch("/api/calendar", { headers });
      if (calRes.ok) {
        const calData = await calRes.json();
        setCalendarEvents(calData.items || []);
      }

      // 2. Fetch Drive Files
      const driveRes = await fetch("/api/drive", { headers });
      if (driveRes.ok) {
        const driveData = await driveRes.json();
        setDriveFiles(driveData.files || []);
      }

      // 3. Fetch Gmail Message threads
      const mailRes = await fetch("/api/gmail", { headers });
      if (mailRes.ok) {
        const mailData = await mailRes.json();
        setGmailMessages(mailData.messages || []);
      }

      // 4. Fetch Tasks
      const tasksRes = await fetch("/api/tasks", { headers });
      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData.items || []);
      }
    } catch (err) {
      console.error("System syncing exception:", err);
    } finally {
      // Small artificial timer to make synchronization animations beautiful
      setTimeout(() => {
        setIsSyncing(false);
      }, 700);
    }
  };

  // Sync data automatically when user or token updates
  useEffect(() => {
    if (user || isDemoMode) {
      syncWorkspaceData(accessToken);
    }
  }, [user, accessToken, isDemoMode]);

  // OAuth Listener popup communication trigger
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      // Check message matches success schema
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data?.payload) {
        const { accessToken: token, user: profile } = event.data.payload;
        if (token && profile) {
          setAccounts(prev => {
            const existsIdx = prev.findIndex(acc => acc.user.email === profile.email);
            const newAcc: ConnectedAccount = { user: profile, accessToken: token, isDemo: false };
            if (existsIdx >= 0) {
              const updated = [...prev];
              updated[existsIdx] = newAcc;
              return updated;
            } else {
              return [...prev, newAcc];
            }
          });
          setActiveEmail(profile.email);
        }
      }
    };

    window.addEventListener("message", handleOAuthMessage);
    return () => window.removeEventListener("message", handleOAuthMessage);
  }, []);

  const handleSignInGoogle = async () => {
    try {
      const res = await fetch("/api/auth/url");
      const data = await res.json();

      if (data.useSandbox) {
        setSystemNotification({
          title: "GOOGLE CREDENTIALS DETECTED: [SANDBOX_EMULATION]",
          message: "Your custom google developer keys (CLIENT_ID / CLIENT_SECRET) are not declared in Settings. Consequences has loaded Sandbox Emulator environment! Consequences will link 'sandbox-operator@consequences.local' as your active profile.\n\nGo to the 'SETTINGS' panel to view manual integration variables.",
          type: 'info'
        });
        handleLinkDemoAccount(
          "sandbox-operator@consequences.local",
          "Sandbox Operator",
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        );
        return;
      }

      if (data.url) {
        // Open standard popup to Google
        const popup = window.open(
          data.url,
          "google_oauth_popup",
          "width=580,height=720,status=no,resizable=yes"
        );
        if (!popup) {
          setSystemNotification({
            title: "Popup Blocked",
            message: "Popup block detected. Please allow popups or open the app in a new tab to authenticate with Google.",
            type: 'error'
          });
        }
      }
    } catch (err) {
      console.error("Redirection request failed:", err);
      setSystemNotification({
        title: "Connection Failure",
        message: "Failed to establish a network handshake with the verification server.",
        type: 'error'
      });
    }
  };

  const handleLinkDemoAccount = (email: string, name: string, picture?: string) => {
    const demoUser: GoogleUser = {
      email,
      name,
      picture: picture || "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    };
    const newAcc: ConnectedAccount = { user: demoUser, accessToken: null, isDemo: true };
    setAccounts(prev => {
      const exists = prev.some(acc => acc.user.email === demoUser.email);
      if (exists) return prev;
      return [...prev, newAcc];
    });
    setActiveEmail(demoUser.email);
  };

  const handleLogout = () => {
    const currentActiveEmail = activeEmail;
    const remaining = accounts.filter(acc => acc.user.email !== currentActiveEmail);
    setAccounts(remaining);
    
    setCalendarEvents([]);
    setDriveFiles([]);
    setGmailMessages([]);
    setTasks([]);

    if (remaining.length > 0) {
      setActiveEmail(remaining[0].user.email);
    } else {
      setActiveEmail(null);
      setUser(null);
      setAccessToken(null);
      setIsDemoMode(false);
    }
  };

  // Drive interactions triggers
  const handleAddNewFile = async (newFile: { name: string; mimeType: string; size: string }) => {
    try {
      const res = await fetch("/api/drive", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify(newFile)
      });
      if (res.ok) {
        // Sync to pull terbaru lists
        syncWorkspaceData(accessToken);
      }
    } catch (err) {
      console.error("Create operation error", err);
    }
  };

  // Task interactions triggers
  const handleAddTask = async (title: string) => {
    try {
      const res = await fetch("/api/tasks/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify({ title, status: "needsAction" })
      });
      if (res.ok) {
        syncWorkspaceData(accessToken);
      }
    } catch (err) {
      console.error("Create task operation error", err);
    }
  };

  const handleToggleTask = async (id: string, currentStatus: 'needsAction' | 'completed') => {
    const newStatus = currentStatus === 'needsAction' ? 'completed' : 'needsAction';
    try {
      const res = await fetch("/api/tasks/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        syncWorkspaceData(accessToken);
      }
    } catch (err) {
      console.error("Toggle task operation error", err);
    }
  };

  // Gmail Mark Read triggers
  const handleMarkEmailRead = async (id: string) => {
    try {
      // Trigger locally or proxied
      await fetch("/api/gmail/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      setGmailMessages(prev => prev.map(m => m.id === id ? { ...m, unread: false } : m));
    } catch (err) {
      console.error("Mark read operation error", err);
    }
  };

  // RENDER SELECTION GATES
  if (!user && !isDemoMode) {
    const lt = translations[language].login;
    return (
      <div className="min-h-screen bg-void flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
        
        {/* Language selector for guest flow */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button
            onClick={() => handleLanguageChange('es')}
            className={`font-mono text-[9px] font-bold px-2 py-1 border rounded-xs transition-colors cursor-pointer ${
              language === 'es' ? 'border-[#00f0ff] text-[#00f0ff] bg-[#00f0ff]/10' : 'border-[#1E2435] text-white hover:text-[#00f0ff]'
            }`}
          >
            ES
          </button>
          <button
            onClick={() => handleLanguageChange('en')}
            className={`font-mono text-[9px] font-bold px-2 py-1 border rounded-xs transition-colors cursor-pointer ${
              language === 'en' ? 'border-[#00f0ff] text-[#00f0ff] bg-[#00f0ff]/10' : 'border-[#1E2435] text-white hover:text-[#00f0ff]'
            }`}
          >
            EN
          </button>
        </div>

        {/* Cyber Grid Decorative Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(var(--color-graphite)_1px,transparent_1px),linear-gradient(90deg,var(--color-graphite)_1px,transparent_1px)] bg-[size:40px_40px] opacity-25 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-neon-cyan/5 to-neon-magenta/5 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Live System Badge */}
        <div className="mb-6 z-10 inline-flex items-center gap-2 px-3 py-1 border border-neon-magenta rounded-xs font-mono text-[10px] text-neon-magenta uppercase tracking-wider cyber-glow-magenta bg-neon-magenta/5">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-magenta animate-pulse"></span>
          SYSTEM ACTIVE // DS V1.0
        </div>

        {/* Console Box Outer Frame */}
        <div className="w-full max-w-md border border-graphite bg-night p-8 shadow-[0_0_40px_rgba(0,240,255,0.06)] text-center relative rounded-sm z-10 selection:bg-neon-cyan selection:text-black">
          
          {/* Tech design tag indicators */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 px-3 py-1 bg-neon-cyan/10 border-b border-l border-r border-[#1E2435] text-neon-cyan font-mono text-[8px] uppercase tracking-widest font-semibold rounded-b-xs">
            {lt.terminal}
          </div>

          <div className="my-6 flex flex-col items-center select-none">
            <Logo themeMode="cyber" size={80} className="mb-4" />
            <h1 className="font-display text-2xl font-extrabold tracking-widest text-white italic leading-none">
              CONSEQUENCES
            </h1>
            <p className="font-mono text-[10px] text-ash uppercase tracking-wider mt-2">
              {lt.subtitle}
            </p>
          </div>

          <p className="text-xs text-ash leading-relaxed mb-8 px-2">
            {lt.desc}
          </p>

          <div className="space-y-4">
            
            {/* styled Google authentication button matching mock guidelines */}
            <button
              onClick={handleSignInGoogle}
              className="w-full bg-carbon border border-graphite hover:border-neon-cyan text-white font-mono text-xs font-semibold py-3.5 px-6 flex items-center justify-center gap-2.5 transition-all duration-150 active:scale-[0.98] cursor-pointer rounded-xs hover:shadow-[0_0_12px_rgba(0,240,255,0.15)]"
            >
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              </svg>
              {lt.connect}
            </button>

            <button
              onClick={() => handleLinkDemoAccount("sandbox-operator@consequences.local", "Sandbox Operator", "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80")}
              className="w-full bg-steel/40 border border-graphite hover:border-neon-lime text-neon-lime hover:text-white font-mono text-[10px] uppercase font-bold py-3.5 px-6 rounded-xs cursor-pointer transition-all duration-150 hover:shadow-[0_0_12px_rgba(198,255,61,0.15)]"
            >
              {lt.bypass}
            </button>

            {accounts.length > 0 && (
              <div className="mt-6 pt-4 border-t border-graphite/40 text-left">
                <span className="font-mono text-[9px] text-[#7A839E] uppercase tracking-wider block mb-3 text-center">
                  {lt.select}
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {accounts.map((acc) => (
                    <button
                      key={acc.user.email}
                      onClick={() => {
                        setActiveEmail(acc.user.email);
                      }}
                      className="w-full bg-[#131826] border border-graphite hover:border-neon-cyan p-2.5 flex items-center gap-3 transition-all rounded-xs text-left group"
                    >
                      {acc.user.picture ? (
                        <img
                          src={acc.user.picture}
                          alt={acc.user.name}
                          className="w-6.5 h-6.5 rounded-full object-cover border border-graphite group-hover:border-neon-cyan"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-6.5 h-6.5 rounded-full bg-carbon border border-[#1E2435] flex items-center justify-center font-display font-bold text-[10px] text-neon-cyan select-none">
                          {acc.user.name ? acc.user.name[0].toUpperCase() : "U"}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-mono text-[10px] font-bold text-white truncate leading-tight group-hover:text-neon-cyan">
                          {acc.user.name}
                        </div>
                        <div className="font-mono text-[9px] text-[#7A839E] truncate">
                          {acc.user.email}
                        </div>
                      </div>
                      <span className={`font-mono text-[8px] px-1.5 py-0.5 border rounded-xs uppercase ${
                        acc.isDemo 
                          ? "border-neon-lime/30 text-neon-lime" 
                          : "border-neon-cyan/30 text-neon-cyan"
                      }`}>
                        {acc.isDemo ? "sandbox" : "google"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-graphite/60 flex justify-center items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-slate" />
            <span className="font-mono text-[9px] text-slate">SECURE_OAUTH2_FEED_INTEGRATED</span>
          </div>

        </div>
      </div>
    );
  }

  // PORTAL MAIN APPLICATION LAYOUT
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView
            calendarEvents={calendarEvents}
            driveFiles={driveFiles}
            gmailMessages={gmailMessages}
            tasks={tasks}
            onViewChange={setCurrentView}
            language={language}
            themeMode={themeMode}
            isZenMode={isZenMode}
            onToggleZenMode={handleToggleZenMode}
            onUpdateCalendarEvent={handleUpdateCalendarEvent}
          />
        );
      case 'mail':
        return (
          <MailView
            messages={gmailMessages}
            onMarkRead={handleMarkEmailRead}
            searchQuery={searchQuery}
            language={language}
            themeMode={themeMode}
          />
        );
      case 'tasks':
        return (
          <TasksView
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            searchQuery={searchQuery}
            language={language}
            themeMode={themeMode}
          />
        );
      case 'drive':
        return (
          <DriveView
            files={driveFiles}
            onAddFile={handleAddNewFile}
            searchQuery={searchQuery}
            language={language}
            themeMode={themeMode}
          />
        );
      case 'settings':
        return <SettingsView language={language} themeMode={themeMode} />;
      case 'design_system':
        return <DesignSystemView />;
      case 'focus':
        return (
          <FocusView 
            nextEvent={globalNextEvent}
            timeRemaining={globalTimeRemaining}
            language={language}
            themeMode={themeMode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden selection:bg-[#00f0ff] selection:text-black">
      
      {/* Sidebar Navigation */}
      {!isZenMode && (
        <Sidebar
          currentView={currentView}
          onViewChange={(view) => {
            setCurrentView(view);
            setSearchQuery(""); // Clear searches automatically on view hops
          }}
          user={user}
          onSync={() => syncWorkspaceData(accessToken)}
          onLogout={handleLogout}
          isSyncing={isSyncing}
          accounts={accounts}
          onSwitchAccount={setActiveEmail}
          onAddAccount={handleSignInGoogle}
          sidebarState={sidebarState}
          onSidebarStateChange={handleSidebarStateChange}
          language={language}
          themeMode={themeMode}
        />
      )}

      {/* Main Board Canvas */}
      <main className={`flex-grow flex flex-col h-full overflow-hidden relative transition-colors duration-350 ${
        themeMode === 'craft' ? 'bg-[#F4F5F8]' : 'bg-[#04060A]'
      }`}>
        
        {/* Top Header Utilities */}
        <Header 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentView={currentView}
          user={user}
          isLiveMode={!!user && !isDemoMode}
          onViewChange={setCurrentView}
          accounts={accounts}
          onSwitchAccount={setActiveEmail}
          onAddAccount={handleSignInGoogle}
          sidebarState={sidebarState}
          onSidebarStateChange={handleSidebarStateChange}
          nextEvent={globalNextEvent}
          timeRemaining={globalTimeRemaining}
          language={language}
          onLanguageChange={handleLanguageChange}
          themeMode={themeMode}
          onThemeModeChange={(mode) => {
            setThemeMode(mode);
            localStorage.setItem("CONSEQUENCES_FOCUS_THEME", mode);
            window.dispatchEvent(new Event("storage"));
          }}
          isZenMode={isZenMode}
          onToggleZenMode={handleToggleZenMode}
        />

        {/* View Layout Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col">
          {isSyncing && (
            <div className="absolute top-20 right-6 bg-[#0a0e17] border border-[#00f0ff] text-[#00f0ff] font-mono text-[10px] px-3.5 py-2 flex items-center gap-2 rounded-xs shadow-[0_0_12px_rgba(0,240,255,0.2)] animate-pulse z-40">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              SYNCHRONIZING_SECURE_CORES...
            </div>
          )}
          {renderCurrentView()}
        </div>

      </main>

      {systemNotification && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn font-sans">
          <div className="border border-zinc-800 bg-[#121214] p-6 max-w-sm w-full rounded-2xl shadow-xl flex flex-col gap-4 text-left">
            <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-800">
              <AlertCircle className={`w-4.5 h-4.5 ${systemNotification.type === 'error' ? 'text-rose-500' : 'text-zinc-400'}`} />
              <span className="font-sans text-[11px] uppercase tracking-wider font-semibold text-zinc-300">
                {systemNotification.title}
              </span>
            </div>
            
            <p className="text-xs text-zinc-400 font-normal leading-relaxed whitespace-pre-line">
              {systemNotification.message}
            </p>
            
            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setSystemNotification(null)}
                className="bg-white hover:bg-zinc-200 text-black px-4.5 py-2 rounded-full font-sans text-[11px] font-semibold tracking-wide uppercase transition-colors cursor-pointer"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
