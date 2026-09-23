export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="px-6 py-8 flex items-center justify-between" style={{ background: "var(--ink)" }}>
      <p className="text-xs text-white/30">© {currentYear} Sofía Mayen</p>
      <p className="text-xs uppercase tracking-widest text-white/20">Atlanta, GA</p>
    </footer>
  );
}