# Design: OIM Website Redesign

## Technical Approach

Redesign OIM's single-file React app into a modular component architecture with video-driven hero, scroll-triggered animations, and bilingual support. Refactor from 500-line App.tsx into separation of concerns with Motion for cinematic transitions.

## Architecture Decisions

### Decision: Component Structure

| Choice | Alternatives Considered | Rationale |
|--------|------------------------|-----------|
| Feature-based folders (`components/sections/`, `hooks/`, `data/`) | Flat structure, page-based routing | Current spec is single-page - feature folders scale better for future pages |
| Custom hooks for video/scroll logic | Inline useEffect | Reusable, testable, separates concerns from UI |
| JSON for service/content data | Hardcoded in components | Enables bilingual data swap without component changes |

### Decision: Video Implementation

| Choice | Alternatives Considered | Rationale |
|--------|------------------------|-----------|
| Native `<video>` with Motion wrapper | Canvas/WebGL, Lottie | Simpler, better accessibility, lighter than canvas |
| useInView hook for scroll trigger | Scroll listener, IntersectionObserver raw | Motion's useInView handles threshold + cleanup |
| IntersectionObserver for 80vh detection | Motion's useScroll directly | Need explicit 80vh trigger point control |

### Decision: Bilingual Implementation

| Choice | Alternatives Considered | Rationale |
|--------|------------------------|-----------|
| React Context for language state | URL params, cookies | Simple enough for single-page, avoids hydration mismatch |
| Separate content JSON files | Inline translation objects | Cleaner separation, easier to maintain |
| Context Consumer pattern | useTranslation hook | Matches React 19 patterns, avoids custom hook overhead |

## Data Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   LanguageCtx   │────▶│  Section Props   │────▶│  Components     │
│  (provides:    │     │  (content data)  │     │  (render UI)    │
│   lang, toggle) │     │                  │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
         │                       │
         │                       ▼
         │              ┌──────────────────┐
         │              │  useScrollTrigger│
         └────────────▶│  (80vh video)    │
                        └──────────────────┘
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/contexts/LanguageContext.tsx` | Create | Bilingual state management |
| `src/data/content-en.json` | Create | English content |
| `src/data/content-es.json` | Create | Spanish content |
| `src/hooks/useScrollTrigger.ts` | Create | 80vh video trigger logic |
| `src/components/sections/Hero.tsx` | Create | Video hero component |
| `src/components/sections/Services.tsx` | Create | Services section |
| `src/components/sections/About.tsx` | Create | About section |
| `src/components/sections/Gallery.tsx` | Create | Gallery section |
| `src/components/sections/Contact.tsx` | Create | Contact section |
| `src/components/ui/Navbar.tsx` | Create | Navigation |
| `src/components/ui/Footer.tsx` | Create | Footer |
| `src/components/ui/ServiceCard.tsx` | Create | Reusable service card |
| `src/components/ui/TrustBadge.tsx` | Create | Trust badge component |
| `src/App.tsx` | Modify | Orchestrate sections only |
| `src/index.css` | Modify | Extend Tailwind theme tokens |

## Animation Tokens (Framer Motion Config)

```typescript
// src/config/animations.ts
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
    spring: [0.25, 0.1, 0.25, 1], // cubic-bezier
    dramatic: "easeInOut",
    enter: [0.4, 0, 0.2, 1], // Material Design standard
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
    } 
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: animationTokens.stagger.normal 
    }
  }
};
```

## State Management

| State | Location | Type | Purpose |
|-------|----------|------|---------|
| `language` | LanguageContext | `en` \| `es` | Bilingual toggle |
| `scrollPosition` | useScrollTrigger hook | `number` | Track 80vh threshold |
| `videoPlaying` | Hero component | `boolean` | Hero video state |
| `galleryFilter` | Gallery component | `string` | Category filter |
| `formStatus` | Contact component | `idle` \| `submitting` \| `success` | Form submission |

## Interfaces / Contracts

```typescript
// src/types/content.ts
interface Service {
  id: string;
  icon: string; // lucide-react icon name
  title: string;
  description: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  category: 'corporate' | 'executive' | 'beforeAfter';
  image: string;
}

interface Content {
  hero: {
    tagline: string;
    subheadline: string;
    cta: string;
    badges: string[];
  };
  services: Service[];
  about: {
    headline: string;
    body: string;
    bilingualHighlight: string;
  };
  gallery: {
    categories: string[];
    projects: Project[];
  };
  contact: {
    address: string;
    formLabels: {
      name: string;
      company: string;
      phone: string;
      service: string;
      message: string;
      submit: string;
    };
  };
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Animation variants, utility functions | Vitest + @testing-library/react |
| Integration | LanguageContext toggle, form submission | Component tests |
| E2E | Full scroll sequence, video playback | Playwright |
| Visual | Component rendering | Screenshot diff on PRs |

## Migration / Rollback Plan

1. **Phase 1**: Create new component files (parallel with existing App.tsx)
2. **Phase 2**: Add LanguageContext and data files
3. **Phase 3**: Wire components into App.tsx - no breaking changes until complete
4. **Phase 4**: Remove old component code from App.tsx
5. **Rollback**: Keep old App.tsx backup in `src/components/legacy/`

No migration required - static content only.

## Open Questions

- [ ] Where are video assets (Interior_Design.mp4, Home_exploding_view.mp4) located?
- [ ] Should gallery images come from external URLs or local assets?
- [ ] Is form submission stubbed or connected to backend?