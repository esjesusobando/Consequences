import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className = '' }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors ${className}`}
      aria-label={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
    >
      <Globe className="w-4 h-4 text-on-surface-variant" />
      <span className="text-sm font-semibold text-on-surface uppercase">
        {language}
      </span>
    </motion.button>
  );
}