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
import AdminPanel from '../components/AdminPanel';
import './SessionsPage.css';


const SessionsPage: React.FC = () => {
  const { t, language } = useI18n();
  const [sessions, setSessions] = useState<SessionDayWithRegistrations[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassSessionWithRegistrations | null>(null);
  const [registrationName, setRegistrationName] = useState('');
  const [registrationEmail, setRegistrationEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
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
    
    if (savedEmail) {
      setUserEmail(savedEmail);
      setRegistrationEmail(savedEmail);
    }
    
    if (savedName) {
      setUserName(savedName);
      setRegistrationName(savedName);
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
      timestamp: Date.now()
    };
    
    // Save user info to localStorage for future use
    localStorage.setItem('sanshi_user_email', registrationEmail.trim());
    localStorage.setItem('sanshi_user_name', registrationName.trim());
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
  
  const checkUserRegistration = (classSession: ClassSessionWithRegistrations): Registration | null => {
    if (!userEmail) return null;
    return classSession.registrations.find(reg => reg.email === userEmail) || null;
  };
  
  const handleCancelRegistration = async (registration: Registration) => {
    const confirmMessage = language === 'zh' 
      ? '确定要取消报名吗？' 
      : language === 'ja' 
      ? '登録をキャンセルしてもよろしいですか？' 
      : 'Are you sure you want to cancel your registration?';
      
    if (!confirm(confirmMessage)) return;
    
    setLoading(true);
    try {
      // Delete registration from the registrations collection
      const success = await deleteRegistration(registration.id);
      
      if (success) {
        // Reload data to show the changes
        await loadData();
        alert(language === 'zh' ? '已取消报名' : language === 'ja' ? '登録がキャンセルされました' : 'Registration cancelled');
      } else {
        throw new Error('Failed to cancel registration');
      }
    } catch (error) {
      console.error('Cancel registration error:', error);
      alert(language === 'zh' ? '取消失败，请重试' : language === 'ja' ? 'キャンセルに失敗しました' : 'Cancellation failed');
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
                  <h3 className="session-date">
                    {formatDate(day.date)}
                    {day.isSpecialEvent && (
                      <span className="event-badge">
                        {language === 'zh' ? '特殊活动' : language === 'ja' ? '特別イベント' : 'Special Event'}
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
                              {language === 'zh' ? '已报名' : language === 'ja' ? '登録済み' : 'registered'}
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
                              >
                                {reg.name}
                              </span>
                            ))}
                            {day.eventRegistrations.length > 3 && (
                              <span className="more-names">
                                +{day.eventRegistrations.length - 3} {language === 'zh' ? '更多' : language === 'ja' ? 'その他' : 'more'}
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
                                {language === 'zh' ? '取消报名' : language === 'ja' ? '登録をキャンセル' : 'Cancel Registration'}
                              </button>
                            );
                          } else if ((day.eventRegistrations?.length || 0) >= (day.eventMaxParticipants || 50)) {
                            return (
                              <button className="register-button full" disabled>
                                {language === 'zh' ? '已满' : language === 'ja' ? '満員' : 'Full'}
                              </button>
                            );
                          } else {
                            return (
                              <button
                                className="register-button"
                                onClick={() => handleEventRegistration(day)}
                              >
                                {language === 'zh' ? '立即报名' : language === 'ja' ? '今すぐ登録' : 'Register Now'}
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
                                  {language === 'zh' ? '取消报名' : language === 'ja' ? '登録をキャンセル' : 'Cancel Registration'}
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
                                  ? (language === 'zh' ? '已满' : language === 'ja' ? '満員' : 'Full')
                                  : (language === 'zh' ? '报名' : language === 'ja' ? '登録' : 'Register')}
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
                  ? (language === 'zh' ? '活动报名' : language === 'ja' ? 'イベント登録' : 'Event Registration')
                  : (language === 'zh' ? '课程报名' : language === 'ja' ? 'クラス登録' : 'Class Registration')
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
                  {language === 'zh' ? '您的姓名' : language === 'ja' ? 'お名前' : 'Your Name'}
                </label>
                <input
                  type="text"
                  value={registrationName}
                  onChange={(e) => setRegistrationName(e.target.value)}
                  placeholder={language === 'zh' ? '请输入姓名' : language === 'ja' ? '名前を入力' : 'Enter your name'}
                  autoFocus
                />
                
                <label>
                  {language === 'zh' ? '您的邮箱' : language === 'ja' ? 'メールアドレス' : 'Your Email'}
                </label>
                <input
                  type="email"
                  value={registrationEmail}
                  onChange={(e) => setRegistrationEmail(e.target.value)}
                  placeholder={language === 'zh' ? '请输入邮箱' : language === 'ja' ? 'メールアドレスを入力' : 'Enter your email'}
                  required
                />
                
                {(userName || userEmail) && (
                  <div className="saved-info-container">
                    <p className="saved-info-note">
                      {language === 'zh' ? '✓ 您的信息已保存，方便下次使用' : 
                       language === 'ja' ? '✓ 情報が保存されています' : 
                       '✓ Your info is saved for convenience'}
                    </p>
                    <button 
                      type="button"
                      className="clear-info-button"
                      onClick={() => {
                        localStorage.removeItem('sanshi_user_email');
                        localStorage.removeItem('sanshi_user_name');
                        setUserEmail(null);
                        setUserName(null);
                        setRegistrationName('');
                        setRegistrationEmail('');
                      }}
                    >
                      {language === 'zh' ? '清除保存的信息' : 
                       language === 'ja' ? '保存情報をクリア' : 
                       'Clear saved info'}
                    </button>
                  </div>
                )}
                
                <div className="form-actions">
                  <button
                    className="submit-button"
                    onClick={submitRegistration}
                    disabled={!registrationName.trim() || !registrationEmail.trim()}
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