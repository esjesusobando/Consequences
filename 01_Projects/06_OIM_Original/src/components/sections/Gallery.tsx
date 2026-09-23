import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowUpRight, X } from 'lucide-react';

export function Gallery() {
  const { content, language } = useLanguage();
  const { gallery } = content;
  const categories = gallery.categories;
  const activeCategoryFromState = categories.length > 0 ? categories[0] : null;
  const [activeCategory, setActiveCategory] = useState<string | null>(activeCategoryFromState);
  const [selectedProject, setSelectedProject] = useState<typeof gallery.projects[0] | null>(null);

  const projects = gallery.projects.filter(
    p => !activeCategory || activeCategory === 'All' || activeCategory === 'Todos' 
      ? true 
      : activeCategory === 'Corporate' || activeCategory === 'Corporativo'
        ? p.category === 'corporate'
        : activeCategory === 'Executive' || activeCategory === 'Ejecutivo'
          ? p.category === 'executive'
          : activeCategory === 'Before & After'
            ? p.category === 'beforeAfter'
            : p.category === 'beforeAfter'
  );

  return (
    <section id="portfolio" className="py-24 lg:py-32 bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
        >
          <div>
            <h2 className="text-3xl lg:text-4xl font-extrabold font-headline tracking-tight text-on-surface mb-4">
              {content.navigation.portfolio}
            </h2>
            <div className="w-16 h-1 bg-primary rounded-full" />
          </div>

          {/* Category tabs - unique styling */}
          <div className="flex flex-wrap gap-2">
            {categories.length === 0 ? (
              <span className="text-on-surface-variant text-sm">Loading categories...</span>
            ) : categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Gallery grid - asymmetric masonry-style */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -8 }}
                className={`group relative overflow-hidden rounded-xl cursor-pointer ${
                  index === 0 ? 'md:col-span-2 aspect-[16/10]' : 'aspect-square'
                }`}
                onClick={() => setSelectedProject(project)}
              >
                <img 
                  src={project.image} 
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-xl font-bold font-headline text-white mb-1">{project.title}</h4>
                    <p className="text-sm text-white/80">{project.description}</p>
                  </div>
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-on-surface/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-4xl w-full bg-surface-container rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video">
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-surface-container-high/80 flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold font-headline text-on-surface mb-2">{selectedProject.title}</h3>
                <p className="text-on-surface-variant">{selectedProject.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}