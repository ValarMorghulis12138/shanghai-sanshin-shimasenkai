import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Language, Translations } from './types';
import { en } from './translations/en';
import { zh } from './translations/zh';
import { ja } from './translations/ja';
import { I18nContext } from './context.js';

const translations: Record<Language, Translations> = {
  en,
  zh,
  ja
};

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Get saved language from localStorage or detect browser language
    const saved = localStorage.getItem('language') as Language | null;
    if (saved && ['en', 'zh', 'ja'].includes(saved)) {
      return saved;
    }
    
    // Detect browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('zh')) return 'zh';
    if (browserLang.startsWith('ja')) return 'ja';
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    // Update document language attribute for accessibility
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = {
    language,
    setLanguage,
    t: translations[language]
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};
