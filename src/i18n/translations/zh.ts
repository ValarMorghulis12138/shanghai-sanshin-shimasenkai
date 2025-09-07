import type { Translations } from '../types';

export const zh: Translations = {
  common: {
    siteName: '上海三线岛线会',
    home: '首页',
    sessions: '课程',
    contact: '联系我们',
    register: '报名',
    submit: '提交',
    cancel: '取消',
    close: '关闭',
    loading: '加载中...'
  },
  
  home: {
    hero: {
      title: '上海三线岛线会',
      subtitle: '上海三线岛线会',
      description: '在上海传承和分享冲绳三线音乐的传统艺术',
      cta: '探索三线'
    },
    about: {
      title: '什么是三线？',
      subtitle: '冲绳音乐之魂',
      description: [
        '三线是来自日本冲绳的传统三弦乐器。600多年来，其独特的音色一直是冲绳音乐的核心。',
        '三线常被称为"冲绳班卓琴"，琴身较小，传统上覆盖蟒蛇皮或合成皮，三根琴弦能产生独特而共鸣的音色，捕捉琉球群岛的精神。',
        '该乐器在冲绳文化中扮演着核心角色，从古典宫廷音乐到民间歌曲无所不包，并继续激励着世界各地的新一代音乐家。'
      ]
    },
    features: {
      title: '我们的社区',
      biweekly: {
        title: '双周练习',
        description: '参加我们的定期练习课程，一起探索传统和现代三线音乐。'
      },
      instruction: {
        title: '专业指导',
        description: '向热衷于保护和分享冲绳音乐传统的经验丰富的老师学习。'
      },
      cultural: {
        title: '文化交流',
        description: '与同好者交流，沉浸在冲绳丰富的文化遗产中。'
      }
    },
    history: {
      title: '三线的历史',
      timeline: {
        century14: {
          title: '14世纪',
          description: '三线的祖先——中国三弦，通过贸易和文化交流传入琉球王国。'
        },
        century16: {
          title: '16世纪',
          description: '三线成为琉球宫廷音乐的重要组成部分，并在整个岛屿文化中传播。'
        },
        ww2: {
          title: '第二次世界大战',
          description: '战争期间，冲绳人用罐头制作"罐卡拉三线"，展现了他们保护音乐遗产的决心。'
        },
        present: {
          title: '现今',
          description: '三线在全球继续蓬勃发展，像我们这样的社区在上海保持着这一传统。'
        }
      }
    },
    cta: {
      title: '加入我们的音乐之旅',
      description: '无论您是初学者还是经验丰富的音乐家，欢迎每个人与我们一起探索美妙的三线音乐世界。',
      viewSessions: '查看课程',
      getInTouch: '联系我们'
    }
  },
  
  sessions: {
    title: '课程安排',
    description: '每月两次三线课程，隔周周六下午进行。欢迎所有级别的学员参加！',
    scheduleTitle: '课程信息',
    scheduleDescription: '我们的课程每月举行两次，通常在周六。老师会在前一个月确定下个月的课程日期。',
    whatToBring: {
      title: '需要携带',
      items: [
        '您自己的三线（可租赁）',
        '乐谱架',
        '记录乐谱的笔记本',
        '学习的热情！'
      ]
    },
    sessionCard: {
      instructor: '讲师',
      location: '地点',
      participants: '已报名',
      sessionFull: '课程已满',
      level: {
        beginner: '初级',
        intermediate: '中级',
        advanced: '高级',
        all: '所有级别'
      }
    },
    registration: {
      title: '课程报名',
      fullName: '姓名',
      email: '电子邮箱',
      phone: '电话号码',
      experience: '经验水平',
      experienceLevels: {
        none: '无经验',
        beginner: '初学者（少于1年）',
        intermediate: '中级（1-3年）',
        advanced: '高级（3年以上）'
      },
      message: '附加留言（选填）',
      completeRegistration: '完成报名'
    }
  },
  
  contact: {
    title: '联系我们',
    description: '有兴趣学习三线或加入我们的社区吗？我们期待您的来信！',
    contactInfo: '联系信息',
    location: {
      title: '地址',
      address: [
        '上海社区中心',
        '静安区文化路123号',
        '上海，中国 200040'
      ]
    },
    email: '电子邮箱',
    wechat: '微信',
    responseTime: {
      title: '回复时间',
      description: '我们通常在24-48小时内回复'
    },
    faq: {
      title: '常见问题',
      questions: {
        ownSanshin: {
          question: '我需要自己的三线吗？',
          answer: '不需要，我们为初学者提供租赁乐器。一旦您决定继续学习，我们可以帮助您购买自己的三线。'
        },
        cost: {
          question: '费用是多少？',
          answer: '每节课150元，或月卡500元（4节课）。首次访客可以以50元参加试听课程。'
        },
        experience: {
          question: '我需要音乐经验吗？',
          answer: '完全不需要！我们欢迎完全的初学者，并有专门为音乐新手设计的课程。'
        }
      }
    },
    form: {
      title: '给我们留言',
      yourName: '您的姓名',
      emailAddress: '电子邮箱',
      subject: '主题',
      subjects: {
        general: '一般咨询',
        lessons: '关于课程',
        schedule: '课程安排',
        instrument: '乐器购买/租赁',
        other: '其他'
      },
      message: '留言',
      messagePlaceholder: '告诉我们您想了解什么...',
      sendMessage: '发送留言',
      sending: '发送中...'
    },
    map: {
      title: '找到我们',
      interactiveMap: '交互式地图'
    }
  },
  
  footer: {
    description: '在上海传承和分享冲绳三线音乐之美',
    quickLinks: '快速链接',
    connectWithUs: '与我们联系',
    connectDescription: '参加我们的双周课程，体验冲绳的传统音乐',
    rights: '版权所有。'
  }
};
