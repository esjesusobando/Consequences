import React from 'react';
import { motion } from 'motion/react';
import { Shield, Globe, Award, MapPin } from 'lucide-react';

interface TrustBadgeProps {
  badges?: string[];
}

export function TrustBadge({ badges = ['8+ Years', 'Bilingual', 'Licensed', 'ATL'] }: TrustBadgeProps) {
  const icons = [Shield, Globe, Award, MapPin];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-3"
    >
      {badges.map((badge, index) => {
        const Icon = icons[index] || Award;
        return (
          <motion.div
            key={badge}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container rounded-lg"
          >
            <Icon className="w-3.5 h-3.5 text-secondary" />
            <span className="text-xs font-bold font-headline tracking-tight text-on-surface">
              {badge}
            </span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}