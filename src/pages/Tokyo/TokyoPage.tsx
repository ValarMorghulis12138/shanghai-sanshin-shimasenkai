import React, { useState, useRef, useMemo } from 'react';
import { useI18n } from '../../i18n/useI18n';
import SessionRegistration, { type SessionRegistrationRef } from '../../components/SessionRegistration';
import AdminPanel from '../../components/AdminPanel';
import CityGallerySlider from '../../components/CityGallerySlider';
import tokyoBranchPhoto from '../../assets/photos/tokyo/tokyo_branch_1.jpg';
import './TokyoPage.css';

const TokyoPage: React.FC = () => {
  const { t } = useI18n();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const sessionRegistrationRef = useRef<SessionRegistrationRef>(null);
  const galleryImages = useMemo(
    () => [
      { src: tokyoBranchPhoto, alt: 'Tokyo Branch Activity Photo' },
    ],
    []
  );

  return (
    <div className="sessions-page">
      <div className="container">
        <section className="page-header">
          <h1>{t.cities.tokyo.branch}</h1>
        </section>

        <section className="section gallery-section">
          <CityGallerySlider images={galleryImages} />
        </section>

        <SessionRegistration
          ref={sessionRegistrationRef}
          onAdminAccess={() => setShowAdminPanel(true)}
          city="tokyo"
        />

        {showAdminPanel && (
          <AdminPanel
            onClose={() => setShowAdminPanel(false)}
            onSessionsUpdate={async () => {
              await sessionRegistrationRef.current?.syncFromLocalStorage();
            }}
            city="tokyo"
          />
        )}
      </div>
    </div>
  );
};

export default TokyoPage;
