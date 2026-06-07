import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/useI18n';
import ColorPicker from '../ColorPicker';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, color: string) => void;
  sessionTitle: string;
  sessionTime: string;
  userName: string | null;
  userColor: string;
  onClearUserInfo: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  sessionTitle,
  sessionTime,
  userName,
  userColor,
  onClearUserInfo
}) => {
  const { t, language } = useI18n();
  const [name, setName] = useState('');
  const [color, setColor] = useState(userColor);

  useEffect(() => {
    if (isOpen) {
      setName(userName || '');
      setColor(userColor);
    }
  }, [isOpen, userName, userColor]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit(name, color);
    }
  };

  const handleClose = () => {
    setName(userName || '');
    setColor(userColor);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content simple-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>
          ×
        </button>
        
        <h2>{t.sessions.registration.classRegistration}</h2>
        <p className="modal-class-info">
          {sessionTitle} - {sessionTime}
        </p>
        
        <div className="simple-form">
          <label>{t.sessions.registration.yourName}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.sessions.registration.enterName}
            autoFocus
          />
          
          <ColorPicker 
            selectedColor={color}
            onColorChange={setColor}
            language={language}
          />
          
          {userName && (
            <div className="saved-info-container">
              <p className="saved-info-note">
                {t.sessions.registration.savedInfo}
              </p>
              <button 
                type="button"
                className="clear-info-button"
                onClick={onClearUserInfo}
              >
                {t.sessions.registration.clearSavedInfo}
              </button>
            </div>
          )}
          
          <div className="form-actions">
            <button
              className="submit-button"
              onClick={handleSubmit}
              disabled={!name.trim()}
            >
              {t.sessions.registration.confirmRegistration}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

