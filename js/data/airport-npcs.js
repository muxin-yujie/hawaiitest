// ========== 机场邂逅固定 NPC 库 ==========

/**
 * 10 个预生成的机场邂逅男性 NPC
 * 所有角色都符合夏威夷檀香山国际机场到达大厅的场景设定
 */

const AIRPORT_NPCS = [
    {
        id: 1,
        name: "Hiroshi",
        chineseName: "弘志",
        nationality: "Japanese",
        age: 24,
        occupation: "Documentary Photographer",
        emoji: "📷🌺",
        personality: "安静内敛但观察力敏锐，说话温和有条理，对光影和瞬间有独特的敏感度",
        background: "受日本国家地理委托，来夏威夷拍摄关于传统冲浪文化与现代冲浪运动对比的纪录片，已经在欧胡岛待了三周",
        firstLine: "Excuse me, could you tell me where the baggage claim area is? My phone just ran out of battery."
    },
    {
        id: 2,
        name: "Gabriel",
        chineseName: "加布里埃尔",
        nationality: "Brazilian",
        age: 22,
        occupation: "Marine Biology Student",
        emoji: "🌊🐢",
        personality: "热情开朗的阳光大男孩，说话时眼睛会发光，对海洋生物有着纯粹的热爱",
        background: "里约热内卢联邦大学海洋生物学专业的学生，来夏威夷进行为期两个月的海龟迁徙研究实习",
        firstLine: "Hi! Sorry to bother you, but do you know if there's a shuttle to the Waikiki Aquarium from here?"
    },
    {
        id: 3,
        name: "Sebastian",
        chineseName: "塞巴斯蒂安",
        nationality: "German",
        age: 29,
        occupation: "Architect",
        emoji: "🏛️✈️",
        personality: "沉稳理性，话不多但每句都有深度，有着德国人特有的严谨和对美的独特理解",
        background: "慕尼黑建筑事务所的设计师，来夏威夷研究传统波利尼西亚建筑与现代度假酒店的融合设计",
        firstLine: "Pardon me, I'm looking for the car rental counter. Is it in this direction?"
    },
    {
        id: 4,
        name: "Mateo",
        chineseName: "马特奥",
        nationality: "Spanish",
        age: 26,
        occupation: "Flamenco Dancer",
        emoji: "💃🎸",
        personality: "感性浪漫，肢体语言丰富，说话像诗歌一样有节奏感，充满艺术气息",
        background: "塞维利亚的弗拉门戈舞者，受邀参加夏威夷国际舞蹈节，顺便学习草裙舞与弗拉门戈的共通之处",
        firstLine: "Hola! The flight was long, wasn't it? Do you happen to know what time it is now?"
    },
    {
        id: 5,
        name: "Liam",
        chineseName: "利亚姆",
        nationality: "Irish",
        age: 23,
        occupation: "Folk Musician",
        emoji: "🎵🍀",
        personality: "幽默风趣，说话带着爱尔兰口音，喜欢讲故事，能用音乐表达情感",
        background: "都柏林的民谣歌手，来夏威夷参加凯尔特 - 波利尼西亚音乐节，寻找两种文化的音乐共鸣",
        firstLine: "Hey there! By any chance, do you know where I can find a guitar shop around here?"
    },
    {
        id: 6,
        name: "Alexander",
        chineseName: "亚历山大",
        nationality: "Greek",
        age: 28,
        occupation: "Philosophy PhD Candidate",
        emoji: "📚🏺",
        personality: "深邃沉静，说话慢条斯理但有哲理，喜欢思考抽象问题，有着学者的气质",
        background: "雅典大学哲学系博士生，研究古希腊哲学与波利尼西亚原住民智慧的联系，来夏威夷做田野调查",
        firstLine: "Hello. Could you direct me to the information desk? I need to arrange my accommodation."
    },
    {
        id: 7,
        name: "Ethan",
        chineseName: "伊森",
        nationality: "Canadian",
        age: 25,
        occupation: "Wildlife Photographer",
        emoji: "🦅📸",
        personality: "耐心细致，话少但观察入微，习惯用镜头记录世界，有着户外工作者的朴实",
        background: "温哥华的自由摄影师，正在为《国家地理》拍摄夏威夷濒危鸟类的专题，已经追踪了两个月",
        firstLine: "Hi, sorry to interrupt. Do you know if there's a nature reserve shuttle that leaves from the airport?"
    },
    {
        id: 8,
        name: "Julian",
        chineseName: "朱利安",
        nationality: "French",
        age: 27,
        occupation: "Pastry Chef",
        emoji: "🥐🍰",
        personality: "精致优雅，说话轻柔有礼貌，对美食有着近乎偏执的追求，有着法国人的浪漫",
        background: "巴黎蓝带厨艺学校的毕业生，来夏威夷学习传统夏威夷甜点，打算在里昂开一家融合餐厅",
        firstLine: "Bonjour! Excuse me, could you tell me where I can find local Hawaiian food around here?"
    },
    {
        id: 9,
        name: "Noah",
        chineseName: "诺亚",
        nationality: "Australian",
        age: 21,
        occupation: "Surf Instructor",
        emoji: "🏄‍♂️☀️",
        personality: "阳光活力，说话直接爽快，热爱冒险和挑战，有着澳洲人的随性和热情",
        background: "黄金海岸的冲浪教练，来夏威夷参加国际冲浪教练培训，学习欧胡岛北岸的冲浪技巧",
        firstLine: "G'day! Just landed, huh? Do you know which bus goes to the North Shore?"
    },
    {
        id: 10,
        name: "Kai Nakamura",
        chineseName: "凯·中村",
        nationality: "Japanese-Hawaiian",
        age: 26,
        occupation: "Cultural Heritage Photographer",
        emoji: "📸🌺",
        personality: "拥有日裔和夏威夷混血的独特气质，五官深邃立体，笑容温暖如夏威夷阳光。说话时带着慵懒的岛民节奏，但眼神专注而深情。既有日本人的细腻敏感，又有夏威夷人的随性洒脱，举手投足间散发着自然的魅力。",
        background: "出生在夏威夷的日裔第三代，从小在欧胡岛长大。受祖父（二战后移民到夏威夷的日本摄影师）影响，用镜头记录夏威夷多元文化融合的故事。作品曾在东京和檀香山的美术馆展出。精通日语、英语和夏威夷语，喜欢在清晨拍摄日出时的哈雷瓦海滩，说那时的光线最有灵魂。",
        firstLine: "*adjusting his camera strap with a warm smile* Aloha... sorry, I couldn't help but notice you look a bit lost. *his voice has a relaxed island rhythm* First time in Hawaii? I'm Kai, by the way. If you need any local tips, I'd be happy to share."
    },
    {
        id: 11,
        name: "William",
        chineseName: "威廉",
        nationality: "British",
        age: 30,
        occupation: "Travel Writer",
        emoji: "✍️🗺️",
        personality: "成熟稳重，谈吐优雅，有丰富的旅行经验，善于观察和记录不同文化",
        background: "伦敦的旅行作家，为《孤独星球》撰写夏威夷深度游指南，已经是第五次来夏威夷了",
        firstLine: "Hello there. Pardon me, but could you recommend any good local guides or maps available here?"
    }
];

// 随机抽取一个 NPC
function getRandomAirportNPC() {
    const randomIndex = Math.floor(Math.random() * AIRPORT_NPCS.length);
    return AIRPORT_NPCS[randomIndex];
}

// 导出到全局
window.AIRPORT_NPCS = AIRPORT_NPCS;
window.getRandomAirportNPC = getRandomAirportNPC;

console.log("机场邂逅固定 NPC 库已加载 ✓ (共 " + AIRPORT_NPCS.length + " 个角色)");
