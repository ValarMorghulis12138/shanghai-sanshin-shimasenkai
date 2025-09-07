import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/useI18n';
import './HomePage.css';

const HomePage: React.FC = () => {
  const { t } = useI18n();
  
  const scrollToAbout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background"></div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title fade-in">{t.home.hero.title}</h1>
            <p className="hero-subtitle fade-in">{t.home.hero.subtitle}</p>
            <p className="hero-description fade-in">
              {t.home.hero.description}
            </p>
            <a href="#about" onClick={scrollToAbout} className="hero-button fade-in">{t.home.hero.cta}</a>
          </div>
        </div>
      </section>

      {/* About Sanshin Section */}
      <section id="about" className="section about-section">
        <div className="container">
          <h2 className="section-title text-center">{t.home.about.title}</h2>
          
          <div className="about-grid">
            <div className="about-image">
              {/* Placeholder for sanshin image */}
              <div className="image-placeholder">
                <p>Sanshin Instrument</p>
              </div>
            </div>
            
            <div className="about-content">
              <h3>{t.home.about.subtitle}</h3>
              {t.home.about.description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section features-section">
        <div className="container">
          <h2 className="section-title text-center">{t.home.features.title}</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎵</div>
              <h3>{t.home.features.biweekly.title}</h3>
              <p>{t.home.features.biweekly.description}</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>{t.home.features.instruction.title}</h3>
              <p>{t.home.features.instruction.description}</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🌸</div>
              <h3>{t.home.features.cultural.title}</h3>
              <p>{t.home.features.cultural.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="section history-section">
        <div className="container">
          <div className="history-content">
            <h2 className="section-title">{t.home.history.title}</h2>
            
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>{t.home.history.timeline.century14.title}</h4>
                  <p>{t.home.history.timeline.century14.description}</p>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>{t.home.history.timeline.century16.title}</h4>
                  <p>{t.home.history.timeline.century16.description}</p>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>{t.home.history.timeline.ww2.title}</h4>
                  <p>{t.home.history.timeline.ww2.description}</p>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>{t.home.history.timeline.present.title}</h4>
                  <p>{t.home.history.timeline.present.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container text-center">
          <h2>{t.home.cta.title}</h2>
          <p className="cta-description">{t.home.cta.description}</p>
          <div className="cta-buttons">
            <Link to="/sessions" className="cta-button primary">{t.home.cta.viewSessions}</Link>
            <Link to="/contact" className="cta-button secondary">{t.home.cta.getInTouch}</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
