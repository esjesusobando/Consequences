import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { AccentColor } from '../types';

interface PhotoEditorProps {
  accent: AccentColor;
  onLogMessage: (type: 'info' | 'ok' | 'warn' | 'err', text: string) => void;
}

// ── Types ──

interface Adjustments {
  exposure: number;
  contrast: number;
  shadows: number;
  highlights: number;
  warmth: number;
  saturation: number;
  vibrance: number;
  clarity: number;
  vignette: number;
  dof: number;
}

interface Preset {
  id: string;
  label: string;
  sub: string;
  adj: Adjustments;
}

// ── Constants ──

const DEF: Adjustments = { exposure: 0, contrast: 0, shadows: 0, highlights: 0, warmth: 0, saturation: 0, vibrance: 0, clarity: 0, vignette: 0, dof: 0 };

const PRESETS: Preset[] = [
  { id: 'none',      label: 'Original',  sub: 'Sin filtro',             adj: { ...DEF } },
  { id: 'portrait',  label: 'Portrait',  sub: 'Suave · Cálido · Bokeh', adj: { ...DEF, exposure: 0.05, contrast: 0.12, shadows: 0.25, highlights: -0.18, warmth: 18, saturation: 0.05, vibrance: 0.18, clarity: 0.10, vignette: 0.28, dof: 0.40 } },
  { id: 'lifestyle', label: 'Lifestyle', sub: 'Cinematográfico',        adj: { ...DEF, exposure: 0.02, contrast: 0.08, shadows: 0.20, highlights: -0.22, warmth: 10, saturation: -0.05, vibrance: 0.12, clarity: 0.08, vignette: 0.22, dof: 0.18 } },
  { id: 'product',   label: 'Product',   sub: 'Nítido · Limpio',        adj: { ...DEF, exposure: 0.12, contrast: 0.22, shadows: 0.08, highlights: -0.08, warmth: 2, saturation: 0.10, vibrance: 0.05, clarity: 0.25, vignette: 0.10, dof: 0 } },
  { id: 'display',   label: 'Display',   sub: 'Vibrante · HDR',         adj: { ...DEF, exposure: 0.05, contrast: 0.28, shadows: 0.05, highlights: -0.05, warmth: 0, saturation: 0.32, vibrance: 0.28, clarity: 0.18, vignette: 0.32, dof: 0 } },
];

interface SliderDef {
  key: keyof Adjustments;
  label: string;
  min: number;
  max: number;
  step: number;
}

const SLIDERS: SliderDef[] = [
  { key: 'exposure',   label: 'Exposición',   min: -1,   max: 1,   step: 0.01 },
  { key: 'contrast',   label: 'Contraste',    min: -1,   max: 1,   step: 0.01 },
  { key: 'highlights', label: 'Altas Luces',  min: -1,   max: 0,   step: 0.01 },
  { key: 'shadows',    label: 'Sombras',      min: 0,    max: 1,   step: 0.01 },
  { key: 'warmth',     label: 'Temperatura',  min: -30,  max: 30,  step: 1 },
  { key: 'saturation', label: 'Saturación',   min: -0.5, max: 0.5, step: 0.01 },
  { key: 'vibrance',   label: 'Vibración',    min: 0,    max: 0.5, step: 0.01 },
  { key: 'clarity',    label: 'Claridad',     min: 0,    max: 0.5, step: 0.01 },
  { key: 'vignette',   label: 'Viñeta',       min: 0,    max: 0.8, step: 0.01 },
  { key: 'dof',        label: 'Prof. Campo',  min: 0,    max: 1,   step: 0.01 },
];

const TAGS = ['Luz suave', 'Sombras alzadas', 'Tonos cálidos', 'Split Toning teal↔ámbar', 'DoF creativo', 'Viñeta sutil', 'Vibrance inteligente'];

function fmtVal(key: string, v: number): string {
  if (key === 'warmth') return v > 0 ? `+${v}K` : v < 0 ? `${v}K` : '0';
  if (['dof', 'vignette', 'vibrance', 'clarity'].includes(key)) return `${Math.round(v * 100)}%`;
  const p = Math.round(v * 100);
  return p > 0 ? `+${p}` : `${p}`;
}

// ── Image Processing Engine ──

const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      default: h = ((r - g) / d + 4) / 6;
    }
  }
  return [h, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) { const c = Math.round(l * 255); return [c, c, c]; }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  const f = (t: number): number => {
    t = ((t % 1) + 1) % 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [Math.round(f(h + 1 / 3) * 255), Math.round(f(h) * 255), Math.round(f(h - 1 / 3) * 255)];
}

function buildLUT(adj: Adjustments): Uint8ClampedArray {
  const lut = new Uint8ClampedArray(256);
  for (let i = 0; i < 256; i++) {
    let v = i;
    v = v * Math.pow(2, adj.exposure * 1.3);
    if (v < 128 && adj.shadows > 0) v += adj.shadows * 58 * (1 - v / 128);
    if (v > 128 && adj.highlights < 0) v += adj.highlights * 58 * ((v - 128) / 127);
    v = 128 + (v - 128) * (1 + adj.contrast * 0.9);
    lut[i] = Math.max(0, Math.min(255, Math.round(v)));
  }
  return lut;
}

function applyDoF(ctx: CanvasRenderingContext2D, w: number, h: number, strength: number) {
  const blurC = document.createElement('canvas');
  blurC.width = w; blurC.height = h;
  const bCtx = blurC.getContext('2d')!;
  bCtx.filter = `blur(${Math.round(strength * 18)}px)`;
  bCtx.drawImage(ctx.canvas, 0, 0);
  bCtx.filter = 'none';

  const maskC = document.createElement('canvas');
  maskC.width = w; maskC.height = h;
  const mCtx = maskC.getContext('2d')!;
  mCtx.drawImage(blurC, 0, 0);
  mCtx.globalCompositeOperation = 'destination-in';
  const cx = w / 2, cy = h / 2;
  const rad = Math.max(w, h) * 0.62;
  const g = mCtx.createRadialGradient(cx, cy, 0, cx, cy, rad);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(0.40, 'rgba(0,0,0,0)');
  g.addColorStop(0.70, `rgba(0,0,0,${Math.min(1, strength * 0.65).toFixed(2)})`);
  g.addColorStop(1.0, `rgba(0,0,0,${Math.min(1, strength).toFixed(2)})`);
  mCtx.fillStyle = g;
  mCtx.fillRect(0, 0, w, h);
  ctx.drawImage(maskC, 0, 0);
}

function runPipeline(canvas: HTMLCanvasElement, original: HTMLCanvasElement, adj: Adjustments) {
  const w = canvas.width, h = canvas.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  const oCtx = original.getContext('2d', { willReadFrequently: true })!;
  const imgData = oCtx.getImageData(0, 0, w, h);
  const d = imgData.data;
  const lut = buildLUT(adj);

  for (let i = 0; i < d.length; i += 4) {
    let r = lut[d[i]], g = lut[d[i + 1]], b = lut[d[i + 2]];

    if (adj.warmth !== 0) {
      r = clamp(r + adj.warmth * 0.55);
      g = clamp(g + adj.warmth * 0.09);
      b = clamp(b - adj.warmth * 0.55);
    }

    if (adj.saturation !== 0 || adj.vibrance > 0) {
      const [hh, s, l] = rgbToHsl(r, g, b);
      const ns = Math.max(0, Math.min(1, s + adj.saturation + adj.vibrance * (1 - s)));
      [r, g, b] = hslToRgb(hh, ns, l);
    }

    const lum = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
    if (lum < 0.38) {
      const t = (1 - lum / 0.38) * 0.044;
      r = clamp(r - t * 24); b = clamp(b + t * 18);
    } else if (lum > 0.62) {
      const t = ((lum - 0.62) / 0.38) * 0.044;
      r = clamp(r + t * 14); b = clamp(b - t * 11);
    }
    d[i] = r; d[i + 1] = g; d[i + 2] = b;
  }

  ctx.putImageData(imgData, 0, 0);

  if (adj.vignette > 0.005) {
    const cx = w / 2, cy = h / 2, rad = Math.hypot(cx, cy);
    const vg = ctx.createRadialGradient(cx, cy, rad * 0.30, cx, cy, rad * 1.20);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(0.52, 'rgba(0,0,0,0)');
    vg.addColorStop(1, `rgba(0,0,0,${(adj.vignette * 0.93).toFixed(2)})`);
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);
  }

  if (adj.clarity > 0.005) {
    const tmp = document.createElement('canvas');
    tmp.width = w; tmp.height = h;
    const tCtx = tmp.getContext('2d')!;
    tCtx.filter = `contrast(${(1 + adj.clarity * 0.32).toFixed(3)})`;
    tCtx.drawImage(canvas, 0, 0);
    ctx.drawImage(tmp, 0, 0);
  }

  if (adj.dof > 0.005) {
    const snap = document.createElement('canvas');
    snap.width = w; snap.height = h;
    snap.getContext('2d')!.drawImage(canvas, 0, 0);
    applyDoF(ctx, w, h, adj.dof);
  }
}

// ── SliderRow Component ──

interface SliderRowProps {
  def: SliderDef;
  value: number;
  accent: AccentColor;
  isChanged: boolean;
  onChange: (key: keyof Adjustments, value: number) => void;
}

function SliderRow({ def, value, accent, isChanged, onChange }: SliderRowProps) {
  const s = def;
  const pct = ((value - s.min) / (s.max - s.min)) * 100;
  const isBi = s.min < 0;
  const fillL = isBi ? (value >= 0 ? 50 : pct) : 0;
  const fillW = isBi ? (value >= 0 ? pct - 50 : 50 - pct) : pct;

  const accentMap: Record<string, string> = {
    cyan: '#00F0FF', magenta: '#FF2E9A', lime: '#C6FF3D', amber: '#FFB400',
  };
  const accentColor = accentMap[accent] || '#00F0FF';

  return (
    <div className="mb-5 last:mb-0">
      <div className="flex justify-between items-baseline mb-2">
        <span className={`text-[11px] font-mono tracking-wide transition-colors duration-150 ${isChanged ? 'text-bone' : 'text-ash'}`}>
          {s.label}
        </span>
        <span className={`text-[10px] font-mono tabular-nums transition-colors duration-150 min-w-[36px] text-right ${isChanged ? 'text-signal-cyan' : 'text-ash'}`}>
          {fmtVal(s.key, value)}
        </span>
      </div>
      <div className="relative h-5 flex items-center">
        <div className="absolute left-0 right-0 h-[3px] rounded-full overflow-visible photo-editor-slider" style={{ background: '#12161F' }}>
          <div
            className="absolute h-full rounded-full transition-colors duration-150 pointer-events-none photo-editor-slider-fill"
            style={{
              left: `${fillL}%`,
              width: `${Math.max(0, fillW)}%`,
              background: isChanged ? accentColor : '#12161F',
            }}
          />
          {isBi && <div className="absolute left-1/2 top-1/2 w-[1px] h-[7px] bg-graphite -translate-x-1/2 -translate-y-1/2 pointer-events-none" />}
          <div
            className="absolute top-1/2 w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-150 photo-editor-slider-thumb"
            style={{
              left: `${pct}%`,
              background: isChanged ? accentColor : '#1A1F2E',
              border: isChanged ? `1.5px solid ${accentColor}66` : '1.5px solid #1E2433',
              boxShadow: isChanged ? `0 0 0 3px ${accentColor}2E` : 'none',
            }}
          />
          <input
            type="range"
            min={s.min}
            max={s.max}
            step={s.step}
            value={value}
            onChange={(e) => onChange(s.key, parseFloat(e.target.value))}
            className="absolute w-full h-full opacity-0 cursor-pointer top-0 left-0 m-0"
          />
        </div>
      </div>
    </div>
  );
}

// ── Main PhotoEditor Component ──

export default function PhotoEditor({ accent, onLogMessage }: PhotoEditorProps) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [adj, setAdj] = useState<Adjustments>({ ...DEF });
  const [preset, setPreset] = useState<string>('none');
  const [before, setBefore] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const cvRef = useRef<HTMLCanvasElement>(null);
  const ovRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number>(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const hasChanged = Object.keys(DEF).some((k) => adj[k as keyof Adjustments] !== DEF[k as keyof Adjustments]);
  const hasImage = img !== null;

  // Init canvases when image loads
  useEffect(() => {
    if (!img || !cvRef.current || !ovRef.current) return;
    const MAX = 840;
    const scale = Math.min(1, MAX / img.naturalWidth, (MAX * 0.7) / img.naturalHeight);
    const w = Math.round(img.naturalWidth * scale);
    const h = Math.round(img.naturalHeight * scale);

    if (imgRef.current !== img || cvRef.current.width !== w || cvRef.current.height !== h) {
      imgRef.current = img;
      cvRef.current.width = ovRef.current.width = w;
      cvRef.current.height = ovRef.current.height = h;
      ovRef.current.getContext('2d')!.drawImage(img, 0, 0, w, h);
    }
    render();
  }, [img]);

  // Render when adj or before changes
  useEffect(() => {
    if (!img) return;
    render();
  }, [adj, before, img]);

  function render() {
    if (!img || !cvRef.current || !ovRef.current) return;
    const cv = cvRef.current;
    const ov = ovRef.current;
    const ctx = cv.getContext('2d')!;

    if (before) {
      ctx.drawImage(ov, 0, 0);
      return;
    }

    cancelAnimationFrame(rafRef.current);
    let alive = true;
    rafRef.current = requestAnimationFrame(() => {
      if (!alive) return;
      try {
        runPipeline(cv, ov, adj);
      } catch (err) {
        console.warn('Pipeline error:', err);
        ctx.drawImage(ov, 0, 0);
      }
    });
    const cancel = () => { alive = false; };
    (render as any)._cancel = cancel;
  }

  // Cleanup render on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (typeof (render as any)._cancel === 'function') (render as any)._cancel();
    };
  }, []);

  const loadFile = useCallback((file: File) => {
    if (!file?.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const i = new Image();
      i.onload = () => {
        setImg(i);
        imgRef.current = null;
        onLogMessage('ok', `Imagen cargada: ${file.name} (${i.naturalWidth}×${i.naturalHeight})`);
      };
      i.src = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  }, [onLogMessage]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) loadFile(e.target.files[0]);
  }, [loadFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]);
  }, [loadFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragOver(false), []);

  const handleSliderChange = useCallback((key: keyof Adjustments, value: number) => {
    setAdj((prev) => ({ ...prev, [key]: value }));
    setPreset('none');
  }, []);

  const pickPreset = useCallback((p: Preset) => {
    setPreset(p.id);
    setAdj({ ...p.adj });
  }, []);

  const toggleBefore = useCallback(() => setBefore((b) => !b), []);

  const handleReset = useCallback(() => {
    pickPreset(PRESETS[0]);
    onLogMessage('info', 'Editor de foto restablecido al estado original');
  }, [pickPreset, onLogMessage]);

  const handleSave = useCallback(() => {
    if (!cvRef.current || !img) return;
    const a = document.createElement('a');
    a.download = 'zero-consequences-edit.png';
    a.href = cvRef.current.toDataURL('image/png', 1);
    a.click();
    onLogMessage('ok', 'Imagen editada descargada como PNG');
  }, [img, onLogMessage]);

  return (
    <div className="flex-1 flex overflow-hidden bg-[#090B10] text-bone font-sans select-none">
      <style>{`
        input[type=range] { -webkit-appearance: none; appearance: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; }
      `}</style>

      {/* LEFT: Preview */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <div className="h-12 flex items-center px-5 gap-2.5 border-b border-graphite/45 shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00F0FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
            <line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/>
            <line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/>
          </svg>
          <span className="font-bold tracking-tight text-[15px]">Photo</span>
          <span className="text-ash tracking-tight text-[15px]">Editor</span>
        </div>

        {/* Canvas zone */}
        <div
          className={`flex-1 flex items-center justify-center p-8 relative overflow-hidden transition-colors duration-400 ${before ? 'bg-[#111]' : 'bg-[#090B10]'}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {!hasImage ? (
            <div
              className={`w-full h-full flex flex-col items-center justify-center border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200
                ${dragOver ? 'border-signal-cyan bg-signal-cyan/5' : 'border-graphite/70 hover:border-graphite hover:bg-carbon/30'}`}
              onClick={() => fileRef.current?.click()}
            >
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#5C6378" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.55, marginBottom: 18 }}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <p className="text-[17px] font-medium tracking-tight mb-2">Arrastra tu foto aquí</p>
              <p className="text-ash text-[13px] font-mono mb-6">JPG · PNG · WEBP · HEIC</p>
              <button className="px-6 py-2.5 bg-signal-cyan text-[#090B10] rounded-xl text-[13px] font-semibold tracking-tight border-none cursor-pointer hover:brightness-110 transition-all">
                Seleccionar imagen
              </button>
            </div>
          ) : (
            <>
              <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 pointer-events-none bg-[#090B10]/80 backdrop-blur-md text-ash px-3.5 py-1 rounded-full text-[10px] tracking-wider uppercase font-semibold border border-graphite whitespace-nowrap font-mono">
                {before ? '◁ ORIGINAL' : '✦ EDITADO'}
              </div>
              <canvas ref={cvRef} className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" />
              <canvas ref={ovRef} style={{ display: 'none' }} />
            </>
          )}
        </div>

        {/* Bottom bar */}
        {hasImage && (
          <div className="flex items-center gap-2 px-5 py-3 border-t border-graphite/45 shrink-0">
            <button
              onClick={toggleBefore}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-mono border transition-all cursor-pointer
                ${before ? 'bg-signal-amber/12 border-signal-amber text-signal-amber font-semibold' : 'border-graphite text-ash hover:border-steel hover:text-bone bg-transparent'}`}
            >
              {before ? '▶ Ver editada' : '◁ Ver original'}
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="px-3 py-1.5 rounded-lg text-[11px] font-mono border border-graphite text-ash hover:border-steel hover:text-bone bg-transparent cursor-pointer transition-all"
            >
              Cambiar foto
            </button>
            <div className="ml-auto">
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-lg text-[12px] font-bold tracking-tight border-none cursor-pointer transition-all"
                style={{ background: '#C6FF3D', color: '#090B10' }}
              >
                ↓ Descargar PNG
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: Panel */}
      <div className="w-[280px] border-l border-graphite/45 bg-[#090B10] flex flex-col overflow-y-auto shrink-0">
        {/* Principles */}
        <div className="px-4 py-3.5 border-b border-graphite/25 bg-signal-cyan/[0.03]">
          <span className="block text-[9px] text-signal-cyan tracking-wider uppercase font-semibold mb-2.5 font-mono">Principios de Calidad</span>
          <div className="flex flex-wrap gap-1.5">
            {TAGS.map((t) => (
              <span key={t} className="bg-signal-cyan/[0.07] border border-signal-cyan/[0.18] rounded px-2 py-0.5 text-[9px] text-signal-cyan/80 font-mono">{t}</span>
            ))}
          </div>
        </div>

        {/* Presets */}
        <div className="px-4 py-3.5 border-b border-graphite/25">
          <span className="block text-[9px] text-ash tracking-wider uppercase font-bold mb-3 font-mono">Estilos Rápidos</span>
          <div className="grid grid-cols-3 gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => pickPreset(p)}
                className={`text-center px-2 py-2.5 rounded-xl cursor-pointer transition-all outline-none
                  ${preset === p.id ? 'bg-signal-cyan/12 border-signal-cyan text-signal-cyan' : 'bg-carbon border-graphite/70 text-bone hover:bg-steel/20 hover:border-steel'}
                  border`}
              >
                <span className="block text-[10px] font-bold tracking-tight">{p.label}</span>
                <span className={`block text-[8px] mt-1 leading-tight font-mono ${preset === p.id ? 'text-signal-cyan/80' : 'text-ash'}`}>{p.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div className="flex-1 px-4 py-3.5 overflow-y-auto">
          <span className="block text-[9px] text-ash tracking-wider uppercase font-bold mb-3 font-mono">Ajustes Manuales</span>
          {SLIDERS.map((s) => (
            <SliderRow
              key={s.key}
              def={s}
              value={adj[s.key]}
              accent={accent}
              isChanged={adj[s.key] !== DEF[s.key]}
              onChange={handleSliderChange}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-3.5 border-t border-graphite/25">
          <button
            onClick={handleReset}
            className="w-full bg-carbon border border-graphite/70 rounded-lg text-ash py-2 text-[11px] cursor-pointer transition-all hover:bg-steel/20 hover:text-bone font-mono"
          >
            Restablecer todo
          </button>
          <p className="text-center text-ash/15 text-[8px] mt-3 tracking-wide leading-relaxed font-mono">
            Zero Consequences Photo Editor<br />Canvas API · Split Toning · Bokeh Sim
          </p>
        </div>
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
    </div>
  );
}
