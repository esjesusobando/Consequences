import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Copy, Check, Radio, Terminal, Laptop, Settings, ChevronRight } from "lucide-react";

export default function DesignSystemView() {
  const [activeAccent, setActiveAccent] = useState<'cyan' | 'magenta' | 'lime' | 'amber'>('cyan');
  
  // Accents configuration
  const accents = {
    cyan: { hex: '#00F0FF', name: 'Signal Cyan', usage: 'CTA · Focus · Validation' },
    magenta: { hex: '#FF2E9A', name: 'Signal Magenta', usage: 'Alert · Live · Playback' },
    lime: { hex: '#C6FF3D', name: 'Signal Lime', usage: 'Crossover · Success · Future' },
    amber: { hex: '#FFB400', name: 'Signal Amber', usage: 'Warning · On-Air · Pending' }
  };

  // State for alert copying
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  // States for player
  const [progress, setProgress] = useState(0.3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerTime, setPlayerTime] = useState("14:06 / 47:00");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [waveData, setWaveData] = useState<number[]>([]);

  // States for live interactive input demos
  const [inputText, setInputText] = useState("");
  const [inputFocus, setInputFocus] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [toggles, setToggles] = useState({
    trans: true,
    dark: true,
    notif: false,
    hud: false
  });

  // Root CSS Variable Setter side effect
  useEffect(() => {
    // Re-program root properties to synchronize active styling of other app segments
    const hex = accents[activeAccent].hex;
    const glow = activeAccent === 'cyan' 
      ? '0 0 8px rgba(0,240,255,0.6), 0 0 24px rgba(0,240,255,0.2)' 
      : activeAccent === 'magenta'
      ? '0 0 8px rgba(255,46,154,0.6), 0 0 24px rgba(255,46,154,0.2)'
      : activeAccent === 'lime'
      ? '0 0 8px rgba(198,255,61,0.6), 0 0 24px rgba(198,255,61,0.2)'
      : '0 0 8px rgba(255,180,0,0.6), 0 0 24px rgba(255,180,0,0.2)';
      
    document.documentElement.style.setProperty('--accent', hex);
    document.documentElement.style.setProperty('--color-neon-cyan', hex); // override cyan if accent active
    document.documentElement.style.setProperty('--glow-accent', glow);
  }, [activeAccent]);

  // Generate layout height data array for visualizer
  useEffect(() => {
    const counts = 120;
    const generated: number[] = [];
    for (let i = 0; i < counts; i++) {
      const base = Math.sin(i * 0.15) * 0.3 + Math.sin(i * 0.07) * 0.4 + Math.sin(i * 0.32) * 0.15;
      generated.push(0.15 + Math.abs(base) * 0.8 + Math.random() * 0.08);
    }
    setWaveData(generated);
  }, []);

  // Update animated audio track parameters
  useEffect(() => {
    if (!isPlaying) return;
    const ticker = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 0.0008;
        if (next >= 1) {
          setIsPlaying(false);
          return 1;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(ticker);
  }, [isPlaying]);

  // Waveform progress render tracking math
  useEffect(() => {
    const total = 47 * 60;
    const cur = Math.floor(progress * total);
    const m = Math.floor(cur / 60);
    const s = cur % 60;
    setPlayerTime(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')} / 47:00`);
  }, [progress]);

  // Canvas context draw routing
  useEffect(() => {
    const c = canvasRef.current;
    if (!c || waveData.length === 0) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    // Fluid resize observer
    const rect = c.parentElement?.getBoundingClientRect();
    const w = rect?.width || 500;
    c.width = w;
    c.height = 40;

    ctx.clearRect(0, 0, w, 40);
    const barW = 2;
    const gap = 1;
    const total = barW + gap;
    const bars = Math.floor(w / total);
    const mid = 20;

    for (let i = 0; i < bars; i++) {
      const x = i * total;
      const waveVal = waveData[i % waveData.length] || 0.5;
      const barH = waveVal * 34;
      const pct = i / bars;

      if (pct < progress) {
        ctx.fillStyle = accents[activeAccent].hex;
        ctx.shadowColor = accents[activeAccent].hex;
        ctx.shadowBlur = 4;
      } else {
        ctx.fillStyle = '#2A3148';
        ctx.shadowBlur = 0;
      }
      ctx.fillRect(x, mid - barH / 2, barW, barH);
    }
    ctx.shadowBlur = 0;
  }, [waveData, progress, activeAccent]);

  // Copy click utility
  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 1400);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    const clickX = e.clientX - r.left;
    setProgress(Math.max(0, Math.min(1, clickX / r.width)));
  };

  return (
    <div className="flex-grow flex flex-col gap-8 pb-12 font-sans text-stone-300">
      
      {/* Overview Headway Hero */}
      <section className="relative border border-graphite bg-[#0a0e17] p-8 overflow-hidden rounded-sm group">
        <div className="absolute top-0 right-0 p-2 font-mono text-[9px] text-[#7A839E] border-b border-l border-graphite uppercase tracking-widest leading-none">
          DESIGN_SYSTEM_ACTIVE
        </div>
        
        <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-neon-cyan"></div>
        <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-neon-cyan"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(0,240,255,0.06)_0%,transparent_60%)] pointer-events-none"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-neon-magenta rounded-xs font-mono text-[10px] text-neon-magenta uppercase tracking-wider cyber-glow-magenta bg-neon-magenta/5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-magenta animate-pulse"></span>
            SYSTEM ACTIVE // DS V1.0
          </div>
          
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white mb-2">
            CONSEQUENCES
          </h1>
          <h3 className="font-display text-base sm:text-lg font-semibold text-ash mb-4">
            Specification Document & Interactive Playground
          </h3>
          <p className="max-w-2xl text-xs sm:text-sm text-ash leading-relaxed mb-6">
            This module displays the complete baseline colors, typographic metrics, grid systems, and components defined for the <b>Consequences</b> workspace. Adjust active accents below to recolor the workspace interface immediately.
          </p>

          <div className="flex flex-wrap gap-4 font-mono text-[11px] text-slate">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse"></span>
              T-MINUS 12.07.2026
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-magenta"></span>
              ACTIVE SIGNAL 04
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-lime"></span>
              HANDSHAKE VERIFIED
            </div>
          </div>
        </div>
      </section>

      {/* Floating Accent Switcher panel replica inside container */}
      <section className="border border-graphite bg-carbon p-5 rounded-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h4 className="font-display text-sm font-semibold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
              <Settings className="w-4 h-4 text-neon-cyan" />
              Accent Theme Manipulation (Live Shift)
            </h4>
            <p className="text-xs text-ash">
              Click a signal channel to override the global --accent variable and preview design parameters dynamically.
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-void/50 border border-graphite px-4 py-2.5 rounded-sm">
            <span className="font-mono text-[10px] text-slate uppercase tracking-wider mr-2">SYS_ACENTO:</span>
            <div className="flex gap-2">
              {(['cyan', 'magenta', 'lime', 'amber'] as const).map((colorKey) => (
                <button
                  key={colorKey}
                  onClick={() => setActiveAccent(colorKey)}
                  style={{ backgroundColor: accents[colorKey].hex }}
                  className={`w-6 h-6 rounded-full cursor-pointer transition-all duration-150 relative ${
                    activeAccent === colorKey 
                      ? "ring-2 ring-white scale-110 shadow-lg" 
                      : "opacity-80 hover:opacity-100 hover:scale-[1.05]"
                  }`}
                  title={accents[colorKey].name}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid: Colors and Typography */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Color Palette Section */}
        <section className="border border-graphite bg-night p-6 rounded-sm flex flex-col gap-6">
          <div>
            <span className="font-mono text-[10px] text-neon-cyan tracking-wider uppercase block mb-1">
              // 02 // COLORES
            </span>
            <h2 className="font-display text-lg font-bold uppercase tracking-tight text-white">
              Sistema de Color
            </h2>
            <p className="text-xs text-ash mt-1">
              Negative space chromatic dark values paired with high-frequency functional signals. Click swatches to copy coordinate hexes.
            </p>
          </div>

          <div>
            <span className="font-mono text-[9px] text-[#4A5273] uppercase tracking-wider block mb-3">
              BASE PALETTE // Voids & Surfaces
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { name: 'Void', hex: '#04060A' },
                { name: 'Night', hex: '#0B0F18' },
                { name: 'Carbon', hex: '#131826' },
                { name: 'Graphite', hex: '#1E2435' },
                { name: 'Steel', hex: '#2A3148' },
                { name: 'Slate', hex: '#4A5273' },
                { name: 'Ash', hex: '#7A839E' },
                { name: 'Bone', hex: '#C7CCD8' },
                { name: 'Paper', hex: '#ECEEF5' },
                { name: 'Pure', hex: '#FFFFFF' }
              ].map((sw) => (
                <div 
                  key={sw.name}
                  onClick={() => handleCopy(sw.hex)}
                  className="bg-carbon border border-graphite rounded-xs overflow-hidden cursor-pointer group active:scale-95 transition-all duration-100"
                  title="Click to Copy"
                >
                  <div className="h-10 w-full transition-opacity group-hover:opacity-90" style={{ backgroundColor: sw.hex }} />
                  <div className="p-1.5 text-center leading-tight">
                    <div className="font-mono text-[9px] text-slate font-semibold truncate">{sw.name}</div>
                    <div className="font-mono text-[10px] text-ash truncate group-hover:text-neon-cyan">{sw.hex}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="font-mono text-[9px] text-[#4A5273] uppercase tracking-wider block mb-3">
              SIGNAL PALETTE // Active High-Frequency Channels
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(['cyan', 'magenta', 'lime', 'amber'] as const).map((colorKey) => {
                const item = accents[colorKey];
                return (
                  <div
                    key={colorKey}
                    onClick={() => handleCopy(item.hex)}
                    className="border p-4 rounded-xs cursor-pointer group transition-all duration-200 bg-void/40 hover:bg-carbon/70 active:scale-[0.98] relative"
                    style={{ 
                      borderColor: activeAccent === colorKey ? `var(--accent)` : '#1E2435',
                      boxShadow: activeAccent === colorKey ? `0 0 10px rgba(${colorKey === 'cyan' ? '0,240,255' : colorKey==='magenta' ? '255,46,154' : colorKey==='lime'?'198,255,61':'255,180,0'},0.15)` : 'none'
                    }}
                  >
                    <div className="font-mono text-[9px] uppercase tracking-wider" style={{ color: item.hex }}>
                      {item.name}
                    </div>
                    <div className="font-mono text-xl font-bold text-white mt-1">
                      {item.hex}
                    </div>
                    <div className="text-[11px] text-slate mt-1.5">
                      {item.usage}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {copiedColor && (
            <div className="bg-neon-lime/10 border border-neon-lime text-neon-lime text-xs px-3 py-2 rounded-xs font-mono flex items-center justify-center gap-2 animate-bounce">
              <Check className="w-3.5 h-3.5" />
              COPIED Hex Code: {copiedColor} to clipboard
            </div>
          )}
        </section>

        {/* Typographic Scale Section */}
        <section className="border border-graphite bg-night p-6 rounded-sm flex flex-col gap-6">
          <div>
            <span className="font-mono text-[10px] text-neon-magenta tracking-wider uppercase block mb-1">
              // 03 // TIPOGRAFÍA
            </span>
            <h2 className="font-display text-lg font-bold uppercase tracking-tight text-white">
              Escala de Tipografías
            </h2>
            <p className="text-xs text-ash mt-1">
              Industrial Space Grotesk display headings accented with Inter Tight copy blocks.
            </p>
          </div>

          {/* Display typography sizes mapping */}
          <div className="border-t border-graphite pt-4">
            <span className="font-mono text-[9px] text-[#4A5273] uppercase tracking-wider block mb-3">
              DISPLAY SCALE // Space Grotesk
            </span>
            <div className="space-y-4">
              <div>
                <div className="font-mono text-[8px] text-slate uppercase mb-1">H1_DISPLAY / 44pt / Bold</div>
                <div className="font-display text-4xl font-extrabold uppercase leading-none text-white tracking-widest italic">
                  CONSEQUENCES
                </div>
              </div>
              <div>
                <div className="font-mono text-[8px] text-slate uppercase mb-1">H2_HERO / 28pt / SemiBold</div>
                <div className="font-display text-2xl font-bold text-white uppercase tracking-tight">
                  SISTEMA DE DISEÑO
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-graphite pt-4">
            <span className="font-mono text-[9px] text-[#4A5273] uppercase tracking-wider block mb-3">
              BODY SCALE // Inter Tight // regular text
            </span>
            <div className="space-y-3 font-sans leading-relaxed">
              <div>
                <div className="font-mono text-[8px] text-slate uppercase mb-1">BODY_LARGE / 18pt</div>
                <p className="text-md font-normal text-white">
                  Texto de introducción o párrafos destacados del ecosistema.
                </p>
              </div>
              <div>
                <div className="font-mono text-[8px] text-slate uppercase mb-1">BODY_DEFAULT / 16pt</div>
                <p className="text-sm font-normal text-ash">
                  Cuerpo general optimizado para pantallas oscuras de alta lectura.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-graphite pt-4">
            <span className="font-mono text-[9px] text-[#4A5273] uppercase tracking-wider block mb-3">
              TECHNICAL SCALE // JetBrains Mono
            </span>
            <div className="space-y-2 font-mono text-xs">
              <div>
                <div className="font-mono text-[8.5px] text-[#4A5273] uppercase">TECHNICAL_MONO / 12pt</div>
                <p className="text-white text-[11px] tracking-widest font-medium">
                  EP. 04 // 47 MIN // CO CROSSOVER
                </p>
              </div>
              <div>
                <div className="font-mono text-[8.5px] text-[#4A5273] uppercase">EYEBROW_TAGS / 11pt</div>
                <p className="text-slate text-[10px] tracking-widest">
                  T-MINUS 12.07.2026 // NODE_04_LIVE
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Grid: Component Inputs Demo & HUD Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Form elements and interactive buttons */}
        <section className="border border-graphite bg-night p-6 rounded-sm flex flex-col gap-6">
          <div>
            <span className="font-mono text-[10px] text-neon-lime tracking-wider uppercase block mb-1">
              // 05 // COMPONENTES
            </span>
            <h2 className="font-display text-lg font-bold uppercase tracking-tight text-white">
              Inputs, Botones & Pills
            </h2>
            <p className="text-xs text-ash mt-1">
              Highly responsive state overrides with beautiful glowing feedback indicators.
            </p>
          </div>

          {/* Form Fields Testboard */}
          <div className="space-y-4">
            <div>
              <span className="block font-mono text-[9px] text-[#4A5273] uppercase tracking-widest mb-1.5">
                INPUT FIELD // LIVE DEMO
              </span>
              
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onFocus={() => setInputFocus(true)}
                onBlur={() => setInputFocus(false)}
                placeholder="Ingresa tu señal para probar..."
                className={`w-full bg-carbon border rounded-xs px-4 py-2.5 font-sans text-xs focus:outline-none transition-all duration-150 ${
                  inputError
                    ? "border-neon-magenta text-neon-magenta"
                    : inputFocus
                    ? "border-accent text-white"
                    : "border-graphite text-[#7A839E]"
                }`}
                style={{ 
                  boxShadow: inputFocus && !inputError ? `0 0 10px rgba(0, 240, 255, 0.15)` : 'none'
                }}
              />
              
              <div className="flex justify-between items-center mt-1">
                <span className="font-mono text-[10px] text-slate">
                  {inputFocus ? "✓ FOCUSING_ACTIVE" : "STANDBY"}
                </span>
                
                <button 
                  onClick={() => setInputError(!inputError)}
                  className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
                    inputError ? "bg-neon-magenta text-white" : "bg-steel/60 text-slate hover:bg-steel"
                  }`}
                >
                  {inputError ? "CLEAR_DEMO_ERROR" : "SIMULATE_VALIDATION_ERROR"}
                </button>
              </div>
            </div>

            {/* Buttons Row with dynamic hover matches */}
            <div>
              <span className="block font-mono text-[9px] text-[#4A5273] uppercase tracking-widest mb-2">
                CTA INTERACTION MODULES
              </span>
              <div className="flex flex-wrap gap-2.5">
                <button 
                  onClick={() => alert(`Signals handshaking with current accent: ${activeAccent.toUpperCase()}`)}
                  className="bg-accent text-void px-4 py-2.5 font-display text-[11px] font-bold tracking-widest uppercase rounded-xs transition-transform duration-100 active:scale-95 cursor-pointer flex items-center gap-1.5"
                  style={{ 
                    backgroundColor: accents[activeAccent].hex,
                    boxShadow: `0 0 12px ${accents[activeAccent].hex}50`
                  }}
                >
                  ESCUCHA AHORA <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button className="border border-accent text-accent px-4 py-2.5 font-display text-[11px] font-bold tracking-widest uppercase rounded-xs bg-transparent hover:bg-accent/10 transition-colors duration-150 cursor-pointer">
                  VER EPISODIOS
                </button>

                <button className="border border-graphite text-[#7A839E] hover:text-white hover:border-steel px-4 py-2.5 font-display text-[11px] font-bold tracking-widest uppercase rounded-xs bg-transparent transition-colors duration-150 cursor-pointer">
                  DETALLES
                </button>
              </div>
            </div>

            {/* Simulated pills and status banners */}
            <div>
              <span className="block font-mono text-[9px] text-[#4A5273] uppercase tracking-widest mb-2">
                STATE STATUS PILLS
              </span>
              <div className="flex gap-2">
                <span className="px-3 py-1 font-mono text-[9px] uppercase tracking-wider border border-neon-cyan text-neon-cyan rounded-xs bg-neon-cyan/5 cyber-glow">
                  ● ACTIVO
                </span>
                <span className="px-3 py-1 font-mono text-[9px] uppercase tracking-wider border border-neon-magenta text-neon-magenta rounded-xs bg-neon-magenta/5 cyber-glow-magenta">
                  ● EN VIVO
                </span>
                <span className="px-3 py-1 font-mono text-[9px] uppercase tracking-wider border border-neon-lime text-neon-lime rounded-xs bg-neon-lime/5 cyber-glow-lime">
                  ● ÉXITO
                </span>
                <span className="px-3 py-1 font-mono text-[9px] uppercase tracking-wider border border-neon-amber text-neon-amber rounded-xs bg-neon-amber/5 cyber-glow-amber">
                  ● WARNING
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* HUD Technical Terminal Component */}
        <section className="border border-graphite bg-night p-6 rounded-sm flex flex-col gap-6">
          <div>
            <span className="font-mono text-[10px] text-neon-cyan tracking-wider uppercase block mb-1">
              // 07 // TERMINAL HUD
            </span>
            <h2 className="font-display text-lg font-bold uppercase tracking-tight text-white">
              Sistemas HUD Terminal
            </h2>
            <p className="text-xs text-ash mt-1">
              Active operational consoles that logs running handshakes and coordination signals.
            </p>
          </div>

          <div className="font-mono text-[11px] border border-graphite bg-void rounded-sm overflow-hidden flex flex-col">
            <div className="bg-carbon px-4 py-2 flex items-center justify-between border-b border-graphite">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-neon-magenta"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-neon-amber"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-neon-lime"></div>
              </div>
              <span className="text-[9px] text-[#4A5273] tracking-widest font-bold">CONSEQUENCES // TERMINAL HUD</span>
            </div>

            <div className="p-4 space-y-1 bg-void min-h-[180px]">
              <div className="flex items-start gap-1">
                <span className="text-slate">&gt;</span>
                <span className="text-white">system.boot --mode=signal --env=prod</span>
              </div>
              <div className="text-neon-cyan">&gt; Initializing CONSEQUENCES DS V1.0...</div>
              <div className="text-neon-cyan">&gt; Overriding coordinates with theme: {activeAccent.toUpperCase()}</div>
              <div className="text-neon-lime">&gt; HANDSHAKE OK - señal establecida exitosamente</div>
              <div className="text-neon-amber">&gt; WARNING - asynchronous channel monitoring established</div>
              <div className="text-neon-magenta animate-pulse">&gt; PLAYBACK TRANSMISSION RUNNING IN CHANNEL_02</div>
              <div className="flex items-center gap-0.5">
                <span className="text-slate">&gt;</span>
                <span className="text-ash">monitor.run --live</span>
                <span className="w-2 h-3.5 bg-accent animate-ping" style={{ backgroundColor: accents[activeAccent].hex }}></span>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Full feed player waveform visualization block */}
      <section className="border border-graphite bg-night p-6 rounded-sm flex flex-col gap-6">
        <div>
          <span className="font-mono text-[10px] text-neon-magenta tracking-wider uppercase block mb-1">
            // 09 // FEED & PLAYBACK
          </span>
          <h2 className="font-display text-lg font-bold uppercase tracking-tight text-white">
            Feed, Waveform & Reproductor
          </h2>
          <p className="text-xs text-ash mt-1">
            Real interactive waveform canvas where you can scrub, play, and change episodes matching padding configurations.
          </p>
        </div>

        {/* Podcast Feed interactive item layout */}
        <div className="border border-graphite bg-void/50 rounded-sm overflow-hidden divide-y divide-graphite flex flex-col">
          
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4 bg-carbon/40 hover:bg-carbon/75 transition-colors cursor-pointer group">
            <div className="font-mono text-3xl font-extrabold text-slate group-hover:text-neon-magenta transition-colors">
              01
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex gap-4 font-mono text-[9px] text-slate mb-1">
                <span>EPISODIO INTRODUCTORIO // 47 MINS</span>
                <span className="text-neon-magenta">YT • 11.07.2026</span>
              </div>
              <h4 className="font-display text-sm font-semibold text-white truncate group-hover:text-neon-cyan transition-colors">
                Inter Tight — Apertura de Conseuencias v1.0
              </h4>
              <div className="flex gap-2 font-mono text-[9px] text-slate mt-1 uppercase">
                <span>MONO_12PT</span>
                <span>•</span>
                <span>EYEBROW_11PT</span>
              </div>
            </div>
            <div className="text-neon-magenta opacity-60 group-hover:opacity-100 transition-opacity">
              <Play className="w-5 h-5 fill-neon-magenta" />
            </div>
          </div>

          <div className="p-4 sm:p-5 flex items-center justify-between gap-4 bg-carbon/90 border-l-2 border-neon-magenta">
            <div className="font-mono text-3xl font-extrabold text-neon-magenta">
              02
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex gap-4 font-mono text-[9px] text-slate mb-1">
                <span>EP_02_CROSSOVER // SECURE TRANSMISSIONS</span>
                <span className="text-neon-magenta">YT • 25.07.2026</span>
              </div>
              <h4 className="font-display text-sm font-semibold text-white truncate">
                CONSEQUENCES — Signal Crossover Connection
              </h4>
              <div className="flex gap-2 font-mono text-[9px] text-slate mt-1 uppercase">
                <span>CREDENTIALS_SET</span>
                <span>•</span>
                <span>SEC_ACCESS</span>
              </div>
            </div>
            <div className="text-neon-magenta">
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-neon-magenta animate-pulse" />
              ) : (
                <Play className="w-5 h-5 fill-neon-magenta" />
              )}
            </div>
          </div>

          {/* Real Animated Waveform Scrub Bar player matching stylesheet precisely */}
          <div className="p-4 bg-void flex flex-col sm:flex-row items-center gap-4">
            
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-neon-magenta flex items-center justify-center cursor-pointer transition-transform duration-100 hover:scale-[1.05] active:scale-95 flex-shrink-0 cyber-glow-magenta border-none outline-none"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-white fill-white" />
              ) : (
                <Play className="w-4 h-4 text-white fill-white translate-x-0.5" />
              )}
            </button>

            {/* Clickable canvas waveform scrubbing bar */}
            <div className="flex-grow w-full h-10 relative bg-carbon/30 border border-graphite rounded-xs overflow-hidden">
              <canvas 
                ref={canvasRef} 
                onClick={handleCanvasClick}
                className="w-full h-full cursor-col-resize block"
              />
            </div>

            <div className="font-mono text-[11px] text-slate tracking-widest flex-shrink-0">
              {playerTime}
            </div>

          </div>

        </div>
      </section>

      {/* Accent controller indicator tag overlay */}
      <div className="flex justify-between items-center text-slate font-mono text-[9px] border-t border-graphite/40 pt-4">
        <span>CONSEQUENCES // WEB DESIGN PROTOCOL V1.0</span>
        <span>ACCENT: {activeAccent.toUpperCase()}</span>
      </div>

    </div>
  );
}
