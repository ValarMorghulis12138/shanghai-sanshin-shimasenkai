import React from 'react';
import { useI18n } from '../../i18n/useI18n';
import fuzhouPhoto from '../../assets/photos/sanshin_member/shimasenkai_fuzhou.jpg';
import './FuzhouPage.css';

const FuzhouPage: React.FC = () => {
  const { language } = useI18n();
  
  return (
    <div className="sessions-page">
      <div className="container">
        <section className="page-header">
          <h1>
            {language === 'zh' ? '三线岛线会福州分会' : language === 'ja' ? '三線島線会福州分会' : 'Sanshin Shimasenkai Fuzhou Branch'}
          </h1>
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
};

export default FuzhouPage;
