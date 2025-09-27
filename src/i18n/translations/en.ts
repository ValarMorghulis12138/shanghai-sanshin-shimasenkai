import type { Translations } from '../types';

export const en: Translations = {
  common: {
    siteName: 'Shanghai Sanshi Shimasenkai',
    home: 'Home',
    sessions: 'Sessions',
    contact: 'Contact',
    register: 'Register',
    submit: 'Submit',
    cancel: 'Cancel',
    close: 'Close',
    loading: 'Loading...'
  },
  
  home: {
    hero: {
      title: 'Sanshin Shimasenkai',
      subtitle: '',
      description: 'Join Shanghai Sanshin Shimasenkai, led by KEISUKE - Okinawan performer, certified instructor, and cultural ambassador bringing the soul of Okinawa to Shanghai since 2008.',
      cta: 'Meet Our Teacher'
    },
    teacher: {
      title: 'Instructor Introduction',
      name: 'KEISUKE (Nishihara Keisuke)',
      subtitle: 'Sanshin Performer & Certified Instructor',
      introduction: [
        'KEISUKE is from Okinawa and currently based in Shanghai as an active Uta-Sanshin performer. He holds a teaching license from the Ryukyu Island Uta Music Association.',
        'Since 2008, he has been leading the "Shanghai Sanshin Shimasenkai" circle, providing monthly sanshin instruction. He has performed on the same stage as Mongol800 and Kina Shoukichi in China, and actively promotes Okinawan culture including awamori and music throughout China.',
        'In 2020, he served as MC and opening act for the Shanghai International Film Festival\'s official Japan Film Week. In 2021, he opened his own Okinawan restaurant "UMIBE" in Shanghai, hosting regular live performances.'
      ]
    },
    certification: {
      title: 'Awards & Recognition',
      subtitle: 'Achievements in Cultural Exchange',
      description: [
        'In 2022, KEISUKE received the "Okinawa Civilian Ambassador" award from the Okinawa Prefectural Government, a prestigious honor recognizing individuals who contribute to spreading Okinawan culture overseas.',
        'In 2024, he was awarded the "Consul General\'s Commendation" by the Consulate-General of Japan in Shanghai, acknowledging his long-standing contributions to promoting Japan-China cultural exchange.'
      ]
    },
    features: {
      title: 'Our Community',
      biweekly: {
        title: 'Biweekly Sessions',
        description: 'Join our regular practice sessions where we explore traditional and contemporary sanshin music together.'
      },
      instruction: {
        title: 'Expert Instruction',
        description: 'Learn from experienced teachers who are passionate about preserving and sharing Okinawan musical traditions.'
      },
      cultural: {
        title: 'Cultural Exchange',
        description: 'Connect with fellow enthusiasts and immerse yourself in the rich cultural heritage of Okinawa.'
      }
    },
    awards: {
      title: 'Awards & Recognition',
      ambassador: {
        title: '2022 Okinawa Civilian Ambassador',
        description: 'Awarded by the Okinawa Prefectural Government for significant contributions to promoting and spreading Okinawan culture internationally.'
      },
      consulGeneral: {
        title: '2024 Consul General\'s Commendation',
        description: 'Awarded by the Consulate-General of Japan in Shanghai, recognizing long-standing contributions to promoting Japan-China cultural exchange through Okinawan music and culture.'
      }
    },
    gallery: {
      title: 'Moments from Our Musical Journey',
      ambassadorCaption: '2022 Okinawa Civilian Ambassador Award'
    },
    history: {
      title: 'The History of Sanshin',
      timeline: {
        century14: {
          title: '14th Century',
          description: 'The sanshin\'s ancestor, the Chinese sanxian, arrives in the Ryukyu Kingdom through trade and cultural exchange.'
        },
        century16: {
          title: '16th Century',
          description: 'The sanshin becomes an essential part of Ryukyuan court music and spreads throughout the island culture.'
        },
        ww2: {
          title: 'World War II',
          description: 'During the war, Okinawans crafted "kankara sanshin" from tin cans, showing their dedication to preserving their musical heritage.'
        },
        present: {
          title: 'Present Day',
          description: 'The sanshin continues to thrive globally, with communities like ours keeping the tradition alive in Shanghai.'
        }
      }
    },
    cta: {
      title: 'Join Our Musical Journey',
      description: 'Whether you\'re a beginner or an experienced musician, everyone is welcome to explore the beautiful world of sanshin music with us.',
      viewSessions: 'View Sessions',
      getInTouch: 'Get In Touch'
    }
  },
  
  sessions: {
    title: 'Class Schedule',
    description: 'Biweekly sanshin classes every other Saturday afternoon. All levels welcome!',
    scheduleTitle: 'Session Information',
    scheduleDescription: 'Our sessions are held twice a month, usually on Saturdays. Teachers announce next month\'s schedule in advance.',
    whatToBring: {
      title: 'What to Bring',
      items: [
        'Your own sanshin (rental available)',
        'Notebook for music sheets',
        'Enthusiasm to learn!'
      ]
    },
    sessionCard: {
      instructor: 'Instructor',
      location: 'Location',
      participants: 'registered',
      sessionFull: 'Session Full',
      level: {
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        advanced: 'Advanced',
        experience: 'Trial Class',
        all: 'All Levels'
      }
    },
    registration: {
      title: 'Register for Session',
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone Number',
      experience: 'Experience Level',
      experienceLevels: {
        none: 'No experience',
        beginner: 'Beginner (less than 1 year)',
        intermediate: 'Intermediate (1-3 years)',
        advanced: 'Advanced (3+ years)'
      },
      message: 'Additional Message (Optional)',
      completeRegistration: 'Complete Registration'
    }
  },
  
  contact: {
    title: 'Get In Touch',
    description: 'Interested in learning sanshin or joining our community? We\'d love to hear from you!',
    contactInfo: 'Contact Information',
    location: {
      title: 'Location',
      address: [
        'Okinawa Prefecture Beijing Office',
        'Block B, Room 1701, Xingfu Building, No.3 North Road, East 3rd Ring, Chaoyang District, Beijing'
      ]
    },
    email: 'Email',
    wechat: 'WeChat',
    wechatId: 'WeChat ID',
    responseTime: {
      title: 'Response Time',
      description: 'We typically respond within 24-48 hours'
    },
    faq: {
      title: 'Frequently Asked Questions',
      questions: {
        ownSanshin: {
          question: 'Do I need my own sanshin?',
          answer: 'No, we have rental instruments available for beginners. Once you decide to continue, we can help you purchase your own.'
        },
        cost: {
          question: 'What is the cost?',
          answer: 'First trial class is free, then ¥50 per class.'
        },
        experience: {
          question: 'Do I need prior musical experience?',
          answer: 'Not at all! We welcome complete beginners and have classes designed specifically for those new to music.'
        }
      }
    },
    form: {
      title: 'Send Us a Message',
      yourName: 'Your Name',
      emailAddress: 'Email Address',
      subject: 'Subject',
      subjects: {
        general: 'General Inquiry',
        lessons: 'About Lessons',
        schedule: 'Session Schedule',
        instrument: 'Instrument Purchase/Rental',
        other: 'Other'
      },
      message: 'Message',
      messagePlaceholder: 'Tell us what you\'d like to know...',
      sendMessage: 'Send Message',
      sending: 'Sending...'
    }
  },
  
  footer: {
    description: 'Preserving and sharing the beauty of Okinawan sanshin music in Shanghai',
    quickLinks: 'Quick Links',
    connectWithUs: 'Connect With Us',
    connectDescription: 'Join our biweekly sessions and experience the traditional sounds of Okinawa',
    rights: 'All rights reserved.'
  }
};
