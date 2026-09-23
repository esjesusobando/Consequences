import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';
import { TrustBadge } from '../ui/TrustBadge';
import { ArrowRight, Play } from 'lucide-react';

export function Hero() {
  const { content } = useLanguage();
  const { hero } = content;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay blocked - show fallback
      });
    }
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-surface">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className="w-full h-full object-cover opacity-40"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Crect fill='%23f8f9fa'/%3E%3C/svg%3E"
        >
          <source src="/Interior_Design.mp4" type="video/mp4" />
        </video>
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content - NO centered, asymmetric layout */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Trust badges - positioned left */}
            <TrustBadge badges={hero.badges} />

            {/* Headline - left aligned, not centered */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold font-headline tracking-tight text-on-surface leading-[0.95]">
              {hero.tagline.split(', ').map((word, i) => (
                <span key={i}>
                  {i === 0 ? word : word}
                  {i < hero.tagline.split(', ').length - 1 && <br />}
                </span>
              ))}
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-on-surface-variant max-w-xl leading-relaxed font-body">
              {hero.subheadline}
            </p>

            {/* CTA - left aligned */}
            <motion.div 
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollToSection('contact')}
                className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-4 rounded-xl font-semibold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all flex items-center gap-2"
              >
                {hero.cta}
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <button 
                onClick={() => scrollToSection('services')}
                className="group flex items-center gap-2 text-sm font-bold text-on-surface hover:text-primary transition-colors"
              >
                View Services
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          </motion.div>

          {/* Right side - visual element, not generic image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            {/* Decorative elements - intentional asymmetry */}
            <div className="relative">
              {/* Floating cards with offset */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-8 -right-8 w-48 h-48 bg-primary-container/30 rounded-2xl blur-2xl"
              />
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-12 w-40 h-40 bg-secondary-container/30 rounded-2xl blur-2xl"
              />
              
              {/* Stats card - asymmetric placement */}
              <div className="ml-auto w-64 bg-surface-container-low rounded-2xl p-6 shadow-xl">
                <div className="text-4xl font-extrabold font-headline text-primary mb-1">8+</div>
                <div className="text-sm font-medium text-on-surface-variant">Years Experience</div>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-surface-container-high border-2 border-surface-container-low" />
                    ))}
                  </div>
                  <span className="text-xs text-on-surface-variant ml-2">500+ Projects</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-on-surface-variant/30 flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-on-surface-variant/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}