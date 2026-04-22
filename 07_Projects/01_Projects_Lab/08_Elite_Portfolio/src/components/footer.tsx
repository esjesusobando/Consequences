"use client";

import { motion } from "framer-motion";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="px-6 md:px-16 py-8 flex items-center justify-between" 
      style={{ 
        background: "var(--ink)", 
        borderTop: "1px solid rgba(255,255,255,0.06)" 
      }}
    >
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-xs" 
        style={{ color: "rgba(255,255,255,0.25)" }}
      >
        © {currentYear} Sofía Mayen
      </motion.p>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="text-xs uppercase tracking-[0.2em]" 
        style={{ color: "rgba(255,255,255,0.2)" }}
      >
        Atlanta, GA
      </motion.p>
    </footer>
  );
}