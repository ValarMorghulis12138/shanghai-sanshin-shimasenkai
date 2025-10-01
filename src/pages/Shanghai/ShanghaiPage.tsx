import React, { useState } from 'react';
import { useI18n } from '../../i18n/useI18n';
import SessionRegistration from '../../components/SessionRegistration';
import AdminPanel from '../../components/AdminPanel';
import './ShanghaiPage.css';

const ShanghaiPage: React.FC = () => {
  const { t, language } = useI18n();
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const cityName = {
    zh: t.cities.shanghai.branch,
    ja: t.cities.shanghai.branch,
    en: t.cities.shanghai.branch
  };

  const scheduleInfo = {
    schedule: [
      t.sessions.schedule.biweekly
    ],
    time: [
      '14:00-17:00 (' + t.sessions.schedule.classTime + ')'
    ],
    location: '酒友(sakatomo)'
  };

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
              // This is just to maintain the interface
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ShanghaiPage;