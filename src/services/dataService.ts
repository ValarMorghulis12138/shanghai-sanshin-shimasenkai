import type { SessionDay, Registration } from '../types/calendar';

// Base URL for data files
const DATA_BASE_URL = '/data';

/**
 * Fetch sessions data from JSON file
 */
export async function fetchSessions(): Promise<SessionDay[]> {
  try {
    const response = await fetch(`${DATA_BASE_URL}/sessions.json`);
    if (!response.ok) {
      throw new Error('Failed to fetch sessions');
    }
    
    const data = await response.json();
    return data.sessions || [];
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }
}

/**
 * Fetch registrations data from JSON file
 */
export async function fetchRegistrations(): Promise<Registration[]> {
  try {
    const response = await fetch(`${DATA_BASE_URL}/registrations.json`);
    if (!response.ok) {
      throw new Error('Failed to fetch registrations');
    }
    
    const data = await response.json();
    return data.registrations || [];
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return [];
  }
}

/**
 * Merge registrations into sessions data
 */
export function mergeRegistrationsIntoSessions(
  sessions: SessionDay[],
  registrations: Registration[]
): SessionDay[] {
  return sessions.map(session => ({
    ...session,
    classes: session.classes.map(classItem => ({
      ...classItem,
      registrations: registrations.filter(reg => reg.sessionId === classItem.id)
    }))
  }));
}

/**
 * Simulate registration (for demo purposes)
 * In production, this would require manual update of the JSON file
 */
export function createRegistrationRequest(
  sessionId: string,
  name: string,
  email: string
): Registration {
  return {
    id: `reg-${Date.now()}`,
    sessionId,
    name,
    email,
    timestamp: Date.now()
  };
}

/**
 * Instructions for updating registration
 */
export function getRegistrationInstructions(registration: Registration): string {
  const jsonEntry = JSON.stringify({
    id: registration.id,
    sessionId: registration.sessionId,
    name: registration.name,
    email: registration.email,
    timestamp: new Date(registration.timestamp).toISOString()
  }, null, 2);

  return `
To complete registration, please:

1. Send this information to the organizer via WeChat/Email
2. Or create a GitHub issue with this registration data:

${jsonEntry}

The organizer will update the registration list within 24 hours.
`;
}
