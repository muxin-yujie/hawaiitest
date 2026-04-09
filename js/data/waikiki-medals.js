// ========== 威基基海滩勋章固定事件库 ==========

/**
 * 10 个预生成的威基基海滩勋章事件
 * 覆盖 5 个三级地点，每个地点 2 个事件
 * 包含地点、人物、事件内容
 */

const WAIKIKI_MEDAL_EVENTS = [
    // ========== 1. 冲浪店 (Surf Shop) ==========
    {
        id: 1,
        location: "冲浪店",
        locationEmoji: "🏄‍♀️",
        scene: "Maya 正对着一块断裂的冲浪板发愁，板面有一道明显的裂缝，她手里拿着修补工具，看起来有些手足无措。",
        npc: {
            name: "Maya",
            emoji: "🏄‍♀️",
            age: 20,
            nationality: "American",
            occupation: "Surf Shop Assistant",
            personality: "随和友好，热爱冲浪，阳光开朗，说话带着加州口音",
            firstLine: "*holding a cracked surfboard with a worried expression* Oh no... this customer's board got damaged this morning. Can you help me hold this while I apply the resin? It's kind of tricky to do alone..."
        },
        medal: {
            icon: "🏄‍♀️",
            name: "冲浪助手",
            description: "帮助 Maya 修理冲浪板，展现了乐于助人的精神和对冲浪文化的热爱"
        }
    },
    {
        id: 2,
        location: "冲浪店",
        locationEmoji: "🏄‍♀️",
        scene: "你在冲浪店挑选装备，Maya 热情地为你介绍不同冲浪板的特点，最后你买了一块适合初学者的板。",
        npc: {
            name: "Maya",
            emoji: "🏄‍♀️",
            age: 20,
            nationality: "American",
            occupation: "Surf Shop Assistant",
            personality: "随和友好，热爱冲浪，阳光开朗，说话带着加州口音",
            firstLine: "*showing you different surfboards with enthusiasm* This one is perfect for beginners! It's stable and easy to balance. *grins* Want to give it a try? I can give you some tips on your first lesson!"
        },
        medal: {
            icon: "🛒",
            name: "冲浪新手",
            description: "在冲浪店购买了第一块冲浪板，开启了夏威夷冲浪之旅的第一步"
        }
    },
    
    // ========== 2. 彩虹刨冰店 (Shave Ice) ==========
    {
        id: 3,
        location: "彩虹刨冰店",
        locationEmoji: "🍧",
        scene: "Tutu 奶奶正手忙脚乱地为排队的顾客制作刨冰，她的老花镜滑到了鼻尖，糖浆瓶摆了一桌。",
        npc: {
            name: "Tutu",
            emoji: "👵",
            age: 68,
            nationality: "Hawaiian",
            occupation: "Shave Ice Shop Owner",
            personality: "慈祥温暖，说话慢悠悠带着夏威夷口音，喜欢叫每个人'child'或'grandchild'",
            firstLine: "*adjusting her glasses with syrupy hands* Oh, my dear child! So many customers today... *laughs warmly* Could you help me reach the blue syrup? It's on the top shelf and my arms are too short!"
        },
        medal: {
            icon: "🍧",
            name: "甜蜜帮手",
            description: "帮助 Tutu 奶奶制作彩虹刨冰，用善意传递了夏威夷的甜蜜与温暖"
        }
    },
    {
        id: 4,
        location: "彩虹刨冰店",
        locationEmoji: "🍧",
        scene: "Tutu 奶奶教你制作传统的夏威夷彩虹刨冰，从刨冰到淋糖浆，每一步都讲述着她小时候的故事。",
        npc: {
            name: "Tutu",
            emoji: "👵",
            age: 68,
            nationality: "Hawaiian",
            occupation: "Shave Ice Shop Owner",
            personality: "慈祥温暖，说话慢悠悠带着夏威夷口音，喜欢叫每个人'child'或'grandchild'",
            firstLine: "*handing you an ice shaver with a warm smile* Let me show you how my grandmother taught me, child. *starts shaving ice* Not too fast, not too slow... and the syrup, you pour it with love. Mahalo for learning our family recipe!"
        },
        medal: {
            icon: "👩‍🍳",
            name: "刨冰学徒",
            description: "向 Tutu 奶奶学习传统刨冰手艺，传承了夏威夷甜蜜的味道和家族的故事"
        }
    },
    
    // ========== 3. 阿罗哈烤虾车 (Garlic Shrimp Truck) ==========
    {
        id: 5,
        location: "阿罗哈烤虾车",
        locationEmoji: "🍤",
        scene: "Uncle Kimo 正忙着翻炒虾锅，但他的手机一直在响，他看了一眼是女儿的学校打来的，显得有些焦急。",
        npc: {
            name: "Uncle Kimo",
            emoji: "👨‍🍳",
            age: 52,
            nationality: "Hawaiian",
            occupation: "Food Truck Owner",
            personality: "豪爽热情，说话声音洪亮，喜欢讲笑话，对家人极其重视",
            firstLine: "*stirring the garlic shrimp with one hand while looking at his phone* Ah, man... my daughter's school is calling. She's sick. *looks at you with a worried expression* Could you watch the shrimp for 2 minutes? I need to call back real quick!"
        },
        medal: {
            icon: "🍤",
            name: "靠谱帮手",
            description: "在 Uncle Kimo 最需要的时候帮忙照看虾锅，用信任和责任展现了真正的阿罗哈精神"
        }
    },
    {
        id: 6,
        location: "阿罗哈烤虾车",
        locationEmoji: "🍤",
        scene: "你被烤虾的香气吸引，在虾车前停下脚步。Uncle Kimo 热情地为你推荐他的招牌蒜香黄油虾。",
        npc: {
            name: "Uncle Kimo",
            emoji: "👨‍🍳",
            age: 52,
            nationality: "Hawaiian",
            occupation: "Food Truck Owner",
            personality: "豪爽热情，说话声音洪亮，喜欢讲笑话，对家人极其重视",
            firstLine: "*flipping shrimp in the air with a big smile* Welcome! You must try my famous garlic butter shrimp! *winks* Best on the island, I promise! Want a plate? I'll give you extra rice!"
        },
        medal: {
            icon: "🍽️",
            name: "美食鉴赏家",
            description: "品尝 Uncle Kimo 的招牌烤虾，用味蕾感受了夏威夷路边美食文化的独特魅力"
        }
    },
    
    // ========== 4. 热带花环编织店 (Lei Shop) ==========
    {
        id: 7,
        location: "热带花环编织店",
        locationEmoji: "🌺",
        scene: "Halia 正在教一个小女孩编织花环，但小女孩的手指不够灵活，总是编不好，急得快哭了。",
        npc: {
            name: "Halia",
            emoji: "🌺",
            age: 34,
            nationality: "Hawaiian",
            occupation: "Lei Artist",
            personality: "温柔耐心，说话轻柔如花香，对夏威夷传统文化充满热爱和敬意",
            firstLine: "*kneeling down to comfort the crying girl* It's okay, sweetie... *looks up at you* Could you help me show her how to hold the flowers? Sometimes it's easier to learn from someone new."
        },
        medal: {
            icon: "🌺",
            name: "花环导师",
            description: "帮助小女孩学习编织花环，用耐心和爱心传承了夏威夷的传统文化"
        }
    },
    {
        id: 8,
        location: "热带花环编织店",
        locationEmoji: "🌺",
        scene: "Halia 耐心地教你编织传统的夏威夷花环，从选择鲜花到编织手法，每一步都蕴含着文化的故事。",
        npc: {
            name: "Halia",
            emoji: "🌺",
            age: 34,
            nationality: "Hawaiian",
            occupation: "Lei Artist",
            personality: "温柔耐心，说话轻柔如花香，对夏威夷传统文化充满热爱和敬意",
            firstLine: "*showing you how to thread the plumeria* Each lei tells a story, you know. *weaves flowers skillfully* This pattern is called 'haku lei' - it's been passed down for generations. Would you like to make one to take home? Mahalo for learning our culture!"
        },
        medal: {
            icon: "💐",
            name: "花环学徒",
            description: "向 Halia 学习编织传统夏威夷花环，用双手感受了花香中的文化传承"
        }
    },
    
    // ========== 5. 尤克里里音乐教室 (Ukulele School) ==========
    {
        id: 9,
        location: "尤克里里音乐教室",
        locationEmoji: "🎵",
        scene: "Nalu 正在给一群小朋友上尤克里里课，但有个小男孩总是弹不好，沮丧地想把琴放下。",
        npc: {
            name: "Nalu",
            emoji: "🎸",
            age: 28,
            nationality: "Hawaiian",
            occupation: "Music Teacher",
            personality: "阳光活力，说话带着音乐的节奏感，相信每个人都能学会音乐",
            firstLine: "*strumming his ukulele with an encouraging smile* Don't give up, buddy! *to you* Hey, could you help me show him the chords? Sometimes kids learn better from a friend!"
        },
        medal: {
            icon: "🎵",
            name: "音乐伙伴",
            description: "帮助小朋友学习尤克里里，用鼓励和陪伴点燃了音乐梦想的火花"
        }
    },
    {
        id: 10,
        location: "尤克里里音乐教室",
        locationEmoji: "🎵",
        scene: "Nalu 教你弹奏简单的夏威夷民歌，从和弦到节奏，他边弹边唱着关于海洋和阳光的歌。",
        npc: {
            name: "Nalu",
            emoji: "🎸",
            age: 28,
            nationality: "Hawaiian",
            occupation: "Music Teacher",
            personality: "阳光活力，说话带着音乐的节奏感，相信每个人都能学会音乐",
            firstLine: "*strumming a cheerful melody* Let me teach you 'Aloha Oe' - it's the most famous Hawaiian song! *smiles* Put your finger here... strum gently... yes! You're playing Hawaiian music now! Mahalo for learning with me!"
        },
        medal: {
            icon: "🎶",
            name: "尤克里里新手",
            description: "向 Nalu 学习弹奏尤克里里和夏威夷民歌，用音符记录了阳光海滩的美好回忆"
        }
    }
];

// 随机抽取一个事件
function getRandomWaikikiMedalEvent() {
    const randomIndex = Math.floor(Math.random() * WAIKIKI_MEDAL_EVENTS.length);
    return WAIKIKI_MEDAL_EVENTS[randomIndex];
}

// 按地点筛选事件
function getWaikikiMedalEventsByLocation(locationName) {
    return WAIKIKI_MEDAL_EVENTS.filter(event => event.location === locationName);
}

// 导出到全局
window.WAIKIKI_MEDAL_EVENTS = WAIKIKI_MEDAL_EVENTS;
window.getRandomWaikikiMedalEvent = getRandomWaikikiMedalEvent;
window.getWaikikiMedalEventsByLocation = getWaikikiMedalEventsByLocation;

console.log("威基基海滩勋章固定事件库已加载 ✓ (共 " + WAIKIKI_MEDAL_EVENTS.length + " 个事件)");
