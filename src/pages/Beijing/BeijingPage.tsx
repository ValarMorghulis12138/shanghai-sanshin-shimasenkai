import React, { useState, useRef, useMemo } from 'react';
import { useI18n } from '../../i18n/useI18n';
import SessionRegistration, { type SessionRegistrationRef } from '../../components/SessionRegistration';
import AdminPanel from '../../components/AdminPanel';
import CityGallerySlider from '../../components/CityGallerySlider';
import beijingPhoto1 from '../../assets/photos/sanshin_member/shimasenkai_beijing_1.jpg';
import beijingPhoto2 from '../../assets/photos/sanshin_member/shimasenkai_beijing_2.jpg';
import beijingPhoto3 from '../../assets/photos/sanshin_member/shimasenkai_beijing_3.jpg';
import beijingPhoto4 from '../../assets/photos/sanshin_member/shimasenkai_beijing_4.jpg';
import './BeijingPage.css';

const BeijingPage: React.FC = () => {
  const { t } = useI18n();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const sessionRegistrationRef = useRef<SessionRegistrationRef>(null);
  
  // Gallery images array
  const galleryImages = useMemo(() => [
    { src: beijingPhoto1, alt: "Beijing Sanshin Class 1" },
    { src: beijingPhoto2, alt: "Beijing Sanshin Class 2" },
    { src: beijingPhoto3, alt: "Beijing Sanshin Class 3" },
    { src: beijingPhoto4, alt: "Beijing Sanshin Class 4" },
  ], []);

  
  return (
    <div className="sessions-page">
      <div className="container">
        <section className="page-header">
          <h1>{t.cities.beijing.branch}</h1>
        </section>

        <section className="section gallery-section">
          <CityGallerySlider images={galleryImages} autoPlayIntervalMs={5000} pauseOnHover />
        </section>

        <SessionRegistration
          ref={sessionRegistrationRef}
          onAdminAccess={() => setShowAdminPanel(true)}
          city="beijing"
        />

        {/* Admin Panel */}
        {showAdminPanel && (
          <AdminPanel 
            onClose={() => setShowAdminPanel(false)}
            onSessionsUpdate={async () => {
              // Sync from localStorage (no API calls)
              await sessionRegistrationRef.current?.syncFromLocalStorage();
            }}
            city="beijing"
          />
        )}
      </div>
    </div>
  );
};

export default BeijingPage;