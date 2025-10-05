import { useState, useEffect, useCallback, useRef } from 'react';
import type { SessionDayWithRegistrations } from '../types/calendar';
import {
  fetchSessions,
  fetchRegistrations
} from '../services/jsonBinService';

// Helper function to sort sessions by date (oldest first)
const sortSessionsByDate = (sessions: SessionDayWithRegistrations[]) => {
  return [...sessions].sort((a, b) => {
    // Direct string comparison works for "YYYY-MM-DD" format
    // This avoids timezone issues with Date parsing
    return a.date.localeCompare(b.date); // ascending order (oldest to newest)
  });
};

export const useSessionData = () => {
  const [sessions, setSessions] = useState<SessionDayWithRegistrations[]>([]);
  const [loading, setLoading] = useState(true);
  const isInitialized = useRef(false); // Prevent double initialization in StrictMode

  const loadData = useCallback(async () => {
    setLoading(true);
    
    try {
      // Fetch both in parallel (only 2 API calls instead of 3)
      const [sessionsData, registrationsData] = await Promise.all([
        fetchSessions(), // This also handles initialization if needed
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
      
      // Sort sessions by date before setting state
      const sortedData = sortSessionsByDate(mergedData);
      setSessions(sortedData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Prevent double initialization in React.StrictMode (dev mode)
    if (isInitialized.current) {
      return;
    }
    
    isInitialized.current = true;
    loadData();
  }, [loadData]);

  // Function to directly update sessions without fetching
  const updateSessionsDirectly = useCallback((newSessions: SessionDayWithRegistrations[]) => {
    // Sort before setting
    const sortedSessions = sortSessionsByDate(newSessions);
    setSessions(sortedSessions);
  }, []);

  // Function to sync from localStorage (after AdminPanel updates)
  const syncFromLocalStorage = useCallback(async () => {
    try {
      // Read updated sessions from localStorage (already updated by AdminPanel)
      const localSessions = localStorage.getItem('sanshi_sessions');
      const localRegistrations = localStorage.getItem('sanshi_registrations');
      
      // Even if registrations is missing, we should still update sessions
      if (localSessions) {
        const sessionsData = JSON.parse(localSessions).filter((s: any) => s.id !== 'placeholder');
        const registrationsData = localRegistrations 
          ? JSON.parse(localRegistrations).filter((r: any) => r.id !== 'placeholder')
          : [];
        
        // Merge registrations into sessions (registrations might be empty array)
        const mergedData: SessionDayWithRegistrations[] = sessionsData.map((session: any) => ({
          ...session,
          classes: session.classes.map((classItem: any) => ({
            ...classItem,
            registrations: registrationsData.filter((reg: any) => reg.sessionId === classItem.id)
          })),
          eventRegistrations: session.isSpecialEvent 
            ? registrationsData.filter((reg: any) => reg.sessionId === session.id)
            : undefined
        }));
        
        // Sort sessions by date before setting state
        const sortedData = sortSessionsByDate(mergedData);
        setSessions(sortedData);
      } else {
        // localStorage sessions data missing, fallback to API fetch
        await loadData();
      }
    } catch (error) {
      console.error('Error syncing from localStorage:', error);
      // Fallback to full reload
      await loadData();
    }
  }, [loadData, sessions.length]);

  return { 
    sessions, 
    loading, 
    reloadData: loadData,
    updateSessionsDirectly,
    syncFromLocalStorage 
  };
};

// Note: Removed initializeDemoData separate call to avoid duplicate fetchSessions()
// fetchSessions() already handles initialization internally if bins are empty

