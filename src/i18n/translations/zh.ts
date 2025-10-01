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
    loading: '加载中...',
    location: '地点',
    time: '时间',
    date: '日期',
    type: '类型',
    edit: '编辑',
    delete: '删除',
    save: '保存',
    add: '添加',
    confirm: '确认',
    logout: '退出登录'
  },
  
  home: {
    hero: {
      title: '三线岛线会',
      subtitle: '',
      description: '由冲绳演奏家、认证讲师、冲绳民间大使KEISUKE（琉球小哥）带领，自2008年起将冲绳之魂带到上海。',
      cta: '认识我们的老师'
    },
    teacher: {
      title: '讲师介绍',
      name: 'KEISUKE（西原圭佑/琉球小哥keisuke）',
      subtitle: '冲绳传统乐器三线的传承人',
      introduction: [
        'KEISUKE（西原圭佑）是冲绳县人，冲绳传统乐器三线(Sanshin)的传承人。持有"琉球岛うた(歌)音乐协会"教师证。',
        '自2008年起，作为"上海三线岛线会"的负责人，每月定期指导弹唱三线。在中国各地介绍泡盛酒，冲绳音乐等冲绳文化。',
        '2021年在上海开了一家冲绳料理餐厅(海呗UMIBE)，定期办演唱会。2022年获得冲绳县政府"冲绳民间大使"荣誉，2024年获得在上海日本国总领事馆"在外公馆长表彰"。'
      ]
    },
    certification: {
      title: '专业资质',
      subtitle: '三线教育领域的卓越认证',
      description: [
        'KEISUKE老师持有冲绳县三线协会颁发的权威大师教师认证。这个认证不仅代表了技术的精通，还代表了对冲绳音乐历史和文化传统的深刻了解。',
        
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
        description: '与其他爱好者联系，沉浸在冲绳丰富的文化遗产中。'
      }
    },
    awards: {
      title: '荣誉与表彰',
      ambassador: {
        title: '2022年冲绳民间大使',
        description: '因在国际上推广和传播冲绳文化方面做出的重要贡献，获得冲绳县政府颁发的荣誉。'
      },
      consulGeneral: {
        title: '2024年在外公馆长表彰',
        description: '因通过冲绳音乐和文化长期促进中日文化交流做出的贡献，获得在上海日本国总领事馆颁发的表彰。'
      }
    },
    gallery: {
      title: '我们音乐之旅的精彩瞬间',
      ambassadorCaption: '2022年冲绳民间大使表彰'
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
    scheduleDescription: '我们的课程每月举行两次，通常在周六。在前一个月确定下个月的课程日期。',
    whatToBring: {
      title: '需要携带',
      items: [
        '您自己的三线（可租赁）',
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
        experience: '体验课',
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
      completeRegistration: '完成报名',
      success: '报名成功！',
      failed: '报名失败，请重试',
      error: '报名出错',
      cancelConfirm: '确定要取消报名吗？',
      cancelled: '已取消报名',
      cancelFailed: '取消失败，请重试',
      yourName: '您的姓名',
      yourEmail: '您的邮箱',
      enterName: '请输入姓名',
      enterEmail: '请输入邮箱',
      savedInfo: '✓ 您的信息已保存，方便下次使用',
      clearSavedInfo: '清除保存的信息',
      confirmRegistration: '确认报名',
      eventRegistration: '活动报名',
      classRegistration: '课程报名'
    },
    noSessionsThisMonth: '本月暂无课程安排',
    specialEvent: '特殊活动',
    registered: '已报名',
    full: '已满',
    registerNow: '立即报名',
    cancel: '取消报名',
    more: '更多',
    recentMonths: '显示最近3个月的课程安排',
    schedule: {
      biweekly: '每月两次，隔周周六',
      classTime: '每节课50分钟，休息10分钟'
    }
  },
  
  contact: {
    title: '联系我们',
    description: '有兴趣学习三线或加入我们的社区吗？我们期待您的来信！',
    contactInfo: '联系信息',
    location: {
      title: '地址',
      address: [
        '冲绳县北京事务所',
        '北京市朝阳区东三环北路3号 幸福大厦B座1701室'
      ]
    },
    email: '电子邮箱',
    wechat: '微信',
    wechatId: '微信ID',
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
          answer: '首次体验课免费，以后每节课50元。'
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
    }
  },
  
  footer: {
    description: '在上海传承和分享冲绳三线音乐之美',
    quickLinks: '快速链接',
    connectWithUs: '与我们联系',
    connectDescription: '参加我们的双周课程，体验冲绳的传统音乐',
    rights: '版权所有。'
  },
  
  admin: {
    teacherLogin: '教师登录',
    enterPassword: '请输入密码',
    login: '登录',
    incorrectPassword: '密码错误',
    loginFailed: '登录失败，请重试',
    sessionManagement: '课程管理',
    addNewSession: '+ 添加新课程',
    changePassword: '修改密码',
    newPassword: '新密码',
    confirmPassword: '确认密码',
    passwordsDoNotMatch: '两次输入的密码不一致',
    passwordTooShort: '密码至少需要6个字符',
    passwordUpdated: '密码修改成功',
    passwordUpdateFailed: '密码修改失败',
    regularClasses: '常规组课',
    specialEvent: '特殊活动',
    eventInfo: '活动信息',
    eventName: '活动名称',
    eventNamePlaceholder: '例如：沖縄県人会',
    eventDescription: '活动描述',
    eventDescriptionPlaceholder: '活动详情...',
    startTime: '开始时间',
    endTime: '结束时间',
    maxParticipants: '最大参与人数',
    classSchedule: '课程安排',
    addClass: '添加课程',
    confirmDelete: '确定要删除这个课程吗？',
    deleteSuccess: '删除成功',
    deleteFailed: '删除失败',
    saved: '保存成功',
    saveFailed: '保存失败',
    added: '添加成功',
    addFailed: '添加失败',
    classes: '节课',
    teacherAccess: '教师管理入口',
    teacherAccessHint: '教师可以使用密码登录管理课程'
  },
  
  cities: {
    shanghai: {
      name: '上海',
      branch: '三线岛线会上海分会'
    },
    beijing: {
      name: '北京',
      branch: '三线岛线会北京分会',
      underConstruction: '网站建设中',
      comingSoon: '北京分会即将推出！请继续关注我们的更新。'
    },
    fuzhou: {
      name: '福州',
      branch: '三线岛线会福州分会',
      underConstruction: '网站建设中',
      comingSoon: '福州分会即将推出！请继续关注我们的更新。'
    }
  }
};
