/**
 * useScrollTrigger Hook - Detects when scroll position exceeds threshold
 */

import { useState, useEffect } from "react";

interface UseScrollTriggerOptions {
  threshold?: number; // percentage of viewport height (0-100)
  triggerOnce?: boolean;
}

export function useScrollTrigger(options: UseScrollTriggerOptions = {}) {
  const { threshold = 80, triggerOnce = true } = options;
  const [isTriggered, setIsTriggered] = useState(false);

  useEffect(() => {
    const thresholdPx = (window.innerHeight * threshold) / 100;

    const handleScroll = () => {
      if (triggerOnce && isTriggered) return;
      
      const scrollY = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;
      
      // Check if we've scrolled past the threshold position
      const shouldTrigger = scrollY > thresholdPx || 
        (pageHeight > window.innerHeight && window.scrollY >= thresholdPx - window.innerHeight);
      
      if (shouldTrigger && !isTriggered) {
        setIsTriggered(true);
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold, triggerOnce, isTriggered]);

  return isTriggered;
}

/**
 * useScrollProgress Hook - Returns scroll progress as a percentage
 */

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return progress;
}

/**
 * useElementInView Hook - Detects when element enters viewport
 */

import { useRef, useState } from "react";

export function useElementInView(options: IntersectionObserverInit = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);

    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView };
}