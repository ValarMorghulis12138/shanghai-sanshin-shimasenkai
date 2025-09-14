/**
 * Storage Service using JSONBin.io
 * Free tier: 10,000 requests/month
 * Works in China
 */

import type { SessionDay, Registration } from '../types/calendar';

// JSONBin configuration
const JSONBIN_BASE_URL = 'https://api.jsonbin.io/v3';

// These will be your bin IDs - you'll need to create them first
const SESSIONS_BIN_ID = import.meta.env.VITE_SESSIONS_BIN_ID || 'YOUR_SESSIONS_BIN_ID';
const REGISTRATIONS_BIN_ID = import.meta.env.VITE_REGISTRATIONS_BIN_ID || 'YOUR_REGISTRATIONS_BIN_ID';
const API_KEY = import.meta.env.VITE_JSONBIN_API_KEY || 'YOUR_API_KEY';

// For demo purposes, we'll use localStorage as fallback
const USE_LOCAL_STORAGE = !API_KEY || API_KEY === 'YOUR_API_KEY';


/**
 * Get data from JSONBin or localStorage
 */
async function getData(binId: string, dataType: 'sessions' | 'registrations'): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const stored = localStorage.getItem(`sanshi_${dataType}`);
    return stored ? JSON.parse(stored) : (dataType === 'sessions' ? [] : []);
  }

  try {
    const response = await fetch(`${JSONBIN_BASE_URL}/b/${binId}/latest`, {
      headers: {
        'X-Master-Key': API_KEY
      }
    });

    if (!response.ok) throw new Error('Failed to fetch data');
    
    const data = await response.json();
    return data.record;
  } catch (error) {
    console.error(`Error fetching ${dataType}:`, error);
    return dataType === 'sessions' ? [] : [];
  }
}

/**
 * Update data in JSONBin or localStorage
 */
async function updateData(binId: string, data: any, dataType: 'sessions' | 'registrations'): Promise<boolean> {
  if (USE_LOCAL_STORAGE) {
    localStorage.setItem(`sanshi_${dataType}`, JSON.stringify(data));
    return true;
  }

  try {
    const response = await fetch(`${JSONBIN_BASE_URL}/b/${binId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': API_KEY
      },
      body: JSON.stringify(data)
    });

    return response.ok;
  } catch (error) {
    console.error(`Error updating ${dataType}:`, error);
    return false;
  }
}

/**
 * Fetch all sessions
 */
export async function fetchSessions(): Promise<SessionDay[]> {
  const data = await getData(SESSIONS_BIN_ID, 'sessions');
  return Array.isArray(data) ? data : data.sessions || [];
}

/**
 * Fetch all registrations
 */
export async function fetchRegistrations(): Promise<Registration[]> {
  const data = await getData(REGISTRATIONS_BIN_ID, 'registrations');
  return Array.isArray(data) ? data : data.registrations || [];
}

/**
 * Add a new registration
 */
export async function addRegistration(registration: Registration): Promise<boolean> {
  const registrations = await fetchRegistrations();
  registrations.push(registration);
  
  return await updateData(REGISTRATIONS_BIN_ID, registrations, 'registrations');
}

/**
 * Update sessions (admin only)
 */
export async function updateSessions(sessions: SessionDay[]): Promise<boolean> {
  return await updateData(SESSIONS_BIN_ID, sessions, 'sessions');
}

/**
 * Add a new session (admin only)
 */
export async function addSession(session: SessionDay): Promise<boolean> {
  const sessions = await fetchSessions();
  sessions.push(session);
  sessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return await updateSessions(sessions);
}

/**
 * Delete a session (admin only)
 */
export async function deleteSession(sessionId: string): Promise<boolean> {
  const sessions = await fetchSessions();
  const filtered = sessions.filter(s => s.id !== sessionId);
  
  return await updateSessions(filtered);
}

/**
 * Check admin password (stored in localStorage for simplicity)
 */
export function checkAdminPassword(password: string): boolean {
  const storedHash = localStorage.getItem('sanshi_admin_hash');
  
  // First time setup - set the password
  if (!storedHash && password) {
    const hash = btoa(password); // Simple encoding for demo
    localStorage.setItem('sanshi_admin_hash', hash);
    return true;
  }
  
  return storedHash === btoa(password);
}

/**
 * Initialize demo data if empty
 */
export async function initializeDemoData(): Promise<void> {
  if (USE_LOCAL_STORAGE) {
    const sessions = await fetchSessions();
    if (sessions.length === 0) {
      const demoSessions: SessionDay[] = [
        {
          id: "session-2025-01-18",
          date: "2025-01-18",
          location: "酒友(sakatomo): 水城南路71号1F",
          classes: [
            {
              id: "class-2025-01-18-14:00",
              date: "2025-01-18",
              type: "intermediate",
              startTime: "14:00",
              duration: 50,
              maxParticipants: 15,
              instructor: "田中先生"
            },
            {
              id: "class-2025-01-18-15:00",
              date: "2025-01-18",
              type: "experience",
              startTime: "15:00",
              duration: 50,
              maxParticipants: 20,
              instructor: "田中先生"
            },
            {
              id: "class-2025-01-18-16:00",
              date: "2025-01-18",
              type: "beginner",
              startTime: "16:00",
              duration: 50,
              maxParticipants: 15,
              instructor: "田中先生"
            }
          ]
        }
      ];
      
      await updateSessions(demoSessions);
    }
  }
}
