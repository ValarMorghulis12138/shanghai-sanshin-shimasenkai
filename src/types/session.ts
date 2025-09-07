export interface Session {
  id: string;
  date: string;
  time: string;
  instructor: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  maxParticipants: number;
  registeredParticipants: string[];
  location: string;
  description?: string;
}

export interface Registration {
  name: string;
  email: string;
  phone: string;
  experience: 'none' | 'beginner' | 'intermediate' | 'advanced';
  message?: string;
}
