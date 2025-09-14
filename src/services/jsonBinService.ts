/**
 * JSONBin.io Service - FREE cloud storage that works in China
 * This allows ALL users to share the same data!
 */

import type { SessionDay, Registration } from '../types/calendar';

// JSONBin.io configuration
const JSONBIN_BASE_URL = 'https://api.jsonbin.io/v3';

// DEMO ACCOUNT - Replace with your own for production!
// These are public bins for demo purposes
const DEMO_SESSIONS_BIN = '67806f83e41b4d34e461e9a3';
const DEMO_REGISTRATIONS_BIN = '67806f95ad19ca34f8e1f8e5';
const DEMO_API_KEY = '$2a$10$CmHPkNmQqzpJf4G.7u5pouH4PxuhsOh2NwJZ9vYzX5hhH8dV.6cVi';

// Use environment variables if available, otherwise use demo account
const SESSIONS_BIN_ID = import.meta.env.VITE_SESSIONS_BIN_ID || DEMO_SESSIONS_BIN;
const REGISTRATIONS_BIN_ID = import.meta.env.VITE_REGISTRATIONS_BIN_ID || DEMO_REGISTRATIONS_BIN;
const API_KEY = import.meta.env.VITE_JSONBIN_API_KEY || DEMO_API_KEY;


/**
 * Fetch data from JSONBin
 */
async function fetchFromBin(binId: string): Promise<any> {
  try {
    const response = await fetch(`${JSONBIN_BASE_URL}/b/${binId}/latest`, {
      headers: {
        'X-Access-Key': API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.record || [];
  } catch (error) {
    console.error('JSONBin fetch error:', error);
    // Fallback to localStorage if JSONBin fails
    const localKey = binId === SESSIONS_BIN_ID ? 'sanshi_sessions' : 'sanshi_registrations';
    const localData = localStorage.getItem(localKey);
    return localData ? JSON.parse(localData) : [];
  }
}

/**
 * Update data in JSONBin
 */
async function updateBin(binId: string, data: any): Promise<boolean> {
  try {
    const response = await fetch(`${JSONBIN_BASE_URL}/b/${binId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Key': API_KEY
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Failed to update: ${response.statusText}`);
    }

    // Also save to localStorage as backup
    const localKey = binId === SESSIONS_BIN_ID ? 'sanshi_sessions' : 'sanshi_registrations';
    localStorage.setItem(localKey, JSON.stringify(data));
    
    return true;
  } catch (error) {
    console.error('JSONBin update error:', error);
    return false;
  }
}


/**
 * Clean up old data (remove sessions older than 3 months)
 * This only runs when teachers update sessions, not on regular page loads
 */
function cleanupOldData(sessions: SessionDay[]): SessionDay[] {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  
  return sessions.filter(session => {
    const sessionDate = new Date(session.date);
    return sessionDate >= threeMonthsAgo;
  });
}

/**
 * Clean up old registrations (remove registrations for deleted sessions)
 */
async function cleanupOldRegistrations(validSessionIds: Set<string>): Promise<void> {
  const registrations = await fetchRegistrations();
  const validRegistrations = registrations.filter(reg => {
    // Keep registration if its session still exists
    return Array.from(validSessionIds).some(sessionId => 
      reg.sessionId.includes(sessionId.split('-').slice(0, 3).join('-'))
    );
  });
  
  // Only update if we removed some registrations
  if (validRegistrations.length < registrations.length) {
    await updateBin(REGISTRATIONS_BIN_ID, validRegistrations);
  }
}

/**
 * Public API Functions
 */

export async function fetchSessions(): Promise<SessionDay[]> {
  // Note: No cleanup here - cleanup only happens when teachers update sessions
  const data = await fetchFromBin(SESSIONS_BIN_ID);
  
  // If empty, initialize with demo data
  if (!data || data.length === 0) {
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
            instructor: "田中先生",
            registrations: []
          },
          {
            id: "class-2025-01-18-15:00",
            date: "2025-01-18",
            type: "experience",
            startTime: "15:00",
            duration: 50,
            maxParticipants: 20,
            instructor: "田中先生",
            registrations: []
          },
          {
            id: "class-2025-01-18-16:00",
            date: "2025-01-18",
            type: "beginner",
            startTime: "16:00",
            duration: 50,
            maxParticipants: 15,
            instructor: "田中先生",
            registrations: []
          }
        ]
      }
    ];
    
    await updateBin(SESSIONS_BIN_ID, demoSessions);
    return demoSessions;
  }
  
  return data;
}

export async function fetchRegistrations(): Promise<Registration[]> {
  return await fetchFromBin(REGISTRATIONS_BIN_ID);
}

export async function addRegistration(registration: Registration): Promise<boolean> {
  const registrations = await fetchRegistrations();
  registrations.push(registration);
  return await updateBin(REGISTRATIONS_BIN_ID, registrations);
}

export async function updateSessions(sessions: SessionDay[]): Promise<boolean> {
  // Teacher is updating - good time to clean old data
  const cleanedSessions = cleanupOldData(sessions);
  
  // Clean up orphaned registrations if we removed any sessions
  if (cleanedSessions.length < sessions.length) {
    console.log('Cleaning up sessions older than 3 months...');
    const validSessionIds = new Set<string>();
    cleanedSessions.forEach(session => {
      session.classes.forEach(cls => validSessionIds.add(cls.id));
    });
    await cleanupOldRegistrations(validSessionIds);
  }
  
  return await updateBin(SESSIONS_BIN_ID, cleanedSessions);
}

export async function addSession(session: SessionDay): Promise<boolean> {
  const sessions = await fetchSessions();
  sessions.push(session);
  sessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Use updateSessions which includes cleanup
  return await updateSessions(sessions);
}

export async function deleteSession(sessionId: string): Promise<boolean> {
  const sessions = await fetchSessions();
  const filtered = sessions.filter(s => s.id !== sessionId);
  return await updateSessions(filtered);
}

/**
 * Admin password management (still local - each device has own admin)
 */
export function checkAdminPassword(password: string): boolean {
  const storedHash = localStorage.getItem('sanshi_admin_hash');
  
  if (!storedHash && password) {
    const hash = btoa(password);
    localStorage.setItem('sanshi_admin_hash', hash);
    return true;
  }
  
  return storedHash === btoa(password);
}

export async function initializeDemoData(): Promise<void> {
  // This will initialize demo data if bins are empty
  await fetchSessions();
}