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
    zh: '三线岛线会福州分会',
    ja: '三線島線会福州分会',
    en: 'Sanshin Shimasenkai Fuzhou Branch'
  };

  // Fuzhou-specific schedule info (to be used when data is ready)
  const scheduleInfo = {
    schedule: [
      language === 'zh' ? '每月课程安排' : language === 'ja' ? '月次クラススケジュール' : 'Monthly class schedule'
    ],
    time: [
      language === 'zh' ? '具体时间待定' : language === 'ja' ? '詳細時間は未定' : 'Specific times TBD'
    ],
    location: language === 'zh' ? '地点待定' : language === 'ja' ? '場所未定' : 'Location TBD'
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
                  {language === 'zh' ? '网站建设中' : language === 'ja' ? 'ウェブサイト構築中' : 'Website Under Construction'}
                </h2>
                <p className="under-construction-description">
                  {language === 'zh' 
                    ? '福州分会即将推出！请继续关注我们的更新。'
                    : language === 'ja' 
                    ? '福州分会は近日公開予定！更新情報をお待ちください。'
                    : 'Fuzhou branch coming soon! Please stay tuned for updates.'}
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
            }}
          />
        )}
      </div>
    </div>
  );
};

export default FuzhouPage;