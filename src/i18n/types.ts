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
}

