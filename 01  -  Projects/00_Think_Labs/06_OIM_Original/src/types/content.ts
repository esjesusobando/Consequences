/**
 * OIM Website Content Types
 */

export type Language = 'en' | 'es';

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'corporate' | 'executive' | 'beforeAfter';
  image: string;
}

export interface HeroContent {
  tagline: string;
  subheadline: string;
  cta: string;
  badges: string[];
}

export interface AboutContent {
  headline: string;
  body: string;
  bilingualHighlight: string;
}

export interface GalleryContent {
  categories: string[];
  projects: Project[];
}

export interface ContactFormLabels {
  name: string;
  company: string;
  phone: string;
  service: string;
  message: string;
  submit: string;
  success: string;
}

export interface ContactContent {
  address: string;
  formLabels: ContactFormLabels;
}

export interface Content {
  hero: HeroContent;
  services: Service[];
  about: AboutContent;
  gallery: GalleryContent;
  contact: ContactContent;
  navigation: {
    portfolio: string;
    services: string;
    process: string;
    insights: string;
    contact: string;
    getStarted: string;
  };
  footer: {
    description: string;
    services: string[];
    company: string[];
    locations: string[];
  };
}