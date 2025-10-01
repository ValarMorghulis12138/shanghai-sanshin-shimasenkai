import React, { useState } from 'react';
import { useI18n } from '../../i18n/useI18n';
import SessionRegistration from '../../components/SessionRegistration';
import AdminPanel from '../../components/AdminPanel';
import fuzhouPhoto from '../../assets/photos/sanshin_member/shimasenkai_fuzhou.jpg';
import './FuzhouPage.css';

const FuzhouPage: React.FC = () => {
  const { t, language } = useI18n();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
  // TODO: Enable this when Fuzhou data is ready
  const isDataReady = false;
  
  const cityName = {
    zh: t.cities.fuzhou.branch,
    ja: t.cities.fuzhou.branch,
    en: t.cities.fuzhou.branch
  };

  // Fuzhou-specific schedule info (to be used when data is ready)
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
              style={{ backgroundImage: `url(${fuzhouPhoto})` }}
            >
              <div className="under-construction-overlay"></div>
              <div className="under-construction-content">
                <h2 className="under-construction-title">
                  {t.cities.fuzhou.underConstruction}
                </h2>
                <p className="under-construction-description">
                  {t.cities.fuzhou.comingSoon}
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
          cityName={cityName}
          scheduleInfo={scheduleInfo}
          onAdminAccess={() => setShowAdminPanel(true)}
        />

        {/* Admin Panel */}
        {showAdminPanel && (
          <AdminPanel 
            onClose={() => setShowAdminPanel(false)}
            onSessionsUpdate={() => {
              // The SessionRegistration component will handle its own data reload
            }}
          />
        )}
      </div>
    </div>
  );
};

export default FuzhouPage;