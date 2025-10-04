import React from 'react';
import { useI18n } from '../../i18n/useI18n';
import type { ClassSessionWithRegistrations, Registration } from '../../types/calendar';

interface ClassCardProps {
  classSession: ClassSessionWithRegistrations;
  userRegistration: Registration | null;
  onRegister: () => void;
  onCancel: () => void;
  loading: boolean;
}

export const ClassCard: React.FC<ClassCardProps> = ({
  classSession,
  userRegistration,
  onRegister,
  onCancel,
  loading
}) => {
  const { t, language } = useI18n();

  const getClassTypeName = (type: string) => {
    const classNames = {
      experience: { en: 'Experience Class', zh: '素人体验', ja: '体験クラス' },
      beginner: { en: 'Beginner Class', zh: '初级课程', ja: 'ゆるりクラス' },
      intermediate: { en: 'Intermediate/Advanced', zh: '中高级课程', ja: '民謡/早弾きクラス' }
    };
    return classNames[type as keyof typeof classNames]?.[language] || type;
  };

  const isFull = classSession.registrations.length >= classSession.maxParticipants;

  return (
    <div className="class-card">
      <div className="class-header">
        <h4>{getClassTypeName(classSession.type)}</h4>
        <span className="class-time">{classSession.startTime}</span>
      </div>
      <div className="class-info">
        {classSession.instructor && (
          <p className="instructor">👨‍🏫 {classSession.instructor}</p>
        )}
        <div className="registration-status">
          <div className="participants-count">
            <span>{classSession.registrations.length} / {classSession.maxParticipants}</span>
            <span className="participants-label">
              {t.sessions.registered}
            </span>
          </div>
          <div className="participants-bar">
            <div 
              className="participants-fill"
              style={{
                width: `${(classSession.registrations.length / classSession.maxParticipants) * 100}%`
              }}
            />
          </div>
        </div>
        
        {/* Show registered names */}
        {classSession.registrations.length > 0 && (
          <div className="registered-names">
            {classSession.registrations.slice(0, 3).map((reg, idx) => (
              <span 
                key={idx} 
                className={`name-tag ${userRegistration && reg.email === userRegistration.email ? 'user-registration' : ''}`}
                style={{ backgroundColor: reg.color || '#E53E3E' }}
              >
                {reg.name}
              </span>
            ))}
            {classSession.registrations.length > 3 && (
              <span className="more-names">
                +{classSession.registrations.length - 3} {t.sessions.more}
              </span>
            )}
          </div>
        )}
        
        {userRegistration ? (
          <button
            className="cancel-button"
            onClick={onCancel}
            disabled={loading}
          >
            {t.sessions.cancel}
          </button>
        ) : (
          <button
            className="register-button"
            onClick={onRegister}
            disabled={isFull}
          >
            {isFull ? t.sessions.full : t.common.register}
          </button>
        )}
      </div>
    </div>
  );
};

