import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Image as ImageIcon, 
  Sliders, 
  Palette,
  Music,
  Check,
  Star,
  Layout,
  Save,
  Trash2,
  FolderOpen,
  ArrowLeftRight
} from 'lucide-react';
import { PresentationConfig, AccentColor } from '../types';
import { BACKGROUND_PRESETS, AMBIENT_TRACKS } from '../personalOsData';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: PresentationConfig;
  setConfig: React.Dispatch<React.SetStateAction<PresentationConfig>>;
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
  onLogMessage: (type: 'info' | 'ok' | 'warn' | 'err', text: string) => void;
}

export default function SettingsDrawer({
  isOpen,
  onClose,
  config,
  setConfig,
  accent,
  setAccent,
  onLogMessage,
}: SettingsDrawerProps) {
  // Manage recent background images with pinned favorites
  const [recentImages, setRecentImages] = useState<Array<{ url: string; isFavorite: boolean; name: string }>>(() => {
    try {
      const saved = localStorage.getItem('sota_recent_images');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(img => img && typeof img === 'object' && img.url);
        }
      }
    } catch (e) {
      console.error(e);
    }
    return [
      { url: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1200&q=80", isFavorite: true, name: "Editorial Charcoal" },
      { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80", isFavorite: false, name: "Desarrollo Grid" },
      { url: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1200&q=80", isFavorite: false, name: "Matriz Neón" }
    ];
  });

  // Manage saved custom Workspace layouts
  const [savedWorkspaces, setSavedWorkspaces] = useState<Array<{ id: string, name: string, config: any, accent: AccentColor }>>(() => {
    const saved = localStorage.getItem('sota_saved_workspaces');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'preset-sota',
        name: 'Producción SOTA',
        accent: 'cyan' as AccentColor,
        config: {
          backgroundImage: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1200&q=80",
          backdropBlur: 10,
          overlayOpacity: 0.15,
          audioLoop: 'synth-pad',
          volume: 25,
          isPlayingSound: false,
          panelsSwapped: false,
          sidebarWidth: 384,
          themeMode: 'dark'
        }
      },
      {
        id: 'preset-minimal',
        name: 'Workspace Zen',
        accent: 'tokyo' as AccentColor,
        config: {
          backgroundImage: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1200&q=80",
          backdropBlur: 15,
          overlayOpacity: 0.05,
          audioLoop: 'wave-sync',
          volume: 0,
          isPlayingSound: false,
          panelsSwapped: false,
          sidebarWidth: 280,
          themeMode: 'dark'
        }
      }
    ];
  });

  const [newWorkspaceName, setNewWorkspaceName] = useState('');

  useEffect(() => {
    if (isOpen) {
      localStorage.setItem('sota_recent_images', JSON.stringify(recentImages));
    }
  }, [recentImages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      localStorage.setItem('sota_saved_workspaces', JSON.stringify(savedWorkspaces));
    }
  }, [savedWorkspaces, isOpen]);

  // Synchronize new backgrounds selected or uploaded into recent images list
  useEffect(() => {
    if (!config.backgroundImage) return;
    setRecentImages(prev => {
      const safePrev = Array.isArray(prev) ? prev.filter(Boolean) : [];
      if (safePrev.some(img => img && img.url === config.backgroundImage)) {
        return safePrev;
      }
      const isPreset = BACKGROUND_PRESETS.some(p => p && p.url === config.backgroundImage);
      const name = config.backgroundImage.startsWith('data:') 
        ? 'Imagen Local PC' 
        : isPreset 
          ? BACKGROUND_PRESETS.find(p => p && p.url === config.backgroundImage)?.name || 'Preset' 
          : 'Fondo Externo';

      // Filter and keep maximum of 8 entries, prioritizing favorites
      const favorites = safePrev.filter(img => img && img.isFavorite);
      const nonFavorites = safePrev.filter(img => img && !img.isFavorite).slice(0, 5);
      return [{ url: config.backgroundImage, isFavorite: false, name }, ...favorites, ...nonFavorites].slice(0, 10);
    });
  }, [config.backgroundImage]);

  const toggleFavoriteImage = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentImages(prev => {
      const safePrev = Array.isArray(prev) ? prev.filter(Boolean) : [];
      return safePrev.map(img => img.url === url ? { ...img, isFavorite: !img.isFavorite } : img);
    });
    onLogMessage('ok', 'Favorito ambiental actualizado.');
  };

  const handleSaveWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;
    
    const newWs = {
      id: `WS-${Date.now()}`,
      name: newWorkspaceName.trim(),
      accent: accent,
      config: { ...config }
    };
    
    setSavedWorkspaces(prev => [newWs, ...prev]);
    onLogMessage('ok', `Espacio de distribución guardado: "${newWs.name}"`);
    setNewWorkspaceName('');
  };

  const handleApplyWorkspace = (ws: any) => {
    setConfig({
      ...config,
      ...ws.config
    });
    setAccent(ws.accent);
    onLogMessage('ok', `Espacio de trabajo restaurado: "${ws.name}"`);
  };

  const handleDeleteWorkspace = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedWorkspaces(prev => prev.filter(ws => ws.id !== id));
    onLogMessage('warn', `Se purgó la distribución de espacio seleccionada.`);
  };

  if (!isOpen) return null;

  const handleSelectBgPreset = (url: string, name: string) => {
    setConfig(prev => ({ ...prev, backgroundImage: url }));
    onLogMessage('ok', `Fondo de pantalla actualizado a preset: ${name}`);
  };

  const handleSelectTrack = (trackId: string, name: string) => {
    setConfig(prev => ({ ...prev, audioLoop: trackId }));
    onLogMessage('info', `Pista de audio ambiental actualizada: ${name.toUpperCase()}`);
  };

  // Color circles definitions
  const colors: Array<{ id: AccentColor; label: string; class: string; textClass: string }> = [
    { id: 'cyan', label: 'Cian Radical', class: 'bg-signal-cyan', textClass: 'text-signal-cyan' },
    { id: 'magenta', label: 'Megapíxel Magenta', class: 'bg-signal-magenta', textClass: 'text-signal-magenta' },
    { id: 'lime', label: 'Lima Eléctrico', class: 'bg-signal-lime', textClass: 'text-signal-lime' },
    { id: 'amber', label: 'Ámbar Intenso', class: 'bg-signal-amber', textClass: 'text-signal-amber' },
    { id: 'tokyo', label: 'Tokyo Cappuccino', class: 'bg-[#d4b395]', textClass: 'text-[#d4b395]' },
    { id: 'custom', label: 'HSL Personalizado', class: 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500', textClass: 'text-signal-cyan' }
  ];

  return (
    <>
      {/* Dark overlay backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-void/60 backdrop-blur-sm z-50 transition-opacity duration-300 pointer-events-auto"
      />

      {/* Slide-out Panel */}
      <div 
        id="settings-ambient-drawer"
        className="fixed top-0 right-0 h-full w-[380px] max-w-full bg-[#090D16]/95 border-l border-graphite/50 shadow-2xl z-50 flex flex-col transition-all duration-300 custom-scrollbar select-none text-bone"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-graphite/30 flex items-center justify-between bg-carbon/25">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-signal-cyan" />
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-bone">
                PANEL DE PERSONALIZACIÓN
              </h2>
              <p className="text-[9px] text-slate uppercase font-mono">Ajustes Generales de Ambiente</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-carbon text-slate hover:text-bone rounded transition-colors"
            title="Cerrar Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable controls list */}
        <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-6 custom-scrollbar text-xs">
          
          {/* SECCIÓN 0: MODO DE DISEÑO (Trivi / Criteria NeoCraft) */}
          <div className="flex flex-col gap-3 border-b border-graphite/20 pb-5">
            <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#00F0FF] flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              0. Firma & Modo De Diseño Relativo
            </h3>
            <p className="text-[10px] text-slate uppercase leading-tight font-mono">
              Intercambia la firma de materiales y el contraste ambiental:
            </p>

            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                type="button"
                onClick={() => {
                  setConfig(prev => ({ ...prev, themeMode: 'dark' }));
                  onLogMessage('info', 'Firma visual: MODO OSCURO COGNOS reactivado.');
                }}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                  (config.themeMode ?? 'dark') === 'dark' 
                    ? 'border-signal-cyan bg-signal-cyan/10 font-bold' 
                    : 'border-graphite/40 bg-void/35 hover:border-graphite'
                }`}
              >
                <div className="w-5 h-5 rounded bg-[#04060A] border border-[#1E2435] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00F0FF]" />
                </div>
                <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-bone mt-1">
                  COGNOS OSCURO
                </span>
                <span className="text-[7.5px] font-mono uppercase text-[#7A839E]">
                  CYBERPUNK SOTA
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setConfig(prev => ({ ...prev, themeMode: 'light_neocraft' }));
                  onLogMessage('ok', 'Firma visual: MODO CLARO TRIVI™ (Criteria NeoCraft) activado.');
                }}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                  config.themeMode === 'light_neocraft' 
                    ? 'border-signal-cyan bg-signal-cyan/10 font-bold' 
                    : 'border-graphite/40 bg-void/35 hover:border-graphite'
                }`}
              >
                <div className="w-5 h-5 rounded bg-[#F8F9FB] border border-[#E8EBF0] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#156BFF]" />
                </div>
                <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-bone mt-1">
                  CLARO TRIVI™
                </span>
                <span className="text-[7.5px] font-mono uppercase text-[#7A839E]">
                  CRITERIA NEOCRAFT
                </span>
              </button>
            </div>
          </div>
          
          {/* SECCIÓN 1: COLORES DE ACENTO */}
          <div className="flex flex-col gap-3 border-b border-graphite/20 pb-5">
            <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#FFB400] flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" />
              1. Color de Acento del Sistema
            </h3>
            <p className="text-[10px] text-slate uppercase leading-tight font-mono">
              Seleccione la gama cromática primaria para el panel operacional:
            </p>

            <div className="grid grid-cols-2 gap-2 mt-1">
              {colors.map((color) => {
                const isSelected = accent === color.id;
                return (
                  <button
                    key={color.id}
                    onClick={() => {
                      setAccent(color.id);
                      onLogMessage('ok', `Acento visual modificado a: ${color.id.toUpperCase()}`);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                      isSelected 
                        ? 'border-white bg-white/5 font-bold' 
                        : 'border-graphite/40 bg-void/30 hover:border-graphite'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${color.class} flex items-center justify-center`}>
                      {isSelected && <Check className="w-2 h-2 text-void" />}
                    </span>
                    <span className={`text-[10px] font-mono leading-none ${color.textClass}`}>
                      {color.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {accent === 'custom' && (
              <div className="mt-4 bg-void/75 border border-graphite/60 p-3.5 rounded-xl flex flex-col gap-3.5 animate-fade-in">
                <span className="font-mono text-[8.5px] text-signal-cyan uppercase font-bold tracking-widest block border-b border-graphite/40 pb-1.5">
                  // CONFIGURADOR HSL INTERACTIVO:
                </span>
                
                {/* Hue (H) */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-[9px] font-mono text-bone uppercase">
                    <span>Hue (Color canónico):</span>
                    <span style={{ color: `hsl(${config.customH ?? 180}, 100%, 55%)` }} className="font-bold">
                      {config.customH ?? 180}°
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="360" 
                    value={config.customH ?? 180}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setConfig(prev => ({ ...prev, customH: val }));
                    }}
                    className="w-full h-2 rounded cursor-pointer appearance-none outline-none"
                    style={{
                      background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
                    }}
                  />
                </div>

                {/* Saturation (S) */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-[9px] font-mono text-bone uppercase">
                    <span>Saturación (Intensidad):</span>
                    <span className="font-bold text-slate">{config.customS ?? 100}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={config.customS ?? 100}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setConfig(prev => ({ ...prev, customS: val }));
                    }}
                    className="w-full accent-signal-cyan cursor-pointer"
                  />
                </div>

                {/* Lightness (L) */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-[9px] font-mono text-bone uppercase">
                    <span>Luminosidad (Nitidez):</span>
                    <span className="font-bold text-slate">{config.customL ?? 50}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="15" 
                    max="85" 
                    value={config.customL ?? 50}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setConfig(prev => ({ ...prev, customL: val }));
                    }}
                    className="w-full accent-signal-cyan cursor-pointer"
                  />
                </div>

                {/* Active HSL String Stamp */}
                <div className="flex items-center gap-2.5 mt-1 bg-[#131826]/40 p-2 rounded-lg border border-graphite/40">
                  <div 
                    className="w-4 h-4 rounded-full border border-bone/35 flex-shrink-0"
                    style={{ backgroundColor: `hsl(${config.customH ?? 180}, ${config.customS ?? 100}%, ${config.customL ?? 50}%)` }}
                  />
                  <span className="font-mono text-[8px] text-bone uppercase tracking-wider">
                    VAL: HSL({config.customH ?? 180}, {config.customS ?? 100}%, {config.customL ?? 50}%)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* SECCIÓN 2: PISTAS DE AUDIO */}
          <div className="flex flex-col gap-3 border-b border-graphite/20 pb-5">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest text-signal-magenta flex items-center gap-1.5 font-bold">
                <Music className="w-3.5 h-3.5" />
                2. SINTETIZADOR DE FOCAL OS
              </h3>
              <button 
                onClick={() => setConfig(prev => ({ ...prev, isPlayingSound: !prev.isPlayingSound }))}
                className={`p-1 px-2 text-[9px] font-mono font-bold uppercase rounded transition-all flex items-center gap-1 border ${
                  config.isPlayingSound 
                    ? 'bg-signal-magenta/10 text-signal-magenta border-signal-magenta/35 glow-magenta/5' 
                    : 'bg-carbon/45 text-slate border-transparent hover:text-bone'
                }`}
              >
                {config.isPlayingSound ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                {config.isPlayingSound ? 'Ambient: On' : 'Ambient: Off'}
              </button>
            </div>

            <div className="flex flex-col gap-2 mt-1">
              {AMBIENT_TRACKS.map((track) => {
                const isActive = config.audioLoop === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => handleSelectTrack(track.id, track.name)}
                    className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-all ${
                      isActive 
                        ? 'border-signal-magenta bg-[#FF2E9A]/5' 
                        : 'border-graphite/20 bg-void/30 hover:border-graphite/80'
                    }`}
                  >
                    <div>
                      <div className="text-[10px] font-bold text-bone flex items-center gap-1.5 font-mono uppercase">
                        {isActive && <span className="w-1.5 h-1.5 bg-signal-magenta rounded-full animate-ping" />}
                        {track.name}
                      </div>
                      <span className="text-[8px] text-slate font-mono uppercase block">{track.desc}</span>
                    </div>
                    <span className="text-[8px] font-mono text-slate">{track.duration}</span>
                  </div>
                );
              })}
            </div>

            {/* Volume control */}
            <div className="flex flex-col gap-1 mt-1">
              <div className="flex justify-between text-[10px] font-mono text-slate">
                <span>VOLUMEN GLOBAL ACÚSTICO:</span>
                <span>{config.volume}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={config.volume}
                onChange={(e) => setConfig(prev => ({ ...prev, volume: Number(e.target.value) }))}
                className="w-full accent-signal-magenta cursor-pointer"
              />
            </div>
          </div>

          {/* SECCIÓN 3: IMAGEN DE FONDO AMBIENTAL Y VISUALIZACIÓN */}
          <div className="flex flex-col gap-3 border-b border-graphite/20 pb-5">
            <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#00F0FF] flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              3. Imagen de Fondo y Previsualización
            </h3>
            
            <p className="text-[10px] text-slate uppercase leading-tight font-mono">
              Sube una fotografía o escoge del historial reciente de tu estación de trabajo:
            </p>

            {/* Custom PC Upload Field */}
            <div className="flex flex-col gap-3 bg-void/50 border border-graphite/40 p-3.5 rounded-xl">
              <label 
                htmlFor="bg-image-upload"
                className="flex flex-col items-center justify-center border border-dashed border-graphite/60 hover:border-signal-cyan/50 bg-[#131826]/30 hover:bg-[#131826]/60 p-4 rounded-lg cursor-pointer transition-all text-center select-none"
              >
                <ImageIcon className="w-5 h-5 text-signal-cyan mb-1.5 animate-pulse" />
                <span className="text-[10px] font-mono text-bone uppercase hover:text-signal-cyan font-bold transition-colors">
                  Seleccionar Imagen de tu PC
                </span>
                <span className="text-[8px] text-slate uppercase mt-1 font-mono">
                  PNG, JPG, WEBP, GIF
                </span>
              </label>
              <input 
                type="file"
                id="bg-image-upload"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const base64 = event.target?.result as string;
                      if (base64) {
                        setConfig(prev => ({ ...prev, backgroundImage: base64 }));
                        onLogMessage('ok', `Fondo personalizado cargado desde tu PC: ${file.name}`);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />

              {/* HISTORIAL RECIENTE Y PREVIAS (LAST 3 IMAGES & PANELS) */}
              <div className="flex flex-col gap-2 mt-1 border-t border-graphite/15 pt-2.5">
                <span className="font-mono text-[8px] text-slate uppercase tracking-wider block">
                  // HISTORIAL RECIENTE (Últimos fondos y favoritos):
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {recentImages.filter(img => img && img.url).slice(0, 6).map((img, index) => {
                    const isActive = config.backgroundImage === img.url;
                    return (
                      <div 
                        key={`${img.url}-${index}`}
                        onClick={() => {
                          setConfig(prev => ({ ...prev, backgroundImage: img.url }));
                          onLogMessage('ok', `Fondo restablecido desde historial: ${img.name || 'Fondo'}`);
                        }}
                        className={`relative aspect-[1.3] rounded-lg overflow-hidden border cursor-pointer transition-all ${
                          isActive 
                            ? 'border-signal-cyan shadow-lg scale-105 z-10' 
                            : 'border-graphite/55 hover:border-slate hover-bg-stone'
                        }`}
                        title={img.name || 'Fondo'}
                      >
                        <img 
                          src={img.url} 
                          alt={img.name || 'Fondo'} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {/* Favorite button toggler */}
                        <button
                          onClick={(e) => toggleFavoriteImage(img.url, e)}
                          className="absolute top-1 right-1 p-0.5 rounded-full bg-void/65 hover:bg-void/90 transition-all text-bone"
                          title="Fijar Favorito"
                        >
                          <Star className={`w-3 h-3 ${img.isFavorite ? 'text-[#FFB400] fill-[#FFB400]' : 'text-slate'}`} />
                        </button>
                        {/* Quick preview label stamp */}
                        <div className="absolute bottom-0 inset-x-0 bg-void/60 py-0.5 px-1 truncate text-[6.5px] text-bone font-mono text-center">
                          {img.name || 'Fondo'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {config.backgroundImage && (
                <div className="flex flex-col gap-3 border-t border-graphite/20 pt-3">
                  <div className="flex items-center justify-between bg-void/80 border border-graphite/20 p-2 rounded text-[9px]">
                    <span className="font-mono text-slate text-[8px] uppercase truncate max-w-[180px]">
                      {config.backgroundImage.startsWith('data:') ? '✓ Imagen Local Base64' : '✓ Imagen de Portada Activa'}
                    </span>
                    <button
                      onClick={() => {
                        setConfig(prev => ({ ...prev, backgroundImage: '' }));
                        onLogMessage('info', 'Fondo ambiental deshabilitado.');
                      }}
                      className="text-signal-magenta hover:underline text-[8.5px] font-mono font-bold uppercase cursor-pointer"
                    >
                      Remover
                    </button>
                  </div>

                  {/* SLIDER DETALLE: ENFOQUE (BLUR) */}
                  <div className="flex flex-col gap-1 mt-1 border-t border-graphite/10 pt-2">
                    <div className="flex justify-between items-center text-[9px] font-mono text-bone uppercase">
                      <span>NIVEL DE ENFOQUE (BLUR DE FONDO):</span>
                      <span className="text-signal-cyan font-bold">{config.backdropBlur}PX</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="30" 
                      value={config.backdropBlur}
                      onChange={(e) => setConfig(prev => ({ ...prev, backdropBlur: Number(e.target.value) }))}
                      className="w-full accent-signal-cyan cursor-pointer"
                    />
                  </div>

                  {/* SLIDER DETALLE: INTENSIDAD / VISIBILIDAD */}
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex justify-between items-center text-[9px] font-mono text-bone uppercase">
                      <span>BRILLO / EXPOSICIÓN (OPACIDAD):</span>
                      <span className="text-[#FFB400] font-bold">{Math.round((config.overlayOpacity ?? 0.12) * 100)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      step="5"
                      value={Math.round((config.overlayOpacity ?? 0.12) * 100)}
                      onChange={(e) => {
                        const scoreNum = Number(e.target.value) / 100;
                        setConfig(prev => ({ ...prev, overlayOpacity: scoreNum }));
                      }}
                      className="w-full accent-[#FFB400] cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SECCIÓN 4: ESPACIOS DE TRABAJO ESTILO PHOTOSHOP */}
          <div className="flex flex-col gap-3 pb-4">
            <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest text-signal-lime flex items-center gap-1.5">
              <Layout className="w-3.5 h-3.5" />
              4. Panel de Distribución (Estilo Photoshop)
            </h3>
            
            <p className="text-[10px] text-slate uppercase leading-tight font-mono">
              Personaliza la orientación, proporciones y visibilidad de los paneles a tu gusto:
            </p>

            <div className="flex flex-col gap-3.5 bg-void/50 border border-graphite/40 p-3.5 rounded-xl">
              {/* Width modifier range slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[9px] font-mono text-bone uppercase">
                  <span>Ancho de Agenda Sidebar:</span>
                  <span className="font-bold text-signal-cyan">{config.sidebarWidth ?? 384}px</span>
                </div>
                <input 
                  type="range" 
                  min="260" 
                  max="460" 
                  value={config.sidebarWidth ?? 384}
                  onChange={(e) => {
                    const widthVal = Number(e.target.value);
                    setConfig(prev => ({ ...prev, sidebarWidth: widthVal }));
                  }}
                  className="w-full accent-signal-cyan cursor-pointer"
                />
              </div>

              {/* Panel direction toggler slider */}
              <div className="flex items-center justify-between border-t border-b border-graphite/20 py-2.5">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono font-bold uppercase text-bone">Invertir Distribución Lateral</span>
                  <span className="text-[8px] text-slate font-mono uppercase">Intercambiar posición izquierda ⇆ derecha</span>
                </div>
                <button
                  onClick={() => {
                    const nextVal = !config.panelsSwapped;
                    setConfig(prev => ({ ...prev, panelsSwapped: nextVal }));
                    onLogMessage('info', `Distribución invertida: Sidebar de agenda a la ${nextVal ? 'IZQUIERDA' : 'DERECHA'}`);
                  }}
                  className={`p-1.5 rounded-lg border transition-all ${
                    config.panelsSwapped 
                      ? 'bg-signal-cyan/10 border-signal-cyan text-signal-cyan' 
                      : 'border-graphite/60 text-slate hover:text-bone hover:border-ash/50'
                  }`}
                  title="Cambiar orientación de paneles"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
              </div>

              {/* Save current distribution form */}
              <form onSubmit={handleSaveWorkspace} className="flex flex-col gap-2 mt-1">
                <span className="font-mono text-[8px] text-slate uppercase tracking-wider block">
                  // GUARDAR ESTADO DE LA ESTACIÓN:
                </span>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    placeholder="Ej: Foco Extremo..."
                    className="flex-1 bg-[#04060A] border border-graphite focus:border-signal-lime outline-none rounded px-2.5 py-1.5 text-bone font-mono text-[10px]"
                    required
                  />
                  <button 
                    type="submit"
                    className="px-3 bg-signal-lime text-void hover:bg-signal-lime/90 font-mono font-bold uppercase text-[9px] rounded flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" /> Guardar
                  </button>
                </div>
              </form>

              {/* List of presets and saved workspaces */}
              <div className="flex flex-col gap-2 mt-1 border-t border-graphite/15 pt-2.5">
                <span className="font-mono text-[8px] text-slate uppercase tracking-wider block">
                  // SELECCIONE ESPACIO OPERATIVO:
                </span>
                <div className="flex flex-col gap-1.5">
                  {savedWorkspaces.map((ws) => (
                    <div 
                      key={ws.id}
                      onClick={() => handleApplyWorkspace(ws)}
                      className="group flex items-center justify-between p-2 bg-[#0c101b] border border-graphite/45 rounded-lg cursor-pointer hover:border-slate/60 hover:bg-carbon/40 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ws.accent === 'tokyo' ? '#d4b395' : ws.accent === 'custom' ? 'hsl(180,100%,50%)' : `var(--color-signal-${ws.accent})` }} />
                        <span className="font-mono text-[10px] font-bold text-bone uppercase">{ws.name}</span>
                      </div>
                      <div className="flex items-center gap-1 pb-0.5">
                        <span className="text-[7.5px] font-mono text-slate uppercase opacity-80 group-hover:opacity-100 transition-opacity">Acento: {ws.accent.toUpperCase()}</span>
                        {ws.id !== 'preset-sota' && ws.id !== 'preset-minimal' && (
                          <button
                            onClick={(e) => handleDeleteWorkspace(ws.id, e)}
                            className="p-1 rounded-full text-slate hover:text-signal-magenta hover:bg-signal-magenta/15 ml-1 transition-all"
                            title="Eliminar Espacio"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Drawer Footer info details */}
        <div className="p-4 border-t border-graphite/35 bg-[#04060C] text-center">
          <span className="text-[8.5px] font-mono tracking-widest text-slate uppercase flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-signal-cyan animate-pulse" />
            PERSONAL OS CORE v1 — DESIGN SYNCED
          </span>
        </div>

      </div>
    </>
  );
}
