"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Behance", href: "https://behance.net" },
];

export function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section 
      id="contact" 
      ref={ref} 
      className="px-6 md:px-16 py-24 md:py-48" 
      style={{ background: "var(--ink)" }}
    >
      <motion.div 
        className="mx-auto max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >

        {/* Label */}
        <motion.p 
          variants={itemVariants}
          className="text-xs uppercase tracking-[0.24em] mb-8" 
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          Let's work together
        </motion.p>

        {/* Email - Giant typography */}
        <motion.a
          variants={itemVariants}
          href="mailto:hola@sofiamayen.com"
          className="serif block leading-none cursor-pointer"
          style={{
            fontSize: "clamp(2rem, 8vw, 7rem)",
            letterSpacing: "-0.03em",
            color: "white",
          }}
          whileHover={{ 
            color: "rgba(255,255,255,0.7)",
            x: 8
          }}
          transition={{ duration: 0.3 }}
        >
          hola@sofiamayen.com
        </motion.a>

        {/* Social Links */}
        <motion.div 
          variants={itemVariants}
          className="mt-16 md:mt-24 flex flex-col sm:flex-row gap-6 md:gap-12"
        >
          {socialLinks.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-[0.22em] cursor-pointer inline-flex items-center gap-2"
              style={{ color: "rgba(255,255,255,0.35)" }}
              whileHover={{ 
                color: "white",
                x: 4
              }}
              transition={{ duration: 0.2 }}
            >
              {link.label}
              <span>→</span>
            </motion.a>
          ))}
        </motion.div>

      </motion.div>
    </section>
  );
}