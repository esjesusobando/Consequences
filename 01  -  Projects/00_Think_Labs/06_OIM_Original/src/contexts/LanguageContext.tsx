"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Language, Content } from "../types/content";
import contentEn from "../data/content-en.json";
import contentEs from "../data/content-es.json";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  content: Content;
}

const contents: Record<Language, Content> = { en: contentEn, es: contentEs };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("oim-language");
        if (saved === "en" || saved === "es") {
          return saved;
        }
      } catch (error) {
        console.warn("Failed to read language from localStorage:", error);
      }
    }
    return "en";
  });

  useEffect(() => {
    try {
      localStorage.setItem("oim-language", language);
    } catch (error) {
      console.warn("Failed to save language to localStorage:", error);
    }
  }, [language]);

  const setLanguage = (lang: Language) => setLanguageState(lang);
  const toggleLanguage = () => setLanguageState((prev) => (prev === "en" ? "es" : "en"));

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, content: contents[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}