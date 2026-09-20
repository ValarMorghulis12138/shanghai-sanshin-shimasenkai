import React, { useState, useRef, useMemo } from 'react';
import { useI18n } from '../../i18n/useI18n';
import SessionRegistration, { type SessionRegistrationRef } from '../../components/SessionRegistration';
import AdminPanel from '../../components/AdminPanel';
import CityGallerySlider from '../../components/CityGallerySlider';
import { getCityGalleryImages } from '../../utils/cityGalleries';
import './ShanghaiPage.css';

const ShanghaiPage: React.FC = () => {
  const { t } = useI18n();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const sessionRegistrationRef = useRef<SessionRegistrationRef>(null);
  const galleryImages = useMemo(
    () => getCityGalleryImages('shanghai', t.cities.shanghai.branch),
    [t.cities.shanghai.branch]
  );

  return (
    <div className="sessions-page">
      <div className="container">
        <section className="page-header">
          <h1>{t.cities.shanghai.branch}</h1>
        </section>

        {galleryImages.length > 0 && (
          <section className="section gallery-section">
            <CityGallerySlider images={galleryImages} />
          </section>
        )}

        <SessionRegistration
          ref={sessionRegistrationRef}
          onAdminAccess={() => setShowAdminPanel(true)}
        />

        {showAdminPanel && (
          <AdminPanel
            onClose={() => setShowAdminPanel(false)}
            onSessionsUpdate={async () => {
              await sessionRegistrationRef.current?.syncFromLocalStorage();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ShanghaiPage;
