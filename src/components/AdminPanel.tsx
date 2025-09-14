import React, { useState, useEffect } from 'react';
import { useI18n } from '../i18n/useI18n';
import type { SessionDay, ClassSession } from '../types/calendar';
import { 
  fetchSessions, 
  updateSessions, 
  addSession, 
  deleteSession,
  checkAdminPassword 
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkAdminPassword(password)) {
      setIsAuthenticated(true);
    } else {
      alert(language === 'zh' ? '密码错误' : language === 'ja' ? 'パスワードが間違っています' : 'Incorrect password');
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
      alert(language === 'zh' ? '保存失败' : language === 'ja' ? '保存に失敗しました' : 'Failed to save');
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
      alert(language === 'zh' ? '添加失败' : language === 'ja' ? '追加に失敗しました' : 'Failed to add');
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
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      {loading && <div className="loading">Loading...</div>}

      <div className="admin-content">
        <button 
          className="add-session-button"
          onClick={() => setShowNewSession(true)}
          disabled={loading}
        >
          {language === 'zh' ? '+ 添加新课程' : language === 'ja' ? '+ 新しいセッションを追加' : '+ Add New Session'}
        </button>

        {showNewSession && (
          <SessionEditor
            session={null}
            onSave={handleAddSession}
            onCancel={() => setShowNewSession(false)}
            language={language}
          />
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
                  <h3>{new Date(session.date).toLocaleDateString()}</h3>
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
  const [classes, setClasses] = useState<ClassSession[]>(session?.classes || [
    {
      id: '',
      date: '',
      type: 'intermediate',
      startTime: '14:00',
      duration: 50,
      maxParticipants: 15,
      instructor: '田中先生',
      registrations: []
    },
    {
      id: '',
      date: '',
      type: 'experience',
      startTime: '15:00',
      duration: 50,
      maxParticipants: 20,
      instructor: '田中先生',
      registrations: []
    },
    {
      id: '',
      date: '',
      type: 'beginner',
      startTime: '16:00',
      duration: 50,
      maxParticipants: 15,
      instructor: '田中先生',
      registrations: []
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const sessionId = session?.id || `session-${date}`;
    const updatedClasses = classes.map((cls) => ({
      ...cls,
      id: cls.id || `class-${date}-${cls.startTime}`,
      date: date
    }));

    onSave({
      id: sessionId,
      date,
      location,
      classes: updatedClasses
    });
  };

  const updateClass = (index: number, field: keyof ClassSession, value: any) => {
    const updated = [...classes];
    updated[index] = { ...updated[index], [field]: value };
    setClasses(updated);
  };

  return (
    <form onSubmit={handleSubmit} className="session-editor">
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
