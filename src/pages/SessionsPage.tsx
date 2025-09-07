import React, { useState } from 'react';
import { useI18n } from '../i18n/useI18n';
import type { SessionDay, ClassSession, Registration } from '../types/calendar';
import './SessionsPage.css';

// Mock data for demonstration
const generateMockSessions = (): SessionDay[] => {
  const today = new Date();
  const sessions: SessionDay[] = [];
  
  // Generate sessions for next 3 months
  for (let month = 0; month < 3; month++) {
    for (let week = 0; week < 4; week += 2) { // Every 2 weeks
      const sessionDate = new Date(today.getFullYear(), today.getMonth() + month, 7 + week * 7);
      if (sessionDate.getDay() !== 6) { // Adjust to Saturday
        sessionDate.setDate(sessionDate.getDate() + (6 - sessionDate.getDay()));
      }
      
      sessions.push({
        id: `session-${month}-${week}`,
        date: sessionDate.toISOString().split('T')[0],
        location: '酒友(sakatomo): 水城南路71号1F',
        classes: [
          {
            id: `class-${month}-${week}-1`,
            date: sessionDate.toISOString().split('T')[0],
            type: 'intermediate',
            startTime: '14:00',
            duration: 50,
            maxParticipants: 15,
            registrations: [],
            instructor: '田中先生'
          },
          {
            id: `class-${month}-${week}-2`,
            date: sessionDate.toISOString().split('T')[0],
            type: 'experience',
            startTime: '15:00',
            duration: 50,
            maxParticipants: 20,
            registrations: [],
            instructor: '田中先生'
          },
          {
            id: `class-${month}-${week}-3`,
            date: sessionDate.toISOString().split('T')[0],
            type: 'beginner',
            startTime: '16:00',
            duration: 50,
            maxParticipants: 15,
            registrations: [],
            instructor: '田中先生'
          }
        ]
      });
    }
  }
  
  return sessions;
};

const SessionsPage: React.FC = () => {
  const { t, language } = useI18n();
  const [sessions, setSessions] = useState<SessionDay[]>(generateMockSessions());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassSession | null>(null);
  const [registrationName, setRegistrationName] = useState('');

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

  const handleRegistration = (classSession: ClassSession) => {
    setSelectedClass(classSession);
    setShowRegistrationModal(true);
  };

  const submitRegistration = () => {
    if (!selectedClass || !registrationName.trim()) return;

    const newRegistration: Registration = {
      name: registrationName.trim(),
      timestamp: Date.now(),
      sessionId: selectedClass.id
    };

    // In a real app, this would save to Firebase
    // For now, we'll update local state
    setSessions(prevSessions => 
      prevSessions.map(day => ({
        ...day,
        classes: day.classes.map(cls => 
          cls.id === selectedClass.id 
            ? { ...cls, registrations: [...cls.registrations, newRegistration] }
            : cls
        )
      }))
    );

    setShowRegistrationModal(false);
    setRegistrationName('');
    setSelectedClass(null);
    
    // Show success message
    alert(language === 'zh' ? '报名成功！' : language === 'ja' ? '登録完了！' : 'Registration successful!');
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
    <div className="sessions-page">
      <div className="container">
        <section className="page-header">
          <h1>{t.sessions.title}</h1>
          <p className="page-description">{t.sessions.description}</p>
        </section>

        {/* Schedule Information */}
        <section className="schedule-info">
          <div className="info-card">
            <h3>{t.sessions.scheduleTitle}</h3>
            <p>{t.sessions.scheduleDescription}</p>
            <div className="schedule-details">
              <p>📅 {language === 'zh' ? '每月两次，隔周周六' : language === 'ja' ? '月2回、隔週土曜日' : 'Twice monthly, every other Saturday'}</p>
              <p>⏰ 14:00-17:00 ({language === 'zh' ? '每节课50分钟，休息10分钟' : language === 'ja' ? '各クラス50分、休憩10分' : '50min classes, 10min breaks'})</p>
              <p>📍 {language === 'zh' ? '地点：' : language === 'ja' ? '場所：' : 'Location:'} 酒友(sakatomo)</p>
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
                <p>{language === 'zh' ? '本月暂无课程安排' : language === 'ja' ? '今月の予定はありません' : 'No sessions scheduled this month'}</p>
              </div>
            ) : (
              monthSessions.map(day => (
                <div key={day.id} className="session-day">
                  <h3 className="session-date">{formatDate(day.date)}</h3>
                  {day.isSpecialEvent && (
                    <div className="special-event">
                      <span className="event-badge">Special Event</span>
                      <h4>{day.eventTitle}</h4>
                      {day.eventDescription && <p>{day.eventDescription}</p>}
                    </div>
                  )}
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
                                <span key={idx} className="name-tag">{reg.name}</span>
                              ))}
                              {classSession.registrations.length > 3 && (
                                <span className="more-names">
                                  +{classSession.registrations.length - 3} {language === 'zh' ? '更多' : language === 'ja' ? 'その他' : 'more'}
                                </span>
                              )}
                            </div>
                          )}
                          
                          <button
                            className="register-button"
                            onClick={() => handleRegistration(classSession)}
                            disabled={classSession.registrations.length >= classSession.maxParticipants}
                          >
                            {classSession.registrations.length >= classSession.maxParticipants
                              ? (language === 'zh' ? '已满' : language === 'ja' ? '満員' : 'Full')
                              : (language === 'zh' ? '报名' : language === 'ja' ? '登録' : 'Register')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {day.location && (
                    <p className="session-location">📍 {day.location}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Simple Registration Modal */}
        {showRegistrationModal && selectedClass && (
          <div className="modal-overlay" onClick={() => setShowRegistrationModal(false)}>
            <div className="modal-content simple-modal" onClick={(e) => e.stopPropagation()}>
              <button 
                className="modal-close"
                onClick={() => setShowRegistrationModal(false)}
              >
                ×
              </button>
              
              <h2>{language === 'zh' ? '课程报名' : language === 'ja' ? 'クラス登録' : 'Class Registration'}</h2>
              <p className="modal-class-info">
                {getClassTypeName(selectedClass.type)} - {selectedClass.startTime}
              </p>
              
              <div className="simple-form">
                <label>
                  {language === 'zh' ? '您的姓名' : language === 'ja' ? 'お名前' : 'Your Name'}
                </label>
                <input
                  type="text"
                  value={registrationName}
                  onChange={(e) => setRegistrationName(e.target.value)}
                  placeholder={language === 'zh' ? '请输入姓名' : language === 'ja' ? '名前を入力' : 'Enter your name'}
                  autoFocus
                />
                
                <div className="form-actions">
                  <button
                    className="submit-button"
                    onClick={submitRegistration}
                    disabled={!registrationName.trim()}
                  >
                    {language === 'zh' ? '确认报名' : language === 'ja' ? '登録確認' : 'Confirm Registration'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Teacher Admin Hint */}
        <section className="admin-hint">
          <div className="hint-box">
            <p>
              💡 {language === 'zh' 
                ? '老师登录后可以创建新课程和查看完整报名名单' 
                : language === 'ja' 
                ? '先生はログイン後、新しいクラスを作成し、完全な登録リストを表示できます' 
                : 'Teachers can log in to create new sessions and view full registration lists'}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SessionsPage;