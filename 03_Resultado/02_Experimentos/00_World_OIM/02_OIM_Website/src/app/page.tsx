'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { ScrollVideoServices } from '@/components/ScrollVideoServices';

// Lazy load below-the-fold sections — reduces initial JS bundle
const ServicesSection = lazy(() => import('@/components/ServicesSection'));
const AboutSection    = lazy(() => import('@/components/AboutSection'));
const ProjectGallery  = lazy(() => import('@/components/ProjectGallery'));
const ContactForm     = lazy(() => import('@/components/ContactForm'));
const ServiceArea     = lazy(() => import('@/components/ServiceArea'));

export default function Home() {
  const [lang, setLang] = useState<'en' | 'es'>(() => {
    if (typeof window === 'undefined') return 'en';
    const stored = sessionStorage.getItem('oim-lang');
    return stored === 'en' || stored === 'es' ? stored : 'en';
  });

  useEffect(() => {
    const handleLangChange = (e: CustomEvent) => setLang(e.detail);
    window.addEventListener('language-change', handleLangChange as EventListener);
    return () => window.removeEventListener('language-change', handleLangChange as EventListener);
  }, []);

  const toggleLang = () => {
    const next = lang === 'en' ? 'es' : 'en';
    setLang(next);
    sessionStorage.setItem('oim-lang', next);
    window.dispatchEvent(new CustomEvent('language-change', { detail: next }));
  };

  return (
    <main className="flex flex-col">

      {/* ── NAV — fixed glass, navy tint ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-[60px]"
        style={{
          background: 'rgba(13,27,42,0.60)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* Logo */}
        <div className="flex flex-col leading-none">
          <span className="text-[#F5C518] font-black text-[17px] tracking-tight">OIM</span>
          <span className="text-white/60 text-[9px] uppercase tracking-[0.15em] font-semibold" style={{ letterSpacing: '0.15em' }}>Office Installations</span>
        </div>

        {/* Nav links — desktop, Apple HIG: 13px system font weight 500 */}
        <nav className="hidden md:flex items-center gap-7">
          {[
            { en: 'Services', es: 'Servicios', href: '#services', ariaEn: 'Navigate to Services section', ariaEs: 'Ir a la sección de Servicios' },
            { en: 'Projects', es: 'Proyectos', href: '#gallery', ariaEn: 'Navigate to Projects section', ariaEs: 'Ir a la sección de Proyectos' },
            { en: 'About Us', es: 'Nosotros', href: '#about', ariaEn: 'Navigate to About Us section', ariaEs: 'Ir a la sección Nosotros' },
            { en: 'Service Area', es: 'Área de Servicio', href: '#area', ariaEn: 'Navigate to Service Area section', ariaEs: 'Ir a la sección de Área de Servicio' },
          ].map((item) => (
            <a
              key={item.en}
              href={item.href}
              aria-label={lang === 'en' ? item.ariaEn : item.ariaEs}
              className="text-[13px] font-medium text-white/55 hover:text-white transition-colors duration-150"
            >
              {lang === 'en' ? item.en : item.es}
            </a>
          ))}
        </nav>

        {/* Right — lang + CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="text-[12px] font-semibold text-white/45 hover:text-[#F5C518] transition-colors tracking-wider uppercase"
          >
            {lang === 'en' ? 'ES' : 'EN'}
          </button>
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-[#F5C518] px-4 h-9 text-[13px] font-semibold text-[#0d1b2a] hover:bg-[#d4a800] transition-colors"
          >
            {lang === 'en' ? 'Start Project' : 'Iniciar Proyecto'}
          </a>
        </div>
      </header>

      {/* ── HERO — video background, copy exacto ── */}
      <HeroSection videoSrc="/videos/Interior_Design.mp4">
        <div className="max-w-[600px]">

          {/* Badges — Apple HIG: 11px caps, tracking 0.06em */}
          <div className="animate-fade-up flex flex-wrap gap-2 mb-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/6 px-3.5 py-[7px] text-[11px] font-semibold uppercase tracking-[0.06em] text-white/70 backdrop-blur-sm">
              <span className="h-[5px] w-[5px] rounded-full bg-[#F5C518] flex-shrink-0" />
              Corporate Space Management Engineering
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/16 bg-white/6 px-3.5 py-[7px] text-[11px] font-semibold uppercase tracking-[0.06em] text-white/70 backdrop-blur-sm">
              <svg width="9" height="11" viewBox="0 0 9 11" fill="none" aria-hidden="true">
                <path d="M4.5 0C2.57 0 1 1.57 1 3.5c0 2.63 3.5 6.5 3.5 6.5s3.5-3.87 3.5-6.5C8 1.57 6.43 0 4.5 0zm0 4.75a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z" fill="currentColor"/>
              </svg>
              Atlanta &amp; Surrounding Areas
            </span>
          </div>

          {/* H1 — Apple HIG: Large Title 34pt → web 52px desktop, font-bold, -0.02em */}
          <h1
            className="animate-fade-up-1 text-[38px] md:text-[50px] lg:text-[58px] font-bold leading-[1.07] text-white mb-5"
            style={{ letterSpacing: '-0.022em', textWrap: 'balance' } as React.CSSProperties}
          >
            {lang === 'en' ? (
              <>Office Furniture Installation &amp;{' '}<span className="text-[#F5C518]">Workspace Setup</span></>
            ) : (
              <>Instalación de Muebles de Oficina &amp;{' '}<span className="text-[#F5C518]">Configuración</span></>
            )}
          </h1>

          {/* Body — Apple HIG: 17px, leading 1.47, weight 400 */}
          <p className="animate-fade-up-2 text-[17px] font-normal text-white/60 mb-8 max-w-[46ch] leading-[1.47]">
            {lang === 'en'
              ? 'Professional installation of office furniture, cubicles, desks, monitor arms, TVs, whiteboards, glass boards, and full workstation setups.'
              : 'Instalación profesional de muebles de oficina, cubículos, escritorios, brazos para monitores, TVs, pizarras y estaciones de trabajo completas.'}
          </p>

          {/* CTAs — Apple HIG: min 44px touch target */}
          <div className="animate-fade-up-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 justify-center rounded-xl bg-[#F5C518] px-6 py-[11px] text-[15px] font-semibold text-[#0d1b2a] transition-all duration-200 hover:bg-[#d4a800] active:scale-[0.98]"
            >
              {lang === 'en' ? 'Get a Free Quote' : 'Cotización Gratis'}
            </a>
            <a
              href="https://wa.me/14705950121"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[15px] font-medium text-white/55 hover:text-white transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-[#F5C518]" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>

          {/* Stats — Apple HIG: 12px labels, font-medium */}
          <div className="animate-fade-up-3 mt-8 pt-7 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(lang === 'en' ? [
              { val: '8 Years', label: 'of Service' },
              { val: '15 Years', label: 'of Experience' },
              { val: 'Licensed', label: '& Insured' },
              { val: 'Atlanta', label: 'Metro Service' },
            ] : [
              { val: '8 Años', label: 'de Servicio' },
              { val: '15 Años', label: 'de Experiencia' },
              { val: 'Licenciados', label: 'y Asegurados' },
              { val: 'Atlanta', label: 'Metro Service' },
            ]).map((s) => (
              <div key={s.val} className="flex flex-col">
                <span className="text-[15px] font-bold text-white leading-tight" style={{ letterSpacing: '-0.01em' }}>{s.val}</span>
                <span className="text-[12px] font-medium text-white/40 mt-0.5">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </HeroSection>

      {/* ── SCROLL VIDEO — frame-by-frame, INTACTO ── */}
      <ScrollVideoServices
        videoSrc="/videos/Home_exploding_view.mp4"
        scrollHeight={400}
        lang={lang}
      />

      {/* ── SERVICES — lazy loaded ── */}
      <Suspense fallback={<div className="h-32 bg-white" />}>
        <ServicesSection lang={lang} />
      </Suspense>

      {/* ── ABOUT ── */}
      <Suspense fallback={<div className="h-32 bg-[#f4f6f8]" />}>
        <AboutSection lang={lang} />
      </Suspense>

      {/* ── GALLERY ── */}
      <Suspense fallback={<div className="h-32 bg-white" />}>
        <ProjectGallery lang={lang} />
      </Suspense>

      {/* ── CONTACT ── */}
      <Suspense fallback={<div className="h-32 bg-[#f4f6f8]" />}>
        <ContactForm lang={lang} />
      </Suspense>

      {/* ── SERVICE AREA ── */}
      <Suspense fallback={<div className="h-32 bg-white" />}>
        <ServiceArea lang={lang} />
      </Suspense>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0d1b2a] px-6 md:px-10 py-14">
        <div className="mx-auto max-w-7xl">

          {/* Top grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12 pb-12 border-b border-white/8">

            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex flex-col leading-none mb-4">
                <span className="text-[#F5C518] font-black text-[18px] tracking-tight">OIM</span>
                <span className="text-white/35 text-[9px] uppercase tracking-[0.15em] font-semibold mt-0.5">Office Installations</span>
              </div>
              <p className="text-[13px] text-white/40 leading-[1.5] max-w-[26ch]">
                {lang === 'en'
                  ? 'Transforming workspaces with precision and excellence since 2018. Experts in corporate installation and reconfiguration.'
                  : 'Transformando espacios de trabajo con precisión y excelencia desde 2018.'}
              </p>
            </div>

            {/* Navigation */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/30 mb-4">
                {lang === 'en' ? 'Navigation' : 'Navegación'}
              </p>
              <ul className="space-y-2.5">
                {[
                  { en: 'Services', es: 'Servicios', href: '#services' },
                  { en: 'Projects', es: 'Proyectos', href: '#gallery' },
                  { en: 'About Us', es: 'Nosotros', href: '#about' },
                  { en: 'Contact', es: 'Contacto', href: '#contact' },
                ].map((item) => (
                  <li key={item.en}>
                    <a href={item.href} className="text-[13px] text-white/45 hover:text-white transition-colors">
                      {lang === 'en' ? item.en : item.es}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/30 mb-4">
                {lang === 'en' ? 'Services' : 'Servicios'}
              </p>
              <ul className="space-y-2.5">
                {(lang === 'en' ? [
                  'Furniture Installation',
                  'Office Reconfiguration',
                  'Disassembly & Moving',
                  'Commercial Projects',
                ] : [
                  'Instalación de Muebles',
                  'Reconfiguración',
                  'Desmontaje y Traslado',
                  'Proyectos Comerciales',
                ]).map((s) => (
                  <li key={s}>
                    <a href="#services" className="text-[13px] text-white/45 hover:text-white transition-colors">{s}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/30 mb-4">
                {lang === 'en' ? 'Contact' : 'Contacto'}
              </p>
              <ul className="space-y-2.5">
                <li className="text-[13px] text-white/45 leading-[1.4]">3715 Northcrest Rd Suite 19<br />Atlanta, GA 30340</li>
                <li>
                  <a href="tel:+14705950121" className="text-[13px] text-white/45 hover:text-white transition-colors">+1 (470) 595-0121</a>
                </li>
                <li>
                  <a href="mailto:oiminstallllc@gmail.com" className="text-[13px] text-white/45 hover:text-white transition-colors">oiminstallllc@gmail.com</a>
                </li>
                <li>
                  <a href="https://instagram.com/oimayen" target="_blank" rel="noopener noreferrer" className="text-[13px] text-white/45 hover:text-[#F5C518] transition-colors">@oimayen</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-[12px] text-white/22">
              &copy; 2026 OIM Office Installations. Since 2018. All rights reserved.
            </p>
            <div className="flex gap-5">
              <span className="text-[12px] text-white/22">
                {lang === 'en' ? 'Privacy' : 'Privacidad'}
              </span>
              <span className="text-[12px] text-white/22">
                {lang === 'en' ? 'Terms' : 'Términos'}
              </span>
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
}
