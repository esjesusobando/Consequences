'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

interface Service {
  title: string;
  titleEs: string;
  items: string[];
  itemsEs: string[];
}

const servicesData: Service[] = [
  {
    title: 'Office Furniture Installation',
    titleEs: 'Instalación de Muebles',
    items: ['Desks & workstations', 'Cubicles', 'Conference tables', 'Chairs & storage units'],
    itemsEs: ['Escritorios y estaciones', 'Cubículos', 'Mesas de conferencia', 'Sillas y almacenamiento'],
  },
  {
    title: 'Office Setup & Reconfiguration',
    titleEs: 'Configuración y Rediseño',
    items: ['New Office Set up', 'Workstation Reconfiguration', 'Full furniture rearrangement'],
    itemsEs: ['Nueva instalación de oficina', 'Reconfiguración de estaciones', 'Reubicación completa de muebles'],
  },
  {
    title: 'Disassembly & Moving',
    titleEs: 'Desmontaje y Traslado',
    items: ['Safe disassembly', 'Relocation', 'Reinstallation'],
    itemsEs: ['Desmontaje seguro', 'Traslado', 'Reinstalación'],
  },
  {
    title: 'Commercial Projects',
    titleEs: 'Proyectos Comerciales',
    items: ['Small & large offices', 'Corporate environments', 'Fast turnaround projects'],
    itemsEs: ['Oficinas pequeñas y grandes', 'Ambientes corporativos', 'Proyectos de entrega rápida'],
  },
];

interface ScrollVideoServicesProps {
  videoSrc: string;
  scrollHeight?: number;
  lang?: 'en' | 'es';
}

export function ScrollVideoServices({ videoSrc, scrollHeight = 400, lang = 'en' }: ScrollVideoServicesProps) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const videoRef      = useRef<HTMLVideoElement>(null);
  const durationRef   = useRef(0);
  const lastProgress  = useRef(-1);
  const rafId         = useRef<number | null>(null);
  const [, setProgress]              = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoReady, setVideoReady]    = useState(false);

  // ── IntersectionObserver: preload video when section approaches viewport ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          // Video starts loading when section is near viewport
          if (videoRef.current) {
            videoRef.current.preload = 'metadata';
          }
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: '150px' }
    );
    const container = containerRef.current;
    if (container) observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // ── Load video metadata + track ready state ──
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onMeta = () => { durationRef.current = video.duration; };
    const onLoaded = () => setVideoReady(true);
    if (video.readyState >= 1) {
      durationRef.current = video.duration;
      setVideoReady(true);
    } else {
      video.addEventListener('loadedmetadata', onMeta, { once: true });
    }
    video.addEventListener('canplay', onLoaded, { once: true });
    return () => {
      video.removeEventListener('loadedmetadata', onMeta);
      video.removeEventListener('canplay', onLoaded);
    };
  }, []);

  // Refs for DOM-direct progress bar updates (avoid re-render on every scroll tick)
  const progressBarRef   = useRef<HTMLDivElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);
  const segmentsRef      = useRef<HTMLDivElement[]>([]);

  const tick = useCallback(() => {
    rafId.current = null;
    const container = containerRef.current;
    const video     = videoRef.current;
    if (!container || !video || durationRef.current === 0) return;

    const rect       = container.getBoundingClientRect();
    const scrollable = container.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;

    const raw = Math.max(0, Math.min(1, -rect.top / scrollable));
    if (Math.abs(raw - lastProgress.current) <= 0.0005) return;

    lastProgress.current = raw;

    // Video scrub — always
    video.currentTime = raw * durationRef.current;

    // Progress bars — DOM direct, zero re-render
    if (progressBarRef.current)   progressBarRef.current.style.width  = `${raw * 100}%`;
    if (progressTrackRef.current) progressTrackRef.current.style.height = `${raw * 100}%`;

    const idx = Math.min(Math.floor(raw * servicesData.length), servicesData.length - 1);

    // Segment dots — DOM direct
    segmentsRef.current.forEach((seg, i) => {
      if (!seg) return;
      seg.style.flex = i === idx ? '2' : '1';
      seg.style.background = i === idx ? '#F5C518' : 'rgba(255,255,255,0.18)';
    });

    // Only setState when section changes — O(1) re-renders per section, not per pixel
    setActiveIndex((prev) => (prev !== idx ? idx : prev));
    setProgress((prev) => {
      // Only update React state every ~2% for the counter display
      if (Math.abs(prev - raw) > 0.02) return raw;
      return prev;
    });
  }, []);

  const handleScroll = useCallback(() => {
    if (rafId.current) return;
    rafId.current = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Run once on mount to set initial state
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [handleScroll]);

  const service = servicesData[activeIndex];

  return (
    /*
     * ARCHITECTURE:
     * - Outer div: tall scroll container (400vh)
     * - Inner sticky wrapper: height 100vh, sticks to viewport while scrolling
     * - Everything (video + overlay + content) lives inside the sticky wrapper
     * This is the CORRECT pattern — overlay and content move with the sticky viewport,
     * not with the scroll container.
     */
    <div ref={containerRef} className="relative w-full" style={{ height: `${scrollHeight}vh` }}>

      {/* ── Edge fade masks — blend into adjacent sections ── */}
      {/* Top mask: fades FROM zinc-950 (Hero bg) TO transparent */}
      <div
        className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
        style={{
          height: '18vh',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
        }}
      />
      {/* Bottom mask: fades FROM transparent TO #f8f9fa (About bg) */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
        style={{
          height: '18vh',
          background: 'linear-gradient(to top, #f4f6f8 0%, rgba(244,246,248,0.85) 35%, rgba(244,246,248,0) 100%)',
        }}
      />

      {/* ── Sticky viewport wrapper — everything lives here ── */}
      <div className="sticky top-0 w-full overflow-hidden" style={{ height: '100vh' }}>

        {/* Video — fills sticky viewport, loads on intersection approach */}
        <video
          ref={videoRef}
          src={videoSrc}
          playsInline
          muted
          preload="metadata"
          aria-hidden="true"
          suppressHydrationWarning
          className="absolute inset-0 w-full h-full object-cover will-change-transform"
        />

        {/* Cinematic overlay — left-heavy for content legibility */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(105deg, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.50) 45%, rgba(0,0,0,0.15) 100%)',
          }}
        />
        {/* Bottom vignette */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%)' }} />

        {/* ── Content panel — left-offset, vertically centered ── */}
        <div className="absolute inset-0 flex items-center">
          <div className="ml-3 mr-3 xs:ml-4 xs:mr-4 sm:ml-6 md:ml-16 lg:ml-24 w-full max-w-[290px] xs:max-w-md">

            {/* Glass card */}
            <div
              style={{
                background: 'rgba(8,8,8,0.55)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderTop: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 32px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
                borderRadius: '16px',
                padding: '18px 16px 18px',
              }}
            >
              {/* Label + counter */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] xs:text-xs font-semibold uppercase tracking-[0.22em] text-[#F5C518]">
                  {lang === 'en' ? 'Our Services' : 'Nuestros Servicios'}
                </p>
                <p className="text-[10px] xs:text-xs text-white/30 tabular-nums font-medium">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(servicesData.length).padStart(2, '0')}
                </p>
              </div>

              {/* Service content — reduced minHeight for smaller screens */}
              <div style={{ minHeight: '120px' }}>
                <h2
                  className="text-[18px] xs:text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight mb-3 xs:mb-5"
                  style={{
                    letterSpacing: '-0.028em',
                    transition: 'opacity 0.4s cubic-bezier(0.16,1,0.3,1)',
                  }}
                >
                  {lang === 'en' ? service.title : service.titleEs}
                </h2>

                <ul className="space-y-2.5">
                  {(lang === 'en' ? service.items : service.itemsEs).map((item, i) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-[12px] xs:text-sm text-zinc-300/90"
                      style={{
                        transition: `opacity 0.35s cubic-bezier(0.16,1,0.3,1) ${i * 0.04}s`,
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F5C518] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Progress track */}
              <div className="mt-8 space-y-2">
                <div className="h-px w-full bg-white/8 overflow-hidden rounded-full">
                  <div
                    ref={progressBarRef}
                    className="h-full bg-[#F5C518] rounded-full"
                    style={{ width: '0%', transition: 'width 0.08s linear' }}
                  />
                </div>

                {/* Segment dots */}
                <div className="flex gap-1.5">
                  {servicesData.map((_, i) => (
                    <div
                      key={i}
                      ref={(el) => { if (el) segmentsRef.current[i] = el; }}
                      style={{
                        height: '3px',
                        flex: i === activeIndex ? '2' : '1',
                        borderRadius: '9999px',
                        background: i === activeIndex ? '#F5C518' : 'rgba(255,255,255,0.18)',
                        transition: 'flex 0.35s cubic-bezier(0.16,1,0.3,1), background 0.35s ease',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* CTA below card */}
            <a
              href="#contact"
              className="mt-4 inline-flex items-center gap-2 text-xs text-white/45 hover:text-white transition-colors duration-200 ml-1"
            >
              <span className="h-px w-4 bg-white/45" />
              {lang === 'en' ? 'Get a free quote' : 'Cotización gratis'}
            </a>

          </div>
        </div>

        {/* Scroll progress indicator — right edge */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5">
          <div className="w-px bg-white/10 overflow-hidden rounded-full" style={{ height: '80px' }}>
            <div
              ref={progressTrackRef}
              className="w-full bg-[#F5C518] rounded-full"
              style={{ height: '0%', transition: 'height 0.08s linear' }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
