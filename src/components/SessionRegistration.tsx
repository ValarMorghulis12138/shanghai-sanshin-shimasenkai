import React, { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../i18n/useI18n';
import type { SessionDayWithRegistrations, ClassSessionWithRegistrations, Registration } from '../types/calendar';
import {
  fetchSessions,
  fetchRegistrations,
  addRegistration,
  deleteRegistration,
  initializeDemoData 
} from '../services/jsonBinService';
import ColorPicker from './ColorPicker';
import './SessionRegistration.css';

interface SessionRegistrationProps {
  cityName?: {
    zh: string;
    ja: string;
    en: string;
  };
  scheduleInfo?: {
    schedule: string[];
    time: string[];
    location: string;
  };
  onAdminAccess?: () => void;
}

const SessionRegistration: React.FC<SessionRegistrationProps> = ({ 
  scheduleInfo,
  onAdminAccess 
}) => {
  const { t, language } = useI18n();
  const [sessions, setSessions] = useState<SessionDayWithRegistrations[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassSessionWithRegistrations | null>(null);
  const [registrationName, setRegistrationName] = useState('');
  const [registrationEmail, setRegistrationEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userColor, setUserColor] = useState<string>('#E53E3E');
  const [selectedEvent, setSelectedEvent] = useState<SessionDayWithRegistrations | null>(null);

  // Load sessions and registrations on component mount
  const initializeAndLoad = useCallback(async () => {
    await initializeDemoData();
    await loadData();
  }, []);

  useEffect(() => {
    // Load user info from localStorage
    const savedEmail = localStorage.getItem('sanshi_user_email');
    const savedName = localStorage.getItem('sanshi_user_name');
    const savedColor = localStorage.getItem('sanshi_user_color');
    
    if (savedEmail) {
      setUserEmail(savedEmail);
      setRegistrationEmail(savedEmail);
    }
    
    if (savedName) {
      setUserName(savedName);
      setRegistrationName(savedName);
    }
    
    if (savedColor) {
      setUserColor(savedColor);
    }
    
    initializeAndLoad();
  }, [initializeAndLoad]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sessionsData, registrationsData] = await Promise.all([
        fetchSessions(),
        fetchRegistrations()
      ]);
      
      // Merge registrations into sessions for display
      const mergedData: SessionDayWithRegistrations[] = sessionsData.map(session => ({
        ...session,
        classes: session.classes.map(classItem => ({
          ...classItem,
          registrations: registrationsData.filter(reg => reg.sessionId === classItem.id)
        })),
        // 特殊活动的报名使用session.id作为sessionId
        eventRegistrations: session.isSpecialEvent 
          ? registrationsData.filter(reg => reg.sessionId === session.id)
          : undefined
      }));
      
      setSessions(mergedData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getClassTypeName = (type: string) => {
    const classNames = {
      experience: { en: 'Experience Class', zh: '素人体验', ja: '体験クラス' },
      beginner: { en: 'Beginner Class', zh: '初级课程', ja: 'ゆるりクラス' },
      intermediate: { en: 'Intermediate/Advanced', zh: '中高级课程', ja: '民謡/早弾きクラス' }
    };
    return classNames[type as keyof typeof classNames]?.[language] || type;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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

  const handleRegistration = (classSession: ClassSessionWithRegistrations) => {
    setSelectedClass(classSession);
    setSelectedEvent(null); // 确保清除特殊活动选择
    // Pre-fill with saved user info
    if (userName) setRegistrationName(userName);
    if (userEmail) setRegistrationEmail(userEmail);
    setShowRegistrationModal(true);
  };

  const handleEventRegistration = (event: SessionDayWithRegistrations) => {
    // 创建一个虚拟的ClassSession对象用于报名模态框
    const eventAsClass: ClassSessionWithRegistrations = {
      id: event.id,
      date: event.date,
      type: 'experience', // 默认类型
      startTime: event.eventStartTime || '',
      duration: 0,
      maxParticipants: event.eventMaxParticipants || 50,
      registrations: event.eventRegistrations || []
    };
    setSelectedClass(eventAsClass);
    setSelectedEvent(event); // 设置选中的特殊活动
    // Pre-fill with saved user info
    if (userName) setRegistrationName(userName);
    if (userEmail) setRegistrationEmail(userEmail);
    setShowRegistrationModal(true);
  };

  const submitRegistration = async () => {
    if (!selectedClass || !registrationName.trim() || !registrationEmail.trim()) return;

    const newRegistration: Registration = {
      id: `reg-${Date.now()}`,
      sessionId: selectedClass.id,
      name: registrationName.trim(),
      email: registrationEmail.trim(),
      color: userColor,
      timestamp: Date.now()
    };
    
    // Save user info to localStorage for future use
    localStorage.setItem('sanshi_user_email', registrationEmail.trim());
    localStorage.setItem('sanshi_user_name', registrationName.trim());
    localStorage.setItem('sanshi_user_color', userColor);
    setUserEmail(registrationEmail.trim());
    setUserName(registrationName.trim());

    setLoading(true);
    try {
      const success = await addRegistration(newRegistration);
      
      if (success) {
        // Reload data to show the new registration
        await loadData();
        
        setShowRegistrationModal(false);
        setRegistrationName(userName || '');
        setRegistrationEmail(userEmail || '');
        setSelectedClass(null);
        
        // Show success message
        alert(t.sessions.registration.success);
      } else {
        alert(t.sessions.registration.failed);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert(t.sessions.registration.error);
    } finally {
      setLoading(false);
    }
  };
  
  const checkUserRegistration = (classSession: ClassSessionWithRegistrations): Registration | null => {
    if (!userEmail) return null;
    return classSession.registrations.find(reg => reg.email === userEmail) || null;
  };
  
  const handleCancelRegistration = async (registration: Registration) => {
    if (!confirm(t.sessions.registration.cancelConfirm)) return;
    
    setLoading(true);
    try {
      // Delete registration from the registrations collection
      const success = await deleteRegistration(registration.id);
      
      if (success) {
        // Reload data to show the changes
        await loadData();
        alert(t.sessions.registration.cancelled);
      } else {
        throw new Error('Failed to cancel registration');
      }
    } catch (error) {
      console.error('Cancel registration error:', error);
      alert(t.sessions.registration.cancelFailed);
    } finally {
      setLoading(false);
    }
  };

  const getSessionsForMonth = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    
    return sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate.getFullYear() === year && sessionDate.getMonth() === month;
    });
  };

  const monthSessions = getSessionsForMonth();

  return (
    <div className="session-registration">
      {/* Schedule Information */}
      {scheduleInfo && (
        <section className="schedule-info">
          <div className="info-card">
            <h3>{t.sessions.scheduleTitle}</h3>
            <p>{t.sessions.scheduleDescription}</p>
            <div className="schedule-details">
              {scheduleInfo.schedule.map((item, index) => (
                <p key={`schedule-${index}`}>📅 {item}</p>
              ))}
              {scheduleInfo.time.map((item, index) => (
                <p key={`time-${index}`}>⏰ {item}</p>
              ))}
              <p>📍 {t.common.location}： {scheduleInfo.location}</p>
            </div>
          </div>
          
          <div className="info-card">
            <h3>{t.sessions.whatToBring.title}</h3>
            <ul>
              {t.sessions.whatToBring.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Month Navigation */}
      <section className="calendar-section">
        <div className="month-navigation">
          <button 
            onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
            className="nav-button"
          >
            ←
          </button>
          <h2>
            {selectedMonth.toLocaleDateString(
              language === 'zh' ? 'zh-CN' : language === 'ja' ? 'ja-JP' : 'en-US',
              { year: 'numeric', month: 'long' }
            )}
          </h2>
          <button 
            onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}
            className="nav-button"
          >
            →
          </button>
        </div>

        {/* Sessions Display */}
        <div className="sessions-list">
          {monthSessions.length === 0 ? (
            <div className="no-sessions">
              <p>{t.sessions.noSessionsThisMonth}</p>
            </div>
          ) : (
            monthSessions.map(day => (
              <div key={day.id} className="session-day">
                <h3 className="session-date">
                  {formatDate(day.date)}
                  {day.isSpecialEvent && (
                    <span className="event-badge">
                      {t.sessions.specialEvent}
                    </span>
                  )}
                </h3>
                
                {day.isSpecialEvent ? (
                  <div className="special-event-content">
                    <h4 className="event-title">{day.eventTitle}</h4>
                    {day.eventDescription && (
                      <p className="event-description">{day.eventDescription}</p>
                    )}
                    <div className="event-details">
                      <p className="event-time">
                        ⏰ {day.eventStartTime} - {day.eventEndTime}
                      </p>
                      {day.location && (
                        <p className="event-location">
                          📍 {day.location}
                        </p>
                      )}
                    </div>
                    
                    {/* Registration section for special events */}
                    <div className="event-registration-section">
                      <div className="registration-status">
                        <div className="participants-count">
                          <span>{day.eventRegistrations?.length || 0} / {day.eventMaxParticipants || 50}</span>
                          <span className="participants-label">
                            {t.sessions.registered}
                          </span>
                        </div>
                        <div className="participants-bar">
                          <div 
                            className="participants-fill"
                            style={{ 
                              width: `${((day.eventRegistrations?.length || 0) / (day.eventMaxParticipants || 50)) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                      
                      {/* Show registered names */}
                      {day.eventRegistrations && day.eventRegistrations.length > 0 && (
                        <div className="registered-names">
                          {day.eventRegistrations.slice(0, 3).map((reg, idx) => (
                            <span 
                              key={idx} 
                              className={`name-tag ${userEmail && reg.email === userEmail ? 'user-registration' : ''}`}
                              style={{ backgroundColor: reg.color || '#E53E3E' }}
                            >
                              {reg.name}
                            </span>
                          ))}
                          {day.eventRegistrations.length > 3 && (
                            <span className="more-names">
                              +{day.eventRegistrations.length - 3} {t.sessions.more}
                            </span>
                          )}
                        </div>
                      )}
                      
                      {(() => {
                        const userEventRegistration = day.eventRegistrations?.find(reg => reg.email === userEmail);
                        if (userEventRegistration) {
                          return (
                            <button
                              className="cancel-button"
                              onClick={() => handleCancelRegistration(userEventRegistration)}
                            >
                              {t.sessions.cancel}
                            </button>
                          );
                        } else if ((day.eventRegistrations?.length || 0) >= (day.eventMaxParticipants || 50)) {
                          return (
                            <button className="register-button full" disabled>
                              {t.sessions.full}
                            </button>
                          );
                        } else {
                          return (
                            <button
                              className="register-button"
                              onClick={() => handleEventRegistration(day)}
                            >
                              {t.sessions.registerNow}
                            </button>
                          );
                        }
                      })()}
                    </div>
                  </div>
                ) : (
                  <div className="classes-grid">
                    {day.classes.map(classSession => (
                    <div key={classSession.id} className="class-card">
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
                              {language === 'zh' ? '已报名' : language === 'ja' ? '登録済み' : 'registered'}
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
                                className={`name-tag ${userEmail && reg.email === userEmail ? 'user-registration' : ''}`}
                                style={{ backgroundColor: reg.color || '#E53E3E' }}
                              >
                                {reg.name}
                              </span>
                            ))}
                            {classSession.registrations.length > 3 && (
                              <span className="more-names">
                                +{classSession.registrations.length - 3} {language === 'zh' ? '更多' : language === 'ja' ? 'その他' : 'more'}
                              </span>
                            )}
                          </div>
                        )}
                        
                        {(() => {
                          const userRegistration = checkUserRegistration(classSession);
                          if (userRegistration) {
                            return (
                              <button
                                className="cancel-button"
                                onClick={() => handleCancelRegistration(userRegistration)}
                                disabled={loading}
                              >
                                {t.sessions.cancel}
                              </button>
                            );
                          }
                          return (
                            <button
                              className="register-button"
                              onClick={() => handleRegistration(classSession)}
                              disabled={classSession.registrations.length >= classSession.maxParticipants}
                            >
                              {classSession.registrations.length >= classSession.maxParticipants
                                ? t.sessions.full
                                : t.common.register}
                            </button>
                          );
                        })()}
                      </div>
                    </div>
                    ))}
                  </div>
                )}
                {day.location && !day.isSpecialEvent && (
                  <p className="session-location">📍 {day.location}</p>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Simple Registration Modal */}
      {showRegistrationModal && selectedClass && (
        <div className="modal-overlay" onClick={() => {
          setShowRegistrationModal(false);
          setRegistrationName(userName || '');
          setRegistrationEmail(userEmail || '');
          setSelectedEvent(null);
        }}>
          <div className="modal-content simple-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => {
                setShowRegistrationModal(false);
                setRegistrationName(userName || '');
                setRegistrationEmail(userEmail || '');
                setSelectedEvent(null);
              }}
            >
              ×
            </button>
            
            <h2>
              {selectedEvent 
                ? t.sessions.registration.eventRegistration
                : t.sessions.registration.classRegistration
              }
            </h2>
            <p className="modal-class-info">
              {selectedEvent 
                ? `${selectedEvent.eventTitle} - ${selectedEvent.eventStartTime} ~ ${selectedEvent.eventEndTime}`
                : `${getClassTypeName(selectedClass.type)} - ${selectedClass.startTime}`
              }
            </p>
            
            <div className="simple-form">
              <label>
                {t.sessions.registration.yourName}
              </label>
              <input
                type="text"
                value={registrationName}
                onChange={(e) => setRegistrationName(e.target.value)}
                placeholder={t.sessions.registration.enterName}
                autoFocus
              />
              
              <label>
                {t.sessions.registration.yourEmail}
              </label>
              <input
                type="email"
                value={registrationEmail}
                onChange={(e) => setRegistrationEmail(e.target.value)}
                placeholder={t.sessions.registration.enterEmail}
                required
              />
              
              <ColorPicker 
                selectedColor={userColor}
                onColorChange={setUserColor}
                language={language}
              />
              
              {(userName || userEmail) && (
                <div className="saved-info-container">
                  <p className="saved-info-note">
                    {t.sessions.registration.savedInfo}
                  </p>
                  <button 
                    type="button"
                    className="clear-info-button"
                    onClick={() => {
                      localStorage.removeItem('sanshi_user_email');
                      localStorage.removeItem('sanshi_user_name');
                      localStorage.removeItem('sanshi_user_color');
                      setUserEmail(null);
                      setUserName(null);
                      setUserColor('#E53E3E');
                      setRegistrationName('');
                      setRegistrationEmail('');
                    }}
                  >
                    {t.sessions.registration.clearSavedInfo}
                  </button>
                </div>
              )}
              
              <div className="form-actions">
                <button
                  className="submit-button"
                  onClick={submitRegistration}
                  disabled={!registrationName.trim() || !registrationEmail.trim()}
                >
                  {t.sessions.registration.confirmRegistration}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

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
};

export default SessionRegistration;
