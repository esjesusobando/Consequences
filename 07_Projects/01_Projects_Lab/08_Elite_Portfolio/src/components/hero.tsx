"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

interface HeroProps {
  name?: string;
  role?: string;
  tagline?: string;
}

export function Hero({
  name = "CREATOR",
  role = "Product Designer",
  tagline = "Crafting experiences that feel inevitable.",
}: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Parallax effects - subtle
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  
  // Spring animation for smooth feel
  const springY = useSpring(y, { stiffness: 80, damping: 25 });
  const springOpacity = useSpring(opacity, { stiffness: 80, damping: 25 });

  const currentYear = new Date().getFullYear();

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[100dvh] w-full flex flex-col justify-center px-6 md:px-12 lg:px-16 overflow-hidden"
    >
      {/* Background - clean minimal */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 100% 80% at 50% 120%, rgba(9,9,11,0.03) 0%, transparent 50%)',
        }}
      />

      {/* Main content */}
      <motion.div 
        style={{ y: springY, opacity: springOpacity }}
        className="relative z-10 max-w-7xl"
      >
        {/* Role - minimal, uppercase */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs uppercase tracking-[0.3em] mb-6 md:mb-10 text-[var(--muted)] font-medium"
        >
          {role}
        </motion.p>

        {/* GIANT TYPOGRAPHY - Archivo 900 */}
        <h1 
          className="leading-[0.82] tracking-tight"
          style={{
            fontSize: 'clamp(3.5rem, 14vw, 13rem)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            color: 'var(--ink)',
            fontFamily: "'Archivo', sans-serif",
          }}
        >
          <motion.span
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="block"
          >
            {name}
          </motion.span>
        </h1>

        {/* Tagline - clean, minimal */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 md:mt-12 text-base md:text-lg max-w-lg text-[var(--muted)] font-normal"
        >
          {tagline}
        </motion.p>
      </motion.div>

      {/* Year - minimal, corners */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="absolute top-8 right-6 md:right-16 text-xs tracking-[0.15em] uppercase text-[var(--muted)] font-medium"
      >
        {currentYear}
      </motion.div>

      {/* Scroll indicator - minimal line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        className="absolute bottom-10 left-6 md:left-16 flex items-center gap-4"
      >
        <span 
          className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]"
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-px h-10"
          style={{ 
            background: 'var(--muted)',
            opacity: 0.4
          }}
        />
      </motion.div>

      {/* Corner accents - subtle */}
      <div className="absolute top-8 left-6 md:left-16 w-3 h-3 border-l border-t border-[var(--line)]" />
      <div className="absolute bottom-10 right-6 md:right-16 w-3 h-3 border-r border-b border-[var(--line)]" />
    </section>
  );
}