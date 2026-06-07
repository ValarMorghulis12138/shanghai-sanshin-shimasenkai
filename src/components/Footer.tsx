import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/useI18n';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t, language } = useI18n();
  
  const getSiteName = () => {
    switch (language) {
      case 'zh':
        return '三线岛线会';
      case 'ja':
        return '三線島線会';
      default:
        return 'Sanshin Shimasenkai';
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4 className="footer-title">{getSiteName()}</h4>
            <p className="footer-description">{t.footer.description}</p>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">{t.footer.quickLinks}</h4>
            <ul className="footer-links">
              <li><Link to="/">{t.common.home}</Link></li>
              <li><Link to="/shanghai">{t.citiesNav.shanghai}</Link></li>
              <li><Link to="/tokyo">{t.citiesNav.tokyo}</Link></li>
              <li><Link to="/beijing">{t.citiesNav.beijing}</Link></li>
              <li><Link to="/contact">{t.common.contact}</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} {getSiteName()}. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
