// ========== 工具函数 ==========

/**
 * 获取聊天容器（智能路由 - 根据当前章节自动选择窗口）
 * @returns {HTMLElement} 当前章节对应的 chatContainer 元素
 */
function getChatContainer() {
    // 根据游戏状态中的章节索引，而不是当前激活的窗口
    // 这样玩家随便点哪个窗口都不影响，剧情总是发送到正确的窗口
    const currentChapter = window.currentChapter || window.ChapterManager?.getCurrentChapter() || 0;
    
    const windowMap = ['Intro', 'Day1'];
    const windowId = `chatContainer${windowMap[currentChapter] || 'Intro'}`;
    
    const container = document.getElementById(windowId);
    
    if (!container) {
        console.error(`❌ 聊天窗口未找到：${windowId}`);
        // 如果找不到，返回默认的 Intro 窗口
        return document.getElementById('chatContainerIntro');
    }
    
    return container;
}

/**
 * 检查文本是否是问句
 */
function isQuestion(text) {
    // 包含问号（英文或中文）
    return text.includes('?') || text.includes('?');
}

/**
 * 检查文本是否是陈述句结尾（可以结束对话）
 * 规则：
 * - 如果包含问号（?或？），说明是问句，不能结束对话
 * - 如果以句号（.或。）或感叹号（!或！）结尾，可以结束对话
 */
function isStatementEnding(text) {
    const trimmedText = text.trim();
    
    // 如果包含问号，说明是问句，不能结束对话
    if (text.includes('?') || text.includes('?')) {
        return false;
    }
    
    // 检查是否以句号或感叹号结尾
    const statementEndings = ['.', '!', '.', '!'];
    return statementEndings.some(ending => trimmedText.endsWith(ending));
}

/**
 * 全局对话结束检测（应用于所有 NPC 对话场景）
 * @param {string} npcResponse - NPC 的回复
 * @param {string} userInput - 用户的输入
 * @param {object} options - 可选配置
 * @param {number} options.minTurns - 最小对话轮数（默认 0）
 * @param {number} options.maxTurns - 最大对话轮数（默认 6，防止无限对话）
 * @param {number} options.currentTurns - 当前对话轮数
 * @param {boolean} options.requireFarewell - 是否需要告别词（默认 false）
 * @returns {object} { shouldEnd: boolean, reason: string }
 */
function shouldEndConversation(npcResponse, userInput, options = {}) {
    const {
        minTurns = 0,
        maxTurns = 6,
        currentTurns = 0,
        requireFarewell = false
    } = options;
    
    const reasons = [];
    let shouldEnd = false;
    
    console.log(`[对话检测] 当前轮数：${currentTurns}/${maxTurns}, requireFarewell: ${requireFarewell}`);
    
    // 规则 0：问号结尾优先（最高优先级）
    const trimmedResponse = npcResponse.trim();
    if (trimmedResponse.endsWith('?') || trimmedResponse.endsWith('?')) {
        console.log(`[对话检测] ❌ NPC 问句结尾，继续对话`);
        return {
            shouldEnd: false,
            reason: 'NPC 在提问，等待玩家回答'
        };
    }
    
    // 规则 1：检查是否超过最大轮数（强制结束）
    if (currentTurns >= maxTurns) {
        shouldEnd = true;
        reasons.push('对话轮数已达上限');
        console.log(`[对话检测] ✅ 规则 1 触发：达到最大轮数 ${currentTurns} >= ${maxTurns}`);
    }
    
    // 规则 2：检查是否达到最小轮数
    if (currentTurns < minTurns) {
        console.log(`[对话检测] ❌ 规则 2：轮数不足 ${currentTurns} < ${minTurns}`);
        return { shouldEnd: false, reason: '对话轮数不足' };
    }
    
    // 规则 3：检测告别词
    const farewellKeywords = [
        'bye', 'byebye', 'goodbye', 'see you', 'later', 'take care',
        'nice meeting you', 'great meeting you', 'lovely meeting you',
        'have to go', 'must go', 'should go', 'need to go',
        'got to go', 'gotta go', 'heading off',
        'safe travels', 'enjoy your trip', 'enjoy hawaii',
        'wonderful meeting you', 'great chatting', 'nice chatting',
        'catch you later', 'talk to you later', 'until next time',
        'farewell', 'so long', 'take it easy',
        '拜拜', '再见', '先走了', '下次见', '回见', '走了', '拜'
    ];
    
    const hasPlayerFarewell = farewellKeywords.some(keyword => 
        userInput.toLowerCase().includes(keyword)
    );
    
    const hasNpcFarewell = farewellKeywords.some(keyword => 
        npcResponse.toLowerCase().includes(keyword)
    );
    
    if (hasPlayerFarewell || hasNpcFarewell) {
        shouldEnd = true;
        reasons.push('检测到告别词');
        console.log(`[对话检测] ✅ 规则 3 触发：告别词 (玩家：${hasPlayerFarewell}, NPC: ${hasNpcFarewell})`);
    }
    
    // 规则 4：检测 NPC 是否说完（陈述句结尾）
    const isNpcFinished = isStatementEnding(npcResponse);
    
    console.log(`[对话检测] NPC 回复结尾检测：isNpcFinished=${isNpcFinished}, 最后字符="${npcResponse.trim().slice(-1)}"`);
    
    if (isNpcFinished) {
        if (requireFarewell) {
            // 需要告别词 + 陈述句结尾
            if (hasPlayerFarewell || hasNpcFarewell) {
                shouldEnd = true;
                reasons.push('NPC 说完且有人告别');
                console.log(`[对话检测] ✅ 规则 4 触发：NPC 说完 + 告别词`);
            } else {
                console.log(`[对话检测] ❌ 规则 4：NPC 说完但无告别词 (requireFarewell=true)`);
            }
        } else {
            // 只需要陈述句结尾
            shouldEnd = true;
            reasons.push('NPC 以陈述句结束');
            console.log(`[对话检测] ✅ 规则 4 触发：NPC 以陈述句结束`);
        }
    }
    
    // 规则 5：检测 NPC 是否主动结束对话
    const naturalEndingPatterns = [
        'i should let you go', 'i won\'t keep you', 'i\'ll let you explore',
        'you must be tired', 'you probably want to rest',
        'i have to run', 'i need to head off', 'my flight is',
        'it was great talking to you', 'i enjoyed our conversation',
        'thanks for chatting', 'this was lovely',
        'enjoy your stay', 'have a wonderful trip', 'hope you enjoy hawaii'
    ];
    
    const hasNaturalEnding = naturalEndingPatterns.some(pattern => 
        npcResponse.toLowerCase().includes(pattern)
    );
    
    if (hasNaturalEnding && currentTurns >= 2) {
        shouldEnd = true;
        reasons.push('NPC 主动结束对话');
    }
    
    return {
        shouldEnd,
        reason: reasons.join(', ') || '继续对话',
        details: {
            isNpcFinished,
            hasPlayerFarewell,
            hasNpcFarewell,
            hasNaturalEnding,
            currentTurns,
            maxTurns
        }
    };
}

// 暴露到全局
if (typeof window !== 'undefined') {
    window.getChatContainer = getChatContainer;
    window.isQuestion = isQuestion;
    window.isStatementEnding = isStatementEnding;
    window.shouldEndConversation = shouldEndConversation;
    console.log('✓ utils.js 函数已导出到全局');
}

/**
 * 添加一级地点
 */
function addPrimaryLocation(name, emoji, description) {
    // 检查 gameState 是否存在
    if (typeof gameState === 'undefined') {
        console.warn('gameState 未定义，无法添加地点');
        return;
    }
    
    if (!gameState.locations.some(loc => loc.name === name)) {
        gameState.locations.push({
            type: "primary",
            name: name,
            emoji: emoji,
            description: description,
            visited: true
        });
    }
}

/**
 * 添加二级地点
 */
function addSecondaryLocation(primaryName, name, emoji, description) {
    // 检查 gameState 是否存在
    if (typeof gameState === 'undefined') {
        console.warn('gameState 未定义，无法添加地点');
        return;
    }
    
    const locationKey = `${primaryName}-${name}`;
    if (!gameState.locations.some(loc => loc.key === locationKey)) {
        gameState.locations.push({
            type: "secondary",
            key: locationKey,
            name: name,
            emoji: emoji,
            description: description,
            primaryLocation: primaryName,
            visited: true
        });
    }
}

/**
 * 添加三级地点
 */
function addTertiaryLocation(secondaryName, name, emoji, description) {
    // 检查 gameState 是否存在
    if (typeof gameState === 'undefined') {
        console.warn('gameState 未定义，无法添加地点');
        return;
    }
    
    const locationKey = `${secondaryName}-${name}`;
    if (!gameState.locations.some(loc => loc.key === locationKey)) {
        gameState.locations.push({
            type: "tertiary",
            key: locationKey,
            name: name,
            emoji: emoji,
            description: description,
            secondaryLocation: secondaryName,
            visited: true
        });
    }
}

console.log("工具函数已加载 ✓");
