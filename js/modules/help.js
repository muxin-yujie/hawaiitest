// ========== Help 功能模块 ==========

/**
 * 显示 AI 生成的回答建议
 * 基于当前场景、NPC 身份和最后一句 NPC 的话
 */
async function showHelpSuggestions() {
    const chatContainer = document.getElementById('chatContainer');
    
    // 检查是否有 NPC 对话
    if (!gameState.currentNpc) {
        showSystemMessage("现在没有可以对话的 NPC，不需要帮助哦~");
        return;
    }
    
    // 检查对话历史
    if (!gameState.conversationHistory || gameState.conversationHistory.length === 0) {
        showSystemMessage("还没有开始对话，先和 NPC 打个招呼吧！");
        return;
    }
    
    // 获取最后一句 NPC 的话
    const lastNpcMessage = gameState.conversationHistory
        .filter(msg => msg.role === 'assistant')
        .pop();
    
    if (!lastNpcMessage) {
        showSystemMessage("NPC 还没说话呢，先听听 NPC 说什么~");
        return;
    }
    
    // 显示加载提示
    const loadingEl = document.createElement('div');
    loadingEl.className = 'system-message';
    loadingEl.innerHTML = '<span style="color: #6a1b9a;">🤔 正在思考建议回答...</span>';
    chatContainer.appendChild(loadingEl);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    try {
        // 构建提示词
        const context = gameState.conversationHistory.slice(-4).map(msg => 
            `${msg.role === 'user' ? 'You' : gameState.currentNpc}: ${msg.content}`
        ).join('\n');
        
        const prompt = `【场景】夏威夷英语学习游戏
【当前地点】${gameState.currentSecondaryLocation || gameState.currentPrimaryLocation || '未知'}
【NPC 身份】${gameState.currentNpc}
【对话历史】
${context}

【任务】基于以上对话，为玩家提供 3 个不同的英语回答建议

【核心要求】
1. **必须优先回应 NPC 的最后一句话**，特别是最后一句 NPC 的话
2. **如果 NPC 最后一句是明确的问号（?）**：
   - 必须在建议中先直接回答这个具体问题
   - 然后再说其他话（如分享感受、反问、延伸话题等）
   - 不能回避或忽略这个问句
3. **3 个建议应该自然、丰富、有变化**：
   - 可以是一句话，也可以是两三句话
   - 可以是简单回答，也可以是多层次的回应
   - 可以是不同语气（热情/友好/好奇/分享）
   - 可以是不同角度（回答 + 感受/回答 + 反问/回答 + 延伸）
   - **不要用死板的格式，让回答像真实对话一样自然流畅**
4. **⚠️ 注意对话场合和 NPC 身份，不要 OOC（Out of Character）**：
   - 根据当前地点调整语气（机场/酒店/海滩/餐厅等不同场合）
   - 根据 NPC 身份调整用词（导游/店员/路人/新朋友等不同身份）
   - 保持符合玩家角色设定（20 岁中国女大学生，独自在夏威夷旅行）
   - 用词要符合情境的正式程度（正式场合 vs 休闲场合）
5. 用简单的英语（适合英语学习者），但要地道、口语化
6. 符合当前对话情境和 NPC 身份
7. 不要重复玩家已经说过的话

【输出格式】重要：只返回纯 JSON，不要用其他文字包裹！
{
    "suggestions": [
        {
            "text": "英语回答",
            "chinese": "中文翻译",
            "type": "回应类型"
        },
        {
            "text": "英语回答",
            "chinese": "中文翻译",
            "type": "回应类型"
        },
        {
            "text": "英语回答",
            "chinese": "中文翻译",
            "type": "回应类型"
        }
    ]
}`;

        const response = await callAI(
            prompt,
            "你是一个英语教学助手，善于根据对话情境提供自然、实用的回答建议。只返回纯 JSON，不要 markdown 格式。",
            600,
            0.7
        );
        
        // 移除加载提示
        loadingEl.remove();
        
        // 解析 AI 返回（清理 markdown 标记）
        let cleanResponse = response.trim();
        
        // 移除可能的 markdown 代码块标记
        if (cleanResponse.includes('```')) {
            // 移除所有 ``` 标记
            cleanResponse = cleanResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        }
        
        const data = JSON.parse(cleanResponse);
        
        if (!data.suggestions || data.suggestions.length === 0) {
            showSystemMessage("AI 没有生成有效的建议，再试一次吧~");
            return;
        }
        
        // 显示建议
        displaySuggestions(data.suggestions);
        
    } catch (error) {
        console.error("生成帮助建议失败:", error);
        loadingEl.remove();
        showSystemMessage("生成建议失败，请再试一次~");
    }
}

/**
 * 显示回答建议按钮（紧凑样式 - 参考 showOptions）
 */
function displaySuggestions(suggestions) {
    const chatContainer = document.getElementById('chatContainer');
    
    // 创建选项容器（类似 showOptions）
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'help-suggestions-container';
    suggestionsContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin: 20px 0;
        padding: 15px;
        background: rgba(255,255,255,0.5);
        border-radius: 15px;
        border: 2px solid #bde0fe;
        max-width: 95%;
        align-self: flex-start;
    `;
    
    // 标题
    const headerEl = document.createElement('div');
    headerEl.innerHTML = '<span style="font-weight: 600; color: #6a1b9a; margin-bottom: 0.3em; display: block; font-size: 1em;">💡 你可以这样回答：</span>';
    suggestionsContainer.appendChild(headerEl);
    
    // 创建每个建议按钮（使用 showOptions 风格）
    suggestions.forEach((suggestion, index) => {
        const suggestionBtn = document.createElement('div');
        suggestionBtn.className = 'help-suggestion-btn';
        
        // 使用渐变背景（紫色/粉色系，与 showOptions 一致）
        const gradients = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        ];
        
        const gradient = gradients[index % gradients.length];
        
        // 计算阴影颜色（与 showOptions 一致）
        let boxShadow;
        if (gradient.includes('#667eea')) {
            boxShadow = '0 3px 8px rgba(102, 126, 234, 0.3)';
        } else if (gradient.includes('#f093fb')) {
            boxShadow = '0 3px 8px rgba(240, 147, 251, 0.3)';
        } else {
            boxShadow = '0 3px 8px rgba(79, 172, 254, 0.3)';
        }
        
        // 悬停阴影
        let hoverBoxShadow;
        if (gradient.includes('#667eea')) {
            hoverBoxShadow = '0 5px 15px rgba(102, 126, 234, 0.4)';
        } else if (gradient.includes('#f093fb')) {
            hoverBoxShadow = '0 5px 15px rgba(240, 147, 251, 0.4)';
        } else {
            hoverBoxShadow = '0 5px 15px rgba(79, 172, 254, 0.4)';
        }
        
        suggestionBtn.style.cssText = `
            padding: 0.9em 1.5em;
            background: ${gradient};
            color: white;
            border-radius: 10px;
            text-align: left;
            font-weight: 600;
            box-shadow: ${boxShadow};
            cursor: default;
            font-size: 1em;
        `;
        
        suggestionBtn.innerHTML = `
            <div style="margin-bottom: 0.2em; font-size: 1em;">${['1️⃣', '2️⃣', '3️⃣'][index]} ${suggestion.text}</div>
            <div style="font-size: 0.92em; opacity: 0.9;">${suggestion.chinese}</div>
            <div style="font-size: 0.85em; opacity: 0.8; margin-top: 0.2em; font-style: italic;">${suggestion.type}</div>
        `;
        
        suggestionsContainer.appendChild(suggestionBtn);
    });
    
    // 底部提示
    const footerEl = document.createElement('div');
    footerEl.innerHTML = '<span style="font-size: 0.85em; color: #888; margin-top: 1em; display: block; text-align: center;">💬 参考以上建议，在输入框打字或点击 🎤 语音输入~</span>';
    suggestionsContainer.appendChild(footerEl);
    
    chatContainer.appendChild(suggestionsContainer);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // 播放提示音
    if (typeof playUISound === 'function') {
        playUISound('uiClick');
    }
}

/**
 * 使用建议（填充到输入框）
 */
function useSuggestion(text) {
    const inputEl = document.getElementById('userInput');
    if (inputEl) {
        inputEl.value = text;
        inputEl.focus();
        
        // 滚动到底部
        const chatContainer = document.getElementById('chatContainer');
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        // 隐藏建议框（可选）
        const suggestionsEl = document.querySelector('.help-suggestions');
        if (suggestionsEl) {
            suggestionsEl.style.opacity = '0.5';
            suggestionsEl.style.pointerEvents = 'none';
        }
    }
}

/**
 * 显示系统消息
 */
function showSystemMessage(message) {
    const chatContainer = document.getElementById('chatContainer');
    const msgEl = document.createElement('div');
    msgEl.className = 'system-message';
    msgEl.innerHTML = `<span style="color: #6a1b9a;">${message}</span>`;
    chatContainer.appendChild(msgEl);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

/**
 * HTML 转义
 */
function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

console.log("Help 模块已加载 ✓");
console.log("showHelpSuggestions 函数:", typeof showHelpSuggestions);
console.log("useSuggestion 函数:", typeof useSuggestion);

// 暴露到全局作用域
window.showHelpSuggestions = showHelpSuggestions;
window.useSuggestion = useSuggestion;

console.log("window.showHelpSuggestions:", typeof window.showHelpSuggestions);
console.log("window.useSuggestion:", typeof window.useSuggestion);
