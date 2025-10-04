import React from 'react';
import { useI18n } from '../../i18n/useI18n';
import type { SessionDayWithRegistrations, Registration } from '../../types/calendar';
import { ClassCard } from './ClassCard';

interface SessionCardProps {
  session: SessionDayWithRegistrations;
  userEmail: string | null;
  onRegisterClass: (classId: string) => void;
  onRegisterEvent: (sessionId: string) => void;
  onCancelRegistration: (registration: Registration) => void;
  checkUserRegistration: (registrations: Registration[]) => Registration | null;
  loading: boolean;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  userEmail,
  onRegisterClass,
  onRegisterEvent,
  onCancelRegistration,
  checkUserRegistration,
  loading
}) => {
  const { t, language } = useI18n();

  const formatDate = (dateString: string) => {
    // Parse date string to avoid timezone issues
    // dateString format: "YYYY-MM-DD"
    const [year, month, day] = dateString.split('-').map(Number);
    // Create date in local timezone (month is 0-indexed)
    const date = new Date(year, month - 1, day);
    
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    if (language === 'zh') {
      return date.toLocaleDateString('zh-CN', options);
    } else if (language === 'ja') {
      return date.toLocaleDateString('ja-JP', options);
    }
    return date.toLocaleDateString('en-US', options);
  };

  const renderSpecialEvent = () => {
    const eventRegistrations = session.eventRegistrations || [];
    const maxParticipants = session.eventMaxParticipants || 50;
    const userEventRegistration = eventRegistrations.find(reg => reg.email === userEmail);
    const isFull = eventRegistrations.length >= maxParticipants;

    return (
      <div className="special-event-content">
        <h4 className="event-title">{session.eventTitle}</h4>
        {session.eventDescription && (
          <p className="event-description">{session.eventDescription}</p>
        )}
        <div className="event-details">
          <p className="event-time">
            ⏰ {session.eventStartTime} - {session.eventEndTime}
          </p>
          {session.location && (
            <p className="event-location">
              📍 {session.location}
            </p>
          )}
        </div>
        
        <div className="event-registration-section">
          <div className="registration-status">
            <div className="participants-count">
              <span>{eventRegistrations.length} / {maxParticipants}</span>
              <span className="participants-label">
                {t.sessions.registered}
              </span>
            </div>
            <div className="participants-bar">
              <div 
                className="participants-fill"
                style={{ 
                  width: `${(eventRegistrations.length / maxParticipants) * 100}%` 
                }}
              />
            </div>
          </div>
          
          {eventRegistrations.length > 0 && (
            <div className="registered-names">
              {eventRegistrations.slice(0, 3).map((reg, idx) => (
                <span 
                  key={idx} 
                  className={`name-tag ${userEmail && reg.email === userEmail ? 'user-registration' : ''}`}
                  style={{ backgroundColor: reg.color || '#E53E3E' }}
                >
                  {reg.name}
                </span>
              ))}
              {eventRegistrations.length > 3 && (
                <span className="more-names">
                  +{eventRegistrations.length - 3} {t.sessions.more}
                </span>
              )}
            </div>
          )}
          
          {userEventRegistration ? (
            <button
              className="cancel-button"
              onClick={() => onCancelRegistration(userEventRegistration)}
              disabled={loading}
            >
              {t.sessions.cancel}
            </button>
          ) : (
            <button
              className={`register-button ${isFull ? 'full' : ''}`}
              onClick={() => onRegisterEvent(session.id)}
              disabled={isFull}
            >
              {isFull ? t.sessions.full : t.common.register}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderRegularSession = () => {
    return (
      <>
        <div className="classes-grid">
          {session.classes.map(classSession => (
            <ClassCard
              key={classSession.id}
              classSession={classSession}
              userRegistration={checkUserRegistration(classSession.registrations)}
              onRegister={() => onRegisterClass(classSession.id)}
              onCancel={() => {
                const userReg = checkUserRegistration(classSession.registrations);
                if (userReg) onCancelRegistration(userReg);
              }}
              loading={loading}
            />
          ))}
        </div>
        {session.location && (
          <p className="session-location">📍 {session.location}</p>
        )}
      </>
    );
  };

  return (
    <div className="session-day">
      <h3 className="session-date">
        {formatDate(session.date)}
        {session.isSpecialEvent && (
          <span className="event-badge">
            {t.sessions.specialEvent}
          </span>
        )}
      </h3>
      
      {session.isSpecialEvent ? renderSpecialEvent() : renderRegularSession()}
    </div>
  );
};

