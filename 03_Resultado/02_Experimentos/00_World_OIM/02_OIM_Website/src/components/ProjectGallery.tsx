'use client';

/**
 * ProjectGallery — taste-skill SOTA
 * DESIGN_VARIANCE: 8 — Asymmetric masonry, no equal 3-col card grid
 * MOTION_INTENSITY: 6 — Staggered scroll reveal, hover scale
 * VISUAL_DENSITY: 4 — Spacious, editorial
 * Apple HIG: 30px H2, 17px body, 11px labels
 */

import { useEffect, useRef } from 'react';

interface ProjectGalleryProps {
  lang: 'en' | 'es';
}

const copy = {
  en: {
    label: 'Project Gallery',
    heading: 'Projects we\'re proud of',
    sub: 'Explore some of our recent projects. Each space is a showcase of our precision, care, and commitment to excellence in corporate furniture installation.',
    projects: [
      { label: 'Tech Hub Installation', location: 'Atlanta, GA' },
      { label: 'Executive Boardroom', location: 'Buckhead District' },
      { label: 'Floor Reconfiguration', location: 'Alpharetta Business Park' },
    ],
    cta: 'Start your project',
    ctaSub: 'Free quote →',
  },
  es: {
    label: 'Galería de Proyectos',
    heading: 'Proyectos de los que estamos orgullosos',
    sub: 'Explorá algunos de nuestros proyectos recientes. Cada espacio es una muestra de nuestra precisión, cuidado y compromiso con la excelencia.',
    projects: [
      { label: 'Tech Hub Installation', location: 'Atlanta, GA' },
      { label: 'Executive Boardroom', location: 'Buckhead District' },
      { label: 'Floor Reconfiguration', location: 'Alpharetta Business Park' },
    ],
    cta: 'Iniciá tu proyecto',
    ctaSub: 'Cotización gratis →',
  },
};

// Office-toned gradient placeholders — realistic dark tones
const cardBgs = [
  'linear-gradient(160deg, #1c2b3a 0%, #0f1e2d 60%, #0a1520 100%)',
  'linear-gradient(160deg, #243040 0%, #141f2a 60%, #0d1b2a 100%)',
  'linear-gradient(160deg, #1a2836 0%, #0e1c28 100%)',
];

export default function ProjectGallery({ lang }: ProjectGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const t = copy[lang];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('[data-animate]').forEach((el, i) => {
              setTimeout(() => {
                (el as HTMLElement).style.opacity = '1';
                (el as HTMLElement).style.transform = 'translateY(0)';
              }, i * 80);
            });
          }
        });
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="bg-[#f4f6f8] px-6 md:px-10 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl">

        {/* Header — left label + right sub — Apple HIG asymmetric */}
        <div
          data-animate
          className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-12"
          style={{ opacity: 0, transform: 'translateY(16px)', transition: 'opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1)' }}
        >
          <div>
            {/* 11px label */}
            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#F5C518]">
              {t.label}
            </p>
            {/* H2 — Apple HIG Title1: ~30-36px */}
            <h2
              className="text-[30px] md:text-[36px] font-bold text-[#0d1b2a] leading-[1.1]"
              style={{ letterSpacing: '-0.02em' }}
            >
              {t.heading}
            </h2>
          </div>
          {/* Sub — 15px, right-aligned desktop */}
          <p className="text-[14px] text-[#0d1b2a]/48 leading-[1.5] max-w-[44ch] md:text-right">
            {t.sub}
          </p>
        </div>

        {/* taste-skill: NO equal 3-col grid — use 1 large + 2 stacked asymmetric */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Card 1 — large, spans 2 rows visually via taller height */}
          <div
            data-animate
            className="md:col-span-2 relative overflow-hidden rounded-2xl group cursor-pointer"
            style={{
              height: '340px',
              background: cardBgs[0],
              opacity: 0,
              transform: 'translateY(16px)',
              transition: 'opacity 0.55s cubic-bezier(0.16,1,0.3,1) 0.06s, transform 0.55s cubic-bezier(0.16,1,0.3,1) 0.06s',
            }}
          >
            {/* Subtle texture */}
            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />
            {/* Hover scale — taste-skill MOTION_INTENSITY:6 */}
            <div
              className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              style={{ background: 'linear-gradient(to top, rgba(13,27,42,0.8) 0%, transparent 50%)' }}
            />
            {/* Label bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
              <p className="text-[13px] font-semibold text-white/90 leading-tight">{t.projects[0].label}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-[4px] w-[4px] rounded-full bg-[#F5C518]" />
                <span className="text-[11px] text-white/45 font-medium">{t.projects[0].location}</span>
              </div>
            </div>
          </div>

          {/* Right column — 2 stacked cards */}
          <div className="flex flex-col gap-4">
            {[1, 2].map((idx) => (
              <div
                key={idx}
                data-animate
                className="relative overflow-hidden rounded-2xl flex-1 group cursor-pointer"
                style={{
                  minHeight: '158px',
                  background: cardBgs[idx],
                  opacity: 0,
                  transform: 'translateY(16px)',
                  transition: `opacity 0.55s cubic-bezier(0.16,1,0.3,1) ${0.1 + idx * 0.07}s, transform 0.55s cubic-bezier(0.16,1,0.3,1) ${0.1 + idx * 0.07}s`,
                }}
              >
                <div
                  className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  style={{ background: 'linear-gradient(to top, rgba(13,27,42,0.75) 0%, transparent 55%)' }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                  <p className="text-[12px] font-semibold text-white/85">{t.projects[idx].label}</p>
                  <p className="text-[11px] text-white/40 mt-0.5">{t.projects[idx].location}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* CTA strip — bottom, yellow bg — taste-skill: bold accent */}
        <div
          data-animate
          className="mt-4 rounded-2xl bg-[#F5C518] px-8 py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ opacity: 0, transform: 'translateY(16px)', transition: 'opacity 0.55s cubic-bezier(0.16,1,0.3,1) 0.28s, transform 0.55s cubic-bezier(0.16,1,0.3,1) 0.28s' }}
        >
          <div>
            <p className="text-[18px] font-bold text-[#0d1b2a] leading-tight" style={{ letterSpacing: '-0.015em' }}>
              {lang === 'en' ? "Let's build your workspace." : 'Construyamos tu espacio.'}
            </p>
            <p className="text-[13px] text-[#0d1b2a]/55 mt-1">
              {lang === 'en'
                ? 'Atlanta, Marietta, Alpharetta, Lawrenceville, and surrounding suburbs.'
                : 'Atlanta, Marietta, Alpharetta, Lawrenceville y alrededores.'}
            </p>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0d1b2a] px-6 py-3 text-[14px] font-semibold text-white hover:bg-[#1a2e42] transition-colors active:scale-[0.98] whitespace-nowrap"
          >
            {t.cta}
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}
