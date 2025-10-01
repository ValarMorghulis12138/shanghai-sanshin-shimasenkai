/**
 * JSONBin.io Service - FREE cloud storage that works in China
 * This allows ALL users to share the same data!
 */

import type { SessionDay, Registration } from '../types/calendar';
import { JSONBIN_CONFIG } from '../config/jsonbin.config';

// JSONBin.io configuration
const JSONBIN_BASE_URL = 'https://api.jsonbin.io/v3';

// Get credentials from environment variables with fallback to config values
// Vite automatically loads .env.development in dev mode and .env.production in build mode
const SESSIONS_BIN_ID = import.meta.env.VITE_SESSIONS_BIN_ID || JSONBIN_CONFIG.SESSIONS_BIN_ID;
const REGISTRATIONS_BIN_ID = import.meta.env.VITE_REGISTRATIONS_BIN_ID || JSONBIN_CONFIG.REGISTRATIONS_BIN_ID;
// Temporary fix for development environment
const API_KEY = import.meta.env.DEV 
  ? "$2a$10$BdDC5VXTHvvwh4UU74hBAuA04DHMsFrKjyC2BthFWYga6tq3lmUn." 
  : (import.meta.env.VITE_JSONBIN_API_KEY || JSONBIN_CONFIG.API_KEY);
const ADMIN_CONFIG_BIN_ID = import.meta.env.VITE_ADMIN_CONFIG_BIN_ID || JSONBIN_CONFIG.ADMIN_CONFIG_BIN_ID;

// Log environment info (only in development)
if (import.meta.env.DEV) {
  console.log('🔧 Development mode - JSONBin configuration loaded from .env.development');
  console.log('Mode:', import.meta.env.MODE);
  console.log('Sessions Bin:', SESSIONS_BIN_ID);
  console.log('Raw API Key from env:', import.meta.env.VITE_JSONBIN_API_KEY);
  console.log('API_KEY variable:', API_KEY);
  console.log('All VITE env vars:', Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')));
}


/**
 * Fetch data from JSONBin
 */
async function fetchFromBin(binId: string): Promise<any> {
  try {
    // Remove quotes if they're included in the API key (from .env file)
    const cleanApiKey = API_KEY?.replace(/^["']|["']$/g, '');
    
    // Always include API key for private bins
    const headers: HeadersInit = {
      'X-Master-Key': cleanApiKey
    };
    
    const response = await fetch(`${JSONBIN_BASE_URL}/b/${binId}/latest`, {
      headers: headers
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
    // Remove quotes if they're included in the API key
    const cleanApiKey = API_KEY?.replace(/^["']|["']$/g, '');
    
    // JSONBin doesn't accept empty arrays, so we need to handle this case
    let dataToSend = data;
    if (Array.isArray(data) && data.length === 0) {
      // For sessions, add a placeholder that's far in the past (will be cleaned up)
      if (binId === SESSIONS_BIN_ID) {
        dataToSend = [{
          id: 'placeholder',
          date: '2020-01-01',
          classes: [],
          location: 'Placeholder'
        }];
      } else {
        // For registrations, add a dummy registration
        dataToSend = [{
          id: 'placeholder',
          sessionId: 'placeholder',
          name: 'Placeholder',
          email: 'placeholder@example.com',
          timestamp: 946684800000 // Year 2000
        }];
      }
    }
    
    if (import.meta.env.DEV) {
      console.log('🔍 Update Debug Info:');
      console.log('Bin ID:', binId);
      console.log('API Key (first 20 chars):', cleanApiKey?.substring(0, 20) + '...');
      console.log('Data to send:', dataToSend);
    }
    
    const response = await fetch(`${JSONBIN_BASE_URL}/b/${binId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': cleanApiKey
      },
      body: JSON.stringify(dataToSend)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('JSONBin update error response:', errorText);
      console.error('Response status:', response.status);
      console.error('Response headers:', Object.fromEntries(response.headers.entries()));
      throw new Error(`Failed to update: ${response.status} ${response.statusText} - ${errorText}`);
    }

    // Also save to localStorage as backup (use the same data we sent to JSONBin)
    const localKey = binId === SESSIONS_BIN_ID ? 'sanshi_sessions' : 'sanshi_registrations';
    localStorage.setItem(localKey, JSON.stringify(dataToSend));
    
    return true;
  } catch (error) {
    console.error('JSONBin update error:', error);
    return false;
  }
}


/**
 * Clean up orphaned registrations (remove registrations for deleted sessions)
 */
async function cleanupOrphanedRegistrations(validClassIds: Set<string>): Promise<void> {
  const registrations = await fetchRegistrations();
  const validRegistrations = registrations.filter(reg => {
    // Keep registration only if its class still exists
    return validClassIds.has(reg.sessionId);
  });
  
  // Only update if we removed some registrations
  if (validRegistrations.length < registrations.length) {
    if (import.meta.env.DEV) {
      console.log(`Cleaning up ${registrations.length - validRegistrations.length} orphaned registrations`);
    }
    await updateBin(REGISTRATIONS_BIN_ID, validRegistrations);
  }
}

/**
 * Public API Functions
 */

export async function fetchSessions(): Promise<SessionDay[]> {
  // Note: No cleanup here - cleanup only happens when teachers update sessions
  let data = await fetchFromBin(SESSIONS_BIN_ID);
  
  // Filter out any placeholder sessions
  data = data.filter((session: SessionDay) => session.id !== 'placeholder');
  
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
            maxParticipants: 20,
            instructor: "Keisuke老师"
          },
          {
            id: "class-2025-01-18-15:00",
            date: "2025-01-18",
            type: "experience",
            startTime: "15:00",
            duration: 50,
            maxParticipants: 20,
            instructor: "Keisuke老师"
          },
          {
            id: "class-2025-01-18-16:00",
            date: "2025-01-18",
            type: "beginner",
            startTime: "16:00",
            duration: 50,
            maxParticipants: 20,
            instructor: "Keisuke老师"
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
  const data = await fetchFromBin(REGISTRATIONS_BIN_ID);
  // Filter out any placeholder registrations
  return data.filter((reg: Registration) => reg.id !== 'placeholder');
}

export async function addRegistration(registration: Registration): Promise<boolean> {
  const registrations = await fetchRegistrations();
  registrations.push(registration);
  return await updateBin(REGISTRATIONS_BIN_ID, registrations);
}

export async function deleteRegistration(registrationId: string): Promise<boolean> {
  const registrations = await fetchRegistrations();
  const filtered = registrations.filter(reg => reg.id !== registrationId);
  return await updateBin(REGISTRATIONS_BIN_ID, filtered);
}

export async function updateSessions(sessions: SessionDay[]): Promise<boolean> {
  // No automatic cleanup - admin has full control
  
  // Collect all valid class IDs
  const validClassIds = new Set<string>();
  sessions.forEach(session => {
    session.classes.forEach(cls => validClassIds.add(cls.id));
  });
  
  // Clean up orphaned registrations (for deleted sessions)
  await cleanupOrphanedRegistrations(validClassIds);
  
  return await updateBin(SESSIONS_BIN_ID, sessions);
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
  
  // Find the session to be deleted and collect its class IDs
  const sessionToDelete = sessions.find(s => s.id === sessionId);
  const classIdsToDelete = sessionToDelete ? sessionToDelete.classes.map(cls => cls.id) : [];
  
  // Remove the session
  const filtered = sessions.filter(s => s.id !== sessionId);
  
  // If we found classes to delete, immediately clean their registrations
  if (classIdsToDelete.length > 0) {
    const registrations = await fetchRegistrations();
    const filteredRegistrations = registrations.filter(reg => 
      !classIdsToDelete.includes(reg.sessionId)
    );
    
    if (filteredRegistrations.length < registrations.length) {
      if (import.meta.env.DEV) {
        console.log(`Deleting ${registrations.length - filteredRegistrations.length} registrations for deleted session`);
      }
      await updateBin(REGISTRATIONS_BIN_ID, filteredRegistrations);
    }
  }
  
  // Update sessions (this will also run general cleanup)
  return await updateSessions(filtered);
}

/**
 * Admin password management (cloud-based - all devices share same password)
 */
let adminConfigCache: { passwordHash: string; lastUpdated: string } | null = null;

export async function checkAdminPassword(password: string): Promise<boolean> {
  try {
    // Fetch admin config from cloud if not cached
    if (!adminConfigCache && ADMIN_CONFIG_BIN_ID) {
      const config = await fetchFromBin(ADMIN_CONFIG_BIN_ID);
      adminConfigCache = config;
    }
    
    // If still no config (bin not set), fall back to local storage
    if (!adminConfigCache) {
      const storedHash = localStorage.getItem('sanshi_admin_hash');
      if (!storedHash && password) {
        const hash = btoa(password);
        localStorage.setItem('sanshi_admin_hash', hash);
        return true;
      }
      return storedHash === btoa(password);
    }
    
    // Check password against cloud config
    return adminConfigCache.passwordHash === btoa(password);
  } catch (error) {
    console.error('Error checking admin password:', error);
    // Fall back to local check on error
    const storedHash = localStorage.getItem('sanshi_admin_hash');
    return storedHash === btoa(password);
  }
}

/**
 * Update admin password in cloud
 */
export async function updateAdminPassword(newPassword: string): Promise<boolean> {
  if (!ADMIN_CONFIG_BIN_ID) {
    console.error('Admin config bin ID not set');
    return false;
  }
  
  try {
    const newConfig = {
      passwordHash: btoa(newPassword),
      lastUpdated: new Date().toISOString()
    };
    
    const success = await updateBin(ADMIN_CONFIG_BIN_ID, newConfig);
    if (success) {
      adminConfigCache = newConfig;
    }
    return success;
  } catch (error) {
    console.error('Error updating admin password:', error);
    return false;
  }
}

export async function initializeDemoData(): Promise<void> {
  // This will initialize demo data if bins are empty
  await fetchSessions();
}