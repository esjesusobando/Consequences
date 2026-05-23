'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, type Transition } from 'framer-motion';
import { MessageCircle, MapPin, Shield, Clock, Award } from 'lucide-react';
import { HeroSection } from '@/components/HeroSection';
import { ScrollVideoServices } from '@/components/ScrollVideoServices';

// Spring transition - taste-skill standard
const spring: Transition = {
  type: 'spring',
  stiffness: 100,
  damping: 20,
};

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
      <HeroSection videoSrc="/videos/3D_interior_design.mp4">
        <div className="max-w-[600px]">

          {/* Badges — Lucide icons */}
          <motion.div 
            className="animate-fade-up flex flex-wrap gap-2 mb-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/6 px-3.5 py-[7px] text-[11px] font-semibold uppercase tracking-[0.06em] text-white/70 backdrop-blur-sm">
              <span className="h-[5px] w-[5px] rounded-full bg-[#F5C518] flex-shrink-0" />
              Corporate Space Management Engineering
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/16 bg-white/6 px-3.5 py-[7px] text-[11px] font-semibold uppercase tracking-[0.06em] text-white/70 backdrop-blur-sm">
              <MapPin className="w-3 h-3" />
              Atlanta &amp; Surrounding Areas
            </span>
          </motion.div>

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
              <MessageCircle className="w-[15px] h-[15px] text-[#F5C518]" aria-hidden="true" />
              Chat on WhatsApp
            </a>
          </div>

          {/* Stats — Taste Style: asymmetric grid 7/5 with Lucide icons */}
          <motion.div 
            className="animate-fade-up-3 mt-8 pt-7 border-t border-white/10 grid grid-cols-12 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.32 }}
          >
            {/* Left: 7 cols with icons */}
            <div className="col-span-12 sm:col-span-7">
              <div className="grid grid-cols-2 gap-4">
                {(lang === 'en' ? [
                  { val: '8', label: 'Years of Service', icon: Clock },
                  { val: '15', label: 'Years of Experience', icon: Award },
                ] : [
                  { val: '8', label: 'Años de Servicio', icon: Clock },
                  { val: '15', label: 'Años de Experiencia', icon: Award },
                ]).map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.val} className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-[#F5C518] flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[15px] font-bold text-white leading-tight" style={{ letterSpacing: '-0.01em' }}>{s.val}</span>
                        <span className="text-[12px] font-medium text-white/40 mt-0.5">{s.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Right: 5 cols */}
            <div className="col-span-12 sm:col-span-5 border-t border-white/10 pt-4 sm:border-t-0 sm:pt-0">
              <div className="flex flex-col gap-3">
                {(lang === 'en' ? [
                  { val: 'Licensed', label: '& Insured', icon: Shield },
                  { val: 'Atlanta', label: 'Metro Service', icon: MapPin },
                ] : [
                  { val: 'Licenciados', label: 'y Asegurados', icon: Shield },
                  { val: 'Atlanta', label: 'Metro Service', icon: MapPin },
                ]).map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.val} className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-[#F5C518] flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[15px] font-medium text-white/80">{s.val}</span>
                        <span className="text-[12px] font-medium text-white/40">{s.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
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
