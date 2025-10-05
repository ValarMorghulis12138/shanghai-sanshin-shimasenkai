import { useState, useEffect } from 'react';
import type { Registration, ClassSessionWithRegistrations } from '../types/calendar';
import { addRegistration, deleteRegistration } from '../services/jsonBinService';
import { generateRegistrationId } from '../utils/idGenerator';

export const useRegistration = (
  reloadData: () => Promise<void>,
  syncFromLocalStorage?: () => Promise<void>
) => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userColor, setUserColor] = useState<string>('#E53E3E');
  const [loading, setLoading] = useState(false);

  // Load user info from localStorage on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('sanshi_user_email');
    const savedName = localStorage.getItem('sanshi_user_name');
    const savedColor = localStorage.getItem('sanshi_user_color');
    
    if (savedEmail) setUserEmail(savedEmail);
    if (savedName) setUserName(savedName);
    if (savedColor) setUserColor(savedColor);
  }, []);

  const submitRegistration = async (
    sessionId: string,
    name: string,
    email: string,
    color: string,
    onSuccess: () => void,
    onError: (message: string) => void
  ) => {
    if (!name.trim() || !email.trim()) return;

    const newRegistration: Registration = {
      id: generateRegistrationId(),
      sessionId,
      name: name.trim(),
      email: email.trim(),
      color,
      timestamp: Date.now()
    };
    
    // Save user info to localStorage
    localStorage.setItem('sanshi_user_email', email.trim());
    localStorage.setItem('sanshi_user_name', name.trim());
    localStorage.setItem('sanshi_user_color', color);
    setUserEmail(email.trim());
    setUserName(name.trim());
    setUserColor(color);

    setLoading(true);
    try {
      const success = await addRegistration(newRegistration);
      
      if (success) {
        // Use syncFromLocalStorage if available (avoids GET calls)
        // Otherwise fallback to reloadData
        if (syncFromLocalStorage) {
          await syncFromLocalStorage();
        } else {
          await reloadData();
        }
        onSuccess();
      } else {
        onError('Failed to register');
      }
    } catch (error) {
      console.error('Registration error:', error);
      onError('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const cancelRegistration = async (
    registrationId: string,
    onSuccess: () => void,
    onError: (message: string) => void
  ) => {
    setLoading(true);
    try {
      const success = await deleteRegistration(registrationId);
      
      if (success) {
        // Use syncFromLocalStorage if available (avoids GET calls)
        // Otherwise fallback to reloadData
        if (syncFromLocalStorage) {
          await syncFromLocalStorage();
        } else {
          await reloadData();
        }
        onSuccess();
      } else {
        onError('Failed to cancel registration');
      }
    } catch (error) {
      console.error('Cancel registration error:', error);
      onError('An error occurred while cancelling');
    } finally {
      setLoading(false);
    }
  };

  const checkUserRegistration = (classSession: ClassSessionWithRegistrations): Registration | null => {
    if (!userEmail) return null;
    return classSession.registrations.find(reg => reg.email === userEmail) || null;
  };

  const clearUserInfo = () => {
    localStorage.removeItem('sanshi_user_email');
    localStorage.removeItem('sanshi_user_name');
    localStorage.removeItem('sanshi_user_color');
    setUserEmail(null);
    setUserName(null);
    setUserColor('#E53E3E');
  };

  return {
    userEmail,
    userName,
    userColor,
    loading,
    submitRegistration,
    cancelRegistration,
    checkUserRegistration,
    clearUserInfo
  };
};

