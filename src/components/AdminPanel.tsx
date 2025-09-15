import React, { useState, useEffect } from 'react';
import { useI18n } from '../i18n/useI18n';
import type { SessionDay, ClassSession } from '../types/calendar';
import { 
  fetchSessions, 
  updateSessions, 
  addSession, 
  deleteSession,
  checkAdminPassword,
  updateAdminPassword 
} from '../services/jsonBinService';
import './AdminPanel.css';

interface AdminPanelProps {
  onClose: () => void;
  onSessionsUpdate: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onSessionsUpdate }) => {
  const { language } = useI18n();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [sessions, setSessions] = useState<SessionDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingSession, setEditingSession] = useState<SessionDay | null>(null);
  const [showNewSession, setShowNewSession] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null);

  // Check for existing admin session on component mount
  useEffect(() => {
    const adminSession = localStorage.getItem('sanshi_admin_session');
    if (adminSession) {
      const sessionData = JSON.parse(adminSession);
      const sessionExpiry = new Date(sessionData.expiry);
      const now = new Date();
      
      // Check if session is still valid (24 hours)
      if (sessionExpiry > now) {
        setIsAuthenticated(true);
        setSessionExpiry(sessionExpiry);
      } else {
        // Session expired, clear it
        localStorage.removeItem('sanshi_admin_session');
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadSessions();
    }
  }, [isAuthenticated]);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const data = await fetchSessions();
      setSessions(data);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isValid = await checkAdminPassword(password);
      if (isValid) {
        setIsAuthenticated(true);
        
        // Save admin session to localStorage with 24-hour expiry
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 24);
        localStorage.setItem('sanshi_admin_session', JSON.stringify({
          authenticated: true,
          expiry: expiry.toISOString()
        }));
        setSessionExpiry(expiry);
      } else {
        alert(language === 'zh' ? '密码错误' : language === 'ja' ? 'パスワードが間違っています' : 'Incorrect password');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(language === 'zh' ? '登录失败，请重试' : language === 'ja' ? 'ログインに失敗しました' : 'Login failed, please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSession = async (session: SessionDay) => {
    setLoading(true);
    try {
      const updatedSessions = sessions.map(s => s.id === session.id ? session : s);
      const success = await updateSessions(updatedSessions);
      
      if (success) {
        setSessions(updatedSessions);
        setEditingSession(null);
        onSessionsUpdate();
        alert(language === 'zh' ? '保存成功' : language === 'ja' ? '保存しました' : 'Saved successfully');
      }
    } catch (error) {
      console.error('Error saving session:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(language === 'zh' ? `保存失败: ${errorMessage}` : language === 'ja' ? `保存に失敗しました: ${errorMessage}` : `Failed to save: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSession = async (session: SessionDay) => {
    setLoading(true);
    try {
      const success = await addSession(session);
      
      if (success) {
        await loadSessions();
        setShowNewSession(false);
        onSessionsUpdate();
        alert(language === 'zh' ? '添加成功' : language === 'ja' ? '追加しました' : 'Added successfully');
      }
    } catch (error) {
      console.error('Error adding session:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(language === 'zh' ? `添加失败: ${errorMessage}` : language === 'ja' ? `追加に失敗しました: ${errorMessage}` : `Failed to add: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    const confirmText = language === 'zh' ? '确定要删除这个课程吗？' : 
                       language === 'ja' ? 'このセッションを削除してもよろしいですか？' : 
                       'Are you sure you want to delete this session?';
    
    if (confirm(confirmText)) {
      setLoading(true);
      try {
        const success = await deleteSession(sessionId);
        
        if (success) {
          await loadSessions();
          onSessionsUpdate();
        }
      } catch (error) {
        console.error('Error deleting session:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert(language === 'zh' ? '两次输入的密码不一致' : language === 'ja' ? 'パスワードが一致しません' : 'Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      alert(language === 'zh' ? '密码至少需要6个字符' : language === 'ja' ? 'パスワードは6文字以上必要です' : 'Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    try {
      const success = await updateAdminPassword(newPassword);
      if (success) {
        alert(language === 'zh' ? '密码修改成功' : language === 'ja' ? 'パスワードが更新されました' : 'Password updated successfully');
        setShowPasswordChange(false);
        setNewPassword('');
        setConfirmPassword('');
      } else {
        alert(language === 'zh' ? '密码修改失败' : language === 'ja' ? 'パスワードの更新に失敗しました' : 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert(language === 'zh' ? '密码修改失败' : language === 'ja' ? 'パスワードの更新に失敗しました' : 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear admin session from localStorage
    localStorage.removeItem('sanshi_admin_session');
    setIsAuthenticated(false);
    setPassword('');
    setSessionExpiry(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-panel">
        <div className="admin-header">
          <h2>{language === 'zh' ? '教师登录' : language === 'ja' ? '先生ログイン' : 'Teacher Login'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={language === 'zh' ? '请输入密码' : language === 'ja' ? 'パスワードを入力' : 'Enter password'}
              autoFocus
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
          <button type="submit" disabled={!password}>
            {language === 'zh' ? '登录' : language === 'ja' ? 'ログイン' : 'Login'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>{language === 'zh' ? '课程管理' : language === 'ja' ? 'セッション管理' : 'Session Management'}</h2>
        <div className="header-actions">
          <button className="logout-button" onClick={handleLogout}>
            {language === 'zh' ? '退出登录' : language === 'ja' ? 'ログアウト' : 'Logout'}
          </button>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
      </div>

      {loading && <div className="loading">Loading...</div>}

      {sessionExpiry && (
        <div className="session-info">
          <small>
            {language === 'zh' 
              ? `会话将在 ${sessionExpiry.toLocaleString()} 过期` 
              : language === 'ja' 
              ? `セッションは ${sessionExpiry.toLocaleString()} に期限切れになります` 
              : `Session expires at ${sessionExpiry.toLocaleString()}`}
          </small>
        </div>
      )}

      <div className="admin-content">
        <div className="admin-actions">
          <button 
            className="add-session-button"
            onClick={() => setShowNewSession(true)}
            disabled={loading}
          >
            {language === 'zh' ? '+ 添加新课程' : language === 'ja' ? '+ 新しいセッションを追加' : '+ Add New Session'}
          </button>
          <button 
            className="change-password-button"
            onClick={() => setShowPasswordChange(true)}
            disabled={loading}
          >
            {language === 'zh' ? '修改密码' : language === 'ja' ? 'パスワード変更' : 'Change Password'}
          </button>
        </div>

        {showNewSession && (
          <SessionEditor
            session={null}
            onSave={handleAddSession}
            onCancel={() => setShowNewSession(false)}
            language={language}
          />
        )}

        {showPasswordChange && (
          <div className="password-change-modal">
            <div className="modal-content">
              <h3>{language === 'zh' ? '修改密码' : language === 'ja' ? 'パスワード変更' : 'Change Password'}</h3>
              <form onSubmit={handlePasswordChange}>
                <div className="form-group">
                  <label>{language === 'zh' ? '新密码' : language === 'ja' ? '新しいパスワード' : 'New Password'}</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="form-group">
                  <label>{language === 'zh' ? '确认密码' : language === 'ja' ? 'パスワード確認' : 'Confirm Password'}</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" disabled={loading}>
                    {language === 'zh' ? '确定' : language === 'ja' ? '確定' : 'Confirm'}
                  </button>
                  <button type="button" onClick={() => {
                    setShowPasswordChange(false);
                    setNewPassword('');
                    setConfirmPassword('');
                  }}>
                    {language === 'zh' ? '取消' : language === 'ja' ? 'キャンセル' : 'Cancel'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="sessions-list">
          {sessions.map(session => (
            <div key={session.id} className="session-item">
              {editingSession?.id === session.id ? (
                <SessionEditor
                  session={session}
                  onSave={handleSaveSession}
                  onCancel={() => setEditingSession(null)}
                  language={language}
                />
              ) : (
                <div className="session-display">
                  <h3>
                    {new Date(session.date).toLocaleDateString()}
                    {session.isSpecialEvent && (
                      <span className="event-badge">
                        {language === 'zh' ? '特殊活动' : language === 'ja' ? '特別イベント' : 'Special Event'}
                      </span>
                    )}
                  </h3>
                  {session.isSpecialEvent ? (
                    <>
                      <h4>{session.eventTitle}</h4>
                      <p>{session.eventDescription}</p>
                      <p>
                        {language === 'zh' ? '时间：' : language === 'ja' ? '時間：' : 'Time: '}
                        {session.eventStartTime} - {session.eventEndTime}
                      </p>
                    </>
                  ) : (
                    <p>{session.classes.length} {language === 'zh' ? '节课' : language === 'ja' ? 'クラス' : 'classes'}</p>
                  )}
                  <p>{session.location}</p>
                  <div className="session-actions">
                    <button onClick={() => setEditingSession(session)}>
                      {language === 'zh' ? '编辑' : language === 'ja' ? '編集' : 'Edit'}
                    </button>
                    <button onClick={() => handleDeleteSession(session.id)} className="delete-button">
                      {language === 'zh' ? '删除' : language === 'ja' ? '削除' : 'Delete'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Session Editor Component
const SessionEditor: React.FC<{
  session: SessionDay | null;
  onSave: (session: SessionDay) => void;
  onCancel: () => void;
  language: string;
}> = ({ session, onSave, onCancel, language }) => {
  const [date, setDate] = useState(session?.date || '');
  const [location, setLocation] = useState(session?.location || '酒友(sakatomo): 水城南路71号1F');
  const [isSpecialEvent, setIsSpecialEvent] = useState(session?.isSpecialEvent || false);
  const [eventTitle, setEventTitle] = useState(session?.eventTitle || '');
  const [eventDescription, setEventDescription] = useState(session?.eventDescription || '');
  const [eventStartTime, setEventStartTime] = useState(session?.eventStartTime || '14:00');
  const [eventEndTime, setEventEndTime] = useState(session?.eventEndTime || '17:00');
  const [eventMaxParticipants, setEventMaxParticipants] = useState(session?.eventMaxParticipants || 50);
  
  // Get default instructor name based on language
  const getDefaultInstructor = () => {
    switch (language) {
      case 'zh':
        return 'Keisuke老师';
      case 'ja':
        return 'Keisuke先生';
      case 'en':
      default:
        return 'Keisuke';
    }
  };
  
  const [classes, setClasses] = useState<ClassSession[]>(session?.classes || [
    {
      id: '',
      date: '',
      type: 'intermediate',
      startTime: '14:00',
      duration: 50,
      maxParticipants: 20,
      instructor: getDefaultInstructor()
    },
    {
      id: '',
      date: '',
      type: 'experience',
      startTime: '15:00',
      duration: 50,
      maxParticipants: 20,
      instructor: getDefaultInstructor()
    },
    {
      id: '',
      date: '',
      type: 'beginner',
      startTime: '16:00',
      duration: 50,
      maxParticipants: 20,
      instructor: getDefaultInstructor()
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const sessionId = session?.id || `session-${date}`;
    
    if (isSpecialEvent) {
      // 特殊活动不需要classes
      onSave({
        id: sessionId,
        date,
        location,
        classes: [],
        isSpecialEvent: true,
        eventTitle,
        eventDescription,
        eventStartTime,
        eventEndTime,
        eventMaxParticipants
      });
    } else {
      // 常规组课
      const updatedClasses = classes.map((cls) => ({
        ...cls,
        id: cls.id || `class-${date}-${cls.startTime}`,
        date: date
      }));

      onSave({
        id: sessionId,
        date,
        location,
        classes: updatedClasses,
        isSpecialEvent: false
      });
    }
  };

  const updateClass = (index: number, field: keyof ClassSession, value: string | number) => {
    const updated = [...classes];
    updated[index] = { ...updated[index], [field]: value };
    setClasses(updated);
  };

  return (
    <form onSubmit={handleSubmit} className="session-editor">
      <div className="form-group">
        <label>{language === 'zh' ? '类型' : language === 'ja' ? 'タイプ' : 'Type'}</label>
        <div className="session-type-selector">
          <label className="radio-label">
            <input
              type="radio"
              name="sessionType"
              checked={!isSpecialEvent}
              onChange={() => setIsSpecialEvent(false)}
            />
            <span>{language === 'zh' ? '常规组课' : language === 'ja' ? '通常クラス' : 'Regular Classes'}</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="sessionType"
              checked={isSpecialEvent}
              onChange={() => setIsSpecialEvent(true)}
            />
            <span>{language === 'zh' ? '特殊活动' : language === 'ja' ? '特別イベント' : 'Special Event'}</span>
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>{language === 'zh' ? '日期' : language === 'ja' ? '日付' : 'Date'}</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>{language === 'zh' ? '地点' : language === 'ja' ? '場所' : 'Location'}</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>

      {isSpecialEvent ? (
        <>
          <h4>{language === 'zh' ? '活动信息' : language === 'ja' ? 'イベント情報' : 'Event Information'}</h4>
          
          <div className="form-group">
            <label>{language === 'zh' ? '活动名称' : language === 'ja' ? 'イベント名' : 'Event Name'}</label>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              required
              placeholder={language === 'zh' ? '例如：沖縄県人会' : language === 'ja' ? '例：沖縄県人会' : 'e.g. Okinawa Kenjinkai'}
            />
          </div>

          <div className="form-group">
            <label>{language === 'zh' ? '活动描述' : language === 'ja' ? 'イベント説明' : 'Event Description'}</label>
            <textarea
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              rows={3}
              placeholder={language === 'zh' ? '活动详情...' : language === 'ja' ? 'イベントの詳細...' : 'Event details...'}
            />
          </div>

          <div className="form-group">
            <label>{language === 'zh' ? '开始时间' : language === 'ja' ? '開始時間' : 'Start Time'}</label>
            <input
              type="time"
              value={eventStartTime}
              onChange={(e) => setEventStartTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>{language === 'zh' ? '结束时间' : language === 'ja' ? '終了時間' : 'End Time'}</label>
            <input
              type="time"
              value={eventEndTime}
              onChange={(e) => setEventEndTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>{language === 'zh' ? '最大参与人数' : language === 'ja' ? '最大参加人数' : 'Max Participants'}</label>
            <input
              type="number"
              value={eventMaxParticipants}
              onChange={(e) => setEventMaxParticipants(parseInt(e.target.value) || 1)}
              min="1"
              max="200"
              required
            />
          </div>
        </>
      ) : (
        <>
          <h4>{language === 'zh' ? '课程安排' : language === 'ja' ? 'クラススケジュール' : 'Class Schedule'}</h4>
          
          {classes.map((cls, index) => (
            <div key={index} className="class-editor">
              <select
                value={cls.type}
                onChange={(e) => updateClass(index, 'type', e.target.value)}
              >
                <option value="intermediate">
                  {language === 'zh' ? '中高级' : language === 'ja' ? '民謡/早弾き' : 'Intermediate'}
                </option>
                <option value="experience">
                  {language === 'zh' ? '体验' : language === 'ja' ? '体験' : 'Experience'}
                </option>
                <option value="beginner">
                  {language === 'zh' ? '初级' : language === 'ja' ? 'ゆるり' : 'Beginner'}
                </option>
              </select>
              
              <input
                type="time"
                value={cls.startTime}
                onChange={(e) => updateClass(index, 'startTime', e.target.value)}
              />
              
              <input
                type="number"
                value={cls.maxParticipants}
                onChange={(e) => updateClass(index, 'maxParticipants', parseInt(e.target.value))}
                min="1"
                max="50"
              />
              
              <input
                type="text"
                value={cls.instructor}
                onChange={(e) => updateClass(index, 'instructor', e.target.value)}
                placeholder={language === 'zh' ? '讲师' : language === 'ja' ? '講師' : 'Instructor'}
              />
            </div>
          ))}
        </>
      )}

      <div className="form-actions">
        <button type="submit">
          {language === 'zh' ? '保存' : language === 'ja' ? '保存' : 'Save'}
        </button>
        <button type="button" onClick={onCancel}>
          {language === 'zh' ? '取消' : language === 'ja' ? 'キャンセル' : 'Cancel'}
        </button>
      </div>
    </form>
  );
};

export default AdminPanel;
