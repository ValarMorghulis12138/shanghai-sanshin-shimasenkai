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
    en: t.cities.shanghai.branch,
  };

  return (
    <div className="sessions-page">
      <div className="container">
        <section className="page-header">
          <h1>{cityName[language]}</h1>
        </section>

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
