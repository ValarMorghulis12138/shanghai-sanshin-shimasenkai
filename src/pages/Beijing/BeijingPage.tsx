import React from 'react';
import { useI18n } from '../../i18n/useI18n';
import beijingPhoto1 from '../../assets/photos/sanshin_member/shimasenkai_beijing_1.jpg';
import beijingPhoto2 from '../../assets/photos/sanshin_member/shimasenkai_beijing_2.jpg';
import './BeijingPage.css';

const BeijingPage: React.FC = () => {
  const { language } = useI18n();
  
  // Randomly select between Beijing photos
  const cityPhoto = Math.random() > 0.5 ? beijingPhoto1 : beijingPhoto2;
  
  return (
    <div className="sessions-page">
      <div className="container">
        <section className="page-header">
          <h1>
            {language === 'zh' ? '三线岛线会北京分会' : language === 'ja' ? '三線島線会北京分会' : 'Sanshin Shimasenkai Beijing Branch'}
          </h1>
          <div 
            className="under-construction-container"
            style={{ backgroundImage: `url(${cityPhoto})` }}
          >
            <div className="under-construction-overlay"></div>
            <div className="under-construction-content">
              <h2 className="under-construction-title">
                {language === 'zh' ? '网站建设中' : language === 'ja' ? 'ウェブサイト構築中' : 'Website Under Construction'}
              </h2>
              <p className="under-construction-description">
                {language === 'zh' 
                  ? '北京分会即将推出！请继续关注我们的更新。'
                  : language === 'ja' 
                  ? '北京分会は近日公開予定！更新情報をお待ちください。'
                  : 'Beijing branch coming soon! Please stay tuned for updates.'}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BeijingPage;
