/**
 * Generate unique IDs for sessions, classes, and registrations
 */

/**
 * Generate a short UUID-like string
 * Uses crypto.randomUUID() if available, falls back to timestamp + random
 */
export function generateShortId(): string {
  // Check if crypto.randomUUID is available
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    // Take first 8 characters of UUID for shorter IDs
    return crypto.randomUUID().split('-')[0];
  }
  
  // Fallback: timestamp + random number
  const timestamp = Date.now().toString(36);
  const randomNum = Math.random().toString(36).substring(2, 6);
  return `${timestamp}${randomNum}`;
}

/**
 * Generate a session ID with date and unique identifier
 * Example: session-2024-01-06-a1b2c3d4
 */
export function generateSessionId(date: string): string {
  return `session-${date}-${generateShortId()}`;
}

/**
 * Generate a class ID with date, time, and unique identifier
 * Example: class-2024-01-06-14:00-a1b2c3d4
 */
export function generateClassId(date: string, startTime: string): string {
  return `class-${date}-${startTime}-${generateShortId()}`;
}

/**
 * Generate a registration ID with timestamp
 * Example: reg-1704565200000-a1b2c3d4
 */
export function generateRegistrationId(): string {
  return `reg-${Date.now()}-${generateShortId()}`;
}

/**
 * Check if an ID is in the old format (without UUID)
 * Used for backward compatibility
 */
export function isOldFormatId(id: string): boolean {
  // Old format: session-YYYY-MM-DD or class-YYYY-MM-DD-HH:MM
  const oldSessionPattern = /^session-\d{4}-\d{2}-\d{2}$/;
  const oldClassPattern = /^class-\d{4}-\d{2}-\d{2}-\d{2}:\d{2}$/;
  
  return oldSessionPattern.test(id) || oldClassPattern.test(id);
}

/**
 * Migrate old ID to new format
 * Adds a UUID suffix to existing IDs
 */
export function migrateToNewId(oldId: string): string {
  if (isOldFormatId(oldId)) {
    return `${oldId}-${generateShortId()}`;
  }
  return oldId; // Already in new format
}
