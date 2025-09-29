import React, { useState } from 'react';
import { useI18n } from '../../i18n/useI18n';
import SessionRegistration from '../../components/SessionRegistration';
import AdminPanel from '../../components/AdminPanel';
import './ShanghaiPage.css';

const ShanghaiPage: React.FC = () => {
  const { t, language } = useI18n();
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const cityName = {
    zh: '三线岛线会上海分会',
    ja: '三線島線会上海分会',
    en: 'Sanshin Shimasenkai Shanghai Branch'
  };

  const scheduleInfo = {
    schedule: [
      language === 'zh' ? '每月两次，隔周周六' : language === 'ja' ? '月2回、隔週土曜日' : 'Twice monthly, every other Saturday'
    ],
    time: [
      '14:00-17:00 (' + (language === 'zh' ? '每节课50分钟，休息10分钟' : language === 'ja' ? '各クラス50分、休憩10分' : '50min classes, 10min breaks') + ')'
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
            📅 {language === 'zh' 
              ? '显示最近3个月的课程安排' 
              : language === 'ja' 
              ? '過去3ヶ月のクラススケジュールを表示' 
              : 'Showing sessions from the last 3 months'}
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