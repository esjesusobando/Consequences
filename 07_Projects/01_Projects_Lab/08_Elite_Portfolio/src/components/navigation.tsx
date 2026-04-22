"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-16 py-5 md:py-6"
      style={{
        background: scrolled 
          ? "rgba(245,243,239,0.75)" 
          : "transparent",
        backdropFilter: scrolled 
          ? "blur(20px) saturate(180%)" 
          : "none",
        WebkitBackdropFilter: scrolled 
          ? "blur(20px) saturate(180%)" 
          : "none",
        borderBottom: scrolled 
          ? "1px solid rgba(12,12,12,0.06)" 
          : "1px solid transparent",
      }}
    >
      {/* Logo/Brand */}
      <a
        href="#"
        className="text-xs font-medium uppercase tracking-[0.28em] transition-colors duration-200"
        style={{ 
          color: 'var(--ink)',
          fontWeight: 500 
        }}
      >
        SM
      </a>

      {/* Navigation Links */}
      <div className="flex items-center gap-6 md:gap-10">
        {navLinks.map(({ label, href }, i) => (
          <motion.a
            key={label}
            href={href}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4, 
              delay: 0.1 + (i * 0.05),
              ease: [0.16, 1, 0.3, 1] 
            }}
            className="text-xs uppercase tracking-[0.2em] transition-colors duration-200 cursor-pointer"
            style={{ 
              color: 'var(--muted)',
              fontWeight: 400 
            }}
            whileHover={{ color: 'var(--ink)' }}
          >
            {label}
          </motion.a>
        ))}
      </div>
    </motion.nav>
  );
}