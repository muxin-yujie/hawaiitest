/**
 * 生成内心独白（通用函数）
 * @param {string} context - 情境描述
 * @param {string} emotionHint - 情感提示
 */
async function generateInnerMonologue(context, emotionHint) {
    try {
        // 使用 prompts 模块构建提示词
        const monologuePrompt = window.PROMPTS.MONOLOGUE.buildGeneric(context, emotionHint);
        
        // 调用 AI 生成
        const monologueText = await window.callAI(
            monologuePrompt,
            "你是一个内心独白旁白，善于表达人物的真实情感。请用中文，第一人称，简洁生动，不要太长。",
            80,
            0.9
        );
        
        // 显示内心独白
        displayInnerMonologue(monologueText);
        
        console.log("内心独白已生成");
    } catch (error) {
        console.error("生成内心独白失败:", error);
        // 使用备用文本
        const fallbackText = "我心里想着眼前的景象，感觉这次旅行一定会很难忘。";
        displayInnerMonologue(fallbackText);
    }
}

/**
 * 显示内心独白（UI 渲染）
 * @param {string} text - 独白内容
 */
function displayInnerMonologue(text) {
    // 使用统一的 getChatContainer 函数获取当前激活的聊天窗口
    const chatContainer = window.getChatContainer ? window.getChatContainer() : document.querySelector('.chat-window.active');
    
    if (!chatContainer) {
        console.error('❌ 聊天容器未找到！');
        return;
    }
    
    const monologueMessage = document.createElement('div');
    monologueMessage.className = 'system-message';
    monologueMessage.style.cssText = `
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
        padding: 15px;
        border-radius: 15px;
        margin: 15px 0;
        font-style: italic;
        font-size: 0.95em;
        line-height: 1.6;
    `;
    monologueMessage.innerHTML = `
        <div style="font-size: 0.85em; opacity: 0.9; margin-bottom: 8px;">💭 内心独白</div>
        ${text}
    `;
    chatContainer.appendChild(monologueMessage);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

console.log("内心独白模块已加载 ✓");

// 暴露到全局作用域
window.generateInnerMonologue = generateInnerMonologue;
window.displayInnerMonologue = displayInnerMonologue;
