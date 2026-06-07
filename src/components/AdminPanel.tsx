import React, { useState, useEffect } from 'react';
import { useI18n } from '../i18n/useI18n';
import type { SessionDay, ClassSession } from '../types/calendar';
import {
  fetchSessions,
  saveSessions,
  deleteRegistrationsBySessionId,
  checkAdminPassword,
  updateAdminPassword,
  type City
} from '../services/jsonBinService';
import { generateSessionId, generateClassId } from '../utils/idGenerator';
import './AdminPanel.css';

interface AdminPanelProps {
  onClose: () => void;
  onSessionsUpdate: () => void | Promise<void>;
  city?: City;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onSessionsUpdate, city = 'shanghai' }) => {
  const { t, language } = useI18n();
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

  // Get city-specific localStorage key for admin session
  const getAdminSessionKey = () => {
    if (city === 'shanghai') {
      return 'sanshi_admin_session'; // Backward compatibility
    }
    return `sanshi_admin_session_${city}`;
  };

  // Check for existing admin session on component mount
  useEffect(() => {
    const sessionKey = getAdminSessionKey();
    const adminSession = localStorage.getItem(sessionKey);
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
        localStorage.removeItem(sessionKey);
      }
    }
  }, [city]);

  useEffect(() => {
    if (isAuthenticated) {
      loadSessions();
    }
  }, [isAuthenticated]);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const data = await fetchSessions(city);
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
      const isValid = await checkAdminPassword(password, city);
      if (isValid) {
        setIsAuthenticated(true);
        
        // Save admin session to localStorage with 24-hour expiry (city-specific)
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 24);
        const sessionKey = getAdminSessionKey();
        localStorage.setItem(sessionKey, JSON.stringify({
          authenticated: true,
          expiry: expiry.toISOString()
        }));
        setSessionExpiry(expiry);
      } else {
        alert(t.admin.incorrectPassword);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(t.admin.loginFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSession = async (session: SessionDay) => {
    setLoading(true);
    try {
      const updatedSessions = sessions.map(s => s.id === session.id ? session : s);
      // Direct save - no fetch needed, AdminPanel already has the data
      const success = await saveSessions(updatedSessions, city);
      
      if (success) {
        setSessions(updatedSessions);
        setEditingSession(null);
        // Notify parent with updated data (no need to refetch)
        await onSessionsUpdate();
        alert(t.admin.saved);
      }
    } catch (error) {
      console.error('Error saving session:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`${t.admin.saveFailed}: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSession = async (session: SessionDay) => {
    setLoading(true);
    try {
      // Add to local state first
      const updatedSessions = [...sessions, session].sort((a, b) => a.date.localeCompare(b.date));
      
      // Direct save - no fetch needed, we already have all sessions
      const success = await saveSessions(updatedSessions, city);
      
      if (success) {
        setSessions(updatedSessions);
        setShowNewSession(false);
        // Notify parent with updated data (no need to refetch)
        await onSessionsUpdate();
        alert(t.admin.added);
      }
    } catch (error) {
      console.error('Error adding session:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`${t.admin.addFailed}: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    const confirmText = t.admin.confirmDelete;
    
    if (confirm(confirmText)) {
      setLoading(true);
      try {
        // Find session to delete and get its class IDs
        const sessionToDelete = sessions.find(s => s.id === sessionId);
        const classIds = sessionToDelete?.classes.map(cls => cls.id) || [];
        
        // Update local state first
        const updatedSessions = sessions.filter(s => s.id !== sessionId);
        
        // Delete related registrations first
        if (sessionToDelete) {
          await deleteRegistrationsBySessionId(sessionId, classIds, city);
        }
        
        // Then save updated sessions
        const success = await saveSessions(updatedSessions, city);
        
        if (success) {
          setSessions(updatedSessions);
          // Notify parent with updated data (no need to refetch)
          await onSessionsUpdate();
          alert(t.admin.deleteSuccess || 'Session deleted successfully');
        } else {
          alert(t.admin.deleteFailed || 'Failed to delete session. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting session:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        alert(`${t.admin.deleteFailed || 'Delete failed'}: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert(t.admin.passwordsDoNotMatch);
      return;
    }
    
    if (newPassword.length < 6) {
      alert(t.admin.passwordTooShort);
      return;
    }
    
    setLoading(true);
    try {
      const success = await updateAdminPassword(newPassword, city);
      if (success) {
        alert(t.admin.passwordUpdated);
        setShowPasswordChange(false);
        setNewPassword('');
        setConfirmPassword('');
      } else {
        alert(t.admin.passwordUpdateFailed);
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert(t.admin.passwordUpdateFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear admin session from localStorage (city-specific)
    const sessionKey = getAdminSessionKey();
    localStorage.removeItem(sessionKey);
    setIsAuthenticated(false);
    setPassword('');
    setSessionExpiry(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-panel">
        <div className="admin-header">
          <h2>{t.admin.teacherLogin}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.admin.enterPassword}
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
            {t.admin.login}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>{t.admin.sessionManagement}</h2>
        <div className="header-actions">
          <button className="logout-button" onClick={handleLogout}>
            {t.common.logout}
          </button>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
      </div>

      {/* Loading Overlay - prevents user interaction during API calls */}
      {loading && (
        <div className="admin-loading-overlay">
          <div className="admin-loading-spinner"></div>
          <div className="admin-loading-text">
            {t.common.loading || 'Processing...'}
          </div>
          <div className="admin-loading-hint">
            {language === 'zh' ? '请稍候，正在处理...' : 
             language === 'ja' ? 'お待ちください...' : 
             'Please wait...'}
          </div>
        </div>
      )}

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
            {t.admin.addNewSession}
          </button>
          <button 
            className="change-password-button"
            onClick={() => setShowPasswordChange(true)}
            disabled={loading}
          >
            {t.admin.changePassword}
          </button>
        </div>

        {showNewSession && (
          <SessionEditor
            session={null}
            onSave={handleAddSession}
            onCancel={() => setShowNewSession(false)}
            language={language}
            city={city}
          />
        )}

        {showPasswordChange && (
          <div className="password-change-modal">
            <div className="modal-content">
              <h3>{t.admin.changePassword}</h3>
              <form onSubmit={handlePasswordChange}>
                <div className="form-group">
                  <label>{t.admin.newPassword}</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="form-group">
                  <label>{t.admin.confirmPassword}</label>
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
                    {t.common.confirm}
                  </button>
                  <button type="button" onClick={() => {
                    setShowPasswordChange(false);
                    setNewPassword('');
                    setConfirmPassword('');
                  }}>
                    {t.common.cancel}
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
                  city={city}
                />
              ) : (
                <div className="session-display">
                  <h3>
                    {(() => {
                      // Parse date string to avoid timezone issues
                      const [year, month, day] = session.date.split('-').map(Number);
                      return new Date(year, month - 1, day).toLocaleDateString();
                    })()}
                    {session.isSpecialEvent && (
                      <span className="event-badge">
                        {t.sessions.specialEvent}
                      </span>
                    )}
                  </h3>
                  {session.isSpecialEvent ? (
                    <>
                      <h4>{session.eventTitle}</h4>
                      <p>{session.eventDescription}</p>
                      <p>
                        {t.common.time}： 
                        {session.eventStartTime} - {session.eventEndTime}
                      </p>
                    </>
                  ) : (
                    <p>{session.classes.length} {t.admin.classes}</p>
                  )}
                  <p>{session.location}</p>
                  <div className="session-actions">
                    <button 
                      onClick={() => setEditingSession(session)}
                      disabled={loading}
                    >
                      {t.common.edit}
                    </button>
                    <button 
                      onClick={() => handleDeleteSession(session.id)} 
                      className="delete-button"
                      disabled={loading}
                    >
                      {t.common.delete}
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

const CITY_ADDRESS_INDEX: Record<City, number> = {
  shanghai: 0,
  beijing: 1,
  tokyo: 2
};

// Session Editor Component
const SessionEditor: React.FC<{
  session: SessionDay | null;
  onSave: (session: SessionDay) => void;
  onCancel: () => void;
  language: string;
  city?: City;
}> = ({ session, onSave, onCancel, language, city = 'shanghai' }) => {
  const { t } = useI18n();
  const [date, setDate] = useState(session?.date || '');
  const getDefaultLocation = () => {
    return t.contact.location.address[CITY_ADDRESS_INDEX[city]] || '';
  };
  const [location, setLocation] = useState(session?.location || getDefaultLocation());
  const [isSpecialEvent, setIsSpecialEvent] = useState(session?.isSpecialEvent || false);
  const [eventTitle, setEventTitle] = useState(session?.eventTitle || '');
  const [eventDescription, setEventDescription] = useState(session?.eventDescription || '');
  const [eventStartTime, setEventStartTime] = useState(session?.eventStartTime || '14:00');
  const [eventEndTime, setEventEndTime] = useState(session?.eventEndTime || '17:00');
  const [eventMaxParticipants, setEventMaxParticipants] = useState(session?.eventMaxParticipants || 50);
  
  // Get today's date in YYYY-MM-DD format for min date restriction
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // For new sessions, restrict to today or future dates
  // For editing existing sessions, allow any date
  const minDate = session === null ? getTodayDate() : undefined;
  
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

  const getDefaultClassTitle = (classIndex: number) => {
    switch (language) {
      case 'zh':
        return `第${classIndex}节课`;
      case 'ja':
        return `${classIndex}コマ目`;
      case 'en':
      default:
        return `Class ${classIndex}`;
    }
  };

  const getNextClassStartTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return '14:00';
    }
    const totalMinutes = (hours * 60 + minutes + 60) % (24 * 60);
    const nextHours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
    const nextMinutes = String(totalMinutes % 60).padStart(2, '0');
    return `${nextHours}:${nextMinutes}`;
  };

  const createDefaultClass = (classIndex: number, startTime: string): ClassSession => ({
    id: '',
    date: '',
    title: getDefaultClassTitle(classIndex),
    type: 'intermediate',
    startTime,
    duration: 50,
    maxParticipants: 20,
    instructor: getDefaultInstructor()
  });
  
  const [classes, setClasses] = useState<ClassSession[]>(
    session?.classes?.length
      ? session.classes.map((cls, index) => ({
          ...cls,
          title: cls.title || getDefaultClassTitle(index + 1)
        }))
      : [createDefaultClass(1, '14:00'), createDefaultClass(2, '15:00'), createDefaultClass(3, '16:00')]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const sessionId = session?.id || generateSessionId(date);
    
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
        id: cls.id || generateClassId(date, cls.startTime),
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

  const addClass = () => {
    const lastClass = classes[classes.length - 1];
    const nextStartTime = lastClass?.startTime ? getNextClassStartTime(lastClass.startTime) : '14:00';
    const newClass = createDefaultClass(classes.length + 1, nextStartTime);
    setClasses((prev) => [...prev, newClass]);
  };

  const removeClass = (index: number) => {
    if (classes.length <= 1) {
      return;
    }
    setClasses((prev) => prev.filter((_, classIndex) => classIndex !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="session-editor">
      <div className="form-group">
        <label>{t.common.type}</label>
        <div className="session-type-selector">
          <label className="radio-label">
            <input
              type="radio"
              name="sessionType"
              checked={!isSpecialEvent}
              onChange={() => setIsSpecialEvent(false)}
            />
            <span>{t.admin.regularClasses}</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="sessionType"
              checked={isSpecialEvent}
              onChange={() => setIsSpecialEvent(true)}
            />
            <span>{t.admin.specialEvent}</span>
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>
          {t.common.date}
          {session === null && (
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
              ({language === 'zh' ? '只能选择今天或未来的日期' : 
                language === 'ja' ? '今日以降の日付のみ選択可能' : 
                'Only today or future dates'})
            </span>
          )}
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={minDate}
          required
        />
      </div>

      <div className="form-group">
        <label>{t.common.location}</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>

      {isSpecialEvent ? (
        <>
          <h4>{t.admin.eventInfo}</h4>
          
          <div className="form-group">
            <label>{t.admin.eventName}</label>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              required
              placeholder={t.admin.eventNamePlaceholder}
            />
          </div>

          <div className="form-group">
            <label>{t.admin.eventDescription}</label>
            <textarea
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              rows={3}
              placeholder={t.admin.eventDescriptionPlaceholder}
            />
          </div>

          <div className="form-group">
            <label>{t.admin.startTime}</label>
            <input
              type="time"
              value={eventStartTime}
              onChange={(e) => setEventStartTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>{t.admin.endTime}</label>
            <input
              type="time"
              value={eventEndTime}
              onChange={(e) => setEventEndTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>{t.admin.maxParticipants}</label>
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
          <h4>{t.admin.classSchedule}</h4>
          
          {classes.map((cls, index) => (
            <div key={index} className="class-editor">
              <input
                type="text"
                value={cls.title || ''}
                onChange={(e) => updateClass(index, 'title', e.target.value)}
                placeholder={t.admin.classContent}
                required
              />
              
              <input
                type="time"
                value={cls.startTime}
                onChange={(e) => updateClass(index, 'startTime', e.target.value)}
                required
              />
              
              <input
                type="number"
                value={cls.maxParticipants}
                onChange={(e) => updateClass(index, 'maxParticipants', parseInt(e.target.value) || 1)}
                min="1"
                max="50"
                required
              />
              
              <input
                type="text"
                value={cls.instructor}
                onChange={(e) => updateClass(index, 'instructor', e.target.value)}
                placeholder={language === 'zh' ? '讲师' : language === 'ja' ? '講師' : 'Instructor'}
              />

              <button
                type="button"
                className="class-delete-button"
                onClick={() => removeClass(index)}
                disabled={classes.length <= 1}
                aria-label={t.admin.removeClass}
                title={t.admin.removeClass}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18" />
                  <path d="M8 6V4h8v2" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                </svg>
              </button>
            </div>
          ))}

          <button
            type="button"
            className="class-add-button"
            onClick={addClass}
          >
            {t.admin.addClass}
          </button>
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
