import React, { useState, useRef, useMemo } from 'react';
import { useI18n } from '../../i18n/useI18n';
import SessionRegistration, { type SessionRegistrationRef } from '../../components/SessionRegistration';
import AdminPanel from '../../components/AdminPanel';
import CityGallerySlider from '../../components/CityGallerySlider';
import { getCityGalleryImages } from '../../utils/cityGalleries';
import './BeijingPage.css';

const BeijingPage: React.FC = () => {
  const { t } = useI18n();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const sessionRegistrationRef = useRef<SessionRegistrationRef>(null);
  const galleryImages = useMemo(
    () => getCityGalleryImages('beijing', t.cities.beijing.branch),
    [t.cities.beijing.branch]
  );

  
  return (
    <div className="sessions-page">
      <div className="container">
        <section className="page-header">
          <h1>{t.cities.beijing.branch}</h1>
        </section>

        {galleryImages.length > 0 && (
          <section className="section gallery-section">
            <CityGallerySlider images={galleryImages} autoPlayIntervalMs={5000} pauseOnHover />
          </section>
        )}

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