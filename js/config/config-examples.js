// ========================================
// 📝 配置使用示例代码
// ========================================
// 这个文件展示了如何在代码中使用 GAME_CONFIG
// 可以直接复制粘贴到你的代码中

// ============ 示例 1：对话轮数检查 ============

// ❌ 旧代码（魔法数字）
function checkDialogueEnd_Old() {
    if (gameState.conversationCount >= 6) {
        endConversation();
    }
}

// ✅ 新代码（使用配置）
function checkDialogueEnd_New() {
    const maxTurns = getConfig('dialogue.ENCOUNTER_MAX_TURNS', 6);
    if (gameState.conversationCount >= maxTurns) {
        endConversation();
    }
}

// ============ 示例 2：概率判断 ============

// ❌ 旧代码
function triggerRandomEvent_Old() {
    const isEncounter = Math.random() < 0.5;
    if (isEncounter) {
        triggerEncounter();
    } else {
        triggerMedal();
    }
}

// ✅ 新代码
function triggerRandomEvent_New() {
    const encounterChance = getConfig('probability.ENCOUNTER_CHANCE', 0.5);
    const isEncounter = Math.random() < encounterChance;
    if (isEncounter) {
        triggerEncounter();
    } else {
        triggerMedal();
    }
}

// ============ 示例 3：延迟执行 ============

// ❌ 旧代码
function showToast_Old() {
    setTimeout(() => {
        toast.classList.add('hide');
    }, 2000);
}

// ✅ 新代码
function showToast_New() {
    const hideDelay = getConfig('timing.TOAST_AUTO_HIDE_DELAY', 2000);
    setTimeout(() => {
        toast.classList.add('hide');
    }, hideDelay);
}

// ============ 示例 4：文化提示生成 ============

// ❌ 旧代码
function maybeGenerateCultureTip_Old() {
    if (Math.random() < 0.9) {
        generateCultureTip();
    }
}

// ✅ 新代码
function maybeGenerateCultureTip_New() {
    const probability = getConfig('dialogue.CULTURE_TIP_PROBABILITY', 0.9);
    if (Math.random() < probability) {
        generateCultureTip();
    }
}

// ============ 示例 5：AI 调用参数 ============

// ❌ 旧代码
async function callAI_Old() {
    const response = await fetch(API_URL, {
        body: JSON.stringify({
            max_tokens: 800,
            temperature: 0.8
        })
    });
}

// ✅ 新代码
async function callAI_New() {
    const maxTokens = getConfig('ai.DIALOGUE_MAX_TOKENS', 800);
    const temperature = getConfig('ai.DIALOGUE_TEMPERATURE', 0.8);
    
    const response = await fetch(getConfig('ai.API_URL'), {
        body: JSON.stringify({
            max_tokens: maxTokens,
            temperature: temperature
        })
    });
}

// ============ 示例 6：复杂的对话结束检测 ============

// ✅ 完整示例：使用配置的对话结束检测
function shouldEndConversation_Example(npcResponse, userInput) {
    // 根据场景类型获取配置
    const phase = gameState.storyPhase;
    let configPath = 'dialogue.ENCOUNTER_';
    
    switch(phase) {
        case 'customs':
            configPath = 'dialogue.CUSTOMS_';
            break;
        case 'encounter':
            configPath = 'dialogue.ENCOUNTER_';
            break;
        case 'medal':
            configPath = 'dialogue.MEDAL_';
            break;
        case 'guide':
            configPath = 'dialogue.GUIDE_';
            break;
        case 'hotelCheckIn':
            configPath = 'dialogue.HOTEL_';
            break;
        case 'secondaryLocation':
            configPath = 'dialogue.LOCATION_';
            break;
    }
    
    // 获取最小和最大轮数
    const minTurns = getConfig(configPath + 'MIN_TURNS', 0);
    const maxTurns = getConfig(configPath + 'MAX_TURNS', 6);
    const requireFarewell = getConfig('dialogue.REQUIRE_FAREWELL.' + phase.toUpperCase(), false);
    
    // 检查对话轮数
    if (gameState.conversationCount >= maxTurns) {
        return true; // 达到最大轮数，结束
    }
    
    if (gameState.conversationCount < minTurns) {
        return false; // 未达到最小轮数，继续
    }
    
    // 检查告别词
    const hasFarewell = checkFarewell(npcResponse, userInput);
    if (requireFarewell && hasFarewell) {
        return true;
    }
    
    // 检查是否陈述句结尾
    if (!requireFarewell && isStatementEnding(npcResponse)) {
        return true;
    }
    
    return false;
}

// ============ 示例 7：撒花特效 ============

// ❌ 旧代码
function showConfetti_Old() {
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            if (Math.random() < 0.3) {
                confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            }
        }, i * 50);
    }
}

// ✅ 新代码
function showConfetti_New() {
    const confettiCount = 50;
    const emojiChance = getConfig('probability.CONFETTI_EMOJI_CHANCE', 0.3);
    const interval = getConfig('timing.CONFETTI_INTERVAL', 50);
    const duration = getConfig('timing.CONFETTI_DURATION', 3000);
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            if (Math.random() < emojiChance) {
                confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            }
            // ... 其他代码
        }, i * interval);
    }
}

// ============ 示例 8：邀约系统延迟 ============

// ❌ 旧代码
async function endEncounter_Old() {
    setTimeout(async () => {
        await triggerEncounterInvitationSMS();
    }, 2000);
}

// ✅ 新代码
async function endEncounter_New() {
    const invitationDelay = getConfig('timing.INVITATION_SMS_DELAY', 2000);
    setTimeout(async () => {
        await triggerEncounterInvitationSMS();
    }, invitationDelay);
}

// ============ 示例 9：进度条计算 ============

// ❌ 旧代码
function updateProgressBar_Old() {
    const totalLocations = 5;
    const progress = (gameState.currentPrimaryIndex / totalLocations) * 100;
    progressBar.style.width = progress + '%';
}

// ✅ 新代码
function updateProgressBar_New() {
    const totalLocations = getConfig('progress.TOTAL_PRIMARY_LOCATIONS', 5);
    const progress = (gameState.currentPrimaryIndex / totalLocations) * 100;
    progressBar.style.width = progress + '%';
    
    // 获取进度文字
    const progressLabel = getProgressLabel(progress);
    progressText.textContent = progressLabel;
}

function getProgressLabel(percentage) {
    const labels = getConfig('progress.PROGRESS_LABELS', {
        0: "刚刚开始",
        20: "探索中...",
        40: "渐入佳境",
        60: "半途而废？不存在的！",
        80: "接近尾声",
        100: "即将完成！"
    });
    
    // 找到最接近的标签
    let closest = 0;
    for (const key in labels) {
        if (percentage >= key) {
            closest = key;
        }
    }
    return labels[closest];
}

// ============ 示例 10：动态难度调整 ============

// 创建难度预设
const DIFFICULTY_PRESETS = {
    easy: {
        'dialogue.CUSTOMS_MAX_TURNS': 3,
        'dialogue.ENCOUNTER_MAX_TURNS': 4,
        'dialogue.GUIDE_MAX_TURNS': 2,
        'probability.ENCOUNTER_CHANCE': 0.7,
        'dialogue.CULTURE_TIP_PROBABILITY': 0.5
    },
    normal: {
        'dialogue.CUSTOMS_MAX_TURNS': 6,
        'dialogue.ENCOUNTER_MAX_TURNS': 6,
        'dialogue.GUIDE_MAX_TURNS': 3,
        'probability.ENCOUNTER_CHANCE': 0.5,
        'dialogue.CULTURE_TIP_PROBABILITY': 0.9
    },
    hard: {
        'dialogue.CUSTOMS_MAX_TURNS': 10,
        'dialogue.ENCOUNTER_MAX_TURNS': 10,
        'dialogue.GUIDE_MAX_TURNS': 6,
        'probability.ENCOUNTER_CHANCE': 0.3,
        'dialogue.CULTURE_TIP_PROBABILITY': 1.0
    }
};

// 设置难度
function setDifficulty(level) {
    const preset = DIFFICULTY_PRESETS[level];
    if (!preset) {
        console.error('未知难度等级:', level);
        return;
    }
    
    for (const [path, value] of Object.entries(preset)) {
        setConfig(path, value);
    }
    
    console.log(`难度已设置为：${level}`);
    saveDifficulty(level);
}

// 保存难度到 localStorage
function saveDifficulty(level) {
    localStorage.setItem('hawaii_game_difficulty', level);
}

// 加载难度
function loadDifficulty() {
    const saved = localStorage.getItem('hawaii_game_difficulty');
    if (saved) {
        setDifficulty(saved);
    } else {
        setDifficulty('normal'); // 默认普通难度
    }
}

// ============ 使用建议 ============

/*

1. ✅ 推荐做法：
   - 使用 getConfig() 工具函数
   - 提供默认值作为第二个参数
   - 将配置值赋给有意义的变量名

2. ❌ 不推荐做法：
   - 直接使用 GAME_CONFIG 深层嵌套访问
   - 不提供默认值
   - 在条件判断中直接写配置路径

3. 💡 最佳实践：
   // ✅ 好
   const maxTurns = getConfig('dialogue.ENCOUNTER_MAX_TURNS', 6);
   if (count >= maxTurns) { }
   
   // ❌ 不好
   if (count >= GAME_CONFIG.dialogue.ENCOUNTER_MAX_TURNS) { }
   
   // ❌ 更不好
   if (count >= getConfig('dialogue.ENCOUNTER_MAX_TURNS')) { }

*/

console.log("配置使用示例已加载 ✓");
console.log("💡 参考这些示例来重构你的代码！");
