/**
 * Utility to migrate old format IDs to new format with UUID
 * This is optional - only run if you want to update existing IDs
 */

import { generateShortId, isOldFormatId } from './idGenerator';
import type { SessionDay, Registration } from '../types/calendar';

/**
 * Migrate session and class IDs to new format
 */
export function migrateSessionIds(sessions: SessionDay[]): SessionDay[] {
  return sessions.map(session => {
    // Migrate session ID if it's in old format
    const newSessionId = isOldFormatId(session.id) 
      ? `${session.id}-${generateShortId()}`
      : session.id;
    
    // Migrate class IDs
    const migratedClasses = session.classes.map(cls => {
      const newClassId = isOldFormatId(cls.id)
        ? `${cls.id}-${generateShortId()}`
        : cls.id;
      
      return {
        ...cls,
        id: newClassId
      };
    });
    
    return {
      ...session,
      id: newSessionId,
      classes: migratedClasses
    };
  });
}

/**
 * Migrate registration IDs and update sessionId references
 * @param registrations - Original registrations
 * @param idMapping - Map of old class IDs to new class IDs
 */
export function migrateRegistrationIds(
  registrations: Registration[], 
  idMapping: Map<string, string>
): Registration[] {
  return registrations.map(reg => {
    // Update registration ID if needed
    const newRegId = reg.id.match(/^reg-\d+$/) 
      ? `${reg.id}-${generateShortId()}`
      : reg.id;
    
    // Update sessionId reference if the class ID was migrated
    const newSessionId = idMapping.get(reg.sessionId) || reg.sessionId;
    
    return {
      ...reg,
      id: newRegId,
      sessionId: newSessionId
    };
  });
}

/**
 * Create a mapping of old IDs to new IDs from migrated sessions
 */
export function createIdMapping(
  originalSessions: SessionDay[], 
  migratedSessions: SessionDay[]
): Map<string, string> {
  const mapping = new Map<string, string>();
  
  originalSessions.forEach((original, index) => {
    const migrated = migratedSessions[index];
    
    // Map session IDs
    if (original.id !== migrated.id) {
      mapping.set(original.id, migrated.id);
    }
    
    // Map class IDs
    original.classes.forEach((originalClass, classIndex) => {
      const migratedClass = migrated.classes[classIndex];
      if (originalClass.id !== migratedClass.id) {
        mapping.set(originalClass.id, migratedClass.id);
      }
    });
  });
  
  return mapping;
}
