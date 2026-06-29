"use client";

import { useEffect, useState } from "react";

const navLinks = [
  { label: "Work", href: "#projects" },
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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 transition-all duration-300 ${
        scrolled ? "bg-paper/80 backdrop-blur-md border-b border-subtle" : ""
      }`}
    >
      {/* Logo/Brand */}
      <a href="#" className="text-sm font-medium tracking-widest text-ink">
        SM
      </a>

      {/* Navigation Links */}
      <div className="flex items-center gap-8">
        {navLinks.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="text-xs uppercase tracking-widest text-muted hover:text-ink transition-colors"
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}