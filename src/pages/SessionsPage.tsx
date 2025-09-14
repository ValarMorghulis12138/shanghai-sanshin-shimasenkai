import React, { useState, useEffect } from 'react';
import { useI18n } from '../i18n/useI18n';
import type { SessionDay, ClassSession, Registration } from '../types/calendar';
import { 
  fetchSessions, 
  fetchRegistrations, 
  addRegistration,
  initializeDemoData 
} from '../services/jsonBinService';
import AdminPanel from '../components/AdminPanel';
import './SessionsPage.css';


const SessionsPage: React.FC = () => {
  const { t, language } = useI18n();
  const [sessions, setSessions] = useState<SessionDay[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassSession | null>(null);
  const [registrationName, setRegistrationName] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Load sessions and registrations on component mount
  useEffect(() => {
    initializeAndLoad();
  }, []);

  const initializeAndLoad = async () => {
    await initializeDemoData();
    await loadData();
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [sessionsData, registrationsData] = await Promise.all([
        fetchSessions(),
        fetchRegistrations()
      ]);
      
      // Merge registrations into sessions
      const mergedData = sessionsData.map(session => ({
        ...session,
        classes: session.classes.map(classItem => ({
          ...classItem,
          registrations: registrationsData.filter(reg => reg.sessionId === classItem.id)
        }))
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

  const handleRegistration = (classSession: ClassSession) => {
    setSelectedClass(classSession);
    setShowRegistrationModal(true);
  };

  const submitRegistration = async () => {
    if (!selectedClass || !registrationName.trim()) return;

    const newRegistration: Registration = {
      id: `reg-${Date.now()}`,
      sessionId: selectedClass.id,
      name: registrationName.trim(),
      timestamp: Date.now()
    };

    setLoading(true);
    try {
      const success = await addRegistration(newRegistration);
      
      if (success) {
        // Reload data to show the new registration
        await loadData();
        
        setShowRegistrationModal(false);
        setRegistrationName('');
        setSelectedClass(null);
        
        // Show success message
        alert(language === 'zh' ? '报名成功！' : language === 'ja' ? '登録完了！' : 'Registration successful!');
      } else {
        alert(language === 'zh' ? '报名失败，请重试' : language === 'ja' ? '登録に失敗しました' : 'Registration failed, please try again');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert(language === 'zh' ? '报名出错' : language === 'ja' ? 'エラーが発生しました' : 'An error occurred');
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
    <div className="sessions-page">
      <div className="container">
        <section className="page-header">
          <h1>{t.sessions.title}</h1>
          <p className="page-description">{t.sessions.description}</p>
          <p className="data-notice">
            📅 {language === 'zh' 
              ? '显示最近3个月的课程安排' 
              : language === 'ja' 
              ? '過去3ヶ月のクラススケジュールを表示' 
              : 'Showing sessions from the last 3 months'}
          </p>
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

        {/* Admin Panel */}
        {showAdminPanel && (
          <AdminPanel 
            onClose={() => setShowAdminPanel(false)}
            onSessionsUpdate={loadData}
          />
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner">
              {language === 'zh' ? '加载中...' : language === 'ja' ? '読み込み中...' : 'Loading...'}
            </div>
          </div>
        )}

        {/* Teacher Admin Access */}
        <section className="admin-hint">
          <div className="hint-box">
            <button 
              className="admin-access-button"
              onClick={() => setShowAdminPanel(true)}
            >
              🔐 {language === 'zh' 
                ? '教师管理入口' 
                : language === 'ja' 
                ? '先生管理画面' 
                : 'Teacher Admin Access'}
            </button>
            <p className="small-text">
              {language === 'zh' 
                ? '教师可以使用密码登录管理课程' 
                : language === 'ja' 
                ? '先生はパスワードでログインしてクラスを管理できます' 
                : 'Teachers can login with password to manage sessions'}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SessionsPage;