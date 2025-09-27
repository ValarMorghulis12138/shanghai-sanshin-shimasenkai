import type { Translations } from '../types';

export const ja: Translations = {
  common: {
    siteName: '上海三線島線会',
    home: 'ホーム',
    sessions: 'セッション',
    contact: 'お問い合わせ',
    register: '登録',
    submit: '送信',
    cancel: 'キャンセル',
    close: '閉じる',
    loading: '読み込み中...'
  },
  
  home: {
    hero: {
      title: '三線島線会',
      subtitle: '',
      description: '2008年より活動する上海三線島線会。沖縄出身の演奏者・認定講師・文化大使KEISUKEが、沖縄の魂を上海にお届けします。',
      cta: '講師について'
    },
    teacher: {
      title: '講師紹介',
      name: 'KEISUKE（西原圭佑）',
      subtitle: '唄三線(Sanshin)演奏者・琉球島うた音楽協会教師',
      introduction: [
        'KEISUKE（西原圭佑）は沖縄出身。上海を拠点に唄三線(Sanshin)の演奏者として活躍中。琉球島うた音楽協会教師免許保持者。',
        '2008年より三線サークル「上海三線島線会」を立ち上げ。中国にてMongol800や喜納昌吉と同じ舞台で演者として華を添える。その他、中国各地の沖縄県関連イベントにてPRの協力をしている。',
        '2020年上海国際映画祭公式日本映画week司会＆オープニングアクト演奏を務めた。2021年より上海にて自己プロデュース沖縄料理店（海唄UMIBE）をオープン。'
      ]
    },
    certification: {
      title: '受賞歴・表彰',
      subtitle: '文化交流における功績',
      description: [
        '2022年、沖縄県政府より「沖縄民間大使」表彰を受賞。これは沖縄文化の海外普及に貢献した個人に授与される名誉ある称号です。',
        '2024年、在上海日本国総領事館より「在外公館長表彰」を受賞。これは日中文化交流の促進に対する長年の貢献が認められたものです。'
      ]
    },
    features: {
      title: '私たちのコミュニティ',
      biweekly: {
        title: '隔週セッション',
        description: '伝統的および現代的な三線音楽を一緒に探求する定期的な練習セッションに参加してください。'
      },
      instruction: {
        title: '専門的な指導',
        description: '沖縄の音楽的伝統を保存し共有することに情熱を持つ経験豊富な教師から学びましょう。'
      },
      cultural: {
        title: '文化交流',
        description: '他の愛好家とつながり、沖縄の豊かな文化遺産に浸ってください。'
      }
    },
    awards: {
      title: '受賞歴・表彰',
      ambassador: {
        title: '2022年 沖縄民間大使',
        description: '沖縄文化を国際的に推進・普及する重要な貢献に対して、沖縄県政府から授与された名誉。'
      },
      consulGeneral: {
        title: '2024年 在外公館長表彰',
        description: '沖縄音楽と文化を通じた日中文化交流の促進に対する長年の貢献が認められ、在上海日本国総領事館から授与された表彰。'
      }
    },
    gallery: {
      title: '私たちの音楽の旅の瞬間',
      ambassadorCaption: '2022年 沖縄民間大使表彰'
    },
    history: {
      title: '三線の歴史',
      timeline: {
        century14: {
          title: '14世紀',
          description: '三線の祖先である中国の三弦が、貿易と文化交流を通じて琉球王国に伝わる。'
        },
        century16: {
          title: '16世紀',
          description: '三線は琉球宮廷音楽の重要な部分となり、島全体の文化に広まる。'
        },
        ww2: {
          title: '第二次世界大戦',
          description: '戦争中、沖縄の人々は缶から「カンカラ三線」を作り、音楽遺産を守る決意を示した。'
        },
        present: {
          title: '現在',
          description: '三線は世界的に繁栄し続け、私たちのようなコミュニティが上海で伝統を生かし続けています。'
        }
      }
    },
    cta: {
      title: '私たちの音楽の旅に参加しよう',
      description: '初心者でも経験豊富なミュージシャンでも、誰もが私たちと一緒に美しい三線音楽の世界を探求することを歓迎します。',
      viewSessions: 'セッションを見る',
      getInTouch: 'お問い合わせ'
    }
  },
  
  sessions: {
    title: '練習会スケジュール',
    description: '月二回の三線練習会、隔週土曜日午後に開催。すべてのレベルの方を歓迎します！',
    scheduleTitle: '練習会情報',
    scheduleDescription: '私たちの練習会は月に2回、通常土曜日に開催されます。先生が前月に翌月の日程を決定します。',
    whatToBring: {
      title: '持ち物',
      items: [
        'ご自身の三線（レンタル可）',
        '楽譜用のノート',
        '学ぶ意欲！'
      ]
    },
    sessionCard: {
      instructor: '講師',
      location: '場所',
      participants: '名登録済み',
      sessionFull: 'セッション満員',
      level: {
        beginner: '初級',
        intermediate: '中級',
        advanced: '上級',
        experience: '体験クラス',
        all: '全レベル'
      }
    },
    registration: {
      title: 'セッション登録',
      fullName: 'お名前',
      email: 'メールアドレス',
      phone: '電話番号',
      experience: '経験レベル',
      experienceLevels: {
        none: '経験なし',
        beginner: '初心者（1年未満）',
        intermediate: '中級者（1〜3年）',
        advanced: '上級者（3年以上）'
      },
      message: '追加メッセージ（任意）',
      completeRegistration: '登録を完了'
    }
  },
  
  contact: {
    title: 'お問い合わせ',
    description: '三線を学んだり、私たちのコミュニティに参加することに興味がありますか？ぜひご連絡ください！',
    contactInfo: '連絡先情報',
    location: {
      title: '所在地',
      address: [
        '沖縄県北京事務所',
        '北京市朝陽区東三環北路3号 幸福大厦B座1701室'
      ]
    },
    email: 'メール',
    wechat: 'WeChat',
    wechatId: 'WeChat ID',
    responseTime: {
      title: '返信時間',
      description: '通常24〜48時間以内に返信します'
    },
    faq: {
      title: 'よくある質問',
      questions: {
        ownSanshin: {
          question: '自分の三線が必要ですか？',
          answer: 'いいえ、初心者向けにレンタル楽器をご用意しています。継続することを決めたら、ご自身の三線の購入をお手伝いします。'
        },
        cost: {
          question: '費用はいくらですか？',
          answer: '初回体験レッスンは無料、その後は1回50元です。'
        },
        experience: {
          question: '音楽経験は必要ですか？',
          answer: 'まったく必要ありません！完全な初心者を歓迎し、音楽初心者向けに特別に設計されたクラスがあります。'
        }
      }
    },
    form: {
      title: 'メッセージを送る',
      yourName: 'お名前',
      emailAddress: 'メールアドレス',
      subject: '件名',
      subjects: {
        general: '一般的なお問い合わせ',
        lessons: 'レッスンについて',
        schedule: 'セッションスケジュール',
        instrument: '楽器の購入/レンタル',
        other: 'その他'
      },
      message: 'メッセージ',
      messagePlaceholder: 'お知りになりたいことをお聞かせください...',
      sendMessage: 'メッセージを送信',
      sending: '送信中...'
    }
  },
  
  footer: {
    description: '上海で沖縄三線音楽の美しさを保存し共有する',
    quickLinks: 'クイックリンク',
    connectWithUs: 'つながる',
    connectDescription: '隔週のセッションに参加して、沖縄の伝統的な音を体験してください',
    rights: 'All rights reserved.'
  }
};
