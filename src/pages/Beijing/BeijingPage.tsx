import React, { useState, useRef } from 'react';
import { useI18n } from '../../i18n/useI18n';
import SessionRegistration, { type SessionRegistrationRef } from '../../components/SessionRegistration';
import AdminPanel from '../../components/AdminPanel';
import beijingPhoto1 from '../../assets/photos/sanshin_member/shimasenkai_beijing_1.jpg';
import beijingPhoto2 from '../../assets/photos/sanshin_member/shimasenkai_beijing_2.jpg';
import './BeijingPage.css';

const BeijingPage: React.FC = () => {
  const { t, language } = useI18n();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const sessionRegistrationRef = useRef<SessionRegistrationRef>(null);
  
  // TODO: Enable this when Beijing data is ready
  const isDataReady = false;
  
  // Randomly select between Beijing photos
  const cityPhoto = Math.random() > 0.5 ? beijingPhoto1 : beijingPhoto2;
  
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
            <div 
              className="under-construction-container"
              style={{ backgroundImage: `url(${cityPhoto})` }}
            >
              <div className="under-construction-overlay"></div>
              <div className="under-construction-content">
                <h2 className="under-construction-title">
                  {t.cities.beijing.underConstruction}
                </h2>
                <p className="under-construction-description">
                  {t.cities.beijing.comingSoon}
                </p>
              </div>
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
          <p className="data-notice">
            📅 {t.sessions.recentMonths}
          </p>
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