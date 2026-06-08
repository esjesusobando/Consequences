/**
 * useVideoPlayback Hook - Controls video playback with loading states
 */

import { useState, useRef, useEffect, useCallback } from "react";

interface UseVideoPlaybackOptions {
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
}

interface VideoPlaybackState {
  isPlaying: boolean;
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
  duration: number;
  currentTime: number;
}

export function useVideoPlayback(options: UseVideoPlaybackOptions = {}) {
  const {
    autoPlay = true,
    muted = true,
    loop = true,
    playsInline = true,
  } = options;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<VideoPlaybackState>({
    isPlaying: false,
    isLoading: true,
    isLoaded: false,
    error: null,
    duration: 0,
    currentTime: 0,
  });

  const play = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Autoplay was prevented, set loading to false
        setState((prev) => ({ ...prev, isLoading: false }));
      });
    }
  }, []);

  const pause = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  // Handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
    };

    const handleCanPlay = () => {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isLoaded: true,
        duration: video.duration || 0,
      }));
      if (autoPlay) {
        play();
      }
    };

    const handlePlay = () => {
      setState((prev) => ({ ...prev, isPlaying: true }));
    };

    const handlePause = () => {
      setState((prev) => ({ ...prev, isPlaying: false }));
    };

    const handleEnded = () => {
      if (loop) {
        video.play();
      }
    };

    const handleTimeUpdate = () => {
      setState((prev) => ({ ...prev, currentTime: video.currentTime }));
    };

    const handleError = () => {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isLoaded: false,
        error: "Failed to load video",
      }));
    };

    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("error", handleError);

    // Set initial attributes
    video.autoplay = autoPlay;
    video.muted = muted;
    video.loop = loop;
    video.playsInline = playsInline;

    return () => {
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("error", handleError);
    };
  }, [autoPlay, muted, loop, playsInline, play]);

  return {
    videoRef,
    ...state,
    play,
    pause,
    togglePlay,
  };
}

/**
 * useIntersectionObserver Hook - Simple wrapper for Intersection Observer API
 */

import { useEffect, useState, useRef } from "react";

export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(target);
    return () => observer.disconnect();
  }, [options]);

  return { targetRef, isIntersecting };
}