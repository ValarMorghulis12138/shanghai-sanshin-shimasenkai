import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/useI18n';
import './HomePage.css';
import keisukeSenseiPhoto from '../../assets/photos/keisuke_sensei/keisuke_sensei_photo.jpg';
import teacherCertificate from '../../assets/photos/keisuke_sensei/teacher_certificate.jpg';
import ambassadorAward from '../../assets/photos/keisuke_sensei/okinawa_ambassador_award.jpg';
import consulGeneralAward from '../../assets/photos/keisuke_sensei/consul_general_award_2024.jpg';
import heroBackground from '../../assets/photos/sanshin_member/shanghai_sanshin_shimasenkai.jpg';
import bandPhoto from '../../assets/photos/haisai/haisai_sanshin_band.jpg';
// Import new member photos for gallery
import memberPhoto1 from '../../assets/photos/sanshin_member/shimasenkai_member_1.jpg';
import memberPhoto2 from '../../assets/photos/sanshin_member/shimasenkai_member_2.jpg';
import memberPhoto3 from '../../assets/photos/sanshin_member/shimasenkai_member_3.jpg';
import kobudoPhoto from '../../assets/photos/sanshin_member/sanshin_kobudo.jpg';
import eventPhoto from '../../assets/photos/sanshin_member/shimasenkai_event.jpg';

const HomePage: React.FC = () => {
  const { t } = useI18n();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Gallery images array
  const galleryImages = [
    { src: bandPhoto, alt: "Haisai Sanshin Band Performance" },
    { src: memberPhoto1, alt: "Sanshin Shimasenkai Members" },
    { src: memberPhoto2, alt: "Teaching Scene" },
    { src: memberPhoto3, alt: "Group Practice Session" },
    { src: kobudoPhoto, alt: "Sanshin and Okinawan Kobudo Collaboration" },
    { src: eventPhoto, alt: "Sanshin Shimasenkai Event" }
  ];
  
  const changeImage = (newIndex: number) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex(newIndex);
      setIsTransitioning(false);
    }, 150);
  };
  
  const nextImage = () => {
    const newIndex = currentImageIndex === galleryImages.length - 1 ? 0 : currentImageIndex + 1;
    changeImage(newIndex);
  };
  
  const prevImage = () => {
    const newIndex = currentImageIndex === 0 ? galleryImages.length - 1 : currentImageIndex - 1;
    changeImage(newIndex);
  };
  
  const goToImage = (index: number) => {
    if (index !== currentImageIndex) {
      changeImage(index);
    }
  };
  
  // Touch handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }
  };
  
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div 
          className="hero-background" 
          style={{ backgroundImage: `url(${heroBackground})` }}
        ></div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title fade-in">{t.home.hero.title}</h1>
          </div>
        </div>
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
              <h3>{t.home.teacher.name}</h3>
              <p className="teacher-title">{t.home.teacher.subtitle}</p>
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

      {/* Our Community Section */}
      <section className="section features-section">
        <div className="container">
          <h2 className="section-title text-center">{t.home.features.title}</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>{t.home.features.biweekly.title}</h3>
              <p>{t.home.features.biweekly.description}</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎓</div>
              <h3>{t.home.features.instruction.title}</h3>
              <p>{t.home.features.instruction.description}</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🌏</div>
              <h3>{t.home.features.cultural.title}</h3>
              <p>{t.home.features.cultural.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="section gallery-section">
        <div className="container">
          <h2 className="section-title text-center">{t.home.gallery.title}</h2>
          
          <div className="gallery-slider">
            <div className="gallery-main">
              <button className="gallery-nav gallery-nav-prev" onClick={prevImage} aria-label="Previous image">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              
              <div 
                className="gallery-image-container"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <img
                  src={galleryImages[currentImageIndex].src}
                  alt={galleryImages[currentImageIndex].alt}
                  className={`gallery-main-image ${isTransitioning ? 'transitioning' : ''}`}
                />
              </div>
              
              <button className="gallery-nav gallery-nav-next" onClick={nextImage} aria-label="Next image">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
            
            <div className="gallery-dots">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  className={`gallery-dot ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => goToImage(index)}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
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
            <Link to="/shanghai" className="cta-button primary">{t.home.cta.viewSessions}</Link>
            <Link to="/contact" className="cta-button secondary">{t.home.cta.getInTouch}</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
