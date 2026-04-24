import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  index: number;
}

export function ServiceCard({ title, description, icon: Icon, index }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group p-8 bg-surface-container-lowest rounded-xl border border-transparent hover:border-outline-variant/30 hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
          <Icon className="w-6 h-6" />
        </div>
        <ArrowRight className="w-5 h-5 text-on-surface-variant opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
      </div>
      
      <h3 className="text-lg font-bold font-headline text-on-surface mb-3">
        {title}
      </h3>
      
      <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
        {description}
      </p>
      
      <div className="flex items-center gap-1 text-xs font-semibold text-primary">
        <span>Learn more</span>
        <ArrowRight className="w-3 h-3" />
      </div>
    </motion.div>
  );
}