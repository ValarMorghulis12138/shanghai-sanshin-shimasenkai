import React from 'react';
import { useI18n } from '../i18n/useI18n';
import type { Language } from '../i18n/types';
import './LanguageSwitcher.css';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useI18n();

  const languages: { code: Language; label: string }[] = [
    { code: 'zh', label: '中文' },
    { code: 'ja', label: '日本語' },
    { code: 'en', label: 'EN' }
  ];

  const currentIndex = languages.findIndex((lang) => lang.code === language);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const nextIndex = (safeIndex + 1) % languages.length;
  const currentLanguage = languages[safeIndex];
  const nextLanguage = languages[nextIndex];

  const handleCycleLanguage = () => {
    setLanguage(nextLanguage.code);
  };

  return (
    <div className="language-switcher">
      <button
        className="language-button compact"
        onClick={handleCycleLanguage}
        aria-label={`Switch to ${nextLanguage.label}`}
        title={`Switch to ${nextLanguage.label}`}
      >
        <span className="language-icon" aria-hidden="true">🌐</span>
        <span className="language-label">{currentLanguage.label}</span>
      </button>
    </div>
  );
};

export default LanguageSwitcher;
