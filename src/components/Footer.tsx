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
        return '上海三线岛线会';
      case 'ja':
        return '上海三線島線会';
      default:
        return 'Shanghai Sanshi Shimasenkai';
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
              <li><Link to="/sessions">{t.common.sessions}</Link></li>
              <li><Link to="/contact">{t.common.contact}</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">{t.footer.connectWithUs}</h4>
            <p className="footer-text">{t.footer.connectDescription}</p>
            <div className="social-links">
              {/* Placeholder for social media links */}
              <button aria-label="WeChat" className="social-link" onClick={() => {}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
              </button>
              <button aria-label="Email" className="social-link" onClick={() => {}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </button>
            </div>
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
