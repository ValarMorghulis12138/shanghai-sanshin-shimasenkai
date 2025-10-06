export type Language = 'en' | 'zh' | 'ja';

export interface Translations {
  common: {
    siteName: string;
    home: string;
    sessions: string;
    contact: string;
    register: string;
    submit: string;
    cancel: string;
    close: string;
    loading: string;
    location: string;
    time: string;
    date: string;
    type: string;
    edit: string;
    delete: string;
    save: string;
    add: string;
    confirm: string;
    logout: string;
  };
  
  home: {
    hero: {
      title: string;
      subtitle: string;
      description: string;
      cta: string;
    };
    teacher: {
      title: string;
      name: string;
      subtitle: string;
      introduction: string[];
    };
    certification: {
      title: string;
      subtitle: string;
      description: string[];
    };
    features: {
      title: string;
      biweekly: {
        title: string;
        description: string;
      };
      instruction: {
        title: string;
        description: string;
      };
      cultural: {
        title: string;
        description: string;
      };
    };
    awards?: {
      title: string;
      ambassador?: {
        title: string;
        description: string;
      };
      consulGeneral?: {
        title: string;
        description: string;
      };
    };
    gallery: {
      title: string;
      ambassadorCaption?: string;
    };
    history: {
      title: string;
      timeline: {
        century14: {
          title: string;
          description: string;
        };
        century16: {
          title: string;
          description: string;
        };
        ww2: {
          title: string;
          description: string;
        };
        present: {
          title: string;
          description: string;
        };
      };
    };
    cta: {
      title: string;
      description: string;
      viewSessions: string;
      getInTouch: string;
    };
  };
  
  sessions: {
    title: string;
    description: string;
    scheduleTitle: string;
    scheduleDescription: string;
    whatToBring: {
      title: string;
      items: string[];
    };
    sessionCard: {
      instructor: string;
      location: string;
      participants: string;
      sessionFull: string;
      level: {
        beginner: string;
        intermediate: string;
        advanced: string;
        experience: string;
        all: string;
      };
      levelShort: {
        beginner: string;
        intermediate: string;
        advanced: string;
        experience: string;
      };
    };
    registration: {
      title: string;
      fullName: string;
      email: string;
      phone: string;
      experience: string;
      experienceLevels: {
        none: string;
        beginner: string;
        intermediate: string;
        advanced: string;
      };
      message: string;
      completeRegistration: string;
      success: string;
      failed: string;
      error: string;
      cancelConfirm: string;
      cancelled: string;
      cancelFailed: string;
      yourName: string;
      yourEmail: string;
      enterName: string;
      enterEmail: string;
      savedInfo: string;
      clearSavedInfo: string;
      confirmRegistration: string;
      eventRegistration: string;
      classRegistration: string;
    };
    noSessionsThisMonth: string;
    specialEvent: string;
    registered: string;
    full: string;
    registerNow: string;
    cancel: string;
    more: string;
    recentMonths: string;
    schedule: {
      biweekly: string;
      classTime: string;
      class1: string;
      class2: string;
      class3: string;
    };
  };
  
  contact: {
    title: string;
    description: string;
    contactInfo: string;
    location: {
      title: string;
      address: string[];
    };
    email: string;
    wechat: string;
    wechatId: string;
    responseTime: {
      title: string;
      description: string;
    };
    faq: {
      title: string;
      questions: {
        ownSanshin: {
          question: string;
          answer: string;
        };
        cost: {
          question: string;
          answer: string;
        };
        experience: {
          question: string;
          answer: string;
        };
      };
    };
    form: {
      title: string;
      yourName: string;
      emailAddress: string;
      subject: string;
      subjects: {
        general: string;
        lessons: string;
        schedule: string;
        instrument: string;
        other: string;
      };
      message: string;
      messagePlaceholder: string;
      sendMessage: string;
      sending: string;
    };
  };
  
  footer: {
    description: string;
    quickLinks: string;
    connectWithUs: string;
    connectDescription: string;
    rights: string;
  };
  
  admin: {
    teacherLogin: string;
    enterPassword: string;
    login: string;
    incorrectPassword: string;
    loginFailed: string;
    sessionManagement: string;
    addNewSession: string;
    changePassword: string;
    newPassword: string;
    confirmPassword: string;
    passwordsDoNotMatch: string;
    passwordTooShort: string;
    passwordUpdated: string;
    passwordUpdateFailed: string;
    regularClasses: string;
    specialEvent: string;
    eventInfo: string;
    eventName: string;
    eventNamePlaceholder: string;
    eventDescription: string;
    eventDescriptionPlaceholder: string;
    startTime: string;
    endTime: string;
    maxParticipants: string;
    classSchedule: string;
    addClass: string;
    confirmDelete: string;
    deleteSuccess: string;
    deleteFailed: string;
    saved: string;
    saveFailed: string;
    added: string;
    addFailed: string;
    classes: string;
    teacherAccess: string;
    teacherAccessHint: string;
  };
  
  cities: {
    shanghai: {
      name: string;
      branch: string;
    };
    beijing: {
      name: string;
      branch: string;
      underConstruction: string;
      comingSoon: string;
    };
    fuzhou: {
      name: string;
      branch: string;
      underConstruction: string;
      comingSoon: string;
    };
  };
}

