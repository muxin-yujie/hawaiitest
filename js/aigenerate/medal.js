// ========== Medal 事件生成模块 ==========

/**
 * 显示 Medal 事件场景和 NPC 对话（公共函数）
 * @param {Object} result - 事件数据
 * @param {string} sceneTitle - 场景标题（如"机场小插曲"、"冲浪店小插曲"）
 * @param {string} defaultSceneText - 默认场景描述（如果 result.scene 为空）
 * @param {string} defaultOccupation - 默认职业
 * @param {string} defaultAge - 默认年龄
 * @param {string} defaultNationality - 默认国籍
 */
async function showMedalEvent(result, sceneTitle, defaultSceneText, defaultOccupation = "Local", defaultAge = 30, defaultNationality = "Hawaiian") {
    // 使用统一的 getChatContainer 函数获取当前激活的聊天窗口
    const chatContainer = window.getChatContainer ? window.getChatContainer() : document.querySelector('.chat-window.active');
    
    if (!chatContainer) {
        console.error('❌ 聊天容器未找到！');
        return;
    }
    
    console.log("Medal 事件:", result);
    
    // 显示场景描述
    const sceneMessage = document.createElement('div');
    sceneMessage.className = 'system-message';
    sceneMessage.innerHTML = `
        <span style="font-weight: bold; color: #6a1b9a;">
            ${sceneTitle}<br><br>
            ${result.scene || defaultSceneText}
        </span>
    `;
    chatContainer.appendChild(sceneMessage);
    
    // 显示 NPC 对话
    const npcName = result.npc.name;
    const npcEmoji = result.npc.emoji || "👤";
    
    console.log(`NPC: ${npcName}, Emoji: ${npcEmoji}`);
    
    window.gameState.currentNpc = npcName;
    window.gameState.conversationHistory = [];
    window.gameState.storyPhase = "medal";
    window.gameState.conversationCount = 0;
    
    const npcMessage = document.createElement('div');
    npcMessage.className = 'message npc-message';
    
    // 清理中文动作词（防御性处理）
    const firstLine = window.cleanNpcDialogue ? window.cleanNpcDialogue(result.npc.firstLine) : result.npc.firstLine;
    const translation = await window.translateToChinese(firstLine);
    
    const occupation = result.npc.occupation || defaultOccupation;
    const age = result.npc.age || defaultAge;
    const nationality = result.npc.nationality || defaultNationality;
    const personality = result.npc.personality || "";
    npcMessage.innerHTML = `
        <div class="message-sender">${npcEmoji} ${npcName} | ${age}岁 | ${nationality} | ${occupation}</div>
        <div style="margin: 8px 0; color: #555; line-height: 1.6;">${personality}</div>
        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #ddd;">${firstLine}</div>
        <div class="translation">${translation}</div>
    `;
    chatContainer.appendChild(npcMessage);
    
    window.gameState.conversationHistory.push({ role: "assistant", content: firstLine });
    
    // 直接使用事件数据中的 NPC 信息，保存到 encounters
    const npcCharacter = {
        name: result.npc.name,
        chineseName: result.npc.name,
        nationality: result.npc.nationality,
        age: result.npc.age,
        occupation: result.npc.occupation,
        emoji: npcEmoji,
        personality: result.npc.personality,
        scene: result.location || "檀香山国际机场到达大厅",
        description: result.scene
    };
    
    saveFixedNpcToEncounters(npcCharacter);
    
    console.log("Medal 事件已触发，当前 NPC:", window.gameState.currentNpc);
    
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    console.log("成就事件已触发，现在可以和 NPC 对话了！");
}

/**
 * 触发机场 Medal 事件
 */
async function triggerAirportMedalEvent() {
    try {
        if (!window.AIRPORT_MEDAL_EVENTS || window.AIRPORT_MEDAL_EVENTS.length === 0) {
            console.error("机场勋章事件库为空");
            return;
        }
        
        const result = window.getRandomAirportMedalEvent();
        await showMedalEvent(
            result,
            "🎉 机场小插曲 🎉",
            "在机场，你遇到了一个有趣的人...",
            "Traveler",
            30,
            "Various"
        );
        
    } catch (error) {
        console.error("机场成就事件失败:", error);
    }
}

/**
 * 触发威基基海滩 Medal 事件（从固定库抽取）
 * @param {string} locationName - 地点名称（冲浪店、彩虹刨冰店等），不传则随机抽取
 */
async function triggerWaikikiMedalEvent(locationName) {
    try {
        if (!window.WAIKIKI_MEDAL_EVENTS || window.WAIKIKI_MEDAL_EVENTS.length === 0) {
            console.error("威基基勋章事件库为空");
            return;
        }
        
        let result;
        
        // 如果指定了地点，过滤出该地点的事件
        if (locationName) {
            const locationEvents = window.WAIKIKI_MEDAL_EVENTS.filter(e => e.location === locationName);
            
            if (locationEvents.length === 0) {
                console.error(`地点 ${locationName} 没有勋章事件`);
                return;
            }
            
            // 随机抽取一个事件
            const randomIndex = Math.floor(Math.random() * locationEvents.length);
            result = locationEvents[randomIndex];
        } else {
            // 没有指定地点，从所有事件中随机抽取
            const randomIndex = Math.floor(Math.random() * window.WAIKIKI_MEDAL_EVENTS.length);
            result = window.WAIKIKI_MEDAL_EVENTS[randomIndex];
        }
        
        const sceneTitle = `${result.locationEmoji || '🏝️'} ${result.location} 小插曲 ${result.locationEmoji || '🏝️'}`;
        const defaultSceneText = `在${result.location}，发生了一个有趣的故事...`;
        
        await showMedalEvent(result, sceneTitle, defaultSceneText);
        
    } catch (error) {
        console.error("威基基成就事件失败:", error);
    }
}

// 暴露到全局
window.triggerAirportMedalEvent = triggerAirportMedalEvent;
window.triggerWaikikiMedalEvent = triggerWaikikiMedalEvent;

console.log("Medal 事件模块已加载 ✓");
