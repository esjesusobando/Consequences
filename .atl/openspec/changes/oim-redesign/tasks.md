# Tasks: OIM Website Redesign

## Phase 1: Foundation & Setup

### 1.1 Project Initialization
- [x] 1.1.1 Set up project structure with feature-based folders (`components/sections/`, `hooks/`, `data/`, `contexts/`, `types/`, `config/`)
- [x] 1.1.2 Configure Tailwind theme tokens for OIM branding (no dark theme, corporate B2B colors)
- [x] 1.1.3 Verify Motion is properly configured (already in package.json)

### 1.2 Video Assets Setup
- [x] 1.2.1 Copy video files (Interior_Design.mp4, Home_exploding_view.mp4) to project public folder
- [x] 1.2.2 Create video component utilities for optimized playback
- [x] 1.2.3 Implement video loading state handling

## Phase 2: Core Infrastructure

### 2.1 TypeScript Types
- [x] 2.1.1 Create content types in `src/types/content.ts`
- [x] 2.1.2 Create Service and Project type definitions

### 2.2 Animation Configuration
- [x] 2.2.1 Create animation tokens/config in `src/config/animations.ts`
- [x] 2.2.2 Create reusable animation variants (fadeInUp, staggerContainer)

### 2.3 Language Context
- [x] 2.3.1 Create LanguageContext provider in `src/contexts/LanguageContext.tsx`
- [x] 2.3.2 Implement language toggle functionality

### 2.4 Content Data
- [x] 2.4.1 Create English content file `src/data/content-en.json`
- [x] 2.4.2 Create Spanish content file `src/data/content-es.json`

### 2.5 Custom Hooks
- [x] 2.5.1 Create useScrollTrigger hook for 80vh video trigger
- [x] 2.5.2 Create useVideoPlayback hook for hero video control

## Phase 3: Components

### 3.1 Navigation
- [ ] 3.1.1 Create Navbar component with bilingual support
- [ ] 3.1.2 Create Footer component

### 3.2 Hero Section
- [ ] 3.2.1 Create video hero component with Interior_Design.mp4
- [ ] 3.2.2 Implement trust badges (8+ Years, Bilingual, Licensed, ATL)
- [ ] 3.2.3 Add scroll-triggered video at 80vh

### 3.3 Services Section
- [ ] 3.3.1 Create asymmetric icon grid layout (5 services)
- [ ] 3.3.2 Implement service card hover animations
- [ ] 3.3.3 Add mobile responsive stacking

### 3.4 About Section
- [ ] 3.4.1 Create company story section with bilingual support
- [ ] 3.4.2 Implement staggered text animations

### 3.5 Gallery Section
- [ ] 3.5.1 Create masonry-style project showcase
- [ ] 3.5.2 Implement category filtering (Corporate, Executive, Before & After)
- [ ] 3.5.3 Add hover zoom effects

### 3.6 Contact Section
- [ ] 3.6.1 Create contact form with validation
- [ ] 3.6.2 Display address: 3715 NORTHCREST RD SUITE 19, ATLANTA, GA 30340
- [ ] 3.6.3 Implement bilingual form labels

## Phase 4: Integration

### 4.1 App Integration
- [ ] 4.1.1 Wire all components into App.tsx
- [ ] 4.1.2 Remove legacy code from App.tsx
- [ ] 4.1.3 Test full scroll sequence

### 4.2 Polish
- [ ] 4.2.1 Verify all animations work correctly
- [ ] 4.2.2 Test bilingual toggle throughout
- [ ] 4.2.3 Validate responsive layouts

## Dependencies
- React 19 + Vite 6
- Tailwind CSS 4
- Motion (framer-motion successor)
- Lucide React (icons)