import React from 'react';
import { useI18n } from '../i18n/useI18n';
import type { Language } from '../i18n/types';
import './LanguageSwitcher.css';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useI18n();

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'en', label: 'EN', flag: '🇬🇧' }
  ];

  return (
    <div className="language-switcher">
      {languages.map((lang) => (
        <button
          key={lang.code}
          className={`language-button ${language === lang.code ? 'active' : ''}`}
          onClick={() => setLanguage(lang.code)}
          aria-label={`Switch to ${lang.label}`}
        >
          <span className="language-flag">{lang.flag}</span>
          <span className="language-label">{lang.label}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
