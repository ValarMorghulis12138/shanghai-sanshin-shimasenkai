import React, { useState, useRef, useMemo } from 'react';
import { useI18n } from '../../i18n/useI18n';
import SessionRegistration, { type SessionRegistrationRef } from '../../components/SessionRegistration';
import AdminPanel from '../../components/AdminPanel';
import CityGallerySlider from '../../components/CityGallerySlider';
import './ShanghaiPage.css';
import bandPhoto from '../../assets/photos/haisai/haisai_sanshin_band.jpg';
import memberPhoto1 from '../../assets/photos/sanshin_member/shimasenkai_member_1.jpg';
import memberPhoto2 from '../../assets/photos/sanshin_member/shimasenkai_member_2.jpg';
import memberPhoto3 from '../../assets/photos/sanshin_member/shimasenkai_member_3.jpg';
import kobudoPhoto from '../../assets/photos/sanshin_member/sanshin_kobudo.jpg';
import eventPhoto from '../../assets/photos/sanshin_member/shimasenkai_event.jpg';

const ShanghaiPage: React.FC = () => {
  const { t } = useI18n();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const sessionRegistrationRef = useRef<SessionRegistrationRef>(null);

  const galleryImages = useMemo(
    () => [
      { src: bandPhoto, alt: 'Haisai Sanshin Band Performance' },
      { src: memberPhoto1, alt: 'Sanshin Shimasenkai Members' },
      { src: memberPhoto2, alt: 'Teaching Scene' },
      { src: memberPhoto3, alt: 'Group Practice Session' },
      { src: kobudoPhoto, alt: 'Sanshin and Okinawan Kobudo Collaboration' },
      { src: eventPhoto, alt: 'Sanshin Shimasenkai Event' },
    ],
    []
  );

  return (
    <div className="sessions-page">
      <div className="container">
        <section className="page-header">
          <h1>{t.cities.shanghai.branch}</h1>
        </section>

        <section className="section gallery-section">
          <CityGallerySlider images={galleryImages} />
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
