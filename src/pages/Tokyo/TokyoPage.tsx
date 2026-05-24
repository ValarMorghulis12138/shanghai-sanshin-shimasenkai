import React, { useState, useRef } from 'react';
import { useI18n } from '../../i18n/useI18n';
import SessionRegistration, { type SessionRegistrationRef } from '../../components/SessionRegistration';
import AdminPanel from '../../components/AdminPanel';
import './TokyoPage.css';

const TokyoPage: React.FC = () => {
  const { t, language } = useI18n();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const sessionRegistrationRef = useRef<SessionRegistrationRef>(null);

  const cityName = {
    zh: t.cities.tokyo.branch,
    ja: t.cities.tokyo.branch,
    en: t.cities.tokyo.branch,
  };

  return (
    <div className="sessions-page">
      <div className="container">
        <section className="page-header">
          <h1>
            {cityName[language]} - {t.sessions.title}
          </h1>
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
