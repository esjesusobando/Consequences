"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const expertiseItems = ["Product Design", "Brand Identity", "UI/UX Systems", "Creative Direction"];
const clientsItems = ["Tech startups", "Creative agencies", "Local businesses", "Corporate environments"];

export function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section 
      id="about" 
      ref={ref} 
      className="px-6 md:px-16 py-24 md:py-40" 
      style={{ background: "var(--paper)" }}
    >
      <motion.div 
        className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >

        {/* Left column - Bio */}
        <motion.div variants={itemVariants}>
          <p className="text-xs uppercase tracking-[0.24em] mb-6" style={{ color: "var(--muted)" }}>
            About
          </p>
          <h2 
            className="serif text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-8" 
            style={{ letterSpacing: "-0.02em", color: "var(--ink)" }}
          >
            Design that <em className="italic">lives</em> in the real world.
          </h2>
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--muted)" }}>
            I'm a product designer with 6+ years building interfaces that balance clarity, emotion, and function. I work across brand identity, digital product, and creative direction.
          </p>
          <p className="text-base" style={{ color: "var(--muted)" }}>
            Based in Atlanta. Open to remote collaborations worldwide.
          </p>
        </motion.div>

        {/* Right column - Skills & Clients */}
        <motion.div className="flex flex-col justify-between gap-12">
          
          {/* Expertise */}
          <motion.div variants={itemVariants}>
            <p className="text-xs uppercase tracking-[0.22em] mb-4" style={{ color: "var(--muted)" }}>Expertise</p>
            <div className="flex flex-wrap gap-2">
              {expertiseItems.map((item, i) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.3 + (i * 0.05), duration: 0.4 }}
                  className="text-xs px-4 py-2 rounded-full cursor-default"
                  style={{ 
                    border: "1px solid var(--line)", 
                    color: "var(--ink)",
                    fontWeight: 400
                  }}
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Clients */}
          <motion.div variants={itemVariants}>
            <p className="text-xs uppercase tracking-[0.22em] mb-4" style={{ color: "var(--muted)" }}>Clients</p>
            <div className="flex flex-wrap gap-2">
              {clientsItems.map((item, i) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.5 + (i * 0.05), duration: 0.4 }}
                  className="text-xs px-4 py-2 rounded-full cursor-default"
                  style={{ 
                    border: "1px solid var(--line)", 
                    color: "var(--muted)"
                  }}
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.div>

        </motion.div>

      </motion.div>
    </section>
  );
}