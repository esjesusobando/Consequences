import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import TopNavBar from './components/TopNavBar';
import SideNavBar from './components/SideNavBar';
import DashboardView from './components/DashboardView';
import DesignSystemView from './components/DesignSystemView';
import TerminalLogs from './components/TerminalLogs';
import { initAuth } from './lib/googleAuth';
import CommandPalette from './components/CommandPalette';

// Brand New Custom Views
import LinearOSView from './components/LinearOSView';
import PersonalOsView from './components/PersonalOsView';
import OperationsOSView from './components/OperationsOSView';
import AnalyticsOSView from './components/AnalyticsOSView';
import SettingsDrawer from './components/SettingsDrawer';
import FocusNotesPanel from './components/FocusNotesPanel';

// Types & Data
import { SignalEvent, AccentColor, TerminalLine, MetricStats, Project, Issue, Product, Warehouse, ProviderProposal, PurchaseOrder, PresentationConfig, AuditLog } from './types';
import { getInitialSignals, INITIAL_LOG_LINES } from './data';
import { 
  INITIAL_PROJECTS, 
  INITIAL_ISSUES, 
  INITIAL_PRODUCTS, 
  INITIAL_WAREHOUSES, 
  INITIAL_PROVIDERS_PROPOSALS, 
  INITIAL_AUDITS, 
  INITIAL_PURCHASE_ORDERS 
} from './personalOsData';

import { Shield, Sparkles, Server, Terminal, Volume2 } from 'lucide-react';

export default function App() {
  // Global Active Accent State
  const [accent, setAccent] = useState<AccentColor>('cyan');
  
  // Settings Drawer Toggle state
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Command Palette state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Focus Mode — hides all chrome for distraction-free dashboard
  const [focusMode, setFocusMode] = useState<boolean>(false);

  // Eye button: simple toggle for focus mode
  const handleEyeClick = () => {
    setFocusMode(f => !f);
  };

  // Layout hidden panel states
  const [hideLeftPanel, setHideLeftPanel] = useState<boolean>(false);
  const [hideRightPanel, setHideRightPanel] = useState<boolean>(false);

  // Force dashboard tab when focus mode activates
  useEffect(() => {
    if (focusMode) {
      setActiveTab('dashboard');
    }
  }, [focusMode]);

  // Keybindings for toggling panels: Ctrl+Tab for left rail, Alt+Tab for right sidebar
  // Tab works normally for form navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.ctrlKey) {
          e.preventDefault();
          setHideLeftPanel(prev => !prev);
          logMessage('info', `ATAJO DE TECLADO: Ctrl+Tab detectado. Panel IZQUIERDO ${!hideLeftPanel ? 'OCULTO' : 'VISIBLE'}`);
        } else if (e.altKey) {
          e.preventDefault();
          setHideRightPanel(prev => !prev);
          logMessage('info', `ATAJO DE TECLADO: Alt+Tab detectado. Panel DERECHO ${!hideRightPanel ? 'OCULTO' : 'VISIBLE'}`);
        }
        // Normal Tab (no modifiers) — let browser handle for form navigation
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hideLeftPanel, hideRightPanel]);
  
  // Navigation Tabs state: 'dashboard' | 'personal_os' | 'linear' | 'operations' | 'analytics' | 'specs' | 'terminal'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'personal_os' | 'linear' | 'operations' | 'analytics' | 'specs' | 'terminal'>('dashboard');

  // CUSTOM CORE OS SEED STATES
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [issues, setIssues] = useState<Issue[]>(INITIAL_ISSUES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [warehouses] = useState<Warehouse[]>(INITIAL_WAREHOUSES);
  const [providers] = useState<ProviderProposal[]>(INITIAL_PROVIDERS_PROPOSALS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [audits, setAudits] = useState<AuditLog[]>(INITIAL_AUDITS);

  // Supernatural Mail Background & Music Customization Configurations
  const [presentationConfig, setPresentationConfig] = useState<PresentationConfig>(() => {
    const saved = localStorage.getItem('sota_presentation_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          bgPositionX: 50,
          bgPositionY: 50,
          ...parsed,
        };
      } catch (e) {
        // Fallback
      }
    }
    return {
      backgroundImage: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1200&q=80", // Editorial Charcoal default preset
      backdropBlur: 10,
      overlayOpacity: 0.15,
      bgPositionX: 50,
      bgPositionY: 50,
      accentPreference: 'cyan',
      audioLoop: 'synth-pad',
      volume: 25,
      isPlayingSound: false,
      customH: 28,
      customS: 45,
      customL: 65,
      panelsSwapped: false,
      sidebarWidth: 384,
      themeMode: 'dark'
    };
  });

  // Persist general config changes
  useEffect(() => {
    localStorage.setItem('sota_presentation_config', JSON.stringify(presentationConfig));
  }, [presentationConfig]);

  // Real-time Sound Synthesis using standard Web Audio nodes for max ambient concentration
  const synthRef = useRef<{
    audioCtx: AudioContext | null;
    gainNode: GainNode | null;
    sources: any[];
    activeTrack: string | null;
  }>({ audioCtx: null, gainNode: null, sources: [], activeTrack: null });

  useEffect(() => {
    const config = presentationConfig;
    
    // Stop synthesize if disabled
    if (!config.isPlayingSound) {
      if (synthRef.current.audioCtx) {
        try {
          synthRef.current.audioCtx.close();
        } catch (e) {}
        synthRef.current.audioCtx = null;
        synthRef.current.gainNode = null;
        synthRef.current.sources = [];
        synthRef.current.activeTrack = null;
      }
      return;
    }

    const stopAndResetNodes = () => {
      synthRef.current.sources.forEach(src => {
        try { src.stop(); } catch (e) {}
      });
      synthRef.current.sources = [];
    };

    const createFilteredOscillator = (ctx: AudioContext, freq: number, type: OscillatorType, gainVal: number, destination: AudioNode) => {
      const osc = ctx.createOscillator();
      const nodeGain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      nodeGain.gain.value = gainVal;
      osc.connect(nodeGain);
      nodeGain.connect(destination);
      osc.start();
      synthRef.current.sources.push(osc);
    };

    const createLofiChordsLoop = (ctx: AudioContext, destination: AudioNode) => {
      const chords = [
        [196.00, 246.94, 293.66, 369.99], // Gmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [146.83, 220.00, 293.66, 349.23]  // D7 / F
      ];
      
      let chordIndex = 0;
      const playNextChord = () => {
        if (!synthRef.current.audioCtx || synthRef.current.activeTrack !== 'lofi-rain') return;
        const currentChord = chords[chordIndex];
        const now = ctx.currentTime;
        
        currentChord.forEach(freq => {
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          
          // Vintage pitch flutter
          const vibrato = ctx.createOscillator();
          vibrato.frequency.value = 4.5 + Math.random() * 2;
          const vibratoGain = ctx.createGain();
          vibratoGain.gain.value = 1.3;
          vibrato.connect(vibratoGain);
          vibratoGain.connect(osc.frequency);
          vibrato.start();
          synthRef.current.sources.push(vibrato);

          // Lofi Envelope
          oscGain.gain.setValueAtTime(0, now);
          oscGain.gain.linearRampToValueAtTime(0.05, now + 1.5);
          oscGain.gain.setValueAtTime(0.05, now + 3);
          oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 5.5);
          
          osc.connect(oscGain);
          oscGain.connect(destination);
          try {
            osc.start(now);
            osc.stop(now + 5.8);
          } catch (e) {}
        });

        chordIndex = (chordIndex + 1) % chords.length;
        const timer = setTimeout(playNextChord, 6000);
        (window as any)._lofiChordTimer = timer;
      };
      
      playNextChord();
    };

    const startSynth = (trackId: string) => {
      try {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtxClass) return;
        const ctx = new AudioCtxClass();
        synthRef.current.audioCtx = ctx;
        synthRef.current.activeTrack = trackId;

        const mainGain = ctx.createGain();
        mainGain.gain.setValueAtTime((config.volume / 100) * 0.15, ctx.currentTime);
        mainGain.connect(ctx.destination);
        synthRef.current.gainNode = mainGain;

        if (trackId === 'synth-pad') {
          // Consequences Deep Drone
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.Q.value = 4;
          filter.frequency.value = 170;
          filter.connect(mainGain);

          createFilteredOscillator(ctx, 55, 'sawtooth', 0.15, filter);  // A1 Harmonic sub-drone
          createFilteredOscillator(ctx, 110, 'triangle', 0.25, filter); // A2 Rich midrange
          createFilteredOscillator(ctx, 165, 'sine', 0.15, filter);     // E2 Pure fifth

          // Very slow resonant filter sweeping using LFO
          const lfo = ctx.createOscillator();
          lfo.frequency.value = 0.07; // 14 seconds sweep cycle
          const lfoGain = ctx.createGain();
          lfoGain.gain.value = 75;

          lfo.connect(lfoGain);
          lfoGain.connect(filter.frequency);
          lfo.start();
          synthRef.current.sources.push(lfo);
        } 
        else if (trackId === 'lofi-rain') {
          // Rain pinkish water drops simulator
          const bufferSize = ctx.sampleRate * 2;
          const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          let lastOut = 0.0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (lastOut * 0.15 + white * 0.04);
            lastOut = output[i];
          }
          const noiseSrc = ctx.createBufferSource();
          noiseSrc.buffer = noiseBuffer;
          noiseSrc.loop = true;

          const rainFilter = ctx.createBiquadFilter();
          rainFilter.type = 'bandpass';
          rainFilter.frequency.value = 750;
          rainFilter.Q.value = 1.2;

          noiseSrc.connect(rainFilter);
          rainFilter.connect(mainGain);
          noiseSrc.start();
          synthRef.current.sources.push(noiseSrc);

          // Elegant chords loop overlays
          createLofiChordsLoop(ctx, mainGain);
        } 
        else if (trackId === 'cosmic-wind') {
          // Solar ambient echoes: Swirling bandpass modulated noise
          const bufferSize = ctx.sampleRate * 2;
          const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
          }
          const noiseSrc = ctx.createBufferSource();
          noiseSrc.buffer = noiseBuffer;
          noiseSrc.loop = true;

          const bpFilter = ctx.createBiquadFilter();
          bpFilter.type = 'bandpass';
          bpFilter.Q.value = 7;
          bpFilter.frequency.value = 450;

          const lfo = ctx.createOscillator();
          lfo.frequency.value = 0.04; // 25 seconds sweeping
          const lfoGain = ctx.createGain();
          lfoGain.gain.value = 300;

          lfo.connect(lfoGain);
          lfoGain.connect(bpFilter.frequency);
          lfo.start();
          synthRef.current.sources.push(lfo);

          noiseSrc.connect(bpFilter);
          bpFilter.connect(mainGain);
          noiseSrc.start();
          synthRef.current.sources.push(noiseSrc);
        }
      } catch (err) {
        console.warn("Synth Audio initialization failed on current browser frame", err);
      }
    };

    // If context is running, dynamically update active volume or swap track loop
    if (synthRef.current.audioCtx) {
      if (synthRef.current.gainNode) {
        synthRef.current.gainNode.gain.setValueAtTime((config.volume / 100) * 0.15, synthRef.current.audioCtx.currentTime);
      }
      if (synthRef.current.activeTrack !== config.audioLoop) {
        stopAndResetNodes();
        if ((window as any)._lofiChordTimer) {
          clearTimeout((window as any)._lofiChordTimer);
        }
        startSynth(config.audioLoop);
      }
      return;
    }

    startSynth(config.audioLoop);

    return () => {
      if ((window as any)._lofiChordTimer) {
        clearTimeout((window as any)._lofiChordTimer);
      }
    };
  }, [presentationConfig.isPlayingSound, presentationConfig.audioLoop, presentationConfig.volume]);

  // Google Auth context properties
  const [user, setUser] = useState<any>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setGoogleToken(token);
        logMessage('ok', `SESIÓN GOOGLE CALENDAR ACTIVE :: Conectado como ${currentUser.displayName || currentUser.email}`);
      },
      () => {
        setUser(null);
        setGoogleToken(null);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Custom upcoming Signals Registry for countdown sync (persisted to localStorage)
  const [signals, setSignals] = useState<SignalEvent[]>(() => {
    try {
      const saved = localStorage.getItem('zc_signals');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Check if there's at least one active future meeting
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const hasFutureMeeting = parsed.some((s: SignalEvent) => {
          if (!s.active) return false;
          const [h, m] = s.time.split(':').map(Number);
          return h * 60 + m > currentMinutes;
        });
        // If no future meetings, regenerate with fresh test meeting
        if (!hasFutureMeeting) {
          return getInitialSignals();
        }
        return parsed;
      }
    } catch {}
    return getInitialSignals();
  });

  // Persist signals to localStorage
  useEffect(() => {
    localStorage.setItem('zc_signals', JSON.stringify(signals));
  }, [signals]);

  // Dynamic Metrics Simulation
  const [metrics, setMetrics] = useState<MetricStats>({
    systemActive: true,
    netProtocol: 'SECURE_V3_SOTA',
    dbConnected: true,
    speedMbps: 99.4,
    nodeStatus: 'OPTIMAL'
  });

  // Terminal Line Logs state
  const [logLines, setLogLines] = useState<TerminalLine[]>(INITIAL_LOG_LINES);

  // Helper utility to write a dynamic string directly to the log lines list
  const logMessage = (type: 'info' | 'ok' | 'warn' | 'err', text: string) => {
    const timestamp = new Date().toTimeString().split(' ')[0];
    setLogLines((prev) => [
      ...prev,
      { type, text, timestamp }
    ]);
  };

  // Dedicated Audit Logger helper
  const addAudit = (module: string, action: string, detail: string) => {
    const timestamp = new Date().toTimeString().split(' ')[0];
    const newAudit: AuditLog = {
      id: `AUD-${Math.floor(Math.random() * 899 + 100)}`,
      timestamp,
      module: module.toUpperCase(),
      action: action.toUpperCase(),
      user: "ia.strongmagazine@gmail.com",
      detail
    };
    setAudits((prev) => [newAudit, ...prev]);
    logMessage('ok', `[REGISTRO AUDITORÍA] ${module} :: ${action} — ${detail}`);
  };

  // Triggering simulated system reboot/clean OS sequence
  const handleSystemReset = () => {
    onClearLogs();
    logMessage('warn', 'REINICIO DEL SISTEMA: Vaciando caché local...');
    logMessage('info', 'Estableciendo parámetros del panel Personal OS...');
    
    // Reset signals registry back to default values (with fresh future time)
    setSignals(getInitialSignals());
    setAccent('cyan');
    setProjects(INITIAL_PROJECTS);
    setIssues(INITIAL_ISSUES);
    setProducts(INITIAL_PRODUCTS);
    setPurchaseOrders(INITIAL_PURCHASE_ORDERS);
    setAudits(INITIAL_AUDITS);
    setActiveTab('personal_os');
    
    setTimeout(() => {
      logMessage('ok', 'Parámetros del sistema recuperados con éxito. 100% SOTA Parity.');
    }, 1200);
  };

  const onClearLogs = () => {
    setLogLines([]);
  };

  // Code command signal injection
  const handleInjectSignalFromCmd = (title: string, time: string) => {
    const randomId = `MTG-${Math.floor(Math.random() * 899 + 100)}`;
    const newSig: SignalEvent = {
      id: randomId,
      time: time,
      title: title,
      description: 'Sesión de meeting inyectada mediante consola CLI integrada.',
      category: 'calendario_sota',
      iconType: 'calendar',
      active: true,
      syncedToGoogleCalendar: true
    };
    setSignals(prev => [...prev, newSig]);
    logMessage('ok', `Agendamiento de meeting completado exitosamente vía consola: [${randomId}] a las ${time}`);
  };

  // Keep a loop randomized change for Mb/s speeds to look super interactive and dynamic!
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        speedMbps: parseFloat((96 + Math.random() * 4).toFixed(1))
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Sync index.css root accents, theme modes, and custom Tokyo Cappuccino & HSL palettes
  useEffect(() => {
    const root = document.documentElement;

    // First, restore standard variables (default dark theme)
    const standardColors = {
      '--color-void': '#04060A',
      '--color-night': '#0B0F18',
      '--color-carbon': '#131826',
      '--color-graphite': '#1E2435',
      '--color-steel': '#2A3148',
      '--color-slate': '#4A5273',
      '--color-ash': '#7A839E',
      '--color-bone': '#C7CCD8',
      '--color-signal-cyan': '#00F0FF',
      '--color-signal-magenta': '#FF2E9A',
      '--color-signal-lime': '#C6FF3D',
      '--color-signal-amber': '#FFB400',
    };

    Object.entries(standardColors).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });

    const theme = presentationConfig.themeMode ?? 'dark';
    const accentHexMap: Record<string, string> = {
      cyan: '#00F0FF', magenta: '#FF2E9A', lime: '#C6FF3D', amber: '#FFB400'
    };

    // ---- CRAFT MODE (Zero_Consequences light/zinc aesthetic) ----
    if (theme === 'craft') {
      const craftColors = {
        '--color-void': '#F4F5F8',
        '--color-night': '#FFFFFF',
        '--color-carbon': '#FAFBFC',
        '--color-graphite': '#E2E5EB',
        '--color-steel': '#D1D5DB',
        '--color-slate': '#6B7280',
        '--color-ash': '#4B5563',
        '--color-bone': '#1F2937',
        '--color-signal-cyan': '#0066FF',
        '--color-signal-magenta': '#DC2626',
        '--color-signal-lime': '#65A30D',
        '--color-signal-amber': '#D97706',
      };
      Object.entries(craftColors).forEach(([key, val]) => {
        root.style.setProperty(key, val);
      });

      const craftAccents: Record<string, string> = {
        magenta: '#DC2626', lime: '#65A30D', amber: '#D97706', tokyo: '#8B7355'
      };
      if (accent === 'custom') {
        const h = presentationConfig.customH ?? 210;
        const s = presentationConfig.customS ?? 100;
        const l = presentationConfig.customL ?? 50;
        root.style.setProperty('--color-signal-cyan', `hsl(${h}, ${s}%, ${l}%)`);
        root.style.setProperty('--accent-hex', `hsl(${h}, ${s}%, ${l}%)`);
      } else if (accent !== 'cyan') {
        root.style.setProperty('--accent-hex', craftAccents[accent] || '#0066FF');
        if (accent === 'magenta') root.style.setProperty('--color-signal-cyan', '#DC2626');
        if (accent === 'lime') root.style.setProperty('--color-signal-cyan', '#65A30D');
        if (accent === 'amber') root.style.setProperty('--color-signal-cyan', '#D97706');
        if (accent === 'tokyo') root.style.setProperty('--color-signal-cyan', '#8B7355');
      } else {
        root.style.setProperty('--accent-hex', '#0066FF');
      }
    }
    // ---- CYBER MODE (Zero_Consequences cyber aesthetic - dark with vivid signals) ----
    else if (theme === 'cyber') {
      const cyberColors = {
        '--color-void': '#05080F',
        '--color-night': '#0A0E1A',
        '--color-carbon': '#111624',
        '--color-graphite': '#1A2035',
        '--color-steel': '#232B45',
        '--color-slate': '#3D4768',
        '--color-ash': '#6B7598',
        '--color-bone': '#C8D0E0',
        '--color-on-surface': '#E8EDF5',
      };
      Object.entries(cyberColors).forEach(([key, val]) => {
        root.style.setProperty(key, val);
      });

      if (accent === 'custom') {
        const h = presentationConfig.customH ?? 180;
        const s = presentationConfig.customS ?? 100;
        const l = presentationConfig.customL ?? 50;
        root.style.setProperty('--color-signal-cyan', `hsl(${h}, ${s}%, ${l}%)`);
        root.style.setProperty('--color-signal-magenta', `hsl(${(h + 120) % 360}, ${Math.min(100, s)}%, ${l}%)`);
        root.style.setProperty('--color-signal-lime', `hsl(${(h + 240) % 360}, ${Math.min(100, s)}%, ${l}%)`);
        root.style.setProperty('--color-signal-amber', `hsl(${(h + 40) % 360}, ${Math.max(10, s - 10)}%, ${Math.max(10, l - 10)}%)`);
        root.style.setProperty('--accent-hex', `hsl(${h}, ${s}%, ${l}%)`);
      } else if (accent === 'tokyo') {
        const tokyoColors = {
          '--color-void': '#0e0b09', '--color-night': '#1a110e',
          '--color-carbon': '#251a16', '--color-graphite': '#362621',
          '--color-steel': '#47332c', '--color-slate': '#8c6e64',
          '--color-ash': '#bfa69c', '--color-bone': '#ebe2de',
          '--color-signal-cyan': '#d4b395', '--color-signal-magenta': '#ad7653',
          '--color-signal-lime': '#dfbc96', '--color-signal-amber': '#754a2c',
        };
        Object.entries(tokyoColors).forEach(([key, val]) => root.style.setProperty(key, val));
        root.style.setProperty('--accent-hex', '#d4b395');
      } else if (accent !== 'cyan') {
        root.style.setProperty('--accent-hex', accentHexMap[accent] || '#00F0FF');
      } else {
        root.style.setProperty('--accent-hex', '#00F0FF');
      }
    }
    // ---- LIGHT NEOCRAFT MODE (Dashboar-Conteo original light theme) ----
    else if (theme === 'light_neocraft') {
      const lightNeoCraftColors = {
        '--color-void': '#E8EBF0',
        '--color-night': '#F2F4F7',
        '--color-carbon': '#FFFFFF',
        '--color-graphite': '#D3D8E2',
        '--color-steel': '#B9C2D1',
        '--color-slate': '#4B5563',
        '--color-ash': '#333D52',
        '--color-bone': '#111111',
        '--color-signal-cyan': '#156BFF',
        '--color-signal-magenta': '#4B5DFF',
        '--color-signal-lime': '#1A7A1A', // dark green visible on light bg
        '--color-signal-amber': '#5BE8FF',
      };
      Object.entries(lightNeoCraftColors).forEach(([key, val]) => {
        root.style.setProperty(key, val);
      });

      if (accent === 'custom') {
        const h = presentationConfig.customH ?? 180;
        const s = presentationConfig.customS ?? 100;
        const l = presentationConfig.customL ?? 50;
        root.style.setProperty('--color-signal-cyan', `hsl(${h}, ${s}%, ${l}%)`);
        root.style.setProperty('--accent-hex', `hsl(${h}, ${s}%, ${l}%)`);
      } else if (accent !== 'cyan') {
        const lncAccents: Record<string, string> = {
          magenta: '#4B5DFF', lime: '#B6FF4D', amber: '#5BE8FF', tokyo: '#d4b395'
        };
        root.style.setProperty('--accent-hex', lncAccents[accent] || '#156BFF');
        if (accent === 'lime') root.style.setProperty('--color-signal-cyan', '#B6FF4D');
        if (accent === 'magenta') root.style.setProperty('--color-signal-cyan', '#4B5DFF');
        if (accent === 'amber') root.style.setProperty('--color-signal-cyan', '#5BE8FF');
      } else {
        root.style.setProperty('--accent-hex', '#156BFF');
      }
    }
    // ---- DARK MODE (default) ----
    else {
      if (accent === 'tokyo') {
        const tokyoCappuccinoColors = {
          '--color-void': '#0e0b09',
          '--color-night': '#1a110e',
          '--color-carbon': '#251a16',
          '--color-graphite': '#362621',
          '--color-steel': '#47332c',
          '--color-slate': '#8c6e64',
          '--color-ash': '#bfa69c',
          '--color-bone': '#ebe2de',
          '--color-signal-cyan': '#d4b395',
          '--color-signal-magenta': '#ad7653',
          '--color-signal-lime': '#dfbc96',
          '--color-signal-amber': '#754a2c',
        };
        Object.entries(tokyoCappuccinoColors).forEach(([key, val]) => {
          root.style.setProperty(key, val);
        });
        root.style.setProperty('--accent-hex', '#d4b395');
      } else if (accent === 'custom') {
        const h = presentationConfig.customH ?? 28;
        const s = presentationConfig.customS ?? 45;
        const l = presentationConfig.customL ?? 65;

        const customAccentColor = `hsl(${h}, ${s}%, ${l}%)`;
        const customMagentaColor = `hsl(${(h + 120) % 360}, ${s}%, ${l}%)`;
        const customLimeColor = `hsl(${(h + 240) % 360}, ${s}%, ${l}%)`;
        const customAmberColor = `hsl(${(h + 40) % 360}, ${Math.max(10, s - 10)}%, ${Math.max(10, l - 10)}%)`;

        root.style.setProperty('--color-signal-cyan', customAccentColor);
        root.style.setProperty('--color-signal-magenta', customMagentaColor);
        root.style.setProperty('--color-signal-lime', customLimeColor);
        root.style.setProperty('--color-signal-amber', customAmberColor);
        root.style.setProperty('--accent-hex', customAccentColor);
      } else {
        root.style.setProperty('--accent-hex', accentHexMap[accent] || '#00F0FF');
      }
    }
  }, [accent, presentationConfig.customH, presentationConfig.customS, presentationConfig.customL, presentationConfig.themeMode]);

  return (
    <div className="bg-void text-on-surface font-body min-h-screen overflow-hidden selection:bg-signal-cyan selection:text-on-primary select-none flex flex-col relative scanlines">
      
      {/* Editorial Supernatural Mail Customizable Ambient Backdrop layers */}
      {presentationConfig.backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover pointer-events-none transition-all duration-700 select-none z-0"
          style={{ 
            backgroundImage: `url(${presentationConfig.backgroundImage})`,
            backgroundPosition: `${presentationConfig.bgPositionX}% ${presentationConfig.bgPositionY}%`,
            opacity: presentationConfig.overlayOpacity // dynamic opacity blending with void black
          }}
        />
      )}

      {/* Glassmorphic overlay for real-time slider-driven backdrop filters */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-500 z-0" 
        style={{ backdropFilter: `blur(${presentationConfig.backdropBlur}px)` }}
      />

      {/* Grid line overlay */}
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-20 z-0" />

      {/* Dynamic Top Header with Navigation — always visible */}
      <TopNavBar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        accent={accent}
        onAccentChange={(newAccent) => {
          setAccent(newAccent);
          logMessage('info', `Color de acento activo actualizado: ${newAccent.toUpperCase()}`);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        focusMode={focusMode}
        onToggleFocus={handleEyeClick}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Consolidated Settings & Aesthetics Drawer Panel */}
      <SettingsDrawer 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        config={presentationConfig}
        setConfig={setPresentationConfig}
        accent={accent}
        setAccent={setAccent}
        onLogMessage={logMessage}
        focusMode={focusMode}
        setFocusMode={setFocusMode}
      />

      {/* Command Palette Launcher (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={(tab) => setActiveTab(tab as typeof activeTab)}
        activeTab={activeTab}
      />

      {/* Left side fixed rail icons menu */}
      {!focusMode && (
        <SideNavBar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          accent={accent}
          onSystemReset={handleSystemReset}
          hideLeftPanel={hideLeftPanel}
        />
      )}

      {/* Main Container Assembly Area */}
      <main className={`${focusMode ? 'pt-0' : 'pt-14'} ${hideLeftPanel || focusMode ? 'pl-0' : 'md:pl-14'} flex flex-col relative w-full overflow-hidden z-10 transition-all duration-300`} style={{ height: focusMode ? '100vh' : 'calc(100vh - 56px)' }}>
        
        {focusMode ? (
          /* ── FOCUS MODE: countdown 60% + notes 40% ── */
          <motion.div
            key="focus"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col h-full"
          >
            <div className="flex-[3] min-h-0 overflow-hidden flex flex-col">
              <DashboardView 
                signals={signals}
                setSignals={setSignals}
                accent={accent}
                nodeStatus={metrics.nodeStatus}
                onLogMessage={logMessage}
                hideRightPanel={true}
                config={presentationConfig}
                user={user}
                setUser={setUser}
                googleToken={googleToken}
                setGoogleToken={setGoogleToken}
              />
            </div>
            <div className="flex-[2] min-h-0 overflow-hidden border-t border-graphite/30">
              <FocusNotesPanel />
            </div>
          </motion.div>
        ) : (
          /* ── NORMAL MODE ── */
          <motion.div
            key="normal"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 overflow-hidden flex flex-col"
          >
          
          {/* TAB 1: MEETINGS COUNTDOWN HUD */}
          {activeTab === 'dashboard' && (
            <DashboardView 
              signals={signals}
              setSignals={setSignals}
              accent={accent}
              nodeStatus={metrics.nodeStatus}
              onLogMessage={logMessage}
              hideRightPanel={hideRightPanel}
              config={presentationConfig}
              user={user}
              setUser={setUser}
              googleToken={googleToken}
              setGoogleToken={setGoogleToken}
            />
          )}

          {/* TAB 2: PERSONAL OS WORKSPACE & OCR */}
          {activeTab === 'personal_os' && (
            <PersonalOsView 
              config={presentationConfig}
              setConfig={setPresentationConfig}
              onLogMessage={logMessage}
              accent={accent}
            />
          )}

          {/* TAB 3: TEAM LINEAR (MANAGEMENT & PROJECTS) */}
          {activeTab === 'linear' && (
            <LinearOSView 
              projects={projects}
              setProjects={setProjects}
              issues={issues}
              setIssues={setIssues}
              accent={accent}
              onLogMessage={logMessage}
              hideRightPanel={hideRightPanel}
            />
          )}

          {/* TAB 4: OPERATIONS & INVENTORY */}
          {activeTab === 'operations' && (
            <OperationsOSView 
              products={products}
              setProducts={setProducts}
              warehouses={warehouses}
              providers={providers}
              purchaseOrders={purchaseOrders}
              setPurchaseOrders={setPurchaseOrders}
              onLogMessage={logMessage}
              onAddAudit={addAudit}
            />
          )}

          {/* TAB 5: ANALYTICS & BARCODES */}
          {activeTab === 'analytics' && (
            <AnalyticsOSView 
              products={products}
              audits={audits}
              warehouses={warehouses}
              onLogMessage={logMessage}
            />
          )}

          {/* TAB 6: DESIGN STYLE STATS */}
          {activeTab === 'specs' && (
            <DesignSystemView 
              accent={accent}
              onAccentChange={(newAccent) => {
                setAccent(newAccent);
                logMessage('info', `Acento sobreescrito vía Guía de Estilos: ${newAccent.toUpperCase()}`);
              }}
              onLogMessage={logMessage}
            />
          )}

          {/* TAB 7: CLI COMMAND SHELL TERMINAL */}
          {activeTab === 'terminal' && (
            <TerminalLogs 
              logLines={logLines}
              setLogLines={setLogLines}
              accent={accent}
              onAccentChange={(newAccent) => {
                setAccent(newAccent);
                logMessage('info', `Acento modificado desde consola CLI: ${newAccent}`);
              }}
              speedMbps={metrics.speedMbps}
              dbConnected={metrics.dbConnected}
              onClearLogs={onClearLogs}
              onLogMessage={logMessage}
              onInjectSignalFromCmd={handleInjectSignalFromCmd}
              onExit={() => setActiveTab('dashboard')}
            />
          )}
        </motion.div>
        )}


      </main>
    </div>
  );
}
