# 🌺 《夏威夷邂逅》商业化游戏设计文档

> **版本**: 1.0  
> **技术栈**: 纯 HTML/CSS/JavaScript (ES6+)  
> **目标平台**: Web / PWA / 移动端 H5  
> **更新日期**: 2026-04-16

---

## 📖 目录

1. [游戏概述](#1-游戏概述)
2. [核心玩法系统](#2-核心玩法系统)
3. [商业化设计](#3-商业化设计)
4. [技术架构](#4-技术架构)
5. [数据结构设计](#5-数据结构设计)
6. [UI/UX 设计](#6-uiux-设计)
7. [开发计划](#7-开发计划)
8. [运营策略](#8-运营策略)

---

## 1. 游戏概述

### 1.1 游戏简介

《夏威夷邂逅》是一款**沉浸式英语恋爱文字冒险游戏**，玩家扮演一名中国女大学生，在夏威夷旅行期间邂逅三位性格迥异的 NPC，通过英语对话提升好感度，解锁浪漫剧情。

### 1.2 目标用户

- **主要用户**: 18-30 岁女性，英语学习者，恋爱模拟游戏爱好者
- **次要用户**: 夏威夷旅游爱好者，视觉小说玩家

### 1.3 核心卖点

- 🎓 **英语学习**: 真实场景对话，提升英语口语
- 💕 **恋爱模拟**: 多角色攻略路线，多结局
- 🌺 **夏威夷风情**: 精美场景 CG，异域文化体验
- 📱 **轻松游玩**: 碎片化时间，单手可操作

### 1.4 盈利模式

- **章节解锁**: 第一章免费，后续章节付费
- **内购道具**: 钻石、体力、服装、提示
- **会员订阅**: 月卡/永久会员特权
- **广告变现**: 激励视频 + 插屏广告

---

## 2. 核心玩法系统

### 2.1 对话系统

#### 2.1.1 对话流程

```
玩家选择/输入 → 消耗体力 → NPC 回复 → 好感度变化 → 解锁新选项
```

#### 2.1.2 对话选项类型

| 类型 | 说明 | 好感度变化 | 解锁条件 |
|------|------|------------|----------|
| 💕 浪漫 | 表达好感 | +3~5 | 默认 |
| 🌺 友好 | 礼貌回应 | +1~2 | 默认 |
| ⚡ 快速 | 简短回复 | +0~1 | 默认 |
| 💎 特殊 | 消耗钻石 | +5~10 | 付费解锁 |
| 🎯 完美 | 最佳回答 | +8~12 | 提示后解锁 |

#### 2.1.3 对话规则

```javascript
// 对话配置
const DIALOGUE_CONFIG = {
  staminaCost: 1,           // 每次对话消耗体力
  maxFreeDialogues: 20,     // 每日免费对话次数
  dialogueRecoverTime: 300, // 体力恢复时间（秒）
  affectionDecayRate: 0.01  // 好感度自然衰减率（每日）
}
```

### 2.2 好感度系统

#### 2.2.1 好感度等级

| 等级 | 数值范围 | 解锁内容 |
|------|----------|----------|
| 陌生 | 0-19 | 基础对话 |
| 认识 | 20-39 | 个人故事 |
| 朋友 | 40-59 | 约会邀请 |
| 暧昧 | 60-79 | 特殊 CG |
| 恋人 | 80-99 | 专属剧情 |
| 真爱 | 100 | 结局路线 |

#### 2.2.2 好感度获取方式

| 方式 | 数值 | 说明 |
|------|------|------|
| 普通对话 | +1~3 | 日常交流 |
| 正确选项 | +3~5 | 选择喜欢的回答 |
| 完美回答 | +8~12 | 使用提示后 |
| 赠送礼物 | +5~15 | 消耗道具 |
| 特殊剧情 | +10~20 | 关键节点 |
| 每日登录 | +1 | 签到奖励 |

#### 2.2.3 好感度衰减

```javascript
// 好感度衰减规则
function calculateAffinityDecay(currentAffinity, daysInactive) {
  const decayRate = 0.02 // 每日 2% 衰减
  const decayed = currentAffinity * (1 - decayRate * daysInactive)
  return Math.max(0, Math.floor(decayed))
}
```

### 2.3 剧情章节系统

#### 2.3.1 章节结构

```
📖 第一章：初次邂逅（FREE）
  ├─ Scene 1: 威基基海滩相遇
  ├─ Scene 2: 冲浪课程
  └─ Scene 3: 海边日落

📖 第二章：花店奇遇（$2.99）
  ├─ Scene 1: 偶遇花店
  ├─ Scene 2: 学习花语
  └─ Scene 3: 情人节特别事件

📖 第三章：音乐之夜（$2.99）
  ├─ Scene 1: 街头表演
  ├─ Scene 2: 合唱邀请
  └─ Scene 3: 后台告白

📖 最终章：夏威夷之恋（$4.99）
  ├─ Route A: Koa 线 - 海滩婚礼
  ├─ Route B: Leilani 线 - 花店主人
  ├─ Route C: Kai 线 - 音乐之旅
  └─ Route D: 单身线 - 自我成长
```

#### 2.3.2 章节解锁条件

```javascript
const CHAPTER_REQUIREMENTS = {
  chapter_1: {
    price: 0, // 免费
    requirement: null
  },
  chapter_2: {
    price: 2.99,
    requirement: {
      chapter_1_completed: true,
      koa_affinity_min: 50
    }
  },
  chapter_3: {
    price: 2.99,
    requirement: {
      chapter_2_completed: true,
      leilani_affinity_min: 60
    }
  },
  final_chapter: {
    price: 4.99,
    requirement: {
      chapter_3_completed: true,
      all_npcs_affinity_min: 80
    }
  }
}
```

### 2.4 体力系统

#### 2.4.1 体力规则

```javascript
const STAMINA_CONFIG = {
  maxStamina: 20,           // 体力上限
  recoverPerMinute: 1,      // 每 5 分钟恢复 1 点
  recoverInterval: 300,     // 恢复间隔（秒）
  dialogueCost: 1,          // 对话消耗
  refillSmall: {            // 小瓶体力
    amount: 5,
    price_diamonds: 50
  },
  refillLarge: {            // 大瓶体力
    amount: 20,
    price_diamonds: 180
  }
}
```

#### 2.4.2 体力获取方式

| 方式 | 数值 | 冷却时间 |
|------|------|----------|
| 自然恢复 | +1 | 5 分钟 |
| 每日签到 | +10 | 每日 |
| 观看广告 | +5 | 每日 3 次 |
| 钻石购买 | +5/+20 | 无限制 |
| 升级奖励 | +20 | 每次升级 |
| 成就奖励 | +10~50 | 一次性 |

### 2.5 经济系统

#### 2.5.1 货币类型

| 货币 | 图标 | 获取方式 | 用途 |
|------|------|----------|------|
| 💎 钻石 | 💎 | 充值、成就、活动 | 购买体力、服装、提示 |
| 🪙 金币 | 🪙 | 对话、签到、广告 | 购买基础道具 |
| ❤️ 爱心 | ❤️ | 好感度奖励 | 解锁特殊剧情 |

#### 2.5.2 钻石获取

| 方式 | 数值 | 说明 |
|------|------|------|
| 每日签到 | 5 | 连续签到递增 |
| 升级奖励 | 10~50 | 每级奖励 |
| 成就完成 | 20~100 | 一次性 |
| 活动奖励 | 50~500 | 限时活动 |
| 充值 | 100~1200 | 内购 |

#### 2.5.3 内购套餐

```javascript
const PURCHASE_PACKAGES = {
  // 钻石套餐
  diamonds_small: {
    id: 'diamonds_small',
    name: '小钻石包',
    price: 0.99,
    currency: 'USD',
    diamonds: 100,
    bonus: 0,
    popular: false
  },
  diamonds_medium: {
    id: 'diamonds_medium',
    name: '中钻石包',
    price: 4.99,
    currency: 'USD',
    diamonds: 550,
    bonus: 50,
    popular: true
  },
  diamonds_large: {
    id: 'diamonds_large',
    name: '大钻石包',
    price: 9.99,
    currency: 'USD',
    diamonds: 1200,
    bonus: 200,
    popular: false
  },
  
  // 章节解锁
  chapter_2: {
    id: 'chapter_2',
    name: '解锁第二章',
    price: 2.99,
    type: 'chapter',
    permanent: true
  },
  
  // 会员订阅
  subscription_monthly: {
    id: 'sub_monthly',
    name: '月度会员',
    price: 4.99,
    currency: 'USD',
    duration_days: 30,
    benefits: [
      '无限体力',
      '专属剧情',
      '每日 100 钻石',
      '免广告'
    ]
  },
  subscription_lifetime: {
    id: 'sub_lifetime',
    name: '永久会员',
    price: 19.99,
    currency: 'USD',
    duration_days: 9999,
    benefits: [
      '所有月度会员权益',
      '永久有效',
      '专属头像框',
      '优先更新体验'
    ]
  }
}
```

### 2.6 成就系统

#### 2.6.1 成就分类

| 分类 | 说明 | 成就数量 |
|------|------|----------|
| 📖 剧情 | 章节通关 | 10 个 |
| 💕 好感 | 好感度达成 | 15 个 |
| 💬 对话 | 对话相关 | 10 个 |
| 📚 学习 | 英语学习 | 8 个 |
| 🎯 收集 | 收集要素 | 12 个 |
| 🏆 特殊 | 隐藏成就 | 5 个 |

#### 2.6.2 成就示例

```javascript
const ACHIEVEMENTS = {
  first_contact: {
    id: 'first_contact',
    name: '初次邂逅',
    description: '与任意 NPC 进行第一次对话',
    icon: '🌺',
    reward: { diamonds: 20 },
    difficulty: 'easy'
  },
  talkative: {
    id: 'talkative',
    name: '健谈者',
    description: '累计进行 100 次对话',
    icon: '💬',
    reward: { diamonds: 50, title: '话痨' },
    difficulty: 'medium'
  },
  popular: {
    id: 'popular',
    name: '人气王',
    description: '所有 NPC 好感度达到 100',
    icon: '💕',
    reward: { diamonds: 200, cg: 'special_ending' },
    difficulty: 'hard'
  },
  english_master: {
    id: 'english_master',
    name: '英语大师',
    description: '学会 500 个单词',
    icon: '📚',
    reward: { diamonds: 300, title: '语言学家' },
    difficulty: 'hard'
  }
}
```

### 2.7 收集系统

#### 2.7.1 收集要素

| 类型 | 数量 | 说明 |
|------|------|------|
| 📸 CG 图片 | 50+ | 剧情、活动获取 |
| 👗 服装 | 30+ | 商店购买、成就奖励 |
| 🎵 BGM | 20+ | 解锁隐藏音乐 |
| 📝 日记 | 无限 | 玩家自动记录 |
| 🏅 勋章 | 60+ | 成就系统 |

#### 2.7.2 CG 获取方式

```javascript
const CG_SOURCES = {
  story: '剧情自动解锁',
  affinity: '好感度里程碑',
  choice: '关键选择分支',
  event: '限时活动',
  purchase: '商城购买',
  achievement: '成就奖励'
}
```

---

## 3. 商业化设计

### 3.1 付费点设计

#### 3.1.1 付费转化漏斗

```
免费玩家 (100%)
  ↓ 体验第一章
感兴趣用户 (60%)
  ↓ 看到付费点
付费意向用户 (30%)
  ↓ 首充优惠
首充用户 (15%)
  ↓ 持续内容
重复付费用户 (8%)
  ↓ 深度养成
核心付费用户 (3%)
```

#### 3.1.2 首充引导设计

```javascript
const FIRST_PURCHASE_CONFIG = {
  trigger_points: [
    'chapter_1_end',      // 第一章结束
    'stamina_empty',      // 体力耗尽
    'affinity_stuck',     // 好感度卡住
    'perfect_choice_fail' // 错过完美选项
  ],
  
  first_charge_bonus: {
    price: 0.99,
    value: 300, // 钻石 + 道具
    display: '首充 3 倍返利！'
  }
}
```

### 3.2 广告系统设计

#### 3.2.1 广告类型

| 类型 | 触发时机 | 奖励 | 每日次数 |
|------|----------|------|----------|
| 📺 激励视频 | 玩家主动点击 | +5 体力 | 3 次 |
| 📺 激励视频 | 获得提示 | 免费提示 | 3 次 |
| 📺 激励视频 | 双倍奖励 | 奖励翻倍 | 5 次 |
| 📺 插屏广告 | 章节结束 | 无 | 1 次 |

#### 3.2.2 广告配置

```javascript
const AD_CONFIG = {
  rewarded_video: {
    provider: 'AdMob',
    placement_ids: {
      stamina: 'ca-app-pub-xxx/stamina',
      hint: 'ca-app-pub-xxx/hint',
      double_reward: 'ca-app-pub-xxx/double'
    },
    cooldown: 30 // 秒
  },
  interstitial: {
    provider: 'AdMob',
    placement: 'ca-app-pub-xxx/interstitial',
    show_interval: 1800 // 30 分钟
  }
}
```

### 3.3 会员系统设计

#### 3.3.1 会员权益

| 权益 | 免费用户 | 月卡会员 | 永久会员 |
|------|----------|----------|----------|
| 体力上限 | 20 | 50 | 50 |
| 体力恢复 | 5 分钟/点 | 2 分钟/点 | 2 分钟/点 |
| 每日钻石 | 0 | 10 | 10 |
| 广告 | 有 | 无 | 无 |
| 专属剧情 | ❌ | ✅ | ✅ |
| 专属服装 | ❌ | ✅ | ✅ |
| 客服优先 | ❌ | ✅ | ✅ |
| 活动优先 | ❌ | ✅ | ✅ |

#### 3.3.2 会员价格策略

```javascript
const SUBSCRIPTION_PRICING = {
  monthly: {
    price: 4.99,
    trial_days: 3, // 首月 3 天免费试用
    auto_renew: true
  },
  quarterly: {
    price: 12.99, // 省 20%
    trial_days: 7,
    auto_renew: true
  },
  yearly: {
    price: 39.99, // 省 33%
    trial_days: 14,
    auto_renew: true
  },
  lifetime: {
    price: 19.99, // 限时优惠
    one_time: true
  }
}
```

### 3.4 活动系统设计

#### 3.4.1 活动类型

| 活动类型 | 频率 | 说明 |
|----------|------|------|
| 📅 每日签到 | 每日 | 登录领奖励 |
| 📅 周末特惠 | 周末 | 钻石折扣 |
| 📅 节日活动 | 节日 | 限定剧情/服装 |
| 📅 限时挑战 | 不定期 | 排行榜竞赛 |
| 📅 充值返利 | 不定期 | 充值额外赠送 |

#### 3.4.2 活动配置示例

```javascript
const EVENT_CONFIG = {
  valentine_2026: {
    id: 'valentine_2026',
    name: '情人节特别篇',
    start_date: '2026-02-10',
    end_date: '2026-02-17',
    content: {
      special_chapter: '情人节约会',
      limited_costume: '情人节礼服',
      double_affinity: true
    },
    rewards: {
      login_bonus: 100,
      purchase_bonus: 50
    }
  }
}
```

---

## 4. 技术架构

### 4.1 整体架构

```
┌─────────────────────────────────────────┐
│           表现层 (UI Layer)             │
│  ┌─────────┬─────────┬─────────────┐   │
│  │  首页   │  游戏页  │  商城/设置  │   │
│  └─────────┴─────────┴─────────────┘   │
├─────────────────────────────────────────┤
│          业务逻辑层 (Service Layer)      │
│  ┌──────┬──────┬──────┬──────┬──────┐  │
│  │对话  │好感度│ 剧情 │ 经济 │ 成就 │  │
│  │系统  │ 系统 │ 系统 │ 系统 │ 系统 │  │
│  └──────┴──────┴──────┴──────┴──────┘  │
├─────────────────────────────────────────┤
│          数据层 (Data Layer)            │
│  ┌────────────┬────────────────────┐   │
│  │ localStorage │  IndexedDB      │   │
│  │ (配置/存档)  │  (大量数据)      │   │
│  └────────────┴────────────────────┘   │
├─────────────────────────────────────────┤
│         第三方服务层 (External)          │
│  ┌──────┬──────┬──────┬──────┐        │
│  │ 支付 │ 广告 │ 统计 │ 推送 │        │
│  └──────┴──────┴──────┴──────┘        │
└─────────────────────────────────────────┘
```

### 4.2 文件结构

```
hawaii_game/
├── index.html              # 主入口
├── css/
│   ├── main.css           # 主样式
│   ├── components.css     # 组件样式
│   └── animations.css     # 动画样式
├── js/
│   ├── app.js             # 应用入口
│   ├── core/
│   │   ├── GameState.js   # 状态管理
│   │   ├── EventBus.js    # 事件总线
│   │   └── ResourceManager.js # 资源管理
│   ├── systems/
│   │   ├── DialogueSystem.js
│   │   ├── AffinitySystem.js
│   │   ├── StorySystem.js
│   │   ├── EconomySystem.js
│   │   └── AchievementSystem.js
│   ├── ui/
│   │   ├── components/    # UI 组件
│   │   ├── screens/       # 页面
│   │   └── utils.js       # UI 工具
│   ├── commerce/
│   │   ├── PaymentSystem.js
│   │   ├── AdSystem.js
│   │   └── SubscriptionSystem.js
│   ├── data/
│   │   ├── npcs.js        # NPC 数据
│   │   ├── stories.js     # 剧情数据
│   │   ├── items.js       # 道具数据
│   │   └── config.js      # 配置数据
│   └── utils/
│       ├── storage.js     # 存储工具
│       ├── analytics.js   # 统计工具
│       └── helpers.js     # 辅助函数
├── assets/
│   ├── images/            # 图片资源
│   ├── audio/             # 音频资源
│   └── fonts/             # 字体资源
└── manifest.json          # PWA 配置
```

### 4.3 核心模块设计

#### 4.3.1 游戏状态管理

```javascript
// core/GameState.js
class GameState {
  constructor() {
    this.state = {
      player: {
        id: null,
        name: '',
        level: 1,
        exp: 0
      },
      resources: {
        diamonds: 0,
        coins: 0,
        hearts: 0,
        stamina: 20
      },
      npcs: {},
      chapters: {},
      achievements: [],
      inventory: [],
      settings: {
        music: true,
        sfx: true,
        notifications: true
      },
      stats: {
        totalDialogues: 0,
        totalLoginDays: 0,
        firstLogin: null,
        lastLogin: null
      }
    }
    
    this.load()
  }
  
  save() {
    localStorage.setItem('hawaii_game_save', JSON.stringify(this.state))
  }
  
  load() {
    const saved = localStorage.getItem('hawaii_game_save')
    if (saved) {
      this.state = JSON.parse(saved)
    }
  }
  
  reset() {
    this.state = {}
    this.save()
  }
}
```

#### 4.3.2 事件总线

```javascript
// core/EventBus.js
class EventBus {
  constructor() {
    this.events = {}
  }
  
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }
  
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data))
    }
  }
  
  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback)
    }
  }
}

// 全局事件
const gameEvents = new EventBus()

// 事件类型
const GAME_EVENTS = {
  DIALOGUE_START: 'dialogue_start',
  DIALOGUE_END: 'dialogue_end',
  AFFINITY_CHANGE: 'affinity_change',
  CHAPTER_UNLOCK: 'chapter_unlock',
  ACHIEVEMENT_UNLOCK: 'achievement_unlock',
  RESOURCE_CHANGE: 'resource_change',
  PURCHASE_SUCCESS: 'purchase_success'
}
```

### 4.4 存储策略

#### 4.4.1 数据存储方案

| 数据类型 | 存储方式 | 说明 |
|----------|----------|------|
| 游戏存档 | localStorage | 核心数据 |
| 大量数据 | IndexedDB | CG、日志等 |
| 临时数据 | sessionStorage | 会话数据 |
| 敏感数据 | 加密存储 | 支付信息 |

#### 4.4.2 存档结构

```javascript
const SAVE_DATA_STRUCTURE = {
  version: '1.0.0',
  timestamp: Date.now(),
  player: {
    id: 'uuid',
    name: '玩家名',
    level: 1,
    exp: 0
  },
  progress: {
    current_chapter: 'chapter_1',
    current_scene: 'scene_3',
    unlocked_chapters: ['chapter_1'],
    completed_scenes: []
  },
  relationships: {
    koa: { affinity: 65, level: 'friend' },
    leilani: { affinity: 30, level: 'stranger' },
    kai: { affinity: 45, level: 'acquaintance' }
  },
  resources: {
    diamonds: 100,
    coins: 500,
    hearts: 10,
    stamina: 20
  },
  inventory: {
    items: [],
    costumes: [],
    cgs: []
  },
  achievements: [],
  statistics: {
    playTime: 0,
    dialogues: 0,
    logins: 0
  }
}
```

---

## 5. 数据结构设计

### 5.1 NPC 数据结构

```javascript
const NPC_DATA = {
  koa: {
    id: 'koa',
    name: 'Koa',
    chineseName: '科阿',
    age: 24,
    occupation: '冲浪教练',
    personality: ['阳光', '热情', '直率'],
    interests: ['冲浪', '海洋', '摄影'],
    background: '土生土长的夏威夷人，热爱海洋文化',
    appearance: {
      emoji: '🏄',
      avatar: 'assets/images/npcs/koa_avatar.png',
      fullbody: 'assets/images/npcs/koa_fullbody.png'
    },
    voice: {
      tone: '阳光活力',
      catchphrases: ['Aloha!', 'Awesome!', 'Let\'s go!']
    },
    story_routes: ['beach', 'sunset', 'wedding'],
    gifts: {
      love: ['冲浪板蜡', '海洋照片'],
      like: ['防晒霜', '相机'],
      neutral: ['饮料', '零食'],
      dislike: ['城市纪念品']
    }
  },
  
  leilani: {
    id: 'leilani',
    name: 'Leilani',
    chineseName: '蕾拉妮',
    age: 22,
    occupation: '花店老板娘',
    personality: ['温柔', '优雅', '神秘'],
    interests: ['花卉', '园艺', '调香'],
    background: '花店世家传人，精通花语',
    // ... 更多属性
  },
  
  kai: {
    id: 'kai',
    name: 'Kai',
    chineseName: '凯',
    age: 25,
    occupation: '街头音乐家',
    personality: ['文艺', '内向', '敏感'],
    interests: ['音乐', '作曲', '观星'],
    background: '追寻音乐梦想的流浪歌手',
    // ... 更多属性
  }
}
```

### 5.2 剧情数据结构

```javascript
const STORY_DATA = {
  chapter_1: {
    id: 'chapter_1',
    title: '初次邂逅',
    description: '在威基基海滩遇见冲浪教练 Koa',
    npc: 'koa',
    scenes: [
      {
        id: 'scene_1',
        title: '海滩相遇',
        background: 'assets/images/bg/beach_day.jpg',
        dialogues: [
          {
            id: 'd1',
            speaker: 'koa',
            text: 'Aloha! Welcome to Waikiki Beach!',
            translations: '你好！欢迎来到威基基海滩！',
            expression: 'smile'
          },
          {
            id: 'd1_player',
            choices: [
              {
                text: 'Aloha! It\'s beautiful here!',
                translation: '你好！这里真美！',
                affinity_change: 3,
                next: 'd2'
              },
              {
                text: 'Hi! I\'m new here.',
                translation: '嗨！我是新来的。',
                affinity_change: 1,
                next: 'd2'
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### 5.3 对话数据结构

```javascript
const DIALOGUE_TEMPLATES = {
  greetings: [
    { text: 'Aloha!', translation: '你好！' },
    { text: 'How are you?', translation: '你好吗？' },
    { text: 'Nice to meet you!', translation: '很高兴见到你！' }
  ],
  
  compliments: [
    { text: 'You look great!', translation: '你看起来很棒！' },
    { text: 'I love your smile!', translation: '我喜欢你的笑容！' }
  ],
  
  questions: [
    { text: 'What\'s your name?', translation: '你叫什么名字？' },
    { text: 'Where are you from?', translation: '你来自哪里？' }
  ]
}
```

---

## 6. UI/UX 设计

### 6.1 界面设计规范

#### 6.1.1 色彩方案

```css
:root {
  /* 主色调 - 夏威夷风情 */
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --accent-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  
  /* 功能色 */
  --success: #4CAF50;
  --warning: #FFB300;
  --error: #F44336;
  --info: #2196F3;
  
  /* 中性色 */
  --text-primary: #333333;
  --text-secondary: #666666;
  --text-disabled: #999999;
  --border: #E0E0E0;
  --background: #F5F5F5;
}
```

#### 6.1.2 字体规范

```css
/* 字体栈 */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
               'Noto Sans SC', 'Arial', sans-serif;
}

/* 字号规范 */
.text-xs { font-size: 12px; }
.text-sm { font-size: 14px; }
.text-base { font-size: 16px; }
.text-lg { font-size: 18px; }
.text-xl { font-size: 20px; }
.text-2xl { font-size: 24px; }
```

### 6.2 核心界面设计

#### 6.2.1 主界面布局

```
┌──────────────────────────────────────────┐
│ 顶部状态栏                                │
│ 💎 0  |  ⚡ 20/20  |  👤 Lv.5          │
├──────────────────────────────────────────┤
│                                          │
│           场景背景图                      │
│                                          │
│    ┌──────────────────────────┐         │
│    │  NPC 立绘                 │         │
│    │                          │         │
│    └──────────────────────────┘         │
│                                          │
│  ┌────────────────────────────┐         │
│  │  对话气泡                   │         │
│  │  "Aloha! Ready to surf?"   │         │
│  └────────────────────────────┘         │
├──────────────────────────────────────────┤
│  选项 1  │  选项 2                       │
│  选项 3  │  选项 4                       │
├──────────────────────────────────────────┤
│  [输入框]              [发送] [💎 提示]  │
├──────────────────────────────────────────┤
│  🏠首页  📖剧情  💕NPC  🛒商城  ⚙️设置  │
└──────────────────────────────────────────┘
```

#### 6.2.2 NPC 列表页

```
┌──────────────────────────────────────────┐
│  ← 返回        邂逅角色        🔍 搜索  │
├──────────────────────────────────────────┤
│                                          │
│  ┌────────────────────────────┐         │
│  │  👤 Koa                    │         │
│  │  冲浪教练                  │         │
│  │  💕 65/100  ████████░░     │         │
│  │  状态：在线                │         │
│  └────────────────────────────┘         │
│                                          │
│  ┌────────────────────────────┐         │
│  │  👤 Leilani                │         │
│  │  花店老板娘                │         │
│  │  💕 30/100  ████░░░░░░     │         │
│  │  状态：忙碌                │         │
│  └────────────────────────────┘         │
│                                          │
│  ┌────────────────────────────┐         │
│  │  👤 Kai                    │         │
│  │  街头音乐家                │         │
│  │  💕 45/100  █████░░░░░     │         │
│  │  状态：演出中              │         │
│  └────────────────────────────┘         │
│                                          │
└──────────────────────────────────────────┘
```

#### 6.2.3 商城界面

```
┌──────────────────────────────────────────┐
│  ← 返回          商城          🛒 购物车 │
├──────────────────────────────────────────┤
│  [钻石] [体力] [章节] [服装] [会员]      │
├──────────────────────────────────────────┤
│  💎 热门礼包                             │
│  ┌────────────────────────────┐         │
│  │  💎💎💎💎💎💎💎💎💎💎      │         │
│  │  首充特惠                   │         │
│  │  原价 300 钻石               │         │
│  │  ⭐ 现价 0.99 USD           │         │
│  │  [立即购买]                │         │
│  └────────────────────────────┘         │
│                                          │
│  📖 章节解锁                             │
│  ┌────────────────────────────┐         │
│  │  第二章：花店奇遇          │         │
│  │  🔒 需 Koa 好感度 50        │         │
│  │  $2.99  [解锁]             │         │
│  └────────────────────────────┘         │
│                                          │
│  👑 会员服务                             │
│  ┌────────────────────────────┐         │
│  │  月度会员                   │         │
│  │  $4.99/月                   │         │
│  │  ✓ 无限体力 ✓ 免广告       │         │
│  │  [免费试用 3 天]             │         │
│  └────────────────────────────┘         │
└──────────────────────────────────────────┘
```

### 6.3 动画效果

#### 6.3.1 核心动画

```css
/* 淡入淡出 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 滑入效果 */
@keyframes slideIn {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* 弹跳效果 */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* 心跳效果 */
@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* 使用示例 */
.fade-in { animation: fadeIn 0.3s ease; }
.slide-in { animation: slideIn 0.4s ease; }
.bounce { animation: bounce 0.6s ease infinite; }
.heartbeat { animation: heartbeat 1s ease infinite; }
```

---

## 7. 开发计划

### 7.1 开发阶段

#### Phase 1: MVP 版本 (2 周)

**目标**: 可玩的第一章 + 基础商业化

```
Week 1:
├─ Day 1-2: 项目架构 + 核心状态管理
├─ Day 3-4: 对话系统实现
├─ Day 5-6: 好感度系统 + NPC 数据
└─ Day 7: 第一章剧情内容

Week 2:
├─ Day 8-9: UI 组件库
├─ Day 10-11: 商业化系统 (支付 + 广告)
├─ Day 12-13: 测试 + 优化
└─ Day 14: 上线准备
```

#### Phase 2: 内容扩充 (3 周)

**目标**: 完整三章 + 多 NPC 路线

```
Week 3: 第二章开发
Week 4: 第三章开发
Week 5: 最终章 + 多结局
```

#### Phase 3: 运营功能 (2 周)

**目标**: 活动系统 + 数据分析

```
Week 6: 活动系统 + 签到系统
Week 7: 数据分析 + 性能优化
```

### 7.2 里程碑

| 版本 | 日期 | 内容 | 目标 |
|------|------|------|------|
| v0.1 | 2026-04-30 | MVP 完成 | 内部测试 |
| v0.5 | 2026-05-15 | 第一章完整 | 封闭测试 |
| v1.0 | 2026-05-30 | 三章齐全 | 公开上线 |
| v1.5 | 2026-06-30 | 活动系统 | 首次活动 |
| v2.0 | 2026-07-30 | 社交功能 | 用户增长 |

---

## 8. 运营策略

### 8.1 用户获取

#### 8.1.1 获客渠道

| 渠道 | 方式 | 预算 | 预期转化 |
|------|------|------|----------|
| 社交媒体 | TikTok/Instagram | $500/月 | 1000 用户 |
| KOL 合作 | 游戏博主推广 | $1000/月 | 2000 用户 |
| 应用商店 | ASO 优化 | $200/月 | 500 用户 |
| 广告投放 | Google/FB 广告 | $1000/月 | 1500 用户 |

#### 8.1.2 裂变机制

```javascript
const REFERRAL_PROGRAM = {
  referrer_reward: 100, // 推荐人获得 100 钻石
  referee_reward: 50,   // 被推荐人获得 50 钻石
  max_referrals: 10,    // 最多推荐 10 人
  special_reward: 500   // 推荐 10 人额外奖励
}
```

### 8.2 留存策略

#### 8.2.1 留存机制

| 机制 | 说明 | 预期提升 |
|------|------|----------|
| 每日签到 | 连续签到奖励递增 | +15% 次日留存 |
| 体力系统 | 限制游戏时长 | +10% 7 日留存 |
| 限时活动 | 周期性活动 | +20% 月留存 |
| 推送通知 | 提醒上线 | +25% 回流率 |

#### 8.2.2 推送策略

```javascript
const PUSH_NOTIFICATIONS = {
  stamina_full: {
    trigger: 'stamina >= 20',
    title: '体力已满！',
    message: '快来继续和 Koa 的浪漫对话吧～💕',
    delay: 0
  },
  
  daily_reminder: {
    trigger: 'daily',
    time: '19:00',
    title: '夏威夷在等你！',
    message: '今天的签到奖励还没领哦～💎'
  },
  
  event_start: {
    trigger: 'event_start',
    title: '新活动开启！',
    message: '情人节限定剧情上线，快来体验！🌺'
  }
}
```

### 8.3 收入优化

#### 8.3.1 关键指标

| 指标 | 目标值 | 计算方式 |
|------|--------|----------|
| DAU | 1000+ | 日活跃用户 |
| ARPU | $0.5+ | 平均每用户收入 |
| ARPPU | $5+ | 平均每付费用户收入 |
| 付费率 | 5%+ | 付费用户占比 |
| LTV | $3+ | 用户生命周期价值 |

#### 8.3.2 收入预测

```
假设 DAU = 1000
付费率 = 5% → 日付费用户 50 人
ARPPU = $5 → 日收入 $250
月收入 = $250 × 30 = $7,500

成本:
- 服务器：$100/月
- API 调用：$500/月
- 营销：$2000/月
- 其他：$400/月

月利润 = $7,500 - $3,000 = $4,500
```

---

## 附录

### A. API 集成文档

#### A.1 支付接口

```javascript
// Stripe 支付集成
async function createPayment(packageId) {
  const response = await fetch('/api/create-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ packageId })
  })
  return response.json()
}
```

#### A.2 广告接口

```javascript
// AdMob 激励视频
function showRewardedAd(plACEMENT) {
  // 广告展示逻辑
}
```

### B. 数据分析指标

```javascript
// 关键事件追踪
analytics.track('tutorial_complete')
analytics.track('first_purchase')
analytics.track('chapter_unlock')
analytics.track('affinity_max')
```

### C. 法律合规

- ✅ 隐私政策
- ✅ 用户协议
- ✅ 儿童隐私保护 (COPPA)
- ✅ GDPR 合规
- ✅ 支付安全 (PCI DSS)

---

## 📝 文档更新记录

| 版本 | 日期 | 更新内容 | 作者 |
|------|------|----------|------|
| 1.0 | 2026-04-16 | 初始版本 | AI Assistant |

---

**文档结束**
