// ========================================
// 🎮 夏威夷游戏配置中心
// ========================================
// 注意：此文件包含敏感信息，不要提交到 GitHub！
// 请将此文件添加到 .gitignore

const GAME_CONFIG = {
    // ============ AI 配置 ============
    ai: {
        API_URL: "https://api.deepseek.com/v1/chat/completions",
        API_KEY: "sk-a0e31c0e743847eea76c53ba20fa985f",  // ⚠️ 请替换为你的 API Key
        DIALOGUE_MAX_TOKENS: 800,
        DIALOGUE_TEMPERATURE: 0.8,
        NARRATION_MAX_TOKENS: 600,
        NARRATION_TEMPERATURE: 0.7
    },
    
    // ============ 对话配置 ============
    dialogue: {
        // 各场景最大/最小对话轮数
        CUSTOMS_MIN_TURNS: 2,
        CUSTOMS_MAX_TURNS: 6,
        
        ENCOUNTER_MIN_TURNS: 4,
        ENCOUNTER_MAX_TURNS: 6,
        
        MEDAL_MIN_TURNS: 3,
        MEDAL_MAX_TURNS: 5,
        
        GUIDE_MIN_TURNS: 2,
        GUIDE_MAX_TURNS: 4,
        
        HOTEL_MIN_TURNS: 3,
        HOTEL_MAX_TURNS: 6,
        
        LOCATION_MIN_TURNS: 4,
        LOCATION_MAX_TURNS: 6,
        
        // 是否需要告别词
        REQUIRE_FAREWELL: {
            CUSTOMS: false,
            ENCOUNTER: true,
            MEDAL: false,
            GUIDE: false,
            HOTEL: false,
            LOCATION: true
        },
        
        // 文化提示生成概率
        CULTURE_TIP_PROBABILITY: 0.9
    },
    
    // ============ 概率配置 ============
    probability: {
        ENCOUNTER_CHANCE: 0.5,      // 邂逅触发概率
        MEDAL_CHANCE: 0.5,          // 成就触发概率
        CONFETTI_EMOJI_CHANCE: 0.3  // 撒花特效中 emoji 出现概率
    },
    
    // ============ 时间延迟配置 ============
    timing: {
        TOAST_AUTO_HIDE_DELAY: 2000,
        CONFETTI_INTERVAL: 50,
        CONFETTI_DURATION: 3000,
        INVITATION_SMS_DELAY: 2000,
        SCENE_TRANSITION_DELAY: 1000
    },
    
    // ============ 进度配置 ============
    progress: {
        TOTAL_PRIMARY_LOCATIONS: 4,  // 一级地点总数
        PROGRESS_LABELS: {
            0: "刚刚开始",
            20: "探索中...",
            40: "渐入佳境",
            60: "半途而废？不存在的！",
            80: "接近尾声",
            100: "即将完成！"
        }
    }
};

// ========================================
// 🛠️ 配置工具函数
// ========================================

/**
 * 获取配置值（支持嵌套路径）
 * @param {string} path - 配置路径，如 'ai.API_KEY'
 * @param {*} defaultValue - 默认值（如果配置不存在）
 * @returns {*} 配置值或默认值
 */
function getConfig(path, defaultValue = null) {
    const keys = path.split('.');
    let value = GAME_CONFIG;
    
    for (const key of keys) {
        if (value && value.hasOwnProperty(key)) {
            value = value[key];
        } else {
            console.warn(`配置项不存在：${path}，使用默认值：`, defaultValue);
            return defaultValue;
        }
    }
    
    return value !== undefined ? value : defaultValue;
}

/**
 * 设置配置值
 * @param {string} path - 配置路径
 * @param {*} value - 新值
 */
function setConfig(path, value) {
    const keys = path.split('.');
    let obj = GAME_CONFIG;
    
    for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) {
            obj[keys[i]] = {};
        }
        obj = obj[keys[i]];
    }
    
    obj[keys[keys.length - 1]] = value;
    console.log(`配置已更新：${path} = ${value}`);
}

// 导出到全局
window.GAME_CONFIG = GAME_CONFIG;
window.getConfig = getConfig;
window.setConfig = setConfig;

console.log("🎮 游戏配置已加载 ✓");
console.log("💡 使用 getConfig('路径', 默认值) 来获取配置");
