export interface ClassSession {
  id: string;
  date: string; // YYYY-MM-DD
  type: 'beginner' | 'intermediate' | 'experience'; // 素人体验、初级、中高级
  startTime: string; // HH:mm
  duration: number; // minutes
  maxParticipants: number;
  registrations: Registration[];
  instructor?: string;
}

export interface SessionDay {
  id: string;
  date: string; // YYYY-MM-DD
  classes: ClassSession[];
  isSpecialEvent?: boolean;
  eventTitle?: string; // 例如：沖縄県人会
  eventDescription?: string;
  location?: string;
}

export interface Registration {
  id: string;
  name: string;
  timestamp: number;
  sessionId: string;
}

