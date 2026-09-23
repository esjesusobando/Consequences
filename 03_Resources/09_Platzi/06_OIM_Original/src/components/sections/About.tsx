import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';
import { CheckCircle2, Languages } from 'lucide-react';

export function About() {
  const { content } = useLanguage();
  const { about } = content;

  return (
    <section id="process" className="py-24 lg:py-32 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left - Visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Asymmetric image layout */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop"
                    alt="Office installation"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="bg-primary-container/20 rounded-2xl p-6">
                  <div className="text-3xl font-extrabold font-headline text-primary">8+</div>
                  <div className="text-sm font-medium text-on-surface-variant">Years of Excellence</div>
                </div>
              </div>
              <div className="pt-8 space-y-4">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop"
                    alt="Team collaboration"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="bg-secondary-container/20 rounded-2xl p-6 flex items-center gap-4">
                  <Languages className="w-8 h-8 text-secondary" />
                  <div>
                    <div className="text-lg font-bold font-headline text-on-surface">Bilingual</div>
                    <div className="text-sm text-on-surface-variant">EN / ES</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative element */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl -z-10" />
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl lg:text-4xl font-extrabold font-headline tracking-tight text-on-surface mb-6">
                {about.headline}
              </h2>
              <p className="text-on-surface-variant leading-relaxed text-lg">
                {about.body}
              </p>
            </div>

            {/* Bilingual highlight */}
            <div className="bg-surface-container rounded-xl p-6 border-l-4 border-secondary">
              <div className="flex items-center gap-3 mb-3">
                <Languages className="w-5 h-5 text-secondary" />
                <span className="font-bold font-headline text-on-surface">Bilingual Service</span>
              </div>
              <p className="text-sm text-on-surface-variant">
                {about.bilingualHighlight}
              </p>
            </div>

            {/* Trust points */}
            <div className="space-y-4">
              {[
                'Licensed & Insured',
                'Atlanta Area Specialists',
                'Professional Team',
                'Quality Guaranteed'
              ].map((item, i) => (
                <motion.div 
                  key={item}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-medium text-on-surface">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}