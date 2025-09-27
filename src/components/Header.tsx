import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n/useI18n';
import LanguageSwitcher from './LanguageSwitcher';
import './Header.css';

// Import the selected logo icon
import logoIcon from '../assets/icons/img_app_sanshin_body.png';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { t, language } = useI18n();

  const navItems = [
    { path: '/', label: t.common.home },
    { path: '/shanghai', label: language === 'zh' ? '上海分会' : language === 'ja' ? '上海分会' : 'Shanghai Branch' },
    { path: '/beijing', label: language === 'zh' ? '北京分会' : language === 'ja' ? '北京分会' : 'Beijing Branch' },
    { path: '/fuzhou', label: language === 'zh' ? '福州分会' : language === 'ja' ? '福州分会' : 'Fuzhou Branch' },
    { path: '/contact', label: t.common.contact }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getLogoText = () => {
    switch (language) {
      case 'zh':
        return '三线岛线会';
      case 'ja':
        return '三線島線会';
      default:
        return 'Sanshin Shimasenkai';
    }
  };

  const logoText = getLogoText();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <img src={logoIcon} alt="Sanshin Logo" className="logo-icon" />
            <span className="logo-text">{logoText}</span>
          </Link>

          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <ul className="nav-list">
              {navItems.map((item) => (
                <li key={item.path} className="nav-item">
                  <Link
                    to={item.path}
                    className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <LanguageSwitcher />
          </nav>

          <button
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className="menu-icon"></span>
            <span className="menu-icon"></span>
            <span className="menu-icon"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
