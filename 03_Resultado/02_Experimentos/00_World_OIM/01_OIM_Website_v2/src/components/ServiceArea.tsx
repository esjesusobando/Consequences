'use client';

/**
 * ServiceArea — taste-skill + Apple HIG SOTA
 * DESIGN_VARIANCE: 8 — Full dark navy, 3-col info + map dominante
 * VISUAL_DENSITY: 4 — Spacious, editorial
 * Copy exacto del cliente OIM
 */

import { useEffect, useRef } from 'react';

interface ServiceAreaProps {
  lang: 'en' | 'es';
}

const copy = {
  en: {
    label: 'Service Area',
    heading: 'Atlanta and Surrounding Area',
    sub: 'Providing professional installation services across the entire state of Georgia, reaching the borders of Florida, Alabama, and Tennessee.',
    cols: [
      {
        icon: 'hq',
        title: 'Headquarters',
        value: '3715 Northcrest Rd, Suite 19\nAtlanta, GA 30340',
      },
      {
        icon: 'reach',
        title: 'Regional Reach',
        value: 'Serving all of Georgia, reaching borders with Florida, Alabama, and Tennessee.',
      },
      {
        icon: 'phone',
        title: 'Direct Line',
        value: '+1 (470) 595-0121',
        href: 'tel:+14705950121',
      },
    ],
    active: 'Active Technicians in Georgia',
  },
  es: {
    label: 'Área de Servicio',
    heading: 'Atlanta y Área Circundante',
    sub: 'Brindamos servicios de instalación profesional en todo el estado de Georgia, llegando a los límites con Florida, Alabama y Tennessee.',
    cols: [
      {
        icon: 'hq',
        title: 'Sede',
        value: '3715 Northcrest Rd, Suite 19\nAtlanta, GA 30340',
      },
      {
        icon: 'reach',
        title: 'Alcance Regional',
        value: 'Servicio en todo Georgia, llegando a los límites con Florida, Alabama y Tennessee.',
      },
      {
        icon: 'phone',
        title: 'Línea Directa',
        value: '+1 (470) 595-0121',
        href: 'tel:+14705950121',
      },
    ],
    active: 'Técnicos Activos en Georgia',
  },
};

const ColIcons: Record<string, React.ReactNode> = {
  hq: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  reach: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
    </svg>
  ),
  phone: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.05 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
    </svg>
  ),
};

export default function ServiceArea({ lang }: ServiceAreaProps) {
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
      id="area"
      className="bg-[#0d1b2a] px-6 md:px-10 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div
          data-animate
          className="mb-12"
          style={{ opacity: 0, transform: 'translateY(16px)', transition: 'opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1)' }}
        >
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#F5C518]">
            {t.label}
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2
              className="text-[30px] md:text-[38px] font-bold text-white leading-[1.1]"
              style={{ letterSpacing: '-0.022em' }}
            >
              {t.heading}
            </h2>
            <p className="text-[14px] text-white/42 leading-[1.5] max-w-[48ch] md:text-right">
              {t.sub}
            </p>
          </div>
        </div>

        {/* Map + info grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Map — left, taller */}
          <div
            data-animate
            className="rounded-2xl overflow-hidden border border-white/8"
            style={{
              height: '380px',
              opacity: 0,
              transform: 'translateY(16px)',
              transition: 'opacity 0.55s cubic-bezier(0.16,1,0.3,1) 0.06s, transform 0.55s cubic-bezier(0.16,1,0.3,1) 0.06s',
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d424066.8!2d-84.3944!3d33.7490!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f5045d6993098d%3A0x66fede2f990b630b!2sAtlanta%2C%20GA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
              width="100%"
              height="380"
              style={{
                border: 0,
                filter: 'invert(0.88) hue-rotate(180deg) saturate(0.55) brightness(0.9)',
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="OIM Service Area — Atlanta and Surrounding Georgia"
            />
          </div>

          {/* Right — info cols + active badge */}
          <div className="flex flex-col gap-4">

            {/* 3 info cards */}
            {t.cols.map((col, i) => (
              <div
                key={col.title}
                data-animate
                className="rounded-xl border border-white/8 bg-white/4 px-6 py-5 flex items-start gap-4"
                style={{
                  opacity: 0,
                  transform: 'translateY(16px)',
                  transition: `opacity 0.55s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.07}s, transform 0.55s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.07}s`,
                }}
              >
                <div className="w-9 h-9 rounded-lg bg-[#F5C518]/12 flex items-center justify-center flex-shrink-0 text-[#F5C518]">
                  {ColIcons[col.icon]}
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-white/35 mb-1">{col.title}</p>
                  {col.href ? (
                    <a href={col.href} className="text-[15px] font-semibold text-white hover:text-[#F5C518] transition-colors whitespace-pre-line">
                      {col.value}
                    </a>
                  ) : (
                    <p className="text-[14px] text-white/65 leading-[1.5] whitespace-pre-line">{col.value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Active technicians badge — ui-ux-pro-max: social proof / trust signal */}
            <div
              data-animate
              className="rounded-xl border border-[#F5C518]/20 bg-[#F5C518]/6 px-6 py-5 flex items-center gap-4 mt-auto"
              style={{
                opacity: 0,
                transform: 'translateY(16px)',
                transition: 'opacity 0.55s cubic-bezier(0.16,1,0.3,1) 0.31s, transform 0.55s cubic-bezier(0.16,1,0.3,1) 0.31s',
              }}
            >
              {/* Pulsing dot — taste-skill MOTION_INTENSITY:6 */}
              <div className="relative flex-shrink-0">
                <div className="w-3 h-3 rounded-full bg-[#F5C518]" />
                <div className="absolute inset-0 rounded-full bg-[#F5C518] animate-ping opacity-40" />
              </div>
              <p className="text-[14px] font-semibold text-[#F5C518]">{t.active}</p>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
}
