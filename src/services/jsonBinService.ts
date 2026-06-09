/**
 * JSONBin.io Service - FREE cloud storage that works in China
 * This allows ALL users to share the same data!
 * Supports multiple cities with separate data storage.
 */

import type { SessionDay, Registration } from '../types/calendar';

// Supported cities
export type City = 'shanghai' | 'beijing' | 'tokyo';

// JSONBin.io configuration
const JSONBIN_BASE_URL = 'https://api.jsonbin.io/v3';

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

// City-specific bin configurations
interface CityBinConfig {
  sessionsBinId: string;
  registrationsBinId: string;
  adminConfigBinId: string;
}

const cityConfigs: Record<City, CityBinConfig> = {
  shanghai: {
    sessionsBinId: import.meta.env.VITE_SESSIONS_BIN_ID || '',
    registrationsBinId: import.meta.env.VITE_REGISTRATIONS_BIN_ID || '',
    adminConfigBinId: import.meta.env.VITE_ADMIN_CONFIG_BIN_ID || ''
  },
  beijing: {
    sessionsBinId: import.meta.env.VITE_BEIJING_SESSIONS_BIN_ID || '',
    registrationsBinId: import.meta.env.VITE_BEIJING_REGISTRATIONS_BIN_ID || '',
    adminConfigBinId: import.meta.env.VITE_BEIJING_ADMIN_CONFIG_BIN_ID || import.meta.env.VITE_ADMIN_CONFIG_BIN_ID || ''
  },
  tokyo: {
    // Prefer VITE_TOKYO_* (current naming); fall back to VITE_FUZHOU_* to reuse legacy Fuzhou bin IDs unchanged in .env
    sessionsBinId:
      import.meta.env.VITE_TOKYO_SESSIONS_BIN_ID || import.meta.env.VITE_FUZHOU_SESSIONS_BIN_ID || '',
    registrationsBinId:
      import.meta.env.VITE_TOKYO_REGISTRATIONS_BIN_ID ||
      import.meta.env.VITE_FUZHOU_REGISTRATIONS_BIN_ID ||
      '',
    adminConfigBinId:
      import.meta.env.VITE_TOKYO_ADMIN_CONFIG_BIN_ID ||
      import.meta.env.VITE_FUZHOU_ADMIN_CONFIG_BIN_ID ||
      ''
  }
};

// Get bin config for a city (defaults to shanghai for backward compatibility)
function getBinConfig(city: City = 'shanghai'): CityBinConfig {
  return cityConfigs[city];
}

// Get localStorage key with city prefix
function getLocalStorageKey(baseKey: string, city: City): string {
  if (city === 'shanghai') {
    // Backward compatibility: shanghai uses original keys
    return baseKey;
  }
  return `${baseKey}_${city}`;
}

// Validate configuration for a specific city
function validateCityConfiguration(city: City): boolean {
  const config = getBinConfig(city);
  const missing: string[] = [];
  
  if (!config.sessionsBinId) missing.push(`VITE_${city.toUpperCase()}_SESSIONS_BIN_ID`);
  if (!config.registrationsBinId) missing.push(`VITE_${city.toUpperCase()}_REGISTRATIONS_BIN_ID`);
  if (!API_KEY) missing.push('VITE_JSONBIN_API_KEY');
  
  if (missing.length > 0) {
    console.warn(`⚠️ Missing environment variables for ${city}:`, missing.join(', '));
    return false;
  }
  return true;
}

// Validate Shanghai configuration on startup (required)
function validateConfiguration() {
  const config = getBinConfig('shanghai');
  const missing: string[] = [];
  
  if (!config.sessionsBinId) missing.push('VITE_SESSIONS_BIN_ID');
  if (!config.registrationsBinId) missing.push('VITE_REGISTRATIONS_BIN_ID');
  if (!API_KEY) missing.push('VITE_JSONBIN_API_KEY');
  if (!config.adminConfigBinId) missing.push('VITE_ADMIN_CONFIG_BIN_ID');
  
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

// Check if a city is configured
export function isCityConfigured(city: City): boolean {
  return validateCityConfiguration(city);
}

// Configuration loaded successfully (no logging to avoid exposing sensitive info)


/**
 * Fetch data from JSONBin
 */
async function fetchFromBin<T>(binId: string, localStorageKey: string): Promise<T> {
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
    const record = data.record ?? [];
    
    // Save to localStorage as cache (also helps with sync later)
    localStorage.setItem(localStorageKey, JSON.stringify(record));
    
    return record as T;
  } catch (error) {
    console.error('JSONBin fetch error:', error);
    // Fallback to localStorage if JSONBin fails
    const localData = localStorage.getItem(localStorageKey);
    return (localData ? JSON.parse(localData) : []) as T;
  }
}

/**
 * Update data in JSONBin
 */
async function updateBin(
  binId: string,
  data: unknown,
  localStorageKey: string,
  isSessionsBin: boolean
): Promise<boolean> {
  try {
    // Remove quotes if they're included in the API key
    const cleanApiKey = API_KEY?.replace(/^["']|["']$/g, '');
    
    // JSONBin doesn't accept empty arrays, so we need to handle this case
    let dataToSend = data;
    if (Array.isArray(data) && data.length === 0) {
      // For sessions, add a placeholder that's far in the past (will be cleaned up)
      if (isSessionsBin) {
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
    localStorage.setItem(localStorageKey, JSON.stringify(dataToSend));
    
    return true;
  } catch (error) {
    console.error('JSONBin update error:', error);
    return false;
  }
}


/**
 * Clean up orphaned registrations (remove registrations for deleted sessions)
 */
async function cleanupOrphanedRegistrations(validClassIds: Set<string>, city: City = 'shanghai'): Promise<void> {
  const registrations = await fetchRegistrations(city);
  const validRegistrations = registrations.filter(reg => {
    // Keep registration only if its class still exists
    return validClassIds.has(reg.sessionId);
  });
  
  // Only update if we removed some registrations
  if (validRegistrations.length < registrations.length) {
    if (import.meta.env.DEV) {
      console.log(`Cleaning up ${registrations.length - validRegistrations.length} orphaned registrations for ${city}`);
    }
    const config = getBinConfig(city);
    const localKey = getLocalStorageKey('sanshi_registrations', city);
    await updateBin(config.registrationsBinId, validRegistrations, localKey, false);
  }
}

/**
 * Public API Functions
 */

export async function fetchSessions(city: City = 'shanghai'): Promise<SessionDay[]> {
  const config = getBinConfig(city);
  const localKey = getLocalStorageKey('sanshi_sessions', city);
  
  // Note: No cleanup here - cleanup only happens when teachers update sessions
  let data = await fetchFromBin<SessionDay[]>(config.sessionsBinId, localKey);
  
  // Filter out any placeholder sessions
  data = data.filter((session: SessionDay) => session.id !== 'placeholder');
  
  // Return empty array if no sessions (don't auto-initialize demo data)
  // This allows admins to start with an empty list
  return data || [];
}

export async function fetchRegistrations(city: City = 'shanghai'): Promise<Registration[]> {
  const config = getBinConfig(city);
  const localKey = getLocalStorageKey('sanshi_registrations', city);
  
  const data = await fetchFromBin<Registration[]>(config.registrationsBinId, localKey);
  // Filter out any placeholder registrations
  return data.filter((reg: Registration) => reg.id !== 'placeholder');
}

export async function addRegistration(registration: Registration, city: City = 'shanghai'): Promise<boolean> {
  const config = getBinConfig(city);
  const localKey = getLocalStorageKey('sanshi_registrations', city);
  
  // Always fetch latest data to ensure real-time accuracy (handles concurrent registrations)
  const registrations = await fetchRegistrations(city);
  registrations.push(registration);
  return await updateBin(config.registrationsBinId, registrations, localKey, false);
}

export async function deleteRegistration(registrationId: string, city: City = 'shanghai'): Promise<boolean> {
  const config = getBinConfig(city);
  const localKey = getLocalStorageKey('sanshi_registrations', city);
  
  // Always fetch latest data to ensure real-time accuracy
  const registrations = await fetchRegistrations(city);
  const filtered = registrations.filter((reg: Registration) => reg.id !== registrationId);
  return await updateBin(config.registrationsBinId, filtered, localKey, false);
}

export async function updateSessions(sessions: SessionDay[], skipCleanup: boolean = false, city: City = 'shanghai'): Promise<boolean> {
  const config = getBinConfig(city);
  const localKey = getLocalStorageKey('sanshi_sessions', city);
  
  // No automatic cleanup - admin has full control
  
  // Only cleanup if explicitly requested (for edits that might have removed classes)
  if (!skipCleanup) {
    // Collect all valid class IDs
    const validClassIds = new Set<string>();
    sessions.forEach(session => {
      session.classes.forEach(cls => validClassIds.add(cls.id));
    });
    
    // Clean up orphaned registrations (for deleted sessions)
    await cleanupOrphanedRegistrations(validClassIds, city);
  }
  
  return await updateBin(config.sessionsBinId, sessions, localKey, true);
}

// Direct API functions that don't fetch (for AdminPanel which already has data)
/**
 * Save sessions directly without fetching first
 * Use this when you already have the complete sessions array
 */
export async function saveSessions(sessions: SessionDay[], city: City = 'shanghai'): Promise<boolean> {
  const config = getBinConfig(city);
  const localKey = getLocalStorageKey('sanshi_sessions', city);
  return await updateBin(config.sessionsBinId, sessions, localKey, true);
}

/**
 * Delete registrations for specific class/session IDs
 * Use this when deleting a session to clean up its registrations
 */
export async function deleteRegistrationsBySessionId(sessionId: string, classIds: string[], city: City = 'shanghai'): Promise<boolean> {
  const config = getBinConfig(city);
  const localKey = getLocalStorageKey('sanshi_registrations', city);
  
  const registrations = await fetchRegistrations(city);
  const filteredRegistrations = registrations.filter(reg => 
    reg.sessionId !== sessionId && !classIds.includes(reg.sessionId)
  );
  
  if (filteredRegistrations.length < registrations.length) {
    if (import.meta.env.DEV) {
      console.log(`Deleting ${registrations.length - filteredRegistrations.length} registrations for deleted session in ${city}`);
    }
    return await updateBin(config.registrationsBinId, filteredRegistrations, localKey, false);
  }
  return true;
}

// Legacy functions (kept for backward compatibility, but inefficient)
export async function addSession(session: SessionDay, city: City = 'shanghai'): Promise<boolean> {
  const sessions = await fetchSessions(city);
  sessions.push(session);
  sessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Skip cleanup - adding a session won't create orphaned registrations
  return await updateSessions(sessions, true, city);
}

export async function deleteSession(sessionId: string, city: City = 'shanghai'): Promise<boolean> {
  const config = getBinConfig(city);
  const localKey = getLocalStorageKey('sanshi_registrations', city);
  
  const sessions = await fetchSessions(city);
  
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
    const registrations = await fetchRegistrations(city);
    const filteredRegistrations = registrations.filter(reg => 
      !classIdsToDelete.includes(reg.sessionId) && reg.sessionId !== sessionId
    );
    
    if (filteredRegistrations.length < registrations.length) {
      if (import.meta.env.DEV) {
        console.log(`Deleting ${registrations.length - filteredRegistrations.length} registrations for deleted session in ${city}`);
      }
      await updateBin(config.registrationsBinId, filteredRegistrations, localKey, false);
    }
  }
  
  // Skip cleanup - we already cleaned registrations above
  return await updateSessions(filtered, true, city);
}

/**
 * Admin password management (cloud-based - all devices share same password)
 */
const adminConfigCache: Record<City, { passwordHash: string; lastUpdated: string } | null> = {
  shanghai: null,
  beijing: null,
  tokyo: null
};

export async function checkAdminPassword(password: string, city: City = 'shanghai'): Promise<boolean> {
  const config = getBinConfig(city);
  const localKey = getLocalStorageKey('sanshi_admin_hash', city);
  
  try {
    // Fetch admin config from cloud if not cached
    if (!adminConfigCache[city] && config.adminConfigBinId) {
      const adminConfig = await fetchFromBin<{ passwordHash: string; lastUpdated: string } | null>(
        config.adminConfigBinId,
        `sanshi_admin_config_${city}`
      );
      adminConfigCache[city] = adminConfig;
    }
    
    // If still no config (bin not set), fall back to local storage
    if (!adminConfigCache[city]) {
      const storedHash = localStorage.getItem(localKey);
      if (!storedHash && password) {
        const hash = btoa(password);
        localStorage.setItem(localKey, hash);
        return true;
      }
      return storedHash === btoa(password);
    }
    
    // Check password against cloud config
    return adminConfigCache[city]!.passwordHash === btoa(password);
  } catch (error) {
    console.error('Error checking admin password:', error);
    // Fall back to local check on error
    const storedHash = localStorage.getItem(localKey);
    return storedHash === btoa(password);
  }
}

/**
 * Update admin password in cloud
 */
export async function updateAdminPassword(newPassword: string, city: City = 'shanghai'): Promise<boolean> {
  const config = getBinConfig(city);
  
  if (!config.adminConfigBinId) {
    console.error(`Admin config bin ID not set for ${city}`);
    return false;
  }
  
  try {
    const newConfig = {
      passwordHash: btoa(newPassword),
      lastUpdated: new Date().toISOString()
    };
    
    const success = await updateBin(config.adminConfigBinId, newConfig, `sanshi_admin_config_${city}`, false);
    if (success) {
      adminConfigCache[city] = newConfig;
    }
    return success;
  } catch (error) {
    console.error('Error updating admin password:', error);
    return false;
  }
}

export async function initializeDemoData(city: City = 'shanghai'): Promise<void> {
  // This will initialize demo data if bins are empty
  await fetchSessions(city);
}