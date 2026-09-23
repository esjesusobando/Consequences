import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';
import { MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  const { content } = useLanguage();
  const { footer, contact } = content;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-surface-container-lowest w-full mt-20 border-t border-outline-variant/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <button 
              onClick={() => scrollToSection('hero')}
              className="text-3xl font-extrabold font-headline tracking-tighter text-primary"
            >
              OIM
            </button>
            <p className="text-sm text-on-surface-variant leading-relaxed max-w-xs">
              {footer.description}
            </p>
            <div className="flex items-center gap-2 text-sm text-on-surface-variant">
              <MapPin className="w-4 h-4 text-secondary" />
              <span>{contact.address}</span>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h4 className="text-on-surface font-bold text-sm font-headline uppercase tracking-wider">
              {content.navigation.services}
            </h4>
            <div className="flex flex-col gap-3">
              {footer.services.map((link) => (
                <button 
                  key={link}
                  onClick={() => scrollToSection('services')}
                  className="text-on-surface-variant text-sm text-left hover:text-primary transition-colors"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>

          {/* Company */}
          <div className="space-y-6">
            <h4 className="text-on-surface font-bold text-sm font-headline uppercase tracking-wider">
              Company
            </h4>
            <div className="flex flex-col gap-3">
              {footer.company.map((link) => (
                <button 
                  key={link}
                  onClick={() => scrollToSection(link.toLowerCase())}
                  className="text-on-surface-variant text-sm text-left hover:text-primary transition-colors"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-on-surface font-bold text-sm font-headline uppercase tracking-wider">
              {content.navigation.contact}
            </h4>
            <div className="flex flex-col gap-3 text-sm text-on-surface-variant">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-secondary" />
                <span>(404) 555-0123</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-secondary" />
                <span>info@oimatlanta.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold tracking-widest uppercase text-on-surface-variant/60">
            © 2024 OIM. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs font-bold tracking-widest uppercase text-on-surface-variant/60 hover:text-on-surface transition-colors">
              Privacy
            </a>
            <a href="#" className="text-xs font-bold tracking-widest uppercase text-on-surface-variant/60 hover:text-on-surface transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}