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
      title: 'Shanghai Sanshi Shimasenkai',
      subtitle: 'Shanghai Sanshi Shimasenkai',
      description: 'Preserving and sharing the traditional art of Okinawan sanshin music in Shanghai',
      cta: 'Discover Sanshin'
    },
    about: {
      title: 'What is Sanshin?',
      subtitle: 'The Soul of Okinawan Music',
      description: [
        'The sanshin (三線) is a traditional three-stringed instrument from Okinawa, Japan. Its distinctive sound has been the heart of Okinawan music for over 600 years.',
        'Often called the "Okinawan banjo," the sanshin features a small body traditionally covered with python or synthetic skin, and three strings that produce a unique, resonant tone that captures the spirit of the Ryukyu Islands.',
        'The instrument plays a central role in Okinawan culture, accompanying everything from classical court music to folk songs, and continues to inspire new generations of musicians worldwide.'
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
        'Music stand',
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
        beginner: 'beginner',
        intermediate: 'intermediate',
        advanced: 'advanced',
        all: 'all levels'
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
        'Shanghai Community Center',
        '123 Culture Road, Jing\'an District',
        'Shanghai, China 200040'
      ]
    },
    email: 'Email',
    wechat: 'WeChat',
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
          answer: 'Sessions are ¥150 per class, or ¥500 for a monthly pass (4 sessions). First-time visitors can attend a trial session for ¥50.'
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
    },
    map: {
      title: 'Find Us',
      interactiveMap: 'Interactive Map'
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
