export interface ClassSession {
  id: string;
  date: string; // YYYY-MM-DD
  type: 'beginner' | 'intermediate' | 'experience'; // 素人体验、初级、中高级
  startTime: string; // HH:mm
  duration: number; // minutes
  maxParticipants: number;
  instructor?: string;
  // registrations 现在通过动态查询获取，不再存储在这里
}

export interface SessionDay {
  id: string;
  date: string; // YYYY-MM-DD
  classes: ClassSession[];
  isSpecialEvent?: boolean;
  eventTitle?: string; // 例如：沖縄県人会
  eventDescription?: string;
  eventStartTime?: string; // HH:mm - 特殊活动开始时间
  eventEndTime?: string; // HH:mm - 特殊活动结束时间
  eventMaxParticipants?: number; // 特殊活动最大参与人数
  location?: string;
}

export interface Registration {
  id: string;
  name: string;
  email: string;
  timestamp: number;
  sessionId: string;
}

// 用于前端显示的扩展接口，包含动态加载的registrations
export interface ClassSessionWithRegistrations extends ClassSession {
  registrations: Registration[];
}

export interface SessionDayWithRegistrations extends Omit<SessionDay, 'classes'> {
  classes: ClassSessionWithRegistrations[];
  eventRegistrations?: Registration[]; // 特殊活动的报名
}

