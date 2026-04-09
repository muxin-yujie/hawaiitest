// ========== 机场勋章固定事件库 ==========

/**
 * 10 个预生成的机场勋章事件
 * 所有事件都符合夏威夷檀香山国际机场到达大厅的场景设定
 * 包含事件场景、NPC 人物、勋章名字
 */

const AIRPORT_MEDAL_EVENTS = [
    {
        id: 1,
        scene: "在行李转盘旁，一位穿着职业装的女士正费力地拖着三个巨大的行李箱，看起来手忙脚乱。",
        npc: {
            name: "Jennifer Williams",
            emoji: "👩‍💼",
            age: 42,
            nationality: "American",
            occupation: "Business Consultant",
            personality: "理性干练、说话简洁有力，但看到流浪猫会瞬间融化，蹲下来温柔地打招呼。对时间管理近乎偏执，但愿意为陌生人花时间。",
            firstLine: "*struggling with oversized suitcases* Oh my goodness, these are so heavy... *turns to you with an embarrassed smile* Could you give me a hand? I'm afraid I packed too much for this trip!"
        },
        medal: {
            icon: "💪",
            name: "热心旅伴",
            description: "主动帮助陌生旅伴搬运行李，用善意点亮了机场的偶遇时光"
        }
    },
    {
        id: 2,
        scene: "在机场信息牌下，一对年轻情侣正困惑地研究着航班信息，女孩手里拿着皱巴巴的机票。",
        npc: {
            name: "Marco Rossi",
            emoji: "👨‍🎓",
            age: 26,
            nationality: "Italian",
            occupation: "Graduate Student",
            personality: "热情洋溢、手势丰富，说话时眼睛会发光。对旅行充满好奇，喜欢用蹩脚的英语和所有人交流，从不害怕犯错。",
            firstLine: "*pointing at the departure board with confusion* Scusa... we're looking for Gate E7. Is this the right direction? *shows you the boarding pass* Our flight to Kona leaves in 20 minutes!"
        },
        medal: {
            icon: "🗺️",
            name: "活地图",
            description: "为迷茫的旅人指明方向，用热情帮助他人找到正确的登机口"
        }
    },
    {
        id: 3,
        scene: "在海关排队处，一位老奶奶焦急地翻找着护照，语言不通让她更加手足无措。",
        npc: {
            name: "Yuki Tanaka",
            emoji: "👵",
            age: 68,
            nationality: "Japanese",
            occupation: "Retired Teacher",
            personality: "温和慈祥、说话轻声细语，总是带着温暖的笑容。虽然年迈但内心坚强，独自旅行寻找年轻时的回忆。",
            firstLine: "*frantically searching through her bag with trembling hands* Sumimasen... I can't find my passport... *looks at you with teary eyes* This is my first time traveling alone..."
        },
        medal: {
            icon: "🛂",
            name: "暖心天使",
            description: "帮助语言不通的老人解决困难，用耐心和善意跨越了语言和文化的障碍"
        }
    },
    {
        id: 4,
        scene: "在机场咖啡厅，一位商务男士的笔记本电脑突然没电了，他焦急地看着即将开始的视频会议。",
        npc: {
            name: "David Chen",
            emoji: "💼",
            age: 35,
            nationality: "Canadian",
            occupation: "Software Engineer",
            personality: "沉稳内敛、逻辑清晰，说话条理分明。看似高冷但内心温暖，会在关键时刻伸出援手。",
            firstLine: "*checking his dead laptop with a worried expression* Excuse me... do you happen to have a USB-C charger? *shows you his empty phone* My meeting starts in 10 minutes and I can't find any available outlets..."
        },
        medal: {
            icon: "🔌",
            name: "及时雨",
            description: "在他人危急时刻伸出援手，用小小的帮助解决了大大的问题"
        }
    },
    {
        id: 5,
        scene: "在到达大厅的长椅上，一位年轻妈妈正手忙脚乱地照顾哭闹的婴儿，周围人投来异样的目光。",
        npc: {
            name: "Sarah Johnson",
            emoji: "👶",
            age: 29,
            nationality: "Australian",
            occupation: "Nurse",
            personality: "温柔耐心、充满母爱，说话总是带着安抚的语气。即使在压力下也能保持冷静，是朋友眼中的定心丸。",
            firstLine: "*trying to calm her crying baby while looking exhausted* I'm so sorry... *gives you an apologetic smile* He's never been on a plane before. Would you mind... could you help me hold the diaper bag?"
        },
        medal: {
            icon: "🤱",
            name: "守护天使",
            description: "在他人最需要帮助的时候出现，用理解和行动温暖了陌生的旅途"
        }
    },
    {
        id: 6,
        scene: "在机场商店，一位韩国留学生想买夏威夷特产但不知道选什么，拿着商品犹豫不决。",
        npc: {
            name: "Min-jun Park",
            emoji: "🎓",
            age: 22,
            nationality: "Korean",
            occupation: "University Student",
            personality: "阳光开朗、好奇心强，说话带着青春的活力。第一次来夏威夷，对一切都充满新鲜感。",
            firstLine: "*holding a box of macadamia nuts with confusion* Annyeong... Excuse me, do you know which local snacks are good to bring home? *shows you his phone with a translation app* I want to buy gifts for my family but there are so many choices!"
        },
        medal: {
            icon: "🎁",
            name: "购物达人",
            description: "用本地知识帮助他人挑选特产，让购物的过程充满欢笑和建议"
        }
    },
    {
        id: 7,
        scene: "在洗手间外，一位法国女士的钱包掉在地上，里面的现金和信用卡散落一地。",
        npc: {
            name: "Camille Dubois",
            emoji: "👜",
            age: 31,
            nationality: "French",
            occupation: "Photographer",
            personality: "优雅浪漫、观察力敏锐，说话带着艺术家的感性。喜欢用镜头记录美好瞬间，对色彩和光影有独特理解。",
            firstLine: "*kneeling down to pick up scattered items with a shocked expression* Mon Dieu! *looks up at you with relief* Oh, thank you so much! I didn't even notice my bag was open..."
        },
        medal: {
            icon: "💰",
            name: "拾金不昧",
            description: "捡到他人财物主动归还，用诚实和善良展现了最美的品格"
        }
    },
    {
        id: 8,
        scene: "在机场餐厅，一位巴西游客对着菜单发愁，她不会英语也不知道该点什么。",
        npc: {
            name: "Gabriela Silva",
            emoji: "🍽️",
            age: 27,
            nationality: "Brazilian",
            occupation: "Restaurant Manager",
            personality: "热情奔放、笑容灿烂，说话时手势丰富。热爱美食和旅行，喜欢尝试不同的料理和文化。",
            firstLine: "*pointing at the menu with a confused look* Com licença... I don't understand English very well. *shows you a translation app* What do you recommend? I'm so hungry after that long flight!"
        },
        medal: {
            icon: "🍜",
            name: "美食向导",
            description: "帮助语言不通的游客点餐，用美食架起了文化交流的桥梁"
        }
    },
    {
        id: 9,
        scene: "在机场长椅上，一位德国老人独自坐着，他的轮椅轮子被卡住了，无法移动。",
        npc: {
            name: "Hans Mueller",
            emoji: "♿",
            age: 72,
            nationality: "German",
            occupation: "Retired Engineer",
            personality: "严谨认真、话不多但很有深度，说话条理清晰。虽然年迈但思维敏捷，喜欢分享人生智慧。",
            firstLine: "*trying to free his wheelchair wheel with difficulty* Entschuldigung... *looks at you with a slight smile* My wheel is stuck. Could you help me push it forward a bit?"
        },
        medal: {
            icon: "🦽",
            name: "无障碍使者",
            description: "帮助行动不便的人士解决困难，用行动诠释了什么是真正的关怀和尊重"
        }
    },
    {
        id: 10,
        scene: "在机场到达大厅的角落，一位菲律宾女孩蹲在地上哭泣，她的手机丢了，联系不上接机的家人。",
        npc: {
            name: "Maria Santos",
            emoji: "📱",
            age: 19,
            nationality: "Filipino",
            occupation: "High School Student",
            personality: "天真单纯、感情丰富，说话带着少女的羞涩。第一次独自出远门，对未知充满恐惧但也满怀期待。",
            firstLine: "*crying softly while holding her empty hands* I'm sorry... *looks up with red eyes* I lost my phone... I can't call my tita... *shows you a paper with a phone number* Can I use your phone?"
        },
        medal: {
            icon: "📞",
            name: "心灵慰藉",
            description: "在他人最脆弱的时刻给予安慰和帮助，用善意驱散了陌生城市的恐惧"
        }
    }
];

// 随机抽取一个事件
function getRandomAirportMedalEvent() {
    const randomIndex = Math.floor(Math.random() * AIRPORT_MEDAL_EVENTS.length);
    return AIRPORT_MEDAL_EVENTS[randomIndex];
}

// 导出到全局
window.AIRPORT_MEDAL_EVENTS = AIRPORT_MEDAL_EVENTS;
window.getRandomAirportMedalEvent = getRandomAirportMedalEvent;

console.log("机场勋章固定事件库已加载 ✓ (共 " + AIRPORT_MEDAL_EVENTS.length + " 个事件)");
