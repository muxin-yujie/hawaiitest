// ========== NPC 管理模块 ==========
// 版本：v3 - 2024-01-01 - 添加语言规则调试
console.log('🔥🔥 npc.js 已加载 - 版本 v3 🔥🔥🔥');

// ========== 全局 NPC 语言规则 ==========
const NPC_LANGUAGE_RULES = `【强制语言规则】
❗️❗️❗️ 你必须只说英语！绝对不要说中文！❗️❗️❗️

1. 只说英语，绝对不要说中文
2. 动作描述词必须用英文，并用斜体表示（如 *smiles*, *nods*, *laughs*）
3. 绝对不要用中文动作词！不要用括号（）包含动作！
4. 保持自然、真实的英语对话风格

【对话格式】
- 你只需要生成英语对话
- 系统会自动在下方显示中文翻译
- 上方 = 英语原文（带英文动作词）
- 下方 = 中文翻译（由系统生成）
- 你不需要自己写中文翻译！

【正确示例】
✅ *smiles warmly* "Aloha! Welcome to our shop!"
✅ *gently places the lei on the table* "Would you like to try making one?"
✅ *eyes curving like crescent moons* "That's wonderful!"

【错误示例】
❌ （微笑着）"Aloha!" 
❌ （眼睛弯成月牙）"That's wonderful!"
❌ （轻轻将花环放在桌上）"Would you like to try?"
❌ "Aloha!" (你好)  ← 不要自己加中文翻译`

/**
 * 清理 NPC 对话中的中文动作词（防御性处理）
 * 如果 AI 错误地生成了中文动作词，用括号（）包裹，就删除整个括号内容
 * @param {string} text - AI 生成的原始对话
 * @returns {string} - 清理后的对话
 */
function cleanNpcDialogue(text) {
    if (!text) return text;
    // 删除所有中文括号及其中的内容（包括全角括号和半角括号）
    return text
        .replace(/（[^）]*）/g, '')  // 删除全角括号及其中文内容
        .replace(/\([^)]*\)/g, '')  // 删除半角括号及其中文内容（防御性）
        .replace(/\s+/g, ' ')        // 合并多余空格
        .trim();
}

/**
 * 获取 NPC 的角色定义
 * 优先级：FIXED_NPCS > AIRPORT_NPCS > LUAU_NPCS > 默认
 */
function getNpcRole(npcName) {
    let npc = null;
    
    // 1. 使用 FIXED_NPCS 中的定义（统一集中管理）
    if (window.FIXED_NPCS && window.FIXED_NPCS[npcName]) {
        npc = window.FIXED_NPCS[npcName];
    }
    // 2. 使用 AIRPORT_NPCS 中的定义（机场邂逅）
    else if (window.AIRPORT_NPCS) {
        npc = window.AIRPORT_NPCS.find(n => n.name === npcName);
    }
    // 3. 使用 LUAU_NPCS 中的定义（卢奥晚宴邂逅）
    else if (window.LUAU_NPCS) {
        npc = window.LUAU_NPCS.find(n => n.name === npcName);
    }
    
    // 如果找到了 NPC 数据
    if (npc) {
        // 优先使用 rolePrompt（如果有）
        if (npc.rolePrompt) {
            // 如果 rolePrompt 中已经包含语言规则，直接返回
            if (npc.rolePrompt.includes('【语言规则】') || npc.rolePrompt.includes('动作描述词必须用英文') || npc.rolePrompt.includes('强制语言规则')) {
                return npc.rolePrompt;
            }
            // 否则在 rolePrompt 前面添加全局语言规则（放在最前面）
            return NPC_LANGUAGE_RULES + '\n\n' + npc.rolePrompt;
        }
        // 否则生成标准 prompt，并在前面添加语言规则
        const description = npc.description || npc.background || '';
        return NPC_LANGUAGE_RULES + '\n\n你是' + npc.name + '，' + npc.age + '岁，' + npc.nationality + '，职业是' + npc.occupation + '。' + npc.personality + '。' + description;
    }
    
    // 4. 默认角色（也添加语言规则）
    return "你是一个友好的人，用英语交流，热情帮助他人。\n\n" + NPC_LANGUAGE_RULES;
}

// ========== 2. 辅助函数 ==========

// 地点 Emoji 映射表（统一管理）
const LOCATION_EMOJI_MAP = {
    "檀香山国际机场": "✈️",
    "海关": "🛂",
    "到达大厅": "🌺",
    "威基基海滩": "🏖️",
    "钻石头山": "🌋",
    "珍珠港": "⚓",
    "古兰尼牧场": "🏞️",
    "恐龙湾": "🐠",
    "酒店": "🏨",
    "冲浪店": "🏄",
    "餐厅": "🍹",
    "观景台": "📸",
    "登山步道": "🥾",
    "纪念品店": "🎁",
    "博物馆": "🏛️",
    "游客中心": "ℹ️",
    "码头": "⚓",
    "探险中心": "🏕️",
    "骑马场": "🐎",
    "瀑布观景点": "💦"
};

/**
 * 获取 NPC 的 emoji 图标
 * 优先级：encounters > FIXED_NPCS > 默认
 */
function getNpcEmoji(npcName) {
    // 1. 从 encounters 中查找（动态添加的 NPC）
    const encounter = gameState.encounters.find(e => e.name === npcName);
    if (encounter && encounter.emoji) {
        return encounter.emoji;
    }
    
    // 2. 从 FIXED_NPCS 查找
    if (window.FIXED_NPCS && window.FIXED_NPCS[npcName]) {
        return window.FIXED_NPCS[npcName].emoji;
    }
    
    // 3. 默认 emoji
    return "👤";
}

/**
 * 获取地点的 emoji 图标
 */
function getLocationEmoji(locationName) {
    return LOCATION_EMOJI_MAP[locationName] || "📍";
}

// ========== 2. 辅助函数 ==========

/**
 * 保存固定 NPC 到 encounters（如 Maya、Lani 等）
 * @param {Object} npcData - 固定 NPC 的数据对象
 */
function saveFixedNpcToEncounters(npcData) {
    const encounter = {
        ...npcData,
        hasInvitation: false,
        invitationStatus: null,
        invitationData: null,
        conversationCount: 0
    };
    
    // 检查是否已存在
    const existing = gameState.encounters.find(e => e.name === npcData.name);
    if (existing) {
        console.log(`固定 NPC ${npcData.name} 已存在`);
        return existing;
    }
    
    gameState.encounters.push(encounter);
    console.log(`固定 NPC ${npcData.name} 已添加到 encounters`);
    
    return encounter;
}

/**
 * 保存随机 NPC 到 encounters（来自 encounter 事件）
 * @param {Object} npcData - 随机 NPC 的数据对象
 * @param {string} scene - 相遇场景
 */
function saveRandomNpcToEncounters(npcData, scene) {
    const encounter = {
        ...npcData,
        scene: scene || "夏威夷",
        description: npcData.description || `在${scene}遇到的${npcData.occupation}`,
        hasInvitation: false,
        invitationStatus: null,
        invitationData: null,
        conversationCount: 0,
        met: true
    };
    
    // 检查是否已存在
    const existing = gameState.encounters.find(e => e.name === npcData.name);
    if (existing) {
        console.log(`随机 NPC ${npcData.name} 已存在`);
        return existing;
    }
    
    gameState.encounters.push(encounter);
    console.log(`随机 NPC ${npcData.name} 已添加到 encounters`);
    
    return encounter;
}
console.log("NPC 管理模块已加载 ✓");

// 暴露到全局作用域
window.getNpcRole = getNpcRole;
window.getNpcEmoji = getNpcEmoji;
window.getLocationEmoji = getLocationEmoji;
window.getDynamicNpcRole = getDynamicNpcRole;
window.cleanNpcDialogue = cleanNpcDialogue;  // 暴露清理函数
