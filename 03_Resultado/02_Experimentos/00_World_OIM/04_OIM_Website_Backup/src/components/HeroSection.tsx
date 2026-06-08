'use client';

import { useRef, useEffect } from 'react';

interface HeroSectionProps {
  videoSrc: string;
  posterSrc?: string;
  children?: React.ReactNode;
}

export function HeroSection({ videoSrc, posterSrc, children }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;
    video.loop = true;

    const onReady = async () => {
      if (videoRef.current) {
        videoRef.current.style.opacity = '1';
      }
      try { await video.play(); } catch { /* autoplay blocked — silent fail */ }
    };

    if (video.readyState >= 3) {
      onReady();
    } else {
      video.addEventListener('canplay', onReady, { once: true });
    }

    return () => video.removeEventListener('canplay', onReady);
  }, [videoSrc]);

  return (
    <section id="hero" className="relative w-full min-h-[100dvh] overflow-hidden bg-[#0d1b2a]">

      <div className="absolute inset-0 bg-[#0d1b2a]" />

      <video
        ref={videoRef}
        src={videoSrc}
        poster={posterSrc}
        playsInline
        muted
        loop
        autoPlay
        preload="auto"
        aria-hidden="true"
        suppressHydrationWarning
        className="absolute inset-0 w-full h-full object-cover will-change-transform"
        style={{ opacity: 1 }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/78 via-black/44 to-black/12" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/62 via-transparent to-transparent" />

      <div className="relative z-10 flex min-h-[100dvh] items-end pb-16 md:items-center md:pb-0">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-10">
          {children}
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-10"
        style={{
          height: '20vh',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.65) 55%, #ffffff 100%)',
        }}
      />


    </section>
  );
}
