'use client';

import { useEffect, useRef } from 'react';

interface AboutSectionProps {
  lang: 'en' | 'es';
}

const copy = {
  en: {
    label: 'About Us',
    founded: 'Founded 2018',
    heading: 'Experience You Can Trust',
    body1: 'With over 15 years of industry experience and 8 years in service, we take pride in delivering efficient, professional, and detail-driven results.',
    body2: 'We handle every project with care, ensuring your office furniture is protected and installed to the highest standards—whether for small businesses or large-scale corporate environments.',
    body3: 'In addition to relocation services, we provide full-service installation and reconfiguration of all office furniture systems, including cubicles, workstations, and complete office setups.',
    badge: 'Fully Bonded & Insured',
    badgeSub: 'Protecting your investment and our workplace.',
    cta: 'Get a Free Quote',
    stats: [
      { value: '8', label: 'Years of Service' },
      { value: '15', label: 'Years of Experience' },
      { value: 'Licensed', label: '& Insured' },
      { value: 'Atlanta', label: 'Metro Service' },
    ],
    review: '"Very professional team, fast and reliable. Highly recommend!"',
  },
  es: {
    label: 'Nosotros',
    founded: 'Fundada en 2018',
    heading: 'Experiencia en la que Confiar',
    body1: 'Con más de 15 años de experiencia en la industria y 8 años de servicio, nos enorgullecemos de entregar resultados eficientes, profesionales y orientados al detalle.',
    body2: 'Manejamos cada proyecto con cuidado, asegurando que los muebles de oficina estén protegidos e instalados con los más altos estándares.',
    body3: 'Además de los servicios de reubicación, brindamos instalación y reconfiguración completa de todos los sistemas de muebles de oficina.',
    badge: 'Completamente Asegurados',
    badgeSub: 'Protegiendo su inversión y nuestro lugar de trabajo.',
    cta: 'Cotización Gratis',
    stats: [
      { value: '8', label: 'Años de Servicio' },
      { value: '15', label: 'Años de Experiencia' },
      { value: 'Licenciados', label: 'y Asegurados' },
      { value: 'Atlanta', label: 'Metro Service' },
    ],
    review: '"Equipo muy profesional, rápido y confiable. ¡Muy recomendado!"',
  },
};

export default function AboutSection({ lang }: AboutSectionProps) {
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
              }, i * 90);
            });
          }
        });
      },
      { threshold: 0.12 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-[#f4f6f8] px-6 md:px-10 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl">

        {/* Top 2-col */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 mb-16">

          {/* Left — label + heading + founded badge */}
          <div
            data-animate
            style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)' }}
          >
            {/* Section label — Apple HIG: 11px caps */}
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#F5C518]">
              {t.label}
            </p>

            {/* Founded tag */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#0d1b2a]/12 bg-[#0d1b2a]/5 px-3 py-1 mb-5">
              <span className="text-[11px] font-semibold text-[#0d1b2a]/50 tracking-wide">{t.founded}</span>
            </div>

            {/* H2 — Apple HIG: Title1 ~28–34px, -0.02em */}
            <h2
              className="text-[26px] xs:text-[28px] sm:text-[32px] md:text-[38px] font-bold text-[#0d1b2a] leading-[1.1]"
              style={{ letterSpacing: '-0.022em', textWrap: 'balance' } as React.CSSProperties}
            >
              {t.heading}
            </h2>

            {/* Star review */}
            <div className="mt-8 flex flex-col gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="#F5C518" aria-hidden="true">
                    <path d="M7 1l1.545 3.13L12 4.635l-2.5 2.435.59 3.44L7 8.885l-3.09 1.625.59-3.44L2 4.635l3.455-.505L7 1z"/>
                  </svg>
                ))}
              </div>
              <p className="text-[14px] text-[#0d1b2a]/55 leading-[1.5] max-w-[36ch] italic">
                {t.review}
              </p>
            </div>
          </div>

          {/* Right — body paragraphs + insured badge */}
          <div
            data-animate
            className="flex flex-col justify-start gap-5"
            style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.6s cubic-bezier(0.16,1,0.3,1) 0.08s, transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.08s' }}
          >
            {/* Body — Apple HIG: 17px, leading 1.47 */}
            <p className="text-[17px] font-normal text-[#0d1b2a]/60 leading-[1.47]">{t.body1}</p>
            <p className="text-[15px] font-normal text-[#0d1b2a]/50 leading-[1.5]">{t.body2}</p>
            <p className="text-[15px] font-normal text-[#0d1b2a]/50 leading-[1.5]">{t.body3}</p>

            {/* Insured badge */}
            <div className="flex items-start gap-3 mt-2 p-4 rounded-xl border border-[#0d1b2a]/8 bg-white">
              <div className="w-9 h-9 rounded-lg bg-[#F5C518]/15 flex items-center justify-center flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4a800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#0d1b2a]">{t.badge}</p>
                <p className="text-[12px] text-[#0d1b2a]/45 mt-0.5">{t.badgeSub}</p>
              </div>
            </div>

            {/* CTA */}
            <a
              href="#contact"
              className="self-start inline-flex items-center gap-2 text-[14px] font-semibold text-[#0d1b2a] border-b-2 border-[#F5C518] pb-px hover:text-[#d4a800] transition-colors mt-1"
            >
              {t.cta}
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Stats grid — Apple HIG: separadores, no cards pesadas */}
        <div
          data-animate
          className="stats-grid grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#dde1e6] border border-[#dde1e6] rounded-2xl overflow-hidden bg-white"
          style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.6s cubic-bezier(0.16,1,0.3,1) 0.16s, transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.16s' }}
        >
          {t.stats.map((stat) => (
            <div key={stat.label} className="px-4 sm:px-7 py-6 sm:py-8 flex flex-col gap-1">
              {/* Stat value — Apple HIG: Large Title, font-bold, tight tracking */}
              <span className="text-[28px] sm:text-[34px] font-bold text-[#0d1b2a] leading-none" style={{ letterSpacing: '-0.03em' }}>
                {stat.value}
              </span>
              <span className="text-[11px] sm:text-[12px] font-medium text-[#0d1b2a]/42 uppercase tracking-[0.06em] leading-tight">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
