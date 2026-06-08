'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { MessageCircle, MapPin, Shield, Clock, Award } from 'lucide-react';
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

      {/* ── NAV — fixed glass, navy tint, premium glow ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-[60px] glass-card"
        style={{
          boxShadow: '0 0 0 1px rgba(245,197,24,0.06), 0 4px 30px rgba(0,0,0,0.3)',
        }}
      >
        {/* Logo — with subtle glow */}
        <div className="flex flex-col leading-none group cursor-pointer">
          <span
            className="text-[#F5C518] font-black text-[17px] tracking-tight transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(245,197,24,0.6)]"
          >
            OIM
          </span>
          <span className="text-white/60 text-[9px] uppercase tracking-[0.15em] font-semibold" style={{ letterSpacing: '0.15em' }}>Office Installations</span>
        </div>

        {/* Nav links — desktop, improved hover with underline animation */}
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
              className="relative text-[13px] font-medium text-white/55 hover:text-white transition-colors duration-200 py-1 group"
            >
              {lang === 'en' ? item.en : item.es}
              <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-[#F5C518] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right — lang + CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="text-[12px] font-semibold text-white/45 hover:text-[#F5C518] transition-colors uppercase tracking-wider"
          >
            {lang === 'en' ? 'ES' : 'EN'}
          </button>
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-[#F5C518] px-4 h-9 text-[13px] font-semibold text-[#0d1b2a] transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,197,24,0.45)] hover:scale-105 active:scale-[0.98]"
          >
            {lang === 'en' ? 'Start Project' : 'Iniciar Proyecto'}
          </a>
        </div>
      </header>

      {/* ── HERO — video background, copy exacto ── */}
      <HeroSection videoSrc="/videos/3D_interior_design.mp4" lang={lang}>
        <div className="max-w-[600px]">

          <h1
            className="animate-fade-up-1 text-[28px] xs:text-[32px] sm:text-[38px] md:text-[50px] lg:text-[58px] font-black leading-[1.07] text-white mb-5"
            style={{ letterSpacing: '-0.03em', textWrap: 'balance' } as React.CSSProperties}
          >
            {lang === 'en' ? (
              <>Office Furniture Installation &amp;{' '}<span className="text-[#F5C518] text-glow">Workspace Setup</span></>
            ) : (
              <>Instalación de Muebles de Oficina &amp;{' '}<span className="text-[#F5C518] text-glow">Configuración</span></>
            )}
          </h1>

          {/* Body — Apple HIG: 17px, leading 1.47, weight 400 — slightly darker for readability over white windows */}
          <p className="animate-fade-up-2 text-[15px] sm:text-[17px] font-normal text-white/75 mb-6 sm:mb-8 max-w-[46ch] leading-[1.47]">
            {lang === 'en'
              ? 'Professional installation of office furniture, cubicles, desks, monitor arms, TVs, whiteboards, glass boards, and full workstation setups.'
              : 'Instalación profesional de muebles de oficina, cubículos, escritorios, brazos para monitores, TVs, pizarras y estaciones de trabajo completas.'}
          </p>

          {/* CTAs — Apple HIG: min 44px touch target, premium glow */}
          <div className="animate-fade-up-3 flex flex-col xs:flex-row gap-3 items-start xs:items-center">
            <a
              href="#contact"
              className="relative overflow-hidden inline-flex items-center gap-2 justify-center rounded-xl bg-[#F5C518] px-6 py-[11px] text-[15px] font-semibold text-[#0d1b2a] transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,197,24,0.5)] hover:scale-105 active:scale-[0.98] gradient-shimmer-btn"
            >
              {lang === 'en' ? 'Get a Free Quote' : 'Cotización Gratis'}
            </a>
            <a
              href="https://wa.me/14705950121"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-[15px] font-medium text-white/55 hover:text-white transition-colors"
            >
              <MessageCircle className="w-[15px] h-[15px] text-[#F5C518] transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
              {lang === 'en' ? 'Chat on WhatsApp' : 'Chatea por WhatsApp'}
            </a>
          </div>

          {/* Stats — Taste Style: asymmetric grid 7/5 with Lucide icons, premium styling */}
          <div className="animate-fade-up-3 mt-6 pt-4 border-t border-white/10">
            {/* Mobile: 2x2 tight grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {/* 8 Years */}
              <div className="flex items-center gap-2 group">
                <Clock className="w-4 h-4 text-[#F5C518] flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[15px] font-bold text-white leading-tight" style={{ letterSpacing: '-0.01em' }}>8</span>
                  <span className="text-[10px] font-medium text-white/65">Years of Service</span>
                </div>
              </div>
              {/* 15 Years */}
              <div className="flex items-center gap-2 group">
                <Award className="w-4 h-4 text-[#F5C518] flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[15px] font-bold text-white leading-tight" style={{ letterSpacing: '-0.01em' }}>15</span>
                  <span className="text-[10px] font-medium text-white/65">Years of Experience</span>
                </div>
              </div>
              {/* Licensed */}
              <div className="flex items-center gap-2 group">
                <Shield className="w-4 h-4 text-[#F5C518] flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[13px] font-medium text-white/80">Licensed</span>
                  <span className="text-[10px] font-medium text-white/65">& Insured</span>
                </div>
              </div>
              {/* Atlanta */}
              <div className="flex items-center gap-2 group">
                <MapPin className="w-4 h-4 text-[#F5C518] flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[13px] font-medium text-white/80">Atlanta</span>
                  <span className="text-[10px] font-medium text-white/65">Metro Service</span>
                </div>
              </div>
            </div>
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

      {/* ── FOOTER — premium dark glass ── */}
      <footer className="relative bg-[#0d1b2a] px-6 md:px-10 py-14 border-t border-[rgba(245,197,24,0.08)]">
        {/* Subtle top glow line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-[#F5C518]/30 to-transparent" />

        <div className="mx-auto max-w-7xl">

          {/* Top grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12 pb-12 border-b border-white/8">

            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex flex-col leading-none mb-4 group">
                <span className="text-[#F5C518] font-black text-[18px] tracking-tight transition-all group-hover:drop-shadow-[0_0_6px_rgba(245,197,24,0.5)]">OIM</span>
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
                    <a href={item.href} className="text-[13px] text-white/45 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block">
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
                    <a href="#services" className="text-[13px] text-white/45 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block">{s}</a>
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
                  <a href="tel:+14705950121" className="text-[13px] text-white/45 hover:text-white transition-colors duration-200">+1 (470) 595-0121</a>
                </li>
                <li>
                  <a href="mailto:oiminstallllc@gmail.com" className="text-[13px] text-white/45 hover:text-white transition-colors duration-200">oiminstallllc@gmail.com</a>
                </li>
                <li>
                  <a href="https://instagram.com/oimayen" target="_blank" rel="noopener noreferrer" className="text-[13px] text-white/45 hover:text-[#F5C518] transition-colors duration-200">@oimayen</a>
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
              <span className="text-[12px] text-white/22 cursor-pointer hover:text-white/50 transition-colors">
                {lang === 'en' ? 'Privacy' : 'Privacidad'}
              </span>
              <span className="text-[12px] text-white/22 cursor-pointer hover:text-white/50 transition-colors">
                {lang === 'en' ? 'Terms' : 'Términos'}
              </span>
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
}
