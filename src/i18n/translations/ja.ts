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
      title: '上海三線島線会',
      subtitle: '',
      description: '上海で沖縄三線音楽の伝統芸術を保存し共有する',
      cta: '三線を探る'
    },
    about: {
      title: '三線とは？',
      subtitle: '沖縄音楽の魂',
      description: [
        '三線（さんしん）は日本の沖縄の伝統的な三弦楽器です。その独特な音色は600年以上にわたって沖縄音楽の中心となってきました。',
        '「沖縄バンジョー」とも呼ばれる三線は、伝統的にニシキヘビまたは合成皮で覆われた小さな胴体と、琉球諸島の精神を捉える独特で共鳴する音色を生み出す3本の弦が特徴です。',
        'この楽器は沖縄文化の中心的な役割を果たし、古典的な宮廷音楽から民謡まですべてを伴奏し、世界中の新世代のミュージシャンにインスピレーションを与え続けています。'
      ]
    },
    features: {
      title: '私たちのコミュニティ',
      biweekly: {
        title: '隔週セッション',
        description: '伝統的および現代的な三線音楽を一緒に探求する定期的な練習セッションに参加してください。'
      },
      instruction: {
        title: '専門指導',
        description: '沖縄の音楽伝統を保存し共有することに情熱を持つ経験豊富な教師から学びます。'
      },
      cultural: {
        title: '文化交流',
        description: '同じ趣味を持つ仲間とつながり、沖縄の豊かな文化遺産に浸ってください。'
      }
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
        '上海コミュニティセンター',
        '静安区文化路123号',
        '上海、中国 200040'
      ]
    },
    email: 'メール',
    wechat: 'WeChat',
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
          answer: 'セッションは1回150元、または月額パス500元（4セッション）です。初回の方は50元でトライアルセッションに参加できます。'
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
    },
    map: {
      title: '場所を見つける',
      interactiveMap: 'インタラクティブマップ'
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
