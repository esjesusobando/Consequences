const socialLinks = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Behance", href: "https://behance.net" },
];

export function ContactSection() {
  return (
    <section id="contact" className="section-padding" style={{ background: "var(--ink)" }}>
      <div className="container">
        {/* Label */}
        <p className="text-sm uppercase tracking-widest text-white/40 mb-8">
          Let's work together
        </p>

        {/* Email - simple link */}
        <a
          href="mailto:hola@sofiamayen.com"
          className="display-lg text-paper block hover:text-white/70 transition-colors"
        >
          hola@sofiamayen.com
        </a>

        {/* Social Links */}
        <div className="mt-16 flex flex-wrap gap-8">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm uppercase tracking-widest text-white/40 hover:text-white transition-colors"
            >
              {link.label} →
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}