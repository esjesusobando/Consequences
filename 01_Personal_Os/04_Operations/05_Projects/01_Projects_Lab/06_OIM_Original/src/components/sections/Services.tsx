import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ServiceCard } from '../ui/ServiceCard';
import { LayoutGrid, Package, Armchair, Truck, Trash2 } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutGrid,
  Package,
  Armchair,
  Truck,
  Trash2,
};

export function Services() {
  const { content } = useLanguage();
  const { services } = content;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="py-24 lg:py-32 bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header - left aligned, not centered */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-extrabold font-headline tracking-tight text-on-surface">
            {content.navigation.services}
          </h2>
          <div className="w-16 h-1 bg-primary mt-4 rounded-full" />
        </motion.div>

        {/* Services grid - asymmetric, 2-2-1 or custom layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || LayoutGrid;
            return (
              <ServiceCard
                key={service.id}
                title={service.title}
                description={service.description}
                icon={Icon}
                index={index}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}