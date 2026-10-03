# OIM Website Redesign - Specification

> **Change**: oim-redesign  
> **Mode**: openspec  
> **Generated**: April 2026

---

## Purpose

This specification defines the requirements for the OIM (Office Installations Mayen) website redesign - a corporate B2B site serving Atlanta's office furniture installation market. The site MUST deliver a cinematic, bilingual (EN/ES) experience that reflects the client's professional identity while adhering to Taste-Skill design principles.

---

## Requirements

### Requirement: Home Section - Video Hero

The Home section SHALL feature a full-viewport video background with supporting content overlay.

- **GIVEN** a user navigates to the OIM website
- **WHEN** the page loads
- **THEN** the hero video (Interior_Design.mp4) SHALL auto-play in a loop with muted audio
- **AND** the tagline "Professional Office Furniture Installation in Atlanta" SHALL display over the video
- **AND** the sub-headline SHALL show "Since 2018, providing reliable, high-quality furniture assembly and relocation services for corporate and residential spaces."

#### Scenario: Hero CTA Interaction

- **GIVEN** a user views the hero section
- **WHEN** clicking "Get a Free Quote" CTA
- **THEN** the user SHALL be navigated to the Contact section
- **AND** the form SHALL pre-populate with the selected service type

#### Scenario: Trust Badges Display

- **GIVEN** a user views the hero section
- **THEN** the trust badges SHALL display: "8+ Years", "Bilingual", "Licensed", "ATL"
- **AND** they SHALL be positioned in a horizontal non-centered layout per Taste-Skill principles

---

### Requirement: Scroll Effect Video

The Home section SHALL include a scroll-triggered video animation.

- **GIVEN** a user scrolls past the hero section
- **WHEN** scroll position exceeds 80vh
- **THEN** the scroll effect video (Home_exploding_view.mp4) SHALL trigger
- **AND** play automatically without user interaction
- **AND** loop seamlessly

#### Scenario: Scroll Effect Performance

- **GIVEN** a user scrolls rapidly through the hero
- **THEN** the scroll effect video SHALL NOT cause frame drops or jank
- **AND** SHALL be optimized for web delivery (max 5MB, webm/mp4)

---

### Requirement: Services Section - Icon Grid

The Services section SHALL display 5 services in an asymmetric icon grid layout.

- **GIVEN** a user navigates to the Services section
- **WHEN** the section becomes visible (viewport entry)
- **THEN** the 5 services SHALL render in an asymmetric layout (NOT 4-column grid)
- **AND** each service card SHALL contain: icon, title, description

| Service | Description |
|---------|-------------|
| Cubicle Installation | Expert assembly of modular office systems and workstations |
| Office Relocation | Seamless disassembly, transport, and reinstallation |
| Executive Suites & Desks | Precision setup for high-end office furniture |
| Delivery & Assembly | White-glove service from warehouse to final floor plan |
| Decommissioning & Liquidation | Professional removal and disposal of old office assets |

#### Scenario: Service Card Interaction

- **GIVEN** a user hovers over a service card
- **THEN** Framer Motion SHALL animate a subtle lift and shadow increase
- **AND** the icon SHALL scale to 1.1x

#### Scenario: Mobile Services Layout

- **GIVEN** a user views Services on viewport width < 768px
- **THEN** services SHALL stack vertically (single column)
- **AND** maintain icon visibility and readability

---

### Requirement: About Section - Company Story

The About section SHALL present the company's value proposition with bilingual support.

- **GIVEN** a user navigates to the About section
- **WHEN** the section enters viewport
- **THEN** the headline "Experience You Can Trust" SHALL animate in with stagger effect
- **AND** the company story SHALL display with proper typography hierarchy
- **AND** the bilingual advantage ("English & Español") SHALL be highlighted as a competitive differentiator for Atlanta market

#### Scenario: Bilingual Toggle

- **GIVEN** a user is on the About section
- **WHEN** clicking the language toggle (EN/ES)
- **THEN** all About content SHALL switch to the selected language
- **AND** maintain scroll position

---

### Requirement: Gallery Section - Project Showcase

The Gallery section SHALL display project categories with visual evidence.

- **GIVEN** a user navigates to the Gallery section
- **WHEN** the section loads
- **THEN** projects SHALL be organized by category: Corporate, Executive, Before & After
- **AND** display as masonry-style layout (NOT uniform grid)

#### Scenario: Category Filtering

- **GIVEN** a user views the Gallery
- **WHEN** clicking a category tab
- **THEN** only projects from that category SHALL display
- **AND** Framer Motion SHALL animate the transition

#### Scenario: Project Image Interaction

- **GIVEN** a user hovers over a gallery image
- **THEN** a subtle zoom effect SHALL apply (scale 1.05x)
- **AND** the project title SHALL overlay on hover

---

### Requirement: Contact Section - Information & Form

The Contact section SHALL display business information and a functional inquiry form.

- **GIVEN** a user navigates to the Contact section
- **WHEN** the section loads
- **THEN** the address "3715 NORTHCREST RD SUITE 19, ATLANTA, GA 30340" SHALL display prominently
- **AND** the contact form SHALL include: Name, Company, Phone, Service Type, Message

#### Scenario: Form Submission

- **GIVEN** a user fills out the contact form
- **WHEN** clicking "Submit"
- **THEN** the form SHALL validate required fields
- **AND** display success message on valid submission

#### Scenario: Bilingual Contact

- **GIVEN** a user toggles language on Contact section
- **THEN** all labels, placeholders, and button text SHALL translate
- **AND** form validation messages SHALL match selected language

---

### Requirement: Cinematic Animations

All sections SHALL implement Framer Motion animations per Taste-Skill principles.

- **GIVEN** a user navigates between sections
- **WHEN** each section enters viewport
- **THEN** content SHALL animate with: stagger reveal for text, fade-in for images, smooth transitions
- **AND** NO animation SHALL block user interaction

#### Scenario: Parallax Scrolling

- **GIVEN** a user scrolls the page
- **THEN** background elements SHALL move at different rates than foreground
- **AND** create depth perception without performance degradation

---

### Requirement: Visual Design - Client Preference Colors

The website SHALL use the client's preferred color scheme (NOT dark theme).

- **GIVEN** the website renders
- **WHEN** styling is applied
- **THEN** colors SHALL reflect the current production site aesthetic
- **AND** maintain corporate B2B professionalism
- **AND** avoid orange/dark combinations per client request

#### Scenario: Color Accessibility

- **GIVEN** all content renders with client colors
- **THEN** contrast ratios SHALL meet WCAG AA standards
- **AND** text SHALL remain readable on all backgrounds

---

## Scenarios Summary

| Section | Happy Paths | Edge Cases | Error States |
|---------|-------------|------------|---------------|
| Home | Video loads, CTA works, badges display | Slow connection (video fallback), mobile autoplay blocked | - |
| Services | Grid renders, hover works, mobile stacks | Many services (pagination), icons fail to load | - |
| About | Content displays, bilingual works | Translation missing, long content overflow | - |
| Gallery | Categories filter, images load | Slow image load, empty category | No projects in category |
| Contact | Form renders, validation works | Form submission fails, invalid email format | Server error on submit |

---

## Next Step

Ready for design phase (sdd-design) - create technical architecture document with approach for Framer Motion integration, video optimization strategy, and bilingual implementation pattern.

---

*Spec generated for OIM Website Redesign - April 2026*