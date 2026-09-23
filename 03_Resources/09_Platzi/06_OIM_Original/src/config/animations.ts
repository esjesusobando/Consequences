/**
 * Framer Motion Animation Configuration
 */

export const animationTokens = {
  // Durations (in seconds)
  duration: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.6,
    cinematic: 0.8,
  },
  // Ease curves
  ease: {
    smooth: "easeOut",
    spring: [0.25, 0.1, 0.25, 1],
    dramatic: "easeInOut",
    enter: [0.4, 0, 0.2, 1],
  },
  // Stagger delays
  stagger: {
    fast: 0.05,
    normal: 0.1,
    slow: 0.2,
  },
} as const;

// Reusable variants
export const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: animationTokens.duration.slow,
      ease: animationTokens.ease.smooth,
    },
  },
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: animationTokens.duration.slow,
      ease: animationTokens.ease.smooth,
    },
  },
};

export const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: animationTokens.duration.slow,
      ease: animationTokens.ease.smooth,
    },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: animationTokens.duration.normal,
    },
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: animationTokens.stagger.normal,
    },
  },
};

export const staggerContainerFast = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: animationTokens.stagger.fast,
    },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: animationTokens.duration.cinematic,
      ease: animationTokens.ease.enter,
    },
  },
};