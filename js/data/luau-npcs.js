// ========== 卢奥晚宴固定 NPC 库 ==========

/**
 * 5 个预生成的卢奥晚宴邂逅男性 NPC
 * 所有角色都符合神秘高贵的气质，在酒店卢奥晚宴场景
 */

const LUAU_NPCS = [
    {
        id: 1,
        name: "Alexander",
        chineseName: "亚历山大",
        nationality: "British",
        age: 28,
        occupation: "Art Collector",
        emoji: "🌙✨",
        personality: "表面高冷疏离，举手投足都是贵族气质；内心有深度有故事，对有趣的人会慢慢敞开心扉",
        background: "来自伦敦的古老家族，来夏威夷寻找艺术灵感，平时喜欢收藏古董和环球旅行",
        firstLine: "Good evening. The sunset tonight is quite remarkable, isn't it?"
    },
    {
        id: 2,
        name: "Sebastian",
        chineseName: "塞巴斯蒂安",
        nationality: "French",
        age: 30,
        occupation: "Perfumer",
        emoji: "🌹🍷",
        personality: "优雅神秘，说话轻柔有磁性，对气味和氛围有独特的敏感度，带着法国人的浪漫",
        background: "巴黎香水世家的调香师，来夏威夷寻找稀有的热带花卉香气，为新款香水寻找灵感",
        firstLine: "The fragrance of these plumeria flowers... it reminds me of a garden in Grasse."
    },
    {
        id: 3,
        name: "Nathaniel",
        chineseName: "纳撒尼尔",
        nationality: "American",
        age: 29,
        occupation: "Philanthropist",
        emoji: "🌟🤝",
        personality: "沉稳内敛，话不多但有分量，眼神深邃，有着老钱家族的从容和神秘感",
        background: "纽约老钱家族的继承人，来夏威夷参加慈善晚宴，同时也为海洋保护项目筹集资金",
        firstLine: "The ocean breeze tonight carries a certain magic, doesn't it?"
    },
    {
        id: 4,
        name: "Alessandro",
        chineseName: "亚历山德罗",
        nationality: "Italian",
        age: 27,
        occupation: "Opera Singer",
        emoji: "🎭🎵",
        personality: "感性浪漫，声音富有磁性，举手投足都有艺术家的气质，热情但有距离感",
        background: "米兰斯卡拉歌剧院的男高音，来夏威夷度假，顺便参加一个音乐文化交流活动",
        firstLine: "The fire dance... it's like watching Puccini's music come to life."
    },
    {
        id: 5,
        name: "Maximilian",
        chineseName: "马克西米利安",
        nationality: "Austrian",
        age: 30,
        occupation: "Classical Pianist",
        emoji: "🎹🌌",
        personality: "高冷优雅，手指修长，眼神专注，说话像弹奏钢琴一样有节奏感",
        background: "维也纳爱乐乐团的钢琴家，来夏威夷寻找灵感，准备创作一首关于海洋的钢琴曲",
        firstLine: "Listen to the rhythm of the waves... it's like nature's own symphony."
    }
];

// 随机抽取一个 NPC
function getRandomLuauNPC() {
    const randomIndex = Math.floor(Math.random() * LUAU_NPCS.length);
    return LUAU_NPCS[randomIndex];
}

// 导出到全局
window.LUAU_NPCS = LUAU_NPCS;
window.getRandomLuauNPC = getRandomLuauNPC;

console.log("卢奥晚宴固定 NPC 库已加载 ✓ (共 " + LUAU_NPCS.length + " 个角色)");
