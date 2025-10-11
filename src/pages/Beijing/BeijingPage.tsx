import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useI18n } from '../../i18n/useI18n';
import SessionRegistration, { type SessionRegistrationRef } from '../../components/SessionRegistration';
import AdminPanel from '../../components/AdminPanel';
import beijingPhoto1 from '../../assets/photos/sanshin_member/shimasenkai_beijing_1.jpg';
import beijingPhoto2 from '../../assets/photos/sanshin_member/shimasenkai_beijing_2.jpg';
import beijingPhoto3 from '../../assets/photos/sanshin_member/shimasenkai_beijing_3.jpg';
import beijingPhoto4 from '../../assets/photos/sanshin_member/shimasenkai_beijing_4.jpg';
import './BeijingPage.css';

const BeijingPage: React.FC = () => {
  const { t, language } = useI18n();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const sessionRegistrationRef = useRef<SessionRegistrationRef>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play functionality
  useEffect(() => {
    const startAutoPlay = () => {
      autoPlayRef.current = setInterval(() => {
        if (!isPaused) {
          nextImage();
        }
      }, 5000); // Change image every 5 seconds
    };

    startAutoPlay();

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isPaused]);
  
  // TODO: Enable this when Beijing data is ready
  const isDataReady = false;
  
  // Gallery images array
  const galleryImages = useMemo(() => [
    { src: beijingPhoto1, alt: "Beijing Sanshin Class 1" },
    { src: beijingPhoto2, alt: "Beijing Sanshin Class 2" },
    { src: beijingPhoto3, alt: "Beijing Sanshin Class 3" },
    { src: beijingPhoto4, alt: "Beijing Sanshin Class 4" },
  ], []);

  // Gallery navigation functions
  const nextImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Touch event handlers for mobile swipe
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
    }
    if (isRightSwipe) {
      prevImage();
    }
  };

  
  const cityName = {
    zh: t.cities.beijing.branch,
    ja: t.cities.beijing.branch,
    en: t.cities.beijing.branch
  };

  // Beijing-specific schedule info (to be used when data is ready)
  const scheduleInfo = {
    schedule: [
      t.sessions.schedule.biweekly
    ],
    time: [
      'TBD'
    ],
    location: 'TBD'
  };

  if (!isDataReady) {
    // Show under construction page
    return (
      <div className="sessions-page">
        <div className="container">
          <section className="page-header">
            <h1>{cityName[language]}</h1>
            {/* Beijing Banner Gallery */}
            <div className="beijing-banner"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="beijing-banner-slider">
                <div className="beijing-banner-main">
                  <button 
                    className="beijing-banner-nav prev" 
                    onClick={prevImage} 
                    aria-label="Previous image"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  
                  <div 
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <img
                      key={currentImageIndex}
                      src={galleryImages[currentImageIndex].src}
                      alt={galleryImages[currentImageIndex].alt}
                      className={`beijing-banner-image ${isTransitioning ? 'transitioning' : ''}`}
                    />
                  </div>
                  
                  <button 
                    className="beijing-banner-nav next" 
                    onClick={nextImage} 
                    aria-label="Next image"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
                
                <div className="beijing-banner-progress">
                  {galleryImages.map((_, index) => (
                    <button
                      key={index}
                      className={`beijing-banner-dot ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => {
                        if (isTransitioning) return;
                        setIsTransitioning(true);
                        setCurrentImageIndex(index);
                        setTimeout(() => setIsTransitioning(false), 500);
                      }}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Under Construction Notice */}
            <div className="under-construction-content" style={{ marginTop: '2rem', textAlign: 'center' }}>
              <h2 className="under-construction-title">
                {t.cities.beijing.underConstruction}
              </h2>
              <p className="under-construction-description">
                {t.cities.beijing.comingSoon}
              </p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // When data is ready, show the session registration
  return (
    <div className="sessions-page">
      <div className="container">
        <section className="page-header">
          <h1>
            {cityName[language]} - {t.sessions.title}
          </h1>
          <p className="page-description">{t.sessions.description}</p>
        </section>

        <SessionRegistration 
          ref={sessionRegistrationRef}
          scheduleInfo={scheduleInfo}
          onAdminAccess={() => setShowAdminPanel(true)}
        />

        {/* Admin Panel */}
        {showAdminPanel && (
          <AdminPanel 
            onClose={() => setShowAdminPanel(false)}
            onSessionsUpdate={async () => {
              // Sync from localStorage (no API calls)
              await sessionRegistrationRef.current?.syncFromLocalStorage();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default BeijingPage;