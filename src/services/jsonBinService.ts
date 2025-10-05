/**
 * JSONBin.io Service - FREE cloud storage that works in China
 * This allows ALL users to share the same data!
 */

import type { SessionDay, Registration } from '../types/calendar';

// JSONBin.io configuration
const JSONBIN_BASE_URL = 'https://api.jsonbin.io/v3';

// Get credentials from environment variables ONLY
// Vite automatically loads .env.development in dev mode and .env.production in build mode
const SESSIONS_BIN_ID = import.meta.env.VITE_SESSIONS_BIN_ID;
const REGISTRATIONS_BIN_ID = import.meta.env.VITE_REGISTRATIONS_BIN_ID;
const ADMIN_CONFIG_BIN_ID = import.meta.env.VITE_ADMIN_CONFIG_BIN_ID;

// 🎯 Support both Base64 (for local dev with $ in key) and plain text (for production)
const API_KEY = (() => {
  // Try Base64 first (for local development)
  const base64Key = import.meta.env.VITE_JSONBIN_API_KEY_BASE64;
  if (base64Key) {
    try {
      return atob(base64Key);
    } catch (e) {
      console.error('Failed to decode Base64 API key:', e);
    }
  }
  // Fall back to plain text (for production)
  return import.meta.env.VITE_JSONBIN_API_KEY;
})();

// Validate configuration on startup
function validateConfiguration() {
  const missing: string[] = [];
  
  if (!SESSIONS_BIN_ID) missing.push('VITE_SESSIONS_BIN_ID');
  if (!REGISTRATIONS_BIN_ID) missing.push('VITE_REGISTRATIONS_BIN_ID');
  if (!API_KEY) missing.push('VITE_JSONBIN_API_KEY');
  if (!ADMIN_CONFIG_BIN_ID) missing.push('VITE_ADMIN_CONFIG_BIN_ID');
  
  if (missing.length > 0) {
    const mode = import.meta.env.MODE || 'production';
    const envFile = mode === 'development' ? '.env.development' : '.env.production';
    const exampleFile = `${envFile}.example`;
    
    console.error('❌ Missing environment variables:', missing.join(', '));
    console.error(`\n📝 Configuration required:`);
    console.error(`   1. Copy ${exampleFile} to ${envFile}`);
    console.error(`   2. Fill in your JSONBin.io credentials`);
    console.error(`   3. Restart the dev server (npm run dev)`);
    console.error(`\n🔗 Get credentials: https://jsonbin.io/app/profile`);
    
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// Run validation
validateConfiguration();

// Configuration loaded successfully (no logging to avoid exposing sensitive info)


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
    const record = data.record || [];
    
    // Save to localStorage as cache (also helps with sync later)
    const localKey = binId === SESSIONS_BIN_ID ? 'sanshi_sessions' : 'sanshi_registrations';
    localStorage.setItem(localKey, JSON.stringify(record));
    
    return record;
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
  
  // Return empty array if no sessions (don't auto-initialize demo data)
  // This allows admins to start with an empty list
  return data || [];
}

export async function fetchRegistrations(): Promise<Registration[]> {
  const data = await fetchFromBin(REGISTRATIONS_BIN_ID);
  // Filter out any placeholder registrations
  return data.filter((reg: Registration) => reg.id !== 'placeholder');
}

export async function addRegistration(registration: Registration): Promise<boolean> {
  // Always fetch latest data to ensure real-time accuracy (handles concurrent registrations)
  const registrations = await fetchRegistrations();
  registrations.push(registration);
  return await updateBin(REGISTRATIONS_BIN_ID, registrations);
}

export async function deleteRegistration(registrationId: string): Promise<boolean> {
  // Always fetch latest data to ensure real-time accuracy
  const registrations = await fetchRegistrations();
  const filtered = registrations.filter((reg: Registration) => reg.id !== registrationId);
  return await updateBin(REGISTRATIONS_BIN_ID, filtered);
}

export async function updateSessions(sessions: SessionDay[], skipCleanup: boolean = false): Promise<boolean> {
  // No automatic cleanup - admin has full control
  
  // Only cleanup if explicitly requested (for edits that might have removed classes)
  if (!skipCleanup) {
    // Collect all valid class IDs
    const validClassIds = new Set<string>();
    sessions.forEach(session => {
      session.classes.forEach(cls => validClassIds.add(cls.id));
    });
    
    // Clean up orphaned registrations (for deleted sessions)
    await cleanupOrphanedRegistrations(validClassIds);
  }
  
  return await updateBin(SESSIONS_BIN_ID, sessions);
}

// Direct API functions that don't fetch (for AdminPanel which already has data)
/**
 * Save sessions directly without fetching first
 * Use this when you already have the complete sessions array
 */
export async function saveSessions(sessions: SessionDay[]): Promise<boolean> {
  return await updateBin(SESSIONS_BIN_ID, sessions);
}

/**
 * Delete registrations for specific class/session IDs
 * Use this when deleting a session to clean up its registrations
 */
export async function deleteRegistrationsBySessionId(sessionId: string, classIds: string[]): Promise<boolean> {
  const registrations = await fetchRegistrations();
  const filteredRegistrations = registrations.filter(reg => 
    reg.sessionId !== sessionId && !classIds.includes(reg.sessionId)
  );
  
  if (filteredRegistrations.length < registrations.length) {
    if (import.meta.env.DEV) {
      console.log(`Deleting ${registrations.length - filteredRegistrations.length} registrations for deleted session`);
    }
    return await updateBin(REGISTRATIONS_BIN_ID, filteredRegistrations);
  }
  return true;
}

// Legacy functions (kept for backward compatibility, but inefficient)
export async function addSession(session: SessionDay): Promise<boolean> {
  const sessions = await fetchSessions();
  sessions.push(session);
  sessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Skip cleanup - adding a session won't create orphaned registrations
  return await updateSessions(sessions, true);
}

export async function deleteSession(sessionId: string): Promise<boolean> {
  const sessions = await fetchSessions();
  
  // Find the session to be deleted and collect its class IDs
  const sessionToDelete = sessions.find(s => s.id === sessionId);
  const classIdsToDelete = sessionToDelete ? sessionToDelete.classes.map(cls => cls.id) : [];
  
  // Also check for special event registrations
  if (sessionToDelete?.isSpecialEvent) {
    classIdsToDelete.push(sessionToDelete.id);
  }
  
  // Remove the session
  const filtered = sessions.filter(s => s.id !== sessionId);
  
  // Clean related registrations in one go
  if (classIdsToDelete.length > 0) {
    const registrations = await fetchRegistrations();
    const filteredRegistrations = registrations.filter(reg => 
      !classIdsToDelete.includes(reg.sessionId) && reg.sessionId !== sessionId
    );
    
    if (filteredRegistrations.length < registrations.length) {
      if (import.meta.env.DEV) {
        console.log(`Deleting ${registrations.length - filteredRegistrations.length} registrations for deleted session`);
      }
      await updateBin(REGISTRATIONS_BIN_ID, filteredRegistrations);
    }
  }
  
  // Skip cleanup - we already cleaned registrations above
  return await updateSessions(filtered, true);
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