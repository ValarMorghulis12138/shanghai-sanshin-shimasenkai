import { useState, useMemo, useImperativeHandle, forwardRef } from 'react';
import { useI18n } from '../i18n/useI18n';
import type { Registration } from '../types/calendar';
import { useSessionData } from '../hooks/useSessionData';
import { useRegistration } from '../hooks/useRegistration';
import {
  ScheduleInfo,
  MonthNavigation,
  SessionCard,
  RegistrationModal,
  LoadingState
} from './SessionRegistrationComponents';
import './SessionRegistration.css';

interface SessionRegistrationProps {
  scheduleInfo?: {
    schedule: string[];
    time: string[];
    location: string;
  };
  onAdminAccess?: () => void;
}

export interface SessionRegistrationRef {
  reloadData: () => Promise<void>;
  updateSessionsDirectly: (sessions: any[]) => void;
  syncFromLocalStorage: () => Promise<void>;
}

const SessionRegistration = forwardRef<SessionRegistrationRef, SessionRegistrationProps>(({ 
  scheduleInfo,
  onAdminAccess 
}, ref) => {
  const { t } = useI18n();
  // Initialize with first day of current month to avoid comparison issues
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [modalSessionTitle, setModalSessionTitle] = useState('');
  const [modalSessionTime, setModalSessionTime] = useState('');

  // Custom hooks
  const { sessions, loading: dataLoading, reloadData, updateSessionsDirectly, syncFromLocalStorage } = useSessionData();
  const {
    userEmail,
    userName,
    userColor,
    loading: registrationLoading,
    submitRegistration,
    cancelRegistration,
    clearUserInfo
  } = useRegistration(reloadData, syncFromLocalStorage); // Pass syncFromLocalStorage for optimization

  const loading = dataLoading || registrationLoading;

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    reloadData,
    updateSessionsDirectly,
    syncFromLocalStorage
  }));

  // Get sessions for the selected month
  const monthSessions = useMemo(() => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    
    return sessions.filter(session => {
      // Parse date string directly to avoid timezone issues
      // session.date format: "YYYY-MM-DD"
      const [sessionYear, sessionMonth] = session.date.split('-').map(Number);
      
      // Note: sessionMonth is 1-12 in string, but getMonth() returns 0-11
      return sessionYear === year && sessionMonth - 1 === month;
    });
  }, [sessions, selectedMonth]);

  // Handler for opening registration modal
  const handleOpenRegistrationModal = (sessionId: string, title: string, time: string) => {
    setSelectedSessionId(sessionId);
    setModalSessionTitle(title);
    setModalSessionTime(time);
    setShowRegistrationModal(true);
  };

  // Handler for registration by class ID
  const handleRegisterClass = (classId: string) => {
    const classSession = sessions
      .flatMap(s => s.classes)
      .find(c => c.id === classId);
    
    if (classSession) {
      const typeMap = {
        experience: t.sessions.sessionCard.level.experience,
        beginner: t.sessions.sessionCard.level.beginner,
        intermediate: t.sessions.sessionCard.level.intermediate
      };
      const classTypeName = typeMap[classSession.type as keyof typeof typeMap] || classSession.type;
      
      handleOpenRegistrationModal(
        classId,
        classTypeName,
        classSession.startTime
      );
    }
  };

  // Handler for registration by event ID
  const handleRegisterEvent = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session?.isSpecialEvent) {
      handleOpenRegistrationModal(
        sessionId,
        session.eventTitle || '',
        `${session.eventStartTime} ~ ${session.eventEndTime}`
      );
    }
  };

  // Handler for submitting registration
  const handleSubmitRegistration = (name: string, email: string, color: string) => {
    if (!selectedSessionId) return;

    submitRegistration(
      selectedSessionId,
      name,
      email,
      color,
      () => {
        setShowRegistrationModal(false);
        setSelectedSessionId(null);
        alert(t.sessions.registration.success);
      },
      (errorMessage) => {
        alert(t.sessions.registration.failed + ': ' + errorMessage);
      }
    );
  };

  // Handler for canceling registration
  const handleCancelRegistration = (registration: Registration) => {
    if (!confirm(t.sessions.registration.cancelConfirm)) return;

    cancelRegistration(
      registration.id,
      () => {
        alert(t.sessions.registration.cancelled);
      },
      (errorMessage) => {
        alert(t.sessions.registration.cancelFailed + ': ' + errorMessage);
      }
    );
  };

  return (
    <div className="session-registration">
      {/* Schedule Information */}
      {scheduleInfo && (
        <ScheduleInfo
          schedule={scheduleInfo.schedule}
          time={scheduleInfo.time}
          location={scheduleInfo.location}
        />
      )}

      {/* Month Navigation and Sessions */}
      <section className="calendar-section">
        <MonthNavigation
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />

        {/* Sessions Display */}
        <div className="sessions-list">
          {monthSessions.length === 0 ? (
            <div className="no-sessions">
              <p>{t.sessions.noSessionsThisMonth}</p>
            </div>
          ) : (
            monthSessions.map(session => (
              <SessionCard
                key={session.id}
                session={session}
                userEmail={userEmail}
                onRegisterClass={handleRegisterClass}
                onRegisterEvent={handleRegisterEvent}
                onCancelRegistration={handleCancelRegistration}
                checkUserRegistration={(registrations: Registration[]) => 
                  registrations.find((reg: Registration) => reg.email === userEmail) || null
                }
                loading={loading}
              />
            ))
          )}
        </div>
      </section>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => {
          setShowRegistrationModal(false);
          setSelectedSessionId(null);
        }}
        onSubmit={handleSubmitRegistration}
        sessionTitle={modalSessionTitle}
        sessionTime={modalSessionTime}
        userName={userName}
        userEmail={userEmail}
        userColor={userColor}
        onClearUserInfo={() => {
          clearUserInfo();
        }}
      />

      {/* Loading State */}
      <LoadingState isLoading={loading} />

      {/* Teacher Admin Access */}
      {onAdminAccess && (
        <section className="admin-hint">
          <div className="hint-box">
            <button 
              className="admin-access-button"
              onClick={onAdminAccess}
            >
              🔐 {t.admin.teacherAccess}
            </button>
            <p className="small-text">
              {t.admin.teacherAccessHint}
            </p>
          </div>
        </section>
      )}
    </div>
  );
});

SessionRegistration.displayName = 'SessionRegistration';

export default SessionRegistration;
