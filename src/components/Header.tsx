import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n/useI18n';
import LanguageSwitcher from './LanguageSwitcher';
import './Header.css';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { t, language } = useI18n();

  const navItems = [
    { path: '/', label: t.common.home },
    { path: '/sessions', label: t.common.sessions },
    { path: '/contact', label: t.common.contact }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getLogoText = () => {
    switch (language) {
      case 'zh':
        return { primary: '上海三线', secondary: '岛线会' };
      case 'ja':
        return { primary: '上海三線', secondary: '島線会' };
      default:
        return { primary: 'Shanghai Sanshi', secondary: 'Shimasenkai' };
    }
  };

  const logoText = getLogoText();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-text-primary">{logoText.primary}</span>
            <span className="logo-text-secondary">{logoText.secondary}</span>
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
