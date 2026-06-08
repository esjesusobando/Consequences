'use client';

import { useEffect, useRef } from 'react';

interface ServicesSectionProps {
  lang: 'en' | 'es';
}

const copy = {
  en: {
    label: 'Our Services',
    heading: 'Our Expertise',
    sub: 'We specialize in creating functional and aesthetic work environments. From installing a single desk to completely relocating your company, we guarantee precision and care at every step.',
    services: [
      {
        icon: 'desk',
        title: 'Office Furniture Installation',
        items: ['Desks & workstations', 'Cubicles', 'Conference tables', 'Chairs & storage units'],
        dark: false,
      },
      {
        icon: 'architecture',
        title: 'Office Setup & Reconfiguration',
        items: ['New Office Set up', 'Workstation Reconfiguration', 'Full furniture rearrangement'],
        dark: false,
      },
      {
        icon: 'shipping',
        title: 'Disassembly & Moving',
        items: ['Safe disassembly', 'Relocation', 'Reinstallation'],
        dark: false,
      },
      {
        icon: 'business',
        title: 'Commercial Projects',
        items: ['Small & large offices', 'Corporate environments', 'Fast turnaround projects'],
        dark: true,
      },
    ],
  },
  es: {
    label: 'Nuestros Servicios',
    heading: 'Nuestra Experiencia',
    sub: 'Nos especializamos en crear entornos de trabajo funcionales y estéticos. Desde instalar un solo escritorio hasta reubicar completamente su empresa.',
    services: [
      {
        icon: 'desk',
        title: 'Instalación de Muebles',
        items: ['Escritorios y estaciones', 'Cubículos', 'Mesas de conferencia', 'Sillas y almacenamiento'],
        dark: false,
      },
      {
        icon: 'architecture',
        title: 'Configuración y Rediseño',
        items: ['Nuevas instalaciones', 'Reconfiguración de puestos', 'Reubicación completa'],
        dark: false,
      },
      {
        icon: 'shipping',
        title: 'Desmontaje y Traslado',
        items: ['Desmontaje seguro', 'Traslado', 'Reinstalación'],
        dark: false,
      },
      {
        icon: 'business',
        title: 'Proyectos Comerciales',
        items: ['Oficinas pequeñas y grandes', 'Ambientes corporativos', 'Entrega rápida'],
        dark: true,
      },
    ],
  },
};

const icons: Record<string, React.ReactNode> = {
  desk: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="3" rx="1"/><path d="M5 10v7M19 10v7M2 17h20"/>
    </svg>
  ),
  architecture: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  shipping: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
  business: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path d="M3 9V7a2 2 0 012-2h14a2 2 0 012 2v2"/><path d="M12 12v5"/>
    </svg>
  ),
};

// Service images (correct order: 1-2-3-4)
const serviceImages = [
  '/service1.jpg', // Office Furniture Installation
  '/service2.jpg', // Office Setup & Reconfiguration  
  '/service3.jpg', // Disassembly & Moving
  '/service4.jpg', // Commercial Projects
];

// Photo-like gradient placeholders per service
const serviceBgs = [
  'linear-gradient(135deg, #2d3a4a 0%, #1a2535 40%, #0d1b2a 100%)',
  'linear-gradient(135deg, #1e2d3d 0%, #2a3f55 50%, #162030 100%)',
  'linear-gradient(135deg, #263545 0%, #1a2a38 100%)',
  'linear-gradient(135deg, #0d1b2a 0%, #1a2e42 100%)',
];

export default function ServicesSection({ lang }: ServicesSectionProps) {
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
      id="services"
      className="bg-white px-6 md:px-10 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div
          data-animate
          className="mb-14"
          style={{ opacity: 0, transform: 'translateY(16px)', transition: 'opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1)' }}
        >
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#F5C518]">
            {t.label}
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2
              className="text-[30px] md:text-[36px] font-bold text-[#0d1b2a] leading-[1.1]"
              style={{ letterSpacing: '-0.02em' }}
            >
              {t.heading}
            </h2>
            <p className="text-[15px] text-[#0d1b2a]/50 leading-[1.5] max-w-[52ch] md:text-right">
              {t.sub}
            </p>
          </div>
        </div>

        {/* 2×2 service cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {t.services.map((service, i) => (
            <div
              key={service.title}
              data-animate
              className="relative overflow-hidden rounded-2xl"
              style={{
                opacity: 0,
                transform: 'translateY(16px)',
                transition: `opacity 0.55s cubic-bezier(0.16,1,0.3,1) ${0.06 + i * 0.07}s, transform 0.55s cubic-bezier(0.16,1,0.3,1) ${0.06 + i * 0.07}s`,
              }}
            >
              {/* Service image with fallback */}
              <div className="h-44 relative overflow-hidden">
                <img
                  src={serviceImages[i]}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              </div>

              {/* Content */}
              <div
                className={`p-6 ${service.dark ? 'bg-[#0d1b2a]' : 'bg-[#f4f6f8]'}`}
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <span className={service.dark ? 'text-[#F5C518]' : 'text-[#0d1b2a]'}>
                    {icons[service.icon]}
                  </span>
                  <h3
                    className={`text-[16px] font-bold leading-tight ${service.dark ? 'text-white' : 'text-[#0d1b2a]'}`}
                    style={{ letterSpacing: '-0.015em' }}
                  >
                    {service.title}
                  </h3>
                </div>
                <ul className="space-y-1.5">
                  {service.items.map((item) => (
                    <li
                      key={item}
                      className={`flex items-center gap-2 text-[13px] ${service.dark ? 'text-white/55' : 'text-[#0d1b2a]/50'}`}
                    >
                      <span className={`h-[4px] w-[4px] rounded-full flex-shrink-0 ${service.dark ? 'bg-[#F5C518]' : 'bg-[#0d1b2a]/25'}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
