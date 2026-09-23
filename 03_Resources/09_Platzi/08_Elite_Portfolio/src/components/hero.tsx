"use client";

import { useRef } from "react";

interface HeroProps {
  name?: string;
  role?: string;
  tagline?: string;
}

export function Hero({
  name = "Sofía Mayen",
  role = "Product Designer & Creative Director",
  tagline = "Crafting experiences that feel inevitable.",
}: HeroProps) {
  return (
    <section className="min-h-[100dvh] flex flex-col justify-center section-padding">
      {/* Main content - centered, simple */}
      <div className="container">
        {/* Role - minimal, uppercase */}
        <p className="text-sm uppercase tracking-widest text-muted mb-8 animate-fade-up delay-0">
          {role}
        </p>

        {/* Giant typography - single line, centered */}
        <h1 className="display-xl text-center text-ink animate-fade-up delay-1">
          {name}
        </h1>

        {/* Tagline - clean, simple */}
        <p className="text-lg text-muted text-center mt-8 max-w-xl mx-auto animate-fade-up delay-2">
          {tagline}
        </p>

        {/* CTA - minimal button */}
        <div className="flex justify-center mt-12 animate-fade-up delay-3">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-ink hover:text-accent transition-colors duration-300"
          >
            View Work
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Corner accents - subtle lines */}
      <div className="absolute top-6 left-6 w-8 h-px bg-subtle hidden lg:block" />
      <div className="absolute top-6 left-6 w-px h-8 bg-subtle hidden lg:block" />
      <div className="absolute bottom-6 right-6 w-8 h-px bg-subtle hidden lg:block" />
      <div className="absolute bottom-6 right-6 w-px h-8 bg-subtle hidden lg:block" />
    </section>
  );
}