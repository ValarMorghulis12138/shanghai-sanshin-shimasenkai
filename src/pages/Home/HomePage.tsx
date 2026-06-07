import React from 'react';
import { useI18n } from '../../i18n/useI18n';
import './HomePage.css';
import keisukeSenseiPhoto from '../../assets/photos/keisuke_sensei/keisuke_sensei_photo.jpg';
import teacherCertificate from '../../assets/photos/keisuke_sensei/teacher_certificate.jpg';
import ambassadorAward from '../../assets/photos/keisuke_sensei/okinawa_ambassador_award.jpg';
import consulGeneralAward from '../../assets/photos/keisuke_sensei/consul_general_award_2024.jpg';
import heroBackground from '../../assets/photos/sanshin_member/shanghai_sanshin_shimasenkai.jpg';

const HomePage: React.FC = () => {
  const { t } = useI18n();
  
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div 
          className="hero-background" 
          style={{ backgroundImage: `url(${heroBackground})` }}
        ></div>
      </section>

      {/* Hero Description Section */}
      <section className="hero-description-section">
        <div className="container">
          <div className="hero-text-content">
            {t.home.hero.subtitle && (
              <p className="hero-subtitle">{t.home.hero.subtitle}</p>
            )}
            <p className="hero-description">
              {t.home.hero.description}
            </p>
          </div>
        </div>
      </section>

      {/* About Teacher Section */}
      <section id="about" className="section about-section">
        <div className="container">
          <h2 className="section-title text-center">{t.home.teacher.title}</h2>
          
          <div className="about-grid">
            <div className="about-image">
              <img 
                src={keisukeSenseiPhoto} 
                alt="KEISUKE Sensei" 
                className="teacher-photo"
                loading="lazy"
              />
            </div>
            
            <div className="about-content">
              <h3 className="teacher-heading">{t.home.teacher.name}</h3>
              {t.home.teacher.introduction.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certification Section */}
      <section className="section certification-section">
        <div className="container">
          <h2 className="section-title text-center">{t.home.certification.title}</h2>
          
          <div className="certification-grid">
            <div className="certification-content">
              <h3>{t.home.certification.subtitle}</h3>
              {t.home.certification.description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            <div className="certification-image">
              <img 
                src={teacherCertificate} 
                alt="Teaching Certificate" 
                className="certificate-photo"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="section awards-section">
        <div className="container">
          <h2 className="section-title text-center">{t.home.awards?.title || 'Awards & Recognition'}</h2>
          
          <div className="awards-grid">
            <div className="award-item">
              <div className="award-image">
                <img 
                  src={ambassadorAward} 
                  alt="Okinawa Civilian Ambassador Award" 
                  className="award-photo"
                  loading="lazy"
                />
              </div>
              <div className="award-content">
                <h3>{t.home.awards?.ambassador?.title || '2022 Okinawa Civilian Ambassador'}</h3>
                <p>{t.home.awards?.ambassador?.description || 'Awarded by the Okinawa Prefectural Government for contributions to spreading Okinawan culture overseas.'}</p>
              </div>
            </div>
            <div className="award-item reverse">
              <div className="award-content">
                <h3>{t.home.awards?.consulGeneral?.title || '2024 Consul General\'s Commendation'}</h3>
                <p>{t.home.awards?.consulGeneral?.description || 'Awarded by the Consulate-General of Japan in Shanghai for long-standing contributions to Japan-China cultural exchange.'}</p>
              </div>
              <div className="award-image">
                <img 
                  src={consulGeneralAward} 
                  alt="Consul General's Commendation Award" 
                  className="award-photo"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
