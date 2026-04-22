"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  bg: string;
  tall?: boolean;
}

const projects: Project[] = [
  { id: "1", title: "Estudio Jurídico Ríos", category: "Office Installation", year: "2024", bg: "#2a2018", tall: true },
  { id: "2", title: "Corporativo Brickell", category: "Full Setup", year: "2024", bg: "#1a1f2e" },
  { id: "3", title: "Tech Hub Midtown", category: "Reconfiguration", year: "2023", bg: "#1e1e1e" },
  { id: "4", title: "WeWork Buckhead", category: "Commercial", year: "2023", bg: "#251a10", tall: true },
  { id: "5", title: "Northside Medical", category: "Office Setup", year: "2023", bg: "#0f1a1a" },
  { id: "6", title: "Creative Agency NW", category: "Installation", year: "2022", bg: "#1a1015" },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.7, 
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1] 
      }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="group relative overflow-hidden cursor-pointer"
      style={{
        background: project.bg,
        aspectRatio: project.tall ? "3/4" : "4/3",
        borderRadius: "2px",
      }}
    >
      {/* Subtle inner light */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 30% 20%, rgba(255,255,255,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Hover overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 50%)",
        }}
      />

      {/* Meta - reveals on hover */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-5"
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-1">
          {project.category} · {project.year}
        </p>
        <p className="text-sm font-medium text-white" style={{ letterSpacing: "-0.01em" }}>
          {project.title}
        </p>
      </motion.div>

      {/* Grid lines detail */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </motion.div>
  );
}

export function ProjectsGrid() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true });

  return (
    <section id="work" className="px-6 md:px-16 py-24 md:py-40" style={{ background: "var(--paper)" }}>
      <div className="mx-auto max-w-7xl">

        {/* Section header */}
        <motion.div 
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-baseline justify-between mb-12 pb-5" 
          style={{ borderBottom: "1px solid var(--line)" }}
        >
          <p className="text-xs uppercase tracking-[0.24em]" style={{ color: "var(--muted)" }}>Selected Work</p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>{projects.length} projects</p>
        </motion.div>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}