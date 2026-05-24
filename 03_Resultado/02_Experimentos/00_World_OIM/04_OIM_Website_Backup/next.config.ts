import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,

  // ── STATIC EXPORT — para Hostinger (sin servidor Node.js) ──
  output: 'export',

  // Imagenes: permite servir desde static export
  images: {
    unoptimized: true,
  },

  // Compression — disabled for static export
  compress: false,
};

export default nextConfig;
