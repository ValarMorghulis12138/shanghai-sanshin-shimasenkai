import React, { useState, useRef } from 'react';
import { useI18n } from '../../i18n/useI18n';
import SessionRegistration, { type SessionRegistrationRef } from '../../components/SessionRegistration';
import AdminPanel from '../../components/AdminPanel';
import './ShanghaiPage.css';

const ShanghaiPage: React.FC = () => {
  const { t, language } = useI18n();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const sessionRegistrationRef = useRef<SessionRegistrationRef>(null);

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
      t.sessions.schedule.class1,
      t.sessions.schedule.class2,
      t.sessions.schedule.class3
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
          ref={sessionRegistrationRef}
          scheduleInfo={scheduleInfo}
          onAdminAccess={() => setShowAdminPanel(true)}
        />

        {/* Admin Panel */}
        {showAdminPanel && (
          <AdminPanel 
            onClose={() => setShowAdminPanel(false)}
            onSessionsUpdate={async () => {
              // Sync from localStorage (AdminPanel already updated it)
              // No API calls needed!
              await sessionRegistrationRef.current?.syncFromLocalStorage();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ShanghaiPage;